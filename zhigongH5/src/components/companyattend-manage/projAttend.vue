<template>
    <div class="box">
        <div class="top">
           今天日期: {{this.startTime}}
        </div>
        <div class="aside">
            <div class="left">项目所在地</div>
            <div class="over">
                <div class="adress" @click.stop.prevent="alertAction">
                    <div class="ad-1 ad">省<img src="../../../static/img/btn_drop_down.png"/></div>
                    <div class="ad-1 ad-2">市<img src="../../../static/img/btn_drop_down.png"/></div>
                </div>
                <input type="text" placeholder="Describe yourself" readonly id="picker-custom-toolbar">
            </div>
        </div>
        <div class="block">
            <div class="nav row">
                <div class="col-50">项目名称</div>
                <div class="col-50" @click="sortAction">项目考勤率 <img src="../../../static/img/shengjiangxu.png"/> </div>
            </div>
            <ul class="list">
                <li class="row" v-for="item in allProjDayAttend" @click="enterAction(item)">
                    <div class="left col-50">{{item.projectName}}:</div> <div class="right col-50"><span class="r-1">{{Math.round(zero(item.attendRate))}}%</span></div>
                    <img src="../../../static/img/btn_right.png">
                </li>
            </ul>
        </div>
        <div class="fixed" v-show="this.totalItems>15">{{this.allProjDayAttend.length==this.totalItems?'已全部加载完':'上拉加载更多'}}</div>
        <img @click="goTopAction" class="returnTop" src="../../../static/img/btn_return_top.png"/>
    </div>
</template>

<script>
    var $$ = Dom7;
    var pickerDevice;
    import moment from 'moment'
    import { statisticalSummaryApi } from '../../api'
    import { userApi } from '../../api'
    var cityShow;
    export default {
        name: "proj-attend",
        data(){
            return{
                erArr: '',
                allProjDayAttend: [],
                startTime: '',
                dataSort: true,
                page: 1,
                pageSize: 15,
                totalPages: '',
                totalItems: '',

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
            zero(value) {
                if(value)
                    return value*100;
                else
                    return 0;
            },
            goTopAction(){
                $$('.page-content').scrollTop(0,0);
            },
            alertAction(){
                pickerDevice.open();
            },
            enterAction(item){
                this.$router.load({url: '/company/projDayAttend/'+item.projectId})
                this.$store.state.projectId = item.projectId;
            },
            sortAction(){    //正序和倒序
                this.dataSort = !this.dataSort;
                this.allProjDayAttend.reverse();
            },
            callApi(){
                console.log('省市',this.provinceId, this.cityId)
                statisticalSummaryApi.allProjDayAttend(this.page, this.pageSize, this.startTime, this.provinceId, this.cityId).then((result)=>{
                    console.log(result);
                    this.allProjDayAttend = result.data;
                    this.totalPages = result.pagination.totalPages;
                    this.totalItems = result.pagination.totalItems;

                    for(var i=0; i<this.allProjDayAttend.length-1; i++){
                        for(var j=0; j<this.allProjDayAttend.length-1; j++){
                            if (this.allProjDayAttend[j].attendRate < this.allProjDayAttend[j+1].attendRate) {
                                var temp = this.allProjDayAttend[j];
                                this.allProjDayAttend[j] = this.allProjDayAttend[j+1];
                                this.allProjDayAttend[j+1] = temp;
                            }
                        }
                    }
                    console.log('排序后',this.allProjDayAttend);
                })
            }
        },
        mounted(){
            //获取省市区地址
            if(this.$store.state.localAddress){
                this.localAddress = this.$store.state.localAddress;
                for(var key in this.localAddress){
                    this.proviceList.push(this.localAddress[key]);
                };
                console.log('省',this.proviceList);
            }else{
                userApi.adressProviceList().then((result)=>{
                    this.proviceList = result.data.list;
                    for(var i=0; i<result.data.list.length; i++){
                        this.localAddress[result.data.list[i].id] = result.data.list[i];
                    };
                    this.$store.state.localAddress = this.localAddress;
                });
            }

            var that = this;
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
                            console.log('省名字',displayValue);

                            if(that.localAddress[value].cityObj){
                                if(value == pickerDevice.cols[0].value){
                                    that.cityIdList = [];
                                    that.cityNameList = [];
                                    for(var key in that.localAddress[value].cityObj){
                                        that.cityIdList.unshift(that.localAddress[value].cityObj[key].id);
                                        that.cityNameList.unshift(that.localAddress[value].cityObj[key].name);
                                    }
                                    console.log('市列表',that.cityNameList);
                                    console.log('省下市',that.localAddress[value]);
                                    if (pickerDevice.cols[1].replaceValues) {
                                        pickerDevice.cols[1].replaceValues(
                                            that.cityIdList,
                                            that.cityNameList
                                        );
                                        that.cityId = that.cityIdList[0];
                                        $$('.ad-2').text(that.cityNameList[0]);
                                        console.log('市',that.cityId,$$('.ad-2').text());
                                        that.callApi();
                                    }
                                }
                            }else{
                                let cityObj = {};
                                userApi.addressCityList(that.provinceId).then((result)=> {
                                    if(value == pickerDevice.cols[0].value){
                                        that.cityList = result.data.list;
                                        for(var i=0; i<that.cityList.length; i++){
                                            cityObj[that.cityList[i].id] = that.cityList[i];
                                        }

                                        this.localAddress[that.provinceId].cityObj = cityObj;
                                        console.log('省下的所有市',this.localAddress[that.provinceId]);

                                        that.cityIdList = [];
                                        that.cityNameList = [];
                                        for(var i=0; i<that.cityList.length; i++){
                                            that.cityIdList.unshift(that.cityList[i].id);
                                            that.cityNameList.unshift(that.cityList[i].name);
                                        }
                                        console.log('市列表2',that.cityNameList);
                                        if (pickerDevice.cols[1].replaceValues) {
                                            pickerDevice.cols[1].replaceValues(
                                                that.cityIdList,
                                                that.cityNameList
                                            );
                                            that.cityId = that.cityIdList[0];
                                            $$('.ad-2').text(that.cityNameList[0]);
                                            console.log('市',this.cityId,$$('.ad-2').text());
                                            this.callApi();

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

                                that.callApi();
                            }

                        }
                    }
                ],
                onOpen: (picker)=>{
                    pickerDevice.cols[0].onChange('Picker', that.provinceId);
                    console.log('调用了');
                }

            });


            let year = new Date().getFullYear();
            let month = new Date().getMonth()+1;
            month = month>9?month:'0'+month;
            let day = new Date().getDate();
            day = day>9?day:'0'+day;

            this.startTime = year+'-'+month+'-'+day;
            console.log(this.startTime);

            this.callApi();

            var loading = false;
            $$('.infinite-scroll').on('infinite', ()=>{
                if(loading) return;
                loading = true;

                setTimeout(()=>{
                    this.page++;
                    console.log('我被点击了',this.page);
                    loading = false;

                    if (this.page <= this.totalPages) {
                        statisticalSummaryApi.allProjDayAttend(this.page, this.pageSize, this.startTime, this.provinceId, this.cityId).then((result)=>{
                            console.log(result);
                            this.allProjDayAttend = this.allProjDayAttend.concat(result.data);

                            for(var i=0; i<this.allProjDayAttend.length-1; i++){
                                for(var j=0; j<this.allProjDayAttend.length-1; j++){
                                    if (this.allProjDayAttend[j].attendRate < this.allProjDayAttend[j+1].attendRate) {
                                        var temp = this.allProjDayAttend[j];
                                        this.allProjDayAttend[j] = this.allProjDayAttend[j+1];
                                        this.allProjDayAttend[j+1] = temp;
                                    }
                                }
                            }
                            console.log('排序后',this.allProjDayAttend);
                        })
                    }
                }, 1000);
            })
        }
    }
</script>

<style scoped>
    .top{
        width: 100%; height: 2rem; line-height: 2rem; background: #fff; box-sizing: border-box; padding-left: 0.6rem;
        font-size: 0.7rem; color: #aaa; border-bottom: 1px solid #f4f4f4;
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
        padding: 0 2px;
    }
    .aside .over .adress .ad-1 img{
        width: 0.6rem; height: 0.6rem; display: inline-block; position: relative; left: 0.6rem; top: 0.1rem;
    }
    .aside .over #picker-custom-toolbar{
        width: 100%; height: 1.75rem; position: absolute; left: 0; top: 0.7rem; z-index: -1;
    }

    .block{
        width: 100%; background: #fff; margin-top: 0.5rem;
    }
    .block .nav{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; border-bottom: 1px solid #f4f4f4;
        box-sizing: border-box; padding: 0 0.75rem 0 0.6rem; font-size: 0.7rem; color: #aaa;
    }
    .block .nav div img{
        width: 0.75rem; height: 0.75rem; display: inline-block; transform: translateY(0.15rem);
    }
    .list li{
        width: 100%; height: 1.75rem; line-height: 1.75rem; display: flex; justify-content: space-between; position: relative;
        box-sizing: border-box; padding: 0 0.75rem 0 0.6rem; font-size: 0.7rem; color: #666;
    }
    .list li img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.4rem; right: 0.75rem;
    }
    .list li .left{
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .list li .right .r-1{
        position: relative; left: 1.7rem;
    }

    .fixed{
        width: 100%; height: 20px; line-height: 20px; text-align: center; font-size: 0.5rem; color: #999999; position: fixed; left: 0; bottom: 0; background: #fff;
    }
    .returnTop{
        width: 1.5rem; height: 1.5rem; position: fixed; right: 20px; bottom: 20px;
    }
</style>