<template>
    <el-container style="height: 100vh;">
        <el-aside width="150px" height=100vh; style=" position: relative; overflow: hidden; ">
            <div class="fixed-button" style=" position: fixed;  top:15px; border:0px;text-align: center;
  z-index: 1000;">
                <el-button @click="toggleCollapse">
                    <i :class="`el-icon-arrow-${isCollapse ? 'right' : 'left'}`"></i>
                </el-button>
            </div>
            <el-menu default-active="2" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                <el-menu-item index="0" @click.native="goToMain">
                    <span slot="title">主页</span>
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
            <el-header style="text-align: center; line-height: 40px">
                Yoca copilot 自由对话
            </el-header>
            <el-main>
                <el-container style="background-color: antiquewhite;height: 80vh;border-radius: 5px;">
                    <el-aside width="200px">
                        <el-header style="text-align: center; line-height: 40px ">
                            聊天
                            <el-button size="small" type="primary" icon="el-icon-plus" circle></el-button>
                        </el-header>
                        <!-- Sidebar content here -->
                        <el-menu style="background-color: antiquewhite; border-radius: 5px; height: 200px; ">
                            <el-menu-item index="1">Contact 1</el-menu-item>
                            <el-menu-item index="2">Contact 2</el-menu-item>
                            <!-- More contacts -->
                        </el-menu>
                    </el-aside>

                    <el-container style="background-color: bisque; border-radius: 5px;">
                        <el-main>
                            <!-- Chat messages go here -->
                            <div class="chat-message" v-for="message in messages" :key="message.id">
                                <!-- Use custom components or divs for messages -->
                            </div>
                        </el-main>
                        <el-dropdown placement="" top>
                                <span class="el-dropdown-link">
                                    配置<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>生成摘要</el-dropdown-item>
                                    <el-dropdown-item>标签提取</el-dropdown-item>
                                    <el-dropdown-item>内容检查</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        <el-footer style="align-items: flex-start; display: flex">
                            <!-- Input area -->
                            <el-input v-model="newMessage" placeholder="Type your message" />
                            <el-button type="primary" @click="sendMessage">Send</el-button>
                        </el-footer>
                    </el-container>
                </el-container>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
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
            ]

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

        }
    }
}
</script>

<style>
.el-menu .el-menu-item {
    width: 100%;
}
</style>