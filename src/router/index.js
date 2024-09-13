import VueRouter from "vue-router";

import ChatHome from "../view/pages/chatHome/index.vue";
import Video from "../view/pages/video.vue";
import Lingting from "../view/pages/lingting.vue";
import Setting from "../view/pages/setting.vue";
import MobileChat from "@/view/pages/chatHome/MobileChat.vue";
import Home from "@/view/home.vue";
import CheckChat from "../view/pages/CheckChat.vue";
import KnowLedgeChat from "../view/pages/KnowLedgeChat.vue";
import FreeChat from "../view/pages/FreeChat.vue";
import TitleSetChat from "../view/pages/TitleSetChat.vue";
import Prompt from "../view/pages/Prompt.vue";
import SelectModel from "../view/pages/SelectModel.vue";
import KnowSetting from "../view/pages/KnowSetting.vue";
import HelpChat from "../view/pages/HelpChat.vue"

export default new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/ChatHome",
      component: Home,
      children: [
        {
          path: "/ChatHome",
          name: "ChatHome",
          component: ChatHome,
        },
        {
          path: "/Video",
          name: "Video",
          component: Video,
        },
        {
          path: "/Lingting",
          name: "Lingting",
          component: Lingting,
        },
        {
          path: "/Setting",
          name: "Setting",
          component: Setting,
        },
      ],
    },
    {
      path: "/MobileChat",
      name: "MobileChat",
      component: MobileChat,
    },
    {
      path: "/CheckChat",
      name: "CheckChat",
      component: CheckChat,
    },
    {
      path: "/KnowLedgeChat",
      name: "KnowLedgeChat",
      component: KnowLedgeChat,
    },
    {
      path: "/FreeChat",
      name: "FreeChat",
      component: FreeChat,
    },
    {
      path: "/TitleSetChat",
      name: "TitleSetChat",
      component: TitleSetChat,
    },

    ,
    {
      path: "/Prompt",
      name: "Prompt",
      component: Prompt,
    },
    ,
    {
      path: "/SelectModel",
      name: "SelectModel",
      component: SelectModel,
    },
    , {
        path: "/KnowSetting",
        name: "KnowSetting",
        component: KnowSetting,
    },

    , {
        path: "/HelpChat",
        name: "HelpChat",
        component: HelpChat,
    },
    , {
      path: "/MobileChat",
      name: "MobileChat",
      component: MobileChat,
  },

  ],
});
