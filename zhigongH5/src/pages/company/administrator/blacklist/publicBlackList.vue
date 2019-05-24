<template>
    <div data-page="publicBlackList" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">公共黑名单</div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                <div class="h1">
                    <span class="h-1">公共黑名单总数</span>
                    <br/>
                    <span class="h-2">{{publicBlackList.publicNum}}人</span>
                </div>
                <div class="h2">公共黑名单: 被其他企业列入黑名单的人员</div>
            </div>
            <ul class="aul">
                <li>
                    <div class="box">
                        <img src="../../../../../static/img/blacklist_eryi.png"/>
                        <br/>
                        <span class="b-1">恶意讨薪</span>
                        <br/>
                        <span class="b-2">{{publicBlackList.publicWarnA1}}人</span>
                    </div>
                    <div class="box">
                        <img src="../../../../../static/img/blacklist_daoqie.png"/>
                        <br/>
                        <span class="b-1">盗窃</span>
                        <br/>
                        <span class="b-2">{{publicBlackList.publicWarnA3}}人</span>
                    </div>
                </li>
                <li>
                    <div class="box">
                        <img src="../../../../../static/img/blacklist_dajia.png"/>
                        <br/>
                        <span class="b-1">打架闹事</span>
                        <br/>
                        <span class="b-2">{{publicBlackList.publicWarnA2}}人</span>
                    </div>
                    <div class="box">
                        <img src="../../../../../static/img/blacklist_zaitao.png"/>
                        <br/>
                        <span class="b-1">在逃人员</span>
                        <br/>
                        <span class="b-2">{{publicBlackList.publicWarnA5}}人</span>
                    </div>
                </li>
                <li>
                    <div class="box">
                        <img src="../../../../../static/img/blacklist_bohuai.png"/>
                        <br/>
                        <span class="b-1">破坏损坏</span>
                        <br/>
                        <span class="b-2">{{publicBlackList.publicWarnA4}}人</span>
                    </div>
                    <div class="box">
                        <img src="../../../../../static/img/blacklist_qita.png"/>
                        <br/>
                        <span class="b-1">其他</span>
                        <br/>
                        <span class="b-2">{{publicBlackList.publicWarnA6}}人</span>
                    </div>
                </li>
            </ul>
            <div class="footer">
                <span>温馨提示:</span>
                <br/>
                <span>付费提示功能后续开通,敬请期待</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { blackListApi } from '../../../../api'
    export default {
        data(){
            return{
                publicBlackList: ''
            }
        },
        created(){
            this.companyId = this.$store.state.roleInfo.companyId;
            blackListApi.blackListStat(this.companyId).then((result)=>{
                console.log('企业管理员黑名单统计2',result);
                this.publicBlackList = result.data;
            })
        }
    }
</script>

<style scoped>
.page-content{
    width: 100%; height: 100%; background: #f4f4f4;
}
.header{
    width: 100%; height: 5.25rem; background: #fff; position: relative; overflow: hidden;
}
.header .h1{
    text-align: center; margin-top: 1.25rem;
}
.header .h1 .h-1{
    font-size: 0.65rem; color: #666;
}
.header .h1 .h-2{
    font-size: 1.15rem; color: #438CFF;
}
.header .h2{
    position: absolute; right: 0.6rem; bottom: 0.05rem; font-size: 0.4rem; color: #999;
}
    .aul{
        margin-top: 0.25rem; box-sizing: border-box; padding: 0.5rem 1.2rem; background: #fff;
    }
    .aul li{
        display: flex; justify-content: space-between; margin-top: 1rem;
    }
.aul li:first-of-type{
    margin-top: 0;
}
.aul li .box{
    width: 7.5rem; height: 5.5rem; border: 1px solid #C9C5C5; text-align: center; color: #666;
}
.aul li .box img{
    width: 1.5rem; height: 1.5rem; margin-top: 1rem;
}
.aul li .box .b-1{
    font-size: 0.7rem;
}
.aul li .box .b-2{
    font-size: 0.75rem;
}
    .footer{
        width: 100%; text-align: center; margin-top: 0.35rem; font-size: 0.7rem; color: #999;
    }
</style>