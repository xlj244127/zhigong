<template>
    <div data-page="projMannagerDetail" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">项目管理员详情</div>
            </div>
        </div>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="header">
                <div class="logo">
                    <img :src="projerDetail.avatar"/>
                    <div class="recordBox">
                        <img src="../../../../../static/img/face_recorded.png" alt="" class="record" v-if="!record">
                        <img src="../../../../../static/img/face_unrecord.png" alt="" class="record" v-else>
                    </div>

                </div>
                <div class="tst">
                    <span>{{(projerDetail.name?projerDetail.name:projerDetail.nickname)?(projerDetail.name?projerDetail.name:projerDetail.nickname):projerDetail.mobile}}</span>
                </div>
                <img src="../../../../../static/img/unreal_name.png" alt="" v-if="!realName" class="realname">
                <img src="../../../../../static/img/real_name.png" alt="" v-else class="realname">
            </div>
            <div class="main">
                <ul class="aul">
                    <li>联系电话: <span>{{projerDetail.mobile}}</span></li>
                    <li>身份证号码: <span>{{toNull(idNumber)}}</span></li>
                    <li>项目: <span>{{projerDetail.projectName}}</span></li>
                    <!--<li>部门: <span>人力资源部</span></li>
                    <li>职务: <span>仓库管理员</span></li>
                    <li>权限: <span>考勤规则，考勤审批</span></li>-->
                </ul>
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
                projerDetail: {},
                record:true,
                realName:true,
                idNumber:'',
            }
        },
        methods:{
            toNull(val){
                if(val==""||val==undefined || val==null){
                    return "--"
                }  else {
                    return val
                }
            },
        },
        mounted(){
            userId = this.$route.params.id;
            userApi.userDetail(userId).then((result)=>{
                console.log('用户详情');
                console.log('projerDetail',result);
                this.projerDetail = result.data;
                this.projerDetail.projectName = this.$store.state.projectName
                if(this.projerDetail.userDetail.idNumber){
                    this.realName = true
                    this.idNumber = this.projerDetail.userDetail.idNumber
                }else{
                    this.realName = false
                }
                if(this.projerDetail.userDetail.idPhotoFront){
                    this.record = true
                }else{
                    this.record = false
                }
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
        padding-bottom: 15px;
    }
    .header .logo{
        width: 3rem; height: 3rem;
        border: 1px solid #666; border-radius: 50%; margin: 0 auto; margin-top: 1.1rem;
        position: relative;
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
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .header .logo .recordBox{
        position: absolute;
        top: 6px;
        left:90%;
        width: 60px;
    }
    .header .logo .recordBox img{
        width: 60px;
    }
    .realname{
        display: block;
        margin: 10px auto 0;
        height: 12px;
    }
</style>