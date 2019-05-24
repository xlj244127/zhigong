<template>
    <div data-page="oneRecruit" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">分享</div>
            </div>
        </div>
        <div class="page-content">
            <div class="shareBox">
                <div class="sit">
                    <div class="ent">
                        <img class="st" src="../../static/img/wendan.png"/>
                        <div class="st2">
                            <div class="skew">
                                <div class="skew-main">{{groupOneRecruit.title?groupOneRecruit.title:recruitDetail.city.name+'招'+groupOneRecruit.workTypeName}}</div>
                            </div>
                        </div>
                        <img class="st3" src="../../static/img/shibianxin_icom.png"/>
                    </div>
                </div>
                <div class="tov">
                    <div class="shan">
                        <img class="one" src="../../static/img/projrenzhen.png"/>
                        <img class="two" src="../../static/img/projzhizhao.png"/>
                        <span class="three" v-if="groupOneRecruit.cost">工程造价{{groupOneRecruit.cost}}万</span>
                    </div>
                    <div class="xia">
                        <span>{{recruitDetail.project.name}}</span>
                        <img src="../../static/img/btn_drop_down.png"/>
                    </div>
                </div>
                <div class="single">
                    <div class="up">
                        <div class="left">
                            <img src="../../static/img/recruit_time_worker.png" v-if="groupOneRecruit.demandType==1"/>
                            <img src="../../static/img/recruit_contractor.png" v-else-if="groupOneRecruit.demandType==2"/>
                            <img src="../../static/img/recruit_group.png" v-else-if="groupOneRecruit.demandType==3"/>
                            <img src="../../static/img/recruit_worker.png" v-else-if="groupOneRecruit.demandType==4"/>
                            <img src="../../static/img/zhaogong.png" v-else/>
                            <span>{{groupOneRecruit.workTypeName}}</span>
                        </div>
                        <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{groupOneRecruit.demandAmount}}</span>人</div>
                        <div class="left3">
                            <span v-if="groupOneRecruit.salaryType==1">{{groupOneRecruit.salary}}元/天</span>
                            <span v-else-if="groupOneRecruit.salaryType==2">{{groupOneRecruit.salary}}元/小时</span>
                            <span v-else-if="groupOneRecruit.salaryType==4">{{groupOneRecruit.salary}}元/月</span>
                            <span v-else-if="groupOneRecruit.salaryType==5">{{groupOneRecruit.salary}}元/平方</span>
                            <span v-else>面议</span>
                        </div>
                    </div>
                    <div class="cent">
                        <div class="left">
                            <span v-show="groupOneRecruit.treatmentsName!=''" v-for="one in groupOneRecruit.treatmentsName.split(',')">{{one}}</span>
                            <span v-show="groupOneRecruit.tlementName">{{groupOneRecruit.tlementName}}</span>
                        </div>
                        <div class="right">时间 <span>|</span> {{groupOneRecruit.demandTime}}</div>
                    </div>
                    <div class="cent2">
                        <div class="left">材料 <span>|</span> {{groupOneRecruit.materialReqName!=''?groupOneRecruit.materialReqName:'--'}}</div>
                        <div class="right">设备 <span>|</span> {{groupOneRecruit.deviceReqName!=''?groupOneRecruit.deviceReqName:'--'}}</div>
                    </div>
                    <div class="cent3" v-show="groupOneRecruit.remark!=''">
                        <img src="../../static/img/tonggao.png"/>
                        <div class="right">{{groupOneRecruit.remark}}</div>
                    </div>
                    <div class="down">
                        <div class="left">
                            发布日期 : {{groupOneRecruit.createTime}}
                        </div>
                        <div class="right">
                            <img src="../../static/img/dingwei_icom.png"/>
                            <span>{{recruitDetail.project.location}}</span>
                        </div>
                    </div>
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
        },
        mounted(){
            var query3 = window.location.href;
            this.url = query3.split('#')[0]
            this.userId = LocalCache.get('userInfo').id;
            console.log(query3,this.url,this.userId);
            this.groupOneRecruit = this.$store.state.groupOneRecruit;
            this.demandTime = this.groupOneRecruit.demandTime;
            this.treatmentsName = this.groupOneRecruit.treatmentsName.split(',');
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
                let link2 = shareServer + "/#/user/shareProjRecruit?params="+this.userId+"_"+this.groupOneRecruit.id;
                let link3 = shareServer + "/weixin/shareProjRecruit?params="+this.userId+"_"+this.groupOneRecruit.id;
                console.log(link3);
                shareServer+"/weixin/shareMyRecruit?params="
                wx.onMenuShareQQ({
                    title: this.groupOneRecruit.title, // 分享标题
                    desc: this.recruitDetail.project.name+'项目招'+this.groupOneRecruit.workTypeName+this.groupOneRecruit.demandAmount+'人,'+this.groupOneRecruit.treatmentsName, // 分享描述
                    link: shareServer + "/#/user/shareProjRecruit?params="+this.userId+"_"+this.recruitDetail.batchNumber,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    desc: this.recruitDetail.project.name+'项目招'+this.groupOneRecruit.workTypeName+this.groupOneRecruit.demandAmount+'人,'+this.groupOneRecruit.treatmentsName, // 分享描述
                    link: shareServer + "/#/user/shareProjRecruit?params="+this.userId+"_"+this.recruitDetail.batchNumber,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    desc: this.recruitDetail.project.name+'项目招'+this.groupOneRecruit.workTypeName+this.groupOneRecruit.demandAmount+'人,'+this.groupOneRecruit.treatmentsName, // 分享描述
                    link: shareServer + "/#/user/shareProjRecruit?params="+this.userId+"_"+this.recruitDetail.batchNumber,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    desc: this.recruitDetail.project.name+'项目招'+this.groupOneRecruit.workTypeName+this.groupOneRecruit.demandAmount+'人,'+this.groupOneRecruit.treatmentsName, // 分享描述
                    link: shareServer + "/#/user/shareProjRecruit?params="+this.userId+"_"+this.recruitDetail.batchNumber,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
    .shareBox{
        background: #fff; margin-bottom: 0.5rem;
    }
    .shareBox .sit{
        width: 100%; height: 35px; background: #fff; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem;
    }
    .shareBox .sit .ent{
        flex: 1; text-align: center;
    }
    .shareBox .sit .int{
        width: 34px; text-align: right;
    }
    .shareBox .sit .int img{
        width: 1.25rem; height: 1.25rem; margin-top: 7px;
    }
    .shareBox .sit .ent .st{
        width: 1rem; height: 1rem; display: inline-block; margin-top: 6px; transform: translateX(5px);
    }
    .shareBox .sit .ent .st2{
        color: #fff; display: inline-block; transform: translateY(-8px); position: relative; z-index: 2;
    }
    .shareBox .sit .ent .st2 .skew{
        height: 22px; background: #9FC6FC; color: #123f65; font-weight: 700; letter-spacing: 1px; font-size: 0.65rem; transform: skew(-15deg);
    }
    .shareBox .sit .ent .st2 .skew .skew-main{
        transform: skew(15deg); padding: 0 7px; transform: translateY(4px);
    }
    .shareBox .sit .ent .st3{
        width: 1.7rem; height: 1.4rem; display: inline-block; transform: translateX(-26px); position: relative; top: 2px;
    }
    .shareBox .tov{
        width: 100%; height: 1.9rem; background: #F6FAFD; box-sizing: border-box; padding: 0 0.6rem;
    }
    .shareBox .tov .shan{
        display: flex;
    }
    .shareBox .tov .shan .one{
        width: 2.85rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
    }
    .shareBox .tov .shan .two{
        width: 2.55rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
    }
    .shareBox .tov .shan .three{
        height: 0.65rem; display: inline-block; box-sizing: border-box; padding: 0 0.2rem; border: 1px solid #8E9223; border-radius: 1px; font-size: 0.4rem; color: #8E9223;
    }
    .shareBox .tov .xia{
        width: 100%; font-size: 0.65rem; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 5px;
    }
    .shareBox .tov .xia img{
        width: 0.6rem; height: 0.6rem; display: inline-block; transform: translateY(2px);
    }
    .shareBox .single{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
    }
    .shareBox .single .up{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .shareBox .single .up .left{
        display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
    }
    .shareBox .single .up .left img{
        height: 0.75rem; display: inline-block; transform: translateY(2px);
    }
    .shareBox .single .up .left2{
        font-size: 0.6rem; color: #666666;
    }
    .shareBox .single .up .left2 .f-2{
        color: #ccc;
    }
    .shareBox .single .up .left2 .f-3{
        color: #F13333; font-size: 0.75rem;
    }
    .shareBox .single .up .left3 span{
        box-sizing: border-box; padding: 3px 4px; background: #F05A5A; border-radius: 1px; font-size: 0.6rem; color: #fff;
    }
    .shareBox .single .cent{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .shareBox .single .cent .left span{
        display: inline-block; height: 0.8rem; line-height: 0.8rem; box-sizing: border-box; padding: 0 6px; background: #EEEEEE;
        font-size: 0.55rem; color: #666; margin-right: 5px;
    }
    .shareBox .single .cent .right{
        font-size: 0.6rem; color: #666;
    }
    .shareBox .single .cent .right span{
        color: #ccc;
    }
    .shareBox .single .cent2{
        width: 100%; height: 30px; line-height: 30px;
        overflow: hidden; justify-content: space-between; font-size: 0.6rem; color: #666;
    }
    .shareBox .single .cent2 .left, .shareBox .single .cent2  .right{
        width: 50%; text-align: left;
        float: left;
    }
    .shareBox .single .cent2 .left span, .right span{
        color: #ccc;
    }

    .shareBox .single .cent3{
        display: flex; background: #f4f8fd; box-sizing: border-box; padding: 6px 0;
    }
    .shareBox .single .cent3 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .shareBox .single .cent3 .right{
        font-size: 0.55rem; color: #333;
    }

    .shareBox .single .down{
        width: 100%; height: 1.2rem; line-height: 1.2rem; display: flex; justify-content: space-between;
    }
    .shareBox .single .down .left{
        display: flex; font-size: 0.6rem; color: #999;
    }
    .shareBox .single .down .right span{
        font-size: 0.55rem; color: #888;
    }
    .shareBox .single .down .right img{
        width: 0.5rem; height: 0.6rem; display: inline-block; transform: translateY(3px);
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