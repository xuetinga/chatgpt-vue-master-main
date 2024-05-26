<template>
    <el-container style="height: 100vh;">
        <Nav :isCollapse="isCollapse" @update:isCollapse="updateIsCollapse" :isSelect="selected"></Nav>

        <el-container>

            <el-main>
                <el-header>


                    <el-button size="small" type="primary" icon="el-icon-plus"
                        @click="dialogFormVisible = true">新增model</el-button>


                </el-header>
                <el-container>
                    <el-dialog title="Model" :visible.sync="dialogFormVisible">
                        <el-form :model="form">

                            <el-form-item label="MODEL 名字" :label-width="formLabelWidth">
                                <el-select v-model="form.region" placeholder="请选择MODEL">
                                    <el-option label="MODEL1" value="shanghai"></el-option>
                                    <el-option label="MODEL2" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                        </div>
                    </el-dialog>

                </el-container>
                <el-row>
                    <el-col :span="8" v-for="(o, index) in modellist" :key="index">
                        <el-card :body-style="{ padding: '0px' }">
                            <i class="el-icon-notebook-1" style="margin: 10px;"></i>
                            <div style="padding: 14px;">
                                <span>{{ o }}</span>
                                <div class="bottom clearfix">
                                    <!-- <time class="time">{{ currentDate }}</time> -->
                                    {{ o }}{{ o }}{{ o }}
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>


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
            selected: '7',
            currentDate: new Date(),
            isCollapse: false,
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px',
            modellist: []



        };
    },
    created() {
        getstatic().then((res) => {
            console.log("getstaticres", res)
            this.modellist = res.data.models
        }).catch((err) => {
            console.log("err", err)
        })

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

    methods: {
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
        submitForm() {
            console.log('Submitting form data along with the fileList:',);

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

    }
}
</script>

<style>

</style>