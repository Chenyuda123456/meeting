import { BasicColumn, FormSchema } from '/@/components/Table';
import { listDictModel } from '/@/api/common';
export const columns: BasicColumn[] = [
  {
    title: '会话ID',
    dataIndex: 'token',
    width: 280,
  },
  {
    title: '用户平台',
    dataIndex: 'userPlatform',
    width: 120,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 150,
  },
  {
    title: '登录IP地址',
    dataIndex: 'ipAddress',
    width: 120,
  },
  {
    title: '登录地点',
    dataIndex: 'loginLocation',
    width: 150,
  },
  {
    title: '浏览器类型',
    dataIndex: 'browser',
    width: 150,
  },
  {
    title: '操作系统',
    dataIndex: 'os',
  },
  {
    title: '登录时间',
    dataIndex: 'loginTime',
    width: 160,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userPlatform',
    label: '用户平台',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请选择用户平台',
      api: listDictModel,
      params: {
        dictCode: 'sys_user_platform',
      },
    },
  },
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    componentProps: {
      placeholder: '请输入用户名',
    },
  },
];
