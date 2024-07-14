import Recorder from 'recorder-core';
import 'recorder-core/src/engine/wav.js';
//需要使用到的音频格式编码引擎的js文件统统加载进来，这些引擎文件会比较大
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';
class record {
  constructor(callback) {
    this.record = null;
    this.testSampleRate = 16000;
    this.SendInterval = 40;
    this.realTimeSendTryTime = 0;
    this.realTimeSendTryChunk = null;
    this.times = 0;
    this.set = {
      type: 'mp3', //输出类型：mp3,wav等，使用一个类型前需要先引入对应的编码引擎
      bitRate: 16, //比特率，必须是数字 wav(位):16、8，MP3(单位kbps)：8kbps时文件大小1k/s，16kbps 2k/s，录音文件很小
      sampleRate: 16000, //采样率，必须是数字，wav格式（8位）文件大小=sampleRate*时间；mp3此项对低比特率文件大小有影响，高比特率几乎无影响。
      //wav任意值，mp3取值范围：48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000
      onProcess: (buffers, bufferSampleRate) => {
        var t1 = Date.now();
        if (this.realTimeSendTryTime == 0) {
          this.realTimeSendTryTime = t1;
          this.realTimeSendTryChunk = null;
        }
        if (t1 - this.realTimeSendTryTime < this.SendInterval) {
          return; //控制缓冲达到指定间隔才进行传输
        }
        this.times += 1;
        this.realTimeSendTryTime = t1;

        var pcm = [];
        if (buffers.length > 0) {
          //借用SampleData函数进行数据的连续处理，采样率转换是顺带的，得到新的pcm数据
          var chunk = Recorder.SampleData(
            buffers,
            bufferSampleRate,
            this.testSampleRate,
            this.realTimeSendTryChunk,
          );
          //清理已处理完的缓冲数据，释放内存以支持长时间录音，最后完成录音时不能调用stop，因为数据已经被清掉了
          for (
            let i = this.realTimeSendTryChunk ? this.realTimeSendTryChunk.index : 0;
            i < chunk.index;
            i++
          ) {
            buffers[i] = null;
          }
          this.realTimeSendTryChunk = chunk; //此时的chunk.data就是原始的音频16位pcm数据（小端LE），直接保存即为16位pcm文件、加个wav头即为wav文件、丢给mp3编码器转一下码即为mp3文件
          pcm = chunk.data;
        }
        // console.log(JSON.stringify(pcm));
        // data.ws.send(pcm);
        this.callback && this.callback(pcm, this.times);
      },
    };
    this.callback = callback;
  }
  init() {
    this.times = 0;
    this.record = Recorder(this.set);
  }
  start() {
    this.times = 0;
    this.realTimeSendTryTime = 0;
    this.realTimeSendTryChunk = null;
    this.record.start();
  }
  stop() {
    this.record.stop();
    this.times = 0;
    this.realTimeSendTryTime = 0;
    this.realTimeSendTryChunk = null;
  }
  pause() {
    this.times = 0;
    this.record.pause();
  }
  resume() {
    this.record.resume();
  }
  close() {
    this.record && this.record.close();
  }
}
export default record;
