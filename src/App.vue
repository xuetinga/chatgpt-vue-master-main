<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Home from './view/home.vue'
import { getChatMsg, gethistory,getstatic } from "@/api/getData";

export default {
  name: 'App',
  components: {
    Home
  },
  data:{
    configs:[],
    kbs:[],
    models:[],
    prompts:[],
  },
  created(){
    getstatic().then((res)=>{
      console.log("全局",res.data)
      this.configs = res.data.configs
      this.kbs = res.data.kbs
      this.models = res.data.models
      this.prompts = res.data.prompts

    }).catch((err)=>{
      console.log("err",err)
    })
  }

}
</script>

<style scoped lang="scss">
@import url(./assets/font/iconfont.css);
.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  font-size: 25px;
  vertical-align: middle;
  color: rgb(117,120,137);
  transition: .3s;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  padding: 0;
  margin: 0;
}

#app {
  //width: 100vw;
  height: 100vh;
  //background-color: rgb(151,157,167);
  overflow: hidden;
}

body {
  box-sizing: border-box;
  font-family: Oxygen, Arial, sans-serif;
}

router-link {
  text-decoration: none !important;
}

@font-face {
  font-family: 'Oxygen';
  src: url("@/assets/font/Oxygen-Light.ttf");
}
html body a:-webkit-any-link {
  text-decoration: none !important;
  color:transparent
}
</style>
