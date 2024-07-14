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
      >一、昨日车站运作情况</a-divider
    >
    <div class="item">
      <div>1、保安、保洁问题反馈</div>
      <div>保安：{{ props.station.securityIssues }}</div>
      <div>保洁：{{ props.station.cleanerIssues }}</div>
    </div>
    <div class="item">
      <div>2、昨日客流</div>
      <div>进站：{{ props.station.pitStops }}</div>
      <div>出站：{{ props.station.outbound }}</div>
      <div>小时进：{{ props.station.hourPitStops }} {{ props.station.hourPitStopsCount }}</div>
      <div>小时出：{{ props.station.hourOutbound }} {{ props.station.hourOutboundCount }}</div>
      <div>营收：￥{{ props.station.revenue }}</div>
    </div>
    <div class="item">
      <div>3、其他</div>
      <div>故障：{{ props.station.accident }}</div>
      <div>施工{{ props.station.construction }}</div>
      <div>突发事件：{{ props.station.emergencies }}</div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['station']);
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
