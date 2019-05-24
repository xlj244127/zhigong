<template>
    <div data-page="applyRange" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">适用范围</div>
                <div class="right" @click="submitAction">提交</div>
            </div>
        </div>
        <div class="page-content">
            <div class="nav">
                <div class="box" @click="accordingAction"><span :class="{active: filter==1}">项目部</span></div>
                <div class="box" @click="allManAction"><span :class="{active: filter==2}">按项目</span></div>
            </div>

            <accordingProj @modelAction="modelAction" :status="this.status" v-show="filter==2"></accordingProj>
            <accordingDepartent @modelAction="modelAction" :status="this.status" v-show="filter==1"></accordingDepartent>
        </div>

        <div id="modalTwo" style="display: none">
            <img style="width: 2rem; height: 2rem" src="../../../../../static/img/shangchuangchenggong.png">
            <div style="font-size: 0.8rem; color: #438CFF; margin-top: 0.5rem">保存成功</div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { rightsApi } from '../../../../api';
    import accordingProj from '../../../../components/companyattend-manage/accordingProj';
    import accordingDepartent from '../../../../components/companyattend-manage/accordingDepartent';
    export default {
        data(){
            return{
                filter: 1,
                departmentAdmins: [],
                status: ''
            }
        },
        components:{
            accordingProj, accordingDepartent
        },
        methods:{
            filterAction(){
                this.$f7.popover('.popover-links', '.filter');
            },
            accordingAction(){
                this.$f7.closeModal('.popover-links');
                this.filter = 1;
                $$('.h3').text('按部门分类');
            },
            allManAction(){
                this.$f7.closeModal('.popover-links');
                this.filter = 2;
                $$('.h3').text('按项目分类');
            },
            submitAction(){
                this.$router.back();
            },
            modelAction(){
                console.log('吊起来了这个');
                this.$f7.modal({
                    text: $$('#modalTwo').html()
                });
                setTimeout(()=>{
                    this.$f7.closeModal();
                }, 1000);
            }
        },
        mounted(){
            this.status = this.$route.params.status;
            console.log('状态',this.status);
        }
    }
</script>

<style scoped>
    .navbar .right{
        color: #438cff;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .nav{
        width: 100%; height: 2rem; display: flex; margin-bottom: 5px;
    }
    .nav .box{
        width: 50%; text-align: center; font-size: 0.8rem; color: #666; background: #fff;
    }
    .nav .box span{
        display: inline-block; height: 2rem; line-height: 2rem;
    }
    .nav .box span.active{
        border-bottom: 2px solid #438cff;
    }

    .modal{
        width: 140px; left: 67%;
    }
</style>