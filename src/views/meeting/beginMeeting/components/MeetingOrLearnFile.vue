<template>
  <div class="station">
    <div v-if="type == 'meeting' || props.isEdit">
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
        >{{ '三、会议内容' }}</a-divider
      >
      <div v-for="(item, index) of props.meetingOrLearnFile[0]" :key="index">
        <div v-if="item.title" v-show="index == props.index || props.isEdit">
          <div class="item">{{ index + 1 }}：{{ item.title }}</div>
          <div class="item" v-html="item.content"></div>
        </div>
      </div>
    </div>
    <div v-if="type !== 'meeting' || props.isEdit">
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
        >{{ '四、学习文件' }}</a-divider
      >
      <div v-for="(item, index) of props.meetingOrLearnFile[1]" :key="index">
        <div v-if="item.title" v-show="index == props.index || props.isEdit">
          <div class="item">{{ index + 1 }}：{{ item.title }}</div>
          <div class="item" v-html="item.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['meetingOrLearnFile', 'type', 'index', 'isEdit']);
</script>

<style scoped lang="less">
  .item {
    margin-bottom: 20px !important;
    margin-left: 30px;
    display: flex;
    flex-wrap: wrap;
    > div {
      margin-right: 20px;
    }
  }
</style>
