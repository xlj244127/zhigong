<template>
    <div data-page="projDayAttend" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">项目考勤</div>
            </div>
        </div>
        <div class="page-content">
            <div class="fixed">
                <ul class="aul">
                    <li @click="oneAction()"  :class="{active: isShow==1}">项目日考勤</li>
                    <li @click="twoAction()" :class="{active: isShow==2}">项目月考勤</li>
                </ul>
            </div>

            <projDayAttend v-if="isShow==1"></projDayAttend>
            <projMonthAttend v-if="isShow==2"></projMonthAttend>


        </div>
    </div>
</template>

<script>
    import projDayAttend from '../../../../components/companyattend-manage/projDayAttend'
    import projMonthAttend from '../../../../components/companyattend-manage/projMonthAttend'
    var projectId;
    export default {
        data(){
            return{
                isShow: '1'
            }
        },
        components: {
            projDayAttend, projMonthAttend
        },
        methods:{
            oneAction(){
                this.isShow = '1';
            },
            twoAction(){
                this.isShow = '2';
            }
        },
        mounted(){
            projectId = this.$route.params.id;
            this.$store.state.projectId = projectId;
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
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