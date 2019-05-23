<template>
    <div data-page="searchProj" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">我的班组</div>
            </div>
        </div>
        <div class="page-content">
            <div v-if="workGroupId!=0">
                <div class="box" v-for="(item,index) in workList">                      <!--有数据时显示-->
                    <div class="head">
                        <div class="left">
                            <img src="../../static/img/grayxiaodinwei2.png"/>&nbsp;<span>{{item.name}}</span>
                        </div>
                        <div class="right">
                            <div class="r-1" @click="btnEideAction(item)"><img src="../../static/img/bainji@2x.png"/></div>
                        </div>
                    </div>
                    <div class="cent">
                        <div class="a3-2" v-for="one in item.list">
                            <div class="left">{{one.workType.split('_')[0]}}</div>
                            <div class="left2"><span class="t">{{one.freeAmount}}</span><span class="t2">人</span></div>
                            <div class="left3">{{one.freeTime}}起</div>
                        </div>
                    </div>
                    <div class="option" >
                        <div class="fl" @click="refresh(item)">
                            <img src="../../static/img/search_refresh.png" alt="">
                        </div>
                        <div class="share" @click="shareAction(item)">
                            <img src="../../static/img/search_share.png"/>
                        </div>
                    </div>
                    <div class="tipBox" v-show="index==0&&tipShow==true ">
                        <img class="searchTip" src="../../static/img/search_tip_2.png" alt="">
                        <img class="searchClose" src="../../static/img/search_tip_close.png" alt="" @click="closeTip">
                    </div>
                </div>
                <div class="box2">
                    <div class="tit">
                        <div class="left">
                            <img src="../../static/img/tonggao.png"/>
                            <span>班组说明</span>
                        </div>
                        <div class="right" @click="modificationAction()"><img src="../../static/img/bainji@2x.png"/></div>
                    </div>
                    <div class="explain">
                        &nbsp;&nbsp;<span>{{this.remark}}</span>
                    </div>
                </div>
            </div>
            <div v-else class="tishi">
                暂无信息
            </div>
        </div>
        <!--引导发布-->
        <div class="pick2" v-show="toShare==1"></div>
        <div class="title" v-show="toShare==1">
            <img class="tp" src="../../static/img/yindao_icom.png"/>
            <div class="tp2">
                <div class="tp2-1">认证班组</div>
                <div class="tp2-2">您还不是班组长身份，无法查看发布信息</div>
                <div class="tp2-3">请先发布班组</div>
            </div>
            <div class="tp3">
                <div class="left left2" @click="cancel2Action">取消</div>
                <div class="left left3"><a href="/user/pubilcFreeGroup">发布班组</a></div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { tabulateStatisticsApi, wxApi} from '../api';
    import { LocalCache } from '../lib/utils';
    import { shareServer, shareAppid, serverceshi} from '../config';
    import moment from 'moment';
    export default {
        data(){
            return{
                haveList: '',
                workGroupId: '',
                workList: [],           //接口获取数据赋值
                workerTitle: [],
                upData: [],             //修改赋值数据成接口上传数据
                remark: '',
                titleHandle: 0,
                groupName: '',
                shareTitle: {},
                typeName: [],
                toShare: 0,
                tipShow:true,
            }
        },
        methods:{
            back(){
                this.workGroupId = this.$store.state.workGroupId;
                    if(this.workGroupId==0){
                        this.toShare = 1;
                    }else{
                        this.toShare = 0;
                        wxApi.lookGrouperPublic(this.workGroupId).then((result)=>{
                            this.workList = result.data;
                            this.haveList = this.workList.length;
                            // this.$store.state.address = {                 //把省市Id放到缓存里面
                            //     provinceId: result.data[0].province.id,
                            //     cityId: result.data[0].city.id,
                            // };
                            for(var i=0; i<this.workList.length; i++){
                                for(var key in this.workList[i].list){
                                    for(var j=0; j<this.workerTitle.length; j++){
                                        if(this.workList[i].list[key].workType == this.workerTitle[j].code){
                                            this.workList[i].list[key].workType = this.workerTitle[j].value+'_'+this.workerTitle[j].code;
                                        }
                                    }
                                }
                            }
                            console.log('列表',this.workList);
                        })
                        wxApi.groupExplain(this.workGroupId).then((result)=>{
                            console.log('班组说明',result.data);
                            this.remark = result.data.remark;
                        })
                    }
            },
            btnEideAction(item){
                console.log('one');
                this.$router.load({url: '/user/editGroupFree/'});
                this.$store.state.cityWorkerList = item;
            },
            modificationAction(){
                this.$router.load({url: '/user/editGroupRemark/'});
                this.$store.state.storeRemark = this.remark;
            },
            shareAction(item){
                console.log('省市空闲班组',item);
                this.shareTitle = {};
                for(var i=0; i<item.list.length; i++){
                    this.typeName.push(item.list[i].workType.split('_')[0]);
                }
                this.shareTitle = {
                    'remark': this.remark,
                    'groupName': this.groupName,
                    'typeName': this.typeName.join(',')
                }
                this.$store.state.shareTitle = this.shareTitle;
                console.log('省市空闲班组2',this.$store.state.shareTitle);

                this.$router.load({url: '/user/cityGroupFree/'+item.list[0].province.id+'/'+item.list[0].city.id})
            },
            cancel2Action(){
                this.toShare = 0;
            },
            refresh(item){
                console.log("refresh",item);
                let cityId = item.list[0].city.id, provinceId = item.list[0].province.id,workGroupId = item.list[0].workGroupId
                wxApi.refreshWorkFree(null,workGroupId,provinceId,cityId).then((res)=>{
                    console.log("refreshWorkFree",res);
                    if(res.code==0){
                        this.$f7.alert("刷新成功")
                    }
                })
            },
            closeTip(){
                this.tipShow = false
            },
        },
        mounted(){
            this.workGroupId = this.$store.state.workGroupId;
            console.log('班组长id',this.workGroupId);

            if(this.workGroupId==0){
                this.toShare = 1;
            }else{
                this.toShare = 0;

                if(this.$store.state.workerTitle){
                    this.workerTitle = this.$store.state.workerTitle;
                }else{
                    tabulateStatisticsApi.typeSort('workType').then((result)=>{
                        this.workerTitle = result.data.list;
                        this.$store.state.workerTitle = this.workerTitle;
                        console.log(this.workerTitle);
                    })
                }
                wxApi.lookGrouperPublic(this.workGroupId, '', '').then((result)=>{
                    this.workList = result.data;
                    this.haveList = this.workList.length;
                    console.log(this.haveList);
                    // this.$store.state.address = {                 //把省市Id放到缓存里面
                    //     provinceId: result.data[0].list[0].province.id,
                    //     cityId: result.data[0].list[0].city.id,
                    // };
                    for(var i=0; i<this.workList.length; i++){
                        for(var key in this.workList[i].list){
                            for(var j=0; j<this.workerTitle.length; j++){
                                if(this.workList[i].list[key].workType == this.workerTitle[j].code){
                                    this.workList[i].list[key].workType = this.workerTitle[j].value+'_'+this.workerTitle[j].code;
                                }
                            }
                        }
                    }
                    console.log('列表',this.workList);
                })

                wxApi.groupExplain(this.workGroupId).then((result)=>{
                    console.log('班组说明',result.data);
                    this.remark = result.data.remark;
                    this.groupName = result.data.name;
                })
            }
            console.log('弹框判断',this.toShare);

            var query3 = window.location.href;
            this.url = query3.split('#')[0]
            this.userId = LocalCache.get('userInfo').id;
            console.log(query3,this.url,this.userId);

            wxApi.getConfig(false, this.url).then((result)=> {
                this.config = JSON.parse(result.data);
                console.log('签名', this.config);

                wx.config(
                    this.config
                );

            })

        }
    }
</script>
<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .box{
        position: relative;
    }
    .box .head{
        width: 100%; height: 1.5rem; line-height: 1.5rem; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
        display: flex; justify-content: space-between; background: #F2F7FB;
    }
    .box .head .left{
        font-size: 0.7rem; color: #666666;
    }
    .box .head .left img{
        width: 0.6rem; height: 0.75rem; transform: translateY(2px);
    }
    .box .head .right{

    }
    .box .head .right .r-1 img, .r-2 img{
        width: 1.85rem; height: 0.55rem;
    }
    .box .head .right .r-1,.box .head .right .refresh{
        float: left;
    }
    .box .head .right .refresh{
        margin-left: 1rem;
    }
    .box .head .right .refresh img{
        width: .65rem;
        height: .55rem;
    }
    .box .head .right .refresh span{
        color: #438cff;
    }
    .box .cent{
        background: #fff;
    }
    .box .cent .a3-2{
        width: 100%; height: 1.5rem; line-height: 1.5rem; display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 2.6rem 0 1.1rem;
    }
    .box .cent .a3-2 .left{
        min-width: 4.4rem; display: inline-block; font-size: 0.65rem; color: #438CFF;
    }
    .box .cent .a3-2 .left2{
        padding-right: 2rem; font-size: 0.6rem;
    }
    .box .cent .a3-2 .left2 .t{
        color: #EF7373;
    }
    .box .cent .a3-2 .left2 .t2{
        color: #777777;
    }
    .box .cent .a3-2 .left3{
        font-size: 0.55rem; color: #777;
    }
    .box .option{
        width: 100%; height: 1.2rem; line-height: 24px; font-size: 0.55rem; color: #999999; box-sizing: border-box; padding: 0 0.6rem; text-align: right; background: #fff;
        overflow: hidden;
        padding-top: .1rem;
    }
    .box .option img{
        width: 3.4rem; height: 1.1rem; display: inline-block;
    }
    .option .fl{
        float: left;
    }
    .box .share{
        width: 100%; height: 24px; line-height: 24px; font-size: 0.55rem; color: #999999; box-sizing: border-box;text-align: right; background: #fff;
    }
    .box .share img{
        width: 2.45rem; height: 1.1rem;
    }
    .tipBox{
        position: absolute;
        bottom: -2.5rem;
        z-index: 100;
        left: 50%;
        margin-left: -1.5rem;
    }
    .tipBox .searchClose{
        width: 1rem;
        height: 1rem;
        position: absolute;
        top: 0.25em;
        left: 6.75rem;
    }
    .tipBox .searchTip{
        width: 7.25rem;
        height: 4.5rem;
    }
    .box2{

    }
    .box2 .tit{
        width: 100%; height: 1.5rem; line-height: 1.5rem; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
        display: flex; justify-content: space-between; background: #F2F7FB;
    }
    .box2 .tit .left{
        font-size: 0.7rem; color: #666;
    }
    .box2 .tit .left img{
        width: 0.6rem; height: 0.75rem; transform: translateY(2px);
    }
    .box2 .tit .right{

    }
    .box2 .tit .right img{
        width: 1.85rem; height: 0.55rem; transform: translateY(2px);
    }
    .box2 .explain{
        background: #fff; font-size: 0.6rem; color: #999999; padding: 0.5rem 0.8rem 0.6rem 0.6rem;
    }
    .tishi{
        width: 100%; height: 30px; line-height: 30px; text-align: center; font-size: 0.8rem; color: #666; margin-top: 2rem;
    }

    /*引导发布*/
    .pick2{
        width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000; opacity: 0.5; z-index: 666;
    }
    .title{
        width: 284px; height: 225px; background: #fff; position: fixed; left: 12%; top: 28%; z-index: 990;
    }
    .title .tp{
        width: 100px; height: 90px; margin: 0 auto; display: block; transform: translateY(-36px); position: relative; z-index: 991;
    }
    .title .tp2{
        text-align: center; transform: translateY(-30px);
    }
    .title .tp2 .tp2-1{
        font-size: 0.75rem; color: #063D67;
    }
    .title .tp2 .tp2-2{
        font-size: 0.65rem; color: #111111;  font-weight: 700; margin-top: 18px;
    }
    .title .tp2 .tp2-3{
        font-size: 0.7rem; color: #666; margin-top: 10px;
    }
    .title .tp3{
        width: 100%; display: flex; justify-content: space-around; transform: translateY(-10px);
    }
    .title .tp3 .left{
        width: 100px; height: 35px; line-height: 35px; text-align: center; font-size: 0.85rem;  border: 1px solid #227FC5; border-radius: 1.5px;
    }
    .title .tp3 .left2{
        color: #227FC5;
    }
    .title .tp3 .left3{
        background: #227FC5;
    }
    .title .tp3 .left3 a{
        display: inline-block; width: 100%; height: 100%; color: #fff;
    }
</style>
