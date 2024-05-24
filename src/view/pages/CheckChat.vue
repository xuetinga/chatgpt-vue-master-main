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
            <el-menu default-active="3" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
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
                            <el-button type="primary" icon="el-icon-plus" @click="newChat">新条款</el-button>
                        </el-header>
                        <!-- Sidebar content here -->
                        <el-menu
                            style="background-color: antiquewhite; border-radius: 5px; height: 200px; justify-content: center;">
                            <el-menu-item v-for="(question, index) in historyArrlist" :key="index" width="190px"
                                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; "
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
                                            <i class="el-icon-user"> {{ message.content }}</i>
                                        </div>
                                    </div>
                                    <div v-else-if="message.role === 'assistant'" class="answer-message">
                                        <div class="card" style="width: 800px;">
                                            <i class="el-icon-sunny"> {{ message.content }}</i>

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

                            <div class="input-wrapper">

                                <div class="input-field-wrapper">
                                    <el-input v-model="newMessage" class="input-field" placeholder="请输入内容"
                                        @input="sendMessage">
                                    </el-input>

                                </div>
                                <div class="input-button">
                                    <div v-for="(file, index) in fileList" :key="index" class="file-tag">
                                        <span
                                            style=" overflow: hidden; text-overflow: ellipsis;font-size: 10px;">{{
                file.name }}</span>
                                        <i class="el-icon-close" @click="removeFile(index)"></i>
                                    </div>
                                    <el-upload class="upload-icon" action :http-request="uploadFile" ref="upload"
                                        :before-upload="beforeUpload" :show-file-list="false">
                                        <i class="el-icon-paperclip" style="margin-right: 5px;"></i>
                                    </el-upload>
                                    <i class="el-icon-s-promotion" @click="startChat" style="margin-right: 5px;">
                                    </i>
                                </div>

                            </div>
                        </el-footer>
                    </el-container>
                </el-container>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import axios from 'axios';
import { getChatMsg, chatgpt, chatupload, gethistory, setclause_check, getstatic, getChat, getChatchat } from "@/api/getData";

export default {
    data() {
        return {
            newMessage: "",
            promptall: [{
                value: "生成摘要",
            }, {
                value: '标签提取',
            }, {
                value: '内容检查',
            }],
            promptdefaultvalue: '',
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
            fileList: [],
            chat_id: "",
            newhistory: {},
            historyArrlist: [],
            configs: [],
            promptall: [],
            promptdefaultvalue: '',
            dynamicMarginLeft: '50px',
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
    methods: {

        beforeUpload(file) {
            const FileExt = file.name.split('.').pop().toLowerCase();
            const isLt50M = file.size / 1024 / 1024 < 50;

            if (!isLt50M) {
                this.$message.error('上传文件大小不能超过 50MB!');
                return false;
            }

            if (!this.fileType.includes(FileExt)) {
                this.$message.error('上传文件格式不正确!');
                return false;
            }

            return true;
        },
        handleClose(index) {
            this.fileList.splice(index, 1);
            if (this.fileList.length === 0) {
                this.fileflag = true;
                this.$set(this.rules.url, 0, { required: true, validator: this.validatorUrl, trigger: 'blur' });
            }
        },
        handleExceed() {
            this.$message({
                type: 'warning',
                message: '超出最大上传文件数量的限制！'
            });
            return;
        },

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
                "prompt": "default",
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

            setclause_check(params).then((res) => {
                console.log("resresresgetChatchat", res)

                this.chatMessages.push({ content: res.data.response, role: 'assistant', reference: res.data.reference });
                this.newhistory = {
                    dialogue_id: this.chat_id, history: this.chatMessages
                }
                this.historyArrlist.unshift(this.newhistory)
                this.newMessage = ''; // Clear the input after sending.
                this.chatStarted = true; // Switch to chat view.

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
        // startchat() {
        //     if (this.newMessage.trim() !== '') {
        //         console.log(" this.newMessage", this.newMessage)
        //         this.chatMessages.push({ content: this.newMessage, role: 'user' });
        //     }
        //     if (this.chat_id == "") {
        //         this.chat_id = this.guid()
        //     }
        //     console.log("chat_id", this.chat_id)
        //     let params = {
        //         dialogue_id: this.chat_id,
        //         query: this.newMessage,
        //         config: "default"
        //         // history: JSON.stringify([{role:"hh",content:"xx"},{role:"hh",content:"xx"}])
        //         // {role:"hh",content:"xx"}
        //         // ,
        //     }
        //     console.log("params", params)
        //     chatgpt(params).then((res) => {
        //         console.log("resresres", res.data)
        //         this.chatMessages.push({ content: res.data.response, role: 'assistant', reference: res.data.reference });
        //         this.newhistory = {
        //             dialogue_id: this.chat_id, history: this.chatMessages
        //         }

        //         this.newMessage = ''; // Clear the input after sending.
        //         this.chatStarted = true; // Switch to chat view.
        //     });
        // },
        sendMessage(text) {
            this.newMessage = text;
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


    }
}
</script>

<style>
.el-menu .el-menu-item {
    width: 100%;
}

.uploadcontainer {
    display: flex;
    align-items: center;
}

.upload-wrapper {
    margin-right: 10px;
    /* 调整上传按钮和输入框之间的间距 */
    flex-grow: 1;
    /* 占据剩余空间 */
}

.input-wrapper {
    display: flex;
    align-items: center;
    background-color: #f1f1f1;
    border-radius: 20px;
    width: 100%;
    height: 40px;
    justify-content: space-between;
}

.input-button {
    display: flex;
    align-items: center;
    background-color: transparent;
    justify-content: space-around;
    flex-direction: row;
}

.upload-icon,
.send-btn {
    /* background: transparent;
    border: none; */

}

.icon-btn {
    /* background: transparent;
    border: none; */
    /* color: #c0c4cc; */
    /* 这个颜色可以根据你的设计调整 */
    /* padding: 0 12px; */
}

.input-field-wrapper {
    display: flex;
    align-items: center;
    flex-grow: 1;
    position: relative;
}

.input-field .el-input__inner {
    border: none;
    background: transparent;
    box-shadow: none;
    /* flex-grow: 1; */
}

.file-tag {
    display: flex;
    align-items: center;
    background-color: #e0e0e0;
    border-radius: 12px;
    padding: 4px 4px;
    position: relative;
    line-height: 18px;
}

.file-tag span {
    margin-right: 0px;
}

.file-tag i {
    cursor: pointer;
    display: none;
}

.file-tag:hover i {
    display: inline-block;
}
</style>