<template>
    <f7-page name="changeTel">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">修改联系人电话</div>
            </div>
        </div>
        <div class="cont-block">
            <div class="top"></div>
            <div class="header">
                <div class="head">
                    <span class="h-1">原手机号码</span>
                    <br/>
                    <span class="h-2">{{oldMobile}}</span>
                </div>
            </div>
            <div class="top"></div>
            <div class="main">
                <div class="input">
                    <div class="input-1">
                        <span class="i-left">+86</span><input class="i-right" type="tel" v-model="mobile" placeholder="请输入新手机号码"/>
                    </div>
                    <div class="input-2">
                        <input class="n-left" type="number" v-model="vcode" placeholder="请输入验证码"/><span class="n-right" @click="getCode">获取验证码</span>
                    </div>
                </div>
                <button class="btn" @click="changeAction">
                    修改
                </button>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import { userApi } from '../../../api'
    import { LocalCache, validator } from '../../../lib/utils'

    export default {
        data() {
            return {
                oldMobile: this.$store.state.userInfo.mobile,
                mobile: '',
                vcode: ''
            }
        },
        methods:{
            getCode() {
                userApi.sendMessage(
                    this.mobile
                ).then((result)=>{
                    console.log(JSON.stringify(result));
                })
            },
            changeAction() {
                if(!validator.isMobile(this.mobile)) {
                    this.$f7.alert('手机号格式不正确！');
                    return;
                }

                let that = this;
                userApi.changeMobile(
                    this.mobile,
                    this.vcode
                ).then((result)=>{
                    console.log(result);
                    let userInfo = LocalCache.get('userInfo');
                    userInfo.mobile = that.mobile;
                    this.$store.state.userInfo.mobile = userInfo.mobile;
                    LocalCache.set('userInfo', userInfo);
                    that.$router.back();
                })
            }
        }
    }
</script>

<style scoped>
    .top{
        width: 100%; height: 0.5rem; background: #f4f4f4;
    }
    .header{
        width: 100%; height: 6.25rem; text-align: center;
    }
    .header .head{
        margin-top: 1.75rem;
    }
    .header .head .h-1{
        font-size: 0.7rem; color: #aaa;
    }
    .header .head .h-2{
        font-size: 1.15rem; color: #438cff;
    }
    /*登陆部分*/
    .main{
        margin-top: 2.2rem;
    }
    .main .input{
        width: 100%; text-align: center; margin-bottom: 0.75rem;
    }
    .main .input .input-1{
        width: 70%; height: 2rem; border: 1px solid gray; border-radius: 0.4rem; margin-left: 15%;
        display: flex; margin-bottom: 0.75rem;
    }
    .main .input .input-1 .i-left{
        width: 20%; height: 2rem; text-align: center; color: #438cff; line-height: 2rem; font-size: 0.8rem;
    }
    .main .input .input-1 .i-right{
        width: 78%; height: 1.9rem; border: none; color: black;
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
        line-height: 1.9rem; border: 1px solid gray; border-radius: 0.4rem;
    }
    .main .btn{
        width: 70%; height: 2rem; background: #438cff; color: #fff; line-height: 2rem; text-align: center;
        margin-left: 15%; border: 1px solid gray; border-radius: 0.3rem;
    }
    .main .btn a{
        color: #fff; width: 100%; height: 100%; display: block;
    }
</style>