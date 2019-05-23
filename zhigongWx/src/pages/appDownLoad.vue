<template>
    <div data-page="appDownLoad" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="center">app下载</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <img class="i-1" src="../../static/img/downLoad.png"/>
                <img class="i-2" src="../../static/img/downLoadErWeiMa.png"/>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data(){
            return{

            }
        },
        methods:{

        }
    }
</script>
<style scoped>
    .page-on-left{
        transform: translate3d(0,0,0);  -webkit-transform: translate3d(0,0,0);
    }
    .page-content{
        width: 100%; height: 100%;
    }
    .main{
        position: relative;
    }
    .i-1{
        width: 100%; height: 100%; display: inline;
    }
    .i-2{
        width: 5rem; height: 5rem; position: absolute; left: 138px; top: 117px;
    }
</style>