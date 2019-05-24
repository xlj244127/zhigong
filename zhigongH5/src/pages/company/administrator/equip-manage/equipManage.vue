<template>
    <div data-page="equipManage" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div v-if="firstShow==2" class="center">设备管理</div>
                <div v-if="firstShow==1" class="center centerOne">设备管理</div>
                <div class="right">
                    <a @click="addMachine"><span v-show="firstShow==2">添加考勤机</span></a>
                </div>
            </div>
        </div>
        <!---侧边栏--->
        <proj-admin v-if="companyRole==2"></proj-admin>
        <company-nav v-else></company-nav>
        <!--页面主要类容-->
        <no-company v-if="companyId==0 || companyRole==3"></no-company>

        <div v-else class="page-content">
            <div v-show="firstShow==2">
                <div class="fixed">
                    <ul class="aul">
                        <li @click="twoAction" :class="{active: isShow==2}">已绑定考勤机</li>
                        <li @click="oneAction" :class="{active: isShow==1}">未绑定考勤机</li>
                    </ul>
                    <div class="map" @click="mapAction">地图模式</div>
                </div>

                <bound v-if="isShow==2" @isShow="showAction" :freeArr="freeArr" :userArr="userArr" :offLineArr="offLineArr"></bound>
                <unbound v-if="isShow==1" @changeShow="reloadList" :listTwo="unboundList"></unbound>
            </div>
            <div v-show="firstShow==1">
                <div id="container"></div>
                <div class="button-group">
                    <input id="setFitView" class="button" type="button" value="地图自适应显示"/>
                </div>
                <div id="btt" @click='btnActionOne'><span>列表</span><br/><span>模式</span></div>
                <button id="tst" @click='btnActionTwo'>
                    <span>点击切换到列表模式</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {map} from '../../../../lib/echarts.js'
    import companyNav from '../../../../components/broadside-navigation/companyAdmin'
    import projAdmin from '../../../../components/broadside-navigation/projAdmin'
    import bound from '../../../../components/equip-manage/bound'
    import unbound from '../../../../components/equip-manage/unbound'
    import noCompany from '../../../../components/company-home/noCompany'
    import scanUtil from '../../../../lib/scanUtil'
    import { machineApi } from '../../../../api'
    import {getQueryFromUrl} from '../../../../lib/utils'

    export default {
        data(){
            return{
                firstShow: 2,    //判断是否是地图模式
                isShow: 2,           //判断列表模式的两个组件
                boundList: {},
                unboundList: [],
                companyRole: '',
                companyId:'',

                freeArr: [],      //已绑定在线考勤机
                userArr: [],      //已绑定在用考勤机
                offLineArr: [],   //已绑定离线考勤机

                position: []         //地图中所有经纬度
            }
        },
        components: {
            bound, unbound, companyNav, projAdmin, noCompany
        },
        methods:{
            btnActionOne(){
                this.firstShow = 2;
            },
            btnActionTwo(){
                this.firstShow = 2;
            },

            //列表模式
            mapAction(){
                this.firstShow = 1;
            },
            oneAction(){
                this.isShow = 1;
                console.log('跳转了one');
            },
            twoAction(){
                this.isShow = 2;
                console.log('跳转了two');
            },
            RequestAction(){
                this.unboundList = [];
                this.freeArr = [];
                this.userArr = [];
                this.offLineArr = [];
                machineApi.listBind().then((result)=>{
                    console.log(result);
                    for(var j=0; j<result.data.length; j++){
                        if(result.data[j].status==0){
                            console.log('空闲');
                            this.freeArr.push(result.data[j]);
                        }
                        if(result.data[j].status==1){
                            console.log('在用');
                            this.userArr.push(result.data[j]);
                        }
                        if(result.data[j].status==2){
                            console.log('离线');
                            this.offLineArr.push(result.data[j]);
                        }
                    }
                    console.log("bl",this.freeArr);
                    console.log("b2",this.userArr);
                    console.log("b3",this.offLineArr);
                });
                machineApi.listUnBind().then((result)=>{
                    console.log(result);
                    this.unboundList = result.data;
                });
            },
            reloadList(){
                console.log('进入已绑定组件');
                this.isShow = 2;
                console.log(this.isShow);
                this.RequestAction();
            },
            showAction(){
                console.log('进入未绑定组件');
                this.isShow = 1;
                this.RequestAction();
            },
            addMachine() {
                let that = this;
                scanUtil.barcodeScan().then((result)=>{
                    let code = result.text;
                    console.log('Scan bacode: ' + code);
                    if(code.startsWith('http://www.cleverdog.com.cn')) {
                        //这是赛兰摄像头
                        let vid = getQueryFromUrl(code, "sn");
                        let c = getQueryFromUrl(code, "code");
                        return machineApi.companyBindCamera(vid, c, this.$store.state.roleInfo.companyId);
                    }
                    else {
                        let strs = code.split('##');
                        if(strs.length === 3 && strs[2].startsWith('YW')) {
                            let machineId = strs[2];
                            console.log('Machine Id: ' + machineId);
                            return machineApi.companyBind(machineId, this.$store.state.roleInfo.companyId);
                        }
                        else
                            that.$f7.alert('不能识别的二维码！');
                    }
                }).then((result)=>{
                    console.log(result);
                    that.unboundList.push(result.data);
                    that.oneAction();
                });
            }
        },
        mounted(){
            this.companyRole = this.$store.state.roleInfo.companyRole;
            this.companyId   = this.$store.state.roleInfo.companyId;
            console.log("$store: "+this.$store.state,this.$store.state);
            console.log(this.companyId);
            if(this.companyId !== 0){
                machineApi.listBind().then((result)=>{
                    console.log('已绑定考勤机列表',result.data);
                    this.boundList = result.data;
                    for(var j=0; j<result.data.length; j++){
                        if(result.data[j].status==0){
                            console.log('空闲');
                            this.freeArr.push(result.data[j]);
                        }
                        if(result.data[j].status==1){
                            console.log('在用');
                            this.userArr.push(result.data[j]);
                        }
                        if(result.data[j].status==2){
                            console.log('离线');
                            this.offLineArr.push(result.data[j]);
                        }
                    }
                    console.log("bl",this.freeArr);
                    console.log("b2",this.userArr);
                    console.log("b3",this.offLineArr);

                    let obj = {};   //一下代码是地图模式的数据
                    for(var i=0; i<this.boundList.length; i++){
                        let str = this.boundList[i].projectName +'_'+ this.boundList[i].status;
                        let arr = [this.boundList[i].longitude, this.boundList[i].latitude];

                        obj[str] = arr;
                        console.log(obj);
                        this.position.push(obj);
                    }
                    console.log('+-*/',this.position);
                });
                machineApi.listUnBind().then((result)=>{
                    console.log(result);
                    this.unboundList = result.data;
                    console.log("未绑定考勤机列表",this.unboundList);
                });

                //展示地图
                setTimeout(()=>{
                    map(this.position);
                },300);
            }

        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .centerOne{
        transform: translateX(-1.5rem);
    }
    .navbar .right{
        font-size: 0.7rem;
    }

    .fixed{
        width: 100%; height: 2.5rem;  background: #fff; border-bottom: 1px solid #f4f4f4;  position: relative;
    }
    .fixed .aul{
        display: flex; width: 100%; box-sizing: border-box; padding: 0 0.6rem;
    }
    .fixed .aul li{
        width: 100px; height: 2.5rem; font-size: 0.7rem; color: #666; line-height: 2.5rem; justify-content: space-between;
        border-bottom: 2px solid #fff;
    }
    .fixed .aul li.active{
        color: #438cff;
        border-bottom: 2px solid #438cff;
    }
    .map{
        width: 69px; height: 30px; background: #1AAD19; border-radius: 4px; text-align: center; line-height: 30px; color: #fff;
        position: absolute; right: 0.6rem; top: 10px;
    }


    #container{
        top: 44px;
    }
    #btt{
        width: 2.5rem; height: 2.5rem; background: #6FC6EF; border-radius: 50%; color: #fff; text-align: center; box-sizing: border-box; padding-top: 8px;
        font-size: 13px; position: fixed; left: 20px; top: 60px;
    }
    #tst{
        width: 100%; height: 30px; background: #fff; position: fixed; left: 0; bottom: 0; z-index: 1110;
    }

    .aul li{
        width: 200px; display: flex;
    }
</style>