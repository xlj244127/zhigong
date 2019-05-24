<template>
    <div class="main">
        <div class="top">
            <div class="box">
                <a href="/company/tempAttendNumb/">
                    <span>临时考勤数</span>
                    <br/>
                    <span class="size">100</span><span class="size2">人</span>
                </a>
            </div>
            <div class="box">
                <a href="/company/passedAttendList/">
                    <span>已通过审批</span>
                    <br/>
                    <span class="size">80</span><span class="size2">人</span>
                </a>
            </div>
            <div class="box">
                <a href="/company/tempAttendProjList/">
                    <span>临时考勤项目组</span>
                    <br/>
                    <span class="size">10</span><span class="size2">个</span>
                </a>
            </div>
        </div>

        <div class="ipt">
            <input type="text" placeholder="请选择项目组" readonly id="picker-device">
            <div class="i-1" @click.stop.prevent="selectAction">
                请选择项目
                <img class="i-img" src="../../../static/img/btn_drop_down.png"/>
            </div>
        </div>

        <div class="btt">
            <div class="p1">临时考勤列表</div>
            <div class="build" v-for="item in list">
                <div class="one">
                    <div class="on1"><img src=""/></div>
                    <div class="on2"><span class="o-1">{{item.name}}</span> <br/> <span class="o-2">18566746603</span></div>
                </div>
                <div class="two">
                    <div class="tw"><span class="t-1">xxx水电班组</span> <br/> <span class="t-2">变更班组</span></div>
                    <div class="tw"><span class="t-1">深圳湾项目</span> <br/> <span class="t-3">通过</span></div>
                </div>
                <div class="three">首次考勤时间: 2018-02-08 08:00</div>
            </div>
        </div>
        <div class="skip">
            <a href="/company/tempAttendNumb/">查看所有临时考勤 ></a>
        </div>
        <div class="footer">
            <span>说明: 未加入班组，已在班组进行考勤，此类考勤数据为临时考勤</span>
            <br/>
            <span>"加入班组"后该人员添加至该班组</span>
        </div>
    </div>
</template>

<script>
    var pickerDevice;
    export default {
        name: "attend-approve",
        data(){
            return{
                list: [
                    {name: '张三'},
                ],
                list2:['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
            }
        },
        methods:{
            selectAction(){
                pickerDevice.open();
            }
        },
        mounted(){
            pickerDevice = this.$f7.picker({
                input: '#picker-device',
                cols: [
                    {
                        textAlign: 'center',
                        values: this.list2
                    }
                ]
            });
        }
    }
</script>

<style scoped>
    .top{
        width: 100%; height: 4.5rem; display: flex; justify-content: space-between; padding: 0.6rem; box-sizing: border-box;
        background: #fff; margin-top: 0.5rem;
    }
    .top .box{
        width: 5rem; height: 3.5rem; text-align: center; box-sizing: border-box; padding-top: 0.6rem;
    }
    .top .box a{
        width: 100%; height:100%; font-size: 0.65rem; color: #666;
    }
    .top .box .size{
        font-size: 1.15rem; color: #438cff;
    }
    .top .box .size2{
        color: #438cff; font-size: 0.7rem;
    }

    .ipt{
       position: relative; box-sizing: border-box; padding: 0 0.6rem; background: #fff; margin-top: 0.5rem;
    }
    .ipt #picker-device{
        width: 100%; height: 2rem; border: none;
    }
    .ipt .i-1{
        font-size: 0.7rem; color: #438cff; position: absolute; right: 0.5rem; top: 0.6rem;
    }
    .ipt .i-1 .i-img{
        width: 0.6rem; height: 0.6rem; display: inline;
    }

    .btt{
        width: 100%; margin-top: 0.5rem;
    }
    .btt .p1{
        width: 100%; height: 2.5rem; font-size: 0.7rem; color: #666; line-height: 2.5rem; border-bottom: 1px solid #f4f4f4;
        background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .build{
         width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-bottom: 0.5rem;
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
        border: 1px solid #438cff; border-radius: 0.4rem; color: #438cff; padding: 0.25rem 0.5rem;
    }

    .build .three{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.6rem; color: #666;
    }

    .skip{
        width: 100%; text-align: center; margin-top: 1.25rem; font-size: 0.7rem; color: #438cff;
    }

    .footer{
        width: 100%; font-size: 0.5rem; color: #aaa; text-align: center; padding: 1.25rem 0;
    }
</style>