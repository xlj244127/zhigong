<template>
    <div data-page="ChoosePage" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">选择功能版本</div>
                <div class="right"> </div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <ul class="list">
                    <li @click="onEnterprise"><a href="/user/adminhome/">
                        <img src="../../../static/img/icon_btt_firm.png">
                        <p>企业版</p>
                    </a></li>
                    <li @click="onStaff"><a href="/user/staffhome/">
                        <img src="../../../static/img/icon_btt_staff.png">
                        <p>个人版</p>
                    </a></li>
                </ul>
            </div>
            <div class="text">
                <span>温馨提示 :</span>
                <br/>
                <span>建筑企业管理员请选择企业版，包工头及工人请选择个人版</span>
                <br>
                <span>选择后可在"设置"中进行切换</span>
            </div>
        </div>
    </div>

</template>

<script type="text/ecmascript-6">
    import { LocalCache } from '../../lib/utils'
    import { userApi } from '../../api/userApi'

    export default {
        name: 'choose',
        data () {
            return {

            }
        },
        methods: {
            onEnterprise() {
                LocalCache.set('isAdmin', true);
                this.emitChosen(true);
            },
            onStaff() {
                LocalCache.set('isAdmin', false);
                this.emitChosen(false);
            },
            emitChosen(isAdmin) {
                this.$emit('chosen', isAdmin);
            }
        }
    }
</script>
<style scoped>
    .main{
        width: 100%; margin-top: 2.5rem;
    }
    .main .list{
        width: 80%; height: 9rem; display: flex; justify-content: space-between; margin-top: 2.5rem; margin-left: 10%;
    }
    .main .list li{
        width: 45%; height: 9rem; border: 1px solid dodgerblue; text-align: center;
        border-radius: 0.4rem;
    }
    .main .list li a{
        width: 100%; height: 100%; display: block;
    }
    .main .list li img{
        width: 2.85rem; height: 2.85rem; margin-top: 2rem;
    }
    .main .list li p{
        font-size: 0.9rem; color: #666;
    }
    .text{
        width: 80%; text-align: center; color: #999; ;
        margin: 3.55rem auto 0;
        display: block;
    }
</style>