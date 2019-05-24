<template>
    <div data-page="editGroupFree" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">编辑班组说明</div>
            </div>
        </div>
        <div class="page-content">
            <div class="aside">
                <div class="head">
                    <div class="left">班组所在地</div>
                    <div class="right" @click="emptyAction">x</div>
                </div>
                <textarea class="cent" type="text" v-model="remark" maxlength="20" placeholder="请输入班组说明"/></div>
            </div>
            <div class="footer">
                <div class="f-1" @click="completeAction">保存</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {wxApi} from '../api';
    export default {
        data(){
            return{
                workGroupId: '',
                remark: ''
            }
        },
        methods:{
            emptyAction(){
                this.remark = '';
            },
            completeAction(){
                wxApi.amendGroupRemark(this.workGroupId, this.remark).then((result)=>{
                    console.log(result.data);
                    this.$router.back();
                })
            }
        },
        mounted(){
            this.workGroupId = this.$store.state.workGroupId;
            console.log('班组长id',this.workGroupId);
            this.remark = this.$store.state.storeRemark;
            console.log(this.remark);
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .aside{
        background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .aside .head{
        width: 100%; display: flex; justify-content: space-between; padding: 0.56rem 0 0.4rem 0;
    }
    .aside .head .left{
        font-size: 0.7rem; color: #666;
    }
    .aside .head .right{
        width: 18px; height: 18px; text-align: center; line-height: 18px; font-size: 18px; color: #fff; background: #CCCCCC; border-radius: 50%;
    }

    .aside .cent{
        width: 100%; height: 5rem; border: 1px solid #438CFF; box-sizing: border-box; padding-left: 10px;
    }

    .footer{
        width: 100%; height: 2.5rem; background: #fff; position: fixed; left: 0; bottom: 0; z-index: 2;
    }
    .footer .f-1{
        margin: 0.5rem auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF;
    }
</style>