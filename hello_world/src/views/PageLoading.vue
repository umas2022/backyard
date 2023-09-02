<template>
    <!-- 加载页 -->
    <div class="loading">
        <h1>[ loading ... (还没做) ]</h1> 
        <h1>(loading不会超过5秒)</h1> 
        <h1>(服务器在github所以需要科学上网)</h1> 
    </div>
</template>
<script lang="ts" setup>
</script>
<style lang="scss" scoped>
div.loading {
    height: 70%;
    width: 100%;
    border: solid 1px white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}</style>
