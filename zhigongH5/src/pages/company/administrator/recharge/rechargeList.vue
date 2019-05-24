<template>
    <div data-page="downloadList" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">下载获取积分</div>
            </div>
        </div>
        <div class="page-content ">
            <div class="banner">
                <img src="../../../../../static/img/recharge_banner.png" alt="">
            </div>

            <div class="list">
                <div class="title">积分充值 <img src="../../../../../static/img/recharge_subtitle.png" alt=""></div>
                <div class="listMain" >
                    <div class="listItem " v-for="(item,index) in list" @click.stop.prevent="chooseSuit(item)" :data-id="item.id">
                        <input type="radio" :value="item.id" name="suit" class="suitId" :id="'suit'+index">
                        <label :data-id="item.id" :for="'suit'+index">
                            <div class="curPrice"><span class="price">{{item.price}}元/</span><span class="score">{{item.value}}积分</span></div>
                            <div class="orgPrice">原价：{{item.origPrice}}元</div>
                        </label>
                    </div>
                </div>
            </div>
            <div class="toPay" @click="toPay">
                <div class="button">去支付</div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import {wxApi} from "../../../../api";
    import {LocalCache} from "../../../../lib/utils";

    export default {
        name: "downloadList",
        data(){
            return{
                list:[],
                userId:'',
                currentInt:'',
                suitId:'',
                configReady:'',
            }
        },
        methods:{

            getList(){
                wxApi.scoreList().then((res)=>{
                    console.log(res);
                    this.list = res.data.reverse()
                }).catch((res)=>{
                    console.log(res)
                })
            },
            toPay(){
                let that = this
                if(this.suitId==""){
                    this.$f7.alert("请先选择充值额度")
                    return
                }else if(this.configReady){
                    wxApi.orderAdd(this.suitId).then((res)=>{
                        console.log(res);
                        let orderId = res.data.id
                        wxApi.wxPay(orderId).then((res)=>{
                            console.log("wxApi wxPay",res);
                            that.$f7.alert(res);
                            wx.chooseWXPay({
                                timestamp: res.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
                                package: res.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                                signType: res.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                paySign: res.data.paySign, // 支付签名
                                success: function (res) {
                                    // 支付成功后的回调函数
                                    this.$f7.alert(res.msg)
                                    this.$router.back()
                                },
                                fail: function (res) {
                                    this.$f7.alert("fail:",res)
                                }
                            });
                        }).catch((res)=>{
                            console.log(res);
                        })
                    }).catch((res)=>{
                        console.log(res);
                    })
                }

            },
            chooseSuit(item){
                $$('.listItem').each((xls, elm)=>{
                    if($$(elm).data("id")==item.id){
                        $$(elm).toggleClass("chosen")
                        if($$(elm).hasClass("chosen")){
                            this.suitId = item.id
                        }else{
                            this.suitId = ""
                        }
                        console.log(this.suitId)
                    }else{
                        $$(elm).removeClass("chosen")
                    }
                })
            }
        },
        created(){
            //this.userId = LocalCache.get("userInfo").id
            this.getList()
        },
        mounted(){
            this.url = window.location.href.split("#")[0]+"#/user/rechargeList/";
            //window.alert(this.url);
            wxApi.getConfig(false, this.url).then((result)=>{
                this.config = JSON.parse(result.data);
                console.log('签名',this.config);
                wx.config(
                    this.config
                );
                wx.ready(()=>{
                    this.configReady = true
                })

            })
        },
    }
</script>

<style scoped>
    .banner{
        padding: 0.875rem 1.25rem;
        width: 16.25rem;
        height: 4.75rem;
        background: #ffffff;
        margin-bottom: 0.25em;
    }
    .banner img{
        width: 16.25rem;
        height: 4.75rem;
        display: block;
    }
    .currentInt{
        width: 17.55rem;
        height:1.5rem;
        background:linear-gradient(0deg,rgba(225,231,242,1) 0%,rgba(236,242,248,1) 100%);
        margin: 0 auto;
        text-align: center;
        color: #333333;
        font-size: .6rem;
        line-height: 1.5rem;
    }
    .list{
        margin-top: .25rem;
        padding-top: 1.2rem;
        padding-left: .6rem;
        padding-bottom: 1.2rem;
        background: #ffffff;
    }
    .list img{
        width: 6.3rem;
        height: .9rem;
        vertical-align: middle;
    }
    .list .title{
        font-size: .8rem;
        color: #222222;
        font-weight: bold;
        line-height: 1rem;
    }
    .listMain{
        overflow: hidden;
        padding-left: 1.1rem;
        padding-top: .7rem;
    }
    .listItem {
        float: left;
        width: 7.25rem;
        height: 4rem;
        border: 1px solid #1B9EF5;
        margin-top: .5em;
        text-align: center;
        position: relative;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        margin-right: .85em;
    }
    .listItem label{
        position: absolute;
        width: 7.25rem;
        height: 4rem;
        left: 0;
        top: 0;
        display: block;
        background: #ffffff;
    }
    .listItem .curPrice{
        color: #1b9ef5;
        line-height: 1rem;
        height: 1rem;
        padding-top: 1.5em;
        padding-bottom: .3em;
    }
    .listItem .curPrice .price{
        font-size: 1rem;
    }
    .listItem .curPrice .score{
        font-size: .7rem;
    }
    .chosen.listItem label{
        background: #1496EC;
    }
    .chosen.listItem .curPrice {
        color: #ffffff;
    }
    .chosen.listItem .orgPrice{
        color: #ffffff;
    }
    .orgPrice{
        font-size: .7rem;
        color: #9AD0F4;
        text-decoration: line-through;
    }
    .page-content{
        position: relative;
        background: #f4f4f4;
    }
    .toPay{
        position: fixed;
        bottom: 0;
        height: 44px;
        left: 0;
        background-color: #ffffff;
        border-top: 1px solid #eee;
        padding: 0 .6rem;
        width: 100%;
        box-sizing: border-box;
    }
    .toPay .button{
        height: 30px;
        -webkit-border-radius: 22px;
        -moz-border-radius: 22px;
        border-radius: 22px;
        width: 100%;
        text-align: center;
        color: #ffffff;
        background-color: #5A99FE;
        line-height: 30px;
        margin-top: 7px;
        margin-bottom: 7px;
    }
</style>