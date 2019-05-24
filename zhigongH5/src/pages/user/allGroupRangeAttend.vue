<template>
    <div data-page="attendManage" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">班组成员区间考勤</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <div class="header">2017-01-01至2017-01-31</div>
                <div class="nav">
                    <div class="n-2">姓名</div> <div class="n-2">正常出勤</div> <div class="n-2">异常考勤</div> <div class="n-2">缺卡</div>
                    <div class="n-2">无考勤</div> <div class="n-2">平均工时</div>
                </div>
                <ul class="aul">
                    <li v-for="item in list">
                        <a href="/company/workerRangeAttendDetail/">
                            <div class="ali-1">{{item.name}}</div> <div class="ali-2">88</div> <div class="ali-3">66</div> <div class="ali-4">20%</div>
                            <div class="ali-5">20%</div> <div class="ali-6">20%</div>
                            <img src="../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "",
        data(){
            return{
                list:[
                    {name: '张三'},
                    {name: '李四'},
                    {name: '王五'},
                    {name: '艾青'}
                ]
            }
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .main{
        width: 100%; background: #fff; margin-top: 0.5rem; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .header{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
    }
    .main .nav{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; justify-content: space-between;
        border-bottom: 1px solid #f4f4f4; font-size: 0.7rem; color: #aaa;
    }
    .main .nav .n-2{

    }
    .main .aul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; position: relative;
    }
    .main .aul li a{
        width: 100%; height: 100%; display: block; display: flex; font-size: 0.7rem; color: #666; justify-content: space-between;
    }
    .main .aul li .ali-2{
        transform: translateX(-0.4rem);
    }
    .main .aul li .ali-3{
        transform: translateX(0.4rem);
    }
    .main .aul li .ali-4{
        transform: translateX(0.4rem);
    }
    .main .aul li .ali-5{
        transform: translateX(-0.4rem);
    }
    .main .aul li .ali-6{
        transform: translateX(-0.8rem);
    }
    .main .aul li img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.8rem;
    }
</style>