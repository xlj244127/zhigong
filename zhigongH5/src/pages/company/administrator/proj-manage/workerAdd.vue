<template>
    <div data-page="phoneAdd" class="page navbar-fixed toolbar-fixed">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">
                    <span>添加班组工人</span>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                <span class="h-1">搜索手机号码添加</span>
            </div>
            <div class="ipt">
                <input v-model="mobile" placeholder="请输入手机号码" type="tel"/>
                <button class="sub" @click="confirmAction">搜索</button>
                <img src="../../../../../static/img/icon_search.png"/>
            </div>

            <div class="aside" v-if="isShow == -1">
                <div class="tst">搜索结果</div>
                <div class='ali' v-if="this.code==0">
                    <div class="a2"><img :src="this.personInfo.avatar" /></div>
                    <div class="a3">
                        <div><span class="a3-1">{{(personInfo.name?personInfo.name:personInfo.nickname)?(personInfo.name?personInfo.name:personInfo.nickname):personInfo.mobile}}</span>
                            <span v-if="this.isBlack==true" class="a3-3">黑名单人员</span>
                            <br/>
                            <span class="a3-2">{{this.personInfo.mobile}}</span>
                        </div>
                        <div class="fr">
                            <input class="add" id="picker-device" @click.stop.prevent="addAction" value="添加" readonly/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { userApi } from '../../../../api'
    import { projectApi } from '../../../../api'
    import { companyApi } from '../../../../api'
    import { groupApi } from '../../../../api'
    import { tabulateStatisticsApi } from '../../../../api'
    import { blackListApi } from '../../../../api'
    var $$ = Dom7;
    var pickerDevice;
    var groupDeviceHave;
    var groupDeviceNo;
    var infoGroupNo;
    var projectId;
    var workerLevel=[{level:3,value:"大工"},{level:4,value:"小工"}]
    export default {
        data(){
            return{
                isShow: 1,
                role: '',
                levelId: '',
                userIds: '',
                mobile: '',
                personInfo: [],
                code: '2',
                isBlack: '',
                companyId: '',
                workRole:'',
                workType:'',
                type:""
            }
        },
        methods:{
            confirmAction(){
                this.isShow = -1;
                userApi.searchUser(this.companyId, this.mobile).then((result)=>{
                    this.personInfo = result.data.list[0];
                    this.userIds = result.data.list[0].id;
                    this.workType = result.data.list[0].workType;
                    this.code = result.code;
                    this.isBlack = result.data.list[0].isBlack;
                    console.log('searchUser result',result.data);
                    console.log(this.isBlack);
                },(result)=>{
                    this.code = result.code;
                });
            },
            addAction(){
                let that = this;
                //没有项目id就缓存数据，有项目id就添加到接口
                groupDeviceHave.open();   //项目管理员添加工人，工人已有工种
            },

        },
        beforeMount(){
            this.projectId = this.$route.params.projectId;
            this.groupId = this.$route.params.groupId;
            this.type = this.$route.params.workType;
        },
        mounted(){
            console.log("this.workType mounted",this.workType);
    //企业版身份添加工人

            groupDeviceHave = this.$f7.picker({              //工人有工种的时候
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
                '<div class="center">请选择大小工</div>'+
                '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                '</div>' +
                '</div>',
                onChange: () => {
                    $$('#btnOk').off('click').click(() => {
                        this.levelId = groupDeviceHave.cols[0].value;
                        console.log('班组id', this.groupId,this.levelId);

                        console.log(this.type);
                        if (this.isBack == true) {
                            groupApi.projAddWorker( this.type, this.userIds, this.groupId).then((result) => {     //添加工人到班组
                                console.log('我添加了工人工种');
                                console.log(result);

                                projectApi.addWorkerToprojGroup(this.projectId, this.levelId, this.userIds, this.groupId, this.type).then((result) => { //添加工人到项目
                                    console.log('我把工人添加到项目');
                                    console.log(result);

                                    blackListApi.addProjToBlackList(this.projectId, this.userIds).then((result) => {  //添加项目到黑名单
                                        console.log('我把这个项目添加到了黑名单管理', result);
                                        this.$router.back();
                                    })
                                })
                            })
                        } else {
                            groupApi.projAddWorker(this.type, this.userIds, this.groupId).then((result) => {     //添加工人到班组
                                console.log('我添加了工人工种');
                                console.log(result);

                                projectApi.addWorkerToprojGroup(this.projectId, this.levelId, this.userIds, this.groupId, this.type).then((result) => { //添加工人到项目
                                    console.log('我把工人添加到项目');
                                    console.log(result);
                                    this.$router.back();
                                })
                            })
                        }
                    })
                },
                cols: [
                    {
                        textAlign: 'left',
                        values: workerLevel.map((one) => {
                            return one.level
                        }),
                        displayValues: workerLevel.map((one) => {
                            return one.value
                        })
                    }
                ]
            });

        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .header{
        box-sizing: border-box; padding: 1rem 0 0.5rem 0.6rem;
    }
    .header .h-1{
        font-size: 0.7rem; color: #999;
    }
    .ipt{
        width: 100%; height: 2.5rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem; display: flex;
        justify-content: space-between; position: relative;
    }
    .ipt input{
        flex: 1;  margin-left: 1.25rem; border: none;
    }
    .ipt .sub{
        width: 2.7rem; height: 1.5rem; line-height: 1.5rem; border-radius: 0.3rem; margin-top: 0.5rem; color: #fff; background: #438cff;
        border:  none;
    }
    .ipt img{
        width: 0.9rem; height: 0.9rem; position: absolute; left: 0.6rem; top: 0.8rem;
    }
    .aside{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-top: 1rem;
    }
    .aside .tst{
        width: 100%; height: 2rem; border-bottom: 1px solid #f4f4f4; font-size: 0.7rem; line-height: 2rem; color: #999;
    }
    .aside .ali{
        width: 100%; height: 3.25rem; display: flex; box-sizing: border-box; padding-left: 0.6rem;
    }
    .aside .ali .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .aside .ali .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .aside .ali .a3{
        flex: 1; padding: 0.8rem 0 0 0.75rem; display: flex; justify-content: space-between;
    }
    .aside .ali .a3 .add{
        width: 3rem; height: 1.5rem; line-height: 1.5rem; border-radius: 0.4rem; color: #fff; background: #438cff; text-align: center;
    }
    .aside .ali .a3 .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .aside .ali .a3 .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .aside .ali .a3 .a3-3{
        font-size: 0.45rem; color: #fff; background: #FF0000; box-sizing: border-box; padding: 1px 0.5rem; border-radius: 0.5rem;
    }
    .aside .ali .a3 .a4-1{
        font-size: 0.8rem; color: #999; padding-top: 0.2rem;
    }


    .aside .list li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #ccc; box-sizing: border-box; padding: 0 0.6rem; position: relative;
    }
    .aside .list li a{
        width: 100%; height: 100%; display: block; font-size: 0.8rem; color: #438cff;
    }
    .aside .list li a img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.6rem; top: 0.8rem;
    }
</style>