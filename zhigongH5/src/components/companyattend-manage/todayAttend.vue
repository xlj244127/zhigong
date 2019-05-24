<template>
    <div class="main">
        <div class="block">
            <div class="block-inner">
                <div class="top">
                    <div class="cent2">请选择日期</div>
                    <div class="cent3" @click.stop.prevent="alertAction">
                        <input type="text" v-model='startTime' readonly id="calendar-default">
                        <img src="../../../static/img/btn_drop_down.png"/>
                    </div>
                </div>
                <div class="center">
                    <div class="center-2">
                        <div class="span"><span class="span-1">历史人数</span><br/><span class="span-2">{{zero(dayAttend.totalUsers)}}</span><span class="span-3">人</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.totalUsers)}}人</span></div>
                        <div class="span"><span class="span-1">当前人数</span><br/><span class="span-2">{{zero(dayAttend.currentlyUsers)}}</span><span class="span-3">人</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.currentlyUsers)}}人</span></div>
                        <div class="span"><span class="span-1">已考勤</span><br/><span class="span-2">{{zero(dayAttend.attendCount)}}</span><span class="span-3">人</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.attendCount)}}人</span></div>
                        <div class="span"><span class="span-1">考勤率</span><br/><span class="span-2">{{zero(attendRate)}}</span><span class="span-3">%</span><br/><span class="span-4">昨:{{zero(yesterdayAttendRate)}}%</span></div>
                    </div>
                    <div class="center-3">
                        <div class="span"><span class="span-1">异常考勤</span><br/><span class="span-2 span-red">{{zero(dayAttend.attendException)}}</span><span class="span-3 span-red">人</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.attendException)}}人</span></div>
                        <div class="span"><span class="span-1">缺卡考勤</span><br/><span class="span-2 span-red">{{zero(dayAttend.lackAttend)}}</span><span class="span-3 span-red">人</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.lackAttend)}}人</span></div>
                        <div class="span"><span class="span-1">无考勤</span><br/><span class="span-2 span-red">{{zero(dayAttend.noAttend)}}</span><span class="span-3 span-red">人</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.noAttend)}}人</span></div>
                        <div class="span"><span class="span-1">平均工时</span><br/><span class="span-2">{{zero(dayAttend.averDuration)}}</span><span class="span-3">小时</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.averDuration)}}小时</span></div>
                    </div>
                    <div class="bot">说明：当前数据为企业所有项目总数据</div>
                </div>
            </div>
        </div>

        <div class="echart">
            <div class="e-1" style="width: 100%; height: 10.5rem">
                <div class="one">总考勤对比柱状图</div>
                <div id="zhu" style="width: 90%; height: 10rem"></div>
            </div>
            <div class="e-2" style="width: 100%; height: 12.5rem">
                <div class="two">总工种人数统计</div>
                <div class="three">
                    <div v-show="isBin==false" id="bin" style="width: 90%; height: 12.5rem"></div>
                    <img v-show="isBin==true" class="gray" src="../../../static/img/bintu.png"/>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {echart} from '../../lib/echarts.js'
    import { statisticalSummaryApi } from '../../api'
    import moment from 'moment'
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    var calendarInline;
    export default {
        name: "today-attend",
        data(){
            return{
                dayAttend: {},
                yesterdayAttend: {},
                allProjDayAttend: [],
                startTime:"",
                today: '',
                yesterday: '',
                erArr:{},
                attendRate:'',
                yesterdayAttendRate:'',

                isBin: false,
                normalAttend: [],
                lackAttend: [],
                noAttend: [],
                jingri: '',
                zuori: '',

                typeNameList: [],
                typeDateList: []
            }
        },
        methods:{
            alertAction(){
                calendarInline.open();
            },
            zero(value) {
                if(value)
                    return value;
                else
                    return 0;
            },

            jiekoudiaoyong(today, yesterday){
                this.normalAttend = [];
                this.lackAttend = [];
                this.noAttend = [];
                this.jingri = '';
                this.zuori = '';
                this.typeNameList = [];
                this.typeDateList = [];
                statisticalSummaryApi.dayAttend(1, today).then((result)=>{
                    console.log("今日考勤",result);
                    this.dayAttend = result.data;
                    if(result.data.attendRate){
                        this.attendRate = Math.round(result.data.attendRate*100);
                    } else {
                        this.attendRate = 0;
                    }

                    if(this.dayAttend.totalAttendContrast){
                        for(var key in this.dayAttend.totalAttendContrast){
                            this.normalAttend.push(this.dayAttend.totalAttendContrast[key].normalAttend);
                            this.noAttend.push(this.dayAttend.totalAttendContrast[key].noAttend);
                            this.lackAttend.push(this.dayAttend.totalAttendContrast[key].lackAttend);
                        }

                        this.zuori = Object.keys(this.dayAttend.totalAttendContrast)[1];
                        this.jingri = Object.keys(this.dayAttend.totalAttendContrast)[0];
                        console.log('今日', this.jingri);
                        console.log('昨日', this.zuori);
                        console.log(this.normalAttend);
                        console.log(this.lackAttend);
                        console.log(this.noAttend);
                    }

                    if(!this.dayAttend.totalWorkGroupStat || JSON.stringify(this.dayAttend.totalWorkGroupStat)=='{}'){
                        console.log('======================================================',this.dayAttend.totalWorkGroupStat);
                        this.isBin = true;
                    }else{
                        this.isBin = false;
                        for(var key in this.dayAttend.totalWorkGroupStat){
                            this.typeNameList.push(this.dayAttend.totalWorkGroupStat[key].value);
                            let obj = {
                                value: this.dayAttend.totalWorkGroupStat[key].attend,
                                name: this.dayAttend.totalWorkGroupStat[key].value
                            }
                            this.typeDateList.push(obj);
                        }
                        console.log(this.typeDateList);
                    }

                    echart('zhu', this.normalAttend, this.lackAttend, this.noAttend, this.jingri, this.zuori, 'bin', this.typeNameList, this.typeDateList);

                })
                statisticalSummaryApi.dayAttend(1, yesterday).then((result)=>{
                    console.log("昨日考勤",result);
                    this.yesterdayAttend = result.data;
                    if(result.data.attendRate)
                        this.yesterdayAttendRate = Math.round(result.data.attendRate*100);
                    else
                        this.yesterdayAttendRate = 0;
                })
            }

        },
        mounted(){
            this.today = moment().format('YYYY-MM-DD');
            this.yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
            this.startTime = this.today;
            console.log('today',this.today,this.yesterday);

            this.jiekoudiaoyong(this.today, this.yesterday);

            //日历插件
            let that =this
            console.log('today',this.today);
            calendarInline = this.$f7.calendar({
                input: '#calendar-default',
                dateFormat: 'yyyy-MM-dd',
                maxDate: moment().format('YYYY-MM-DD'),
                monthNames, dayNames, dayNamesShort,
                value: [this.today],
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    let $yesterday = moment().year(year).month(month).date(day-1).format('YYYY-MM-DD');
                    that.startTime = $day;
                    console.log(that.startTime);
                    console.log($day);
                    console.log($yesterday);
                    that.jiekoudiaoyong($day, $yesterday);
                    p.close();
                }
            });

        }
    }
</script>

<style scoped type="text/scss">
    .main{
        width: 100%;
    }
    .main .block{
        margin-top: 0.5rem; background: #fff;
    }
    .main .block .block-inner{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .block .block-inner .top{
        width: 100%; height: 2rem; font-size: 0.8rem; color: #999; line-height: 2rem; border-bottom: 1px solid #ccc;
        display: flex; justify-content: space-between; font-size: 0.7rem;
    }
    .main .block .block-inner .top .cent2{
        color: #999;
    }
    .main .block .block-inner .top .cent3{
        color: #438cff; position: relative; padding-right: 1rem;
    }
    .main .block .block-inner .top .cent3 #calendar-default{
        height: 1.9rem; border: none; text-align: right; font-size: 0.7rem; color: #438cff;
    }
    .main .block .block-inner .top .cent3 img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.5rem; right: 0px;
    }
    .main .block .block-inner .center{
        margin-top: 1rem;
    }
    .main .block .block-inner .center .center-2{
        width: 100%; display: flex; justify-content: space-between;
    }
    .main .block .block-inner .center .span{
        width: 4.5rem; height: 3.5rem; display: block; text-align: center;
    }
    .main .block .block-inner .center .span .span-1{
        font-size: 0.7rem; color: #666;
    }
    .main .block .block-inner .center .span .span-2{
        font-size: 1.15rem; color: #438cff;
    }
    .main .block .block-inner .center .span .span-3{
        font-size: 0.7rem; color: #438cff;
    }
    .main .block .block-inner .center .span .span-2.span-red{
        color: #ef7373;
    }
    .main .block .block-inner .center .span .span-3.span-red{
        color: #ef7373;
    }
    .main .block .block-inner .center .span .span-4{
        font-size: 0.5rem; color: #999;
    }
    .main .block .block-inner .center .center-3{
        width: 100%; display: flex; justify-content: space-around; padding: 0.4rem 0 0 0;
    }
    .main .block .block-inner .center .bot{
        font-size: 0.4rem; color: #aaa; width: 100%; text-align: right; box-sizing: border-box; padding: 0.5rem 0;
    }

    .echart{

    }
    .echart .e-1{
        display: flex; background: #fff; margin-top: 0.4rem; box-sizing: border-box; padding-left: 0.6rem;
    }
    .echart .e-1 .one{
        width: 1rem; margin-top: 1rem;
    }
    .echart .e-2{
        display: flex; background: #fff; margin-top: 0.4rem; box-sizing: border-box; padding-left: 0.6rem;
    }
    .echart .e-2 .two{
        width: 1rem; margin-top: 1rem;
    }
    .echart .e-2 .three{
        flex: 1;
    }
    .echart .e-2 .three .gray{
        width: 8rem; height: 8rem; display: block; margin: 1.5rem auto;
    }
</style>





























