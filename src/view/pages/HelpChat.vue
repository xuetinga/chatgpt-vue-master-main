<template>
  <el-container style="height: 100vh;">
    <Nav :isCollapse="isCollapse" @update:isCollapse="updateIsCollapse" :isSelect="selected"></Nav>

    <el-container>
      <el-header style="text-align: right; line-height: 60px">
        <!-- 头部内容 -->
        Yoka
      </el-header>
      <el-main>
        <vue-markdown :source="markdown" :breaks="true" :typographer="true" :linkify="true" :highlight="false"></vue-markdown>
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
import VueMarkdown from 'vue-markdown';
export default {
  mixins: [commonMethodsMixin],
  components: {
    Emoji,
    Nav,
    StreamText,
    VueMarkdown
  },
  data() {
    return {
      markdown: '危险货物通常指那些在运输、储存、生产、经营、使用和处置过程中，由于具有某些危险特性而可能造成人身伤害、财产损失或环境污染的物质和物品。以下是一些常见的危险货物类型：\n\n1. **爆炸品**：这类物品具有迅速转化为气体并产生大量热量和压力的能力，能够造成破坏。例如炸药、烟火制品等。\n2. **氧化剂**：这些物质能引发其他物质的燃烧或助燃，本身不一定会燃烧。如漂白粉、过氧化氢等。\n3. **压缩气体和液化气体**：包括那些在高压下存储于容器中的气体，释放时可能引发危险。如液化天然气、压缩氧气等。\n4. **自燃物品**：这类物品在没有外部火源的情况下，由于与空气作用产生的热能够引发自身的火灾。如磷、某些金属粉末等。\n5. **遇水燃烧物品**：与水反应产生易燃气体的物质，可能导致火灾或爆炸。如金属钠、碳化钙等。\n6. **易燃液体**：容易挥发并形成易燃蒸气的液体物质。如汽油、酒精等。\n7. **易燃固体**：易于点燃的固体物质，或在摩擦、氧化作用下可能自发起火的物质。如硫磺、细碎的干草等。\n8. **毒害品**：含有有害元素或化合物，可能对生物体造成伤害的物品。如农药、某些重金属化合物等。\n9. **腐蚀物品**：对金属或其他物质有破坏作用，能够引起灼伤或穿孔的物质。如硫酸、盐酸等。\n10. **放射性物品**：发出电离辐射的物质，对人体和环境存在潜在风险。如铀、钚等放射性元素及其化合物。\n\n此外，还有一些物品虽然本身不属于上述分类，但在特定条件下（如含量、浓度、件重等方面低于一定阈值时）可以作为普通货物处理。\n\n总之，在处理和运输危险货物时，必须严格遵守相关的安全规定和操作程序，确保人员和环境的安全。',

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