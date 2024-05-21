<template>
  <div class="emoji-content">
    hhhhhhhhhhh
  </div>
</template>

<script>
export default {
  data() {
    return {
      emojiList: [
        require("@/assets/img/emoji/slightly-smiling-face.png"),
        require("@/assets/img/emoji/smiling-face.png"),
        require("@/assets/img/emoji/smiling-face-with-heart-eyes.png"),
        require("@/assets/img/emoji/smiling-face-with-sunglasses.png"),
        require("@/assets/img/emoji/thinking-face.png"),
        require("@/assets/img/emoji/tired-face.png"),
        require("@/assets/img/emoji/money-mouth-face.png"),
        require("@/assets/img/emoji/loudly-crying-face.png"),
        require("@/assets/img/emoji/pouting-face.png"),
        require("@/assets/img/emoji/face-screaming-in-fear.png"),
        require("@/assets/img/emoji/face-vomiting.png"),
        require("@/assets/img/emoji/face-without-mouth.png"),
        require("@/assets/img/emoji/face-with-tongue.png"),
        require("@/assets/img/emoji/clown-face.png"),
        require("@/assets/img/emoji/new-moon-face.png"),
        require("@/assets/img/emoji/ghost.png"),
        require("@/assets/img/emoji/jack-o-lantern.png"),
        require("@/assets/img/emoji/money-bag.png"),
        require("@/assets/img/emoji/pile-of-poo.png"),
        require("@/assets/img/emoji/shamrock.png"),
        require("@/assets/img/emoji/hibiscus.png"),
        require("@/assets/img/emoji/lips.png"),
        require("@/assets/img/emoji/sparkles.png"),
        require("@/assets/img/emoji/star.png"),
        require("@/assets/img/emoji/two-hearts.png"),
        require("@/assets/img/emoji/rainbow.png"),
        require("@/assets/img/emoji/thought-balloon.png"),
      ],
    };
  },
  methods: {
    sendEmoji(item) {
      this.$emit("sendEmoji", item);
    },
    closeEmoji() {
      this.$emit("closeEmoji");
    }
  },
};
</script>

<style lang="scss" scoped>
.emoji-content{
  width: 150px;
  height: 150px;
  background-color: aqua;
}

</style>