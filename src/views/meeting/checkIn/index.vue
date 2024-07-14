<template>
  <div class="p-4 main-box" style="height: 100%">
    <div class="back pointer" @click="back">
      <arrow-left-outlined />
      返回
    </div>
    <div class="main">
      <a-card style="height: 100%; background: #fff">
        <template #title>
          <a-space>
            <div class="flex title">
              <img src="../../../assets/images/check.png" />
              <span style="margin-left: 4px">会议签到</span>
            </div>
            <a-button
              style="margin-left: 10px"
              type="primary"
              @click="
                openModal(true, {
                  open: true,
                })
              "
            >
              语音签到
            </a-button>
          </a-space>
        </template>
        <div class="tip1">参会者语音签到：</div>
        <div class="tip2">打开语音签到，开始签到 </div>
        <a-card-grid class="box" v-for="(item, index) in data.list" :key="index">
          <a-space align="end">
            <div class="icon-box"><user-outlined class="icon" /></div>
            <div class="name">{{ item.userName }}</div>
          </a-space>
        </a-card-grid>
      </a-card>
      <a-space :size="8" style="width: 100%" class="mt10 justify-center">
        <a-button @click="jump" type="primary">下一步</a-button>
      </a-space>
    </div>
    <Modal @changeList="changeList" @saveList="saveList" :list="data.list" @register="register" />
  </div>
</template>

<script setup>
  import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons-vue';
  import { meetingCheckInAddList, meetingCheckInView } from '../../../api/meeting/creatMeeting';
  import { useModal } from '/@/components/Modal';
  import Modal from './Modal.vue';
  import { useRouter, useRoute } from 'vue-router';
  import { onMounted, reactive } from 'vue';
  const [register, { openModal }] = useModal();
  const router = useRouter();
  const route = useRoute();
  const data = reactive({
    list: [],
    moId: route.query.moId,
    recorder: route.query.recorder,
  });
  const back = () => {
    router.back();
  };
  const changeList = (option) => {
    data.list = [...data.list, ...[option]];
  };
  const saveList = () => {
    meetingCheckInAddList({
      moId: data.moId,
      list: data.list,
    });
  };
  const jump = (val) => {
    console.log(val);
    router.push({
      name: 'BeginMeeting',
      query: {
        moId: data.moId,
        isEdit: 'false',
        recorder: data.recorder,
      },
    });
  };
  onMounted(async () => {
    let res = await meetingCheckInView({
      moId: data.moId,
      list: data.list,
    });
    data.list = res || [];
  });
</script>

<style scoped lang="less">
  .main-box {
    height: 100%;
    .back {
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 16px;
    }

    .main {
      height: calc(100% - 80px);
      :deep(.ant-card-body) {
        padding: 0;
      }
    }
  }
  .title {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      margin-right: 6px;
    }
  }
  .box {
    width: 10%;
    text-align: center;
    position: relative;
    padding: 24px 4px;
    &:hover {
      background: rgba(243, 247, 253, 1);
      .deleted {
        display: block;
      }
    }
  }
  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #1890ff;
    color: #fff;
    font-size: 24px;
    width: 60px;
    height: 60px;
  }
  .name {
    font-size: 20px;
  }
  .tip1 {
    font-size: 18px;
    line-height: 42px;
    margin-left: 20px;
  }
  .tip2 {
    font-size: 14px;
    line-height: 14px;
    margin-left: 20px;
    opacity: 0.4;
    margin-bottom: 20px;
  }
</style>
