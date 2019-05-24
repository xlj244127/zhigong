<template>
    <div data-page="downloadList" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">下载获取积分</div>
            </div>
        </div>
        <div class="page-content infinite-scroll">
            <div class="banner">
                <img src="../../static/img/download_banner.png" alt="">
            </div>
            <div class="currentInt">
                当前积分：{{currentInt}}分
            </div>
            <div class="list">
                <div class="title">精选游戏</div>
                <div class="listMain">
                    <div class="listItem" v-for="(item,index) in list">
                        <img :src="item.downImage" :alt="item.descript">
                        <div class="box">
                            <div class="boxLeft">
                                <div class="boxTitle">{{item.descript}}</div>
                                <div class="boxDesc">下载获取{{item.downJf}}分</div>
                            </div>
                            <a href="javascript:;" class="external boxRight" @click="download(item.downPath,item.id)">
                                下载
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fixed" v-show="this.totalItems>4">{{this.list.length==this.totalItems?'已全部加载完':'上拉加载更多'}}</div>
            <img @click="goTopAction" class="returnTop" src="../../static/img/btn_return_top.png"/>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import {wxApi} from "../api";
    import {LocalCache} from "../lib/utils";

    export default {
        name: "downloadList",
        data(){
            return{
                totalItems:'',
                list:[],
                userId:'',
                currentInt:'',
                page: 1,
                pageSize: 4,
                totalPages:""
            }
        },
        methods:{
            goTopAction(){
                $$('.page-content').scrollTop(0,0);
            },
            getCurrentInt(){
                wxApi.lookUserContact(this.userId).then((res)=>{
                    console.log("lookUserContact",res.data);
                    this.currentInt = res.data.times
                }).catch((res)=>{
                    console.log(res);
                })
            },
            getList(){
                wxApi.getAppList(this.page,this.pageSize,"").then((res)=>{
                    console.log(res);
                    this.list = res.data.list
                    this.totalItems = res.data.totalItems
                    this.totalPages = res.data.totalPages
                }).catch((res)=>[
                    console.log(res)
                ])
            },
            download(downPath,id){
                wxApi.downApp(id).then((res)=>{
                    this.getCurrentInt()
                    window.location.href = res.data
                }).catch((res)=>{

                })

            }

        },
        created(){
            this.userId = LocalCache.get("userInfo").id
            this.getCurrentInt()
            this.getList()
        },
        mounted(){
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
                        wxApi.getAppList(this.page,this.pageSize,"").then((res)=>{
                            console.log(res);
                            that.list = that.list.concat(res.data.list);
                        }).catch((res)=>{
                            console.log(res)
                        })
                    }
                }, 1000);
            })
        },
    }
</script>

<style scoped>
    .banner{
        padding-top: .2rem;
        width: 17.55rem;
        margin: 0 auto;
        padding-bottom: .25rem;
    }
    .banner img{
        width: 17.55rem;
        display: block;
    }
    .currentInt{
        width: 17.55rem;
        height:1.5rem;
        background:linear-gradient(0deg,rgba(225,231,242,1) 0%,rgba(236,242,248,1) 100%);
        margin: 0 auto;
        text-align: center;
        color: #333333;
        font-size: .6rem;
        line-height: 1.5rem;
    }
    .list{
        padding-top: 1rem;
        padding-left: .6rem;
    }
    .list .title{
        font-size: .7rem;
        color: #222222;
        font-weight: bold;
        line-height: 1rem;
    }
    .listMain{
        overflow: hidden;
    }
    .listItem {
        width: 8.5rem;
        height: 8.5rem;
        overflow: hidden;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        margin-right: .55rem;
        float: left;
        margin-top: .55rem;
        position: relative;
    }
    .listItem img{
        width: 8.5rem;
        height: 8.5rem;
    }
    .listItem .box{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2.6rem;
        box-sizing: border-box;
        padding: 0.3rem;
        overflow: hidden;
        background: rgba(0,0,0,.5);
    }
    .listItem .box .boxLeft{
        float: left;
        width: 70%;

    }
    .listItem .box .boxLeft .boxTitle{
        font-size: .7rem;
        line-height: 1.2rem;
        height: 1.2rem;
    }
    .listItem .box .boxLeft .boxDesc{
        font-size: .6rem;
        line-height: 1rem;
        opacity: .6;
    }
    .listItem .box .boxLeft .boxTitle, .listItem .box .boxLeft .boxDesc{
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space:nowrap;
        overflow: hidden;
        color: #ffffff;
    }
    .listItem .box .boxRight{
        float: right;
        padding: .15rem .3rem ;
        font-size: .7rem;
        line-height: 1.1rem;
        margin-top: .3rem;
        color: #333;
        background-color: rgba(255,255,255,1);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
    .fixed{
        width: 100%; height: 20px; line-height: 20px; text-align: center; font-size: 0.5rem; color: #999999; position: fixed; left: 0; bottom: 0; background: #fff;
    }
    .returnTop{
        width: 1.5rem; height: 1.5rem; position: fixed; right: 20px; bottom: 20px;
    }
</style>