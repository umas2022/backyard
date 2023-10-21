<template>
  <div class="layout-index">

    <!-- <el-button style="z-index: 99;" type="danger" @click=test_button> test</el-button> -->

    <!-- 背景图x10 -->
    <div class="bg-box" :style="{ backgroundImage: `url(${bg_path})` }"></div>

    <!-- 左侧导航 -->
    <div class="navi-box">

      <!-- 竖屏顶部按钮 -->
      <template v-if="store.state.setval.ishandy">
        <IconButtonSingle icon="icon/menu.svg" title="菜单" @click="btn_navi_ctrl" />
      </template>

      <!-- 侧边导航主体 -->
      <div class="cp-navi" v-show="!store.state.setval.ishandy || show_navi">
        <LeftNavi />
      </div>
    </div>


    <!-- 中间内容主体 -->
    <div class="body-box" ref="bodyBoxRef">

      <!-- 中间loading页,初始化loading -->
      <div class="body-loading" v-if="image_index == '' || sticker_index == '' || video_index == ''">
        <PageLoading />
      </div>

      <!-- 搜索和图片展示 -->
      <div v-else :native="true" class="body-search">
        <router-view />
      </div>

      <!-- 右侧tag显示 -->
      <div class="body-tag" v-if="store.state.setval.right_navi" :style="{ width: width_tag }">
        <RightTagBox />
      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, provide } from "vue";
import type { Ref } from "vue"
import LeftNavi from "./components/LeftNavi.vue"
import RightTagBox from "./components/RightTagBox.vue"
import PageLoading from "@/views/BodyLoading/LoadingIndex.vue"
import IconButtonSingle from "./components/IconButtonSingle.vue";


import { useStore } from "vuex";
const store = useStore();
import { useRouter } from "vue-router";
const router = useRouter();

// 背景图片
const bg_path = "background/pattern-" + Math.ceil(Math.random() * 33) + ".svg"


// 手机模式下的左侧导航控制，因为没做body的宽度变动，所以默认隐藏好像页没什么意义，默认展开好了
const show_navi = ref(true)
const btn_navi_ctrl = () => {
  show_navi.value = !show_navi.value
  const navi_box = document.querySelector(".body-navi");
  (navi_box as HTMLElement).style.marginTop = '30px';
}

// 全局记录左侧展开状态
const expand_navi_list = ref([])
provide("expand_navi_list", expand_navi_list)

// 左侧导航展开时的宽度控制
const bodyBoxRef = ref()
const body_box_init = () => {
  bodyBoxRef.value.style.transform = "translateX(0px)"
}
const body_box_move = () => {
  bodyBoxRef.value.style.transform = "translateX(300px)"
}
provide("body_box_init", body_box_init)
provide("body_box_move", body_box_move)


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
  body_box_move()
}
</script>

<style scoped lang="scss">
/*  背景图片 */
div.bg-box {
  position: absolute;
  height: 100%;
  width: 100%;
  background-repeat: repeat;
  background-size: 400px;
  z-index: -1;
  opacity: 0.1;
}

// 页面布局
div.layout-index {
  position: relative;
}

// 左侧导航
div.navi-box {
  position: absolute;
  z-index: 99;
  left: 10px;
  transition: 0.7s;
}


// 中间内容主体
div.body-box {
  margin-left: 80px; // 给左侧navi留出空间
  height: calc(100vh - 20px);
  display: flex;
  transition: 0.7s ease-in-out;

  // loading页
  div.body-loading {
    height: 100%;
    width: 100%;
  }

  // 中间搜索页
  div.body-search {
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }


  // 右侧tag显示
  div.body-tag {
    overflow: auto;
    transition: 0.7s ease-out;
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