<template>
    <div class="page">
        <!---侧边栏--->
        <group-nav></group-nav>
        <!--<staff-nav v-else></staff-nav>-->
        <div class="page-content">
            <div class="logo" style="background-image: url('./static/img/home_Imge.png');">
                <!-- If no data-panel attribute, Left panel will be opened by default -->
                <a href="#" class="open-panel"><img class="left" src="../../../static/img/baisechebianlan.png" /></a>
                <!-- Click on link with "open-panel" and data-panel="right" attribute will open Right panel -->
                <scan-icon></scan-icon>
            </div>

            <div v-if="companyRole==''">
                <grouperhave-attend :companyRole="companyRole"></grouperhave-attend>
            </div>
            <!--<div v-else-if="projectId > 0">-->
                <!--<workerhave-attend></workerhave-attend>-->
            <!--</div>-->
            <div class="loading" v-else>
                <i class="fa fa-spinner fa-pulse fa-5x fa-fw color-blue"></i>
            </div>
        </div>
    </div>
</template>

<script  type="text/ecmascript-6">
    var companyRole = '';
    import { userApi,dviApi } from '../../api'
    import { statisticalSummaryApi } from '../../api'
    import scanIcon from '../../components/scan-icon/scanIcon'
    import { LocalCache } from '../../lib/utils'
    import 'font-awesome/css/font-awesome.css'

    //侧边栏导入
    import groupNav from '../../components/broadside-navigation/group'
    import staffNav from '../../components/broadside-navigation/staff'
    //班组长主键
    import grouperhaveAttend from '../../components/group-home/grouperhaveAttend'
    //工人主键
    import workerhaveAttend from '../../components/worker-home/workerhaveAttend'

    export default {
        data(){
            return{
                companyRole: '',
                projectId: '',
                projectRole: 0,
                groupId: 0,
                enterIdCart:''
            }
        },
        components: {
            groupNav, staffNav, scanIcon, grouperhaveAttend, workerhaveAttend
        },
        methods:{
            switchToAdmin() {
                LocalCache.set('isAdmin', true);
                window.location.reload();
            }
        },
        created(){
            userApi.information().then((result)=>{
                console.log('角色信息',result.data);
                this.$store.state.roleInfo = result.data;
                this.projectId = this.$store.state.roleInfo.projectId;
                this.projectRole = this.$store.state.roleInfo.projectRole;
                this.groupId = this.$store.state.roleInfo.groupId;
                companyRole = this.$store.state.roleInfo.companyRole;
                console.log(companyRole);
            });
        },
        mounted(){
            dviApi.getWorkTypes().then((res)=>{
                console.log(res.data);
                LocalCache.set('workTypeList',res.data.list.reverse())
            }).catch((res)=>{
                console.log(res.data);
            })
        }
    }
</script>

<style scoped>
    /*主页面类容*/
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .logo{
        width: 100%; height: 11.8rem; background-size: 100% 100%; background-image: url('../../../static/img/home_Imge.png');
        position: relative;
    }
    .logo a img{
        width: 1.5rem; height: 1.5rem; position: absolute; top: 0.5rem;
    }
    .logo a .left{
        left:0.5rem;
    }
    #switchToAdmin {
        display: inline-block;
        margin-top: 0.5rem;
        width: 50%;
    }
    .loading {
        margin-top: 2rem;
        text-align: center;
    }
</style>
