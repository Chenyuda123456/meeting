<template>
  <div style="height: 100%" ref="wangEditorRef">
    <div ref="toolBarRef">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @customAlert="customAlert"
        @customPaste="customPaste"
      />
    </div>
    <Editor
      :style="{ height: editorContentHeight + 'px' }"
      class="editor"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      @onCreated="handleCreated"
    />
  </div>
</template>
<script lang="ts" setup>
  import '@wangeditor/editor/dist/css/style.css'; // 引入 css

  import { onBeforeUnmount, ref, shallowRef, onMounted, reactive, nextTick, watch } from 'vue';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

  const props = defineProps(['valueHtml']);
  const emits = defineEmits(['changeHtml']);

  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef();

  // 内容 HTML
  const valueHtml = ref('');
  const toolBarRef = ref();
  const wangEditorRef = ref();
  const editorContentHeight = ref(300);
  // 模拟 ajax 异步获取内容

  onMounted(() => {});

  const toolbarConfig = reactive({
    excludeKeys: ['fullScreen', '|', 'group-video', 'group-image', 'emotion'],
  });
  const editorConfig = { placeholder: '请输入内容...' };
  // 编辑器回调函数
  const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
    // console.log(editor.getAllMenuKeys());
    // console.log(wangEditorRef.value.offsetHeight);
    // console.log(toolBarRef.value.offsetHeight);
    nextTick(() => {
      editorContentHeight.value = wangEditorRef.value.offsetHeight - toolBarRef.value.offsetHeight;
      // console.log(editorContentHeight.value);
    });
  };

  const handleChange = (editor) => {
    console.log('change:', editor.getHtml());
  };
  const handleDestroyed = (editor) => {
    console.log('destroyed', editor);
  };
  const handleFocus = (editor) => {
    console.log('focus', editor);
  };
  const handleBlur = (editor) => {
    console.log('blur', editor);
  };
  const customAlert = (info, type) => {
    alert(`【自定义提示】${type} - ${info}`);
  };
  const customPaste = (editor, event, callback) => {
    console.log('ClipboardEvent 粘贴事件对象', event);

    // 自定义插入内容
    editor.insertText('xxx');

    // 返回值（注意，vue 事件的返回值，不能用 return）
    callback(false); // 返回 false ，阻止默认粘贴行为
    // callback(true) // 返回 true ，继续默认的粘贴行为
  };

  const insertText = () => {
    const editor = editorRef.value;
    if (editor == null) return;

    editor.insertText('hello world');
  };

  const printHtml = () => {
    const editor = editorRef.value;
    if (editor == null) return;
    console.log(editor.getHtml());
  };
  watch(
    () => valueHtml,
    (val) => {
      emits('changeHtml', val);
    },
    {
      deep: true,
    },
  );
  watch(
    () => props.valueHtml,
    () => {
      console.log('watch valueHtml', props.valueHtml);
      nextTick(() => {
        valueHtml.value = props.valueHtml;
      });
    },
    {
      deep: true,
      immediate: true,
    },
  );
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });
  onMounted(() => {});
  defineExpose({
    valueHtml,
  });
</script>

<style lang="less" scoped>
  :deep(.w-e-scroll) {
    overflow-x: hidden !important;
    > div {
      height: 99% !important;
      box-sizing: border-box;
    }
  }
</style>
