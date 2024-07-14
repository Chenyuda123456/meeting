<template>
  <div class="p-4">
    <div class="back pointer" @click="back">
      <arrow-left-outlined />
      返回
    </div>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <div class="title">
          <img src="../../../assets/images/record.png" />
          <div>会议记录</div>
        </div>
      </template>
      <!--      {-->
      <!--      label: '开会',-->
      <!--      onClick: handleMeeting.bind(null, record),-->
      <!--      },-->
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '复制',
              onClick: handleCopy.bind(null, record),
            },
            {
              label: '记录',
              onClick: handleRecord.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script setup>
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage } from '/@/api/meeting/creatMeeting';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const columns = [
    {
      title: '会议日期',
      dataIndex: 'meetingTime',
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
    {
      title: '时长',
      dataIndex: 'duration',
    },
  ];
  const [registerTable] = useTable({
    api: selectPage,
    columns: columns,
    showIndexColumn: false,
    bordered: false,
    showTableSetting: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const back = () => {
    router.push('Dashboard');
  };
  function handleEdit(record) {
    router.push({
      name: 'CreatMeeting',
      query: {
        moId: record.moId,
        isEdit: 'true',
        recorder: record.recorder,
        mrId: record.mrId,
      },
    });
  }

  function handleMeeting(record) {
    console.log('点击了删除', record);
  }
  function handleRecord(record) {
    router.push({
      name: 'BeginMeeting',
      query: {
        moId: record.moId,
        isEdit: 'true',
        recorder: record.recorder,
        mrId: record.mrId,
      },
    });
  }
  function handleCopy(record) {
    router.push({
      name: 'CreatMeeting',
      query: {
        moId: record.moId,
        isEdit: 'true',
        recorder: record.recorder,
        mrId: record.mrId,
        copy: true,
      },
    });
  }
</script>
<style scoped lang="less">
  .back {
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 16px;
  }
  .title {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      margin-right: 6px;
    }
  }
</style>
