<template>
    <div data-page="groupRenZheng" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">班组认证</div>
            </div>
        </div>
        <div class="page-content">
            <div class="box" @click="shareAction">
                <img src="../../static/img/groupRenZheng_icom.png"/>
                <div class="fix">班组认证</div>
            </div>
        </div>
        <div class="allpage" v-show="titleHandle==1">
            <img src="../../static/img/inviterTiltle.png"/>
            <div class="know" @click="iKnowAction">知道了</div>
        </div>
    </div>
</template>

<script>
    import {userApi, wxApi, projectApi} from "../api";
    import { LocalCache } from '../lib/utils';
    import { shareServer, shareAppid, serverceshi} from '../config';
    export default {
        data(){
            return{
                titleHandle: 0,
                userId: '',
                url: ''
            }
        },
        methods:{
            shareAction(){
                this.titleHandle = 1;
            },
            iKnowAction(){
                this.titleHandle = 0;
            }
        },
        mounted(){
            var query3 = window.location.href;
            this.url = query3.split('#')[0]
            this.userId = LocalCache.get('userInfo').id;
            console.log(query3,this.url,this.userId);

            wxApi.getConfig(false, this.url).then((result)=> {
                this.config = JSON.parse(result.data);
                console.log('签名', this.config);

                wx.config(
                    this.config
                );

                wx.onMenuShareQQ({
                    title: '加入班组找活干', // 分享标题
                    desc: '您的工友邀请您加入他的班组，找项目找活干更方便', // 分享描述
                    link:   shareServer+"/#/user/groupRenZhengLogin?inviterId="+this.userId,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title: '加入班组找活干', // 分享标题
                    desc: '您的工友邀请您加入他的班组，找项目找活干更方便', // 分享描述
                    link: shareServer+"/#/user/groupRenZhengLogin?inviterId="+this.userId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title: '加入班组找活干', // 分享标题
                    desc: '您的工友邀请您加入他的班组，找项目找活干更方便', // 分享描述
                    link: shareServer+"/#/user/groupRenZhengLogin?inviterId="+this.userId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title: '加入班组找活干',      // 分享标题
                    desc: '您的工友邀请您加入他的班组，找项目找活干更方便', // 分享描述
                    link: shareServer+"/#/user/groupRenZhengLogin?inviterId="+this.userId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%;
    }
    .box{
        position: relative;
    }
    .box img{
        width: 100%; height: 100%;
    }
    .box .fix{
        width: 80%; height: 35px; line-height: 35px; text-align: center; border-radius: 0.9rem; position: absolute; left: 10%; bottom: 8%;
        background: #438CFF; font-size: 0.8rem; color: #FFFFFF;
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