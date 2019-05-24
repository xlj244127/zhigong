<template>
    <div class="main">
        <div class="header">
            <div class="top">
                <span class="t-1">张三班组</span> <span class="t-2">(您还未进行实名认证,建议先进行</span> <span class="t-3">实名认证 ></span> <span class="t-2">)</span>
            </div>
            <div class="bott">
                <div class="bo-1">添加班组成员</div>
            </div>
        </div>
        <div class="aside">
            暂无成员
            <br/>
            请先添加班组成员
        </div>
    </div>
</template>

<script>
    export default {
        name: "nodate"
    }
</script>

<style scoped>
    .header{
        width: 100%; background: #fff; margin-top: 0.5rem; box-sizing: border-box; padding: 0 0.6rem;
    }
    .header .top{
        width: 100%; height: 2rem; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
    }
    .header .top .t-1{
        font-size: 0.7rem; color: #666;
    }
    .header .top .t-2{
        font-size: 0.6rem; color: #ccc;
    }
    .header .top .t-3{
        font-size: 0.6rem; color: #438cff;
    }
    .header .bott{
        width: 100%; height: 3.25rem; line-height: 3.25rem; overflow: hidden;
    }
    .header .bott .bo-1{
        line-height: 1.5rem; height: 1.5rem; width: 5rem; font-size: 0.7rem; color: #438cff; text-align: center;
        border: 1px solid #438cff; border-radius: 0.4rem; margin-top: 0.8rem;
    }

    .aside{
        width: 100%; text-align: center; font-size: 0.7rem; color: #999; margin-top: 6.85rem;
    }
</style>