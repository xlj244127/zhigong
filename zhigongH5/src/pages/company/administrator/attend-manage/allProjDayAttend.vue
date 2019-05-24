<template>
    <div data-page="allProjDayAttend" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">全部项目日考勤</div>
            </div>
        </div>
        <div class="page-content">
            <div class="line"></div>
            <div class="main">
                <div class="top">
                    <div class="top">
                        <div class="cent2">请选择日期</div>
                        <div class="cent3" @click.stop.prevent="alertAction">
                            <input type="text" v-model='date' readonly id="calendar-default">
                            <img src="../../../../../static/img/btn_drop_down.png"/>
                        </div>
                    </div>
                </div>
                <div class="nav2">
                    <div class="n-1">项目名称</div>
                    <div class="n-2">总人数</div>
                    <div class="n-2">异常人数</div>
                    <div class="n-2">异常率</div>
                </div>
                <div class="nav3" v-for="item in allProjDayAttend" @click="skipAction(item)">
                    <!--<a href="/company/projDayAttend/:id/">-->
                        <div class="n-1">{{item.projectName}}</div>
                        <div class="n-2">{{item.totalUsers}}</div>
                        <div class="n-2">{{item.attendException}}</div>
                        <div class="n-2">{{item.exceptionRate*100}}%</div>
                        <img class="fixed" src="../../../../../static/img/btn_right.png"/>
                    <!--</a>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { statisticalSummaryApi } from '../../../../api'
    import moment from 'moment'
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    var calendarInline;
    export default {
        data(){
            return{
                allProjDayAttend: {},
                date: '',
                yerDate:''
            }
        },
        methods:{
            skipAction(item){
                this.$router.load({url: '/company/projDayAttend/'+item.projectId});
                this.$store.state.projDayAttend = item;
                console.log('我获取了单个项目考勤');
                console.log(item);
            },
            alertAction(){
                calendarInline.open();
            },
        },
        mounted(){
            let storeDate =this.$store.state.chosenDay,
                storeYer  =this.$store.state.chosenYesterday;
            if(storeDate){
                console.log('getStore');
                this.date=storeDate;
                this.yerDate=storeYer;
                console.log(this.date,this.yerDate,'$store');
            }else{
                let year = moment().year();
                let month = (moment().month()+1)>=10?(moment().month()+1):'0'+(moment().month()+1);
                let day = moment().date()>=10?moment().date():'0'+moment().date();
                let yerDay = (moment().date()-1)>=10?(moment().date()-1):'0'+(moment().date()-1);
                this.date = year + '-' + month + '-' + day;
                this.$store.state.chosenDay=day;
                this.$store.state.chosenYesterday=yerDay;
                console.log(this.$store.state.chosenYesterday);
                console.log(this.$store.state.chosenDay,this.$store.state.chosenYesterday);
            }
            statisticalSummaryApi.allProjDayAttend(this.date).then((result)=>{
                console.log('获取到所有项目日考勤');
                console.log('allProjDayAttend',result);
                this.allProjDayAttend = result.data;
            })
            let that =this
            console.log('today',this.date,this.yerDate,this.$store.state.chosenYesterday);
            calendarInline = this.$f7.calendar({
                input: '#calendar-default',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                value: [this.date],
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    let $yesterday = moment().year(year).month(month).date(day-1).format('YYYY-MM-DD');
                    that.date = $day;
                    console.log(that.date);
                    console.log($yesterday);
                    statisticalSummaryApi.allProjDayAttend(that.date).then((result)=>{
                        console.log('获取到所有项目日考勤');
                        console.log(result);
                        this.allProjDayAttend = result.data;
                        that.$store.state.chosenDay=$day;
                        that.$store.state.chosenYersterday=$yesterday;
                    })
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
.line{
    width: 100%; height: 0.5rem;
}
.main{
    width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
}
.main .top{
    width: 100%; height: 2rem; color: #666; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
    display: flex; justify-content: space-between; font-size: 0.7rem;
}
#calendar-default{
    height: 1.9rem; border: none; text-align: right; font-size: 0.7rem; color: #438cff;
}
.main .top .cent2{
    color: #999;
}
.main .top .cent3{
    color: #438cff; position: relative; padding-right: 1rem;
}
.main .top .cent3 img{
    width: 0.9rem; height: 0.9rem; position: absolute; top: 0.5rem; right: 0px;
}

.main .nav3{
    position: relative;
}
.main .nav2, .nav3{
    display: flex; width: 100%; border-bottom: 1px solid #f4f4f4; font-size: 0.7rem; color: #666;
}
.nav3{
    width: 100%; display: flex; font-size: 0.7rem; color: #666;
}
.n-1{
    width: 6.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.n-2{
    flex: 1;
}

.main .nav2 div{
    height: 2rem; line-height: 2rem;
}
.main .nav3 div{
    height: 2.5rem; line-height: 2.5rem; box-sizing: border-box; padding-left: 0.25rem;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.main .nav3 .fixed{
    width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.8rem;
}
</style>