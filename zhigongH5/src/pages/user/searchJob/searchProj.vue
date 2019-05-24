<template>
    <div data-page="searchProj" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">我的班组</div>
            </div>
        </div>
        <div class="page-content">
            <!--<div class="box" v-show="this.haveList==0">   &lt;!&ndash;无数据时默认显示&ndash;&gt;-->
                <!--<div class="top">-->
                    <!--我的班组空闲状态-->
                <!--</div>-->
                <!--<div class="top2">发布您的班组工作状态，精准班组信息，方便企业及项目联系您提供工作</div>-->
            <!--</div>-->
            <div v-if="groupId!=0">
                <div class="box" v-for="(item,index) in workList">                      <!--有数据时显示-->
                    <div class="head">
                        <div class="left">
                            <img src="../../../../static/img/grayxiaodinwei2.png"/>&nbsp;<span>{{item.name}}</span>
                        </div>
                        <div class="right">
                            <div class="r-1" @click="btnEideAction(item)"><img src="../../../../static/img/bainji@2x.png"/></div>
                        </div>

                    </div>
                    <div class="cent">
                        <div class="a3-2" v-for="one in item.list">
                            <div class="left">{{one.workType.split('_')[0]}}</div>
                            <div class="left2"><span class="t">{{one.freeAmount}}</span><span class="t2">人</span></div>
                            <div class="left3">{{one.freeTime}}起</div>
                        </div>
                    </div>
                    <div class="option" >
                        <div class="fl" @click="refresh(item)">
                            <img src="../../../../static/img/search_refresh.png" alt="">
                        </div>
                        <div class="share" @click="shareImg(item)">
                            <img src="../../../../static/img/search_share.png"/>
                        </div>
                    </div>
                    <div class="tipBox" v-show="index==0&&tipShow==true ">
                        <img class="searchTip" src="../../../../static/img/search_tip_2.png" alt="">
                        <img class="searchClose" src="../../../../static/img/search_tip_close.png" alt="" @click="closeTip">
                    </div>
                </div>
                <div class="box2">
                    <div class="title">
                        <div class="left">
                            <img src="../../../../static/img/tonggao.png"/>
                            <span>班组说明</span>
                        </div>
                        <div class="right" @click="modificationAction()"><img src="../../../../static/img/bainji@2x.png"/></div>
                    </div>
                    <div class="explain">
                        &nbsp;&nbsp;<span>{{this.remark}}</span>
                    </div>
                </div>

            </div>
            <div v-else class="tishi">
                暂无信息
            </div>
        </div>
        <!--分享-->
        <div class="pick" v-show="mencheng==1" @click="cancelAction"></div>
        <div class="pickDown" v-show="mencheng==1">
            <div class="top">分享到</div>
            <div class="cent">
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

        <!--引导发布-->
        <div class="pick2" v-show="toShare==1"></div>
        <div class="tit" v-show="toShare==1">
            <img class="tp" src="../../../../static/img/yindao_icom.png"/>
            <div class="tp2">
                <div class="tp2-1">认证班组</div>
                <div class="tp2-2">您还不是班组长身份，无法查看发布信息</div>
                <div class="tp2-3">请先发布班组</div>
            </div>
            <div class="tp3">
                <div class="left left2" @click="cancel2Action">取消</div>
                <div class="left left3"><a href="/user/pubilcFreeGroup">发布班组</a></div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { tabulateStatisticsApi, wxApi} from '../../../api';
    import { serverceshi, shareAppid, shareServer } from "../../../config";
    import { LocalCache } from "../../../lib/utils";

    export default {
        data(){
            return{
                haveList: '',
                groupId: '',
                workList: [],           //接口获取数据赋值
                workerTitle: [],
                upData: [],             //修改赋值数据成接口上传数据
                remark: '',
                shareTitle: {},
                groupName: '',
                typeName: [],
                mencheng: 0,
                toShare: 0,
                title:'',
                description:"",
                userId:'',
                provinceId: '',
                cityId: '',
                tipShow:true,
            }
        },
        methods:{
            back(){
                this.groupId = this.$store.state.roleInfo.groupId;
                if(this.groupId==0){
                    this.toShare = 1;
                }else {
                    this.toShare = 0;

                    wxApi.lookGrouperPublic(this.groupId).then((result) => {
                        this.workList = result.data;
                        this.haveList = this.workList.length;
                        this.$store.state.address = {                 //把省市Id放到缓存里面
                            provinceId: result.data[0].province.id,
                            cityId: result.data[0].city.id,
                        };
                        for (var i = 0; i < this.workList.length; i++) {
                            for (var key in this.workList[i].list) {
                                for (var j = 0; j < this.workerTitle.length; j++) {
                                    if (this.workList[i].list[key].workType == this.workerTitle[j].code) {
                                        this.workList[i].list[key].workType = this.workerTitle[j].value + '_' + this.workerTitle[j].code;
                                    }
                                }
                            }
                        }
                        console.log('列表', this.workList);
                    })
                    wxApi.groupExplain(this.groupId).then((result) => {
                        console.log('班组说明', result.data);
                        this.remark = result.data.remark;
                    })
                }
            },
            shareImg(item){
                this.mencheng = 1;
                console.log('单个省市下面的信息',item);
                this.provinceId = item.list[0].province.id;
                this.cityId = item.list[0].city.id;
                this.shareTitle = {};
                for(var i=0; i<item.list.length; i++){
                    this.typeName.push(item.list[i].workType.split('_')[0]);
                }
                if(this.remark=='' || !this.remark){
                    this.remark = '无';
                }
                this.shareTitle = {
                    'remark': this.remark,
                    'groupName': this.groupName,
                    'typeName': this.typeName.join(',')
                }
                console.log('单个省市下面的信息说明',this.shareTitle, this.provinceId, this.cityId);
            },
            cancelAction(){
                this.mencheng = 0;
            },
            cancel2Action(){
                this.toShare = 0;
            },
            weixinAction(){
                this.mencheng = 0;
                Wechat.share({
                    message: {
                        title: this.shareTitle.groupName,
                        description: this.shareTitle.groupName+', 提供专业'+this.shareTitle.typeName+'班组'+'. 班组说明:'+this.remark, // 分享描述
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Scene.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareMyFreeGroup%3fparams%3d"+this.userId+"_"+this.groupId+"_"+this.provinceId+"_"+this.cityId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
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
                Wechat.share({
                    message: {
                        title: this.shareTitle.groupName,
                        description: this.shareTitle.groupName+', 提供专业'+this.shareTitle.typeName+'班组'+'. 班组说明:'+this.remark, // 分享描述
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareMyFreeGroup%3fparams%3d"+this.userId+"_"+this.groupId+"_"+this.provinceId+"_"+this.cityId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                        },
                    },
                    scene: Wechat.Scene.TIMELINE   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            btnEideAction(item){
                console.log('one');
                this.$router.load({url: '/user/editGroupFree/'});
                this.$store.state.cityWorkerList = item;
            },
            modificationAction(){
                this.$router.load({url: '/user/editGroupRemark/'});
                this.$store.state.storeRemark = this.remark;
            },
            hiddenAction(){
                this.mencheng = 0;
            },
            refresh(item){
                console.log("refresh",item);
                let cityId = item.list[0].city.id, provinceId = item.list[0].province.id,workGroupId = item.list[0].workGroupId
                wxApi.refreshWorkFree(null,workGroupId,provinceId,cityId).then((res)=>{
                    console.log("refreshWorkFree",res);
                    if(res.code==0){
                        this.$f7.alert("刷新成功")
                    }
                })
            },
            closeTip(){
                this.tipShow = false
            },
        },
        mounted(){
            this.userId = LocalCache.get("userInfo").id
            this.groupId = this.$store.state.roleInfo.groupId;
            console.log('班组长id',this.groupId);
            this.title = '专业';
            this.description ="5年工作经验，专业承接项目工程"

            if(this.groupId==0){
                this.toShare = 1;
            }else {
                this.toShare = 0;

                if (this.$store.state.workerTitle) {
                    this.workerTitle = this.$store.state.workerTitle;
                } else {
                    tabulateStatisticsApi.typeSort('workType').then((result) => {
                        this.workerTitle = result.data.list;
                        this.$store.state.workerTitle = this.workerTitle;
                        console.log(this.workerTitle);
                    })
                }
                wxApi.lookGrouperPublic(this.groupId, '', '').then((result) => {
                    this.workList = result.data;
                    this.haveList = this.workList.length;
                    console.log(this.haveList);
                    this.$store.state.address = {                 //把省市Id放到缓存里面
                        provinceId: result.data[0].list[0].province.id,
                        cityId: result.data[0].list[0].city.id,
                    };
                    for (var i = 0; i < this.workList.length; i++) {
                        for (var key in this.workList[i].list) {
                            for (var j = 0; j < this.workerTitle.length; j++) {
                                if (this.workList[i].list[key].workType == this.workerTitle[j].code) {
                                    this.workList[i].list[key].workType = this.workerTitle[j].value + '_' + this.workerTitle[j].code;
                                }
                            }
                        }
                    }
                    console.log('列表', this.workList);
                })

                wxApi.groupExplain(this.groupId).then((result) => {
                    console.log('班组说明', result.data);
                    this.remark = result.data.remark;
                    this.groupName = result.data.name;
                })
            }

        }
    }
</script>
<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }

    .box{
        width: 100%; margin-bottom: 0.5rem;
        position: relative;
    }
    .box .top{
        width: 100%; height: 2.2rem; line-height: 2.2rem; border-bottom: 1px solid #f4f4f4; font-size: 0.7rem; color: #555;
        box-sizing: border-box; padding-left: 0.6rem; background: #fff;
    }
    .box .top2{
        width: 100%; text-align: center; font-size: 0.5rem; color: #666; margin: 2.2rem auto;
    }

    .box .head{
        width: 100%; height: 1.5rem; line-height: 1.5rem; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
        display: flex; justify-content: space-between; background: #F2F7FB;
    }
    .box .head .left{
        font-size: 0.7rem; color: #666666;
    }
    .box .head .left img{
        width: 0.6rem; height: 0.75rem; transform: translateY(2px);
    }
    .box .head .right{

    }
    .box .head .right .r-1 img,.box .head .right .r-2 img{
        width: 1.85rem; height: 0.55rem;
    }
    .box .head .right .r-1,.box .head .right .refresh{
        float: left;
    }
    .box .head .right .refresh{
        margin-left: 1rem;
    }
    .box .head .right .refresh img{
        width: .65rem;
        height: .55rem;
    }
    .box .head .right .refresh span{
        color: #438cff;
    }
    .box .cent{
        background: #fff;
    }
    .box .cent .a3-2{
        width: 100%; height: 1.5rem; line-height: 1.5rem; display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 2.6rem 0 1.1rem;
    }
    .box .cent .a3-2 .left{
        min-width: 4.4rem; display: inline-block; font-size: 0.65rem; color: #438CFF;
    }
    .box .cent .a3-2 .left2{
        padding-right: 2rem; font-size: 0.6rem;
    }
    .box .cent .a3-2 .left2 .t{
        color: #EF7373;
    }
    .box .cent .a3-2 .left2 .t2{
        color: #777777;
    }
    .box .cent .a3-2 .left3{
        font-size: 0.55rem; color: #777;
    }
    .box .option{
            width: 100%;
        height: 1.1rem;
        padding-bottom: .1rem;
        padding-top: .1rem;line-height: 24px; font-size: 0.55rem; color: #999999; box-sizing: border-box; padding: 0 0.6rem; text-align: right; background: #fff;
            overflow: hidden;
        }
    .box .option img{
        height: 1.1rem; display: inline-block;
        vertical-align: middle;
    }
    .option .fl{
        float: left;
    }
    .box .share{
        float: right;
    }

    .tipBox{
        position: absolute;
        bottom: -2.5rem;
        left: 50%;
        margin-left: -1.5rem;
        z-index: 100;
    }
    .tipBox .searchClose{
        width: 1rem;
        height: 1rem;
        position: absolute;
        top: 0.25em;
        left: 6.75rem;
    }
    .tipBox .searchTip{
        width: 7.25rem;
        height: 4.5rem;
    }
    .box2{

    }
    .box2 .title{
        width: 100%; height: 1.5rem; line-height: 1.5rem; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
        display: flex; justify-content: space-between; background: #F2F7FB;
    }
    .box2 .title .left{
        font-size: 0.7rem; color: #666;
    }
    .box2 .title .left img{
        width: 0.6rem; height: 0.75rem;
        vertical-align: middle;
    }
    .box2 .title .right{

    }
    .box2 .title .right img{
        width: 1.85rem; height: 0.55rem; transform: translateY(2px);
    }
    .box2 .explain{
        background: #fff; font-size: 0.6rem; color: #999999; padding: 0.5rem 0.8rem 0.6rem 0.6rem;
    }
    .tishi{
        width: 100%; height: 30px; line-height: 30px; text-align: center; font-size: 0.8rem; color: #666; margin-top: 2rem;
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



    /*引导发布*/
    .pick2{
        width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000; opacity: 0.5; z-index: 666;
    }
    .tit{
        width: 284px; height: 225px; background: #fff; position: fixed; left: 12%; top: 28%; z-index: 990;
    }
    .tit .tp{
        width: 100px; height: 90px; margin: 0 auto; display: block; transform: translateY(-36px); position: relative; z-index: 991;
    }
    .tit .tp2{
        text-align: center; transform: translateY(-30px);
    }
    .tit .tp2 .tp2-1{
        font-size: 0.75rem; color: #063D67;
    }
    .tit .tp2 .tp2-2{
        font-size: 0.65rem; color: #111111;  font-weight: 700; margin-top: 18px;
    }
    .tit .tp2 .tp2-3{
        font-size: 0.7rem; color: #666; margin-top: 10px;
    }
    .tit .tp3{
        width: 100%; display: flex; justify-content: space-around; transform: translateY(-10px);
    }
    .tit .tp3 .left{
        width: 100px; height: 35px; line-height: 35px; text-align: center; font-size: 0.85rem;  border: 1px solid #227FC5; border-radius: 1.5px;
    }
    .tit .tp3 .left2{
        color: #227FC5;
    }
    .tit .tp3 .left3{
        background: #227FC5;
    }
    .tit .tp3 .left3 a{
        display: inline-block; width: 100%; height: 100%; color: #fff;
    }
</style>
