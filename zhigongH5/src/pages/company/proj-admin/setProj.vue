<template>
    <div data-page="createProject" class="page navbar-fixed" @page:reinit="back">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">设置项目</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <p class="ming">
                    <span class="ming-1">{{name}}</span>
                </p>

                <div class="box">
                    <p class="ming">
                        <span class="ming-1">设置劳务公司</span>
                    </p>
                    <input class="ipt" v-model="company" type="text"/>
                </div>

                <div class="box">
                    <p class="ming">
                        <span class="ming-1">项目所在地</span><span class="ming-2">(非必填项,默认为项目绑定考勤机所在地)</span>
                    </p>
                </div>

                <div class="over">
                    <div class="adress" @click.stop.prevent="alertAction">
                        <div class="ad-1 ad">省<img src="../../../../static/img/btn_drop_down.png"/></div>
                        <div class="ad-1 ad-2">市<img src="../../../../static/img/btn_drop_down.png"/></div>
                        <div class="ad-1 ad-3">区<img src="../../../../static/img/btn_drop_down.png"/></div>
                    </div>
                    <input type="text" placeholder="Describe yourself" readonly id="picker-custom-toolbar">
                </div>

                <div class="box">
                    <p class="ming">
                        <span class="ming-1">详细地址</span>
                    </p>
                    <input class="ipt" v-model="address" type="text"/>
                </div>

                <div class="butt" @click="editProjAction">
                    保存
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { userApi, wxApi, projectApi } from '../../../api/index'
    var projectId;
    var companyId;
    var pickerDevice;
    var cityShow = false, areaShow = false;
    export default {
        data(){
            return{
                grouperList: [],
                temporaryWorkerList: [],
                grouperIdList: [],
                temporaryWorkerIdList: [],

                projDetail: {},

                proviceList: [],
                cityList: [''],
                areaList: [''],
                area: {},

                name: '',
                provinceId: '',
                cityId: '',
                districtId: '',
                groupAdmins: '',
                workers: '',
                address: '',
                company: '',

                localAddress: {}   //省市区的地址全放里面存缓存里

            }
        },
        methods:{
            back(){
                console.log('back....');
                this.grouperIdList = [];
                this.temporaryWorkerIdList = [];

                if(this.$store.state.grouperList){
                    this.grouperList = this.$store.state.grouperList;
                    for(var i=0; i<this.grouperList.length; i++){
                        this.grouperIdList.push(this.grouperList[i].id);
                    }
                }
                if(this.$store.state.temporaryWorkerList){
                    this.temporaryWorkerList = this.$store.state.temporaryWorkerList;
                    for(var i=0; i<this.temporaryWorkerList.length; i++){
                        this.temporaryWorkerIdList.push({'position': this.temporaryWorkerList[i].position, 'userId': this.temporaryWorkerList[i].id});
                    }
                    console.log(this.temporaryWorkerIdList);
                }

            },
            alertAction(){
                pickerDevice.open();
            },
            editProjAction(){
                console.log('我点击了');
                projectApi.projerEditProj(
                    //编辑项目参数
                    projectId,
                    companyId,
                    this.projDetail.name,
                    this.provinceId,
                    this.cityId,
                    this.districtId,
                    this.address,
                    this.company
                ).then((result)=>{
                    console.log('我编辑了项目');
                    console.log(result);
                    this.$router.back();
                })
            }

        },
        created(){

        },
        mounted() {
            projectId = this.$route.params.id;
            companyId = this.$store.state.roleInfo.companyId;

            projectApi.projectDetail(projectId).then((result)=>{
                console.log('我获取到了项目信息');
                console.log(result);
                this.name = result.data.name;
                this.company = result.data.company;
                this.address = result.data.address;
                this.provinceId = result.data.provinceId,
                this.cityId = result.data.cityId,
                this.districtId = result.data.districtId,

                wxApi.getProvinceName(this.provinceId).then((resOne)=>{
                    console.log(resOne);
                    $$('.ad').text(resOne.data.name);
                })
                wxApi.getCityName(this.cityId).then((resOne)=>{
                    console.log(resOne);
                    $$('.ad-2').text(resOne.data.name);
                })
                wxApi.getDistrictName(this.districtId).then((resOne)=>{
                    console.log(resOne);
                    $$('.ad-3').text(resOne.data.name);
                })
            });

            //获取省市区地址
            if(this.$store.state.localAddress){
                this.localAddress = this.$store.state.localAddress;
                console.log('对象',this.localAddress);
                for(var key in this.localAddress){
                    this.proviceList.unshift(this.localAddress[key].name);
                };
                console.log('省数组',this.proviceList);
            }else{
                userApi.adressProviceList().then((result)=>{
                    console.log(result.data.list);
                    for(var i=0; i<result.data.list.length; i++){
                        this.localAddress[result.data.list[i].id] = result.data.list[i];
                        this.proviceList.push(result.data.list[i].name)
                    };
                    console.log('省数组2',this.proviceList);
                    console.log('对象',this.localAddress);
                    this.$store.state.localAddress = this.localAddress;
                });
            }

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
                        values:this.proviceList,
                        onChange: (Picker, value)=> {
                            console.log('省', pickerDevice.cols[0].value);
                            cityShow = false;
                            for(var key in this.localAddress){
                                if(this.localAddress[key].name == pickerDevice.cols[0].value){
                                    $$('.ad').text(pickerDevice.cols[0].value);
                                    this.provinceId = key;
                                    console.log(key, this.localAddress[key]);

                                    if(this.localAddress[key].cityObj){
                                        this.cityList = [];
                                        for(var item in this.localAddress[key].cityObj){
                                            this.cityList.unshift(this.localAddress[key].cityObj[item].name);
                                        }
                                        console.log('名1',this.cityList);

                                        if (pickerDevice.cols[1].replaceValues) {
                                            pickerDevice.cols[1].replaceValues(this.cityList);
                                            cityShow = true;
                                        }

                                        for(var item in this.localAddress[key].cityObj){
                                            $$('.ad-2').text(this.localAddress[key].cityObj[item].name);    //这行和下行代码是第一次选地址时加的
                                            this.cityId = this.localAddress[key].cityObj[item].id;
                                            break;
                                        }
                                        userApi.addressAreaList(this.cityId).then((res)=>{
                                            console.log(res.data.list);
                                            $$('.ad-3').text(res.data.list[0].name);    //这行和下行代码是第一次选地址时加的
                                            this.districtId = res.data.list[0].id;
                                            this.areaList = [];
                                            for (var i = 0; i < res.data.list.length; i++) {
                                                this.areaList.push(res.data.list[i].name);
                                            }
                                            console.log('区1',this.areaList);
                                            if(pickerDevice.cols[2].replaceValues){
                                                pickerDevice.cols[2].replaceValues(this.areaList);
                                                areaShow = true;
                                            }
                                        })
                                    }else{
                                        let cityObj = {};
                                        userApi.addressCityList(this.provinceId).then((result)=>{
                                            console.log('市',result.data.list);
                                            let list = result.data.list;
                                            $$('.ad-2').text(list[0].name);    //这行和下行代码是第一次选地址时加的
                                            this.cityId = list[0].id;
                                            userApi.addressAreaList(this.cityId).then((res)=>{
                                                console.log(res.data.list);
                                                $$('.ad-3').text(res.data.list[0].name);    //这行和下行代码是第一次选地址时加的
                                                this.districtId = res.data.list[0].id;
                                                this.areaList = [];
                                                for (var i = 0; i < res.data.list.length; i++) {
                                                    this.areaList.push(res.data.list[i].name);
                                                }
                                                console.log('区2',this.areaList);
                                                if(pickerDevice.cols[2].replaceValues){
                                                    pickerDevice.cols[2].replaceValues(this.areaList);
                                                    areaShow = true;
                                                }
                                            })
                                            this.cityList = [];
                                            for (var i = 0; i < list.length; i++) {
                                                cityObj[list[i].id] = list[i];
                                                this.cityList.push(list[i].name);
                                            }
                                            console.log('名2',this.cityList);

                                            if (pickerDevice.cols[1].replaceValues) {
                                                pickerDevice.cols[1].replaceValues(this.cityList);
                                                cityShow = true;
                                            }
                                        })
                                        this.localAddress[key].cityObj = cityObj;
                                        console.log('yuan',this.localAddress);
                                    }
                                    pickerDevice.cols[1].onChange();
                                    pickerDevice.cols[2].onChange();
                                }
                            }
                        }
                    },
                    {
                        textAlign: "left",
                        values: this.cityList,
                        onChange: (Picker, value)=>{
                            if(cityShow) {
                                areaShow = false;
                                for (var key in this.localAddress) {
                                    for (var item in this.localAddress[key].cityObj) {
                                        if (this.localAddress[key].cityObj[item].name == pickerDevice.cols[1].value) {
                                            $$('.ad-2').text(pickerDevice.cols[1].value);
                                            this.cityId = item;
                                            console.log('shi', item, this.localAddress[key].cityObj[item].name);
                                            this.area = [];                                                             //把单个区作为对象存起来，得到区的id

                                            if(this.localAddress[key].cityObj[item].areaObj){
                                                this.areaList = [];
                                                this.area = this.localAddress[key].cityObj[item].areaObj;
                                                for(var qu in this.localAddress[key].cityObj[item].areaObj){
                                                    this.areaList.unshift(this.localAddress[key].cityObj[item].areaObj[qu].name);
                                                }
                                                console.log('qu2',this.areaList);
                                                if(pickerDevice.cols[2].replaceValues){
                                                    pickerDevice.cols[2].replaceValues(this.areaList);
                                                    areaShow = true;
                                                }
                                            }else {
                                                let areaObj = {};
                                                userApi.addressAreaList(this.cityId).then((result)=>{
                                                    console.log('区',result.data.list);
                                                    let list2 = result.data.list;
                                                    this.areaList = [];
                                                    for (var i = 0; i < list2.length; i++) {
                                                        areaObj[list2[i].id] = list2[i];
                                                        this.areaList.push(list2[i].name);
                                                    }
                                                    console.log('qu3',this.areaList);
                                                    if(pickerDevice.cols[2].replaceValues){
                                                        pickerDevice.cols[2].replaceValues(this.areaList);
                                                        areaShow = true;
                                                    }
                                                })
                                                this.area = areaObj;
                                                this.localAddress[key].cityObj[item].areaObj = areaObj;
                                                console.log('yuan2',this.localAddress);
                                            }
                                            pickerDevice.cols[2].onChange();
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        values: this.areaList,
                        onChange: (Picker, value)=>{
                            if(areaShow){
                                // console.log(pickerDevice.cols[2].value, this.area);
                                for(var key in this.area){
                                    if (this.area[key].name == pickerDevice.cols[2].value) {
                                        $$('.ad-3').text(pickerDevice.cols[2].value);
                                        this.districtId = key;
                                        console.log('区', this.districtId,this.area[key].name);
                                    }
                                }
                            }
                        }
                    },
                ],
                onOpen: (picker)=>{
                    pickerDevice.cols[0].onChange();
                    console.log('调用了');
                }
            });
        }
    }
</script>

<style scoped>
    .main{
        width: 100%; height: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
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
        line-height: 1.75rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .main .over .adress .ad-1 img{
        width: 0.6rem; height: 0.6rem; display: inline-block; position: relative; left: 1.6rem; top: 0.1rem;
    }
    .main .over #picker-custom-toolbar{
        width: 100%; height: 1.75rem; position: absolute; left: 0; top: 0; z-index: -1;
    }

    .main .butt{
        width: 30%; height: 2rem; background: #438cff; text-align: center; line-height: 2rem;
        margin: 1rem 0 2rem 6rem; border-radius: 0.4rem; color: #fff; font-size: 0.8rem;
    }
</style>