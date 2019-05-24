<template>
    <div class="main" @page:reinit="back">
        <div class="content">
            <div class="block">
                <div class="head">
                    <a href="/user/groupAttend/">
                        <span>班组考勤</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <div class="center" v-if="attendCount !== null">
                    <div class="center-1">{{today}}</div>
                    <div class="center-2">
                        <div class="span"><span class="span-1">总人数</span><br/><span class="span-2">{{totalUsers}}</span><span class="span-3">人</span><br/><span class="span-4">昨:{{yesterdayAttend.totalUsers}}人</span></div>
                        <div class="span"><span class="span-1">已考勤</span><br/><span class="span-2">{{attendCount}}</span><span class="span-3">人</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.attendCount)}}人</span></div>
                        <div class="span"><span class="span-1">异常考勤</span><br/><span class="span-2 span-red">{{attendException}}</span><span class="span-3 span-red">人</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.attendException)}}人</span></div>
                    </div>
                    <div class="center-3">
                        <div class="span"><span class="span-1">考勤率</span><br/><span class="span-2">{{attendRate}}</span><span class="span-3">%</span><br/><span class="span-4">昨:{{yesterdayAttendRate}}%</span></div>
                        <div class="span"><span class="span-1">平均工时</span><br/><span class="span-2">{{averDuration}}</span><span class="span-3">小时</span><br/><span class="span-4">昨:{{zero(yesterdayAttend.averDuration)}}小时</span></div>
                    </div>
                </div>
                <div class="top" v-else>
                    暂无班组数据
                </div>
            </div>
            <div class="block">
                <div class="head">
                    <a href="/user/searchJob/">
                        <span>找活干/找工人</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <div>
                    <div class="put">
                        <div class="box">
                            <span>招工项目</span>
                            <br/>
                            <span class="size">{{findWork.countProject}}</span><span class="size2">个</span>
                        </div>
                        <div class="box">
                            <span>招工工种</span>
                            <br/>
                            <span class="size">{{findWork.countWorkTypeProject}}</span><span class="size2">个</span>
                        </div>
                        <div class="box">
                            <span>招工人数</span>
                            <br/>
                            <span class="size">{{findWork.countDemandProject}}</span><span class="size2">人</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="block">
                <div class="head">
                    <a href="/user/myGroup/">
                        <span>我的班组</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <div class="top" v-if="groupId==0 || companyRole==1 || companyRole==2">
                    暂无班组数据
                </div>
                <div v-else>
                    <div class="puut">
                        <div class="pt">班组成员数:<span>{{zero(groupMemberCount)}}人</span></div>
                    </div>
                    <ul class="aul">
                        <li>
                            <div class="right"><span class="r-1">未录入身份证:</span><span class="r-2">{{zero(withoutIDCount)}}人</span></div>
                            <div class="right left"><span class="r-1">未录入人脸:</span><span class="r-2">{{zero(withoutFaceCount)}}人</span></div>
                        </li>
                    </ul>
                    <div class="projs">
                        <div class="p-1">当前考勤项目:</div>
                        <div class="p-2">
                            <span v-for="item in projects">{{item.name.length>10?item.name.substr(0,9)+'...':item.name}}/</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="block">
                <div class="head">
                    <a href="/user/myAttend/">
                        <span>我的考勤</span>
                        <img src="../../../static/img/btn_right.png"/>
                    </a>
                </div>
                <div class="top" v-if="monthAttendAll">
                    暂无考勤数据
                </div>
                <div v-else>
                    <div class="caption">{{currentMonth}}</div>
                    <div class="put">
                        <div class="box">
                            <span>正常考勤</span>
                            <br/>
                            <span class="size">{{zero(monthAttendNormal)}}</span><span class="size2">次</span>
                        </div>
                        <div class="box">
                            <span>异常考勤</span>
                            <br/>
                            <span class="size3">{{zero(monthAttendException)}}</span><span class="size4">次</span>
                        </div>
                        <div class="box">
                            <span>合计工时</span>
                            <br/>
                            <span class="size">{{zero(monthAttendDuration)}}</span><span class="size2">小时</span>
                        </div>
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
                        <span v-if='userDetail.idNumber==null'><a href="/company/addIdentityCard/"><img src="../../../static/img/person_certify.png" alt=""></a></span>
                        <span v-else><img src="../../../static/img/person_certified.png" alt=""></span>
                        <span v-if='faced==1'><img src="../../../static/img/person_recorded.png" alt=""></span>
                        <span v-else @click="alertAction"><img src="../../../static/img/person_record.png" alt=""></span>
                    </div>
                    <div class="pt">班组：<span>{{groupName?groupName:noGroup}}</span></div>
                    <div class="pt2">当前所属项目组：<span v-if="projectName">{{projectName.length>30?projectName.substr(0,30)+'...':projectName}}</span><span v-else>{{noProject}}</span></div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import { userApi, statisticalSummaryApi, projectApi, wxApi} from '../../api'
    import moment from 'moment'
    export default {
        name: "grouperhave-attend",
        data() {
            return {
                findWork: {},
                groupId: 0,
                projectId: 0,
                currentMonth: '',
                today: '',
                yesterday: '',
                projects: '',
                idNumber: null,
                totalUsers: null,
                attendCount: null,
                attendException: null,
                monthAttendAll: null,
                monthAttendNormal: null,
                monthAttendException: null,
                monthAttendDuration: null,
                attendRate: null,
                averDuration: null,
                groupCount: null,
                groupName: '',
                groupTypeNames: '',
                groupMemberCount: 0,
                withIDCount: 0,
                withoutIDCount: 0,
                withFaceCount: 0,
                withoutFaceCount: 0,
                wgLeader: '',
                projectName: '',
                noGroup:'当前无班组',
                noProject:'当前无项目组',
                faced:'',
                userDetail: {},
                yesterdayAttend: {},
                yesterdayAttendRate:''
            }
        },
        props: ["companyRole"],
        methods: {
            zero(value) {
                if(value)
                    return value;
                else
                    return 0;
            },
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
                    console.log(result);
                    this.$store.state.summary_type2 = result.data;
                    this.totalUsers = this.$store.state.summary_type2.totalUsers;
                    this.attendCount = this.$store.state.summary_type2.attendCount;
                    this.attendNormal = this.$store.state.summary_type2.attendNormal;
                    this.attendException = this.$store.state.summary_type2.attendException;
                    this.monthAttendAll = this.$store.state.summary_type2.monthAttendAll;
                    this.monthAttendNormal = this.$store.state.summary_type2.monthAttendNormal;
                    this.monthAttendException = this.$store.state.summary_type2.monthAttendException;
                    this.monthAttendDuration = this.$store.state.summary_type2.monthAttendDuration;
                    if(this.$store.state.summary_type2.attendRate){
                        this.attendRate = Math.round(this.$store.state.summary_type2.attendRate*100);
                    }else{
                        this.attendRate = 0
                    }
                    this.averDuration = this.$store.state.summary_type2.averDuration;
                    this.groupCount = this.$store.state.summary_type2.groupCount;
                    this.groupName = this.$store.state.summary_type2.groupName;
                    this.groupTypeNames = this.$store.state.summary_type2.groupTypeNames;
                    this.groupMemberCount = this.$store.state.summary_type2.groupMemberCount;
                    this.withIDCount = this.$store.state.summary_type2.withIDCount;
                    this.withoutIDCount = this.$store.state.summary_type2.withoutIDCount;
                    this.withFaceCount = this.$store.state.summary_type2.withFaceCount;
                    this.withoutFaceCount = this.$store.state.summary_type2.withoutFaceCount;
                    this.projectName = this.$store.state.summary_type2.projectName;
                    this.wgLeader = this.$store.state.summary_type2.groupName;

                    console.log('我的班组',this.groupMemberCount, this.withoutIDCount, this.withoutFaceCount);
                });
                wxApi.grouperHome().then((result)=>{
                    console.log('合作',result.data);
                    this.findWork = result.data;
                })
            },
            alertAction(){
                this.$f7.alert('请联系项目管理员进行录脸');
            }
        },
        mounted() {
            console.log('调用了');
            this.currentMonth = moment().format('YYYY年MM月');
            this.today = moment().format('YYYY年MM月DD日');
            if(this.$store.state.roleInfo){
                this.projectId = this.$store.state.roleInfo.projectId;
                this.groupId = this.$store.state.roleInfo.groupId;
            }
            this.faced = this.$store.state.userInfo.faced;
            console.log("roleInfo",this.faced ,this.$store.state);
            this.getSummary();

            userApi.detail().then((result)=>{
                console.log('我调用了个人详情')
                console.log(result);
                this.$store.state.userDetail = result.data.userDetail;
                this.userDetail = result.data;
            });

            this.yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
            console.log(this.yesterday);
            statisticalSummaryApi.dayAttend(2, this.yesterday).then((result)=>{
                console.log('我请求到了昨日的项目考勤');
                console.log(result);
                this.yesterdayAttend = result.data;
                if(result.data.attendRate){
                    this.yesterdayAttendRate=Math.round(result.data.attendRate*100)
                }else{
                    this.yesterdayAttendRate=0
                }
            })

            projectApi.userProjs().then((result)=>{
                console.log('我获取了班组长所在的所有项目');
                console.log(result);
                this.projects = result.data;
                this.$store.state.projects = result.data;
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
        width: 100%; height: 4.5rem;  text-align: center; min-height: 4.5rem;
        padding: 1.5rem; box-sizing: border-box; background: #fff;
    }
    .main .put{
        display: flex; justify-content: space-between;
    }
    .main .put .box{
        width: 4.55rem; height: 3.5rem; text-align: center; box-sizing: border-box; padding-top: 0.6rem;
        font-size: 0.65rem; color: #666;
    }
    .main .put .box .size{
        font-size: 1.15rem; color: #438cff;
    }
    .main .put .box .size2{
        color: #438cff; font-size: 0.7rem;
    }
    .main .put .box .size3{
        font-size: 1.15rem; color: #ef7373;
    }
    .main .put .box .size4{
        color: #ef7373; font-size: 0.7rem;
    }

    .main .block .center .center-1{
        font-size: 0.7rem; color: #666; height: 1.5rem; line-height: 1.5rem;
    }
    .main .block .center .center-2{
        width: 100%; display: flex; justify-content: space-between;
    }
    .main .block .center .span{
        width: 4.5rem; height: 3.5rem; display: block; text-align: center; box-sizing: border-box; padding-top: 0.6rem;
    }
    .main .block .center .span .span-1{
        font-size: 0.7rem; color: #666;
    }
    .main .block .center .span .span-2{
        font-size: 1.15rem; color: #438cff;
    }
    .main .block .center .span .span-3{
        font-size: 0.7rem; color: #438cff;
    }
    .main .block .center .span .span-4{
        font-size: 0.5rem; color: #999;
    }
    .main .block .center .span .span-2.span-red{
        color: #ef7373;
    }
    .main .block .center .span .span-3.span-red{
        color: #ef7373;
    }
    .main .block .center .center-3{
        width: 100%; display: flex; justify-content: space-around; margin: 0.4rem 0 1.25rem 0;
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
        margin-left: 6px;
    }
    .main .block .puut .recorded{
        padding-top: 0.1rem;
    }
    .main .block .puut .recorded img{
        width: 4rem;
        height: 1.2rem;

    }
    .main .block .puut .pt2{
        font-size: 0.65rem; color: #438cff;  padding-bottom: 1.25rem;
    }
    .main .block .aul{
        width: 100%;
    }
    .main .block .aul li{
        display: flex; font-size: 0.65rem; height: 1.5rem; line-height: 1.5rem;
    }
    .main .block .aul li .right{
        width: 36%; display: flex; justify-content: space-between;
    }
    .main .block .aul li .left{
        margin-left: 2.1rem;
    }
    .main .block .aul li .right .r-1{
        color: #666;
    }
    .main .block .aul li .right .r-2{
        color: #ef7373;
    }

    .projs{
        width: 100%; display: flex; font-size: 0.7rem; color: #666; max-height: 97px; overflow: hidden; margin-bottom: 0.5rem;
    }
    .projs .p-1{
        width: 5rem;
    }
    .projs .p-2{
        flex: 1; width: 100%; display: flex; flex-wrap: wrap;
    }
</style>