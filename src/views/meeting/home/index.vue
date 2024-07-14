<template>
  <div style="padding: 16px; height: 100%">
    <a-row :gutter="8" style="height: 100%">
      <a-col :span="10">
        <a-card :bordered="false" style="height: 100%; background: #fff">
          <template #title>
            <div class="flex">
              <appstore-two-tone />
              <span style="margin-left: 4px">快速应用</span>
            </div>
          </template>
          <a-row justify="space-around" class="mt80">
            <a-col :span="10" class="pointer">
              <a-card-grid class="card-item" @click="jump('CreatMeeting')">
                <div class="imgBox">
                  <img src="../../../assets/images/creatMeeting.png" />
                </div>
                <div>准备会议纲要</div>
              </a-card-grid>
            </a-col>
            <a-col :span="10" class="pointer">
              <a-card-grid class="card-item" @click="openModal">
                <div class="imgBox">
                  <img src="../../../assets/images/voice.png" />
                </div>
                <div>开始会议 </div>
              </a-card-grid>
            </a-col>
          </a-row>
          <a-row justify="space-around" class="mt80">
            <a-col :span="10" class="pointer">
              <a-card-grid class="card-item" @click="jump('MeetingRecord')">
                <div class="imgBox">
                  <img src="../../../assets/images/record.png" />
                </div>
                <div>会议记录 </div></a-card-grid
              >
            </a-col>
            <a-col :span="10" class="pointer">
              <a-card-grid class="card-item" @click="jump('Register')">
                <div class="imgBox">
                  <img src="../../../assets/images/enroll.png" />
                </div>
                <div>声音注册 </div>
              </a-card-grid>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="14" style="height: 100%">
        <a-card style="height: 100%">
          <template #title>
            <div class="flex">
              <dashboard-two-tone />
              <span style="margin-left: 4px">最近会议</span>
            </div>
          </template>
          <BasicTable :resizeHeightOffset="30" @register="registerTable">
            <template #action="{ record }">
              <TableAction
                :actions="[
                  {
                    label: '编辑',
                    onClick: handleEdit.bind(null, record),
                  },
                  {
                    label: '复制',
                    onClick: handleRecord.bind(null, record),
                  },
                  {
                    label: '删除',
                    popConfirm: {
                      title: '确认删除',
                      okText: '是',
                      cancelText: '否',
                      confirm: handleDelete.bind(null, record),
                    },
                  },
                ]"
              />
            </template>
          </BasicTable>
        </a-card>
        <!--        <a-card style="height: 49.5%; margin-top: 1%">
          <template #title>
            <div class="flex">
              <project-two-tone />
              <span style="margin-left: 4px">会议任务</span>
            </div>
          </template>
          &lt;!&ndash; :pagination="getPagination"&ndash;&gt;
          <a-list :data-source="data.list">
            <template #renderItem="{ item }">
              <a-list-item style="display: block">
                <a-row>
                  <a-col :span="1">
                    <div class="dot"></div>
                  </a-col>
                  <a-col :span="21">{{ item.title }}</a-col>
                  <a-col :span="2" style="text-align: right; padding-right: 8px"> 6/9</a-col>
                </a-row>
              </a-list-item>
            </template>
          </a-list>
        </a-card>-->
      </a-col>
    </a-row>
    <Modal @register="register" />
  </div>
</template>

<script setup>
  import { getShortMeetingList, meetingOutLine } from '../../../api/meeting/creatMeeting';
  import { AppstoreTwoTone, DashboardTwoTone } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { computed, onMounted, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useRouter } from 'vue-router';
  import Modal from './Modal.vue';
  const router = useRouter();
  const { t } = useI18n();
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
  const [registerTable, { reload }] = useTable({
    api: getShortMeetingList,
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
  const [register, { openModal }] = useModal();

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
  function handleRecord(record) {
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
  async function handleDelete(record) {
    await meetingOutLine({ moId: record.moId });
    reload();
  }
  const jump = (name) => {
    router.push(name);
  };
  const data = reactive({
    page: {
      current: 1,
      pageSize: 16,
      size: 0,
    },
    list: [
      {
        title: '会议任务是由上级单位下发的会议通知、计划、任务等信息，功能敬请期待',
      },
    ],
  });

  const getPagination = computed(() => {
    let { pageSize, current, size } = data.page;
    return {
      size: 'small',
      showTotal: (total) => t('component.table.total', { total }),
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['16', '24', '36'],
      total: size,
      pageSize,
      current: current,
      // onChange(page, pageSize) {
      onChange() {
        // data.page.current = page;
        // data.page.pageSize = pageSize;
      },
    };
  });
  onMounted(() => {
    // openModal();
  });
</script>

<style scoped lang="less">
  .flex {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #409efe;
    margin-top: 9px;
    margin-left: 4px;
  }
  .card-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    .imgBox {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(153, 204, 255, 0.4);
      text-align: center;
      margin-right: 20px;
    }
    img {
      width: 30px;
    }
    > div {
      width: 120px;
    }
  }
</style>
