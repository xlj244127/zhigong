<template>
    <div data-page="blackListManage" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">黑名单管理</div>
            </div>
        </div>
        <!---侧边栏--->
        <proj-admin v-if="companyRole==2"></proj-admin>
        <company-nav v-else></company-nav>
        <!--页面主要类容-->
        <no-company v-if="companyId==0 || companyRole==3"></no-company>
        <div v-else class="page-content">
            <no-blackList v-if="hasDate==0"></no-blackList>
            <have-blackList v-else :blackListStat="blackListStat" :blackList="blackList"></have-blackList>
            <div class="footer" v-if="this.companyRole == 1">
                <a href="/company/addCompanyBlackList/:id/">添加企业黑名单</a>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { blackListApi } from '../../../../api'
    import companyNav from '../../../../components/broadside-navigation/companyAdmin'
    import projAdmin from '../../../../components/broadside-navigation/projAdmin'
    import haveBlackList from '../../../../components/blackList/haveBlackList'
    import noBlackList from '../../../../components/blackList/noBlackList'
    import noCompany from '../../../../components/company-home/noCompany'

    export default {
        data(){
            return{
                blackListStat: {},
                blackList: [],
                companyRole: '',
                companyId: '',
                hasDate: ''
            }
        },
        components: {
            companyNav, projAdmin, haveBlackList, noBlackList, noCompany
        },
        methods:{
            back(){
                blackListApi.blackListStat(this.companyId).then((result)=>{
                    console.log('企业管理员黑名单统计',result);
                    this.blackListStat = result.data;
                    this.hasDate = result.data.publicNum;
                })
                blackListApi.alarmAddNoDealWith(this.companyId, 1).then((result)=>{
                    console.log('黑名单警报',result);
                    this.blackList = result.data;
                })
            }
        },
        created(){
            this.companyRole = this.$store.state.roleInfo.companyRole;
            this.companyId = this.$store.state.roleInfo.companyId;
            blackListApi.blackListStat(this.companyId).then((result)=>{
                console.log('企业管理员黑名单统计',result);
                this.blackListStat = result.data;
                this.hasDate = result.data.publicNum;
            })
            blackListApi.alarmAddNoDealWith(this.companyId, 1).then((result)=>{
                console.log('黑名单警报',result);
                this.blackList = result.data;
            })
        }
    }
</script>

<style scoped>
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }

    .footer{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; background: #438CFF; position: fixed; left: 0; bottom: 0;
    }
    .footer a{
        width: 100%; height: 100%; display: inline-block; font-size: 0.8rem; color: #fff;
    }
</style>