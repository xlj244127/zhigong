<template>
    <div data-page="contactRecord" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">联系班组记录</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <ul class="aul">
                    <li v-for="item in contactRecord">
                        <div class="time"><span>联系时间:</span>&nbsp;&nbsp;<span>{{item.createTime}}</span></div>
                        <div class="sit">
                            <div class="ent">
                                <img class="st" src="../../../../static/img/wendan.png"/>
                                <div class="st2">
                                    <div class="skew">
                                        <div class="skew-main">{{item.workDemand.title?item.workDemand.title:item.workDemand.city.name+'招'+item.workDemand.workTypeName}}</div>
                                    </div>
                                </div>
                                <img class="st3" src="../../../../static/img/shibianxin_icom.png"/>
                            </div>
                            <div class="int">
                                <img src="../../../../static/img/phone_icom.png"/>
                            </div>
                        </div>
                        <div class="a2">
                            <div class="a2-1">
                                <span class="wg">{{item.workDemand.workGroup.name}}</span>
                                <img src="../../../../static/img/shareYishiming.png"/>
                                <img v-if="item.workDemand.workGroup.memberCount>1" src="../../../../static/img/shareYirengzhen.png"/>
                                <span v-if="item.workDemand.workGroup.memberCount>1"  class="wg2">班组{{item.workDemand.workGroup.memberCount}}人</span>
                            </div>
                            <!--<div class="a2-2">-->
                            <!--<img src="../../../static/img/phone_icom.png"/>-->
                            <!--</div>-->
                        </div>
                        <div class="single">
                            <div class="up">
                                <div class="left">
                                    <img src="../../../../static/img/recruit_time_worker.png" v-if="item.workDemand.demandType==1"/>
                                    <img src="../../../../static/img/recruit_contractor.png" v-else-if="item.workDemand.demandType==2"/>
                                    <img src="../../../../static/img/recruit_group.png" v-else-if="item.workDemand.demandType==3"/>
                                    <img src="../../../../static/img/recruit_worker.png" v-else-if="item.workDemand.demandType==4"/>
                                    <img src="../../../../static/img/zhaogong.png" v-else/>
                                    <span>{{item.workDemand.workTypeName}}</span>
                                </div>
                                <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{item.workDemand.demandAmount}}</span>人</div>
                                <div class="left3"><span>{{item.workDemand.salary}}{{item.workDemand.salaryLabel}}</span></div>
                            </div>
                            <div class="cent">
                                <div class="left"><span v-show="item.workDemand.treatmentsName!=''" v-for="one in item.workDemand.treatmentsName.split(',')">{{one}}</span><span v-show="item.workDemand.tlementName!=''">{{item.workDemand.tlementName}}</span></div>
                                <div class="right">时间 <span>|</span> {{item.workDemand.demandTime}}</div>
                            </div>
                            <div class="cent3" v-show="item.workDemand.remark">
                                <img src="../../../../static/img/tonggao.png"/>
                                <div class="right">{{item.workDemand.remark}}</div>
                            </div>
                            <div class="down">
                                <img src="../../../../static/img/grayxiaodinwei2.png"/>
                                <span v-if="item.workDemand.province">{{item.workDemand.province.name}}</span><span v-if="item.workDemand.city">{{item.workDemand.city.name}}</span><span v-if="item.workDemand.district">{{item.workDemand.district.name}}</span><span>{{item.address}}</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {userApi, tabulateStatisticsApi, wxApi} from "../../../api";
    import moment from 'moment';
    import phone_icon from '../../../../static/img/phone_icon.png';
    export default {
        data(){
            return{
                contactRecord: [],
                workerTitle: [],
                mobile: '',
                page: 1,
                pageSize: 5,
                order: ''
            }
        },
        methods: {
            contactGrouper(item) {
                wxApi.getGrouperPhone(item.workGroupId).then((result) => {
                    this.mobile = result.data;
                    console.log(result.data);
                    this.$f7.modal({
                        text: '<div class="tabs">' +
                        '<img style="width: 1rem; height: 1.1rem; transform: translateY(0.3rem)" src=' + phone_icon + '>' +
                        '<a>' + this.mobile + '</a>' +
                        '</div>',
                        buttons: [
                            {
                                text: '取消'
                            },
                            {
                                text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:'+this.mobile+'" class="external">' + "拨号" + '</a>'
                            },
                        ]
                    })
                })
            }
        },
        mounted(){
            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=>{
                    this.workerTitle = result.data.list;
                    this.$store.state.workerTitle = this.workerTitle;
                    console.log(this.workerTitle);
                })
            }

            wxApi.contactGroupHistory().then((result)=>{
                this.contactRecord = result.data;
                for(var i=0; i<this.contactRecord.length; i++){
                    this.contactRecord[i].createTime = moment(this.contactRecord[i].createTime).format('YYYY-MM-DD');
                    if(this.contactRecord[i].workDemand.salaryType == 1){
                        this.contactRecord[i].workDemand.salaryLabel= "元/天"
                    }else if(this.contactRecord[i].workDemand.salaryType == 2){
                        this.contactRecord[i].workDemand.salaryLabel= "元/小时"
                    }else if(this.contactRecord[i].workDemand.salaryType == 4){
                        this.contactRecord[i].workDemand.salaryLabel= "元/月"
                    }else if(this.contactRecord[i].workDemand.salaryType == 5){
                        this.contactRecord[i].workDemand.salaryLabel= "元/平方"
                    }else{
                        this.contactRecord[i].workDemand.salaryLabel= "面议"
                    }
                }
                console.log(result.data);
                console.log('列表',this.contactRecord);
            })
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .main{
        margin-bottom: 2rem;
    }
    .main .aul li{
        background: #fff; margin-bottom: 0.5rem;
    }
    .main .aul li .time{
        width: 100%; height: 1rem; line-height: 1rem; text-align: right; font-size: 0.6rem; color: #999; box-sizing: border-box; padding: 0 0.6rem; border: 1px solid #f4f4f4;
    }
    .main .aul li .sit{
        width: 100%; height: 35px; background: #fff; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul li .sit .ent{
        flex: 1; text-align: center;
    }
    .main .aul li .sit .int{
        width: 34px; text-align: right;
    }
    .main .aul li .sit .int img{
        width: 1.25rem; height: 1.25rem; margin-top: 7px;
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
        width: 100%; box-sizing: border-box; padding: 0 0.6rem 0.5rem 0.6rem; background: #fff;
    }
    .main .aul li .single .up{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul li .single .up .left{
        display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
    }
    .main .aul li .single .up .left img{
        width: 0.75rem; height: 0.75rem; display: inline-block; transform: translateY(2px);
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
</style>