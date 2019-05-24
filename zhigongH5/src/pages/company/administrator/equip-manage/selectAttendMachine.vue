<template>
    <div data-page="bindAttendMachine" class="page navbar-fixed toolbar-fixed">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">选择考勤机</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <ul class="aul">
                    <li>考勤机</li><li>绑定项目</li><li>位置</li><li>状态</li>
                </ul>
                <div class="block" v-for="item in list">
                    <ul class="aul2">
                        <li>{{item.name}} <img class="oneImg" src="../../../../../static/img/label_4g.png"/></li>
                    </ul>
                    <div class="skip">
                        绑定
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "unbound",
        data(){
            return{
                list:[
                    {name: '01'},
                    {name: '02'},
                    {name: '03'}
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
        width: 100%; margin-top: 0.5rem;
    }
    .main .aul{
        display: flex;justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem; background: #fff; border-bottom: 1px solid #f4f4f4;
    }
    .main .aul li{
        width: 4.65rem; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #999;
    }
    .main .block{
        background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-bottom: 0.5rem;
    }
    .main .block .aul2{
        width: 100%; height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #f4f4f4;
    }
    .main .block .aul2 li{
        font-size: 0.7rem; color: #999;
    }
    .main .block .aul2 .oneImg{
        width: 1.35rem; height: 0.6rem;
    }
    .main .block .skip{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.7rem; color: #438cff;
    }
</style>