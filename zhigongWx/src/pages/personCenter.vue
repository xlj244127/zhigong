<template>
    <f7-page name="personCenter" @page:reinit="back">
        <div class="navbar" v-if="isShow==0">
            <div class="navbar-inner">
                <div class="center">个人中心</div>
            </div>
        </div>
        <!--页面主要类容-->
        <loginpage v-if="isShow==12" @changeTate="changeTate" :codem="this.code"></loginpage>
        <div v-else class="content-block">
            <div class="header">
                <div class="left">
                    <span class="l-1">{{this.person.name}}</span><br/>
                    <img class="l-3" v-if="this.person.faced==0" src="../../static/img/noFace.png"/>
                    <img class="l-3" v-else src="../../static/img/haveFace.png"/>
                </div>
                <div class="right"><img :src="person.avatar"/></div>
            </div>
            <div class="main">
                <ul class="aul">
                    <li>
                        <div class="li-1">
                            <img src="../../static/img/icon_account_number.png"/>
                        </div>
                        <div class="li-2">
                            <div class="i-1">个人实名认证</div>
                            <div class="i-2">
                                <a href="/user/idCardIdentification">
                                    <span v-if="this.person.userDetail && this.person.userDetail.idNumber">已认证</span><span v-else>未认证</span>
                                    <img src="../../static/img/btn_more.png"/>
                                </a>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div class="li-1">
                            <img src="../../static/img/icon_phone.png"/>
                        </div>
                        <div class="li-2">
                            <div class="i-1">联系电话</div>
                            <div class="i-2">
                                <a href="/user/changeTel">
                                    <span>{{this.person.mobile}}</span>
                                    <img src="../../static/img/btn_more.png"/>
                                </a>
                            </div>
                        </div>
                    </li>

                    <!--<li>-->
                        <!--<div class="li-1">-->
                            <!--<img src="../../static/img/icon_species.png"/>-->
                        <!--</div>-->
                        <!--<div class="li-2">-->
                            <!--<div class="i-1">工作种类</div>-->
                            <!--<div class="i-2">-->
                                <!--<input class="picker" id="pickerWorkType" readonly>-->
                                <!--<a>-->
                                    <!--<span id="typename">{{this.typename}}</span>-->
                                    <!--<img src="../../static/img/btn_more.png"/>-->
                                <!--</a>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</li>-->

                    <li>
                        <div class="li-1">
                            <img src="../../static/img/icon_workExperience.png"/>
                        </div>
                        <div class="li-2">
                            <div class="i-1">工作经验</div>
                            <div class="i-2">
                                <a href="#" data-popover=".popover-about" class="open-popover">
                                    <span>{{this.workingExp}}年</span>
                                    <img src="../../static/img/btn_more.png"/>
                                </a>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="li-1">
                            <img src="../../static/img/icon_industry.png"/>
                        </div>
                        <div class="li-2">
                            <div class="i-1">所属行业</div>
                            <div class="i-2">
                                <input class="picker" id="pickerProfession" readonly>
                                <a>
                                    <span>建筑业</span>
                                </a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="footer">
                <a href="/user/historyProject/">
                    <span>查看历史项目</span>
                    <img src="../../static/img/btn_more.png"/>
                </a>
            </div>

            <!--更改工种年限-->
            <div class="popover popover-about">
                <div class="popover-angle"></div>
                <div class="popover-inner">
                    <div class="content-block">
                        <div class="popout">
                            <div class="more">
                                <div class="m-1" @click="reduceAction">
                                    <img src="../../static/img/jianBlue.png"/>
                                </div>
                                <div class="m-2">1</div>
                                <div class="m-1" @click="addAction">
                                    <img src="../../static/img/jiaBlue.png"/>
                                </div>
                            </div>
                            <div class="bott">
                                <div class="bo bo-1" @click="cancelAction">取消</div><div class="bo bo-2" @click="editYear">提交</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script>
    var $$ = Dom7;
    import { userApi, dviApi, wxApi, tabulateStatisticsApi} from '../api'
    import { LocalCache } from '../lib/utils'
    import loginpage from '../components/login.vue';
    export default {
        data(){
            return{
                isShow: '',
                identityType: '',
                person: {},
                code: '',
                config: {},
                url: '',
                workerTitle: [],
                typecode: '',
                typename: '',
                workingExp: ''

            }
        },
        components: {
            loginpage
        },
        methods:{
            back(){
                console.log('页面回调');
                userApi.detail().then((result)=>{
                    this.person.name = result.data.name;
                    this.person.userDetail = result.data.userDetail;
                    this.person.userDetail.idNumber = result.data.userDetail.idNumber;
                })
            },
            changeTate(param){
                console.log('子组件传值过来了', param);
                this.isShow = 0;
                this.person = param;
                this.typecode = param.workType;
                this.identityType = param.identityType;
                this.workingExp = param.workingExp;
                this.$store.state.mobile = param.mobile;
                console.log('手机号码', this.$store.state.mobile);
                this.$store.state.userInfo = param;
                LocalCache.set('userInfo', param);
                LocalCache.set('sessionkey', param.wxSessionkey);

                this.enterPage();
            },
            editYear(){
                this.$f7.closeModal('.popover-about');
                wxApi.editYear($$('.m-2').text()).then((result)=>{
                    console.log(result.data);
                    this.workingExp = $$('.m-2').text();
                })
            },
            cancelAction(){
                this.$f7.closeModal('.popover-about');
            },
            reduceAction(){
                let sum = $$('.m-2').text();
                if(sum==1){

                }else{
                    sum--
                }
                $$('.m-2').text(sum);
            },
            addAction(){
                let sum = $$('.m-2').text();
                sum++
                $$('.m-2').text(sum);
            },
            enterPage(){
                wxApi.getConfig(false, this.url).then((result)=>{
                    console.log('config', result);
                    this.config = JSON.parse(result.data);
                    console.log('签名',this.config);

                    wx.config(
                        // this.config
                        {
                            debug: false,
                            appId: this.config.appId,
                            timestamp: this.config.timestamp,
                            nonceStr: this.config.nonceStr,
                            signature: this.config.signature,
                            jsApiList: [
                                'chooseImage',
                                'uploadImage'
                            ]
                        }
                    );
                })

                tabulateStatisticsApi.typeSort('workType').then((result)=> {
                    this.workerTitle = result.data.list;
                    console.log(this.workerTitle);
                    if(this.typename==''){
                        for (var i = 0; i < this.workerTitle.length; i++) {
                            if (this.workerTitle[i].code == this.typecode) {
                                console.log('根据工种id获取工种名字',this.typecode,this.workerTitle[i].value);
                                $$('#typename').text(this.workerTitle[i].value);
                            } else {
                                this.typename = '去完善';
                            }
                        }
                    }

                    this.$f7.picker({
                        input: '#pickerWorkType',
                        toolbarCloseText: '选择',
                        onClose(p){
                            let code = p.cols[0].value;
                            let workType = p.cols[0].displayValue;
                            console.log('工种id',p.cols[0].value+workType);
                            if(workType != this.typename) {
                                var that = this;
                                userApi.changeWorkType(code).then((res)=>{
                                    that.typename = workType;
                                    $$('#typename').text(workType);
                                    console.log('工种',that.typename);
                                    let userInfo = LocalCache.get('userInfo');
                                    userInfo.workType = code;
                                    LocalCache.set('userInfo', userInfo);
                                    that.$store.state.userInfo = res.data;
                                });
                            }
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values:  this.workerTitle.map((workType)=>{return workType.code;}),
                                displayValues:  this.workerTitle.map((workType)=>{return workType.value;}),
                            }
                        ]
                    });

                })
            }
        },
        mounted(){
            var query3 = window.location.href;
            console.log(query3);
            this.url = query3.split('#')[0]
            console.log(this.url);

            var query = $$.parseUrlQuery(window.location.href);
            console.log(query);
            this.code = query.code;
            console.log(this.code);

            wxApi.judgeBindWx(this.code).then(
                (result)=>{
                    this.isShow = 0;
                    console.log('传了code', result.data);
                    this.person = result.data;
                    this.typecode = result.data.workType;
                    this.identityType = result.data.identityType;
                    this.workingExp = result.data.workingExp;
                    this.$store.state.mobile = result.data.mobile;
                    console.log('手机号码', this.$store.state.mobile);
                    this.$store.state.userInfo = result.data;
                    LocalCache.set('userInfo', result.data);
                    LocalCache.set('sessionkey', result.data.wxSessionkey);
                    console.log('loginResult:' + JSON.stringify(result));

                    this.enterPage();
                },
                (error)=>{
                    if(error.code==12){
                        this.isShow = 12;
                        console.log('错误代码12');
                    }else{
                        this.$f7.alert('登陆失败');
                    }
                }
            )
        }
    }
</script>

<style scoped>
    .page-on-left{
        transform: translate3d(0,0,0);  -webkit-transform: translate3d(0,0,0);
    }
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
    .content-block .header .left .l-3{
        display: inline; width: 3.25rem; height: 0.75rem;
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

    .content-block .popout{
        height: 120px;
    }
    .content-block .popout .more{
        display: flex; justify-content: center; font-size: 0.8rem; color: #666; margin-top: 1.5rem;
    }
    .content-block .popout .more .m-1{
        width: 2.5rem; height: 2rem; box-sizing: border-box; text-align: center;
    }
    .content-block .popout .more .m-1 img{
        width: 1.5rem; height: 1.5rem; display: inline;
    }
    .content-block .popout .more .m-2{
        width: 2.5rem; height: 1rem; line-height: 1rem; text-align: center; border: 1px solid #E7E7E7; border-radius: 0.1rem; margin-top: 0.2rem;
    }
    .content-block .popout .bott{
        display: flex; justify-content: space-around; box-sizing: border-box; padding: 0 2rem; margin-top: 1rem;
    }
    .content-block .popout .bott .bo{
        width: 3rem; height: 1.4rem; text-align: center; line-height: 1.4rem; font-size: 0.6rem; color: #fff; border-radius: 8rem;
    }
    .content-block .popout .bott .bo-1{
        background: #999999;
    }
    .content-block .popout .bott .bo-2{
        background: #438CFF;
    }
</style>