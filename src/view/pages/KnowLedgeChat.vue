<template>
    <el-container class="background-container">
        <el-header class="header-container" style="height: 60px;">
            <img src="../../imgs/logo1.png" class="logo" />
            
        </el-header>
        <el-main style="padding: 0px;">
            <el-container class="main-container">
                <el-aside width="220px" class="aside-container">
                    <el-header class="aside-header">
                        <el-button type="primary" icon="el-icon-plus" @click="newChat" round>新对话</el-button>
                    </el-header>
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
                                    <div class="card" >
                                        <i class="el-icon-user" style="line-height: 1.5;"> {{ message.content }}</i>
                                    </div>
                                </div>
                                <div v-else-if="message.role === 'assistant'" class="answer-message">
                                    <div class="card" style=" background-color: #fff; float: left; color:#000; ">
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
                                                        {{ item[1].content }}
                                                    </template>
                                                    <template v-else>
                                                        {{item[1].standard_id}} {{item[1].standard}}
                                                    </template>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else>

                            <!-- <el-row type="flex" class="response-options">
                                    <el-col :span="8" v-for="(card, index) in cards1" :key="index">
                                        <el-card @click.native="sendMessage(card.message)">
                                            <div slot="header" class="clearfix">
                                                <span>{{ card.header }}</span>
                                            </div>
                                            <div class="text item">
                                                {{ card.content }}
                                            </div>
                                            <div v-if="message.reference != null">
                                                <el-divider></el-divider>
                                               
                                            </div>
                                        </el-card>
                                    </el-col>
                                </el-row> -->
                        </div>
                    </el-main>

                    <el-footer style="align-items: flex-start; display: flex;margin-bottom: 5px; padding: 0px;">
                        <!-- Input area -->


                        <div class="input-wrapper">
                            <!-- <el-select v-model="promptdefaultvalue" placeholder="默认" class="input-select1">
                                    <el-option v-for="item in models" :key="item.value" :label="item.label"
                                        :value="item.value" style="text-align: center;">
                                        <span style="color: #8492a6; font-size: 13px">{{ item.value }}</span>
                                    </el-option>
                                </el-select> -->
                            <el-dropdown class="input-select1">
                                <span class="el-dropdown-link">
                                    {{ promptdefaultvalue }}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-for="item in models" :key="item.label"
                                        @click.native="handleSelectDrop(item)">
                                        {{ item.value }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <div class="input-field-wrapper">
                                <el-input v-model="newMessage" class="input-field" placeholder="请输入内容"
                                    @input="sendMessage">
                                </el-input>

                            </div>
                            <div class="input-button">
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
import { chatkbStreamgpt, getkbhistory, getChatMsg, chatgpt, chatupload, gethistory, setclause_check, getstatic, getChat, getChatchat, delete_dialogue, chatStreamgpt, getkbChat, getclauseChat } from "@/api/getData";
import Index from "./chatHome/index.vue";
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
            currentStreamMessage: '',
            activeIndex: null,
            selected: '1',
            chat_id: "",
            newhistory: {},
            historyArrlist: [],
            configs: [],
            promptall: [],
            models: [],
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
            itemDetailsVisible: [],
            isHovered: [],
        };
    },
    created() {
        console.log("created", this.$root.configs)
        getkbhistory().then((res) => {
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
            this.models = res.data.models.map(prompt => {
                return {
                    value: prompt
                };
            });
        }).catch((err) => {
            console.log("err", err)
        })
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
        showFullReference(messageIndex, referenceIndex) {
            console.log("this.chatMessages[messageIndex]", this.chatMessages[messageIndex])
            this.$set(this.chatMessages[messageIndex].isHovered, referenceIndex, true);
        },
        hideFullReference(messageIndex, referenceIndex) {
            this.$set(this.chatMessages[messageIndex].isHovered, referenceIndex, false);
        },
        handleSelectDrop(item) {
            console.log("promptdefaultvalue", item.value)
            this.promptdefaultvalue = item.value
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.chatContainer;
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
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
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                delete_dialogue(params).then((res) => {
                    this.historyArrlist.splice(index, 1);
                    this.newMessage = ""
                    this.chatStarted = false
                    this.$nextTick(() => {
                        document.activeElement.blur();
                    });
                    this.$nextTick(() => {
                        this.$refs.dummyInput.focus();
                    });
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
        updateNewMessage() {
            this.newMessage = this.fileList.map(file => file.name).join(', '); // 示例中将文件名用逗号分隔
        },
        updateIsCollapse(value) {
            this.isCollapse = value;
            // this.updateIsCollapse(value);
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
            console.log("this.chat_id", this.chat_id)

            if (this.newMessage.trim() !== '' || this.newMessage.trim().length > 0) {
                this.chatMessages.push({ content: this.newMessage, role: 'user' });
                if (this.chat_id == "") {
                    this.chat_id = this.guid()
                }
                console.log("chat_id", this.chat_id)
                let config = {
                    "model": "deepseek",
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
                chatkbStreamgpt(params, this.handleChunk, this.handleReferences);


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
            console.log("reference", JSON.parse(reference).reference)
            const lastMessageIndex = this.chatMessages.length - 1;
            this.chatMessages[lastMessageIndex].content = JSON.parse(reference).response;

            this.chatMessages[lastMessageIndex].reference = JSON.parse(reference).reference;
            this.$set(this.chatMessages, lastMessageIndex, { ...this.chatMessages[lastMessageIndex] });
            console.log("this.chatMessages", this.chatMessages)
            // 初始化itemDetailsVisible数组
            this.itemDetailsVisible = Array(this.chatMessages[lastMessageIndex].reference.length).fill(false);

        },
        showDetails(index) {
            this.$set(this.itemDetailsVisible, index, true);
        },
        hideDetails(index) {
            this.$set(this.itemDetailsVisible, index, false);
        },
        newChat() {
            if (this.chatMessages.length == 0) {
                //说明没有新建
                getkbChat().then((res) => {
                    //
                    console.log("getkbChat", res)

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
.background-container {
    background-image: url(../../imgs/bg.png);
    background-size: cover;
    /* Ensure the image covers the entire container */
    background-position: center;
    /* Center the image */
    background-repeat: no-repeat;
    /* Prevent the image from repeating */
    height: 100vh;
    /* Full viewport height */
    width: 100%;
    padding: 2px;
    /* Full width */
}

.header-container {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    margin-left: 50px;
    height: 40px;
    justify-content: center;

        /* border-bottom: 1px solid #e0e0e0; */
}

.logo {
    width: 125px;
    height: 50px;
}

.title {
    font-family: 'Courier New', Courier, monospace;
    /* Change to the font family you need */
    font-size: 20px;
    /* Adjust size as needed */
    font-weight: bold;
    color: #333;
    /* Adjust color as needed */
    margin-left: 10px;
}

.main-container {
    height: 85vh;
    display: flex;
    background-color: #f2fbff;
    margin-left: 50px;
    margin-right: 50px;
    border-radius: 25px;
}

.aside-container {
    padding: 20px;
    display: flex;
    flex-direction: column;

    border-radius: 25px;
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.aside-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.aside-menu {
    margin-top: 20px;
}

.history-list {
    flex-grow: 1;
    margin-top: 20px;
    overflow-y: auto;
}

.history-item {
    padding: 10px;
    border-bottom: 1px solid #dcdcdc;
}





.feedback {
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    color: #333;
}

.main-content {
    padding: 20px;
    overflow-y: auto;
    background-color: #e0e0e0;
    margin-right: 0px;
    background-image: url(../../imgs/bgsmall.png);
    background-size: cover;
    /* Ensure the image covers the entire container */
    background-position: center;
    /* Center the image */
    background-repeat: no-repeat;
    margin-bottom: 10px;
    height: 50vh;
    border-radius: 25px;
}

.footer-container {
    text-align: center;
    padding: 10px;
    background: rgba(255, 255, 255, 0.8);
    border-top: 1px solid #e0e0e0;
}

.menu-item-history:hover {
    border-radius: 10px;
    /* 圆角 */
}

.chat-container {
    max-height: 600px;
    /* 根据需要设置 */
    overflow-y: auto;
    margin-left: 20px;
    margin-right: 20px;
    /* width: 100%; */
    /* overflow: hidden; */
}

/* 自定义滚动条样式 */
.chat-container::-webkit-scrollbar {
    width: 6px;
    /* 滚动条宽度 */
}

.chat-container::-webkit-scrollbar-track {
    background: transparent;
    /* 滚动条轨道颜色 */
    border-radius: 10px;
    /* 轨道圆角 */
}

.chat-container::-webkit-scrollbar-thumb {
    background: transparent;
    /* 滚动条拇指颜色 */
    border-radius: 10px;
    /* 拇指圆角 */
}

.chat-container::-webkit-scrollbar-thumb:hover {
    background: transparent;
    /* 鼠标悬停时的颜色 */
}

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
    overflow: hidden;
    border-radius: 15px;
    /* 调整回答消息与边缘的距离 */
}

.card {
    border-radius: 15px;
    padding: 10px;
    background-color: #1385f6;
    color: #fff;
    display: inline-block;
    font-size: 15px;
    word-wrap: break-word;
    padding: 10px;
    line-height: 1.2;
}

.input-wrapper {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 25px;
    width: 100%;
    height: 60px;
    justify-content: space-between;
    margin-bottom: 10px
}

.input-button {
    display: flex;
    align-items: center;
    background-color: transparent;
    justify-content: space-around;
    flex-direction: row;
    margin-right: 10px;
}

.input-select1 {
    margin-left: 20px;
}


.reference-item {
    padding: 5px 0;
    /* Add padding between references */
}

.reference-content {
    display: block;
    white-space: nowrap;
    /* Prevent text from wrapping */
    overflow: hidden;
    text-overflow: ellipsis;
    /* Show ellipsis for overflow text */
}
.custom-scrollbar::-webkit-scrollbar {
  width: 2px; /* Width of the vertical scrollbar */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1; /* Color of the scrollbar track */
  border-radius: 10px; /* Round corners of the track */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888; /* Color of the scrollbar thumb */
  border-radius: 10px; /* Round corners of the thumb */
  border: 2px solid #f1f1f1; /* Space around the thumb */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555; /* Color of the scrollbar thumb when hovered */
}

.custom-scrollbar {
  scrollbar-width: thin; /* For Firefox: make scrollbar thin */
  scrollbar-color: #888 #f1f1f1; /* For Firefox: thumb and track color */
}

</style>