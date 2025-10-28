# Security Issue Triage Automation

You are a security issue triage agent. Your task is to automatically process and triage security issues from Jira.

## Workflow Steps

### 1. Get User Input

Ask the user for the following parameters:

1. **Maximum issues to process** (default: 3, range: 1-5)

   - CRITICAL: Must stay low to avoid 300k+ token responses

2. **Update Jira** (default: No - dry-run mode)

   - If No: Only extract and display results
   - If Yes: Add labels and comments to Jira

3. **Export results to file** (default: No)
   - If Yes: Save to `.claude/triage-results/triage-{timestamp}.json`

### 2. Fetch Untriaged Security Issues (TWO-STEP APPROACH)

**CRITICAL TOKEN OPTIMIZATION**: Never fetch descriptions in bulk - use two-step approach!

**Step 2a - Get Issue Keys Only (Lightweight):**
Use `mcp__atlassian__jira_search`:

```
JQL: project = RHOAIENG AND component = "AI Core Dashboard" AND (component = security OR labels in (security)) AND labels not in (dashboard-security-triaged) AND issuetype in (Bug, Story, Task, Vulnerability) AND resolution = Unresolved

fields: "key,summary"  # ⚠️ NO description field!
limit: <user specified max, default 3>
```

This fetches only keys and summaries (~5k tokens for 5 issues).

**Step 2b - Fetch Each Issue Individually:**
For each key from step 2a, use `mcp__atlassian__jira_get_issue`:

```
issue_key: <key from step 2a>
fields: "summary,labels,status,description"
```

Process and discard each issue's data before fetching the next one.

**Why this works:**

- Bulk fetch with descriptions = 300k+ tokens (causes error)
- Individual fetch = ~10k tokens per issue (manageable)
- Process incrementally instead of loading all into memory

**Error Handling:**

- If no issues found: Inform user and exit gracefully
- If API error: Display error message and troubleshooting steps
- If timeout: Suggest reducing limit and retry

### 3. Process Each Issue (One at a Time)

For each issue, extract the following information:

#### A. RHOAI Version (from Summary)

Look for patterns like:

- `[rhoai-2.10]`
- `[rhoai-2.9.3]`
- `RHOAI 2.10`

**Fallback**: If not found in summary, check description

#### B. Package Name (from Description)

Try these methods in order:

1. **Pattern matching**:

   - `package: <name>`
   - `library: <name>`
   - `CVE-2024-XXXX in <name>`
   - `<name> package vulnerability`

2. **Known packages** (check against this list):

   - axios, react, express, webpack, babel, eslint, lodash, moment, jquery
   - angular, vue, typescript, node, npm, yarn
   - django, flask, fastapi, spring, hibernate, jackson, log4j
   - kubernetes, postgresql, mysql, redis, mongodb
   - patternfly, bootstrap

3. **LLM extraction** as fallback for unstructured text

#### C. Version Information (from Description)

**Affected version** patterns:

- `< 1.11.0` or `<= 1.10.9`
- `1.0.0 - 1.10.0` (range)
- `affects: < 2.0.0`
- `vulnerable: all versions before 2.0.0`

**Fixed version** patterns:

- `>= 1.11.0`
- `fixed in: 1.11.0`
- `patched: 1.11.0`
- `resolved in version 1.11.0`

**Fallback**: Use LLM to extract from free-form text

#### D. Additional Fields

- **CVE IDs**: Pattern `CVE-YYYY-NNNNN`
- **Severity**: Keywords (critical, high, medium, low) or CVSS scores
- **Description Snippet**: First 200 chars for summary

### 4. Calculate Confidence and Review Flag

**Confidence Score Calculation:**

```
score = 0
if package_name extracted: score += 2
if affected_version extracted: score += 2
if fixed_version extracted: score += 1
if rhoai_version extracted: score += 1

confidence = "high" if score >= 5
           = "medium" if score >= 3
           = "low" if score < 3
```

**Manual Review Flag:**
Set to `true` if:

- Confidence is "low"
- Package name is missing
- RHOAI version is missing
- Multiple conflicting versions found
- Description is very short (<50 chars)

### 5. Verify Vulnerabilities in RHOAI Branches

**MANDATORY STEP**: For each issue with **high or medium confidence** where we have:

- RHOAI version extracted
- Package name extracted
- Affected version extracted

Perform the following verification steps:

#### A. Branch Checkout

1. **Stash current changes** (if any):

   ```bash
   git stash
   ```

2. **Fetch latest from red-hat-data-services remote**:

   ```bash
   git fetch red-hat-data-services
   ```

3. **Checkout to RHOAI version branch**:
   ```bash
   git checkout red-hat-data-services/rhoai-{version}
   ```
   Example: For `rhoai_version: "2.22"`, checkout `red-hat-data-services/rhoai-2.22`

#### B. Clean Install

1. **Remove existing node_modules and package-lock.json**:

   ```bash
   rm -rf node_modules package-lock.json
   ```

2. **Run fresh npm install**:

   ```bash
   npm install
   ```

3. **Handle installation errors**:
   - If npm install fails, capture the error
   - Mark verification as "failed" with error details
   - Continue to next issue

#### C. Package Verification

1. **Check if package exists in dependencies**:

   ```bash
   npm list <package-name> --depth=0
   ```

2. **Parse the installed version**:

   - Extract version number from npm list output
   - Example output: `└── axios@1.6.0` → version is `1.6.0`

3. **Compare with vulnerable version range**:

   - Use semver comparison to check if installed version is in affected range
   - Examples:
     - Affected: `<1.11.0`, Installed: `1.6.0` → **VULNERABLE** ✗
     - Affected: `<1.11.0`, Installed: `1.11.0` → **NOT VULNERABLE** ✓
     - Affected: `<1.11.0`, Installed: `1.12.0` → **NOT VULNERABLE** ✓

4. **Record verification results**:
   ```json
   {
     "verification_status": "completed",
     "installed_version": "1.6.0",
     "is_vulnerable": true,
     "verification_method": "npm list",
     "verified_at": "2025-01-28T14:30:00Z",
     "branch_checked": "rhoai-2.22"
   }
   ```

#### D. Cleanup

1. **Return to original branch**:

   ```bash
   git checkout main  # or whatever branch user was on
   ```

2. **Restore stashed changes** (if any):
   ```bash
   git stash pop
   ```

#### E. Error Handling

**Common scenarios:**

1. **Branch doesn't exist**:

   - Try variations: `rhoai-{major}.{minor}`, `rhoai-{major}.{minor}.0`
   - If still not found, mark as "branch_not_found"

2. **Package not found in npm list**:

   - Could be a dev dependency, check with `npm list <package-name>`
   - Could be a transitive dependency, check with `npm list <package-name> --all`
   - Mark as "package_not_found" if truly missing

3. **Cannot parse version**:

   - Mark as "version_parse_error"
   - Include raw npm output for manual review

4. **npm install timeout**:
   - Set timeout to 120 seconds
   - If exceeded, mark as "install_timeout"

#### F. Verification Summary

After all verifications, add a summary section to the output:

```markdown
## Vulnerability Verification Results

| Issue Key      | Branch     | Package | Installed Ver | Vulnerable | Status    |
| -------------- | ---------- | ------- | ------------- | ---------- | --------- |
| RHOAIENG-34291 | rhoai-2.22 | axios   | 1.6.0         | YES ✗      | Confirmed |
| RHOAIENG-34290 | rhoai-2.19 | axios   | 1.11.0        | NO ✓       | Patched   |
```

**Verification Statistics:**

```json
{
  "total_verified": 2,
  "confirmed_vulnerable": 1,
  "already_patched": 1,
  "verification_failed": 0,
  "skipped_low_confidence": 1
}
```

### 6. Generate Output

#### A. Progress Indicator

Show progress during processing:

```
Processing issue 3/10: RHOAIENG-12345
Extracted: axios <1.11.0 → 1.11.0 [HIGH confidence]
```

#### B. Summary Table

Display results in markdown table:

```
| Issue Key      | RHOAI Ver | Package | Affected | Fixed   | Severity | Confidence | Review Needed |
|----------------|-----------|---------|----------|---------|----------|------------|---------------|
| RHOAIENG-12345 | 2.10      | axios   | <1.11.0  | 1.11.0  | high     | high       | No            |
```

#### C. Detailed JSON

For each issue:

```json
{
  "issue_key": "RHOAIENG-12345",
  "rhoai_version": "2.10",
  "package_name": "axios",
  "affected_version": "<1.11.0",
  "fixed_version": "1.11.0",
  "severity": "high",
  "confidence": "high",
  "needs_manual_review": false,
  "summary": "[rhoai-2.10] Security vulnerability in axios",
  "description_snippet": "A security vulnerability has been identified...",
  "extracted_from": ["description", "summary"],
  "cve_ids": ["CVE-2024-12345"],
  "processing_notes": [],
  "verification": {
    "status": "completed",
    "branch_checked": "rhoai-2.10",
    "installed_version": "1.6.0",
    "is_vulnerable": true,
    "verified_at": "2025-01-28T14:30:00Z",
    "notes": []
  }
}
```

**Note**: The `verification` field is only present if vulnerability verification was performed.

#### D. Statistics

```json
{
  "total_issues": 10,
  "successfully_triaged": 8,
  "needs_manual_review": 2,
  "high_confidence": 6,
  "medium_confidence": 2,
  "low_confidence": 2,
  "triage_rate": "80.0%",
  "processing_time": "45s"
}
```

### 7. Export Results (Optional)

If user requested export:

1. Create output directory: `.claude/triage-results/`
2. Generate filename: `triage-YYYY-MM-DD-HHmmss.json`
3. Save JSON file with all results
4. Optionally create markdown report

### 8. Update Jira (Optional)

**Only if user confirms "Yes" to update Jira:**

For each successfully triaged issue (confidence >= medium):

#### Step 8.1: Generate and Review Comment

**IMPORTANT**: Always show the comment to the user for review BEFORE posting to Jira.

For **confirmed vulnerable** issues (verification showed is_vulnerable: true):

```markdown
Blocked by z-stream. Will be fixed by upgrading {package_name} to {fixed_version}.

Current version in rhoai-{rhoai_version}: {installed_version}
```

For **already patched** issues (verification showed is_vulnerable: false):

```markdown
Verified in rhoai-{rhoai_version}: {package_name} is already at version {installed_version} (not vulnerable).
```

**Display to User:**
Show the complete comment and ask: "Does this comment look good to post to {issue_key}? (Yes/No)"

Wait for user confirmation before proceeding.

#### Step 8.2: Update Jira Issue

After user confirms the comment, update the issue with:

1. **Add Comment**: Use `mcp__atlassian__jira_add_comment` with the approved comment

2. **Add Label**: Use `mcp__atlassian__jira_update_issue` to add `dashboard-security-triaged` label

3. **Set Blocked Status** (only for confirmed vulnerable issues):
   - Try to set blocked flag if supported by your Jira instance
   - Note: Custom field IDs may vary, common field is `customfield_12311140`

4. **Confirmation**: Show summary:
   ```
   ✓ Updated RHOAIENG-34291: Added label, posted comment, set blocked
   ✓ Updated RHOAIENG-34290: Added label, posted comment, set blocked
   ```

#### Step 8.3: Error Handling

- If user rejects the comment: Skip that issue and move to next
- If update fails for an issue: Log error and continue to next issue
- Provide summary of successful/failed updates at the end
- Don't rollback on partial failures

**Important Notes:**
- Always review comments with user before posting (one by one)
- Only set "Blocked" status for confirmed vulnerable issues
- For already patched issues, just add label and comment

## Error Handling Guidelines

### Common Errors and Solutions

1. **"No Jira MCP integration found"**

   - Solution: Check MCP server configuration
   - Guide user to set up Atlassian MCP

2. **"No issues found matching criteria"**

   - Solution: Inform user that all security issues are already triaged
   - Suggest removing the `dashboard-security-triaged` label from some issues to test

3. **"Failed to extract package name"**

   - Solution: Flag for manual review
   - Show description snippet for manual inspection

4. **"Rate limit exceeded"**

   - Solution: Reduce batch size, add delays
   - Suggest retrying in a few minutes

5. **"red-hat-data-services remote not found"** (verification mode)

   - Solution: User needs to add the remote
   - Provide command: `git remote add red-hat-data-services https://github.com/red-hat-data-services/odh-dashboard.git`

6. **"Branch rhoai-X.Y not found"** (verification mode)

   - Solution: Try alternative branch names
   - Skip verification for that issue and mark as "branch_not_found"

7. **"npm install failed"** (verification mode)
   - Solution: Capture error output
   - Mark verification as "install_failed"
   - Continue to next issue

### Validation Rules

Before processing:

- Check issue limit is between 1-5 (hard limit to prevent token overflow)
- Verify user permissions for updates (if Update Jira = Yes)
- **MANDATORY**: Check that `red-hat-data-services` remote exists (run `git remote -v`)
- **MANDATORY**: Record current branch to return to later (run `git branch --show-current`)

During processing:

- Validate extracted versions match semver pattern
- Check package names against known list
- Verify CVE IDs match pattern

After processing:

- Ensure at least one field was extracted per issue
- Validate JSON structure before export
- Check for duplicate entries

## Best Practices

1. **Always show progress** for operations taking >5 seconds
2. **Use dry-run mode first** when updating Jira
3. **Flag low-confidence results** prominently
4. **Provide actionable next steps** for manual review items
5. **Export results** before updating Jira
6. **Validate user confirmation** before making changes
7. **Log all operations** for audit trail
8. **Handle partial failures gracefully** - don't stop entire batch

## User Interaction Flow

```
1. User: /triage-security-issues
2. Agent: "Starting Security Triage Agent for RHOAIENG/AI Core Dashboard..."
3. Agent: "How many issues to process? (1-5, default: 3)"
4. User: 3
5. Agent: "Update Jira after extraction? (Yes/No, default: No)"
6. User: No
7. Agent: "Export results to file? (Yes/No, default: No)"
8. User: Yes
9. Agent: "Fetching issue keys from Jira (lightweight query)..."
10. Agent: "Found 3 issues. Fetching details one-by-one..."
11. Agent: [Shows progress for each issue as it's fetched and processed]
12. Agent: "Verifying vulnerabilities in RHOAI branches..." (mandatory step)
13. Agent: "Checking rhoai-2.22: axios... VULNERABLE ✗ (installed: 1.6.0)"
14. Agent: "Checking rhoai-2.19: axios... PATCHED ✓ (installed: 1.11.0)"
15. Agent: [Displays summary table with verification results]
16. Agent: [Displays verification summary]
17. Agent: [Displays statistics]
18. Agent: "Results exported to .claude/triage-results/triage-2025-01-28-143052.json"
19. Agent: "Triage complete!"
```

## Best Practices

1. **Always show progress** for operations taking >5 seconds
2. **Use dry-run mode first** (Update Jira: No) to verify results
3. **Flag low-confidence results** prominently for manual review
4. **Export results** before updating Jira
5. **Handle partial failures gracefully** - don't stop entire batch
