<template>
    <div data-page="search" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">项目搜索</div>
            </div>
        </div>
        <div class="page-content">
            <div class="ipt">
                <input name="put" placeholder="请输入项目名" v-model="name" type="text" autofocus="autofocus"/>
                <button class="sub" @click="confirmAction">搜索</button>
                <img src="../../../../../static/img/icon_search.png"/>
            </div>

            <div class="oneself">
                <div v-if="isShow == 1" class="main">
                    <div class="head">
                        <div class="h-1">项目名称</div><div class="h-1">项目所在地</div><div class="h-1">项目创建时间</div>
                    </div>
                    <ul class="cont">
                        <li v-for="item in list" @click="enteringAction(item)">
                            <a>
                                <div class="c-1">{{item.name}}</div><div class="c-1">{{item.location}}</div><div class="c-1 c-2">{{new Date(item.startTime).getFullYear()}}-{{new Date(item.startTime).getMonth()+1}}-{{new Date(item.startTime).getDate()}}</div>
                                <img src="../../../../../static/img/btn_right.png"/>
                            </a>
                        </li>
                    </ul>
                </div>
                <div v-if="isShow == 2" class="other">未找到对应人员,请重新输入</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { projectApi } from '../../../../api'
    export default {
        data(){
            return{
                name: '',
                isShow: '',
                list:[],
                page: 1,
                pageSize: 10
            }
        },
        methods:{
            confirmAction(){
                projectApi.allProjectList(this.page, this.pageSize, this.name).then((result)=>{
                    console.log(result);
                    if(result.data.length == 0){
                        this.isShow = 2;
                    }else{
                        this.isShow = 1;
                        this.list = result.data;
                    }
                })
            },
            enteringAction(item){
                this.$router.load({url: '/company/buildProjDetail/'+item.id});
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .ipt{
        width: 100%; height: 2.5rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem; display: flex;
        justify-content: space-between; position: relative; margin-top: 0.5rem;
    }
    .ipt input{
        flex: 1;  margin-left: 1.25rem; border: none;
    }
    .ipt .sub{
        width: 2.7rem; height: 1.5rem; line-height: 1.5rem; border-radius: 0.3rem; margin-top: 0.5rem; color: #fff; background: #438cff;
        border:  none;
    }
    .ipt img{
        width: 0.9rem; height: 0.9rem; position: absolute; left: 0.6rem; top: 0.8rem;
    }

    .oneself{
        margin-top: 0.5rem; background: #fff;
    }
    .oneself .other{
        width: 100%; text-align: center; font-size: 0.7rem; color: #999; margin-top: 4.25rem;
    }

    .oneself .main{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem;
    }
    .oneself .main .head{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #aaa; display: flex; border-bottom: 1px solid #f4f4f4;
    }
    .oneself .main .head .h-1{
        flex: 1;
    }
    .oneself .main .cont{

    }
    .oneself .main .cont li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #f4f4f4;  position: relative;
    }
    .oneself .main .cont li a{
        display: flex; width: 100%; height: 100%; font-size: 0.7rem; color: #666;
    }
    .oneself .main .cont li a .c-1{
        flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .main .cont li a .c-2{
        transform: translateX(0.6rem);
    }
    .oneself .main .cont li a img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.8rem;
    }
</style>