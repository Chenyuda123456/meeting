<template>
  <BasicModal @register="register" :height="800" :useWrapper="true" :width="800" title="开始会议">
    <BasicTable
      :resizeHeightOffset="200"
      title="请选择一个会议纲要开始会议"
      @register="registerTable"
    >
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '开始会议',
              popConfirm: {
                title: '确认开始会议',
                okText: '是',
                cancelText: '否',
                confirm: jump.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <template #footer>
      <a-space>
        <a-button @click="cancel"> 取消 </a-button>
        <!--        <a-button type="primary" @click="jump"> 创建无纲要会议 </a-button>-->
      </a-space>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { getShortMeetingList } from '../../../api/meeting/creatMeeting';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  const columns = [
    {
      title: '会议日期',
      dataIndex: 'date',
    },
    {
      title: '主持人',
      dataIndex: 'host',
    },
    {
      title: '记录人',
      dataIndex: 'recorder',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];
  const [registerTable] = useTable({
    api: getShortMeetingList,
    columns: columns,
    showIndexColumn: false,
    bordered: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const cancel = () => {
    closeModal();
  };
  const jump = (val) => {
    console.log(val);
    router.push({
      name: 'CheckIn',
      query: {
        moId: val.moId,
        isEdit: 'false',
        recorder: val.recorder,
      },
    });
  };

  const [register, { closeModal }] = useModalInner(() => {});
</script>
<style scoped lang="less"></style>
