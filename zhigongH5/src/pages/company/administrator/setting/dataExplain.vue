<template>
    <div data-page="dataExplain" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">数据说明</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <div class="header">两个版本四个身份</div>
                <div class="box">
                    <div class="b-1">企业管理员:</div>
                    <div class="b-2">（1）总人数：企业所有项目总人数</div>
                    <div class="b-2">（2）已考勤：已进行至少一次考勤的人数统计</div>
                    <div class="b-3">PS：同个工人加入多个项目，只统计为一个人</div>
                    <div class="b-2">（3）异常考勤：无考勤及缺卡考勤的人数统计</div>
                    <div class="b-2">（4）考勤率：（已考勤人数÷总人数）×100%</div>
                    <div class="b-3">PS：同个工人加入多个项目进行考勤，在一个项目中进行正常考勤打卡，在其他项目未 进行考勤打卡，算为异常考勤</div>
                </div>
                <div class="box">
                    <div class="b-1">项目管理员:</div>
                    <div class="b-2">（1）总人数：所管理的全部项目总人数</div>
                    <div class="b-2">（2）已考勤：所管理的全部项目已进行至少一次考勤的人数统计</div>
                    <div class="b-2">（3）异常考勤：所管理的全部项目当天无考勤及缺卡考勤的人数统计</div>
                    <div class="b-2">（4）考勤率：（所管理的全部项目当天已考勤人数÷总人数）×100%</div>
                    <div class="b-2">（5）平均工时：所管理的全部项目当天正常考勤工人的工作时长合计÷正常考勤人数</div>
                </div>
                <div class="box">
                    <div class="b-1">班组长:</div>
                    <div class="b-2">（1）总人数：班组已加入项目的总人数</div>
                    <div class="b-2">（2）已考勤：班组所在项目已进行至少一次考勤的人数统计</div>
                    <div class="b-2">（3）异常考勤：班组所在项目当天无考勤及缺卡考勤的人数统计</div>
                    <div class="b-2">（4）考勤率：（班组所在项目当天已考勤人数÷总人数）×100%</div>
                    <div class="b-2">（5）平均工时：班组所在项目当天正常考勤工人的工作时长合计÷正常考勤人数</div>
                </div>
                <div class="box">
                    <div class="b-1">工人:</div>
                    <div class="b-2">（1）正常考勤：当月所有项目正常考勤的天数统计</div>
                    <div class="b-2">（2）异常考勤：当月所有项目无考勤及缺卡考勤的天数统计</div>
                    <div class="b-3">PS：同个工人加入多个项目进行考勤，在一个项目中进行正常考勤打</div>
                    <div class="b-2">（3）合计工时：当月所有项目正常考勤时长统计</div>
                </div>
                <div class="box">
                    <div class="b-1">其他说明:</div>
                    <div class="b-2">（1）正常考勤：当天至少打两次卡的考勤</div>
                    <div class="b-3">PS：同个工人加入多个项目进行考勤，在一个项目中进行正常考勤打</div>
                    <div class="b-2">（2）异常考勤：</div>
                    <div class="b-2 b-4">①无考勤：当天未进行考勤</div>
                    <div class="b-2 b-4">②缺卡考勤：只打了一次卡的考勤</div>
                    <div class="b-2">（3）异常考勤率：[（无考勤人数+缺卡人数）÷总人数）]×100%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: ""
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #fff;
    }
    .main{
        box-sizing: border-box; padding: 0 0.6rem 0 0.6rem;
    }
    .header{
        font-size: 0.8rem; color: #333; margin: 0.5rem 0 0.7rem 0;
    }
    .box{
        margin-bottom: 1.25rem;
    }
    .box .b-1{
        font-size: 0.7rem; color: #333; margin-bottom: 0.45rem;
    }
    .box .b-2{
        font-size: 0.6rem; color: #444;
    }
    .box .b-3{
        font-size: 0.4rem; color: #444; box-sizing: border-box; padding-left: 1.5rem;
    }
    .box .b-4{
        box-sizing: border-box; padding-left: 1.5rem;
    }
</style>