<template>
    <f7-page name="QRcode">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">个人二维码</div>
            </div>
        </div>
        <div class="codeMain">
            <div class="content-block">
                <div class="block-inner">
                    <img :src="qrCode">
                    <span>{{userName}}</span>
                </div>
            </div>
            <div class="tst">智工二维码</div>
            <!--<button class="btn">分享二维码</button>-->
        </div>
    </f7-page>
</template>

<script>
    export default {
        data() {
            return {
                userName: '未填写',
                qrCode: ''
            }
        },
        mounted() {
            if(this.$store.state.userInfo.name)
                this.userName = this.$store.state.userInfo.name;
            this.qrCode = this.$store.state.userInfo.qrcode;
        }
    }
</script>

<style scoped>
.page-content{
    width: 100%; height: 100%; background: #f4f4f4 !important; text-align: center;
}
.navbar{
    background: #fff;
}
.codeMain{
    height:calc(100% - 2.25rem);
    background: #f4f4f4;
    padding-top: 1px;
}
.content-block{
    box-sizing: border-box; margin: 0.6rem 0.75rem; background: #fff; text-align: center;
}
.content-block .block-inner{
    width: 12.5rem; height: 14rem;
    margin: 0 auto;
    padding: 1.5rem 0;
}
.content-block .block-inner img{
    width: 12.5rem; height: 12.5rem;
}
.content-block .block-inner span{
    font-size: 0.7rem; color: #666;
}
.tst{
     font-size: 0.7rem; color: #ccc;
    text-align: center;
    line-height: 4;
}
.btn{
    width: 30%; height: 2rem; background: #438cff; font-size: 0.7rem; color: #fff; border-radius: 0.4rem;
    margin-top: 1.25rem;
}
</style>