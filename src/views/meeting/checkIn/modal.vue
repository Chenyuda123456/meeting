<template>
  <BasicModal @cancel="cancel" @register="register" :useWrapper="true" title="语音签到">
    <div class="p-4" v-if="data.state == 1">
      <a-space>
        <div class="icon-box"><audio-outlined class="icon" /></div>
        <div>
          <div class="name">点击开始后保持安静</div>
          <div class="tip">请签到者说：“我是参会人“姓名”</div>
        </div>
      </a-space>
    </div>
    <div class="p-4" v-if="data.state == 2">
      <a-space>
        <div class="icon-box"><audio-outlined class="icon" /></div>
        <div>
          <div class="name">签到语音识别中....</div>
        </div>
      </a-space>
    </div>
    <template #footer>
      <a-space>
        <a-button type="primary" @click="start" v-if="data.state == 1"> 开始 </a-button>
        <a-button type="primary" @click="cancel(0)" v-if="data.state == 1"> 取消 </a-button>
        <a-button type="primary" @click="cancel(1)" v-if="data.state == 2"> 结束签到 </a-button>
      </a-space>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import PCMPlayer from '../beginMeeting/components/pcm-player';
  import record from '../beginMeeting/record.js';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  import { AudioOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive, onBeforeUnmount } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const globSetting = useGlobSetting();
  const wsUrl = globSetting.wsUrl;
  const emits = defineEmits(['changeList', 'saveList']);
  const props = defineProps(['list']);
  const data: any = reactive({
    state: 1,
    addNameRes: {},
    ws: '',
    recorder: '',
    PCMPlayer: new PCMPlayer({
      encoding: 'bit16Int',
      channels: 1,
      sampleRate: 16000,
      flushTime: 0,
    }),
  });
  const start = () => {
    data.recorder.record.open(
      () => {
        console.log('open------record');
        data.ws = new WebSocket(wsUrl + '/api/websocket/verify/' + route.query.moId);
        data.ws.onopen = () => {};
        data.ws.onclose = () => {
          console.log('onclose');
        };
        data.ws.onerror = () => {
          console.log('onerror');
        };
        data.ws.onmessage = (message) => {
          // userId: '1c4c4e5899df7f9677daf243317b38a1';
          // userName: '1';
          // uvId: 5;
          let msg = JSON.parse(message.data);
          if (msg.code == 0) {
            if (msg.data.userName) {
              let flag = props.list.some((item) => {
                return item.userName === msg.data.userName;
              });
              if (flag) {
                createMessage.success(msg.data.userName + '已经语音签到成功');
              } else {
                createMessage.success(msg.data.userName + '语音签到成功');
                emits('changeList', msg.data);
              }
            } else {
              createMessage.error('语音签到失败');
            }
          } else {
            createMessage.error(msg.msg + msg.data);
          }
        };
        data.state = 2;
        data.recorder.start();
        createMessage.success('开始录音！');
      },
      () => {
        createMessage.error('请检查麦克风是否连接！');
      },
    );
  };
  const cancel = (val) => {
    console.log('cancel');
    data.ws && data.ws.close();
    data.recorder && data.recorder.close();
    closeModal();
    if (val) {
      emits('saveList');
    }
  };
  const [register, { closeModal }] = useModalInner(() => {
    data.state = 1;
    data.recorder = new record((pcm, times) => {
      // const reader = new FileReader();
      // reader.onload = (e: any) => {
      //   console.log(e);
      //   const arrayBuffer = new Int16Array(e.target.result);
      //   console.log(arrayBuffer);
      //   data.PCMPlayer && data.PCMPlayer.feed(arrayBuffer);
      // };
      // reader.readAsArrayBuffer(pcm);
      if (times > 1) {
        data.ws && data.ws.send(pcm);
      }
      // data.PCMPlayer && data.PCMPlayer.feed(pcm);
    });
    data.recorder.init();
  });
  onBeforeUnmount(() => {
    console.log('onBeforeUnmount');
  });
</script>
<style scoped lang="less">
  .box {
    width: 10%;
    text-align: center;
    position: relative;
    padding: 24px 4px;
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
    color: #419df7;
  }
</style>
