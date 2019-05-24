<template>
    <div data-page="attendManage" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">班组区间考勤详情</div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                <ul class="aul">
                    <li>项目: xxxx班组</li>
                    <li>班组长: xxx</li>
                    <li>班组成员数: 10人</li>
                    <li>所属项目: xxx项目</li>
                    <li>项目所在地: 广东省深圳市南山区</li>
                </ul>
            </div>
            <div class="block">
                <div class="top">统计时间: 20174-01-01至2017-01-31</div>
                <div class="box" v-for="item in list">
                    <div class="line">
                        <div class="one"><span class="o-1">出勤天数</span><br/><span class="o-1">88天</span></div>
                        <div class="one"><span class="o-1">异常考勤</span><br/><span class="o-2">33次</span></div>
                        <div class="one"><span class="o-1">缺卡</span><br/><span class="o-2">88次</span></div>
                        <div class="one"><span class="o-1">无考勤</span><br/><span class="o-2">88次</span></div>
                        <div class="one"><span class="o-1">平均工时</span><br/><span class="o-1">70%</span></div>
                    </div>
                    <div class="bott">
                        <a href="/company/workerRangeAttendDetail/">
                            {{item.name}}
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
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
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .header{
        margin-top: 0.5rem; background: #fff;
    }
    .header .aul{
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .header .aul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
    }

    .block{
        width: 100%; margin-top: 0.5rem;
    }
    .block .top{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666; background: #fff; border-bottom: 1px solid #f4f4f4;
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .block .box{
        background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-bottom: 0.5rem;
    }
    .block .box .line{
        display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4;
    }
    .block .box .line .one{
        width: 2.925rem; height: 2.5rem; text-align: center; line-height: 1.1rem; padding: 0.5rem 0;
    }
    .block .box .line .one .o-1{
        font-size: 0.6rem; color: #999;
    }
    .block .box .line .one .o-2{
        color: #ef7373;
    }
    .block .box .bott{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; position: relative;
    }
    .block .box .bott a{
        width: 100%; height: 100%; display: block; font-size: 0.7rem; color: #438cff;
    }
    .block .box .bott img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.6rem;
    }
</style>