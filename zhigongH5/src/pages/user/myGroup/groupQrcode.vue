<template>
    <f7-page name="groupQrcode">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">加入班组二维码</div>
            </div>
        </div>
        <div id="qrcode">

        </div>
    </f7-page>
</template>

<script>
    import QRCode from 'qrcode2';

    export default {
        mounted() {
            new QRCode(document.getElementById('qrcode'), 'AddToWorkGroup##'+this.$store.state.userInfo.id);
        },
    }
</script>

<style scoped>
    #qrcode {
        height: calc(100% - 44px); display: flex; justify-content: center; align-items:center;
    }
</style>