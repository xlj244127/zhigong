<template>
    <div data-page="permSetting" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">权限设置</div>
                <div class="right" v-if="!(companyId==0 || companyRole==3)">
                    <a href="/company/peopleManagement/3">人员设置</a>
                </div>
            </div>
        </div>
        <!---侧边栏--->
        <proj-admin></proj-admin>
        <!--页面主要类容-->
        <no-company v-if="companyId==0 || companyRole==3"></no-company>
        <div v-else class="page-content infinite-scroll">
            <div class="oneBox" v-for="item in userList">
                <div class="a2"><img :src="item.avatar"/></div>
                <div class="a3">
                    <div class="left">
                        <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                        <br/>
                        <span class="a3-2">{{item.mobile}}</span>&nbsp;  &nbsp;&nbsp;
                        <span class="a3-3">{{item.userRights.positions_name}}</span>
                    </div>
                    <div class="right">
                        <img src="../../../../static/img/btn_right.png"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { companyApi, projectApi, rightsApi } from '../../../api'
    import noCompany from '../../../components/company-home/noCompany'
    import projAdmin from '../../../components/broadside-navigation/projAdmin'
    export default {
        data(){
            return{
                companyId:'',
                companyRole: '',
                isShow: 1,
                page: 1,
                pageSize: 10,
                userList: [],
                dutys: []
            }
        },
        components: {
            noCompany, projAdmin
        },
        methods:{
            back(){

            }
        },

        mounted(){
            this.companyId=this.$store.state.roleInfo.companyId;
            this.companyRole=this.$store.state.roleInfo.companyRole;
            console.log('公司id和角色信息', this.companyId, this.companyRole);

            projectApi.getUserProjectAdmins(this.companyId, this.page, this.pageSize, true).then((result)=>{
                console.log('项目管理员列表',result.data);
                this.userList = result.data;
            })
            rightsApi.getPositionsNew(this.companyId, 1).then((result)=>{
                console.log('公司职务列表', result.data);
                this.dutys = result.data[0].list;
                this.$store.state.dutys = this.dutys;
            })


        }
    }
</script>

<style scoped>
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .right{
        font-size: 0.7rem;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }

    .oneBox{
        display: flex; width: 100%; height: 65px; border-top: 1px solid #f4f4f4; background: #fff;
    }
    .oneBox .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem; margin-left: 14px;
    }
    .oneBox .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .oneBox .a3{
        padding: 0.7rem 0 0 0.8rem; flex: 1; overflow: hidden; position: relative;
    }
    .oneBox .a3 .left .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .oneBox .a3 .left .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .oneBox .a3 .left .a3-3{
        font-size: 0.6rem; color: #438CFF;
    }
    .oneBox .a3 .right{
        position: absolute; right: 17px; top: 20px;
    }
    .oneBox .a3 .right img{
        width: 0.9rem; height: 0.9rem;
    }

    .footer{
        width: 100%; height: 40px; display: flex; background: #438cff;
        position: fixed; left: 0; bottom: 0;
    }
    .footer div{
        width: 100%; text-align: center; line-height: 2rem;
    }
    .footer div a{
        width: 100%; height: 100%; font-size: 0.75rem; color: #fff; display: inline-block;
    }
</style>