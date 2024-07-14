<template>
  <div class="p-4">
    <BasicForm @register="register" />
  </div>
</template>
<script lang="ts" setup>
  import axios from 'axios';
  import { watch, onMounted, nextTick } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemas } from './schemas/station.ts';
  import { listDictModel } from '../../../../api/meeting/creatMeeting';
  const props = defineProps(['meetingEditOrAddDto']);
  import { useGlobSetting } from '/@/hooks/setting';
  const globSetting = useGlobSetting();
  const stationUrl = globSetting.stationUrl;
  const [register, { validate, setFieldsValue, updateSchema, getFieldsValue }] = useForm({
    labelWidth: 100,
    schemas,
    showActionButtonGroup: false,
  });
  watch(
    () => props.meetingEditOrAddDto,
    () => {
      nextTick(() => {
        if (
          props.meetingEditOrAddDto.meetingOutlineAddOrUpdateDto &&
          props.meetingEditOrAddDto.meetingOutlineAddOrUpdateDto.stationName
        ) {
          setFieldsValue(props.meetingEditOrAddDto.meetingOutlineAddOrUpdateDto);
        }
      });
    },
    {
      deep: true,
      immediate: true,
    },
  );
  defineExpose({ validate, getFieldsValue });
  onMounted(() => {
    listDictModel({
      dictCode: 'time_in_node',
    }).then((res) => {
      updateSchema({
        field: 'hourPitStops',
        componentProps: {
          options: res.map((item) => {
            return {
              label: item.label,
              value: item.label,
            };
          }),
        },
      });
    });
    listDictModel({
      dictCode: 'time_out_node',
    }).then((res) => {
      updateSchema({
        field: 'hourOutbound',
        componentProps: {
          options: res.map((item) => {
            return {
              label: item.label,
              value: item.label,
            };
          }),
        },
      });
    });
    axios.get(stationUrl + '/aispeech/notice/searchStation').then((res) => {
      if (res.status == 200) {
        let data = res.data.result;
        window.sessionStorage.setItem('station', JSON.stringify(data));
        updateSchema({
          field: 'stationName',
          componentProps: {
            options: data.map((item) => {
              return {
                label: item,
                value: item,
              };
            }),
          },
        });
      }
    });
  });
</script>
<style>
  .vben-basic-form .ant-form-item.suffix-item .ant-form-item-control {
    margin-top: 0;
  }
</style>
