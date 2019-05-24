<template>
    <div data-page="approve" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center sliding">审批管理</div>
            </div>
        </div>
        <!---侧边栏--->
        <proj-admin v-if="companyRole==2"></proj-admin>
        <company-admin v-else></company-admin>

        <no-company v-if="companyId==0 || companyRole==3"></no-company>
        <div v-else class="page-content infinite-scroll">
            <div class="nav">
                <div class="n" @click="oneBtn"><span :class="{active: pitchOn==1}">审批</span></div>
                <div class="n" @click="twoBtn"><span :class="{active: pitchOn==2}">审批记录</span></div>
            </div>
            <approvalManagement v-show="pitchOn==1" :auditList="auditList" :totalPages="totalPages" :typeName="typeName" :page="page"></approvalManagement>
            <historyApprovalRecord v-show="pitchOn==2" :historyAuditList="historyAuditList" :totalPages2="totalPages2" :typeName2="typeName2" :isAudit="isAudit" :auditType="auditType" :applyResult="applyResult" :typeTime="typeTime" :page="page"></historyApprovalRecord>
        </div>
    </div>
</template>

<script>
    import companyAdmin from '../../../../components/broadside-navigation/companyAdmin'
    import projAdmin from '../../../../components/broadside-navigation/projAdmin'
    import noCompany from '../../../../components/company-home/noCompany'
    import approvalManagement from '../../../../components/approvalManagement/approvalManagement'
    import historyApprovalRecord from '../../../../components/approvalManagement/historyApprovalRecord'
    import {dutyApi} from "../../../../api"
    import moment from 'moment'
    export default {
        data(){
            return{
                companyId:'',
                companyRole: '',
                pitchOn: 1,
                page: 1,
                pageSize: 3,
                auditType: '',
                totalPages: '',
                totalPages2: '',
                auditList: [],
                typeName: '所有',
                historyAuditList: [],
                typeName2: '申请类型',
                applyResult: '审批结果',
                typeTime: '审批时间',
                isAudit: '1,2',
                auditType: ''
            }
        },
        components: {
            companyAdmin, projAdmin, noCompany, approvalManagement, historyApprovalRecord
        },
        methods:{
            oneBtn(){
                this.pitchOn = 1;
                this.pageList();
            },
            twoBtn(){
                this.pitchOn = 2;
                this.approvalRecord();
            },
            pageList(){
                this.page = 1;
                dutyApi.auditList(this.companyId, this.page, this.pageSize, 0, this.auditType).then((result)=>{
                    console.log('未审批列表',result.data);
                    this.totalPages = result.data.totalPages;
                    this.auditList = result.data.list;
                    this.auditList.map((res)=>{
                        res.createTime = moment(res.createTime).format('YYYY-MM-DD, HH:mm');
                    })
                })
            },
            approvalRecord(){
                dutyApi.auditList(this.companyId, this.page, this.pageSize, '1,2').then((result)=>{
                    console.log('已审批列表',result.data);
                    this.totalPages2 = result.data.totalPages;
                    this.historyAuditList = result.data.list;
                    this.historyAuditList.map((res)=>{
                        res.createTime = moment(res.createTime).format('YYYY-MM-DD, HH:mm');
                        if(res.auditTime){
                            res.auditTime = moment(res.auditTime).format('YYYY-MM-DD, HH:mm');
                        }
                    })
                })
            }
        },
        mounted(){
            this.companyId=this.$store.state.roleInfo.companyId;
            this.companyRole = this.$store.state.roleInfo.companyRole;
            this.pageList();

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
    .nav{
        width: 100%; height: 2.5rem; line-height: 2.5rem; background: #fff; display: flex; justify-content: space-between;
    }
    .nav .n{
        width: 50%; text-align: center; font-size: 0.7rem; color: #666;
    }
    .nav .n span{
        display: inline-block; line-height: 2.5rem;
    }
    .nav .n span.active{
        border-bottom: 2px solid #438CFF;
    }
</style>