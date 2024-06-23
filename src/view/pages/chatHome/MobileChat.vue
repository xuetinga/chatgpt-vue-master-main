<template>
  <el-container class="message-container" >
    <el-header class="message-header" >
      Safety Copilot
    </el-header>
    <el-main class="message-main" style="background-color: rgb(233, 233, 233);">
      <div class="message-content">
        <div v-if="chatStarted " class="chat-container1" ref="chatContainer">
          <div v-for="(message, index) in chatMessages" :key="index" class="chat-message"
          style="display: flex; flex-direction: row; justify-content: flex-start;"
          >
            <div v-if="message.role === 'assistant'"
              style="display: flex; flex-direction: row; justify-content: flex-start; float: left;">
              <div style="">
                <el-avatar style="background-color: #F56C6C;"> SC </el-avatar>
              </div>
              <div style="margin-left: 10px; margin-top: 5px;">
                <div style="color: rgb(160, 160, 160);">
                  safety
                </div>
             
                <div class="card" style="background-color: #fff;color: black;">
                  <vue-markdown :source="message.content" :breaks="true" :typographer="true" :linkify="true"
                    :highlight="false"></vue-markdown>
                </div>
              </div>
            </div>
            <div v-else-if="message.role === 'user'"
              style="float: right; display: flex; flex-direction: row; justify-content: flex-end; margin-left: auto;">

              <div class="card" style=" background-color: #F56C6C; float: left; color:#fff">

                {{ message.content }}

              </div>

            </div>

          </div>
        </div>
        <div v-else class="chat-container1">
          <div v-for="(message, index) in suggestionsorigin" :key="index" class="chat-message"
            style="display: flex; flex-direction: row; justify-content: flex-start;">
            <div v-if="message.role === 'user'"
              style="display: flex; flex-direction: row; justify-content: flex-start; float: left;">
              <div >
                <el-avatar style="background-color: #F56C6C;"> SC </el-avatar>
              </div>
              <div style="margin-left: 10px; margin-top: 5px;">
                <div style="color: rgb(160, 160, 160);">
                  safety copilot
                </div>
                <div v-if="index == 0" class="card" style="background-color: #fff;color: black;">
                  {{ message.content }}
                  <div class="suggestions-card">
                    <div style="margin-top: 20px; color: darkgrey;">
                      猜你想问
                    </div>
                    <el-divider style="margin: 0px;"></el-divider>
                    <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item">
                      <p @click="setDefaultAnswer(index)" style="color: red; cursor: pointer;">{{ suggestion.question }}
                      </p>
                      <div v-if="suggestion.showAnswer">
                        <p>{{ suggestion.answer }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="card" style="background-color: #fff;color: black;">
                  <vue-markdown :source="message.content" :breaks="true" :typographer="true" :linkify="true"
                    :highlight="false"></vue-markdown>
                </div>
              </div>
            </div>
            <div v-else-if="message.role === 'assistant'"
              style="float: right; display: flex; flex-direction: row; justify-content: flex-end; margin-left: auto;">

              <div class="card" style=" background: linear-gradient(to right, rgb(234,147,131), rgb(233,134,125),rgb(235,116,121)); float: left; color:#fff">

                {{ message.content }}

              </div>

            </div>

          </div>
        </div>
      </div>
    </el-main>
    <el-footer style="align-items: flex-start; display: flex;padding: 0px; background-color: rgb(233, 233, 233);" >
      <div class="input-wrapper1" >
        <div class="input-field-wrapper1">
          <el-input v-model="newMessage" class="input-field" placeholder="请输入内容" @keydown.enter="startChat">
          </el-input>
        </div>
        <div class="input-button">
          <i class="el-icon-s-promotion" @click="startChat" style="margin-right: 5px;">
          </i>
        </div>


      </div>
    </el-footer>
  </el-container>
</template>
<script>
import { chatFileStreamgpt, chatImgStreamgpt, upload_img, upload_doc, chatkbStreamgpt, chatStreamgpt, getChatMsg, gethistory, getChat, getstatic, chatgpt, getChatchat } from "@/api/getData";
import Emoji from "@/components/Emoji.vue";
import Nav from "@/components/Nav.vue";
import commonMethodsMixin from '../../../util/publicfun.js';
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

      selected: '2',
      floatactiveIndex: null,
      showActions: false,
      promptall: [{
        value: "生成摘要",
      }, {
        value: '标签提取',
      }, {
        value: '内容检查',
      }],

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
      ],
      chat_id: "",
      newhistory: {},
      historyArrlist: [],
      configs: [],
      promptall: [],
      promptdefaultvalue: 'default',
      modeldefaultvalue: "deepseek",
      dynamicMarginLeft: '50px',
      isCollapse: false,
      newMessage: '',
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
      ],
      cards1: [
        {
          header: '翻译',
          content: 'The quick brown fox jumps over a lazy dog.',
          message: 'The quick brown fox jumps over a lazy dog.'
        },
        {
          header: '摘要',
          content: '生成如下内容的摘要：从前有一个小男孩,他住在一个偏远的小村庄里。虽然家境贫寒,但他很勇敢,也很喜欢探险。有一天,他在村边的树林里游荡,无意中迷了路。walks走来走去,终于看到一片小湖。湖面波光粼粼,清澈见底,景色宜人。就在这时,他发现湖中有一件闪闪发亮的东西。小男孩费了好大劲,终于将它捞了上来,原来是一个会说话的老鸭子!',
          message: '帮我分析这个摘要'
        },
        {
          header: '试题生成',
          content: '出题：生产、储存区域应设置安全警示标志。搬运时要轻装轻卸，防止包装及容器损坏。配备相应品种和数量的消防器材及泄漏应急处理设备。倒空的容器可能存在残留有害物时应及时处理。',
          message: '帮我生成一个试题'
        }
      ],
      chatMessages: [],
      chatStarted: false,
      chatMessagesList: [],
      //上传后的文件列表
      fileList: [],
      // 允许的文件类型
      // fileType: ["pdf", "doc", "docx", "xls", "xlsx", "txt", "png", "jpg", "bmp", "jpeg"],
      // 运行上传文件大小，单位 M
      fileSize: 50,
      // 附件数量限制
      fileLimit: 1,
      //请求头
      headers: { "Content-Type": "multipart/form-data" },
      kbs: [],
      models: [],
      prompts: [],
      fileType: "",
      dialogImageUrl: "",
      dialogFileUrl: "",
      isClickTip: false,
      newAnser: '',
      suggestionsorigin: [
        {
          content: "您好，我是safety copilot，很高兴为您服务，请告诉我您的问题。",
          role: "user"
        },

      ],
      suggestions: [
        { question: '介绍两个常见的APT组织', answer: `APT（高级持续性威胁）组织是一类具有高度组织化、专业化的网络攻击组织，它们通常由国家支持或具有明确的政治、经济目的。以下是两个国际上较为知名的APT组织：

1. **Lazarus Group**
   - **起源**：据信起源于朝鲜。
   - **活动**：Lazarus Group 被认为是多起重大网络攻击事件的背后黑手，包括2014年对索尼影视娱乐的攻击和2016年对孟加拉国央行的攻击。该组织的主要目标似乎是为了获取资金以支持朝鲜政府，同时也进行间谍活动。
   - **特点**：该组织擅长使用定制化的恶意软件，并且攻击手法多样，包括鱼叉式钓鱼攻击和社会工程学攻击。

2. **APT29（也称为Cozy Bear或The Dukes）**
   - **起源**：普遍认为与俄罗斯政府有关。
   - **活动**：APT29 被认为是多次针对西方政府、外交机构、智库和能源部门的网络间谍活动的幕后组织。该组织在2016年美国总统选举期间的活动尤为引人注目，被指控干预选举。
   - **特点**：APT29 以其高度隐蔽和持续性的攻击策略而闻名，使用多种定制工具和技术来渗透目标网络并长期潜伏。

这些组织的活动通常涉及复杂的网络攻击技术，包括零日漏洞利用、高级恶意软件和持久性后门，目的是长期监控和窃取敏感信息。由于这些组织的活动通常与国家安全相关，因此它们的详细信息往往不易公开，且随着时间的推移可能会有新的发现和更新。`, showAnswer: false },
        { question: '对于CVE-2022-25148，请问我的暴露面有哪些', 
        answer:`基于您提供的信息，我将为您介绍CVE-2022-25148的基本信息，分析其对您资产的潜在影响，并提供防护建议。

CVE-2022-25148基本信息：
1. 描述：WordPress插件WP Statistics存在SQL注入漏洞，影响版本13.1.5及以下。
2. 发布日期：2022年2月24日
3. CVSS评分：5.0（中等严重性）
4. 漏洞类型：SQL注入
5. 影响范围：未经身份验证的攻击者可以注入任意SQL查询以获取敏感信息。

对您资产的潜在影响分析：
1. 受影响资产：
   - pc234（重要性：5，安装了WP Statistics）

2. 影响程度：
   - 信息泄露风险：攻击者可能获取敏感数据。
   - 数据库安全：可能导致未经授权的数据库访问。
   - 网站完整性：虽然漏洞本身不直接影响完整性，但获取的信息可能被用于进一步攻击。

3. 风险评估：
   - 由于pc234的重要性较高（5/10），且直接受到此漏洞影响，建议优先处理。
   - 其他资产未直接受到影响，但仍需警惕潜在的连锁反应。

防护和修复措施：
1. 更新插件：
   - 立即将pc234上的WP Statistics插件更新到最新版本。
   - 启用自动更新功能，确保及时获取安全补丁。

2. 加强访问控制：
   - 限制对WordPress管理界面的访问，使用强密码和双因素认证。
   - 实施IP白名单，只允许可信IP访问管理界面。

3. 数据库安全：
   - 定期备份数据库，以防数据丢失或被篡改。
   - 使用最小权限原则配置数据库用户权限。

4. 网络隔离：
   - 考虑将运行WordPress的服务器与其他重要系统隔离。

5. 安全监控：
   - 实施入侵检测系统（IDS）或Web应用防火墙（WAF），监控和阻止可疑活动。
   - 定期审查日志，检查是否有未经授权的访问尝试。

6. 安全培训：
   - 为管理WordPress的员工提供安全意识培训，特别是关于SQL注入和插件管理的内容。

7. 定期安全评估：
   - 进行定期漏洞扫描和渗透测试，及时发现和修复潜在问题。

通过实施这些措施，您可以显著降低CVE-2022-25148对您资产的风险，并提高整体网络安全性。建议优先处理pc234的更新，并将其他建议措施纳入长期安全策略。`
        , showAnswer: false },
        {
          question: '帮我提取出如下威胁情报中的IoC，将结果返回为json', 
          answer: `{
            &nbsp;&nbsp;&nbsp;&nbsp;"IoCs": {
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Phishing_Email: {
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Sender_Address": "financial_report@secure-bank-update[.]com",
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Email_Subject": "Urgent: Q2 Financial Report Update"
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Malicious_PDF_File": {
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"File_Name": "Q2_Financial_Report_2024.pdf",
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"SHA256": "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9"
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"C2_Server": {
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"IP_Address": "198.51.100.23",
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Domain_Name": "secure-update-server[.]net"
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Malicious_Payload": {
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"File_Name": "svchost.exe",
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"MD5": "0123456789abcdef0123456789abcdef"
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Network_Activity": {
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"User_Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Abnormal_DNS_Query": "api.data-exfil[.]org"
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}
  },
  &nbsp;&nbsp;&nbsp;&nbsp;"Recommendations": [
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Add the above IoCs to the monitoring list of security devices",
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Check network logs for suspicious activities related to these IoCs",
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Increase employee vigilance against phishing emails, especially those involving financial reports",
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Ensure all systems and software are updated to the latest versions, particularly PDF readers"
  ]
}`,
 showAnswer: false
        },
        {
          question: '将如下json中的内容转述为流畅的攻击小结', 
          answer: `2017年，美国最大的信用报告机构之一Equifax遭遇了一次严重的数据泄露事件。这次攻击由一个未知的黑客组织发起，其主要动机是数据窃取和金融利益。

攻击者利用了Apache Struts2框架中的一个远程代码执行漏洞（CVE-2017-5638）作为攻击入口。这个漏洞允许攻击者在Equifax的外部Web应用程序上执行恶意代码。攻击者可能使用了自定义的漏洞利用工具，通过远程代码执行、权限提升和数据窃取等技术，成功突破了Equifax的防线。

攻击从2017年3月开始，直到7月29日才被Equifax的内部安全团队发现异常网络流量。攻击路径显示，黑客从外部Web应用程序入手，逐步渗透到内部网络，最终访问了数据库服务器。在这个过程中，大量敏感数据从Equifax服务器流向了攻击者控制的外部服务器。

这次攻击造成了严重的后果。约1.43亿美国消费者的个人信息被泄露，Equifax遭受了超过6亿美元的金融损失，包括后续的和解金额。此外，公司的声誉也受到了严重损害。

Equifax的防御措施明显不足，尤其是未能及时修补已知的漏洞。事件曝光后，Equifax采取了一系列响应措施，包括关闭受影响的Web应用、聘请外部安全公司进行调查、通知受影响的消费者，并提供免费的信用监控服务。公司高管因此事辞职，Equifax也开始着手加强内部安全措施。

这次事件于2017年9月7日公开披露，成为了信息安全领域的一个重要案例，凸显了及时修复漏洞和加强安全防御的重要性。`, showAnswer: false
        },
      ],

    };
  },
  created() {
    gethistory().then((res) => {
      console.log("gethistoryres", res)
      this.historyArrlist = res.data
    }).catch((err) => {
      console.log("errr", err)
    })
    getstatic().then((res) => {
      console.log("全局11111", res.data)

      this.promptall = res.data.prompts.map(prompt => {
        return {
          value: prompt.scene
        };
      });
      this.models = res.data.models.map(prompt => {
        return {
          value: prompt
        };
      });
    }).catch((err) => {
      console.log("err", err)
    })
  },
  mounted() {
    // 在mounted中添加鼠标悬停事件监听器
    const answerMessageElement = this.$el.querySelector('.answer-message');
    if (answerMessageElement) {
      answerMessageElement.addEventListener('mouseenter', this.showActionButtons);
      answerMessageElement.addEventListener('mouseleave', this.hideActionButtons);
    }
  },
  beforeDestroy() {
    // 在beforeDestroy中移除鼠标悬停事件监听器
    const answerMessageElement = this.$el.querySelector('.answer-message');
    if (answerMessageElement) {
      answerMessageElement.removeEventListener('mouseenter', this.showActionButtons);
      answerMessageElement.removeEventListener('mouseleave', this.hideActionButtons);
    }
  },

  methods: {
    setDefaultAnswer(index) {
      this.newMessage = this.suggestions[index].question;
      this.newAnswer = this.suggestions[index].answer
      this.isClickTip = true;
      // this.$set(this.suggestions[index], 'showAnswer', !this.suggestions[index].showAnswer);
    },
    getUserContent(history) {
      if (history.length > 0) {
        const userEntry = history.find(entry => entry.role === 'user');
        return userEntry ? userEntry.content : '';
      }
      else {
        return ""
      }

    },
    handleSelect(index) {
      this.activeIndex = Number(index);
      // 处理选中项逻辑
    },
    handleSelectDrop1(item) {
      console.log("promptdefaultvalue", item.value)
      this.promptdefaultvalue = item.value
    },
    handleSelectDrop(item) {
      console.log("modeldefaultvalue", item.value)
      this.modeldefaultvalue = item.value
    },
    updateIsCollapse(value) {
      this.isCollapse = value;
      // this.updateIsCollapse(value);
    },
    showActionButtons(index) {
      console.log("index", index)
      if (index == 0) {
        this.floatactiveIndex = -1;
      }
      else {
        this.floatactiveIndex = index;

      }
    },
    hideActionButtons() {
      this.floatactiveIndex = null;
    },
    readAloud() {
      // 朗读功能的实现
    },
    copyContent() {
      // 复制功能的实现
    },
    likeMessage() {
      // 点赞功能的实现
    },
    dislikeMessage() {
      // 点踩功能的实现
    },
    regenerateMessage() {
      // 重新生成功能的实现
    },
    // beforeUploadImg(file) {
    //     if (file && file.type && file.name && file.size) {
    //         //截取文件的后缀，判断文件类型
    //         const FileExt = file.name.split('.').pop().toLowerCase();
    //         //计算文件的大小
    //         const isLt50M = file.size / 1024 / 1024 < 50; //这里做文件大小限制
    //         //如果大于50M
    //         if (!isLt50M) {
    //             this.$showMessage('上传文件大小不能超过 50MB!');
    //             return false;
    //         }
    //         //允许上传的图片格式
    //         const allowedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    //         //如果文件类型不在允许上传的范围内
    //         if (allowedImageTypes.includes(FileExt)) {
    //             return true;
    //         } else {
    //             this.$message.error("上传文件格式不正确, 仅支持 jpg, jpeg, png, gif, bmp 格式!");
    //             return false;
    //         }
    //     } else {
    //         this.$message.error("文件信息不完整!");
    //         return false;
    //     }
    // },

    // //上传文件之前
    // beforeUpload(file) {
    //     if (file.type != "" || file.type != null || file.type != undefined) {
    //         //截取文件的后缀，判断文件类型
    //         const FileExt = file.name.replace(/.+\./, "").toLowerCase();
    //         //计算文件的大小
    //         const isLt5M = file.size / 1024 / 1024 < 50; //这里做文件大小限制
    //         //如果大于50M
    //         if (!isLt5M) {
    //             this.$showMessage('上传文件大小不能超过 50MB!');
    //             return false;
    //         }
    //         //如果文件类型不在允许上传的范围内
    //         if (this.fileType.includes(FileExt)) {
    //             return true;
    //         }
    //         else {
    //             this.$message.error("上传文件格式不正确!");
    //             return false;
    //         }
    //     }
    // },
    //上传了的文件给移除的事件，由于我没有用到默认的展示，所以没有用到
    handleRemove() {
    },
    //这是我自定义的移除事件
    handleClose(i) {
      this.fileList.splice(i, 1);//删除上传的文件
      if (this.fileList.length == 0) {//如果删完了
        this.fileflag = true;//显示url必填的标识
        this.$set(this.rules.url, 0, { required: true, validator: this.validatorUrl, trigger: 'blur' })//然后动态的添加本地方法的校验规则
      }
    },
    //超出文件个数的回调
    handleExceed() {
      this.$message({
        type: 'warning',
        message: '超出最大上传文件数量的限制！'
      }); return
    },
    uploadImg(item) {
      // this.$showMessage('文件上传中........')
      //上传文件的需要formdata类型;所以要转
      var FormDatas = new FormData()
      FormDatas.append('file', item.file);

      let params = {
        file: FormDatas
      }
      this.dialogImageUrl = URL.createObjectURL(item.file);
      console.log("this.dialogImageUrl", item)

      this.fileList.push(item.file);
      upload_img(params).then(res => {
        console.log("upload_imgres", res.data.content)
        this.fileType = "img"
      })
    },
    //上传文件的事件
    uploadFile(item) {
      // this.$showMessage('文件上传中........')
      //上传文件的需要formdata类型;所以要转
      var FormDatas = new FormData()
      FormDatas.append('file', item.file);

      this.dialogFileUrl = item.file.name;
      let config = {
        embedding_model: "bce",
        index: "flat_ip",
        text_splitter: "default",
        chunk_size: 200,
        overlap: 50,
        chunk_split_method: "default"
      }
      let params = {
        config: JSON.stringify(config),
        file: FormDatas
      }
      this.fileList.push(item.file);
      upload_doc(params).then(res => {
        console.log("res", res.data.content)
        this.fileType = "file"
      })
    },
    //上传成功后的回调
    handleSuccess() {

    },
    beforeRemove() {

    },
    handlePreview() {

    },
    historyChat(question) {
      console.log("this.question", question)
      this.dialogImageUrl = ""
      this.dialogFileUrl = ""
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
    startChat() {
      console.log("this.chat_id", this.chat_id)
      // if (this.isClickTip == true) {
      //   //点了建议
      //   this.suggestionsorigin.push(
      //     {
      //       content: this.newMessage,
      //       role: "assistant"
      //     }
      //   )
      //   this.newMessage = ""
      //   setTimeout(() => {
      //     this.suggestionsorigin.push({
      //       content: this.newAnswer,
      //       role: 'user'
      //     });
      //   }, 500); // 2秒的延迟
      //   this.isClickTip = false
      // }
      // else {
        if (this.newMessage.trim() !== '' || this.newMessage.trim().length > 0) {
          this.chatMessages.push({ content: this.newMessage, role: 'user' });
          if (this.chat_id == "") {
            this.chat_id = this.guid()
          }
          console.log("chat_id", this.chat_id)
          let config = {
            "model": this.modeldefaultvalue,
            "prompt": this.promptdefaultvalue,
            "knowledge": "default",
            "LLM_config": "default"
          }

          let params = {
            dialogue_id: this.chat_id,
            query: this.newMessage,
            config: JSON.stringify(config)
            // history: JSON.stringify([{role:"hh",content:"xx"},{role:"hh",content:"xx"}])
            // {role:"hh",content:"xx"}
            // ,
          }
          console.log("params", params, this.promptdefaultvalue)
          if (this.fileType !== "") {
            if (this.fileType == "img") {
              chatImgStreamgpt(params, this.handleChunk, this.handleReferences)
            }
            else {
              let config1 = {
                "model": "default",
                "prompt": "default",
                "knowledge": "new",
                "LLM_config": "default"
              }

              let params1 = {
                dialogue_id: this.chat_id,
                query: this.newMessage,
                config: JSON.stringify(config1)
                // history: JSON.stringify([{role:"hh",content:"xx"},{role:"hh",content:"xx"}])
                // {role:"hh",content:"xx"}
                // ,
              }
              chatFileStreamgpt(params1, this.handleChunk, this.handleReferences)
            }
          }
          else {
            if (this.modeldefaultvalue == "spark") {
              chatgpt(params).then((res) => {
                this.chatMessages.push({ content: res.data.response, role: 'assistant', reference: res.data.reference });
                this.newhistory = {
                  dialogue_id: this.chat_id, history: this.chatMessages
                }
                const existingIndex = this.historyArrlist.findIndex(item => item.dialogue_id === this.chat_id);

                if (existingIndex === -1) {
                  this.historyArrlist.unshift(this.newhistory);
                } else {
                  console.log("Duplicate dialogue_id found, not adding.");
                }
                this.newMessage = '';
                this.chatStarted = true;
              });
            }
            else {
              chatStreamgpt(params, this.handleChunk, this.handleReferences);

            }
          }


        }
        else {
          this.$alert('请输入内容', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }
      // }

    },
    handleChunk(first, content) {
      if (first) {
        this.chatMessages.push({ content: '', role: 'assistant', reference: [] });
      }

      const lastMessageIndex = this.chatMessages.length - 1;
      this.chatMessages[lastMessageIndex].content += content;

      this.$set(this.chatMessages, lastMessageIndex, { ...this.chatMessages[lastMessageIndex] });
      this.newhistory = {
        dialogue_id: this.chat_id, history: this.chatMessages
      }
      const existingIndex = this.historyArrlist.findIndex(item => item.dialogue_id === this.chat_id);

      if (existingIndex === -1) {
        this.historyArrlist.unshift(this.newhistory);
      } else {
        console.log("Duplicate dialogue_id found, not adding.");
      }
      this.newMessage = '';
      this.chatStarted = true;
      this.fileList = []
    },
    handleReferences(reference) {
      console.log("reference", JSON.parse(reference).reference)
      const lastMessageIndex = this.chatMessages.length - 1;
      this.chatMessages[lastMessageIndex].content = JSON.parse(reference).response;

      this.chatMessages[lastMessageIndex].reference = JSON.parse(reference).reference;
      this.$set(this.chatMessages, lastMessageIndex, { ...this.chatMessages[lastMessageIndex] });
      console.log("this.chatMessages", this.chatMessages)

    },
    newChat() {
      this.dialogImageUrl = ""
      this.dialogFileUrl = ""
      if (this.chatMessages.length == 0) {
        //说明没有新建
        getChat().then((res) => {
          //
          console.log("getChat", res)

          this.chat_id = res.dialogue_id
          this.chatStarted = true;
          this.chatMessages = res.history
        }).catch((err) => {
          console.log("err")
        })
      }
      else {
        //保存在历史
        this.newhistory.showDeleteButton = false
        let newhistory = this.newhistory
        var isDuplicate = this.historyArrlist.some(function (item) {
          return item.dialogue_id === newhistory.dialogue_id;
        });

        // 如果不存在相同 dialogue_id 的记录，则将新记录添加到历史记录数组中
        if (!isDuplicate) {
          this.historyArrlist.unshift(newhistory);
        }
        else {
          getChat().then((res) => {
            console.log("getChat", res)
            this.chat_id = res.dialogue_id
            this.chatStarted = true;
            this.chatMessages = res.history
          }).catch((err) => {
            console.log("err")
          })
        }
        console.log(this.historyArrlist, "this.historyArrlist")
      }
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
    sendMessage(text) {
      this.newMessage = text;

      // gethistory().then((res) => {
      //     console.log("res", res)
      // }).catch((err) => {
      //     console.log('err', err)
      // })
    },
    removeFile(index) {
      this.fileList = []
    },
    isImage(content) {
      return /\.(jpg|jpeg|png|gif|bmp)$/i.test(content);
    },
    isFile(content) {
      return /^https?:\/\//i.test(content) && !this.isImage(content);
    },
    getFileName(content) {
      return content.split('/').pop();
    }
  }
}
</script>
<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.message-header,
.message-footer {
  background-color: #F56C6C;
  color: white;
  text-align: center;
  padding: 10px 0;
}

.message-main {
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
}

.message-content {
  color: black;
  font-size: 16px;
  margin-bottom: 20px;
}

.message-content-red {
  color: red;
  font-size: 16px;
  margin-bottom: 20px;
}

.subtext {
  color: gray;
}

@media (max-width: 600px) {

  .message-header,
  .message-footer {
    padding: 15px 0;
  }

  .message-main {
    padding: 10px;
  }

  .message-content,
  .message-content-red {
    font-size: 14px;
  }
}

.chat-container1 {
  /* 根据需要设置 */
  overflow-y: auto;
  margin-left: 20px;
  margin-right: 20px;
  /* width: 100%; */
  /* overflow: hidden; */
}
.input-wrapper1 {
    display: flex;
    align-items: center;
    background-color: #f1f1f1;
    border-radius: 20px;
    width: 100%;
    height: 40px;
    justify-content: space-between;
}
.input-field-wrapper1{
    display: flex;
    align-items: center;
    flex-grow: 1;
    position: relative;
}
</style>
