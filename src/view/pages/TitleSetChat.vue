<template>
  <el-container style="height: 100vh;">
    <Nav :isCollapse="isCollapse" @update:isCollapse="updateIsCollapse" :isSelect="selected"></Nav>

    <el-container :style="{ 'margin-left': isCollapse ? '-40px' : '0px' }">

      <el-main>
        <el-header>


          <el-upload class="upload-demo" action :http-request="uploadFile" ref="upload" :limit="fileLimit"
                                :on-remove="handleRemove" :file-list="fileList" :on-exceed="handleExceed"
                                :before-upload="beforeUpload" :show-file-list="true" :headers="headers" limit="1"
                                :style="{ marginTop: fileList.length === 1 ? '-10px' : '0' }">
                                <!-- action="/api/file/fileUpload" -->
                                <el-button size="small" type="primary" icon="el-icon-plus" >上传条款</el-button>
                            </el-upload>
        </el-header>
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
import Emoji from "@/components/Emoji.vue";
import Nav from "@/components/Nav.vue";
import commonMethodsMixin from '../../util/publicfun.js';
import StreamText from '@/components/StreamText.vue';
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
  mixins: [commonMethodsMixin],
    components: {
        Emoji,
        Nav,
        StreamText
    },
  data() {
    return {
      selected: '4',
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
      fileList:[]



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
    updateIsCollapse(value) {
            this.isCollapse = value;
            // this.updateIsCollapse(value);
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
    exportExcel() {
      // 1. 将表格数据转换为 Excel 文件的格式
      const worksheet = XLSX.utils.json_to_sheet(this.$refs.table.tableData);
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
      exportWord('./template.docx', this.$refs.table.tableData, "hh")

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
      console.log(this.totalSize, this.$refs.table.tableData);
    },

  }
}
</script>

<style>

</style>