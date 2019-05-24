<template>
    <div data-page="laborManagement" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">劳务招工</div>
            </div>
        </div>
        <!---侧边栏--->
        <proj-admin v-if="companyRole==2"></proj-admin>
        <company-nav v-else></company-nav>
        <!--页面主要类容-->
        <no-company v-show="companyId==0 || companyRole==3"></no-company>
        <div v-show="companyId!=0 && companyRole!=3" class="page-content infinite-scroll">
            <div class="hint">温馨提示: 达成工作意向前请先核实双方身份,警惕要求付费转账等行为</div>
            <div class="top">
                <div class="t-1">
                    <a href="/company/publicLaborDemand/0/">
                        <img src="../../../../../static/img/pubilc_icom.png"/><br/>
                        <span>发布</span><br/>
                        <span>用工需求</span>
                    </a>
                </div>
                <div class="t-1">
                    <a href="/company/myLaborDemand">
                        <img src="../../../../../static/img/myLabor_icom.png"/><br/>
                        <span>我的</span><br/>
                        <span>用工需求</span>
                    </a>
                </div>
                <div class="t-1">
                    <a href="/company/groupApplication">
                        <img src="../../../../../static/img/groupCooperation_icom.png"/><br/>
                        <span>我的</span><br/>
                        <span>联系记录</span>
                    </a>
                </div>
            </div>
            <div class="head">
                <ul class="aul">
                    <li>
                        <div class="hd">
                            <input class="picker" id="picker-toolbar" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="addressAction">
                            <span class="h-1 h3">选择城市</span>
                            <img class="h-2" src="../../../../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                    <li>
                        <div class="hd">
                            <input class="picker" id="picker-device" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="selectTypeAction">
                            <span class="h-1 h4">选择工种</span>
                            <img class="h-2" src="../../../../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                    <li>
                        <div class="hd">
                            <input class="picker" id="calendar-default" readonly/>
                        </div>
                        <div class="hd2" @click.stop.prevent="selectTimeAction">
                            <span class="h-1 h5">选择日期</span>
                            <img class="h-2" src="../../../../../static/img/xialaGray.png"/>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="main">
                <ul class="aul2">
                    <li v-for="item in projList">
                        <div class="a2">
                            <div class="a2-1">
                                <span class="wg">{{item.workGroupName}}</span>
                                <img v-show="item.userDetailEntity.idNumber" src="../../../../../static/img/shareYishiming.png"/>
                                <img v-show="item.userCount>1" src="../../../../../static/img/shareYirengzhen.png"/>
                                <span v-show="item.userCount>1" class="wg2">班组{{item.userCount}}人</span>
                            </div>
                            <div class="a2-2" @click="contactAction(item)">
                                <img src="../../../../../static/img/phone_icom.png"/>
                            </div>
                        </div>
                        <div class="a3">
                            <div class="up">
                                <div class="a3-2" v-for="one in item.list">
                                    <div class="left">{{one.workType.split('_')[0]}}</div>
                                    <div class="left2"><span class="t">{{one.freeAmount}}</span><span class="t2">人</span></div>
                                    <div class="left3">{{one.freeTime}}起</div>
                                </div>
                                <div class="a4-2" v-show="item.remark">
                                    <img src="../../../../../static/img/tonggao.png"/>
                                    <div class="right">{{item.remark}}</div>
                                </div>
                                <div class="u-1">
                                    <img src="../../../../../static/img/dingwei_icom.png"/>
                                    <span>{{item.province.name}}</span><span>{{item.city.name}}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-show="projList.length<this.pageSize || projList.length==this.totalItems" class="word" @click="allWordAction">已无更多信息，点击查看全国信息</div>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import companyNav from '../../../../components/broadside-navigation/companyAdmin'
    import projAdmin from '../../../../components/broadside-navigation/projAdmin'
    import noCompany from '../../../../components/company-home/noCompany'
    import {userApi, tabulateStatisticsApi, wxApi, projectApi} from "../../../../api";
    import {shareServer} from "../../../../config";
    import { LocalCache } from '../../../../lib/utils';
    import moment from 'moment';
    var pickerAddress, pickerDevice, calendarInline;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    import phone_icon from '../../../../../static/img/phone_icon.png';
    var cityShow;
    export default {
        data(){
            return{
                companyId: '',
                projectId: '',
                companyRole: '',
                userId: '',
                typecode: 0,
                workerTitle: [],
                time: '',
                projList: [],
                page: 1,
                pageSize: 5,
                totalPages: '',
                totalItems: '',
                number: '',                 //能联系的次数

                proviceList: [],            //以下都是调省市区插件的参数
                proviceIdList: [],
                cityList: [],
                provinceId: '',
                cityIdList: [''],
                cityNameList: [''],
                cityId: '',
                localAddress: {},             //省市区的地址全放里面存缓存里
                demandTypeList:[]
            }
        },
        components:{
            companyNav, noCompany, projAdmin
        },
        methods:{
            back(){
                if(this.$store.state.address.provinceId!='' &&this.$store.state.address.cityId!=''){
                    console.log('我获取了省市id', this.$store.state.address);
                    this.provinceId = this.$store.state.address.provinceId;
                    this.cityId = this.$store.state.address.cityId;
                    console.log('我获取了省市id', this.provinceId, this.cityId);
                    wxApi.getCityName(this.cityId).then((result)=>{
                        console.log('市的名字',result.data.name);
                        $$('.h3').text(result.data.name);
                    })
                    this.getWorkerList();
                }
            },
            addressAction(){
                console.log('我点击了');
                pickerAddress.open();
            },
            selectTypeAction(){
                pickerDevice.open();
            },
            selectTimeAction(){
                calendarInline.open();
            },
            contactAction(item){
                let hideMobile = item.workGroupTel.substr(0,3)+'****'+item.workGroupTel.substr(7);
                console.log(item.workGroupTel, hideMobile);
                this.$f7.modal({
                    text:  '<div class="tabs">' +
                    '<img style="width: 1rem; height: 1.1rem; transform: translateY(0.3rem)" src=' + phone_icon + '>' +
                    '<a>' + hideMobile + '</a>' +
                    '</div>',
                    buttons: [
                        {
                            text: '取消'
                        },
                        {
                            text: '<a style="width: 100%; height: 100%; display: inline-block" href="tel:'+item.workGroupTel+'" class="external">' + "拨号" + '</a>',
                            onClick: () => {
                                wxApi.projContactGroup(item.workGroupId, item.province.id, item.city.id).then((result)=>{
                                    console.log('项目联系班组长',result.data);
                                })
                            }
                        },
                    ]
                })
            },
            getWorkerList(){
                //获取工人列表
                this.page = 1;
                wxApi.companyLookGroupFree(
                    this.page,
                    this.pageSize,
                    this.provinceId,
                    this.cityId,
                    this.typecode,
                    this.time
                ).then((result)=>{
                    console.log('kk',result.data);
                    this.projList = result.data;
                    this.totalPages = result.pagination.totalPages;
                    this.totalItems = result.pagination.totalItems;
                    console.log(this.totalPages,this.totalItems);
                    for(var i=0; i<this.projList.length; i++){
                        for(var k=0; k<this.projList[i].list.length; k++) {
                            for (var j = 0; j < this.workerTitle.length; j++) {
                                if (this.projList[i].list[k].workType == this.workerTitle[j].code) {
                                    this.projList[i].list[k].workType = this.workerTitle[j].value+'_'+this.workerTitle[j].code;
                                }
                            }
                        }
                    }
                    console.log('列表',this.projList);
                })
            },
            allWordAction(){
                this.page = 1;
                this.provinceId = '',
                this.cityId = '',
                $$('.h3').text('全国');
                wxApi.companyLookGroupFree(
                    this.page,
                    this.pageSize,
                    this.provinceId,
                    this.cityId,
                    this.typecode,
                    this.time
                ).then((result)=>{
                    console.log('kk',result.data);
                    this.projList = result.data;
                    this.totalPages = result.pagination.totalPages;
                    this.totalItems = result.pagination.totalItems;
                    console.log(this.totalPages,this.totalItems);
                    for(var i=0; i<this.projList.length; i++){
                        for(var k=0; k<this.projList[i].list.length; k++) {
                            for (var j = 0; j < this.workerTitle.length; j++) {
                                if (this.projList[i].list[k].workType == this.workerTitle[j].code) {
                                    this.projList[i].list[k].workType = this.workerTitle[j].value+'_'+this.workerTitle[j].code;
                                }
                            }
                        }
                    }
                    console.log('列表',this.projList);
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
                                            console.log('市',that.cityId,$$('.h3').text());
                                            console.log('市列表2',that.cityNameList);
                                            this.localAddress[value].cityObj = cityObj;
                                            console.log('省下的所有市',this.localAddress[value]);

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
            this.userId = LocalCache.get('userInfo').id;
            console.log('用户id',this.userId);
            this.companyId = this.$store.state.roleInfo.companyId;
            this.companyRole = this.$store.state.roleInfo.companyRole;
            this.projectId = this.$store.state.roleInfo.projectId;
            wxApi.demandType().then((res=>{  //发布页面用
                console.log(res.data);
                this.demandTypeList = res.data
                //$$(".demandTypeLabel:first-child").prop("checked",true)
                this.$store.state.demandTypeList = res.data
            }))
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

                    that.getWorkerList();
                    p.close();
                    that.$f7.closeModal();
                }
            });

            //选择工种
            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;
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
            if(this.$store.state.address && this.$store.state.address.cityId!=''){
                this.provinceId = this.$store.state.address.provinceId;
                this.cityId = this.$store.state.address.cityId;
                console.log('我获取了省市id', this.provinceId, this.cityId);
                wxApi.getCityName(this.cityId).then((result)=>{
                    console.log('市的名字',result.data.name);
                    $$('.h3').text(result.data.name);
                })

                this.getWorkerList();

            }else{
                wxApi.projectList2(this.companyId, 1, 1).then((result)=>{
                    console.log('项目详情', result.data);
                    if(result.data){
                        console.log('项目详情2');
                        this.provinceId = result.data[0].provinceId;
                        this.cityId = result.data[0].cityId;

                        wxApi.getCityName(this.cityId).then((result)=>{
                            console.log('市的名字',result.data.name);
                            $$('.h3').text(result.data.name);
                        })

                        this.getWorkerList();
                    }else{
                        console.log('项目详情1');
                        this.getWorkerList();
                    }
                })
            }

            var loading = false;
            console.log('我被点击了3');
            $$('.infinite-scroll').on('infinite', ()=>{
                if(loading) return;
                loading = true;
                console.log('我被点击了');
                setTimeout(()=>{
                    this.page++;
                    console.log('我被点击了2',this.page);
                    loading = false;

                    if (this.page <= this.totalPages) {
                        wxApi.companyLookGroupFree(
                            this.page,
                            this.pageSize,
                            this.provinceId,
                            this.cityId,
                            this.typecode,
                            this.time
                        ).then((result)=>{
                            console.log('kk',result.data);
                            this.projList = this.projList.concat(result.data);
                            for(var i=0; i<this.projList.length; i++){
                                for(var k=0; k<this.projList[i].list.length; k++) {
                                    for (var j = 0; j < this.workerTitle.length; j++) {
                                        if (this.projList[i].list[k].workType == this.workerTitle[j].code) {
                                            this.projList[i].list[k].workType = this.workerTitle[j].value+'_'+this.workerTitle[j].code;
                                        }
                                    }
                                }
                            }
                            console.log('列表',this.projList);
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
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .hint{
        width: 100%; height: 1rem; line-height: 1rem; text-align: center; background: #FFEFD6; font-size: 0.55rem; color: #A85C2A; box-sizing: border-box; padding: 0 0.4rem;
    }
    .top{
        width: 100%; height: 4rem; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
    }
    .top .t-1{
        width: 33%; text-align: center; margin-top: 6px;
    }
    .top .t-1 a{
        width: 100%; height: 100%; display: inline-block; font-size: 0.55rem; color: #999;
    }
    .top .t-1 img{
        width: 1.9rem; height: 1.9rem; display: inline;
    }

    .head{
        background: #fff; margin-top: 0.25rem;
    }
    .head .aul{
        width: 100%; display: flex;
    }
    .head .aul li{
        width: 33%; height: 1.5rem; line-height: 1.5rem; font-size: 0.8rem; color: #999; border: 1px solid #f4f4f4; position: relative;
    }
    .head .aul li:last-of-type{
        border-right: none;
    }
    .head .aul li .hd{
        width: 100%;
    }
    .head .aul li .hd .picker{
        width: 100%; height: 1.5rem; border: none; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0; z-index: -1;
    }
    .head .aul li .hd2{
        width: 100%; height: 1.5rem; line-height: 1.5rem; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .head .aul li .hd2 .h-1{
        font-size: 0.7rem; color: #A2B4CA;
    }
    .head .aul li .hd2 .h-2{
        width: 0.5rem; height: 0.5rem; display: inline;
    }

    .main{
        margin-bottom: 2rem;
    }
    .main .aul2{

    }
    .main .aul2 li{

    }
    .main .aul2 li .a2{
        width: 100%; height: 1.75rem; line-height: 1.75rem; border-bottom: 1px solid #DDDEE2; display: flex; justify-content: space-between;
        background: #F2F7FB; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .a2 .a2-1 .wg{
        font-size: 0.75rem; color: #555; padding-right: 0.5rem;
    }
    .main .aul2 li .a2 .a2-1 img{
        width: 1.9rem; height: 0.7rem; transform: translateY(3px);
    }
    .main .aul2 li .a2 .a2-1 .wg2{
        display: inline-block; height: 0.6rem; line-height: 0.6rem; border: 1px solid #FC7C2E; font-size: 0.4rem; color: #F55C11; border-radius: 1px; padding: 0 4px; transform: translateY(-2px);
    }
    .main .aul2 li .a2-2{
        height: 1.75rem;
    }
    .main .aul2 li .a2-2 img{
        width: 1.25rem; height: 1.25rem; display: inline-block; margin-top: 0.3rem;
    }

    .main .aul2 li .a3{
        font-size: 0.55rem; color: #777777; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .a3 .up .a3-2{
        width: 100%; height: 1.5rem; line-height: 1.5rem; display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 2.6rem 0 0.5rem;
    }
    .main .aul2 li .a3 .up .a3-2 .left{
        min-width: 4.4rem; display: inline-block; font-size: 0.65rem; color: #438CFF;
    }
    .main .aul2 li .a3 .up .a3-2 .left2{
        padding-right: 2rem; font-size: 0.6rem;
    }
    .main .aul2 li .a3 .up .a3-2 .left2 .t{
        color: #EF7373;
    }
    .main .aul2 li .a3 .up .a3-2 .left2 .t2{
        color: #777777;
    }
    .main .aul2 li .a3 .up .a3-2 .left3{
        font-size: 0.55rem; color: #777;
    }
    .main .aul2 li .a3 .up .a4-2{
        display: flex; background: #F8F8F8; box-sizing: border-box; padding: 6px 0;
    }
    .main .aul2 li .a3 .up .a4-2 img{
        width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
    }
    .main .aul2 li .a3 .up .a4-2 .right{
        font-size: 0.55rem; color: #666;
    }
    .main .aul2 li .a3 .u-1{
        width: 100%; height: 1.2rem; line-height: 1.2rem; font-size: 0.5rem; color: #999;
    }
    .main .aul2 li .a3 .u-1 img{
        width: 0.5rem; height: 0.6rem; transform: translateY(0.1rem);
    }
    .main .word{
        width: 90%; height: 24px; line-height: 24px; font-size: 10px; text-align: center; margin: 20px auto; color: #6AA5EE; border: 1px solid #DEE8F7;  border-radius: 6px;
    }
</style>