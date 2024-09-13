<template>
    <el-container class="main-bg">
        <el-container class="background-container">
            <el-header class="header-container" style="height: 60px;">
                <img src="../../imgs/logo1.png" class="logo" />
                <span class="title">Port AI</span>
            </el-header>
            <el-main  style="padding: 0px;">
                <el-container class="main-container">
                    <el-aside width="220px" class="aside-container">
                        <el-header class="aside-header">
                            <el-button type="primary" icon="el-icon-plus" @click="newChat" round>新对话</el-button>
                        </el-header>
                        <el-menu @select="handleSelect" class="custom-scrollbar"
                            style="background-color: #f2fbff; justify-content: center;  height:70vh; margin-bottom:20px; overflow-x: hidden; ">
                            <el-menu-item v-for="(question, index) in historyArrlist" :key="index"
                                :index="index.toString()" class="menu-item-history"
                                @click="historyChat(question, index)">
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
                                        <div class="card">
                                            <i class="el-icon-user" style="line-height: 1.2;"> {{ message.content }}</i>
                                            <div v-if="dialogImageUrl !== ''">
                                                <el-image style="width: 200px; height: 200px" :src="dialogImageUrl"
                                                    :fit="fit"></el-image>
                                            </div>
                                            <div v-if="dialogFileUrl !== ''">
                                                <a> {{ dialogFileUrl }}</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else-if="message.role === 'assistant'" class="answer-message">
                                        <div class="card"  style=" background-color: #fff; float: left; color:#000">

                                            <span v-if="index === chatMessages.length - 1">
                                                <vue-markdown :source="message.content" :breaks="true"
                                                    :typographer="true" :linkify="true"
                                                    :highlight="false"></vue-markdown>

                                            </span>
                                            <span v-else>
                                                {{ message.content }}
                                            </span>


                                        </div>
                                        <div class="floating-actions" v-show="floatactiveIndex == index">

                                            <el-tooltip class="item" effect="dark" content="朗读"
                                                placement="bottom-start">
                                                <i class="el-icon-video-play" @click="readAloud"></i>
                                            </el-tooltip>
                                            <el-tooltip class="item" effect="dark" content="复制" placement="bottom">
                                                <i class="el-icon-copy-document" @click="copyContent"></i>
                                            </el-tooltip>
                                            <el-tooltip class="item" effect="dark" content="点赞" placement="bottom-end">
                                                <i class="el-icon-thumb" @click="likeMessage"></i>

                                            </el-tooltip>
                                            <el-tooltip class="item" effect="dark" content="点踩" placement="bottom-end">
                                                <i class="el-icon-bottom" @click="dislikeMessage"></i>

                                            </el-tooltip>
                                            <el-tooltip class="item" effect="dark" content="重新生成"
                                                placement="bottom-end">
                                                <i class="el-icon-refresh-left" @click="regenerateMessage"></i>

                                            </el-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div v-else>
                            
                                <el-row type="flex" class="response-options">
                                    <el-col :span="8" v-for="(card, index) in cards1" :key="index">
                                        <el-card @click.native="sendMessage(card.message)" style="height: 250px; margin-left: 20px">
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
                        <el-footer style="align-items: flex-start; display: flex;padding: 0px;">
                            <div class="input-wrapper">
                                <el-dropdown class="input-select1">
                                    <span class="el-dropdown-link">
                                        {{ promptdefaultvalue }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="item in promptall" :key="item.label"
                                            @click.native="handleSelectDrop1(item)">
                                            {{ item.value }}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <el-dropdown class="input-select1">
                                    <span class="el-dropdown-link">
                                        {{ modeldefaultvalue }}<i class="el-icon-arrow-down el-icon--right"></i>
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
                                        @keydown.enter="startChat">
                                    </el-input>

                                </div>
                                <div class="input-button">

                                    <div v-for="(file, index) in fileList" :key="index" class="file-tag">
                                        <span style=" overflow: hidden; text-overflow: ellipsis;font-size: 10px;">{{
                                file.name }}</span>
                                        <i class="el-icon-close" @click="removeFile(index)"></i>
                                    </div>
                                    <el-upload class="upload-icon" action :http-request="uploadImg" ref="upload"
                                        :show-file-list="false" accept="image/*">
                                        <i class="el-icon-picture-outline-round" style="margin-right: 5px;"></i>
                                    </el-upload>
                                    <el-upload class="upload-icon" action :http-request="uploadFile" ref="upload"
                                        :show-file-list="false">
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
import { chatFileStreamgpt, chatImgStreamgpt, upload_img, upload_doc, chatkbStreamgpt, chatStreamgpt, getChatMsg, gethistory, getChat, getstatic, chatgpt, getChatchat } from "@/api/getData";
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
            dialogFileUrl: ""

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

<style>
.el-menu .el-menu-item {
    width: 100%;
}

.floating-actions {
    /* position: absolute; */
    display: flex;
    flex-direction: row;
    margin-top: 2px;
    border: 1px solid #000;
    border-radius: 5px;
    padding: 5px;
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