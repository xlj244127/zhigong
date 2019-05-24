<template>
    <div data-page="dealWithBlackList" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">已处理黑名单</div>
            </div>
        </div>
        <div class="page-content">
            <div class="list-block accordion-list">
                <ul class="oneList" v-for="item in dealWithBlackList">
                    <li class="accordion-item">
                        <a href="#" class="item-content item-link">
                            <div class="item-inner row">
                                {{item.name}}
                            </div>
                        </a>
                        <div class="accordion-item-content">
                            <div class="content-block">
                                <ul class="aul">
                                    <li v-for="one in item.blacklist" @click='enterDetail(one)'>
                                        <div class="a2"><img src="../../../../../static/img/avatar.png"/></div>
                                        <div class="a3">
                                            <div class="left">
                                                <span class="a3-1">{{one.name?one.name:one.mobile}}</span> <br/> <span class="a3-2">{{one.idNumber}}</span>
                                            </div>
                                            <div class="right">{{one.typeName}}</div>
                                        </div>
                                        <img class="img" src="../../../../../static/img/btn_right.png"/>
                                    </li>
                                </ul>
                                <div class="bott">
                                    <span>处理人: {{item.processName}}</span> &nbsp;&nbsp;&nbsp;
                                    <span>处理时间: {{new Date(item.processTime).getFullYear()}}-{{new Date(item.processTime).getMonth()+1}}-{{new Date(item.processTime).getDate()}}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>

            </div>
        </div>
    </div>
</template>

<script>
    import { blackListApi } from '../../../../api'
    export default {
        data(){
            return{
                dealWithBlackList: [],
                companyId: ''
            }
        },
        methods:{
            enterDetail(one){
                this.$router.load({url: '/company/personBlackListDetail/'+one.id})
            }
        },
        created(){
            this.companyId = this.$store.state.roleInfo.companyId;
            blackListApi.alarmAddNoDealWith(this.companyId, 0).then((result)=>{
                console.log('已处理黑名单',result);
                this.dealWithBlackList = result.data;
            })
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .list-block{
        margin: 0;
    }

    .list-block ul{
        margin-top: 0.25rem; background: #fff;
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
    .content-block .bott{
        width: 100%; box-sizing: border-box; padding: 0.25rem 0.6rem; text-align: right; font-size: 0.5rem; color: #999;
    }
</style>