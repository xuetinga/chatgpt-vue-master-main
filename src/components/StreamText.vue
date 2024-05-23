<template>
    <div>{{ displayedText }}</div>
  </template>
  
  <script>
  export default {
    props: {
      text: {
        type: String,
        required: true,
      },
      speed: {
        type: Number,
        default: 50, // 默认速度为每50毫秒显示一个字符
      },
    },
    data() {
      return {
        displayedText: '',
        currentIndex: 0,
      };
    },
    mounted() {
      this.startStreaming();
    },
    methods: {
      startStreaming() {
        if (this.currentIndex < this.text.length) {
          this.displayedText += this.text[this.currentIndex];
          this.currentIndex++;
          setTimeout(this.startStreaming, this.speed);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* 可以根据需要添加样式 */
  </style>
  