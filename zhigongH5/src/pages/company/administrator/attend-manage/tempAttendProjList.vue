<template>
    <div data-page="tempAttendProjList" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">临时考勤项目列表</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <div class="header">存在临时考勤的项目（4个）</div>
                <ul class="aul">
                    <li>
                        <a href="#">
                            <div class="left">深圳湾项目组</div>
                            <div class="right">3人</div>
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <div class="left">深圳南山项目组</div>
                            <div class="right">3人</div>
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <div class="left">深圳福田项目组</div>
                            <div class="right">3人</div>
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <div class="left">深圳南山智园项目组</div>
                            <div class="right">3人</div>
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                </ul>
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
    width: 100%; height: 100%; background: #f4f4f4;
}
    .main{
        width: 100%; background: #fff; margin-top: 0.5rem; box-sizing: border-box; padding: 0 0.6rem;
    }
.main .header{
    width: 100%; height: 2.5rem; font-size: 0.7rem; color: #999; border-bottom: 1px solid #f4f4f4; line-height: 2.5rem;
}
.main .aul li{
    width: 100%; height: 2.5rem; border-bottom: 1px solid #f4f4f4; line-height: 2.5rem;
}
.main .aul li a{
    width: 100%; height: 100%; font-size: 0.7rem; color: #666; display: block; display: flex; justify-content: space-between; position: relative;
}
.main .aul li a img{
    width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.8rem;
}
.main .aul li a .left{

}
.main .aul li a .right{
    padding-right: 1.25rem;
}
</style>