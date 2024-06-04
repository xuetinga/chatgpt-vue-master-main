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
                <el-row :gutter="20">
                    <el-col :span="8" v-for="(knowledge, index) in modellist" :key="index">
                        <el-card
                            :style="{ height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }"
                            shadow="hover">
                            <template #header>
                                <div class="headerbutton"
                                    style="display: flex; justify-content: space-between; align-items: center; height: 50px;">
                                    <div>
                                        <i class="el-icon-picture-outline-round" @click="showGraph(index)"></i>
                                        <span>{{ knowledge }}</span>
                                    </div>
                                    <el-button size="mini" type="success" icon="el-icon-check" circle
                                        v-if="index == 1"></el-button>
                                </div>
                            </template>
                            <div class="text item"
                                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                {{ knowledge }} {{ knowledge }} {{ knowledge }}
                            </div>
                            <el-row style="margin-top: 20px;">
                                <el-col :span="8" style="text-align: center;">
                                    <i class="el-icon-edit" @click="showConfigDialog(index)">配置</i>
                                </el-col>
                                <el-col :span="8" style="text-align: center;">
                                    <i class="el-icon-picture-outline-round"
                                        @click="openDialogAndRenderGraph(index)">启动</i>
                                </el-col>
                                <el-col :span="8" style="text-align: center;">
                                    <i class="el-icon-delete" @click="deleteKnowledge(index)">停止</i>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>

                <el-dialog title="配置" :visible.sync="settingdialogFormVisible">
                    <el-form :model="settingform">
                        <el-row>
                            <el-col :span="8" v-for="(config, index) in configArray" :key="index">
                                <el-form-item :label="config.label">
                                    <el-select v-model="settingform[config.key]" :placeholder="'请选择' + config.label">
                                        <el-option v-for="(option, optionIndex) in config.options" :key="optionIndex"
                                            :label="option.label" :value="option.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>


                    <div slot="footer" class="dialog-footer">
                        <el-button @click="settingdialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="savesetting">确 定</el-button>
                    </div>
                </el-dialog>

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

            settingdialogFormVisible: false,
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
            modellist: [],
            configArray: [
                {
                    label: 'tempreature',
                    key: 'config1',
                    options: [
                        { label: '选项1-1', value: 'option1-1' },
                        { label: '选项1-2', value: 'option1-2' },
                        // 其他选项...
                    ]
                },
                {
                    label: 'top_k',
                    key: 'config2',
                    options: [
                        { label: '选项2-1', value: 'option2-1' },
                        { label: '选项2-2', value: 'option2-2' },
                        // 其他选项...
                    ]
                },
                {
                    label: 'top_p',
                    key: 'config3',
                    options: [
                        { label: '选项3-1', value: 'option3-1' },
                        { label: '选项3-2', value: 'option3-2' },
                        // 其他选项...
                    ]
                },
                {
                    label: '序列长',
                    key: 'config4',
                    options: [
                        { label: '选项4-1', value: 'option4-1' },
                        { label: '选项4-2', value: 'option4-2' },
                        // 其他选项...
                    ]
                },
                {
                    label: '采样',
                    key: 'config5',
                    options: [
                        { label: '选项5-1', value: 'option5-1' },
                        { label: '选项5-2', value: 'option5-2' },
                        // 其他选项...
                    ]
                },
                {
                    label: '重复惩罚',
                    key: 'config6',
                    options: [
                        { label: '选项6-1', value: 'option6-1' },
                        { label: '选项6-2', value: 'option6-2' },
                        // 其他选项...
                    ]
                },
            ],
            settingform: {
                name: '',
                content: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },



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
        savesetting() {
            this.settingdialogFormVisible = false;
            console.log("settingdialogFormVisible", this.settingform)
        },
        showConfigDialog(index) {
            this.settingdialogFormVisible = true
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

.headerbutton {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text.item {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>