<template>
    <div data-page="tempAttendNumbPage" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">临时考勤项目人员</div>
            </div>
        </div>
        <div class="page-content">
            <div class="btt">
                <div class="ipt">
                    <div>
                        <input type="text" placeholder="请选择项目组" readonly id="picker-device">
                        33人
                    </div>
                    <div class="i-1" @click.stop.prevent="selectAction">
                        请选择项目
                        <img class="i-img" src="../../../../../static/img/btn_drop_down.png"/>
                    </div>
                </div>

                <div class="build"  v-for="item in list">
                    <div class="one">
                        <div class="on1"><img src=""/></div>
                        <div class="on2"><span class="o-1">{{item.name}}</span> <br/> <span class="o-2">18566746603</span></div>
                    </div>
                    <div class="two">
                        <div class="tw"><span class="t-1">xxx水电项目组</span> <br/> <span class="t-2">变更班组</span></div>
                        <div class="tw"><span class="t-1">深圳湾项目</span> <br/> <span class="t-3">加入项目</span></div>
                    </div>
                    <div class="three">首次考勤时间: 2018-02-08 08:00</div>
                </div>
            </div>
            <img class="fiximg" src="../../../../../static/img/btn_return_top.png"/>
        </div>
    </div>
</template>

<script>
    var pickerDevice;
    export default {
        data() {
            return {
                list: [
                    {name: '张三'},
                    {name: '李四'},
                    {name: '王五'},
                    {name: '赵六'},
                ],
                list2: ['iPhone 4', 'iPhone 4S', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
            }
        },
        methods: {
            selectAction() {
                pickerDevice.open();
            }
        },
        mounted() {
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
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .btt{
        width: 100%;
    }
    .btt .p1{
        width: 100%; height: 2.5rem; font-size: 0.7rem; color: #666; line-height: 2.5rem; border-bottom: 1px solid #f4f4f4; background: #fff;
        box-sizing: border-box; padding: 0 0.6rem; margin-top: 0.5rem;
    }

    .btt .ipt{
        position: relative; box-sizing: border-box; padding: 0 0.6rem; background: #fff; margin-top: 0.5rem; display: flex; font-size: 0.7rem; color: #666;
    }
    .btt .ipt #picker-device{
        width: 50%; height: 2rem; border: none;
    }
    .btt .ipt .i-1{
        font-size: 0.7rem; color: #438cff; position: absolute; right: 0.5rem; top: 0.6rem;
    }
    .btt .ipt .i-1 .i-img{
        width: 0.6rem; height: 0.6rem; display: inline;
    }

    .build{
        margin-bottom: 0.5rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin: 0.5rem;
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

    .fiximg{
        width: 1.5rem; height: 1.5rem; position: fixed; right: 0.6rem; bottom: 1.25rem;
    }
</style>