<template>
  <el-container  class="background-container">
    <el-header class="header-container" style="height: 40px;">
            <img src="../../imgs/logo1.png" class="logo" />
            
        </el-header>
    <el-container class="main-container">

      <el-main>
        <el-header>


          <el-upload class="upload-demo" action :http-request="uploadFile" ref="upload" :limit="fileLimit"
            :on-remove="handleRemove" :file-list="fileList" :on-exceed="handleExceed" :before-upload="beforeUpload"
            :show-file-list="true" :style="{ marginTop: fileList.length === 1 ? '-10px' : '0' }">
            <!-- action="/api/file/fileUpload" -->
            <el-button size="small" type="primary" icon="el-icon-plus" round>上传条款</el-button>
          </el-upload>
        </el-header>
        <el-table ref="table" :data="currentPageData" @filter-change="_filterChange" border>
          <template v-for="(item, index) in dataList">
            <el-table-column v-if="item.sort" :key="index" :label="item.label" align="center" :prop="item.value"
              sortable :show-overflow-tooltip="true" :filter-multiple="true" :filters="filterData(item)"
              :filter-method="filterTag">
            </el-table-column>
            <el-table-column v-else :key="index" :label="item.label" align="center" :prop="item.value"
              :show-overflow-tooltip="true">
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
import { getChatMsg, gethistory, getexam, upload_exam } from "@/api/getData";
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
      fileLimit: 1,
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
          value: "file",
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
      fileList: []



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
  watch: {
    tableData() {
      // this.updatePagedData();
    },
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
  mounted() {
    // 初始化数据，这里是一个示例
    this.tableData = [

    ];
    this.totalItems = this.tableData.length;
    this.dataList = [
      {
        label: "题目分类",
        value: "parent",
        sort: true

      },
      {
        label: "题目标题",
        value: "file",
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
      this.updatePagedData();
  },
  methods: {
    //上传了的文件给移除的事件，由于我没有用到默认的展示，所以没有用到
    handleRemove() {
    },
    handleExceed() {

    },
    beforeUpload() {

    },
    updateIsCollapse(value) {
      this.isCollapse = value;
      // this.updateIsCollapse(value);
    },
    //上传文件的事件
    async uploadFile(item) {
      // this.$showMessage('文件上传中........')
      //上传文件的需要formdata类型;所以要转
      console.log("FormDatas", item)

      var FormDatas = new FormData()
      FormDatas.append('file', item.file);
      console.log("FormDatas", FormDatas.get("file"))
      let params = {
        file: FormDatas.get("file"),
      }
        ;
      this.fileList.push(item.file);

      await upload_exam(FormDatas, this.handleChunk);
      // const response = await upload_exam(FormDatas,handleChunk);
      // // 假设接口返回的是一个流式响应或一个包含数据块的数组
      // const chunks = response.data; // 假设这里返回一个数组

      // const processStream = async (chunks) => {
      //   for (const chunk of chunks) {
      //     this.handleChunk(JSON.stringify(chunk));
      //     await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟
      //   }
      // };

      // await processStream(chunks);

    },
    handleChunk(chunkValue) {
      try {
        const data = JSON.parse(chunkValue);
        console.log("datadatadata",data)
        this.tableData.unshift(data);
        this.totalItems = this.tableData.length;
      } catch (error) {
        console.error('Error parsing chunk value', error);
      }
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.updatePagedData();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.updatePagedData();
    },

    updatePagedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.tableData.slice(start, end);

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

<style></style>