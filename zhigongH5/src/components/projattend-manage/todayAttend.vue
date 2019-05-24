<template>
    <div class="main">
        <div class="ipt" @click.stop.prevent="selectAction">
            <span v-if="this.projName.length>20">{{this.projName.substr(0,20)}}...</span>
            <span v-else>{{this.projName}}</span>
            <img class="i-img" src="../../../static/img/btn_drop_down.png"/>
            <input type="text" readonly id="picker-device">
        </div>

        <div class="block">
            <div class="block-inner">
                <div class="top">
                    <div class="cent2">请选择日期</div>
                    <div class="cent3" @click.stop.prevent="alertAction">
                        <input type="text"  v-model="this.today" readonly id="calenda-default">
                        <img src="../../../static/img/btn_drop_down.png"/>
                    </div>
                </div>
                <ul class="attendList">
                    <li>
                        <span class="attendTit">历史人数:</span>
                        <div class="attendItem color-blue"><span>{{dayAttend.totalUsers}}</span>人</div>
                        <span class="yesterItem">昨:{{yesterdayAttend.totalUsers}}人</span>
                    </li>
                    <li>
                        <span class="attendTit">当前人数:</span>
                        <div class="attendItem color-blue"><span>{{dayAttend.currentlyUsers}}</span>人</div>
                        <span class="yesterItem">昨:{{yesterdayAttend.currentlyUsers}}人</span>
                    </li>
                    <li>
                        <span class="attendTit">已考勤:</span>
                        <div class="attendItem color-blue"><span>{{dayAttend.attendCount}}</span>人</div>
                        <span class="yesterItem">昨:{{yesterdayAttend.attendCount}}人</span>
                    </li>
                    <li>
                        <span class="attendTit">考勤率:</span>
                        <div class="attendItem color-blue"><span>{{attendRate}}</span>%</div>
                        <span class="yesterItem">昨:{{yesAttendRate}}%</span>
                    </li>
                    <li>
                        <span class="attendTit">平均工时:</span>
                        <div class="attendItem color-blue"><span>{{dayAttend.averDuration}}</span>小时</div>
                        <span class="yesterItem">昨:{{yesterdayAttend.averDuration}}小时</span>
                    </li>
                    <li>
                        <span class="attendTit">异常率:</span>
                        <div class="attendItem color-red"><span>{{exceptionRate}}</span>%</div>
                        <span class="yesterItem">昨:{{yesExceptionRate}}%</span>
                    </li>
                    <li>
                        <span class="attendTit">无考勤:</span>
                        <div class="attendItem color-red"><span>{{zero(dayAttend.noAttend)}}</span>人</div>
                        <span class="yesterItem">昨:{{zero(yesterdayAttend.noAttend)}}人</span>
                    </li>
                    <li>
                        <span class="attendTit">缺卡考勤:</span>
                        <div class="attendItem color-red"><span>{{dayAttend.lackAttend}}</span>人</div>
                        <span class="yesterItem">昨:{{yesterdayAttend.lackAttend}}人</span>
                    </li>
                </ul>
                <div class="bot">说明: 当前项目为所选项目统计数据</div>
            </div>
        </div>

        <div class="echart">
            <div class="e-1" style="width: 100%; height: 10.5rem">
                <div class="one">考勤对比柱状图</div>
                <div id="zhu" style="width: 90%; height: 10rem"></div>
            </div>
            <div class="e-2" style="width: 100%; height: 12.5rem">
                <div class="two">工种人数统计</div>
                <div class="three">
                    <div v-show="isBin==false" id="bin" style="width: 90%; height: 10.5rem"></div>
                    <img v-show="isBin==true" class="gray" src="../../../static/img/bintu.png"/>
                </div>
            </div>
        </div>

        <div class="groupList">
            <div class="groupTitle">各班组考勤总概 <span>（单位:人）</span></div>
            <div class="groupItem" v-for="(item,index) in projGroupList" @click="enterDetail(item)">
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
    import { statisticalSummaryApi } from '../../api'
    import { projectApi } from '../../api'
    import moment from 'moment'
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    var calendarInline;
    var pickerDevice;
    var projectId;

    export default {
        name: "today-attend",
        data(){
            return{
                dayAttend: {},
                yesterdayAttend: {},
                projGroupList: [],
                projList: [],
                projName: '',
                today:'',
                yesterday:'',
                erArr:{},
                attendRate:'',
                yesAttendRate:'',
                exceptionRate:'',
                yesExceptionRate:'',
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
            selectAction(){
                pickerDevice.open();
            },
            enterGroupList(){
                this.$router.load({url: '/company/projDayAttendDetail/'+projectId})
            },
            alertAction(){
                calendarInline.open();
            },
            enterDetail(item){
                this.$router.load({url: '/company/projAbnormalAttend/'+projectId+'/'+item.groupId})
                this.$store.state.groupName = item.groupName;
            },
            getPageData(today, yesterday, projectId){
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
                statisticalSummaryApi.oneProjDayAttend(1, today, projectId).then((result)=>{
                    console.log('项目日考勤');
                    console.log(result);
                    this.dayAttend = result.data;
                    if(result.data.attendRate)
                        this.attendRate =Math.round(result.data.attendRate*100);
                    else
                        this.attendRate = 0;
                    if(result.data.exceptionRate){
                        this.exceptionRate=Math.round(result.data.exceptionRate*100)
                    }else{
                        this.exceptionRate=0
                    }

                    if(this.dayAttend.totalAttendContrast){
                        for(var key in this.dayAttend.totalAttendContrast){
                            this.normalAttend.push(this.dayAttend.totalAttendContrast[key].normalAttend);
                            this.noAttend.push(this.dayAttend.totalAttendContrast[key].noAttend);
                            this.lackAttend.push(this.dayAttend.totalAttendContrast[key].lackAttend);
                        }
                        this.zuori = Object.keys(this.dayAttend.totalAttendContrast)[1];
                        this.jingri = Object.keys(this.dayAttend.totalAttendContrast)[0];
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
                statisticalSummaryApi.oneProjDayAttend(1, yesterday, projectId).then((result)=>{
                    console.log('项目昨日考勤');
                    console.log(result);
                    this.yesterdayAttend = result.data;
                    if(result.data.attendRate)
                        this.yesAttendRate =Math.round(result.data.attendRate*100);
                    else
                        this.yesAttendRate = 0;
                    if(result.data.exceptionRate){
                        this.yesExceptionRate=Math.round(result.data.exceptionRate*100)
                    }else{
                        this.yesExceptionRate = 0
                    }
                })
                statisticalSummaryApi.groupDayAttend(projectId, today).then((result)=>{
                    console.log('项目班组日考勤');
                    console.log(result);
                    this.projGroupList = result.data;
                    let newArr={};
                    for(var j=0;j<result.data.length;j++){
                        newArr[j] = Math.round(result.data[j].exceptionRate*100)
                    }
                    this.erArr=newArr
                    var resData=result.data;
                    for(var i=0;i<resData.length;i++){
                        this.noPerArr.push(Math.floor(resData[i].noAttend/resData[i].totalUsers*80)+'%')
                        this.lackPerArr.push(Math.floor(resData[i].lackAttend/resData[i].totalUsers*80)+'%')
                        this.normalPerArr.push(Math.floor(resData[i].attendNormal/resData[i].totalUsers*80)+'%')
                    }
                    //console.log(this.noPerArr,this.lackPerArr,this.normalPerArr);
                })
            }
        },
        mounted(){
            this.today = moment().format('YYYY-MM-DD');
            this.yesterday =  moment().subtract(1, 'days').format('YYYY-MM-DD');
            console.log('今日和昨日',this.today,this.yesterday);

            projectId = this.$store.state.roleInfo.projectId;
            projectApi.projectDetail(projectId).then((result)=>{
                console.log('项目详情');
                console.log(result.data);
                this.projName = result.data.name;
            })

            this.getPageData(this.today, this.yesterday, projectId);

            projectApi.projerProjList().then((result)=> {
                console.log('项目列表');
                console.log(result);
                this.projList = result.data;

                pickerDevice = this.$f7.picker({
                    input: '#picker-device',
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onOpen: () => {
                        Dom7('#btnOk').click(() => {
                            let index = pickerDevice.cols[0].activeIndex;
                            this.projName = pickerDevice.cols[0].displayValues[index];
                            this.$store.state.roleInfo.projectId = pickerDevice.cols[0].values[index];
                            projectId = pickerDevice.cols[0].values[index];
                            console.log(pickerDevice.cols[0].values[index]);

                            that.getPageData(this.today, this.yesterday, projectId);
                        });
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.projList.map((project) => {
                                return project.id
                            }),
                            displayValues: this.projList.map((project) => {
                                return project.name
                            })
                        }
                    ]
                });
            })
            //日历插件
            let that = this;
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
                    that.getPageData($day, $yesterday, projectId);
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

    .ipt{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; position: relative; box-sizing: border-box; padding: 0 0.6rem; background: #fff; margin-top: 0.5rem;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .ipt #picker-device{
        position: absolute;  left: 0;  right: 0;  top: 0;  bottom: 0; opacity: 0;
    }
    .ipt .i-img{
        width: 0.6rem; height: 0.6rem; display: inline;
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
    .main .block .block-inner .top .cent3 #calenda-default{
        height: 1.9rem; border: none; text-align: right; font-size: 0.7rem; color: #438cff;
    }
    .main .block .block-inner .top .cent3 img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.5rem; right: 0px;
    }

    .attendList{
        text-align: center; overflow: hidden;
    }
    .attendList li{
        float: left; width: 25%; margin-top:  .75rem;
    }
    .attendList .attendTit{
        color: #666; font-size: 0.7rem;
    }
    .attendList .attendItem span{
        font-size: 1rem; line-height: 2;
    }
    .attendList .attendItem{
        font-size: 0.7rem; border-right: 1px solid #eee;
    }
    .attendList li:nth-child(4n) .attendItem{
        border-right: none;
    }
    .attendList .yesterItem{
        font-size: 0.6rem; color: #999;
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
        margin-top: 0.6rem; font-size: 0.8rem; color: #666666; height: 2rem; line-height: 2rem; padding-left: 4%; border-bottom: 1px solid #ddd;
    }
    .groupTitle span{
        font-size: 0.6rem;
    }
    .main .block .block-inner .bot{
        font-size: 0.4rem; color: #aaa; width: 100%; text-align: right; box-sizing: border-box; padding: 0.5rem 0;
    }

    .groupItemTit{
        font-size: 0.7rem; line-height: 2rem; border-bottom: 1px solid #ddd; padding:0.2rem 0.4rem 0;
    }
    .groupItemTit img{width: 0.9rem; height: 0.9rem; float: right; margin-top: 0.55rem;
    }
    .groupItem{
        border-bottom:  0.2rem solid #f4f4f4;
    }
    .groupAttendList{
        padding-top: 0.2rem; padding-bottom: 0.2rem;
    }
    .groupAttendList li{
        padding: 0.2rem 0.4rem; height: 1rem; line-height: 1rem; font-size: 0.6rem;
    }
    .groupAttendList li{
        overflow: hidden;
    }
    .groupAttendList span{
        font-size: 0.7rem; color: #666666; width: 3rem; margin-right: 0.2rem; display: block; float: left;
    }
    .attendBlock{
        float: left; width: 12rem; margin-left: 0.3rem; height: 1rem; margin-right: 0.2rem; color: #999;
    }
    .blockInner{
        height: 0.8rem; margin-top: 0.1rem; float: left; margin-right: 5%; text-align: center; color: #ffffff; font-size: .6rem; line-height: .8rem;
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





























