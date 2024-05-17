<template>
    <el-container style="height: 100vh;">
        <el-aside width="150px" height=100vh; style=" position: relative; overflow: hidden; ">
            <div v-if="isCollapse"
                style="position: fixed; top:10px; border:0px;text-align: center;z-index: 1000;margin-left:70px; width: 10px; height: 10px;">
                <el-button @click="toggleCollapse">
                    <i :class="`el-icon-arrow-${isCollapse ? 'right' : 'left'}`"></i>
                </el-button>
            </div>
            <div v-else
                style="position: fixed; top:10px; border:0px;text-align: center;z-index: 1000;margin-left: 90px;">
                <el-button @click="toggleCollapse">
                    <i :class="`el-icon-arrow-${isCollapse ? 'right' : 'left'}`"></i>
                </el-button>
            </div>
            <el-menu default-active="1" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
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
        <el-container :style="{ 'margin-left': isCollapse ? '-40px' : '0px' }">

            <el-main>

                <el-container style="background-color: antiquewhite;height: 90vh;border-radius: 5px;">
                    <el-aside width="200px">
                        <el-header style="text-align: center; line-height: 40px; margin-top:10px; ">
                            <el-button type="primary" icon="el-icon-plus" @click="newChat">新聊天</el-button>
                        </el-header>
                        <!-- Sidebar content here -->
                        <el-menu
                            style="background-color: antiquewhite; border-radius: 5px; height: 200px; justify-content: center;">
                            <el-menu-item v-for="(question, index) in historyArrlist" :key="index" width="200px"
                                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 200px;"
                                @click="historyChat(question)">
                                <span slot="title" @mouseover="showDeleteButton(index)"
                                    @mouseleave="hideDeleteButton(index)" class="menu-item-wrapper">
                                    {{ question.history[0].content }}
                                    <el-button v-show="question.showDeleteButton" type="text" icon="el-icon-close"
                                        @click.stop="deleteItem(index)"
                                        style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%);"></el-button>
                                    <!-- 删除重命名 -->
                                </span>
                            </el-menu-item>
                        </el-menu>
                    </el-aside>

                    <el-container style="background-color: whitesmoke; border-radius: 5px;">

                        <el-main style="justify-content: center;">
                            <!-- 聊天页面 -->
                            <div v-if="chatStarted">
                                <div v-for="(message, index) in chatMessages" :key="index" class="chat-message">
                                    <div v-if="message.role === 'user'" class="answer-message">
                                        <div class="card"
                                            style=" background-color: rgba(244, 152, 24, 0.5); float: right;">
                                            <i class="el-icon-user">    {{ message.content }}</i>
                                        </div>
                                    </div>
                                    <div v-else-if="message.role === 'assistant'" class="answer-message">
                                        <div class="card" style="width: 800px;">
                                            <i class="el-icon-sunny">   {{ message.content }}</i>
                                           
                                            <div v-if="message.reference !== null">
                                                <el-divider></el-divider>
                                                <i class="el-icon-paperclip"
                                                    style="margin-top: 10px;margin-bottom: 10px;">Reference</i>
                                                <div v-for="(item, index) in message.reference" :key="index"
                                                    class="reference-item">
                                                    <a :href="item.link" target="_blank">{{ item[0] }}</a>
                                                    <div class="reference-content">{{ item[1] }}</div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else>
                                <el-row type="flex" class="main-message">
                                    <el-col :span="20">
                                        <div class="message-content">
                                            Yoka: 助力安全生产的强大知识管家
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

                            <el-select v-model="promptdefaultvalue" placeholder="请选择配置">
                                <el-option v-for="item in promptall" :key="item.value" :label="item.label"
                                    :value="item.value" style="text-align: center;">
                                    <span style="color: #8492a6; font-size: 13px">{{ item.value }}</span>
                                </el-option>
                            </el-select>

                            <div class="upload-container">
                                <div class="file-list-container">
                                    <el-upload-list :list="fileList" :disabled="true"></el-upload-list>
                                </div>
                                <el-upload class="upload-demo" action :http-request="uploadFile" ref="upload"
                                    :limit="fileLimit" :on-remove="handleRemove" :file-list="fileList"
                                    :on-exceed="handleExceed" :before-upload="beforeUpload" :show-file-list="false"
                                    :headers="headers" limit="1">
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
import { getChatMsg, chatgpt, chatupload, gethistory, setclause_check, getstatic, getChat, getChatchat } from "@/api/getData";
import Index from "./chatHome/index.vue";
export default {
    data() {
        return {
            chat_id: "",
            newhistory: {},
            historyArrlist: [],
            configs: [],
            promptall: [],
            promptdefaultvalue: 'default',
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
                // {
                //     header: '翻译',
                //     content: '帮我翻译苹果',
                //     message: '帮我翻译苹果'
                // },
                // {
                //     header: '摘要',
                //     content: '帮我分析这个摘要',
                //     message: '帮我分析这个摘要'
                // },
                // {
                //     header: '试题生成',
                //     content: '帮我生成一个试题',
                //     message: '帮我生成一个试题'
                // }
            ],
            chatMessages: [],
            chatStarted: false,
            chatMessagesList: [],
            //上传后的文件列表
            fileList: [],
            // 允许的文件类型
            fileType: ["pdf", "doc", "docx", "xls", "xlsx", "txt", "png", "jpg", "bmp", "jpeg"],
            // 运行上传文件大小，单位 M
            fileSize: 50,
            // 附件数量限制
            fileLimit: 5,
            //请求头
            headers: { "Content-Type": "multipart/form-data" },

        };
    },
    created() {
        console.log("created", this.$root.configs)
        gethistory().then((res) => {
            console.log("gethistoryres", res)
            this.historyArrlist = res.data
        }).catch((err) => {
            console.log("errr", err)
        })
        getstatic().then((res) => {
            console.log("getstatic111", res.data)

            this.configs = res.data.prompts

            this.promptall = res.data.prompts.map(prompt => {
                return {
                    value: prompt.scene
                };
            });
        }).catch((err) => {
            console.log("err", err)
        })
    },
    methods: {

        updateNewMessage() {

            this.newMessage = this.fileList.map(file => file.name).join(', '); // 示例中将文件名用逗号分隔
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse; // 切换状态
            this.dynamicMarginLeft = "150px"
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
            if (this.newMessage.trim() !== '') {
                console.log(" this.newMessage", this.newMessage)
                this.chatMessages.push({ content: this.newMessage, role: 'user' });
            }
            if (this.chat_id == "") {
                this.chat_id = this.guid()
            }
            console.log("chat_id", this.chat_id)
            let config = {
                "model": "default",
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
            console.log("params", params)

            chatgpt(params).then((res) => {
                this.chatMessages.push({ content: res.data.response, role: 'assistant', reference: res.data.reference });
                this.newhistory = {
                    dialogue_id: this.chat_id, history: this.chatMessages
                }
                this.newMessage = ''; // Clear the input after sending.
                this.chatStarted = true; // Switch to chat view.
                console.log("resresres", this.chatMessages)

            });

        },
        newChat() {
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

        newChat1() {

            if (this.newhistory !== "") {
                this.historyArrlist.unshift(this.newhistory)

            }
            else {

            }
            this.chat_id = ""
            this.chatStarted = false;

            // if (this.chatMessages.length > 0) {
            //     this.historyArrlist.push({ time: new Date(), content: this.chatMessages, title: this.chatMessages[0].content, showDeleteButton: false })
            // }
            this.chatMessages = [];

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
            console.log("FormDatas", item)

            var FormDatas = new FormData()
            FormDatas.append('file', item.file);
            console.log("FormDatas", FormDatas.get("file"))
            let params = {
                file: FormDatas.get("file"),
            }
            this.fileList.push(item.file);

            chatupload(params).then(res => {
                console.log("res", res.data.content)
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
        beforeRemove() {

        },
        handlePreview() {

        },

    }
}
</script>

<style>
/* Style for delete button */
.uploaditem {
    display: flex;
    flex-direction: column-reverse;
    /* 将子元素沿垂直方向倒序排列，文件列表在上方 */
}

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
    background-image: url(../../imgs/bg1.png);


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
    font-family: 'Courier New', Courier, monospace;
    font-size: 25px;
    font-weight: 700;

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



.fixed-button {}

.chat-message {
    justify-content: space-between;
    margin-bottom: 20px;
    /* 调整消息之间的间距 */
}

.question-message {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    /* 将提问消息放置在右边 */
    margin-right: 20px;
    /* 调整提问消息与边缘的距离 */
}

.answer-message {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    /* 将回答消息放置在左边 */
    margin-left: 20px;
    /* 调整回答消息与边缘的距离 */
}

.card {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    background-color: rgba(244, 152, 24, 0.1);
}

.card-content {
    margin-left: 10px;
    /* 调整回答消息内容与图标之间的距离 */
}

.reference-item {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
    color: rgb(23, 23, 23);
    font-size: 10px;
}

.reference-item a {
    display: block;
    margin-bottom: 5px;
}

.reference-content {
    display: block;
}

/* .reference-item:hover .reference-content {
    display: block;
} */

.upload-container {
    display: flex;
    flex-direction: column;
}

.file-list-container {
    margin-top: 0px;
    /* 如果需要将文件列表紧贴着按钮，可以调整此处的负值 */
    /* background-color: #ccc;
    width: 100px; */
}
</style>