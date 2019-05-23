<template>
    <a href="#" data-panel="right" @click="scan"><img class="right" src="../../../static/img/icon_nav_sweep.png" /></a>
</template>

<script type="text/ecmascript-6">
    import scanUtil from '../../lib/scanUtil'

    export default {
        name: 'scan-icon',
        data () {
            return {}
        },
        methods: {
            scan: function () {
                scanUtil.barcodeScan().then((result)=>{
                    let code = result.text;
                    let strs = code.split('##');
                    if(strs.length >= 2) {
                        let action = strs[0];
                        console.log('Action is: ' +  action);
                        if(action === 'AddToWorkGroup') {
                            let groupLeaderId = strs[1];
                            console.log('GroupLeaderId is: ' +  groupLeaderId);
                            let mainView = window.f7.getCurrentView(0);
                            mainView.router.loadPage('/user/workTypeList?groupLeaderId='+groupLeaderId);
                        }
                    }
                    else
                        that.$f7.alert('不能识别的二维码！');
                });
            }
        },
    }
</script>
<style scoped type="text/css">
    a{
        right:0.5rem;
        position: absolute; top: 0.5rem;
    }
    a img{
        width: 1.5rem; height: 1.5rem;
    }
</style>
