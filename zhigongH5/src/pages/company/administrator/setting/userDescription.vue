<template>
    <f7-page name="userDescription">
        <div class="page-content">
            <div class="navbar">
                <div class="navbar-inner">
                    <div class="left sliding">
                        <a href="#" class="back link">
                            <i class="icon icon-back"></i>
                        </a>
                    </div>
                    <div class="center sliding">使用说明</div>
                </div>
            </div>
            <div class="content-inner">
                <ul class="aul">
                    <li>
                        <a href="/company/IdentityExplain/">
                            <span>身份说明</span>
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                    <li>
                        <a href="/company/dataExplain/">
                            <span>数据说明</span>
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </f7-page>
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
.aul{
    background: #fff; margin-top: 0.5rem;
}
.aul li{
    width: 100%; height: 2.5rem; line-height: 2.5rem; position: relative; box-sizing: border-box; padding-left: 0.6rem; border-bottom: 1px solid #f4f4f4;
}
.aul li a{
    width: 100%; height: 100%; display: inline-block; font-size: 0.7rem; color: #666;
}
.aul li img{
    width: 0.9rem; height: 0.9rem; position: absolute; top: 0.8rem; right: 0.6rem;
}
</style>