<template>
    <div data-page="offlineMode" class="page navbar-fixed toolbar-fixed offLineMode"><!-- :class="{offPage:offPage}"-->
        <div class="navbar">
            <div class="navbar-inner">
                <!--<div class="left sliding">-->
                    <!--<a href="#" class="back link">-->
                        <!--<i class="icon icon-back"></i>-->
                    <!--</a>-->
                <!--</div>-->
                <div class="center sliding">离线模式</div>
            </div>
        </div>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="cent">
                <div class="list">
                    <div>接收进度： {{downPrompt}}</div>
                    <div><f7-progressbar :progress="downProgress"></f7-progressbar></div>
                </div>
                <div class="list">
                    <div>发送进度： {{upPrompt}}</div>
                    <div><f7-progressbar :progress="upProgress"></f7-progressbar></div>
                </div>
                <div class="list">
                    <f7-button @click="goback" class="btn">返回</f7-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import offlineUtil from '../../lib/offlineUtil'

    export default {
        data () {
            return {
                upPrompt: '',
                upProgress: 0,
                downPrompt: '',
                downProgress: 0,
                offPage:false,
            }
        },
        methods: {
            goback() {
                this.$f7.confirm('确认退出离线模式', () => {
                    //offlineUtil.disconnect();
                    console.log("goback:"+123);
                    this.$router.back();
                });
            },
            async upDownload() {
                try {
                    await offlineUtil.receiveFile('attend.zip', (progress)=>{
                        console.log('接收进度：' + progress);
                        this.downProgress = progress;
                    });
                }
                catch (err) {
                    console.log('接收失败: ' + JSON.stringify(err));
                    if(err != 'Data is receiving')
                        this.downPrompt = err;
                }
                try {
                    await offlineUtil.sendFile('face.zip', (progress)=>{
                        console.log('发送进度：' + progress);
                        this.upProgress = progress;
                    });
                }
                catch (err) {
                    console.log('发送失败: ' + JSON.stringify(err));
                    if(err != 'Data is sending')
                        this.downPrompt = err;
                }
            }
        },
        mounted() {
            this.upDownload();
        }
    }
</script>

<style scoped>
    .page-content{
        background: #f4f4f4;
    }
    .cent{
        margin-top: 6px; box-sizing: border-box; padding: 0 0.6rem;
    }
    .cent .list {
        margin-top: 10px;
    }
    .btn{
        width: 70%; height: 2rem; background: #438cff; color: #fff; line-height: 2rem; text-align: center;
        margin-left: 15%; border: 1px solid #438cff; border-radius: 0.3rem; font-size: 0.8rem;
    }
    .progressbar {
        height: 18px;
    }
    .offLineMode{
        position: absolute;
        z-index: 10000;
    }
    .login-screen.modal-out{
        z-index: 10000;
    }
    .offPage{
        display: none !important;
    }
</style>
