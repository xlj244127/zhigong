<template>
    <div data-page="projManage" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">项目管理</div>
                <div class="right" @click="enterSetProj">
                    <a>设置项目</a>
                </div>
            </div>
        </div>
        <!---侧边栏--->
        <proj-admin></proj-admin>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="boot">

                <div class="ipt" @click.stop.prevent="selectAction">
                    <span v-if="this.projName.length>20">{{this.projName.substr(0,20)}}...</span>
                    <span v-else>{{this.projName}}</span>
                    <img class="i-img" src="../../../../static/img/btn_drop_down.png"/>
                    <input type="text" readonly id="picker-device">
                </div>

                <ul class="aul">
                    <li>项目所在地: <span>{{this.projDetail.location}}{{this.projDetail.address}}</span></li>
                    <li>项目创建时间: <span>{{new Date(this.projDetail.startTime).getFullYear()}}-{{new Date(this.projDetail.startTime).getMonth()+1}}-{{new Date(this.projDetail.startTime).getDate()}}</span></li>
                    <li>项目已历时:  <span v-if="existYear>0">{{ existYear }}年</span>
                        <span v-if="existMonth>0">{{ existMonth }}月</span>
                        <span >{{ existDay }}天</span></li>
                </ul>
            </div>
            <div class="box">
                <div class="sum">
                    <span>项目成员</span> &nbsp;
                    <span class="s-1">(总共{{this.projDetail.userCount}}人)</span>
                </div>
                <ul class="cont">
                    <li>
                        <a>
                            <div class="up">
                                <img class="u-1" src="../../../../static/img/guanliyuan.png"/>
                                <div class="left">
                                    <div class="ming-3">项目管理员</div>
                                    <div class="ming-4">{{this.projDetail.adminCount}}人</div>
                                </div>
                            </div>
                            <div class="down">
                                <img @click="addProjer" class="down-1" src="../../../../static/img/tianjia-1.png"/>
                                <img @click="lookProjerList" class="down-2" src="../../../../static/img/chakan.png"/>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a>
                            <div class="up">
                                <img class="u-1" src="../../../../static/img/xiangmubanzu.png"/>
                                <div class="left">
                                    <div class="ming-3">项目班组</div>
                                    <div class="ming-4">{{this.projDetail.groupCount}}个班组，{{this.projDetail.groupUserCount}}人</div>
                                </div>
                            </div>
                            <div class="down">
                                <img @click="addGrouper" class="down-3" src="../../../../static/img/tianjia-2.png"/>
                                <img @click="addWorker" class="down-4" src="../../../../static/img/tianjia-3.png"/>
                                <img @click="lookgroup" class="down-2" src="../../../../static/img/chakan.png"/>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a>
                            <div class="up">
                                <img class="u-1" src="../../../../static/img/linshigong.png"/>
                                <div class="left">
                                    <div class="ming-3">项目临时人员</div>
                                    <div class="ming-4">{{this.projDetail.tempCount}}人</div>
                                </div>
                            </div>
                            <div class="down">
                                <img @click="addTemper" class="down-5" src="../../../../static/img/tianjia-4.png"/>
                                <img @click="lookTemper" class="down-2" src="../../../../static/img/chakan.png"/>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="box box2">
                <ul class="cont">
                    <li @click="enterProjDayAttend">
                        <a>
                            <div class="left">查看项目考勤</div>
                        </a>
                    </li>
                    <li @click="enterinfoEntering">
                        <a>
                            <div class="left">查看信息录入</div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { projectApi } from '../../../api'
    import projAdmin from '../../../components/broadside-navigation/projAdmin'
    var pickerDevice;
    var projectId;
    export default {
        name: "attend-approve",
        data(){
            return{
                projDetail: {},
                projList: [],
                existYear:'',
                existMonth:'',
                existDay:'',
                projName: ''
            }
        },
        components: {
            projAdmin
        },
        methods:{
            back(){
                console.log('我请求了项目详情');
                projectApi.projectDetail(projectId).then((result)=>{
                    console.log('我获取到了项目详情');
                    console.log("projDetail",result.data);
                    this.projDetail = result.data;
                    this.projName = result.data.name;
                    this.$store.state.projDetail = result.data;
                })
            },

            enterSetProj(){
                this.$router.load({url: '/project/setProj/'+projectId});
            },
            selectAction(){
                pickerDevice.open();
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
            enterProjDayAttend(){
                this.$router.load({url: '/company/projDayAttend/'+projectId})
            },
            enterinfoEntering(){
                this.$router.load({url: '/company/groupInfoEnteringList/'+projectId+'/'+this.projName});
            },
            lastTime(existTime){
                this.existYear=new Date(existTime).getFullYear()-1970;
                this.existMonth=new Date(existTime).getMonth();
                this.existDay =new Date(existTime).getDate()-1;
                if(existTime<=0){
                    this.existYear=0;
                    this.existMonth=0;
                    this.existDay =0;
                }else{
                    this.existDay=new Date(Date.parse(new Date())-this.projDetail.startTime).getDate()-1;
                }
            }

        },
        mounted(){
            projectId = this.$store.state.roleInfo.projectId;
            console.log(projectId);
            projectApi.projectDetail(projectId).then((result)=>{
                console.log('我获取到了项目详情');
                console.log("projDetail",result.data);
                this.projDetail = result.data;
                this.projName = result.data.name;
                this.$store.state.projDetail = result.data;
                let existTime= Date.parse(new Date())-this.projDetail.startTime;
                this.lastTime(existTime)
                console.log(new Date(existTime),this.existYear,this.existMonth,this.existDay);
            })
            projectApi.projerProjList().then((result)=>{
                console.log('项目列表');
                console.log(result);
                this.projList = result.data;

                pickerDevice = this.$f7.picker({
                    input: '#picker-device',
                    formatValue(p, values, displayValues) {
                        return displayValues;
                    },
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onOpen:  (p)=>{
                        p.container.find('#btnOk').click(()=>{
                            console.log(pickerDevice.cols[0].value);
                            projectApi.projectDetail(pickerDevice.cols[0].value).then((result)=>{
                                console.log('我重新获取了项目详情');
                                console.log(result);
                                this.projDetail = result.data;
                                this.projName = result.data.name;
                                this.$store.state.projDetail = result.data;
                                projectId = result.data.id;
                                this.$store.state.roleInfo.projectId = projectId;
                                let changeExist= Date.parse(new Date())-this.$store.state.projDetail.startTime;
                                console.log(this.$store.state.projDetail);
                                this.lastTime(changeExist);

                            })
                        });
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.projList.map((project)=>{return project.id}),
                            displayValues: this.projList.map((project)=>{return project.name})
                        }
                    ]
                });
            })
        },

    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .right{
        font-size: 0.7rem;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }

    .boot .ipt{
        width: 100%; height: 2rem; line-height: 2rem; position: relative; box-sizing: border-box; padding: 0 0.6rem; background: #fff; text-align: center;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .boot .ipt #picker-device{
        position: absolute;  left: 0;  right: 0;  top: 0;  bottom: 0; opacity: 0;
    }

    .boot .ipt .i-img{
        width: 0.6rem; height: 0.6rem; display: inline;
    }
    .boot .aul{
        background: #fff; margin-top: 0.5rem;
    }
    .boot .aul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; box-sizing: border-box; padding: 0 0.6rem;
        white-space: nowrap;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .head{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #438cff; border-bottom: 1px solid #f4f4f4;
        background: #fff; margin-bottom: 0.5rem; box-sizing: border-box; padding-left: 0.6rem;
    }
    .box{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
        margin-top: 0.5rem;
    }
    .box .aul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
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

    .box2 .cont a .left{
        height: 2.5rem; line-height: 2.5rem;
    }
</style>