<template>
  <div class="translate-top" v-if="props.isEdit" v-loading="loadingRef" loading-tip="加载中...">
    <div class="left">
      <pause-circle-two-tone @click="clickPause" v-if="barData.isStart" />
      <play-circle-two-tone @click="clickPlay" v-else />
    </div>
    <div class="play-box">
      <div
        ref="container"
        class="progress"
        @click="containerClick"
        @mousedown="containerMousedown"
        @mouseup="containerMouseup"
        @mouseout="containerMouseout"
      >
      </div>
      <div class="first-face">
        <div ref="progress_bar" class="bar"></div>
        <span ref="pip" class="pip"></span> </div
    ></div>
    <div class="right">
      <span>{{ barData.currentTime }}</span
      >/<span>{{ barData.allTime }}</span>
    </div>
  </div>
</template>

<script setup>
  import { PlayCircleTwoTone, PauseCircleTwoTone } from '@ant-design/icons-vue';
  import { onUnmounted, reactive, ref, nextTick, onMounted, watch } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import PCMPlayer from './pcm-player.js';
  import axios from 'axios';
  const globSetting = useGlobSetting();
  const wsUrl = globSetting.wsUrl;
  const props = defineProps(['objectId', 'isEdit']);
  const pcmPlay = ref();
  const streamUrl = globSetting.streamUrl;
  const loadingRef = ref(false);
  // 下载
  const wsDown = ref();
  const pip = ref();
  const progress_bar = ref();
  const container = ref();
  const barData = reactive({
    once: false,
    isStart: false,
    rate: 0,
    progressWidth: 0,
    allSecond: 0,
    currentSecond: 0,
    allTime: '00:00:00',
    currentTime: '00:00:00',
    isClick: false,
    contentLength: 0,
    baseLength: 8192,
    timer: '',
  });
  watch(
    () => loadingRef.value,
    (val) => {
      if (!val) {
        beginTime();
      }
    },
  );

  const getInfo = () => {
    // 获取音频
    axios.head(streamUrl + '/audio/stream/v1?objectId=' + props.objectId, {}).then((res) => {
      barData.contentLength = res.headers['content-length'];
      barData.allSecond = Math.ceil(barData.contentLength / 2 / 16000);
      barData.allTime = timediff(barData.allSecond);
    });
  };
  const openWsDown = () => {
    barData.once = true;
    closeWsDown();
    loadingRef.value = true;
    setTimeout(() => {
      wsDown.value = new WebSocket(wsUrl + '/api/websocket/transData');
      wsDown.value.onopen = () => {
        pcmPlay.value = new PCMPlayer({
          encoding: 'bit16Int',
          channels: 1,
          sampleRate: 16000,
          flushTime: 0,
        });
        let current = Math.ceil((barData.contentLength * barData.rate) / 8129);
        let obj = JSON.stringify({
          jsonrpc: '2.0',
          method: 'read',
          params: {
            objectId: props.objectId,
            source: 'file',
            chunkOffset: current,
          },
          id: 1,
        });
        wsDown.value && wsDown.value.send(obj);
      };
      wsDown.value.onclose = () => {
        console.log('onclose');
      };
      wsDown.value.onerror = () => {
        console.log('onerror');
      };
      wsDown.value.onmessage = (message) => {
        loadingRef.value = false;
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = new Int16Array(e.target.result);
          pcmPlay.value && pcmPlay.value.feed(arrayBuffer);
        };
        reader.readAsArrayBuffer(message.data);
      };
    }, 2000);
  };
  const closeWsDown = () => {
    wsDown.value && wsDown.value.close();
  };

  const destroyAutoTimeAndPCMPlayer = () => {
    console.log('destroyAutoTimeAndPCMPlayer');
    clearInterval(barData.timer);
    pcmPlay.value.destroy();
  };
  const beginTime = () => {
    barData.timer = setInterval(() => {
      barData.currentSecond += 1;
      barData.currentTime = timediff(barData.currentSecond);
      barData.rate = (barData.currentSecond / barData.allSecond).toFixed(2);
      barStyle((barData.progressWidth * barData.rate).toFixed(2));
      if (barData.currentSecond >= barData.allSecond) {
        clearInterval(barData.timer);
        barData.isStart = false;
      }
    }, 1000);
  };
  const timediff = (remain) => {
    //计算小时数
    var remain = remain % 86400;
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
  const clickPlay = () => {
    if (barData.currentSecond >= barData.allSecond) {
      clearInterval(barData.timer);
      barData.currentSecond = 0;
      barData.currentTime = '00:00:00';
      barData.rate = 0;
      barStyle(0);
    }
    barData.isStart = true;
    if (barData.once) {
      beginTime();
      pcmPlay.value.continue();
    } else {
      openWsDown();
    }
  };
  const clickPause = () => {
    barData.isStart = false;
    clearInterval(barData.timer);
    if (barData.once) {
      pcmPlay.value.pause();
    } else {
      destroyAutoTimeAndPCMPlayer();
    }
  };
  const containerMousedown = () => {
    if (container.value) {
      container.value.onmousemove = function (event) {
        clearInterval(barData.timer);
        barData.isClick = true;
        mouseRate(event.offsetX);
        barStyle(event.offsetX);
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
      };
    }
  };
  const containerMouseup = (event) => {
    barData.isClick = false;
    container.value.onmousemove = null;
    mouseRate(event.offsetX);
    barStyle(event.offsetX);
    if (barData.isStart) {
      destroyAutoTimeAndPCMPlayer();
      setTimeout(() => {
        openWsDown();
      }, 1000);
    }
  };
  const containerMouseout = (event) => {
    if (barData.isClick) {
      container.value.onmousemove = null;
      barStyle(event.offsetX);
      if (barData.isStart) {
        console.log('containerMouseout');
        destroyAutoTimeAndPCMPlayer();
        nextTick(() => {
          openWsDown();
        });
      }
    }
    barData.isClick = false;
  };
  const containerClick = (event) => {
    barStyle(event.offsetX);
    mouseRate(event.offsetX);
  };
  document.onmouseup = function (event) {
    barData.isClick = false;
    event.stopPropagation();
    if (container.value) {
      container.value.onmousemove = null;
    }
  };
  const mouseRate = (val) => {
    barData.rate = (val / barData.progressWidth).toFixed(2);
    barData.currentSecond = Math.ceil(barData.allSecond * barData.rate);
    barData.currentTime = timediff(barData.currentSecond);
  };
  const barStyle = (val) => {
    progress_bar.value.style.width = val + 'px';
    pip.value.style.left = val - 8 + 'px';
  };
  onMounted(() => {
    if (container.value) {
      barData.progressWidth = container.value.offsetWidth;
    }
  });
  onUnmounted(() => {
    closeWsDown();
    pcmPlay.value && pcmPlay.value.destroy();
    document.onmouseup = null;
    clearInterval(barData.timer);
  });
  defineExpose({ getInfo });
</script>

<style scoped lang="less">
  .translate-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .play-box {
      flex: 1;
      position: relative;
    }
    .left {
      font-size: 30px;
      margin: 14px;
    }
    .right {
      color: #999;
      font-size: 12px;
      width: 120px;
      text-align: center;
      margin-left: 8px;
    }
  }
  .first-face {
    display: flex;
    align-items: center;
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background-color: #e7e7e7;
    position: relative;
  }
  /* OTHER STYLES */

  .progress {
    cursor: pointer;
    width: 100%;
    position: absolute;
    height: 4px;
    border-radius: 4px;
    z-index: 66666;
    padding: 14px 0;
    margin-top: -14px;
  }

  .pip {
    z-index: 999;
    position: absolute;
    display: block;
    cursor: pointer;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 1px #ddd solid;
    box-sizing: border-box;
  }

  .pip:hover {
    border-color: #f7b824;
  }

  .bar {
    background: #1890ff;
    width: 0;
    height: 4px;
    border-radius: 4px;
  }
</style>
