<template>
      <el-aside width="150px" height=100vh; style=" position: relative; overflow: hidden; " >
      <div class="fixed-button">
        <el-radio-group v-model="isCollapse">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
      </div>
      <el-menu default-active="1"  @open="handleOpen" @close="handleClose"
        :collapse="isCollapse" style=" width: 150px;">
        <el-menu-item index="0" @click.native="goToMain">
          <img src="../../imgs/logo.png" style="width: 25px; height: 25px;" />
                    <span slot="title">Yoka</span>
        </el-menu-item>
        <el-menu-item index="1" @click.native="goToKnowledgeQA">
          <i class="el-icon-menu"></i>
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
          <i class="el-icon-setting"></i>
          <span slot="title">题目生成</span>
        </el-menu-item>
      </el-menu>



      <div class="fixed-bottom-menu">
        <el-menu class="el-menu-vertical-demo">
          <el-menu-item index="5" @click.native="goToKnowSetting">
            <i class="el-icon-setting"></i>
            <span slot="title">知识管理</span>
          </el-menu-item>
          <el-menu-item index="6" @click.native="goToPrompt">
            <i class="el-icon-question"></i>
            <span slot="title">prompt设置</span>
          </el-menu-item>
          <el-menu-item index="7" @click.native="goToSelectModel">
            <i class="el-icon-question"></i>
            <span slot="title">模型选择</span>
          </el-menu-item>
          <el-menu-item index="7" @click.native="goToHelp">
            <i class="el-icon-question"></i>
            <span slot="title">帮助</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>
</template>

<script>
export default {
   
}
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  background-color: rgb(249, 248, 247);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu-vertical-demo::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0); /* 设置初始背景色透明 */
    z-index: -1;
    transition: background-color 0.3s ease; /* 添加过渡效果 */
}
.title-row {
  padding: 14px;
}

.main-title {
  margin-left: 8px;
  /* Adjust the space between icon and title as needed */
  font-size: 20px;
  /* Your desired size for the main title */
  vertical-align: middle;
}

.sub-title {
  /* Styling for subtitle, if necessary */
}


</style>