<template>
    <div>
        <div class="top">
            <div class="cent2">请选择日期</div>
            <div class="cent3">
                <div class="c-1">
                    <div class="c-left" @click="yearSubtractAction"><img src="../../../static/img/shujujian.png"/></div>
                    <div class="c-z"><span>{{this.year}}</span>年</div>
                    <div class="c-right" @click="yearAddAction"><img src="../../../static/img/shujujia.png"/></div>
                </div>
                <div class="c-1">
                    <div class="c-1">
                        <div class="c-left" @click="monthSubtractAction"><img src="../../../static/img/shujujian.png"/></div>
                        <div class="c-z2"><span>{{this.month}}</span>月</div>
                        <div class="c-right" @click="monthAddAction"><img src="../../../static/img/shujujia.png"/></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="EchartOne">
            <div class="nav">考勤概况折线图</div>
            <div class="box">
                <div class="left" @click="btnLeftAction">
                    <img src="../../../static/img/btn_left.png"/>
                </div>
                <ul>
                    <li v-for="(item, index) in monthStat" :class="{active: index==selectIndex}" @click="btnAction(index)">{{item.name}}</li>
                </ul>
                <div class="right" @click="btnRightAction">
                    <img src="../../../static/img/btn_right.png"/>
                </div>
            </div>
            <div id="line" v-show="selectIndex==0" style="width: 100%; height: 150px"></div>
            <div id="line2" v-show="selectIndex==1" style="width: 100%; height: 150px"></div>
            <div id="line3" v-show="selectIndex==2" style="width: 100%; height: 150px"></div>
            <div id="line4" v-show="selectIndex==3" style="width: 100%; height: 150px"></div>


            <div class="tst">
                <span class="t-1">数据说明:</span>
                <span class="t-2" v-show="selectIndex==0">当前人数：企业所有项目实际总人数</span>
                <span class="t-2" v-show="selectIndex==1">考勤率： （已考勤人数 ÷ 当前人数）x 100%</span>
                <span class="t-2" v-show="selectIndex==2">异常考勤率：[（无考勤人数+缺卡人数）÷ 当前人数）]×100%</span>
                <span class="t-2" v-show="selectIndex==3">平均工时：正常考勤工人的工作时长合计 ÷ 正常考勤人数</span>
            </div>
        </div>

        <div class="EchartOne">
            <div class="nav">工种人数折线图</div>
            <div class="type">
                <div class="left" @click="btnLeftAction2">
                    <img src="../../../static/img/btn_left.png"/>
                </div>
                <div class="cent">
                    <ul class="t-1">
                       <li v-for="(item, index) in leixin" :class="{active: index==selectIndex2}" @click="btnAction2(index)">{{item.name}}</li>
                    </ul>
                </div>
                <div class="right" @click="btnRightAction2">
                    <img src="../../../static/img/btn_right.png"/>
                </div>
            </div>

            <div v-for="(item2, index) in leixin" v-show="selectIndex2==index" :id="item2.code" style="width: 100%; height: 150px"></div>
        </div>
    </div>
</template>

<script>
    import {echart2} from '../../lib/echarts.js'
    import { statisticalSummaryApi } from '../../api'
    var $$ = Dom7;
    import moment from 'moment';
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    var calendartu;
    export default {
        name: "month-attend",
        data(){
            return{
                monthStat: [{name: '当前人数'}, {name: '考勤率'}, {name: '异常考勤率'}, {name: '平均工时'}],
                leixin: [],
                startTime: '',
                year: '',
                month: '',
                selectIndex: 0,
                selectIndex2: 0,

                everyDay: [],
                currentlyUsers: [],
                attendRate: [],
                exceptionRate: [],
                averDuration: []
            }
        },
        methods:{
            yearSubtractAction(){
                this.year--;
                this.startTime = this.year +'-'+ (this.month>=10?this.month:'0'+this.month);
                console.log(this.startTime);
                this.jiekoudiaoyong(this.startTime);
            },
            yearAddAction(){
                this.year++;
                this.startTime = this.year +'-'+ (this.month>=10?this.month:'0'+this.month);
                console.log(this.startTime);
                this.jiekoudiaoyong(this.startTime);
            },
            monthSubtractAction(){
                if(this.month>1){
                    this.month--;
                    this.startTime = this.year +'-'+ (this.month>=10?this.month:'0'+this.month);
                }else{
                    this.year--;
                    this.month = 12;
                    this.startTime = this.year +'-'+ (this.month>=10?this.month:'0'+this.month);
                }
                console.log(this.startTime);
                this.jiekoudiaoyong(this.startTime);
            },
            monthAddAction(){
                if(this.month>=12){
                    this.year++;
                    this.month = 1;
                    this.startTime = this.year +'-'+ (this.month>=10?this.month:'0'+this.month);
                }else{
                    this.month++;
                    this.startTime = this.year +'-'+ (this.month>=10?this.month:'0'+this.month);
                }
                console.log(this.startTime);
                this.jiekoudiaoyong(this.startTime);
            },


            btnAction(index){
                this.selectIndex = index;
            },
            btnLeftAction(){
                console.log('我点击了左');
                if(this.selectIndex==0){
                    this.selectIndex = 3;
                    console.log(this.selectIndex);
                }
                else if(this.selectIndex>0){
                    this.selectIndex = this.selectIndex-1;
                    console.log(this.selectIndex);
                }
            },
            btnRightAction(){
                console.log('我点击了右');
                if(this.selectIndex==3){
                    this.selectIndex = 0;
                    console.log(this.selectIndex);
                }
                else if(this.selectIndex<3){
                    this.selectIndex = this.selectIndex+1;
                    console.log(this.selectIndex);
                }

            },

            btnAction2(index){
                this.selectIndex2 = index;
            },
            btnLeftAction2(){
                if(this.leixin.length > 4 ) {
                    if(this.selectIndex2<=0) {
                        this.selectIndex2 = this.leixin.length-1;
                        console.log(this.selectIndex2);
                        $$('.t-1').css('left', -75*(this.leixin.length-4)+'px');
                    }else{
                        this.selectIndex2--;
                        console.log(this.selectIndex2);
                        if(this.leixin.length-4 > this.selectIndex2){
                            $$('.t-1').css('left', -75*(this.selectIndex2)+'px');
                        }
                    }
                }else{
                    if(this.selectIndex2==0) {
                        this.selectIndex2 = this.leixin.length-1;
                    }else if(this.selectIndex2>0){
                        this.selectIndex2--;
                    }
                }
            },
            btnRightAction2(){
                if(this.leixin.length > 4 ){
                    if(this.selectIndex2>=this.leixin.length-1) {
                        this.selectIndex2 = 0;
                        $$('.t-1').css('left', 0+'px');
                    }else{
                        this.selectIndex2++;
                        console.log(this.selectIndex2);
                        if(this.selectIndex2>3){
                            $$('.t-1').css('left', -75*(this.selectIndex2-3)+'px');
                        }
                    }
                }else{
                    if(this.selectIndex2==this.leixin.length-1) {
                        this.selectIndex2 = 0;
                    }else if(this.selectIndex2<this.leixin.length-1){
                        this.selectIndex2++;
                    }
                }
            },

            jiekoudiaoyong(day){
                this.everyDay = [];
                this.currentlyUsers = [];
                this.attendRate = [];
                this.exceptionRate = [];
                this.averDuration = [];
                this.leixin = [];
                statisticalSummaryApi.monthEcharts(1, this.startTime).then((result)=>{
                    console.log('月统计', result);
                    let arr = result.data.monthAttends;
                    for(var day in arr){
                        this.everyDay.push(day);
                        this.currentlyUsers.push(arr[day].CurrentlyUsers);
                        this.attendRate.push(arr[day].attendRate*100);
                        this.exceptionRate.push(arr[day].exceptionRate*100);
                        this.averDuration.push(arr[day].averDuration);
                    }

                    setTimeout(()=>{
                        echart2('line', this.everyDay, this.currentlyUsers, '当前人数');
                        echart2('line2', this.everyDay, this.attendRate, '考勤率');
                        echart2('line3', this.everyDay, this.exceptionRate, '异常考勤率');
                        echart2('line4', this.everyDay, this.averDuration, '平均工时');
                    },1000);

                    let arr2 = result.data.totalWorkGroupStat;
                    for(var code in arr2){
                        this.leixin.push(
                            {code: code.split('_')[0], name: code.split('_')[1]}
                        )
                    }
                    console.log(this.leixin);
                    console.log(arr2);
                    var that = this;
                    setTimeout(()=>{
                        for(var w in arr2){
                            for(var m in this.leixin){
                                if(w.split('_')[0] == this.leixin[m].code){
                                    let id = w.split('_')[0];
                                    let data = [];
                                    for(var day in arr2[w]){
                                        data.push(arr2[w][day]);
                                    }
                                    echart2(id, this.everyDay, data, '空');
                                }
                            }
                        }
                    },300);

                })
            }

        },

        mounted(){
            this.year = moment().year();
            this.month = moment().month()+1;

            this.startTime = this.year+'-'+(this.month>=10?this.month:'0'+this.month);
            console.log(this.startTime);
            this.jiekoudiaoyong(this.startTime);

        }
    }
</script>

<style scoped>
    .top{
        width: 100%; height: 2rem; font-size: 0.8rem; color: #999; line-height: 2rem; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between;
        font-size: 0.7rem; background: #fff; margin-top: 0.4rem; box-sizing: border-box; padding: 0 0.6rem;
    }
    .top .cent2{
        color: #999;
    }
    .top .cent3{
        color: #438cff; display: flex;
    }
    .top .cent3 .c-1{
        display: flex;
    }
    .top .cent3 .c-1 .c-left{
        width: 1.4rem; height: 2rem; text-align: center;
    }
    .top .cent3 .c-1 .c-z{
        width: 2.5rem; text-align: center;
    }
    .top .cent3 .c-1 .c-z2{
        width: 1.5rem; text-align: center;
    }
    .top .cent3 .c-1 .c-right{
        width: 1.4rem; height: 2rem; line-height: 2rem; text-align: center;
    }
    .top .cent3 .c-1 img{
        width: 0.6rem; height: 0.9rem; display: inline; transform: translateY(0.2rem);
    }


    .EchartOne{
        background: #fff; margin-bottom: 0.5rem;
    }
    .EchartOne .nav{
        width: 100%; height: 1.75rem; line-height: 1.75rem; box-sizing: border-box; padding-left: 0.6rem;
        font-size: 0.6rem; color: #666; border-bottom: 1px solid #f4f4f4;
    }
    .EchartOne .box{
       width: 100%; height: 2rem; display: flex;
    }

    .EchartOne .box ul{
        width: 80%; height: 2rem; display: flex;
    }
    .EchartOne .box ul li{
        width: 25%; height: 2rem; line-height: 2rem; font-size: 0.6rem; color: #999; text-align: center;
    }
    .EchartOne .box ul li.active{
        color: #438CFF;
    }
    .EchartOne .box .left, .right{
        width: 10%; height: 2rem; box-sizing: border-box;
    }
    .EchartOne .box .left{
        padding: 0.5rem 0 0 0.6rem;
    }
    .EchartOne .box .right{
        text-align: right; padding: 0.5rem 0.6rem 0 0;
    }
    .EchartOne .box .left img, .right img{
        width: 0.9rem; height: 0.9rem; display: inline;
    }

    .EchartOne .tst{
        box-sizing: border-box; padding-left: 0.6rem; margin-bottom: 0.2rem;
    }
    .EchartOne .tst .t-1{
        font-size: 0.5rem; color: #666;
    }
    .EchartOne .tst .t-2{
        font-size: 0.4rem; color: #999;
    }

    .EchartOne .type{
        margin: 0.5rem 0;  height: 2rem; display: flex; width: 100%;
    }
    .EchartOne .type .cent{
        flex: 1; position: relative; overflow: hidden;
    }
    .EchartOne .type .t-1{
        height: 2rem; overflow-x: auto;  position: absolute; left: 0;
    }
    .EchartOne .type .t-1 li{
        width: 3.75rem; height: 2rem; line-height: 2rem; text-align: center; float: left; font-size: 0.6rem; color: #999;
    }
    .EchartOne .type .t-1 li.active{
        color: #438CFF;
    }
    .EchartOne .type .left, .right{
        width: 10%; height: 2rem; box-sizing: border-box; position: relative; z-index: 20;
    }
    .EchartOne .type img{
        width: 0.9rem; height: 0.9rem;
    }
    .EchartOne .type .left img{
        padding: 0.5rem 0 0 0.5rem;
    }
    .EchartOne .type .right img{
        padding: 0.5rem 0.5rem 0 0;
    }
</style>