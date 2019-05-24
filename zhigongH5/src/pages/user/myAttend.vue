<template>
    <div data-page="myAttend" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">我的考勤</div>
            </div>
        </div>
        <!---侧边栏--->
        <group-nav></group-nav>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="header">
                <div class="ipt">
                    <span id="project">{{this.projectName.length>20?this.projectName.substr(0,20)+'...':this.projectName}}</span>
                    <img class="imgone" src="../../../static/img/btn_drop_down.png"/>
                    <input id="picker" readonly>
                </div>

                <div class="aside">
                    <div class="top calendar-custom-toolbar">
                        <a class="left"><i class="icon icon-back"></i></a>
                        <div class="t-1 center"></div>
                        <a class="right"><i class="icon icon-forward"></i></a>
                    </div>
                    <div class="cent">
                        <div class="one">
                            <span class="o-1">出勤天数</span>
                            <br/>
                            <span class="o-2">{{(monthAttend.monthAttendAll)}}</span><span class="o-3">天</span>
                        </div>
                        <div class="one">
                            <span class="o-1">合计工时</span>
                            <br/>
                            <span class="o-2">{{monthAttend.monthAttendDuration}}</span><span class="o-3">小时</span>
                        </div>
                        <div class="one">
                            <span class="o-1">正常考勤</span>
                            <br/>
                            <span class="o-2">{{monthAttend.monthAttendNormal}}</span><span class="o-3">天</span>
                        </div>
                        <div class="one">
                            <span class="o-1">异常考勤</span>
                            <br/>
                            <span class="o-4">{{monthAttend.monthAttendException}}</span><span class="o-5">天</span>
                        </div>
                    </div>
                    <div class="bott">说明: 工作总时长以两次打卡时间计算，缺卡和影响时长统计</div>
                </div>
                <div class="aside">
                    <div id="calendar-container"></div>
                </div>
                <div class="bott">
                    <div>说明:</div>
                    <div>合计工时: 当月所有工时统计。</div>
                    <div>平均工时: 当月平均工时。</div>
                    <div>正常考勤: 当天至少有两次考勤记录。</div>
                    <div>缺卡考勤: 仅有一次考勤记录，缺卡无法计算当天工时。</div>
                    <div>无考勤: 当天未进行考勤。</div>
                    <div>无考勤: 当天未进行考勤。</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { statisticalSummaryApi, projectApi } from '../../api'
    import groupNav from '../../components/broadside-navigation/group'
    import staffNav from '../../components/broadside-navigation/staff'
    import moment from 'moment'

    let $$ = Dom7;
    let monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月' , '9月' , '10月', '11月', '12月'];
    let months = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    let calendar;

    export default {
        data(){
            return{
                groupId: 0,
                projects: [],
                monthAttend:{},
                projectName: ''
            }
        },
        components: {
            groupNav, staffNav
        },
        methods: {
            initPicker(projs) {
                if(projs.length == 0)
                    return;
                $$('#project').data('id', projs[0].id);

                this.projectName = projs[0].name;
                let that = this;
                this.$f7.picker({
                    input: '#picker',
                    toolbarCloseText: '确定',
                    onClose(p){
                        let index = p.cols[0].activeIndex;
                        $$('#project').data('id', p.cols[0].values[index]);
                        that.projectName = p.cols[0].displayValues[index];
                        that.onMonthChange();
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: projs.map((project)=>{return project.id;}),
                            displayValues: projs.map((project)=>{return project.name;}),
                        }
                    ]
                });
                this.initCalendar();
            },
            initCalendar() {
                let that = this;
                calendar = this.$f7.calendar({
                    container: '#calendar-container',
                    monthNames, dayNames, dayNamesShort,
                    value: [new Date()],
                    maxData:[new Date()],
                    toolbar: false,
                    onOpen: function (p) {
                        $$('.calendar-custom-toolbar .center').text(p.currentYear+'年 '+monthNames[p.currentMonth]).data('month', p.currentYear+'-'+months[p.currentMonth]);
                        $$('.calendar-custom-toolbar .left').on('click', function () {
                            calendar.prevMonth();
                        });
                        $$('.calendar-custom-toolbar .right').on('click', function () {
                            calendar.nextMonth();
                        });
                        that.onMonthChange();
                    },
                    onMonthYearChangeStart: function (p) {
                        $$('.calendar-custom-toolbar .center').text(p.currentYear+'年 '+monthNames[p.currentMonth]).data('month', p.currentYear+'-'+months[p.currentMonth]);
                        that.onMonthChange();
                    },
                    onDayClick: function (p, dayContainer, year, month, day) {
                        let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                        //that.$router.load({url: '/company/normalAttendDetail/+项目id+班组id+个人id+?'+$day});
                    }
                });
            },
            onMonthChange() {
                let month = $$('.calendar-custom-toolbar .center').data('month');
                let projectId = $$('#project').data('id');
                statisticalSummaryApi.monthly(2, month, projectId).then((result)=>{
                    console.log("个人考勤",result.data);
                    this.monthAttend= result.data;
                    $$('.picker-calendar-day').removeClass("picker-calendar-day-selected").removeClass("picker-calendar-day-miss");
                    result.data.attendList.forEach((attend)=>{
                        let day = moment(attend.attendDay);
                        let $day = day.year()+'-'+day.month()+'-'+day.date();
                        console.log($day);
                        if(attend.status == 1)
                            $$('.picker-calendar-day[data-date="'+$day+'"]').addClass('picker-calendar-day-selected');
                        else if(attend.status == 2)
                            $$('.picker-calendar-day[data-date="'+$day+'"]').addClass('picker-calendar-day-miss');
                    });
                });
            }
        },
        mounted(){
            this.groupId = this.$store.state.roleInfo.groupId;
            console.log(this.groupId);
            projectApi.userProjs().then((result)=>{
                console.log('我所在的所有项目');
                console.log(result);
                this.$store.state.projects = result.data;
                this.initPicker(result.data);
            });
        }
    }
</script>

<style scoped>
    .page-content{
        background: #f4f4f4;
    }
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }

    .header .ipt{
        width: 100%; height: 2rem; line-height: 2rem; position: relative; box-sizing: border-box; padding: 0 0.6rem; background: #fff; text-align: center;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .header .ipt #picker{
        width: 100%; height: 100%; position: absolute;  left: 0;  right: 0;  top: 0;  bottom: 0; opacity: 0;
    }
    .header .ipt .imgone{
        width: 0.6rem; height: 0.6rem; display: inline;
    }

    .header .aside{
       background: #fff; margin-top: 0.5rem;
    }
    .header .aside .top{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4;
        box-sizing: border-box; padding: 0 0.6rem; color: #438cff; font-size: 0.7rem;
    }

    .header .aside .cent{
        width: 100%; display: flex;justify-content: space-around;
    }
    .header .aside .cent .one{
        width: 4.7rem; height: 3.75rem; box-sizing: border-box; padding: 1rem 0 0.8rem 0; text-align: center;
    }
    .header .aside .cent .one .o-1{
        font-size: 0.6rem; color: #666;
    }
    .header .aside .cent .one .o-2{
        font-size: 1rem; color: #438cff;
    }
    .header .aside .cent .one .o-3{
        font-size: 0.5rem; color: #438cff;
    }
    .header .aside .cent .one .o-4{
          font-size: 1rem; color: #ef7373;
    }
    .header .aside .cent .one .o-5{
        font-size: 0.5rem; color: #ef7373;
    }
    .header .aside .bott{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.6rem; color: #ccc; text-align: center; box-sizing: border-box; padding: 0 0.6rem;
    }
    #picker {
        position: absolute;  left: 0;  right: 0;  top: 0;  bottom: 0; opacity: 0;
    }

    .bott{
        width: 100%; background: #fff; margin-top: 10px; box-sizing: border-box; padding: 15px 0 11px 12px;
    }
    .bott div{
        font-size: 11px; color: #CCCCCC;
    }
</style>