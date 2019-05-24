<template>
    <div class="main" @page:reinit="back">
        <div class="content">
            <div class="block">
                <div class="head">
                    <a href="/user/myAttend/">
                        <span>我的考勤</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <div class="top" v-if="monthAttendAll === null">
                    暂无考勤数据
                </div>
                <div v-else>
                    <div class="caption">{{currentMonth}}</div>
                    <div class="top">
                        <div class="box">
                            <span>正常考勤</span>
                            <br/>
                            <span class="size">{{monthAttendNormal}}</span><span class="size2">次</span>
                        </div>
                        <div class="box">
                            <span>异常考勤</span>
                            <br/>
                            <span class="size3">{{monthAttendException}}</span><span class="size4">次</span>
                        </div>
                        <div class="box">
                            <span>合计工时</span>
                            <br/>
                            <span class="size">{{monthAttendDuration}}</span><span class="size2">小时</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="block">
                <div class="head">
                    <a href="/user/workSearchJob/">
                        <span>找工作</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <div class="top top2">
                    <div class="box">
                        <span>招工工种</span>
                        <br/>
                        <span class="size">{{findWork.countWorkTypeGroup}}</span><span class="size2">个</span>
                    </div>
                    <div class="box">
                        <span>招工人数</span>
                        <br/>
                        <span class="size">{{findWork.countDemandGroup}}</span><span class="size2">人</span>
                    </div>
                </div>
            </div>
            <div class="block">
                <div class="head">
                    <a href="/user/personCenter/">
                        <span>个人中心</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <div class="puut">
                    <div class="pt">
                        <span>{{(userDetail.name?userDetail.name:userDetail.nickname)?(userDetail.name?userDetail.name:userDetail.nickname):userDetail.mobile}}</span>
                        <span v-if='userDetail.userDetail.idNumber==null'><a href="/company/addIdentityCard/"><img :src="certify" alt=""></a></span>
                        <span v-else><img :src="certified" alt=""></span>
                        <span v-if='faced==1'><img :src="recorded" alt=""></span>
                        <span v-else @click="alertAction"><img :src="record" alt=""></span>
                    </div>
                    <div class="pt">班组：<span>{{groupName?groupName:'当前无班组'}}</span></div>
                    <div class="pt2">当前所属项目组：<span>{{projectName?projectName:'当前无项目'}}</span></div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { userApi, statisticalSummaryApi, wxApi } from '../../api'
    import certify from '../../../static/img/person_certify.png'
    import certified from '../../../static/img/person_certified.png'
    import record from '../../../static/img/person_record.png'
    import recorded from '../../../static/img/person_recorded.png'
    import moment from 'moment'

    export default {
        name: "workerhave-attend",
        data() {
            return {
                findWork: {},
                currentMonth: '',
                idNumber: null,
                monthAttendAll: null,
                monthAttendNormal: null,
                monthAttendException: null,
                monthAttendDuration: null,
                projectName: '',
                groupName: '',
                certify: certify,
                certified: certified,
                record: record,
                recorded: recorded,
                faced:'',
                userDetail: {}
            }
        },
        methods: {
            back(){
                userApi.detail().then((result)=>{
                    console.log('我调用了个人详情')
                    console.log(result);
                    this.$store.state.userDetail = result.data.userDetail;
                    this.userDetail = result.data;
                });
            },
            getSummary() {
                statisticalSummaryApi.summary(2).then((result)=>{
                    console.log("工人首页",result);
                    this.$store.state.summary_type2 = result.data;
                    this.monthAttendAll = this.$store.state.summary_type2.monthAttendAll;
                    this.monthAttendNormal = this.$store.state.summary_type2.monthAttendNormal;
                    this.monthAttendException = this.$store.state.summary_type2.monthAttendException;
                    this.monthAttendDuration = this.$store.state.summary_type2.monthAttendDuration;
                    this.projectName = this.$store.state.summary_type2.projectName;
                    this.groupName = this.$store.state.summary_type2.groupName;
                })
                wxApi.workerHome().then((result)=>{
                    console.log('合作',result.data);
                    this.findWork = result.data;
                })
            },
            alertAction(){
                this.$f7.alert('请联系项目管理员进行录脸');
            }
        },
        mounted() {
            this.currentMonth = moment().format('YYYY年MM月');
            this.getSummary();
            this.faced=this.$store.state.userInfo.faced;

            userApi.detail().then((result)=>{
                console.log('个人信息', result);
                this.$store.state.userDetail = result.data.userDetail;
                this.userDetail = result.data;
            });

        }
    }
</script>

<style scoped>
    .main{
        width: 100%; background: #f4f4f4; overflow: hidden;
    }
    .main .content{
        box-sizing: border-box; padding: 0 0.75rem 1.25rem 0.75rem;
    }
    .main .block{
        width: 100%; border: 1px solid #ccc; border-radius: 0.9rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
        margin-top: 0.75rem;
    }
    .main .block .head{
        width: 100%; height: 2rem; line-height: 2rem; border-bottom: 1px solid #ccc;
        position: relative;
    }
    .main .block .head a{
        width: 100%; height: 100%; display: block; font-size: 0.8rem; color: #333;
    }
    .main .block .head img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.6rem; right: 0px;
    }
    .main .top{
        width: 100%; height: 4.5rem; display: flex; justify-content: space-between; padding: 0.6rem; box-sizing: border-box;
        background: #fff;
    }
    .main .top2{
        display: flex; justify-content: space-around;
    }
    .main .top .box{
        width: 4.55rem; height: 3.5rem; text-align: center; box-sizing: border-box; padding-top: 0.6rem;
        font-size: 0.65rem; color: #666;
    }
    .main .top .box .size{
        font-size: 1.15rem; color: #438cff;
    }
    .main .top .box .size2{
        color: #438cff; font-size: 0.7rem;
    }
    .main .top .box .size3{
        font-size: 1.15rem; color: #ef7373;
    }
    .main .top .box .size4{
        color: #ef7373; font-size: 0.7rem;
    }

    .main .caption{
        font-size: 0.7rem; color: #666; height: 1.5rem; line-height: 1.5rem;
    }

    .main .block .puut{
        padding-top: 0.6rem;
    }
    .main .block .puut .pt{
        font-size: 0.65rem; color: #666;
    }
    .main .block .puut{
        padding-top: 0.5em;
    }
    .main .block .puut .pt{
        padding-top:  0.25rem; font-size: 0.65rem; color: #666;
        line-height: 1.2rem;
    }
    .main .block .puut .pt img{
        height: 1.2rem;
        vertical-align: middle;
        margin-left: 0.3rem;
    }
    .main .block .puut .recorded{
        groupInfoEnteringListpadding-top: 0.1rem;
    }
    .main .block .puut .recorded img{
        width: 4rem;
        height: 1.2rem;

    }
    .main .block .puut .pt2{
        font-size: 0.65rem; color: #438cff;  padding-bottom: 1.25rem;
    }
    .main .block .aul li{
        display: flex; font-size: 0.65rem; height: 1.5rem; line-height: 1.5rem;
    }
</style>