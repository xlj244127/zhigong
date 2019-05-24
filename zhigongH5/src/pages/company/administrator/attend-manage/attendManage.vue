<template>
    <div data-page="attendManage" class="page navbar-fixed toolbar-fixed" @page:reinit="back"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center sliding">考勤管理</div>
            </div>
        </div>
        <!---侧边栏--->
        <company-admin></company-admin>
        <no-company v-if="companyId==0 || companyRole==3"></no-company>
        <div v-else class="page-content infinite-scroll">
            <div class="fixed">
                <ul class="aul">
                    <li @click="oneAction()"  :class="{active: isShow==1}">日考勤</li>
                    <li @click="twoAction()" :class="{active: isShow==2}">月考勤</li>
                    <li @click="threeAction()" :class="{active: isShow==3}">项目考勤</li>
                    <li @click="fourAction()" :class="{active: isShow==4}">考勤规则</li>
                </ul>
            </div>

            <today-attend v-if="isShow==1"></today-attend>
            <month-attend v-if="isShow==2"></month-attend>
            <proj-attend v-if="isShow==3"></proj-attend>
            <attendRules v-if="isShow==4" :attendRlueList="attendRlueList"></attendRules>
        </div>
    </div>
</template>

<script>
    import { statisticalSummaryApi, dutyApi} from '../../../../api'
    import companyAdmin from '../../../../components/broadside-navigation/companyAdmin'
    import todayAttend from '../../../../components/companyattend-manage/todayAttend'
    import rangeAttend from '../../../../components/companyattend-manage/rangeAttend'
    import attendApprove from '../../../../components/companyattend-manage/attendApprove'
    import noCompany from '../../../../components/company-home/noCompany'
    import monthAttend from '../../../../components/companyattend-manage/monthAttend'
    import projAttend from '../../../../components/companyattend-manage/projAttend'
    import attendRules from '../../../../components/companyattend-manage/attendRules'
    export default {
        data(){
            return{
                isShow: '1',
                companyId:'',
                companyRole: '',
                today: '',
                yesterday: '',
                page: 1,
                pageSize: 14,
                attendRlueList: []
            }
        },
        components: {
            companyAdmin, todayAttend, noCompany, monthAttend, projAttend, attendRules
        },
        methods:{
            back(){
                console.log('到了这里');
                dutyApi.getDutyRuleDetail(this.page, this.pageSize, this.companyId).then((result)=>{
                    console.log('规则列表',result.data);
                    this.attendRlueList = result.data;
                })
            },
            oneAction(){
                this.isShow = '1';
            },
            twoAction(){
                this.isShow = '2';
            },
            threeAction(){
                this.isShow = '3';
            },
            fourAction(){
                this.isShow = '4';
                dutyApi.getDutyRuleDetail(this.page, this.pageSize, this.companyId).then((result)=>{
                    console.log('规则列表',result.data);
                    this.attendRlueList = result.data;
                })
            }
        },
        mounted(){
            this.today = this.$store.state.chosenDay;
            this.yesterday = this.$store.state.chosenYesterday;
            this.companyId=this.$store.state.roleInfo.companyId;
            this.companyRole = this.$store.state.roleInfo.companyRole;
            console.log('roleInfo',this.$store.state.roleInfo);
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
    width: 25%; text-align: center;  font-size: 0.7rem; color: #666; line-height: calc(2.5rem - 2px); margin-right: 1.25rem;
    border-bottom: 2px solid #fff;
}
.fixed .aul li.active{
    color: #438cff;
    border-bottom: 2px solid #438cff;
}
</style>