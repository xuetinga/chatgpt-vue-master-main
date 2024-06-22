<template>
  <el-container class="main-bg">

    <!-- <Nav :isCollapse="isCollapse" @update:isCollapse="updateIsCollapse" :isSelect="selected"></Nav> -->

    <el-container class="parent-container"
      style="display: flex; flex-direction: column; align-items: center; height: 100vh; justify-content: center;">

      <el-main style="display: flex; flex-direction: column; justify-content: center; width: 100%;">
        <el-header
          style="text-align: center; line-height: 40px; font-family: 'Courier New', Courier, monospace; font-size: 100px; font-weight: 700;">
          Yoka copilot

        </el-header>
        <el-row :gutter="16" style="margin-top: 40px;  display: flex;
    justify-content: center;" justify="center">
          <el-col :span="8">
            <el-card @click.native="goToKnowledgeQA">
              <el-row class="title-row">
                <el-col :span="22">
                  <i class="el-icon-s-promotion"></i>
                  <span class="main-title">知识库问答</span>
                </el-col>
                <el-col :span="22">
                  <span class="sub-title">助力安全生产法律条款问答</span>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <!-- 居中 -->
          <el-col :span="8">
            <el-card @click.native="goToFreeChat">
              <el-row class="title-row">
                <el-col :span="22">
                  <i class="el-icon-s-promotion"></i>
                  <span class="main-title">自由对话</span>
                </el-col>
                <el-col :span="22">
                  <span class="sub-title">LLM原生对话</span>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="16" justify="center" style="margin-top: 30px;  display: flex;
    justify-content: center;">
          <el-col :span="8">
            <el-card @click.native="goToCheckChat">
              <el-row class="title-row">
                <el-col :span="22">
                  <i class="el-icon-s-promotion"></i>
                  <span class="main-title">条款检查</span>
                </el-col>
                <el-col :span="22">
                  <span class="sub-title">新旧条款校对与分析</span>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card @click.native="goToTitleSetChat">
              <el-row class="title-row">
                <el-col :span="22">
                  <i class="el-icon-s-promotion"></i>
                  <span class="main-title">题目生成</span>
                </el-col>
                <el-col :span="22">
                  <span class="sub-title">基于法规条款的单选题生成</span>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <i class="el-icon-s-promotion" @click="handleIconClick"></i>

      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "App",
  components: {
  },
};
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
  width: 150px;
  min-height: 400px;
}

.el-menu-vertical-demo::before {
  // // content: "";
  // // position: absolute;
  // // top: 0;
  // // left: 0;
  // // width: 100%;
  // // height: 100%;
  // // background-color: rgba(0, 0, 0, 0);
  // // /* 设置初始背景色透明 */
  // // z-index: -1;
  // // transition: background-color 0.3s ease;
  // /* 添加过渡效果 */
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

.main-bg {
  height: 100vh;
  background: linear-gradient(to right, #eef4ff, #f2fbff);
}
</style>
<script>
window.addEventListener('resize', function() {
  var asideRect = document.querySelector('aside').getBoundingClientRect();
  var fixedButton = document.querySelector('.fixed-button');
  fixedButton.style.top = asideRect.top + 'px';  // 调整 top 值以跟随 aside
});
import Emoji from "@/components/Emoji.vue";
import Nav from "@/components/Nav.vue";
import commonMethodsMixin from '../util/publicfun.js';
import StreamText from '@/components/StreamText.vue';
  export default {
    mixins: [commonMethodsMixin],
    components: {
        Emoji,
        Nav,
        StreamText
    },
    data() {
      return {
        selected: '0',
        isCollapse: false,
        cards: [
        {
          icon: 'el-icon-info',
          title: '标题一',
          subtitle: '副标题一'
        },
        {
          icon: 'el-icon-warning',
          title: '标题二',
          subtitle: '副标题二'
        },
        {
          icon: 'el-icon-error',
          title: '标题三',
          subtitle: '副标题三'
        },
        {
          icon: 'el-icon-success',
          title: '标题四',
          subtitle: '副标题四'
        }
      ]

      };
    },
    methods: {
      updateIsCollapse(value) {
            this.isCollapse = value;
            // this.updateIsCollapse(value);
        },
      toggleCollapse() {
      this.isCollapse = !this.isCollapse; // 切换状态
      },
      
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      goToMain(){
        window.location.href = '#/ChatHome';
      },
      goToKnowledgeQA(){
        window.location.href = '#/KnowLedgeChat';
      },
      goToFreeChat(){
        window.location.href = '#/FreeChat';
      },
      goToCheckChat(){
        window.location.href = '#/CheckChat';
      },  
      goToTitleSetChat(){
        window.location.href = '#/TitleSetChat';
      },

      goToKnowSetting(){
        window.location.href = '#/KnowSetting';
      },
      goToPrompt(){
        window.location.href = '#/Prompt';
      },
      goToSelectModel(){
        window.location.href = '#/SelectModel';
      },
      goToHelp(){
        window.location.href = '#/HelpChat';
      },
      submitForm(){
        console.log('Submitting form data along with the fileList:',);

      },
      handleIconClick(){
        window.location.href = '#/MobileChat';
      }

    }
  }
</script>