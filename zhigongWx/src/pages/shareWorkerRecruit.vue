<template>
    <div data-page="shareMyRecruit" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                </div>
                <div class="center sliding">分享工人信息</div>
            </div>
        </div>
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
            <div class="shareItem">
                <div class="a2">
                    <div class="a2-1">
                        <div v-if="recruitDetail.lookingJobEntity!=null">
                            <span v-if="recruitDetail.lookingJobEntity.displayName">{{recruitDetail.lookingJobEntity.displayName}}</span>
                        </div>
                        <div v-else-if="recruitDetail.name">{{recruitDetail.name}}</div>
                        <div v-else-if="recruitDetail.nickname">{{recruitDetail.nickname}}</div>
                        <div v-else="recruitDetail.mobile">{{recruitDetail.mobile.substr(0,3)+'******'+recruitDetail.mobile.substr(8)}}</div>
                        <div class="he" v-if="(recruitDetail.lookingJobEntity!=null&& recruitDetail.lookingJobEntity.nativeProvinceName) || recruitDetail.userDetail.nation">
                            <span v-if="recruitDetail.userDetail.nation">{{recruitDetail.userDetail.nation}}族</span>
                            <span v-if="recruitDetail.lookingJobEntity!=null && recruitDetail.lookingJobEntity.nativeProvinceName && recruitDetail.userDetail.nation">|</span>
                            <span v-if="recruitDetail.lookingJobEntity!=null&& recruitDetail.lookingJobEntity.nativeProvinceName">{{recruitDetail.lookingJobEntity.nativeProvinceName}}人</span>
                        </div>
                        <img v-show="recruitDetail.userDetail.idNumber" src="../../static/img/shareYishiming.png"/>
                        <div class="grouper" v-if="recruitDetail.workGroupId!=null">班组长</div>
                    </div>
                    <div class="a2-2" @click="connactAction">
                        <img src="../../static/img/phone_icom.png"/>
                    </div>
                </div>
                <div class="cent">
                    <div class="a3">
                        <div class="a3-1">
                            <div class="left">工种类型 | </div>&nbsp;
                            <div class="right">
                                <span v-if="recruitDetail.lookingJobEntity!=null" >
                                    <span v-for="(workTypeItem,index) in recruitDetail.lookingJobEntity.workTypeNames">
                                        <span class="u2" >{{workTypeItem}}</span><span class="u3" v-show="recruitDetail.lookingJobEntity.littleBigs[index]==0">大工</span><span class="u4" v-show="recruitDetail.lookingJobEntity.littleBigs[index]==1">小工</span>
                                    </span>
                                </span>
                                <span v-else>
                                    <span class="u2">{{recruitDetail.workTypeName}}</span> <span class="u3" v-show="recruitDetail.littleBig==0">大工</span><span class="u4" v-show="recruitDetail.littleBig==1">小工</span>
                                </span>
                            </div>
                        </div>
                        <div class="a3-2">
                            <div class="left"><span class="f2">期望薪资 | </span><span class="f3" v-if="recruitDetail.lookingJobEntity!=null">{{recruitDetail.lookingJobEntity.salary}}{{recruitDetail.lookingJobEntity.salaryLabel}}</span><span class="f3" v-else>面议</span></div>
                            <div class="right" v-if="recruitDetail.workingExp!=null"><span>工龄{{recruitDetail.workingExp}}年</span></div>
                        </div>
                        <div class="a3-2">
                            <div class="left2"><span class="t2">待遇需求 | </span><span v-if="recruitDetail.lookingJobEntity!=null&&recruitDetail.lookingJobEntity.treatmentNames[0]!=''"><span  class="t3" v-for="treatmentItem in recruitDetail.lookingJobEntity.treatmentNames">{{treatmentItem}}</span></span><span v-else>--</span></div>
                            <div class="right2"><span class="r2">时间 | </span>&nbsp;<span v-if="recruitDetail.lookingJobEntity!=null" class="r3">{{recruitDetail.lookingJobEntity.expectTime}}</span><span v-else>--</span></div>
                        </div>
                    </div>
                    <div class="a5">
                        <img src="../../static/img/tonggao.png"/>
                        <div class="right">{{recruitDetail.remark}}</div>
                    </div>
                    <div class="bom">
                        <img src="../../static/img/grayxiaodinwei2.png"/>
                        <span>{{recruitDetail.province}}{{recruitDetail.city}}</span>
                    </div>
                </div>
            </div>
            <div class="qrCodeBox">
                <img src="../../static/img/shibieguanzhu.png" alt="" class="qrCode">
                <div class="subtitle">
                    <img src="../../static/img/search_scan_tip.png" alt="" >
                </div>
                <div class="tipEnd">温馨提示：达成工作意向前请先核实双方身份，警惕要求付费转账等行为</div>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { tabulateStatisticsApi, wxApi} from '../api';
    import moment from "moment";
    import { LocalCache } from '../lib/utils';
    import phone_icon from '../../static/img/phone_icon.png';
    export default {
        data(){
            return{
                userId: '',
                number: '',
                mobile: '',
                id: '',          //用工id
                code: '',
                inviterId: '',
                url: '',
                isShow: '',
                title: '',           //以下都是页面数据
                groupName: '',
                workTypeName: '',
                demandAmount: '',
                demandTime: '',
                remark: '',
                salary: '',
                salaryType: '',
                treatmentsName: '',
                address: '',
                tlementName: '',
                userCount:'',
                idNumber: '',
                animate: false,
                marqueeList: [
                    {
                        notification:'',
                        link:''
                    }
                ],
                noLink:'javascript:;',
                demandType:'',
                recruitDetail:{
                    lookingJobEntity:{
                        workTypeNames:[],
                        treatmentNames:[],
                    },
                    userDetail:{
                        nation:'',
                    }
                },
            }
        },
        methods:{
            connactAction(){
                console.log(this.mobile);
                if(this.code=""){
                    this.$router.load({url: '/user/sharePage?inviterId='+this.inviterId});
                }else{
                    if(this.isShow==0){  //用户有微信公众号账户
                        if (this.number == 0) {
                            this.$f7.alert('您的联系次数已用完，邀请工友获得联系次数');
                        } else {
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
                                        text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:'+this.mobile+'" class="link external">' + "拨号" + '</a>',
                                        onClick: ()=>{
                                            wxApi.subOneTimes(this.userId).then((result) => {
                                                this.number = result.data.times;
                                                console.log('次数', result.data);
                                            })
                                        }
                                    },
                                ]
                            })
                        }
                    }else{
                        this.$router.load({url: '/user/sharePage?inviterId='+this.inviterId});
                    }
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
        },
        beforeMount(){
            var query = $$.parseUrlQuery(window.location.href);
            var query2 = window.location.search;
            var query3 = window.location.href;
            console.log(query);
            console.log(query2);
            console.log(query3);
            this.code = query2.substring(query2.indexOf('=')+1, query2.indexOf('&'));
            this.inviterId = query.params.split('_')[1];
            this.id = query.params.split('_')[0];
            this.url = query3.split('#')[0]
            console.log(this.code);
            console.log('链接得到的信息',this.inviterId,this.id);
            console.log(this.url);
            wxApi.getByUserId(this.id).then((result)=>{
                console.log('userInfo',result.data);
                if(result.data.lookingJobEntity.salaryType == 1){
                    result.data.lookingJobEntity.salaryLabel= "元/天"
                }else if(result.data.lookingJobEntity.salaryType == 2){
                    result.data.lookingJobEntity.salaryLabel= "元/小时"
                }else if(result.data.lookingJobEntity.salaryType == 4){
                    result.data.lookingJobEntity.salaryLabel= "元/月"
                }else if(result.data.lookingJobEntity.salaryType == 5){
                    result.data.lookingJobEntity.salaryLabel= "元/平方"
                }else{
                    result.data.lookingJobEntity.salaryLabel= "面议"
                }
                result.data.lookingJobEntity.littleBigs     = result.data.lookingJobEntity.littleBigs.split(',')
                result.data.lookingJobEntity.treatmentNames = result.data.lookingJobEntity.treatmentNames.split(',')
                result.data.lookingJobEntity.workTypeNames  = result.data.lookingJobEntity.workTypeNames.split(',')
                result.data.lookingJobEntity.expectTime     = moment(result.data.lookingJobEntity.expectTime).format('YYYY-MM-DD');
                this.recruitDetail = result.data;
                this.mobile = result.data.mobile
            })
            wxApi.judgeBindWx(this.code).then((result)=>{
                console.log('个人账户', result.data);
                this.userId = result.data.id;
                this.isShow = result.code;
                console.log('判断用户身份',result.data.workGroupId);
                if(result.data.workGroupId || result.data.workGroupId==''){
                    this.$store.state.workGroupId = result.data.workGroupId;
                }else{
                    this.$store.state.workGroupId = 0;
                }
                LocalCache.set('userInfo', result.data);
                LocalCache.set('sessionkey', result.data.wxSessionkey);
                console.log('loginResult:' + JSON.stringify(result));

                wxApi.lookUserContact(this.userId).then((result)=>{
                    this.number = result.data.times;
                    console.log('次数',this.number);
                })
            }, (error)=>{
                this.isShow = error.code;
                if(error.code==12){
                    // console.log('错误代码12');
                }else{
                    // console.log('登陆失败'+JSON.stringify(error));
                    // this.$f7.alert('登陆失败'+JSON.stringify(error));
                }
            })
        },
        mounted(){

        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .page-on-left{
        transform: translate3d(0,0,0);  -webkit-transform: translate3d(0,0,0);
    }
    .main2{
        margin-bottom: 2rem;
    }
    .shareItem{
        background: #fff; margin-bottom: 0.5rem;
        position: relative;
    }
    .shareItem .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; background: #F2F7FB; border-bottom: 1px solid #D8E7FE;
        display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.85rem 0 1rem;
    }
    .shareItem .a2-1{
        flex: 1; font-size: 0.75rem; color: #555; font-weight: 700;
    }
    .shareItem .a2-1 > div{
        display: inline-block;
    }
    .shareItem .a2-1 .he{
        height: 14px; line-height: 14px; font-size: 0.4rem; color: #fff; padding: 0 4px; background: #D0C3C0; letter-spacing: 1px; position: relative; top: -3px;
    }
    .shareItem .a2-1 .grouper{
        display: inline-block; width: 30px; height: 14px; line-height: 14px; text-align: center; font-size: 0.4rem; color: #DE9D57; border: 1px solid #DE9D57; transform: translateY(-2px);
    }
    .shareItem .a2-1 img{
        width: 38px; height: 14px; display: inline; transform: translateY(2px);
    }
    .shareItem .a2-2{
        width: 40px; text-align: right;
    }
    .shareItem .a2-2 img{
        width: 1.25rem; height: 1.25rem; display: inline-block; text-align: center; margin-top: 4px;
    }
    .shareItem .cent{
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .shareItem .cent .a3 .a3-1{
        width: 100%; height: 26px; line-height: 26px; display: flex; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .shareItem .cent .a3 .a3-1 .left{
        font-size: 0.6rem; color: #999;
    }
    .shareItem .cent .a3 .a3-1 .right .u2{
        color: #438CFF;
    }
    .shareItem .cent .a3 .a3-1 .right .u3,.u4{
        background: #EAEAEA; background: #EAEAEA; font-size: 0.5rem; color: #666; padding: 2px; margin-right: 6px;
    }
    .shareItem .cent .a3 .a3-2{
        width: 100%; height: 26px; line-height: 26px; display: flex; justify-content: space-between;
    }
    .shareItem .cent .a3 .a3-2 .left{
        font-size: 0.6rem;
    }
    .shareItem .cent .a3 .a3-2 .left .f2{
        color: #999;
    }
    .shareItem .cent .a3 .a3-2 .left .f3{
        font-size: 0.8rem; color: #E85050;
    }
    .shareItem .cent .a3 .a3-2 .right span{
        box-sizing: border-box; padding: 2px 4px; font-size: 0.55rem; color: #FEFEFE; border-radius: 1px; background: #E89578;
    }
    .shareItem .cent .a3 .a3-2 .left2{
        font-size: 0.6rem;
    }
    .shareItem .cent .a3 .a3-2 .left2 .t2{
        color: #999;
    }
    .shareItem .cent .a3 .a3-2 .left2 .t3{
        display: inline-block; margin-right: 5px; height: 0.85rem; line-height: 0.85rem; box-sizing: border-box; padding: 0 5px; font-size: 0.55rem; color: #666; background: #EEEEEE;
    }
    .shareItem .cent .a3 .a3-2 .right2{
        font-size: 0.6rem;
    }
    .shareItem .cent .a3 .a3-2 .right2 .r2{
        color: #999;
    }
    .shareItem .cent .a3 .a3-2 .right2 .r3{
        color: #666;
    }
    .shareItem .cent .a5{
        display: flex; background: #f8f8f8; box-sizing: border-box; padding: 6px 0;
    }
    .shareItem .cent .a5 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .shareItem .cent .a5 .right{
        font-size: 0.55rem; color: #333;
    }
    .shareItem .bom{
        width: 100%;
        height: 1.1rem;
        line-height: 1.1rem;
        font-size: 0.6rem;
        color: #666;
        overflow: hidden;
        padding-bottom: .3rem;
    }
    .shareItem .bom img{
        width: .45rem;
        height: .55rem;display: inline-block;
        vertical-align: middle;
    }
    .shareItem .bom .address{
        width: 80%;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        float: left;
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
    /*底部分享*/
    .tipEnd{
        font-size: .55rem;
        margin-top: .55rem;
        line-height: .8rem;
        color: #999999;
    }
    .subtitle{
        margin-top: .3rem;
        width: 7.9rem;
        height: 2.2rem;
        margin-bottom: .55rem;
        color: #444444;
        margin: 0 auto;
    }
    .subtitle img{
        width: 7.9rem;
        height: 2.2rem;
    }
    .qrCodeBox{
        text-align: center;
    }
    .qrCodeBox .qrCode{
        width: 4.6rem;
        height: 4.6rem;
        margin-top: 4.6rem;
        margin-bottom: .6rem;
    }
</style>