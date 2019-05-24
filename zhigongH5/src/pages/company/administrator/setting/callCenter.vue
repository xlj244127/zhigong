<template>
    <div data-page="callCenter" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">客服中心</div>
            </div>
        </div>
        <div class="page-content">
            <div class="port">
                <div class="nav"><img src="../../../../../static/img/nav_one.png"/></div>
                <div class="cent">
                    <div class="c-1">电话: &nbsp;  13528889460 (余先生)</div>
                    <div class="c-1">电话: &nbsp;  18128098672 (林先生)</div>
                    <div class="c-1">微信: &nbsp;  Yu13528889460 (余先生)</div>
                    <div class="c-1">微信: &nbsp;  allworld95 (林先生)</div>
                </div>
                <div class="foot">
                    <div class="f-1">智工通微信公众号</div>
                    <div class="f-2">
                        <img src="../../../../../static/img/kefuzhognxinerweima.jpg"/>
                    </div>
                    <div class="f-3">
                        <span>长按识别二维码</span> <br/> <span>关注智工通微信公众号</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{

            }
        },
        methods:{

        },
        mounted(){

        }
    }
</script>

<style scoped>
.navbar .left{
    width: 1.5rem; height: 1.5rem;
}
.page-content{
    width: 100%; height: 100%; background: #fff;
}
.port{
    width: 100%; height: 100%; box-sizing: border-box; padding: 0 0.7rem; overflow: hidden;
}
.port .nav{
    box-sizing: border-box; width: 100%; height: 11rem; border-radius: 0.25rem; overflow: hidden; margin: 0.5rem 0 0.9rem 0;
}
.port .nav img{
    width: 100%; height: 100%;
}
.port .cent{
    box-sizing: border-box; padding: 0 0.7rem; border: 1px solid #ccc; border-radius: 0.25rem;
}
.port .cent .c-1{
    width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #ccc;
}
.port .cent .c-1:last-of-type{
    border-bottom: none;
}
.port .foot{
    width: 5.8rem; text-align: center; margin: 0 auto; margin-top: 1.5rem;
}
.port .foot .f-1{
    font-size: 0.6rem; color: #363636;
}
.port .foot .f-2{
    width: 5.7rem; height: 5.8rem; border: 1px solid #438CFF; border-radius: 0.15rem; overflow: hidden;
}
.port .foot .f-2 img{
    width: 5.7rem; height: 5.8rem; display: inline;
}
.port .foot .f-3{
    font-size: 0.45rem; color: #666666;
}
</style>