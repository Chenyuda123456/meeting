import { FormSchema } from '../../../../../components/Form';
import { h } from 'vue';
import { Input } from 'ant-design-vue';

export const schemas: FormSchema[] = [
  {
    field: 'date',
    component: 'DatePicker',
    label: '会议日期',
    required: true,
    colProps: {
      span: 6,
    },
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: '会议日期',
      style: 'width: 100% ',
    },
  },
  {
    field: 'stationName',
    component: 'Select',
    label: '站点',
    required: true,
    colProps: {
      span: 6,
    },
    componentProps: {
      options: [],
      showSearch: true,
      filterOption: (input, option) => {
        return option.value.includes(input);
      },
    },
  },
  {
    field: 'host',
    component: 'Input',
    label: '主持人',
    required: true,
    colProps: {
      span: 6,
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'recorder',
    component: 'Input',
    label: '记录人',
    required: true,
    colProps: {
      span: 6,
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e);
      },
    },
  },
  {
    field: 'divider-1',
    component: 'Divider',
    label: '保安保洁问题',
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
    field: 'securityIssues',
    component: 'Input',
    label: '保安',
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
    field: 'cleanerIssues',
    component: 'Input',
    label: '保洁',
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
    field: 'divider-2',
    component: 'Divider',
    label: '昨日客流',
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
    field: 'pitStops',
    component: 'Input',
    label: '进站',
    dynamicRules: () => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请输入进站');
            }
            if (!/(^[1-9]\d*$)/.test(value) || value > 100000000) {
              return Promise.reject('请输入小于1亿正整数!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
    colProps: {
      span: 12,
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e);
      },
    },
    suffix: '人',
  },
  {
    field: 'outbound',
    component: 'Input',
    label: '出站',
    dynamicRules: () => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请输入出站');
            }
            if (!/(^[1-9]\d*$)/.test(value) || value > 100000000) {
              return Promise.reject('请输入小于1亿正整数!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
    colProps: {
      span: 12,
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e);
      },
    },
    suffix: '人',
  },
  {
    field: 'hourPitStops',
    component: 'Select',
    label: '小时进站',
    required: true,
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [],
    },
  },
  {
    field: 'hourPitStopsCount',
    component: 'Input',
    label: '',
    dynamicRules: () => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请输入');
            }
            if (!/(^[1-9]\d*$)/.test(value) || value > 100000000) {
              return Promise.reject('请输入小于1亿正整数!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
    colProps: {
      span: 4,
    },
    suffix: '人',
    rules: [{ required: true }],
    render: ({ model, field }) => {
      return h('div', { style: { paddingLeft: '6px' } }, [
        h(Input, {
          placeholder: '请输入',
          value: model[field],
          onChange: (e: ChangeEvent) => {
            model[field] = e.target.value;
          },
        }),
      ]);
    },
  },
  {
    field: 'hourOutbound',
    component: 'Select',
    label: '小时出站',
    required: true,
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
          key: '1',
        },
        {
          label: '选项2',
          value: '2',
          key: '2',
        },
      ],
    },
  },
  {
    field: 'hourOutboundCount',
    component: 'Input',
    label: '',
    dynamicRules: () => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('请输入');
            }
            if (!/(^[1-9]\d*$)/.test(value) || value > 100000000) {
              return Promise.reject('请输入小于1亿正整数!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
    colProps: {
      span: 4,
    },
    suffix: '人',
    rules: [{ required: true }],
    render: ({ model, field }) => {
      return h('div', { style: { paddingLeft: '6px' } }, [
        h(Input, {
          placeholder: '请输入',
          value: model[field],
          onChange: (e: ChangeEvent) => {
            model[field] = e.target.value;
          },
        }),
      ]);
    },
  },
  {
    field: 'revenue',
    component: 'Input',
    label: '票款营收',
    dynamicRules: () => {
      return [
        {
          required: true,
          validator: (_, value) => {
            console.log(value);
            if (!value) {
              return Promise.reject('请输入票款营收');
            }
            if (!/(^[1-9]\d*$)/.test(value) || value > 100000000) {
              return Promise.reject('请输入小于1亿正整数!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
    colProps: {
      span: 12,
    },
    componentProps: {
      onChange: (e: any) => {
        console.log(e);
      },
    },
    suffix: '元',
  },
  {
    field: 'divider-3',
    component: 'Divider',
    label: '其他',
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
    field: 'accident',
    component: 'Input',
    label: '故障',
    defaultValue: '无',
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
    field: 'construction',
    component: 'Input',
    label: '施工',
    defaultValue: '无',
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
    field: 'emergencies',
    component: 'Input',
    label: '突发事件',
    defaultValue: '无',
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
