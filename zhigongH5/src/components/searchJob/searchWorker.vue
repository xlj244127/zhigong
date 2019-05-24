<template>
    <div class="main2">
        <ul class="aul">
            <li v-for="item in workerList">
                <div class="a2">
                    <div class="a2-1">
                        <div v-if="item.lookingJobExist">
                            <span v-if="item.lookingJobEntity.displayName">{{item.lookingJobEntity.displayName}}</span>
                        </div>
                        <div v-else-if="item.name">{{item.name}}</div>
                        <div v-else-if="item.nickname">{{item.nickname}}</div>
                        <div v-else="item.mobile">{{item.mobile.substr(0,3)+'******'+item.mobile.substr(8)}}</div>
                        <div class="he" v-if="(item.lookingJobExist && item.lookingJobEntity.nativeProvinceName) || item.userDetail.nation">
                            <span v-if="item.userDetail.nation">{{item.userDetail.nation}}族</span>
                            <span v-if="item.lookingJobExist && item.lookingJobEntity.nativeProvinceName && item.userDetail.nation">|</span>
                            <span v-if="item.lookingJobExist && item.lookingJobEntity.nativeProvinceName">{{item.lookingJobEntity.nativeProvinceName}}人</span>
                        </div>
                        <img v-show="item.userDetail.idNumber" src="../../../static/img/shareYishiming.png"/>
                        <div class="grouper" v-if="item.workGroupId!=null">班组长</div>
                    </div>
                    <div class="a2-2" @click="contactWorker(item)">
                        <img src="../../../static/img/phone_icom.png"/>
                    </div>
                </div>
                <div class="cent">
                    <div class="a3">
                        <div class="a3-1">
                            <div class="left">工种类型 |</div>&nbsp;
                            <div class="right">
                                <span v-if="item.lookingJobExist==true" >
                                    <span v-for="(workTypeItem,index) in item.lookingJobEntity.workTypeNames">
                                        <span class="u2" >{{workTypeItem}}</span><span class="u3" v-show="item.lookingJobEntity.littleBigs[index]==0">大工</span><span class="u4" v-show="item.lookingJobEntity.littleBigs[index]==1">小工</span>
                                    </span>
                                </span>
                                <span v-else>
                                    <span class="u2">{{item.workTypeName}}</span> <span class="u3" v-show="item.littleBig==0">大工</span><span class="u4" v-show="item.littleBig==1">小工</span>
                                </span>
                            </div>
                        </div>
                        <div class="a3-2">
                            <div class="left"><span class="f2">期望薪资 | </span><span class="f3" v-if="item.lookingJobExist==true">{{item.lookingJobEntity.salary}}{{item.lookingJobEntity.salaryLabel}}</span><span v-else>--</span></div>
                            <div class="right" v-if="item.workingExp!=null"><span>工龄{{item.workingExp}}年</span></div>
                        </div>
                        <div class="a3-2">
                            <div class="left2"><span class="t2">待遇需求 | </span><span v-if="item.lookingJobExist==true&&item.lookingJobEntity.treatmentNames[0]!=''"><span  class="t3" v-for="treatmentItem in item.lookingJobEntity.treatmentNames">{{treatmentItem}}</span></span><span v-else>--</span></div>
                            <div class="right2"><span class="r2">时间 | </span>&nbsp;<span v-if="item.lookingJobExist==true" class="r3">{{item.lookingJobEntity.expectTime}}</span><span v-else>--</span></div>
                        </div>
                    </div>
                    <div class="a5">
                        <img src="../../../static/img/tonggao.png"/>
                        <div class="right" >{{item.remark}}</div>
                    </div>
                    <div class="bom">
                        <div class="address">
                            <img src="../../../static/img/grayxiaodinwei2.png"/>
                            <span>{{item.province}}{{item.city}}</span>
                        </div>
                        <div class="share" @click="shareItem(item)">
                            <img src="../../../static/img/search_share.png" alt="">
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="fix" @click="searchWorker"><a href="#"><img src="../../../static/img/mypubilcrecruit.png"/></a></div>
        <div class="fix2">
            <a @click="pubilcWorkerNeed" href="#"><span>+</span>&nbsp;发布招工</a>
            <div class="imgTip" v-if="tipShow">
                <img src="../../../static/img/search_tip_1.png" alt="" class="tipMain">
                <img src="../../../static/img/search_tip_close.png" alt="" @click="closeTip()" class="tipClose">
            </div>
        </div>
        <!--分享蒙尘-->
        <div class="pick" v-show="mencheng==1" @click="cancelAction"></div>
        <div class="pickDown" v-show="mencheng==1">
            <div class="top">分享到</div>
            <div class="cent">
                <div class="c-1" @click="weixinAction">
                    <img src="../../../static/img/weixin_icon.png"/>
                    <br/>
                    <span>微信好友</span>
                </div>
                <div class="c-1" @click="pengyouquanAction">
                    <img src="../../../static/img/pengyouquan_icon.png"/>
                    <br/>
                    <span>朋友圈</span>
                </div>
            </div>
            <div class="bott" @click.stop.prevent="hiddenAction">取消</div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { wxApi } from "../../api";
    import { LocalCache } from '../../lib/utils';
    import phone_icon from '../../../static/img/phone_icon.png';
    import { shareAppid,shareServer } from "../../config";
    export default {
        name: "searchWorker",
        data(){
            return{
                workerList: [],
                treatment: [],
                userId: '',
                groupId: '',
                tipShow: true,
                companyRole: '',
                mencheng:'',
                itemData:{},
                location:"",
                workTypes:"",
                workingExp:"",
            }
        },
        props: ["workerList", "number"],
        methods:{
            shareAction(){
                this.mencheng = 1;
            },
            cancelAction(){
                this.mencheng = 0;
            },
            hiddenAction(){
                this.mencheng = 0;
            },
            searchWorker(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    this.$router.load({url: '/user/searchWorker'})
                }
            },
            pubilcWorkerNeed(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    this.$router.load({url: '/user/pubilcWorkerNeed/0/'})
                }
            },
            contactWorker(item){
                this.groupId = this.$store.state.roleInfo.groupId;
                let hideMobile = item.mobile.substr(0,3)+'****'+item.mobile.substr(7);
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else {
                    if (this.groupId != 0) {
                        if (this.number == 0) {
                            this.$f7.alert('用户联系次数已用完，邀请好友增加联系次数');
                        } else {
                            wxApi.getUserMobile(item.id).then((res) => {
                                console.log('个人详情', res.data);
                                let mobile = res.data;
                                let hideMobile = mobile.substr(0, 3) + '****' + mobile.substr(7);
                                this.$f7.modal({
                                    text: '<div class="tabs">' +
                                    '<img style="width: 1rem; height: 1.1rem; transform: translateY(0.3rem)" src=' + phone_icon + '>' +
                                    '<a>' + hideMobile + '</a>' +
                                    '</div>',
                                    buttons: [
                                        {
                                            text: '取消'
                                        },
                                        {
                                            text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:' + mobile + '" class="external">' + "拨号" + '</a>',
                                            onClick: () => {
                                                console.log('我点击了拨号');
                                                wxApi.contactUserRecord(item.id).then((result) => {
                                                    console.log(result.data);
                                                })
                                                wxApi.subOneTimes(this.userId).then((result) => {
                                                    this.number = result.data.times;
                                                    console.log('次数', result.data);
                                                    this.$emit('childComponents', this.number);
                                                })
                                            }
                                        },
                                    ]
                                })
                            })
                        }
                    } else {
                        this.$emit('shareGroupApprove');
                    }
                }
            },
            closeTip(){
                this.tipShow = false
            },
            shareItem(item){
                console.log(item);
                this.mencheng = 1;
                this.itemData = item
                if(item.province == item.city){
                    this.location = item.province
                }else{
                    this.location = item.province + item.city
                }
                if(item.workingExp){
                    this.workingExp = item.workingExp + "年工作经验，"
                }else{
                    this.workingExp = ""
                }
                if(item.lookingJobEntity!=null||item.lookingJobEntity!=null){
                    if(item.lookingJobEntity.workTypeNames&&item.lookingJobEntity.workTypeNames[0]!=""){
                        this.workTypes = item.lookingJobEntity.workTypeNames.join(",")
                    }else{
                        this.workTypes = ""
                    }
                }else{
                    this.workTypes = ""
                }
            },
            weixinAction(){
                this.mencheng = 0;
                let that = this;
                Wechat.share({
                    message: {
                        title: "专业"+that.workTypes,
                        description: that.location+','+that.workingExp+"专业承接项目工程", // 分享描述
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareWorkerRecruit%3fparams%3d"+that.itemData.id+"_"+that.userId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                        },
                    },
                    scene: Wechat.Scene.SESSION   // share to SESSION
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            pengyouquanAction(){
                this.mencheng = 0;
                let that = this;
                Wechat.share({
                    message: {
                        title: "专业"+that.workTypes,
                        description: that.location+','+that.workingExp+"专业承接项目工程", // 分享描述
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareWorkerRecruit%3fparams%3d"+that.itemData.id+"_"+that.userId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                        },
                    },
                    scene: Wechat.Scene.TIMELINE   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
        },
        mounted(){
            this.userId = LocalCache.get('userInfo').id;
            this.groupId = this.$store.state.roleInfo.groupId;
            this.companyRole = this.$store.state.roleInfo.companyRole;
            console.log('用户id',this.userId);
            console.log("workerList",this.workerList);
        }
    }
</script>

<style scoped>
    .main2{
        margin-bottom: 2rem;
    }
    .main2 .aul li{
        background: #fff; margin-bottom: 0.5rem;
    }
    .main2 .aul li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; background: #F2F7FB; border-bottom: 1px solid #D8E7FE;
        display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.85rem 0 1rem;
    }
    .main2 .aul li .a2-1{
        flex: 1; font-size: 0.75rem; color: #555; font-weight: 700;
    }
    .main2 .aul li .a2-1 > div{
        display: inline-block;
    }
    .main2 .aul li .a2-1 .he{
        height: 14px; line-height: 14px; font-size: 0.4rem; color: #fff; padding: 0 4px; background: #D0C3C0; letter-spacing: 1px; position: relative; top: -3px;
    }
    .main2 .aul li .a2-1 .grouper{
        display: inline-block; width: 30px; height: 14px; line-height: 14px; text-align: center; font-size: 0.4rem; color: #DE9D57; border: 1px solid #DE9D57; transform: translateY(-2px);
    }
    .main2 .aul li .a2-1 img{
        width: 38px; height: 14px; display: inline; transform: translateY(2px);
    }
    .main2 .aul li .a2-2{
        width: 40px; text-align: right;
    }
    .main2 .aul li .a2-2 img{
        width: 1.25rem; height: 1.25rem; display: inline-block; text-align: center; margin-top: 4px;
    }

    .main2 .aul li .cent{
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .main2 .aul li .cent .a3{

    }
    .main2 .aul li .cent .a3 .a3-1{
        width: 100%; height: 26px; line-height: 26px; display: flex; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .main2 .aul li .cent .a3 .a3-1 .left{
        font-size: 0.6rem; color: #999;
    }
    .main2 .aul li .cent .a3 .a3-1 .right{

    }
    .main2 .aul li .cent .a3 .a3-1 .right .u2{
        color: #438CFF;
    }
    .main2 .aul li .cent .a3 .a3-1 .right .u3,.u4{
        background: #EAEAEA; background: #EAEAEA; font-size: 0.5rem; color: #666; padding: 2px; margin-right: 6px;
    }
    .main2 .aul li .cent .a3 .a3-2{
        width: 100%; height: 26px; line-height: 26px; display: flex; justify-content: space-between;
    }
    .main2 .aul li .cent .a3 .a3-2 .left{
    }
    .main2 .aul li .cent .a3 .a3-2 .left .f2{
        font-size: 0.6rem; color: #999;
    }
    .main2 .aul li .cent .a3 .a3-2 .left .f3{
        font-size: 0.8rem; color: #E85050;
    }
    .main2 .aul li .cent .a3 .a3-2 .right{

    }
    .main2 .aul li .cent .a3 .a3-2 .right span{
        box-sizing: border-box; padding: 2px 4px; font-size: 0.55rem; color: #FEFEFE; border-radius: 1px; background: #E89578;
    }
    .main2 .aul li .cent .a3 .a3-2 .left2{
        font-size: 0.6rem;
    }
    .main2 .aul li .cent .a3 .a3-2 .left2 .t2{
        color: #999;
    }
    .main2 .aul li .cent .a3 .a3-2 .left2 .t3{
         display: inline-block; margin-right: 5px; height: 0.85rem; line-height: 0.85rem; box-sizing: border-box; padding: 0 5px; font-size: 0.55rem; color: #666; background: #EEEEEE;
    }
    .main2 .aul li .cent .a3 .a3-2 .right2{
        font-size: 0.6rem;
    }
    .main2 .aul li .cent .a3 .a3-2 .right2 .r2{
        color: #999;
    }
    .main2 .aul li .cent .a3 .a3-2 .right2 .r3{
        color: #666;
    }

    .main2 .aul li .cent .a5{
        display: flex; background: #f8f8f8; box-sizing: border-box; padding: 6px 0;
    }
    .main2 .aul li .cent .a5 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main2 .aul li .cent .a5 .right{
        font-size: 0.55rem; color: #333;
    }
    .main2 .aul li .bom{
        width: 100%;
        height: 1.1rem;
        line-height: 1.1rem;
        font-size: 0.6rem;
        color: #666;
        overflow: hidden;
        padding-bottom: .3rem;
        padding-top: .2rem;
    }
    .main2 .aul li .bom img{
        width: .45rem;
        height: .55rem;display: inline-block;
        vertical-align: middle;
    }
    .main2 .aul li .bom .address{
        width: 80%;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        float: left;
    }
    .main2 .aul li .bom .share{
        float: right;
    }
    .main2 .aul li .bom .share img{
        width: 2.45rem;
        height: 1.1rem;display: inline-block;
    }
    .main2 .fix{
        width: 2.5rem; height: 2.5rem; position: fixed; right: 0; top: 50%;
    }
    .main2 .fix img{
        width: 100%; height: 100%;
    }
    .main2 .fix2{
        width: 95px; height: 30px; line-height: 30px; text-align: center; border-radius: 0.75rem; font-weight: 700;
        background: linear-gradient(to top, #297BE1, #91BFF9);
        position: fixed; left: 36%; bottom: 20px; z-index: 4;
    }
    .main2 .fix2 a{
        display: inline-block; width: 100%; height: 100%; font-size: 0.7rem; color: #fff;
    }
    .imgTip img{
        position: absolute;
        top: -5.5rem;
        left: 50%;
        margin-left: 20px;
    }
    .imgTip .tipMain{
        width: 6.75rem;
    }
    .imgTip .tipClose{
        width: 1rem;
        margin-left: 6.5rem;
        margin-top: 1rem;
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