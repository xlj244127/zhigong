<template>
    <div data-page="businessCard" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">工人名片</div>
            </div>
        </div>
        <div class="page-content">
            <div class="userCard">
                <img :src="mainImg" alt="">
            </div>
        </div>
        <div class="footer">
            <div class="f-1" @click="saveImg">
                <span>保存图片</span>
            </div>
            <div class="f-1" @click="shareImg">
                <span>分享图片</span>
            </div>
        </div>
        <div class="allpage" v-show="titleHandle==1">
            <img src="../../static/img/inviterTiltle.png"/>
            <div class="know" @click="iKnowAction">知道了</div>
        </div>
    </div>
</template>

<script>
    import { wxApi } from "../api";
    import { serverceshi } from "../config"
    export default {
        data() {
            return {
                url: '',
                mainImg:"",
                userId:"",
                title:'',
                description:"",
                titleHandle: 0
            }
        },
        components:{
        },
        methods: {
            saveImg(){
                this.$f7.alert('长按页面保存页面到手机');
            },
            shareImg(){
                this.titleHandle = 1;
            },
            iKnowAction(){
                this.titleHandle = 0;
            }
        },
        beforeMount(){
            this.userId = this.$route.params.userId
            wxApi.image().then((res)=>{
                console.log(res);
                this.mainImg = res.data
            })
        },
        mounted(){
            var query3 = window.location.href;
            this.url = query3.split('#')[0]
            console.log('页面路径',query3,this.url);

            this.userCard = this.$store.state.userCard
            console.log(this.userCard);
            let workTypeArr = []
            for(var i=0;i<this.userCard.workTypeList.length;i++){
                workTypeArr.push(this.userCard.workTypeList[i].workerType)
            }
            this.title = '专业'+workTypeArr.join('、');
            let location;
            if(this.userCard.user.city==this.userCard.user.province){
                location = this.userCard.user.city
            }else{
                location = this.userCard.user.province+this.userCard.user.city
            }
            this.description =location+"，" +this.userCard.user.workingExp+"年工作经验，专业承接项目工程"


            wxApi.getConfig(false, this.url).then((result)=> {
                this.config = JSON.parse(result.data);
                console.log('签名', this.config);

                wx.config(
                    this.config
                );

                let link = serverceshi+"/weixin/lookingJob/"+this.userId;
                console.log(link);
                wx.onMenuShareQQ({
                    title: this.title, // 分享标题
                    desc: this.description, // 分享描述
                    link: serverceshi+"/weixin/lookingJob/"+this.userId,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title: this.title, // 分享标题
                    desc: this.description, // 分享描述
                    link: serverceshi+"/weixin/lookingJob/"+this.userId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title: this.title, // 分享标题
                    desc: this.description, // 分享描述
                    link: serverceshi+"/weixin/lookingJob/"+this.userId,      // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title: this.title, // 分享标题
                    desc: this.description, // 分享描述
                    link: serverceshi+"/weixin/lookingJob/"+this.userId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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

<style  scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .userCard img{
        display: block;
        width: 100%;
    }
    .userCard{
        padding-bottom: 2.5rem;
    }
    .footer{
        width: 98%; height: 2.5rem; background: #fff; margin-top: 1.7rem; overflow: hidden;
        padding-left: 2%;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 666;
    }
    .footer .f-1{
        margin-left: 4%; width: 42%;
        display: inline-block;
        height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF; margin-top: 0.4rem;
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