<template>
    <div class="main">
        <div class="content">
            <div class="tst">{{companyName}}</div>
            <div class="block">
                <div class="top">
                    <a href="/company/attendManage/">
                        <span>考勤管理</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <div class="center">
                    <div class="center-1">{{today}}<!--（默认当日）--></div>
                    <div class="center-2">
                        <div class="span"><span class="span-1">历史人数</span><br/><span class="span-2">{{ zero(sumCompanyAttend.totalUsers) }}</span><span class="span-3">人</span><br/><span class="span-4">昨:{{ zero(yesterdayAttend.totalUsers) }}人</span></div>
                        <div class="span"><span class="span-1">当前人数</span><br/><span class="span-2">{{zero(sumCompanyAttend.currentlyUsers)}}</span><span class="span-3">人</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.currentlyUsers)}}人</span></div>
                        <div class="span"><span class="span-1">已考勤</span><br/><span class="span-2">{{ zero(sumCompanyAttend.attendCount) }}</span><span class="span-3">人</span><br/><span class="span-4">昨:{{ zero(yesterdayAttend.attendCount) }}人</span></div>
                    </div>
                    <div class="center-3"><!--sumCompanyAttend.attendRate-->
                        <div class="span"><span class="span-1">考勤率</span><br/><span class="span-2">{{attendRate}}</span><span class="span-3">%</span><br/><span class="span-4">昨:{{ yesterdayAttendRate }}%</span></div>
                        <div class="span"><span class="span-1">平均工时</span><br/><span class="span-2">{{ zero(sumCompanyAttend.averDuration) }}</span><span class="span-3">小时</span><br/><span class="span-4">昨:{{ zero(yesterdayAttend.averDuration) }}小时</span></div>
                        <div class="span"><span class="span-1">异常考勤</span><br/><span class="span-2 span-red">{{ zero(sumCompanyAttend.attendException) }}</span><span class="span-3 span-red">人</span><br/><span class="span-4">昨:{{ zero(yesterdayAttend.attendException) }}人</span></div>
                    </div>
                </div>
            </div>
            <div class="block">
                <div class="top">
                    <a href="/company/projectManage/">
                        <span>项目管理</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <div class="list">
                    <div class="ali">
                        <div class="li"><span class="li-1">项目总数</span><br/><span class="li-2">{{ zero(sumCompanyAttend.projectCount) }}个</span></div>
                        <div class="li"><span class="li-1">项目总人数</span><br/><span class="li-2">{{sumCompanyAttend.totalUsers}}人</span></div>
                        <div class="li"><span class="li-1">班组数</span><br/><span class="li-2">{{ zero(sumCompanyAttend.groupCount) }}个</span></div>
                    </div>
                </div>
            </div>
            <div class="block">
                <div class="top">
                    <a href="/company/infoEntering/">
                        <span>信息录入</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <ul class="aul">
                    <li>
                        <div class="left"><span class="l-1">已实名认证:</span><span class="l-2">{{ zero(sumCompanyAttend.withIDCount) }}人</span></div> <div class="right"><span class="r-1">未实名认证:</span><span class="r-2">{{ zero(sumCompanyAttend.withoutIDCount) }}人</span></div>
                    </li>
                    <li>
                        <div class="left"><span class="l-1">已采集人像:</span><span class="l-2">{{ zero(sumCompanyAttend.withFaceCount) }}人</span></div> <div class="right"><span class="r-1">未采集人像:</span><span class="r-2">{{ zero(sumCompanyAttend.withoutFaceCount) }}人</span></div>
                    </li>
                </ul>
            </div>
            <div class="block">
                <div class="top">
                    <a href="/company/laborManagement/">
                        <span>劳务招工</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <ul class="aul2">
                    <li>
                        <div class="center"><span class="c-1">用工需求匹配:</span><br/><span class="c-2">{{ zero(findWorkCount.workDemandMatch) }}个</span></div>
                        <div class="center"><span class="c-1">班组合作申请:</span><br/><span class="c-2">{{ zero(findWorkCount.workGroupCooperationReq) }}个</span></div>
                    </li>
                    <li>
                        <div class="center"><span class="c-1">空闲班组:</span><br/><span class="c-2">{{zero(findWorkCount.workGroupFree)}}个</span></div>
                        <div class="center"><span class="c-1">空闲工种:</span><br/><span class="c-2">{{zero(findWorkCount.workTypeFree)}}个</span></div>
                        <div class="center"><span class="c-1">空闲人数:</span><br/><span class="c-2">{{zero(findWorkCount.freeAmount)}}人</span></div>
                    </li>
                </ul>
            </div>
            <div class="block">
                <div class="top">
                    <a href="/company/blackListManage/">
                        <span>黑名单管理</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <div class="list">
                    <div class="ali ali2">
                        <div class="li"><span class="li-1">企业黑名单</span><br/><span class="li-2">{{ blackListStat.companyBA }}个</span></div>
                        <div class="li"><span class="li-1">黑名单警报</span><br/><span class="li-2">{{ blackListStat.warnBA }}个</span></div>
                    </div>
                </div>
            </div>
            <div class="block">
                <div class="top">
                    <a href="/company/equipManage/">
                        <span>设备管理</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <ul class="aul2">
                    <li>
                        <div class="center"><span class="c-1">已绑定考勤机:</span><br/><span class="c-2">{{ zero(sumCompanyAttend.bindMachineCount) }}个</span></div>
                        <div class="center"><span class="c-1">未绑定考勤机:</span><br/><span class="c-3">{{ zero(sumCompanyAttend.unbindMachineCount) }}个</span></div>
                    </li>
                    <li>
                        <div class="center"><span class="c-1">在用考勤机:</span><br/><span class="c-2">{{zero(sumCompanyAttend.usingMachineCount)}}个</span></div>
                        <div class="center"><span class="c-1">空闲考勤机:</span><br/><span class="c-2">{{zero(sumCompanyAttend.freeMachineCount)}}个</span></div>
                        <div class="center"><span class="c-1">离线考勤机:</span><br/><span class="c-3">{{zero(sumCompanyAttend.offlineMachineCount)}}个</span></div>
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
    import { statisticalSummaryApi, blackListApi, wxApi } from '../../api'
    import moment from 'moment'
    export default {
        name: "have-attendance",
        data(){
            return{
                today: '',
                yesterday: '',
                sumCompanyAttend: {},
                yesterdayAttend: {},
                attendRate:'',
                yesterdayAttendRate:'',
                blackListStat: '',
                findWorkCount: {}
            }
        },
        props: ["companyName"],
        methods:{
            zero(value) {
                if(value)
                    return value;
                else
                    return 0;
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;

            wxApi.laborCount(this.companyId).then((result)=>{
                console.log('找工作统计',result.data);
                this.findWorkCount = result.data;
            })

            statisticalSummaryApi.summary(1).then((result)=>{
                console.log("公司首页",result.data);
                this.sumCompanyAttend = result.data;
                if(result.data.attendRate)
                    this.attendRate = Math.round(result.data.attendRate*100)
                else
                    this.attendRate = 0
             });

            this.yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
            this.today = moment().format('YYYY年MM月DD日');
            console.log('昨天日期', this.yesterday);
            statisticalSummaryApi.dayAttend(1, this.yesterday).then((result)=>{
                console.log('我请求到了昨日的项目考勤');
                console.log(result);
                this.yesterdayAttend = result.data;
                if(result.data.attendRate)
                    this.yesterdayAttendRate = Math.round(result.data.attendRate*100)
                else
                    this.yesterdayAttendRate = 0
            })

            blackListApi.blackListStat(this.companyId).then((result)=>{
                console.log('企业管理员黑名单统计',result);
                this.blackListStat = result.data;
            })
        }
    }
</script>

<style scoped>
.main{
    width: 100%; overflow: hidden;
}
.main .content{
    box-sizing: border-box; padding: 0 0.75rem 1.25rem 0.75rem;
}
.main .content .tst{
    width: 100%; text-align: center; font-size: 0.8rem; color: #333; margin-top: 2.25rem;
}
.main .block{
    width: 100%; border: 1px solid #ccc; border-radius: 0.9rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    margin-top: 0.75rem;

}
.main .block .top{
    width: 100%; height: 2rem; line-height: 2rem; border-bottom: 1px solid #ccc;
    position: relative;
}
.main .block .top a{
    width: 100%; height: 100%; display: block; font-size: 0.8rem; color: #333;
}
.main .block .top img{
    width: 0.9rem; height: 0.9rem; position: absolute; top: 0.6rem; right: 0px;
}
.main .block .center .center-1{
    font-size: 0.7rem; color: #666; margin: 0.5rem 0 0.6rem 0;
}
.main .block .center .center-2{
    width: 100%; display: flex; justify-content: space-between;
}
.main .block .center .span{
    width: 4.5rem; height: 3.5rem; display: block; text-align: center;
}
.main .block .center .span .span-1{
    font-size: 0.7rem; color: #666;
}
.main .block .center .span .span-2{
    font-size: 1.15rem; color: #438cff;
}
.main .block .center .span .span-3{
    font-size: 0.7rem; color: #438cff;
}
.main .block .center .span .span-2.span-red,.main .block .center .span .span-3.span-red{
    color: #ef7373;
}
.main .block .center .span .span-4{
    font-size: 0.5rem; color: #999;
}
.main .block .center .center-3{
    width: 100%;  margin: 0.4rem 0 1.25rem 0; display: flex; justify-content: space-between;
}

.main .block .list{
    width: 100%; margin: 0.6rem 0 1.25rem 0;
}
.main .block .list .ali{
    margin-bottom: 0.9rem; display: flex;
}
.main .block .list .ali2{
    justify-content: space-around;
}
.main .block .list .li {
    width: 32%; height: 1.85rem; box-sizing: border-box; padding-left: 0.2rem; text-align: center;
}
.main .block .list .li .li-1{
    font-size: 0.65rem; color: #666;
}
.main .block .list .li .li-2{
    font-size: 0.8rem; color: #438cff;
}

.main .block .aul{
    width: 100%; margin: 0.6rem 0 1.25rem 0;
}
.main .block .aul li{
    display: flex; justify-content: space-around;
}
.main .block .aul li .left, .right{
    width: 40%; display: flex; justify-content: space-around;
}
.main .block .aul li .left .l-1{
    font-size: 0.65rem; color: #666;
}
.main .block .aul li .left .l-2{
    font-size: 0.8rem; color: #438cff;
}
.main .block .aul li .right .r-1{
    font-size: 0.65rem; color: #666;
}
.main .block .aul li .right .r-2{
    font-size: 0.8rem; color: #ef7373;
}

.main .block .aul2{
    width: 100%; margin: 0.6rem 0 1.25rem 0;
}
.main .block .aul2 li{
    display: flex; margin-bottom: 0.9rem;
    width: 80%;
    margin: 1.25rem auto;
}
.main .block .aul2 li .center{
    width: 50%; height: 1.85rem;
    text-align: center;
}
.main .block .aul2 li .center .c-1{
    font-size: 0.65rem; color: #666;
}
.main .block .aul2 li .center .c-2{
    font-size: 0.8rem; color: #438cff;
}
.main .block .aul2 li .center .c-3{
    font-size: 0.8rem; color: #ef7373;
}

</style>