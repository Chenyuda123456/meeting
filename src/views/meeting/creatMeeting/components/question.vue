<template>
  <div class="p-4">
    <a-divider
      type="vertical"
      style="
        height: 16px;
        font-size: 16px;
        line-height: 16px;
        border-left: 4px solid #1890ff;
        margin: 30px;
      "
      >抽问</a-divider
    >
    <div v-for="(item, index) of list" :key="index" class="list-item mt10">
      <a-row>
        <a-col :span="1" class="align-center justify-center" style="display: flex !important">
          <span style="margin-top: 6px"> {{ index + 1 }}. </span>
        </a-col>
        <a-col :span="18">
          <a-input v-model:value="item.content" />
        </a-col>
        <!--        删除-->
        <a-col><a-button @click="del(index)" type="text" danger /></a-col>
      </a-row>
    </div>
    <a-row class="mt18 list-item">
      <a-col :span="2">
        <a-button type="link" @click="add">
          <plus-circle-outlined />
          新增抽问</a-button
        >
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts" setup>
  import { PlusCircleOutlined } from '@ant-design/icons-vue';
  import { nextTick, ref, watch } from 'vue';
  const props = defineProps(['meetingEditOrAddDto']);
  const list: any = ref([]);
  watch(
    () => props.meetingEditOrAddDto,
    () => {
      nextTick(() => {
        list.value = props.meetingEditOrAddDto.askTableListVos;
      });
    },
    {
      deep: true,
      immediate: true,
    },
  );
  const add = () => {
    list.value.push({
      content: '',
    });
  };

  const del = (index) => {
    list.value.splice(index, 1);
  };
  defineExpose({ list });
</script>
<style scoped>
  .list-item {
    margin-left: 12px;
  }
</style>
