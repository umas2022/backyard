<template>
    <div class="icon-button" ref="iconButtonRef">
        <!-- 图标svg -->
        <div class="icon-box" @click="open_this">
            <img width="36" height="36" :src=props.icon alt="icon">
        </div>
        <!-- 标题 -->
        <div class="title-box"> {{ props.title }} </div>
        <!-- 内容 -->
        <div class="content-box" ref="contentBoxRef">
            <el-scrollbar>
                <slot></slot>
            </el-scrollbar>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { Ref, inject, ref } from 'vue';

// 父组件传参
const props = defineProps({
    icon: {
        type: String,
        reqrire: true,
    },
    title: {
        type: String,
        require: true,
    }
});


// 父组件：body宽度控制
const body_box_init: () => void = inject("body_box_init")!
const body_box_move: () => void = inject("body_box_move")!


// 父组件：全局记录navi展开状态
const expand_navi_list: Ref<Array<any>> = inject("expand_navi_list")!


// 点击展开
const iconButtonRef = ref()
const contentBoxRef = ref()
const if_open = ref(false)
const icon_symbol = Symbol(props.title)
const open_this = () => {
    if_open.value = !if_open.value
    if (if_open.value) {
        expand_navi_list.value.push(icon_symbol)
        body_box_move()
        iconButtonRef.value.style.width = "400px"
        iconButtonRef.value.style.height = "calc(100vh - 400px)"
        contentBoxRef.value!.style.transform = "translateX(0)"
    }
    else {
        expand_navi_list.value = expand_navi_list.value.filter(item => item !== icon_symbol);
        if (expand_navi_list.value.length == 0) {
            body_box_init()
        }
        iconButtonRef.value.style.width = "40px"
        iconButtonRef.value.style.height = "40px"
        contentBoxRef.value!.style.transform = "translateX(-400px)"
    }
}

</script>


<style lang="scss" scoped>
div.icon-button {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: 5px;
    transition: 0.5s;
    border: solid 3px black;
    padding: 3px;
    margin: 3px;
}

// 图标
div.icon-box {
    position: absolute;
    height: 40px;
    width: 40px;
    border-radius: 5px;
    transition: transform 0.7s ease-in-out;
    cursor: pointer;

    z-index: 3;
    display: inline-block;

    img {
        width: 100%;
        height: 100%;
    }
}

// icon鼠标悬停时旋转
div.icon-box:hover {
    transform: rotate(360deg);
}

div.icon-box:hover~.title-box {
    transform: translateX(0px);
}



// 标题
div.title-box {
    position: absolute;
    left: 55px;
    height: 30px;
    width: 100px;
    border-radius: 5px;
    border: solid 3px black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    transition: 0.5s;
    z-index: 2;
    transform: translateX(-200px);
    background-color: white;
}

// 内容
div.content-box {
    position: absolute;
    left: 55px;
    top: 50px;
    bottom: 10px;
    right: 10px;

    // display: none;
    border-radius: 5px;
    border: solid 3px black;
    transition: 0.5s;

    transform: translateX(-400px);
}
</style>