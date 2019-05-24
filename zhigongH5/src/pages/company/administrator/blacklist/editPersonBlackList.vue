<template>
    <div data-page="editPersonBlackList" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">黑名单编辑</div>
            </div>
        </div>
        <div class="page-content">
            <div class="line"></div>
            <div class="head">
                <div class="h-1">仅支持修改类型及添加“说明”</div>
                <div class="h-2">
                    <div class="h3">人员姓名</div>
                    <div class="h4">{{personDetail.name?personDetail.name:personDetail.mobile}}</div>
                </div>
                <div class="h-2">
                    <div class="h3">人员身份证</div>
                    <div class="h4">{{personDetail.idNumber}}</div>
                </div>
            </div>
            <div class="line2"></div>
            <div class="main">
                <div class="m-1">
                    <div class="m2">手机号码</div>
                    <input class="m3" type="text" v-model="mobile"/>
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
                <textarea class="b-2" draggable="false" v-model="remark">&nbsp;&nbsp; </textarea>
            </div>
            <div class="footer" @click="editPersonAction">保存</div>
        </div>
    </div>
</template>

<script>
    import { blackListApi } from '../../../../api'
    export default {
        data(){
            return{
                typeList: [
                    {value: '恶意讨薪', code: '1'},{value: '打架闹事', code: '2'},{value: '盗窃', code: '3'},{value: '破坏损坏', code: '4'},{value: '在逃人员', code: '5'},{value: '其他', code: '6'}
                ],
                companyId: '',
                id: '',
                userId: '',
                mobile: '',
                type: [],
                remark: '',
                personDetail: ''
            }
        },
        methods:{
            editPersonAction(){

                this.type = [];
                Dom7('input[name=my-checkbox]:checked').each((idx, elm)=>{
                    let id = Dom7(elm).data('code');
                    this.type.push(id);
                });
                if(this.type.length == 0){
                    this.$f7.alert('请选择黑名单类型');
                    return;
                }
                blackListApi.editBlackListMember(
                    this.companyId,
                    this.id,
                    this.userId,
                    this.mobile,
                    this.type.join(','),
                    this.remark
                ).then((result)=>{
                    console.log(result);
                    this.$router.back();
                })
            }
        },
        created(){
            this.id = this.$route.params.id;
            console.log('黑名单id',this.id);
            this.companyId = this.$store.state.roleInfo.companyId;

        },
        mounted(){
            blackListApi.personDetail(this.id).then((result)=>{
                console.log('个人黑名单详情');
                console.log(result);
                this.personDetail = result.data;
                this.userId = result.data.userId;
                this.mobile = result.data.mobile;
                this.remark = result.data.blacklistRemark[0].remark;
                this.type = result.data.type.split(',');
                console.log(this.type);
                Dom7('input[name=my-checkbox]').each((idx, elm)=>{
                    let id = Dom7(elm).data('code');
                    for(var i=0; i<this.type.length; i++){
                        if(id == this.type[i]){
                            Dom7(elm).prop('checked', true);
                        }
                    }
                });
            })
        }
    }
</script>

<style scoped>
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .line{
        width: 100%; height: 0.5rem; background: #f4f4f4;
    }
    .head{
        margin-bottom: 0.85rem;
    }
    .head .h-1{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #999; border-bottom: 1px solid #E1E1E1;
    }
    .head .h-2{
        width: 100%; height: 2rem; display: flex; margin-top: 0.5rem; font-size: 0.7rem;
    }
    .head .h-1, .head .h-2{
        box-sizing: border-box; padding: 0 1.4rem 0 0.6rem;
    }
    .head .h3 {
        width: 4rem; height: 2rem; line-height: 2rem; color: #666;
    }
    .head .h4{
        flex: 1; height: 1.9rem; line-height: 1.9rem; border: 1px solid #E1E1E1;
        box-sizing: border-box; padding-left: 0.7rem; color: #888;
    }

    .main{
        box-sizing: border-box; padding: 0 1.4rem 0 0.6rem;
    }
    .main .m-1{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; margin-top: 0.85rem; font-size: 0.7rem;
    }
    .main .m2{
        width: 4rem; height: 2rem; line-height: 2rem; color: #666;
    }
    .main .m3{
        flex: 1; height: 1.9rem; line-height: 1.9rem; border: 1px solid #E1E1E1; box-sizing: border-box; padding-left: 0.7rem; color: #888;
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