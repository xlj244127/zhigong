<template>
    <div data-page="shareMyRecruit" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                </div>
                <div class="center sliding">班组招工</div>
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
            <div class="sit">
                <div class="ent">
                    <img class="st" src="../../static/img/wendan.png"/>
                    <div class="st2">
                        <div class="skew">
                            <div class="skew-main">{{this.title}}</div>
                        </div>
                    </div>
                    <img class="st3" src="../../static/img/shibianxin_icom.png"/>
                </div>
            </div>
            <div class="a2">
                <div class="a2-1">
                    <span class="wg">{{this.groupName}}</span>
                    <img v-show="idNumber!=null" src="../../static/img/shareYishiming.png"/>
                    <img v-if="userCount>1" src="../../static/img/shareYirengzhen.png"/>
                    <span v-if="userCount>1"  class="wg2">班组{{userCount}}人</span>
                </div>
                <div class="a2-2" @click="connactAction">
                    <img src="../../static/img/phone_icom.png"/>
                </div>
            </div>
            <div class="single">
                <div class="up">
                    <div class="left">
                        <img src="../../static/img/recruit_time_worker.png" v-if="demandType==1"/>
                        <img src="../../static/img/recruit_contractor.png" v-else-if="demandType==2"/>
                        <img src="../../static/img/recruit_group.png" v-else-if="demandType==3"/>
                        <img src="../../static/img/recruit_worker.png" v-else-if="demandType==4"/>
                        <img src="../../static/img/zhaogong.png" v-else/>
                        <span>{{this.workTypeName}}</span>
                    </div>
                    <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{this.demandAmount}}</span>人</div>
                    <div class="left3"><span>{{this.salary}}{{this.salaryLabel}}</span></div>
                </div>
                <div class="cent">
                    <div class="left"><span  v-show="this.treatmentsName!=''" v-for="one in this.treatmentsName">{{one}}</span><span v-show="this.tlementName!=''">{{this.tlementName}}</span></div>
                    <div class="right">时间 <span>|</span> {{this.demandTime}}</div>
                </div>
                <div class="cent3">
                    <img src="../../static/img/tonggao.png"/>
                    <div class="right"   v-show="this.remark!=''">{{this.remark}}</div>
                </div>
                <div class="down">
                    <img src="../../static/img/grayxiaodinwei2.png"/>
                    <span>{{this.address}}</span>
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
        mounted(){
            var query = $$.parseUrlQuery(window.location.href);
            var query2 = window.location.search;
            var query3 = window.location.href;
            console.log(query);
            console.log(query2);
            console.log(query3);

            this.code = query2.substring(query2.indexOf('=')+1, query2.indexOf('&'));
            this.inviterId = query.params.split('_')[0];
            this.id = query.params.split('_')[1];
            this.url = query3.split('#')[0]
            console.log(this.code);
            console.log('链接得到的信息',this.inviterId,this.id);
            console.log(this.url);

            wxApi.getShare(this.id).then((result)=>{
                console.log('班组单个招工',result.data);
                this.mobile = result.data.workGroupTel;
                this.title = result.data.workDemandEntity.title?result.data.workDemandEntity.title:result.data.workDemandEntity.city+'招'+result.data.workDemandEntity.workTypeName;
                this.groupName = result.data.workGroupEntity.name;
                this.workTypeName = result.data.workDemandEntity.workTypeName;
                this.demandAmount = result.data.workDemandEntity.demandAmount;
                this.demandTime = result.data.workDemandEntity.demandTime;
                this.remark = result.data.workDemandEntity.remark;
                this.salary = result.data.workDemandEntity.salary;
                this.salaryType = result.data.workDemandEntity.salaryType;
                this.demandType = result.data.workDemandEntity.demandType;
                if(this.salaryType == 1){
                    this.salaryLabel= "元/天"
                }else if(this.salaryType == 2){
                    this.salaryLabel= "元/小时"
                }else if(this.salaryType == 4){
                    this.salaryLabel= "元/月"
                }else if(this.salaryType == 5){
                    this.salaryLabel= "元/平方"
                }else{
                    this.salaryLabel= "面议"
                }
                this.treatmentsName = result.data.workDemandEntity.treatmentsName.split(',');
                this.address = result.data.workDemandEntity.province.name+result.data.workDemandEntity.city.name+result.data.workDemandEntity.district.name+result.data.workDemandEntity.address;
                this.tlementName = result.data.workDemandEntity.tlementName;
                this.userCount = result.data.userCount
                this.idNumber = result.data.userDetail.idNumber
            })

            wxApi.judgeBindWx(this.code).then(
                (result)=>{
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
                },
                (error)=>{
                    this.isShow = error.code;
                    if(error.code==12){
                        // console.log('错误代码12');
                    }else{
                        // console.log('登陆失败'+JSON.stringify(error));
                        // this.$f7.alert('登陆失败'+JSON.stringify(error));
                    }
                }
            )
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
    .sit{
        width: 100%; height: 35px; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .sit .ent{
        width: 100%; text-align: center;
    }
    .sit .ent .st{
        width: 1rem; height: 1rem; display: inline-block; margin-top: 6px; transform: translateX(5px);
    }
    .sit .ent .st2{
        color: #fff; display: inline-block; transform: translateY(-8px); position: relative; z-index: 2;
    }
    .sit .ent .st2 .skew{
        height: 22px; background: #9FC6FC; color: #FFF; font-size: 0.65rem; transform: skew(-15deg);
    }
    .sit .ent .st2 .skew .skew-main{
        transform: skew(15deg); padding: 0 7px; transform: translateY(4px);
    }
    .sit .ent .st3{
        width: 1.7rem; height: 1.4rem; display: inline-block; transform: translateX(-26px); position: relative; top: 2px;
    }
    .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; border-bottom: 1px solid #DDDEE2; display: flex; justify-content: space-between;
        background: #F2F7FB; box-sizing: border-box; padding: 0 0.6rem;
    }
    .a2 .a2-1 .wg{
        font-size: 0.75rem; color: #555; padding-right: 0.5rem;
    }
    .a2 .a2-1 img{
        width: 1.9rem; height: 0.7rem; transform: translateY(3px);
    }
    .a2 .a2-1 .wg2{
        display: inline-block; height: 0.6rem; line-height: 0.6rem; border: 1px solid #FC7C2E; font-size: 0.4rem; color: #F55C11; border-radius: 1px; padding: 0 4px; transform: translateY(-2px);
    }
    .a2-2{
        height: 1.75rem;
    }
    .a2-2 img{
        width: 1.25rem; height: 1.25rem; display: inline-block; margin-top: 0.3rem;
    }
    .single{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem 0 0.6rem; background: #fff;
    }
    .single .up{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .single .up .left{
        display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
    }
    .single .up .left img{
        height: 0.75rem; display: inline-block; transform: translateY(2px);
    }
    .single .up .left2{
        font-size: 0.6rem; color: #666666;
    }
    .single .up .left2 .f-2{
        color: #ccc;
    }
    .single .up .left2 .f-3{
        color: #F13333; font-size: 0.75rem;
    }
    .single .up .left3 span{
        box-sizing: border-box; padding: 3px 4px; background: #F05A5A; border-radius: 1px; font-size: 0.6rem; color: #fff;
    }
    .single .cent{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .single .cent .left span{
        display: inline-block; height: 0.8rem; line-height: 0.8rem; box-sizing: border-box; padding: 0 6px; background: #EEEEEE;
        font-size: 0.55rem; color: #666; margin-right: 5px;
    }
    .single .cent .right{
        font-size: 0.6rem; color: #666;
    }
    .single .cent .right span{
        color: #ccc;
    }
    .single .cent3{
        display: flex; background: #f4f8fd; box-sizing: border-box; padding: 6px 0;
    }
    .single .cent3 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .single .cent3 .right{
        font-size: 0.55rem; color: #333;
    }
    .single .down{
        width: 100%; min-height: 1.25rem; background: #fff; font-size: 0.6rem; color: #999; box-sizing: border-box; padding: 7px 0;
    }
    .single .down  img{
        width: 0.5rem; height: 0.6rem; display: inline-block; transform: translateY(1px);
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