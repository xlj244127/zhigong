<template>
    <div data-page="createProject" @page:reinit="back" class="page navbar-fixed toolbar-fixed">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" @click="backAction">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">{{projectId ==':id'?'创建项目':'编辑项目'}}</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <p class="ming">
                    <span class="ming-1">项目名称</span><span class="ming-2">请填写项目名称（必填项）</span>
                </p>
                <input class="ipt name" name="put" v-model="name" type="text"/>
                <p class="ming">
                    <span class="ming-1">项目所在地</span><span class="ming-2">(非必填项,默认为项目绑定考勤机所在地)</span>
                </p>

                <div class="over">
                    <div class="adress" @click.stop.prevent="alertAction">
                        <div class="ad-1 ad">省<img src="../../../../../static/img/btn_drop_down.png"/></div>
                        <div class="ad-1 ad-2">市<img src="../../../../../static/img/btn_drop_down.png"/></div>
                        <div class="ad-1 ad-3">区<img src="../../../../../static/img/btn_drop_down.png"/></div>
                    </div>
                    <input type="text" placeholder="Describe yourself" readonly id="picker-custom-toolbar">
                </div>

                <p class="ming">
                    <span class="ming-1">详细地址</span>
                </p>
                <input class="ipt" v-model="address" type="text"/>
                <div class="date">
                    <p class="ming">
                        <span class="ming-1">项目创建时间</span><span class="ming-2">（默认选择创建当天）</span>
                    </p>
                    <div class="count" @click.stop.prevent="calenderOpen">
                        <input type="text" v-model="startTime" readonly id="calendar-default">
                        <div class="fr innerImg">
                            <img src="../../../../../static/img/btn_date.png"/>
                        </div>

                    </div>
                </div>
                <p class="ming">
                    <span class="ming-1">设置劳务公司</span>
                </p>
                <input class="ipt" v-model="company" type="text"/>

                <div class="line"></div>
                <ul class="aul" v-if="!(statu == 3)">
                    <li>
                        <a>
                            <div class="up">
                                <img class="u-1" src="../../../../../static/img/guanliyuan.png"/>
                                <div class="left">
                                    <div class="ming-3">项目管理员</div>
                                    <div class="ming-4">{{this.projManagerIdList.length?this.projManagerIdList.length:0}}人</div>
                                </div>
                            </div>
                            <div class="down">
                                <img @click="addProjer" class="down-1" src="../../../../../static/img/tianjia-1.png"/>
                                <a href="/company/projManagerList/:id/">
                                    <img class="down-2" src="../../../../../static/img/chakan.png"/>
                                </a>
                            </div>
                        </a>
                    </li>
                </ul>

                <div class="butt" @click="createProjAction">
                     {{projectId==':id'?'创建':'保存'}}
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { userApi } from '../../../../api'
    import { projectApi } from '../../../../api'
    import moment from 'moment'
    import { LocalCache } from '../../../../lib/utils'
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];
    var pickerDevice;
    var calendarInline;
    let createdTime= new Date().getTime(),calendarValue,createdYear,createdMonth,createdDay;
    var cityShow = false, areaShow = false;
    export default {
        data(){
            return{
                projerList: [],

                projManagerIdList: [],
                createTime: '', //项目创建时间
                statu: '',
                projectId: '',
                id: '',
                companyId: '',
                name: '',
                address: '',
                startTime: '',
                projectAdmins: '',
                company: '',

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
                localAddress: {}             //省市区的地址全放里面存缓存里
            }
        },
        methods:{
            back(){
                this.projManagerIdList = [];

                console.log('back....');
                if(this.$store.state.projerList){
                    this.projerList = this.$store.state.projerList;
                    for(var i=0; i<this.projerList.length; i++){
                        this.projManagerIdList.push(this.projerList[i].id);
                    }
                }
            },
            backAction(){
                if(this.projectId==':id'){
                    this.$f7.confirm('返回后已填写数据将会清空,是否确定退出?', ()=>{
                        this.$router.back();
                    })
                }else{
                    this.$router.back();
                }
            },
            addProjer(){
                this.$router.load({url: '/company/phoneAdd/:id/'+1});
            },
            alertAction(){
                console.log('我点击了');
                pickerDevice.open();
            },
            calenderOpen(){
                calendarInline.open();
            },
            createProjAction(){
                this.companyId = this.$store.state.roleInfo.companyId;
                if(this.name.length == 0){
                    this.$f7.alert('项目名称不能为空');
                    return;
                }
                if(this.name.length >= 50){
                    this.$f7.alert('项目名称过长');
                    return;
                }
                if(this.projectId==':id'){
                    console.log(this.startTime);
                    if(this.provinceId=='' && this.cityId=='' && this.districtId==''){
                        this.$f7.alert('项目所在地不能为空');
                        return;
                    }
                    projectApi.createProj(
                        this.companyId,
                        this.name,
                        this.provinceId,
                        this.cityId,
                        this.districtId,
                        this.address,
                        this.startTime,
                        this.projManagerIdList.join(','),
                        this.company
                    ).then((result)=>{
                        console.log('我创建了项目');
                        console.log(result);
                        this.$store.state.roleInfo.projectId = result.data.id;
                        console.log(this.$store.state.roleInfo.projectId);
                        this.$router.back();
                    });
                }else{
                    this.id = this.projectId;
                    console.log(this.id);
                    projectApi.editProj(
                        this.projectId,
                        this.companyId,
                        this.name,
                        this.provinceId,
                        this.cityId,
                        this.districtId,
                        this.address,
                        this.startTime,
                        this.company
                    ).then((result)=>{
                        console.log('我编辑了项目');
                        console.log(result);
                        this.$router.reloadPage('/company/buildProjDetail/'+this.id);
                    });
                }
            },
            selectCity(){
                let that = this;
                pickerDevice = this.$f7.picker({
                    input: '#picker-custom-toolbar',
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
                                console.log('省',value, displayValue);

                                if(that.localAddress[value].cityObj){
                                    if(value == pickerDevice.cols[0].value){
                                        that.cityIdList = [];
                                        that.cityNameList = [];
                                        for(var key in that.localAddress[value].cityObj){
                                            that.cityIdList.unshift(that.localAddress[value].cityObj[key].id);
                                            that.cityNameList.unshift(that.localAddress[value].cityObj[key].name);
                                        }
                                        that.cityId = that.cityIdList[0];
                                        $$('.ad-2').text(that.cityNameList[0]);
                                        console.log('省下一市',that.cityId,$$('.ad-2').text());
                                        console.log('市列表',that.cityNameList);
                                        console.log('省下市',that.localAddress[value]);
                                        if (pickerDevice.cols[1].replaceValues) {
                                            pickerDevice.cols[1].replaceValues(
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

                                                if (pickerDevice.cols[2].replaceValues) {
                                                    pickerDevice.cols[2].replaceValues(
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
                                    userApi.addressCityList(value).then((result)=> {
                                        if(value == pickerDevice.cols[0].value){
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
                                            console.log('省下一市',this.cityId,$$('.ad-2').text());
                                            console.log('市列表2',that.cityNameList);
                                            that.localAddress[value].cityObj = cityObj;
                                            console.log('省下的所有市',that.localAddress[value]);

                                            if (pickerDevice.cols[1].replaceValues) {
                                                pickerDevice.cols[1].replaceValues(
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

                                                    if (pickerDevice.cols[2].replaceValues) {
                                                        pickerDevice.cols[2].replaceValues(
                                                            that.areaIdList,
                                                            that.areaNameList
                                                        );
                                                        that.districtId = that.areaIdList[0];
                                                        $$('.ad-3').text(that.areaNameList[0]);
                                                        console.log('区2',that.districtId,$$('.ad-3').text());

                                                    }
                                                })

                                            }
                                        }
                                    });
                                }
                                pickerDevice.cols[1].onChange();
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

                                    userApi.addressAreaList(that.cityId).then((result)=> {
                                        if(value == pickerDevice.cols[1].value){
                                            that.areaList = result.data.list;

                                            that.areaIdList = [];
                                            that.areaNameList = [];
                                            for(var i=0; i<that.areaList.length; i++){
                                                that.areaIdList.unshift(that.areaList[i].id);
                                                that.areaNameList.unshift(that.areaList[i].name);
                                            }
                                            console.log('区列表2',that.areaNameList);

                                            if (pickerDevice.cols[2].replaceValues) {
                                                pickerDevice.cols[2].replaceValues(
                                                    that.areaIdList,
                                                    that.areaNameList
                                                );
                                                that.districtId = that.areaIdList[0];
                                                $$('.ad-3').text(that.areaNameList[0]);
                                                console.log('区2',that.districtId,$$('.ad-3').text());

                                            }
                                        }
                                    });
                                    pickerDevice.cols[2].onChange();
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
                                    console.log('省市区', that.provinceId,that.cityId, that.districtId,$$('.ad-3').text());
                                }
                            }
                        },
                    ],
                    onOpen: (picker)=>{
                        pickerDevice.cols[0].onChange('Picker', that.provinceId);
                        console.log('调用了');
                    }
                });
            }
        },
        created(){

        },
        mounted(){
            this.$store.state.projerList = [];
            this.projectId = this.$route.params.id;
            console.log(this.projectId);

            this.statu = this.$route.params.statu;  //编辑项目是判断条件
            console.log(this.statu);

            if(this.projectId==':id'){
                console.log(createdTime);
                createdTime = parseInt(createdTime);
                createdYear = new Date(createdTime).getFullYear();
                createdMonth = new Date(createdTime).getMonth()+1;
                createdMonth = createdMonth>9?createdMonth:'0'+createdMonth;
                createdDay = new Date(createdTime).getDate()>9?new Date(createdTime).getDate():'0'+new Date(createdTime).getDate();
                calendarValue = createdYear + '-' + createdMonth + '-' + createdDay;
                this.startTime = calendarValue;
            }else{
                projectApi.projectDetail(this.projectId).then((result)=>{
                    console.log('我获取到了项目信息');
                    console.log(result);
                    this.name = result.data.name;

                    for(var i=0; i<this.arr.length; i++){
                        if(result.data.provinceId == this.arr[i].id){
                            console.log(this.arr[i].id);
                            Dom7('.ad').text(this.arr[i].name);
                        }
                    }
                    userApi.addressCityList(result.data.provinceId).then((resOne)=>{
                        console.log('市');
                        console.log(resOne);
                        for(var i=0; i<resOne.data.list.length; i++){
                            if(result.data.cityId == resOne.data.list[i].id){
                                console.log(resOne.data.list[i].id);
                                Dom7('.ad-2').text(resOne.data.list[i].name);
                            }
                        }
                    })
                    userApi.addressAreaList(result.data.cityId).then((restwo)=>{
                        console.log('区');
                        console.log(restwo);
                        for(var i=0; i<restwo.data.list.length; i++){
                            if(result.data.districtId == restwo.data.list[i].id){
                                console.log(restwo.data.list[i].id);
                                Dom7('.ad-3').text(restwo.data.list[i].name);
                            }
                        }
                    })
                    this.address = result.data.address;
                    this.company = result.data.company;
                    let time = result.data.startTime;
                    let year = new Date(time).getFullYear();
                    let month = new Date(time).getMonth() + 1;
                    month = month>9?month:'0'+month;
                    let day = new Date(time).getDate()>9?new Date(time).getDate():'0'+new Date(time).getDate();
                    this.startTime = year + '-' + month + '-' + day;
                    console.log(this.startTime);
                });
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

            calendarInline = this.$f7.calendar({
                input: '#calendar-default',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');
                    this.startTime = $day;
                    console.log(this.startTime);
                    p.close();
                }
            });
        }
    }
</script>

<style scoped>
    .main{
        width: 100%; height: 100%; background: #fff; padding: 0 0.6rem; box-sizing: border-box;
    }
    .main .ming{
        width: 100%; margin: 0.6rem 0 0.4rem 0;
    }
    .main .ming .ming-1{
        font-size: 0.7rem; color: #666;
    }
    .main .ming .ming-2{
        font-size: 0.5rem; color: #ccc; padding-left: 0.5rem;
    }
    .main .ipt{
        width: 100%; height: 2.5rem; border-radius: 0.4rem; border-width: 1px; padding: 0;
        border: 1px solid #ccc; box-sizing: border-box; padding-left: 0.6rem;
    }

    .main .over{
        position: relative;
    }
    .main .over .adress{
        width: 100%; height: 1.75rem; display: flex; justify-content: space-between;
    }
    .main .over .adress .ad-1{
        width: 30%; height: 1.75rem; border: 1px solid #ccc; border-radius: 0.4rem; font-size: 0.7rem; color: #438cff; text-align: center;
        line-height: 1.75rem;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 0 5px;
    }
    .main .over .adress .ad-1 img{
        width: 0.6rem; height: 0.6rem; display: inline-block; position: relative; left: 1.6rem; top: 0.1rem;
    }
    .main .over #picker-custom-toolbar{
        width: 100%; height: 1.75rem; position: absolute; left: 0; top: 0; z-index: -1;
    }

    .main .date{

    }
    .main .date input{
        color: #438cff;
    }

    .main .aul{
        padding: 0; margin-top: 1rem;
    }
    .main .aul li{
        width: 100%; box-sizing: border-box; padding-left: 0.6rem; line-height: 2.5rem; border-bottom: 1px solid #ccc; border-top: 1px solid #ccc;
        position: relative;
    }
    .main .aul li a .up{
        width: 100%; height: 2.5rem; display: flex; justify-content: space-between; line-height: 2.5rem;
    }
    .main .aul li a .down{
        width: 100%; height: 2.75rem; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0.4rem 1rem;
    }
    .main .aul li a .down .down-1{
        width: 6rem; height: 1.5rem;
    }
    .main .aul li a .down .down-2{
        width: 3.7rem; height: 1.5rem;
    }

    .main .aul li .up .u-1{
        width: 1.5rem; height: 1.5rem; display: inline-block; margin-top: 6px;
    }
    .main .aul li .up .left{
        flex: 1; display: flex; justify-content: space-between;  font-size: 0.7rem; color: #438cff;
    }

    .main .count{
        width: 100%; height: 2.5rem; line-height: 2.5rem; border-radius: 0.4rem; border-width: 1px; padding: 0;
        border: 1px solid #ccc; padding-left: 0.6rem; color: #666; box-sizing: border-box;
        position: relative;
    }
    .main .count .innerImg{
        position: relative;
        float: right;
        padding-right: 0.6rem;
        width: 18px;
        height: 100%;
    }
    .main .count .innerImg img{
        width: 18px;
        height: 18px;
        display: block;
        position: absolute;
        top: 50%;
        margin-top: -9px;
    }
    .main .butt{
        width: 30%; height: 2rem; background: #438cff; text-align: center; line-height: 2rem;
        margin: 1rem 0 2rem 6rem; border-radius: 0.4rem; color: #fff; font-size: 0.8rem;
    }
    .picker-modal .toolbar+.picker-modal-inner{
        width: 100%;
    }
    .picker-3d .picker-items-col{
        width: 5rem;
    }
    #calendar-default{
        border: none;
    }

</style>0.