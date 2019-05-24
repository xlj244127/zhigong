<template>
    <div>
        <div class="main">
            <ul class="aul2">
                <li v-for="(item, index) in projList">
                    <div class="sit">
                        <div class="ent">
                            <img class="st" src="../../../static/img/wendan.png"/>
                            <div class="st2">
                                <div class="skew">
                                    <div class="skew-main" v-if="item.batchNumber">{{item.workDemandList[0].title?item.workDemandList[0].title:item.city.name+'招'+item.workDemandList[0].workTypeName}}</div>
                                    <div class="skew-main" v-if="!item.batchNumber">该项目暂无用工需求</div>
                                </div>
                            </div>
                            <img class="st3" v-if="item.batchNumber" src="../../../static/img/shibianxin_icom.png"/>
                        </div>
                        <div class="int" @click="contactProj(index, item)">
                            <img src="../../../static/img/phone_icom.png"/>
                        </div>
                    </div>
                    <div class="tov">
                        <div class="shan">
                            <img class="one" src="../../../static/img/projrenzhen.png"/>
                            <img class="two" src="../../../static/img/projzhizhao.png"/>
                            <span class="three" v-if="item.batchNumber&&item.workDemandList[0].cost != null">工程造价{{item.workDemandList[0].cost}}万</span>
                        </div>
                        <div class="xia">
                            <span>{{item.project.name}}</span>
                            <img src="../../../static/img/btn_drop_down.png"/>
                        </div>
                    </div>
                    <div class="single" v-if="item.batchNumber">
                        <div class="up">
                            <div class="left">
                                <img src="../../../static/img/recruit_time_worker.png" v-if="item.workDemandList[0].demandType==1"/>
                                <img src="../../../static/img/recruit_contractor.png" v-else-if="item.workDemandList[0].demandType==2"/>
                                <img src="../../../static/img/recruit_group.png" v-else-if="item.workDemandList[0].demandType==3"/>
                                <img src="../../../static/img/recruit_worker.png" v-else-if="item.workDemandList[0].demandType==4"/>
                                <img src="../../../static/img/zhaogong.png" v-else/>
                                <span>{{item.workDemandList[0].workTypeName}}</span>
                            </div>
                            <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{item.workDemandList[0].demandAmount}}</span>人</div>
                            <div class="left3"><span>{{item.workDemandList[0].salary}}{{item.workDemandList[0].salaryLabel}}</span></div>
                        </div>
                        <div class="cent">
                            <div class="left">
                                <span v-show="item.workDemandList[0].treatmentsName!=''" v-for="one in item.workDemandList[0].treatmentsName.split(',')">{{one}}</span>
                                <span v-show="item.workDemandList[0].tlementName">{{item.workDemandList[0].tlementName}}</span>
                            </div>
                            <div class="right">时间 <span>|</span> {{item.workDemandList[0].demandTime}}</div>
                        </div>
                        <div class="cent2">
                            <div class="left">材料 <span>|</span> {{toNull(item.workDemandList[0].materialReqName)}}</div>
                            <div class="right">设备 <span>|</span> {{toNull(item.workDemandList[0].deviceReqName)}}</div>
                        </div>
                        <div class="cent3" v-show="item.workDemandList[0].remark!=''">
                            <img src="../../../static/img/tonggao.png"/>
                            <div class="right">{{item.workDemandList[0].remark}}</div>
                        </div>
                        <div class="down">
                            <div class="left">
                                发布日期 : {{item.workDemandList[0].createTime}}
                            </div>
                            <div class="right">
                                <img src="../../../static/img/dingwei_icom.png"/>
                                <span>{{item.project.location}}</span>
                            </div>
                        </div>
                        <div class="share" @click="shareItem(item)">
                            <img src="../../../static/img/search_share.png" alt="">
                        </div>
                    </div>
                    <div class="single" v-if="!item.batchNumber">
                        <div class="down">
                            <div class="right">
                                <img src="../../../static/img/dingwei_icom.png"/>
                                <span>{{item.project.location}}</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <div class="fix" @click="searchProj"><a href="#"><img src="../../../static/img/grouppubilc2_icom.png"/></a></div>
            <div class="fix2">
                <a @click="pubilcFreeGroup" href="#"><span>+</span>&nbsp;发布班组</a>
                <div class="imgTip" v-if="tipShow">
                    <img src="../../../static/img/search_tip_1.png" alt="" class="tipMain">
                    <img src="../../../static/img/search_tip_close.png" alt="" @click="closeTip()" class="tipClose">
                </div>
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

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import {userApi, wxApi} from "../../api";
    import { LocalCache } from '../../lib/utils';
    import phone_icon from '../../../static/img/phone_icon.png';
    import moment from 'moment'
    import { shareAppid,shareServer } from "../../config";
    export default {
        name: "searchProj",
        data(){
            return{
                page: 1,
                pageSize: 5,
                totalPages: '',
                totalItems: '',
                provinceId: '',
                cityId: '',
                typecode: '',
                time: '',
                projList: [],
                userId: '',
                groupId: '',
                mobile: '',
                tipShow:true,
                companyRole: '',
                mencheng:'',
                itemData:{}
            }
        },
        props: ['projList', 'number'],
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
            shareItem(item){
                console.log(item);
                this.mencheng = 1;
                this.itemData = item
            },
            weixinAction(){
                this.mencheng = 0;
                let that = this
                Wechat.share({
                    message: {
                        title: that.itemData.workDemandList[0].title,
                        description: that.itemData.project.name+'项目招'+that.itemData.workDemandList[0].workTypeName+that.itemData.workDemandList[0].demandAmount+'人,'+that.itemData.workDemandList[0].treatmentsName, // 分享描述
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.SESSION,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareProjRecruit%3fparams%3d"+that.userId+"_"+that.itemData.batchNumber+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                            //webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareProjRecruit%3fparams%3d"+this.userId+"_"+encodeURIComponent(that.itemData.batchNumber)+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
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
                let that = this
                Wechat.share({
                    message: {
                        title: that.itemData.workDemandList[0].title,
                        description: that.itemData.project.name+'项目招'+that.itemData.workDemandList[0].workTypeName+that.itemData.workDemandList[0].demandAmount+'人,'+that.itemData.workDemandList[0].treatmentsName, // 分享描述
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareProjRecruit%3fparams%3d"+this.userId+"_"+that.itemData.batchNumber+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                            //webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareProjRecruit%3fparams%3d"+this.userId+"_"+encodeURIComponent(that.itemData.batchNumber)+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                        },
                    },
                    scene: Wechat.Scene.TIMELINE   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            toNull(val){
              if(val==""||val==undefined || val==null){
                  return "--"
              }  else {
                  return val
              }
            },
            searchProj(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    this.$router.load({url: '/user/searchProj'})
                }
            },
            pubilcFreeGroup(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    this.$router.load({url: '/user/pubilcFreeGroup'})
                }
            },
            contactProj(index, item){
                this.groupId = this.$store.state.roleInfo.groupId;
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else {
                    if (this.groupId != 0) {
                        let batch = $$('.a4 .left').eq(index).data('id');
                        if (!item.batchNumber) {
                            this.$f7.alert('该项目暂无用工需求，请查询其他项目');
                        } else {
                            if (this.number == 0) {
                                this.$f7.alert('用户联系次数已用完，邀请好友增加联系次数');
                            } else {
                                if (item.send == true) {
                                    this.$f7.alert('已发送过申请，请到发送历史页面查看');
                                } else {
                                    wxApi.getUserMobile(item.createUser).then((res) => {
                                        //console.log('个人详情',res.data);
                                        this.mobile = res.data;
                                        let hideMobile = this.mobile.substr(0, 3) + '****' + this.mobile.substr(7);
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
                                                    text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:' + this.mobile + '" class="external">' + "拨号" + '</a>',
                                                    onClick: () => {
                                                        //console.log('我点击了拨号');
                                                        wxApi.groupApplyFor(item.batchNumber).then((result) => {
                                                            //console.log(result.data);
                                                            if (item.batchNumber = batch) {
                                                                item.send = true;
                                                            }
                                                        })
                                                        wxApi.subOneTimes(this.userId).then((result) => {
                                                            this.number = result.data.times;
                                                            //console.log('次数', result.data);
                                                            this.$emit('childComponents', this.number);
                                                        })
                                                    }
                                                },
                                            ]
                                        })
                                    })
                                }
                            }
                        }
                    } else {
                        this.$emit('shareGroupApprove');
                    }
                }
            },
            closeTip(){
                this.tipShow = false
            }
        },
        mounted(){
            this.userId = LocalCache.get('userInfo').id;
            this.groupId = this.$store.state.roleInfo.groupId;
            this.companyRole = this.$store.state.roleInfo.companyRole;
            wxApi.demandType().then((res=>{
                console.log("demandType",res.data);
            }))
            //console.log('班组id',this.groupId);
        }
    }
</script>

<style scoped>
    .main .aul2 li{
        background: #fff; margin-bottom: 0.5rem;
    }
    .main .aul2 li .sit{
        width: 100%; height: 35px; background: #fff; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .sit .ent{
        flex: 1; text-align: center;
    }
    .main .aul2 li .sit .int{
        width: 34px; text-align: right;
    }
    .main .aul2 li .sit .int img{
        width: 1.25rem; height: 1.25rem; margin-top: 7px;
    }
    .main .aul2 li .sit .ent .st{
        width: 1rem; height: 1rem; display: inline-block; margin-top: 6px; transform: translateX(5px);
    }
    .main .aul2 li .sit .ent .st2{
        color: #fff; display: inline-block; transform: translateY(-8px); position: relative; z-index: 2;
    }
    .main .aul2 li .sit .ent .st2 .skew{
        height: 22px; background: #9FC6FC; font-size: 0.65rem; color: #123f65; font-weight: 700; letter-spacing: 1px; transform: skew(-15deg);
    }
    .main .aul2 li .sit .ent .st2 .skew .skew-main{
        transform: skew(15deg); padding: 0 7px; transform: translateY(4px);
    }
    .main .aul2 li .sit .ent .st3{
        width: 1.7rem; height: 1.4rem; display: inline-block; transform: translateX(-26px); position: relative; top: 2px;
    }
    .main .aul2 li .tov{
        width: 100%; height: 1.9rem; background: #F6FAFD; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .tov .shan{
        display: flex;
    }
    .main .aul2 li .tov .shan .one{
        width: 2.85rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
    }
    .main .aul2 li .tov .shan .two{
        width: 2.55rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
    }
    .main .aul2 li .tov .shan .three{
        height: 0.65rem; display: inline-block; box-sizing: border-box; padding: 0 0.2rem; border: 1px solid #8E9223; border-radius: 1px; font-size: 0.4rem; color: #8E9223;
    }
    .main .aul2 li .tov .xia{
        width: 100%; font-size: 0.65rem; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 5px;
    }
    .main .aul2 li .tov .xia img{
        width: 0.6rem; height: 0.6rem; display: inline-block; transform: translateY(2px);
    }
    .main .aul2 li .single{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
    }
    .main .aul2 li .single .up{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul2 li .single .up .left{
        display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
    }
    .main .aul2 li .single .up .left img{
        height: 0.75rem; display: inline-block; transform: translateY(2px);
    }
    .main .aul2 li .single .up .left2{
        font-size: 0.6rem; color: #666666;
    }
    .main .aul2 li .single .up .left2 .f-2{
        color: #ccc;
    }
    .main .aul2 li .single .up .left2 .f-3{
        color: #F13333; font-size: 0.75rem;
    }
    .main .aul2 li .single .up .left3 span{
        box-sizing: border-box; padding: 3px 4px; background: #F05A5A; border-radius: 1px; font-size: 0.6rem; color: #fff;
    }
    .main .aul2 li .single .cent{
        width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
    }
    .main .aul2 li .single .cent .left span{
        display: inline-block; height: 0.8rem; line-height: 0.8rem; box-sizing: border-box; padding: 0 6px; background: #EEEEEE;
        font-size: 0.55rem; color: #666; margin-right: 5px;
    }
    .main .aul2 li .single .cent .right{
        font-size: 0.6rem; color: #666;
    }
    .main .aul2 li .single .cent .right span{
        color: #ccc;
    }
    .main .aul2 li .single .cent2{
        width: 100%; height: 30px; line-height: 30px;justify-content: space-between; font-size: 0.6rem; color: #666;
        overflow: hidden;
    }
    .main .aul2 li .single .cent2 .left span, .right span{
        color: #ccc;
    }
    .main .aul2 li .single .cent2 .left,.main .aul2 li .single .cent2 right{
        width: 50%; float: left;
    }
    .main .aul2 li .single .cent3{
        display: flex; background: #f4f8fd; box-sizing: border-box; padding: 6px 0;
    }
    .main .aul2 li .single .cent3 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main .aul2 li .single .cent3 .right{
        font-size: 0.55rem; color: #333;
    }

    .main .aul2 li .single .down{
        width: 100%; height: 1.2rem; line-height: 1.2rem; display: flex; justify-content: space-between;
    }
    .main .aul2 li .single .down .left{
        display: flex; font-size: 0.6rem; color: #999;
    }
    .main .aul2 li .single .down .right span{
        font-size: 0.55rem; color: #888;
    }
    .main .aul2 li .single .down .right img{
        width: 0.5rem; height: 0.6rem; display: inline-block; transform: translateY(3px);
    }

    .main .fix{
        width: 2.5rem; height: 2.5rem; position: fixed; right: 0; top: 50%;
    }
    .main .fix img{
        width: 100%; height: 100%;
    }
    .main .fix2{
        width: 95px; height: 30px; line-height: 30px; text-align: center; border-radius: 0.75rem; font-weight: 700;
        background: linear-gradient(to top, #297BE1, #91BFF9);
        position: fixed; left: 36%; bottom: 20px; z-index: 4;
    }
    .main .fix2 a{
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
    .single .share{
        height: 1.1rem;
        text-align: right;
        padding-top: .2rem;
        border-top: 1px solid #ddd;
    }
    .single .share img{
        height: 1.1rem;
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