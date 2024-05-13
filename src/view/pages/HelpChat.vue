<template>
  <el-container style="height: 100vh;">
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
      <el-menu @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-menu-item index="0" @click.native="goToMain">
          <img src="../../imgs/logo.png" style="width: 25px; height: 25px;" />
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
        <el-menu class="el-menu-vertical-demo" default-active="8" @open="handleOpen" @close="handleClose"
          :collapse="isCollapse">
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
          <el-menu-item index="8" @click.native="goToHelp">
            <i class="el-icon-magic-stick"></i>
            <span slot="title">帮助</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; line-height: 60px">
        <!-- 头部内容 -->
        DB-GPT
      </el-header>
      <el-main>

      </el-main>
    </el-container>
  </el-container>
</template>

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
window.addEventListener('resize', function () {
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
    historyChat(question) {
            console.log("this.question", question)

            this.chatStarted = true;
            question.showDeleteButton = true
            this.newhistory = question
            this.chatMessages = question.history
            this.chat_id = question.dialogue_id
        },
        showDeleteButton(index) {
            console.log("indexindex", this.historyArrlist[index])
            this.historyArrlist[index].showDeleteButton = true;
        },
        hideDeleteButton(index) {
            this.historyArrlist[index].showDeleteButton = false
        },
        deleteItem(index) {
            this.historyArrlist.splice(index, 1);
        },
    guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        ,
    toggleCollapse() {
      this.isCollapse = !this.isCollapse; // 切换状态
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    goToMain() {
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
    submitForm() {
      console.log('Submitting form data along with the fileList:',);

    },

  }
}
</script>