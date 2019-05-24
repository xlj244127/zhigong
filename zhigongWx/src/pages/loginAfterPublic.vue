<template>
    <div data-page="editResume" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">完善信息</div>
            </div>
        </div>
        <div class="page-content">
            <div class="avatarPart">
                <img class="part" src="../../static/img/edit_resume_bg.png"/>
                <div class="avatar">
                    <img id="avatar" src="#" alt="">
                </div>
            </div>

            <div class="call">
                <div class="callTop">
                    <span class="fl">称呼</span>
                    <!--链接未写-->
                    <span class="fr" v-if="uncert"><a href="/user/idCardIdentification">去实名认证</a></span><!--增加实名认证判断-->
                </div>
                <div class="callChoose">
                    <span class="defaultCall" v-if="!uncert" @click="chosenCalled(allName)" name="chooseName" :data-id="allName" :class="{callChosen:chosenStatus==1}">{{allName}}</span>
                    <span class="defaultCall" v-if="!uncert" @click="chosenCalled(simpleName)" name="chooseName" :data-id="simpleName" :class="{callChosen:chosenStatus==2}">{{simpleName}}</span>
                    <div class="left"  @click="defined">
                        自定义: <input v-model="enterName" :disabled="enterDisabled" placeholder="请输入姓名" class="defineName"/>
                    </div>
                </div>
            </div>
            <div class="freeTime exp">
                <div class="left">联系方式</div>
                <div class="right-box">
                    <input class="right" v-model="contact" type="number" placeholder="请填写联系方式"/>
                </div>
            </div>
            <div class="cardItem">
                <div class="cardName">
                    <span class="fl">工种标签</span>
                    <span class="fr" @click="addTags" id="pickerDevice03">+ 添加标签</span>
                    <!--<div class="fr">-->
                    <!--<div class="cover" @click.stop.prevent="addTags">添加工种</div>-->
                    <!--<div class="down">-->
                    <!--<input type="text" id="pickerDevice02" readonly/>-->
                    <!--</div>-->
                    <!--</div>-->
                </div>
                <div class="cardMain cardScroll">
                    <span v-for="item in tagList" class="tagItem">
                        <span class="workerType" data-id="item.workerTypeCode">{{item.workerType}}</span><span class="workerSize" data-id="item.workerSizeCode">{{item.workerSize}}</span>
                        <img src="../../static/img/search_close.png" alt="" @click="delTag(item.workerTypeCode)">
                    </span>
                </div>
            </div>
            <div class="exp">
                <div class="left">工作经验</div>
                <div class="more">
                    <div class="m-1" @click="reduceAction">
                        <img src="../../static/img/jianBlue.png"/>
                    </div>
                    <div class="m-2">{{this.workingExp}}</div>
                    <div class="m-1" @click="addAction">
                        <img src="../../static/img/jiaBlue.png"/>
                    </div>
                </div>
            </div>
            <div class="freeTime exp">
                <div class="left">空闲时间</div>
                <div class="right-box">
                    <input class="right" v-model="expectTime" @click.stop.prevent="selectTimeAction" id="calendar-defaulttwo" placeholder="请选择空闲时间" readonly/>
                    <img class="imgOne" src="../../static/img/btn_date.png"/>
                </div>

            </div>
            <div class="aside">
                <div class="left">工作地点</div>
                <div class="over">
                    <div class="adress" @click.stop.prevent="addressAction">
                        <div class="ad-1 ad">省<img src="../../static/img/btn_drop_down.png"/></div>
                        <div class="ad-1 ad-2">市<img src="../../static/img/btn_drop_down.png"/></div>
                    </div>
                    <input type="text" placeholder="Describe yourself" readonly id="picker-toolbar_33">
                </div>
            </div>
            <div class="aside">
                <div class="left">籍贯</div>
                <div class="over">
                    <div class="adress" @click.stop.prevent="addressAction2">
                        <div class="ad-1 ad-3">省<img src="../../static/img/btn_drop_down.png"/></div>
                        <div class="ad-1 ad-4">市<img src="../../static/img/btn_drop_down.png"/></div>
                    </div>
                </div>
            </div>
            <div class="salary">
                <div class="left">薪资待遇</div>
                <div class="you">
                    <div class="ou">
                        <div class="y2">
                            <label @click="selectThreeAction">
                                <input class="y2-1 three" type="radio" name="name" value="3" checked/>&nbsp;面议
                            </label>
                        </div>
                    </div>
                    <div class="ou">
                        <div class="y2">
                            <label @click="selectOneAction">
                                <input class="y2-1 one" type="radio" name="name" value="1" />&nbsp;按天
                            </label>
                        </div>
                        <div class="y3">
                            <input class="y3-1" type="number" v-model="lowestSalary1" placeholder="最低价"  :disabled="isShow!=1"/>
                        </div>
                        <div class="y4">一</div>
                        <div class="y3">
                            <input class="y3-1" type="number" v-model="highestSalary1" placeholder="最高价"  :disabled="isShow!=1"/>
                        </div>
                    </div>
                    <div class="ou">
                        <div class="y2">
                            <label @click="selectTwoAction">
                                <input class="y2-1 two" type="radio" name="name" value="2"/>&nbsp;按时
                            </label>
                        </div>
                        <div class="y3">
                            <input class="y3-1" type="number" v-model="lowestSalary2" placeholder="最低价"  :disabled="isShow!=2"/>
                        </div>
                        <div class="y4">一</div>
                        <div class="y3">
                            <input class="y3-1" type="number" v-model="highestSalary2" placeholder="最高价"  :disabled="isShow!=2"/>
                        </div>
                    </div>
                    <div class="ou">
                        <div class="y2">
                            <label @click="selectFourAction">
                                <input class="y2-1 two" type="radio" name="name" value="4"/>&nbsp;按月
                            </label>
                        </div>
                        <div class="y3">
                            <input class="y3-1" type="number" v-model="lowestSalary4" placeholder="最低价"  :disabled="isShow!=4"/>
                        </div>
                        <div class="y4">一</div>
                        <div class="y3">
                            <input class="y3-1" type="number" v-model="highestSalary4" placeholder="最高价"  :disabled="isShow!=4"/>
                        </div>
                    </div>
                    <div class="ou">
                        <div class="y2">
                            <label @click="selectFiveAction">
                                <input class="y2-1 two" type="radio" name="name" value="5"/>&nbsp;按平方
                            </label>
                        </div>
                        <div class="y3">
                            <input class="y3-1" type="number" v-model="lowestSalary5" placeholder="最低价" :disabled="isShow!=5"/>
                        </div>
                        <div class="y4">一</div>
                        <div class="y3">
                            <input class="y3-1" type="number" v-model="highestSalary5" placeholder="最高价" :disabled="isShow!=5"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="treat">
                <div class="left">待遇需求</div>
                <div class="right">
                    <span class="ret" v-for="(item,index) in treatment" @click="selectTreatment(item)" :data-id="item.code" :class="{ret2:item.checked==true}">{{item.value}}</span>
                </div>
            </div>
            <div class="bot">
                <div class="left">其他说明</div>
                <textarea class="right" v-model="remark" placeholder="请输入说明(选填)">&nbsp;</textarea>
            </div>
            <div class="footer">
                <div class="f-1" @click="saveInfo">
                    <span >保存</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    //workOrPlace判断是调起的工作地址还是籍贯
    var pickerAddress, $$ = Dom7,calendarInline,workTypeDevice, avatar, workOrPlace=0;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    import moment from 'moment';
    import {wxApi,userApi,tabulateStatisticsApi} from "../api";
    import { LocalCache } from "../lib/utils";

    export default {
        name: "editResume",
        data() {
            return {
                id: '',             //编辑时用
                isShow: 3,
                salaryType: '',
                LowestSalary: '',
                highestSalary: '',
                salary: '',
                treatmentCodes: [],               //上传待遇条件
                treatment: [],                    //待遇条件
                proviceList: [],            //以下都是调省市区插件的参数
                proviceIdList: [],
                cityList: [],
                provinceId: '',
                cityIdList: [''],
                cityNameList: [''],
                cityId: '',
                nativeProvinceId: '',
                nativeCityId: '',
                areaList: [],
                areaIdList: [''],
                areaNameList: [''],
                districtId: '',
                localAddress: {}   ,          //省市区的地址全放里面存缓存里
                remark:"",
                workingExp: 1,
                time:'',
                littleBigName: '',
                workerTitle:[],
                tagList: [],
                sizeWork: [{'id': 0, 'name': '大工'},{'id': 1, 'name': '小工'}],
                userId:'',
                uncert:true,
                userDetail:{

                },
                allName:'',
                simpleName:'',
                enterName:'',
                enterDisabled:false,
                editName:"",
                expectTime:'',
                workTypesCode:[],
                littleBigs:[],
                littleBigsCode: [],
                contact:'',
                chosenLength:0,
                chosenStatus:0,
                workTypeList:[],
                lowestSalary:'',
                lowestSalary1:'',
                lowestSalary2:'',
                lowestSalary4:'',
                lowestSalary5:'',
                highestSalary:'',
                highestSalary1:'',
                highestSalary2:'',
                highestSalary4:'',
                highestSalary5:'',
            }
        },
        methods: {
            back(){
                this.tagList = this.$store.state.tagList;
            },
            reduceAction(){
                if(this.workingExp==1){

                }else{
                    this.workingExp--;
                }
            },
            addAction(){
                this.workingExp++;
            },
            selectOneAction(){
                this.isShow = 1;
                this.salaryType = 1;
                this.lowestSalary2 = '';
                this.highestSalary2 = '';
                this.lowestSalary4 = '';
                this.highestSalary4 = '';
                this.lowestSalary5 = '';
                this.highestSalary5 = '';
                this.salary = '';
            },
            selectTwoAction(){
                this.isShow = 2;
                this.salaryType = 2;
                this.lowestSalary1 = '';
                this.highestSalary1 = '';
                this.lowestSalary4 = '';
                this.highestSalary4 = '';
                this.lowestSalary5 = '';
                this.highestSalary5 = '';
                this.salary = '';
            },
            selectFourAction(){
                this.isShow = 4;
                this.salaryType = 4;
                this.lowestSalary2 = '';
                this.highestSalary2 = '';
                this.lowestSalary1 = '';
                this.highestSalary1 = '';
                this.lowestSalary5 = '';
                this.highestSalary5 = '';
                this.salary = '';
            },
            selectFiveAction(){
                this.isShow = 5;
                this.salaryType = 5;
                this.lowestSalary2 = '';
                this.highestSalary2 = '';
                this.lowestSalary4 = '';
                this.highestSalary4 = '';
                this.lowestSalary1 = '';
                this.highestSalary1 = '';
                this.salary = '';
            },
            selectThreeAction(){
                this.isShow = 3;
                this.salaryType = 3;
                this.lowestSalary = '';
                this.highestSalary = '';
                this.salary = '';
            },
            selectTreatment(item){
                $$('.ret').each((xls, elm)=>{
                    if(item.code==$$(elm).data('id')){
                        if($$(elm).hasClass('ret2')==true){
                            $$(elm).removeClass('ret2');
                        }else{
                            $$(elm).addClass('ret2');
                        }
                        console.log('相同code',$$(elm).data('id'));
                    }
                })
            },
            selectTimeAction(){
                calendarInline.open();
            },
            saveInfo(){
                if(this.provinceId=='' || this.cityId==''){
                    this.$f7.alert('请先选择用工地点');
                    return;
                }
                if(this.expectTime==''){
                    this.$f7.alert('请选择空闲时间');
                    return;
                }
                var mobile_reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if(this.contact==""){
                    this.$f7.alert('请选择空闲时间');
                    return;
                }else if(!mobile_reg.test(this.contact)){
                    this.$f7.alert('请输入正确格式的手机号码');
                    return ;
                }
                if($$(".callChosen").length==1){
                    this.editName = $$(".defaultCall.callChosen").data("id")
                }else if(this.enterName!=""){
                    this.editName = this.enterName
                    this.editName = this.editName.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
                    if(this.editName==''){
                        this.$f7.alert('请选择或输入姓名');
                        return;
                    }
                }else{
                    this.$f7.alert('请选择或输入姓名');
                    return;
                }
                console.log('',this.enterName);

                $$('.y2-1').each((xls,elm)=>{
                    if($$(elm).prop("checked")){
                        //console.log($$(elm).val());
                        this.salaryType = $$(elm).val();
                    }
                })
                if(this.salaryType==1){
                    if(this.lowestSalary1==""&&this.highestSalary1==""){
                        this.$f7.alert('请在最低价或最高价中至少填写一个');
                        return;
                    }
                    this.lowestSalary = this.lowestSalary1
                    this.highestSalary = this.highestSalary1

                }
                if(this.salaryType==2){
                    if(this.lowestSalary2==""&&this.highestSalary2==""){
                        this.$f7.alert('请在最低价或最高价中至少填写一个');
                        return;
                    }
                    this.lowestSalary = this.lowestSalary2
                    this.highestSalary = this.highestSalary2
                }
                if(this.salaryType==4){
                    if(this.lowestSalary4==""&&this.highestSalary4==""){
                        this.$f7.alert('请在最低价或最高价中至少填写一个');
                        return;
                    }
                    this.lowestSalary = this.lowestSalary4
                    this.highestSalary = this.highestSalary4
                }
                if(this.salaryType==5){
                    if(this.lowestSalary5==""&&this.highestSalary5==""){
                        this.$f7.alert('请在最低价或最高价中至少填写一个');
                        return;
                    }
                    this.lowestSalary = this.lowestSalary5
                    this.highestSalary = this.highestSalary5
                }
                if(this.salaryType != 3){
                    if(this.lowestSalary=='') {
                        this.salary = this.highestSalary
                    }else if(this.highestSalary=='') {
                        this.salary = this.lowestSalary
                    }else if(this.highestSalary!='' && this.lowestSalary!='' ){
                        this.salary = this.lowestSalary + '-' + this.highestSalary
                    }
                }else{
                    this.salary = ""
                }

                this.treatmentCodes = []
                $$('.ret2').each((xls,elm)=>{
                    $$(elm).data('id');
                    this.treatmentCodes.push($$(elm).data('id'));
                    //console.log($$(elm).data('id'));
                })
                //this.workTypesCode,this.littleBigs
                this.workTypesCode = [];
                this.littleBigsCode = [];
                console.log('工种和大小工2',this.tagList);
                for(var q=0;q<this.tagList.length;q++){
                    this.workTypesCode.push(this.tagList[q].workerTypeCode)
                    this.littleBigsCode.push(this.tagList[q].workerSizeCode)
                }
                console.log("after For",this.treatmentCodes, this.workTypesCode, this.littleBigsCode)
                if(this.workTypesCode.length<=0){
                    this.$f7.alert('请选择工种类型');
                    return;
                }
                //name, avatar, workingExp, provinceId, cityId, contact, remark, expectTime, workTypes, littleBigs, treatments, salaryType, salary, userId
                //console.log(this.editName,this.workingExp,this.provinceId,this.cityId,this.contact,this.remark,this.expectTime,this.districtId,this.detailAddress,this.salaryType,this.salary,this.treatmentCodes.join(','),this.tlementsCode,this.remark);
                wxApi.save(
                    this.editName,
                    avatar,
                    this.workingExp,
                    this.provinceId,
                    this.cityId,
                    this.nativeProvinceId,
                    this.nativeCityId,
                    this.contact,
                    this.remark,
                    this.expectTime,
                    this.workTypesCode.join(","),
                    this.littleBigsCode.join(","),
                    this.treatmentCodes.join(','),
                    this.salaryType,
                    this.salary,
                    this.userId
                ).then((result)=>{
                    console.log(result.data);
                    this.$router.load({url: '/user/addFocus/'});
                })
            },
            addressAction(){
                workOrPlace = 1;
                pickerAddress.open();
            },
            addressAction2(){
                workOrPlace = 2;
                pickerAddress.open();
            },
            addTags(){
                this.$router.load({url: '/user/selectType/3/:arguments'})
            },
            selectCity(){
                let that = this;
                pickerAddress = this.$f7.picker({
                    input: '#picker-toolbar_33',
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
                                if(workOrPlace==1){
                                    $$('.ad').text(displayValue);
                                    that.provinceId = value;
                                    console.log('省名字2',displayValue);
                                }
                                if(workOrPlace==2){
                                    $$('.ad-3').text(displayValue);
                                    that.nativeProvinceId = value;
                                    console.log('省名字3',displayValue);
                                }
                                if(that.localAddress[value].cityObj){
                                    if(value == pickerAddress.cols[0].value){
                                        that.cityIdList = [];
                                        that.cityNameList = [];
                                        for(var key in that.localAddress[value].cityObj){
                                            that.cityIdList.unshift(that.localAddress[value].cityObj[key].id);
                                            that.cityNameList.unshift(that.localAddress[value].cityObj[key].name);
                                        }
                                        if(workOrPlace==1){
                                            that.cityId = that.cityIdList[0];
                                            $$('.ad-2').text(that.cityNameList[0]);
                                        }
                                        if(workOrPlace==2){
                                            that.nativeCityId = that.cityIdList[0];
                                            $$('.ad-4').text(that.cityNameList[0]);
                                        }
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
                                    userApi.addressCityList(value).then((result)=> {
                                        if(value == pickerAddress.cols[0].value){
                                            that.cityList = result.data.list;
                                            that.cityIdList = [];
                                            that.cityNameList = [];
                                            for(var i=0; i<that.cityList.length; i++){
                                                cityObj[that.cityList[i].id] = that.cityList[i];
                                                that.cityIdList.unshift(that.cityList[i].id);
                                                that.cityNameList.unshift(that.cityList[i].name);
                                            }
                                            if(workOrPlace==1){
                                                that.cityId = that.cityIdList[0];
                                                $$('.ad-2').text(that.cityNameList[0]);
                                            }
                                            if(workOrPlace==2){
                                                that.nativeCityId = that.cityIdList[0];
                                                $$('.ad-4').text(that.cityNameList[0]);
                                            }
                                            console.log('市',this.cityId,$$('.ad-2').text());
                                            console.log('市列表2',that.cityNameList);
                                            that.localAddress[value].cityObj = cityObj;
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
                                    if(workOrPlace==1){
                                        that.cityId = value;
                                        $$('.ad-2').text(displayValue);
                                    }
                                    if(workOrPlace==2){
                                        that.nativeCityId = value;
                                        $$('.ad-4').text(displayValue);
                                    }
                                }
                            }
                        }
                    ],
                    onClose: (picker)=>{
                        if(workOrPlace==1){
                            console.log('打开',that.provinceId,$$('.ad').text());
                            pickerAddress.cols[0].activeIndex = $$('.ad').text();
                            // pickerAddress.cols[0].onChange('Picker', that.provinceId, $$('.ad').text());
                        }
                        if(workOrPlace==2){
                            console.log('打开2',that.nativeProvinceId,$$('.ad-3').text());
                            pickerAddress.cols[0].activeIndex = $$('.ad-3').text();
                            // pickerAddress.cols[0].onChange('Picker', that.nativeProvinceId, $$('.ad-3').text());
                        }
                    }
                });
            },
            delTag(val){
                console.log(this.tagList.findIndex(v => v.workerTypeCode === val));
                this.tagList.splice(this.tagList.findIndex(v => v.workerTypeCode === val),1)
                this.workTypesCode.splice(this.tagList.findIndex(v => v.workerTypeCode === val),1)
                this.littleBigsCode.splice(this.tagList.findIndex(v => v.workerTypeCode === val),1)
                console.log("delTags",this.workTypesCode,this.littleBigsCode);
                this.$store.state.tagList = this.tagList;
                console.log(this.$store.state.tagList);
            },
            chosenCalled(item){
                $$('.defaultCall').each((xls, elm)=>{
                    if(item==$$(elm).data('id')){
                        if($$(elm).hasClass('callChosen')==true){
                            $$(elm).removeClass('callChosen');
                        }else{
                            $$(elm).addClass('callChosen');
                        }
                        //console.log('相同code',$$(elm).data('id'));
                    }else{
                        $$(elm).removeClass('callChosen');
                    }
                })
                this.chosenLength = 1
                this.enterDisabled = true
            },
            defined(){
                $$('.defaultCall').each((xls, elm)=>{
                    if($$(elm).hasClass('callChosen')==true){
                        $$(elm).removeClass('callChosen');
                    }
                    //console.log('相同code',$$(elm).data('id'));
                })
                this.chosenLength = 0
                this.enterDisabled = false
            }
        },
        beforeMount(){
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

            let that = this
            calendarInline = this.$f7.calendar({
                input: '#calendar-defaulttwo',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    that.expectTime = $day;
                    p.close();
                    that.$f7.closeModal();
                }
            });

            if(this.$store.state.treatment){
                this.treatment = this.$store.state.treatment;
            }else{
                wxApi.getTreatments().then((result)=>{
                    this.treatment = result.data;
                    this.$store.state.treatment = this.treatment;
                })
            }

        },
        mounted(){
            this.$store.state.tagList = [];   //每次进来工种缓存先清空
            this.userId = this.$store.state.user.id;
            console.log('用户id',this.userId,this.$store.state.user);
            wxApi.userInfo(this.userId).then((result)=>{
                console.log('用户有无简历',result.data);
                if(result.data){
                    this.userCard = result.data;
                    console.log("this.userCard",this.userCard);
                    console.log(this.userCard.user.avatar);
                    console.log(this.userCard.user.avatar+'?'+Math.random());
                    $$('#avatar').attr('src', this.userCard.user.avatar+'?'+Math.random())
                    if(this.$store.state.user.userDetail && this.$store.state.user.userDetail.idNumber){
                        this.uncert = false
                        this.allName = this.$store.state.user.name
                        this.simpleName = this.$store.state.user.name.substring(0,1)+"工"
                        if(this.allName == result.data.displayName){
                            this.chosenStatus = 1
                        }else if(this.simpleName == result.data.displayName){
                            this.chosenStatus = 2
                        }else{
                            this.enterName = result.data.displayName
                            this.chosenStatus = 0
                        }
                    }else{
                        this.uncert = true
                        this.enterName = result.data.displayName
                    }
                    this.contact = this.userCard.user.mobile
                    this.cityId = this.userCard.user.cityId
                    this.provinceId = this.userCard.user.provinceId
                    this.nativeCityId = this.userCard.nativeCityId
                    this.nativeProvinceId = this.userCard.nativeProvinceId
                    this.workingExp = this.userCard.user.workingExp
                    this.expectTime = moment(this.userCard.expectTime).format('YYYY-MM-DD')
                    this.avatar = this.userCard.user.avatar
                    this.remark = this.userCard.user.remark

                    console.log('工种和大小工', this.userCard.workTypes, this.userCard.littleBigs)
                    this.workTypesCode = this.userCard.workTypes.split(",")
                    this.littleBigsCode = this.userCard.littleBigs.split(",")
                    for(var i=0;i<this.workTypesCode.length;i++){
                        if(this.littleBigsCode[i]==0){
                            this.littleBigs.push("大工")
                        }else if(this.littleBigsCode[i]==1){
                            this.littleBigs.push("小工")
                        }
                    }
                    console.log('工种和大小工', this.workTypesCode, this.littleBigsCode)
                    this.tagList = []
                    if(this.userCard.workTypes!=""){
                        for(var k=0;k<this.workTypesCode.length;k++){
                            console.log(this.workerTitle.findIndex(v => v.code == this.userCard.workTypes.split(',')[k]));
                            let obj={
                                workerType:this.workerTitle[this.workerTitle.findIndex(v=>v.code==this.userCard.workTypes.split(',')[k])].value,
                                workerTypeCode:this.workTypesCode[k],
                                workerSize:this.littleBigs[k],
                                workerSizeCode:this.littleBigsCode[k],
                            }
                            this.tagList.push(obj)
                        }
                    }
                    console.log('工种和大小工', this.tagList)

                    if(this.userCard.user.cityId){
                        $$('.ad-2').text(this.userCard.user.city);
                    }
                    if(this.userCard.user.provinceId){
                        $$('.ad').text(this.userCard.user.province);
                    }
                    if(this.userCard.nativeProvinceId){
                        $$('.ad-3').text(this.userCard.nativeProvinceName);
                    }
                    if(this.userCard.nativeCityId){
                        $$('.ad-4').text(this.userCard.nativeCityName);
                    }

                    this.salaryType = this.userCard.salaryType
                    this.isShow = this.userCard.salaryType
                    $$('.y2-1').each((xls,elm)=>{
                        if($$(elm).val()==this.salaryType){
                            $$(elm).prop("checked", true);
                        }
                    })
                    this.salary = this.userCard.salary
                    if(this.userCard.salaryType==1){
                        console.log(this.userCard.salary.indexOf("3") != -1 )
                        if(this.userCard.salary.indexOf("-")==-1){
                            this.lowestSalary1 = this.userCard.salary
                        }else{
                            this.lowestSalary1 = this.userCard.salary.split('-')[0]
                            this.highestSalary1 = this.userCard.salary.split('-')[1]
                        }
                        console.log('显示3',this.lowestSalary1,this.highestSalary1,this.salary)
                    }else if(this.userCard.salaryType==2){
                        if(this.userCard.salary.indexOf("-")==-1){
                            this.lowestSalary2 = this.userCard.salary
                        }else {
                            this.lowestSalary2 = this.userCard.salary.split('-')[0]
                            this.highestSalary2 = this.userCard.salary.split('-')[1]
                        }
                    }else if(this.userCard.salaryType==4){
                        if(this.userCard.salary.indexOf("-")==-1){
                            this.lowestSalary4 = this.userCard.salary
                        }else {
                            this.lowestSalary4 = this.userCard.salary.split('-')[0]
                            this.highestSalary4 = this.userCard.salary.split('-')[1]
                        }
                    }else if(this.userCard.salaryType==5){
                        if(this.userCard.salary.indexOf("-")==-1){
                            this.lowestSalary5 = this.userCard.salary
                        }else {
                            this.lowestSalary5 = this.userCard.salary.split('-')[0]
                            this.highestSalary5 = this.userCard.salary.split('-')[1]
                        }
                    }

                    if(this.$store.state.treatment){
                        this.treatment = this.$store.state.treatment;
                        for(var o=0;o<this.userCard.treatments.split(",").length;o++){
                            console.log('待遇3',this.treatment.findIndex(v=>v.code==this.userCard.treatments.split(",")[o]))
                            this.treatment[this.treatment.findIndex(v=>v.code==this.userCard.treatments.split(",")[o])].checked = true
                        }
                    }

                }else{
                    console.log('进了这里')
                    $$('#avatar').attr('src', this.$store.state.user.avatar)
                    this.enterName = this.$store.state.user.name
                    this.contact = this.$store.state.user.mobile
                    this.cityId = this.$store.state.user.cityId
                    this.provinceId = this.$store.state.user.provinceId
                    this.workingExp = this.$store.state.user.workingExp
                    if(this.$store.state.user.cityId){
                        $$('.ad-2').text(this.$store.state.user.city);
                    }
                    if(this.$store.state.user.provinceId){
                        $$('.ad').text(this.$store.state.user.province);
                    }

                    if(this.$store.state.user.littleBig==0){
                        this.littleBigName = '大工'
                    }
                    if(this.$store.state.user.littleBig==1){
                        this.littleBigName = '小工'
                    }
                    let obj={
                        workerType: this.$store.state.user.workTypeName,
                        workerTypeCode: this.$store.state.user.workType,
                        workerSize: this.littleBigName,
                        workerSizeCode: this.$store.state.user.littleBig,
                    }
                    this.tagList.push(obj)
                    console.log('取到了值',this.tagList)

                }
            })
        }
    }

</script>

<style  scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .avatarPart{
        width: 100%; height: 4.5rem; position: relative;
    }
    .avatarPart .part{
        width: 100%; height: 100%; display: block;
    }
    .avatarPart .fix{
        position: absolute; right: 14px; bottom: 9px; font-size: 0.55rem; color: #fff;
    }
    .avatar{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3rem;
        height: 3rem;
        background: #ffffff;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        overflow: hidden;
        margin-top: -1.5rem;
        margin-left: -1.5rem;
    }
    .avatar img{
        width: 3rem;
        height: 3rem;
    }
    .salary{
        width: 100%; display: flex; margin-top: 0.25rem; background: #fff; box-sizing: border-box; padding: 0.5rem 0 0.2rem 0;
    }
    .salary .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .salary .you{
        flex: 1; font-size: 0.55rem; color: #666;
    }
    .salary .you .ou{
        display: flex; height: 22px; margin-top: 0.6rem;
    }
    .salary .you .ou:first-of-type{
        margin-top: 0;
    }
    .salary .you .ou:last-of-type{
        height: 25px;
    }
    .salary .you .ou .y2{
        width: 56px; margin-left: 0.5rem; margin-right: 0.3rem;
    }
    .salary .you .ou .y2 label{
        display: inline-block; width: 100%; height: 100%;
    }
    .salary .you .ou .y2 .y2-1{
        transform: translateY(0.1rem);
    }

    .salary .you .ou .y3 .y3-1{
        width: 3.25rem; height: 1rem; line-height: 1rem; text-align: center; border: 1px solid #E1E1E1; border-radius: 0.2rem;
        font-size: 0.55rem; color: #666;
    }
    .salary .you .ou .y4{
        transform: translateY(4px);
    }

    .treat{
        width: 100%; display: flex; margin-top: 8px;
    }
    .treat .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .treat .right{
        min-height: 32px; flex: 1; padding-left: 8px;
    }
    .treat .right .ret,.callChoose .defaultCall{
        display: inline-block; box-sizing: border-box; padding: 4px 14px; border: 1px solid #92BCFF; border-radius: 9px; font-size: 0.45rem;
        margin-right: 0.6rem; margin-bottom: 0.6rem; color: #438CFF;
    }
    .treat .right .ret2,.callChoose .callChosen{
        background: #438CFF; color: #fff;
    }
    .treat .right .ret:last-of-type{
        margin-right: 0;
    }
    .bot{
        width: 100%; min-height: 3.9rem; display: flex; margin-top: 0.6rem; margin-bottom: 4rem;
    }
    .bot .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .bot .right{
        flex: 1; padding-left: 8px; color: #666; border: 1px solid #E1E1E1;
    }

    .footer{
        width: 100%; background: #fff; position: fixed; left: 0; bottom: 0;
    }
    .footer .f-1{
        margin: 0 auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF; margin-bottom: 0.5rem; margin-top: 0.5rem;
    }

    .aside{
        width: 100%; height: 3rem; line-height: 3rem; display: flex; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .aside .left{
        width: 4rem;
    }
    .aside .over{
        position: relative; flex: 1;
    }
    .aside .over .adress{
        width: 100%; height: 1.75rem; display: flex; margin-top: 0.7rem;
    }
    .aside .over .adress .ad-1{
        width: 30%; height: 1.75rem; border: 1px solid #ccc; border-radius: 0.4rem; font-size: 0.7rem; color: #438cff; text-align: center; margin-right: 1rem;
        line-height: 1.75rem;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 0 0.1rem;
    }
    .aside .over .adress .ad-1 img{
        width: 0.6rem; height: 0.6rem; display: inline-block; position: relative; left: 0.6rem; top: 0.1rem;
    }
    .aside .over #picker-toolbar_33{
        width: 100%; height: 1.75rem; position: absolute; left: 0; top: 0.7rem; z-index: -1;
    }
    .exp{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; margin-top: 0.2rem; position: relative;box-sizing: border-box; background: #fff;
        margin-bottom: .2rem;
    }

    .exp .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .exp .right{
        flex: 1; height: 1.9rem; border: 1px solid #E1E1E1; border-radius: 0.2rem; display: flex; box-sizing: border-box; padding-left: 0.5rem;
        font-size: 0.65rem; color: #666; position: relative;
    }

    .exp .more{
        flex: 1; display: flex; box-sizing: border-box; font-size: 0.65rem; color: #666;
    }
    .exp .more .m-1{
        width: 2.5rem; height: 2rem; box-sizing: border-box; text-align: center;
    }
    .exp .more .m-1 img{
        width: 0.8rem; height: 0.8rem; display: inline; padding-top: 0.5rem;
    }
    .exp .more .m-2{
        width: 2.5rem; height: 1rem; line-height: 1rem; text-align: center; border: 1px solid #E7E7E7; border-radius: 0.1rem; margin-top: 0.4rem;
    }
    .exp .imgOne{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 20%; top: 0.5rem;
    }
    .cardItem{
        padding: .5rem  .6rem;
        background: #ffffff;
        margin-top: .2rem;
    }
    .cardItem .cardName{
        overflow: hidden;
    }
    .cardName .fr{
        color:#7e91b6;
        font-size: .7rem;
    }
    .cardName .fl{
        font-size: .7rem;
    }
    .tagItem{
        -webkit-border-radius: 15px;
        -moz-border-radius: 15px;
        border-radius: 15px;
        padding: 3px 6px;
        line-height: 16px;
        display: inline-block;
        margin-right: 6px;
        border: 1px solid #ddd;
        margin-top:  10px;
        position: relative;
    }
    .tagItem img{
        position: absolute;
        right: -7px;
        top: -7px;
        width: 15px;
        height: 15px;
    }
    .tagItem  .workerType{
        font-size: 14px;
        color: #7e91b6;
        padding-right: 4px;
        border-right: 1px solid #ddd;
    }
    .tagItem  .workerSize{
        font-size: 12px;
        color: #B4C1DA;
        padding-left: 4px;
    }
    .freeTime.exp .right{
        width: 80%;
        position: relative;
        height: 1.5rem;
        margin-top: 0.2rem;
    }
    .defineName{
        width: 60%;
        border: 1px solid #E1E1E1; border-radius: 0.2rem;
        box-sizing: border-box;
        height: 1.5rem;
        text-indent: .2rem;
    }
    .right-box{
        flex: 2;
    }
    .fl {
        float: left;
    }
    .fr{
        float: right;
    }
    .callTop{
        overflow: hidden;
    }
    .call{
        background-color: #ffffff;
        padding: 0.5rem 0.6rem;
        margin-bottom: .2rem;
    }
    .callTop .fl{
        font-size: 0.8rem;
    }
    .callTop .fr{
        font-size: .6rem;
        padding: .1rem .3rem;
        background-color: #F77649;
        -webkit-border-radius: 0.2rem;
        -moz-border-radius: 0.2rem;
        border-radius: 0.2rem;
    }
    .callTop .fr a{
        color: #ffffff;
    }
    .treat .right .ret{
        display: inline-block; box-sizing: border-box; padding: 4px 14px; border: 1px solid #92BCFF; border-radius: 9px; font-size: 0.45rem;
        margin-right: 0.6rem; margin-bottom: 0.4rem; color: #438CFF;
    }
    .treat .right .ret2,.callChoose .callChosen{
        background: #438CFF; color: #fff;
    }
    .treat,.bot{
        width: 100%; box-sizing: border-box; background: #fff; padding: 0.4rem 1.4rem 0.2rem 0.2rem;
        margin-top: .2rem;
    }
    .page-content{
        padding-bottom: 44px;
        background: #eeeeee;
    }
    .left {
        color: #333333 !important;
    }
    .callChoose .defaultCall{
        margin-bottom: .4rem;
        margin-top: .2em;
    }
</style>