<template>
    <f7-page name="lackAttendDetail" navbar-fixed toolbar-fixed> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">个人区间考勤</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <div class="cont">
                    <div class='left'>
                        <ul>
                            <li>姓名:&nbsp; &nbsp;<span>{{ userName }}</span></li>
                            <li>所属班组:&nbsp; &nbsp;<span>xx项目组</span></li>
                            <li>班组长:&nbsp; &nbsp;<span>李四</span></li>
                            <li>考勤项目组:&nbsp; &nbsp;<span>嘻嘻嘻项目组</span></li>
                            <li>工种:&nbsp; &nbsp;<span>水电工</span></li>
                            <li>考勤规则:&nbsp; &nbsp;<span>自由考勤</span></li>
                        </ul>
                    </div>
                    <div class='right'>
                        <img src=""/>
                    </div>
                </div>
            </div>
            <div class="block">
                <div class="head">统计时间:&nbsp; &nbsp;2017-01-01至2017-01-31</div>
                <ul class="aul">
                    <li>出勤天数:&nbsp; &nbsp;<span>22天</span></li>
                    <li>异常考勤次数:&nbsp; &nbsp;<span class="a-1">6 次</span></li>
                    <li>缺卡次数:&nbsp; &nbsp;<span class="a-1">4 次</span></li>
                    <li>工作总时长:&nbsp; &nbsp;<span>xx小时xx分钟</span></li>
                    <li>平均工时:&nbsp; &nbsp;<span>xx小时</span></li>
                </ul>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import { statisticalSummaryApi } from '../../../../api'
    import moment from 'moment'

    export default {
        data() {
            return {
                userName: ''
            }
        },
        methods: {
            getUserDisplayName(userInfo) {
                if(userInfo.nickname)
                    return userInfo.nickname;
                else if(userInfo.name)
                    return userInfo.name;
                else
                    return '用户未填写';
            },

        },
        mounted() {
            this.userName = this.getUserDisplayName(this.$store.state.userInfo);
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
    .main .cont{
        width: 100%; display: flex; border-bottom: 1px solid #f4f4f4;
    }
    .main .cont .left{
        flex: 1;
    }
    .main .cont .left ul li, .main .foot ul li{
        height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666;
    }
    .main .cont .right{
        width: 4.8rem; height: 6.4rem; border: 1px solid #ccc; margin: 0.8rem 0.75rem 0 0;
    }
    .main .foot ul li{
        border-bottom: 1px solid #f4f4f4;
    }

    .block{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-top: 0.5rem; font-size: 0.7rem; color: #666;
    }
    .block .head{
        width: 100%; height: 2rem; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
    }
    .block .aul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #f4f4f4;
    }
    .block .aul li .a-1{
        color: #ef7373;
    }
</style>