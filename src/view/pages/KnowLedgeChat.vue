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
                    <el-menu-item index="8" @click.native="goToHelp">
                        <i class="el-icon-question"></i>
                        <span slot="title">帮助</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </el-aside>
        <el-container>

            <el-main>

                <el-container style="background-color: antiquewhite;height: 90vh;border-radius: 5px;">
                    <el-aside width="200px">
                        <el-header style="text-align: center; line-height: 40px ">
                            聊天
                            <el-button size="small" type="primary" icon="el-icon-plus" circle @click="newChat"></el-button>
                        </el-header>
                        <!-- Sidebar content here -->
                        <el-menu
                            style="background-color: antiquewhite; border-radius: 5px; height: 200px; justify-content: center;">
                            <el-menu-item v-for="(question, index) in chatMessagesList" :key="index" width="200px"
                                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 200px;"
                                @click="historyChat(question)">
                                <span slot="title" @mouseover="showDeleteButton(index)"
                                    @mouseleave="hideDeleteButton(index)" class="menu-item-wrapper">
                                    {{ question.title }}
                                    <el-button v-show="question.showDeleteButton" type="text" icon="el-icon-close"
                                        @click.stop="deleteItem(index)"
                                        style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%);"></el-button>
                                    <!-- 删除重命名 -->
                                </span>
                            </el-menu-item>
                        </el-menu>
                    </el-aside>

                    <el-container style="background-color: bisque; border-radius: 5px;">

                        <el-main style="justify-content: center;">
                            <div v-if="chatStarted">
                                <div v-for="(message, index) in chatMessages" :key="index">
                                    <div v-if="message.type === 'question'" class="question-message">
                                        <i class="el-icon-user"></i>
                                        <span>{{ message.content }}</span>
                                    </div>
                                    <div v-else-if="message.type === 'answer'" class="answer-message">
                                        <div class="card">
                                            <i class="el-icon-sunny"></i>
                                            <div class="card-content">
                                                {{ message.content }}
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div v-else>
                                <el-row type="flex" class="main-message">
                                    <el-col :span="20">
                                        <div class="message-content">
                                            Yoca copilot：利用尖端人工智能和实时 Google 见解增强您的聊天能力！
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" class="response-options">
                                    <el-col :span="8" v-for="(card, index) in cards1" :key="index">
                                        <el-card @click.native="sendMessage(card.message)">
                                            <div slot="header" class="clearfix">
                                                <span>{{ card.header }}</span>
                                            </div>
                                            <div class="text item">
                                                {{ card.content }}
                                            </div>
                                        </el-card>
                                    </el-col>
                                </el-row>
                            </div>

                        </el-main>


                        <el-footer style="align-items: flex-start; display: flex">
                            <!-- Input area -->
                           
                            <el-upload auto-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                                :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple
                                :limit="3" :on-exceed="handleExceed" :file-list="fileList">
                                <i class="el-icon-upload2"></i>
                            </el-upload>
                            <div class="flex-div uploaditem">
                                <el-tooltip class="item" effect="dark" :content="tag.name" placement="top-start"
                                    v-for="(tag, index) in fileList" :key="index">
                                    <el-tag style="margin-right:10px;display:flex;" :disable-transitions="false"
                                        @close="handleClose(index)" closable @click="downloadFile(tag)"><i
                                            class="el-icon-paperclip"></i><span class="tagtext">{{ tag.name
                                            }}</span></el-tag>
                                </el-tooltip>
                                <el-upload class="upload-demo" action :http-request="uploadFile" ref="upload"
                                    :limit="fileLimit" :on-remove="handleRemove" :file-list="fileList"
                                    :on-exceed="handleExceed" :before-upload="beforeUpload" :show-file-list="false"
                                    :headers="headers">
                                    <!-- action="/api/file/fileUpload" -->
                                    <el-button class="btn"><i class="el-icon-paperclip"></i>上传附件</el-button>
                                </el-upload>
                            </div>

                            <!-- 上传文件限制doc  上传文件请求接口 给的形式是啥  -->

                            <!-- 配置 提示帮我生成摘要 内容是啥；模板2；模板2 这里点击页面要变化 请求接口 对话id 响应内容 -->

                            <el-input v-model="newMessage" placeholder="请输入内容" @input="sendMessage" />
                            <el-button type="primary" @click="startChat">提交</el-button>
                            <!-- 两个接口  一个文件上传一个对话 -->
                        </el-footer>
                    </el-container>
                </el-container>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { getChatMsg, chatgpt,chatupload } from "@/api/getData";
export default {
    data() {
        return {
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
                    content: '对于经典文献，光合作用的概念很简单。',
                    message: '对于经典文献，光合作用的概念很简单。'
                },
                {
                    header: '什么',
                    content: '细胞的结构是什么? 它有哪些不同的部分?',
                    message: '细胞的结构是什么? 它有哪些不同的部分?'
                },
                {
                    header: 'WHO',
                    content: '国际冠状病毒剧烈肺炎有哪些? 他们怎么影响全国家?',
                    message: '国际冠状病毒剧烈肺炎有哪些? 他们怎么影响全国家?'
                }
            ],
            chatMessages: [],
            chatStarted: false,
            chatMessagesList: [],
            //上传后的文件列表
            fileList: [],
            // 允许的文件类型
            fileType: ["pdf", "doc", "docx", "xls", "xlsx", "txt", "png","jpg", "bmp", "jpeg"],
            // 运行上传文件大小，单位 M
            fileSize: 50,
            // 附件数量限制
            fileLimit: 5,
            //请求头
            headers: { "Content-Type": "multipart/form-data" },


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
        submitForm() {
            console.log('Submitting form data along with the fileList:',);

        },
        sendMessage(text) {
            this.newMessage = text;
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
            console.log("this.$refs.upload.", this.$refs.upload)
            if (this.newMessage.trim() !== '') {
                console.log(" this.newMessage", this.newMessage)
                this.chatMessages.push({ content: this.newMessage, type: 'question' });
                // Dummy answer for the example.
                const dummyAnswer = 'This is an automated response.';
                this.chatMessages.push({ content: dummyAnswer, type: 'answer' });
            }
            let chat_id = this.guid()
            console.log("chat_id", chat_id)
            let params = {
                chat_id: chat_id,
                query: this.newMessage,
                // history: JSON.stringify([{role:"hh",content:"xx"},{role:"hh",content:"xx"}])
                // {role:"hh",content:"xx"}
                // ,
            }
            console.log("params", params)
            chatgpt(params).then((res) => {
                console.log("resresres", res.data)
                this.newMessage = ''; // Clear the input after sending.
                this.chatStarted = true; // Switch to chat view.
            });

        },
        newChat() {
            this.chatStarted = false;
            if (this.chatMessages.length > 0) {
                this.chatMessagesList.push({ time: new Date(), content: this.chatMessages, title: this.chatMessages[0].content, showDeleteButton: false })
                console.log("this.chatMessages", this.chatMessagesList)
            }
            this.chatMessages = [];

        },
        historyChat(question) {
            this.chatStarted = true;
            console.log("this.chatMessages", question)
            this.chatMessages = question.content
        },
        showDeleteButton(index) {
            console.log("indexindex", index)
            this.chatMessagesList[index].showDeleteButton = true;
        },
        hideDeleteButton(index) {
            this.chatMessagesList[index].showDeleteButton = false
        },
        deleteItem(index) {
            this.chatMessagesList.splice(index, 1);
        },
        //上传文件之前
        beforeUpload(file) {
            if (file.type != "" || file.type != null || file.type != undefined) {
                //截取文件的后缀，判断文件类型
                const FileExt = file.name.replace(/.+\./, "").toLowerCase();
                //计算文件的大小
                const isLt5M = file.size / 1024 / 1024 < 50; //这里做文件大小限制
                //如果大于50M
                if (!isLt5M) {
                    this.$showMessage('上传文件大小不能超过 50MB!');
                    return false;
                }
                //如果文件类型不在允许上传的范围内
                if (this.fileType.includes(FileExt)) {
                    return true;
                }
                else {
                    this.$message.error("上传文件格式不正确!");
                    return false;
                }
            }
        },
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
        //上传文件的事件
        uploadFile(item) {
            // this.$showMessage('文件上传中........')
            //上传文件的需要formdata类型;所以要转
            console.log("FormDatas",item)

            var FormDatas = new FormData()
            FormDatas.append('file',item.file);
            console.log("FormDatas",FormDatas.get("file"))
            let params={
                file:FormDatas.get("file"),
            }
            chatupload(params).then(res => {
                console.log("res",res.data.content)
                // if (res.data.id != '' || res.data.id != null) {
                //     this.fileList.push(item.file);//成功过后手动将文件添加到展示列表里
                //     let i = this.fileList.indexOf(item.file)
                //     this.fileList[i].id = res.data.id;//id也添加进去，最后整个大表单提交的时候需要的
                //     if (this.fileList.length > 0) {//如果上传了附件就把校验规则给干掉
                //         this.fileflag = false;
                //         this.$set(this.rules.url, 0, '')
                //     }
                //     //this.handleSuccess();
                // }
            })
        },
        //上传成功后的回调
        handleSuccess() {

        },
        beforeRemove(){

        },
        handlePreview(){

        },

    }
}
</script>

<style>
/* Style for delete button */
.el-button {
    font-size: 14px;
    /* Adjust font size as needed */
    color: #ff0000;
    /* Red color for the delete button */
}

.main-message {
    margin-bottom: 30px;
    /* Adjust as needed */
    padding: 20px;
    text-align: center;
    border-radius: 5px;
    background-color: rgb(255, 255, 255);
    justify-content: center;


}

.response-options {
    text-align: center;
    padding-left: 20;
    margin-bottom: 20px;
}

.el-card {
    cursor: pointer;
    margin: 10px 10px;
}

.message-content {
    font-size: 20px;
}

.user-message {
    text-align: left;
}

.bot-message {
    text-align: left;
}

.el-menu .el-menu-item {
    width: 100%;
}
.answer-message{
    margin-right: 0;
}
</style>