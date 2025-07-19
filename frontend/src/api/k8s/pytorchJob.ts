import { k8sGetResource, k8sDeleteResource, K8sStatus } from '@openshift/dynamic-plugin-sdk-utils';
import { K8sAPIOptions, PyTorchJobKind } from '#~/k8sTypes';
import { PyTorchJobModel } from '#~/api/models';
import { applyK8sAPIOptions } from '#~/api/apiMergeUtils';
import { groupVersionKind } from '#~/api/k8sUtils';
import { CustomWatchK8sResult } from '#~/types.ts';
import useK8sWatchResourceList from '#~/utilities/useK8sWatchResourceList.ts';

export const getPyTorchJob = (name: string, namespace: string): Promise<PyTorchJobKind> =>
  k8sGetResource<PyTorchJobKind>({
    model: PyTorchJobModel,
    queryOptions: { name, ns: namespace },
  });

export const deletePyTorchJob = (
  name: string,
  namespace: string,
  opts?: K8sAPIOptions,
): Promise<K8sStatus> =>
  k8sDeleteResource<PyTorchJobKind, K8sStatus>(
    applyK8sAPIOptions(
      {
        model: PyTorchJobModel,
        queryOptions: { name, ns: namespace },
      },
      opts,
    ),
  );

export const usePyTorchJobs = (namespace: string): CustomWatchK8sResult<PyTorchJobKind[]> =>
  useK8sWatchResourceList(
    {
      isList: true,
      groupVersionKind: groupVersionKind(PyTorchJobModel),
      namespace,
    },
    PyTorchJobModel,
  );
