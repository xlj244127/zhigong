<template>
    <div data-page="searchSelectTypeAddSize" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">搜索工种</div>
            </div>
        </div>
        <div class="page-content">
            <div class="ipt">
                <a>
                    <input placeholder="请输入工种名称" v-model="name" type="text" />
                    <span class="sub" @click="searchAction">搜索</span>
                    <img src="../../static/img/icon_search.png"/>
                </a>
            </div>
            <div class="title">请选择工人工种</div>
            <div class="main">
                <div class="box" v-for="item in workerKind">
                    <div class="up">{{item.name}}</div>
                    <div class="down">
                        <div class="type2" v-for="one in item.list" @click="selectType(one.code)" :data-id="one.code" :class="{active: paramCode==one.code}">
                            <span>{{one.value}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import {userApi, tabulateStatisticsApi, wxApi, groupApi} from "../api";
    import { LocalCache } from '../lib/utils';
    import moment from 'moment'
    export default {
        data(){
            return{
                workerKind: [],
                name: '',
                size: '',
                paramCode: '',
                userId: '',
                groupId: '',
                status: ''      //企业版，员工版发布招工时值为(1)
            }
        },
        methods:{
            searchAction(){
                tabulateStatisticsApi.allWorkTypes(this.name).then((result)=>{
                    this.workerKind = result.data;
                    console.log(this.workerKind);
                })
            },
            selectType(param){
                $$('.type2').each((xls, elm)=>{
                    if($$(elm).data('id')==param){
                        this.$store.state.paramCode = param+'_'+$$(elm).text()
                        this.$router.back({
                            pageName: 'pubilcWorkerNeed',//页面的data-page值
                            force: true//注意此参数back方法专用
                        })
                    }
                })
            }
        },
        mounted(){
            this.status = this.$route.params.status;
            this.userId = this.$route.params.id;
            console.log('用户id2',this.status,this.userId);
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

</style>