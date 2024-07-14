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
      >五、安全预想</a-divider
    >
    <div class="item">
      <div>值站：{{ props.security.stationDuty }}</div>
    </div>
    <div class="item">
      <div>客值：{{ props.security.afcDuty }}</div>
    </div>
    <div class="item">
      <div>客服：{{ props.security.administrativeDuty }}</div>
    </div>
    <div class="item">
      <div>行值：{{ props.security.platformDuty }}</div>
    </div>
    <div class="item">
      <div>站台：{{ props.security.passengerDuty }}</div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['security']);
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
