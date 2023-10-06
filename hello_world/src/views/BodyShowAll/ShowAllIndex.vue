<template>
    <div>
        <!-- <el-button type="danger" @click="display_center = true"> test1</el-button> -->

        <AnimateDown :display="display_center" :direction="direction_center">
            <template #content>

                <!-- 标题 -->
                <h1 style="text-align: center;">{{ store.state.show_list.title }}</h1>


                <!-- 图片显示 -->
                <div class="img-each" v-for="(img_name, index) in store.state.show_list.list" :key="index"
                    :style="{ width: store.state.setval.pic_width + '%' }">

                    <ShowImage :title="get_title(store.state.show_list.path[store.state.show_list.path.length - index - 1])"
                        :path="store.state.show_list.path[store.state.show_list.path.length - index - 1]">
                    </ShowImage>

                </div>




                <div class="rear-box">
                    <el-button @click="load_next">继续加载</el-button>
                </div>




            </template>
        </AnimateDown>


    </div>
</template>
<script lang="ts" setup>
import { defineProps, ref, watch, computed, inject, onMounted, onBeforeUnmount } from "vue";
import type { Ref } from "vue"
import { useStore } from "vuex";
const store = useStore();
import { ElMessage } from 'element-plus'
import AnimateDown from "@/components/AnimateDown.vue"
import ShowImage from "@/components/ShowImage.vue"
import { pack_name } from "@/utils/tools.js"

import { useRouter } from "vue-router";
const router = useRouter();


const image_urls: Ref<any> = inject("image_urls")!
const sticker_urls: Ref<any> = inject("sticker_urls")!
const video_urls: Ref<any> = inject("video_urls")!
const tag_index: Ref<any> = inject("tag_index")!
const img_total = computed(() => Object.keys(image_urls.value).length)
const stk_total = computed(() => Object.keys(sticker_urls.value).length)
const vid_total = computed(() => Object.keys(video_urls.value).length)


const display_center: Ref<boolean> = ref(true)
const direction_center: Ref<"right" | "left"> = ref("right")





// 拼接标题字符串
// 原始路径是这样的：https://raw.githubusercontent.com/umas2022/backyard_store/main/storage/image/pack0090/4452.jpg
// 简化为这样的：pack0090 - 4452.jpg
const get_title = (url: string) => {
    // pack0090
    let title = url.split('/')[url.split('/').length - 2]
    // pack0090 - 
    title += " - "
    // pack0090 - 4452.jpg
    title += url.split('/')[url.split('/').length - 1]
    return title
}


// 初始组序号
// 如果没有载入图片列表，返回主页，不进行初始化
const current_num = ref(0)
onMounted(()=>{
    if(store.state.show_list.list == undefined){
        router.push("home")
        return
    }

    if (store.state.show_list.list[0].includes("image")) {
        current_num.value = img_total.value
    }
    else if (store.state.show_list.list[0].includes("video")) {
        current_num.value = vid_total.value
    } 
    else if (store.state.show_list.list[0].includes("sticker")) {
        current_num.value = stk_total.value
    }
})


// 继续加载下一组图片
const load_next = () => {
    console.log(current_num)
    current_num.value -= 1
    if (current_num.value < 1) {
        ElMessage.success("到底啦")
        return
    }

    // 载入最新一组图片
    let show_list = store.state.show_list
    if (show_list.list[0].includes("image")) {
        show_list.list.unshift(...image_urls.value[pack_name(current_num.value)])
    }
    else if (show_list.list[0].includes("video")) {
        show_list.list.unshift(...video_urls.value[pack_name(current_num.value)])
    } 
    else if (show_list.list[0].includes("sticker")) {
        show_list.list.unshift(...sticker_urls.value[pack_name(current_num.value)])
    }

    show_list.path = show_list.list

}




// test按钮
const test_button = () => {
    console.log("test")
    display_center.value = !display_center.value
    console.log(display_center.value)
}

</script>


<style lang="scss" scoped>
div.img-box {
    text-align: center;
    width: 100%;
    height: 100%;
    transition: 0.3s ease-out;
}

div.img-each {
    border-radius: 5px;
    border: solid 2px rgba(0, 0, 0, 0.5);
    margin: auto;
    margin-bottom: 15px;
    padding: 15px;

    img {
        width: 100%;
    }

    video {
        width: 100%;
    }
}




// 下一页
div.rear-box {
    margin: 0 auto;
    text-align: center;
    padding: 10px;
    margin-bottom: 100px;
}
</style>