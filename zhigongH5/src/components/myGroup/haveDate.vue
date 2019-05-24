<template>
    <div class="main">
        <div class="header">
            <div class="top">
                <span class="t-1">{{groupName}}</span>
            </div>
            <div class="bott">
                <span class="bo-1">
                    <a href="/user/workerAddWay/">添加班组成员</a>
                </span>
                <span class="bo-1"><a href="/user/delWorker/">删除人员</a></span>
                <span class="bo-1"><a href="/user/addToProj/">添加至项目组</a></span>
                <span class="bo-2"><a href="/user/infoState/">信息状况</a></span>
            </div>
        </div>
        <div class="aside">
            <div class="box">
                <div class="title">A</div>
                <ul class="aul">
                    <li>
                        <div class="a2"><img src=""/></div>
                        <div class="a3">
                            <div class="left">
                                <span class="a3-1">张三</span>&nbsp;&nbsp;<span class="a3-3">xx班组 水电班组</span> <br/> <span class="a3-2">深圳湾项目</span>
                            </div>
                        </div>
                    </li>

                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { userApi } from '../../api'

    export default {
        name: "haveDate",
        data() {
            return {
                groupName: ''
            }
        },
        mounted() {
            if(!this.$store.state.userInfo.workGroupName) {
                userApi.detail().then((result)=>{
                    this.$store.state.userInfo.workGroupName = result.data.workGroupName;
                    this.groupName = result.data.workGroupName;
                });
            }
            else {
                this.groupName = this.$store.state.userInfo.workGroupName;
            }
        }
    }
</script>

<style scoped>
    .header{
        width: 100%; background: #fff; margin-top: 0.5rem; box-sizing: border-box; padding: 0 0.6rem;
    }
    .header .top{
        width: 100%; height: 2rem; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
    }
    .header .top .t-1{
        font-size: 0.7rem; color: #666;
    }
    .header .bott{
        width: 100%;
    }
    .header .bott .bo-1, .bo-2{
        font-size: 0.7rem; border: 1px solid #438cff; border-radius: 0.4rem; padding: 0.25rem 0.5rem; margin: 0.5rem 0.5rem 0 0;
        display: inline-block;
    }
    .header .bott .bo-1{
        background: #438cff;
    }
    .header .bott .bo-1 a{
        width: 100%; height: 100%; display: inline-block; color: #fff;
    }
    .header .bott .bo-2{
        color: #438cff; margin-bottom: 0.5rem;
    }

    .aside{

    }
    .aside .box .title{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
    }
    .aside .box{
        background: #fff; margin-top: 0.5rem; box-sizing: border-box; padding: 0 0.6rem;
    }
    .aside .box .aul li{
        width: 100%; height: 3.25rem; border-bottom: 1px solid #f4f4f4; display: flex;  border-bottom: 1px solid #f4f4f4;
    }
    .aside .box .aul li .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .aside .box .aul li .a3{
        flex: 1; padding: 0.8rem 0 0 1rem; display: flex; justify-content: space-between;
    }
    .aside .box .aul li .a3 .left .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .aside .box .aul li .a3 .left .a3-3{
        font-size: 0.6rem; color: #438cff;
    }
    .aside .box .aul li .a3 .left .a3-2{
        font-size: 0.6rem; color: #999;
    }
</style>