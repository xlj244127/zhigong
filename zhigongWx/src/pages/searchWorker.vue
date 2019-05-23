<template>
    <div data-page="searchWorker" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">我发布的用工需求</div>
                <div class="right sliding" @click="operationAction">管理</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main" v-if="workGroupId!=0">
                <ul class="aul">
                    <li v-for="(item, index) in list" :data-id="item.id">
                        <div class="tipBox" v-show="index==0&&tipShow==true ">
                            <img class="searchTip" src="../../static/img/search_tip_2.png" alt="">
                            <img class="searchClose" src="../../static/img/search_tip_close.png" alt="" @click="closeTip">
                        </div>
                        <div class="top" v-show="isShow==true">
                            <div class="right" @click.stop.prevent="deleteAction(item)">
                                <img src="../../static/img/grayDelete_icom.png"/>
                            </div>
                            <div class="right right2" @click.stop.prevent="editAction(item)">
                                <img src="../../static/img/grayEdit_icom.png"/>
                            </div>
                        </div>
                        <div class="sit">
                            <div class="ent">
                                <img class="st" src="../../static/img/wendan.png"/>
                                <div class="st2">
                                    <div class="skew">
                                        <div class="skew-main">{{item.title?item.title:item.city.name+'招'+item.workTypeName}}</div>
                                    </div>
                                </div>
                                <img class="st3" src="../../static/img/shibianxin_icom.png"/>
                            </div>
                        </div>
                        <div class="a2">
                            <div class="a2-1">
                                <span class="wg">{{item.workGroup.name}}</span>
                                <img v-show="item.workGroup.user.userDetail.idNumber!==null" src="../../static/img/shareYishiming.png"/>
                                <img v-show="item.workGroup.memberCount>1" src="../../static/img/shareYirengzhen.png"/>
                                <span class="wg2" v-show="item.workGroup.memberCount>1">班组{{item.workGroup.memberCount}}人</span>
                            </div>
                            <!--<div class="a2-2">-->
                            <!--<img src="../../static/img/phone_icom.png"/>-->
                            <!--</div>-->
                        </div>
                        <div class="single">
                            <div class="up">
                                <div class="left">
                                    <img src="../../static/img/recruit_time_worker.png" v-if="item.demandType==1"/>
                                    <img src="../../static/img/recruit_contractor.png" v-else-if="item.demandType==2"/>
                                    <img src="../../static/img/recruit_group.png" v-else-if="item.demandType==3"/>
                                    <img src="../../static/img/recruit_worker.png" v-else-if="item.demandType==4"/>
                                    <img src="../../static/img/zhaogong.png" v-else/>
                                    <span>{{item.workTypeName}}</span>
                                </div>
                                <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{item.demandAmount}}</span>人</div>
                                <div class="left3">
                                    <span v-if="item.salaryType==1">{{item.salary}}元/天</span>
                                    <span v-else-if="item.salaryType==2">{{item.salary}}元/小时</span>
                                    <span v-else-if="item.salaryType==4">{{item.salary}}元/月</span>
                                    <span v-else-if="item.salaryType==5">{{item.salary}}元/平方</span>
                                    <span v-else>面议</span>
                                </div>
                            </div>
                            <div class="cent">
                                <div class="left"><span v-show="item.treatmentsName!=''" v-for="one in item.treatmentsName.split(',')">{{one}}</span><span v-show="item.tlementName!=''">{{item.tlementName}}</span></div>
                                <div class="right">时间 <span>|</span> {{item.demandTime}}</div>
                            </div>
                            <div class="cent3" v-show="item.remark!=''">
                                <img src="../../static/img/tonggao.png"/>
                                <div class="right">{{item.remark}}</div>
                            </div>
                            <div class="down">
                                <img src="../../static/img/grayxiaodinwei2.png"/>
                                <span v-if="item.province">{{item.province.name}}</span><span v-if="item.city">{{item.city.name}}</span><span v-if="item.district">{{item.district.name}}</span><span>{{item.address}}</span>
                            </div>
                            <div class="option" >
                                <div class="fl" @click="refresh(item)">
                                    <img src="../../static/img/search_refresh.png" alt="">
                                </div>
                                <div class="share" @click="toShareAction(item)">
                                    <img src="../../static/img/search_share.png"/>
                                </div>
                            </div>

                        </div>
                    </li>
                </ul>
            </div>
            <div class="tishi" v-else>
                暂无信息
            </div>
        </div>
        <!--引导发布-->
        <div class="pick2" v-show="toShare==1"></div>
        <div class="title" v-show="toShare==1">
            <img class="tp" src="../../static/img/yindao_icom.png"/>
            <div class="tp2">
                <div class="tp2-1">认证班组</div>
                <div class="tp2-2">您还不是班组长身份，无法查看发布信息</div>
                <div class="tp2-3">请先发布招工</div>
            </div>
            <div class="tp3">
                <div class="left left2" @click="cancel2Action">取消</div>
                <div class="left left3"><a href="/user/pubilcWorkerNeed/0/">发布招工</a></div>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import {wxApi, tabulateStatisticsApi} from "../api";
    import { LocalCache } from '../lib/utils';
    export default {
        data(){
            return{
                workGroupId: '',
                workerTitle: [],
                list: [],
                isShow: false,
                groupOneRecruit: {},
                toShare: 0,
                tipShow:true,
            }
        },
        methods:{
            back(){
                this.workGroupId = this.$store.state.workGroupId;
                if(this.workGroupId==0){
                    this.toShare = 1;
                }else {
                    this.toShare = 0;

                    wxApi.lookGrouperPublicWorkerList(this.workGroupId).then((result) => {
                        this.list = result.data.reverse();
                        console.log('列表', this.list);
                    })
                }
            },
            closeTip(){
                this.tipShow = false
            },
            refresh(item){
                console.log("refresh",item);
                wxApi.refreshWorkDemand(item.id).then((res)=>{
                    console.log("refreshWorkDemand",res);
                    if(res.code==0){
                        this.$f7.alert("刷新成功")
                    }
                })
            },
            operationAction(){
                this.isShow = !this.isShow;
            },
            deleteAction(item){
                console.log(item.id);
                this.$f7.confirm('是否确认删除该用工需求?', ()=>{
                    wxApi.grouperDeleteNeedWork(item.id).then((result)=>{
                        console.log('删除成功',result.data);
                        this.list = this.list.filter((res)=>{
                            return !(item.id==res.id)
                        })
                    })
                })
            },
            editAction(item){
                this.$router.load({url: '/user/pubilcWorkerNeed/'+item.id});
                this.$store.state.recruit = item;
            },
            toShareAction(item){
                this.groupOneRecruit = {};
                console.log('单个班组招工信息',item);
                this.groupOneRecruit = {
                    'id': item.id,
                    'title': item.title,
                    'groupName': item.workGroup.name,
                    'workTypeName': item.workTypeName,
                    'demandAmount': item.demandAmount,
                    'salaryLabel': item.salaryLabel,
                    'salary': item.salary,
                    'treatmentsName': item.treatmentsName
                }
                this.$router.load({url: '/user/oneRecruit/'});
                this.$store.state.recruit = item;
                this.$store.state.groupOneRecruit = this.groupOneRecruit;
            },
            cancel2Action(){
                this.toShare = 0;
            }
        },
        mounted(){
            this.workGroupId = this.$store.state.workGroupId;
            console.log('班组id',this.workGroupId);

            if(this.workGroupId==0){
                this.toShare = 1;
            }else{
                this.toShare = 0;

                if(this.$store.state.workerTitle){
                    this.workerTitle = this.$store.state.workerTitle;
                }else{
                    tabulateStatisticsApi.typeSort('workType').then((result)=>{
                        this.workerTitle = result.data.list;
                        this.$store.state.workerTitle = this.workerTitle;
                        console.log(this.workerTitle);
                    })
                }
                wxApi.lookGrouperPublicWorkerList(this.workGroupId).then((result)=>{
                    this.list = result.data.reverse();
                    console.log('列表',this.list);
                })
            }
            console.log('弹框判断',this.toShare);

        }
    }
</script>

<style scoped>
    .navbar .right{
        font-size: 0.7rem; color: #438CFF;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .main .aul li{
        background: #fff; margin-bottom: 0.5rem;
        position: relative;
    }
    .main .aul li .top{
        width: 100%; height: 25px; text-align: right; box-sizing: border-box; padding-right: 0.6rem; background: #fff;
        border-bottom: 1px solid #DDD;
    }
    .main .aul li .top .right{
        display: inline-block; height: 100%; margin-left: 20px;
    }
    .aul li .tipBox{
        position: absolute;
        bottom: -2.5rem;
        left: 50%;
        margin-left: -1.5rem;
        z-index: 100;
    }
    .aul li .tipBox .searchClose{
        width: 1rem;
        height: 1rem;
        position: absolute;
        top: 0.25em;
        left: 6.75rem;
    }
    .aul li .tipBox .searchTip{
        width: 7.25rem;
        height: 4.5rem;
    }
    .main .aul li .top .right img{
        width: 1.85rem; height: 0.55rem; margin-top: 7px;
    }
    .main .aul li .sit{
        width: 100%; height: 35px; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul li .sit .ent{
        width: 100%; text-align: center;
    }
    .main .aul li .sit .ent .st{
        width: 1rem; height: 1rem; display: inline-block; margin-top: 6px; transform: translateX(5px);
    }
    .main .aul li .sit .ent .st2{
        color: #fff; display: inline-block; transform: translateY(-8px); position: relative; z-index: 2;
    }
    .main .aul li .sit .ent .st2 .skew{
        height: 22px; background: #9FC6FC; color: #123f65; font-weight: 700; letter-spacing: 1px; font-size: 0.65rem; transform: skew(-15deg);
    }
    .main .aul li .sit .ent .st2 .skew .skew-main{
        transform: skew(15deg); padding: 0 7px; transform: translateY(4px);
    }
    .main .aul li .sit .ent .st3{
        width: 1.7rem; height: 1.4rem; display: inline-block; transform: translateX(-26px); position: relative; top: 2px;
    }
    .main .aul li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; border-bottom: 1px solid #DDDEE2; display: flex; justify-content: space-between;
        background: #F2F7FB; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul li .a2 .a2-1 .wg{
        font-size: 0.75rem; color: #555; padding-right: 0.5rem;
    }
    .main .aul li .a2 .a2-1 img{
        width: 1.9rem; height: 0.7rem; transform: translateY(3px);
    }
    .main .aul li .a2 .a2-1 .wg2{
        display: inline-block; height: 0.6rem; line-height: 0.6rem; border: 1px solid #FC7C2E; font-size: 0.4rem; color: #F55C11; border-radius: 1px; padding: 0 4px; transform: translateY(-2px);
    }
    .main .aul li .a2-2{
        height: 1.75rem;
    }
    .main .aul li .a2-2 img{
        width: 1.25rem; height: 1.25rem; display: inline-block; margin-top: 0.3rem;
    }
    .main .aul li .single{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem 0 0.6rem; background: #fff;
    }
    .main .aul li .single .up{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul li .single .up .left{
        display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
    }
    .main .aul li .single .up .left img{
        height: 0.75rem; display: inline-block; transform: translateY(2px);
    }
    .main .aul li .single .up .left2{
        font-size: 0.6rem; color: #666666;
    }
    .main .aul li .single .up .left2 .f-2{
        color: #ccc;
    }
    .main .aul li .single .up .left2 .f-3{
        color: #F13333; font-size: 0.75rem;
    }
    .main .aul li .single .up .left3 span{
        box-sizing: border-box; padding: 3px 4px; background: #F05A5A; border-radius: 1px; font-size: 0.6rem; color: #fff;
    }
    .main .aul li .single .cent{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul li .single .cent .left span{
        display: inline-block; height: 0.8rem; line-height: 0.8rem; box-sizing: border-box; padding: 0 6px; background: #EEEEEE;
        font-size: 0.55rem; color: #666; margin-right: 5px;
    }
    .main .aul li .single .cent .right{
        font-size: 0.6rem; color: #666;
    }
    .main .aul li .single .cent .right span{
        color: #ccc;
    }
    .main .aul li .single .cent3{
        display: flex; background: #f4f8fd; box-sizing: border-box; padding: 6px 0;
    }
    .main .aul li .single .cent3 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main .aul li .single .cent3 .right{
        font-size: 0.55rem; color: #333;
    }
    .main .aul li .single .down{
        width: 100%; min-height: 1.25rem; background: #fff; font-size: 0.6rem; color: #999; box-sizing: border-box; padding: 7px 0;
    }
    .main .aul li .single .down  img{
        width: 0.5rem; height: 0.6rem; display: inline-block; transform: translateY(1px);
    }

    .main .aul li .single .option{
        width: 100%;
        padding-top: .1rem;
        height: 1.2rem; line-height: 24px; text-align: right; font-size: 0.55rem; color: #999;
        overflow: hidden;
    }
    .main .aul li .single .option img{
        width: 3.4rem; height: 1.1rem; display: inline-block;vertical-align: middle;
    }
    .main .aul li .single .option .share{
        float: right;
    }
    .main .aul li .single .option .share img{
        width: 2.45rem;
        height: 1.1rem;
    }
    .main .aul li .single .option .fl{
        float: left;
    }
    .tishi{
        width: 100%; height: 30px; line-height: 30px; text-align: center; font-size: 0.8rem; color: #666; margin-top: 2rem;
    }

    /*引导发布*/
    .pick2{
        width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000; opacity: 0.5; z-index: 666;
    }
    .title{
        width: 284px; height: 225px; background: #fff; position: fixed; left: 12%; top: 28%; z-index: 990;
    }
    .title .tp{
        width: 100px; height: 90px; margin: 0 auto; display: block; transform: translateY(-36px); position: relative; z-index: 991;
    }
    .title .tp2{
        text-align: center; transform: translateY(-30px);
    }
    .title .tp2 .tp2-1{
        font-size: 0.75rem; color: #063D67;
    }
    .title .tp2 .tp2-2{
        font-size: 0.65rem; color: #111111;  font-weight: 700; margin-top: 18px;
    }
    .title .tp2 .tp2-3{
        font-size: 0.7rem; color: #666; margin-top: 10px;
    }
    .title .tp3{
        width: 100%; display: flex; justify-content: space-around; transform: translateY(-10px);
    }
    .title .tp3 .left{
        width: 100px; height: 35px; line-height: 35px; text-align: center; font-size: 0.85rem;  border: 1px solid #227FC5; border-radius: 1.5px;
    }
    .title .tp3 .left2{
        color: #227FC5;
    }
    .title .tp3 .left3{
        background: #227FC5;
    }
    .title .tp3 .left3 a{
        display: inline-block; width: 100%; height: 100%; color: #fff;
    }
</style>