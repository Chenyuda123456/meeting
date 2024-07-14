<template>
  <div class="record" style="height: 100%; overflow: auto" ref="recordRem">
    <Player ref="PlayerRef" :objectId="data.objectId" :isEdit="props.isEdit" />
    <div v-for="(item, index) in data.renderData" :key="index" :id="item.type">
      <div v-show="data.renderType.includes(item.type) || props.isEdit">
        <a-divider
          type="vertical"
          style="
            height: 16px;
            font-size: 16px;
            line-height: 16px;
            border-left: 4px solid #fff;
            margin: 24px 8px;
            padding: 0;
          "
          >{{ item.title }}</a-divider
        >
        <div v-if="item.type == 'security'" class="security-box">
          <div class="security-item"
            >值站<span>{{
              meetingEditOrAddDto.meetingSafeIdeaAddOrUpdateDto.stationDuty
            }}</span></div
          >
          <div class="security-item"
            >客值<span>{{ meetingEditOrAddDto.meetingSafeIdeaAddOrUpdateDto.afcDuty }}</span></div
          >
          <div class="security-item"
            >行值<span>{{
              meetingEditOrAddDto.meetingSafeIdeaAddOrUpdateDto.administrativeDuty
            }}</span></div
          >
          <div class="security-item"
            >站台<span>{{
              meetingEditOrAddDto.meetingSafeIdeaAddOrUpdateDto.platformDuty
            }}</span></div
          >
          <div class="security-item"
            >客服<span>{{
              meetingEditOrAddDto.meetingSafeIdeaAddOrUpdateDto.passengerDuty
            }}</span></div
          >
        </div>
        <div v-if="item.type == 'question'">
          <div class="question-box">
            <div
              class="question-item"
              v-for="(item, index) of meetingEditOrAddDto.askTableListVos"
              :key="index"
            >
              {{ item.content }}
            </div>
          </div>
        </div>
        <div class="item flex" v-for="(listItem, indexList) of item.list" :key="indexList">
          <div class="icon-box"><user-outlined style="width: 30px" class="icon" /></div>
          <div style="flex: 1; padding-right: 30px">
            <div class="endTimeVal">{{ listItem.createTime }}</div>
            <div class="content">
              <div :class="props.isEdit ? '' : 'fake'">{{ listItem.content }}</div>
              <a-textarea
                v-if="!props.isEdit"
                @change="textareaChange(listItem, item.list, indexList)"
                style="resize: none"
                :bordered="false"
                v-model:value="listItem.content"
                :rows="1"
              />
            </div>
          </div>
        </div>
        <div
          class="child item"
          v-for="(per, ind) in item.child"
          :key="ind"
          v-show="data.renderType.includes(item.type + ind) || props.isEdit"
        >
          <div :id="item.type + ind">
            <div class="small-title" v-if="per.title">{{ ind + 1 }}.{{ per.title }}</div>
            <div v-for="(listPer, indexPer) of per.list" :key="indexPer">
              <div class="flex">
                <div class="icon-box"><user-outlined style="width: 30px" class="icon" /></div>
                <div>
                  <div class="endTimeVal">{{ listPer.createTime }}</div>
                  <div class="content">
                    <div class="fake">{{ listPer.content }}</div>
                    <a-textarea
                      @change="textareaChange(listPer, per.list, indexPer)"
                      style="resize: none"
                      :bordered="false"
                      v-model:value="listPer.content"
                      :rows="1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import record from '../record.js';
  import Player from './player.vue';
  import dayjs from 'dayjs';
  import { UserOutlined } from '@ant-design/icons-vue';
  import { onMounted, onUnmounted, reactive, watch, ref, nextTick } from 'vue';
  import { getAllSpeech } from '../../../../api/meeting/creatMeeting';
  import { useMessage } from '../../../../hooks/web/useMessage';
  import { useGlobSetting } from '/@/hooks/setting';
  const { createMessage } = useMessage();
  const globSetting = useGlobSetting();
  const wsUrl = globSetting.wsUrl;
  const PlayerRef = ref();
  const props = defineProps([
    'type',
    'index',
    'childData',
    'isEdit',
    'mrId',
    'moId',
    'meetingEditOrAddDto',
  ]);
  const recordRem = ref('recordRem');

  // 0 代表说完了
  // 8 代表没说完
  const isOver = ref(0);
  // 上传ws
  const ws = ref();

  const recorder = ref(
    new record((pcm) => {
      ws.value && ws.value.send(pcm);
    }),
  );

  const data = reactive({
    uuId: '',
    // wav
    url: '',
    // pcm
    objectId: '',
    renderType: ['station'],
    renderDataFlag: 0,
    renderData: [
      {
        type: 'station',
        title: '一、昨日车站运作情况',
        list: [],
        child: [],
      },
      {
        type: 'cleaning',
        title: '二、保洁委外交班会',
        list: [],
        child: [],
      },
      {
        type: 'meeting',
        title: '三、会议内容',
        list: [],
        child: [],
      },
      {
        type: 'learnFile',
        title: '四、学习文件',
        list: [],
        child: [],
      },
      {
        type: 'security',
        title: '五、安全预想',
        list: [],
        child: [],
      },
      {
        type: 'question',
        title: '六、抽问',
        list: [],
        child: [],
      },
    ],
  });
  // 清除空格
  const textareaChange = (val, list, index) => {
    val.content = val.content.replace(/\s*/g, '');
    if (val.content == '') {
      list.splice(index, 1);
    }
  };
  // 定位当前类型是数据第几个
  const getCurrentIndex = (name) => {
    return data.renderData.findIndex((item) => {
      return item.type == name;
    });
  };

  const autoScroll = (id, isAuto) => {
    let tag = document.querySelector('#' + id);
    if (isAuto) {
      recordRem.value.scrollTop = tag.offsetTop + tag.offsetHeight - 40;
    } else {
      recordRem.value.scrollTop = tag.offsetTop - 80;
    }
  };

  // 监听类型 显示 对应步骤的 数据
  watch(
    () => props.type,
    (val) => {
      data.renderType = [...data.renderType, ...[val]];
      nextTick(() => {
        autoScroll(val);
      });
    },
  );
  // 监听 index 显示 对应步骤的 child
  watch(
    () => props.index,
    (val) => {
      console.log(props.type);
      if (val !== null) {
        if (props.type == 'meeting' || props.type == 'learnFile') {
          data.renderType = [...data.renderType, ...[props.type + val]];
          nextTick(() => {
            autoScroll(props.type + val);
          });
        }
      }
    },
  );

  // 初始化 会议和学习文件的 child
  watch(
    () => props.childData,
    (val) => {
      console.log(getCurrentIndex('meeting'));
      data.renderData[getCurrentIndex('meeting')].child = val[0].map((item, index) => {
        return {
          ocId: item.ocId,
          title: item.title,
          type: 'meeting' + index,
          list: [],
        };
      });
      data.renderData[getCurrentIndex('learnFile')].child = val[1].map((item, index) => {
        return {
          ocId: item.ocId,
          title: item.title,
          type: 'learnFile' + index,
          list: [],
        };
      });
    },
    {
      deep: true,
      immediate: true,
    },
  );
  const openWs = () => {
    if (!data.uuId) {
      data.uuId = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    ws.value = new WebSocket(wsUrl + '/api/websocket/' + data.uuId);
    ws.value.onopen = () => {};
    ws.value.onclose = () => {
      console.log('onclose');
      // reconnect();
    };
    ws.value.onerror = () => {
      console.log('onerror');
    };
    ws.value.onmessage = (message) => {
      let msg = JSON.parse(message.data);
      console.log(msg);
      let index = getCurrentIndex(props.type);
      if (isOver.value == 0 && msg.data.replace(/\s*/g, '') != '') {
        console.log(isOver.value);
        data.renderDataFlag += 1;
        console.log(data.renderDataFlag);
        if (props.type == 'meeting' && props.index !== null) {
          data.renderData[index].child[props.index].list.push({
            speaker: '',
            content: msg.data.replace(/\s*/g, ''),
            createTime: dayjs().format('HH:mm:ss'),
            endTime: dayjs().format('HH:mm:ss'),
            renderDataFlag: data.renderDataFlag,
          });
          nextTick(() => {
            autoScroll(props.type + props.index, true);
          });
        } else if (props.type == 'learnFile' && props.index !== null) {
          data.renderData[index].child[props.index].list.push({
            speaker: '',
            content: msg.data.replace(/\s*/g, ''),
            createTime: dayjs().format('HH:mm:ss'),
            endTime: dayjs().format('HH:mm:ss'),
            renderDataFlag: data.renderDataFlag,
          });
          nextTick(() => {
            autoScroll(props.type + props.index, true);
          });
        } else {
          console.log(data.renderDataFlag);
          data.renderData[index].list.push({
            speaker: '',
            content: msg.data.replace(/\s*/g, ''),
            createTime: dayjs().format('HH:mm:ss'),
            endTime: dayjs().format('HH:mm:ss'),
            renderDataFlag: data.renderDataFlag,
          });
          nextTick(() => {
            autoScroll(props.type, true);
          });
        }
      } else {
        nextTick(() => {
          if (props.type == 'meeting' && props.index !== null) {
            let currentIndex = data.renderData[index].child[props.index].list.length - 1;
            if (
              data.renderData[index].child[props.index].list[currentIndex] &&
              data.renderData[index].child[props.index].list[currentIndex].renderDataFlag ==
                data.renderDataFlag
            ) {
              data.renderData[index].child[props.index].list[currentIndex].content = msg.data;
            } else {
              insertSpeak(msg.data);
            }
          } else if (props.type == 'learnFile' && props.index !== null) {
            let currentIndex = data.renderData[index].child[props.index].list.length - 1;
            if (
              data.renderData[index].child[props.index].list[currentIndex] &&
              data.renderData[index].child[props.index].list[currentIndex].renderDataFlag ==
                data.renderDataFlag
            ) {
              data.renderData[index].child[props.index].list[currentIndex].content = msg.data;
            } else {
              insertSpeak(msg.data);
            }
          } else {
            if (
              data.renderData[index].list[data.renderData[index].list.length - 1] &&
              data.renderData[index].list[data.renderData[index].list.length - 1].renderDataFlag ==
                data.renderDataFlag
            ) {
              data.renderData[index].list[data.renderData[index].list.length - 1].content =
                msg.data;
            } else {
              insertSpeak(msg.data);
            }
          }
        });
      }
      setLocal();
      isOver.value = msg.code;
    };
  };
  // 为了 最后 下一步 不更新 数据问题
  const insertSpeak = (content) => {
    let obj = {};
    data.renderData.find((item) => {
      item.list.find((child) => {
        if (child.renderDataFlag == data.renderDataFlag) {
          obj = child;
          console.log(child);
        }
      });
      item.child.find((second) => {
        second.list.find((child) => {
          if (child.renderDataFlag == data.renderDataFlag) {
            obj = child;
            console.log(child);
          }
        });
      });
    });
    console.log(obj);
    obj.content = content;
  };
  const closeWs = () => {
    ws.value && ws.value.close && ws.value.close();
    recorder.value && recorder.value.close && recorder.value.close();
  };

  // 获取所有说话的 数据
  const getAllspeack = async () => {
    let res = await getAllSpeech({
      mrId: Number(props.mrId),
      moId: Number(props.moId),
    });
    console.log(res);
    data.renderData[0].list = res.stations;
    data.renderData[1].list = res.clean.list;
    data.renderData[2].child = res.outlineViewVos;
    data.renderData[3].child = res.fileLearnViewVos;
    data.renderData[4].list = res.safe.list;
    data.renderData[5].list = res.askViewsVo.list;
    data.objectId = res.objectId;
    nextTick(() => {
      PlayerRef.value.getInfo();
    });
  };

  // 格式化记录
  // 类型
  // * 1.车站运作情况
  // * 2.委外交接班会议内容
  // * 3.会议内容.
  // * 4.文件学习
  // * 5.安全预想
  // * 6.抽问
  const getSubmitList = () => {
    let list = [];
    console.log(data.renderData);
    data.renderData.forEach((item, index) => {
      item.list.some((oneList) => {
        oneList.mrId = props.mrId;
        oneList.type = index + 1;
        list.push(oneList);
      });
      item.child.forEach((per, ind) => {
        per.list.some((childList) => {
          childList.mrId = props.mrId;
          childList.type = index + 1;
          childList.ocId = item.child[ind].ocId;
          list.push(childList);
        });
      });
    });
    return list;
  };
  // 实时储存本地数据
  const setLocal = () => {
    if (!props.isEdit) {
      let obj = {};
      obj.moId = props.moId;
      obj.type = props.type;
      obj.index = props.index;
      obj.data = data;
      window.localStorage.setItem('recordMeeting' + props.moId, JSON.stringify(obj));
    }
  };

  onMounted(() => {
    if (!props.isEdit) {
      recorder.value.init();
      recorder.value.record.open(
        () => {
          recorder.value.start();
          createMessage.success('开始录音转写！');
        },
        () => {
          createMessage.error('请检查麦克风是否连接！');
        },
      );
    }
  });
  onUnmounted(() => {
    closeWs();
  });
  defineExpose({ getSubmitList, openWs, closeWs, getAllspeack, data });
</script>

<style scoped lang="less">
  .item {
    margin-bottom: 10px;
    margin-left: 30px;
    .icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #1890ff;
      color: #fff;
      font-size: 18px;
      width: 30px;
      height: 30px;
      margin-right: 20px;
    }
    .small-title {
      margin-bottom: 20px;
    }
    .content {
      position: relative;
    }
    /deep/ textarea.ant-input {
      position: absolute;
      z-index: 2;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
    }
  }
  .fake {
    visibility: hidden;
    height: auto;
    min-height: 32px;
    line-height: 1.5715;
    vertical-align: bottom;
    transition: all 0.3s, height 0s;
    padding: 6px 14px;
  }
  .audio-player {
    margin-top: 12px;
    /deep/ .audio__notice {
      display: none !important;
    }
    display: flex !important;
    align-items: center;
    /deep/.audio__progress-wrap {
      flex: 1;
      margin-top: 0px;
      margin-right: 16px;
    }
    /deep/.audio__time-wrap {
      width: 70px;
      margin-right: 16px;
      margin-top: -1px;
    }
    /deep/ .audio__current-time {
      position: relative;
      margin-right: 12px;
      &:after {
        content: '/';
        position: absolute;
        right: -9px;
        font-size: 14px;
        color: #999;
        top: -2px;
      }
    }
  }
  .security-box {
    display: flex;
    flex-wrap: wrap;
    margin-left: 30px;
    margin-bottom: 12px;
    line-height: 1.6em;
    > div {
      margin-right: 20px;
      span {
        color: #999;
      }
    }
  }
  .question-box {
    display: flex;
    flex-wrap: wrap;
    margin-left: 30px;
    margin-bottom: 12px;
    line-height: 1.6em;
    > div {
      margin-right: 20px;
    }
  }
</style>
