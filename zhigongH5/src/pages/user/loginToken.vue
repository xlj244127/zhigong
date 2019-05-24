<template>
    <div data-page="loginToken" class="page navbar-fixed">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">电脑登陆</div>
            </div>
        </div>
        <div class="page-content">
            <div class="head">
                <img src="../.././../static/img/diannaodenglu.png"/>
            </div>
            <div class="top">智工通电脑端登录确认</div>
            <div class="confirm" @click="confirmAction">确认电脑登陆</div>
            <div class="cancel" @click="cancelAction">取消登陆</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { notifyApi } from '../../api'
    export default {
        data(){
            return{
                token: ''
            }
        },
        methods:{
            confirmAction(){
                notifyApi.queRenDengLu(this.token).then((result)=>{
                    console.log('========================',result);
                    this.$router.back();
                })
            },
            cancelAction(){
                notifyApi.quXiaoDengLu(this.token).then((result)=>{
                    console.log(result);
                    this.$router.back();
                })
            }
        },
        mounted(){
            this.token = this.$route.params.token;
            console.log(this.token);
            notifyApi.shaoMaoFaSong(this.token).then((result)=>{
                console.log(result);
            })
        }
    }
</script>

<style scoped>
.page-content{
    width: 100%; height: 100%; background: #f4f4f4;
}
.head{
    width: 11.15rem; height: 3.8rem; margin: 0 auto; margin-top: 5.4rem;
}
.head img{
    width: 100%; height: 100%;
}
.top{
    width: 100%; text-align: center; font-size: 0.9rem; color: #444; margin-top: 2.4rem;
}
.confirm{
    width: 90%; height: 2rem; line-height: 2rem; border: 1px solid #438CFF; border-radius: 1rem; background: #438CFF;
    font-size: 0.8rem; color: #fff; text-align: center; margin: 0 auto; margin-top: 9rem;
}
.cancel{
    width: 90%; height: 2rem; line-height: 2rem; border: 1px solid #D4D4D4; border-radius: 1rem; font-size: 0.8rem;
    color: #666666; text-align: center; margin: 0 auto; margin-top: 0.9rem;
}
</style>