<template>
    <div class="page">
        <div class="page-content">
            <div class="navbar">
                <div class="navbar-inner">
                    <div class="left sliding">
                        <a href="#" class="back link">
                            <i class="icon icon-back"></i>
                        </a>
                    </div>
                    <div class="center sliding">添加考勤机</div>
                </div>
            </div>
            <div class="main">
                <img class="img" src="../../../../../static/img/img_bluetooth.png"/>
                <div class="title">{{ prompt }}</div>
                <div class="bott" @click="openBlue">打开蓝牙</div>
            </div>
        </div>
    </div>
</template>

<script>
    import bluetooth from '../../../../lib/bluetoothUtil'

    export default {
        name: "addAttendMachine",
        data() {
            return {
                prompt: '打开蓝牙才能配对考勤机',
            };
        },
        methods: {
            openBlue() {
                let bott = this.$$('.bott');
                bott.attr("disabled","disabled");
                this.prompt = '正在匹配';
                bluetooth.connectToDevice('YM').then((result) => {
                    console.log('Connect to device result: ' + JSON.stringify(result));
                    if(result.status == 'connected') {
                        this.prompt = '匹配成功';
                    }
                    else if(result.status == 'scanStopped') {
                        this.prompt = '没有找到考勤机';
                    }
                    else {
                        this.prompt = '未知匹配错误';
                    }
                    bott.removeAttr("disabled");;
                }, (error) => {
                    this.prompt = '未知匹配错误';
                    console.log(error);
                    bott.removeAttr("disabled");;
                });
            }
        }
    }
</script>

<style scoped>
.page-content{
    width: 100%; height: 100%; background: #fff;
}
.main{
    margin-top: 3.75rem; text-align: center;
}
.main .img{
    width: 7.25rem; height: 7.25rem;
}
.main .title{
    width: 100%; font-size: 0.7rem; color: #438cff; margin-top: 1.75rem;
}
.main .bott{
    width: 5rem; height: 2rem; line-height: 2rem; border-radius: 0.4rem; font-size: 0.8rem; color: #fff; background: #438cff; margin: 1.25rem auto;
}
</style>