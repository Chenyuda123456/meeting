<template>
  <div class="p-4 main-box" style="height: 100%">
    <div class="back pointer" @click="back">
      <arrow-left-outlined />
      返回
    </div>
    <div class="main">
      <a-card style="height: 100%; background: #fff">
        <template #title>
          <a-space>
            <div class="flex title">
              <img src="../../../assets/images/add.png" />
              <span style="margin-left: 4px">声音注册</span>
            </div>
            <a-button
              style="margin-left: 10px"
              type="primary"
              @click="
                openModal(true, {
                  open: true,
                })
              "
            >
              新增注册
            </a-button>
          </a-space>
        </template>
        <a-card-grid class="box" v-for="(item, index) in data.list" :key="index">
          <a-space align="end">
            <div class="icon-box"><user-outlined class="icon" /></div>
            <div class="name">{{ item.userName }}</div>
          </a-space>
          <a-popconfirm
            title="确认删除吗?"
            ok-text="是"
            cancel-text="否"
            @confirm="ListDelete(item.uvId)"
          >
            <delete-outlined class="deleted" />
          </a-popconfirm>
        </a-card-grid>
      </a-card>
    </div>
    <Modal @getList="getList" @register="register" @ListDelete="ListDelete" />
  </div>
</template>

<script setup>
  import { ArrowLeftOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import Modal from './Modal.vue';
  import { useRouter } from 'vue-router';
  import { onMounted, reactive } from 'vue';
  import { vprintView, vprintRemove } from '../../../api/meeting/creatMeeting';
  const [register, { openModal }] = useModal();
  const router = useRouter();
  const data = reactive({
    list: [],
  });
  const back = () => {
    router.back();
  };
  const getList = async () => {
    console.log('getList');
    data.list = await vprintView();
    console.log(data.list);
  };
  const ListDelete = async (id) => {
    await vprintRemove({
      uvId: id,
    });
    getList();
  };
  onMounted(() => {
    getList();
  });
</script>

<style scoped lang="less">
  .main-box {
    height: 100%;
    .back {
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 16px;
    }

    .main {
      height: calc(100% - 30px);
      :deep(.ant-card-body) {
        padding: 0;
      }
    }
  }
  .title {
    display: flex;
    align-items: center;
    img {
      width: 24px;
      margin-right: 6px;
    }
  }
  .box {
    width: 10%;
    text-align: center;
    position: relative;
    padding: 24px 4px;
    &:hover {
      background: rgba(243, 247, 253, 1);
      .deleted {
        display: block;
      }
    }
  }
  .icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #1890ff;
    color: #fff;
    font-size: 24px;
    width: 60px;
    height: 60px;
  }
  .name {
    font-size: 20px;
  }
  .deleted {
    position: absolute;
    right: 10px;
    top: 10px;
    display: none;
  }
</style>
