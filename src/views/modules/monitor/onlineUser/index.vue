<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'userPlatform'">
          <Tag :color="record.userPlatform === 'WEB' ? 'processing' : 'default'">
            {{ formatDictValue(sysUserPlatformOptions, record.userPlatform) }}
          </Tag>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                auth: ['monitor:onlineUser:forceLogout'],
                icon: 'ant-design:delete-outlined',
                tooltip: '强制退出',
                color: 'error',
                popConfirm: {
                  title: '是否确认强制退出',
                  confirm: handleForce.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, searchFormSchema } from './data';

  import { fetchList, forceLogout } from '/@/api/modules/monitor/onlineUserApi';
  import { listDictModel } from '/@/api/common';
  import { formatDictValue } from '/@/utils';

  const sysUserPlatformOptions = ref([]);
  onBeforeMount(async () => {
    sysUserPlatformOptions.value = await listDictModel({ dictCode: 'sys_user_platform' });
  });

  const { createMessage } = useMessage();
  const [registerTable, { reload }] = useTable({
    title: '在线用户列表 ',
    api: fetchList,
    rowKey: 'token',
    columns,
    formConfig: {
      baseColProps: { sm: 24, lg: 6 },
      labelWidth: 90,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      resetButtonOptions: {
        preIcon: 'ant-design:delete-outlined',
      },
      submitButtonOptions: {
        preIcon: 'ant-design:search-outlined',
      },
    },
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    actionColumn: {
      auth: ['monitor:onlineUser:forceLogout'],
      width: 80,
      title: '操作',
      dataIndex: 'action',
    },
  });

  // 强制退出按钮事件
  async function handleForce(record: Recordable) {
    console.log(record);
    await forceLogout({ userPlatform: record.userPlatform, token: record.token });
    createMessage.success('强退成功！');
    await reload();
  }
</script>
