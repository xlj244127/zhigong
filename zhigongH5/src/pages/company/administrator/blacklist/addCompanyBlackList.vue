<template>
    <div data-page="addCompanyBlackList" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">添加企业黑名单</div>
            </div>
        </div>
        <div class="page-content">
            <div class="top">
                <div class="top-1" @click="oneAction" :class="{active: isShow==1}">从项目添加</div>
                <div class="top-1" @click="twoAction" :class="{active: isShow==2}">身份证添加</div>
            </div>
            <div class="line"></div>

            <oneAddCompanyBlackList v-if="isShow==1"></oneAddCompanyBlackList>
            <otherAddCompanyBlackList v-if="isShow==2"></otherAddCompanyBlackList>

        </div>
    </div>
</template>

<script>
    import oneAddCompanyBlackList from '../../../../components/blackList/oneAddCompanyBlackList'
    import otherAddCompanyBlackList from '../../../../components/blackList/otherAddCompanyBlackList'
    export default {
        data(){
            return{
                isShow: 1
            }
        },
        components: {
            oneAddCompanyBlackList, otherAddCompanyBlackList
        },
        methods: {
            oneAction(){
                this.isShow = 1;
            },
            twoAction(){
                this.isShow = 2;
            }
        }
    }
</script>

<style scoped>
.page-content{
    width: 100%; height: 100%; background: #fff;
}
.top{
    width: 100%; height: 2.5rem; line-height: 2.5rem; display: flex; font-size: 0.7rem; color: #666;
}
.top .top-1{
    line-height: 2.4rem; text-align: center; margin-left: 1rem;
}
.top .top-1.active{
    border-bottom: 1px solid #438CFF;
}
.line{
    width: 100%; height: 0.5rem; background: #f4f4f4;
}
</style>