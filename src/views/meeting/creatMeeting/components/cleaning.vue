<template>
  <div class="p-4" style="height: 100%; box-sizing: border-box">
    <BasicForm @register="register" />
    <div class="WangEditor-box">
      <WangEditor
        v-if="props.rightVisible == 'Cleaning'"
        class="wangEditor"
        :valueHtml="valueHtml"
        ref="WangEditorRef"
        @changeHtml="changeHtml"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import WangEditor from './wangEditor.vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  //需要使用到的音频格式编码引擎的js文件统统加载进来，这些引擎文件会比较大
  import { nextTick, watch, ref } from 'vue';
  const props = defineProps(['meetingEditOrAddDto', 'rightVisible']);
  const WangEditorRef = ref();

  const [register, { validate, setFieldsValue, getFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: [
      {
        field: 'grooming',
        component: 'Input',
        label: '仪容仪表',
        required: true,
        defaultValue: null,
        colProps: {
          span: 24,
        },
        componentProps: {
          onChange: (e: any) => {
            console.log(e);
          },
        },
      },
    ],
    showActionButtonGroup: false,
  });
  const valueHtml = ref();
  const changeHtml = (val) => {
    valueHtml.value = val.value;
  };
  watch(
    () => props.meetingEditOrAddDto,
    (val) => {
      nextTick(() => {
        if (val.meetingCleaningClassAddOrUpdateDto) {
          valueHtml.value = val.meetingCleaningClassAddOrUpdateDto.cleaningClassMeeting;
          if (val.meetingCleaningClassAddOrUpdateDto.grooming) {
            setFieldsValue({
              grooming: val.meetingCleaningClassAddOrUpdateDto.grooming,
            });
          }
        }
      });
    },
    {
      deep: true,
      immediate: true,
    },
  );
  defineExpose({ validate, getFieldsValue, valueHtml });
</script>

<style lang="less" scoped>
  .WangEditor-box {
    height: calc(100% - 50px);
  }
</style>
