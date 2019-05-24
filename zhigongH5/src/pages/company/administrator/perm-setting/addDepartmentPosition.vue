<template>
    <div data-page="addDepartmentPosition" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">新增部门职务</div>
            </div>
        </div>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="up">
                <div class="u"><span class="u-1">部门名称</span><span class="u-2">请填写部门名称（必填项）</span></div>
                <div class="gy"><input type='text' v-model="departmentName" /></div>
            </div>
            <div class="cent">
                <div class="c">
                    <div class="c-1">部门职务</div>
                    <div class="c-2" @click="addDuty"><img src="../../../../../static/img/addduty.png"/><span>添加职务</span></div>
                </div>
                <div class="gy" v-for="item in sum"><input type='text' name="put" placeholder="请填写职务名称（必填项）" /></div>
            </div>
            <div class="down" @click="upAction">保存</div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { rightsApi } from '../../../../api';
    export default {
        data(){
            return{
                sum: 1,
                companyId: '',
                departmentName: '',
                departmentId: '',
                addParamaters: []
            }
        },
        methods:{
            addDuty(){
                this.sum++
            },
            upAction(){
                let that = this
                this.addParamaters = [];
                $$('input[name=put]').each((xls, elm)=>{
                    if($$(elm).val() !== ''){
                        let obj = {
                            id: 0,
                            name: $$(elm).val()
                        }
                        this.addParamaters.push(obj);
                    }
                })
                console.log(this.addParamaters);
                rightsApi.addDepartment(this.companyId, this.departmentName).then((result)=>{
                    console.log('产生部门id',result.data);
                    this.departmentId = result.data.id;
                    rightsApi.addPositionsBatch(this.companyId, this.departmentId, JSON.stringify(this.addParamaters)).then((res)=>{
                        console.log('添加部门职务',res.data);
                        that.$router.back()
                    })
                })
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .up{
        background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .up .u{
        width: 100%; padding: 0.5rem 0 0.4rem 0;
    }
    .up .u .u-1{
        font-size: 0.7rem; color: #666;
    }
    .up .u .u-2{
        font-size: 0.5rem; color: #CCC;
    }
    .gy{
        padding-bottom: 14px;
    }
    .gy input{
        width: 100%; height: 35px; border: 1px solid #f4f4f4; padding-left: 0.6rem;
    }
    .cent{
        margin-top: 6px; box-sizing: border-box; padding: 0 0.6rem 2rem 0.6rem; background: #fff;
    }
    .cent .c{
        width: 100%; display: flex; justify-content: space-between; padding: 10px 0 12px 0;
    }
    .cent .c .c-1{
        font-size: 0.7rem; color: #666;
    }
    .cent .c .c-2{
        width: 65px; height: 20px; line-height: 1rem; background: #438CFF; font-size: 0.5rem; color: #fff; border-radius: 2px;
    }
    .cent .c .c-2 img{
        width: 0.6rem; height: 0.6rem; display: inline; transform: translateY(4px); padding-left: 4px;
    }

    .down{
        width: 108px; height: 2rem; line-height: 2rem; border-radius: 6px; margin: 0 auto; background: #438CFF; text-align: center;
        margin-top: 3rem; font-size: 0.8rem; color: #fff;
    }
</style>