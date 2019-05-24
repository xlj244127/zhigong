<template>
    <div class="main">
        <div class="header">
            <div class="left">请选择统计时间</div>
            <div class="right">
                <span class="r-1">2018-12-24</span>
                <img class="r-2" src="../../../static/img/btn_drop_down.png" />
            </div>
            <div class="left">至</div>
            <div class="right">
                <span class="r-1">2018-12-25</span>
                <img class="r-2" src="../../../static/img/btn_drop_down.png" />
            </div>
        </div>
        <div class="block">
            <div class="block-inner">
                <div class="tst">xxx班组</div>
                <div class="nav">
                    <div>2017-01-01至2017-01-31 <span class="n-1">（所选日期）</span></div>
                    <div>31天</div>
                </div>
                <div class="center">
                    <div class="center-2">
                        <div class="span"><span class="span-1">总人数</span><br/><span class="span-2">77</span><span class="span-3">人</span></div>
                        <div class="span"><span class="span-1">异常考勤</span><br/><span class="span-2">77</span><span class="span-3">次</span></div>
                        <div class="span"><span class="span-1">未考勤</span><br/><span class="span-4">77</span><span class="span-5">次</span></div>
                    </div>
                    <div class="center-2">
                        <div class="span"><span class="span-1">缺卡</span><br/><span class="span-4">77</span><span class="span-5">次</span></div>
                        <div class="span"><span class="span-1">考勤率</span><br/><span class="span-4">77</span><span class="span-5">%</span></div>
                        <div class="span"><span class="span-1">平均工时</span><br/><span class="span-2">77</span><span class="span-3">小时</span></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="aside">
            <div class="top">组员考勤概况</div>
            <div>
                <div class="box" v-for="item in list">
                    <div class="line">
                        <div class="one"><span class="o-1">正常考勤天数</span><br/><span class="o-1">28天</span></div>
                        <div class="one"><span class="o-1">异常考勤天数</span><br/><span class="o-2">28天</span></div>
                        <div class="one"><span class="o-1">工作总时长</span><br/><span class="o-1">28天</span></div>
                        <div class="one"><span class="o-1">平均工时</span><br/><span class="o-1">70小时</span></div>
                    </div>
                    <div class="bott">
                        <a href="/company/workerRangeAttendDetail/">
                            {{item.name}}
                            <img src="../../../static/img/btn_right.png"/>
                        </a>
                    </div>
                </div>
                <div class="footer">
                    <a href="/user/allGroupRangeAttend/">
                        查看全部组员考勤 >
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "groupRange-attend",
        data(){
            return{
                list:[
                    {name: '张三'},
                    {name: '李四'},
                    {name: '王五'},
                    {name: '赵六'},
                ]
            }
        }
    }
</script>

<style scoped>
    .main{
        width: 100%;
    }
    .main .header{
        width: 100%; height: 2.5rem; line-height: 2.5rem; margin-top: 0.5rem; background: #fff; display: flex; justify-content: space-between;
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .header .left{
        font-size: 0.7rem; color: #666;
    }
    .main .header .right{
        position: relative; padding-right: 0.6rem;
    }
    .main .header .right .r-1{
        font-size: 0.7rem; color: #438cff;
    }
    .main .header .right .r-2{
        width: 0.6rem; height: 0.6rem; position: absolute; left: 3.9rem; top: 1rem;
    }

    .main .block{
        margin-top: 0.5rem; background: #fff;
    }
    .main .block .tst{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
    }
    .main .block .nav{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666; display: flex; justify-content: space-between;
        border-bottom: 1px solid #f4f4f4;
    }
    .main .block .nav .n-1{
        font-size: 0.6rem; color: #ccc;
    }

    .main .block .block-inner{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .block .block-inner .top{
        width: 100%; height: 2rem; font-size: 0.8rem; color: #999; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
        display: flex; justify-content: space-between; font-size: 0.7rem;
    }
    .main .block .block-inner .top .cent3 img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.6rem; right: 0px;
    }
    .main .block .block-inner .center{
        margin-top: 1rem;
    }
    .main .block .block-inner .center .center-2{
        width: 100%; display: flex; justify-content: space-between;
    }
    .main .block .block-inner .center .span{
        width: 4.5rem; height: 3.5rem; display: block; text-align: center;
    }
    .main .block .block-inner .center .span .span-1{
        font-size: 0.7rem; color: #666;
    }
    .main .block .block-inner .center .span .span-2{
        font-size: 1.15rem; color: #438cff;
    }
    .main .block .block-inner .center .span .span-3{
        font-size: 0.7rem; color: #438cff;
    }
    .main .block .block-inner .center .span .span-4{
        font-size: 1.15rem; color: #ef7373;
    }
    .main .block .block-inner .center .span .span-5{
        font-size: 0.7rem; color: #ef7373;
    }

    .aside{
        width: 100%; margin-top: 0.5rem;
    }
    .aside .top{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666; background: #fff; border-bottom: 1px solid #f4f4f4;
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .aside .box{
        background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-bottom: 0.5rem;
    }
    .aside .box .line{
        display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4;
    }
    .aside .box .line .one{
        width: 4.7rem; height: 2.5rem; text-align: center; line-height: 1.1rem; padding: 0.5rem 0;
    }
    .aside .box .line .one .o-1{
        font-size: 0.6rem; color: #999;
    }
    .aside .box .line .one .o-2{
        color: #ef7373;
    }
    .aside .box .bott{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; position: relative;
    }
    .aside .box .bott a{
        width: 100%; height: 100%; display: block; font-size: 0.7rem; color: #438cff;
    }
    .aside .box .bott img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.6rem;
    }

    .aside .footer{
        width: 100%; text-align: center; font-size: 0.7rem; color: #438cff; margin-top: 1rem;
    }
</style>