<template>
    <div>
        <div class="head">
            <div class="top">
                <div class="t-1 row">
                    <div class="col-50 box">
                        <div class="b-1">企业黑名单</div>
                        <div class="b-2">
                            <span class="b2">0</span><span class="b3">人</span>
                        </div>
                    </div>
                    <div class="col-50 box">
                        <div class="b-1">公共黑名单</div>
                        <div class="b-2">
                            <span class="b2">0</span><span class="b3">人</span>
                        </div>
                    </div>
                </div>
                <div class="t-1 row">
                    <div class="col-50 box box2">
                        <div class="b-1">黑名单警报</div>
                        <div class="b-2">
                            <span class="b2">0</span><span class="b3">人</span>
                        </div>
                        <img class="bImg" src="../../../static/img/lingdang.png"/>
                    </div>
                    <div class="col-50 box">
                        <div class="b-1">已处理黑名单</div>
                        <div class="b-2">
                            <span class="b2">0</span><span class="b3">人</span>
                        </div>
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
            暂无黑名单警报
        </div>
    </div>
</template>

<script>
    export default {
        name: "no-blackList"
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
        text-align: center; box-sizing: border-box; padding-top: 0.75rem;
    }
    .head .top .t-1 .box .b-1{
        font-size: 0.65rem; color: #666;
    }
    .head .top .t-1 .box .b-2{
        width: 2.25rem; height: 2.25rem; background: #929292; border-radius: 50%; margin: 0.5rem auto; text-align: center; line-height: 2.25rem; color: #ffffff;
    }
    .head .top .t-1 .box .b-2 .b2{
        font-size: 1.15rem;
    }
    .head .top .t-1 .box .b-2 .b3{
        font-size: 0.7rem;
    }
    .head .top .t-1 .box2{
        position: relative;
    }
    .head .top .t-1 .box2 .bImg{
        width: 0.45rem; height: 0.55rem; position: absolute; left: 5.1rem; top: 2.1rem;
    }

    .down{
        width: 100%; text-align: center; font-size: 0.45rem; color: #999; background: #fff;
    }

    .tst{
        text-align: center; font-size: 0.6rem; color: #aaa; margin-top: 4.1rem;
    }
</style>