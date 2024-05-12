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
            <el-menu default-active="3" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                <el-menu-item index="0" @click.native="goToMain">
                    <img src="../../imgs/logo.png" style="width: 25px; height: 25px;" />
                    <span slot="title">Yoka</span>
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
        <el-header style="text-align: center; line-height: 40px; margin-top:10px; ">
            <el-button type="primary" icon="el-icon-plus" @click="newChat">新条款</el-button>
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

    <el-container style="background-color: bisque; border-radius: 5px;">

        <el-main style="justify-content: center;">
            <!-- 聊天页面 -->
            <div v-if="chatStarted">
                <div v-for="(message, index) in chatMessages" :key="index" class="chat-message">
                    <div v-if="message.role === 'user'" class="answer-message">
                        <div class="card" style=" background-color: rgba(244, 152, 24, 0.2); float: right;">
                            <i class="el-icon-user"></i>

                            <div class="card-content">
                                {{ message.content }}
                            </div>
                        </div>
                    </div>
                    <div v-else-if="message.role === 'assistant'" class="answer-message">
                        <div class="card" style="width: 800px;">
                            <i class="el-icon-sunny"></i>
                            <div class="card-content">
                                {{ message.content }}
                            </div>
                            <el-divider></el-divider>
                            <i class="el-icon-paperclip" style="margin-top: 10px;margin-bottom: 10px;">Reference</i>
                            
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
            <!-- Input area -->

            <!-- <el-select v-model="promptdefaultvalue" placeholder="请选择配置">
                <el-option v-for="item in promptall" :key="item.value" :label="item.label"
                    :value="item.value" style="text-align: center;">
                    <span style="color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
            </el-select> -->

            <el-upload class="upload-demo" action :http-request="uploadFile" ref="upload" :limit="fileLimit"
                :on-remove="handleRemove" :file-list="fileList" :on-exceed="handleExceed"
                :before-upload="beforeUpload" :show-file-list="true" :headers="headers" limit="1"
                :style="{ marginTop: fileList.length === 1 ? '-10px' : '0' }">
                <!-- action="/api/file/fileUpload" -->
                <el-button class="btn"><i class="el-icon-paperclip"></i>上传条款</el-button>
            </el-upload>
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
import axios from 'axios';
export default {
    data() {
        return {
            newMessage:"",
            promptall: [{
                value:"生成摘要",
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
    methods: {
        startchat(){
            if (this.newMessage.trim() !== '') {
                console.log(" this.newMessage", this.newMessage)
                this.chatMessages.push({ content: this.newMessage, role: 'user' });
            }
            if(this.chat_id == ""){
                this.chat_id = this.guid()
            }
            console.log("chat_id", this.chat_id )
            let params = {
                dialogue_id: this.chat_id,
                query: this.newMessage,
                config:"default"
                // history: JSON.stringify([{role:"hh",content:"xx"},{role:"hh",content:"xx"}])
                // {role:"hh",content:"xx"}
                // ,
            }
            console.log("params", params)
            chatgpt(params).then((res) => {
                console.log("resresres", res.data)
                this.chatMessages.push({ content: res.data.response, role: 'assistant',reference:res.data.reference });
                this.newhistory = {
                    dialogue_id:this.chat_id,history:this.chatMessages
                }

                this.newMessage = ''; // Clear the input after sending.
                this.chatStarted = true; // Switch to chat view.
            });
        },
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
        submitForm() {
            console.log('Submitting form data along with the fileList:',);

        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        uploadFiles() {
            const formData = new FormData();
            this.fileList.forEach(file => {
                formData.append('files', file.raw);
            });

            axios.post('https://your-remote-api.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    // 处理上传成功的逻辑
                    console.log('文件上传成功', response.data);
                })
                .catch(error => {
                    // 处理上传失败的逻辑
                    console.error('文件上传失败', error);
                });
        }

    }
}
</script>

<style>
.el-menu .el-menu-item {
    width: 100%;
}
</style>