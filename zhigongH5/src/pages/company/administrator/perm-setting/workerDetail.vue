<template>
    <div data-page="workerDetail" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">工人详情</div>
            </div>
        </div>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="header">
                <div class="logo">
                    <img :src="projerDetail.avatar"/>
                    <div class="recordBox">
                        <img src="../../../../../static/img/face_recorded.png" alt="" class="record" v-if="record">
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
                    <li>联系电话: &nbsp;<span>{{projerDetail.mobile}}</span></li>
                    <li>身份证号码: &nbsp;<span>{{idNumber}}</span></li>
                    <li><span class="a-1">项目:</span>&nbsp;<span class="a-2" v-if="projectList.length>0">{{projectList[0].name}}</span>&nbsp;<span v-show="projectList.length>1">等{{projectList.length}}个项目</span></li>
                    <li>工种类型: &nbsp;<span>{{workTypes}}</span></li>
                    <li>工人类型: &nbsp;{{workerType}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { userApi } from '../../../../api'
    var userId,projectRole;
    export default {
        data(){
            return{
                projerDetail: {},
                workGroupLeader: {},
                record:true,
                realName:true,
                groupName:'',
                projectList:[],
                workTypes:"",
                comma:'',
                workerTypeLength:'',
                idNumber:'',
                workerType:'--'
            }
        },
        methods:{

        },
        mounted(){
            userId = this.$route.params.userId;
            projectRole = this.$route.params.projectRole;
            if(projectRole==3){
                this.workerType = "大工"
            }else{
                this.workerType = "小工"
            }
            userApi.userDetail(userId).then((result)=>{
                console.log('用户详情');
                console.log('projerDetail',result);
                this.projerDetail = result.data;
                if(result.data.userDetail.idNumber){
                    this.idNumber = result.data.userDetail.idNumber.substring(0, 3)+'***********'+result.data.userDetail.idNumber.substring(14, 18)
                    this.realName=true;
                }else {
                    this.idNumber ="--";
                    this.realName=false;
                }
                if(result.data.faced==0){
                    this.record= false
                }else{
                    this.record= true
                }
            })
            //workerDetail
            userApi.worker(userId).then((result)=>{
                console.log('worker',result.data.workTypes);
                this.projectList = result.data.projects
                this.workTypes = result.data.workTypes
                //this.workGroupLeader = result.data;
                this.comma = result.data.projects.length;
                //this.workerTypeLength = result.data.workerTypes.length;
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
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex;
    }
    .main .aul li .a-1{
        display: inline-block;
    }
    .main .aul li .a-2{
        max-width: 60%; display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
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