<template>
    <div data-page="oneRecruit" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">我发布的用工需求</div>
            </div>
        </div>
        <div class="page-content">
            <div class="sit">
                <div class="ent">
                    <img class="st" src="../../static/img/wendan.png"/>
                    <div class="st2">
                        <div class="skew">
                            <div class="skew-main">{{this.recruitDetail.title?this.recruitDetail.title:this.recruitDetail.city.name+'招'+this.recruitDetail.workTypeName}}</div>
                        </div>
                    </div>
                    <img class="st3" src="../../static/img/shibianxin_icom.png"/>
                </div>
            </div>
            <div class="a2">
                <div class="a2-1">
                    <span class="wg">{{this.recruitDetail.workGroup.name}}</span>
                    <img src="../../static/img/shareYishiming.png"/>
                    <img v-if="this.recruitDetail.workGroup.memberCount>1" src="../../static/img/shareYirengzhen.png"/>
                    <span v-if="this.recruitDetail.workGroup.memberCount>1" class="wg2">班组{{this.recruitDetail.workGroup.memberCount}}人</span>
                </div>
                <div class="a2-2">
                    <img src="../../static/img/phone_icom.png"/>
                </div>
            </div>
            <div class="single">
                <div class="up">
                    <div class="left">
                        <img src="../../static/img/recruit_time_worker.png" v-if="this.recruitDetail.demandType==1"/>
                        <img src="../../static/img/recruit_contractor.png" v-else-if="this.recruitDetail.demandType==2"/>
                        <img src="../../static/img/recruit_group.png" v-else-if="this.recruitDetail.demandType==3"/>
                        <img src="../../static/img/recruit_worker.png" v-else-if="this.recruitDetail.demandType==4"/>
                        <img src="../../static/img/zhaogong.png" v-else/>
                        <span>{{this.recruitDetail.workTypeName}}</span>
                    </div>
                    <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{this.recruitDetail.demandAmount}}</span>人</div>
                    <div class="left3"><span>{{this.recruitDetail.salary}}{{this.recruitDetail.salaryLabel}}</span></div>
                </div>
                <div class="cent">
                    <div class="left"><span v-for="one in this.recruitDetail.treatmentsName.split(',')">{{one}}</span><span>{{this.recruitDetail.tlementName}}</span></div>
                    <div class="right">时间 <span>|</span> {{this.recruitDetail.demandTime}}</div>
                </div>
                <div class="cent3" v-show="this.recruitDetail.remark!=''">
                    <img src="../../static/img/tonggao.png"/>
                    <div class="right">{{this.recruitDetail.remark}}</div>
                </div>
                <div class="down">
                    <img src="../../static/img/grayxiaodinwei2.png"/>
                    <span v-if="this.recruitDetail.province">{{this.recruitDetail.province.name}}</span><span v-if="this.recruitDetail.city">{{this.recruitDetail.city.name}}</span><span v-if="this.recruitDetail.district">{{this.recruitDetail.district.name}}</span><span>{{this.recruitDetail.address}}</span>
                </div>
            </div>
        </div>
        <div class="allpage" v-show="titleHandle==1">
            <img src="../../static/img/inviterTiltle.png"/>
            <div class="know" @click="iKnowAction">知道了</div>
        </div>
    </div>
</template>

<script>
    import { tabulateStatisticsApi, wxApi} from '../api';
    import { LocalCache } from '../lib/utils';
    import { shareServer, shareAppid, serverceshi} from '../config';
    export default {
        data(){
            return{
                titleHandle: 1,
                url: '',
                userId: '',
                recruitDetail: {},
                treatmentsName: [],
                demandTime: '',
                groupOneRecruit: {},
            }
        },
        methods:{
            iKnowAction(){
                this.$router.back();
            }
        },
        created(){
            this.recruitDetail = this.$store.state.recruit;
            console.log(this.$store.state.recruit);
            this.treatmentsName = this.recruitDetail.treatmentsName.split(',');
            this.demandTime = this.recruitDetail.demandTime;
            console.log('薪资待遇',this.treatmentsName,this.demandTime);
        },
        mounted(){
            var query3 = window.location.href;
            this.url = query3.split('#')[0]
            this.userId = LocalCache.get('userInfo').id;
            console.log(query3,this.url,this.userId);
            this.groupOneRecruit = this.$store.state.groupOneRecruit;
            console.log('班组招工分享title',this.groupOneRecruit);

            wxApi.getShare(this.groupOneRecruit.id).then((result)=>{
                console.log('班组单个招工',result.data);
            })

            wxApi.getConfig(false, this.url).then((result)=> {
                this.config = JSON.parse(result.data);
                console.log('签名', this.config);

                wx.config(
                    this.config
                );

                let link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareMyRecruit%3fparams%3d"+this.userId+"_"+this.groupOneRecruit.id+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                let link2 = shareServer + "/#/user/shareMyRecruit?params="+this.userId+"_"+this.groupOneRecruit.id;
                let link3 = shareServer + "/weixin/shareMyRecruit?params="+this.userId+"_"+this.groupOneRecruit.id;
                console.log(link3);
                shareServer+"/weixin/shareMyRecruit?params="
                wx.onMenuShareQQ({
                    title: this.groupOneRecruit.title, // 分享标题
                    desc: this.groupOneRecruit.groupName+'招'+this.groupOneRecruit.workTypeName+this.groupOneRecruit.demandAmount+'人,'+this.groupOneRecruit.salary+','+this.groupOneRecruit.treatmentsName, // 分享描述
                    link: shareServer + "/weixin/shareMyRecruit?params="+this.userId+"_"+this.groupOneRecruit.id,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://images.zhigongxx.com/logo.png', // 分享图标 http://images.zhigongxx.com/logo.png
                    success: function (res) {
                        //这里是回调函数
                        console.log(res);
                    },
                    cancel: function (res) {
                        // 用户取消分享后执行的回调函数
                        console.log(res);
                    }
                });

                wx.onMenuShareQZone({
                    title: this.groupOneRecruit.title, // 分享标题
                    desc: this.groupOneRecruit.groupName+'招'+this.groupOneRecruit.workTypeName+this.groupOneRecruit.demandAmount+'人,'+this.groupOneRecruit.salary+','+this.groupOneRecruit.treatmentsName, // 分享描述
                    link: shareServer + "/weixin/shareMyRecruit?params="+this.userId+"_"+this.groupOneRecruit.id,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://images.zhigongxx.com/logo.png', // 分享图标 http://images.zhigongxx.com/logo.png
                    success: function (res) {
                        //这里是回调函数
                        console.log(res);
                    },
                    cancel: function (res) {
                        // 用户取消分享后执行的回调函数
                        console.log(res);
                    }
                });

                wx.onMenuShareAppMessage({
                    title: this.groupOneRecruit.title, // 分享标题
                    desc: this.groupOneRecruit.groupName+'招'+this.groupOneRecruit.workTypeName+this.groupOneRecruit.demandAmount+'人,'+this.groupOneRecruit.salary+','+this.groupOneRecruit.treatmentsName, // 分享描述
                    link: shareServer + "/weixin/shareMyRecruit?params="+this.userId+"_"+this.groupOneRecruit.id,      // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://images.zhigongxx.com/logo.png', // 分享图标 http://images.zhigongxx.com/logo.png
                    success: function (res) {
                        //这里是回调函数
                        console.log(res);
                    },
                    cancel: function (res) {
                        // 用户取消分享后执行的回调函数
                        console.log(res);
                    }
                });

                wx.onMenuShareTimeline({
                    title: this.groupOneRecruit.title, // 分享标题
                    desc: this.groupOneRecruit.groupName+'招'+this.groupOneRecruit.workTypeName+this.groupOneRecruit.demandAmount+'人,'+this.groupOneRecruit.salary+','+this.groupOneRecruit.treatmentsName, // 分享描述
                    link: shareServer + "/weixin/shareMyRecruit?params="+this.userId+"_"+this.groupOneRecruit.id,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: 'http://images.zhigongxx.com/logo.png',     // 分享图标 http://images.zhigongxx.com/logo.png
                    success: function (res) {
                        //这里是回调函数
                        console.log(res);
                    },
                    cancel: function (res) {
                        // 用户取消分享后执行的回调函数
                        console.log(res);
                    }
                });

            })
        }
    }
</script>

<style scoped>
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
        height: 22px; background: #9FC6FC; color: #123f65; font-weight: 700; letter-spacing: 1px; font-size: 0.65rem; transform: skew(-15deg);
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
</style>