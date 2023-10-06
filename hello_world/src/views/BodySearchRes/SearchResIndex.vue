<template>
    <div>

        <div class="search-box">

            <!-- <el-button type="danger" @click=test_button> test</el-button> -->

            <div class="header" style="width: 70%;">
                <h3 style="word-wrap: break-word;">{{'当前搜索：' +  input_record }}</h3>
                
            </div>

            <div class="input-box">

                <div id="search" :class="res_list.length == 1 ? 'search-input' : 'search-res'">
                    <el-input placeholder="搜tag" v-model="search_input"></el-input>
                    <el-button class="shake-little" type="primary" @click="search_tag">搜索</el-button>
                    <el-button @click="search_back" v-if="res_list.length > 1">返回</el-button>
                </div>

            </div>

            <div class="tag-box" v-if="res_list.length == 1">
                <div class="tag-each shake-little" v-for="(tag, index) in tag_index" :key="index">
                    <my-tag v-if="tag_sep.includes(tag)" type="danger" :hover="true">{{ tag }}</my-tag>
                    <my-tag v-else @click="search_input = tag" :hover="true">{{ tag }}</my-tag>
                </div>
            </div>

            <!-- 显示搜索结果 -->
            <div class="res-box" v-if="res_list.length > 1">
                <PageShow :hide_button="true" />
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
import PageShow from "./PageShow.vue"
import { ElMessage } from "element-plus"


// 初始化【宽屏/竖屏】搜索栏换行
onMounted(() => {
    if (store.state.setval.ishandy) {
        const navi_box = document.querySelector(".input-box");
        (navi_box as HTMLElement).style.display = 'block';
    }
})



// 搜索框输入
const search_input = ref("")


// 搜索结果拼接函数
const add_search_list = (show_list: { title: string, list: string[], path: string[] }, pack_num: number | string, stk_name: string) => {
    show_list.list.push(stk_name)
    show_list.path.push(stk_name)
    return show_list
}

// 输入的tag列表
const input_record:Ref<Array<string>> = ref([])

// 搜索记录列表
const res_list = ref<{ title: string, list: string[], path: string[] }[]>([])
onMounted(() => {
    res_list.value = []
    res_list.value[0] = { title: "搜索结果", list: [], path: [] }
    for (let pack in sticker_urls.value) {
        for (let id in sticker_urls.value[pack]) {
            res_list.value[0] = add_search_list(res_list.value[0], pack, sticker_urls.value[pack][id])
        }
    }
    if(store.state.target_tag != ""){
        search_input.value = store.state.target_tag
        search_tag()
    }
})


// 点击搜索按钮，搜索tag
const search_tag = () => {
    if(search_input.value==""){
        ElMessage.success("请输入")
        return
    }
    
    input_record.value.push(search_input.value)

    res_list.value.push({ title: "搜索结果", list: [], path: [] })
    for (let id in res_list.value[res_list.value.length - 2].list) {
        let stk = res_list.value[res_list.value.length - 2].list[id]
        let path = res_list.value[res_list.value.length - 2].path[id]
        if (stk.includes(search_input.value)) {
            res_list.value[res_list.value.length - 1].list.push(stk)
            res_list.value[res_list.value.length - 1].path.push(path)
        }
    }
    store.commit("set_list", res_list.value[res_list.value.length - 1])
}


// 搜索结果回退
const search_back = () => {
    res_list.value.pop()
    input_record.value.pop()
    store.commit("set_list", res_list.value[res_list.value.length - 1])

    if(res_list.value.length==1){
        router.push("home")
    }
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