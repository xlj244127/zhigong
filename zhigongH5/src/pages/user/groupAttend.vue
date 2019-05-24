<template>
    <f7-page data-page="attendManage" navbar-fixed> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">班组考勤</div>
            </div>
        </div>
        <!---侧边栏--->
        <group-nav></group-nav>
        <!--页面主要类容-->
        <div class="page-content">
            <groupToday-attend v-if="isShow==1"></groupToday-attend>
            <groupRange-attend v-if="isShow==2"></groupRange-attend>
        </div>

    </f7-page>
</template>

<script>
    import groupNav from '../../components/broadside-navigation/group'
    import groupTodayAttend from '../../components/group-attend/groupTodayAttend'
    import groupRangeAttend from '../../components/group-attend/groupRangeAttend'

    export default {
        data() {
            return {
                isShow: '1'
            }
        },
        components: {
            groupNav, groupTodayAttend, groupRangeAttend,
        },
        methods: {
            oneAction() {
                this.isShow = '1';
            },
            twoAction() {
                this.isShow = '2';
            }
        }
    }
</script>

<style scoped>
    .page-content {
        width: 100%;
        height: 100%;
        background: #f4f4f4;
        padding: 0!important;
    }

    .navbar .left {
        width: 1.5rem;
        height: 1.5rem;
    }

</style>