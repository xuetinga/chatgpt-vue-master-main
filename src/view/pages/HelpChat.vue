<template>
  <el-container style="height: 100vh;">
    <Nav :isCollapse="isCollapse" @update:isCollapse="updateIsCollapse" :isSelect="selected"></Nav>

    <el-container>
      <el-header style="text-align: right; line-height: 60px">
        <!-- 头部内容 -->
        Yoka
      </el-header>
      <el-main>
        使用 ChatGPT 需要多少费用？
        ChatGPT 可以免费使用，但我们也提供订阅计划，可在定价页面上查看。



        ChatGPT 如何工作？
        ChatGPT 是基于 GPT-3.5 进行微调的，GPT-3.5 是一种经过训练以生成文本的语言模型。ChatGPT 通过使用带人类反馈的强化学习 (RLHF) 针对对话进行了优化，RLHF
        是一种使用人类演示和偏好比较来引导模型朝着期望行为发展的方法。


        为什么人工智能看起来如此真实、栩栩如生？
        这些模型是根据互联网上人类编写的大量数据（包括对话）进行训练的，因此它提供的响应可能听起来像人类的。重要的是要记住，这是系统设计的直接结果（即最大限度地提高输出与模型训练数据集之间的相似性），并且这些输出有时可能不准确、不真实或具有误导性。



        我能相信人工智能告诉我真相吗？
        ChatGPT 不连接互联网，偶尔会给出错误答案。它对 2021 年以后的世界和事件的了解有限，有时还可能给出有害的指示或有偏见的内容。



        我们建议检查模型的响应是否准确。如果您发现答案不正确，请使用“反对”按钮提供反馈。



        谁可以查看我的对话？
        作为我们对安全和负责任的人工智能的承诺的一部分，我们会审查对话以改进我们的系统并确保内容符合我们的政策和安全要求。



        你会用我的谈话来进行训练吗？
        当您使用我们为个人提供的服务（例如 ChatGPT）时，我们可能会使用您的内容来训练我们的模型。您可以通过我们的隐私门户选择退出训练，只需点击“不要对我的内容进行训练”，或者要关闭对您的 ChatGPT
        对话的训练，请按照我们的数据控制常见问题解答中的说明进行操作。一旦您选择退出，新的对话将不会用于训练我们的模型。


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
</style>
<script>
window.addEventListener('resize', function () {
  var asideRect = document.querySelector('aside').getBoundingClientRect();
  var fixedButton = document.querySelector('.fixed-button');
  fixedButton.style.top = asideRect.top + 'px';  // 调整 top 值以跟随 aside
});
import Emoji from "@/components/Emoji.vue";
import Nav from "@/components/Nav.vue";
import commonMethodsMixin from '../../util/publicfun.js';
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
      selected: '8',
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