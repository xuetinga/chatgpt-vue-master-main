<template>
  <el-container style="height: 100vh;">
    <el-aside width="150px" height=100vh; style=" position: relative; overflow: hidden; ">
      <div class="fixed-button" style=" position: fixed;  top:15px; border:0px;text-align: center;
  z-index: 1000;">
        <el-button @click="toggleCollapse">
          <i :class="`el-icon-arrow-${isCollapse ? 'right' : 'left'}`"></i>
        </el-button>
      </div>
      <el-menu default-active="4" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
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
          <el-menu-item index="7" @click.native="goToHelp">
            <i class="el-icon-question"></i>
            <span slot="title">帮助</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>

    <el-container>

      <el-main>
        <el-table ref="table" :data="tableData" @filter-change="_filterChange" border>
          <template v-for="(item, index) in dataList">
            <el-table-column sortable :show-overflow-tooltip="true" :key="index" :label="item.label" align="center"
              :prop="item.value" :filter-multiple="true" :filters="filterData(item)" :filter-method="filterTag">
            </el-table-column>
          </template>
        </el-table>

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
      ],
      tableData: [
        { section: "热带水果", name: "苹果英文", age: "苹果英文是什么", sex: "2024.4.14" },
        { section: "热带水果", name: "苹果英文222", age: "苹果英文是什么", sex: "2024.4.13" },

        { section: "非热带水果", name: "苹果英文11", age: "苹果英文是什么", sex: "2024.4.12" },

        { section: "非热带水果", name: "苹果英文11", age: "苹果英文是什么", sex: "2024.4.15" },
        { section: "非热带水果", name: "苹果英文", age: "苹果英文是什么", sex: "2024.4.14" },
        { section: "非热带水果", name: "苹果英文222", age: "苹果英文是什么", sex: "2024.4.13" },

        { section: "非热带水果", name: "苹果英文11", age: "苹果英文是什么", sex: "2024.4.12" },

        { section: "热带水果", name: "苹果英文11", age: "苹果英文是什么", sex: "2024.4.15" },
        { section: "热带水果", name: "苹果英文", age: "苹果英文是什么", sex: "2024.4.14" },
        { section: "热带水果", name: "苹果英文222", age: "苹果英文是什么", sex: "2024.4.13" },
        { section: "热带水果", name: "苹果英文11", age: "苹果英文是什么", sex: "2024.4.12" },
        { section: "热带水果", name: "苹果英文11", age: "苹果英文是什么", sex: "2024.4.15" },

      ],
      dataList: [
        {
          label: "题目分类",
          value: "section",
        },
        {
          label: "题目标题",
          value: "name",
        },
        {
          label: "题目内容",
          value: "age",
        },
        {
          label: "时间",
          value: "sex",
        },

      ],



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