<template>
    <div data-page="contactWorkerHistory" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">联系工人历史</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main2">
                <ul class="aul">
                    <li v-for="item in concatWorkerHistory">
                        <div class="time"><span>联系时间:</span>&nbsp;&nbsp;<span>{{item.createrTime}}</span></div>
                        <div class="a2">
                            <div class="a2-1">
                                <div v-if="item.lookingJobExist">
                                    <span v-if="item.lookingJobEntity.displayName">{{item.lookingJobEntity.displayName}}</span>
                                </div>
                                <div v-else-if="item.name">{{item.name}}</div>
                                <div v-else-if="item.nickname">{{item.nickname}}</div>
                                <div v-else="item.mobile">{{item.mobile.substr(0,3)+'******'+item.mobile.substr(8)}}</div>
                                <div class="he" v-if="(item.lookingJobExist && item.lookingJobEntity.nativeProvinceName) || item.userDetail.nation">
                                    <span v-if="item.userDetail.nation">{{item.userDetail.nation}}族</span>
                                    <span v-if="item.lookingJobExist && item.lookingJobEntity.nativeProvinceName && item.userDetail.nation">|</span>
                                    <span v-if="item.lookingJobExist && item.lookingJobEntity.nativeProvinceName">{{item.lookingJobEntity.nativeProvinceName}}人</span>
                                </div>
                                <img v-show="item.userDetail.idNumber" src="../../../../static/img/shareYishiming.png"/>
                                <span class="grouper" v-if="item.workGroupId!=null">班组长</span>
                            </div>
                            <div class="a2-2" @click="contactWorker(item)">
                                <img src="../../../../static/img/phone_icom.png"/>
                            </div>
                        </div>
                        <div class="cent">
                            <div class="a3">
                                <div class="a3-1">
                                    <div class="left">工种类型 |</div>&nbsp;
                                    <div class="right">
                                        <span v-if="item.lookingJobExist==true" >
                                            <span v-for="(workTypeItem,index) in item.lookingJobEntity.workTypeNames">
                                                <span class="u2" >{{workTypeItem}}</span><span class="u3" v-show="item.lookingJobEntity.littleBigs[index]==0">大工</span><span class="u4" v-show="item.lookingJobEntity.littleBigs[index]==1">小工</span>
                                            </span>
                                        </span>
                                        <span v-else>
                                            <span class="u2">{{item.workTypeName}}</span> <span class="u3" v-show="item.littleBig==0">大工</span><span class="u4" v-show="item.littleBig==1">小工</span>
                                        </span>
                                    </div>
                                </div>
                                <div class="a3-2">
                                    <div class="left"><span class="f2">期望薪资 |</span><span class="f3" v-if="item.lookingJobExist==true">{{item.lookingJobEntity.salary}}{{item.lookingJobEntity.salaryLabel}}</span><span v-else>--</span></div>
                                    <div class="right" v-if="item.workingExp!=null"><span>工龄{{item.workingExp}}年</span></div>
                                </div>
                                <div class="a3-2">
                                    <div class="left2"><span class="t2">待遇需求 |</span><span v-if="item.lookingJobExist==true"><span  class="t3" v-for="treatmentItem in item.lookingJobEntity.treatmentNames">{{treatmentItem}}</span></span><span v-else>--</span></div>
                                    <div class="right2"><span class="r2">时间 |</span>&nbsp;<span v-if="item.lookingJobExist==true" class="r3">{{item.lookingJobEntity.expectTime}}</span><span v-else>--</span></div>
                                </div>
                            </div>
                            <div class="a5">
                                <img src="../../../../static/img/tonggao.png"/>
                                <div class="right" >{{item.remark}}</div>
                            </div>
                            <div class="bom">
                                <img src="../../../../static/img/grayxiaodinwei2.png"/>
                                <span>{{item.province}}{{item.city}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
                <!--<div v-show="concatWorkerHistoryLength==0 || concatWorkerHistoryLength<5" class="word">已无更多信息，点击查看全国信息</div>-->
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { wxApi } from "../../../api";
    import { LocalCache } from "../../../lib/utils";
    import moment from 'moment';
    export default {
        data(){
            return{
                page: '',
                pageSize: '',
                order: '',
                concatWorkerHistory: [],
                concatWorkerHistoryLength: '',
                workTitle:[]
            }
        },
        methods:{

        },
        mounted(){
            this.workTitle = LocalCache.get('workTypeList')
            console.log(this.workTitle.length);
            wxApi.concatWorkerHistory(this.page, this.pageSize, this.order).then((result)=>{
                console.log(result.data);
                this.concatWorkerHistoryLength = result.data.list.length;
                this.concatWorkerHistory = result.data.list;
                for(var i=0; i<this.concatWorkerHistory.length; i++){
                    if(this.concatWorkerHistory[i].lookingJobEntity!=null){
                        this.concatWorkerHistory[i].lookingJobExist = true
                        this.concatWorkerHistory[i].createrTime = moment(this.concatWorkerHistory[i].createrTime).format('YYYY-MM-DD');
                        this.concatWorkerHistory[i].lookingJobEntity.treatmentNames = this.concatWorkerHistory[i].lookingJobEntity.treatmentNames.split(",");
                        this.concatWorkerHistory[i].lookingJobEntity.littleBigs = this.concatWorkerHistory[i].lookingJobEntity.littleBigs.split(",");
                        this.concatWorkerHistory[i].lookingJobEntity.workTypeNames = this.concatWorkerHistory[i].lookingJobEntity.workTypeNames.split(",");
                        this.concatWorkerHistory[i].lookingJobEntity.expectTime = moment(this.concatWorkerHistory[i].lookingJobEntity.expectTime).format("YYYY-MM-DD")+'起'
                        if (this.concatWorkerHistory[i].lookingJobEntity.salaryType == 1) {
                            this.concatWorkerHistory[i].lookingJobEntity.salaryLabel = "元/天"
                        } else if (this.concatWorkerHistory[i].lookingJobEntity.salaryType == 2) {
                            this.concatWorkerHistory[i].lookingJobEntity.salaryLabel = "元/小时"
                        } else if (this.concatWorkerHistory[i].lookingJobEntity.salaryType == 4) {
                            this.concatWorkerHistory[i].lookingJobEntity.salaryLabel = "元/月"
                        } else if (this.concatWorkerHistory[i].lookingJobEntity.salaryType == 5) {
                            this.concatWorkerHistory[i].lookingJobEntity.salaryLabel = "元/平方"
                        } else {
                            this.concatWorkerHistory[i].lookingJobEntity.salaryLabel = "面议"
                        }
                    }else{
                        this.concatWorkerHistory[i].lookingJobExist = false
                    }
                }

                console.log('工人列表',this.concatWorkerHistory);
            })
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .main2{
        margin-bottom: 2rem;
    }
    .main2 .aul li{
        background: #fff; margin-bottom: 0.5rem;
    }
    .main2 .aul li:first-of-type{
        margin-top: 0.25rem;
    }
    .main2 .aul li .time{
        width: 100%; height: 1rem; line-height: 1rem; box-sizing: border-box; padding: 0 0.6rem; text-align: right; font-size: 0.6rem; color: #999999;
    }
    .main2 .aul li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; background: #F2F7FB; border-bottom: 1px solid #D8E7FE;
        display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.85rem 0 1rem;
    }
    .main2 .aul li .a2-1{
        flex: 1; font-size: 0.75rem; color: #555; font-weight: 700;
    }
    .main2 .aul li .a2-1 > div{
        display: inline-block;
    }
    .main2 .aul li .a2-1 .he{
        height: 14px; line-height: 14px; font-size: 0.4rem; color: #fff; padding: 0 4px; background: #D0C3C0; letter-spacing: 1px; position: relative; top: -3px;
    }
    .main2 .aul li .a2-1 .grouper{
        display: inline-block; width: 30px; height: 14px; line-height: 14px; text-align: center; font-size: 0.4rem; color: #DE9D57; border: 1px solid #DE9D57; transform: translateY(-2px);
    }
    .main2 .aul li .a2-1 img{
        width: 38px; height: 14px; display: inline; transform: translateY(2px);
    }
    .main2 .aul li .a2-2{
        width: 40px; text-align: right;
    }
    .main2 .aul li .a2-2 img{
        width: 1.25rem; height: 1.25rem; display: inline-block; text-align: center; margin-top: 4px;
    }

    .main2 .aul li .cent{
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .main2 .aul li .cent .a3{

    }
    .main2 .aul li .cent .a3 .a3-1{
        width: 100%; height: 26px; line-height: 26px; display: flex; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .main2 .aul li .cent .a3 .a3-1 .left{
        font-size: 0.6rem; color: #999;
    }
    .main2 .aul li .cent .a3 .a3-1 .right .u2{
        color: #438CFF;
    }
    .main2 .aul li .cent .a3 .a3-1 .right .u3,.u4{
        background: #EAEAEA; background: #EAEAEA; font-size: 0.5rem; color: #666; padding: 2px; margin-right: 6px;
    }
    .main2 .aul li .cent .a3 .a3-2{
        width: 100%; height: 26px; line-height: 26px; display: flex; justify-content: space-between;
    }
    .main2 .aul li .cent .a3 .a3-2 .left{
        font-size: 0.6rem;
    }
    .main2 .aul li .cent .a3 .a3-2 .left .f2{
        color: #999;
    }
    .main2 .aul li .cent .a3 .a3-2 .left .f3{
        color: #E85050;
    }
    .main2 .aul li .cent .a3 .a3-2 .right{

    }
    .main2 .aul li .cent .a3 .a3-2 .right span{
        box-sizing: border-box; padding: 2px 4px; font-size: 0.55rem; color: #FEFEFE; border-radius: 1px; background: #E89578;
    }
    .main2 .aul li .cent .a3 .a3-2 .left2{
        font-size: 0.6rem;
    }
    .main2 .aul li .cent .a3 .a3-2 .left2 .t2{
        color: #999;
    }
    .main2 .aul li .cent .a3 .a3-2 .left2 .t3{
        display: inline-block; margin-right: 5px; height: 0.85rem; line-height: 0.85rem; box-sizing: border-box; padding: 0 5px; font-size: 0.55rem; color: #666; background: #EEEEEE;
    }
    .main2 .aul li .cent .a3 .a3-2 .right2{
        font-size: 0.6rem;
    }
    .main2 .aul li .cent .a3 .a3-2 .right2 .r2{
        color: #999;
    }
    .main2 .aul li .cent .a3 .a3-2 .right2 .r3{
        color: #666;
    }

    .main2 .aul li .cent .a5{
        display: flex; background: #f8f8f8; box-sizing: border-box; padding: 6px 0;
    }
    .main2 .aul li .cent .a5 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main2 .aul li .cent .a5 .right{
        font-size: 0.55rem; color: #333;
    }
    .main2 .aul li .bom{
        width: 100%; height: 24px; line-height: 24px; text-align: left; font-size: 0.6rem; color: #666;
    }
    .main2 .aul li .bom img{
        width: 9px; height: 11px; display: inline-block; transform: translateY(2px);
    }
    .main2 .word{
        width: 90%; height: 24px; line-height: 24px; font-size: 10px; text-align: center; margin: 20px auto; color: #6AA5EE; border: 1px solid #DEE8F7;  border-radius: 6px;
    }
</style>