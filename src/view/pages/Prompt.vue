<template>
    <el-container style="height: 100vh;">
        <Nav :isCollapse="isCollapse" @update:isCollapse="updateIsCollapse" :isSelect="selected"></Nav>

        <el-container>

            <el-main>
                <el-header style="display: flex; justify-content: space-between; align-items: center;">

                    <el-button size="small" type="primary" icon="el-icon-plus" style="margin-bottom: 20px;"
                        @click="dialogFormVisible = true">新增配置</el-button>
                </el-header>

                <el-container>
                    <el-tabs v-model="activeName" style="width: 100%;">
                        <el-tab-pane label="公共提示词" name="first">
                            <el-table ref="table" :data="publicTableData" border>
                                <template v-for="(item, index) in dataList">
                                    <el-table-column :label="item.label" align="center" :prop="item.value">
                                    </el-table-column>
                                </template>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="私有提示词" name="second">
                            <el-table ref="table" :data="privateTableData" border>
                                <template v-for="(item, index) in dataList">
                                    <el-table-column :label="item.label" align="center" :prop="item.value">
                                    </el-table-column>
                                </template>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>

                    <el-dialog title="Prompt" :visible.sync="dialogFormVisible">
                        <el-form :model="form" ref="form">
                            <el-form-item label="name" :label-width="formLabelWidth">
                                <el-input v-model="form.name" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="type" :label-width="formLabelWidth">
                                <el-select v-model="form.type" placeholder="请选择">
                                    <el-option label="public" value="public"></el-option>
                                    <el-option label="private" value="private"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="Content" :label-width="formLabelWidth">
                                <el-input type="textarea" v-model="form.content"></el-input>
                            </el-form-item>
                         
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitForm">确 定</el-button>
                        </div>
                    </el-dialog>

                </el-container>

            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import { getChatMsg, gethistory, getstatic } from "@/api/getData";
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
            selected: '6',
            activeName: "first",
            isCollapse: false,
            tableData: [],
            publicTableData: [],
            privateTableData: [],

            // tableData: [
            //     { section: "prompt1", name: "prompt1prompt1prompt1", age: "prompt1prompt1", sex: "prompt1prompt1" },
            //     { section: "prompt2", name: "prompt2prompt2prompt2", age: "prompt2prompt2", sex: "prompt2prompt2" },
            // ],
            dataList: [
                {
                    label: "name",
                    value: "scene",
                },
                {
                    label: "type",
                    value: "type",
                },
                {
                    label: "content",
                    value: "content",
                },

            ],
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                name: '',
                type: '',
                content: ''
            },
            formLabelWidth: '120px'



        };
    },
    computed: {
        // 筛选项
        filterData() {
            return function (data) {
                let obj = [];
                //找到对应的数据 并添加到obj
                this.tableData.filter((item) => {
                    obj.push({
                        text: item[data.value],
                        value: item[data.value],
                    });
                });
                //因为column有重复数据，所以要进行去重
                return this.deWeight(obj);
            };
        },
    },
    created() {
        getstatic().then((res) => {
            console.log("getstaticres", res)
            this.publicTableData = res.data.prompts.filter(item => item.type === "public");
            this.privateTableData = res.data.prompts.filter(item => item.type === "private");

        }).catch((err) => {
            console.log("err", err)
        })

    },
    methods: {
        submitForm() {
            // 获取表单数据
            const formData = this.form;
            this.dialogFormVisible = false;
            // 打印到控制台以确认数据
            console.log('提交的表单数据:', formData);


        },
        updateIsCollapse(value) {
            this.isCollapse = value;
            // this.updateIsCollapse(value);
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

        filterHandler(value, row, column) {
            const property = column["property"];
            return row[property] === value;
        },
        filterTag(value, row, column) {
            const property = column["property"];
            return row[property] === value;
        },
        // 数组对象去重
        deWeight(arr) {
            for (var i = 0; i < arr.length - 1; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    if (arr[i].text == arr[j].text) {
                        arr.splice(j, 1);
                        j--;
                    }
                }
            }
            return arr;
        },
        _filterChange() {
            this.totalSize = this.$refs.table.tableData.length;
            console.log(this.totalSize);
        },
        handleTabClick(tab) {
            this.activeName = tab.name;
        }

    }
}
</script>

<style>
.el-menu .el-menu-item {
    width: 100%;
}
</style>