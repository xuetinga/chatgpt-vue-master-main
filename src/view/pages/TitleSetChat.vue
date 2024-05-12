<template>
  <el-container style="height: 100vh;">
    <el-aside width="150px" height=100vh; style=" position: relative; overflow: hidden; ">
      <div v-if="isCollapse"
        style="position: fixed; top:10px; border:0px;text-align: center;z-index: 1000;margin-left:70px; width: 10px; height: 10px;">
        <el-button @click="toggleCollapse">
          <i :class="`el-icon-arrow-${isCollapse ? 'right' : 'left'}`"></i>
        </el-button>
      </div>
      <div v-else style="position: fixed; top:10px; border:0px;text-align: center;z-index: 1000;margin-left: 90px;">
        <el-button @click="toggleCollapse">
          <i :class="`el-icon-arrow-${isCollapse ? 'right' : 'left'}`"></i>
        </el-button>
      </div>
      <el-menu default-active="4" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
        <el-menu-item index="0" @click.native="goToMain">
          <img src="../../imgs/logo.png" style="width: 25px; height: 25px;" />
          <span slot="title">Yoka</span>
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
          <el-menu-item index="7" @click.native="goToHelp">
            <i class="el-icon-question"></i>
            <span slot="title">帮助</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>

    <el-container>

      <el-main>
        <el-table ref="table" :data="currentPageData" @filter-change="_filterChange" border>
          <template v-for="(item, index) in dataList">
            <el-table-column v-if="item.sort" sortable :show-overflow-tooltip="true" :key="index" :label="item.label"
              align="center" :prop="item.value" :filter-multiple="true" :filters="filterData(item)"
              :filter-method="filterTag">
            </el-table-column>
            <el-table-column v-else :show-overflow-tooltip="true" :key="index" :label="item.label" align="center"
              :prop="item.value">
            </el-table-column>
          </template>
        </el-table>
        <el-row type="flex" justify="flex-end" style="float: right;">
          <el-col>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="tableData.length"></el-pagination>
          </el-col>
          <el-col>
            <el-button type="primary" @click="exportExcel">导出</el-button>
          </el-col>
        </el-row>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import { getChatMsg, gethistory, getexam } from "@/api/getData";
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils'
import 'docxtemplater/build/docxtemplater.js'
import 'pizzip/dist/pizzip.js'
import * as XLSX from "xlsx"
import FileSaver from 'file-saver'

const ImageModule = require('docxtemplater-image-module-free')

function exportWord(template, exportRow, outputFilename) {
  JSZipUtils.getBinaryContent(template, (error, content) => {
    if (error) {
      console.error(error, 'error')
      return
    }
    var opts = {}
    opts.centered = false
    opts.getImage = (tagValue, tagName) => {
      return new Promise((resolve, reject) => {
        JSZipUtils.getBinaryContent(tagValue, (error, content) => {
          if (error) {
            return reject(error)
          }
          return resolve(content)
        })
      })
    }
    //图片有关代码，没有图片的可以删除
    opts.getSize = (img, tagValue, tagName) => {
      // FOR FIXED SIZE IMAGE :
      return [470, 210] //图片大小 （这个可以写成动态的，开发文档上有）
      return new Promise((resolve, reject) => {
        var image = new Image()
        image.src = url
        image.onload = () => {
          resolve([image.width, image.height])
        }
        image.onerror = (e) => {
          console.log('img, tagValue, tagName : ', img, tagValue, tagName)
          reject(e)
        }
      })
    }
    var imageModule = new ImageModule(opts)

    var zip = new PizZip(content)
    var doc = new docxtemplater()
      .loadZip(zip)
      .attachModule(imageModule)
      .compile()
    doc
      .resolveData(exportRow)
      .then((res) => {
        doc.render()
        var out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        })
        saveAs(out, outputFilename + '.docx')
      })
      .catch((error) => {
        let e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        }
        console.log(
          JSON.stringify({
            error: e,
          })
        )
        throw error // 抛出异常
      })
  })
}

export default {

  data() {
    return {
      tableData: [], // 原始数据
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示条目数
      isCollapse: false,
      dataList: [
        {
          label: "题目分类",
          value: "parent",
          sort: true

        },
        {
          label: "题目标题",
          value: "title",
          sort: true

        },
        {
          label: "题目内容",
          value: "content",
          sort: false
        },
        {
          label: "时间",
          value: "time",
          sort: true

        },

      ],



    };
  },
  created() {
    console.log("created")
    getexam().then((res) => {
      this.tableData = res.data
      console.log("getexamres", res)
    }).catch((err) => {
      console.log("errr", err)
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
    currentPageData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.tableData.slice(startIndex, endIndex);
    }
  },

  methods: {
    exportExcel() {
      // 1. 将表格数据转换为 Excel 文件的格式
      const worksheet = XLSX.utils.json_to_sheet(this.currentPageData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // 2. 将 Excel 文件存储为二进制对象
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // 3. 创建一个 Blob 对象
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

      // 4. 创建一个下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'export.xlsx');

      // 5. 模拟点击下载链接
      document.body.appendChild(link);
      link.click();

      // 6. 释放资源
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    getexam() {

    },
    // 导出数据到 docx 文件
    exportToDocx() {
      exportWord('./template.docx', this.currentPageData, "hh")

      // const doc = new Docxtemplater();
      // const template = `<h1>数据导出</h1><table><tr></tr></table>`;
      // const data = {
      //   dataList: this.dataList,
      //   currentPageData: this.currentPageData
      // };
      // // 使用 JSZip 加载模板内容
      // new JSZip().loadAsync(template).then(function (zip) {
      //   // 将模板加载到 Docxtemplater
      //   doc.loadZip(zip);
      //   // 设置数据并渲染文档
      //   doc.setData(data);
      //   doc.render();
      //   // 生成并下载 DOCX 文件
      //   const output = doc.getZip().generate({ type: 'blob' });
      //   saveAs(output, 'exported_data.docx');
      // });
    },

    // 每页显示条目数改变时触发
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 当前页码改变时触发
    handleCurrentChange(val) {
      this.currentPage = val;
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
</style>