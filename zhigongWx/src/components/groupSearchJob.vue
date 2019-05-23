<template>
    <div>
        <div class="content">
            <div class="pagetitle">
                找项目/找工人
            </div>
            <div class="nav">
                <div class="n" @click="oneBtn"><span :class="{active: isShow==1}">找项目</span></div>
                <div class="n" @click="twoBtn"><span :class="{active: isShow==2}">找工人</span></div>
            </div>
            <div>
                <div class="aside" v-show="isShow==2">
                    <div class="pub">
                        <div class="left">
                            <span>寻找更多优质工人，请发布您的班组用工需求</span><br/><span>精准匹配您需要的工人</span>
                        </div>
                        <div class="right"><a href="/user/publishNeedWork/0/">发布用工需求</a></div>
                    </div>
                    <div class="demand">
                        <div class="left">班组工人列表</div><div class="right"><a href="/user/groupSearchWorker/">我的用工需求 ></a></div>
                    </div>
                </div>
                <div class="aside" v-show="isShow==1">
                    <div class="pub">
                        <div class="left">
                            <span>寻找更多匹配项目，请发布您的班组空闲状态</span><br/><span>精准班组信息，方便企业及项目联系您</span>
                        </div>
                        <div class="right"><a href="/user/groupPublishStatus/">发布班组状态</a></div>
                    </div>
                    <div class="demand">
                        <div class="left">项目用工需求列表</div><div class="right"><a href="/user/grouperSearchProj/">我发布的班组 ></a></div>
                    </div>
                </div>
            </div>
            <div class="head">
                <ul class="aul">
                    <li>
                        <div class="hd">
                            <input class="picker" id="picker-toolbar" readonly/>
                        </div>
                        <div class="hd2">
                            <span class="h-1 h3">{{this.cityName?this.cityName:'选择城市'}}</span>
                            <img class="h-2" src="../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                    <li>
                        <div class="hd">
                            <input class="picker" id="picker-device" readonly/>
                        </div>
                        <div class="hd2">
                            <span class="h-1 h4">选择工种</span>
                            <img class="h-2" src="../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                    <li v-show="isShow==1">
                        <div class="hd">
                            <input class="picker" id="calendar-default" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="selectTimeAction">
                            <span class="h-1 h5">选择日期</span>
                            <img class="h-2" src="../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                    <li v-show="isShow==2">
                        <div class="hd">
                            <input class="picker" id="select-time" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="selectYearsAction">
                            <span class="h-1 h6">选择工作年限</span>
                            <img class="h-2" src="../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                </ul>
            </div>
            <div>
                <div class="title" v-show="isShow==1">
                    <div class="left">
                        <div class="top">
                            <img class="t-1" src="../../static/img/laba_icom.png"/>
                            <span class="t-2">可发送合作意向<i>{{this.number}}</i>次</span>
                        </div>
                    </div>
                    <div class="right">
                        <div class="bot">
                            每天默认可发送合作意向1次，邀请工友可增加联系次数
                        </div>
                        <div class="bot2">
                            <a href="/user/sendHistory/">查看发送历史</a>
                        </div>
                    </div>
                </div>
                <div class="title" v-show="isShow==2">
                    <div class="left">
                        <div class="top">
                            <img class="t-1" src="../../static/img/laba_icom.png"/>
                            <span class="t-2">可获取联系方式<i>{{this.number}}</i>次</span>
                        </div>
                    </div>
                    <div class="right">
                        <div class="bot">
                            每天默认可发送合作意向1次，邀请工友可增加联系次数
                        </div>
                        <div class="bot2">
                            <a href="/user/sendHistory/">查看发送历史</a>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="main" v-show="isShow==1">
                    <ul class="aul2">
                        <li v-for="(item, index) in projList">
                            <div class="a2">
                                <div class="a2-1">{{item.project.name}}</div>
                                <div class="a2-2">
                                    <img src="../../static/img/dingwei_icom.png"/>
                                    <span class="a23">{{item.city.name}}</span>
                                </div>
                            </div>
                            <div class="a3" v-show="item.workDemandList && item.workDemandList!='[]'">
                                <div class="a3">
                                    <div class="a3-1">用工需求:</div>
                                    <div class="a3-2" v-for="one in item.workDemandList">
                                        <span class="left">{{one.workType.split('_')[0]}}</span> <span class="left2"><i>{{one.demandAmount}}</i>人</span>
                                        <span>{{one.demandTime}}起</span>
                                    </div>
                                </div>
                            </div>
                            <div class="a4">
                                <div class="left" @click="contactProj(index, item)" :class="{active: item.send==true}" :data-id=item.batchNumber>发送合作意向</div>
                                <div class="right" @click="pickerAction">邀请工友</div>
                            </div>
                        </li>
                    </ul>
                    <div v-show="projList.length<this.pageSize || projList.length==this.totalItems" class="word" @click="allWordAction">当地已无更多项目，点击加载其他地区项目 </div>
                </div>
                <div class="main2" v-show="isShow==2">
                    <ul class="aul">
                        <li v-for="(item, index) in workerList">
                            <div class="a2">
                                <div class="a2-1">
                                    <span v-if="item.name">{{item.name}}</span>
                                    <span v-else-if="item.nickname">{{item.nickname}}</span>
                                    <span v-else="item.mobile">{{item.mobile.substr(0,3)+'******'+item.mobile.substr(8)}}</span>
                                    <img v-show="item.userDetail.idNumber" src="../../static/img/real_name.png"/>
                                </div>
                                <div class="a2-2" @click="contactWorker(item)">联系</div>
                            </div>
                            <div class="a3">
                                <ul class="aul3">
                                    <li>
                                        <div class="u-2">工种类型:</div>
                                        <div class="u-3">
                                            <span class="u3">{{item.workType}}</span> <span class="u4" v-show="item.littleBig==0">大工</span><span class="u4" v-show="item.littleBig==1">小工</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="u-2">工作经验:</div> <div class="u-3">
                                        <div class="u-3">
                                            <span v-if="item.workingExp">{{item.workingExp}}年</span><span v-else>一</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="u-2">工作地点:</div>
                                        <div class="u-3">
                                            <span v-if="item.province">{{item.province}}{{item.city}}</span><span v-else>一</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="bom">
                                <img src="../../static/img/yao_icon.png"/>&nbsp;<span>邀请工友增加联系次数</span>
                            </div>
                        </li>
                    </ul>
                    <div v-show="workListLength==0 || workListLength<5" class="word" @click="allWordAction">已无更多信息，点击查看全国信息</div>
                </div>
            </div>
        </div>
        <div v-show="titleHandle==2" class="allpage">
            <img src="../../static/img/inviterTiltle.png"/>
            <div class="know" @click="iKnowAction">知道了</div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import {userApi, tabulateStatisticsApi, wxApi, projectApi} from "../api/index";
    import { LocalCache } from '../lib/utils';
    import moment from 'moment';
    var pickerAddress;
    var pickerDevice;
    var calendarInline;
    var pickerYears;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    import phone_icon from '../../static/img/phone_icon.png';
    var cityShow;
    export default {
        name: 'groupSearchJob',
        data(){
            return{
                isShow: 1,
                userId: '',
                typecode: '',
                workerTitle: [],
                time: '',
                years: '',
                projList: [],
                workerList: [],
                titleHandle: 1,
                page: 1,
                pageSize: 5,
                totalPages: '',
                totalItems: '',
                workListLength: '',
                cityId2: '',                //切换组件找项目和找工人时保存刚进页面的省市
                cityName2: '',

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
        props: ['number', 'projList', 'cityName', 'totalPages', 'cityId'],
        methods: {
            oneBtn(){
                this.page = 1;
                this.cityId = this.cityId2;
                $$('.h3').text(this.cityName2);
                this.typecode = '';
                this.time = '';
                this.years = '';
                this.isShow = 1;
            },
            twoBtn(){
                this.page = 1;
                this.cityId = this.cityId2;
                $$('.h3').text(this.cityName2);
                this.typecode = '';
                this.time = '';
                this.years = '';
                this.isShow = 2;
                this.getWorkerList();
            },
            selectYearsAction(){
                pickerYears.open();
            },
            contactProj(index, item){
                let batch = $$('.a4 .left').eq(index).data('id');
                if(!item.batchNumber){
                    this.$f7.alert('该项目暂无用工需求，请查询其他项目');
                }else{
                    if(this.number==0){
                        this.$f7.alert('用户联系次数已用完，邀请好友增加联系次数');
                    }else{
                        if(item.send==true){
                            this.$f7.alert('已发送过申请，请到发送历史页面查看');
                        }else{
                            wxApi.groupApplyFor(item.batchNumber).then((result)=>{
                                console.log(result.data);
                                if(item.batchNumber = batch){
                                    item.send = true;
                                }
                                wxApi.subOneTimes(this.userId).then((result)=>{
                                    this.number = result.data.times;
                                    console.log('次数',result.data);
                                })
                            })
                        }
                    }
                }
            },
            contactWorker(item){
                let hideMobile = item.mobile.substr(0,3)+'****'+item.mobile.substr(7);
                if(this.number==0){
                    this.$f7.alert('用户联系次数已用完，邀请好友增加联系次数');
                }else{
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
                                text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:'+item.mobile+'" class="external">' + "拨号" + '</a>',
                                onClick: ()=>{
                                    console.log('我点击了拨号');
                                    wxApi.subOneTimes(this.userId).then((result)=>{
                                        this.number = result.data.times;
                                        console.log('次数',result.data);
                                    })
                                }
                            },
                        ]
                    })
                }
            },
            getProjList(){
                this.page = 1;
                wxApi.grouperFindwork(
                    this.page,
                    this.pageSize,
                    this.provinceId,
                    this.cityId,
                    this.typecode,
                    this.time
                ).then((result)=>{
                    if(result.data){
                        this.projList = result.data.list;
                        this.totalPages = result.data.totalPages;
                        this.totalItems = result.data.totalItems;
                        console.log(result.data);
                        for(var i=0; i<this.projList.length; i++){
                            if(this.projList[i].workDemandList && this.projList[i].workDemandList!='[]') {
                                for (var k = 0; k < this.projList[i].workDemandList.length; k++) {
                                    for (var j = 0; j < this.workerTitle.length; j++) {
                                        if (this.projList[i].workDemandList[k].workType == this.workerTitle[j].code) {
                                            this.projList[i].workDemandList[k].workType = this.workerTitle[j].value + '_' + this.workerTitle[j].code;
                                        }
                                    }
                                }
                            }
                        }
                        console.log('列表',this.projList);
                    }else{
                        this.projList = [];
                    }
                })
            },
            getWorkerList(){
                this.page = 1;
                wxApi.recruitWorkerList(
                    this.page,
                    this.pageSize,
                    this.cityId,
                    this.typecode,
                    this.years
                ).then((result)=>{
                    console.log(result.data);
                    this.workerList = result.data;
                    this.workListLength = result.data.length;

                    console.log(result.data);
                    for(var i=0; i<this.workerList.length; i++){
                        for (var j = 0; j < this.workerTitle.length; j++) {
                            if (this.workerList[i].workType == this.workerTitle[j].code) {
                                this.workerList[i].workType = this.workerTitle[j].value;
                            }
                        }
                    }
                    console.log('工人列表',this.workerList);
                })
            },
            allWordAction(){
                this.page = 1;
                this.provinceId = '';
                this.cityId = '';
                this.typecode = '';
                this.time = '';
                this.years = '';
                $$('.h3').text('全国');
                $$('.h4').text('选择工种');
                $$('.h5').text('选择日期');
                $$('.h6').text('选择工作年限');

                if(this.isShow==1){
                    wxApi.grouperFindwork(
                        this.page,
                        this.pageSize,
                        this.provinceId,
                        this.cityId,
                        this.typecode,
                        this.time
                    ).then((result)=>{
                        console.log(result.data);
                        this.projList = result.data.list;
                        this.totalPages = result.data.totalPages;
                        this.totalItems = result.data.totalItems;

                        console.log(result.data);
                        for(var i=0; i<this.projList.length; i++){
                            if(this.projList[i].workDemandList && this.projList[i].workDemandList!='[]'){
                                for(var k=0; k<this.projList[i].workDemandList.length; k++) {
                                    for (var j = 0; j < this.workerTitle.length; j++) {
                                        if (this.projList[i].workDemandList[k].workType == this.workerTitle[j].code) {
                                            this.projList[i].workDemandList[k].workType = this.workerTitle[j].value;
                                        }
                                    }
                                }
                            }
                        }
                        console.log('项目列表',this.projList);
                    })
                }
                if(this.isShow==2){
                    wxApi.recruitWorkerList(
                        this.page,
                        this.pageSize,
                        this.cityId,
                        this.typecode,
                        this.time
                    ).then((result)=> {
                        console.log(result.data);
                        this.workListLength = result.data.length;
                        this.workerList = result.data;
                        for(var i=0; i<this.workerList.length; i++){
                            for (var j = 0; j < this.workerTitle.length; j++) {
                                if (this.workerList[i].workType == this.workerTitle[j].code) {
                                    this.workerList[i].workType = this.workerTitle[j].value;
                                }
                            }
                        }
                        console.log('工人列表',this.workerList);
                    })
                }
            },
            pickerAction(){
                this.titleHandle = 2;
            },
            iKnowAction(){
                this.titleHandle = 1;
            },
            selectType(){
                pickerDevice = this.$f7.picker({
                    input: '#picker-device',
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

                            if(this.isShow==1){
                                this.getProjList();
                            }
                            if(this.isShow==2){
                                this.getWorkerList();
                            }
                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.workerTitle.map((one)=>{return one.code}),
                            displayValues: this.workerTitle.map((one)=>{return one.value})
                        }
                    ]
                })
            },
            selectCity(){
                let that = this;
                pickerAddress = this.$f7.picker({
                    input: '#picker-toolbar',
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

                                            if(that.isShow==1){
                                                that.getProjList();
                                            }
                                            if(that.isShow==2){
                                                that.getWorkerList();
                                            }
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
                                            console.log('市',that.cityId,$$('.h3').text());
                                            console.log('市列表2',that.cityNameList);
                                            this.localAddress[value].cityObj = cityObj;
                                            console.log('省下的所有市',this.localAddress[value]);

                                            if (pickerAddress.cols[1].replaceValues) {
                                                pickerAddress.cols[1].replaceValues(
                                                    that.cityIdList,
                                                    that.cityNameList
                                                );

                                                if(that.isShow==1){
                                                    that.getProjList();
                                                }
                                                if(that.isShow==2){
                                                    that.getWorkerList();
                                                }

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

                                    if(that.isShow==1){
                                        that.getProjList();
                                    }
                                    if(that.isShow==2){
                                        that.getWorkerList();
                                    }
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
            this.cityId2 = this.cityId;
            this.cityName2 = this.cityName;
            console.log('市的名字',this.cityName);
            this.userId = LocalCache.get('userInfo').id;

            var loading = false;
            $$('.infinite-scroll').on('infinite', ()=>{
                if(loading) return;
                loading = true;

                var that = this;
                setTimeout(()=>{
                    that.page++;
                    console.log('我被点击了',that.page, that.totalPages);
                    loading = false;

                    if(this.isShow==1){
                        if (that.page <= that.totalPages) {
                            wxApi.grouperFindwork(
                                this.page,
                                this.pageSize,
                                this.provinceId,
                                this.cityId,
                                this.typecode,
                                this.time
                            ).then((result)=>{
                                console.log(result.data);
                                that.projList = that.projList.concat(result.data.list);
                                console.log(result.data);
                                for(var i=0; i<that.projList.length; i++){
                                    if(that.projList[i].workDemandList && that.projList[i].workDemandList!='[]'){
                                        for(var k=0; k<that.projList[i].workDemandList.length; k++) {
                                            for (var j = 0; j < that.workerTitle.length; j++) {
                                                if (that.projList[i].workDemandList[k].workType == that.workerTitle[j].code) {
                                                    that.projList[i].workDemandList[k].workType = that.workerTitle[j].value;
                                                }
                                            }
                                        }
                                    }
                                }
                                console.log('列表',that.projList);
                            })
                        }
                    }
                    if(this.isShow==2){
                        wxApi.recruitWorkerList(
                            this.page,
                            this.pageSize,
                            this.cityId,
                            this.typecode,
                            this.time
                        ).then((result)=> {
                            console.log(result.data);
                            that.workListLength = result.data.length;
                            that.workerList = that.workerList.concat(result.data);
                            for(var i=0; i<that.workerList.length; i++){
                                for (var j = 0; j < that.workerTitle.length; j++) {
                                    if (that.workerList[i].workType == that.workerTitle[j].code) {
                                        that.workerList[i].workType = that.workerTitle[j].value;
                                    }
                                }
                            }
                            console.log('工人列表',that.workerList);
                        })
                    }

                }, 1000);
            })

            //选择日期
            var that = this;
            calendarInline = this.$f7.calendar({
                input: '#calendar-default',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    $$('.h5').text($day);
                    that.time = $day;

                    that.getProjList();
                    p.close();
                    that.$f7.closeModal();
                }
            });

            //选择工种
            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;

                this.selectType();
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=> {
                    this.workerTitle = result.data.list.reverse();
                    this.$store.state.workerTitle = this.workerTitle;
                    console.log(this.workerTitle);

                    this.selectType();
                })
            }

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

            //选择工作年限
            pickerYears = this.$f7.picker({
                input: '#select-time',
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
                        this.years = p.cols[0].value;
                        $$('.h6').text(this.years);
                        this.getWorkerList();
                    })
                },
                cols: [
                    {
                        textAlign: 'center',
                        values: (function () {
                            var arr = [];
                            for (var i = 1; i <= 40; i++) { arr.push(i); }
                            return arr;
                        })(),
                    }
                ]
            });

        }
    }
</script>

<style scoped>
    .content{
        width: 100%; height: 100%; background: #f4f4f4; position: relative;
    }
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

    .pagetitle{
        width: 100%; height: 44px; line-height: 44px; text-align: center; font-size: 0.8rem; color: #000;
    }
    .nav{
        width: 100%; height: 45px; line-height: 45px; background: #fff; display: flex; justify-content: space-between;
    }
    .nav .n{
        width: 50%; text-align: center; font-size: 0.7rem; color: #666; font-size: 0.7rem; color: #666; display: inline-block;
    }
    .nav .n span{
        display: inline-block; line-height: 45px;
    }
    .nav .n span.active{
        border-bottom: 2px solid #438CFF;
    }

    .aside{

    }
    .aside .pub{
        width: 100%; height: 2.5rem; background: #D6D4D4; box-sizing: border-box; padding: 0 0.6rem; display: flex; justify-content: space-between; margin-top: 5px;
    }
    .aside .pub .left{
        font-size: 0.5rem; color: #666; text-align: center; margin-top: 0.6rem;
    }
    .aside .pub .right{
        width: 86px; height: 22px; line-height: 22px; text-align: center; background: #00A0E9; border-radius: 0;
        margin-top: 0.8rem;
    }
    .aside .pub .right a{
        width: 100%; height: 100%; font-size: 0.5rem; color: #666;
    }
    .aside .demand{
        width: 100%; height: 1.5rem; line-height: 1.5rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem; display: flex; justify-content: space-between;
        margin-top: 4px;
    }
    .aside .demand .left{
        font-size: 0.65rem; color: #AAAAAA;
    }
    .aside .demand .right{
        height: 1.5rem;
    }
    .aside .demand .right a{
        display: inline-block; width: 100%; height: 100%; line-height: 1.5rem; font-size: 0.5rem; color: #2F7FE2;
    }

    .head{
        background: #fff; margin-top: 0.15rem;
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
        width: 100%; height: 2rem; border: none; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0;
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
        width: 100%; background: #fff; margin-top: 0.25rem; box-sizing: border-box; padding: 0 0.6rem;
    }
    .title .left{
        border-bottom: 1px solid #f4f4f4;
    }
    .title .left .top{
        width: 100%; height: 28px; line-height: 28px;
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
    .title .right{
        width: 100%; height: 22px; display: flex; justify-content: space-between;
    }
    .title .right .bot{
        font-size: 0.4rem; color: #CCCCCC;
    }
    .title .right .bot2{

    }
    .title .right .bot2 a{
        font-size: 0.4rem; color: #999;
    }

    .main{
        margin-bottom: 4rem;
    }
    .main .aul2 li{
        box-sizing: border-box; padding: 0 0.6rem;  background: #fff; margin-top: 0.25rem;
    }
    .main .aul2 li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; border-bottom: 1px solid #D8E7FE; display: flex; justify-content: space-between;
    }
    .main .aul2 li .a2-1{
        font-size: 0.75rem; color: #555555; padding-right: 1.3rem; width: 50%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .main .aul2 li .a2-2{
        font-size: 0.6rem; color: #777;
    }
    .main .aul2 li .a2-2 img{
        width: 0.5rem; height: 0.6rem; display: inline; transform: translateY(0.1rem);
    }

    .main .aul2 li .a3{
        padding: 0.4rem 0 0.5rem 0; font-size: 0.6rem; color: #777;
    }
    .main .aul2 li .a3 .a3-1{
        padding-bottom: 0.6rem;
    }
    .main .aul2 li .a3 .a3-2 .left{
        min-width: 3.5rem; display: inline-block;
    }
    .main .aul2 li .a3 .a3-2 .left2{
        padding-right: 2rem;
    }
    .main .aul2 li .a3 .a3-2 .left2 i{
        color: #EF7373; padding: 0 0.1rem;
    }

    .main .aul2 li .a4{
        display: flex; justify-content: space-around; padding: 0.6rem 0;
    }
    .main .aul2 li .a4 .left, .right{
        height: 1.1rem; line-height: 1.1rem; text-align: center; font-size: 0.55rem; color: #fff; border-radius: 0.55rem;
    }
    .main .aul2 li .a4 .left{
        width: 4.75rem; background: #297BE1;
    }
    .main .aul2 li .a4 .left.active{
        background: #A1AAB6;
    }
    .main .aul2 li .a4 .right{
        width: 4.25rem; background: #4C65E2;
    }
    .main .word{
        width: 90%; height: 24px; line-height: 24px; font-size: 10px; text-align: center; margin: 20px auto; color: #6AA5EE; border: 1px solid #DEE8F7;  border-radius: 6px;
    }

    .main2{
        margin-bottom: 2rem;
    }
    .main2 .aul li{
        box-sizing: border-box; padding: 0 0.6rem;  background: #fff; margin-top: 0.25rem;
    }
    .main2 .aul li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; border-bottom: 1px solid #D8E7FE; display: flex; justify-content: space-between;
    }
    .main2 .aul li .a2-1{
        font-size: 0.75rem; color: #555; padding-right: 1.3rem;
    }
    .main2 .aul li .a2-1 img{
        width: 74px; height: 16px; display: inline; transform: translateY(2px);
    }
    .main2 .aul li .a2-2{
        width: 3rem; height: 22px; line-height: 22px; text-align: center; font-size: 0.55rem; color: #fff; border-radius: 0.5rem;
        background: linear-gradient(to top, #297BE1, #91BFF9); margin-top: 6px;
    }
    .main2 .aul li .a3{
        padding: 0.4rem 0 0.5rem 0; border-bottom: 1px solid #D8E7FE;
    }
    .main2 .aul li .a3 .aul3{

    }
    .main2 .aul li .a3 .aul3 li{
        display: flex; font-size: 0.6rem; color: #666;
    }
    .main2 .aul li .a3 .aul3 li .u-2{
        min-width: 2.3rem;
    }
    .main2 .aul li .a3 .aul3 li .u-3{
        flex: 1; margin-left: 0.5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .main2 .aul li .a3 .aul3 li .u-3 .u3{
        color: #F13333;
    }
    .main2 .aul li .a3 .aul3 li .u-3 .u4{
        display: inline-block; box-sizing: border-box; padding: 2px 4px; margin-left: 6px; font-size: 0.5rem; color: #333333; background: #EAEAEA;
    }
    .main2 .aul li .bom{
        width: 100%; height: 24px; line-height: 24px; text-align: right; box-sizing: border-box; padding-right: 0.6rem; font-size: 0.5rem; color: #666666;
    }
    .main2 .aul li .bom img{
        width: 11px; height: 16px; display: inline-block; transform: translateY(5px);
    }
    .main2 .word{
        width: 90%; height: 24px; line-height: 24px; font-size: 10px; text-align: center; margin: 20px auto; color: #6AA5EE; border: 1px solid #DEE8F7;  border-radius: 6px;
    }
</style>