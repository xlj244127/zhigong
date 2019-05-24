<template>
    <f7-page name="normalAttendDetail"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">考勤详情</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <div class="top">
                    <div class="cent2">请选择日期</div>
                    <div class="cent3" @click.stop.prevent="alertAction">
                        <input type="text"  v-model="this.date" readonly id="calendar-default">
                        <img src="../../../../../static/img/btn_drop_down.png"/>
                    </div>
                </div>
                <div class="cont">
                    <div class='left'>
                        <ul>
                            <li>姓名:<span>{{personAttend.name}}</span></li>
                            <li>考勤结果:&nbsp;&nbsp;<span class="tst" :class='{org:lackStatus,red:noStatus,green:normalStatus}'>{{attendResult}}</span></li>
                            <li><span>工作时长:</span>&nbsp;&nbsp;<span class="color" :class='{org:lackStatus,red:noStatus,green:normalStatus}'><i v-if="noStatus">今日无记录</i><i v-else-if="lackStatus">今日无完整考勤</i><i v-else>{{lastTime}}</i></span></li>
                        </ul>
                    </div>
                    <div class='right'>
                        <img :src="this.avatar"/>
                    </div>
                </div>
            </div>

            <div class="attendTab">
                <ul>
                    <li class='item' :class="{bgOrg:item.bgOrg,bgGreen:item.bgGreen}"  v-for='(item,index) in timeList' @click='showTip(item,index)'>
                        {{item.h}}:{{item.m}}
                        <img src="../../../../../static/img/gt1Img.png" alt="" class='gt1' v-if='item.gt1'>
                        <div class="tip"  v-if='item.show'>
                            <div class="text" v-for='(textItem) in item.text'>
                                {{textItem}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="cover"  v-if='coverShow' @click="closeCover">

            </div>
        </div>
    </f7-page>
</template>

<script>
    import { statisticalSummaryApi } from '../../../../api'
    import { userApi } from '../../../../api'
    import moment from 'moment'
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    let calendarInline;
    var projectId;
    var userId;
    var groupId;
    export default {
        data() {
            return {
                date: '',
                personAttend: {},
                workingTime: '',
                lastTime:'00小时00分钟',
                timeList:[{
                    h:'00', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'01', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'02', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'03', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'04', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'05', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'06', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'07', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'08', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'09', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'10', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'11', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'12', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'13', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'14', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'15', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'16', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'17', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'18', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'19', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'20', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'21', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'22', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]},{
                    h:'23', m:'00', bgOrg:false, bgGreen:false, gt1:false, show:false, text:[]
                }],
                attendResult:'',
                noStatus:false,
                lackStatus:false,
                normalStatus:false,
                today:'',
                coverShow:false,
                timeIndex:'',
                avatar: ''
            }
        },
        methods: {
            alertAction(){
                calendarInline.open();
            },
            closeCover(){
                this.coverShow=false;
                this.timeList[this.timeIndex].gt1=true
                this.timeList[this.timeIndex].show=false;
            },
            setFormat(x){
                if (x < 10) {
                    x = "0" + x;
                }
                return x;
            },
            transtimestamp(timestamp,type){
                if(timestamp==null||timestamp==''){
                    return '';
                }
                var date = new Date(timestamp),
                h = this.setFormat(date.getHours()),
                hIndex = date.getHours(),
                m = this.setFormat(date.getMinutes());
                if(type =='hour'){
                    return [hIndex,h]
                }else if(type =='minute'){
                    return m
                }
            },
            isRepeat(arr){
                var hash = {};
                for(var i in arr) {
                    if(hash[arr[i]])
                        return true;
                    hash[arr[i]] = true;
                }
                return false;
            },
            showTip(val,index){
                if(val.bgGreen==true){
                    if(val.gt1 == true){
                        val.gt1=false
                        this.timeList[index].show=true;
                        this.coverShow=true
                    }else{
                        val.gt1=true
                        this.timeList[index].show=false;
                        this.coverShow=false
                    }
                    this.timeIndex=index;
                }
            },
            getAttendDetail(date) {
                statisticalSummaryApi.DayAttendDetail(userId, date, projectId, groupId).then((result)=>{
                    console.log('我得到了数据');
                    console.log(result);
                    this.personAttend = result.data;
                    let arr = result.data.attendItems;
                    //console.log(arr,new Date());
                    if(arr.length==0){
                        this.attendResult='无考勤';
                        this.noStatus=true;
                        this.lackStatus=false;
                        this.normalStatus =false;
                        //timeList 初始化
                        for(var j=0; j<this.timeList.length; j++){
                            this.timeList[j].bgGreen =false
                            this.timeList[j].gt1 =false
                            this.timeList[j].bgOrg =false
                            this.timeList[j].m ='00'
                        }
                    } else if(arr.length==1 ){
                        this.attendResult='缺卡';
                        this.noStatus=false;
                        this.lackStatus=true;
                        this.normalStatus =false;
                        for(var j=0; j<this.timeList.length; j++){
                            this.timeList[j].bgGreen =false
                            this.timeList[j].bgOrg =false
                            this.timeList[j].gt1 =false
                            this.timeList[j].m ='00'
                        }
                        var timeStr = arr[0].attendTime,
                        hIndex=this.transtimestamp(timeStr,'hour')[0],
                        h=this.transtimestamp(timeStr,'hour')[1],
                        m=this.transtimestamp(timeStr,'minute');
                        //console.log(h,m);
                        this.timeList[hIndex].m=m;//修改对应区域分钟
                        this.timeList[hIndex].bgOrg=true;//修改对应区域分钟
                    }else{
                        this.attendResult ='正常';
                        this.noStatus=false;
                        this.normalStatus =false;
                        this.normalStatus =true;
                        var first,last,lastStr,lastH,lastM,hIndexArr=[],hArr=[],mArr=[];
                        for(var j=0; j<this.timeList.length; j++){
                            this.timeList[j].bgGreen =false
                            this.timeList[j].bgOrg =false
                            this.timeList[j].gt1 =false
                            this.timeList[j].m ='00'
                        }
                        for(var i=0; i<arr.length; i++){
                            hIndexArr.push( this.transtimestamp(arr[i].attendTime,'hour')[0]);
                            hArr.push( this.transtimestamp(arr[i].attendTime,'hour')[1]);
                            mArr.push( this.transtimestamp(arr[i].attendTime,'minute'));
                            //console.log(hArr,mArr);
                            this.timeList[hIndexArr[i]].m=mArr[i];//修改对应区域分钟
                            this.timeList[hIndexArr[i]].bgGreen=true;//修改对应区域分钟
                            this.timeList[hIndexArr[i]].gt1=true;//修改对应区域分钟
                            this.timeList[hIndexArr[i]].text[i]='第'+(i+1)+'次考勤:'+hArr[i]+':'+mArr[i];//修改对应区域分钟

                            first = arr[0].attendTime;
                            last = arr[arr.length-1].attendTime;
                        }
                        lastStr = Math.abs(last-first);
                        console.log('==========================================',lastStr);
                        var hIndex=this.transtimestamp(first,'hour')[0],
                             m=this.transtimestamp(first,'minute');
                        this.timeList[hIndex].m=m;//修改对应区域分钟
                        this.timeList[hIndex].bgOrg=true;//修改对应区域分钟
                        this.timeList[hIndex].gt1=true;//
                        lastH=Math.floor(lastStr/1000/60/60);
                        lastM=Math.floor(lastStr/1000/60%60);
                        //console.log('lastStr',lastStr,lastH,lastM);
                        this.lastTime = lastH+'小时'+lastM+'分钟';
                    }
                });
            }
        },
        mounted() {
            projectId = this.$route.params.projId;
            groupId = this.$route.params.groupId;
            userId = this.$route.params.userId;

            userApi.userDetail(userId).then((result)=>{
                this.avatar = result.data.avatar;     //个人详情里的图片
                console.log('============================',result);
            })

            if(this.$store.state.today){
                this.date = this.$store.state.today,
                this.getAttendDetail(this.date)
            }else{
                let year = new Date(new Date().getTime()).getFullYear();
                let month = new Date(new Date().getTime()).getMonth()+1;
                month = month>9?month:'0'+month;
                let day  = new Date(new Date().getTime()).getDate()>9?new Date(new Date().getTime()).getDate():'0'+new Date(new Date().getTime()).getDate();
                this.date = year + '-' + month + '-' + day;

                console.log(this.date);
                this.getAttendDetail(this.date)
            }

            var that =this;
            calendarInline = this.$f7.calendar({
                input: '#calendar-default',
                dateFormat: 'yyyy-MM-dd',
                maxDate: moment().format('YYYY-MM-DD'),
                monthNames, dayNames, dayNamesShort,
                value: [this.date],
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    that.date = $day;
                    that.getAttendDetail(that.date);
                    p.close();
                }
            });
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .main{
        width: 100%; background: #fff; margin-top: 0.5rem; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .head{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem;color: #999; border-bottom: 1px solid #f4f4f4;
    }
    .main .cont{
        width: 100%; display: flex; border-bottom: 1px solid #f4f4f4;
    }
    .main .cont .left{
        flex: 1;
    }
    .main .cont .left ul li{
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 11rem;
    }
    .main .cont .left ul li, .main .foot ul li{
        height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666;
    }
    .main .cont .right{
        width: 4.8rem; height: 6.4rem; border: 1px solid #ccc; margin: 0.8rem 0.75rem 0 0;
    }
    .main .cont .right img{
        width: 100%; height: 100%;
    }
    .main .foot ul li{
        border-bottom: 1px solid #f4f4f4;
    }
    .main .foot ul li .tst{
        color: #438cff;
    }

    .attendTab{
        line-height: 2.6rem;
        background: #ffffff;
        padding: 1rem 0;
    }
    .attendTab ul{
        width: 90%;
        margin: 0 auto;
        border-top: 1px solid #333;
        border-left: 1px solid #333;
        border-right: 1px solid #333;
        height:calc(10.4rem + 0.2rem)
    }
    .attendTab .item{
        width: 16.66%;
        float: left;
        box-sizing: border-box;
        border-right: 1px solid #333;
        border-bottom: 1px solid #333;
        text-align: center;
        position: relative;
    }

    .attendTab .item:nth-child(6n){
        border-right: none;
    }

    .attendTab .item.bgOrg{
        background: #fd913a;
    }
    .attendTab .item.bgGreen{
        background: #05CB00;
    }
    
    i{
        font-style: normal;
    }
    .red{
        color: #ed4444 !important;
    }
    .org{
        color: #fd913a !important;
    }
    .green{
        color: #05CB00 !important;
    }
    .top{
        width: 100%; height: 2rem; font-size: 0.8rem; color: #999; line-height: 2rem; border-bottom: 1px solid #ccc;
        display: flex; justify-content: space-between; font-size: 0.7rem;
    }
    .top .cent2{
        color: #999;
    }
    .top .cent3{
        color: #438cff; position: relative; padding-right: 1rem;
    }
    .top .cent3 #calendar-default{
        height: 1.9rem; border: none; text-align: right; font-size: 0.7rem; color: #438cff;
    }
    .top .cent3 img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.5rem; right: 0px;
    }
    .gt1{
        position: absolute;
        right: 0.1rem;
        top: 0.1rem;
        width: 0.6rem;
        height: 0.6rem;
    }
    .tip{
        position: absolute;
        left: 50%;
        top:50%;
        transform:translate(-50%,-50%);
        width: 5.6rem;
        padding: 0.25rem 0.6rem;
        line-height: 0.8rem;
        font-size: 0.7rem;
        text-align: center;
        z-index: 100;
        background: #ddd;
        -webkit-border-radius: 0.25rem;
        -moz-border-radius: 0.25rem;
        border-radius: 0.25rem;
    }
    .attendTab .item:nth-child(6n) .tip{
        transform:translate(-100%,-50%);
        left: 100%;
    }
    .attendTab .item:nth-child(6n+1) .tip{
        transform:translate(0,-50%);
        left: 0%;
    }
    .cover{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,.5);

    }
</style>