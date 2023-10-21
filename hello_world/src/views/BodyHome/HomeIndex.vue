<template>
    <div>

        <div class="search-box">

            <!-- <el-button type="danger" @click=test_button> test</el-button> -->

            <div class="img-box ">
                <img v-if="store.state.setval.ishandy" class="shake-crazy handy" src="static/home.jpg" alt="">
                <img v-else class="shake-crazy window" src="static/home.jpg" alt="">
            </div>
            <div class="input-box">

                <div id="search" class="search-input">
                    <el-input placeholder="搜tag" v-model="search_input"></el-input>
                    <el-button class="shake-little" type="primary" @click="search_tag">搜索</el-button>
                </div>

                <div id="go">
                    <el-button class="shake-little" type="warning" @click="go_image">看图</el-button>
                    <el-button class="shake-little" type="warning" @click="go_video">视频</el-button>
                    <el-button class="shake-little" type="warning" @click="go_sticker">表情</el-button>
                </div>


            </div>

            <div class="tag-box">
                <div class="tag-each shake-little" v-for="(tag, index) in tag_index" :key="index">
                    <my-tag v-if="tag_sep.includes(tag)" type="danger" :hover="true">{{ tag }}</my-tag>
                    <my-tag v-else @click="search_input = tag" :hover="true">{{ tag }}</my-tag>
                </div>
            </div>

        </div>



    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, inject, computed, watch } from "vue"
import type { Ref } from "vue"

import { tag_sep } from "@/utils/const.js"
import MyTag from "@/components/MyTag.vue"


const image_urls: Ref<any> = inject("image_urls")!
const sticker_urls: Ref<any> = inject("sticker_urls")!
const video_urls: Ref<any> = inject("video_urls")!
const tag_index: Ref<any> = inject("tag_index")!
const img_total = computed(() => Object.keys(image_urls.value).length)
const stk_total = computed(() => Object.keys(sticker_urls.value).length)
const vid_total = computed(() => Object.keys(video_urls.value).length)

import { useRouter } from "vue-router";
const router = useRouter();

import { useStore } from "vuex";
const store = useStore();

import { pack_name } from "@/utils/tools.js"
import { ElMessage } from "element-plus"


// 初始化搜索栏换行
onMounted(() => {
    if (store.state.setval.ishandy) {
        const navi_box = document.querySelector(".input-box");
        (navi_box as HTMLElement).style.display = 'block';
    }
})



// 搜索输入
const search_input = ref("")


// 点击搜索按钮，搜索tag
const search_tag = () => {
    if (search_input.value == "") {
        ElMessage.success("请输入")
        return
    }
    store.state.target_tag = search_input.value
    router.push("search_res")

}


// 看最新图
const go_image = () => {
    const show_list = {
        title: "全部图片",
        list: [],
        path: []
    }
    // 载入最新一组图片
    show_list.list = image_urls.value[pack_name(img_total.value)]
    show_list.path = show_list.list

    store.commit("set_list", show_list)
    router.push("show_all")
}

const go_video = () => {
    const show_list = {
        title: "全部视频",
        list: [],
        path: []
    }
    show_list.list = video_urls.value[pack_name(vid_total.value)]
    show_list.path = show_list.list

    store.commit("set_list", show_list)
    router.push("show_all")
}

const go_sticker = () => {
    const show_list = {
        title: "全部表情",
        list: [],
        path: []
    }
    show_list.list = sticker_urls.value[pack_name(stk_total.value)]
    show_list.path = show_list.list

    store.commit("set_list", show_list)
    router.push("show_all")
}



// test按钮
const test_button = () => {
    console.log("test")
    console.log(tag_index.value)
}
</script>

<style lang="scss" scoped>
my-tag {
    cursor: pointer;
}

div.search-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 100px;
    padding-bottom: 100px;
}

div.search-box .img-box {
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        padding: 5px;
        border: solid 3px black;
        border-radius: 5px;

    }

    img.window {
        // transform: scale(0.3);
        width: 30%;
    }
    img.handy{
        width: 60%;
    }

}

div.search-box .input-box {
    width: calc(30% + 220px);
    padding: 5px;
    display: flex;
    border-radius: 5px;
    margin: 5px 0 5px 0;
    text-align: center;

    #search {
        border: solid 3px black;
        border-radius: 5px;
        padding: 5px;
        margin-right: 10px;
        width: 100%;
    }

    .search-input {
        .el-input {
            width: calc(100% - 60px);
        }
    }

    .search-res {
        width: 100%;

        .el-input {
            width: calc(100% - 135px);
        }
    }

    #go {
        border: solid 3px black;
        border-radius: 5px;
        padding: 5px;
        display: flex;
        text-align: center;
        width: 100%;

        .el-button {
            margin: 0 auto;
            width: 30%;
        }
    }
}


/* 自定义搜索框 */
div.el-autocomplete div.el-input {
    height: 40px;
    width: 100%;
}

/* tag展示区 */
div.tag-box {
    width: 80%;
    height: 50%;
    display: flex;
    flex-wrap: wrap;
}

div.tag-each {
    padding: 3px;
}

div.tag-each .el-tag {
    cursor: pointer;
}
</style>