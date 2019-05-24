<template>
    <div class="page">
        <div class="common-logo" style="background-image: url('./static/img/home_login_background.jpg');">
            <img src="../../static/img/icon_logo_home.png"/>
        </div>
        <div class="common-main">
            <ul class="common-list">
                <li class="common-li-1"><a href="/user/login" id="login">手机登陆</a></li>
                <li class="common-li-2" v-if="showWechat"><a @click="onWechatLogin">微信登陆</a></li>
            </ul>
            <div class="common-text">
                <span>温馨提示:</span>
                <br/>
                <span>使用手机或微信登录将自动为您注册智工通账号</span>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { userApi } from '../api'
    import { LocalCache, Cache } from '../lib/utils'

    export default {
        name: 'home',
        data () {
            return {
                showWechat: false,
            }
        },
        created: function () {
            let that = this;
            this.$root.eventHub.$on('cordovaReady', (result)=>{
                console.log(result);
                if (window.Wechat) {
                    console.log('Wechat plugin');
                    Wechat.isInstalled(function (installed) {
                        console.log('Wechat installed: ' + installed);
                        that.showWechat = installed;
                    }, function (reason) {
                        console.log("Failed: " + reason);
                    });
                }
            });
        },
        destroyed() {
            this.$root.eventHub.$off('cordovaReady');
        },
        methods: {
            onWechatLogin() {
                let that = this;
                if (window.Wechat) {
                    Wechat.auth('snsapi_userinfo', 'userinfo', function (response) {
                        console.log('Weixin response:' + JSON.stringify(response));
                        console.log('getuiCID:'+Cache.get('getuiCID'));
                        userApi.loginWx(response.code, Cache.get('getuiCID')).then((result) => {
                            console.log('loginResult:' + JSON.stringify(result));
                            LocalCache.set('userInfo', result.data);
                            LocalCache.set('sessionkey', result.data.sessionkey);
                            that.$store.state.userInfo = result.data;

                            window.location.reload();
                        }, (error)=>{
                            console.log('Weixin error:' + JSON.stringify(error));
                            if(error.code && error.code == 3) {
                                //微信第一次登录，需要绑定手机号
                                console.log('Need binding...');
                                let mainView = window.f7.getCurrentView(0);
                                mainView.router.loadPage('/user/wechatBind?code='+error.data.code);
                            }
                        });
                    }, function (reason) {
                        console.log('Wechat login failed: ' + reason);
                    });
                }
            }
        }
    }
</script>
<style scoped>
    ul li{
        list-style: none;
    }
    .page{
        width: 100%; height: 100%; background: #fff;
    }
    .page .common-logo{
        width: 100%; height: 20rem; background-image: url('../../static/img/home_login_background.jpg');
        background-size: 100% 100%; overflow: hidden;
    }
    .page .common-logo img{
        width: 11.4rem; height: 3.8rem; display: block; margin: 8.1rem auto;
    }
    .page .common-logo .logo{

    }
    .page .common-main .common-list{
        padding-top: 2rem;
    }
    .page .common-main .common-list li{
        width: 60%; height: 2rem; text-align: center; line-height: 2rem;
        font-size: 0.8rem; border-radius: 0.4rem; display: block;
        margin: 0 auto 1rem;
    }
    .page .common-main .common-list li a{
        display: block;
    }
    .page .common-main .common-list .common-li-1{
        border: 1px solid #448dff;
    }
    .page .common-main .common-list .common-li-2{
        border: 1px solid #29a244;
    }
    .page .common-main .common-list .common-li-2 a{
        color: #29a244;
    }
    .page .common-main .common-text{
        text-align: center; font-size: 0.7rem; color: #999;
    }

</style>