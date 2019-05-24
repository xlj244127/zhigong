<template>
    <div data-page="selectTypeAddSize" class="page navbar-fixed toolbar-fixed">
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
            <div class="ipt">
                <a @click="skipAction" href="#">
                    <input placeholder="请输入工种名称" type="text" />
                    <span class="sub">搜索</span>
                    <img src="../../../../../static/img/icon_search.png"/>
                </a>
            </div>
            <div class="title">请选择工人工种</div>
            <div class="main">
                <div class="box" v-for="item in workerKind">
                    <div class="up">{{item.name}}</div>
                    <div class="down" v-if="this.status==0">
                        <div class="type2" v-for="one in item.list" @click="selectType(one.code)" :data-id="one.code" :class="{active: paramCode==one.code}">
                            <span>{{one.value}}</span>
                            <div v-show="paramCode==one.code">
                                <img v-show="size==0" src="../../../../../static/img/dagong.png"/>
                                <img v-show="size==1" src="../../../../../static/img/xiaogong.png"/>
                            </div>
                        </div>
                    </div>
                    <div class="down" v-else>
                        <div class="type2" v-for="one in item.list" @click="selectType(one.code)" :data-id="one.code" :class="{active: paramCode==one.code}">
                            <span>{{one.value}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer" v-show="this.status==0">
                <div class="f-1" @click="configAction">
                    <span >保存</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import {userApi, tabulateStatisticsApi, wxApi, projectApi, groupApi} from "../../../../api";
    import { LocalCache } from '../../../../lib/utils';
    import moment from 'moment'
    export default {
        data(){
            return{
                workerKind: [],
                size: '',
                paramCode: '',
                paramName: '',
                userId: '',
                groupId: '',
                status: ''    //班组长添加工人时值为(0),企业版，员工版发布招工时值为(1)
            }
        },
        methods:{
            skipAction(){
                if(this.status==0){
                    this.$router.load({url: '/company/searchSelectTypeAddSize/0/'+this.userId})
                }else{
                    this.$router.load({url: '/company/searchSelectTypeAddSize/'+this.status+'/:id/'})
                }
            },
            selectType(param){
                if(this.status==0){
                    this.$f7.modal({
                        title:  '请选择大小工:',
                        verticalButtons: true,
                        buttons: [
                            {
                                text: '大工',
                                onClick: ()=>{
                                    $$('.type2').each((xls, elm)=>{
                                        if($$(elm).data('id')==param){
                                            this.paramCode = param
                                            this.size = 0
                                            console.log(this.paramCode);
                                        }
                                    })
                                }
                            },
                            {
                                text: '小工',
                                onClick: ()=>{
                                    $$('.type2').each((xls, elm)=>{
                                        if($$(elm).data('id')==param){
                                            this.paramCode = param
                                            this.size = 1
                                            console.log(this.paramCode);
                                        }
                                    })
                                }
                            },
                            {
                                text: '<div style="width: 100%; color: red">取消</div>',
                                onClick: ()=>{}
                            },
                        ]
                    })
                }else{
                    $$('.type2').each((xls, elm)=>{
                        if($$(elm).data('id')==param){
                            this.$store.state.paramCode = param+'_'+$$(elm).text()
                            console.log(this.$store.state.paramCode)
                            this.$router.back()
                        }
                    })
                }
            },
            configAction(){
                if(this.status==0){
                    if(this.paramCode==''){
                        console.log(this.paramCode, this.size);
                        this.$f7.alert('请选择工种2');
                    }else{
                        console.log(this.paramCode, this.size);
                        userApi.isGrouper().then((res)=>{
                            console.log('是否是班组长',res.data);
                            this.$store.state.roleInfo.groupId = res.data.id;
                            groupApi.addGroupMember(this.paramCode, this.size, this.userId).then((result)=>{     //添加工人到班组
                                console.log('我添加了工人工种');
                                console.log(result);
                                this.$router.load({url: '/user/myGroup/'});
                            })
                        })
                    }
                }
            }
        },
        mounted(){
            this.status = this.$route.params.status;
            this.userId = this.$route.params.id;
            console.log('用户id',this.status,this.userId);

            if(this.$store.state.workerKind){
                this.workerKind = this.$store.state.workerKind;
            }else{
                tabulateStatisticsApi.allWorkTypes().then((result)=>{
                    this.workerKind = result.data;
                    this.$store.state.workerKind = this.workerKind;
                    console.log(this.workerKind);
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
    .main .box .down .type2.active{
        background: #438cff; color: #fff;
    }
    .main .box .down .type2 img{
        width: 0.6rem; height: 0.6rem; position: absolute; right: 2px; top: 2px;
    }

    .footer{
        width: 100%; height: 2.5rem; background: #fff; position: fixed; left: 0; bottom: 0;
    }
    .footer .f-1{
        margin: 0 auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF; margin-top: 0.5rem;
    }
</style>