<template>

  <el-aside width="150px" height=100vh; style=" position: relative; overflow: hidden; ">
    <div v-if="isCollapse"
      style="position: fixed; top:10px; border:0px;text-align: center;z-index: 1000;margin-left:70px; width: 10px; height: 10px;">
      <el-button @click="toggleCollapse">
        <i :class="`el-icon-arrow-${isCollapse ? 'right' : 'left'}`"></i>
      </el-button>
    </div>
    <div v-else style="position: fixed; top:10px; border:0px;text-align: center;z-index: 1000;margin-left: 90px;">
      <el-button @click="toggleCollapse">
        <i :class="`el-icon-arrow-${isCollapse ? 'right' : 'left'}`"></i>
      </el-button>
    </div>
    <el-menu :default-active="isSelect" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <el-menu-item index="0" @click.native="goToMain">
        <img src="../imgs/logo.png" style="width: 25px; height: 25px;" />
        <span slot="title">Yoka</span>
      </el-menu-item>
      <el-menu-item index="1" @click.native="goToKnowledgeQA">
        <i class="el-icon-s-opportunity"></i>
        <span slot="title">知识库问答</span>
      </el-menu-item>
      <el-menu-item index="2" @click.native="goToFreeChat">
        <i class="el-icon-chat-dot-square"></i>
        <span slot="title">自由对话</span>
      </el-menu-item>
      <el-menu-item index="3" @click.native="goToCheckChat">
        <i class="el-icon-document"></i>
        <span slot="title">条款检查</span>
      </el-menu-item>
      <el-menu-item index="4" @click.native="goToTitleSetChat">
        <i class="el-icon-s-promotion"></i>
        <span slot="title">题目生成</span>
      </el-menu-item>
    </el-menu>



    <div class="fixed-bottom-menu">
      <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-menu-item index="5" @click.native="goToKnowSetting">
          <i class="el-icon-coordinate"></i>
          <span slot="title">知识管理</span>
        </el-menu-item>
        <el-menu-item index="6" @click.native="goToPrompt">
          <i class="el-icon-setting"></i>
          <span slot="title">prompt设置</span>
        </el-menu-item>
        <el-menu-item index="7" @click.native="goToSelectModel">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">模型选择</span>
        </el-menu-item>
        <el-menu-item index="7" @click.native="goToHelp">
          <i class="el-icon-magic-stick"></i>
          <span slot="title">帮助</span>
        </el-menu-item>
      </el-menu>
    </div>
  </el-aside>
</template>

<script>


export default {
  props: {
    isCollapse: {
      type: Boolean,
      required: true
    },
    isSelect: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chat_id: "",
      newhistory: {},
      historyArrlist: [],
      configs: [],
      promptall: [],
      models: [],
      promptdefaultvalue: 'default',
      dynamicMarginLeft: '50px',
    }
  },
  methods: {
    goToMain() {
      console.log("dddd")
      window.location.href = '#/ChatHome';
    },
    goToKnowledgeQA() {
      window.location.href = '#/KnowLedgeChat';
    },
    goToFreeChat() {
      window.location.href = '#/FreeChat';
    },
    goToCheckChat() {
      window.location.href = '#/CheckChat';
    },
    goToTitleSetChat() {
      window.location.href = '#/TitleSetChat';
    },
    goToKnowSetting() {
      window.location.href = '#/KnowSetting';
    },
    goToPrompt() {
      window.location.href = '#/Prompt';
    },
    goToSelectModel() {
      window.location.href = '#/SelectModel';
    },
    goToHelp() {
      window.location.href = '#/HelpChat';
    },
    toggleCollapse() {
      this.$emit('update:isCollapse', !this.isCollapse);
      this.dynamicMarginLeft = "150px"
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  }
};
</script>

<style lang="scss" scoped></style>