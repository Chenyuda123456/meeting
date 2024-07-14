<template>
  <div class="station">
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
      >六、抽问</a-divider
    >
    <div class="item" v-for="(item, index) of props.question" :key="index">
      <div>{{ index + 1 }}：{{ item.content }}</div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['question']);
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
