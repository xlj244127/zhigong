<template>
    <div data-page="groupRenZhengLogin" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="center">注册</div>
            </div>
        </div>
        <div class="page-content">
            <div class="nav">
                <img src="../../static/img/jingli.png"/>
            </div>
            <div class="main">
                <ul class="aul">
                    <li>
                        <div class="left">姓名</div>
                        <input class="right" v-model="name" placeholder="请输入您的真实姓名（必填）"/>
                    </li>
                    <li>
                        <div class="left">联系电话</div>
                        <input class="right" v-model="mobile" placeholder="请输入您的联系电话（必填）"/>
                    </li>
                    <li>
                        <div class="left">工种类型</div>
                        <input class="right" type="text" id="picker-device_7" placeholder="请选择工种类型（必填）" readonly/>
                        <img class="imgOne" src="../../static/img/btn_more.png"/>
                    </li>
                    <li>
                        <div class="left">工作地</div>
                        <div class="over">
                            <div class="adress" @click.stop.prevent="alertAction">
                                <div class="ad-1 ad">省<img src="../../static/img/btn_drop_down.png"/></div>
                                <div class="ad-1 ad-2">市<img src="../../static/img/btn_drop_down.png"/></div>
                            </div>
                            <input type="text" placeholder="Describe yourself" readonly id="picker-custom-toolbar_7">
                        </div>
                    </li>
                    <li>
                        <div class="left">工种经验</div>
                        <div class="more">
                            <div class="m-1" @click="reduceAction">
                                <img src="../../static/img/jianBlue.png"/>
                            </div>
                            <input class="m-2" v-model="workingExp" readonly/>
                            <div class="m-1" @click="addAction">
                                <img src="../../static/img/jiaBlue.png"/>
                            </div>
                            年
                        </div>
                    </li>
                    <li>
                        <div class="left">工人类型</div>
                        <div class="otherMore">
                            <span @click="oneBtnAction()" :class="{active: littleBigs==0}">大工</span>
                            <span @click="twoBtnAction()" :class="{active: littleBigs==1}">小工</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="footer">
                <div class="f-1" @click="upAction(2)">
                    完善信息（可置顶）
                </div>
                <div class="f-2" @click="upAction(1)"><span>下次完善</span></div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import {userApi, wxApi, tabulateStatisticsApi} from "../api";
    import { LocalCache } from '../lib/utils';
    var pickerDevice;
    var pickerAddress;
    var cityShow;
    export default {
        data(){
            return{
                workerTitle: [],
                name: '',
                mobile: '',
                workType: '',
                workingExp: 1,
                inviterId: '',               //邀请者id;
                littleBigs: 0,
                treatment: [],               //待遇数据

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
        props: ['codem'],
        methods:{
            oneBtnAction(){
                this.littleBigs = 0;
                console.log(this.littleBigs);
            },
            twoBtnAction(){
                this.littleBigs = 1;
                console.log(this.littleBigs);
            },
            alertAction(){
                pickerAddress.open();
            },
            reduceAction(){
                if(this.workingExp == 1){

                }else {
                    this.workingExp--
                }
            },
            addAction(){
                this.workingExp++
            },
            upAction(param){
                if(this.name == ''){
                    this.$f7.alert('请输入姓名');
                    return;
                }
                if(this.mobile == ''){
                    this.$f7.alert('请输入手机号码');
                    return;
                }
                if(this.workType == ''){
                    this.$f7.alert('请选择工种');
                    return;
                }
                if(this.provinceId=='' || this.cityId==''){
                    this.$f7.alert('请选择工作地址');
                    return;
                }
                wxApi.shareAddGroup(
                    this.name,
                    this.mobile,
                    this.workType,
                    this.workingExp,
                    this.provinceId,
                    this.cityId,
                    this.inviterId,
                    this.littleBigs
                ).then((result)=>{
                    console.log(result.data);
                    LocalCache.set('userInfo', result.data);
                    LocalCache.set('sessionkey', result.data.wxSessionkey);
                    this.$store.state.user = result.data;
                    if(param==1){
                        this.$router.load({url: '/user/addFocus/'});
                    }
                    if(param==2){
                        this.$router.load({url: '/user/loginAfterPublic/'});
                    }
                })
            },
            selectCity(){
                let that = this;
                pickerAddress = this.$f7.picker({
                    input: '#picker-custom-toolbar_7',
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
                                $$('.ad').text(displayValue);
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
                                        $$('.ad-2').text(that.cityNameList[0]);
                                        console.log('市',that.cityId,$$('.ad-2').text());
                                        console.log('市列表',that.cityNameList);
                                        console.log('省下市',that.localAddress[value]);
                                        if (pickerAddress.cols[1].replaceValues) {
                                            pickerAddress.cols[1].replaceValues(
                                                that.cityIdList,
                                                that.cityNameList
                                            );
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
                                            $$('.ad-2').text(that.cityNameList[0]);
                                            console.log('市',this.cityId,$$('.ad-2').text());
                                            console.log('市列表2',that.cityNameList);
                                            that.localAddress[that.provinceId].cityObj = cityObj;
                                            console.log('省下的所有市',this.localAddress[that.provinceId]);

                                            if (pickerAddress.cols[1].replaceValues) {
                                                pickerAddress.cols[1].replaceValues(
                                                    that.cityIdList,
                                                    that.cityNameList
                                                );
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
                                    $$('.ad-2').text(displayValue);
                                    that.cityId = value;
                                    console.log('市2',value,displayValue);
                                }

                            }
                        }
                    ],
                    onOpen: (picker)=>{
                        pickerAddress.cols[0].onChange('Picker', that.provinceId);
                        console.log('调用了');
                    }
                });
            },
            selectType(){
                pickerDevice = this.$f7.picker({
                    input: '#picker-device_7',
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
                    onOpen: (p)=>{
                        p.container.find('#btnOk').off('click').click(()=>{
                            let typecode = p.cols[0].value
                            let typename = p.cols[0].displayValue
                            console.log(pickerDevice.cols[0].value);
                            this.workType = typecode;
                            $$('#picker-device_7').text(typename);
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
            }
        },
        mounted(){
            var query = $$.parseUrlQuery(window.location.href);
            console.log(query);
            this.inviterId = query.inviterId;
            console.log('分享页面',this.inviterId);

            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;
                this.selectType();
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=>{
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

            if(this.$store.state.treatment){
                this.treatment = this.$store.state.treatment;
            }else{
                wxApi.getTreatments().then((result)=>{
                    this.treatment = result.data;
                    this.$store.state.treatment = this.treatment;
                })
            }

        }
    }
</script>

<style scoped>
    .page-on-left{
        transform: translate3d(0,0,0);  -webkit-transform: translate3d(0,0,0);
    }
    .page-content{
        width: 100%; height: 100%; background: #fff;
    }
    .nav{
        width: 100%; height: 6.5rem;
    }
    .nav img{
        width: 100%; height: 100%;
    }
    .main{
        width: 100%; box-sizing: border-box; padding-right: 0.7rem;
    }
    .main .aul li{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; margin-top: 0.5rem; position: relative;
    }
    .main .aul li:first-of-type{
        margin-top: 0.8rem;
    }
    .main .aul li .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .main .aul li .right{
        flex: 1; height: 1.9rem; border: 1px solid #E1E1E1; border-radius: 0.2rem; display: flex; box-sizing: border-box; padding-left: 0.5rem; font-size: 0.65rem; color: #666;
    }
    .main .aul li .imgOne{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 8px; top: 0.6rem;
    }

    .main .aul li .more{
        flex: 1; display: flex; line-height: 2rem; box-sizing: border-box; font-size: 0.65rem; color: #666;
    }
    .main .aul li .more .m-1{
        width: 2.5rem; height: 2rem; box-sizing: border-box; text-align: center;
    }
    .main .aul li .more .m-1 img{
        width: 1.01rem; height: 1.01rem; display: inline; padding-top: 0.4rem;
    }
    .main .aul li .more .m-2{
        width: 2.5rem; height: 1rem; line-height: 1rem; text-align: center; border: 1px solid #E7E7E7; border-radius: 0.1rem; margin-top: 0.4rem;
    }

    .main .aul li .otherMore{
        flex: 1;
    }
    .main .aul li .otherMore span{
        font-size: 0.45rem; color: #666; box-sizing: border-box; padding: 0.2rem 0.6rem; border: 1px solid #E7E7E7; border-radius: 0.4rem; margin-right: 0.5rem;
    }
    .main .aul li .otherMore span.active{
        background: #87B4FB; color: #fff;
    }

    .main .aul li .over{
        flex: 1; position: relative;
    }
    .main .aul li .over .adress{
        width: 100%; height: 1.75rem; display: flex;
    }
    .main .aul li .over .adress .ad-1{
        width: 30%; height: 1.5rem; border: 1px solid #ccc; border-radius: 0.4rem; font-size: 0.7rem; color: #438cff; text-align: center; margin-right: 0.75rem;
        line-height: 1.5rem;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 0 0.25rem;
    }
    .main .aul li .over .adress .ad-1 img{
        width: 0.6rem; height: 0.6rem; display: inline-block; position: relative; left: 0.6rem; top: 0;
    }
    .main .aul li .over #picker-custom-toolbar_7{
        width: 76%; height: 1.75rem; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0;
    }

    .footer{
        width: 100%; background: #fff; margin-top: 10px;
    }
    .footer .f-1{
        margin: 0 auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF; margin-top: 0.5rem;
    }
    .footer .f-2{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.6rem; color: #5A99FE;
    }
</style>