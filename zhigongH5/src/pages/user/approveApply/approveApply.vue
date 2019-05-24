<template>
    <div data-page="approveApply" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../static/img/cebianlan_icom.png" />
                    </a>
                </div>
                <div class="center">审批申请</div>
            </div>
        </div>
        <!---侧边栏--->
        <group-nav></group-nav>
        <!--页面主要类容-->
        <div class="page-content infinite-scroll">
            <div class="nav">
                <div class="n" @click="oneBtn"><span :class="{active: isShow==1}">补卡申请</span></div>
                <div class="n" @click="twoBtn"><span :class="{active: isShow==2}">历史申请记录</span></div>
            </div>
            <!--<div v-show="companyRole!=1">-->
                <reMarkCard v-show="isShow==1" @getIsShow="getIsShow"></reMarkCard>
                <historyApplyRecord v-show="isShow==2" :historyList="this.historyList" :totalPages="totalPages"></historyApplyRecord>
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { userApi, dviApi, dutyApi} from '../../../api'
    import { LocalCache } from '../../../lib/utils'
    import groupNav from '../../../components/broadside-navigation/group'
    import reMarkCard from '../../../components/approveApply/reMarkCard'
    import historyApplyRecord from '../../../components/approveApply/historyApplyRecord'
    import moment from 'moment'

    export default {
        data(){
            return{
                groupId: 0,
                isShow: 1,
                companyId: '',
                page: 1,
                pageSize: 3,
                historyList: [],
                totalPages: '',
                companyRole: ''
            }
        },
        components: {
            groupNav, reMarkCard, historyApplyRecord
        },
        methods:{
            oneBtn(){
                this.isShow = 1;
            },
            twoBtn(){
                this.isShow = 2;
            },
            getIsShow(param){
                this.isShow = 2;
                this.applyCard();
            },
            applyCard(){
                dutyApi.twoList(this.page, this.pageSize).then((result)=>{
                    console.log('补卡申请列表',result.data);
                    this.totalPages = result.data.totalPages;
                    this.historyList = result.data.list;
                    this.historyList.map((res)=>{
                        res.createTime = moment(res.createTime).format('YYYY-MM-DD, HH:mm');
                        if(res.auditTime){
                            res.auditTime = moment(res.auditTime).format('YYYY-MM-DD, HH:mm');
                        }
                    })
                })
            }
        },
        mounted(){
            this.companyRole = this.$store.state.roleInfo.companyRole;
            this.groupId = this.$store.state.roleInfo.groupId;
            console.log('---', this.groupId, this.companyRole);
            if(this.companyRole==1){
                this.$f7.alert('暂未开放企业管理员申请补卡功能');
            }else{
                this.applyCard();
            }
        }
    }
</script>

<style scoped>
    .navbar .left img{
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
        border-bottom: 2px solid #438CFF; color: #438cff;
    }
</style>