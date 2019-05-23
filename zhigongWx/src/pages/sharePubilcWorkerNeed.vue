<template>
    <div data-page="pubilcWorkerNeed" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">发布用工需求</div>
            </div>
        </div>
        <div class="page-content">
            <div class="box">
                <div class="head">
                    <div class="left">联系人</div>
                    <input class="right" type="text" v-model="name" maxlength="10" placeholder="请输入联系人称呼(必填)">
                </div>
                <div class="head">
                    <div class="left">联系电话</div>
                    <input class="right" type="text" v-model="mobile" maxlength="11" placeholder="请输入联系电话(必填)">
                </div>
            </div>
            <div class="head2">
                <div class="left">用工标题</div>
                <input class="right" type="text" v-model="title" maxlength="20" placeholder="请输入用工标题">
            </div>
            <div class="main">
                <ul class="aul">
                    <li>
                        <div class="left">招工类型</div>
                        <div class="more">
                            <label  class="demandTypeLabel" v-for="(item,index) in demandTypeList">
                                <div>
                                    <input class="demandTypeItem" type="radio" name="demandType" :value="item.code"/>&nbsp;{{item.value}}
                                </div>
                            </label>
                        </div>
                    </li>
                    <li>
                        <div class="left">工种需求</div>
                        <div class="right" @click.stop.prevent="addTypeAction">
                            <div class="one_6">{{this.typename}}</div>
                            <!--<input class="two_6" id="picker-deviceone" placeholder="请选择工种类型"/>-->
                        </div>
                        <img class="imgOne" src="../../static/img/btn_right.png"/>
                    </li>
                    <li>
                        <div class="left">用工时间</div>
                        <input class="right" v-model="time" @click.stop.prevent="selectTimeAction" id="calendar-defaulttwo" placeholder="请选择预计用工时间"/>
                        <img class="imgOne" src="../../static/img/btn_date.png"/>
                    </li>
                    <li>
                        <div class="left">人数需求</div>
                        <div class="more">
                            <div class="m-1" @click="reduceAction">
                                <img src="../../static/img/jianBlue.png"/>
                            </div>
                            <div class="m-2">{{this.demandAmount}}</div>
                            <div class="m-1" @click="addAction">
                                <img src="../../static/img/jiaBlue.png"/>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="left">用工地点</div>
                        <div class="over">
                            <div class="adress" @click.stop.prevent="alertAction">
                                <div class="ad-1 ad">省<img src="../../static/img/btn_drop_down.png"/></div>
                                <div class="ad-1 ad-2">市<img src="../../static/img/btn_drop_down.png"/></div>
                                <div class="ad-1 ad-3">区<img src="../../static/img/btn_drop_down.png"/></div>
                            </div>
                            <input type="text" placeholder="Describe yourself" readonly id="picker-toolbarthree">
                        </div>
                    </li>
                    <li>
                        <div class="left"></div>
                        <input class="right" type="text" v-model="detailAddress" placeholder="请输入详细地址（选填）">
                    </li>
                </ul>
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
            <div class="main2">
                <div class="treat">
                    <div class="left">待遇条件</div>
                    <div class="right">
                        <span class="ret" v-for="(item,index) in treatment" @click="selectTreatment(item)" :data-id="item.code">{{item.value}}</span>
                    </div>
                </div>
                <div class="select">
                    <div class="left">结算方式</div>
                    <div class="right">
                        <div class="up" @click.stop.prevent="selectExplain">{{this.tlementsName}}</div>
                        <img class="im" src="../../static/img/btn_right.png"/>
                    </div>
                </div>
                <div class="bot">
                    <div class="left">其他说明</div>
                    <textarea class="right" v-model="remark" placeholder="请输入说明(选填)">&nbsp;</textarea>
                </div>
            </div>
            <div class="footer">
                <div class="f-1" @click="comfigPublic">
                    <span v-if="this.status==0">确认发布</span>
                    <span v-else>确认修改</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { tabulateStatisticsApi, userApi, wxApi} from '../api';
    import { LocalCache } from '../lib/utils';
    import moment from 'moment';
    var pickerDevice, calendarInline, pickerAddress;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    var cityShow = false, areaShow = false;
    export default {
        data(){
            return{
                status: 0,          //判定是发布还是修改（发布时为0，编辑时为班组id）
                id: '',             //编辑时用
                isShow: 1,
                workerTitle: [],
                typecode: '',
                typename: '请选择工种类型',
                time: '',
                detailAddress: '',
                salaryType: '',
                salary: '',
                remark: '',
                name: '',
                mobile: '',
                title: '',
                demandAmount: 1,
                salaryType: '',
                salary: '',
                treatmentCodes: [],               //上传待遇条件
                tlementsName: '请选择结算方式',
                tlementsCode: '',
                treatment: [],                    //待遇条件
                tlements: [],                     //工资结算方式
                proviceList: [],            //以下都是调省市区插件的参数
                proviceIdList: [],
                cityList: [],
                provinceId: '',
                cityIdList: [''],
                cityNameList: [''],
                cityId: '',
                areaList: [],
                areaIdList: [''],
                areaNameList: [''],
                districtId: '',
                localAddress: {} ,            //省市区的地址全放里面存缓存里
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
                demandTypeList:[],
                demandType:0,
            }
        },
        created(){
            if(this.$store.state.treatment){
                this.treatment = this.$store.state.treatment;
            }else{
                wxApi.getTreatments().then((result)=>{
                    console.log('待遇条件',result.data);
                    this.treatment = result.data;
                    this.$store.state.treatment = this.treatment;
                })
            }
            if(this.$store.state.tlements){
                this.tlements = this.$store.state.tlements;
            }else {
                wxApi.getTlements().then((result) => {
                    console.log('工资结算方式', result.data);
                    this.tlements = result.data;
                    this.$store.state.tlements = this.tlements;
                })
            }
            if(this.$store.state.demandTypeList){
                this.demandTypeList = this.$store.state.demandTypeList;
            }else {
                wxApi.demandTypeWorkType().then((result) => {
                    this.demandTypeList = result.data;
                    this.$store.state.demandTypeList = this.demandTypeList;
                })
            }
        },
        methods:{
            back(){
                if(this.$store.state.paramCode){
                    this.typecode = this.$store.state.paramCode.split('_')[0];
                    this.typename = this.$store.state.paramCode.split('_')[1];
                }
                console.log('返回值',this.$store.state.paramCode,this.typecode,this.typename);
            },
            selectTimeAction(){
                calendarInline.open();
            },
            addTypeAction(){
                console.log('我点击了');
                this.$router.load({url: '/user/selectTypeAddSize/2/:id/'})
            },
            reduceAction(){
                if(this.demandAmount==1){

                }else{
                    this.demandAmount--;
                }
            },
            addAction(){
                this.demandAmount++;
            },
            alertAction(){
                pickerAddress.open();
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
            selectExplain(){
                let buttons = [];
                for (var i = 0; i < this.tlements.length; i++) {
                    let value = this.tlements[i].value;
                    let index = this.tlements[i].code;
                    buttons.push({
                        text: value,
                        onClick: () => {
                            this.tlementsName = value;
                            this.tlementsCode = index;
                        }
                    })
                }
                buttons.push(
                    {
                        text: '<div style="width: 100%; color: red">取消</div>',
                        onClick: ()=>{
                            this.$f7.closeModal();
                        }
                    }
                )
                this.$f7.modal({
                    title: '请选择工资结算方式',
                    verticalButtons: true,
                    buttons
                })
            },
            comfigPublic(){
                $$('.demandTypeItem').each((xls,elm)=>{
                    if($$(elm).prop("checked")){
                        console.log($$(elm).val());
                        this.demandType = $$(elm).val();
                    }
                })
                this.treatmentCodes = [];         //待遇条件code
                if(this.name==''){
                    this.$f7.alert('请输入您的名字');
                    return;
                };
                if(this.mobile==''){
                    this.$f7.alert('请输入您的电话');
                    return;
                };
                if(this.typecode==''){
                    this.$f7.alert('请选择工种类型');
                    return;
                }
                if(this.provinceId=='' || this.cityId=='' || this.districtId==''){
                    this.$f7.alert('请先选择用工地点');
                    return;
                }
                if(this.time==''){
                    this.$f7.alert('请选择用工时间');
                    return;
                }

                $$('.y2-1').each((xls,elm)=>{
                    if($$(elm).prop("checked")){
                        console.log($$(elm).val());
                        if($$(elm).val()==3){
                            this.salaryType = $$(elm).val();
                        }else{
                            this.salaryType = $$(elm).val();
                        }
                    }
                })
                if(this.salaryType==1){
                    if(this.lowestSalary1==""&&this.highestSalary1==""){
                        this.$f7.alert('请在最低价或最高价中至少填写一个');
                        return;
                    }
                    this.lowestSalary = this.lowestSalary1
                    this.highestSalary = this.highestSalary1

                }else if(this.salaryType==2){
                    if(this.lowestSalary2==""&&this.highestSalary2==""){
                        this.$f7.alert('请在最低价或最高价中至少填写一个');
                        return;
                    }
                    this.lowestSalary = this.lowestSalary2
                    this.highestSalary = this.highestSalary2
                }else if(this.salaryType==4){
                    if(this.lowestSalary4==""&&this.highestSalary4==""){
                        this.$f7.alert('请在最低价或最高价中至少填写一个');
                        return;
                    }
                    this.lowestSalary = this.lowestSalary4
                    this.highestSalary = this.highestSalary4
                }else if(this.salaryType==5){
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
                $$('.ret2').each((xls,elm)=>{
                    $$(elm).data('id');
                    this.treatmentCodes.push($$(elm).data('id'));
                    console.log($$(elm).data('id'));
                })
                console.log(this.name, this.mobile, this.title,this.typecode,this.time,this.demandAmount,this.provinceId,this.cityId,this.districtId,this.detailAddress,this.salaryType,this.salary,this.treatmentCodes.join(','),this.tlementsCode,this.remark);

                wxApi.sharePublishWorkDemand(
                    this.name,
                    this.mobile,
                    this.title,
                    this.typecode,
                    this.time,
                    this.demandAmount,
                    this.provinceId,
                    this.cityId,
                    this.districtId,
                    this.detailAddress,
                    this.salaryType,
                    this.salary,
                    this.treatmentCodes.join(','),
                    this.tlementsCode,
                    this.remark,
                    this.demandType
                ).then((result)=>{
                    console.log(result.data);
                    this.$router.load({url: '/user/addFocus'});
                })
            },
            selectCity(){
                let that = this;
                pickerAddress = this.$f7.picker({
                    input: '#picker-toolbarthree',
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
                                            userApi.addressAreaList(that.cityId).then((result)=>{
                                                that.areaList = result.data.list;
                                                that.areaIdList = [];
                                                that.areaNameList = [];
                                                for(var i=0; i<that.areaList.length; i++){
                                                    that.areaIdList.unshift(that.areaList[i].id);
                                                    that.areaNameList.unshift(that.areaList[i].name);
                                                }
                                                console.log('区列表2',that.areaNameList);

                                                if (pickerAddress.cols[2].replaceValues) {
                                                    pickerAddress.cols[2].replaceValues(
                                                        that.areaIdList,
                                                        that.areaNameList
                                                    );
                                                    that.districtId = that.areaIdList[0];
                                                    $$('.ad-3').text(that.areaNameList[0]);
                                                    console.log('区2',this.districtId,$$('.ad-3').text());

                                                }
                                            })
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
                                                userApi.addressAreaList(that.cityId).then((result)=>{
                                                    that.areaList = result.data.list;
                                                    that.areaIdList = [];
                                                    that.areaNameList = [];
                                                    for(var i=0; i<that.areaList.length; i++){
                                                        that.areaIdList.unshift(that.areaList[i].id);
                                                        that.areaNameList.unshift(that.areaList[i].name);
                                                    }
                                                    console.log('区列表2',that.areaNameList);

                                                    if (pickerAddress.cols[2].replaceValues) {
                                                        pickerAddress.cols[2].replaceValues(
                                                            that.areaIdList,
                                                            that.areaNameList
                                                        );
                                                        that.districtId = that.areaIdList[0];
                                                        $$('.ad-3').text(that.areaNameList[0]);
                                                        console.log('区2',this.districtId,$$('.ad-3').text());

                                                    }
                                                })

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

                                    userApi.addressAreaList(that.cityId).then((result)=>{
                                        if(value == pickerAddress.cols[1].value){
                                            that.areaList = result.data.list;

                                            that.areaIdList = [];
                                            that.areaNameList = [];
                                            for(var i=0; i<that.areaList.length; i++){
                                                that.areaIdList.unshift(that.areaList[i].id);
                                                that.areaNameList.unshift(that.areaList[i].name);
                                            }
                                            console.log('区列表2',that.areaNameList);

                                            if (pickerAddress.cols[2].replaceValues) {
                                                pickerAddress.cols[2].replaceValues(
                                                    that.areaIdList,
                                                    that.areaNameList
                                                );
                                                that.districtId = that.areaIdList[0];
                                                $$('.ad-3').text(that.areaNameList[0]);
                                                console.log('区2',this.districtId,$$('.ad-3').text());

                                            }
                                        }
                                    })
                                    pickerAddress.cols[2].onChange();
                                }
                            }
                        },
                        {
                            values: that.areaIdList,
                            displayValues: that.areaNameList,
                            onChange: (Picker, value, displayValue)=>{
                                if(value){
                                    $$('.ad-3').text(displayValue);
                                    that.districtId = value;
                                    console.log('区', that.districtId,$$('.ad-3').text());
                                }
                            }
                        },
                    ],
                    onOpen: (picker)=>{
                        pickerAddress.cols[0].onChange('Picker', that.provinceId);
                        console.log('调用了');
                    }
                });
            }
        },
        mounted(){
            this.workGroupId = this.$store.state.workGroupId;
            this.status = this.$route.params.id;
            console.log(this.status);

            var that = this;
            calendarInline = this.$f7.calendar({
                input: '#calendar-defaulttwo',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    that.time = $day;
                    p.close();
                    that.$f7.closeModal();
                }
            });
            $$('.demandTypeItem').each((xls,elm)=>{
                if($$(elm).val()==this.demandType){
                    $$(elm).prop("checked",true);
                }
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
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .box{
        background: #fff;
    }
    .box .head{
        width: 100%; height: 35px; line-height: 35px; box-sizing: border-box; padding: 0.25rem 1.4rem 0.25rem 0.2rem; display: flex;
        background: #fff; font-size: 0.65rem; color: #666; margin-top: 0.5rem;
    }
    .box .head:first-of-type{
        margin-top: 0;
    }
    .box .head .left{
        width: 4rem; height: 35px; line-height: 35px; text-align: center; font-size: 0.7rem; color: #666;
    }
    .box .head .right{
        flex: 1; border: 1px solid #E1E1E1; height: 35px; padding-left: 8px; color: #666;
    }

    .head2{
        width: 100%; height: 35px; line-height: 35px; box-sizing: border-box; padding: 0.25rem 1.4rem 0.25rem 0.2rem; display: flex;
        background: #fff; font-size: 0.65rem; color: #666; padding-top: 0.7rem;
    }
    .head2 .left{
        width: 4rem; height: 35px; line-height: 35px; text-align: center; font-size: 0.7rem; color: #666;
    }
    .head2 .right{
        flex: 1; border: 1px solid #E1E1E1; height: 35px; padding-left: 8px; color: #666;
    }
    .main{
        width: 100%; box-sizing: border-box; background: #fff; padding: 0.7rem 1.4rem 0.7rem 0.2rem;
    }
    .main .aul{

    }
    .main .aul li{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; margin-top: 0.5rem; position: relative;
    }
    .main .aul li:first-of-type{
        margin-top: 0.5rem;
    }
    .main .aul li .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .main .aul li .right{
        flex: 1; height: 1.9rem; border: 1px solid #E1E1E1; border-radius: 0.2rem; display: flex; box-sizing: border-box; padding-left: 0.5rem;
        font-size: 0.65rem; color: #666; position: relative;
    }
    .main .aul li .right .one_6{
        width: 100%; height: 100%;
    }
    .main .aul li .right .two_6{
        width: 100%; height: 100%; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0;
    }
    .main .aul li .imgOne{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.4rem; top: 0.6rem;
    }

    .main .aul li .more{
        flex: 1; display: flex; box-sizing: border-box; font-size: 0.65rem; color: #666;
    }
    .main .aul li .more .m-1{
        width: 2.5rem; height: 2rem; box-sizing: border-box; text-align: center;
    }
    .main .aul li .more .m-1 img{
        width: 0.8rem; height: 0.8rem; display: inline; padding-top: 0.5rem;
    }
    .main .aul li .more .m-2{
        width: 2.5rem; height: 1rem; line-height: 1rem; text-align: center; border: 1px solid #E7E7E7; border-radius: 0.1rem; margin-top: 0.4rem;
    }

    .main .aul li .over{
        flex: 1; position: relative;
    }
    .main .aul li .over .adress{
        width: 100%; height: 1.75rem; display: flex; justify-content: space-between;
    }
    .main .aul li .over .adress .ad-1{
        width: 30%; height: 1.75rem; line-height: 1.75rem; border: 1px solid #ccc; border-radius: 0.4rem; font-size: 0.7rem; color: #438cff; text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .main .aul li .over .adress .ad-1 img{
        width: 0.6rem; height: 0.6rem; display: inline-block; position: relative; left: 0.6rem; top: 0.1rem;
    }
    .main .aul li .over #picker-toolbarthree{
        width: 100%; height: 1.75rem; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0;
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
    .salary .you .ou .y3{

    }
    .salary .you .ou .y3 .y3-1{
        width: 3.25rem; height: 1rem; line-height: 1rem; text-align: center; border: 1px solid #E1E1E1; border-radius: 0.2rem;
        font-size: 0.55rem; color: #666;
    }
    .salary .you .ou .y4{
        transform: translateY(4px);
    }

    .main2{
        width: 100%; box-sizing: border-box; background: #fff; padding: 0.25rem 1.4rem 0.7rem 0.2rem; margin-top: 0.25rem;
    }
    .main2 .treat{
        width: 100%; display: flex; margin-top: 8px;
    }
    .main2 .treat .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .main2 .treat .right{
        min-height: 32px; flex: 1; padding-left: 8px;
    }
    .main2 .treat .right .ret{
        display: inline-block; box-sizing: border-box; padding: 4px 14px; border: 1px solid #92BCFF; border-radius: 9px; font-size: 0.45rem;
        margin-right: 0.6rem; margin-bottom: 0.6rem; color: #438CFF;
    }
    .main2 .treat .right .ret2{
        background: #438CFF; color: #fff;
    }
    .main2 .treat .right .ret:last-of-type{
        margin-right: 0;
    }

    .main2 .select{
        display: flex; margin: 0.25rem 0; background: #fff; width: 100%; height: 35px; line-height: 35px; position: relative;
    }
    .main2 .select .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .main2 .select .right{
        flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border: 1px solid #E1E1E1; border-radius: 2px;
    }
    .main2 .select .right .up{
        width: 100%; height: 100%; padding-right: 4px; color: #666; text-align: center;
    }
    .main2 .select .right .im{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.4rem; top: 0.4rem;
    }

    .main2 .bot{
        width: 100%; min-height: 3.9rem; display: flex; margin-top: 0.6rem;
    }
    .main2 .bot .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .main2 .bot .right{
        flex: 1; padding-left: 8px; color: #666; border: 1px solid #E1E1E1;
    }

    .footer{
        width: 100%; height: 2.5rem; background: #fff; margin-top: 1.7rem; overflow: hidden;
    }
    .footer .f-1{
        margin: 0 auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF; margin-top: 0.4rem;
    }
</style>