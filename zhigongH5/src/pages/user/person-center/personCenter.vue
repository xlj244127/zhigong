<template>
    <f7-page name="personCenter" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../static/img/cebianlan_icom.png" />
                    </a>
                </div>
                <div class="center">个人中心</div>
                <div class="right">
                    <a href="/user/QR-code/" class="link"><img class="left" src="../../../../static/img/img_qr_code.png" /></a>
                </div>
            </div>
        </div>
        <!---侧边栏--->
        <group-nav></group-nav>
        <!--页面主要类容-->
        <div class="content-block">
                <div class="header">
                    <div class="left">
                        <span class="l-1">{{userName}}</span><br/>
                        <span class="l-2" v-if="userFaced">已采集面部信息</span>
                        <span class="l-3" v-else>未采集面部信息</span>
                    </div>
                    <div class="right"><img :src="userAvatar"/></div>
                </div>
                <div class="main">
                    <ul class="aul">
                        <li>
                            <div class="li-1">
                                <img src="../../../../static/img/icon_account_number.png"/>
                            </div>
                            <div class="li-2">
                                <div class="i-1">个人实名认证</div>
                                <div class="i-2">
                                    <a href="/company/addIdentityCard">
                                        <span v-if="userIdNumber">已认证</span><span v-else>未认证</span>
                                        <img src="../../../../static/img/btn_more.png"/>
                                    </a>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div class="li-1">
                                <img src="../../../../static/img/icon_phone.png"/>
                            </div>
                            <div class="li-2">
                                <div class="i-1">联系电话</div>
                                <div class="i-2">
                                    <a href="/user/changeTel">
                                        <span v-if="userMobile">{{userMobile}}</span><span v-else>未认证</span>
                                        <img src="../../../../static/img/btn_more.png"/>
                                    </a>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div class="li-1">
                                <img src="../../../../static/img/icon_industry.png"/>
                            </div>
                            <div class="li-2">
                                <div class="i-1">所属行业</div>
                                <div class="i-2">
                                    <input class="picker" id="pickerProfession" readonly>
                                    <a>
                                        <span v-if="userProfession">{{userProfession}}</span><span v-else>去完善</span>
                                        <img src="../../../../static/img/btn_more.png"/>
                                    </a>
                                </div>
                            </div>
                        </li>

                        <!--<li>-->
                            <!--<div class="li-1">-->
                                <!--<img src="../../../../static/img/icon_species.png"/>-->
                            <!--</div>-->
                            <!--<div class="li-2">-->
                                <!--<div class="i-1">工作种类</div>-->
                                <!--<div class="i-2">-->
                                    <!--<input class="picker" id="pickerWorkType" readonly>-->
                                    <!--<a>-->
                                        <!--<span v-if="userWorkType">{{userWorkType}}</span><span v-else>去完善</span>-->
                                        <!--<img src="../../../../static/img/btn_more.png"/>-->
                                    <!--</a>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</li>-->

                        <li>
                            <div class="li-1">
                                <img src="../../../../static/img/icon_wechat.png"/>
                            </div>
                            <div class="li-2">
                                <div class="i-1">微信账号</div>
                                <div class="i-2">
                                    <a>
                                        <span v-if="userWxOpenId">{{userNickName}}</span><span @click="bindWechat" v-else>去绑定</span>
                                        <img src="../../../../static/img/btn_more.png"/>
                                    </a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="footer">
                    <a href="/user/historyProject/">
                        <span>查看历史项目</span>
                        <img src="../../../../static/img/btn_more.png"/>
                    </a>
                </div>
            </div>
    </f7-page>
</template>

<script>
    var $$ = Dom7;
    import { userApi, dviApi } from '../../../api'
    import { LocalCache } from '../../../lib/utils'
    import groupNav from '../../../components/broadside-navigation/group'
    import staffNav from '../../../components/broadside-navigation/staff'

    export default {
        data(){
            return{
                userName: '',
                userNickName: '',
                userFaced: 0,
                userAvatar: '',
                userMobile: '',
                userIdNumber: '',
                userProfession: '',
                userWorkType: '',
                userWxOpenId: '',
                groupId: 0,
            }
        },
        components: {
            groupNav, staffNav
        },
        methods:{
            getUserDisplayName(userInfo) {
                if(userInfo.name)
                    return userInfo.name;
                else if(userInfo.wxOpenid)
                    return userInfo.wxOpenid;
                else
                    return userInfo.mobile;
            },
            bindWechat() {
                let that = this;
                if (window.Wechat) {
                    Wechat.auth('snsapi_userinfo', 'userinfo', function (response) {
                        console.log('Weixin response:' + JSON.stringify(response));
                        userApi.bindWx(response.code).then((result) => {
                            console.log('loginResult:' + JSON.stringify(result));
                            LocalCache.set('userInfo', result.data);
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
            },
            back() {
                console.log('Back.....');
                this.initPage(this);
                this.userMobile = this.$store.state.userInfo.mobile;
            },
            async initPage(that) {
                if(!that.$store.state.userDetail) {
                    let result = await userApi.detail();
                    that.$store.state.userDetail = result.data.userDetail;
                    that.userIdNumber = userDetail.idNumber;
                    console.log('Get userDetail.');
                }
                else
                    that.userIdNumber = that.$store.state.userDetail.idNumber;

                let professions;
                if(!that.$store.state.professions) {
                    professions = await dviApi.getProfessions();
                    professions = professions.data.list.reverse();
                    that.$store.state.professions = professions;
                }
                else
                    professions = that.$store.state.professions;
                let prof = professions.find(prof=>prof.code == that.$store.state.userInfo.profession);
                if (prof)
                    that.userProfession = prof.value;

                let workTypes;
                if(!that.$store.state.workTypes) {
                    workTypes = await dviApi.getWorkTypes();
                    workTypes = workTypes.data.list.reverse();
                    that.$store.state.workTypes = workTypes;
                }
                else
                    workTypes = that.$store.state.workTypes;
                let workType = workTypes.find(workTypes=>workTypes.code == that.$store.state.userInfo.workType);
                if (workType)
                    that.userWorkType = workType.value;
                that.$f7.picker({
                    input: '#pickerProfession',
                    toolbarCloseText: '选择',
                    onClose(p){
                        let index = p.cols[0].activeIndex;
                        let profession = p.cols[0].displayValues[index];
                        if(profession != that.userProfession) {
                            userApi.changeProfession(p.cols[0].values[index]).then(()=>{
                                let userInfo = LocalCache.get('userInfo');
                                userInfo.profession = p.cols[0].values[index];
                                that.$store.state.userInfo.profession = userInfo.profession;
                                LocalCache.set('userInfo', userInfo);
                                that.userProfession = profession;
                            });
                        }
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: professions.map((prof)=>{return prof.code;}),
                            displayValues: professions.map((prof)=>{return prof.value;}),
                        }
                    ]
                });
                that.$f7.picker({
                    input: '#pickerWorkType',
                    toolbarCloseText: '选择',
                    onClose(p){
                        let index = p.cols[0].activeIndex;
                        let workType = p.cols[0].displayValues[index];
                        if(workType != that.userWorkType) {
                            userApi.changeWorkType(p.cols[0].values[index]).then(()=>{
                                let userInfo = LocalCache.get('userInfo');
                                userInfo.workType = p.cols[0].values[index];
                                that.$store.state.userInfo.workType = userInfo.workType;
                                LocalCache.set('userInfo', userInfo);
                                that.userWorkType = workType;
                            });
                        }
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: workTypes.map((workType)=>{return workType.code;}),
                            displayValues: workTypes.map((workType)=>{return workType.value;}),
                        }
                    ]
                });
            }
        },
        created(){

        },
        mounted() {
            this.userName = this.getUserDisplayName(this.$store.state.userInfo);
            this.userFaced = this.$store.state.userInfo.faced;
            this.userAvatar = this.$store.state.userInfo.avatar;
            this.userMobile = this.$store.state.userInfo.mobile;
            this.userNickName = this.$store.state.userInfo.nickName;
            this.userWxOpenId = this.$store.state.userInfo.wxOpenid;
            this.groupId = this.$store.state.roleInfo.groupId;
            console.log('userInfo',this.$store.state.userInfo);
            this.initPage(this);
        }
    }
</script>

<style scoped>
    .navbar .right .link img{
        width: 1rem; height: 1rem;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .navbar{
        background: #fff;
    }
    .navbar .left img{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .right img{
        width: 1.5rem; height: 1.5rem;
    }
    .content-block{
        width: 100%; margin-top:0.5rem;
    }
    .content-block .header{
        display: flex;
    }
    .content-block .header, .main{
        width: 100%;  background: #fff; justify-content: space-between;   box-sizing: border-box; padding: 0 0.6rem;
    }
    .content-block .header .left .l-1{
        font-size: 1.5rem; color: #333;
    }
    .content-block .header .left .l-2{
        font-size: 0.6rem; color: #438cff;
    }
    .content-block .header .left .l-3{
        font-size: 0.6rem; color: #ef7373;
    }
    .content-block .header .right img{
        width: 3.2rem; height: 3.2rem;
    }
    .content-block .main{
        margin-top: 0.5rem;
    }
    .content-block .main .aul{
        padding: 0;
    }
    .content-block .main .aul li{
        display: block; width: 100%; height: 2.5rem;
        overflow: hidden;
    }
    .content-block .main .aul li .li-1{
        width: 8%;
        float: left;
    }
    .content-block .main .aul li .li-1 img{
        width: 0.9rem; height: 0.9rem; margin-top: 0.75rem;
    }
    .content-block .main .aul li .li-2{
        width: 92%; height: 2.45rem; border-bottom: 1px solid #f4f4f4; line-height: 2.5rem; display: flex; justify-content: space-between;
        font-size: 0.7rem;
        float: left;
    }
    .content-block .main .aul li .li-2 .i-1{
        color: #666;
    }
    .content-block .main .aul li .li-2 .i-2{
        position: relative; box-sizing: border-box; padding-right: 1rem; color: #ccc;
    }

    .content-block .main .aul li .li-2 .i-2 img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.8rem;
    }
    .content-block .footer{
        width: 100%; height: 2.5rem; background: #fff; position: relative; line-height: 2.5rem;
        padding-left: 0.6rem; box-sizing: border-box; margin-top: 0.5rem;
    }
    .content-block .footer a{
        width: 100%; height: 100%; display: block; font-size: 0.7rem; color: #666;
    }
    .content-block .footer a img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.6rem; top: 0.8rem;
    }
    .picker {
        position: absolute;  left: 0;  right: 0;  top: 0;  bottom: 0; opacity: 0;
    }

</style>