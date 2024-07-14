<template>
  <BasicModal @cancel="cancel" @register="register" :useWrapper="true" title="声音注册">
    <div class="p-4" v-if="data.state == 1">
      <a-space>
        <div class="icon-box"><user-outlined class="icon" /></div>
        <div>
          <div class="name">请录入注册者姓名</div>
        </div>
      </a-space>
      <BasicForm @register="registerForm" style="margin-top: 20px" />
    </div>
    <div class="p-4" v-if="data.state == 2">
      <a-space>
        <div class="icon-box"><audio-outlined class="icon" /></div>
        <div>
          <div class="name">请保证安静环境下录制注册人声音</div>
          <div class="tip">请注册者连续说：“我是参会人“姓名”</div>
        </div>
      </a-space>
    </div>
    <div class="p-4" v-if="data.state == 3">
      <a-space>
        <div class="icon-box"><audio-outlined class="icon" /></div>
        <div>
          <div class="name">语音声纹识别中.....</div>
          <div class="tip">保持安静，请注册者说三遍：“我是参会人“姓名”，每一遍间隔2s左右</div>
        </div>
      </a-space>
    </div>
    <div class="p-4" v-if="data.state == 4">
      <a-space>
        <div class="icon-box"><close-circle-outlined class="icon" /></div>
        <div>
          <div class="name">{{ data.userName }}已经存在，无需再次注册</div>
        </div>
      </a-space>
    </div>
    <div class="p-4" v-if="data.state == 5">
      <a-space>
        <div class="icon-box"><close-circle-outlined class="icon" /></div>
        <div>
          <div class="name">{{ data.wsErrMessage }}</div>
        </div>
      </a-space>
    </div>
    <template #footer>
      <a-space>
        <a-button type="primary" @click="saveName" v-if="data.state == 1" :loading="data.loading">
          下一步
        </a-button>
        <a-button type="primary" @click="start" v-if="data.state == 2"> 开始录音 </a-button>
        <a-button
          type="primary"
          :disabled="data.isDisable"
          @click="saveRecord"
          v-if="data.state == 3"
          :loading="data.loading"
        >
          保存录音<span v-if="data.second">（{{ data.second }}）</span>
        </a-button>
        <a-button type="primary" @click="retry" v-if="data.state == 4"> 重试 </a-button>
        <a-button type="primary" @click="retryRecord" v-if="data.state == 5"> 重试 </a-button>
        <a-button @click="cancel"> 取消 </a-button>
      </a-space>
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import record from '../beginMeeting/record.js';
  import { checkName } from '../../../api/meeting/creatMeeting';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();
  import { UserOutlined, AudioOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { reactive } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  const emits = defineEmits(['getList']);
  const globSetting = useGlobSetting();
  const wsUrl = globSetting.wsUrl;
  const schemas: FormSchema[] = [
    {
      field: 'userName',
      component: 'Input',
      label: '姓名',
      required: true,
    },
  ];
  const data: any = reactive({
    isDisable: false,
    second: 0,
    timer: '',
    loading: false,
    state: 1,
    ws: '',
    userName: '',
    wsErrMessage: '',
    recorder: '',
    uuId: '',
    sessionId: 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }),
  });
  const uuIdFn = () => {
    data.uuId = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  const [registerForm, { validateFields }] = useForm({
    labelWidth: 70,
    schemas,
    showActionButtonGroup: false,
  });
  // 启动倒计时
  const countStart = () => {
    data.timer = setInterval(() => {
      if (data.second > 0) {
        data.second--;
        data.second === 0 && countStop();
      } else {
        countStop();
      }
    }, 1000);
  };

  // 关闭倒计时
  const countStop = () => {
    data.timer && clearInterval(data.timer);
    data.isDisable = false;
  };
  const saveName = async () => {
    try {
      const res = await validateFields();
      data.loading = true;
      console.log('passing', res);
      data.userName = res.userName;
      let addNameRes = await checkName(res);
      if (addNameRes) {
        data.state = 2;
      } else {
        data.state = 4;
      }
      data.loading = false;
    } catch (error) {
      console.log('not passing', error);
    }
  };
  const start = () => {
    let obj = JSON.stringify({
      status: 0,
    });
    data.ws.send(obj);
    data.second = 15;
    data.isDisable = true;
    data.state = 3;
    countStart();
    data.recorder.start();
    createMessage.success('开始录音！');
  };
  const saveRecord = () => {
    data.loading = true;
    uuIdFn();
    let obj = JSON.stringify({
      status: 1,
      userId: data.uuId,
      userName: data.userName,
      sessionId: data.sessionId,
    });
    data.ws.send(obj);
    data.recorder.stop();
  };
  const retry = () => {
    data.state = 1;
  };
  const retryRecord = async () => {
    data.state = 1;
  };
  const cancel = () => {
    data.ws && data.ws.close();
    data.recorder && data.recorder.close();
    emits('getList');
    countStop();
    closeModal();
  };
  const [register, { closeModal }] = useModalInner(() => {
    uuIdFn();
    data.loading = false;
    data.state = 1;
    console.log('useModalInner');
    data.ws = new WebSocket(wsUrl + '/api/websocket/VprRegister/' + data.sessionId);
    data.ws.onopen = () => {};
    data.ws.onclose = () => {
      console.log('onclose');
    };
    data.ws.onerror = () => {
      console.log('onerror');
    };
    data.ws.onmessage = (message) => {
      let msg = JSON.parse(message.data);
      console.log(msg);
      if (msg.code == 0) {
        createMessage.success(msg.message);
        cancel();
      } else if (msg.code == 1) {
        data.wsErrMessage = msg.message;
        data.state = 5;
      } else {
        data.state = 5;
        data.wsErrMessage = msg.msg;
      }
      data.recorder.stop();
      data.loading = false;
    };

    data.recorder = new record((pcm) => {
      data.ws && data.ws.send(pcm);
    });
    data.recorder.init();
    data.recorder.record.open(
      () => {
        console.log('data.recorder.record.open');
      },
      () => {
        createMessage.error('请检查麦克风是否连接！');
      },
    );
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
