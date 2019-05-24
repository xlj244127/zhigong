<template>
    <div data-page="attendManage" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center sliding">考勤管理</div>
            </div>
        </div>
        <!---侧边栏--->
        <proj-admin></proj-admin>
        <no-company v-if='companyId==0'></no-company>
        <div v-else class="page-content">
            <div class="fixed">
                <ul class="aul">
                    <li @click="oneAction()" :class="{active: isShow==1}">日考勤</li>
                    <li @click="twoAction()" :class="{active: isShow==2}">月考勤</li>
                </ul>
            </div>

            <today-attend v-if="isShow==1"></today-attend>
            <monthAttend v-if="isShow==2"></monthAttend>
        </div>
    </div>
</template>

<script>
    import projAdmin from '../../../components/broadside-navigation/projAdmin'
    import todayAttend from '../../../components/projattend-manage/todayAttend'
    import monthAttend from '../../../components/projattend-manage/monthAttend'
    import rangeAttend from '../../../components/projattend-manage/rangeAttend'
    import attendApprove from '../../../components/projattend-manage/attendApprove'
    import noCompany from '../../../components/company-home/noCompany'
    export default {
        data(){
            return{
                companyId: '',
                isShow: '1'
            }
        },
        components: {
            todayAttend, monthAttend, rangeAttend, attendApprove, projAdmin,noCompany
        },
        methods:{
            oneAction(){
                this.isShow = '1';
            },
            twoAction(){
                this.isShow = '2';
            }
        },
        created(){
            this.companyId = this.$store.state.roleInfo.companyId;
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }

    .fixed{
        width: 100%; height: 2.5rem;  background: #fff;

    }
    .fixed .aul{
        display: flex; padding-left: 0.6rem;
    }
    .fixed .aul li{
        height: calc(2.5rem - 0.1rem); font-size: 0.7rem; color: #666; line-height: calc(2.5rem - 0.1rem); margin-right: 1.25rem;
        border-bottom: 0.1rem solid #fff;
    }
    .fixed .aul li.active{
        color: #438cff;
        border-bottom: 0.1rem solid #438cff;
    }

</style>