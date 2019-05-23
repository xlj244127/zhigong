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
            <div class="shareItem">
                <div class="a2">
                    <div class="a2-1">
                        <div v-if="recruitDetail.lookingJobExist">
                            <span v-if="groupOneRecruit.displayName">{{groupOneRecruit.displayName}}</span>
                        </div>
                        <div v-else-if="recruitDetail.name">{{recruitDetail.name}}</div>
                        <div v-else-if="recruitDetail.nickname">{{recruitDetail.nickname}}</div>
                        <div v-else="recruitDetail.mobile">{{recruitDetail.mobile.substr(0,3)+'******'+recruitDetail.mobile.substr(8)}}</div>
                        <div class="he" v-if="(recruitDetail.lookingJobExist && groupOneRecruit.nativeProvinceName) || recruitDetail.userDetail.nation">
                            <span v-if="recruitDetail.userDetail.nation">{{recruitDetail.userDetail.nation}}族</span>
                            <span v-if="recruitDetail.lookingJobExist && groupOneRecruit.nativeProvinceName && recruitDetail.userDetail.nation">|</span>
                            <span v-if="recruitDetail.lookingJobExist && groupOneRecruit.nativeProvinceName">{{groupOneRecruit.nativeProvinceName}}人</span>
                        </div>
                        <img v-show="recruitDetail.userDetail.idNumber" src="../../static/img/shareYishiming.png"/>
                        <div class="grouper" v-if="recruitDetail.workGroupId!=null">班组长</div>
                    </div>
                    <div class="a2-2" @click="">
                        <img src="../../static/img/phone_icom.png"/>
                    </div>
                </div>
                <div class="cent">
                    <div class="a3">
                        <div class="a3-1">
                            <div class="left">工种类型 | </div>&nbsp;
                            <div class="right">
                                <span v-if="recruitDetail.lookingJobExist==true" >
                                    <span v-for="(workTypeItem,index) in groupOneRecruit.workTypeNames">
                                        <span class="u2" >{{workTypeItem}}</span><span class="u3" v-show="groupOneRecruit.littleBigs[index]==0">大工</span><span class="u4" v-show="groupOneRecruit.littleBigs[index]==1">小工</span>
                                    </span>
                                </span>
                                <span v-else>
                                    <span class="u2">{{recruitDetail.workTypeName}}</span> <span class="u3" v-show="recruitDetail.littleBig==0">大工</span><span class="u4" v-show="recruitDetail.littleBig==1">小工</span>
                                </span>
                            </div>
                        </div>
                        <div class="a3-2">
                            <div class="left"><span class="f2">期望薪资 | </span><span class="f3" v-if="recruitDetail.lookingJobExist==true">{{groupOneRecruit.salary}}{{groupOneRecruit.salaryLabel}}</span><span class="f3" v-else>面议</span></div>
                            <div class="right" v-if="recruitDetail.workingExp!=null"><span>工龄{{recruitDetail.workingExp}}年</span></div>
                        </div>
                        <div class="a3-2">
                            <div class="left2"><span class="t2">待遇需求 | </span><span v-if="recruitDetail.lookingJobExist==true&&groupOneRecruit.treatmentNames[0]!=''"><span  class="t3" v-for="treatmentItem in groupOneRecruit.treatmentNames">{{treatmentItem}}</span></span><span v-else>--</span></div>
                            <div class="right2"><span class="r2">时间 | </span>&nbsp;<span v-if="recruitDetail.lookingJobExist==true" class="r3">{{groupOneRecruit.expectTime}}</span><span v-else>--</span></div>
                        </div>
                    </div>
                    <div class="a5">
                        <img src="../../static/img/tonggao.png"/>
                        <div class="right">{{recruitDetail.remark}}</div>
                    </div>
                    <div class="bom">
                        <img src="../../static/img/grayxiaodinwei2.png"/>
                        <span v-if="recruitDetail.province==recruitDetail.city">{{recruitDetail.province}}{{recruitDetail.city}}</span>
                        <span v-else>{{recruitDetail.province}}</span>
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
            if(this.recruitDetail.treatmentsName){
                this.treatmentsName = this.recruitDetail.treatmentsName.split(',');
            }
            this.demandTime = this.recruitDetail.demandTime;
            console.log('薪资待遇',this.treatmentsName,this.demandTime);
        },
        mounted(){
            var query3 = window.location.href;
            this.url = query3.split('#')[0]
            this.userId = LocalCache.get('userInfo').id;
            this.groupOneRecruit = this.$store.state.groupOneRecruit;
            let location,workTypes,workingExp;
            if(this.recruitDetail.province == this.recruitDetail.city){
                location = this.recruitDetail.province
            }else{
                location = this.recruitDetail.province + this.recruitDetail.city
            }
            if(this.recruitDetail.workingExp){
                workingExp = this.recruitDetail.workingExp + "年工作经验，"
            }else{
                workingExp = ""
            }
            if(this.groupOneRecruit){
                if(this.groupOneRecruit.workTypeNames&&this.groupOneRecruit.workTypeNames[0]!=""){
                    workTypes = this.groupOneRecruit.workTypeNames.join(",")
                }else{
                    workTypes = ""
                }
            }else{
                workTypes = ""
            }

            console.log("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + shareAppid + "&redirect_uri=" + encodeURIComponent(shareServer) + "%2f%23%2fuser%2fshareWorkerRecruit%3fparams%3d" + this.recruitDetail.id + "_" + this.userId + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect");
            wxApi.getConfig(false, this.url).then((result)=> {
                this.config = JSON.parse(result.data);
                console.log('签名', this.config);

                wx.config(
                    this.config
                );
                wx.onMenuShareQQ({
                    title:"专业"+workTypes, // 分享标题
                    desc: location+','+workingExp+"专业承接项目工程",
                    link: shareServer + "/#/user/shareWorkerRecruit?params="+this.recruitDetail.id+"_"+this.userId,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title:"专业"+workTypes, // 分享标题
                    desc: location+','+workingExp+"专业承接项目工程",
                    link: shareServer + "/#/user/shareWorkerRecruit?params="+this.recruitDetail.id+"_"+this.userId,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                //link: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareAllData%3finviterId%3d"+this.userId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect",
                wx.onMenuShareAppMessage({
                    title:"专业"+workTypes, // 分享标题
                    desc: location+','+workingExp+"专业承接项目工程",
                    link: shareServer + "/weixin/shareWorkerRecruit?params="+this.recruitDetail.id+"_"+this.userId,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title:"专业"+workTypes, // 分享标题
                    desc: location+','+workingExp+"专业承接项目工程",
                    link: shareServer + "/weixin/shareWorkerRecruit?params="+this.recruitDetail.id+"_"+this.userId,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
        display: flex; background: #f4f8fd; box-sizing: border-box; padding: 6px 0;
    }
    .shareItem .cent .a5 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .shareItem .cent .a5 .right{
        font-size: 0.55rem; color: #333;
    }
    .shareItem .bom{
        width: 100%; height: 24px; line-height: 24px; font-size: 0.5rem; color: #888;
    }
    .shareItem .bom img{
        width: 9px; height: 11px; display: inline-block; transform: translateY(2px);
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