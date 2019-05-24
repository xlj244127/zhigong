<template>
    <div data-page="bindWx" class="page navbar-fixed">
        <div class="page-content">
            <div class="navbar">
                <div class="navbar-inner">
                    <div class="left sliding"></div>
                    <div class="center sliding">绑定账户</div>
                </div>
            </div>
            <div class="main">
                <div class="nav">
                    <img class="logo" src="../../static/img/icon_logo.png"/>
                </div>
                <div class="input">
                    <div class="input-1">
                        <span class="i-left">+86</span><input class="i-right" id="mobile" type="number" v-model="mobile" placeholder="请输入手机号码"/>
                    </div>
                    <div class="input-2">
                        <input class="n-left" type="number" v-model="vcode" placeholder="请输入验证码"/>
                        <div class="n-right" @click="getCode" :disabled='isShow'>获取验证码</div>
                    </div>
                </div>
                <div class="btn" @click="loginAction">
                    绑定
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7
    import { wxApi, userApi } from '../api'
    import { LocalCache, Cache, validator } from '../lib/utils'
    export default {
        data(){
            return{
                code: '',
                url: '',
                mobile: '',
                vcode: '',
                isShow: false,

                count: 60,
                timer: null,
                isBind: false
            }
        },
        methods:{
            getCode() {
                userApi.sendMessage(
                    this.mobile
                ).then((result)=>{
                    console.log(JSON.stringify(result));
                    this.timer = setInterval(()=>{
                        if (this.count > 0 &&  this.count <= 60) {
                            $$('.n-right').css('background', 'gray');
                            $$('.n-right').css('border', '1px solid gray');
                            $$('.n-right').text(this.count+'s');
                            this.isShow = true;
                            this.count--;
                        } else {
                            $$('.n-right').css('background', '#438cff');
                            $$('.n-right').css('border', '1px solid #438cff');
                            $$('.n-right').text('获取验证码');
                            this.isShow = false;
                            this.count = 60;
                            clearInterval(this.timer);
                        }
                    }, 1000)
                })
            },
            loginAction() {
                if(this.mobile == '') {
                    this.$f7.alert('手机号不能为空');
                    return;
                }
                if(this.vcode == '') {
                    this.$f7.alert('验证码不能为空');
                    return;
                }
                if(!validator.isMobile(this.mobile)) {
                    this.$f7.alert('手机号格式不正确！');
                    return;
                }
                if(this.isBind){
                    this.$f7.alert('该微信已经绑定过智工通')
                    return;
                }else{
                    wxApi.phoneBindWx(
                        this.code,
                        this.mobile,
                        this.vcode,
                    ).then((result)=>{
                        console.log(result);
                        LocalCache.set('userInfo', result.data);
                        LocalCache.set('sessionkey', result.data.sessionkey);
                        console.log('loginResult:' + JSON.stringify(result));
                        this.$f7.alert('账户绑定成功');
                    })
                }
            }
        },
        mounted(){
            var query2 = window.location.search;
            var query3 = window.location.href;
            console.log(query2);
            console.log(query3);

            this.code = query2.substring(query2.indexOf('=')+1, query2.indexOf('&'));
            this.url = query3.split('#')[0]
            console.log(this.code);
            console.log(this.url);

            wxApi.judgeBindWx(this.code).then((result)=>{
                this.isBind = true;
                console.log('个人账户', result.data);
                LocalCache.set('userInfo', result.data);
                LocalCache.set('sessionkey', result.data.wxSessionkey);
            },
            (error)=>{
                this.isBind = false;
                console.log('登陆失败'+JSON.stringify(error));
            })

        }
    }
</script>
<style scoped>
    .page-on-left{
        transform: translate3d(0,0,0);  -webkit-transform: translate3d(0,0,0);
    }
    .page-content{
        width: 100%; height: 100%; background: #fff;
    }
    .main{
        width: 100%;
    }
    .main .nav{
        width: 100%; text-align: center;
    }
    .main .nav .logo{
        width: 5.75rem; height: 5.75rem;  margin: 2rem auto;
    }
    .main .input{
        width: 100%; text-align: center; margin-bottom: 0.75rem;
    }
    .main .input input{
        font-size: 0.8rem;
    }
    .main .input .input-1{
        width: 70%; height: 2rem; border: 1px solid gray; border-radius: 0.4rem; margin-left: 15%;
        display: flex; margin-bottom: 0.75rem;
    }
    .main .input .input-1 .i-left{
        width: 20%; height: 2rem; text-align: center; color: #438cff; line-height: 2rem; font-size: 0.8rem;
    }
    .main .input .input-1 .i-right{
        width: 78%; height: 2rem; border: none; color: black;
    }
    .main .input .input-2{
        width: 70%; height: 2rem; margin-left: 15%; display: flex; margin-bottom: 2rem;
    }
    .main .input .input-2 .n-left{
        width: 50%; height: 1.9rem; color: #438cff; line-height: 1.9rem; border: none; border: 1px solid gray; border-radius: 0.4rem;
        margin-right: 10%; padding-left: 0.75rem;
    }
    .main .input .input-2 .n-right{
        width: 40%; height: 1.9rem; color: #fff; background: #438cff; font-size: 0.7rem; text-align: center;
        line-height: 1.9rem; border: 1px solid #438cff; border-radius: 0.4rem;
    }
    .main .btn{
        width: 70%; height: 2rem; background: #438cff; color: #fff; line-height: 2rem; text-align: center;
        margin-left: 15%; border: 1px solid #438cff; border-radius: 0.3rem; font-size: 0.8rem;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
</style>
