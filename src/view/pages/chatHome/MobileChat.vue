<template>
  <el-container class="message-container">
    <el-header class="message-header">
      Yoka
    </el-header>
    <el-main class="message-main">
      <div class="message-content">
        
        <p><i class="el-icon-user"> </i>  您好，我是小天，很高兴为您服务，请告诉我您希望查询的问题。</p>
        <p class="subtext">您希望查找关于什么内容？(产品相关+问题描述)</p>
      </div>
      <div class="message-content-red">
        <p>您希望网购/公交券业务存在异议可协助沟通咨询么？</p>
        <p>如何配合设计人员制定策略？</p>
        <p>您希望如何处理什么？</p>
        <p>希望是否愿意配合日志追踪？</p>
        <p>您希望提供你所收到是否支持更加环境？</p>
      </div>
    </el-main>
    <el-footer class="message-footer">
      <el-input v-model="input" placeholder="请输入内容"></el-input>
      <i class="el-icon-s-promotion" @click="goToMobileChat"></i>
    </el-footer>
  </el-container>
</template>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.message-header  {
  background-color: #ef2929;
  color: white;
  text-align: center;
  padding: 10px 0;
}
.message-footer{
  color: white;
  text-align: center;
  padding: 10px 0;
  margin: 10px;
}

.message-main {
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
}

.message-content {
  color: black;
  font-size: 16px;
  margin-bottom: 20px;
}

.message-content-red {
  color: rgb(235, 54, 54);
  font-size: 16px;
  margin-bottom: 20px;
}

.subtext {
  color: gray;
}

@media (max-width: 600px) {
  .message-header, .message-footer {
    padding: 15px 0;
  }

  .message-main {
    padding: 10px;
  }

  .message-content, .message-content-red {
    font-size: 14px;
  }
}
</style>
