<template>
    <div data-page="addFocus" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">添加关注</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <img class="i-1" src="../../static/img/imgshaer_icom.png"/>
                <img class="i-2" src="../../static/img/shibieguanzhu.png"/>
                <img class="i-3" src="../../static/img/longdown_icom.png"/>
                <div class="i-4">关注智工通公众号</div>
            </div>
        </div>
        <div class="pick" v-show="isShow==1" @click="cancel2Action"></div>
        <div class="title" v-show="isShow==1">
            <img class="p" src="../../static/img/succeed_icom.png"/>
            <div class="p2">
                <span class="p2-1">操作成功!</span><br/>
                <span class="p2-2">关注智工通公众号，即可享受</span><br/>
                <span class="p2-3">免费招工找活</span>
            </div>
            <div class="p3" @click="cancelAction">
                ok
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data(){
            return{
                isShow: 1
            }
        },
        methods:{
            cancelAction(){
                this.isShow = 2;
            },
            cancel2Action(){
                this.isShow = 2;
            }
        },
        mounted(){
            setTimeout(()=>{
                this.isShow=2
            },4000)
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
        width: 4.7rem; height: 4.7rem; position: absolute; left: 7.05rem; top: 6.85rem;
    }
    .i-3{
        width: 4.75rem; height: 3.5rem; position: absolute; left: 13rem; top: 8.5rem;
    }
    .i-4{
        width: 100%; margin-top: 10px; text-align: center; font-size: 1rem; color: #1F3089; font-weight: 1000; position: absolute; left: 0; top: 0;
    }

    .pick{
        width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000; opacity: 0.5; z-index: 666;
    }
    .title{
        width: 234px; height: 258px; background: #fff; overflow: hidden; position: fixed; left: 20%; top: 27%; z-index: 10000;
    }
    .title .p{
        width: 77px; height: 60px; margin: 1rem auto; display: block;
    }
    .title .p2{
        margin-top: 1rem; text-align: center;
    }
    .title .p2 .p2-1{
        font-size: 0.9rem; color: #F87474;
    }
    .title .p2 .p2-2{
        font-size: 0.6rem; color: #666;
    }
    .title .p2 .p2-3{
        font-size: 0.6rem; color: #666; font-weight: 700;
    }
    .title .p3{
        width: 60px; height: 35px; text-align: center; line-height: 35px; border-radius: 2px; background: #FB9862; font-size: 1rem; color: #fff; margin: 1.2rem auto;
    }
</style>