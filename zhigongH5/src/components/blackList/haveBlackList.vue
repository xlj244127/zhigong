<template>
    <div>
        <div class="head">
            <div class="top">
                <div class="t-1 row">
                    <div class="col-50 box">
                        <a href="/company/companyBlackList/">
                            <div class="b-1">企业黑名单</div>
                            <div class="b-2">
                                <span>{{blackListStat.companyBA}}</span><span class="b3">人</span>
                                <br/>
                                <img class="b-img" src="../../../static/img/yuantai.png"/>
                            </div>
                        </a>
                    </div>
                    <div class="col-50 box">
                        <a href="/company/publicBlackList/">
                            <div class="b-1">公共黑名单</div>
                            <div class="b-2">
                                <span>{{blackListStat.publicBA}}</span><span class="b3">人</span>
                                <br/>
                                <img class="b-img" src="../../../static/img/yuantai.png"/>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="t-1 row">
                    <div class="col-50 box box2">
                        <a href="/company/blackListAlarm/">
                            <div class="b-1">黑名单警报</div>
                            <div class="b-2">
                                <span>{{blackListStat.warnBA}}</span><span class="b3">个</span>
                                <br/>
                                <img class="b-img" src="../../../static/img/yuantai.png"/>
                            </div>
                            <img class="bImg" src="../../../static/img/lingdang-2.png"/>
                        </a>
                    </div>
                    <div class="col-50 box">
                        <a href="/company/dealWithBlackList/">
                            <div class="b-1">已处理黑名单</div>
                            <div class="b-2">
                                <span class="b2">{{blackListStat.processBA}}</span><span class="b4">个</span>
                                <br/>
                                <img class="b-img" src="../../../static/img/yuantai-lan.png"/>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div class="down">
                <span>企业黑名单: 本企业项目存在不良行为的人员</span>
                <br/>
                <span>公共黑名单（付费功能）被其他企业列入黑名单的人员</span>
            </div>
        </div>

        <div class="tst">
            <img class="tstImg" src="../../../static/img/lingdang-3.png"/>
            <span>黑名单警报</span>
        </div>
        <div class="list-block accordion-list">
            <ul class="oneList" v-for="(item, index) in blackList" v-if="index<5">
                <li class="accordion-item">
                    <a href="#" class="item-content item-link">
                        <div class="item-inner">
                            <div class="left">{{item.name}}</div>
                            <div v-if="companyRole == 2" class="right" @click.stop.prevent="delAction(item)">
                                <img class="alarm" src="../../../static/img/blackList_jiechujingbao.png"/>
                            </div>
                        </div>
                    </a>
                    <div class="accordion-item-content">
                        <div class="content-block">
                            <ul class="aul">
                                <li v-for="one in item.blacklist" @click="enterDetail(one)">
                                    <div class="a2">
                                        <img v-if="one.avatar" :src="item.avatar"/>
                                        <img v-else src="../../../static/img/avatar.png"/>
                                    </div>
                                    <div class="a3">
                                        <div class="left">
                                            <span class="a3-1">{{one.name?one.name:one.mobile}}</span> <br/> <span class="a3-2">{{one.idNumber}}</span>
                                        </div>
                                        <div class="right">{{one.typeName}}</div>
                                    </div>
                                    <img class="img" src="../../../static/img/btn_right.png"/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <div class="bott">
            <a href="/company/blackListAlarm/">查看全部 ></a>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { blackListApi } from '../../api'
    export default {
        name: "have-blackList",
        data(){
            return{
                companyId: '',
                companyRole: ''
            }
        },
        props: ['blackListStat', 'blackList'],
        methods:{
            delAction(item){
                console.log(item);
                this.$f7.confirm('是否确认解除警报?', ()=>{
                    blackListApi.projRemoveBlackList(item.id).then((result)=>{
                        console.log('项目解除警报:'+result);
                        blackListApi.blackListStat(this.companyId).then((result)=>{
                            console.log('企业管理员黑名单统计',result);
                            this.blackListStat = result.data;
                        })
                        blackListApi.alarmAddNoDealWith(this.companyId, 1).then((result)=>{
                            console.log('黑名单警报',result);
                            this.blackList = result.data;
                        })
                    })
                })
            },
            enterDetail(one){
                this.$router.load({url: '/company/personBlackListDetail/'+one.id})
            }
        },
        created(){
            this.companyRole = this.$store.state.roleInfo.companyRole;
            this.companyId = this.$store.state.roleInfo.companyId;
            console.log(1);
            console.log(this.blackListStat);
            console.log(this.blackList);
        },
        mounted(){

        }
    }
</script>

<style scoped>
    .head{
        width: 100%; background: #fff;
    }
    .head .top{

    }
    .head .top .t-1{

    }
    .head .top .t-1 .box{
        text-align: center; box-sizing: border-box; padding: 0.75rem 0 0 0;
    }
    .head .top .t-1 .box a{
        width: 100%; height: 100%; display: inline-block;
    }
    .head .top .t-1 .box a .b-1{
        font-size: 0.65rem; color: #666;
    }
    .head .top .t-1 .box a .b-2{
        font-size: 1.05rem; margin-top: 0.6rem; color: #E96060;
    }
    .head .top .t-1 .box a .b-2 .b2{
        color: #4B97EE;
    }
    .head .top .t-1 .box a .b-2 .b3{
        font-size: 0.7rem;
    }
    .head .top .t-1 .box a .b-2 .b4{
        font-size: 0.7rem; color: #4B97EE;
    }
    .head .top .t-1 .box a .b-2 .b-img{
        width: 3rem; height: 0.9rem;
    }
    .head .top .t-1 .box2{
        position: relative;
    }
    .head .top .t-1 .box2 a .bImg{
        width: 0.4rem; height: 0.45rem; position: absolute; left: 5.3rem; top: 2.1rem;
    }

    .down{
        width: 100%; text-align: center; font-size: 0.45rem; color: #999; background: #fff;
    }

    .tst{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.7rem; color: #555; background: #fff; margin-top: 0.5rem;
    }
    .tst .tstImg{
        width: 0.5rem; height: 0.5rem; display: inline;
    }
    .list-block{
        margin: 0;
    }

    .list-block ul{
        margin-bottom: 0.25rem; background: #fff;
    }
    .list-block .item-inner{
        font-size: 0.7rem; color: #999;
    }
    .content-block .aul{
        border-top: 1px solid #f4f4f4;
    }
    .content-block .aul li{
        width: 100%; height: 3.25rem; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding-left: 0.6rem; position: relative; display: flex; margin-bottom: 0.25rem;
    }
    .content-block .aul li .img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.6rem; top: 1.15rem;
    }
    .content-block .aul li .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .content-block .aul li .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .content-block .aul li .a3{
        width: 100%; padding: 0.8rem 0 0 0.75rem; display: flex; justify-content: space-between;
    }
    .content-block .aul li .a3 .left{
        flex: 1;
    }
    .content-block .aul li .a3 .left .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .content-block .aul li .a3 .left .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .content-block .aul li .a3 .right{
        width: 5rem; font-size: 0.6rem; color: #EF7373; padding-top: 0.25rem;
        transform: translateX(-1.3rem); height: 1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .bott{
        width: 100%; text-align: center; padding: 0.5rem 0 1.55rem 0; box-sizing: border-box; font-size: 0.65rem; color: #438CFF;
    }

    .list-block .item-inner{
        padding: 0;
    }
    .item-inner .left{
         width: 65%; height: 100%; line-height: 2.2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .item-inner .right{
        width: 25%; height: 100%; line-height: 2.2rem; text-align: right; box-sizing: border-box; transform: translateX(-1.5rem);
    }
    .item-inner .right .alarm{
        width: 4rem; height: 1rem; transform: translateY(0.3rem);
    }
</style>