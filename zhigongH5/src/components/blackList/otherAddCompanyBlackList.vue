<template>
    <div>
        <div class="main">
            <div class="box">
                <div class="left">人员姓名</div>
                <input class="right" id="selectPerson" v-model="name" type=text placeholder="姓名（必选项）"/>
            </div>
            <div class="box">
                <div class="left">人员身份证</div>
                <input class="right" type=text v-model="idNumber" placeholder="身份证（必选项)"/>
            </div>
            <div class="box">
                <div class="left">人员手机号码</div>
                <input class="right" type=text v-model="mobile" placeholder="请输入手机号码"/>
            </div>
            <div class="aside">
                <div class="left"><span class="f1">类型</span> <br/> <span class="f2">(可多选)</span></div>
                <ul class="right row">
                    <li class="col-33" v-for="item in typeList">
                        <label class="label-checkbox item-content">
                            <input type="checkbox" name="my-checkbox" :data-code="item.code">
                            <div class="item-media">
                                <i class="icon icon-form-checkbox"></i>
                            </div>
                            <div class="item-inner">
                                <div class="item-title">{{item.value}}</div>
                            </div>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
        <div class="line2"></div>
        <div class="boot">
            <div class="b-1">说明</div>
            <textarea class="b-2" draggable="false" v-model="remark" placeholder="请简要描述该人员的不良行为，有助于企业用工判断"></textarea>
        </div>
        <div class="footer" @click="addPersonAction">设为黑名单人员</div>
    </div>
</template>

<script>
    import { blackListApi } from '../../api'
    import { projectApi } from '../../api'
    export default {
        name: "otherAddCompanyBlackList",
        data(){
            return{
                typeList: [
                    {value: '恶意讨薪', code: '1'},{value: '打架闹事', code: '2'},{value: '盗窃', code: '3'},{value: '破坏损坏', code: '4'},{value: '在逃人员', code: '5'},{value: '其他', code: '6'}
                ],
                companyId:'',
                name: '',
                idNumber: '',
                mobile: '',
                type: [],
                remark: ''
            }
        },
        methods:{
            addPersonAction(){
                if(this.name==''){
                    this.$f7.alert('请输入姓名');
                    return;
                }
                var idNumber_res = /^\d{17}[0-9a-zA-Z]$/;
                if(!idNumber_res.test(this.idNumber)){
                    this.$f7.alert('身份证号码不正确，请从新输入');
                    return;
                }
                this.type = [];
                Dom7('input[name=my-checkbox]:checked').each((idx, elm)=>{
                    let id = Dom7(elm).data('code');
                    this.type.push(id);
                });
                if(this.type.length==0){
                    this.$f7.alert('请选择类型');
                    return;
                }
                blackListApi.otherAddBlackListMember(
                    this.companyId,
                    this.name,
                    this.idNumber,
                    this.type.join(','),
                    this.remark,
                    this.mobile
                ).then((result)=>{
                    console.log(result);
                    this.$f7.showPreloader('添加成功');
                    setTimeout(()=>{
                        this.$f7.hidePreloader();
                    },1000);
                    this.$router.back();
                })
            }
        },
        created(){
            this.companyId = this.$store.state.roleInfo.companyId;
            console.log(this.companyId);
        }
    }
</script>

<style scoped>
    .main{
        box-sizing: border-box; padding: 0 1.4rem 0 0.6rem;
    }
    .main .box{
        display: flex; width: 100%; height: 2rem; line-height: 2rem; margin-top: 0.5rem; position: relative;
    }
    .main .box .left{
        font-size: 0.7rem; color: #666; padding-right: 0.6rem;
    }
    .main .box .right{
        flex: 1; padding-left: 0.45rem; border-radius: 0.2rem; font-size: 0.7rem; color: #ccc;
    }
    .main .box img{
        width: 0.4rem; height: 0.75rem; position: absolute; right: 0.5rem; top: 0.5rem;
    }

    .main .aside{
        width: 100%; display: flex; margin: 1rem 0 1rem 0;
    }
    .main .aside .left{
        width: 4.5rem; text-align: center;
    }
    .main .aside .left .f1{
        font-size: 0.7rem; color: #666;
    }
    .main .aside .left .f2{
        font-size: 0.5rem; color: #ccc;
    }

    label.label-checkbox, label.label-radio{
        display: flex; margin-top: 0.25rem;
    }
    .form-checkbox i, label.label-checkbox i.icon-form-checkbox{
        width: 0.6rem; height: 0.6rem;
    }
    .item-title{
        font-size: 0.55rem; color: #888;
    }

    .line2{
        width: 100%; height: 0.25rem; background: #f4f4f4;
    }
    .boot{
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .boot .b-1{
        font-size: 0.7rem; color: #666; width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666;
    }
    .boot .b-2{
        width: 100%; height: 6rem; border: 1px solid #438CFF;
    }

    .footer{
        width: 46%; height: 2rem; background: #438CFF; font-size: 0.8rem; color: #fff; line-height: 2rem; text-align: center;
        margin: 1.3rem auto; border-radius: 0.25rem;
    }
</style>