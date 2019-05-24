<template>
    <div data-page="projAbnormalAttend" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">{{this.groupName}}日考勤</div>
            </div>
        </div>
        <div class="page-content">
            <div class="top">
                <div class="cent2"><div class="tov">{{this.projectName}}</div><span style="float: left;"> -- </span><div class="tov">{{this.groupName}}</div> </div>
                <div class="cent3" @click.stop.prevent="alertAction">
                    <input type="text" v-model='date' readonly id="calendar-defaul">
                    <img src="../../../../../static/img/btn_drop_down.png"/>
                </div>
            </div>

            <div>
                <div v-show="isBin==false" id="groupPie"></div>
                <img id="gray" v-show="isBin==true" src="../../../../../static/img/bintu.png"/>
            </div>

            <div class="list-block accordion-list">
                <ul>
                    <li class="accordion-item"><a href="#" class="item-content item-link">
                        <div class="item-inner">
                            <div class="item-title">无考勤 &nbsp;&nbsp;&nbsp;<span>{{this.noAttend}}</span>人</div>
                        </div></a>
                        <div class="accordion-item-content" v-if="groupAttendDetail.noAttendItems!=''">
                            <div class="content-block" v-for="item in groupAttendDetail.noAttendItems" @click="enterDetail(item)">
                                <a>
                                    <span>{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                                    <img src="../../../../../static/img/btn_right.png"/>
                                </a>
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
                            <div class="item-title">缺卡 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{this.lackAttend}}</span>人</div>
                        </div></a>
                        <div class="accordion-item-content" v-if="groupAttendDetail.lackAttendItems!=''">
                            <div class="content-block" v-for="item in groupAttendDetail.lackAttendItems" @click="enterDetail(item)">
                                <a>
                                    <span>{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                                    <img src="../../../../../static/img/btn_right.png"/>
                                </a>
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
                            <div class="item-title">正常考勤 &nbsp;&nbsp;&nbsp;<span>{{this.normalAttend}}</span>人</div>
                        </div></a>
                        <div class="accordion-item-content" v-if="groupAttendDetail.normalAttendItems!=''">
                            <div class="content-block" v-for="item in groupAttendDetail.normalAttendItems" @click="enterDetail(item)">
                                <a>
                                    <span>{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                                    <img src="../../../../../static/img/btn_right.png"/>
                                </a>
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
    import {echart3} from '../../../../lib/echarts.js'
    import { statisticalSummaryApi,projectApi } from '../../../../api'
    var groupId;
    import moment from 'moment'
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    let calendarInline,projectId;
    export default {
        data(){
            return{
                projectName: '',
                groupName: '',
                groupAttendDetail: {},
                noAttend: '',
                normalAttend: '',
                lackAttend: '',
                date: '',
                xingqi: '',
                date:'',
                noData:'',
                lackData:'',
                normalData:'',
                isBin: false
            }
        },
        methods:{
            enterDetail(item){
                this.$router.load({url: '/company/normalAttendDetail/'+projectId+'/'+groupId+'/'+item.id})
            },
            dataNoZero(obj2){
                if(obj2 != 0) {
                   return obj2
                }else{
                    return ''
                }
            },
            alertAction(){
                calendarInline.open();
            },
            getData(day){
                if(groupId == -1){
                    statisticalSummaryApi.temperDayAttend(projectId, day).then((result)=>{
                        console.log('项目下面临时工考勤', result);
                        this.groupAttendDetail = result.data;
                        this.noAttend = result.data.noAttendItems.length;
                        this.normalAttend = result.data.normalAttendItems.length;
                        this.lackAttend = result.data.lackAttendItems.length;
                        this.noData=this.dataNoZero(result.data.noAttendItems.length);
                        this.normalData=this.dataNoZero(result.data.normalAttendItems.length);
                        this.lackData=this.dataNoZero(result.data.lackAttendItems.length);

                        if(this.noAttend==0 && this.normalAttend==0 && this.lackAttend==0){
                            this.isBin = true;
                        }else{
                            this.isBin = false;
                        }
                        echart3('groupPie', this.normalData, this.lackData, this.noData);
                    })
                }else if(groupId == -2){
                    statisticalSummaryApi.projerDayAttend(projectId, day).then((result)=>{
                        console.log('项目下项目管理员考勤', result);
                        this.groupAttendDetail = result.data;
                        this.noAttend = result.data.noAttendItems.length;
                        this.normalAttend = result.data.normalAttendItems.length;
                        this.lackAttend = result.data.lackAttendItems.length;
                        this.noData=this.dataNoZero(result.data.noAttendItems.length);
                        this.normalData=this.dataNoZero(result.data.normalAttendItems.length);
                        this.lackData=this.dataNoZero(result.data.lackAttendItems.length);

                        if(this.noAttend==0 && this.normalAttend==0 && this.lackAttend==0){
                            this.isBin = true;
                        }else{
                            this.isBin = false;
                        }
                        echart3('groupPie', this.normalData, this.lackData, this.noData);
                    })
                }else{
                    statisticalSummaryApi.groupingDayAttendSum(projectId, groupId, day).then((result)=>{
                        console.log('项目下面班组考勤', result);
                        this.groupAttendDetail = result.data;
                        this.noAttend = result.data.noAttendItems.length;
                        this.normalAttend = result.data.normalAttendItems.length;
                        this.lackAttend = result.data.lackAttendItems.length;
                        console.log('无 正常 缺',this.noAttend, this.normalAttend, this.lackAttend);
                        this.noData=this.dataNoZero(result.data.noAttendItems.length);
                        this.normalData=this.dataNoZero(result.data.normalAttendItems.length);
                        this.lackData=this.dataNoZero(result.data.lackAttendItems.length);

                        if(this.noAttend==0 && this.normalAttend==0 && this.lackAttend==0){
                            this.isBin = true;
                        }else{
                            this.isBin = false;
                        }

                        echart3('groupPie', this.normalData, this.lackData, this.noData);
                    })
                }
            }
        },
        mounted(){
            projectId = this.$route.params.projId;
            groupId = this.$route.params.groupId;
            projectApi.projectDetail(projectId).then((res)=>{
                this.projectName=res.data.name;
                this.$store.state.name = res.data.name;
            })
            this.groupName = this.$store.state.groupName;

            if(this.$store.state.today){
                this.date = this.$store.state.today;
                this.getData(this.date);
            }else{
                let year = new Date(new Date().getTime()).getFullYear();
                let month = new Date(new Date().getTime()).getMonth()+1;
                month = month>9?month:'0'+month;
                let day  = new Date(new Date().getTime()).getDate()>9?new Date(new Date().getTime()).getDate():'0'+new Date(new Date().getTime()).getDate();
                this.date = year + '-' + month + '-' + day;
                console.log(this.date);

                this.getData(this.date)
            }
            let that = this;
            calendarInline = this.$f7.calendar({
                input: '#calendar-defaul',
                dateFormat: 'yyyy-MM-dd',
                maxDate: moment().format('YYYY-MM-DD'),
                monthNames, dayNames, dayNamesShort,
                value: [this.date],
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    that.date = $day;
                    that.$store.state.today = $day;
                    that.getData($day)
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
    .header{
        box-sizing: border-box; padding: 1rem 0 0.5rem 0.6rem;
    }
    .header .h-1{
        font-size: 0.7rem; color: #999;
    }

    .top{
        width: 100%; height: 2rem; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
        display: flex; justify-content: space-between; background: #fff;
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .top .cent2{
        color: #999; font-size: 0.6rem; color: #999;
    }
    .top .cent3{
        color: #438cff; font-size: 0.7rem;
    }

    .list-block{
        margin: 0; margin-top: 0.5rem;
    }
    .list-block .item-content{
        min-height: 2.5rem;
    }
    .list-block .item-title{
        font-size: 0.7rem; color: #438cff;
    }
    .list-block .accordion-item .content-block a{
        height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; display: flex; justify-content: space-between;
        box-sizing: border-box; padding: 0 0.75rem;
    }
    .list-block .accordion-item .content-block img{
        width: 0.9rem; height: 0.9rem; padding-top: 0.8rem;
    }
    .cent3{
        color: #438cff; position: relative; padding-right: 1rem;
        float: right;
    }
    .cent3 img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.5rem; right: 0px;
    }
    #calendar-defaul {
        height: 1.9rem;
        border: none;
        text-align: right;
        font-size: 0.7rem;
        color: #438cff;
    }
    #groupPie{
        width: 100%;
        height: 14rem;
        background: #ffffff;
    }
    #gray{
        width: 8rem; height: 8rem; display: block; margin: 1.5rem auto;
    }
    .tov{
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space:nowrap;
        overflow: hidden;
        max-width: 4.2rem;
    }
    div.tov{
        float: left;
    }
    .accordion-item-noText{
        font-size: 0.7rem;
        line-height: 3;
        border-top: 1px solid #eee;
        text-align: center;
        color: #666666;
    }
</style>