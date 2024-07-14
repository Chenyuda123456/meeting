<template>
  <div class="p-4 main-box" style="height: 100%">
    <div class="back pointer" @click="back">
      <arrow-left-outlined />
      返回
    </div>
    <a-row class="main" :gutter="8">
      <a-col :span="4">
        <a-card style="height: 78vh; background: #fff; overflow: auto">
          <template #title>
            <div class="flex">
              <!--<appstore-two-tone />-->
              <span style="margin-left: 4px">会议纲要</span>
            </div>
          </template>
          <a-menu
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            @click="handleClick"
            style="margin-top: 10px"
          >
            <a-menu-item key="station">
              <div>一、昨日车站运作情况</div>
            </a-menu-item>
            <a-menu-item key="Cleaning">
              <div>二、保洁委外交班会</div>
            </a-menu-item>
            <a-sub-menu key="meetContent">
              <template #title>
                <div class="flex align-center justify-between">
                  <div> 三、会议内容</div>
                  <div @click.stop="listAdd(0)">新建</div>
                </div>
              </template>
              <a-menu-item
                v-for="(item, index) in data.meetingList"
                :key="'meet' + index"
                class="menu-item"
              >
                <div v-show="item.isInput">
                  <a-row :gutter="16">
                    <a-col>
                      <a-input @blur="ListSave(item, 0)" v-model:value="item.title" />
                    </a-col>
                  </a-row>
                  <a-space :size="8" class="manipulate">
                    <check-circle-outlined @click="ListSave(item, 0)" />
                    <delete-outlined @click.stop="ListDelete(index, 0, item)" />
                  </a-space>
                </div>
                <div v-show="!item.isInput">
                  <a-row :gutter="16">
                    <a-col>
                      <a-popover placement="topLeft">
                        <template #content>
                          <span>{{ index + 1 }}.{{ item.title }}</span>
                        </template>
                        <span>{{ index + 1 }}.{{ item.title }}</span>
                      </a-popover>
                    </a-col>
                  </a-row>
                  <a-space :size="8" class="manipulate">
                    <edit-outlined @click="ListEdit(item, 0)" />
                    <delete-outlined @click.stop="ListDelete(index, 0, item)" />
                  </a-space>
                </div>
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="studyFile">
              <template #title>
                <div class="flex align-center justify-between">
                  <div>四、学习文件</div>
                  <div @click.stop="listAdd(1)">新建</div>
                </div>
              </template>
              <a-menu-item
                v-for="(item, index) in data.learnFile"
                :key="'file' + index"
                class="menu-item"
              >
                <div v-show="item.isInput">
                  <a-row :gutter="16">
                    <a-col>
                      <a-input @blur="ListSave(item, 1)" v-model:value="item.title" />
                    </a-col>
                  </a-row>
                  <a-space :size="8" class="manipulate">
                    <check-circle-outlined @click="ListSave(item, 1)" />
                    <delete-outlined @click.stop="ListDelete(index, 1, item)" />
                  </a-space>
                </div>
                <div v-show="!item.isInput">
                  <a-row :gutter="16">
                    <a-col>
                      <a-popover placement="topLeft">
                        <template #content>
                          <span>{{ index + 1 }}.{{ item.title }}</span>
                        </template>
                        <span>{{ index + 1 }}.{{ item.title }}</span>
                      </a-popover>
                    </a-col>
                  </a-row>
                  <a-space :size="8" class="manipulate">
                    <edit-outlined @click="ListEdit(item, 1)" />
                    <delete-outlined @click.stop="ListDelete(index, 1, item)" />
                  </a-space>
                </div>
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item key="security">
              <div>五、安全预想</div>
            </a-menu-item>
            <a-menu-item key="question">
              <div>六、抽问</div>
            </a-menu-item>
          </a-menu>
        </a-card>
      </a-col>
      <a-col :span="20" class="right">
        <a-card style="height: 78vh; background: #fff; overflow: auto">
          <Station
            ref="StationRef"
            v-show="data.rightVisible === 'station'"
            :meetingEditOrAddDto="data.meetingEditOrAddDto"
          />
          <Cleaning
            ref="CleaningRef"
            :rightVisible="data.rightVisible"
            v-show="data.rightVisible === 'Cleaning'"
            :meetingEditOrAddDto="data.meetingEditOrAddDto"
          />
          <Security
            ref="SecurityRef"
            v-show="data.rightVisible === 'security'"
            :meetingEditOrAddDto="data.meetingEditOrAddDto"
          />
          <Question
            ref="QuestionRef"
            v-show="data.rightVisible === 'question'"
            :meetingEditOrAddDto="data.meetingEditOrAddDto"
          />
          <WangEditor
            @changeHtml="changeHtml"
            :value-html="data.valueHtml"
            v-if="
              data.rightVisible !== 'security' &&
              data.rightVisible !== 'question' &&
              data.rightVisible !== 'station' &&
              data.rightVisible !== 'Cleaning'
            "
          />
        </a-card>
      </a-col>
    </a-row>
    <a-space :size="8" style="width: 100%" class="mt10 justify-end">
      <a-button @click="getAllsubmitData" type="primary">保存</a-button>
    </a-space>
  </div>
</template>

<script setup>
  import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
  } from '@ant-design/icons-vue';

  import { nextTick, onMounted, reactive, ref, watch } from 'vue';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  // api
  import {
    fetchGetId,
    fetchAlldata,
    AllDataAddOrUpdateMeeting,
    titleRemove,
  } from '../../../api/meeting/creatMeeting';
  // 组件
  import Station from './components/station.vue';
  import Cleaning from './components/cleaning.vue';
  import WangEditor from './components/wangEditor.vue';
  import Question from './components/question.vue';
  import Security from './components/security.vue';
  import { useMessage } from '../../../hooks/web/useMessage';
  const { createMessage, createConfirm } = useMessage();
  const route = useRoute();
  const router = useRouter();
  const data = reactive({
    isBack: false,
    moId: '',
    valueHtml: '',
    rightVisible: 'station',
    meetingEditOrAddDtoMemo: {
      meetingOutlineAddOrUpdateDto: {
        date: '',
        host: '',
        recorder: '',
        stationName: '',
        securityIssues: '',
        cleanerIssues: '',
        pitStops: null,
        outbound: null,
        hourPitStops: '',
        hourPitStopsCount: null,
        hourOutbound: '',
        hourOutboundCount: null,
        revenue: '',
        accident: '无',
        construction: '无',
        emergencies: '无',
      },
      meetingCleaningClassAddOrUpdateDto: {
        grooming: '',
        cleaningClassMeeting: '',
      },
      // 1学习文件 和 0会议内容
      map: {
        0: [],
        1: [],
      },
      meetingSafeIdeaAddOrUpdateDto: {
        stationDuty: '',
        afcDuty: '',
        administrativeDuty: '',
        platformDuty: '',
        passengerDuty: '',
      },
      askTableListVos: [],
    },
    meetingEditOrAddDto: {
      meetingOutlineAddOrUpdateDto: {
        date: '',
        host: '',
        recorder: '',
        stationName: '',
        securityIssues: '',
        cleanerIssues: '',
        pitStops: null,
        outbound: null,
        hourPitStops: '',
        hourPitStopsCount: null,
        hourOutbound: '',
        hourOutboundCount: null,
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
      // 1学习文件 和 0会议内容
      map: {
        0: [],
        1: [],
      },
      askTableListVos: [],
    },
    meetingList: [],
    learnFile: [],
  });
  const selectedKeys = ref(['station']);
  const openKeys = ref(['']);
  const StationRef = ref();
  const CleaningRef = ref();
  const SecurityRef = ref();
  const QuestionRef = ref();
  const handleClick = (e) => {
    console.log(data.meetingList);
    console.log(e.key);
    data.rightVisible = e.key;
  };
  // 0:会议摘要 1:文件学习
  const listAdd = (type) => {
    if (type) {
      openKeys.value = [...openKeys.value, 'studyFile'];
      data.rightVisible = 'file';
      data.learnFile.push({ title: '', content: '', isInput: true });
      selectedKeys.value = ['file' + (data.learnFile.length - 1)];
      console.log('file' + (data.learnFile.length - 1));
    } else {
      openKeys.value = [...openKeys.value, 'meetContent'];
      data.rightVisible = 'meeting';
      data.meetingList.push({ title: '', content: '', isInput: true });
      selectedKeys.value = ['meet' + (data.meetingList.length - 1)];
    }
  };
  const ListSave = (item) => {
    if (!item.title) {
      createMessage.warning('请输入会议内容标题！');
    } else {
      item.isInput = false;
    }
  };
  const ListEdit = (item) => {
    if (!item.title) {
      createMessage.warning('请输入学习文件标题！');
    } else {
      item.isInput = true;
    }
  };
  const ListDelete = async (index, type, item) => {
    if (type) {
      data.learnFile.splice(index, 1);
      if (index) {
        selectedKeys.value = ['file' + (index - 1)];
      } else {
        selectedKeys.value = ['station'];
        data.rightVisible = 'station';
      }
    } else {
      data.meetingList.splice(index, 1);
      if (index) {
        selectedKeys.value = ['meet' + (index - 1)];
      } else {
        selectedKeys.value = ['station'];
        data.rightVisible = 'station';
      }
    }
    // 删除标题
    if (item.ocId) {
      await titleRemove({
        ocId: item.ocId,
      });
    }
  };
  // 获取右侧 富文本 数据
  const changeHtml = (val) => {
    // 获取当前 左侧选中的
    let index = selectedKeys.value[0].slice(4);
    if (selectedKeys.value[0].includes('meet')) {
      data.meetingList[index].content = val.value;
    } else {
      data.learnFile[index].content = val.value;
    }
    data.valueHtml = val.value;
  };
  // 根据左侧选的 填充对应的 富文本 数据
  watch(
    () => selectedKeys.value,
    (val) => {
      nextTick(() => {
        console.log(val);
        console.log(data?.meetingList);
        let index = val[0].slice(4) * 1;
        console.log(index);
        if (val[0].includes('meet')) {
          data.valueHtml = data?.meetingList?.[index]?.content;
          console.log(data.valueHtml);
        } else if (val[0].includes('file')) {
          data.valueHtml = data?.learnFile?.[index]?.content;
        } else {
          data.valueHtml = '';
        }
      });
    },
    {
      deep: true,
    },
  );
  // 获取所有的数据
  const init = async () => {
    if (route.query.moId) {
      data.moId = route.query.moId;
      getAlldata();
    }
  };

  const getAlldata = async () => {
    data.meetingEditOrAddDto = await fetchAlldata({ moId: data.moId });
    if (data.meetingEditOrAddDto.map[0]) {
      data.meetingList = data.meetingEditOrAddDto.map[0].filter((item) => {
        return item.title;
      });
    } else {
      data.meetingList = [];
      data.meetingEditOrAddDto.map[0] = [];
    }
    if (data.meetingEditOrAddDto.map[1]) {
      data.learnFile = data.meetingEditOrAddDto.map[1].filter((item) => {
        return item.title;
      });
    } else {
      data.learnFile = [];
      data.meetingEditOrAddDto.map[1] = [];
    }
    data.meetingEditOrAddDtoMemo = JSON.parse(JSON.stringify(data.meetingEditOrAddDto));
  };
  const visibleCurrent = (name) => {
    selectedKeys.value = [name];
    data.rightVisible = name;
    if (name.includes('meet')) {
      openKeys.value = [...openKeys.value, 'meetContent'];
    } else if (name.includes('file')) {
      openKeys.value = [...openKeys.value, 'studyFile'];
    }
  };
  // 获取所有数据并且保存
  const getAllsubmitData = async () => {
    let meetingOutlineAddOrUpdateDto;
    let meetingCleaningClassAddOrUpdateDto = {};
    let meetingSafeIdeaAddOrUpdateDto;
    let askTableListVos;
    let map = {};
    // 昨日车站运作情况
    meetingOutlineAddOrUpdateDto = await StationRef.value.getFieldsValue();
    // 保洁委外交班会
    meetingCleaningClassAddOrUpdateDto.grooming = await CleaningRef.value.getFieldsValue().grooming;
    console.log(CleaningRef.value.valueHtml);
    meetingCleaningClassAddOrUpdateDto.cleaningClassMeeting = CleaningRef.value.valueHtml || '无';
    // 会议内容
    console.log(data.meetingList);
    console.log(data.meetingEditOrAddDto.map[0]);
    console.log(map[0]);
    console.log('=================');
    map[0] = [...data.meetingList];
    console.log(data.meetingList);
    console.log(data.meetingEditOrAddDto.map[0]);
    console.log(map[0]);
    map[0].some(async (item, index) => {
      if (!item.title && !item.content) {
        if (item.ocId) {
          await titleRemove({
            ocId: item.ocId,
          });
        }
        map[0].splice(index, 1);
      }
    });
    data.meetingEditOrAddDto.map[0].map((item) => {
      let flag = true;
      map[0].filter((child) => {
        if (item.ocId == child.ocId) {
          flag = false;
        }
      });
      if (flag) {
        titleRemove({
          ocId: item.ocId,
        });
      }
    });
    // 学习文件
    map[1] = [...data.learnFile];

    map[1].some(async (item, index) => {
      if (!item.title && !item.content) {
        await titleRemove({
          ocId: item.ocId,
        });
        map[1].splice(index, 1);
      }
    });
    data.meetingEditOrAddDto.map[1].map((item) => {
      let flag = true;
      map[1].filter((child) => {
        if (item.ocId == child.ocId) {
          flag = false;
        }
      });
      if (flag) {
        titleRemove({
          ocId: item.ocId,
        });
      }
    });
    // 安全预想
    meetingSafeIdeaAddOrUpdateDto = await SecurityRef.value.getFieldsValue();
    // 抽问
    askTableListVos = QuestionRef.value.list.filter((item) => {
      return item;
    });
    if (!map[0].length) {
      map[0].push({
        title: '',
        content: '',
      });
    }
    if (!map[1].length) {
      map[1].push({
        title: '',
        content: '',
      });
    }
    let tip = data.moId ? '修改纲要完成！' : '创建纲要完成！';
    if (route.query.copy) {
      if (!route.query.copyId) {
        let res = await fetchGetId();
        data.moId = res || '';
      }
    } else {
      if (!route.query.moId && !data.moId) {
        let res = await fetchGetId();
        data.moId = res || '';
      }
    }

    setTimeout(async () => {
      await AllDataAddOrUpdateMeeting({
        moId: data.moId,
        meetingOutlineAddOrUpdateDto,
        meetingCleaningClassAddOrUpdateDto,
        meetingSafeIdeaAddOrUpdateDto,
        askTableListVos,
        map,
      });
      createMessage.success(tip);
      if (route.query.copyId) {
        router.replace({
          query: { ...route.query, copyId: true },
        });
      } else {
        getAlldata();
      }
    }, 300);
  };

  // 获取保存所有数据
  const allSave = async () => {
    let meetingOutlineAddOrUpdateDto = {};
    let meetingCleaningClassAddOrUpdateDto = {};
    let meetingSafeIdeaAddOrUpdateDto = {};
    let askTableListVos = [];
    let map = {};
    let flag = true;
    let current = '';
    // 安全预想

    meetingSafeIdeaAddOrUpdateDto = {
      ...data.meetingEditOrAddDtoMemo.meetingSafeIdeaAddOrUpdateDto,
      ...(await SecurityRef.value.getFieldsValue()),
    };
    try {
      let Security = await SecurityRef.value.validate();
      console.log(Security);
    } catch (err) {
      current = 'security';
      flag = false;
    }

    // 学习文件
    data.learnFile.forEach((item, index) => {
      if (!item.title) {
        current = 'file' + index;
        flag = false;
      } else if (item.content == '<p><br></p>') {
        current = 'file' + index;
        flag = false;
      }
    });
    data.learnFile.length
      ? (map[1] = data.learnFile)
      : (map[1] = data.meetingEditOrAddDtoMemo.map[1]);

    // 会议内容
    data.meetingList.forEach((item, index) => {
      if (!item.title) {
        current = 'meet' + index;
        visibleCurrent();
        flag = false;
      } else if (item.content == '<p><br></p>') {
        current = 'meet' + index;
        flag = false;
      }
    });
    data.meetingList.length
      ? (map[0] = data.meetingList)
      : (map[0] = data.meetingEditOrAddDtoMemo.map[0]);

    // 保洁委外交班会
    let obj = await CleaningRef.value.getFieldsValue();
    if (obj.grooming) {
      meetingCleaningClassAddOrUpdateDto = {
        ...data.meetingEditOrAddDtoMemo.meetingCleaningClassAddOrUpdateDto,
        ...obj,
      };
    }
    meetingCleaningClassAddOrUpdateDto.cleaningClassMeeting = CleaningRef.value.valueHtml || '无';

    try {
      let Cleaning = await CleaningRef.value.validate();
      console.log(Cleaning);
    } catch (err) {
      current = 'Cleaning';
      console.log(current);
      console.log(err);
      flag = false;
    }
    // 昨日车站运作情况
    meetingOutlineAddOrUpdateDto = {
      ...data.meetingEditOrAddDtoMemo.meetingOutlineAddOrUpdateDto,
      ...(await StationRef.value.getFieldsValue()),
    };
    console.log(meetingOutlineAddOrUpdateDto);
    try {
      let station = await StationRef.value.validate();
      console.log(station);
    } catch (err) {
      console.log(err);
      current = 'station';
      flag = false;
    }

    // 抽问
    askTableListVos = QuestionRef.value.list.filter((item) => {
      return item;
    });

    console.log('askTableListVos', askTableListVos);
    if (current) {
      console.log(current);
      visibleCurrent(current);
    }
    return {
      flag,
      obj: {
        meetingOutlineAddOrUpdateDto,
        meetingCleaningClassAddOrUpdateDto,
        map,
        meetingSafeIdeaAddOrUpdateDto,
        askTableListVos,
      },
    };
  };
  const back = () => {
    router.push('Dashboard');
  };
  onBeforeRouteLeave(async (to, from, next) => {
    let backData = await allSave();
    console.log(backData);
    console.log(JSON.stringify(backData.obj));
    console.log(JSON.stringify(data.meetingEditOrAddDtoMemo));
    console.log(JSON.stringify(backData.obj) == JSON.stringify(data.meetingEditOrAddDtoMemo));
    if (
      backData.flag &&
      JSON.stringify(backData.obj) == JSON.stringify(data.meetingEditOrAddDtoMemo)
    ) {
      next();
    } else {
      if (data.isBack) {
        next();
      } else {
        if (backData.flag) {
          if (JSON.stringify(backData.obj) == JSON.stringify(data.meetingEditOrAddDtoMemo)) {
            next();
          } else {
            next(false);
            createConfirm({
              mask: true,
              iconType: 'warning',
              title: '有未保存内容，是否确认离开页面？',
              okText: '是',
              cancelText: '否',
              onOk: async () => {
                data.isBack = true;
                router.back();
              },
            });
          }
        } else {
          next(false);
          createConfirm({
            mask: true,
            iconType: 'warning',
            title: '有会议必填项未填写，是否确认离开页面？',
            okText: '是',
            cancelText: '否',
            onOk: async () => {
              data.isBack = true;
              router.back();
            },
          });
        }
      }
    }
  });
  onMounted(() => {
    init();
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
        height: 100%;
        padding: 0;
      }
    }
    :deep(.ant-card-body) {
      padding: 0;
    }
    .manipulate {
      display: none;
      float: right;
    }

    .menu-item {
      position: relative;
      &:hover {
        .manipulate {
          display: flex;
        }
      }
    }
  }
  :deep(.ant-menu-item) {
    height: auto !important;
  }
</style>
