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
            <el-menu default-active="2" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
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

        <el-container :style="{ 'margin-left': isCollapse ? '-40px' : '0px' }" >
            <el-main>

                <el-container style="background-color: antiquewhite;height: 90vh;border-radius: 5px;">
                    <el-aside width="200px">
                        <el-header style="text-align: center; line-height: 40px; margin-top:10px; ">
                            <el-button type="primary" icon="el-icon-plus" @click="newChat">新对话</el-button>
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
                                        <div class="card"
                                            style=" background-color: rgba(244, 152, 24, 0.2); float: right;">
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
                                        <el-card @click.native="sendMessage(card.message)" style="height: 300px;">
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

                            <el-select v-model="promptdefaultvalue" placeholder="Prompt" style="width: 130px;">
                                <el-option v-for="item in promptall" :key="item.value" :label="item.label"
                                    :value="item.value" style="text-align: center;">
                                    <span style="color: #8492a6; font-size: 13px">{{ item.value }}</span>
                                </el-option>
                            </el-select>
                            <el-select v-model="modeldefaultvalue" placeholder="Model" style="width: 130px;">
                                <el-option v-for="item in models" :key="item.value" :label="item.label"
                                    :value="item.value" style="text-align: center;">
                                    <span style="color: #8492a6; font-size: 13px">{{ item.value }}</span>
                                </el-option>
                            </el-select>
                            <el-upload class="upload-demo" action :http-request="uploadFile" ref="upload"
                                :limit="fileLimit" :on-remove="handleRemove" :file-list="fileList"
                                :on-exceed="handleExceed" :before-upload="beforeUpload" :show-file-list="true"
                                :headers="headers" limit="1"
                                :style="{ marginTop: fileList.length === 1 ? '-10px' : '0' }">
                                <!-- action="/api/file/fileUpload" -->
                                <el-button class="btn"><i class="el-icon-paperclip"></i>附件</el-button>
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
import { getChatMsg, gethistory, getChat, getstatic,chatgpt,getChatchat } from "@/api/getData";

export default {
    data() {
        return {
            promptall: [{
                value: "生成摘要",
            }, {
                value: '标签提取',
            }, {
                value: '内容检查',
            }],
            promptdefaultvalue: '',
            modeldefaultvalue:"",
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
            fileType: ["pdf", "doc", "docx", "xls", "xlsx", "txt", "png", "jpg", "bmp", "jpeg"],
            // 运行上传文件大小，单位 M
            fileSize: 50,
            // 附件数量限制
            fileLimit: 5,
            //请求头
            headers: { "Content-Type": "multipart/form-data" },
            kbs: [],
            models: [],
            prompts: []

        };
    },
    created() {
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
    methods: {
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
        startChat(){
            if (this.newMessage.trim() !== '') {
                console.log(" this.newMessage", this.newMessage)
                this.chatMessages.push({ content: this.newMessage, role: 'user' });
            }
            if (this.chat_id == "") {
                this.chat_id = this.guid()
            }
            console.log("chat_id", this.chat_id)
            let params = {
                dialogue_id: this.chat_id,
                query: this.newMessage,
                config: this.promptdefaultvalue+","+this.modeldefaultvalue
                // history: JSON.stringify([{role:"hh",content:"xx"},{role:"hh",content:"xx"}])
                // {role:"hh",content:"xx"}
                // ,
            }
            console.log("params", params)

            getChatchat(params).then((res) => {
                console.log("resresresgetChatchat", res)

                this.chatMessages.push({ content: res.response, role: 'assistant', reference: res.reference });
                this.newhistory = {
                    dialogue_id: this.chat_id, history: this.chatMessages
                }
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
        }
    }
}
</script>

<style>
.el-menu .el-menu-item {
    width: 100%;
}
</style>