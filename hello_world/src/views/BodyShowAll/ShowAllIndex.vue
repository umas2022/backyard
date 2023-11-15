<template>
    <!-- 倒序展示所有图片，点击底部按钮连续载入图片 -->
    <div class="show-all">
        <!-- <el-button type="danger" @click="display_center = true"> test1</el-button> -->

        <AnimateDown :display="display_center" :direction="direction_center">
            <template #content>

                <!-- 标题 -->
                <h1 style="text-align: center;">{{ show_list.title }}</h1>


                <!-- 图片显示 -->
                <div class="img-each" v-for="(img_name, index) in show_list.list" :key="index"
                    :style="{ width: store.state.setval.pic_width + '%' }">

                    <ShowImage :title="get_title(show_list.list[show_list.list.length - index - 1])"
                        :path="show_list.list[show_list.list.length - index - 1]">
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
import { defineProps, ref, watch, computed, inject, onMounted, onBeforeUnmount,reactive } from "vue";
import type { Ref } from "vue"
import { useStore } from "vuex";
const store = useStore();
import { ElMessage } from 'element-plus'
import AnimateDown from "@/components/AnimateDown.vue"
import ShowImage from "@/components/ShowImage.vue"

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


// 当前组序号
const current_num = ref(0)


// 访问参数
const input_group = ref("")
const global_msg = ref("")

// 外部二维码带参数访问
// http://localhost:8080/#/show_all?input_group=image
const page_refresh = () => {
    if ('input_group' in router.currentRoute.value.query) {
        input_group.value = (router.currentRoute.value.query.input_group as string)
    }
    if (input_group.value == "") {
        global_msg.value = "错误格式的查询字符串：" + JSON.stringify(router.currentRoute.value.query)
    }
    else {
        build_show_list()
    }
}
onMounted(() => {
    page_refresh()
})

watch(() => router.currentRoute.value.query, () => {
    page_refresh()
})


// 生成图片列表
const show_list = reactive({
    title: "",
    list: [""]
})
const build_show_list = () => {
    show_list.title = "所有图片"
    if (input_group.value == "image") {
        current_num.value = img_total.value
        show_list.list = image_urls.value["pack" + JSON.stringify(img_total.value).padStart(4, "0")]
    }
    else if (input_group.value == "sticker") {
        current_num.value = stk_total.value
        show_list.list = sticker_urls.value["pack" + JSON.stringify(stk_total.value).padStart(4, "0")]
    }
    else if (input_group.value == "video") {
        current_num.value = vid_total.value
        show_list.list = video_urls.value["pack" + JSON.stringify(vid_total.value).padStart(4, "0")]
    }
}





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






// 继续加载下一组图片
const load_next = () => {
    console.log(current_num)
    current_num.value -= 1
    if (current_num.value < 1) {
        ElMessage.success("到底啦")
        return
    }

    // 载入最新一组图片
    if (show_list.list[0].includes("image")) {
        show_list.list.unshift(...image_urls.value["pack" +JSON.stringify(current_num.value).padStart(4, "0")])
    }
    else if (show_list.list[0].includes("video")) {
        show_list.list.unshift(...video_urls.value["pack" + JSON.stringify(current_num.value).padStart(4, "0")])
    } 
    else if (show_list.list[0].includes("sticker")) {
        show_list.list.unshift(...sticker_urls.value["pack" + JSON.stringify(current_num.value).padStart(4, "0")])
    }
}




// test按钮
const test_button = () => {
    console.log("test")
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