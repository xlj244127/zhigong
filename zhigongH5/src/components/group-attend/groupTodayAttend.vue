<template>
    <div class="main">
        <div class="block">
            <div class="block-inner">
                <div class="tst">{{ groupName }}</div>
                <div class="top">
                    <div class="cent2">请选择日期</div>
                    <div class="cent3" @click.stop.prevent="pickDate">
                        <span>{{ today }}</span>
                        <img src="../../../static/img/btn_drop_down.png"/>
                        <input class="picker" id="pickerCalendar">
                    </div>
                </div>
                <div class="center">
                    <div class="center-2">
                        <div class="span"><span class="span-1">总人数</span><br/><span class="span-2">{{dayAttend.totalUsers}}</span><span class="span-3">人</span><br/><span class="span-4">昨:{{yesterdayAttend.totalUsers}}人</span></div>
                        <div class="span"><span class="span-1">已考勤</span><br/><span class="span-2">{{zero(dayAttend.attendCount)}}</span><span class="span-3">人</span><br/><span class="span-4">昨:{{ zero(yesterdayAttend.attendCount) }}人</span></div>
                        <div class="span"><span class="span-1">考勤率</span><br/><span class="span-2">{{zero((dayAttend.attendRate*100))}}</span><span class="span-3">%</span><br/><span class="span-4">昨:{{ yesterdayAttendRate }}%</span></div>
                        <div class="span"><span class="span-1">平均工时</span><br/><span class="span-2">{{zero(dayAttend.averDuration)}}</span><span class="span-3">小时</span><br/><span class="span-4">昨:{{ zero(yesterdayAttend.averDuration) }}小时</span></div>
                    </div>
                    <div class="center-3">
                        <div class="span"><span class="span-1">异常考勤</span><br/><span class="span-2 span-red">{{zero(dayAttend.attendException)}}</span><span class="span-3 span-red">人</span><br/><span class="span-4">昨:{{ zero(yesterdayAttend.attendException) }}人</span></div>
                        <div class="span"><span class="span-1">异常率</span><br/><span class="span-2 span-red">{{Math.round(zero(dayAttend.exceptionRate*100))}}</span><span class="span-3 span-red">%</span><br/><span class="span-4">昨:{{ zero(Math.round(yesterdayAttend.exceptionRate*100)) }}%</span></div>
                        <div class="span"><span class="span-1">无考勤</span><br/><span class="span-2 span-red">{{zero(dayAttend.noAttend)}}</span><span class="span-3 span-red">人</span><br/><span class="span-4">昨:{{ zero(yesterdayAttend.noAttend) }}人</span></div>
                        <div class="span"><span class="span-1">缺卡考勤</span><br/><span class="span-2 span-red">{{zero(dayAttend.lackAttend)}}</span><span class="span-3 span-red">人</span><br/><span class="span-4">昨:{{ zero(yesterdayAttend.lackAttend) }}人</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div v-show="isBin==false" id="groupPie"></div>
            <img id="gray" v-show="isBin==true" src="../../../static/img/bintu.png"/>
        </div>

        <div>
            <div class="list-block accordion-list">
                <ul>
                    <li class="accordion-item"><a href="#" class="item-content item-link">
                        <div class="item-inner">
                            <div class="redTitle">无考勤-<span>{{ noAttend }}</span>人</div>
                        </div></a>
                        <div class="accordion-item-content" v-if="groupAttendDetail.noAttendItems!=''">
                            <div class="content-block" v-for="item in this.groupAttendDetail.noAttendItems">
                                <div class="jumpToDetail" @click="enterDetail(item)">
                                    <span>{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                                    <img src="../../../static/img/btn_right.png"/>
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item-content" v-else>
                            <div class="accordion-item-noText">
                                暂无无考勤人员
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="list-block accordion-list">
                <ul>
                    <li class="accordion-item"><a href="#" class="item-content item-link">
                        <div class="item-inner">
                            <div class="redTitle">缺卡-<span>{{ lackAttend }}</span>人</div>
                        </div></a>
                        <div class="accordion-item-content" v-if="groupAttendDetail.lackAttendItems!=''">
                            <div class="content-block" v-for="item in this.groupAttendDetail.lackAttendItems">
                                <div class="jumpToDetail" @click="enterDetail(item)">
                                    <span>{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                                    <img src="../../../static/img/btn_right.png"/>
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item-content" v-else>
                            <div class="accordion-item-noText">
                                暂无缺卡人员
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="list-block accordion-list">
                <ul>
                    <li class="accordion-item"><a href="#" class="item-content item-link">
                        <div class="item-inner">
                            <div class="item-title">正常-<span>{{ normalAttend }}</span>人</div>
                        </div></a>
                        <div class="accordion-item-content" v-if="groupAttendDetail.normalAttendItems!=''">
                            <div class="content-block" v-for="item in this.groupAttendDetail.normalAttendItems">
                                <div class="jumpToDetail" @click="enterDetail(item)">
                                    <span>{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                                    <img src="../../../static/img/btn_right.png"/>
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item-content" v-else>
                            <div class="accordion-item-noText">
                                暂无正常考勤人员
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
    import {echart3} from '../../lib/echarts.js'
    import moment from 'moment'
    import { statisticalSummaryApi } from '../../api'

    let monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月' , '9月' , '10月', '11月', '12月'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    let calendar;
    let $$ = Dom7;

    export default {
        name: "groupToday-attend",
        data(){
            return{
                today: '',
                yesterday: '',
                groupId: '',
                groupName: '',

                noAttend: '',
                normalAttend: '',
                lackAttend: '',

                lackItems: '',
                noItems: '',
                normalItems: '',

                dayAttend: {},
                yesterdayAttend:{},
                groupAttendDetail: {},
                projectId:'',
                yesterdayAttendRate:'',
                isBin: ''
            }
        },
        methods: {
            zero(value) {
                if(value)
                    return value;
                else
                    return 0;
            },
            dataNoZero(obj2){
                if(obj2 != 0) {
                    return obj2
                }else{
                    return ''
                }
            },
            getSummary(today, yesterday) {
                statisticalSummaryApi.dayAttend(2, today).then((result)=>{
                    console.log('项目今日考勤', result);
                    this.dayAttend = result.data;
                });
                statisticalSummaryApi.groupingDayAttendSum(
                    this.$store.state.roleInfo.projectId,
                    this.groupId,
                    today
                ).then((result)=>{
                    console.log("res",result.data);
                    this.groupAttendDetail = result.data;
                    this.noAttend = result.data.noAttendItems.length;
                    this.normalAttend = result.data.normalAttendItems.length;
                    this.lackAttend = result.data.lackAttendItems.length;
                    this.noItems=this.dataNoZero(result.data.noAttendItems.length);
                    this.normalItems=this.dataNoZero(result.data.normalAttendItems.length);
                    this.lackItems=this.dataNoZero(result.data.lackAttendItems.length);

                    if(this.noAttend==0 && this.normalAttend==0 && this.lackAttend==0){
                        this.isBin = true;
                    }else{
                        this.isBin = false;
                    }

                    echart3('groupPie', this.normalItems, this.lackItems, this.noItems);

                });
                statisticalSummaryApi.dayAttend(2, yesterday).then((result)=>{
                    console.log('项目昨日考勤', result);
                    this.yesterdayAttend = result.data;
                    if(result.data.attendRate){
                        this.yesterdayAttendRate =Math.round(result.data.attendRate*100)
                    }else{
                        this.yesterdayAttendRate = 0
                    }
                })

            },
            pickDate() {
                calendar.open();
            },
            enterDetail(item){
                this.$router.load({url: '/company/normalAttendDetail/'+this.projectId+'/'+this.groupId+'/'+item.id})
            }
        },
        mounted() {
            this.groupId = this.$store.state.roleInfo.groupId;
            this.projectId=this.$store.state.roleInfo.projectId;
            console.log('班组长', this.groupId);
            console.log('roleinfo',this.$store.state.roleInfo);

            this.today = moment().format('YYYY-MM-DD');
            this.yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

            this.getSummary(this.today, this.yesterday);
            if(this.$store.state.summary_type2) {
                // this.groupId = this.$store.state.summary_type2.groupId;
                this.groupName = this.$store.state.summary_type2.groupName;
                // this.attendCount = this.$store.state.summary_type2.attendCount;
                // this.attendNormal = this.$store.state.summary_type2.attendNormal;
                // this.attendException = this.$store.state.summary_type2.attendException;
                // this.attendRate = Math.round(this.$store.state.summary_type2.attendRate*100);
                // this.averDuration = this.$store.state.summary_type2.averDuration;

                //this.getSummary(this.today, this.yesterday);
            }

            //日历插件
            let that = this;
            calendar = this.$f7.calendar({
                input: '#calenda-default',
                dateFormat: 'yyyy-MM-dd',
                maxDate: moment().format('YYYY-MM-DD'),
                monthNames, dayNames, dayNamesShort,
                value: [this.today],
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    let $yesterday = moment().year(year).month(month).date(day-1).format('YYYY-MM-DD');
                    that.today = $day;
                    that.yesterday = $yesterday;
                    that.$store.state.today = $day;
                    that.getSummary(that.today, that.yesterday);
                    p.close();
                }
            });

        }
    }
</script>

<style scoped>
    .main{
        width: 100%;
    }
    .main .block{
        margin-top: 0.5rem; background: #fff;
    }
    .main .block .block-inner{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .block .block-inner .tst{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
    }
    .main .block .block-inner .top{
        width: 100%; height: 2rem; font-size: 0.8rem; color: #999; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
        display: flex; justify-content: space-between; font-size: 0.7rem;
    }
    .main .block .block-inner .top .cent2{
        color: #999;
    }
    .main .block .block-inner .top .cent3{
        color: #438cff; position: relative; padding-right: 1rem;
    }
    .main .block .block-inner .top .cent3 img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.6rem; right: 0px;
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
    .main .block .center .span .span-2.span-red{
        color: #ef7373;
    }
    .main .block .center .span .span-3.span-red{
        color: #ef7373;
    }
    .main .block .block-inner .center .span .span-4{
        font-size: 0.5rem; color: #999;
    }
    .main .block .block-inner .center .center-3{
        width: 100%; display: flex; justify-content: space-around; padding: 0.4rem 0 1.25rem 0;
    }
    .main .head{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
        margin-top: 0.5rem;
    }

    #groupPie{
        width: 100%;
        height: 14rem;
        background: #ffffff;
    }
    #gray{
        width: 8rem; height: 8rem; display: block; margin: 1.5rem auto;
    }

    .list-block{
        margin: 0; margin-bottom: 0.5rem;
    }
    .list-block .item-content{
        min-height: 2.5rem;
    }
    .list-block .redTitle{
        font-size: 0.7rem; color: #ef7373;
    }
    .list-block .item-title{
        font-size: 0.7rem; color: #438cff;
    }
    .list-block .accordion-item .content-block .jumpToDetail{
        height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; display: flex; justify-content: space-between;
        box-sizing: border-box; padding: 0 0.75rem;
    }
    .list-block .accordion-item .content-block img{
        width: 0.9rem; height: 0.9rem; padding-top: 0.8rem
    }
    #pickerCalendar {
        display: none;
    }

    .accordion-item-noText{
        width: 100%; text-align: center; color: #999;
    }

</style>
