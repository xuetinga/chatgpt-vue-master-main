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
  created(){
    
  },

  data() {
    return {
      markdown: `
# Yoka 危险货物专家 AI 助手使用说明

## 简介

Yoka 是一款基于多个大语言模型、RAG 架构和 Agent 技术实现的危险货物专家 AI 助手。它旨在帮助企业实现安全生产和知识管理,提供四个主要场景:知识库问答、自由对话、条款检查和题目生成。

## 主要功能

### 1. 知识库问答

基于本地知识库和 RAG 架构,Yoka 可以回答企业业务知识、法律法规等相关问题。它利用自然语言处理技术从知识库中检索相关信息,并生成准确的答复。

### 2. 自由对话

Yoka 充分发挥了大语言模型的原生能力,可以根据用户选择的不同模型和 Prompt 模板,解决个性化问题。用户可以与 Yoka 进行自由对话,探讨各种主题。

### 3. 条款检查

Yoka 基于旧有条款知识库和 RAG 架构,可以关联新旧条款,分析新条款的合理性和合规性。它有助于企业审查和优化内部政策,确保符合法律法规要求。

### 4. 题目生成

根据企业私有知识、法规和条款,Yoka 可以生成试题,用于员工培训和考核。这有助于提高员工的专业知识水平,增强企业的风险防范能力。

## 其他功能

### 1. 知识图谱生成

Yoka 基于知识图谱技术,可以生成企业知识库图谱和单一文档图谱,帮助企业进行知识管理和查询。

### 2. 个性化配置

Yoka 提供了丰富的知识引擎配置和大语言模型配置,满足用户的个性化需求,针对性地解决实际问题。

## 使用方法

1. 启动 Yoka 危险货物专家 AI 助手
2. 选择所需的功能场景
3. 根据指示进行操作,如输入问题、上传条款文件或选择配置等
4. Yoka 将根据请求生成相应的输出结果

## 注意事项

- 确保提供足够的知识数据,以获得准确的结果
- 定期更新知识库,以反映最新的法规和业务变化
- 对于敏感或重要的决策,请寻求人工专家的审核和指导

欢迎使用 Yoka 危险货物专家 AI 助手,提高工作效率,确保安全合规!如有任何疑问或建议,欢迎随时反馈。
      `,
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