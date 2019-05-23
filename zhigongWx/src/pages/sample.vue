<template>
    <div data-page="sample" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">身份证示例图</div>
            </div>
        </div>
        <div class="page-content">
            <div class="content-inner">
                <img src="../../static/img/img_demo_pros.png" />
                <img src="../../static/img/img_demo_cons.png" />
            </div>
            <p class="text">将相应的框对准身份证，点击拍照即可</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: ""
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4; text-align: center;
    }
    .content-inner{
        width: 100%; background: #fff;  box-sizing: border-box; padding: 1.5rem 0 1rem 3.8rem;
    }
    .content-inner img{
        width: 11.25rem; height: 7.15rem; margin-top: 1.5rem; display: block;
    }
    .text{
        font-size: 0.7rem; color: #aaa;
    }
</style>