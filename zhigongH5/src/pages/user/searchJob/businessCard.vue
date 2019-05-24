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
            <div class="footer">
                <div class="f-1" @click="saveImg">
                    <span>保存图片</span>
                </div>
                <div class="f-1" @click="shareImg">
                    <span>分享图片</span>
                </div>
            </div>
        </div>
        <div class="pick" v-show="mencheng==1" @click="cancelAction"></div>
        <div class="pickDown" v-show="mencheng==1">
            <div class="top">分享到</div>
            <div class="cent" v-show="mencheng2==2">
                <div class="c-1" @click="weixinAction">
                    <img src="../../../../static/img/weixin_icon.png"/>
                    <br/>
                    <span>微信好友</span>
                </div>
                <div class="c-1" @click="pengyouquanAction">
                    <img src="../../../../static/img/pengyouquan_icon.png"/>
                    <br/>
                    <span>朋友圈</span>
                </div>
            </div>
            <div class="bott" @click.stop.prevent="hiddenAction">取消</div>
        </div>
    </div>
</template>

<script>
    import { wxApi } from "../../../api";
    import { serverceshi } from "../../../config"
    export default {
        name: "businessCard",
        data() {
            return {
                mainImg:"",
                userId:"",
                mencheng: 0,
                mencheng2: 0,
                title:'',
                description:"",
            }
        },
        components:{
        },
        methods: {
            shareImg(){
                this.mencheng = 1;
                this.mencheng2 = 2;
                console.log(serverceshi+"/weixin/lookingJob/"+this.userId)
            },
            cancelAction(){
                this.mencheng = 0;
                this.mencheng2 = 0;
            },
            weixinAction(){
                this.mencheng = 0;
                this.mencheng2 = 0;
                Wechat.share({
                    message: {
                        title: this.title,
                        description: this.description,
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: serverceshi+"/weixin/lookingJob/"+this.userId
                        },
                    },
                    scene: Wechat.Scene.SESSION   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            pengyouquanAction(){
                this.mencheng = 0;
                this.mencheng2 = 0;
                Wechat.share({
                    message: {
                        title: this.title,
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: serverceshi+"/weixin/lookingJob/"+this.userId
                        },
                    },
                    scene: Wechat.Scene.TIMELINE   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            hiddenAction(){
                this.mencheng = 0;
                this.mencheng2 = 0;
            },
            saveImg(){
                let fileName =  this.mainImg.substr(this.mainImg.lastIndexOf('/') + 1);
                console.log(fileName);
                function saveImageToPhone(url, success, error) {
                    var canvas, context, imageDataUrl, imageData;
                    var img = new Image();
                    img.onload = function () {
                        canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        context = canvas.getContext('2d');
                        context.drawImage(img, 0, 0);
                        try {
                            imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
                            imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
                            cordova.exec(
                                success,
                                error,
                                'Canvas2ImagePlugin',
                                'saveImageDataToLibrary',
                                [imageData]
                            );
                        }
                        catch (e) {
                            error(e.message);
                        }
                    };
                    try {
                        img.src = url;
                    }
                    catch (e) {
                        error(e.message);
                    }
                }

                var success = function (msg) {
                    //下载成功
                    alert(msg)
                };
                var error = function (err) {
                    //下载失败
                    alert(err)
                };
                saveImageToPhone(this.mainImg,success,error)
            },

        },
        beforeMount(){
            this.userId = this.$route.params.userId
            wxApi.image().then((res)=>{
                console.log(res);
                this.mainImg = res.data
            })
        },
        mounted(){
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
        }
    }
</script>

<style  scoped>

    .pageOne{
        width: 100%; height: 100%; background: #000; opacity: 0.2;
    }
    .navbar .left img{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .right{
        font-size: 0.7rem; color: #438CFF;
    }
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
    .view{
        overflow-y: scroll;
    }
    .footer{
        width: 98%; height: 2.5rem; background: #fff; margin-top: 1.7rem; overflow: hidden;
        padding-left: 2%;
        position: fixed;
        bottom: 0;
        left: 0;
    }
    .footer .f-1{
        margin-left: 4%; width: 42%;
        display: inline-block;
        height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF; margin-top: 0.4rem;
    }
    /*微信分享*/
    .pick{
        width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000; opacity: 0.5; z-index: 666;
    }
    .pickDown{
        width: 94%; background: #fff; overflow: hidden; position: fixed; left: 3%; bottom: 1rem; z-index: 999; border-radius: 0.9rem;
    }
    .pickDown .top{
        width: 100%; margin-top: 25px; text-align: center; font-size: 0.75rem ; color: #333333;
    }
    .pickDown .cent{
        width: 100%; display: flex; font-size: 0.9rem; color: #F87474; margin-top: 25px;
    }
    .pickDown .cent .c-1{
        margin-left: 30px; font-size: 0.55rem; color: #666; text-align: center;
    }
    .pickDown .cent .c-1 img{
        width: 55px; height: 55px; display: inline;
    }
    .pickDown .bott{
        width: 100%; height: 44px; line-height: 44px; text-align: center; font-size: 0.75rem; color: #666666; border-top: 1px solid #f4f4f4; margin-top: 1rem;
    }
</style>