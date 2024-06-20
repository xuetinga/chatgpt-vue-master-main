<template>
    <el-container class="background-container">
        <el-header class="header-container" style="height: 40px;">
            <img src="../../imgs/logo1.png" class="logo" />
            <span class="title">Yoka copilot</span>
        </el-header>
        <el-main>
            <el-container class="main-container">
                <el-aside width="200px" class="aside-container">
                    <el-header class="aside-header">
                        <el-button type="primary" icon="el-icon-plus" @click="newChat">新条款</el-button>
                    </el-header>
                    <!-- Sidebar content here -->
                    <el-menu @select="handleSelect"
                    class="custom-scrollbar"
                        style="background-color: #f2fbff; justify-content: center;  height:70vh; margin-bottom:20px; overflow-x: hidden; ">
                        <el-menu-item v-for="(question, index) in historyArrlist" :key="index" :index="index.toString()"
                            class="menu-item-history" @click="historyChat(question, index)">
                            <span slot="title" @mouseover="showDeleteButton(index)"
                                @mouseleave="hideDeleteButton(index)" class="menu-item-wrapper">
                                {{ getUserContent(question.history) }}
                                <el-button v-show="question.showDeleteButton" type="text" icon="el-icon-close"
                                    @click.stop="deleteItem(index)"
                                    style="position: absolute; right: 5px; top: 55%; transform: translateY(-51%);"></el-button>
                            </span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main class="main-content">
                        <div v-if="chatStarted" class="chat-container" ref="chatContainer">
                            <div v-for="(message, index) in chatMessages" :key="index" class="chat-message">
                                <div v-if="message.role === 'user'" class="answer-message">
                                    <div class="card"  style=" background-color: #fff; float: left; color:#000">
                                        <i class="el-icon-user"> {{ message.content }}</i>
                                    </div>
                                </div>
                                <div v-else-if="message.role === 'assistant'" class="answer-message">
                                    <div class="card" style="width: 800px;">

                                        <span v-if="index === chatMessages.length - 1">
                                            <vue-markdown :source="message.content" :breaks="true" :typographer="true"
                                                :linkify="true" :highlight="false"></vue-markdown>
                                        </span>
                                        <span v-else>
                                            {{ message.content }}
                                        </span>
                                        <div v-if="message.reference.length > 0">
                                            <el-divider></el-divider>
                                            <i class="el-icon-paperclip"
                                                style="margin-top: 10px;margin-bottom: 10px;">Reference</i>

                                            <div v-for="(item, index1) in message.reference" :key="index1"
                                                class="reference-item">
                                                <div class="reference-content"
                                                    @mouseenter="showFullReference(index, index1)"
                                                    @mouseleave="hideFullReference(index, index1)">
                                                    <template v-if="message.isHovered[index1]">
                                                        {{ item[0] }} {{ item[2] }}
                                                    </template>
                                                    <template v-else>
                                                        {{ item[1] }}
                                                    </template>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else>
                           
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
                                    <span style=" overflow: hidden; text-overflow: ellipsis;font-size: 10px;">{{
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
</template>

<script>
import axios from 'axios';
import { clause_doc_stream_check, delete_dialogue, chatclauseStreamgpt, getclausehistory, getChatMsg, chatgpt, chatupload, gethistory, setclause_check, getstatic, getChat, getChatchat, getclauseChat } from "@/api/getData";
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
    created() {
        console.log("created", this.$root.configs)
        getclausehistory().then((res) => {
            console.log("gethistoryres", res.data)
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
            this.models = res.data.models.map(prompt => {
                return {
                    value: prompt
                };
            });
        }).catch((err) => {
            console.log("err", err)
        })
    },
    data() {
        return {
            selected: "3",
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
            isHovered: [],
        };
    },
    watch: {

        chatMessages: {
            handler(newMessages) {
                this.scrollToBottom();
                console.log("newMessages", newMessages)
                newMessages.forEach(message => {
                    // 确保 message 对象具有 reference 属性并进行初始化
                    if (!message.reference) {
                        this.$set(message, 'reference', []);
                    }
                    if (!message.isHovered) {
                        this.$set(message, 'isHovered', Array(message.reference.length).fill(false));
                    }
                });
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        historyChat(question, index) {
            console.log("this.question", question)
            this.chatStarted = true;
            this.historyArrlist.forEach((item, i) => {
                item.showDeleteButton = i === index;
            });
            this.newhistory = question
            this.chatMessages = question.history
            this.chat_id = question.dialogue_id
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.chatContainer;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        },
        showFullReference(messageIndex, referenceIndex) {
            console.log("this.chatMessages[messageIndex]", this.chatMessages[messageIndex])
            this.$set(this.chatMessages[messageIndex].isHovered, referenceIndex, true);
        },
        hideFullReference(messageIndex, referenceIndex) {
            this.$set(this.chatMessages[messageIndex].isHovered, referenceIndex, false);
        },
        showDeleteButton(index) {
            this.$set(this.historyArrlist[index], 'showDeleteButton', true);
        },
        hideDeleteButton(index) {
            this.$set(this.historyArrlist[index], 'showDeleteButton', false);
        },
        deleteItem(index) {
            console.log("deleteItem", this.historyArrlist[index])

            let params = {
                dialogue_id: this.historyArrlist[index].dialogue_id,
            }
            this.$confirm('此操作将永久删除该对话, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                delete_dialogue(params).then((res) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.historyArrlist.splice(index, 1);
                    this.newMessage = ""
                    this.chatStarted = false
                    // this.$nextTick(() => {
                    //     document.activeElement.blur();
                    // });
                    // this.$nextTick(() => {
                    //     this.$refs.dummyInput.focus();
                    // });
                }).catch((err) => {

                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        handleSelect(index) {
            this.activeIndex = Number(index);
            // 处理选中项逻辑
        },
        getUserContent(history) {
            if (history.length > 0) {
                const userEntry = history.find(entry => entry.role === 'assistant');
                return userEntry ? userEntry.content : '';
            }
            else {
                return ""
            }

        },
        updateIsCollapse(value) {
            this.isCollapse = value;
            // this.updateIsCollapse(value);
        },
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


            this.fileList.push(item.file);

            // .then(res => {
            // console.log("res", res.data.content)
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
            // })
        },
        handleChunk1(first, content) {
            if (first) {
                this.chatMessages.push({ content: '', role: 'assistant', reference: [] });
            }
            console.log("content", content)

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
            console.log("this.chat_id", this.chat_id)

            if (this.newMessage.trim() !== '' || this.newMessage.trim().length > 0 || this.fileList.length > 0) {
                if (this.fileList.length > 0) {
                    // this.newMessage = ""
                    this.chatMessages.push({ content: "让我来分析这个文档      " + this.fileList[0].name, role: 'user' });

                }
                else {
                    this.chatMessages.push({ content: this.newMessage, role: 'user' });
                }
                if (this.chat_id == "") {
                    this.chat_id = this.guid()
                }
                console.log("chat_id", this.chat_id)
                let config = {
                    "model": "deepseek",
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
                if (this.fileList.length > 0) {
                    let params1 = {
                        dialogue_id: this.chat_id,
                        config: JSON.stringify(config),
                        file: this.fileList[0]
                    }
                    clause_doc_stream_check(params1, this.handleChunk1)
                }
                else {
                    chatclauseStreamgpt(params, this.handleChunk, this.handleReferences);

                }
            }
            else {


                this.$alert('请输入内容', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                });


            }


        },
        handleChunk(first, content) {
            if (first) {
                this.chatMessages.push({ content: '', role: 'assistant', reference: [] });
            }
            console.log("content", content)

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
        },
        handleReferences(reference) {
            console.log("this.chatMessages111", this.chatMessages);

            if (this.chatMessages.length === 0 || !this.chatStarted) {
                // If no message exists, create a new one
                this.chatMessages.push({ content: '', role: 'assistant', reference: [] });
                this.newMessage = '';
                this.chatStarted = true;
            }
            const lastMessageIndex = this.chatMessages.length - 1;
            this.chatMessages[lastMessageIndex].reference = JSON.parse(reference).reference;
            this.chatMessages[lastMessageIndex].content = JSON.parse(reference).response;

            this.$set(this.chatMessages, lastMessageIndex, { ...this.chatMessages[lastMessageIndex] });

            // Initialize itemDetailsVisible array
            this.itemDetailsVisible = Array(this.chatMessages[lastMessageIndex].reference.length).fill(false);

            console.log("this.chatMessages", this.chatMessages);

            // Update the historyArrlist
            this.newhistory = {
                dialogue_id: this.chat_id, history: this.chatMessages
            };

            const existingIndex = this.historyArrlist.findIndex(item => item.dialogue_id === this.chat_id);

            if (existingIndex === -1) {
                this.historyArrlist.unshift(this.newhistory);
            } else {
                this.historyArrlist[existingIndex] = this.newhistory;
            }
        },

        newChat() {
            if (this.chatMessages.length == 0) {
                //说明没有新建
                getclauseChat().then((res) => {
                    //
                    console.log("getclauseChat", res)

                    this.chat_id = res.dialogue_id
                    this.chatStarted = true;
                    console.log("chatStarted", this.chatStarted)

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
        removeFile(index) {
            this.fileList = []
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

.menu-item-history {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 5px;
    border-radius: 10px;


}

.menu-item-history:hover {
    border-radius: 10px;
    /* 圆角 */
}
</style>