<template>
    <div data-page="searchJob" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left"></div>
                <div class="center">智工通</div>
                <div class="right" @click="refreshAction"><a v-show="compShow==0" href="#">刷新</a></div>
            </div>
        </div>
        <div class="page-content infinite-scroll">
            <loginpage v-show="compShow==12" :codem="this.code" :inviterId="this.inviterId" @changeTate="changeTate"></loginpage>
            <div v-show="compShow==0">
                <div class="nav">
                    <div class="n" @click.stop.prevent="oneBtn"><span :class="{active: showTime==1}">项目分包</span></div>
                    <div class="n" @click.stop.prevent="twoBtn"><span :class="{active: showTime==2}">找工人</span></div>
                    <div class="n" @click.stop.prevent="threeBtn"><span :class="{active: showTime==3}">找活干</span></div>
                </div>
                <div>
                    <div class="aside">
                        <div class="asd">
                            <a href="/user/idCardIdentification">
                                <img src="../../static/img/personShimingrenzheng.png"/><br/>
                                <span>实名认证</span>
                            </a>
                        </div>
                        <div class="asd">
                            <a href="/user/groupRenZheng">
                                <img src="../../static/img/grouprenzheng.png"/><br/>
                                <span>班组认证</span>
                            </a>
                        </div>
                        <div class="asd">
                            <a @click="sendHistory">
                                <img src="../../static/img/lianxijilu.png"/><br/>
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
                            <img @click="shareAction" src="../../static/img/yaoqinghaoyou.png"/>
                            <img v-show="this.isSignin==true" @click="signinAction" src="../../static/img/qiandao.png"/>
                            <img v-show="this.isSignin==false" @click="signinAction" src="../../static/img/qiandaohou.png"/>
                        </div>
                        <div class="xia">
                            <img @click="xiazaiAction" src="../../static/img/xiazaiduijifeng.png"/>
                            <img @click="goumaiAction" src="../../static/img/goumaijifeng.png"/>
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
                                    <img src="../../static/img/news_link.png" alt="" >
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
                                <img class="h-2" src="../../static/img/xialaGray.png"/>
                            </div>
                        </li>
                        <li>
                            <div class="hd">
                                <input class="picker" id="picker-device_9" readonly/>
                            </div>
                            <div class="hd2" @click.stop.prevent="selectTypeAction">
                                <span class="h-1 h4">选择工种</span>
                                <img class="h-2" src="../../static/img/xialaGray.png"/>
                            </div>
                        </li>
                        <li>
                            <div class="hd">
                                <input class="picker" id="calendar-default_9" readonly/>
                            </div>
                            <div class="hd2" @click.stop.prevent="selectTimeAction">
                                <span class="h-1 h5">选择日期</span>
                                <img class="h-2" src="../../static/img/xialaGray.png"/>
                            </div>
                        </li>
                    </ul>
                </div>
                <div>
                    <searchProj v-show="showTime==1" :projList="this.projList" :number="this.number" @childComponents="numberAction" @shareGroupApprove="toRenZheng"></searchProj>
                    <searchWorker v-show="showTime==2" :workerList="this.workerList" :number="this.number" @childComponents="numberAction"></searchWorker>
                    <searchJob2 v-show="showTime==3" :workerSearchJobList="this.workerSearchJobList" :number="this.number" :userCardExist="this.userCardExist" :userCardId="this.userCardId" @childComponents="numberAction"></searchJob2>
                </div>
                <div v-show="showTime==1">
                    <div v-show="projListLength==0 || projListLength<5" class="word" @click="allWordAction">已无更多信息，点击查看全国信息</div>
                </div>
                <div v-show="showTime==2">
                    <div v-show="workListLength==0 || workListLength<5" class="word" @click="allWordAction">已无更多信息，点击查看全国信息</div>
                </div>
                <div v-show="showTime==3">
                    <div v-show="workerSearchJobListLength==0 || workerSearchJobListLength<5" class="word" @click="allWordAction">已无更多信息，点击查看全国信息</div>
                </div>
            </div>
        </div>
        <div class="allpage" v-show="titleHandle==1">
            <img src="../../static/img/inviterTiltle.png"/>
            <div class="know" @click="iKnowAction">知道了</div>
        </div>
        <!--签到弹框-->
        <div class="pick3" v-show="kaoqing==1"  @click="cancelKaoQing"></div>
        <div class="tishi" v-show="kaoqing==1">
            <img src="../../static/img/qiangdaochenggong.png"/>
            <div class="haode" @click="cancelKaoQing">
                好的
            </div>
        </div>
        <!--引导认证-->
        <div class="pick2" v-show="toShare==1"></div>
        <div class="title" v-show="toShare==1">
            <img class="tp" src="../../static/img/yindao_icom.png"/>
            <div class="tp2">
                <div class="tp2-1">认证班组</div>
                <div class="tp2-2">您还不是班组长身份，无法联系项目</div>
                <div class="tp2-3">请先认证班组</div>
            </div>
            <div class="tp3">
                <div class="left left2" @click="cancel2Action">取消</div>
                <div class="left left3"><a href="/user/groupRenZheng">去认证</a></div>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    var $$ = Dom7;
    import {userApi, tabulateStatisticsApi, wxApi, projectApi} from "../api";
    import moment from 'moment';
    import loginpage from '../components/login';
    import searchProj from '../components/searchProj';
    import searchWorker from '../components/searchWorker';
    import searchJob2 from '../components/searchJob2';
    import { LocalCache } from '../lib/utils';
    import { shareServer, shareAppid, serverceshi} from '../config';
    var pickerAddress, pickerDevice, calendarInline, pickerYears;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    export default {
        data(){
            return{
                code: '',
                inviterId: '',
                url: '',
                compShow: '',
                num: '',
                user: {},
                showTime: 2,
                userId: '',
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
                graticules: [],             //经纬度
                toShare: 0,
                titleHandle: 0,
                isSignin: false,    //判断是否签到false表示已签到
                kaoqing: 0,         //判断考勤成功弹框是否显示
                userCardExist: false,  //判断是否生成了简历
                userCardId: '',        //简历id

                proviceList: [],            //以下都是调省市区插件的参数
                proviceIdList: [],
                cityList: [],
                provinceId: '',
                cityIdList: [''],
                cityNameList: [''],
                cityId: '',
                cityName: '',
                localAddress: {},             //省市区的地址全放里面存缓存里
                animate: false,
                marqueeList: [
                    {
                        notification:'',
                        link:''
                    }
                ],
                noLink:'javascript:;'
            }
        },
        components: {
            loginpage, searchProj, searchWorker, searchJob2
        },
        methods:{
            back(){
                wxApi.getConfig(false, this.url).then((result)=> {
                    this.config = JSON.parse(result.data);
                    console.log('签名', this.config);

                    wx.config(
                        this.config
                    );
                    wxApi.lookUserContact(this.userId).then((result)=>{
                        this.number = result.data.times;
                        console.log('次数',this.number);
                    })
                    let link = serverceshi+"/weixin/invite?inviterId=" + this.userId;
                    console.log('链接',link);
                    wx.onMenuShareQQ({
                        title: '建筑装修找活干，找工人，用智工通', // 分享标题
                        desc: '加入智工通，建筑专业用工平台，找项目找工人更方便', // 分享描述
                        link:   shareServer+"/#/user/shareAllData?inviterId="+this.userId,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: 'http://images.zhigongxx.com/logo.png', // 分享图标 http://images.zhigongxx.com/logo.png
                        success: function(res) {
                            //这里是回调函数
                            console.log(res);
                        },
                        cancel: function (res) {
                            // 用户取消分享后执行的回调函数
                            console.log(res);
                        }
                    });

                    wx.onMenuShareQZone({
                        title: '建筑装修找活干，找工人，用智工通', // 分享标题
                        desc: '加入智工通，建筑专业用工平台，找项目找工人更方便', // 分享描述
                        link: shareServer+"/#/user/shareAllData?inviterId="+this.userId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: 'http://images.zhigongxx.com/logo.png', // 分享图标 http://images.zhigongxx.com/logo.png
                        success: function(res) {
                            //这里是回调函数
                            console.log(res);
                        },
                        cancel: function (res) {
                            // 用户取消分享后执行的回调函数
                            console.log(res);
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: '建筑装修找活干，找工人，用智工通', // 分享标题
                        desc: '加入智工通，建筑专业用工平台，找项目找工人更方便', // 分享描述
                        link: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareAllData%3finviterId%3d"+this.userId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect",       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: 'http://images.zhigongxx.com/logo.png', // 分享图标 http://images.zhigongxx.com/logo.png
                        success: function(res) {
                            //这里是回调函数
                            console.log(res);
                        },
                        cancel: function (res) {
                            // 用户取消分享后执行的回调函数
                            console.log(res);
                        }
                    });

                    wx.onMenuShareTimeline({
                        title: '建筑装修找活干，找工人，用智工通',      // 分享标题
                        desc: '加入智工通，建筑专业用工平台，找项目找工人更方便', // 分享描述
                        link: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareAllData%3finviterId%3d"+this.userId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect",        // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: 'http://images.zhigongxx.com/logo.png',     // 分享图标 http://images.zhigongxx.com/logo.png
                        success: function(res) {
                            //这里是回调函数
                            console.log(res);
                        },
                        cancel: function (res) {
                            // 用户取消分享后执行的回调函数
                            console.log(res);
                        }
                    });
                })
            },
            refreshAction(){
                if(this.showTime==1){
                    this.getProjList();
                }
                if(this.showTime==2){
                    this.getWorkerList();
                }
                if(this.showTime==3){
                    this.workSearchJobList();
                }
            },
            changeTate(param){
                console.log('个人账户3', param);
                this.compShow = 0;
                this.user = param;
                this.userId = param.id;
                if(param.workGroupId){
                    this.$store.state.workGroupId = param.workGroupId;
                }else{
                    this.$store.state.workGroupId = 0;
                }
                this.enterPage();
            },
            oneBtn(){
                this.page = 1;
                this.provinceId = this.provinceId;
                this.cityId = this.cityId;
                $$('.h3').text(this.cityName);
                this.typecode = '';
                this.time = '';
                this.years = '';
                this.showTime = 1;
                console.log('我点击了', this.showTime);
                this.getProjList();
            },
            twoBtn(){
                this.page = 1;
                this.provinceId = this.provinceId;
                this.cityId = this.cityId;
                $$('.h3').text(this.cityName);
                this.typecode = '';
                this.time = '';
                this.years = '';
                this.showTime = 2;
                console.log('我点击了',this.showTime);
            },
            threeBtn(){
                this.page = 1;
                this.provinceId = this.provinceId;
                this.cityId = this.cityId;
                $$('.h3').text(this.cityName);
                this.typecode = '';
                this.time = '';
                this.years = '';
                this.showTime = 3;
                console.log('我点击了',this.showTime);
                this.workSearchJobList();
            },
            signinAction(){
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
            },
            xiazaiAction(){
                this.$router.load({url: '/user/downloadList/'})
            },
            goumaiAction(){
                this.$router.load({url: '/user/rechargeList/'})
            },
            cancelKaoQing(){
                this.kaoqing = 0;
            },
            sendHistory(){
                if(this.showTime==1){
                    this.$router.load({url: '/user/sendHistory'})
                }
                if(this.showTime==2){
                    this.$router.load({url: '/user/contactWorkerHistory'})
                }
                if(this.showTime==3){
                    this.$router.load({url: '/user/contactRecord'})
                }
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
            shareAction(){
                this.titleHandle = 1;
            },
            iKnowAction(){
                this.titleHandle = 0;
            },
            cancel2Action(){
                this.toShare = 0;
            },
            numberAction(number){
                console.log('传值到了父组件',number);
                this.number = number;
            },
            toRenZheng(){
                this.toShare = 1;
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
                    console.log('项目列表长度',this.projListLength);
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
                    console.log('工人列表长度',this.workListLength);
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
                    console.log('列表列表长度',this.workerSearchJobListLength);
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
                if(this.showTime==1){
                    this.getProjList();
                }
                if(this.showTime==2){
                    this.getWorkerList();
                }
                if(this.showTime==3){
                    this.workSearchJobList();
                }
            },
            enterPage(){
                wxApi.lookUserContact(this.userId).then((result)=>{
                    this.number = result.data.times;
                    console.log('次数',this.number);
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

                //获取省市区地址
                if(this.$store.state.localAddress){
                    this.localAddress = this.$store.state.localAddress;
                    for(var key in this.localAddress){
                        this.proviceList.unshift(this.localAddress[key]);
                    }
                    console.log('省',this.proviceList);
                    this.selectCity();
                }else{
                    if(LocalCache.get('localAddress')){
                        this.localAddress = LocalCache.get('localAddress');
                        for(var key in this.localAddress){
                            this.proviceList.unshift(this.localAddress[key]);
                        }
                        console.log('我从本地取到了数据',JSON.stringify(this.localAddress));
                        this.selectCity();
                    }else{
                        userApi.adressProviceList().then((result) => {
                            for (var i = 0; i < result.data.list.length; i++) {
                                this.localAddress[result.data.list[i].id] = result.data.list[i];
                            }
                            this.$store.state.localAddress = this.localAddress;
                            LocalCache.set('localAddress', this.localAddress);
                            console.log('我把省存进了本地', JSON.stringify(this.localAddress));
                            this.selectCity();
                        });
                    }
                }

                wxApi.getConfig(false, this.url).then((result)=>{
                    this.config = JSON.parse(result.data);
                    console.log('签名',this.config);

                    wx.config(
                        this.config
                    );

                    var that = this;
                    wx.ready(()=>{
                        wx.getLocation({
                            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success: (res)=>{
                                that.graticules = [res.longitude, res.latitude];
                                console.log('经纬度3',that.graticules);

                                AMap.plugin('AMap.Geocoder', ()=>{
                                    var geocoder = new AMap.Geocoder({
                                        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                                    })

                                    geocoder.getAddress(that.graticules, (status, result)=>{
                                        if (status === 'complete' && result.info === 'OK') {
                                            // result为对应的地理位置详细信息
                                            console.log(result);
                                            let addressName = {
                                                provinceName: result.regeocode.addressComponent.province,
                                                cityName: result.regeocode.addressComponent.city
                                            }
                                            that.$store.state.addressName = addressName;
                                            console.log('城市名',addressName);

                                            //获取工人列表(这个接口调用要写在工种调用的后面)
                                            if(that.$store.state.addressName){
                                                console.log('的到父组件传过来得地址',that.$store.state.addressName);
                                                that.cityName = that.$store.state.addressName.cityName;
                                                $$('.h3').text(that.cityName);
                                                wxApi.getProvinceName(that.$store.state.addressName.provinceName).then((result)=>{
                                                    console.log('@省的Id',result.data.id);
                                                    that.provinceId = result.data.id;

                                                    if(that.$store.state.addressName.cityName==''){
                                                        wxApi.getCityIdName(that.$store.state.addressName.provinceName).then((result)=>{
                                                            console.log('@市的Id',result.data.id);
                                                            that.cityId = result.data.id;

                                                            that.getWorkerList();
                                                        })
                                                    }else{
                                                        wxApi.getCityIdName(that.$store.state.addressName.cityName).then((result)=>{
                                                            console.log('市的Id',result.data.id);
                                                            that.cityId = result.data.id;

                                                            that.getWorkerList();
                                                        })
                                                    }
                                                })
                                            }else{
                                                projectApi.userProjs().then((result)=>{
                                                    console.log('项目列表',result.data);
                                                    if(result.data.length!=0){
                                                        that.provinceId = result.data[0].provinceId;
                                                        that.cityId = result.data[0].cityId;
                                                        wxApi.getCityName(that.cityId).then((result)=>{
                                                            console.log('市的名字',result.data.name);
                                                            $$('.h3').text(result.data.name);
                                                        })

                                                        that.getWorkerList();

                                                    }else{
                                                        that.getWorkerList();
                                                    }
                                                })
                                            }

                                        }
                                    })
                                })
                            }
                        });
                        let link = serverceshi+"/weixin/invite?inviterId=" + this.userId;
                        console.log('链接',link);
                        wx.onMenuShareQQ({
                            title: '免费找活干、找工人，用智工通', // 分享标题
                            desc: '添加 “sdgf2536” 为好友，拉你进建筑装修 找工 找活 微信群', // 分享描述
                            link:   shareServer+"/#/user/shareAllData?inviterId="+this.userId,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://images.zhigongxx.com/logo.png', // 分享图标 http://images.zhigongxx.com/logo.png
                            success: function(res) {
                                //这里是回调函数
                                console.log(res);
                            },
                            cancel: function (res) {
                                // 用户取消分享后执行的回调函数
                                console.log(res);
                            }
                        });

                        wx.onMenuShareQZone({
                            title: '免费找活干、找工人，用智工通', // 分享标题
                            desc: '添加 “sdgf2536” 为好友，拉你进建筑装修 找工 找活 微信群', // 分享描述
                            link: shareServer+"/#/user/shareAllData?inviterId="+this.userId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://images.zhigongxx.com/logo.png', // 分享图标 http://images.zhigongxx.com/logo.png
                            success: function(res) {
                                //这里是回调函数
                                console.log(res);
                            },
                            cancel: function (res) {
                                // 用户取消分享后执行的回调函数
                                console.log(res);
                            }
                        });

                        wx.onMenuShareAppMessage({
                            title: '免费找活干、找工人，用智工通', // 分享标题
                            desc: '添加 “sdgf2536” 为好友，拉你进建筑装修 找工 找活 微信群', // 分享描述
                            link: serverceshi + "/weixin/invite?inviterId=" + this.userId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://images.zhigongxx.com/logo.png', // 分享图标 http://images.zhigongxx.com/logo.png
                            success: function(res) {
                                //这里是回调函数
                                console.log(res);
                            },
                            cancel: function (res) {
                                // 用户取消分享后执行的回调函数
                                console.log(res);
                            }
                        });

                        wx.onMenuShareTimeline({
                            title: '免费找活干、找工人，用智工通',      // 分享标题
                            desc: '添加 “sdgf2536” 为好友，拉你进建筑装修 找工 找活 微信群', // 分享描述
                            link: serverceshi + "/weixin/invite?inviterId=" + this.userId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://images.zhigongxx.com/logo.png',     // 分享图标 http://images.zhigongxx.com/logo.png
                            success: function(res) {
                                //这里是回调函数
                                console.log(res);
                            },
                            cancel: function (res) {
                                // 用户取消分享后执行的回调函数
                                console.log(res);
                            }
                        });
                    })
                })
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

                                            if(that.showTime==1){
                                                that.getProjList();
                                            }
                                            if(that.showTime==2){
                                                that.getWorkerList();
                                            }
                                            if(that.showTime==3){
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

                                                if(that.showTime==1){
                                                    that.getProjList();
                                                }
                                                if(that.showTime==2){
                                                    that.getWorkerList();
                                                }
                                                if(that.showTime==3){
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

                                    if(that.showTime==1){
                                        that.getProjList();
                                    }
                                    if(that.showTime==2){
                                        that.getWorkerList();
                                    }
                                    if(that.showTime==3){
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

                            if(this.showTime==1){
                                this.getProjList();
                            }
                            if(this.showTime==2){
                                this.getWorkerList();
                            }
                            if(this.showTime==3){
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
            this.$store.state.pubilcFreeGroupUpData = [];

            let domain = window.location.hostname;
            // console.log('域名',shareServer,encodeURIComponent(shareServer), shareAppid);
            console.log('域名2',domain);

            var query = $$.parseUrlQuery(window.location.href);
            var query2 = window.location.search;
            var query3 = window.location.href;
            console.log(query);
            console.log(query2);
            console.log(query3);

            this.code = query2.substring(query2.indexOf('=')+1, query2.indexOf('&'));
            this.inviterId = query.inviterId;
            this.url = query3.split('#')[0]
            console.log(this.code);
            console.log(this.inviterId);
            console.log(this.url);

            wxApi.judgeBindWx(this.code).then((result)=>{
                console.log('个人账户', result.data);
                this.user = result.data;
                this.userId = result.data.id;
                this.compShow = result.code;
                // this.num = result.code;
                console.log('判断用户身份',result.data.workGroupId);
                if(result.data.workGroupId){
                    this.$store.state.workGroupId = result.data.workGroupId;
                }else{
                    this.$store.state.workGroupId = 0;
                }
                LocalCache.set('userInfo', result.data);
                LocalCache.set('sessionkey', result.data.wxSessionkey);
                console.log('loginResult:' + JSON.stringify(result));

                this.enterPage();
            },
            (error)=>{
                if(error.code==12){
                    this.compShow = error.code;
                    console.log('错误代码12');
                }else{
                    console.log('登陆失败'+JSON.stringify(error));
                    // this.$f7.alert('登陆失败'+JSON.stringify(error));
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

                    if(that.showTime==1){
                        that.getProjList();
                    }
                    if(that.showTime==2){
                        that.getWorkerList();
                    }
                    if(that.showTime==3){
                        that.workSearchJobList();
                    }
                    p.close();
                    that.$f7.closeModal();
                }
            })

            var loading = false;
            $$('.infinite-scroll').on('infinite', ()=>{
                if(loading) return;
                loading = true;

                var that = this;
                setTimeout(()=>{
                    that.page++;
                    console.log('我被点击了',that.page);
                    loading = false;

                    if(this.showTime==1){
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
                    if(this.showTime==2){
                        wxApi.recruitWorkerList(
                            this.page,
                            this.pageSize,
                            this.cityId,
                            this.typecode,
                            this.time
                        ).then((result)=> {
                            that.workListLength = result.data.length;
                            for(var l=0;l<result.data.length;l++){
                                if(result.data[l].lookingJobEntity!=null){
                                    result.data[l].lookingJobEntity.treatmentNames = result.data[l].lookingJobEntity.treatmentNames.split(",");
                                    result.data[l].lookingJobEntity.littleBigs = result.data[l].lookingJobEntity.littleBigs.split(",");
                                    result.data[l].lookingJobEntity.workTypeNames = result.data[l].lookingJobEntity.workTypeNames.split(",");
                                    result.data[l].lookingJobEntity.expectTime = moment(result.data[l].lookingJobEntity.expectTime).format("YYYY-MM-DD")+'起'

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
                            that.workerList = that.workerList.concat(result.data);
                            console.log('工人列表',that.workerList);
                        })
                    }
                    if(this.showTime==3){
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

        }
    }
</script>

<style scoped>
    .page-on-left{
        transform: translate3d(0,0,0);  -webkit-transform: translate3d(0,0,0);
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
        width: 33%; text-align: center; font-size: 0.7rem; color: #666; font-size: 0.7rem; color: #666; display: inline-block;
    }
    .nav .n span{
        display: inline-block; line-height: 45px;
    }
    .nav .n span.active{
        border-bottom: 2px solid #438CFF; color: #438CFF;
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
    /*蒙尘效果*/
    .allpage{
        width: 100%; height: 100%; position: fixed; left: 0; top: 0; right: 0; bottom: 0; background: #000; opacity: 0.6; z-index: 999;
    }
    .allpage img{
        width: 255px; height: 345px; position: fixed; right: 24px;
    }
    .allpage .know{
        width: 90px; height: 30px; border: 1px solid #f4f4f4; text-align: center; line-height: 30px; color: #f4f4f4; font-size: 16px;
        position: absolute; left: 38%; top: 360px;
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
        background: #227FC5;
    }
    .title .tp3 .left3 a{
        display: inline-block; width: 100%; height: 100%; color: #fff;
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