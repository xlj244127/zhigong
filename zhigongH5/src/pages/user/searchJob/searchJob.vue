<template>
    <div data-page="searchJob" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">找项目/找工人</div>
                <div class="right" @click="refreshAction"><a href="#">刷新</a></div>
            </div>
        </div>
        <!---侧边栏--->
        <group-nav></group-nav>
        <!--页面主要类容-->
        <div class="page-content infinite-scroll">
            <div class="nav">
                <div class="n" @click="oneBtn"><span :class="{active: isShow==1}">项目分包</span></div>
                <div class="n" @click="twoBtn"><span :class="{active: isShow==2}">找工人</span></div>
                <div class="n" @click="threeBtn"><span :class="{active: isShow==3}">找活干</span></div>
            </div>
            <div>
                <div class="aside">
                    <div class="asd" @click="addIdentityCard">
                        <a href="#">
                            <img src="../../../../static/img/personShimingrenzheng.png"/><br/>
                            <span>实名认证</span>
                        </a>
                    </div>
                    <div class="asd" @click="shareAction2">
                        <img src="../../../../static/img/grouprenzheng.png"/><br/>
                        <span>班组认证</span>
                    </div>
                    <div class="asd" @click="sendHistory">
                        <a href="#">
                            <img src="../../../../static/img/lianxijilu.png"/><br/>
                            <span>联系记录</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="logo">
                <div class="log">
                    <div class="left">积分可免费联系 项目 班组 工人</div>
                    <div class="right">剩余: {{this.number}} 积分</div>
                </div>
                <div class="log2">
                    <div class="shang">
                        <img @click="shareAction" src="../../../../static/img/yaoqinghaoyou.png"/>
                        <img v-show="this.isSignin==true" @click="signinAction" src="../../../../static/img/qiandao.png"/>
                        <img v-show="this.isSignin==false" @click="signinAction" src="../../../../static/img/qiandaohou.png"/>
                    </div>
                    <div class="xia">
                        <img @click="xiazaiAction" src="../../../../static/img/xiazaiduijifeng.png"/>
                        <img @click="goumaiAction" src="../../../../static/img/goumaijifeng.png"/>
                    </div>
                </div>
            </div>
            <div class="marquee">
                <div class="marquee_box">
                    <ul class="marquee_list" :class="{marquee_top:animate}">
                        <li v-for="(item, index) in marqueeList">
                            <a :href="item.link?item.link:noLink" target="_self" class="external" v-html="item.notification">
                                {{item.notification}}
                            </a>
                            <a :href="item.link?item.link:noLink" target="_self" class="external" v-if="item.link!=''">
                                <img src="../../../../static/img/news_link.png" alt="" >
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="head">
                <ul class="aul">
                    <li>
                        <div class="hd">
                            <input class="picker" id="picker-toolbar_9" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="addressAction">
                            <span class="h-1 h3">选择城市</span>
                            <img class="h-2" src="../../../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                    <li>
                        <div class="hd">
                            <input class="picker" id="picker-device_9" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="selectTypeAction">
                            <span class="h-1 h4">选择工种</span>
                            <img class="h-2" src="../../../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                    <li v-if="isShow!=2">
                        <div class="hd">
                            <input class="picker" id="calendar-default_9" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="selectTimeAction">
                            <span class="h-1 h5">选择日期</span>
                            <img class="h-2" src="../../../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                    <li v-if="isShow==2">
                        <div class="hd">
                            <input class="picker" id="select-time" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="selectYearsAction">
                            <span class="h-1 h6">选择工作年限</span>
                            <img class="h-2" src="../../../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                </ul>
            </div>
            <div>
                <searchProj v-if="isShow==1" :projList="this.projList" :number="this.number" @childComponents="numberAction" @shareGroupApprove="showPopout"></searchProj>
                <searchWorker v-if="isShow==2" :workerList="this.workerList" :number="this.number" @childComponents="numberAction" @shareGroupApprove="showPopout"></searchWorker>
                <searchJob v-if="isShow==3" :workerSearchJobList="this.workerSearchJobList" :number="this.number" :userCardExist="this.userCardExist" :userCardId="this.userCardId" @childComponents="numberAction"></searchJob>
            </div>
            <div v-if="isShow==1">
                <div v-if="projListLength==0 || projListLength<5" class="word" @click="allWordAction">已无更多信息，点击查看全国信息</div>
            </div>
            <div v-if="isShow==2">
                <div v-if="workListLength==0 || workListLength<5" class="word" @click="allWordAction">已无更多信息，点击查看全国信息</div>
            </div>
            <div v-if="isShow==3">
                <div v-if="workerSearchJobListLength==0 || workerSearchJobListLength<5" class="word" @click="allWordAction">已无更多信息，点击查看全国信息</div>
            </div>
            <!--微信分享-->
            <div class="popover popover-about">
                <div class="popover-angle"></div>
                <div class="popover-inner">
                    <div class="content-block"></div>
                </div>
            </div>
        </div>
        <!--签到弹框-->
        <div class="pick3" v-show="kaoqing==1"  @click="cancelKaoQing"></div>
        <div class="tishi" v-show="kaoqing==1">
            <img src="../../../../static/img/qiangdaochenggong.png"/>
            <div class="haode" @click="cancelKaoQing">
                好的
            </div>
        </div>
        <!--引导认证-->
        <div class="pick2" v-show="showTime==1"></div>
        <div class="title" v-show="showTime==1">
            <img class="tp" src="../../../../static/img/yindao_icom.png"/>
            <div class="tp2">
                <div class="tp2-1">认证班组</div>
                <div class="tp2-2">您还不是班组长身份，无法联系</div>
                <div class="tp2-3">请先认证班组</div>
            </div>
            <div class="tp3">
                <div class="left left2" @click="cancel2Action">取消</div>
                <div class="left left3" @click="shareAction2">去认证</div>
            </div>
        </div>

        <!--微信分享-->
        <div class="pick" v-show="mencheng==1" @click="cancelAction"></div>
        <div class="pickDown" v-show="mencheng==1">
            <div class="top">分享到</div>
            <div class="cent" v-show="mencheng2==2">
                <div class="c-1" @click="weixinAction">
                    <img src="../../../../static/img/weixin_icon.png"/>
                    <br/>
                    <span>微信好友</span>
                </div>
                <div class="c-1" @click="pengyouquanAction">
                    <img src="../../../../static/img/pengyouquan_icon.png"/>
                    <br/>
                    <span>朋友圈</span>
                </div>
            </div>
            <div class="cent" v-show="mencheng2==3">
                <div class="c-1" @click="weixinAction2">
                    <img src="../../../../static/img/weixin_icon.png"/>
                    <br/>
                    <span>微信好友</span>
                </div>
                <div class="c-1" @click="pengyouquanAction2">
                    <img src="../../../../static/img/pengyouquan_icon.png"/>
                    <br/>
                    <span>朋友圈</span>
                </div>
            </div>
            <div class="bott" @click.stop.prevent="hiddenAction">取消</div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import {userApi, tabulateStatisticsApi, wxApi, projectApi} from "../../../api";
    import { LocalCache } from '../../../lib/utils';
    import {shareServer, shareAppid} from "../../../config";
    import moment from 'moment';
    import groupNav from '../../../components/broadside-navigation/group';
    import searchProj from '../../../components/searchJob/searchProj';
    import searchWorker from '../../../components/searchJob/searchWorker';
    import searchJob from '../../../components/searchJob/searchJob';
    var pickerAddress;
    var pickerDevice;
    var calendarInline;
    var pickerYears,marqueetimer;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    export default {
        data(){
            return{
                companyRole: '',
                isShow: 2,
                isSignin: false, //是否签到false表示不能签到
                userId: '',
                isAdmin: false,
                typecode: '',
                workerTitle: [],
                time: '',
                years: '',
                number: '',                 //能联系的次数
                page: 1,
                pageSize: 5,
                totalPages: '',
                totalItems: '',
                projList: [],
                workerList: [],
                workerSearchJobList: [],
                projListLength: '',
                workListLength: '',
                workerSearchJobListLength: '',
                provinceId2: '',           //切换组件找项目和找工人时保存刚进页面的省市
                cityId2: '',
                cityName2: '',
                mencheng: 0,
                mencheng2: 0,
                showTime: 0,
                kaoqing: 0,
                userCardExist: false,  //判断是否生成了简历
                userCardId: '',        //简历id

                proviceList: [],            //以下都是调省市区插件的参数
                proviceIdList: [],
                cityList: [],
                provinceId: '',
                cityIdList: [''],
                cityNameList: [''],
                cityId: '',
                localAddress: {},             //省市区的地址全放里面存缓存里
                num:0,
                animate: false,
                marqueeList: [
                    {
                        notification:'',
                        link:''
                    }
                ],
                noLink:'javascript:;',
                demandTypeList:[]
            }
        },
        components:{
            groupNav, searchProj, searchWorker, searchJob
        },
        methods:{
            back(){
                wxApi.lookUserContact(this.userId).then((result)=>{
                    this.number = result.data.times;
                    console.log('次数',this.number);
                })
            },
            refreshAction(){
                if(this.isShow==1){
                    this.getProjList();
                }
                if(this.isShow==2){
                    this.getWorkerList();
                }
                if(this.isShow==3){
                    this.workSearchJobList();
                }
            },
            addIdentityCard(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    this.$router.load({url: '/company/addIdentityCard'})
                }
            },
            sendHistory(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    if(this.isShow==1){
                        this.$router.load({url: '/user/sendHistory'})
                    }
                    if(this.isShow==2){
                        this.$router.load({url: '/user/contactWorkerHistory'})
                    }
                    if(this.isShow==3){
                        this.$router.load({url: '/user/contactRecord'})
                    }
                }
            },
            addIdentityCard(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    this.$router.load({url: '/company/addIdentityCard'})
                }
            },
            oneBtn(){
                this.page = 1;
                this.provinceId = this.provinceId2;
                this.cityId = this.cityId2;
                $$('.h3').text(this.cityName2);
                this.typecode = '';
                this.time = '';
                this.years = '';
                this.isShow = 1;
                this.getProjList();
            },
            twoBtn(){
                this.page = 1;
                this.provinceId = this.provinceId2;
                this.cityId = this.cityId2;
                $$('.h3').text(this.cityName2);
                this.typecode = '';
                this.time = '';
                this.years = '';
                this.isShow = 2;
            },
            threeBtn(){
                this.page = 1;
                this.provinceId = this.provinceId2;
                this.cityId = this.cityId2;
                $$('.h3').text(this.cityName2);
                this.typecode = '';
                this.time = '';
                this.years = '';
                this.isShow = 3;
                this.workSearchJobList();
            },
            addressAction(){
                console.log('我点击了');
                pickerAddress.open();
            },
            selectTypeAction(){
                pickerDevice.open();
            },
            selectTimeAction(){
                console.log('我点击了');
                calendarInline.open();
            },
            selectYearsAction(){
                pickerYears.open();
            },
            //Wechat.Scene.TIMELINE 表示分享到朋友圈
            //Wechat.Scene.SESSION 表示分享给好友
            shareAction(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    this.mencheng = 1;
                    this.mencheng2 = 2;
                }
            },
            signinAction(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    if(this.isSignin){
                        wxApi.signin().then((res)=>{
                            this.isSignin = false;
                            this.kaoqing = 1;
                            console.log('点击签到',res.data);
                            wxApi.lookUserContact(this.userId).then((result)=>{
                                this.number = result.data.times;
                                console.log('次数',result.data);
                            })
                        })
                    }else{
                        this.$f7.alert('今日已签到');
                    }
                }
            },
            xiazaiAction(){
                this.$router.load({url: '/company/downloadList/'})
            },
            goumaiAction(){
                this.$router.load({url: '/company/rechargeList/'})
            },
            shareAction2(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    this.showTime = 0;
                    this.mencheng = 1;
                    this.mencheng2 = 3;
                }
            },
            cancelKaoQing(){
               this.kaoqing = 0;
            },
            hiddenAction(){
                this.mencheng = 0;
                this.mencheng2 = 0;
            },
            cancelAction(){
                this.mencheng = 0;
                this.mencheng2 = 0;
            },
            cancel2Action(){
                this.showTime = 0;
            },
            showPopout(){
                this.showTime = 1;
            },
            numberAction(number){
                console.log('传值到了父组件',number);
                this.number = number;
            },
            weixinAction(){
                this.mencheng = 0;
                this.mencheng2 = 0;
                Wechat.share({
                    message: {
                        title: "免费找活干、找工人，用智工通",
                        description: '添加 “sdgf2536” 为好友，拉你进建筑装修 找工 找活 微信群',
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareAllData%3finviterId%3d"+this.userId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                        },
                    },
                    scene: Wechat.Scene.SESSION   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            pengyouquanAction(){
                this.mencheng = 0;
                this.mencheng2 = 0;
                Wechat.share({
                    message: {
                        title: "免费找活干、找工人，用智工通",
                        description: '添加 “sdgf2536” 为好友，拉你进建筑装修 找工 找活 微信群',
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareAllData%3finviterId%3d"+this.userId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                        },
                    },
                    scene: Wechat.Scene.TIMELINE   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            weixinAction2(){
                this.mencheng = 0;
                this.mencheng2 = 0;
                Wechat.share({
                    message: {
                        title: "加入班组找活干",
                        description: "您的工友邀请您加入他的班组，找项目找活干更方便",
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: shareServer+"/#/user/groupRenZhengLogin?inviterId="+this.userId
                        },
                    },
                    scene: Wechat.Scene.SESSION   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            pengyouquanAction2(){
                this.mencheng = 0;
                this.mencheng2 = 0;
                Wechat.share({
                    message: {
                        title: "加入班组找活干",
                        description: "您的工友邀请您加入他的班组，找项目找活干更方便",
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: shareServer+"/#/user/groupRenZhengLogin?inviterId="+this.userId
                        },
                    },
                    scene: Wechat.Scene.TIMELINE   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            getProjList(){
                this.page = 1;
                wxApi.grouperFindwork(
                    this.page,
                    this.pageSize,
                    this.provinceId,
                    this.cityId,
                    this.typecode,
                    this.time
                ).then((result)=>{
                    console.log(result.data);
                    if(result.data){
                        this.projListLength = result.data.list.length;
                        this.projList = result.data.list;
                        for(var i=0; i<this.projList.length; i++){
                            if(this.projList[i].workDemandList && this.projList[i].workDemandList!='[]'){
                                this.projList[i].workDemandList[0].createTime = moment(this.projList[i].workDemandList[0].createTime).format('YYYY-MM-DD');
                            }
                            if(this.projList[i].workDemandList[0].salaryType == 1){
                                this.projList[i].workDemandList[0].salaryLabel= "元/天"
                            }else if(this.projList[i].workDemandList[0].salaryType == 2){
                                this.projList[i].workDemandList[0].salaryLabel= "元/小时"
                            }else if(this.projList[i].workDemandList[0].salaryType == 4){
                                this.projList[i].workDemandList[0].salaryLabel= "元/月"
                            }else if(this.projList[i].workDemandList[0].salaryType == 5){
                                this.projList[i].workDemandList[0].salaryLabel= "元/平方"
                            }else{
                                this.projList[i].workDemandList[0].salaryLabel= "面议"
                            }
                        }
                    }else{
                        this.projListLength = 0;
                    }
                    console.log('项目列表',this.projList);
                })
            },
            getWorkerList(){
                this.page = 1;
                let that = this
                wxApi.recruitWorkerList(
                    this.page,
                    this.pageSize,
                    this.cityId,
                    this.typecode,
                    this.years
                ).then((result)=>{
                    //console.log(result.data);
                    this.workListLength = result.data.length;
                    for(var l=0;l<result.data.length;l++){
                        if(result.data[l].lookingJobEntity!=null){
                            result.data[l].lookingJobEntity.treatmentNames = result.data[l].lookingJobEntity.treatmentNames.split(",");
                            result.data[l].lookingJobEntity.littleBigs = result.data[l].lookingJobEntity.littleBigs.split(",");
                            result.data[l].lookingJobEntity.workTypeNames = result.data[l].lookingJobEntity.workTypeNames.split(",");
                            result.data[l].lookingJobEntity.expectTime = moment(result.data[l].lookingJobEntity.expectTime).format('YYYY-MM-DD') + '起';

                            result.data[l].lookingJobExist = true
                            if(result.data[l].lookingJobEntity.salaryType == 1){
                                result.data[l].lookingJobEntity.salaryLabel= "元/天"
                            }else if(result.data[l].lookingJobEntity.salaryType == 2){
                                result.data[l].lookingJobEntity.salaryLabel= "元/小时"
                            }else if(result.data[l].lookingJobEntity.salaryType == 4){
                                result.data[l].lookingJobEntity.salaryLabel= "元/月"
                            }else if(result.data[l].lookingJobEntity.salaryType == 5){
                                result.data[l].lookingJobEntity.salaryLabel= "元/平方"
                            }else{
                                result.data[l].lookingJobEntity.salaryLabel= "面议"
                            }
                        }else{
                            result.data[l].lookingJobExist = false
                        }
                    }
                    this.workerList = result.data;
                    console.log('工人列表',this.workerList);
                })
            },
            workSearchJobList(){
                this.page = 1;
                wxApi.workerFindwork(
                    this.page,
                    this.pageSize,
                    this.provinceId,
                    this.cityId,
                    this.typecode,
                    this.time
                ).then((result)=>{
                    this.workerSearchJobListLength = result.data.list.length;
                    this.workerSearchJobList = result.data.list;
                    console.log(result.data.list);
                    for(var i=0; i<this.workerSearchJobList.length; i++){
                        for(var j=0; j<this.workerTitle.length; j++){
                            if(this.workerSearchJobList[i].workType == this.workerTitle[j].code){
                                this.workerSearchJobList[i].workType = this.workerTitle[j].value;
                            }
                        }
                        if(this.workerSearchJobList[i].salaryType == 1){
                            this.workerSearchJobList[i].salaryLabel= "元/天"
                        }else if(this.workerSearchJobList[i].salaryType == 2){
                            this.workerSearchJobList[i].salaryLabel= "元/小时"
                        }else if(this.workerSearchJobList[i].salaryType == 4){
                            this.workerSearchJobList[i].salaryLabel= "元/月"
                        }else if(this.workerSearchJobList[i].salaryType == 5){
                            this.workerSearchJobList[i].salaryLabel= "元/平方"
                        }else{
                            this.workerSearchJobList[i].salaryLabel= "面议"
                        }
                    }
                    console.log('列表',this.workerSearchJobList);
                })
            },
            allWordAction(){
                this.page = 1;
                this.provinceId = '';
                this.cityId = '';
                this.typecode = '';
                this.time = '';
                $$('.h3').text('全国');
                $$('.h4').text('选择工种');
                $$('.h5').text('选择日期');
                if(this.isShow==1){
                    this.getProjList();
                }
                if(this.isShow==2){
                    this.getWorkerList();
                }
                if(this.isShow==3){
                    this.workSearchJobList();
                }
            },
            selectCity(){
                let that = this;
                pickerAddress = this.$f7.picker({
                    input: '#picker-toolbar_9',
                    rotateEffect: true,
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right">' +
                    '<a href="#" class="link close-picker">确定</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                    cols: [
                        {
                            values: that.proviceList.map((provice)=>{return provice.id}),
                            displayValues: that.proviceList.map((provice)=>{return provice.name}),
                            onChange: (Picker, value, displayValue)=> {
                                that.provinceId = value;
                                console.log('省名字',displayValue);

                                if(that.localAddress[value].cityObj){
                                    if(value == pickerAddress.cols[0].value){
                                        that.cityIdList = [];
                                        that.cityNameList = [];
                                        for(var key in that.localAddress[value].cityObj){
                                            that.cityIdList.unshift(that.localAddress[value].cityObj[key].id);
                                            that.cityNameList.unshift(that.localAddress[value].cityObj[key].name);
                                        }
                                        that.cityId = that.cityIdList[0];
                                        $$('.h3').text(that.cityNameList[0]);
                                        console.log('市',that.cityId,$$('.h3').text());
                                        console.log('市列表',that.cityNameList);
                                        console.log('省下市',that.localAddress[value]);
                                        if (pickerAddress.cols[1].replaceValues) {
                                            pickerAddress.cols[1].replaceValues(
                                                that.cityIdList,
                                                that.cityNameList
                                            );

                                            if(that.isShow==1){
                                                that.getProjList();
                                            }
                                            if(that.isShow==2){
                                                that.getWorkerList();
                                            }
                                            if(that.isShow==3){
                                                that.workSearchJobList();
                                            }
                                        }
                                    }
                                }else{
                                    let cityObj = {};
                                    userApi.addressCityList(that.provinceId).then((result)=> {
                                        if(value == pickerAddress.cols[0].value){
                                            that.cityList = result.data.list;
                                            that.cityIdList = [];
                                            that.cityNameList = [];
                                            for(var i=0; i<that.cityList.length; i++){
                                                cityObj[that.cityList[i].id] = that.cityList[i];
                                                that.cityIdList.unshift(that.cityList[i].id);
                                                that.cityNameList.unshift(that.cityList[i].name);
                                            }
                                            that.cityId = that.cityIdList[0];
                                            $$('.h3').text(that.cityNameList[0]);
                                            console.log('市',this.cityId,$$('.h3').text());
                                            console.log('市列表2',that.cityNameList);
                                            that.localAddress[that.provinceId].cityObj = cityObj;
                                            console.log('省下的所有市',this.localAddress[that.provinceId]);

                                            if (pickerAddress.cols[1].replaceValues) {
                                                pickerAddress.cols[1].replaceValues(
                                                    that.cityIdList,
                                                    that.cityNameList
                                                );

                                                if(that.isShow==1){
                                                    that.getProjList();
                                                }
                                                if(that.isShow==2){
                                                    that.getWorkerList();
                                                }
                                                if(that.isShow==3){
                                                    that.workSearchJobList();
                                                }

                                            }
                                        }
                                    });
                                }
                                pickerAddress.cols[1].onChange();
                            }
                        },
                        {
                            textAlign: "left",
                            values: that.cityIdList,
                            displayValues: that.cityNameList,
                            onChange: (Picker, value, displayValue)=>{
                                if(value){
                                    $$('.h3').text(displayValue);
                                    that.cityId = value;
                                    console.log('市2',value,displayValue);

                                    if(that.isShow==1){
                                        that.getProjList();
                                    }
                                    if(that.isShow==2){
                                        that.getWorkerList();
                                    }
                                    if(that.isShow==3){
                                        that.workSearchJobList();
                                    }
                                }

                            }
                        }
                    ],
                    onOpen: (picker)=>{
                        pickerAddress.cols[0].onChange('Picker', that.provinceId);
                        console.log('调用了');
                    }
                });
            },
            selectType(){
                pickerDevice = this.$f7.picker({
                    input: '#picker-device_9',
                    formatValue(p, values, displayValues) {
                        return displayValues;
                    },
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onOpen: (p) => {
                        p.container.find('#btnOk').off('click').click(() => {
                            this.typecode = p.cols[0].value;
                            this.typename = p.cols[0].displayValue;
                            $$('.h4').text(this.typename);

                            if(this.isShow==1){
                                this.getProjList();
                            }
                            if(this.isShow==2){
                                this.getWorkerList();
                            }
                            if(this.isShow==3){
                                this.workSearchJobList();
                            }
                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.workerTitle.map((one)=>{return one.code}),
                            displayValues: this.workerTitle.map((one)=>{return one.value})
                        }
                    ]
                });
            },
            showMarquee: function () {
                this.animate = true;
                setTimeout(()=>{
                    this.marqueeList.push(this.marqueeList[0]);
                    this.marqueeList.shift();
                    this.animate = false;
                },500)
            },

        },
        created(){
            wxApi.notification().then((res)=>{
                console.log("notification",res);
                this.marqueeList = res.data
                setInterval(this.showMarquee, 5000)
            })
            //发布用
            wxApi.demandTypeWorkType().then((res)=>{
                this.demandTypeList = res.data
                //$$(".demandTypeLabel:first-child").prop("checked",true)
                this.$store.state.demandTypeList = res.data
            })
        },
        mounted(){
            this.companyRole = this.$store.state.roleInfo.companyRole;
            let server = encodeURIComponent(shareServer);
            console.log('编码及appid',shareServer,server,shareAppid);
            this.cityId2 = this.cityId;
            this.cityName2 = this.cityName;
            console.log('市的名字',this.cityName);
            this.userId = LocalCache.get('userInfo').id;

            wxApi.lookUserContact(this.userId).then((result)=>{
                this.number = result.data.times;
                console.log('次数',result.data);
            })
            //判断今日是否签到
            wxApi.isSignin().then((result)=>{
                this.isSignin = result.data;
                console.log(result.data);
            })
            //判断此人是否已发布简历
            wxApi.userInfo(this.userId).then((res)=>{
                console.log(res.data);
                if(res.data!=null){
                    this.userCardExist = true;
                    this.userCardId = res.data.id;
                }
            })

            //选择日期
            var that = this;
            calendarInline = this.$f7.calendar({
                input: '#calendar-default_9',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    $$('.h5').text($day);
                    that.time = $day;
                    if(that.isShow==1){
                        that.getProjList();
                    }
                    if(that.isShow==2){
                        that.getWorkerList();
                    }
                    if(that.isShow==3){
                        that.workSearchJobList();
                    }
                    p.close();
                    that.$f7.closeModal();
                }
            });

            //选择工种
            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;
                this.selectType();
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=>{
                    this.workerTitle = result.data.list.reverse();
                    this.$store.state.workerTitle = this.workerTitle;
                    console.log(this.workerTitle);
                    this.selectType();
                })
            }

            //获取工人列表(这个接口调用要写在工种调用的后面)
            if(this.$store.state.address){
                this.provinceId = this.$store.state.address.provinceId;
                this.cityId = this.$store.state.address.cityId;
                this.provinceId2 = this.$store.state.address.provinceId;
                this.cityId2 = this.$store.state.address.cityId;
                console.log('我获取了省市id', this.provinceId, this.cityId);
                wxApi.getCityName(this.cityId).then((result)=>{
                    console.log('市的名字',result.data.name);
                    $$('.h3').text(result.data.name);
                    this.cityName2 = result.data.name;
                })

                this.getWorkerList();
            }else{
                projectApi.userProjs().then((result)=>{
                    console.log('项目列表',result.data);
                    if(result.data.length!=0){
                        this.provinceId = result.data[0].provinceId;
                        this.cityId = result.data[0].cityId;
                        this.provinceId2 = result.data[0].provinceId;
                        this.cityId2 = result.data[0].cityId;
                        wxApi.getCityName(this.cityId).then((result)=>{
                            console.log('市的名字',result.data.name);
                            $$('.h3').text(result.data.name);
                            this.cityName2 = result.data.name;
                        })

                        this.getWorkerList();
                    }else{
                        this.getWorkerList();
                    }
                })
            }

            var loading = false;
            $$('.infinite-scroll').on('infinite', ()=>{
                if(loading) return;
                loading = true;

                var that = this;
                setTimeout(()=>{
                    that.page++;
                    console.log('我被点击了',that.page);
                    loading = false;

                    if(this.isShow==1){
                        wxApi.grouperFindwork(
                            this.page,
                            this.pageSize,
                            this.provinceId,
                            this.cityId,
                            this.typecode,
                            this.time
                        ).then((result)=>{
                            console.log(result.data);
                            if(result.data){
                                that.projListLength = result.data.list.length;
                                that.projList = that.projList.concat(result.data.list);
                                console.log(result.data);
                                for(var i=0; i<this.projList.length; i++){
                                    if(this.projList[i].workDemandList && this.projList[i].workDemandList!='[]'){
                                        this.projList[i].workDemandList[0].createTime = moment(this.projList[i].workDemandList[0].createTime).format('YYYY-MM-DD');
                                    }
                                    if(this.projList[i].workDemandList[0].salaryType == 1){
                                        this.projList[i].workDemandList[0].salaryLabel= "元/天"
                                    }else if(this.projList[i].workDemandList[0].salaryType == 2){
                                        this.projList[i].workDemandList[0].salaryLabel= "元/小时"
                                    }else if(this.projList[i].workDemandList[0].salaryType == 4){
                                        this.projList[i].workDemandList[0].salaryLabel= "元/月"
                                    }else if(this.projList[i].workDemandList[0].salaryType == 5){
                                        this.projList[i].workDemandList[0].salaryLabel= "元/平方"
                                    }else{
                                        this.projList[i].workDemandList[0].salaryLabel= "面议"
                                    }
                                }
                            }else{
                                that.projListLength = 0;
                            }
                            console.log('列表',that.projList);
                        })
                    }
                    if(this.isShow==2){
                        wxApi.recruitWorkerList(
                            this.page,
                            this.pageSize,
                            this.cityId,
                            this.typecode,
                            this.time
                        ).then((result)=> {
                            that.workListLength = result.data.length;
                            for(var l=0;l<result.data.length;l++) {
                                if (result.data[l].lookingJobEntity != null) {
                                    result.data[l].lookingJobEntity.treatmentNames = result.data[l].lookingJobEntity.treatmentNames.split(",");
                                    result.data[l].lookingJobEntity.littleBigs = result.data[l].lookingJobEntity.littleBigs.split(",");
                                    result.data[l].lookingJobEntity.workTypeNames = result.data[l].lookingJobEntity.workTypeNames.split(",");
                                    result.data[l].lookingJobEntity.expectTime = moment(result.data[l].lookingJobEntity.expectTime).format("YYYY-MM-DD") + '起'


                                    result.data[l].lookingJobExist = true
                                    if (result.data[l].lookingJobEntity.salaryType == 1) {
                                        result.data[l].lookingJobEntity.salaryLabel = "元/天"
                                    } else if (result.data[l].lookingJobEntity.salaryType == 2) {
                                        result.data[l].lookingJobEntity.salaryLabel = "元/小时"
                                    } else if (result.data[l].lookingJobEntity.salaryType == 4) {
                                        result.data[l].lookingJobEntity.salaryLabel = "元/月"
                                    } else if (result.data[l].lookingJobEntity.salaryType == 5) {
                                        result.data[l].lookingJobEntity.salaryLabel = "元/平方"
                                    } else {
                                        result.data[l].lookingJobEntity.salaryLabel = "面议"
                                    }
                                }else {
                                    result.data[l].lookingJobExist = false
                                }

                                that.workerList = that.workerList.concat(result.data);
                                console.log('工人列表', that.workerList);
                            }
                        })
                    }
                    if(this.isShow==3){
                        wxApi.workerFindwork(
                            this.page,
                            this.pageSize,
                            this.provinceId,
                            this.cityId,
                            this.typecode,
                            this.time
                        ).then((result)=>{
                            that.workerSearchJobListLength = result.data.list.length;
                            that.workerSearchJobList = that.workerSearchJobList.concat(result.data.list);
                            console.log(result.data.list);
                            for(var i=0; i<that.workerSearchJobList.length; i++){
                                for(var j=0; j<that.workerTitle.length; j++){
                                    if(that.workerSearchJobList[i].workType == that.workerTitle[j].code){
                                        that.workerSearchJobList[i].workType = that.workerTitle[j].value;
                                    }
                                }
                                if(this.workerSearchJobList[i].salaryType == 1){
                                    this.workerSearchJobList[i].salaryLabel= "元/天"
                                }else if(this.workerSearchJobList[i].salaryType == 2){
                                    this.workerSearchJobList[i].salaryLabel= "元/小时"
                                }else if(this.workerSearchJobList[i].salaryType == 4){
                                    this.workerSearchJobList[i].salaryLabel= "元/月"
                                }else if(this.workerSearchJobList[i].salaryType == 5){
                                    this.workerSearchJobList[i].salaryLabel= "元/平方"
                                }else{
                                    this.workerSearchJobList[i].salaryLabel= "面议"
                                }
                            }
                            console.log('列表',that.workerSearchJobList);
                        })
                    }

                }, 1000);
            })

            //获取省市区地址
            if(this.$store.state.localAddress){
                this.localAddress = this.$store.state.localAddress;
                for(var key in this.localAddress){
                    this.proviceList.unshift(this.localAddress[key]);
                };
                console.log('省',this.proviceList);

                this.selectCity();
            }else{
                userApi.adressProviceList().then((result)=>{
                    this.proviceList = result.data.list;
                    for(var i=0; i<result.data.list.length; i++){
                        this.localAddress[result.data.list[i].id] = result.data.list[i];
                    };
                    this.$store.state.localAddress = this.localAddress;

                    this.selectCity();
                });
            }

            //选择工作年限
            pickerYears = this.$f7.picker({
                input: '#select-time',
                toolbarTemplate:
                '<div class="toolbar">' +
                '<div class="toolbar-inner">' +
                '<div class="left">' +
                '<a href="#" class="link close-picker">取消</a>' +
                '</div>' +
                '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                '</div>' +
                '</div>',
                onOpen: (p) => {
                    p.container.find('#btnOk').off('click').click(() => {
                        this.years = p.cols[0].value;
                        $$('.h6').text(this.years);
                        this.getWorkerList();
                    })
                },
                cols: [
                    {
                        textAlign: 'center',
                        values: (function () {
                            var arr = [];
                            for (var i = 1; i <= 40; i++) { arr.push(i); }
                            return arr;
                        })(),
                    }
                ]
            });
        }
    }
</script>

<style scoped>
    .pageOne{
        width: 100%; height: 100%; background: #000; opacity: 0.2;
    }
    .navbar .left img{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .right{
        font-size: 0.7rem; color: #438CFF;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .nav{
        width: 100%; height: 45px; line-height: 45px; background: #fff; display: flex; justify-content: space-between;
    }
    .nav .n{
        width: 50%; text-align: center; font-size: 0.7rem; color: #666; font-size: 0.7rem; color: #666; display: inline-block;
    }
    .nav .n span{
        display: inline-block; line-height: 45px;
    }
    .nav .n span.active{
        border-bottom: 2px solid #438CFF;
    }
    .aside{
        width: 100%; height: 3.25rem; box-sizing: border-box; padding: 0 0.6rem; display: flex; background: #fff; margin-top: 5px;
    }
    .aside .asd{
        width: 33%; font-size: 0.55rem; color: #666; text-align: center;
    }
    .aside .asd a{
        display: inline-block; width: 100%; height: 100%; font-size: 0.55rem; color: #666;
    }
    .aside .asd img{
        width: 1.85rem; height: 1.7rem; display: inline-block; margin-top: 7px;
    }
    .logo{
        background: #fff; margin-top: 5px;
    }
    .logo .log{
        width: 100%; height: 28px; line-height: 28px; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem 0 1.02rem;
    }
    .logo .log .left{
        font-size: 0.6rem; color: #666;
    }
    .logo .log .right{
        font-size: 0.6rem; color: #3771d1; font-weight: 700;
    }
    .logo .log2{
        box-sizing: border-box; padding: 0 1.02rem;
    }
    .logo .log2 .shang, .xia{
        width: 100%; display: flex; justify-content: space-between;
    }
    .logo .log2 .shang{
        padding-top: 5px;
    }
    .logo .log2 .xia{
        padding: 0.5rem 0 0.5rem 0;
    }
    .logo .log2 img{
        width: 8rem; height: 65px; display: block;
    }

    .head{
        background: #fff; border-top: 1px solid #f4f4f4; margin-top: 5px; border-bottom: 1px solid #f4f4f4;
    }
    .head .aul{
        width: 100%; display: flex;
    }
    .head .aul li{
        width: 33%; height: 1.5rem; line-height: 1.5rem; font-size: 0.8rem; color: #999; border-right: 1px solid #f4f4f4; position: relative;
    }
    .head .aul li:last-of-type{
        border-right: none;
    }
    .head .aul li .hd{
        width: 100%;
    }
    .head .aul li .hd .picker{
        width: 100%; height: 1.5rem; border: none; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0; z-index: -1;
    }
    .head .aul li .hd2{
        width: 100%; height: 1.5rem; line-height: 1.5rem; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .head .aul li .hd2 .h-1{
        font-size: 0.7rem; color: #A2B4CA;
    }
    .head .aul li .hd2 .h-2{
        width: 0.5rem; height: 0.5rem; display: inline;
    }
    .word{
        width: 90%; height: 24px; line-height: 24px; font-size: 10px; text-align: center; margin: 20px auto; color: #6AA5EE; border: 1px solid #DEE8F7;  border-radius: 6px;
    }
/*微信分享*/
    .pick{
        width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000; opacity: 0.5; z-index: 666;
    }
    .pickDown{
        width: 94%; background: #fff; overflow: hidden; position: fixed; left: 3%; bottom: 1rem; z-index: 999; border-radius: 0.9rem;
    }
    .pickDown .top{
        width: 100%; margin-top: 25px; text-align: center; font-size: 0.75rem ; color: #333333;
    }
    .pickDown .cent{
        width: 100%; display: flex; font-size: 0.9rem; color: #F87474; margin-top: 25px;
    }
    .pickDown .cent .c-1{
        margin-left: 30px; font-size: 0.55rem; color: #666; text-align: center;
    }
    .pickDown .cent .c-1 img{
        width: 55px; height: 55px; display: inline;
    }
    .pickDown .bott{
        width: 100%; height: 44px; line-height: 44px; text-align: center; font-size: 0.75rem; color: #666666; border-top: 1px solid #f4f4f4; margin-top: 1rem;
    }
/*签到成功*/
    .pick3{
        width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000; opacity: 0.5; z-index: 666;
    }
    .tishi{
        width: 302px; height: 216px; position: relative; position: fixed; left: 12%; top: 28%; z-index: 990;
    }
    .tishi img{
        width: 100%; height: 100%;
    }
    .tishi .haode{
        width: 50px; height: 24px; line-height: 24px; text-align: center; background: #F96F6F; color: #fff;
        position: absolute; left: 120px; bottom: 20px;
    }
/*引导认证*/
    .pick2{
        width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000; opacity: 0.5; z-index: 666;
    }
    .title{
        width: 284px; height: 225px; background: #fff; position: fixed; left: 12%; top: 28%; z-index: 990;
    }
    .title .tp{
        width: 100px; height: 90px; margin: 0 auto; display: block; transform: translateY(-36px); position: relative; z-index: 991;
    }
    .title .tp2{
        text-align: center; transform: translateY(-30px);
    }
    .title .tp2 .tp2-1{
        font-size: 0.75rem; color: #063D67;
    }
    .title .tp2 .tp2-2{
        font-size: 0.65rem; color: #111111;  font-weight: 700; margin-top: 18px;
    }
    .title .tp2 .tp2-3{
        font-size: 0.7rem; color: #666; margin-top: 10px;
    }
    .title .tp3{
        width: 100%; display: flex; justify-content: space-around; transform: translateY(-10px);
    }
    .title .tp3 .left{
        width: 100px; height: 35px; line-height: 35px; text-align: center; font-size: 0.85rem;  border: 1px solid #227FC5; border-radius: 1.5px;
    }
    .title .tp3 .left2{
        color: #227FC5;
    }
    .title .tp3 .left3{
        background: #227FC5; color: #fff;
    }
    .marquee {
        width: 100%;
        margin-top: 5px;
        align-items: center;
        color: #3A3A3A;
        background-color: #fff;
        display: flex;
        box-sizing: border-box;
    }
    .marquee_box {
        display: block;
        position: relative;
        padding-left: 3%;
        width: 90%;
        margin: 0 auto;
        height: 30px;
        overflow: hidden;
    }
    .marquee_list {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
    .marquee_top {
        transition: all 0.5s;
        margin-top: -30px
    }
    .marquee_list li {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: block;
        width: 100%;
    }
    .marquee_list li a{
        color: #181D5B;
        font-size: 12px;
    }
    .marquee_list li a img{
        width: 5px;
        height: 9px;
        vertical-align: middle;
        margin-left: 3px;
    }
    .marquee_list li span {
        padding: 0 2px;
    }
</style>