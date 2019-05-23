<template>
    <div data-page="shareAllData" class="page navbar-fixed" @page:reinit="back">
        <div class="page-content">
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
            <div class="nav">
                <div class="n" @click="oneBtn"><span :class="{active: isShow==1}">项目分包</span></div>
                <div class="n" @click="twoBtn"><span :class="{active: isShow==2}">找工人</span></div>
                <div class="n" @click="threeBtn"><span :class="{active: isShow==3}">找活干</span></div>
            </div>
            <div>
                <div class="main" v-show="isShow==1">
                    <ul class="aul">
                        <li v-for="(item, index) in projList">
                            <div class="sit">
                                <div class="ent">
                                    <img class="st" src="../../static/img/wendan.png"/>
                                    <div class="st2">
                                        <div class="skew">
                                            <div class="skew-main" v-if="item.batchNumber">{{item.workDemandList[0].title?item.workDemandList[0].title:item.city.name+'招'+item.workDemandList[0].workTypeName}}</div>
                                            <div class="skew-main" v-if="!item.batchNumber">该项目暂无用工需求</div>
                                        </div>
                                    </div>
                                    <img class="st3" v-if="item.batchNumber" src="../../static/img/shibianxin_icom.png"/>
                                </div>
                                <div class="int" @click="contactProj(index, item)">
                                    <img src="../../static/img/phone_icom.png"/>
                                </div>
                            </div>
                            <div class="tov">
                                <div class="shan">
                                    <img class="one" src="../../static/img/projrenzhen.png"/>
                                    <img class="two" src="../../static/img/projzhizhao.png"/>
                                    <span class="three" v-if="item.batchNumber&&item.workDemandList[0].cost != null">工程造价{{item.workDemandList[0].cost}}万</span>
                                </div>
                                <div class="xia">
                                    <span>{{item.project.name}}</span>
                                    <img src="../../static/img/btn_drop_down.png"/>
                                </div>
                            </div>
                            <div class="single" v-if="item.batchNumber">
                                <div class="up">
                                    <div class="left">
                                        <img src="../../static/img/recruit_time_worker.png" v-if="item.workDemandList[0].demandType==1"/>
                                        <img src="../../static/img/recruit_contractor.png" v-else-if="item.workDemandList[0].demandType==2"/>
                                        <img src="../../static/img/recruit_group.png" v-else-if="item.workDemandList[0].demandType==3"/>
                                        <img src="../../static/img/recruit_worker.png" v-else-if="item.workDemandList[0].demandType==4"/>
                                        <img src="../../static/img/zhaogong.png" v-else/>
                                        <span>{{item.workDemandList[0].workTypeName}}</span>
                                    </div>
                                    <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{item.workDemandList[0].demandAmount}}</span>人</div>
                                    <div class="left3">
                                        <span v-show="item.workDemandList[0].salaryType==3">{{item.workDemandList[0].salary}}</span>
                                        <span v-show="item.workDemandList[0].salaryType==1">{{item.workDemandList[0].salary}}元/天</span>
                                        <span v-show="item.workDemandList[0].salaryType==2">{{item.workDemandList[0].salary}}元/小时</span>
                                        <span v-show="item.workDemandList[0].salaryType==4">{{item.workDemandList[0].salary}}元/月</span>
                                        <span v-show="item.workDemandList[0].salaryType==5">{{item.workDemandList[0].salary}}元/平方</span>
                                    </div>
                                </div>
                                <div class="cent">
                                    <div class="left">
                                        <span v-show="item.workDemandList[0].treatmentsName!=''" v-for="one in item.workDemandList[0].treatmentsName.split(',')">{{one}}</span>
                                        <span v-show="item.workDemandList[0].tlementName">{{item.workDemandList[0].tlementName}}</span>
                                    </div>
                                    <div class="right">时间 <span>|</span> {{item.workDemandList[0].demandTime}}</div>
                                </div>
                                <div class="cent2">
                                    <div class="left">材料 <span>|</span> {{toNull(item.workDemandList[0].materialReqName)}}</div>
                                    <div class="right">设备 <span>|</span> {{toNull(item.workDemandList[0].deviceReqName)}}</div>
                                </div>
                                <div class="cent3" v-show="item.workDemandList[0].remark!=''">
                                    <img src="../../static/img/tonggao.png"/>
                                    <div class="right">{{item.workDemandList[0].remark}}</div>
                                </div>
                                <div class="down">
                                    <div class="left">
                                        发布日期 : {{item.workDemandList[0].createTime}}
                                    </div>
                                    <div class="right">
                                        <img src="../../static/img/dingwei_icom.png"/>
                                        <span>{{item.project.location}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="single" v-if="!item.batchNumber">
                                <div class="down">
                                    <div class="right">
                                        <img src="../../static/img/dingwei_icom.png"/>
                                        <span>{{item.project.location}}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="main2" v-show="isShow==2">
                    <ul class="aul2">
                        <li v-for="item in workerList">
                            <div class="a2">
                                <div class="a2-1">
                                    <div v-if="item.lookingJobExist">
                                        <span v-if="item.lookingJobEntity.displayName">{{item.lookingJobEntity.displayName}}</span>
                                    </div>
                                    <div v-else-if="item.name">{{item.name}}</div>
                                    <div v-else-if="item.nickname">{{item.nickname}}</div>
                                    <div v-else="item.mobile">{{item.mobile.substr(0,3)+'******'+item.mobile.substr(8)}}</div>
                                    <div class="he" v-if="(item.lookingJobExist && item.lookingJobEntity.nativeProvinceName) || item.userDetail.nation">
                                        <span v-if="item.userDetail.nation">{{item.userDetail.nation}}族</span>
                                        <span v-if="item.lookingJobExist && item.lookingJobEntity.nativeProvinceName && item.userDetail.nation">|</span>
                                        <span v-if="item.lookingJobExist && item.lookingJobEntity.nativeProvinceName">{{item.lookingJobEntity.nativeProvinceName}}人</span>
                                    </div>
                                    <img v-show="item.userDetail.idNumber" src="../../static/img/shareYishiming.png"/>
                                    <div class="grouper" v-if="item.workGroupId!=null">班组长</div>
                                </div>
                                <div class="a2-2" @click="contactWorker(item)">
                                    <img src="../../static/img/phone_icom.png"/>
                                </div>
                            </div>
                            <div class="cent">
                                <div class="a3">
                                    <div class="a3-1">
                                        <div class="left">工种类型 | </div>&nbsp;
                                        <div class="right">
                                            <span v-if="item.lookingJobExist==true" >
                                                <span v-for="(workTypeItem,index) in item.lookingJobEntity.workTypeNames">
                                                    <span class="u2" >{{workTypeItem}}</span><span class="u3" v-show="item.lookingJobEntity.littleBigs[index]==0">大工</span><span class="u4" v-show="item.lookingJobEntity.littleBigs[index]==1">小工</span>
                                                </span>
                                            </span>
                                            <span v-else>
                                                <span class="u2">{{item.workTypeName}}</span> <span class="u3" v-show="item.littleBig==0">大工</span><span class="u4" v-show="item.littleBig==1">小工</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="a3-2">
                                        <div class="left"><span class="f2">期望薪资 | </span><span class="f3" v-if="item.lookingJobExist==true">{{item.lookingJobEntity.salary}}{{item.lookingJobEntity.salaryLabel}}</span><span v-else>--</span></div>
                                        <div class="right" v-if="item.workingExp!=null"><span>工龄{{item.workingExp}}年</span></div>
                                    </div>
                                    <div class="a3-2">
                                        <div class="left2"><span class="t2">待遇需求 | </span><span v-if="item.lookingJobExist==true"><span  class="t3" v-for="treatmentItem in item.lookingJobEntity.treatmentNames">{{treatmentItem}}</span></span><span v-else>--</span></div>
                                        <div class="right2"><span class="r2">时间 | </span>&nbsp;<span v-if="item.lookingJobExist==true" class="r3">{{item.lookingJobEntity.expectTime}}</span><span v-else>--</span></div>
                                    </div>
                                </div>
                                <div class="a5">
                                    <img src="../../static/img/tonggao.png"/>
                                    <div class="right">{{item.remark}}</div>
                                </div>
                                <div class="bom">
                                    <img src="../../static/img/grayxiaodinwei2.png"/>
                                    <span>{{item.province}}{{item.city}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="main3" v-show="isShow==3">
                    <ul class="aul3">
                        <li v-for="item in workerSearchJobList">
                            <div class="sit">
                                <div class="ent">
                                    <img class="st" src="../../static/img/wendan.png"/>
                                    <div class="st2">
                                        <div class="skew">
                                            <div class="skew-main">{{item.title?item.title:item.city.name+'招'+item.workType}}</div>
                                        </div>
                                    </div>
                                    <img class="st3" src="../../static/img/shibianxin_icom.png"/>
                                </div>
                                <div class="int" @click="contactGrouper(item)">
                                    <img src="../../static/img/phone_icom.png"/>
                                </div>
                            </div>
                            <div class="a2">
                                <div class="a2-1">
                                    <span class="wg">{{item.workGroup.name}}</span>
                                    <img v-if="item.workGroup.user.userDetail.idNumber" src="../../static/img/shareYishiming.png"/>
                                    <img v-if="item.workGroup.memberCount>1" src="../../static/img/shareYirengzhen.png"/>
                                    <span v-if="item.workGroup.memberCount>1"  class="wg2">班组{{item.workGroup.memberCount}}人</span>
                                </div>
                            </div>
                            <div class="single">
                                <div class="up">
                                    <div class="left">
                                        <img src="../../static/img/recruit_time_worker.png" v-if="item.demandType==1"/>
                                        <img src="../../static/img/recruit_contractor.png" v-else-if="item.demandType==2"/>
                                        <img src="../../static/img/recruit_group.png" v-else-if="item.demandType==3"/>
                                        <img src="../../static/img/recruit_worker.png" v-else-if="item.demandType==4"/>
                                        <img src="../../static/img/zhaogong.png" v-else/>
                                        <span>{{item.workTypeName}}</span>
                                    </div>
                                    <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{item.demandAmount}}</span>人</div>
                                    <div class="left3"><span>{{item.salary}}{{item.salaryLabel}}</span></div>
                                </div>
                                <div class="cent">
                                    <div class="left"><span v-show="item.treatmentsName!=''" v-for="one in item.treatmentsName.split(',')">{{one}}</span><span v-show="item.tlementName!=''">{{item.tlementName}}</span></div>
                                    <div class="right">时间 <span>|</span> {{item.demandTime}}</div>
                                </div>
                                <div class="cent3" v-show="item.remark!=''">
                                    <img src="../../static/img/tonggao.png"/>
                                    <div class="right">{{item.remark}}</div>
                                </div>
                                <div class="down">
                                    <img src="../../static/img/grayxiaodinwei2.png"/>
                                    <span v-if="item.province">{{item.province.name}}</span><span v-if="item.city">{{item.city.name}}</span><span v-if="item.district">{{item.district.name}}</span><span>{{item.address}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="fix2" v-show="isShow==1"><a href="/user/sharePubilcFreeGroup/">
                <div class="imgTip" v-if="tipShow1">
                    <img src="../../static/img/search_tip_1.png" alt="" class="tipMain">
                    <img src="../../static/img/search_tip_close.png" alt="" @click="closeTip(1)" class="tipClose">
                </div>
                <span>+</span>&nbsp;发布班组</a>
            </div>
            <div class="fix2" v-show="isShow==2"><a href="/user/sharePubilcWorkerNeed/">
                <div class="imgTip" v-if="tipShow2">
                    <img src="../../static/img/search_tip_1.png" alt="" class="tipMain">
                    <img src="../../static/img/search_tip_close.png" alt="" @click="closeTip(2)" class="tipClose">
                </div>
                <span>+</span>&nbsp;发布招工</a>
            </div>
            <div class="fix2" v-show="isShow==3"><a href="/user/sharePubilcResume/">
                <div class="imgTip" v-if="tipShow3">
                    <img src="../../static/img/search_tip_1.png" alt="" class="tipMain">
                    <img src="../../static/img/search_tip_close.png" alt="" @click="closeTip(3)" class="tipClose">
                </div>
                <span>+</span>&nbsp;我要找活</a>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    var pickerAddress;
    import {userApi, tabulateStatisticsApi, wxApi, projectApi} from "../api/index";
    import { LocalCache } from '../lib/utils';
    import { shareServer } from '../config';
    import moment from 'moment';
    import phone_icon from '../../static/img/phone_icon.png';
    export default {
        data(){
            return{
                isShow: 2,
                page: 1,
                pageSize: 10,
                typecode: '',
                time: '',
                years: '',
                provinceId: '',
                cityId: '',
                projList: [],                  //班组长找项目列表
                projListLength: '',
                workerList: [],                //班组长找工作列表
                workListLength: '',
                workerSearchJobList: [],                 //工人找工人列表
                workerSearchJobListLength: '',
                workerTitle: [],
                codeNum: -1,                    //判断这个人是否已有公众号账户
                treatment: [],                  //待遇条件
                mobile: '',

                code: '',
                inviterId: '',
                url: '',
                user: '',
                userId: '',
                number: 0,
                animate: false,
                marqueeList: [
                    {
                        notification:'',
                        link:''
                    }
                ],
                noLink:'javascript:;',
                // listLength: ''
                tipShow1:true,
                tipShow2:true,
                tipShow3:true,
                demandTypeList:[]
            }
        },
        methods:{
            back(){
                wxApi.judgeBindWx(this.code).then(
                    (result)=>{
                        this.codeNum = result.code;
                        console.log('个人账户', result.data, this.codeNum);
                        this.userId = result.data.id;
                        LocalCache.set('userInfo', result.data);
                        LocalCache.set('sessionkey', result.data.wxSessionkey);
                        console.log('loginResult:' + JSON.stringify(result));

                        wxApi.lookUserContact(this.userId).then((result)=>{
                            this.number = result.data.times;
                            console.log('次数',result.data);
                        })
                    },
                    (error)=>{
                        this.codeNum = 1;
                        console.log('是否绑定', this.codeNum);
                    }
                )
            },
            closeTip(type){
                if(type==1){
                    this.tipShow1 = false
                    this.tipShow2 = true
                    this.tipShow3 = true
                }else if(type==2){
                    this.tipShow2 = false
                    this.tipShow1 = true
                    this.tipShow3 = true
                }else if(type==3){
                    this.tipShow3 = false
                    this.tipShow2 = true
                    this.tipShow1 = true
                }
            },
            toNull(val){
                if(val==""||val==undefined || val==null){
                    return "--"
                }  else {
                    return val
                }
            },
            oneBtn(){
                this.page = 1;
                this.provinceId = '';
                this.cityId = '';
                $$('.h3').text('选择城市');
                this.isShow = 1;
                this.groupFindProj();
            },
            twoBtn(){
                this.page = 1;
                this.provinceId = '';
                this.cityId = '';
                this.isShow = 2;
                $$('.h3').text('选择城市');
            },
            threeBtn(){
                this.page = 1;
                this.provinceId = '';
                this.cityId = '';
                this.isShow = 3;
                $$('.h3').text('选择城市');
                this.workerFindJob();
            },
            contactProj(index, item){
                if(this.code==''){
                    this.$router.load({url: '/user/sharePage/'});
                }else{
                    if(this.codeNum==1){
                        this.$router.load({url: '/user/searchJob'});
                    }
                    if(this.codeNum==0){
                        let batch = $$('.a2 .contact2').eq(index).data('id');
                        console.log('批次',batch);
                        if(!item.batchNumber){
                            this.$f7.alert('该项目暂无用工需求，请查询其他项目');
                        }else{
                            if(this.number==0){
                                this.$f7.alert('用户联系次数已用完，邀请好友增加联系次数');
                            }else{
                                wxApi.getUserMobile(item.createUser).then((res)=>{
                                    console.log('个人详情',res.data);
                                    this.mobile = res.data;
                                    let hideMobile = this.mobile.substr(0,3)+'****'+this.mobile.substr(7);
                                    this.$f7.modal({
                                        text: '<div class="tabs">' +
                                        '<img style="width: 1rem; height: 1.1rem; transform: translateY(0.3rem)" src=' + phone_icon + '>' +
                                        '<a>' + hideMobile + '</a>' +
                                        '</div>',
                                        buttons: [
                                            {
                                                text: '取消'
                                            },
                                            {
                                                text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:'+this.mobile+'" class="external">' + "拨号" + '</a>',
                                                onClick: ()=>{
                                                    console.log('我点击了拨号');
                                                    wxApi.groupApplyFor(item.batchNumber).then((result)=>{
                                                        console.log(result.data);
                                                    })
                                                    wxApi.subOneTimes(this.userId).then((result)=>{
                                                        this.number = result.data.times;
                                                        console.log('次数',result.data);
                                                        this.$emit('childComponents',this.number);
                                                    })
                                                }
                                            },
                                        ]
                                    })
                                })
                            }
                        }
                    }
                }
            },
            contactGrouper(item) {
                console.log('我点击了');
                if(this.code==''){
                    this.$router.load({url: '/user/sharePage/'});
                }else {
                    if(this.codeNum==1){
                        this.$router.load({url: '/user/searchJob'});
                    }
                    if(this.codeNum==0){
                        if (this.number == 0) {
                            this.$f7.alert('您的联系次数已用完，邀请工友获得联系次数');
                        } else {
                            console.log('我进入了这个里面');
                            wxApi.getGrouperPhone(item.workGroupId).then((result) => {
                                this.mobile = result.data;
                                let hideMobile = this.mobile.substr(0, 3) + '****' + this.mobile.substr(7);
                                console.log(result.data);
                                this.$f7.modal({
                                    text: '<div class="tabs">' +
                                    '<img style="width: 1rem; height: 1.1rem; transform: translateY(0.3rem)" src=' + phone_icon + '>' +
                                    '<a>' + hideMobile + '</a>' +
                                    '</div>',
                                    buttons: [
                                        {
                                            text: '取消'
                                        },
                                        {
                                            text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:' + this.mobile + '" class="external">' + "拨号" + '</a>',
                                            onClick: () => {
                                                wxApi.workerApplyFor(item.id).then((result) => {
                                                    console.log(result.data);
                                                    item.send = true;
                                                    wxApi.subOneTimes(this.userId).then((result) => {
                                                        this.number = result.data.times;
                                                        console.log('次数', result.data);
                                                    })
                                                })
                                            }
                                        },
                                    ]
                                })
                            })
                        }
                    }
                }
            },
            contactWorker(item){
                if(this.code==''){
                    this.$router.load({url: '/user/sharePage/'});
                }else {
                    if(this.codeNum==1){
                        this.$router.load({url: '/user/searchJob'});
                    }
                    if(this.codeNum==0){
                        let hideMobile = item.mobile.substr(0, 3) + '****' + item.mobile.substr(7);
                        if (this.number == 0) {
                            this.$f7.alert('用户联系次数已用完，邀请好友增加联系次数');
                        } else {
                            wxApi.getUserMobile(item.id).then((res)=> {
                                console.log('个人详情', res.data);
                                let mobile = res.data;
                                let hideMobile = mobile.substr(0, 3) + '****' + mobile.substr(7);
                                this.$f7.modal({
                                    text: '<div class="tabs">' +
                                    '<img style="width: 1rem; height: 1.1rem; transform: translateY(0.3rem)" src=' + phone_icon + '>' +
                                    '<a>' + hideMobile + '</a>' +
                                    '</div>',
                                    buttons: [
                                        {
                                            text: '取消'
                                        },
                                        {
                                            text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:' + mobile + '" class="external">' + "拨号" + '</a>',
                                            onClick: () => {
                                                console.log('我点击了拨号');
                                                wxApi.subOneTimes(this.userId).then((result) => {
                                                    this.number = result.data.times;
                                                    console.log('次数', result.data);
                                                })
                                            }
                                        },
                                    ]
                                })
                            })
                        }
                    }
                }
            },
            allWordAction(){
                this.$f7.alert('请登录智工通查看更多信息');
            },
            groupFindProj(){
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
            groupFindWorker(){
                let that = this
                wxApi.recruitWorkerList(
                    this.page,
                    this.pageSize,
                    this.cityId,
                    this.typecode,
                    this.years
                ).then((result)=>{
                    console.log(result.data);
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
            workerFindJob(){
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
            isBind(){
                if(this.code==''){

                }else{
                    wxApi.judgeBindWx(this.code).then(
                        (result)=>{
                            this.codeNum = result.code;
                            console.log('个人账户', result.data, this.codeNum);
                            this.userId = result.data.id;
                            LocalCache.set('userInfo', result.data);
                            LocalCache.set('sessionkey', result.data.wxSessionkey);
                            console.log('loginResult:' + JSON.stringify(result));

                            wxApi.lookUserContact(this.userId).then((result)=>{
                                this.number = result.data.times;
                                console.log('次数',result.data);
                            })
                        },
                        (error)=>{
                            this.codeNum = 1;
                            console.log('是否绑定', this.codeNum);
                        }
                    )
                }
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
            var query = $$.parseUrlQuery(window.location.href);
            var query2 = window.location.search;
            var query3 = window.location.href;
            console.log('微信',query);
            console.log('微信2',query2);
            console.log('微信3',query3);

            this.code = query2.substring(query2.indexOf('=')+1, query2.indexOf('&'));
            this.inviterId = query.inviterId;
            this.url = query3.split('#')[0];
            console.log('微信4',this.code);
            console.log('微信5',this.inviterId);
            console.log('微信6',this.url);

            this.isBind();

            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=>{
                    this.workerTitle = result.data.list.reverse();
                    this.$store.state.workerTitle = this.workerTitle;
                    console.log(this.workerTitle);
                })
            }

            this.groupFindWorker();    //刚进页面时加载的数据

            if(this.$store.state.treatment){
                this.treatment = this.$store.state.treatment;
            }else{
                wxApi.getTreatments().then((result)=>{
                    console.log('待遇条件',result.data);
                    this.treatment = result.data;
                    this.$store.state.treatment = this.treatment;
                })
            }

        }
    }
</script>

<style scoped>
    .page-on-left{
        transform: translate3d(0,0,0);  -webkit-transform: translate3d(0,0,0);
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .navbar-fixed .page-content, .navbar-through .page-content, .subnavbar~.page-content{
        padding-top: 0;
    }
    .nav{
        width: 100%; height: 45px; background: #fff; display: flex;
    }
    .nav .n{
        width: 33%; text-align: center; line-height: 45px; font-size: 0.7rem; color: #666;
    }
    .nav .n span{
        display: inline-block; height: 45px;
    }
    .nav .n span.active{
        border-bottom: 2px solid #438CFF; color: #438CFF;
    }

    .main{
        margin-bottom: 4rem;
    }
    .main .aul li{
        background: #fff; margin-top: 0.5rem;
    }
    .main .aul li .sit{
        width: 100%; height: 35px; background: #fff; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul li .sit .ent{
        flex: 1; text-align: center;
    }
    .main .aul li .sit .int{
        width: 34px; text-align: right;
    }
    .main .aul li .sit .int img{
        width: 1.25rem; height: 1.25rem; margin-top: 7px;
    }
    .main .aul li .sit .ent .st{
        width: 1rem; height: 1rem; display: inline-block; margin-top: 6px; transform: translateX(5px);
    }
    .main .aul li .sit .ent .st2{
        color: #fff; display: inline-block; transform: translateY(-8px); position: relative; z-index: 2;
    }
    .main .aul li .sit .ent .st2 .skew{
        height: 22px; background: #9FC6FC; color: #123f65; font-weight: 700; letter-spacing: 1px; font-size: 0.65rem; transform: skew(-15deg);
    }
    .main .aul li .sit .ent .st2 .skew .skew-main{
        transform: skew(15deg); padding: 0 7px; transform: translateY(4px);
    }
    .main .aul li .sit .ent .st3{
        width: 1.7rem; height: 1.4rem; display: inline-block; transform: translateX(-26px); position: relative; top: 2px;
    }
    .main .aul li .tov{
        width: 100%; height: 1.9rem; background: #F6FAFD; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul li .tov .shan{
        display: flex;
    }
    .main .aul li .tov .shan .one{
        width: 2.85rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
    }
    .main .aul li .tov .shan .two{
        width: 2.55rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
    }
    .main .aul li .tov .shan .three{
        height: 0.65rem; display: inline-block; box-sizing: border-box; padding: 0 0.2rem; border: 1px solid #8E9223; border-radius: 1px; font-size: 0.4rem; color: #8E9223;
    }
    .main .aul li .tov .xia{
        width: 100%; font-size: 0.65rem; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 5px;
    }
    .main .aul li .tov .xia img{
        width: 0.6rem; height: 0.6rem; display: inline-block; transform: translateY(2px);
    }
    .main .aul li .single{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
    }
    .main .aul li .single .up{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul li .single .up .left{
        display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
    }
    .main .aul li .single .up .left img{
        height: 0.75rem; display: inline-block; transform: translateY(2px);
    }
    .main .aul li .single .up .left2{
        font-size: 0.6rem; color: #666666;
    }
    .main .aul li .single .up .left2 .f-2{
        color: #ccc;
    }
    .main .aul li .single .up .left2 .f-3{
        color: #F13333; font-size: 0.75rem;
    }
    .main .aul li .single .up .left3 span{
        box-sizing: border-box; padding: 3px 4px; background: #F05A5A; border-radius: 1px; font-size: 0.6rem; color: #fff;
    }
    .main .aul li .single .cent{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul li .single .cent .left span{
        display: inline-block; height: 0.8rem; line-height: 0.8rem; box-sizing: border-box; padding: 0 6px; background: #EEEEEE;
        font-size: 0.55rem; color: #666; margin-right: 5px;
    }
    .main .aul li .single .cent .right{
        font-size: 0.6rem; color: #666;
    }
    .main .aul li .single .cent .right span{
        color: #ccc;
    }
    .main .aul li .single .cent2{
        width: 100%; height: 30px; line-height: 30px; font-size: 0.6rem; color: #666; display: flex;
    }
    .main .aul li .single .cent2 .left{
        width: 50%;
    }
    .main .aul li .single .cent2 .right{
        width: 50%;
    }
    .main .aul li .single .cent2 .left span, .right span{
        color: #ccc;
    }
    .main .aul li .single .cent3{
        background: #f4f8fd; box-sizing: border-box; padding: 6px 0; display: flex;
    }
    .main .aul li .single .cent3 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main .aul li .single .cent3 .right{
        flex: 1; font-size: 0.55rem; color: #333;
    }
    .main .aul li .single .down{
        width: 100%; height: 1.2rem; line-height: 1.2rem; display: flex; justify-content: space-between;
    }
    .main .aul li .single .down .left{
        display: flex; font-size: 0.6rem; color: #999;
    }
    .main .aul li .single .down .right span{
        font-size: 0.55rem; color: #888;
    }
    .main .aul li .single .down .right img{
        width: 0.5rem; height: 0.6rem; display: inline-block; transform: translateY(3px);
    }

    .main2{
        margin-bottom: 4rem;
    }
    .main2 .aul2 li{
        background: #fff; margin-top: 0.5rem;
    }
    .main2 .aul2 li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; background: #F2F7FB; border-bottom: 1px solid #D8E7FE;
        display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.85rem 0 1rem;
    }
    .main2 .aul2 li .a2-1{
        flex: 1; font-size: 0.75rem; color: #555; font-weight: 700;
    }
    .main2 .aul2 li .a2-1 > div{
        display: inline-block;
    }
    .main2 .aul2 li .a2-1 .he{
        height: 14px; line-height: 14px; font-size: 0.4rem; color: #fff; padding: 0 4px; background: #D0C3C0; letter-spacing: 1px; position: relative; top: -3px;
    }
    .main2 .aul2 li .a2-1 .grouper{
        display: inline-block; width: 30px; height: 14px; line-height: 14px; text-align: center; font-size: 0.4rem; color: #DE9D57; border: 1px solid #DE9D57; transform: translateY(-2px);
    }
    .main2 .aul2 li .a2-1 img{
        width: 38px; height: 14px; display: inline; transform: translateY(2px);
    }
    .main2 .aul2 li .a2-2{
        width: 40px; text-align: right;
    }
    .main2 .aul2 li .a2-2 img{
        width: 1.25rem; height: 1.25rem; display: inline-block; text-align: center; margin-top: 4px;
    }

    .main2 .aul2 li .cent{
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .main2 .aul2 li .cent .a3{

    }
    .main2 .aul2 li .cent .a3 .a3-1{
        width: 100%; height: 26px; line-height: 26px; display: flex; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .main2 .aul2 li .cent .a3 .a3-1 .left{
        font-size: 0.6rem; color: #999;
    }
    .main2 .aul2 li .cent .a3 .a3-1 .right .u2{
        color: #438CFF;
    }
    .main2 .aul2 li .cent .a3 .a3-2{
        width: 100%; height: 26px; line-height: 26px; display: flex; justify-content: space-between;
    }
    .main2 .aul2 li .cent .a3 .a3-2 .left{
        font-size: 0.6rem;
    }
    .main2 .aul2 li .cent .a3 .a3-2 .left .f2{
        color: #999;
    }
    .main2 .aul2 li .cent .a3 .a3-2 .left .f3{
        font-size: 0.8rem; color: #E85050;
    }
    .main2 .aul2 li .cent .a3 .a3-2 .right{

    }
    .main2 .aul2 li .cent .a3 .a3-2 .right span{
        box-sizing: border-box; padding: 2px 4px; font-size: 0.55rem; color: #FEFEFE; border-radius: 1px; background: #E89578;
    }
    .main2 .aul2 li .cent .a3 .a3-2 .left2{
        font-size: 0.6rem;
    }
    .main2 .aul2 li .cent .a3 .a3-2 .left2 .t2{
        color: #999;
    }
    .main2 .aul2 li .cent .a3 .a3-2 .left2 .t3{
        display: inline-block; margin-right: 5px; height: 0.85rem; line-height: 0.85rem; box-sizing: border-box; padding: 0 5px; font-size: 0.55rem; color: #666; background: #EEEEEE;
    }
    .main2 .aul2 li .cent .a3 .a3-2 .right2{
        font-size: 0.6rem;
    }
    .main2 .aul2 li .cent .a3 .a3-2 .right2 .r2{
        color: #999;
    }
    .main2 .aul2 li .cent .a3 .a3-2 .right2 .r3{
        color: #666;
    }

    .main2 .aul2 li .cent .a5{
        background: #f4f8fd; box-sizing: border-box; padding: 6px 0; display: flex;
    }
    .main2 .aul2 li .cent .a5 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main2 .aul2 li .cent .a5 .right{
        flex: 1; font-size: 0.55rem; color: #333;
    }
    .main2 .aul2 li .bom{
        width: 100%; height: 24px; line-height: 24px; font-size: 0.5rem; color: #888;
    }
    .main2 .aul2 li .bom img{
        width: 9px; height: 11px; display: inline-block; transform: translateY(2px);
    }

    .main3{
        margin-bottom: 4rem;
    }
    .main3 .aul3 li{
        background: #fff; margin-top: 0.5rem;
    }
    .main3 .aul3 li .sit{
        width: 100%; height: 35px; background: #fff; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main3 .aul3 li .sit .ent{
        flex: 1; text-align: center;
    }
    .main3 .aul3 li .sit .int{
        width: 34px; text-align: right;
    }
    .main3 .aul3 li .sit .int img{
        width: 1.25rem; height: 1.25rem; margin-top: 7px;
    }
    .main3 .aul3 li .sit .ent .st{
        width: 1rem; height: 1rem; display: inline-block; margin-top: 6px; transform: translateX(5px);
    }
    .main3 .aul3 li .sit .ent .st2{
        color: #fff; display: inline-block; transform: translateY(-8px); position: relative; z-index: 2;
    }
    .main3 .aul3 li .sit .ent .st2 .skew{
        height: 22px; background: #9FC6FC; color: #123f65; font-weight: 700; letter-spacing: 1px; font-size: 0.65rem; transform: skew(-15deg);
    }
    .main3 .aul3 li .sit .ent .st2 .skew .skew-main{
        transform: skew(15deg); padding: 0 7px; transform: translateY(4px);
    }
    .main3 .aul3 li .sit .ent .st3{
        width: 1.7rem; height: 1.4rem; display: inline-block; transform: translateX(-26px); position: relative; top: 2px;
    }
    .main3 .aul3 li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; border-bottom: 1px solid #DDDEE2; display: flex; justify-content: space-between;
        background: #F2F7FB; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main3 .aul3 li .a2 .a2-1 .wg{
        font-size: 0.75rem; color: #555; padding-right: 0.5rem;
    }
    .main3 .aul3 li .a2 .a2-1 img{
        width: 1.9rem; height: 0.7rem; transform: translateY(3px);
    }
    .main3 .aul3 li .a2 .a2-1 .wg2{
        display: inline-block; height: 0.6rem; line-height: 0.6rem; border: 1px solid #FC7C2E; font-size: 0.4rem; color: #F55C11; border-radius: 1px; padding: 0 4px; transform: translateY(-2px);
    }
    .main3 .aul3 li .a2-2{
        height: 1.75rem;
    }
    .main3 .aul3 li .a2-2 img{
        width: 1.25rem; height: 1.25rem; display: inline-block; margin-top: 0.3rem;
    }
    .main3 .aul3 li .single{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem 0.5rem 0.6rem; background: #fff;
    }
    .main3 .aul3 li .single .up{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main3 .aul3 li .single .up .left{
        display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
    }
    .main3 .aul3 li .single .up .left img{
        height: 0.75rem; display: inline-block; transform: translateY(2px);
    }
    .main3 .aul3 li .single .up .left2{
        font-size: 0.6rem; color: #666666;
    }
    .main3 .aul3 li .single .up .left2 .f-2{
        color: #ccc;
    }
    .main3 .aul3 li .single .up .left2 .f-3{
        color: #F13333; font-size: 0.75rem;
    }
    .main3 .aul3 li .single .up .left3 span{
        box-sizing: border-box; padding: 3px 4px; background: #F05A5A; border-radius: 1px; font-size: 0.6rem; color: #fff;
    }
    .main3 .aul3 li .single .cent{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main3 .aul3 li .single .cent .left span{
        display: inline-block; height: 0.8rem; line-height: 0.8rem; box-sizing: border-box; padding: 0 6px; background: #EEEEEE;
        font-size: 0.55rem; color: #666; margin-right: 5px;
    }
    .main3 .aul3 li .single .cent .right{
        font-size: 0.6rem; color: #666;
    }
    .main3 .aul3 li .single .cent .right span{
        color: #ccc;
    }
    .main3 .aul3 li .single .cent3{
        background: #f4f8fd; box-sizing: border-box; padding: 6px 0; display: flex;
    }
    .main3 .aul3 li .single .cent3 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main3 .aul3 li .single .cent3 .right{
        flex: 1; font-size: 0.55rem; color: #333;
    }
    .main3 .aul3 li .single .down{
        width: 100%; min-height: 1.25rem; background: #fff; font-size: 0.6rem; color: #999; box-sizing: border-box; padding: 7px 0;
    }
    .main3 .aul3 li .single .down  img{
        width: 0.5rem; height: 0.6rem; display: inline-block; transform: translateY(1px);
    }

    .fix2{
        width: 95px; height: 30px; line-height: 30px; text-align: center; border-radius: 0.75rem; font-weight: 700;
        background: linear-gradient(to top, #297BE1, #91BFF9);
        position: fixed; left: 36%; bottom: 20px; z-index: 4;
    }
    .fix2 a{
        display: inline-block; width: 100%; height: 100%; font-size: 0.7rem; color: #fff;
    }
    .u3,.u4{
        font-size: .5rem;
        padding: .1rem .1rem;
        color: #666666;
        background: #eaeaea;
        margin-right: .4rem;
    }
    .u2{
        margin-right: .2rem;
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
    .imgTip img{
        position: absolute;
        top: -5.5rem;
        left: 50%;
        margin-left: 20px;
    }
    .imgTip .tipMain{
        width: 6.75rem;
    }
    .imgTip .tipClose{
        width: 1rem;
        margin-left: 6.5rem;
        margin-top: 1rem;
    }
</style>