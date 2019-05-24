<template>
    <div>
        <div class='block'>
            <div class="head">
                <div class="tov">{{projectName}}</div>
                <div class="cent3" @click.stop.prevent="alertAction">
                    <input type="text" v-model='today' readonly id="calenda-default">
                    <img src="../../../static/img/btn_drop_down.png"/>
                </div>
            </div>
            <ul class="attendList">
                <li>
                    <span class="attendTit">历史人数:</span>
                    <div class="attendItem color-blue"><span>{{projDayAttend.totalUsers}}</span>人</div>
                    <span class="yesterItem">昨:{{yesterdayAttend.totalUsers}}人</span>
                </li>
                <li>
                    <span class="attendTit">当前人数:</span>
                    <div class="attendItem color-blue"><span>{{projDayAttend.currentlyUsers}}</span>人</div>
                    <span class="yesterItem">昨:{{projDayAttend.currentlyUsers}}人</span>
                </li>
                <li>
                    <span class="attendTit">已考勤:</span>
                    <div class="attendItem color-blue"><span>{{projDayAttend.attendCount}}</span>人</div>
                    <span class="yesterItem">昨:{{yesterdayAttend.attendCount}}人</span>
                </li>
                <li>
                    <span class="attendTit">考勤率:</span>
                    <div class="attendItem color-blue"><span>{{attendRate}}</span>%</div>
                    <span class="yesterItem">昨:{{yesAttendRate}}%</span>
                </li>
                <li>
                    <span class="attendTit">异常考勤:</span>
                    <div class="attendItem color-red"><span>{{projDayAttend.attendException}}</span>人</div>
                    <span class="yesterItem">昨:{{yesterdayAttend.attendException}}人</span>
                </li>
                <li>
                    <span class="attendTit">无考勤:</span>
                    <div class="attendItem color-red"><span>{{zero(projDayAttend.noAttend)}}</span>人</div>
                    <span class="yesterItem">昨:{{zero(yesterdayAttend.noAttend)}}人</span>
                </li>
                <li>
                    <span class="attendTit">缺卡考勤:</span>
                    <div class="attendItem color-red"><span>{{projDayAttend.lackAttend}}</span>人</div>
                    <span class="yesterItem">昨:{{yesterdayAttend.lackAttend}}人</span>
                </li>
                <li>
                    <span class="attendTit">平均工时:</span>
                    <div class="attendItem color-blue"><span>{{projDayAttend.averDuration}}</span>小时</div>
                    <span class="yesterItem">昨:{{yesterdayAttend.averDuration}}小时</span>
                </li>
            </ul>
            <div class="bot">说明: 当前项目为所选项目统计数据</div>
        </div>

        <div class="echart">
            <div class="e-1" style="width: 100%; height: 210px">
                <div class="one">项目考勤对比柱状图</div>
                <div id="zhu" style="width: 90%; height: 200px"></div>
            </div>
            <div class="e-2" style="width: 100%; height: 250px">
                <div class="two">项目工种人数统计</div>
                <div class="three">
                    <div v-show="isBin==false" id="bin" style="width: 90%; height: 250px"></div>
                    <img v-show="isBin==true" class="gray" src="../../../static/img/bintu.png"/>
                </div>
            </div>
        </div>

        <div class="groupList">
            <div class="groupTitle">各班组考勤总概 <span>（单位:人）</span></div>
            <div class="groupItem" v-for="(item,index) in groupDayAttendList" @click="enterDetail(item)">
                <div class="groupItemTit">
                    {{item.groupName}}
                    <img src="../../../static/img/btn_right.png"/>
                </div>
                <ul class="groupAttendList ">
                    <li><span>正常考勤</span><div class="attendBlock fl"><div class="blockInner bg-blue" :style='{width:normalPerArr[index]}'>{{item.attendNormal}}</div>{{item.attendNormal}}人</div></li>
                    <li><span>缺卡考勤</span><div class="attendBlock fl"><div class="blockInner bg-org" :style='{width:lackPerArr[index]}'>{{item.lackAttend}}</div>{{item.lackAttend}}人</div></li>
                    <li><span>无考勤</span><div class="attendBlock fl"><div class="blockInner bg-red" :style='{width:noPerArr[index]}'>{{item.noAttend}}</div>{{item.noAttend}}人</div></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {echart} from '../../lib/echarts.js'
    import { statisticalSummaryApi,projectApi } from '../../api'
    import moment from 'moment'
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    var calendarInline,projectId;
    export default {
        name: "projDayAttend",
        data(){
            return{
                projectName: '',
                projDayAttend: {},
                yesterdayAttend:{},
                today:'',
                yerterday: '',
                groupDayAttendList:'',
                exceptionRate:'',
                yesExceptionRate:'',
                attendRate:'',
                yesAttendRate:'',
                noPerArr:[],
                lackPerArr:[],
                normalPerArr:[],

                normalAttend: [],  //以下是Echarts需要的参数
                lackAttend: [],
                noAttend: [],
                jingri: '',
                zuori: '',

                isBin: false,
                typeNameList: [],
                typeDateList: []
            }
        },
        methods:{
            zero(value) {
                if(value)
                    return value;
                else
                    return 0;
            },
            alertAction(){
                calendarInline.open();
            },
            enterDetail(item){
                this.$router.load({url: '/company/projAbnormalAttend/'+projectId+'/'+item.groupId})
                this.$store.state.groupName = item.groupName;
            },
            getData(today, yerterday, projectId){
                this.normalAttend = [];
                this.lackAttend = [];
                this.noAttend = [];
                this.jingri = '';
                this.zuori = '';
                this.typeNameList = [];
                this.typeDateList = [];
                this.noPerArr=[];
                this.lackPerArr=[];
                this.normalPerArr=[];
                statisticalSummaryApi.oneProjDayAttend(1,today, projectId).then((result)=>{
                    console.log('projDayAttend',result);
                    this.projDayAttend = result.data;
                    if(result.data.attendRate)
                        this.attendRate=Math.round(result.data.attendRate*100)
                    else
                        this.attendRate = 0

                    if(this.projDayAttend.totalAttendContrast){
                        for(var key in this.projDayAttend.totalAttendContrast){
                            this.normalAttend.push(this.projDayAttend.totalAttendContrast[key].normalAttend);
                            this.noAttend.push(this.projDayAttend.totalAttendContrast[key].noAttend);
                            this.lackAttend.push(this.projDayAttend.totalAttendContrast[key].lackAttend);
                        }
                        this.zuori = Object.keys(this.projDayAttend.totalAttendContrast)[1];
                        this.jingri = Object.keys(this.projDayAttend.totalAttendContrast)[0];
                        console.log(this.normalAttend);
                        console.log(this.lackAttend);
                        console.log(this.noAttend);
                    }

                    if(!this.projDayAttend.totalWorkGroupStat || JSON.stringify(this.projDayAttend.totalWorkGroupStat)=='{}'){
                        console.log('======================================================',this.projDayAttend.totalWorkGroupStat);
                        this.isBin = true;
                    }else{
                        this.isBin = false;
                        for(var key in this.projDayAttend.totalWorkGroupStat){
                            this.typeNameList.push(this.projDayAttend.totalWorkGroupStat[key].value);
                            let obj = {
                                value: this.projDayAttend.totalWorkGroupStat[key].attend,
                                name: this.projDayAttend.totalWorkGroupStat[key].value
                            }
                            this.typeDateList.push(obj);
                        }
                        console.log(this.typeDateList);
                    }

                    echart('zhu', this.normalAttend, this.lackAttend, this.noAttend, this.jingri, this.zuori, 'bin', this.typeNameList, this.typeDateList);

                });
                statisticalSummaryApi.oneProjDayAttend(1, yerterday, projectId).then((result)=>{
                    console.log('项目日考勤');
                    console.log(result);
                    this.yesterdayAttend = result.data;
                    if(result.data.exceptionRate){
                        this.yesExceptionRate=Math.round(result.data.exceptionRate*100)
                    }else{
                        this.yesExceptionRate=0
                    }
                    if(result.data.attendRate)
                        this.yesAttendRate=Math.round(result.data.attendRate*100)
                    else
                        this.yesAttendRate = 0
                })
                statisticalSummaryApi.groupDayAttend(projectId, today).then((result)=>{
                    console.log('groupDayAttendList',result);
                    this.groupDayAttendList = result.data;
                    var resData=result.data;

                    for(var i=0;i<resData.length;i++){
                        this.noPerArr.push(Math.floor(resData[i].noAttend/resData[i].totalUsers*80)+'%')
                        this.lackPerArr.push(Math.floor(resData[i].lackAttend/resData[i].totalUsers*80)+'%')
                        this.normalPerArr.push(Math.floor(resData[i].attendNormal/resData[i].totalUsers*80)+'%')
                    }
                    if(result.data.exceptionRate){
                        this.exceptionRate=Math.round(result.data.exceptionRate*100)
                    }else{
                        this.exceptionRate=0
                    }
                })
            }
        },
        mounted(){
            projectId = this.$store.state.projectId;

            projectApi.projectDetail(projectId).then((res)=>{
                console.log('projectDetail',res.data);
                this.projectName=res.data.name;
                this.$store.state.name = res.data.name;
            })

            this.today = moment().format('YYYY-MM-DD');
            this.yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
            this.$store.state.today = this.today;

            this.getData(this.today, this.yesterday, projectId);

            //日历
            let that =this;
            calendarInline = this.$f7.calendar({
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
                    that.getData($day, $yesterday, projectId)
                    p.close();
                }
            });
        }
    }
</script>

<style scoped>
    .block{
        width: 100%; background: #fff; margin-top: 0.5rem;
        position: relative;
    }
    .block .head{
        width: 100%; height: 2.1rem; line-height: 2rem; font-size: 0.8rem; color: #999;
        border-bottom: 1px solid #f4f4f4;
    }

    .block .fix{
        width: 2.5rem; height: 2.5rem; position: absolute; right: 2.5rem; top: 4.3rem;
    }
    .block .head{
        box-sizing: border-box; padding: 0 0.4rem;
    }
    .fix a{
        width: 100%; height: 100%; display: inline-block;
    }
    .fix a img{
        position: relative; left: 0.8rem; top: 0.3rem;
    }
    .cent3{
        color: #438cff; position: relative; padding-right: 1rem;
        float: right;
        width: 55%;
        box-sizing: border-box;
    }
    .cent3 img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.6rem; right: 0px;
    }
    #calenda-default {
        height: 2rem;
        border: none;
        text-align: right;
        font-size: 0.7rem;
        color: #438cff;
        float: right;

    }
    .attendList{
        text-align: center;
        overflow: hidden;
    }
    .attendList li{
        float: left;
        width: 25%;
        margin-top:  .75rem;
    }
    .attendList .attendTit{
        color: #666;
        font-size: 0.7rem;
    }
    .attendList .attendItem span{
        font-size: 1rem;
        line-height: 2;
    }
    .attendList .attendItem{
        font-size: 14px;
        border-right: 1px solid #eee;
    }
    .attendList li:nth-child(4n) .attendItem{
        border-right: none;
    }
    .attendList .yesterItem{
        font-size: 12px;
        color: #999;
    }
    .color-blue{
        color: #438CFF;
    }
    .color-red{
        color: #ef7373;
    }
    .groupList{
        background: #ffffff;
    }
    .groupTitle{
        margin-top: 0.6rem;
        font-size: 16px;
        color: #666666;
        height: 2rem;
        line-height: 2rem;
        padding-left: 4%;
        border-bottom: 1px solid #ddd;
    }
    .groupTitle span{
        font-size: 12px;
    }

    .groupItemTit{
        font-size: 14px;
        line-height: 2rem;
        border-bottom: 1px solid #ddd;
        padding:0.2rem 0.4rem 0;
    }
    .groupItemTit img{
        width: 0.9rem;
        height: 0.9rem;
        float: right;
        margin-top: 0.55rem;
    }
    .groupItem{
        border-bottom:  0.2rem solid #f4f4f4;
    }
    .groupAttendList{
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
    }
    .groupAttendList li{
        padding: 0.2rem 0.4rem;
        height: 1rem;
        line-height: 1rem;
        font-size: 0.6rem;
    }
    .groupAttendList li{
        overflow: hidden;
    }
    .groupAttendList span{
        font-size: 0.7rem;
        color: #666666;
        width: 3rem;
        margin-right: 0.2rem;
        display: block;
        float: left;
    }
    .attendBlock{
        float: left;
        width: 12rem;
        margin-left: 0.3rem;
        height: 1rem;
        margin-right: 0.2rem;
        color: #999;
    }
    .blockInner{
        height: 0.8rem;
        margin-top: 0.1rem;
        float: left;
        margin-right: 5%;
        text-align: center;
        color: #ffffff;
        font-size: .6rem;
        line-height: .8rem;
    }

    .bg-blue{
        background-color: #0cca0c;
        border-left: 1px solid #0cca0c;
    }
    .bg-org{
        background-color: #fd913a;
        border-left: 1px solid #fd913a;
    }
    .bg-red{
        background-color: #ed4444;
        border-left: 1px solid #ed4444;
    }
    .head .tov{
        width: 40%;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        float: left;
    }
    .block .bot{
        font-size: 0.4rem; color: #aaa; width: 100%; text-align: right; box-sizing: border-box; padding: 0.5rem 0.6rem 0.5rem 0;
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