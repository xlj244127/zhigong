<template>
    <div data-page="sendHistory" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">联系项目历史</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <ul class="aul2">
                    <li v-for="item in sendHistory">
                        <div class="a2">
                            <span>联系时间 :</span>&nbsp;<span>{{item.recordTime}}</span>
                        </div>
                        <div class="a3">
                            <img src="../../../../static/img/grayWendan.png"/>
                            <span>{{item.workDemandList[0].title?item.workDemandList[0].title:item.city.name+'招'+item.workDemandList[0].workTypeName}}</span>
                        </div>
                        <div class="tov">
                            <div class="shan">
                                <img class="one" src="../../../../static/img/projrenzhen.png"/>
                                <img class="two" src="../../../../static/img/projzhizhao.png"/>
                                <span class="three" v-if="item.batchNumber&&item.workDemandList[0].cost != null">工程造价{{item.workDemandList[0].cost}}万</span>
                            </div>
                            <div class="xia">
                                <span>{{item.project.name}}</span>
                                <img src="../../../../static/img/btn_drop_down.png"/>
                            </div>
                        </div>
                        <div class="single">
                            <div class="up">
                                <div class="left">
                                    <img src="../../../../static/img/recruit_time_worker.png" v-if="item.workDemandList[0].demandType==1"/>
                                    <img src="../../../../static/img/recruit_contractor.png" v-else-if="item.workDemandList[0].demandType==2"/>
                                    <img src="../../../../static/img/recruit_group.png" v-else-if="item.workDemandList[0].demandType==3"/>
                                    <img src="../../../../static/img/recruit_worker.png" v-else-if="item.workDemandList[0].demandType==4"/>
                                    <img src="../../../../static/img/zhaogong.png" v-else/>
                                    <span>{{item.workDemandList[0].workTypeName}}</span>
                                </div>
                                <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{item.workDemandList[0].demandAmount}}</span>人</div>
                                <div class="left3" v-if="item.workDemandList[0].salary"><span>{{item.workDemandList[0].salary}}{{item.workDemandList[0].salaryLabel}}</span></div>
                            </div>
                            <div class="cent">
                                <div class="left">
                                    <span v-show="item.workDemandList[0].treatmentsName!=''" v-for="one in item.workDemandList[0].treatmentsName.split(',')">{{one}}</span>
                                    <span v-show="item.workDemandList[0].tlementName!=''">{{item.workDemandList[0].tlementName}}</span>
                                </div>
                                <div class="right">时间 <span>|</span> {{item.workDemandList[0].demandTime}}</div>
                            </div>
                            <div class="cent2">
                                <div class="left">材料 <span>|</span> {{toNull(item.workDemandList[0].materialReqName)}}</div>
                                <div class="right">设备 <span>|</span> {{toNull(item.workDemandList[0].deviceReqName)}}</div>
                            </div>
                            <div class="cent3" v-show="item.workDemandList[0].remark!=''">
                                <img src="../../../../static/img/tonggao.png"/>
                                <div class="right">{{item.workDemandList[0].remark}}</div>
                            </div>
                            <div class="down">
                                <div class="left">
                                    发布日期: <span>{{item.workDemandList[0].createTime}}</span>
                                </div>
                                <div class="right">
                                    <img src="../../../../static/img/dingwei_icom.png"/>
                                    <span>{{item.project.location}}</span>
                                </div>
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
    export default {
        data(){
            return{
                sendHistory: [],
                workerTitle: []
            }
        },
        methods: {
            toNull(val){
                if(val==""||val==undefined || val==null){
                    return "--"
                }  else {
                    return val
                }
            },
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

            wxApi.lookContactRecord().then((result)=>{
                this.sendHistory = result.data;
                console.log(result.data);
                for(var i=0; i<this.sendHistory.length; i++) {
                    if (this.sendHistory[i].workDemandList && this.sendHistory[i].workDemandList != '[]') {
                        this.sendHistory[i].workDemandList[0].createTime = moment(this.sendHistory[i].workDemandList[0].createTime).format('YYYY-MM-DD');
                        if(this.sendHistory[i].workDemandList[0].salaryType == 1){
                            this.sendHistory[i].workDemandList[0].salaryLabel= "元/天"
                        }else if(this.sendHistory[i].workDemandList[0].salaryType == 2){
                            this.sendHistory[i].workDemandList[0].salaryLabel= "元/小时"
                        }else if(this.sendHistory[i].workDemandList[0].salaryType == 4){
                            this.sendHistory[i].workDemandList[0].salaryLabel= "元/月"
                        }else if(this.sendHistory[i].workDemandList[0].salaryType == 5){
                            this.sendHistory[i].workDemandList[0].salaryLabel= "元/平方"
                        }else{
                            this.sendHistory[i].workDemandList[0].salaryLabel= "面议"
                        }
                    }
                }
                console.log('列表',this.sendHistory);
            })
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .main .aul2{

    }
    .main .aul2 li{
        background: #fff; margin-top: 0.25rem; margin-bottom: 0.5rem;
    }
    .main .aul2 >li:last-of-type{
        margin-bottom: 2rem;
    }
    .main .aul2 li .a2{
        width: 100%; height: 1rem; line-height: 1rem; font-size: 0.6rem; color: #999; text-align: right; box-sizing: border-box; padding-right: 0.6rem;
    }
    .main .aul2 li .a3{
        width: 100%; height: 35px; box-sizing: border-box; padding: 0 0.6rem; font-size: 0.65rem; color: #444444; font-weight: 700;
    }
    .main .aul2 li .a3 img{
        width: 0.9rem; height: 0.9rem; display: inline-block; transform: translateY(4px);
    }
    .main .aul2 li .tov{
        width: 100%; height: 1.9rem; background: #F6FAFD; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .tov .shan{
        display: flex;
    }
    .main .aul2 li .tov .shan .one{
        width: 2.85rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
    }
    .main .aul2 li .tov .shan .two{
        width: 2.55rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
    }
    .main .aul2 li .tov .shan .three{
        height: 0.65rem; display: inline-block; box-sizing: border-box; padding: 0 0.2rem; border: 1px solid #8E9223; border-radius: 1px; font-size: 0.4rem; color: #8E9223;
    }
    .main .aul2 li .tov .xia{
        width: 100%; font-size: 0.65rem; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 5px;
    }
    .main .aul2 li .tov .xia img{
        width: 0.6rem; height: 0.6rem; display: inline-block; transform: translateY(2px);
    }

    .main .aul2 li .single{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
    }
    .main .aul2 li .single .up{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul2 li .single .up .left{
        display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
    }
    .main .aul2 li .single .up .left img{
        width: 0.75rem; height: 0.75rem; display: inline-block; transform: translateY(2px);
    }
    .main .aul2 li .single .up .left2{
        font-size: 0.6rem; color: #666666;
    }
    .main .aul2 li .single .up .left2 .f-2{
        color: #ccc;
    }
    .main .aul2 li .single .up .left2 .f-3{
        color: #F13333; font-size: 0.75rem;
    }
    .main .aul2 li .single .up .left3 span{
        box-sizing: border-box; padding: 3px 4px; background: #F05A5A; border-radius: 1px; font-size: 0.6rem; color: #fff;
    }
    .main .aul2 li .single .cent{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul2 li .single .cent .left span{
        display: inline-block; height: 0.8rem; line-height: 0.8rem; box-sizing: border-box; padding: 0 6px; background: #EEEEEE;
        font-size: 0.55rem; color: #666; margin-right: 5px;
    }
    .main .aul2 li .single .cent .right{
        font-size: 0.6rem; color: #666;
    }
    .main .aul2 li .single .cent .right span{
        color: #ccc;
    }
    .main .aul2 li .single .cent2{
        width: 100%; height: 30px; line-height: 30px;justify-content: space-between; font-size: 0.6rem; color: #666;
        overflow: hidden;
    }
    .main .aul2 li .single .cent2 .left span, .right span{
        color: #ccc;
    }
    .main .aul2 li .single .cent2 .left,.main .aul2 li .single .cent2 right{
        width: 50%;
        float: left;
    }
    .main .aul2 li .single .cent3{
        display: flex; background: #f4f8fd; box-sizing: border-box; padding: 6px 0;
    }
    .main .aul2 li .single .cent3 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main .aul2 li .single .cent3 .right{
        font-size: 0.55rem; color: #333;
    }

    .main .aul2 li .single .down{
        width: 100%; height: 1.2rem; line-height: 1.2rem; display: flex; justify-content: space-between;
    }
    .main .aul2 li .single .down .left{
        display: flex; font-size: 0.6rem; color: #999;
    }
    .main .aul2 li .single .down .right span{
        font-size: 0.55rem; color: #888;
    }
    .main .aul2 li .single .down .right img{
        width: 0.5rem; height: 0.6rem; display: inline-block; transform: translateY(3px);
    }

</style>