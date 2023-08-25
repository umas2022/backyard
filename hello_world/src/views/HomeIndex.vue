<template>
  <div class="home">

    <!-- <el-button style="z-index: 99;" type="danger" @click=test_button> test</el-button> -->

    <!-- 背景图x10 -->
    <div class="bg-box">
      <div class="bg-one" v-for="i in 10" :key="i">
        <img class="bg-img" :src=bg_path alt="">
      </div>
    </div>

    <!-- 左侧导航 -->
    <div class="navi-ctrl" v-if="store.state.setval.ishandy">
      <el-button @click="btn_navi_ctrl">
        <el-icon><Menu /></el-icon>
      </el-button>
    </div>
    <div class="body-navi" v-show="!store.state.setval.ishandy || show_navi">
      <HomeNavi />
    </div>

    <!-- 中间内容主体 -->
    <div class="body-center">

      <!-- 中间loading页,初始化loading -->
      <div class="body-loading" v-if="image_index == '' || sticker_index == '' || video_index == ''">
        <PageLoading />
      </div>

      <el-scrollbar v-else :native="true" class="body-search">
        <router-view />
      </el-scrollbar>

      <!-- 右侧tag显示 -->
      <el-scrollbar class="body-tag" v-if="store.state.setval.right_navi" :style="{ width: width_tag }">
        <HomeTagBox />
      </el-scrollbar>

    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, provide } from "vue";
import type { Ref } from "vue"
import HomeNavi from "./HomeNavi.vue"
import HomeTagBox from "./HomeTagBox.vue"
import PageLoading from "./PageLoading.vue"


import { useStore } from "vuex";
const store = useStore();
import { useRouter } from "vue-router";
const router = useRouter();

// 背景图片
const bg_path = "background/pattern-" + Math.ceil(Math.random() * 33) + ".svg"


// 手机模式下的左侧导航控制
const show_navi = ref(false)
const btn_navi_ctrl = () => {
  show_navi.value = !show_navi.value
  const navi_box = document.querySelector(".body-navi");
  (navi_box as HTMLElement).style.marginTop = '30px';
  // margin-top: 30px;
}


// 右侧tag导航展开时的宽度控制
const width_show = ref("100%")
const width_tag = ref("0%")
watch(() => store.state.setval.right_navi, () => {
  if (store.state.setval.right_navi) {
    width_show.value = "60%"
    width_tag.value = "40%"
  } else {
    width_show.value = "100%"
    width_tag.value = "0%"
  }
})


import { url_image_list, url_sticker_list, url_video_list, url_tag_list, url_update_list } from "@/utils/url.js"
import { url_image, url_sticker, url_video } from "@/utils/url.js"

// 获取远程资源(index是json索引,urls是实际访问路径)
const image_index = ref("")
const image_urls: Ref<any> = ref({})
provide("image_urls", image_urls)
const sticker_index = ref("")
const sticker_urls: Ref<any> = ref({})
provide("sticker_urls", sticker_urls)
const video_index = ref("")
const video_urls: Ref<any> = ref({})
provide("video_urls", video_urls)
const tag_index = ref("")
provide("tag_index", tag_index)
const update_index = ref("")
provide("update_index", update_index)

const get_list = async (url_list: string, url_store: string, index_ref: Ref<string>, urls_ref: Ref<any> = ref({})) => {
  try {
    const response = await fetch(url_list)
    const data = await response.json()
    index_ref.value = data
    for (let pack in data) {
      urls_ref.value[pack] = []
      for (let i in data[pack]) {
        urls_ref.value[pack].push(url_store + pack + "/" + data[pack][i])
      }
    }
  } catch (error) {
    console.error(error)
  }
}



// 获取远程资源
onMounted(() => {
  get_list(url_image_list, url_image, image_index, image_urls)
  get_list(url_sticker_list, url_sticker, sticker_index, sticker_urls)
  get_list(url_video_list, url_video, video_index, video_urls)

  // tag和update单独获取
  const get_index = async (url: string, save_ref: Ref<string>) => {
    try {
      const response = await fetch(url)
      const data = await response.json()
      save_ref.value = data
    } catch (error) {
      console.error(error)
    }
  }
  get_index(url_tag_list, tag_index)
  get_index(url_update_list, update_index)
})



// 初始化图片宽度
onMounted(() => {
  console.log(window.innerWidth)
  if (window.innerWidth < 1000) {
    store.commit("set_set", { key: "ishandy", value: true })
    store.commit("set_set", { key: "pic_width", value: 90 })
  }
})


// test按钮
const test_button = () => {
  console.log(video_urls.value)
}
</script>

<style scoped lang="scss">
/*  背景图片 */
div.bg-box {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  height: 100%;
  width: 100%;
  white-space: nowrap;


  div.bg-one {
    position: relative;
    display: inline-block;
    *display: inline;
    height: 100%;
    z-index: 0;
  }

  img.bg-img {
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
    opacity: 0.1;
  }
}

div.home {
  display: flex;
  flex-direction: row;
}

// 左侧导航
div.navi-ctrl {
  position: absolute;
  z-index: 99;
  right: 10px;
  left: 18px;
}

div.body-navi {
  height: auto;
}


div.body-center {
  width: 100%;
  // width: calc(100vw - 95px);
  height: calc(100vh - 20px);
  display: flex;
  flex-direction: row;
  transition: 0.3s ease-in-out;

  // loading页
  div.body-loading {
    height: 100%;
    width: 100%;
  }

  // 中间搜索页
  div.body-search {
    width: 100%
  }

  // 中间图片显示
  div.body-main {
    transition: 0.3s ease-out;
  }

  // 右侧tag显示
  div.body-tag {
    transition: 0.3s ease-out;
  }
}
</style>

<!-- 全局style -->
<style>
@import '~csshake';

.pointer {
  cursor: pointer;
}

body {
  overflow: hidden;
}
</style>