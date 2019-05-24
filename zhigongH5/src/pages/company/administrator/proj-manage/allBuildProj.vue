<template>
    <div data-page="allBuildProj" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">在建项目列表</div>
            </div>
        </div>
        <div class="page-content infinite-scroll">
            <div class="line" id="return"></div>

            <div class="ipt">
                <a href="/company/projectSeacher/">
                    <input placeholder="请输入项目名称搜索" type="text" readonly/>
                    <button class="sub">搜索</button>
                    <img src="../../../../../static/img/icon_search.png"/>
                </a>
                <div class="pick">
                    <button class="p-1">筛选</button>
                    <input type="text" readonly id="picker-custom" @click="alertPicker">
                </div>
            </div>

            <div class="line"></div>
            <div class="main">
                <div class="head">
                    <div class="h-1">项目名称</div><div class="h-1">项目所在地</div><div class="h-1">项目创建时间</div>
                </div>
                <ul class="cont">
                    <li v-for="item in list" @click.stop.prevent="enteringAction(item)">
                        <a>
                            <div class="c-1">{{item.name}}</div><div class="c-1">{{item.location}}</div><div class="c-1 c-2">{{new Date(item.startTime).getFullYear()}}-{{new Date(item.startTime).getMonth()+1}}-{{new Date(item.startTime).getDate()}}</div>
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="fixed" v-show="this.totalItems>15">{{this.list.length==this.totalItems?'已全部加载完':'上拉加载更多'}}</div>
            <img @click="goTopAction" class="returnTop" src="../../../../../static/img/btn_return_top.png"/>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    var pickerDevice;
    import { projectApi } from '../../../../api'
    import { userApi } from '../../../../api'
    import { statisticalSummaryApi } from '../../../../api'
    export default {
        data(){
            return{
                list:[],
                page: 1,
                pageSize: 15,
                totalPages: '',
                totalItems: '',

                proviceList: [],            //以下都是调省市区插件的参数
                cityList: ['加载中'],
                areaList: ['加载中'],
                province: '',
                city: '',
                area: '',
                provinceId: '',
                cityId: '',
                districtId: ''
            }
        },
        methods:{
            alertPicker(){
                pickerDevice.open();
            },
            enteringAction(item){
                this.$router.load({url: '/company/buildProjDetail/'+item.id});
            },
            goTopAction(){
                $$('.page-content').scrollTop(0,0);
            }
        },
        mounted(){
            projectApi.allProjectList(this.page, this.pageSize).then((result)=>{
                console.log(result);
                this.list = result.data;
                this.totalPages = result.pagination.totalPages;
                this.totalItems = result.pagination.totalItems;
            })

            var loading = false;
            $$('.infinite-scroll').on('infinite', ()=>{
                if(loading) return;
                loading = true;

                var that = this;
                setTimeout(()=>{
                    that.page++;
                    console.log('我被点击了',that.page);
                    loading = false;

                    if (that.page <= that.totalPages) {
                        projectApi.allProjectList(this.page, this.pageSize).then((result)=>{
                            console.log(result);
                            that.list = that.list.concat(result.data);
                            console.log('排序后',that.list);
                        })
                    }
                }, 1000);
            })

            //获取省市区地址
            if(this.$store.state.arr){
                this.arr = this.$store.state.arr;
                if(this.proviceList){
                    this.proviceList = this.$store.state.proviceList;
                }else{
                    for(var i=0; i<this.arr.length; i++){
                        this.proviceList.push(this.arr[i].name);
                    };
                    this.$store.state.proviceList = this.proviceList;
                }
            }else{
                userApi.adressProviceList().then((result)=>{
                    // console.log(result.data.list);
                    this.arr = result.data.list;
                    this.$store.state.arr = result.data.list;
                    for(var i=0; i<this.arr.length; i++){
                        this.proviceList.push(this.arr[i].name)
                    };
                    this.$store.state.proviceList = this.proviceList;
                });
            }

            pickerDevice = this.$f7.picker({
                input: '#picker-custom',
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
                            this.province = this.arr[pickerDevice.cols[0].activeIndex];
                            this.provinceId = this.province.id;
                            userApi.addressCityList(this.province.id).then((result)=>{
                                console.log('市');
                                console.log(result);
                                this.arr2 = result.data.list;
                                this.cityList = [];
                                for (var i = 0; i < this.arr2.length; i++) {
                                    this.cityList.push(this.arr2[i].name);
                                    console.log(this.cityList);
                                }
                                if (pickerDevice.cols[1].replaceValues) {
                                    pickerDevice.cols[1].replaceValues(this.cityList);
                                }
                                pickerDevice.cols[1].onChange();
                            })

                            pickerDevice.cols[2].onChange();

                        }
                    },
                    {
                        textAlign: "left",
                        values: this.cityList,
                        onChange: (Picker, value)=>{
                            if(this.arr2){
                                this.city = this.arr2[pickerDevice.cols[1].activeIndex];
                                this.cityId = this.city.id;
                                userApi.addressAreaList(this.city.id).then((result)=>{
                                    console.log('区');
                                    console.log(result);
                                    this.arr3 = result.data.list;
                                    this.areaList = [];
                                    for (var i = 0; i < this.arr3.length; i++) {
                                        this.areaList.push(this.arr3[i].name);
                                        console.log(this.areaList);
                                    }
                                    if(pickerDevice.cols[2].replaceValues){
                                        pickerDevice.cols[2].replaceValues(this.areaList);
                                    }
                                    pickerDevice.cols[2].onChange();
                                })
                            }
                        }
                    },
                    {
                        values: this.areaList,
                        onChange: (Picker, value)=>{
                            if(this.arr3){
                                this.area = this.arr3[pickerDevice.cols[2].activeIndex];
                                this.districtId = this.area.id;

                                console.log('省市区',this.provinceId, this.cityId, this.districtId)
                                projectApi.addressProjectList(this.provinceId, this.cityId, this.districtId).then((result)=>{
                                    console.log(result);
                                    this.list = result.data;
                                })
                            }
                        }
                    },
                ],

            });
        }
    }
</script>

<style scoped>
.page-content{
    width: 100%; height: 100%; background: #fff;
}
.ipt{
    width: 100%; height: 2rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem; display: flex;
}
.ipt a{
     flex: 1; height: 100%; position: relative;
}
.ipt a input{
    width: 100%; height: 2rem; line-height: 2rem; border: none; box-sizing: border-box; padding-left: 2rem;
}
.ipt a .sub{
    width: 2.7rem; height: 1.5rem; line-height: 1.5rem; border-radius: 0.3rem; margin-top: 0.3rem; color: #fff;
    border:  none; position: absolute; right: 0px; top: 0;
}
.pick{
    position: relative; margin-top: 0.3rem; margin-left: 0.5rem;
}
.pick .p-1{
    width: 2.7rem; height: 1.5rem; line-height: 1.5rem; border-radius: 0.3rem; color: #fff; text-align: center;
    background: #438CFF; border: none;
}
#picker-custom{
    width: 2.7rem; height: 1.5rem; position: absolute; left: 0; top: 0; z-index: 10; opacity: 0;
}
.ipt a img{
    width: 0.9rem; height: 0.9rem; position: absolute; left: 0.6rem; top: 0.5rem;
}

.line{
    width: 100%; height: 0.5rem; background: #f4f4f4;
}
.main{
    width: 100%; box-sizing: border-box; padding: 0 0.6rem;
}
.main .head{
    width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #aaa; display: flex; border-bottom: 1px solid #f4f4f4;
}
.main .head .h-1{
    flex: 1;
}
.main .cont{

}
.main .cont li{
    width: 100%; height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #f4f4f4;  position: relative;
}
.main .cont li a{
    display: flex; width: 100%; height: 100%; font-size: 0.7rem; color: #666;
}
.main .cont li a .c-1{
    flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.main .cont li a .c-2{
    transform: translateX(0.6rem);
}
.main .cont li a img{
    width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.8rem;
}

.fixed{
    width: 100%; height: 20px; line-height: 20px; text-align: center; font-size: 0.5rem; color: #999999; position: fixed; left: 0; bottom: 0; background: #fff;
}
.returnTop{
    width: 1.5rem; height: 1.5rem; position: fixed; right: 20px; bottom: 20px;
}
</style>