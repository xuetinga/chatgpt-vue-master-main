<template>
    <el-container class="background-container">
        <el-header class="header-container" style="height: 60px;">
            <img src="../../imgs/logo1.png" class="logo" width="80px" />

        </el-header>
        <el-main style="padding: 0px;">
            <el-container class="main-container">
                <el-aside width="200px" class="aside-container">
                    <el-header class="aside-header">
                        <el-button type="primary" icon="el-icon-plus" @click="newChat" round>新条款</el-button>
                    </el-header>
                    <!-- Sidebar content here -->
                    <el-menu @select="handleSelect" class="custom-scrollbar"
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
                    <el-main>
                        <div ref="chatContainer" style="display: flex; justify-content: flex-start">
                            <el-select placeholder="请选择标准条款">
                            </el-select>
                            <el-upload class="upload-demo" action :http-request="uploadFile" ref="upload"
                                :show-file-list="false">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">点击上传</div>
                            </el-upload>
                        </div>
                        <el-main>
                        <el-table :data="clauseTableData" style="width: 100%">
                            <!-- 条款编号列 -->
                            <el-table-column prop="clause_number" label="条款编号" width="300">
                            </el-table-column>

                            <!-- 条款名称列 -->
                            <el-table-column prop="clause_name" label="条款名称" width="250">
                            </el-table-column>

                            <!-- 原文列 -->
                            <el-table-column prop="original_text" label="条款原文">
                            </el-table-column>

                            <!-- 审核结果列 -->
                            <el-table-column prop="review_result" label="审核结果" width="120">
                            </el-table-column>

                            <!-- 审核建议列 -->
                            <el-table-column prop="advice" label="审核建议" width="150">
                            </el-table-column>
                        </el-table>
                    </el-main>
                    </el-main>
                 
                </el-container>

            </el-container>
        </el-main>


    </el-container>
</template>

<script>
import axios from 'axios';
import { compare_clause, upload_new_clause, list_standard_clause, clause_doc_stream_check, delete_dialogue, chatclauseStreamgpt, getclausehistory, getChatMsg, chatgpt, chatupload, gethistory, setclause_check, getstatic, getChat, getChatchat, getclauseChat } from "@/api/getData";
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
        let compareparams = {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdDEiLCJleHAiOjE3Mjg4Nzc1MDl9.10pwn0YnmSqIe7Ixsfozf1wDbk7RF4dn4KKc1NQWe7g",
            stand_id: "ec916c06-8706-11ef-aa4f-00163e1e6539",
            new_id: "ee29e442-8a2d-11ef-9596-00163e1e6539"
        }
        console.log("compareparams", compareparams)
        compare_clause(compareparams).then((res) => {
            console.log("res", res)
        })
        let params = {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdDEiLCJleHAiOjE3Mjg4Nzc1MDl9.10pwn0YnmSqIe7Ixsfozf1wDbk7RF4dn4KKc1NQWe7g"
        }
        console.log("params", params)
        list_standard_clause(params).then((res) => {
            console.log("list_conversion", res)
        }).catch((err) => {

        })

        // getclausehistory().then((res) => {
        //     console.log("gethistoryres", res.data)
        //     this.historyArrlist = res.data
        // }).catch((err) => {
        //     console.log("errr", err)
        // })
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
            clauseTableData: [
                {
                    id: '4b370157-896b-11ef-ac83-2cf05d3470d1',
                    institution: '安全培训需求调查',
                    clause_name: '安全生产教育培训制度',
                    clause_number: '《国务院安委会关于进一步加强安全培训工作的决定》（安委[2012]10号）第二十条',
                    original_text:
                        '加强安全培训过程管理和质量评估。建立安全培训需求调研、培训策划、培训计划备案、教学管理、培训效果评估等制度，加强安全培训全过程管理。',
                    review_result: '符合',
                    advice: '无',
                },
                {
                    id: '4b3c3208-896b-11ef-8ebe-2cf05d3470d1',
                    institution: '年度安全培训计划制定',
                    clause_name: '安全生产教育培训制度',
                    clause_number: '《生产经营单位安全培训规定》（原国家安全生产监督管理总局令第80号）第二十一条第一款',
                    original_text: '生产经营单位应当将安全培训工作纳入本单位年度工作计划。保证本单位安全培训工作所需资金。',
                    review_result: '符合',
                    advice: '无',
                },
                {
                    id: '4bef97cb-896b-11ef-93a7-2cf05d3470d1',
                    institution: '安全培训教育经费',
                    clause_name: '安全生产教育培训制度',
                    clause_number: '《生产经营单位安全培训规定》（原国家安全生产监督管理总局令第80号） 第二十一条',
                    original_text: '生产经营单位应当将安全培训工作纳入本单位年度工作计划。保证本单位安全培训工作所需资金。',
                    review_result: '符合',
                    advice: '无',
                }],
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
            hasUploadDone: false
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

        //上传文件的事件
        uploadFile(item) {
            // this.$showMessage('文件上传中........')
            //上传文件的需要formdata类型;所以要转
            var FormDatas = new FormData()
            FormDatas.append('file', item.file);

            this.dialogFileUrl = item.file.name;
            let params = {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdDEiLCJleHAiOjE3Mjg4Nzc1MDl9.10pwn0YnmSqIe7Ixsfozf1wDbk7RF4dn4KKc1NQWe7g",
                file: item.file
            }
            this.fileList.push(item.file);
            upload_new_clause(params).then(res => {
                console.log("res", res.data.content)
                if (res.data != null) {
                    hasUploadDone = true
                }
                this.fileType = "file"
            })
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