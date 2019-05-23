<template>
    <div data-page="cityGroupFree" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">我的班组分享</div>
            </div>
        </div>
        <div class="page-content">
            <div class="a2">
                <div class="a2-1">
                    <span class="wg">{{this.workerSearchJobList.workGroupName}}</span>
                    <img src="../../static/img/shareYishiming.png"/>
                    <img src="../../static/img/shareYirengzhen.png"/>
                    <span class="wg2">班组25人</span>
                </div>
                <div class="a2-2">
                    <img src="../../static/img/phone_icom.png"/>
                </div>
            </div>
            <div class="single">
                <div class="cent">
                    <div class="a3-2" v-for="item in this.workerSearchJobList.list">
                        <div class="left">{{item.workType}}</div>
                        <div class="left2"><span class="t">{{item.freeAmount}}</span><span class="t2">人</span></div>
                        <div class="left3">{{item.freeTime}}起</div>
                    </div>
                </div>
                <div class="cent3" v-show="this.workerSearchJobList.remark!=''">
                    <img src="../../static/img/tonggao.png"/>
                    <div class="right">{{this.workerSearchJobList.remark}}</div>
                </div>
                <div class="down">
                    <img src="../../static/img/grayxiaodinwei2.png"/>
                    <span v-if="this.workerSearchJobList.province">{{this.workerSearchJobList.province.name}}</span><span v-if="this.workerSearchJobList.city">{{this.workerSearchJobList.city.name}}</span>
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
                workGroupId: '',
                provinceId: '',
                cityId: '',
                workerSearchJobList: {},
                workerTitle: [],
                code: '',
                url: '',
                shareTitle: {},
                remark: '',
                userId: ''
            }
        },
        methods:{
            iKnowAction(){
                this.$router.back();
            }
        },
        mounted(){
            var query3 = window.location.href;
            this.url = query3.split('#')[0]
            this.userId = LocalCache.get('userInfo').id;
            console.log(query3,this.url,this.userId);
            this.shareTitle = this.$store.state.shareTitle;
            if(this.$store.state.shareTitle=='' || this.$store.state.shareTitle){
                this.remark = '无';
            }else{
                this.remark = this.$store.state.shareTitle.remark;
            }
            console.log('分享的文字信息',this.shareTitle);


            this.provinceId = this.$route.params.provinceId;
            this.cityId = this.$route.params.cityId;
            this.workGroupId = this.$store.state.workGroupId;
            console.log('班组长id及省市',this.workGroupId,this.provinceId,this.cityId);

            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=>{
                    this.workerTitle = result.data.list;
                    this.$store.state.workerTitle = this.workerTitle;
                    console.log(this.workerTitle);
                })
            }

            wxApi.listByShare(this.workGroupId, this.provinceId, this.cityId).then((result)=>{
                console.log(result.data);
                this.workerSearchJobList = result.data[0];
                for(var i=0; i<this.workerSearchJobList.list.length; i++){
                    for(var j=0; j<this.workerTitle.length; j++){
                        if(this.workerSearchJobList.list[i].workType == this.workerTitle[j].code){
                            this.workerSearchJobList.list[i].workType = this.workerTitle[j].value;
                        }
                    }
                }
                console.log('列表',this.workerSearchJobList);
            })

            wxApi.getConfig(false, this.url).then((result)=> {
                this.config = JSON.parse(result.data);
                console.log('签名', this.config);

                wx.config(
                    this.config
                );

                let link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareMyFreeGroup%3fparams%3d"+this.userId+"_"+this.workGroupId+"_"+this.provinceId+"_"+this.cityId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                let link2 = shareServer + "/#/user/shareMyFreeGroup?params="+this.userId+"_"+this.workGroupId+"_"+this.provinceId+"_"+this.cityId;
                let link3 = shareServer+"/weixin/shareMyFreeGroup?params="+this.userId+"_"+this.workGroupId+"_"+this.provinceId+"_"+this.cityId;
                console.log(link3);
                wx.onMenuShareQQ({
                    title: this.shareTitle.groupName, // 分享标题
                    desc: this.shareTitle.groupName+', 提供专业'+this.shareTitle.typeName+'班组'+'. 班组说明:'+this.remark, // 分享描述
                    link: shareServer+"/weixin/shareMyFreeGroup?params="+this.userId+"_"+this.workGroupId+"_"+this.provinceId+"_"+this.cityId,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title: this.shareTitle.groupName, // 分享标题
                    desc: this.shareTitle.groupName+', 提供专业'+this.shareTitle.typeName+'班组'+'. 班组说明:'+this.remark, // 分享描述
                    link: shareServer+"/weixin/shareMyFreeGroup?params="+this.userId+"_"+this.workGroupId+"_"+this.provinceId+"_"+this.cityId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title: this.shareTitle.groupName, // 分享标题
                    desc:  this.shareTitle.groupName+', 提供专业'+this.shareTitle.typeName+'班组'+'. 班组说明:'+this.remark, // 分享描述
                    link:  shareServer+"/weixin/shareMyFreeGroup?params="+this.userId+"_"+this.workGroupId+"_"+this.provinceId+"_"+this.cityId,     // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
                    title: this.shareTitle.groupName, // 分享标题
                    desc: this.shareTitle.groupName+', 提供专业'+this.shareTitle.typeName+'班组'+'. 班组说明:'+this.remark, // 分享描述
                    link: shareServer+"/weixin/shareMyFreeGroup?params="+this.userId+"_"+this.workGroupId+"_"+this.provinceId+"_"+this.cityId,       // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
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
    .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; border-bottom: 1px solid #DDDEE2; display: flex; justify-content: space-between;
        background: #F2F7FB; box-sizing: border-box; padding: 0 0.6rem;
    }
    .a2 .a2-1 .wg{
        font-size: 0.75rem; color: #555; font-weight: 700; padding-right: 0.5rem;
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
        width: 100%; box-sizing: border-box; padding: 0 0.6rem 0.5rem 0.6rem; background: #fff;
    }
    .single .cent{
        background: #fff;
    }
    .single .cent .a3-2{
        width: 100%; height: 1.5rem; line-height: 1.5rem; display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 2.6rem 0 1.1rem;
    }
    .single .cent .a3-2 .left{
        min-width: 4.4rem; display: inline-block; font-size: 0.65rem; color: #438CFF;
    }
    .single .cent .a3-2 .left2{
        padding-right: 2rem; font-size: 0.6rem;
    }
    .single .cent .a3-2 .left2 .t{
        color: #EF7373;
    }
    .single .cent .a3-2 .left2 .t2{
        color: #777777;
    }
    .single .cent .a3-2 .left3{
        font-size: 0.55rem; color: #777;
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