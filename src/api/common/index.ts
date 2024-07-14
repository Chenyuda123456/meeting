import { defHttp } from '/@/utils/http/axios';
import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();

import { UploadFileParams } from '/#/axios';

enum Api {
  listDictModel = '/system/sysDict/listDictModel',
  getConfigValue = '/system/sysConfig/getConfigValue',
}

export function listDictModel(params?: object) {
  return defHttp.get({ url: Api.listDictModel, params: params });
}

export function getConfigValue(params?: object) {
  return defHttp.get({ url: Api.getConfigValue, params: params });
}

export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile(
    {
      url: globSetting.apiUrl + '/system/common/upload',
      onUploadProgress,
    },
    params,
  );
}
