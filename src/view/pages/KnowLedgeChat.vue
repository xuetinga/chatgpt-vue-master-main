<template>
    <el-container style="height: 100vh;">

        <Nav :isCollapse="isCollapse" @update:isCollapse="updateIsCollapse" :isSelect="selected"></Nav>

        <el-container :style="{ 'margin-left': isCollapse ? '-40px' : '0px' }">
            <el-main>
                <el-container style="background-color: antiquewhite;height: 90vh;border-radius: 5px;">
                    <el-aside width="200px" class="aside-container">
                        <el-header style="text-align: center; line-height: 40px; margin-top:10px; ">
                            <el-button type="primary" icon="el-icon-plus" @click="newChat">新聊天</el-button>
                        </el-header>
                        <!-- Sidebar content here -->
                        <el-menu @select="handleSelect"
                            style="background-color: antiquewhite; border-radius: 5px; height: 200px; justify-content: center;">
                            <el-menu-item v-for="(question, index) in historyArrlist" :key="index"
                                :index="index.toString()" class="menu-item-history"
                                @click="historyChat(question, index)">
                                <span slot="title" @mouseover="showDeleteButton(index)"
                                    @mouseleave="hideDeleteButton(index)" class="menu-item-wrapper">
                                    {{ getUserContent(question.history) }}
                                    <el-button v-show="question.showDeleteButton" type="text" icon="el-icon-close"
                                        @click.stop="deleteItem(index)"
                                        style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%);"></el-button>
                                </span>
                            </el-menu-item>
                        </el-menu>
                    </el-aside>

                    <el-container style="background-color: whitesmoke; border-radius: 5px; overflow: hidden;">

                        <el-main style="justify-content: center;overflow: hidden; ">
                            <!-- 聊天页面 -->
                            <div v-if="chatStarted" class="chat-container" ref="chatContainer">
                                <div v-for="(message, index) in chatMessages" :key="index" class="chat-message">
                                    <div v-if="message.role === 'user'" class="answer-message">
                                        <div class="card"
                                            style=" background-color: rgba(244, 152, 24, 0.5); float: right;">
                                            <i class="el-icon-user"> {{ message.content }}</i>
                                        </div>
                                    </div>
                                    <div v-else-if="message.role === 'assistant'" class="answer-message">
                                        <div class="card" style="width: 800px;">
                                            <i class="el-icon-sunny">
                                                <StreamText :text="message.content" :speed="50" />
                                            </i>
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
    </el-container>
</template>

<script>
import { getChatMsg, chatgpt, chatupload, gethistory, setclause_check, getstatic, getChat, getChatchat } from "@/api/getData";
import Index from "./chatHome/index.vue";
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
        chatMessages() {
            this.scrollToBottom();
        },
    },
    methods: {
        handleSelectDrop(item){
            console.log("promptdefaultvalue",item.value)
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
            const userEntry = history.find(entry => entry.role === 'user');
            return userEntry ? userEntry.content : '';
        },
        showDeleteButton(index) {
            this.$set(this.historyArrlist[index], 'showDeleteButton', true);
        },
        hideDeleteButton(index) {
            this.$set(this.historyArrlist[index], 'showDeleteButton', false);
        },
        deleteItem(index) {
            this.historyArrlist.splice(index, 1);
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


                this.$alert('请输入内容', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                });


            }


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
        // showDeleteButton(index) {
        //     console.log("indexindex", this.historyArrlist[index])
        //     this.historyArrlist[index].showDeleteButton = true;
        // },
        // hideDeleteButton(index) {
        //     this.historyArrlist[index].showDeleteButton = false
        // },
        // deleteItem(index) {
        //     this.historyArrlist.splice(index, 1);
        // },
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
    width: 90%;
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

.menu-item-active {
    background-color: #f5f7fa;
    /* 设置高亮背景颜色 */
    color: #409EFF;
    /* 设置高亮字体颜色 */
}

.chat-container {
    max-height: 500px;
    /* 根据需要设置 */
    overflow-y: auto;
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


.aside-container::-webkit-scrollbar {
    width: 6px;
}

.aside-container::-webkit-scrollbar-track {
    background: #ddd;
    border-radius: 10px;
}

.aside-container::-webkit-scrollbar-thumb {
    background: #abaaaa;
    border-radius: 10px;
}

.aside-container::-webkit-scrollbar-thumb:hover {
    background: #e4e2e2;
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
    margin-right: 10px;
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
.input-select1{
    margin-left: 20px;
}
</style>