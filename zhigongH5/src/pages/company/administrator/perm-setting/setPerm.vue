<template>
    <div data-page="setPerm" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">权限设置</div>
            </div>
        </div>
        <div class="page-content">
            <div class="nav">人力资源部-总经理</div>
            <div class="bott">
                <div class="left">审批管理</div>
                <div class="item-input">
                    <label class="label-switch" @click="infoAction()">
                        <input v-if="oneCall==1" class="lect" type="checkbox" checked>
                        <input v-if="oneCall==0" class="lect" type="checkbox">
                        <div class="checkbox"></div>
                    </label>
                </div>
            </div>
            <div class="bott">
                <div class="left">考勤规则</div>
                <div class="item-input">
                    <label class="label-switch" @click="infoAction2()">
                        <input v-if="twoCall==1" class="lect" type="checkbox" checked>
                        <input v-if="twoCall==0" class="lect" type="checkbox">
                        <div class="checkbox"></div>
                    </label>
                </div>
            </div>
            <div class="bott">
                <div class="left">权限设置</div>
                <div class="item-input">
                    <label class="label-switch" @click="infoAction3()">
                        <input v-if="threeCall==1" class="lect" type="checkbox" checked>
                        <input v-if="threeCall==0" class="lect" type="checkbox">
                        <div class="checkbox"></div>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { rightsApi } from '../../../../api';
    export default {
        data(){
            return{
                oneCall: 0,
                twoCall: 0,
                threeCall: 0,
                oneDepartmentPerm: [],
                companyId: '',
                departmentId: '',
                positionsId: ''
            }
        },
        methods:{
            infoAction(){
                if(this.canCall==1){
                    this.canCall = 0;
                }
                if(this.canCall==1){
                    this.canCall = 1;
                }
                rightsApi.addPermissionList(this.companyId, this.departmentId, this.positionsId, 3).then((result)=>{
                    console.log(result.data);
                })
            },
            infoAction2(){
                if(this.twoCall==1){
                    this.twoCall = 0;
                }
                if(this.twoCall==1){
                    this.twoCall = 1;
                }
                rightsApi.addPermissionList(this.companyId, this.departmentId, this.positionsId, 2).then((result)=>{
                    console.log(result.data);
                })
            },
            infoAction3(){
                if(this.threeCall==1){
                    this.threeCall = 0;
                }
                if(this.threeCall==1){
                    this.threeCall = 1;
                }
                rightsApi.addPermissionList(this.companyId, this.departmentId, this.positionsId, 1).then((result)=>{
                    console.log(result.data);
                })
            }
        },
        mounted(){
            this.oneDepartmentPerm = this.$store.state.oneDepartmentPerm;
            this.departmentId = this.oneDepartmentPerm[0].departmentId;
            this.positionsId = this.oneDepartmentPerm[0].positionsId
            for(var i=0; i<this.oneDepartmentPerm.length; i++){
                if(this.oneDepartmentPerm[i].permissionsId==3){
                    this.oneCall = this.oneDepartmentPerm[i].isenble;
                }
                if(this.oneDepartmentPerm[i].permissionsId==2){
                    this.twoCall = this.oneDepartmentPerm[i].isenble;
                }
                if(this.oneDepartmentPerm[i].permissionsId==1){
                    this.threeCall = this.oneDepartmentPerm[i].isenble;
                }
            }
            console.log('对象',this.oneDepartmentPerm);
            console.log(this.oneCall,this.twoCall,this.threeCall);
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .nav{
        width: 100%; height: 2rem; line-height: 2rem; box-sizing: border-box; padding-left: 0.6rem; background: #fff;
        font-size: 0.7rem; color: #999; border-bottom: 1px solid #f4f4f4;
    }

    .bott{
        width: 100%; height: 2.5rem; background: #fff; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 28px 0 0.6rem;
        border-bottom: 1px solid #f4f4f4;
    }
    .bott .left{
        font-size: 0.7rem; color: #666; line-height: 2.5rem;
    }
    .bott .item-input{
        width: auto; margin-top: 16px; margin-left: 4px;
    }
    .label-switch{
        width: 36px; height: 18px;
    }
    .label-switch .checkbox{
        width: 36px; height: 18px;
    }
    .label-switch input[type=checkbox]:checked+.checkbox{
        background: #438CFF;
    }
    .label-switch .checkbox:before{
        width: 36px; height: 18px;
    }
    .label-switch .checkbox:after{
        width: 14px; height: 14px;
    }
</style>