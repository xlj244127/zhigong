<template>
    <div data-page="tempAttendNumbPage" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">已通过考勤列表</div>
            </div>
        </div>
        <div class="page-content">
            <div class="btt">
                <div class="build"  v-for="item in list">
                    <div class="one">
                        <div class="on1"><img src=""/></div>
                        <div class="on2"><span class="o-1">{{item.name}}</span> <br/> <span class="o-2">18566746603</span></div>
                    </div>
                    <div class="two">
                        <div class="tw"><span class="t-1">xxx水电项目组</span> <br/> <span class="t-2">变更班组</span></div>
                        <div class="tw"><span class="t-1">深圳湾项目</span> <br/> <span class="t-3">已通过</span></div>
                    </div>
                    <div class="three">首次考勤时间: 2018-02-08 08:00</div>
                </div>
            </div>
            <img class="fiximg" src="../../../../../static/img/btn_return_top.png"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "",
        data(){
            return{
                list: [
                    {name: '张三'},
                    {name: '李四'},
                    {name: '王五'},
                    {name: '赵六'},
                    {name: '小七'},
                    {name: '老八'},
                ]
            }
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .btt{
        width: 100%;
    }
    .build{
        margin-top: 0.5rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }

    .build .one{
        width: 100%; height: 3.25rem; display: flex;
    }
    .build .one .on1{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .build .one .on2{
        flex: 1; padding: 0.7rem 0 0 0.75rem;
    }
    .build .one .on2 .o-1{
        font-size: 0.8rem; color: #438cff;
    }
    .build .one .on2 .o-2{
        font-size: 0.6rem; color: #999;
    }

    .build .two{
        display: flex; justify-content: space-around;
    }
    .build .two .tw{
        flex: 1; text-align: center; border-bottom: 1px solid #f4f4f4; padding: 0.4rem 0 1rem 0;
    }
    .build .two .tw .t-1{
        font-size: 0.8rem; color: #666;
    }
    .build .two .tw .t-2, .t-3{
        font-size: 0.7rem; display: inline-block; margin-top: 0.5rem;
    }
    .build .two .tw .t-2{
        background: #438cff; color: #fff; border-radius: 0.4rem; padding: 0.25rem 0.5rem;
    }
    .build .two .tw .t-3{
        color: #438cff; padding: 0.25rem 0.5rem;
    }

    .build .three{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.6rem; color: #666;
    }

    .fiximg{
        width: 1.5rem; height: 1.5rem; position: fixed; right: 0.6rem; bottom: 1.25rem;
    }
</style>