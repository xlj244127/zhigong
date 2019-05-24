<template>
    <div data-page="editResume" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">编辑工人简历</div>
            </div>
        </div>
        <div class="page-content">
            <div class="avatarPart">
                <img class="part" src="../../static/img/edit_resume_bg.png"/>
                <div class="avatar">
                    <img id="avatar" src="#" alt="">
                </div>
                <div class="fix" @click="photoAction">设置头像 ></div>
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
                    <span class="fr" @click.stop.prevent="addTags" id="pickerDevice02">+ 添加标签</span>
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
                    <input class="right" @click.stop.prevent="selectTimeAction" id="calenda2" placeholder="请选择空闲时间" readonly/>
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
                workerTitle:[],
                tagList:[],
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
            photoAction(){
                console.log('我点击了');
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        console.log(JSON.stringify(localIds[0]));

                        wx.uploadImage({
                            localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (resTwo) {
                                var serverId = resTwo.serverId; // 返回图片的服务器端ID
                                $$('#avatar').attr('src', localIds);
                                console.log('本地id',localIds,'图片服务器id',serverId);
                                avatar = "http://file.api.weixin.qq.com/cgi-bin/media/get?media_id="+serverId;
                            }
                        });
                    }
                });
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
                this.treatmentCodes = [];         //待遇条件code
                if(this.provinceId=='' || this.cityId==''){
                    this.$f7.alert('请先选择用工地点');
                    return;
                }
                if($$('#calenda2').val()==''){
                    this.$f7.alert('请选择空闲时间');
                    return;
                }
                var mobile_reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if(this.contact==""){
                    this.$f7.alert('请输入手机号码');
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
                console.log("before For",this.workTypesCode,this.littleBigs);
                this.treatmentCodes = []
                $$('.ret2').each((xls,elm)=>{
                    $$(elm).data('id');
                    this.treatmentCodes.push($$(elm).data('id'));
                    //console.log($$(elm).data('id'));
                })
                //this.workTypesCode,this.littleBigs
                for(var q=0;q<this.tagList.length;q++){
                    this.workTypesCode.push(this.tagList[q].workerTypeCode)
                    this.littleBigs.push(this.tagList[q].workerSizeCode)
                }
                if(this.workTypesCode.length<=0){
                    this.$f7.alert('请选择工种类型');
                    return;
                }
                console.log("after For",this.tagList, this.workTypesCode, this.littleBigs)
                console.log('时间2:',this.expectTime,$$('#calenda2').val)
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
                    $$('#calenda2').val(),
                    this.workTypesCode.join(","),
                    this.littleBigs.join(","),
                    this.treatmentCodes.join(','),
                    this.salaryType,
                    this.salary,
                    this.userId
                ).then((result)=>{
                    console.log(result.data);
                    this.$router.back();
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
                this.littleBigs.splice(this.tagList.findIndex(v => v.workerTypeCode === val),1)
                console.log("delTags",this.workTypesCode,this.littleBigs);
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
            this.$store.state.tagList = [];   //每次进来工种缓存先清空

            this.userId = this.$route.params.userId;
            wxApi.userInfo(this.userId).then((res)=>{
                console.log("lookingJob info",res.data);
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

            let that = this
            calendarInline = that.$f7.calendar({
                input: '#calenda2',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    that.expectTime = $day;
                    $$('#calenda2').val(that.expectTime);
                    p.close();
                    that.$f7.closeModal();
                }
            });

        },
        mounted(){
            let editStatus = this.$route.params.editStatus
            let that = this;
            let userInfo = LocalCache.get("userInfo");
            this.userCard = this.$store.state.userCard
            console.log("this.userCard2",this.userCard);
            console.log(this.userCard.user.avatar);
            console.log(this.userCard.user.avatar+'?'+Math.random());
            this.cityId = this.userCard.user.cityId
            this.provinceId = this.userCard.user.provinceId
            this.nativeCityId = this.userCard.nativeCityId
            this.nativeProvinceId = this.userCard.nativeProvinceId
            this.workingExp = this.userCard.user.workingExp
            this.avatar = this.userCard.user.avatar
            if(this.userCard.workTypeList!=undefined){
                this.tagList = this.userCard.workTypeList;
                this.$store.state.tagList = this.tagList;
            }
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
            userApi.detail().then((result)=>{
                console.log('detail',result.data);
                if(result.data.userDetail.idNumber){
                    this.uncert = false
                    this.allName = userInfo.name
                    this.simpleName = userInfo.name.substring(0,1)+"工"
                    if(editStatus==1){
                        if(this.allName == this.userCard.displayName){
                            this.chosenStatus = 1
                        }else if(this.simpleName == this.userCard.displayName){
                            this.chosenStatus = 2
                        }else{
                            this.enterName = this.userCard.displayName
                            this.chosenStatus = 0
                        }
                    }else{
                        if(this.allName == this.userCard.user.name){
                            this.chosenStatus = 1
                        }else if(this.simpleName == this.userCard.user.name){
                            this.chosenStatus = 2
                        }else{
                            this.enterName = this.userCard.user.name
                            this.chosenStatus = 0
                        }
                    }

                }else{
                    this.uncert = true
                    this.enterName = this.userCard.displayName
                }
            });
            if(editStatus==1){
                if(this.$store.state.treatment){
                    this.treatment = this.$store.state.treatment;
                    for(var o=0;o<this.userCard.treatments.split("、").length;o++){
                        this.treatment[this.treatment.findIndex(v=>v.value==this.userCard.treatments.split("、")[o])].checked = true
                    }
                }else{
                    wxApi.getTreatments().then((result)=>{
                        this.treatment = result.data;
                        this.$store.state.treatment = this.treatment;
                        for(var o=0;o<this.userCard.treatments.split("、").length;o++){
                            this.treatment[this.treatment.findIndex(v=>v.value==this.userCard.treatments.split("、")[o])].checked = true
                        }
                    })
                }
                console.log("userCard",this.userCard,"+",this.allName);

                console.log("this.workerTitle",this.userCard.workTypes.length,"+",this.workerTitle);
                this.avatar = this.userCard.user.avatar
                $$('#avatar').attr('src', this.userCard.user.avatar+'?'+Math.random())
                this.remark = this.userCard.user.remark
                this.salaryType = this.userCard.user.salaryType
                this.isShow = this.userCard.user.salaryType
                $$('.y2-1').each((xls,elm)=>{
                    if($$(elm).val()==this.salaryType){
                        $$(elm).prop("checked", true);
                    }
                })
                this.salary = this.userCard.user.salary
                this.contact = this.userCard.user.contact
                //this.LowestSalary+'-'+this.highestSalary;
                this.expectTime = this.userCard.expectTime.split('起')[0]
                $$('#calenda2').val(this.expectTime);
                console.log('时间:',this.expectTime,$$('#calenda2').val)
                if(this.userCard.user.salaryType==1){
                    console.log(this.userCard.user.salary.indexOf("3") != -1 )
                    if(this.userCard.user.salary.indexOf("-")==-1){
                        this.lowestSalary1 = this.userCard.user.salary
                    }else{
                        this.lowestSalary1 = this.userCard.user.salary.split('-')[0]
                        this.highestSalary1 = this.userCard.user.salary.split('-')[1]
                    }
                    console.log('显示3',this.lowestSalary1,this.highestSalary1,this.salary)
                }else if(this.userCard.user.salaryType==2){
                    if(this.userCard.user.salary.indexOf("-")==-1){
                        this.lowestSalary2 = this.userCard.user.salary
                    }else {
                        this.lowestSalary2 = this.userCard.user.salary.split('-')[0]
                        this.highestSalary2 = this.userCard.user.salary.split('-')[1]
                    }
                }else if(this.userCard.user.salaryType==4){
                    if(this.userCard.user.salary.indexOf("-")==-1){
                        this.lowestSalary4 = this.userCard.user.salary
                    }else {
                        this.lowestSalary4 = this.userCard.user.salary.split('-')[0]
                        this.highestSalary4 = this.userCard.user.salary.split('-')[1]
                    }
                }else if(this.userCard.user.salaryType==5){
                    if(this.userCard.user.salary.indexOf("-")==-1){
                        this.lowestSalary5 = this.userCard.user.salary
                    }else {
                        this.lowestSalary5 = this.userCard.user.salary.split('-')[0]
                        this.highestSalary5 = this.userCard.user.salary.split('-')[1]
                    }
                }

            } else {
                if(this.$store.state.treatment){
                    this.treatment = this.$store.state.treatment;
                }else{
                    wxApi.getTreatments().then((result)=>{
                        this.treatment = result.data;
                        this.$store.state.treatment = this.treatment;
                    })
                }
                wxApi.getUserMobile(userInfo.id).then((result)=>{
                    console.log(result);
                    this.contact = result.data
                })
                this.chosenStatus = 1
            }

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
        width: 100%; min-height: 3.9rem; display: flex; margin-top: 0.6rem;
    }
    .bot .left{
        width: 4rem; text-align: center; font-size: 0.7rem; color: #666;
    }
    .bot .right{
        flex: 1; padding-left: 8px; color: #666; border: 1px solid #E1E1E1;
    }

    .footer{
        width: 100%; height: 2rem; background: #fff;
        padding-top: 0.5em;
        position: fixed;
        left: 0;
        bottom: 0;
    }
    .footer .f-1{
        margin: 0 auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF;
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