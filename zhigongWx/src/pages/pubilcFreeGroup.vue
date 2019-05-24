<template>
    <div data-page="pubilcFreeGroup" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">发布空闲班组</div>
            </div>
        </div>
        <div class="page-content">
            <div class="aside">
                <div class="left">班组所在地</div>
                <div class="over">
                    <div class="adress" @click.stop.prevent="addressAction">
                        <div class="ad-1 ad">省<img src="../../static/img/btn_drop_down.png"/></div>
                        <div class="ad-1 ad-2">市<img src="../../static/img/btn_drop_down.png"/></div>
                    </div>
                    <input type="text" placeholder="Describe yourself" readonly id="picker-toolbarfour">
                </div>
            </div>

            <div class="nav">
                <div class="left">添加空闲班组</div>
                <div class="right">
                    <div class="r-1">
                        <img v-show="isShow==1" @click="deleteAction" src="../../static/img/shanchu@2x.png"/>
                    </div>
                    <div class="r-3" v-show="isShow==2" @click="comfirmDeleteAction">确认删除</div>
                    <div class="r-2" v-show="isShow==1" @click="addTypeAction">
                        <div class="cover">添加工种</div>
                        <div class="down">
                            <!--<input type="text" id="picker-devicefive" readonly/>-->
                        </div>
                    </div>
                </div>
            </div>
            <div class="main">
                <div v-if="isShow==1">
                    <ul class="aul" id="aul">
                        <li class="li2" v-for="(item, index) in pubilcFreeGroupUpData" :data-id="item.workType.split('_')[1]">
                            <div class="m-1">{{item.workType.split('_')[0]}}</div>
                            <div class="m-2" @click.stop.prevvent="reduceAction(index)">
                                <img src="../../static/img/jian.png"/>
                            </div>
                            <div class="m-3">
                                <span class="m4">{{item.freeAmount}}</span><br/><span class="m5">人数</span>
                            </div>
                            <div class="m-2" @click="addAction(index)">
                                <img src="../../static/img/jia.png"/>
                            </div>
                            <div class="m-4" @click="selectTimeAction(index)">
                                <div class="left">
                                    <span class="t-1">{{item.freeTime==''?'选择空闲日期':item.freeTime}}</span>
                                    <img src="../../static/img/riqi2.png"/>
                                </div>
                                <div class="right">
                                    <input id="calendar-defaultsix" type="text" readonly/>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="line"></div>
                    <div class="state">
                        <div class="shan">班组说明</div>
                        <textarea class="xia" v-model="remark">&nbsp;&nbsp;</textarea>
                    </div>
                </div>
                <ul class="aul2 infinite-scroll" v-if="isShow==2">
                    <li v-for="item in pubilcFreeGroupUpData">
                        <label class="label-checkbox item-content">
                            <div class="item-inner">
                                <div class="m-1">{{item.workType.split('_')[0]}}</div>
                                <div class="m-2">
                                    <img src="../../static/img/jian.png"/>
                                </div>
                                <div class="m-3">
                                    <span class="m4">{{item.freeAmount}}</span><br/><span class="m5">人数</span>
                                </div>
                                <div class="m-2">
                                    <img src="../../static/img/jia.png"/>
                                </div>
                                <div class="m-4">
                                    <span>{{item.freeTime==''?'选择空闲日期':item.freeTime}}</span>
                                    <img src="../../static/img/riqi2.png"/>
                                </div>
                            </div>
                            <input type="checkbox" name="put" :data-id="item.workType.split('_')[1]">
                            <div class="item-media">
                                <i class="icon icon-form-checkbox"></i>
                            </div>
                        </label>
                    </li>
                </ul>
            </div>

            <div class="footer" v-if="isShow==1">
                <div class="f-1" @click="publicAction">发布状态</div>
            </div>

        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { tabulateStatisticsApi, userApi, wxApi} from '../api';
    import { LocalCache } from '../lib/utils';
    import moment from 'moment';
    var pickerAddress;
    var calendarInline;
    let monthNames = ['01', '02', '03', '04', '05', '06', '07', '08' , '09' , '10', '11', '12'];
    let dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    let dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];

    var index2;
    var ids = {};
    var cityShow;
    export default {
        data(){
            return{
                userInfo: {},
                workerTitle: [],
                isShow: 1,
                typecode: '',
                typename: '',
                pubilcFreeGroupUpData: [],
                time: '',
                workGroupId: '',
                workType: '',
                list: [],
                remark: '',

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
        methods:{
            back(){
                console.log('吊起可back...',this.$store.state.pubilcFreeGroupUpData)
                this.pubilcFreeGroupUpData = this.$store.state.pubilcFreeGroupUpData
            },
            addressAction(){
                pickerAddress.open();
            },
            deleteAction(){
                this.isShow = 2;
                this.pubilcFreeGroupUpData = this.$store.state.pubilcFreeGroupUpData;
                console.log(this.pubilcFreeGroupUpData);

            },
            comfirmDeleteAction(){
                ids = {};
                $$('input[name=put]:checked').each((idx, elm)=>{
                    let id = $$(elm).data('id');
                    ids[id] = id;
                    console.log(ids);
                    this.pubilcFreeGroupUpData = this.pubilcFreeGroupUpData.filter((item)=>{
                        return !ids[item.workType.split('_')[1]];
                    })
                });
                this.$store.state.pubilcFreeGroupUpData = this.pubilcFreeGroupUpData;
                console.log(this.pubilcFreeGroupUpData);
                this.isShow = 1;
            },
            reduceAction(index){
                console.log(index);

                for(var i=0; i<this.pubilcFreeGroupUpData.length; i++){
                    if(i==index){
                        if(this.pubilcFreeGroupUpData[i].freeAmount==1){

                        }else{
                            this.pubilcFreeGroupUpData[i].freeAmount--
                        }
                    }
                }
            },
            addAction(index){
                console.log(index);
                console.log('加',this.pubilcFreeGroupUpData);
                for(var i=0; i<this.pubilcFreeGroupUpData.length; i++){
                    if(i==index){
                        this.pubilcFreeGroupUpData[i].freeAmount++
                    }
                }
            },
            selectTimeAction(index){
                index2 = index;
                console.log(index);
                console.log(index2);
                setTimeout(() => {
                    calendarInline.open();
                })
            },
            addTypeAction(){
                console.log('我点击了');
                this.$router.load({url: '/user/selectType/2/:arguments'})
            },
            publicAction(){
                this.list=$$.extend([],this.pubilcFreeGroupUpData);      //赋值后修改不会改变原数组
                if(this.list.length==0){
                    this.$f7.alert('请选择工种');
                    return;
                }
                for(var i=0; i<this.list.length; i++){
                    this.list[i].workType = this.list[i].workType.split('_')[1];
                    if(this.list[i].freeTime == ''){
                        this.$f7.alert('请选择工种预计空闲时间');
                        return;
                    }
                }
                console.log('list', this.list);
                console.log('data',this.pubilcFreeGroupUpData);
                if(this.provinceId=='' || this.cityId==''){
                    this.$f7.alert('请选择班组所在地');
                    return;
                }
                wxApi.grouperPublicType(
                    this.provinceId,
                    this.cityId,
                    JSON.stringify(this.list),
                    this.remark
                ).then((result)=>{
                    console.log(result.data);
                    this.pubilcFreeGroupUpData = [];
                    this.$store.state.pubilcFreeGroupUpData = this.pubilcFreeGroupUpData;
                    console.log('成功',this.pubilcFreeGroupUpData);
                    this.workGroupId = result.data.id;
                    this.$store.state.workGroupId = this.workGroupId;  //保存班组id

                    this.$router.back()
                })
            },
            selectCity(){
                let that = this;
                pickerAddress = this.$f7.picker({
                    input: '#picker-toolbar_9',
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
            }
        },
        mounted(){
            //每次进页面清空数据或读取数据
            console.log('重新加载了页面');
            this.pubilcFreeGroupUpData = this.$store.state.pubilcFreeGroupUpData;

            this.workGroupId = this.$store.state.workGroupId;

            wxApi.groupExplain(this.workGroupId).then((result)=>{
                console.log('班组说明',result.data);
                this.remark = result.data.remark;
            })

            var that = this;
            calendarInline = this.$f7.calendar({
                input: '#calendar-defaultsix',
                dateFormat: 'yyyy-MM-dd',
                monthNames, dayNames, dayNamesShort,
                onDayClick(p, dayContainer, year, month, day) {
                    let $day = moment().year(year).month(month).date(day).format('YYYY-MM-DD');

                    for(var i=0; i<that.pubilcFreeGroupUpData.length; i++){
                        if(i==index2){
                            that.pubilcFreeGroupUpData[i].freeTime = $day;
                        }
                    }
                    p.close();
                    that.$f7.closeModal();
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

        }
    }
</script>
<style scoped>
    .page-on-left{
        transform: translate3d(0,0,0);  -webkit-transform: translate3d(0,0,0);
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4; position: relative;
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
    .aside .over #picker-toolbarfour{
        width: 100%; height: 1.75rem; position: absolute; left: 0; top: 0.7rem; z-index: -1;
    }

    .nav{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; justify-content: space-between; box-sizing: border-box;
        padding: 0 0.6rem; border-bottom: 1px solid #f4f4f4; background: #fff; margin-top: 0.4rem;
    }
    .nav .left{
        flex: 1; font-size: 0.7rem; color: #666666;
    }
    .nav .right{
        width: 8rem; display: flex; justify-content: space-between;
    }
    .nav .right .r-1{
        width: 3rem; height: 2rem; text-align: center;
    }
    .nav .right .r-1 img{
        width: 1.85rem; height: 0.55rem; display: inline;
    }
    .nav .right .r-3{
        width: 2.5rem; height: 0.9rem; line-height: 0.9rem; text-align: center; border: 1px solid #438CFF; border-radius: 0.45rem; font-size: 0.4rem; color: #438CFF; margin-top: 0.5rem;
    }
    .nav .right .r-2{
        width: 3.25rem; height: 1.1rem; line-height: 1.1rem; text-align: center; background: #438CFF; color: #fff; font-size: 0.55rem;
        border-radius: 0.55rem; margin-top: 0.45rem; position: relative;
    }
    .nav .right .r-2 .cover{
        width: 100%; height: 100%;
    }
    .nav .right .r-2 .down{
        width: 100%; height: 100%; position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0;
    }
    .nav .right .r-2 .down input{
        width: 100%;
    }

    .main{
        background: #fff;
    }
    .main .aul{

    }
    .main .aul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; display: flex; font-size: 0.7rem; box-sizing: border-box; padding: 0 0.6rem;
        border-bottom: 1px solid #f4f4f4;
    }
    .main .aul li .m-1{
        min-width: 4.25rem; color: #666666;
    }
    .main .aul li .m-2{
        width: 2rem; height: 2.5rem; text-align: center;
    }
    .main .aul li .m-2 img{
        width: 1.01rem; height: 1.01rem; display: inline-block; margin-top: 0.7rem;
    }
    .main .aul li .m-3{
        width: 2.1rem; min-height: 50px;
    }
    .main .aul li .m-3 .m4{
        width: 2.1rem; height: 0.7rem; line-height: 0.7rem; text-align: center; font-size: 0.65rem; color: #156EFE; border: 1px solid #bbd2f7;
        border-radius: 0.1rem; margin-top: 0.7rem; display: inline-block; float: left;
    }
    .main .aul li .m-3 .m5{
        width: 2.1rem; height: 12px; text-align: center; font-size: 0.5rem; color: #C8DDFF; display: inline-block; transform: translateY(-38px);
    }
    .main .aul li .m-4{
        position: relative;
    }
    .main .aul li .m-4 .left{

    }
    .main .aul li .m-4 .left span{
        color: #438CFF;
    }
    .main .aul li .m-4 .left img{
        width: 0.6rem; height: 0.65rem;
    }
    .main .aul li .m-4 .right{
        position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0;
    }
    .main .aul li .m-4 .right input{
        width: 100%;
    }
    .main .line{
        width: 100%; height: 5px; background: #f4f4f4;
    }
    .main .state{
        box-sizing: border-box; padding: 0 0.6rem; overflow: hidden;
    }
    .main .state .shan{
        width: 100%; font-size: 0.7rem; color: #666; margin: 0.5rem 0 0.4rem 0;
    }
    .main .state .xia{
        width: 100%; height: 3.5rem; font-size: 0.65rem; color: #666666; box-sizing: border-box; padding-left: 4px;
    }

    .main .aul2 li{
        border-bottom: 1px solid #f4f4f4;
    }
    .main .aul2 li .item-content{
        width: 100%; display: flex; height: 2.5rem; line-height: 2.5rem;
    }
    .main .aul2 li .item-content .item-inner{
        width: 100%; display: flex; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul2 li .item-content .item-inner .m-1{
        min-width: 4.3rem; color: #666666;
    }
    .main .aul2 li .item-content .item-inner .m-2{
        width: 2rem; height: 2.5rem; text-align: center;
    }
    .main .aul2 li .item-content .item-inner .m-2 img{
        width: 1.01rem; height: 1.01rem; display: inline-block; margin-top: 0.7rem;
    }
    .main .aul2 li .item-content .item-inner .m-3{
        width: 2.1rem; min-height: 50px;
    }
    .main .aul2 li .item-content .item-inner .m-3 .m4{
        width: 2.1rem; height: 0.7rem; line-height: 0.7rem; text-align: center; font-size: 0.65rem; color: #156EFE; border: 1px solid #bbd2f7;
        border-radius: 0.1rem; margin-top: 0.7rem; display: inline-block; float: left;
    }
    .main .aul2 li .item-content .item-inner .m-3 .m5{
        width: 2.1rem; height: 12px; text-align: center; font-size: 0.5rem; color: #C8DDFF; display: inline-block; transform: translateY(-38px);
    }
    .main .aul2 li .item-content .item-inner .m-4 span{
        color: #438CFF;
    }
    .main .aul2 li .item-content .item-inner .m-4 img{
        width: 0.6rem; height: 0.65rem;
    }
    .main .aul2 li .item-content .item-media{
        width: 2.2rem;
    }
    .main .aul2 li .item-content .item-media .icon{
        width: 0.8rem; height: 0.8rem; margin-top: 0.75rem;
    }

    .footer{
        width: 100%; height: 2.5rem; background: #fff; position: fixed; left: 0; bottom: 0;
    }
    .footer .f-1{
        margin: 0.5rem auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF;
    }
</style>