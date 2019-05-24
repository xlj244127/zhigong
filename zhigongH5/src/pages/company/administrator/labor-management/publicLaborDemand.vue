<template>
    <div data-page="publicLaborDemand" class="page navbar-fixed" @page:reinit="back">
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
            <div class="head">
                <div class="left">用工标题</div>
                <input class="right" type="text" v-model="title" maxlength="20" placeholder="请输入用工标题">
            </div>
            <div class="aside">
                <div class="left">项目地点</div>
                <div class="over">
                    <div class="adress" @click.stop.prevent="addressAction">
                        <div class="ad-1 ad">省<img src="../../../../../static/img/btn_drop_down.png"/></div>
                        <div class="ad-1 ad-2">市<img src="../../../../../static/img/btn_drop_down.png"/></div>
                    </div>
                    <input type="text" placeholder="Describe yourself" readonly id="pickersix6">
                </div>
            </div>

            <div class="select">
                <div class="left">项目</div>
                <div class="right">
                    <div class="up" @click.stop.prevent="selectProj">{{this.projName}}</div>
                    <div class="down">
                        <input type="text" readonly id="picker-device_4">
                    </div>
                    <img class="im" src="../../../../../static/img/btn_right.png"/>
                </div>
            </div>

            <div class="main">
                <ul class="aul">
                    <li>
                        <div class="left">工种需求</div>
                        <div class="right">
                            <div class="one_6" @click="addTypeAction">{{this.typename}}</div>
                            <!--<input class="two_6" id="picker-deviceone" placeholder="请选择工种类型"/>-->
                        </div>
                        <img class="imgOne" src="../../../../../static/img/btn_right.png"/>
                    </li>
                    <li class="demandTypePart">
                        <div class="left">招工类型</div>
                        <div class="more">
                            <label  class="demandTypeLabel" v-for="(item,index) in demandTypeList">
                                <div >
                                    <input class="demandTypeItem" type="radio" name="demandType" :value="item.code"/>&nbsp;{{item.value}}
                                </div>
                            </label>
                        </div>
                    </li>
                    <li>
                        <div class="left">用工时间</div>
                        <input class="right time" @click.stop.prevent="selectTimeAction"  id="calendar-defaulttwo" placeholder="请选择用工时间" readonly/>
                        <img class="imgOne" src="../../../../../static/img/btn_date.png"/>
                    </li>
                    <li>
                        <div class="left">人数需求</div>
                        <div class="more">
                            <div class="m-1" @click="reduceAction">
                                <img src="../../../../../static/img/jianBlue.png"/>
                            </div>
                            <div class="m-2">{{this.demandAmount}}</div>
                            <div class="m-1" @click="addAction">
                                <img src="../../../../../static/img/jiaBlue.png"/>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="main2">
                <div class="head head2">
                    <div class="left">工程造价</div>
                    <input class="right" type="number" v-model="cost"  placeholder="请输入工程造价(选填)">&nbsp;&nbsp;万元
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
                    <div class="left">待遇条件</div>
                    <div class="right">
                        <span class="ret" v-for="(item,index) in treatment" @click="selectTreatment(item)" :data-id="item.code">{{item.value}}</span>
                    </div>
                </div>
            </div>
            <div class="main3">
                <div class="select">
                    <div class="left">材料要求</div>
                    <div class="right">
                        <div class="up" @click.stop.prevent="selectMater">{{this.materialName}}</div>
                        <img class="im" src="../../../../../static/img/btn_right.png"/>
                    </div>
                </div>
                <div class="select">
                    <div class="left">设备要求</div>
                    <div class="right">
                        <div class="up" @click.stop.prevent="selectEquip">{{this.deviceName}}</div>
                        <img class="im" src="../../../../../static/img/btn_right.png"/>
                    </div>
                </div>
                <div class="select">
                    <div class="left">结算方式</div>
                    <div class="right">
                        <div class="up" @click.stop.prevent="selectExplain">{{this.tlementsName}}</div>
                        <img class="im" src="../../../../../static/img/btn_right.png"/>
                    </div>
                </div>
                <div class="bot">
                    <div class="left">其他说明</div>
                    <textarea class="right" v-model="remark"  placeholder="请输入说明(选填)">&nbsp;</textarea>
                </div>
            </div>

            <div class="footer">
                <div class="f-1" @click="publicAction">发布状态</div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { tabulateStatisticsApi, userApi, wxApi, projectApi } from '../../../../api';
    import { LocalCache } from '../../../../lib/utils';
    import moment from 'moment';
    var pickerAddress, pickerDevicee, calendarInline;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    var projList = [], pickerProj;
    export default {
        data(){
            return{
                batchNumber: '',
                projName: '请先选择项目',
                projectId: '',
                userInfo: {},
                workerTitle: [],
                isShow: 3,
                groupId: '',
                companyRole: '',
                companyId: '',
                typecode: '',
                typename: '请选择工种',
                demandAmount: 1,
                address: {},
                salaryType: 3,
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
                chosenStatus:0,
                salary: "",
                remark: '',
                title: '',
                time: '',
                cost: '',
                treatmentCodes: [],               //上传待遇条件
                list: [],
                treatment: [],                    //待遇条件
                material: [],                     //材料要求
                device: [],                       //设备要求
                tlements: [],                     //工资结算方式
                materialName: '请选择材料要求',
                materialCode: '',
                deviceName: '请选择设备要求',
                deviceCode: '',
                tlementsName: '请选择结算方式',
                tlementsCode: '',
                sum: '',
                projNeedList: {},
                pubOredit: '',                    //判断是发布还是编辑

                proviceList: [],                  //以下都是调省市区插件的参数
                proviceIdList: [],
                cityList: [],
                provinceId: '',
                cityIdList: [''],
                cityNameList: [''],
                cityId: '',
                localAddress: {},            //省市区的地址全放里面存缓存里
                demandTypeList:[],
                demandType:0,
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
            addressAction(){
                pickerAddress.open();
            },
            selectProj(){
                console.log('我点击了');
                console.log(projList);
                if(this.provinceId=='' || this.cityId==''){
                    this.$f7.alert('请先选择项目所在地');
                }else{
                    if(projList.length==0){

                    }else{
                        pickerProj.open();
                    }
                }
            },
            reduceAction(){
                if(this.demandAmount == 1){

                }else{
                    this.demandAmount--;
                }
            },
            addAction(){
                this.demandAmount++;
            },
            selectTimeAction(){
                calendarInline.open();
            },
            addTypeAction(){
                console.log('我点击了');
                this.$router.load({url: '/company/selectTypeAddSize/1/:id/'})
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
            selectMater(){
                let buttons = [];
                for (var i = 0; i < this.material.length; i++) {
                    let value = this.material[i].value;
                    let index = this.material[i].code;
                    buttons.push({
                        text: value,
                        onClick: () => {
                            this.materialName = value;
                            this.materialCode = index;
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
                    title: '请选择材料要求',
                    verticalButtons: true,
                    buttons
                })
            },
            selectEquip(){
                let buttons = [];
                for (var i = 0; i < this.device.length; i++) {
                    let value = this.device[i].value;
                    let index = this.device[i].code;
                    buttons.push({
                        text: value,
                        onClick: () => {
                            this.deviceName = value;
                            this.deviceCode = index;
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
                    title: '请选择设备要求',
                    verticalButtons: true,
                    buttons
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
            publicAction(){
                this.list = [];                        //每次提交都要清空工种列表
                this.treatmentCodes = [];
                if(this.projectId=='' && this.projName==''){
                    this.$f7.alert('请选择招工项目');
                    return;
                }
                if(this.typecode==''){
                    this.$f7.alert('请选择工种类型');
                    return;
                }
                console.log($$('.time').val());
                if($$('.time').val()==''){
                    this.$f7.alert('请选择用工时间');
                    return;
                }
                let obj = {
                    'workType': this.typecode,
                    'demandAmount': this.demandAmount,
                    'demandTime': $$('.time').val()
                }
                this.list.push(obj);
                console.log(JSON.stringify(this.list));

                $$('.y2-1').each((xls,elm)=>{
                    if($$(elm).prop("checked")){
                        this.salaryType = $$(elm).val();
                    }
                })
                $$('.demandTypeItem').each((xls,elm)=>{
                    if($$(elm).prop("checked")){
                        console.log($$(elm).val());
                        this.demandType = $$(elm).val();
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
                console.log('待遇条件',this.treatmentCodes.join(','),);
                console.log(this.typecode,this.typename,this.demandAmount,this.time);
                // console.log('工种人数日期', this.list,'项目id',this.projectId,'说明',this.title,'造价',this.cost,'待遇',this.salaryType,this.LowestSalary,this.highestSalary);
                wxApi.addOreditNeedWorker(
                    this.batchNumber,
                    this.title,
                    this.projectId,
                    JSON.stringify(this.list),
                    this.cost,
                    this.salaryType,
                    this.salary,
                    this.treatmentCodes.join(','),
                    this.materialCode,
                    this.deviceCode,
                    this.tlementsCode,
                    this.remark,
                    this.demandType
                ).then((result)=>{
                    console.log(result.data);
                    this.downData = [];
                    this.$store.state.downData = this.downData;

                    let address = {
                        provinceId: this.provinceId,
                        cityId: this.cityId
                    }
                    this.$store.state.address = address;

                    this.$router.back();
                })
            },
            getProjs(){
                wxApi.projectList(
                    this.companyId,
                    this.provinceId,
                    this.cityId
                ).then((result)=>{
                    console.log('根据省市区获取项目'+result.date);
                    projList = result.data;
                    console.log('项目',projList);
                    if(projList.length==0){
                        this.projectId = '';
                        this.projName = '该城市无项目';
                    }else{
                        this.projectId = projList[0].id;
                        this.projName = projList[0].name;
                    }

                    pickerProj = this.$f7.picker({
                        input: '#picker-device_4',
                        toolbarTemplate:
                        '<div class="toolbar">' +
                        '<div class="toolbar-inner">' +
                        '<div class="left">' +
                        '<a href="#" class="link close-picker">取消</a>' +
                        '</div>' +
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">绑定</a></div>' +
                        '</div>' +
                        '</div>',
                        onOpen:  (p)=>{
                            p.container.find('#btnOk').click(()=>{
                                this.projectId = pickerProj.cols[0].value;
                                this.projName = pickerProj.cols[0].displayValue;
                                console.log(this.projectId, this.projName);
                            });
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values: projList.map((project)=>{return project.id}),
                                displayValues: projList.map((project)=>{return project.name}),
                            }
                        ]
                    });

                })
            },
            selectCity(){
                let that = this;
                pickerAddress = this.$f7.picker({
                    input: '#picker-toolbarfour_1',
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

                                            that.getProjs();
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
                                            console.log('市',that.cityId,$$('.ad-2').text());
                                            console.log('市列表2',that.cityNameList);
                                            this.localAddress[that.provinceId].cityObj = cityObj;
                                            console.log('省下的所有市',this.localAddress[that.provinceId]);

                                            if (pickerAddress.cols[1].replaceValues) {
                                                pickerAddress.cols[1].replaceValues(
                                                    that.cityIdList,
                                                    that.cityNameList
                                                );

                                                this.getProjs();

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
                                    that.getProjs();
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
            // selectType(){
            //     pickerDevicee = this.$f7.picker({
            //         input: '#picker-deviceone',
            //         formatValue(p, values, displayValues) {
            //             return displayValues;
            //         },
            //         toolbarTemplate:
            //         '<div class="toolbar">' +
            //         '<div class="toolbar-inner">' +
            //         '<div class="left">' +
            //         '<a href="#" class="link close-picker">取消</a>' +
            //         '</div>' +
            //         '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
            //         '</div>' +
            //         '</div>',
            //         onOpen: (p) => {
            //             p.container.find('#btnOk').off('click').click(() => {
            //                 this.typecode = p.cols[0].value;
            //                 this.typename = p.cols[0].displayValue;
            //                 console.log(this.typename);
            //             })
            //         },
            //         cols: [
            //             {
            //                 textAlign: 'center',
            //                 values: this.workerTitle.map((one)=>{return one.code}),
            //                 displayValues: this.workerTitle.map((one)=>{return one.value})
            //             }
            //         ]
            //     });
            // },
        },
        created(){
            this.pubOredit = this.$route.params.is;     //判断是发布还是编辑
            console.log('判断',this.pubOredit);
            this.$store.state.address = {          //赋值一个空对象到缓存储存省市id;
                provinceId: '',
                cityId: ''
            };

            this.groupId = this.$store.state.roleInfo.groupId;
            this.companyId = this.$store.state.roleInfo.companyId;
            this.companyRole = this.$store.state.roleInfo.companyRole;
            console.log(this.userInfo);

            if(this.$store.state.treatment){
                this.treatment = this.$store.state.treatment;
            }else{
                wxApi.getTreatments().then((result)=>{
                    console.log('待遇条件',result.data);
                    this.treatment = result.data;
                    this.$store.state.treatment = this.treatment;
                })
            }
            if(this.$store.state.material){
                this.material = this.$store.state.material;
            }else {
                wxApi.getMaterial().then((result) => {
                    console.log('材料条件', result.data);
                    this.material = result.data;
                    this.$store.state.material = this.material;
                })
            }
            if(this.$store.state.device){
                this.device = this.$store.state.device;
            }else {
                wxApi.getDevice().then((result) => {
                    console.log('设备条件', result.data);
                    this.device = result.data;
                    this.$store.state.device = this.device;
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
                wxApi.demandType().then((result) => {
                    this.demandTypeList = result.data;
                    this.$store.state.demandTypeList = this.demandTypeList;
                })
            }
        },
        mounted(){
            calendarInline = this.$f7.calendar({
                input: '#calendar-defaulttwo',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    this.time = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    $$('.time').val(this.time);
                    console.log('时间2',this.time);
                    p.close();
                }
            });

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

            if(this.pubOredit==1){                                //编辑招工
                this.projNeedList = this.$store.state.projNeedList;
                console.log('项目的单个发布', this.projNeedList);
                this.batchNumber = this.projNeedList.batchNumber;
                this.title = this.projNeedList.workDemandList[0].title;
                this.provinceId = this.projNeedList.province.id;
                this.cityId = this.projNeedList.city.id;
                $$('.ad').text(this.projNeedList.province.name);
                $$('.ad-2').text(this.projNeedList.city.name);
                this.projectId = this.projNeedList.project.id;
                this.projName = this.projNeedList.project.name;
                this.typecode = this.projNeedList.workDemandList[0].workType;
                this.typename = this.projNeedList.workDemandList[0].workTypeName;
                $$('.time').val(this.projNeedList.workDemandList[0].demandTime);
                this.demandAmount = this.projNeedList.workDemandList[0].demandAmount;
                this.cost = this.projNeedList.workDemandList[0].cost;
                this.salaryType = this.projNeedList.workDemandList[0].salaryType;
                this.isShow = this.salaryType;
                if(this.projNeedList.workDemandList[0].demandType==null){
                    this.demandType = 0
                }else{
                    this.demandType = this.projNeedList.workDemandList[0].demandType;
                }
                //console.log("demandType",this.demandType,$$('.demandTypeItem').length);
                if(this.salaryType==3){
                    this.salary = '';
                    this.lowestSalary = "";
                    this.highestSalary = "";
                }
                if(this.salaryType==1){
                    if(this.projNeedList.workDemandList[0].salary.indexOf("-")==-1){
                        this.lowestSalary1 = this.projNeedList.workDemandList[0].salary
                    }else{
                        this.lowestSalary1 = this.projNeedList.workDemandList[0].salary.split('-')[0]
                        this.highestSalary1 = this.projNeedList.workDemandList[0].salary.split('-')[1]
                    }
                }else if(this.salaryType==2){
                    if(this.projNeedList.workDemandList[0].salary.indexOf("-")==-1){
                        this.lowestSalary2 = this.projNeedList.workDemandList[0].salary
                    }else {
                        this.lowestSalary2 = this.projNeedList.workDemandList[0].salary.split('-')[0]
                        this.highestSalary2 = this.projNeedList.workDemandList[0].salary.split('-')[1]
                    }
                }else if(this.salaryType==4){
                    if(this.projNeedList.workDemandList[0].salary.indexOf("-")==-1){
                        this.lowestSalary4 = this.projNeedList.workDemandList[0].salary
                    }else {
                        this.lowestSalary4 = this.projNeedList.workDemandList[0].salary.split('-')[0]
                        this.highestSalary4 = this.projNeedList.workDemandList[0].salary.split('-')[1]
                    }
                }else if(this.salaryType==5){
                    if(this.projNeedList.workDemandList[0].salary.indexOf("-")==-1){
                        this.lowestSalary5 = this.projNeedList.workDemandList[0].salary
                    }else {
                        this.lowestSalary5 = this.projNeedList.workDemandList[0].salary.split('-')[0]
                        this.highestSalary5 = this.projNeedList.workDemandList[0].salary.split('-')[1]
                    }
                }
                $$('.y2-1').each((xls,elm)=>{
                    if($$(elm).val()==this.salaryType){
                        $$(elm).prop("checked",true);
                    }
                })

                this.treatmentCodes = this.projNeedList.workDemandList[0].treatments.split(',');
                console.log('待遇',this.treatmentCodes, $$('.ret').length);
                if(this.treatment.length!=0){
                    $$('.ret').each((xls,elm)=>{
                        $$(elm).data('id');
                        console.log('所有待遇',$$(elm).data('id'));
                        if(this.treatmentCodes.indexOf($$(elm).data('id')) != -1){
                            console.log('相同的待遇ID');
                            $$(elm).addClass('ret2');
                        }
                    })
                }
                this.materialCode = this.projNeedList.workDemandList[0].materialReq;
                this.material.map((res)=>{
                    if(res.code == this.materialCode){
                        this.materialName = res.value;
                    }
                })
                this.deviceCode = this.projNeedList.workDemandList[0].deviceReq;
                this.device.map((res)=>{
                    if(res.code == this.deviceCode){
                        this.deviceName = res.value;
                    }
                })
                this.tlementsCode = this.projNeedList.workDemandList[0].settlement;
                this.tlements.map((res)=>{
                    if(res.code == this.tlementsCode){
                        this.tlementsName = res.value;
                    }
                })
                this.remark = this.projNeedList.workDemandList[0].remark;
                $$('.demandTypeItem').each((xls,elm)=>{
                    if($$(elm).val()==this.demandType){
                        $$(elm).prop("checked",true);
                    }
                })
            }else{                                                            //发布招工
                wxApi.projectList2(this.companyId, 1, 1).then((result)=>{     //得到这个人所在的其中一个项目，获取省市id
                    console.log('这个人其中一个项目',result.data);
                    this.provinceId = result.data[0].provinceId;
                    this.cityId = result.data[0].cityId;
                    wxApi.getProvinceName(this.provinceId).then((result)=>{
                        console.log(result.data.name);
                        $$('.ad').text(result.data.name);
                    })
                    wxApi.getCityName(this.cityId).then((result)=>{
                        $$('.ad-2').text(result.data.name);
                    })

                    this.getProjs();
                })
                $$('.demandTypeItem').each((xls,elm)=>{
                    if($$(elm).val()==this.demandType){
                        $$(elm).prop("checked",true);
                    }
                })
            }


        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4; position: relative;
    }
    .head{
        width: 100%; height: 35px; line-height: 35px; box-sizing: border-box; padding: 0.25rem 1.4rem 0.25rem 0.2rem; display: flex; background: #fff; margin-top: 5px;
    }
    .head2{
        font-size: 0.65rem; color: #666;
    }
    .head .left{
        width: 4rem; height: 35px; line-height: 35px; text-align: center; font-size: 0.7rem; color: #666;
    }
    .head .right{
        flex: 1; border: 1px solid #E1E1E1; height: 35px; padding-left: 8px; color: #666;
    }
    .aside{
        width: 100%; height: 3rem; line-height: 3rem; display: flex; background: #fff; box-sizing: border-box; padding: 0 1.4rem 0 0.2rem;
    }
    .aside .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .aside .over{
        position: relative; flex: 1;
    }
    .aside .over .adress{
        width: 100%; height: 1.75rem; display: flex; margin-top: 0.7rem;
    }
    .aside .over .adress .ad-1{
        width: 30%; height: 1.75rem; border: 1px solid #ccc; border-radius: 0.4rem; font-size: 0.7rem; color: #438cff; text-align: center; margin-right: 1rem;
        line-height: 1.75rem; -ms-text-overflow: ellipsis; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; padding: 0 0.1rem;
    }
    .aside .over .adress .ad-1 img{
        width: 0.6rem; height: 0.6rem; display: inline-block; position: relative; left: 0.6rem; top: 0.1rem;
    }
    .aside .over #pickersix6{
        width: 100%; height: 1.75rem; position: absolute; left: 0; top: 0.7rem; z-index: -1;
    }

    .select{
        display: flex; box-sizing: border-box; padding: 0 1.4rem 2.25rem 0.2rem; background: #fff; width: 100%; height: 35px;
    }
    .select .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666; height: 35px; line-height: 35px;
    }
    .select .right{
        height: 35px; flex: 1; position: relative; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border: 1px solid #E1E1E1; border-radius: 2px;
    }
    .select .right .up{
        width: 100%; height: 100%; line-height: 35px; position: absolute; z-index: 2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 4px; color: #666;
    }
    .select .right .down{

    }
    .select .right .down #picker-device_4{
        position: absolute;  left: 0;  right: 0;  top: 0;  bottom: 0; opacity: 0;
    }
    .select .right .im{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.4rem; top: 0.4rem;
    }

    .main{
        width: 100%; box-sizing: border-box; background: #fff; padding: 0.25rem 1.4rem 0.7rem 0.2rem; margin-top: 0.5rem;
    }
    .main .aul{

    }
    .main .aul li{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; margin-top: 0.5rem; position: relative;
    }
    .main .aul li:first-of-type{
        margin-top: 0;
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
        width: 100%; height: 100%; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0; z-index: -2;
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

    .main2{
        width: 100%; box-sizing: border-box; background: #fff; padding: 0 1.4rem 0.7rem 0.2rem; margin-top: 0.5rem;
    }
    .main2 .salary{
        width: 100%; display: flex; margin-top: 1rem;
    }
    .main2 .salary .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .main2 .salary .you{
        flex: 1; font-size: 0.55rem; color: #666;
    }
    .main2 .salary .you .ou{
        display: flex; height: 22px; margin-top: 0.6rem;
    }
    .main2 .salary .you .ou:first-of-type{
        margin-top: 0;
    }
    .main2 .salary .you .ou:last-of-type{
        height: 25px;
    }
    .main2 .salary .you .ou .y2{
        width: 56px; margin-left: 0.5rem; margin-right: 0.3rem;
    }
    .main2 .salary .you .ou .y2 label{
        display: inline-block; width: 100%; height: 100%;
    }
    .main2 .salary .you .ou .y2 .y2-1{
        transform: translateY(0.1rem);
    }
    .main2 .salary .you .ou .y3{

    }
    .main2 .salary .you .ou .y3 .y3-1{
        width: 3.25rem; height: 1rem; line-height: 1rem; text-align: center; border: 1px solid #E1E1E1; border-radius: 0.2rem;
        font-size: 0.55rem; color: #666;
    }
    .main2 .salary .you .ou .y4{
        transform: translateY(4px);
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

    .main3{
        width: 100%; box-sizing: border-box; background: #fff; padding: 0.25rem 1.4rem 0.7rem 0.2rem; margin-top: 0.5rem;
    }
    .main3> .select{
        display: flex; margin: 0.25rem 0; background: #fff; width: 100%; height: 35px; line-height: 35px;
    }
    .main3> .select .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .main3> .select .right{
        flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border: 1px solid #E1E1E1; border-radius: 2px;
    }
    .main3> .select .right .up{
        width: 100%; height: 100%; padding-right: 4px; color: #666;
    }
    .main3> .select .right .im{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.4rem; top: 0.4rem;
    }

    .main3 .bot{
        width: 100%; min-height: 3.9rem; display: flex; margin-top: 0.6rem;
    }
    .main3 .bot .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .main3 .bot .right{
        flex: 1; padding-left: 8px; color: #666;
    }

    .footer{
        width: 100%; height: 2.5rem; background: #fff; margin-top: 1.7rem; overflow: hidden;
    }
    .footer .f-1{
        margin: 0 auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF; margin-top: 0.4rem;
    }
    .demandTypeLabel{
        margin-right: 0.4rem;
    }
    .main .aul li.demandTypePart{
        display: block;
        line-height: 1.6rem;
        padding-top: .2rem;
        height: 3.2rem;
        padding-bottom: .2rem;
    }
    .demandTypePart .left{
        float: left;
    }
    .main .aul li.demandTypePart .more{
        float: right;
        width: 13rem;
        display: block;
    }
    .demandTypePart .more .demandTypeLabel{
        display: inline-block;
    }
</style>