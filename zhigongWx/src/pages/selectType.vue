<template>
    <div data-page="selectType" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">选择工种</div>
            </div>
        </div>
        <div class="page-content">
            <!--<div class="ipt">-->
                <!--<a @click="skipAction" href="#">-->
                    <!--<input placeholder="请输入工种名称" type="text" />-->
                    <!--<span class="sub">搜索</span>-->
                    <!--<img src="../../static/img/icon_search.png"/>-->
                <!--</a>-->
            <!--</div>-->
            <div class="title">请选择您班组下的工种类型, 可多选<span Hidden>{{shuju}}</span></div>
            <div class="main">
                <div class="box" v-for="item in workerKind">
                    <div class="up">{{item.name}}</div>
                    <div class="down">
                        <div class="type2" v-for="(one, index) in item.list" @click="selectType(one.code, index)" :data-id="one.code" :data-size="one.size" :data-index="index" :class="{ref2: one.size!=3}">
                            <span>{{one.value}}</span>
                            <div class="size">
                                <img class="da" v-show="one.size==0" src="../../static/img/dagong.png"/>
                                <img class="xiao" v-show="one.size==1" src="../../static/img/xiaogong.png"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="f-1" @click="configAction">
                <span >保存</span>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import {userApi, tabulateStatisticsApi, wxApi, projectApi} from "../api";
    import { LocalCache } from '../lib/utils';
    export default {
        data(){
            return{
                shuju: '',
                workerKind: [],
                codeList: [],
                typeList: [],
                status: ''    //班组长发布空闲班组时值为(2),编辑简历时值为(3)

            }
        },
        methods:{
            skipAction(){
                if(this.status==2){
                    this.$router.load({url: '/user/searchType/2/:arguments/'})
                }
                if(this.status==3){
                    this.$router.load({url: '/user/searchType/3/:arguments/'})
                }
            },
            selectSize(param, index){
                this.$f7.modal({
                    title:  '请选择大小工:',
                    verticalButtons: true,
                    buttons: [
                        {
                            text: '大工',
                            onClick: ()=>{
                                $$('.type2').each((xls, xlm)=>{
                                    if($$(xlm).data('id')==param){
                                        if(!$$(xlm).hasClass('ref2')){
                                            $$(xlm).addClass('ref2');
                                        }
                                    }
                                })
                                this.workerKind.map((res)=>{
                                    res.list.map((key)=>{
                                        if(key.code==param){
                                            if(key.size==3){
                                                key.size = 0
                                            }else if(key.size==1){
                                                key.size = 0
                                            }else{
                                                key.size = 0
                                            }
                                            this.shuju = Math.random()
                                        }
                                    })
                                })
                                console.log(this.workerKind)
                            }
                        },
                        {
                            text: '小工',
                            onClick: ()=>{
                                $$('.type2').each((xls, xlm)=>{
                                    if($$(xlm).data('id')==param){
                                        if(!$$(xlm).hasClass('ref2')){
                                            $$(xlm).addClass('ref2');
                                        }
                                    }
                                })
                                this.workerKind.map((res)=>{
                                    res.list.map((key)=>{
                                        if(key.code==param){
                                            if(key.size==3){
                                                key.size = 1
                                            }else if(key.size==0){
                                                key.size = 1
                                            }else{
                                                key.size = 1
                                            }
                                            this.shuju = Math.random()
                                        }
                                    })
                                })
                                console.log(this.workerKind)
                            }
                        },
                        {
                            text: '<div style="width: 100%; color: red">取消</div>',
                            onClick: ()=>{}
                        },
                    ]
                })
            },
            selectType(param, index){
                if(this.status==3){
                    console.log($$('.ref2').length);
                    $$('.type2').each((xls, xlm)=>{
                        if($$(xlm).data('id')==param){
                            if($$(xlm).hasClass('ref2')){
                                $$(xlm).removeClass('ref2');
                                this.workerKind.map((res)=>{
                                    res.list.map((key)=>{
                                        if(key.code==param){
                                            key.size = 3
                                            this.shuju = Math.random()
                                        }
                                    })
                                })
                                console.log(this.workerKind)
                            }else{
                                if($$('.ref2').length>7){
                                    $$('.type2').each((xls, xlm)=>{
                                        if($$(xlm).data('id')==param){
                                            if($$(xlm).hasClass('ref2')){
                                                $$(xlm).removeClass('ref2');
                                                this.workerKind.map((res)=>{
                                                    res.list.map((key)=>{
                                                        if(key.code==param){
                                                            key.size = 3
                                                            this.shuju = Math.random()
                                                        }
                                                    })
                                                })
                                                console.log(this.workerKind)
                                            }else{
                                                this.$f7.alert("工种标签最多可选8个，请合理分配")
                                            }
                                        }
                                    })
                                }else{
                                    this.selectSize(param, index);
                                }
                            }
                        }
                    })
                }else{
                    $$('.type2').each((xls, xlm)=>{
                        if($$(xlm).data('id')==param){
                            $$(xlm).toggleClass('ref2')
                        }
                    })
                }
            },
            configAction(){
                this.codeList = [];
                if(this.status==2){
                    $$('.ref2').each((xls, xlm)=>{
                        let obj = {
                            workType: $$(xlm).text()+'_'+$$(xlm).data('id'),
                            freeAmount: 1,
                            freeTime: ''
                        }
                        this.codeList.push(obj);
                    })
                    if(this.$store.state.pubilcFreeGroupUpData.length>0) {
                        this.codeList = this.codeList.concat(this.$store.state.pubilcFreeGroupUpData)

                        this.typeList =[];
                        let json = {};
                        for(var i=0;i<this.codeList.length;i++){
                            if(!json[this.codeList[i].workType.split('_')[1]]){
                                this.typeList.push(this.codeList[i]);
                                json[this.codeList[i].workType.split('_')[1]] = 1;
                            }
                        }
                        this.$store.state.pubilcFreeGroupUpData = this.typeList
                    }else{
                        this.$store.state.pubilcFreeGroupUpData = this.codeList
                    }
                    this.$router.back();
                }
                if(this.status==3){
                    console.log('进入了这里');
                    $$('.ref2').each((xls, xlm)=>{
                        let obj = {
                            workerType: $$(xlm).text(),
                            workerTypeCode: $$(xlm).data('id'),
                            workerSize: $$(xlm).data('size')==0?'大工':'小工',
                            workerSizeCode: $$(xlm).data('size'),
                        }
                        this.codeList.push(obj);
                    })
                    if(this.$store.state.tagList.length>0){
                        this.codeList = this.codeList.concat(this.$store.state.tagList)
                        this.typeList =[];
                        let json = {};
                        for(var i=0;i<this.codeList.length;i++){
                            if(!json[this.codeList[i].workerTypeCode]){
                                this.typeList.push(this.codeList[i]);
                                json[this.codeList[i].workerTypeCode] = 1;
                            }
                        }
                        this.$store.state.tagList = this.typeList;
                    }else{
                        this.$store.state.tagList = this.codeList;
                    }
                    console.log('值',this.$store.state.tagList)
                    this.$router.back();
                }
            }
        },
        mounted(){
            this.status = this.$route.params.status;
            console.log('状态',this.status);
            if(this.status==3){
                tabulateStatisticsApi.allWorkTypes().then((result)=>{
                    this.workerKind = result.data;
                    this.workerKind.map((res)=>{
                        res.list.map((key)=>{
                            key.size = '3'
                        })
                    })
                    console.log('处理后的值',this.workerKind)
                    if(this.$store.state.tagList.length>0){
                        this.workerKind.map((res)=>{
                            res.list.map((key)=>{
                                this.$store.state.tagList.map((res)=>{
                                    if(key.code==res.workerTypeCode){
                                        key.size = res.workerSizeCode
                                        // this.shuju = Math.random()
                                    }
                                })
                            })
                        })
                        console.log('处理后的值2',this.workerKind)
                    }
                })
            }else{
                tabulateStatisticsApi.allWorkTypes().then((result)=>{
                    this.workerKind = result.data;
                    this.workerKind.map((res)=>{
                        res.list.map((key)=>{
                            key.size = '3'
                        })
                    })
                    console.log('值2',this.workerKind);
                })
            }

        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #F9F9F9;
    }
    .ipt{
        width: 100%; height: 2.2rem; line-height: 2.2rem; background: #F4F4F4; box-sizing: border-box; padding: 0 0.6rem; display: flex;
    }
    .ipt a{
        width: 100%; height: 100%; display: inline-block; position: relative;
    }
    .ipt a input{
        width: 86%; height: 30px; line-height: 30px; border-radius: 0.75rem; border: 1px solid #F4F4F4; padding-left: 32px; box-sizing: border-box;
    }
    .ipt a .sub{
        font-size: 0.65rem; color: #666; padding-left: 6px;
    }
    .ipt a img{
        width: 0.9rem; height: 0.9rem; position: absolute; left: 0.6rem; top: 13px;
    }
    .title{
        width: 100%; height: 25px; line-height: 25px; text-align: center; background: #E4EEFF; color: #1368EC; font-size: 0.6rem;
    }
    .main{
        margin-bottom: 2rem;
    }
    .main .box{
        width: 100%; margin-bottom: 6px;
    }
    .main .box .up{
        width: 100%; height: 2rem; line-height: 2rem; background: #F1F5F8; font-size: 0.65rem; color: #495368; box-sizing: border-box;
        padding-left: 0.6rem;
    }
    .main .box .down{
        background: #fff; display: flex; flex-wrap: wrap;
    }
    .main .box .down .type2{
        width: 33%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.65rem; color: #333; border-bottom: 1px solid #EEEEEE; border-right: 1px solid #EEEEEE;
        position: relative;
    }
    .main .box .down .type2 img{
        width: 0.6rem; height: 0.6rem; position: absolute; right: 2px; top: 2px;
    }
    .main .box .down .ref2{
        background: #438cff; color: #fff;
    }

    .footer{
        width: 100%; height: 2.5rem; background: #fff; position: fixed; left: 0; bottom: 0; z-index: 666;
    }
    .footer .f-1{
        margin: 0 auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF; margin-top: 0.5rem;
    }
</style>