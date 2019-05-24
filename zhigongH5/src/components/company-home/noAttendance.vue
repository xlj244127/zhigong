<template>
    <div class="main">
    	<div class="tst">{{companyName}}</div>
        <div class="block fist">
            <div class="top">
                <a href="/company/attendManage/">
                    <span>考勤管理</span>
                    <img src="../../../static/img/btn_right.png"/>
                </a>
            </div>
            <div class="aul2">
                暂无数据
            </div>
        </div>
        <div class="block">
            <div class="top">
                <a href="/company/projectManage/">
                    <span>项目管理</span>
                    <img src="../../../static/img/btn_right.png"/>
                </a>
            </div>
            <div class="aul2">
                暂无数据
            </div>
        </div>
        <div class="block">
            <div class="top">
                <a href="/company/infoEntreing/">
                    <span>信息录入</span>
                    <img src="../../../static/img/btn_right.png"/>
                </a>
            </div>
            <div class="aul2">
                暂无数据
            </div>
        </div>
        <div class="block">
            <div class="top">
                <a href="/company/equipManage/">
                    <span>设备管理</span>
                    <img src="../../../static/img/btn_right.png"/>
                </a>
            </div>
            <div class="aul2">
                暂无数据
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: "no-attendance",
        data(){
            return{
            }
        },
        props: ["companyName"],
        methods:{

        },
        mounted(){

        }
    }
</script>

<style scoped>
    .main{
        box-sizing: border-box; padding: 0 0.75rem 1.25rem 0.75rem;
    }
    .main .tst{
    	width: 100%; text-align: center; font-size: 0.8rem; color: #333; margin-top: 2.25rem;
    }

    .main .block{
        width: 100%; border: 1px solid #ccc; border-radius: 0.9rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
        margin-top: 0.75rem;
    }
    .main .block .top{
        width: 100%; height: 2rem; line-height: 2rem; border-bottom: 1px solid #ccc;
        position: relative;
    }
    .main .block .top a{
        width: 100%; height: 100%; display: block; font-size: 0.8rem; color: #333;
    }
    .main .block .top img {
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.6rem; right: 0px;
    }
    .main .block .aul2{
        height: 7.5rem; line-height: 7.5rem; text-align: center; font-size: 0.7rem; color: #aaa;
    }
</style>