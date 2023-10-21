<template>
    <div class="icon-button" ref="iconButtonRef">
        <!-- 图标svg -->
        <div class="icon-box">
            <img width="36" height="36" :src=props.icon alt="icon">
        </div>
        <!-- 标题 -->
        <div class="title-box"> {{ props.title }} </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';


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


const iconButtonRef = ref()


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
}

</style>