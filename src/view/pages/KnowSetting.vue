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
            <el-menu @open="handleOpen" @close="handleClose" :collapse="isCollapse">
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
                <el-menu default-active="5" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                    :collapse="isCollapse">
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

        <el-container>

            <el-main>

                <el-header>


                    <el-button size="small" type="primary" icon="el-icon-plus"
                        @click="dialogFormVisible = true">新增知识</el-button>

                </el-header>
                <el-container style="">
                    <div ref="graphContainer" class="graph-container"></div>

                    <!-- <div> -->
                    <el-row type="flex" style=" width: 100%;flex-wrap: wrap;">
                        <el-col :span="8" v-for="(knowledge, index) in kbs" :key="index">
                            <el-card height="80px" shadow="hover">
                                <div slot="header">
                                    <i class="el-icon-picture-outline-round" @click="showGraph(index)">头像</i>

                                    <span>{{ knowledge.name }}</span>
                                </div>
                                <div class="text item">
                                    {{ knowledge.description }}
                                </div>

                                <el-row style="margin-top: 20px;">
                                    <el-col :span="8">
                                        <i class="el-icon-edit" @click="showConfigDialog(index)">配置</i>
                                    </el-col>
                                    <el-col :span="8">
                                        <i class="el-icon-picture-outline-round" @click="showGraph(index)">图谱</i>

                                    </el-col>
                                    <el-col :span="8">
                                        <i class="el-icon-delete" @click="deleteKnowledge(index)">删除</i>

                                    </el-col>

                                </el-row>

                            </el-card>
                        </el-col>
                    </el-row>
                    <!-- </div> -->



                </el-container>
            </el-main>


            <!-- <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button> -->

            <el-dialog title="新增知识" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="知识名称">
                        <el-select v-model="form.name" placeholder="请选择知识">
                            <el-option label="知识一" value="shanghai"></el-option>
                            <el-option label="知识二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="知识内容">
                        <el-input v-model="form.content" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addNew">确 定</el-button>
                </div>
            </el-dialog>

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
        </el-container>
    </el-container>
</template>

<script>
import { getChatMsg, gethistory, getstatic } from "@/api/getData";
import * as d3 from 'd3';
export default {
    data() {
        return {
            graphData: {
                nodes: [
                    { id: '天融信在税务行业有哪些典型案例', group: 1 },
                    { id: '海关一线和二线的区别', group: 2 },
                    { id: '公安行业有哪些典型案例', group: 2 },
                    { id: '介绍下海关的技术支撑平台', group: 2 },
                    { id: '海关一线和二线的区别1', group: 2 },
                    { id: '公安行业有哪些典型案例1', group: 2 },
                    { id: '介绍下海关的技术支撑平台1', group: 2 },

                    // { id: '关联词4', group: 2 },
                    // { id: '关联词5', group: 2 },
                    // { id: '关联词6', group: 2 },
                    // { id: '关联词7', group: 2 },
                    // 添加更多的节点
                ],

                links: [
                    { source: '天融信在税务行业有哪些典型案例', target: '海关一线和二线的区别', value: 2, label: "海关" },
                    { source: '天融信在税务行业有哪些典型案例', target: '公安行业有哪些典型案例', value: 20, label: "典型案例" },
                    { source: '天融信在税务行业有哪些典型案例', target: '介绍下海关的技术支撑平台', value: 2, label: "海关" },
                    { source: '天融信在税务行业有哪些典型案例', target: '海关一线和二线的区别1', value: 2, label: "海关" },
                    { source: '天融信在税务行业有哪些典型案例', target: '公安行业有哪些典型案例1', value: 20, label: "典型案例" },
                    { source: '天融信在税务行业有哪些典型案例', target: '介绍下海关的技术支撑平台1', value: 2, label: "海关" },
                    // { source: '天融信在税务行业有哪些典型案例', target: '关联词5', value: 1 },
                    // { source: '天融信在税务行业有哪些典型案例', target: '关联词6', value: 1 },
                    // { source: '天融信在税务行业有哪些典型案例', target: '关联词7', value: 1 },
                    // 添加更多的链接
                ],
            },
            configArray: [
                {
                    label: '配置项1',
                    key: 'config1',
                    options: [
                        { label: '选项1-1', value: 'option1-1' },
                        { label: '选项1-2', value: 'option1-2' },
                        // 其他选项...
                    ]
                },
                {
                    label: '配置项2',
                    key: 'config2',
                    options: [
                        { label: '选项2-1', value: 'option2-1' },
                        { label: '选项2-2', value: 'option2-2' },
                        // 其他选项...
                    ]
                },
                {
                    label: '配置项3',
                    key: 'config3',
                    options: [
                        { label: '选项3-1', value: 'option3-1' },
                        { label: '选项3-2', value: 'option3-2' },
                        // 其他选项...
                    ]
                },
                {
                    label: '配置项4',
                    key: 'config4',
                    options: [
                        { label: '选项4-1', value: 'option4-1' },
                        { label: '选项4-2', value: 'option4-2' },
                        // 其他选项...
                    ]
                },
                {
                    label: '配置项5',
                    key: 'config5',
                    options: [
                        { label: '选项5-1', value: 'option5-1' },
                        { label: '选项5-2', value: 'option5-2' },
                        // 其他选项...
                    ]
                },
                {
                    label: '配置项6',
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
            settingdialogFormVisible: false,
            currentDate: new Date(),
            isCollapse: false,

            dialogFormVisible: false,
            form: {
                name: '',
                content: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            }
            ,
            active: 1,
            configs: [
                {
                    name: "知识1",
                    content: "知识的内容"

                },
                {
                    name: "知识2",
                    content: "知识的内容2222"

                },
                {
                    name: "知识3",
                    content: "知识的内容333"

                }

            ], // 存储配置的数组
            kbs: []

        };
    },
    created() {
        getstatic().then((res) => {
            console.log("getstaticres", res)
            this.kbs = res.data.kbs
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
        showGraph(index) {
            const data = this.graphData;
            const width = 1000;
            const height = 600;
            d3.select(this.$refs.graphContainer).selectAll('*').remove();

            const svg = d3
                .select(this.$refs.graphContainer)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            const linkDistance = 200; // 设置链接长度
            const chargeStrength = -500; // 设置节点之间的距离，数值越负，距离越远

            // // 定义箭头标记
            // svg.append('defs').append('marker')
            //     .attr('id', 'arrowhead')
            //     .attr('viewBox', '-0 -5 10 10')
            //     .attr('refX', 25) // 调整箭头位置
            //     .attr('refY', 0)
            //     .attr('orient', 'auto')
            //     .attr('markerWidth', 6) // 调整箭头大小
            //     .attr('markerHeight', 6) // 调整箭头大小
            //     .attr('xoverflow', 'visible')
            //     .append('svg:path')
            //     .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            //     .attr('fill', '#999')
            //     .style('stroke', 'none');

            const simulation = d3
                .forceSimulation(data.nodes)
                .force('link', d3.forceLink(data.links).id(d => d.id).distance(linkDistance))
                .force('charge', d3.forceManyBody().strength(chargeStrength))
                .force('center', d3.forceCenter(200, height / 2));

            const extendLength = 200;

            // 创建链接路径
            const link = svg.append('g')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6)
                .selectAll('line')
                .data(data.links)
                .enter()
                .append('line')
                .attr('stroke-width', d => Math.sqrt(d.value))
                // .attr('marker-end', 'url(#arrowhead)'); // 为每条线添加箭头

            // 创建链接文字
            const linkText = svg.append('g')
                .selectAll('text')
                .data(data.links)
                .enter()
                .append('text')
                .text(d => d.label) // 显示链接的标签
                .attr('font-size', 12)
                .attr('fill', '#000');

            // 初始节点半径
            const initialRadius = 20;
            // 放大后的节点半径
            const enlargedRadius = 30;

            // 创建节点
            const node = svg
                .append('g')
                .selectAll('circle')
                .data(data.nodes)
                .enter()
                .append('circle')
                .attr('r', initialRadius)
                .attr('fill', d => (d.group === 1 ? 'red' : 'green'))
                .call(
                    d3
                        .drag()
                        .on('start', dragstarted)
                        .on('drag', dragged)
                        .on('end', dragended)
                )
                .on('mouseover', function (event, d) {
                    // 鼠标悬停时放大节点
                    d3.select(this).attr('r', enlargedRadius);
                })
                .on('mouseout', function (event, d) {
                    // 鼠标移开时恢复节点原始大小
                    d3.select(this).attr('r', initialRadius);
                });

            const text = svg
                .append('g')
                .selectAll('text')
                .data(data.nodes)
                .enter()
                .append('text')
                .text(d => d.id)
                .attr('x', 15)
                .attr('y', 3);

            simulation.on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                linkText
                    .attr('x', d => (d.source.x + d.target.x) / 2) // 文字在链接的中间位置
                    .attr('y', d => (d.source.y + d.target.y) / 2);

                node.attr('cx', d => d.x).attr('cy', d => d.y);

                text.attr('x', d => d.x).attr('y', d => d.y);
            });

            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        },


        deleteKnowledge() {

        },
        savesetting() {
            this.settingdialogFormVisible = false;
            console.log("settingdialogFormVisible", this.settingform)
        },
        showConfigDialog(index) {
            this.settingdialogFormVisible = true
        },
        addNew() {
            this.configs.push({
                name: this.form.name,
                content: this.form.content
            });
            this.dialogFormVisible = false;
            this.form.name = '';
            this.form.content = '';
            console.log("this.configs", this.configs)
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
        next() {
            if (this.active++ > 2) this.active = 0;
        }


    }
}
</script>

<style>
.el-menu .el-menu-item {
    width: 100%;
}

.fixed-bottom-menu {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 250px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

.el-menu-vertical-demo::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    /* 设置初始背景色透明 */
    z-index: -1;
    transition: background-color 0.3s ease;
    /* 添加过渡效果 */
}

.response-options {
    text-align: center;
    padding-left: 20;
    margin-bottom: 20px;
}

.graph-container {
    max-height: 600px;
    /* 根据需要设置 */
    overflow-y: auto;
    border: 1px solid #ddd;
}

/* 自定义滚动条样式 */
.graph-container::-webkit-scrollbar {
    width: 12px;
    /* 滚动条宽度 */
}

.graph-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    /* 滚动条轨道颜色 */
    border-radius: 10px;
    /* 轨道圆角 */
}

.graph-container::-webkit-scrollbar-thumb {
    background: #888;
    /* 滚动条拇指颜色 */
    border-radius: 10px;
    /* 拇指圆角 */
}

.graph-container::-webkit-scrollbar-thumb:hover {
    background: #555;
    /* 鼠标悬停时的颜色 */
}
</style>