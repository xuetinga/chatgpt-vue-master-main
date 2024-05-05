<template>
  <el-container style="height: 100vh;">

    <el-aside width="150px" height=100vh; style=" position: relative; overflow: hidden; ">
      <div class="fixed-button" style=" position: fixed;  top:15px; border:0px;text-align: center;
  z-index: 1000;">
        <el-button @click="toggleCollapse">
          <i :class="`el-icon-arrow-${isCollapse ? 'right' : 'left'}`"></i>
        </el-button>
      </div>
      <el-menu default-active="1" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-menu-item index="0" @click.native="goToMain">
          <i class="el-icon-menu"></i>
        </el-menu-item>
        <el-menu-item index="1" @click.native="goToKnowledgeQA">
          <i class="el-icon-menu"></i>
          <span slot="title">知识库问答</span>
        </el-menu-item>
        <el-menu-item index="2" @click.native="goToFreeChat">
          <i class="el-icon-menu"></i>
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
        <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
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

    <el-container style=" justify-content: center;align-items: center;">
      <el-header style="text-align: center; line-height: 40px">
        Yoca copilot
      </el-header>
      <el-main style=" justify-content: center; width: 100%; ">
        <el-row :gutter="20" style="margin-top: 40px; " justify="center">
          <el-col :span="12">
            <el-card @click.native="goToKnowledgeQA">
              <el-row class="title-row">
                <el-col :span="22">
                  <i class="el-icon-s-promotion"></i>
                  <span class="main-title">知识库问答</span>
                </el-col>
                <el-col :span="22">
                  <span class="sub-title">知识库问答知识库问答知识库问答知识库问答</span>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <!-- 居中 -->
          <el-col :span="12">
            <el-card @click.native="goToFreeChat">
              <el-row class="title-row">
                <el-col :span="22">
                  <i class="el-icon-s-promotion"></i>
                  <span class="main-title">自由对话</span>
                </el-col>
                <el-col :span="22">
                  <span class="sub-title">自由对话自由对话自由对话自由对话自由对话</span>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" justify="center" style="margin-top: 30px;">
          <el-col :span="12">
            <el-card @click.native="goToCheckChat">
              <el-row class="title-row">
                <el-col :span="22">
                  <i class="el-icon-s-promotion"></i>
                  <span class="main-title">条款检查</span>
                </el-col>
                <el-col :span="22">
                  <span class="sub-title">条款检查条款检查条款检查条款检查条款检查</span>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card @click.native="goToTitleSetChat">
              <el-row class="title-row">
                <el-col :span="22">
                  <i class="el-icon-s-promotion"></i>
                  <span class="main-title">题目生成</span>
                </el-col>
                <el-col :span="22">
                  <span class="sub-title">题目生成题目生成题目生成题目生成题目生成</span>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-main>

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

.fixed-bottom-menu {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 250px;
}

fixed-button {}

.el-menu .el-menu-item {
  width: 100%;
}
</style>
<script>
window.addEventListener('resize', function() {
  var asideRect = document.querySelector('aside').getBoundingClientRect();
  var fixedButton = document.querySelector('.fixed-button');
  fixedButton.style.top = asideRect.top + 'px';  // 调整 top 值以跟随 aside
});

  export default {
    data() {
      return {
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

    }
  }
</script>