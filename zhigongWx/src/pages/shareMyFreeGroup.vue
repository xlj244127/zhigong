<template>
    <div data-page="shareMyFreeGroup" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                </div>
                <div class="center sliding">班组信息</div>
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
            <div class="a2">
                <div class="a2-1">
                    <span class="wg">{{this.workerSearchJobList.workGroupName}}</span>
                    <img v-show="this.idNumber!=''" src="../../static/img/shareYishiming.png"/>
                    <img v-show="workerSearchJobList.userCount>1" src="../../static/img/shareYirengzhen.png"/>
                    <span v-show="workerSearchJobList.userCount>1"  class="wg2">班组{{workerSearchJobList.userCount}}人</span>
                </div>
                <div class="a2-2" @click="connactAction">
                    <img src="../../static/img/phone_icom.png"/>
                </div>
            </div>
            <div class="single">
                <div class="cent">
                    <div class="a3-2" v-for="item in this.workerSearchJobList.list">
                        <div class="left">{{item.workTypeName}}</div>
                        <div class="left2"><span class="t">{{item.freeAmount}}</span><span class="t2">人</span></div>
                        <div class="left3">{{item.freeTime}}起</div>
                    </div>
                </div>
                <div class="cent3" v-show="this.workerSearchJobList.remark!=''">
                    <img src="../../static/img/tonggao.png"/>
                    <div class="right">{{this.workerSearchJobList.remark}}</div>
                </div>
                <div class="down">
                    <img src="../../static/img/grayxiaodinwei2.png"/>
                    <span v-if="this.workerSearchJobList.province">{{this.workerSearchJobList.province.name}}</span><span v-if="this.workerSearchJobList.city">{{this.workerSearchJobList.city.name}}</span>
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
    </div>
</template>

<script>
    var $$ = Dom7;
    import { tabulateStatisticsApi, wxApi} from '../api';
    import { LocalCache } from '../lib/utils';
    import { shareServer, shareAppid, serverceshi} from '../config';
    import phone_icon from '../../static/img/phone_icon.png';
    export default {
        data(){
            return{
                userId: '',
                number: '',
                mobile: '',
                workGroupId: '',
                provinceId: '',
                cityId: '',
                workerSearchJobList: {},
                workerTitle: [],
                code: '',
                inviterId: '',
                url: '',
                isShow: '',
                idNumber: '',
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
            this.workGroupId = query.params.split('_')[1];
            this.provinceId = query.params.split('_')[2];
            this.cityId = query.params.split('_')[3];
            this.url = query3.split('#')[0]
            console.log(this.code);
            console.log('链接得到的信息',this.workGroupId,this.provinceId,this.cityId);
            console.log(this.url);

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
                        console.log('错误代码12');
                    }else{
                        console.log('登陆失败'+JSON.stringify(error));
                    }
                }
            )

            wxApi.listByShare(this.workGroupId, this.provinceId, this.cityId).then((result)=>{
                console.log(result.data);
                this.workerSearchJobList = result.data[0];
                this.mobile = this.workerSearchJobList.workGroupTel;
                if(workerSearchJobList.userDetailEntity.idNumber){
                    this.idNumber = workerSearchJobList.userDetailEntity.idNumber;
                }else{
                    this.idNumber = '';
                }
                console.log('列表',this.workerSearchJobList);
            })
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
        width: 100%; box-sizing: border-box; padding: 0 0.6rem 0.5rem 0.6rem; background: #fff;
    }
    .single .cent{
        background: #fff;
    }
    .single .cent .a3-2{
        width: 100%; height: 1.5rem; line-height: 1.5rem; display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 2.6rem 0 1.1rem;
    }
    .single .cent .a3-2 .left{
        min-width: 4.4rem; display: inline-block; font-size: 0.65rem; color: #438CFF;
    }
    .single .cent .a3-2 .left2{
        padding-right: 2rem; font-size: 0.6rem;
    }
    .single .cent .a3-2 .left2 .t{
        color: #EF7373;
    }
    .single .cent .a3-2 .left2 .t2{
        color: #777777;
    }
    .single .cent .a3-2 .left3{
        font-size: 0.55rem; color: #777;
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