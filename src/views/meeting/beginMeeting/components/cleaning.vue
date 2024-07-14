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
      >二、保洁委外交班会</a-divider
    >
    <div class="item">
      <div>仪容仪表：{{ props.cleaning.grooming }}</div>
    </div>
    <div class="item" v-html="props.cleaning.cleaningClassMeeting"> </div>
  </div>
</template>

<script setup>
  const props = defineProps(['cleaning']);
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
