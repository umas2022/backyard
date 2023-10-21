<template>
    <div class="body-navi">

        <!-- <el-button style="z-index: 99;" type="danger" @click=test_button> test</el-button> -->


        <IconButtonSingle :icon="'icon/home.svg'" :title="'返回主页'" @click="go_home" />


        <IconButton :icon="'icon/image.svg'" :title="'弔图存档'">
            <div class="navi-body">
                <div class="navi-each pointer" v-for="index in img_total" :key="index"
                    @click="change_img_group('image', index)">
                    第{{ img_total + 1 - index }}期
                    <img width="10" height="10" src="icon/right.svg" alt="icon">
                </div>
            </div>
        </IconButton>


        <IconButton :icon="'icon/sticker.svg'" :title="'表情存档'">
            <div class="navi-body">
                <div class="navi-each pointer" v-for="index in stk_total" :key="index"
                    @click="change_img_group('sticker', index)">
                    第{{ stk_total + 1 - index }}期
                    <img width="10" height="10" src="icon/right.svg" alt="icon">
                </div>
            </div>
        </IconButton>


        <IconButton :icon="'icon/video.svg'" :title="'视频存档'">
            <div class="navi-body">
                <div class="navi-each pointer" v-for="index in vid_total" :key="index"
                    @click="change_img_group('video', index)">
                    第{{ vid_total + 1 - index }}期
                    <img width="10" height="10" src="icon/right.svg" alt="icon">
                </div>
            </div>
        </IconButton>


        <IconButton :icon="'icon/setting.svg'" :title="'设置'">
            <div class="navi-body">
                <div class="navi-each">
                    图片宽度 <br>
                    <el-slider v-model="set_pic_width" :max="90" :min="20" @input="slider_pic_width()" />
                </div>
                <div class="navi-each">
                    显示tag <br>
                    <el-switch v-model="store.state.setval.show_tag" style="margin-left: 70px;" />
                </div>
                <div class="navi-each">
                    编辑tag <br>
                    <el-switch v-model="store.state.setval.edit_tag"
                        @click="store.state.setval.right_navi = store.state.setval.edit_tag" style="margin-left: 70px;">
                    </el-switch> <br>
                </div>
                <div class="navi-each">
                    右侧tag栏 <br>
                    <el-switch v-model="store.state.setval.right_navi" style="margin-left: 70px;"> </el-switch> <br>
                </div>

                <div class="navi-each">
                    开发模式 <br>
                    <el-switch v-model="store.state.setval.isdev" style="margin-left: 70px;" />
                </div>
                <div class="navi-each">
                    夜间模式 <br>
                    (开发中)
                </div>
            </div>
        </IconButton>


        <IconButton :icon="'icon/magic.svg'" :title="'关于'">
            <div class="navi-body">
                <div class="navi-each"> by:umas </div>
                <div class="navi-each">visit: <a href="https://github.com/umas2022/umas2022.github.io">GitHub</a>
                </div>
                <div class="navi-each">
                    <li>左右方向键可以控制翻页</li>
                </div>
                <div class="navi-each">
                    <li>肉眼找不到tag可以ctrl+F直接搜网页</li>
                </div>
                <div class="navi-each">
                    <li>（超过一个月没更新的话可以去微信摇我一下）</li>
                </div>
                <div class="navi-each">
                    <li>（↑摇不到的话可能是人无了，欢迎来捡金币）</li>
                </div>
            </div>
        </IconButton>


        <IconButton :icon="'icon/info.svg'" :title="'更新记录'">
            <div class="navi-body">
                <div class="navi-each" v-for="(item, index) in update_index" :key="index">
                    <li> {{ item.split(":")[0] }} <br>{{ item.split(":")[1] }}</li>
                </div>
            </div>
        </IconButton>


    </div>
</template>
  
<script lang="ts" setup>
import { ref, inject, computed, onMounted } from "vue"
import type { Ref } from "vue"
import { useStore } from "vuex";
const store = useStore();
import { useRouter } from "vue-router";
const router = useRouter();
import { pack_name } from "@/utils/tools.js"

import IconButton from "./IconButton.vue";
import IconButtonSingle from "./IconButtonSingle.vue";

const image_urls: Ref<any> = inject("image_urls")!
const sticker_urls: Ref<any> = inject("sticker_urls")!
const video_urls: Ref<any> = inject("video_urls")!
const update_index: Ref<any> = inject("update_index")!

const img_total = computed(() => Object.keys(image_urls.value).length)
const stk_total = computed(() => Object.keys(sticker_urls.value).length)
const vid_total = computed(() => Object.keys(video_urls.value).length)

// 返回主页
const go_home = () => {
    router.push("home")
}



// 图片组格式化生成函数
const set_show_list = (group: string, num: number, title: string) => {
    const show_list = {
        title: title,
        list: [],
        path: []
    }
    if (group == "image") {
        show_list.list = image_urls.value[pack_name(num)]
        show_list.path = show_list.list
    } else if (group == "sticker") {
        show_list.list = sticker_urls.value[pack_name(num)]
        show_list.path = show_list.list
    } else if (group == "video") {
        show_list.list = video_urls.value[pack_name(num)]
        show_list.path = show_list.list
    }
    return show_list
}

// 切换图片组
const change_img_group = (group: string, num: number) => {
    if (group == "image") {
        store.commit("set_list", set_show_list(group, img_total.value + 1 - num, "第" + JSON.stringify(img_total.value + 1 - num) + "期"))
    } else if (group == "sticker") {
        store.commit("set_list", set_show_list(group, stk_total.value + 1 - num, "第" + JSON.stringify(stk_total.value + 1 - num) + "期"))
    } else if (group == "video") {
        store.commit("set_list", set_show_list(group, vid_total.value + 1 - num, "第" + JSON.stringify(vid_total.value + 1 - num) + "期"))
    }
    router.push("show_one")
}

// 设置参数
const set_pic_width = ref(store.state.setval.pic_width)
const slider_pic_width = () => {
    store.commit("set_set", { key: "pic_width", value: set_pic_width.value })
}





// 测试按钮
const test_button = () => {
    console.log(image_urls)
}


</script>
  
<style  lang="scss" scoped>
div.body-navi {
    display: flex;
    flex-direction: column;
    transition: 0.3s ease-out;
}


div.navi-body {
    padding: 10px;
    height: auto;

    div.navi-each {
        border-radius: 5px;
        border: solid 2px rgba(0, 0, 0, 1);
        margin: 5px;
        padding: 5px 15px 5px 15px;
        background-color: rgba(255, 255, 255, 0.3);
    }
}
</style>