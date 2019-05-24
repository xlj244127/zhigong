<template>
    <div class="page" name="IdentityExplain">
        <div class="page-content">
            <div class="navbar">
                <div class="navbar-inner">
                    <div class="left sliding">
                        <a href="#" class="back link">
                            <i class="icon icon-back"></i>
                        </a>
                    </div>
                    <div class="center sliding">身份说明</div>
                </div>
            </div>
            <div class="content-inner">
                <div class="main">
                    <div class="header">两个版本四个身份</div>
                    <div class="box">
                        <div class="b-1">智工通APP登录时可进行版本选择，分为“企业版”及“个人版”</div>
                        <div class="b-2">企业版包括两种身份：企业管理员、项目管理员</div>
                        <div class="b-2">个人版包括两种身份：班组长、工人</div>
                    </div>
                    <div class="box">
                        <div class="b-1">企业管理员:</div>
                        <div class="b-2">企业管理员可创建公司、创建项目、添加人员等，可设置多名企业管理员对本平台账号 进行管理及运营</div>
                    </div>
                    <div class="box">
                        <div class="b-1">项目管理员:</div>
                        <div class="b-2">项目管理员由企业管理员设置，负责项目管理，可进行项目人员添加、考勤管理查看、 信息录入等</div>
                    </div>
                    <div class="box">
                        <div class="b-1">班组长:</div>
                        <div class="b-2">班组长(包工头)，由企业管理员或项目管理员设置，可添加设置自己的班组及成员(即工人)</div>
                    </div>
                    <div class="box">
                        <div class="b-1">工人:</div>
                        <div class="b-2">分为班组工人及临时工，工人归属于班组长，如水电工、木工、油漆工等；临时工归属于 企业，如保洁、安保、厨师等为临时工人员</div>
                    </div>
                    <div class="box">
                        <div class="b-1">说明:</div>
                        <div class="b-2">可在“设置”中进行身份切换（如您已为班组长或工人，需创建公司请使用不同账号登录）</div>
                    </div>
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
    font-size: 0.65rem; color: #333; margin: 0.5rem 0 0.7rem 0;
}
.box{
    margin-bottom: 1.35rem;
}
.box .b-1{
    font-size: 0.55rem; color: #333; margin-bottom: 0.45rem;
}
.box .b-2{
    font-size: 0.45rem; color: #444;
}
</style>