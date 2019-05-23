<template>
    <div data-page="shareProjRecruit" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left"></div>
                <div class="center">项目招工</div>
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
            <div class="main">
                <ul class="aul2">
                    <li v-for="(item, index) in projDetail.list">
                        <div class="sit">
                            <div class="ent">
                                <img class="st" src="../../static/img/wendan.png"/>
                                <div class="st2">
                                    <div class="skew">
                                        <div class="skew-main">{{item.title?item.title:item.city.name+'招'+item.workTypeName}}</div>
                                    </div>
                                </div>
                                <img class="st3" src="../../static/img/shibianxin_icom.png"/>
                            </div>
                            <div class="int" @click="contactProj()">
                                <img src="../../static/img/phone_icom.png"/>
                            </div>
                        </div>
                        <div class="tov">
                            <div class="shan">
                                <img class="one" src="../../static/img/projrenzhen.png"/>
                                <img class="two" src="../../static/img/projzhizhao.png"/>
                                <span class="three" v-if="item.cost">工程造价{{item.cost}}万</span>
                            </div>
                            <div class="xia">
                                <span>{{projDetail.projectEntity.name}}</span>
                                <img src="../../static/img/btn_drop_down.png"/>
                            </div>
                        </div>
                        <div class="single">
                            <div class="up">
                                <div class="left">
                                    <img src="../../static/img/zhaogong.png"/>
                                    <span>{{item.workTypeName}}</span>
                                </div>
                                <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{item.demandAmount}}</span>人</div>
                                <div class="left3">

                                    <span v-if="item.salaryType==1">{{item.salary}}元/天</span>
                                    <span v-else-if="item.salaryType==2">{{item.salary}}元/小时</span>
                                    <span v-else-if="item.salaryType==4">{{item.salary}}元/月</span>
                                    <span v-else-if="item.salaryType==5">{{item.salary}}元/平方</span>
                                    <span v-else>面议</span>
                                </div>
                            </div>
                            <div class="cent">
                                <div class="left">
                                    <span v-show="item.treatmentsName!=''" v-for="one in item.treatmentsName.split(',')">{{one}}</span>
                                    <span v-show="item.tlementName!=''">{{item.tlementName}}</span>
                                </div>
                                <div class="right">时间 <span>|</span> {{item.demandTime}}</div>
                            </div>
                            <div class="cent2">
                                <div class="left">材料 <span>|</span> {{item.materialReqName!=''?item.materialReqName:'--'}}</div>
                                <div class="right">设备 <span>|</span> {{item.deviceReqName!=''?item.deviceReqName:'--'}}</div>
                            </div>
                            <div class="cent3" v-show="item.remark!=''">
                                <img src="../../static/img/tonggao.png"/>
                                <div class="right">{{item.remark}}</div>
                            </div>
                            <div class="down">
                                <div class="left">
                                    发布日期 : {{item.createTime}}
                                </div>
                                <div class="right">
                                    <img src="../../static/img/dingwei_icom.png"/>
                                    <span>{{projDetail.projectEntity.location}}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
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

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import {userApi, tabulateStatisticsApi, wxApi, projectApi} from "../api";
    import phone_icon from '../../static/img/phone_icon.png';
    import moment from 'moment'
    export default {
        data(){
            return{
                isShow: '',
                userId: '',
                projDetail: {},
                code: '',
                inviterId: '',
                url: '',
                batchNumber: '',
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
            contactProj(){
                if(this.code=""){
                    this.$router.load({url: '/user/sharePage?inviterId='+this.inviterId});
                }else{
                    if(this.isShow==0){  //用户有微信公众号账户
                        if (this.number == 0) {
                            this.$f7.alert('您的联系次数已用完，邀请工友获得联系次数');
                        } else {
                            let hideMobile = this.projDetail.workGroupTel.substr(0,3)+'****'+this.projDetail.workGroupTel.substr(7);
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
                                        text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:'+this.projDetail.workGroupTel+'" class="link external">' + "拨号" + '</a>',
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
            this.batchNumber = query.params.split('_')[1];
            this.url = query3.split('#')[0];
            console.log(this.code);
            console.log('链接得到的信息',this.inviterId,this.batchNumber);
            console.log(this.url);

            wxApi.getSharebatchNumber(this.batchNumber).then((result)=>{
                console.log(result.data);
                this.projDetail = result.data;
                for(var i=0; i<this.projDetail.list.length; i++){
                    this.projDetail.list[i].createTime = moment(this.projDetail.list[i].createTime).format('YYYY-MM-DD');
                }
                console.log(this.projDetail);
            })

            wxApi.judgeBindWx(this.code).then(
                (result)=>{
                    console.log('个人账户', result.data);
                    this.userId = result.data.id;
                    this.isShow = result.code;
                    console.log('判断用户身份',result.data.workGroupId);
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
    .main .aul2 li{
        background: #fff; margin-bottom: 0.5rem;
    }
    .main .aul2 li .sit{
        width: 100%; height: 35px; background: #fff; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .sit .ent{
        flex: 1; text-align: center;
    }
    .main .aul2 li .sit .int{
        width: 34px; text-align: right;
    }
    .main .aul2 li .sit .int img{
        width: 1.25rem; height: 1.25rem; margin-top: 7px;
    }
    .main .aul2 li .sit .ent .st{
        width: 1rem; height: 1rem; display: inline-block; margin-top: 6px; transform: translateX(5px);
    }
    .main .aul2 li .sit .ent .st2{
        color: #fff; display: inline-block; transform: translateY(-8px); position: relative; z-index: 2;
    }
    .main .aul2 li .sit .ent .st2 .skew{
        height: 22px; background: #9FC6FC; color: #123f65; font-weight: 700; letter-spacing: 1px; font-size: 0.65rem; transform: skew(-15deg);
    }
    .main .aul2 li .sit .ent .st2 .skew .skew-main{
        transform: skew(15deg); padding: 0 7px; transform: translateY(4px);
    }
    .main .aul2 li .sit .ent .st3{
        width: 1.7rem; height: 1.4rem; display: inline-block; transform: translateX(-26px); position: relative; top: 2px;
    }
    .main .aul2 li .tov{
        width: 100%; height: 1.9rem; background: #F6FAFD; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .tov .shan{
        display: flex;
    }
    .main .aul2 li .tov .shan .one{
        width: 2.85rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
    }
    .main .aul2 li .tov .shan .two{
        width: 2.55rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
    }
    .main .aul2 li .tov .shan .three{
        height: 0.65rem; display: inline-block; box-sizing: border-box; padding: 0 0.2rem; border: 1px solid #8E9223; border-radius: 1px; font-size: 0.4rem; color: #8E9223;
    }
    .main .aul2 li .tov .xia{
        width: 100%; font-size: 0.65rem; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 5px;
    }
    .main .aul2 li .tov .xia img{
        width: 0.6rem; height: 0.6rem; display: inline-block; transform: translateY(2px);
    }
    .main .aul2 li .single{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
    }
    .main .aul2 li .single .up{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul2 li .single .up .left{
        display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
    }
    .main .aul2 li .single .up .left img{
        width: 0.75rem; height: 0.75rem; display: inline-block; transform: translateY(2px);
    }
    .main .aul2 li .single .up .left2{
        font-size: 0.6rem; color: #666666;
    }
    .main .aul2 li .single .up .left2 .f-2{
        color: #ccc;
    }
    .main .aul2 li .single .up .left2 .f-3{
        color: #F13333; font-size: 0.75rem;
    }
    .main .aul2 li .single .up .left3 span{
        box-sizing: border-box; padding: 3px 4px; background: #F05A5A; border-radius: 1px; font-size: 0.6rem; color: #fff;
    }
    .main .aul2 li .single .cent{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul2 li .single .cent .left span{
        display: inline-block; height: 0.8rem; line-height: 0.8rem; box-sizing: border-box; padding: 0 6px; background: #EEEEEE;
        font-size: 0.55rem; color: #666; margin-right: 5px;
    }
    .main .aul2 li .single .cent .right{
        font-size: 0.6rem; color: #666;
    }
    .main .aul2 li .single .cent .right span{
        color: #ccc;
    }
    .main .aul2 li .single .cent2{
        width: 100%; height: 30px; line-height: 30px;
        overflow: hidden; justify-content: space-between; font-size: 0.6rem; color: #666;
    }
    .main .aul2 li .single .cent2 .left, .main .aul2 li .single .cent2  .right{
        width: 50%; text-align: left;
        float: left;
    }
    .main .aul2 li .single .cent2 .left span, .right span{
        color: #ccc;
    }

    .main .aul2 li .single .cent3{
        display: flex; background: #f4f8fd; box-sizing: border-box; padding: 6px 0;
    }
    .main .aul2 li .single .cent3 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main .aul2 li .single .cent3 .right{
        font-size: 0.55rem; color: #333;
    }

    .main .aul2 li .single .down{
        width: 100%; height: 1.2rem; line-height: 1.2rem; display: flex; justify-content: space-between;
    }
    .main .aul2 li .single .down .left{
        display: flex; font-size: 0.6rem; color: #999;
    }
    .main .aul2 li .single .down .right span{
        font-size: 0.55rem; color: #888;
    }
    .main .aul2 li .single .down .right img{
        width: 0.5rem; height: 0.6rem; display: inline-block; transform: translateY(3px);
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