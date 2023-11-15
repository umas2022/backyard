<template>
    <!-- 50一组分页展示图片 -->
    <div class="one-box">
        <!-- <el-button type="danger" @click="test_button"> test1</el-button> -->

        <AnimateDown :display="display_center" :direction="direction_center">
            <template #content>

                <!-- 报错信息 -->
                <h1 style="text-align: center;" v-if="global_msg != ''">{{ global_msg }}</h1>

                <!-- 标题 -->
                <h1 style="text-align: center;">{{ show_list.title }}</h1>

                <!-- 上一页/下一页 -->
                <div class="rear-box">
                    <el-button @click=page_pre>上一页</el-button>
                    <el-button @click=page_next>下一页</el-button>
                </div>

                <!-- 图片显示 -->
                <div class="img-each" v-for="(img_name, index) in show_list.list" :key="index"
                    :style="{ width: store.state.setval.pic_width + '%' }">

                    <ShowImage
                        :title="'No.' + index + 1 + '(' + show_list.list[index].split('/')[show_list.list[index].split('/').length - 2] + '/' + show_list.list[index].split('/')[show_list.list[index].split('/').length - 1] + ')'"
                        :path="show_list.list[index]">
                    </ShowImage>

                </div>

                <!-- 上一页/下一页 -->
                <div class="rear-box">
                    <h3 style="text-align: center;">{{ show_list.title }} end</h3>
                    <el-button @click=page_pre>上一页</el-button>
                    <el-button @click=page_next>下一页</el-button>
                </div>

            </template>
        </AnimateDown>


    </div>
</template>
<script lang="ts" setup>
import { defineProps, ref, watch, computed, inject, onMounted, onBeforeUnmount, reactive } from "vue";
import type { Ref } from "vue"
import { useStore } from "vuex";
const store = useStore();
import { useRouter } from "vue-router";
const router = useRouter();
import { ElMessage } from 'element-plus'
import AnimateDown from "@/components/AnimateDown.vue"
import ShowImage from "@/components/ShowImage.vue"


const image_urls: Ref<any> = inject("image_urls")!
const sticker_urls: Ref<any> = inject("sticker_urls")!
const video_urls: Ref<any> = inject("video_urls")!
const tag_index: Ref<any> = inject("tag_index")!
const img_total = computed(() => Object.keys(image_urls.value).length)
const stk_total = computed(() => Object.keys(sticker_urls.value).length)
const vid_total = computed(() => Object.keys(video_urls.value).length)


const display_center: Ref<boolean> = ref(true)
const direction_center: Ref<"right" | "left"> = ref("right")


// 访问参数
const input_group = ref("")
const input_num = ref("")
const global_msg = ref("")

// 外部二维码带参数访问
// http://localhost:8080/#/show_one?input_group=image&input_num=10
const page_refresh = () => {
    if ('input_group' in router.currentRoute.value.query) {
        input_group.value = (router.currentRoute.value.query.input_group as string)
    }
    if ('input_num' in router.currentRoute.value.query) {
        input_num.value = (router.currentRoute.value.query.input_num as string)
    }
    if (input_group.value == "" || input_num.value == "") {
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
    show_list.title = "第" + input_num.value + "期"
    if (input_group.value == "image") {
        show_list.list = image_urls.value["pack" + input_num.value.padStart(4, "0")]
    }
    else if (input_group.value == "sticker") {
        show_list.list = sticker_urls.value["pack" + input_num.value.padStart(4, "0")]
    }
    else if (input_group.value == "video") {
        show_list.list = video_urls.value["pack" + input_num.value.padStart(4, "0")]
    }
}


// 下一页/上一页
const page_pre = () => {
    if (Number(input_num.value) == 1) {
        ElMessage.success("到头啦!")
        return
    }

    direction_center.value = "right"
    display_center.value = false
    setTimeout(() => {
        router.push("show_one?input_group=" + input_group.value + "&input_num=" + (Number(input_num.value) - 1))
    }, 500);
    setTimeout(() => {
        direction_center.value = "right"
        display_center.value = true
    }, 700);
}

const page_next = () => {
    let max = input_group.value == "image" ? img_total.value : input_group.value == "sticker" ? stk_total.value : vid_total.value
    if (Number(input_num.value) == max) {
        ElMessage.success("到头啦!")
        return
    }

    direction_center.value = "left"
    display_center.value = false
    setTimeout(() => {
        router.push("show_one?input_group=" + input_group.value + "&input_num=" + (Number(input_num.value) + 1))
    }, 500);
    setTimeout(() => {
        direction_center.value = "left"
        display_center.value = true
    }, 700);
}




// 键盘翻页
const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == "ArrowLeft") {
        page_pre()
    } else if (event.key == "ArrowRight") {
        page_next()
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
});



// test按钮
const test_button = () => {
    console.log("test")
    console.log(input_num.value)
    console.log(router.currentRoute.value.query)

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
    padding: 10px
}
</style>