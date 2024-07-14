<template>
  <div class="p-4">
    <BasicForm
      @register="register"
      :showActionButtonGroup="false"
      autoFocusFirstItem
      :labelWidth="100"
      :schemas="schemas"
      :actionColOptions="{ span: 24 }"
    />
  </div>
</template>
<script lang="ts" setup>
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { nextTick, watch } from 'vue';
  const props = defineProps(['meetingEditOrAddDto']);
  const [register, { validate, setFieldsValue, getFieldsValue }] = useForm({});
  const schemas: FormSchema[] = [
    {
      field: 'divider-api-select',
      component: 'Divider',
      label: '安全预想',
      colProps: {
        span: 24,
      },
      componentProps: {
        type: 'vertical',
        style:
          'height: 16px;font-size:16px;line-height:16px;border-left: 4px solid #1890ff;margin:30px',
      },
    },
    {
      field: 'stationDuty',
      component: 'Input',
      label: '值站',
      required: true,
      colProps: {
        span: 24,
      },
      componentProps: {
        onChange: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'afcDuty',
      component: 'Input',
      label: '客值',
      required: true,
      colProps: {
        span: 24,
      },
      componentProps: {
        onChange: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'administrativeDuty',
      component: 'Input',
      label: '行值',
      required: true,
      colProps: {
        span: 24,
      },
      componentProps: {
        onChange: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'platformDuty',
      component: 'Input',
      label: '站台',
      required: true,
      colProps: {
        span: 24,
      },
      componentProps: {
        onChange: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'passengerDuty',
      component: 'Input',
      label: '客服',
      required: true,
      colProps: {
        span: 24,
      },
      componentProps: {
        onChange: (e: any) => {
          console.log(e);
        },
      },
    },
  ];
  watch(
    () => props.meetingEditOrAddDto,
    () => {
      nextTick(() => {
        if (
          props.meetingEditOrAddDto.meetingSafeIdeaAddOrUpdateDto &&
          props.meetingEditOrAddDto.meetingSafeIdeaAddOrUpdateDto.stationDuty
        ) {
          setFieldsValue(props.meetingEditOrAddDto.meetingSafeIdeaAddOrUpdateDto);
        }
      });
    },
    {
      deep: true,
      immediate: true,
    },
  );
  defineExpose({ validate, getFieldsValue });
</script>
<style>
  .vben-basic-form .ant-form-item.suffix-item .ant-form-item-control {
    margin-top: 0;
  }
</style>
