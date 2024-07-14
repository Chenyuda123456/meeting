<template>
  <div class="p-4 main-box" style="height: 100%">
    <div class="back pointer" @click="back('Home')">
      <arrow-left-outlined />
      返回
    </div>
    <a-row class="main" :gutter="8" ref="main">
      <a-col :span="14">
        <a-card style="height: 100%; background: #fff">
          <template #title>
            <div class="flex align-center">
              <snippets-two-tone />
              <span style="margin-left: 4px">会议内容</span>
            </div>
          </template>
          <div
            class="content"
            ref="content"
            :style="{ height: data.contentHeight + 'px', overflow: 'auto' }"
          >
            <Station
              v-show="data.type == 'station' || data.isEdit"
              :station="data.meetingEditOrAddDto.meetingOutlineAddOrUpdateDto"
              :type="data.type"
            />
            <Cleaning
              v-show="data.type == 'cleaning' || data.isEdit"
              :cleaning="data.meetingEditOrAddDto.meetingCleaningClassAddOrUpdateDto"
              :type="data.type"
            />
            <MeetingOrLearnFile
              v-show="data.type == 'meeting' || data.type == 'learnFile' || data.isEdit"
              :meetingOrLearnFile="data.meetingEditOrAddDto.map"
              :type="data.type"
              :index="data.index"
              :isEdit="data.isEdit"
            />
            <Security
              v-show="data.type == 'security' || data.isEdit"
              :security="data.meetingEditOrAddDto.meetingSafeIdeaAddOrUpdateDto || data.isEdit"
              :type="data.type"
            />
            <Question
              v-show="data.type == 'question' || data.isEdit"
              :question="data.meetingEditOrAddDto.askTableListVos || data.isEdit"
              :type="data.type"
            />
          </div>
        </a-card>
      </a-col>
      <a-col :span="10" class="right">
        <a-card style="height: 100%; background: #fff">
          <template #title>
            <div class="flex align-center">
              <profile-two-tone />
              <span style="margin-left: 4px">录音转写</span>
            </div>
          </template>
          <div
            class="content"
            ref="content"
            :style="{ height: data.contentHeight + 'px', overflow: 'auto' }"
          >
            <RecordNative
              ref="recordRem"
              :type="data.type"
              :childData="data.meetingEditOrAddDto.map"
              :index="data.index"
              :isEdit="data.isEdit"
              :mrId="data.mrId"
              :moId="data.moId"
              :meetingEditOrAddDto="data.meetingEditOrAddDto"
            />
          </div>
        </a-card>
      </a-col>
    </a-row>
    <div class="justify-between" v-if="!data.isEdit">
      <a-space :size="8" style="width: 100%" class="mt10 justify-center">
        <a-button @click="previous" :disabled="data.isPreviousDisable">上一步</a-button>
        <a-button @click="next" type="primary" :disabled="data.isNextDisable">下一步</a-button>
      </a-space>
      <a-space :size="8" style="width: 100%" class="mt10 justify-end">
        <!--        <a-button @click="previous">上一步</a-button>-->
        <!--        <a-button @click="next">下一步</a-button>-->
        <!--        <a-button @click="openWs">开始</a-button>-->
        <!--        <a-button @click="closeWs">暂停</a-button>-->
        <a-popconfirm title="确认结束会议吗?" ok-text="是" cancel-text="否" @confirm="save">
          <a-button
            type="primary"
            :style="{
              visibility: data.isDisplayEndBtn || data.type == 'question' ? '' : 'hidden',
            }"
            >结束会议</a-button
          >
        </a-popconfirm>
      </a-space>
    </div>
  </div>
</template>
<script setup>
  import { ArrowLeftOutlined, ProfileTwoTone, SnippetsTwoTone } from '@ant-design/icons-vue';
  // 组件
  import Station from './components/station.vue';
  import Cleaning from './components/cleaning.vue';
  import MeetingOrLearnFile from './components/MeetingOrLearnFile.vue';
  import Question from './components/question.vue';
  import Security from './components/security.vue';
  import RecordNative from './components/recordNative.vue';
  import {
    addSpeech,
    fetchAlldata,
    addRecord,
    editRecord,
  } from '../../../api/meeting/creatMeeting';
  import { nextTick, onBeforeMount, onMounted, reactive, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import dayjs from 'dayjs';
  import { useMessage } from '../../../hooks/web/useMessage';
  const { createMessage } = useMessage();
  const router = useRouter();
  const route = useRoute();
  const main = ref();
  const recordRem = ref();
  const data = reactive({
    isDisplayEndBtn: false,
    isPreviousDisable: false,
    isNextDisable: false,
    beginTime: new Date(),
    isEdit: route.query.isEdit == 'false' ? false : true,
    mrId: route.query.mrId,
    moId: route.query.moId,
    objectId: '',
    contentHeight: 0,
    meetingEditOrAddDto: {
      meetingOutlineAddOrUpdateDto: {
        date: '',
        stationName: '',
        host: '',
        recorder: '',
        securityIssues: '',
        cleanerIssues: '',
        pitStops: '',
        outbound: '',
        hourPitStops: '',
        hourPitStopsCount: '',
        hourOutbound: '',
        hourOutboundCount: '',
        revenue: '',
        accident: '',
        construction: '',
        emergencies: '',
      },
      meetingCleaningClassAddOrUpdateDto: {
        grooming: '',
        cleaningClassMeeting: '',
      },
      meetingSafeIdeaAddOrUpdateDto: {
        stationDuty: '',
        afcDuty: '',
        administrativeDuty: '',
        platformDuty: '',
        passengerDuty: '',
      },
      askTableListVos: [],
      map: {
        0: [],
        1: [],
      },
    },
    type: 'station',
    index: null,
  });
  const previous = () => {
    data.isPreviousDisable = true;
    setTimeout(() => {
      data.isPreviousDisable = false;
    }, 1000);
    switch (data.type) {
      case 'station':
        router.back();
        break;
      case 'cleaning':
        data.type = 'station';
        break;
      case 'meeting':
        if (data.meetingEditOrAddDto.map[0].length && data.index !== 0) {
          data.index -= 1;
        } else if (data.meetingEditOrAddDto.map[0].length && data.index == 0) {
          data.type = 'cleaning';
          data.index = null;
        } else {
          data.type = 'cleaning';
          data.index = null;
        }
        break;
      case 'learnFile':
        if (data.meetingEditOrAddDto.map[1].length && data.index !== 0) {
          data.index -= 1;
        } else if (data.meetingEditOrAddDto.map[1].length && data.index == 0) {
          data.type = 'meeting';
          if (data.meetingEditOrAddDto.map[0].length) {
            data.index = null;
            nextTick(() => {
              data.index = data.meetingEditOrAddDto.map[0].length - 1;
            });
          } else {
            data.index = null;
          }
        } else {
          data.type = 'meeting';
          if (data.meetingEditOrAddDto.map[0].length) {
            data.index = data.meetingEditOrAddDto.map[0].length - 1;
          } else {
            data.index = null;
          }
        }
        break;
      case 'security':
        data.type = 'learnFile';
        if (data.meetingEditOrAddDto.map[1].length) {
          data.index = data.meetingEditOrAddDto.map[1].length - 1;
        }
        break;
      case 'question':
        data.type = 'security';
        break;
    }
  };
  const next = () => {
    data.isNextDisable = true;
    setTimeout(() => {
      data.isNextDisable = false;
    }, 1000);
    switch (data.type) {
      case 'station':
        data.type = 'cleaning';
        break;
      case 'cleaning':
        data.type = 'meeting';
        if (data.meetingEditOrAddDto.map[0].length) {
          data.index = 0;
        }
        break;
      case 'meeting':
        if (
          data.meetingEditOrAddDto.map[0].length &&
          data.meetingEditOrAddDto.map[0].length - 1 == data.index
        ) {
          data.type = 'learnFile';
          if (data.meetingEditOrAddDto.map[1].length) {
            data.index = null;
            nextTick(() => {
              data.index = 0;
            });
          } else {
            data.index = null;
          }
          console.log(data.index);
        } else if (data.meetingEditOrAddDto.map[0].length) {
          data.index += 1;
        } else {
          data.type = 'learnFile';
          if (data.meetingEditOrAddDto.map[1].length) {
            data.index = 0;
          } else {
            data.index = null;
          }
        }
        break;
      case 'learnFile':
        if (
          data.meetingEditOrAddDto.map[1].length &&
          data.meetingEditOrAddDto.map[1].length - 1 == data.index
        ) {
          data.type = 'security';
          data.index = null;
        } else if (data.meetingEditOrAddDto.map[1].length) {
          data.index += 1;
        } else {
          data.type = 'security';
          data.index = null;
        }
        break;
      case 'security':
        data.type = 'question';
        data.isDisplayEndBtn = true;
        break;
      case 'question':
        data.type = 'question';
        break;
    }
  };
  const back = () => {
    router.push('Dashboard');
  };
  const openWs = () => {
    recordRem.value.openWs();
  };
  const closeWs = () => {
    recordRem.value.closeWs();
  };
  const timediff = (begin_time, end_time) => {
    //年月日时分秒转换为时间戳
    let beginTime = begin_time.getTime() / 1000;
    let endTime = end_time.getTime() / 1000;
    var starttime = '';
    var endtime = '';
    if (beginTime < endTime) {
      starttime = beginTime;
      endtime = endTime;
    } else {
      starttime = endTime;
      endtime = beginTime;
    }
    //计算天数
    var timediff = endtime - starttime;
    // var days = parseInt(timediff / 86400);
    //计算小时数
    var remain = timediff % 86400;
    var hours = parseInt(remain / 3600);
    hours.toString().length == 1 ? (hours = '0' + hours) : '';
    //计算分钟数
    var remain = remain % 3600;
    var mins = parseInt(remain / 60);
    mins.toString().length == 1 ? (mins = '0' + mins) : '';
    var secs = parseInt(remain % 60);
    secs.toString().length == 1 ? (secs = '0' + secs) : '';
    var res = hours + ':' + mins + ':' + secs;
    return res;
  };
  const save = async () => {
    closeWs();
    const addRecordRes = await addRecord({
      moId: data.moId,
      recorder: route.query.recorder,
    });
    data.mrId = addRecordRes.mrId;
    await editRecord({
      moId: data.moId,
      mrId: data.mrId,
      duration: timediff(data.beginTime, new Date()),
      endTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      status: 1,
      wsId: recordRem.value.data.uuId,
    });

    let speechList = recordRem.value.getSubmitList();
    let res = addSpeech({ speechList });
    console.log(res);
    createMessage.success('保存成功！');
    window.localStorage.removeItem('recordMeeting' + data.moId);
    back();
  };
  onBeforeMount(async () => {
    data.meetingEditOrAddDto = await fetchAlldata({ moId: data.moId });
    data.meetingEditOrAddDto.map[0] ? '' : (data.meetingEditOrAddDto.map[0] = []);
    data.meetingEditOrAddDto.map[1] ? '' : (data.meetingEditOrAddDto.map[1] = []);
    // 获取本地储存数据
    nextTick(() => {
      if (localStorage.getItem('recordMeeting' + data.moId)) {
        let getData = JSON.parse(localStorage.getItem('recordMeeting' + data.moId));
        console.log(getData);
        data.type = getData.type;
        data.index = getData.index;
        Object.keys(getData.data).forEach((item) => {
          console.log(item);
          recordRem.value.data[item] = getData.data[item];
        });
        console.log(recordRem.value.data);
      }

      // 如果编辑获取 所有 记录数据 其中有 连接下载的ws用的id
      if (data.isEdit) {
        recordRem.value.getAllspeack();
      }
    });
  });
  onMounted(async () => {
    data.contentHeight = main.value.$el.offsetHeight - 60;
    if (!data.isEdit) {
      openWs();
    }
  });
</script>

<style scoped lang="less">
  .main-box {
    height: 100%;
  }
  .back {
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 16px;
  }

  .main {
    height: calc(100% - 80px);
    .right {
      :deep(.ant-card-body) {
        padding: 0;
      }
    }
    :deep(.ant-card-body) {
      padding: 0;
    }
  }
</style>
