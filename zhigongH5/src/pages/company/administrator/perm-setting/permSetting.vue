<template>
    <div data-page="permSetting" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">权限设置</div>
                <div class="right" v-if="!(companyId==0 || companyRole==3)">
                    <a href="#" v-show="isShow!=3" @click="enterAction">人员设置</a>
                </div>
            </div>
        </div>
        <!---侧边栏--->
        <company-admin></company-admin>
        <!--页面主要类容-->
        <no-company v-if="companyId==0 || companyRole==3"></no-company>
        <div v-else class="page-content infinite-scroll">
            <div class="nav">
                <div class="n-1" @click="selectOne" :class="{active: isShow==1}"><span>企业管理员</span></div>
                <div class="n-1" @click="selectTwo" :class="{active: isShow==2}"><span>项目管理员</span></div>
                <div class="n-1" @click="selectThree" :class="{active: isShow==3}"><span>权限设置</span></div>
            </div>

            <companyer v-show="isShow==1" :departmentAdmins="departmentAdmins" :firstLetterAdmins="firstLetterAdmins" :firstLetterList="firstLetterList"></companyer>
            <projer v-show="isShow==2" :dutyList="dutyList" :dutys="dutys"></projer>
            <setPerm v-show="isShow==3" :positions="positions"></setPerm>

        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var $$ = Dom7;
    import { companyApi, rightsApi } from '../../../../api'
    import companyAdmin from '../../../../components/broadside-navigation/companyAdmin'
    import noCompany from '../../../../components/company-home/noCompany'
    import companyer from '../../../../components/company-permSetting/companyer'
    import setPerm from '../../../../components/company-permSetting/setPerm'
    import projer from '../../../../components/company-permSetting/projer'
    export default {
        data(){
            return{
                companyId:'',
                companyRole: '',
                isShow: 1,
                page: '',
                pageSize: '',
                positions: [],
                page:1,
                departmentAdmins:[],
                firstLetterAdmins:[],
                firstLetterList:[],
                dutyList:[],
                dutys:[],
                pageSize:10,
                role: 1
            }
        },
        components: {
            companyAdmin, noCompany, companyer, projer, setPerm
        },
        methods:{
            back(){
                console.log('回调',this.isShow);
                this.getPositions();
                this.getDepartmentList();
                this.getProjer();
            },
            enterAction(){
                if(this.role == 1){
                    this.$router.load({url: '/company/peopleManagement/1'})
                }
                if(this.role == 2){
                    this.$router.load({url: '/company/peopleManagement/2'})
                }
            },
            getPositions(){
                rightsApi.getPermissionListPage(this.companyId, this.page, this.pageSize).then((result)=>{
                    console.log('权限设置展示列表',result.data.list);
                    this.positions = result.data.list;
                })
            },
            getProjer(){
                rightsApi.accordDutyProjer(this.page, this.pageSize, true).then((result)=>{
                    console.log('按职务划分项目管理员',result.data);
                    this.dutyList = result.data;
                })
                rightsApi.getPositionsNew(this.companyId, 1).then((result)=>{
                    console.log('公司职务列表', result.data);
                    this.dutys = result.data[0].list;
                    this.$store.state.dutys = this.dutys;
                })
            },
            getDepartmentList(){
                rightsApi.accordDepartmentGetCompanyer(this.page, this.pageSize, true).then((result)=>{
                    console.log('按部门展示企业',result.data);
                    this.departmentAdmins = result.data;
                })
                rightsApi.accordFirstLetterGetCompanyer().then((result)=>{
                    console.log('按字母展示企业',result.data);
                    this.firstLetterAdmins = result.data;
                    for(var i=0; i<this.firstLetterAdmins.length; i++){
                        if(this.firstLetterAdmins[i].name != ""){
                            this.firstLetterList.push(this.firstLetterAdmins[i].name);
                        }
                    }
                    console.log(this.firstLetterList);
                })
            },
            selectOne(){
                this.role = 1;
                this.isShow = 1;
            },
            selectTwo(){
                this.role = 2;
                this.isShow = 2;
            },
            selectThree(){
                this.isShow = 3;
            }
        },

        mounted(){
            this.companyId=this.$store.state.roleInfo.companyId;
            this.companyRole=this.$store.state.roleInfo.companyRole;
            console.log('公司id和角色信息', this.companyId, this.companyRole);
            this.getPositions();
            this.getDepartmentList();
            this.getProjer();
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
    .nav{
        width: 100%; height: 45px; background: #fff; display: flex; margin-bottom: 5px;
    }
    .nav .n-1{
        width: 33%; line-height: 45px; text-align: center; font-size: 0.7rem; color: #666;
    }
    .nav .n-1.active{
        border-bottom: 2px solid #438CFF; color: #438CFF;
    }

</style>