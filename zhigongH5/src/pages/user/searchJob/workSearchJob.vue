<template>
    <div data-page="workSearchJob" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../static/img/cebianlan_icom.png" />
                    </a>
                </div>
                <div class="center">找活干</div>
            </div>
        </div>
        <!---侧边栏--->
        <staff-nav></staff-nav>
        <div class="page-content infinite-scroll">
            <div class="head">
                <ul class="aul">
                    <li>
                        <div class="hd">
                            <input class="picker" id="picker-toolbarseven" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="addressAction">
                            <span class="h-1 h3">选择城市</span>
                            <img class="h-2" src="../../../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                    <li>
                        <div class="hd">
                            <input class="picker" id="picker-deviceeight" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="selectTypeAction">
                            <span class="h-1 h4">选择工种</span>
                            <img class="h-2" src="../../../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                    <li>
                        <div class="hd">
                            <input class="picker" id="calendar-defaultnine" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="selectTimeAction">
                            <span class="h-1 h5">选择日期</span>
                            <img class="h-2" src="../../../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="title">
                <div class="left">
                    <div class="top">
                        <img class="t-1" src="../../../../static/img/laba_icom.png"/>
                        <span class="t-2">可获取联系方式<i>{{this.number}}</i>次</span>
                    </div>
                    <div class="bot">
                        每天默认可联系1次，邀请工友可增加联系次数
                    </div>
                </div>
                <div class="right">
                    <a href="/user/contactRecord/">查看联系记录</a>
                </div>
            </div>
            <div class="main">
                <ul class="aul2">
                    <li v-for="item in workerList">
                        <div class="a"><span>{{item.workGroup.displayName}}</span><img v-show="item.workGroup.user.userDetail.idNumber" src="../../../../static/img/person_certified.png"/></div>
                        <div class="a2">
                            <span class="a2-1">{{item.workType}}</span>
                            <span class="a2-2" v-if="item.salaryType==1">{{item.salary}}元/天</span>
                            <span class="a2-2" v-if="item.salaryType==2">{{item.salary}}元/小时</span>
                            <span class="a2-2" v-if="item.salaryType==3">面议</span>
                        </div>
                        <div class="a3">
                            <ul class="aul3">
                                <li>
                                    <div class="u-2">需求人数:</div> <div class="u-3">{{item.demandAmount}}人</div>
                                </li>
                                <li>
                                    <div class="u-2">用工时间:</div> <div class="u-3">{{item.demandTime}}起</div>
                                </li>
                                <li>
                                    <div class="u-2">用工地点:</div> <div class="u-3">{{item.province.name}}{{item.city.name}}</div>
                                </li>
                                <li>
                                    <div class="u-2">其他说明:</div> <div class="u-3">{{item.remark}}</div>
                                </li>
                            </ul>
                        </div>
                        <div class="a4">
                            <div class="left" @click="contactGrouper(item)" :data-id="item.id" :class="{active: item.send==true}">联系</div>
                            <div class="right"><a href="#" data-popover=".popover-about" class="open-popover">邀请工友</a></div>
                        </div>
                    </li>
                </ul>
                <div v-show="workerList.length==this.totalItems || workerList.length<5" class="word" @click="allWordAction">已无更多信息，点击查看全国信息</div>
            </div>

            <!--微信分享-->
            <div class="popover popover-about">
                <div class="popover-angle"></div>
                <div class="popover-inner">
                    <div class="content-block">
                        <div class="popout">
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
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import {userApi, tabulateStatisticsApi, wxApi, projectApi} from "../../../api";
    import { LocalCache } from '../../../lib/utils';
    import {shareServer, shareAppid} from "../../../config";
    import moment from 'moment';
    import staffNav from '../../../components/broadside-navigation/staff'
    var pickerAddress;
    var pickerDevice;
    var calendarInline;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    import phone_icon from '../../../../static/img/phone_icon.png';
    var cityShow;
    export default {
        data(){
            return{
                code: '',
                userId: '',
                isAdmin: false,
                typecode: 0,
                workerTitle: [],
                time: '',
                workerList: [],
                number: '',                 //能联系的次数
                mobile: '',
                page: 1,
                pageSize: 5,
                totalPages: '',
                totalItems: '',

                proviceList: [],            //以下都是调省市区插件的参数
                proviceIdList: [],
                cityList: [],
                provinceId: '',
                cityIdList: [''],
                cityNameList: [''],
                cityId: '',
                localAddress: {}             //省市区的地址全放里面存缓存里
            }
        },
        components:{
            staffNav
        },
        methods: {
            addressAction(){
                console.log('我点击了');
                pickerAddress.open();
            },
            selectTypeAction(){
                console.log('我点击了');
                pickerDevice.open();
            },
            selectTimeAction(){
                console.log('我点击了');
                calendarInline.open();
            },
            hiddenAction(){
                console.log('我点le');
                this.$f7.closeModal('.popover');
            },
            weixinAction(){
                this.$f7.closeModal('.popover');
                Wechat.share({
                    message: {
                        title: "建筑装修找活干，找工人，用智工通",
                        description: "加入智工通，建筑专业用工平台，找项目找工人更方便",
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "徐",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareAllData?inviterId="+this.userId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
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
                this.$f7.closeModal('.popover');
                Wechat.share({
                    message: {
                        title: "建筑装修找活干，找工人，用智工通",
                        description: "加入智工通，建筑专业用工平台，找项目找工人更方便",
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "徐",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareAllData?inviterId="+this.userId+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                        },
                    },
                    scene: Wechat.Scene.TIMELINE   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            contactGrouper(item){
                if (this.number == 0) {
                    this.$f7.alert('您的联系次数已用完，邀请工友获得联系次数');
                } else {
                    if (item.send == true) {
                        this.$f7.alert('您已联系过该班组，可以到联系记录页面查看');
                    } else {
                        wxApi.getGrouperPhone(item.workGroupId).then((result) => {
                            this.mobile = result.data;
                            let hideMobile = this.mobile.substr(0,3)+'****'+this.mobile.substr(7);
                            console.log(result.data);
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
                                        text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:'+this.mobile+'" class="link external">' + "拨号" + '</a>',
                                        onClick: ()=>{
                                            wxApi.workerApplyFor(item.id).then((result) => {
                                                console.log(result.data);
                                                item.send = true;
                                                wxApi.subOneTimes(this.userId).then((result) => {
                                                    this.number = result.data.times;
                                                    console.log('次数', result.data);
                                                })
                                            })
                                        }
                                    },
                                ]
                            })
                        })
                    }
                }
            },
            getWorkerList(){
                this.page = 1;
                wxApi.workerFindwork(
                    this.page,
                    this.pageSize,
                    this.provinceId,
                    this.cityId,
                    this.typecode,
                    this.time
                ).then((result)=>{
                    this.workerList = result.data.list;
                    this.totalPages = result.data.totalPages;
                    this.totalItems = result.data.totalItems;
                    console.log(result.data.list);
                    for(var i=0; i<this.workerList.length; i++){
                        for(var j=0; j<this.workerTitle.length; j++){
                            if(this.workerList[i].workType == this.workerTitle[j].code){
                                this.workerList[i].workType = this.workerTitle[j].value;
                            }
                        }
                    }
                    console.log('列表',this.workerList);
                })
            },
            allWordAction(){
                this.page = 1;
                this.provinceId = '';
                this.cityId = '';
                $$('.h3').text('全国');
                wxApi.workerFindwork(
                    this.page,
                    this.pageSize,
                    this.provinceId,
                    this.cityId,
                    this.typecode,
                    this.time
                ).then((result)=>{
                    this.workerList = result.data.list;
                    this.totalPages = result.data.totalPages;
                    this.totalItems = result.data.totalItems;
                    console.log(result.data.list);
                    for(var i=0; i<this.workerList.length; i++){
                        for(var j=0; j<this.workerTitle.length; j++){
                            if(this.workerList[i].workType == this.workerTitle[j].code){
                                this.workerList[i].workType = this.workerTitle[j].value;
                            }
                        }
                    }
                    console.log('列表',this.workerList);
                })
            },
            selectCity(){
                let that = this;
                pickerAddress = this.$f7.picker({
                    input: '#picker-toolbarseven',
                    rotateEffect: true,
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right">' +
                    '<a href="#" class="link close-picker">确定</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>',
                    cols: [
                        {
                            values: that.proviceList.map((provice)=>{return provice.id}),
                            displayValues: that.proviceList.map((provice)=>{return provice.name}),
                            onChange: (Picker, value, displayValue)=> {
                                that.provinceId = value;
                                console.log('省名字',displayValue);

                                if(that.localAddress[value].cityObj){
                                    if(value == pickerAddress.cols[0].value){
                                        that.cityIdList = [];
                                        that.cityNameList = [];
                                        for(var key in that.localAddress[value].cityObj){
                                            that.cityIdList.unshift(that.localAddress[value].cityObj[key].id);
                                            that.cityNameList.unshift(that.localAddress[value].cityObj[key].name);
                                        }
                                        that.cityId = that.cityIdList[0];
                                        $$('.h3').text(that.cityNameList[0]);
                                        console.log('市',that.cityId,$$('.h3').text());
                                        console.log('市列表',that.cityNameList);
                                        console.log('省下市',that.localAddress[value]);
                                        if (pickerAddress.cols[1].replaceValues) {
                                            pickerAddress.cols[1].replaceValues(
                                                that.cityIdList,
                                                that.cityNameList
                                            );

                                            that.getWorkerList();
                                        }
                                    }
                                }else{
                                    let cityObj = {};
                                    userApi.addressCityList(that.provinceId).then((result)=> {
                                        if(value == pickerAddress.cols[0].value){
                                            that.cityList = result.data.list;
                                            that.cityIdList = [];
                                            that.cityNameList = [];
                                            for(var i=0; i<that.cityList.length; i++){
                                                cityObj[that.cityList[i].id] = that.cityList[i];
                                                that.cityIdList.unshift(that.cityList[i].id);
                                                that.cityNameList.unshift(that.cityList[i].name);
                                            }
                                            that.cityId = that.cityIdList[0];
                                            $$('.h3').text(that.cityNameList[0]);
                                            console.log('市',this.cityId,$$('.h3').text());
                                            console.log('市列表2',that.cityNameList);
                                            that.localAddress[that.provinceId].cityObj = cityObj;
                                            console.log('省下的所有市',this.localAddress[that.provinceId]);

                                            if (pickerAddress.cols[1].replaceValues) {
                                                pickerAddress.cols[1].replaceValues(
                                                    that.cityIdList,
                                                    that.cityNameList
                                                );

                                                this.getWorkerList();

                                            }
                                        }
                                    });
                                }
                                pickerAddress.cols[1].onChange();
                            }
                        },
                        {
                            textAlign: "left",
                            values: that.cityIdList,
                            displayValues: that.cityNameList,
                            onChange: (Picker, value, displayValue)=>{
                                if(value){
                                    $$('.h3').text(displayValue);
                                    that.cityId = value;
                                    console.log('市2',value,displayValue);

                                    that.getWorkerList();
                                }

                            }
                        }
                    ],
                    onOpen: (picker)=>{
                        pickerAddress.cols[0].onChange('Picker', that.provinceId);
                        console.log('调用了');
                    }
                });
            }
        },
        mounted(){
            let server = encodeURIComponent(shareServer);
            console.log('编码',shareServer,server);
            this.userId = LocalCache.get('userInfo').id;

            wxApi.lookUserContact(this.userId).then((result)=>{
                this.number = result.data.times;
                console.log('次数',result.data);
            })

            //选择日期
            var that = this;
            calendarInline = this.$f7.calendar({
                input: '#calendar-defaultnine',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    $$('.h5').text($day);
                    that.time = $day;

                    that.getWorkerList();
                    p.close();
                    that.$f7.closeModal();
                }
            });

            //选择工种
            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;
                pickerDevice = this.$f7.picker({
                    input: '#picker-deviceeight',
                    formatValue(p, values, displayValues) {
                        return displayValues;
                    },
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onOpen: (p) => {
                        p.container.find('#btnOk').off('click').click(() => {
                            this.typecode = p.cols[0].value;
                            this.typename = p.cols[0].displayValue;
                            $$('.h4').text(this.typename);

                            this.getWorkerList();
                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.workerTitle.map((one)=>{return one.code}),
                            displayValues: this.workerTitle.map((one)=>{return one.value})
                        }
                    ]
                });
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=>{
                    this.workerTitle = result.data.list.reverse();
                    this.$store.state.workerTitle = this.workerTitle;
                    console.log(this.workerTitle);
                    pickerDevice = this.$f7.picker({
                        input: '#picker-deviceeight',
                        formatValue(p, values, displayValues) {
                            return displayValues;
                        },
                        toolbarTemplate:
                        '<div class="toolbar">' +
                        '<div class="toolbar-inner">' +
                        '<div class="left">' +
                        '<a href="#" class="link close-picker">取消</a>' +
                        '</div>' +
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                        '</div>' +
                        '</div>',
                        onOpen: (p) => {
                            p.container.find('#btnOk').off('click').click(() => {
                                this.typecode = p.cols[0].value;
                                this.typename = p.cols[0].displayValue;
                                $$('.h4').text(this.typename);

                                this.getWorkerList();
                            })
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values: this.workerTitle.map((one)=>{return one.code}),
                                displayValues: this.workerTitle.map((one)=>{return one.value})
                            }
                        ]
                    });
                })
            }

            //获取工人列表(这个接口调用要写在工种调用的后面)
            projectApi.userProjs().then((result)=>{
                console.log('项目列表',result.data);
                if(result.data.length!=0){
                    this.provinceId = result.data[0].provinceId;
                    this.cityId = result.data[0].cityId;
                    wxApi.getCityName(this.cityId).then((result)=>{
                        console.log('市的名字',result.data.name);
                        $$('.h3').text(result.data.name);
                    })

                    this.getWorkerList();
                }else{
                    this.getWorkerList();
                }
            })

            var loading = false;
            $$('.infinite-scroll').on('infinite', ()=>{
                if(loading) return;
                loading = true;

                var that = this;
                setTimeout(()=>{
                    that.page++;
                    console.log('我被点击了',that.page);
                    loading = false;

                    if (that.page <= that.totalPages) {
                        wxApi.workerFindwork(
                            this.page,
                            this.pageSize,
                            this.provinceId,
                            this.cityId,
                            this.typecode,
                            this.time
                        ).then((result)=>{
                            that.workerList = that.workerList.concat(result.data.list);
                            console.log(result.data.list);
                            for(var i=0; i<that.workerList.length; i++){
                                for(var j=0; j<that.workerTitle.length; j++){
                                    if(that.workerList[i].workType == that.workerTitle[j].code){
                                        that.workerList[i].workType = that.workerTitle[j].value;
                                    }
                                }
                            }
                            console.log('列表',that.workerList);
                        })
                    }
                }, 1000);
            })

            //获取省市区地址
            if(this.$store.state.localAddress){
                this.localAddress = this.$store.state.localAddress;
                for(var key in this.localAddress){
                    this.proviceList.unshift(this.localAddress[key]);
                };
                console.log('省',this.proviceList);

                this.selectCity();
            }else{
                userApi.adressProviceList().then((result)=>{
                    this.proviceList = result.data.list;
                    for(var i=0; i<result.data.list.length; i++){
                        this.localAddress[result.data.list[i].id] = result.data.list[i];
                    };
                    this.$store.state.localAddress = this.localAddress;

                    this.selectCity();
                });
            }

        }
    }
</script>

<style scoped>
    .navbar .left img{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .right{
        font-size: 0.8rem; color: #438CFF;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .head{
        background: #fff;
    }
    .head .aul{
        width: 100%; display: flex;
    }
    .head .aul li{
        width: 33%; height: 2rem; line-height: 2rem; font-size: 0.8rem; color: #999; border-right: 1px solid #f4f4f4; position: relative;
    }
    .head .aul li:last-of-type{
        border-right: none;
    }
    .head .aul li .hd{
        width: 100%;
    }
    .head .aul li .hd .picker{
        width: 100%; height: 2rem; border: none; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0; z-index: -1;
    }
    .head .aul li .hd2{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .head .aul li .hd2 .h-1{
        font-size: 0.7rem; color: #A2B4CA;
    }
    .head .aul li .hd2 .h-2{
        width: 0.5rem; height: 0.5rem; display: inline;
    }

    .title{
        width: 100%; height: 2.5rem; background: #fff; margin-top: 0.25rem; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem;
    }
    .title .left{

    }
    .title .left .top{
        padding-top: 0.3rem;
    }
    .title .left .top .t-1{
        width: 0.6rem; height: 0.6rem;
    }
    .title .left .top .t-2{
        font-size: 0.55rem; color: #3554F1;
    }
    .title .left .top .t-2 i{
        font-size: 0.9rem; padding: 0.1rem;
    }
    .title .left .bot{
        font-size: 0.4rem; color: #CCCCCC;
    }
    .title .right{
        transform: translateY(0.3rem);
    }
    .title .right a{
        font-size: 0.4rem; color: #999;
    }

    .main{
        margin-bottom: 2rem;
    }
    .main .aul2{

    }
    .main .aul2 li{
      background: #fff; margin-top: 0.25rem;
    }
    .main .aul2 li .a{
        width: 100%; height: 35px; line-height: 35px; box-sizing: border-box; padding-left: 0.6rem; font-size: 0.7rem; color: #555;
        background: #EEF5F9;
    }
    .main .aul2 li .a img{
        width: 42px; height: 15px; display: inline; transform: translate(10px, 4px);
    }
    .main .aul2 li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; border-bottom: 1px solid #D8E7FE; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .a2-1{
        font-size: 0.65rem; color: #438CFF; padding-right: 1.3rem;
    }
    .main .aul2 li .a2-2{
        font-size: 0.45rem; color: #fff; background: #F05A5A; border-radius: 0.1rem; box-sizing: border-box; padding: 0.15rem 0.4rem;
    }
    .main .aul2 li .a3{
        padding: 0.4rem 0 0.5rem 0; border-bottom: 1px solid #D8E7FE; box-sizing: border-box; padding-left: 0.9rem;
    }
    .main .aul2 li .a3 .aul3{

    }
    .main .aul2 li .a3 .aul3 li{
        display: flex; font-size: 0.5rem; color: #666;
    }
    .main .aul2 li .a3 .aul3 li .u-2{
        min-width: 2.3rem;
    }
    .main .aul2 li .a3 .aul3 li .u-3{
        flex: 1;
    }
    .main .aul2 li .a4{
        display: flex; justify-content: space-around; padding: 0.6rem 0;
    }
    .main .aul2 li .a4 .left, .right{
        height: 1.1rem; line-height: 1.1rem; text-align: center; font-size: 0.55rem; color: #fff; border-radius: 0.55rem;
    }
    .main .aul2 li .a4 .left{
        width: 3.75rem; background: #297BE1;
    }
    .main .aul2 li .a4 .left.active{
        background: #A1AAB6;
    }
    .main .aul2 li .a4 .right{
        width: 4.25rem; background: #4C65E2;
    }
    .main .aul2 li .a4 .right .open-popover{
        display: block; width: 100%; height: 100%; color: #fff;
    }
    .main .word{
        width: 90%; height: 24px; line-height: 24px; font-size: 10px; text-align: center; margin: 20px auto; color: #6AA5EE; border: 1px solid #DEE8F7;  border-radius: 6px;
    }

    .popover-angle{
        width: 0;
    }
    .popout{
        box-sizing: border-box; width: 94%; height: 200px; margin: 0 3%; border-radius: 17px; background: #fff; position: fixed; left: 0; bottom: 16px; justify-content: space-around;
    }
    .popout .top, .bott{
        width: 100%; height: 50px; line-height: 50px; font-size: 16px; text-align: center;
    }
    .popout .top{
        color: #333;
    }
    .popout .bott{
        color: #666;
    }
    .popout .cent{
        width: 100%; height: 104px; display: flex; box-sizing: border-box; border-bottom: 1px solid #f4f4f4; padding-top: 6px;
    }
    .popout .cent .c-1{
        margin-left: 32px; text-align: center;
    }
    .popout .cent .c-1 img{
        width: 55px; height: 55px; display: inline;
    }
</style>