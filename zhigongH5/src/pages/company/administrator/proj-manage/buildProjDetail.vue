<template>
    <div data-page="buildProjDetail" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">项目详情</div>
                <div class="right">
                    <a href="#" data-popover=".popover-links" class="link open-popover">
                        <img class="r-img" src="../../../../../static/img/shezhi-icon.png"/>
                    </a>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class='head'>{{this.projectName}}</div>
            <div class="box">
                <ul class="aul">
                    <li>项目所在地: <span>{{this.projectInfo.location}}</span><span>{{this.projectInfo.address}}</span></li>
                    <li>项目创建时间: <span>{{new Date(this.projectInfo.startTime).getFullYear()}}-{{new Date(this.projectInfo.startTime).getMonth()+1}}-{{new Date(this.projectInfo.startTime).getDate()}}</span></li>
                    <li>项目已历时:
                        <span v-if="existYear>0">{{ existYear }}年</span>
                        <span v-if="existMonth>0">{{ existMonth }}月</span>
                        <span >{{ existDay }}天</span>
                    </li>
                </ul>
            </div>

            <div class="box">
                <div class="sum">
                    <span>项目成员</span> &nbsp;
                    <span class="s-1">(总共{{this.projectInfo.userCount}}人)</span>
                </div>
                <ul class="cont">
                    <li>
                        <a>
                            <div class="up">
                                <img class="u-1" src="../../../../../static/img/guanliyuan.png"/>
                                <div class="left">
                                    <div class="ming-3">项目管理员</div>
                                    <div class="ming-4">{{this.projectInfo.adminCount}}人</div>
                                </div>
                            </div>
                            <div class="down">
                                <img @click="addProjer" class="down-1" src="../../../../../static/img/tianjia-1.png"/>
                                <img @click="lookProjerList" class="down-2" src="../../../../../static/img/chakan.png"/>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a>
                            <div class="up">
                                <img class="u-1" src="../../../../../static/img/xiangmubanzu.png"/>
                                <div class="left">
                                    <div class="ming-3">项目班组</div>
                                    <div class="ming-4">{{this.projectInfo.groupCount}}个班组，{{this.projectInfo.groupUserCount}}人</div>
                                </div>
                            </div>
                            <div class="down">
                                <img @click="addGrouper" class="down-3" src="../../../../../static/img/tianjia-2.png"/>
                                <img @click="addWorker" class="down-4" src="../../../../../static/img/tianjia-3.png"/>
                                <img @click="lookgroup" class="down-2" src="../../../../../static/img/chakan.png"/>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a>
                            <div class="up">
                                <img class="u-1" src="../../../../../static/img/linshigong.png"/>
                                <div class="left">
                                    <div class="ming-3">项目临时人员</div>
                                    <div class="ming-4">{{this.projectInfo.tempCount}}人</div>
                                </div>
                            </div>
                            <div class="down">
                                <img @click="addTemper" class="down-5" src="../../../../../static/img/tianjia-4.png"/>
                                <img @click="lookTemper" class="down-2" src="../../../../../static/img/chakan.png"/>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="box box2">
                <ul class="cont">
                    <li @click="enterDayAttend">
                        <a>
                            <div class="left">项目考勤</div>
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                    <li @click="enterinfoEntering">
                        <a>
                            <div class="left">信息录入</div>
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                </ul>
            </div>

            <!--右上角设置按钮-->
            <div class="popover popover-links">
                <div class="popover-angle"></div>
                <div class="popover-inner">
                    <div class="list-block">
                        <ul>
                            <li @click="editProj"><a href="#" class="list-button item-link">编辑项目</a></li>
                            <li @click="dleProj"><a href="#" class="list-button item-link">删除项目</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { projectApi } from '../../../../api'
    var projectId;
    export default {
        data(){
            return{
                projectInfo: {},
                existYear:'',
                existMonth:'',
                existDay:'',
                projectName: ''
            }
        },
        methods:{
            back(){
                projectApi.projectDetail(projectId).then((result)=>{
                    console.log(result);
                    this.projectInfo = result.data;
                });
            },
            addProjer(){
                this.$router.load({url: '/company/phoneAdd/'+projectId+'/'+1});
            },
            lookProjerList(){
                this.$router.load({url: '/company/projManagerList/'+projectId});
            },
            addGrouper(){
                this.$router.load({url: '/company/phoneAdd/'+projectId+'/'+2});
            },
            addWorker(){
                this.$router.load({url: '/company/phoneAdd/'+projectId+'/'+4});
            },
            lookgroup(){
                this.$router.load({url: '/company/projGroupsList/'+projectId});
            },
            addTemper(){
                this.$router.load({url: '/company/phoneAdd/'+projectId+'/'+3});
            },
            lookTemper(){
                this.$router.load({url: '/company/temporaryWorkerList/'+projectId});
            },

            editProj(){
                this.$f7.closeModal();
                this.$router.load({url: '/company/createProject/'+projectId+'/'+3});
            },
            enterDayAttend(){
                this.$router.load({url: '/company/projDayAttend/'+projectId});
                this.$store.state.projectId = projectId;
            },
            enterinfoEntering(){
                this.$router.load({url: '/company/groupInfoEnteringList/'+projectId+'/'+this.projectName});
            },
            dleProj(){
                //删除项目
                this.$f7.closeModal();
                let that = this;
                this.$f7.confirm('是否确认删除该项目?', '', function (){
                    projectApi.delProj(projectId).then((result)=>{
                        console.log(result);
                        that.$router.load({url: '/company/projectManage/'});
                    });
                })
            }
        },
        mounted(){
            projectId = this.$route.params.id;
            console.log(projectId);
            projectApi.projectDetail(projectId).then((result)=>{
                console.log('项目详情');
                console.log(result);
                this.projectInfo = result.data;
                this.projectName = result.data.name;
                this.$store.state.projectName = result.data.name;
                this.existYear=new Date(Date.parse(new Date())-this.projectInfo.startTime).getFullYear()-1970;
                this.existMonth=new Date(Date.parse(new Date())-this.projectInfo.startTime).getMonth();
                this.existDay =new Date(Date.parse(new Date())-this.projectInfo.startTime).getDate()-1;
                let existTime= Date.parse(new Date())-this.projectInfo.startTime;
                if(existTime<=0){
                    this.existYear=0;
                    this.existMonth=0;
                    this.existDay =0;
                }else{
                    this.existDay=new Date(Date.parse(new Date())-this.projectInfo.startTime).getDate()-1 ;
                }
            });

        }
    }
</script>

<style scoped>
    .popover {
        width: 10rem;
    }
    .navbar .right .r-img{
        width: 1.5rem; height: 1.5rem;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .head{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #438cff; border-bottom: 1px solid #f4f4f4;
        background: #fff; margin-bottom: 0.5rem; box-sizing: border-box; padding-left: 0.6rem;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .box{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
        margin-top: 0.5rem;
    }
    .box .aul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .sum{
        width: 100%; height: 2.5rem; line-height: 2.5rem; box-sizing: border-box; padding-left: 0.6rem; background: #ffffff; font-size: 0.7rem;
        color: #666; margin-top: 0.5rem; border-bottom: 1px solid #f4f4f4;
    }
    .sum .s-1{
        color: #999;
    }
    .box .cont li{
        width: 100%; font-size: 0.7rem; color: #666;  border-bottom: 1px solid #f4f4f4;
        overflow: hidden;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .box .cont li a{
        width: 100%; height: 100%; justify-content: space-between; position: relative; font-size: 0.7rem;
    }
    .box .cont li a .up{
        width: 100%; height: 2.5rem; display: flex; justify-content: space-between; line-height: 2.5rem;
    }
    .box .cont li a .down{
        width: 100%; height: 2.75rem; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0.4rem 1rem;
    }
    .box .cont li a .down .down-1{
        width: 6rem; height: 1.5rem;
    }
    .box .cont li a .down .down-2{
        width: 3.7rem; height: 1.5rem;
    }
    .box .cont li a .down .down-3, .down-4{
        width: 4rem; height: 1.5rem;
    }
    .box .cont li a .down .down-5{
        width: 4.8rem; height: 1.5rem;
    }
    .box .cont li a .up .u-1{
        width: 1.5rem; height: 1.5rem; display: inline-block; margin-top: 0.3rem;
    }
    .box .cont li a .up .left{
        flex: 1; display: flex; justify-content: space-between;  font-size: 0.7rem; color: #438cff;
    }

    .box2 .cont a{
        position: relative; display: flex;
    }
    .box2 .cont a .left{
        height: 2.5rem; line-height: 2.5rem;
    }
    .box2 .cont a img{
        width: 0.9rem; height: 0.9rem; margin-top: 0.8rem;
    }
</style>