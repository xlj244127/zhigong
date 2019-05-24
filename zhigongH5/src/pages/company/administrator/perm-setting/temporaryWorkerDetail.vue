<template>
    <div data-page="temporaryWorkerDetail" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">临时工详情</div>
            </div>
        </div>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="header">
                <div class="logo"><img :src="this.temporaryWorkerDetail.avatar"/></div>
                <div class="tst"><span>{{(temporaryWorkerDetail.name?temporaryWorkerDetail.name:temporaryWorkerDetail.nickname)?(temporaryWorkerDetail.name?temporaryWorkerDetail.name:temporaryWorkerDetail.nickname):temporaryWorkerDetail.mobile}}</span> <img class="oneImg" src="../../../../../static/img/label_woman.png"/></div>
            </div>
            <div class="main">
                <ul class="aul">
                    <li>{{temporaryWorkerDetail.projectName}}</li>
                    <li>联系电话: <span>{{temporaryWorkerDetail.mobile}}</span></li>
                    <li>联系邮箱: <span>{{temporaryWorkerDetail.email}}</span></li>
                    <li>关联微信账号: <span>{{temporaryWorkerDetail.wxOpenid==''?'未关联':'已关联'}}</span></li>
                </ul>
            </div>
            <div class="footer" @click="lookAction">
                <a>
                    查看身份证信息
                    <img class="twoImg" src="../../../../../static/img/btn_right.png"/>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import { userApi } from '../../../../api'
    var userId;
    export default {
        data(){
            return{
                temporaryWorkerDetail: {}
            }
        },
        methods:{
            lookAction(){
                this.$router.load({url: '/company/lookIdentityCard/'+userId});
            }
        },
        mounted(){
            userId = this.$route.params.id;
            userApi.userDetail(userId).then((result)=>{
                console.log('用户详情');
                console.log(result);
                this.temporaryWorkerDetail = result.data;
            })
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .header{
        width: 100%; height: 6.75rem; background: #fff; text-align: center; overflow: hidden;
    }
    .header .logo{
        border: 1px solid #666; border-radius: 50%; margin: 0 auto; margin-top: 1.1rem;
        width: 3rem; height: 3rem;
        overflow: hidden;
    }
    .header .logo>img{
        width: 100%; height: 100%; border-radius: 50%;
    }
    .header .tst{
        font-size: 0.7rem; padding-top: 0.6rem;
    }
    .header .tst .oneImg{
        width: 0.75rem; height: 0.75rem; display: inline;
    }

    .main{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-top: 0.5rem;
    }
    .main .aul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
    }

    .footer{
        width: 100%; height: 2.5rem; line-height: 2.5rem; background: #fff; margin-top: 0.5rem; box-sizing: border-box;
        padding: 0 0.6rem; position: relative;
    }
    .footer .twoImg{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.6rem; top: 0.8rem;
    }
    .footer a{
        width: 100%; height: 100%; display: inline-block; font-size: 0.7rem; color: #666;
    }
</style>