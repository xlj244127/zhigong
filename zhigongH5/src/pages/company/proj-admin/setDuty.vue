<template>
    <div data-page="setDuty" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">设置职务</div>
            </div>
        </div>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="cent">
                <div class="c">
                    <div class="c-1">职务名称</div>
                    <div class="c-2" @click="addDuty"><img src="../../../../static/img/addduty.png"/><span>添加职务</span></div>
                </div>
                <div class="gy2" v-for="(item, index) in sum">
                    <img @click="deleteAction(index)" src="../../../../static/img/edit_icon.png"/>
                    <input type='text' class="ipt" name='put' placeholder="请填写职务名称（必填项）" />
                </div>
            </div>
            <div class="down" @click="upAction">保存</div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { rightsApi } from '../../../api';
    export default {
        data(){
            return{
                sum: 1,
                companyId: '',
                addParamaters: [],
                dutys: []
            }
        },
        methods:{
            addDuty(){
                this.sum++
            },
            deleteAction(index){
                $$('.gy2').each((xls ,elm)=>{
                    if(xls==index){
                        $$(elm).remove();
                    }
                })
            },
            upAction(){
                this.addParamaters = [];
                $$('input[name=put]').each((xls, elm)=>{
                    let obj = {};
                    if($$(elm).data('id')){
                        obj = {
                            id: $$(elm).data('id'),
                            name: $$(elm).val()
                        }
                    }else{
                        obj = {
                            id: 0,
                            name: $$(elm).val()
                        }
                    }
                    this.addParamaters.push(obj);
                })
                console.log(this.addParamaters);
                rightsApi.projerAddPositionsBatch(this.companyId, JSON.stringify(this.addParamaters)).then((result)=>{
                    console.log(result.data);
                    this.$router.back();
                })
            }
        },
        created(){
            this.companyId = this.$store.state.roleInfo.companyId;
            this.dutys = this.$store.state.dutys;
            if(this.dutys.length==0){

            }else{
                this.sum = this.dutys.length;
            }
            console.log(this.dutys, this.sum);
        },
        mounted(){
            console.log($$('.gy2').length);
            if(this.dutys.length!=0){
                $$('.gy2').each((xls,elm)=>{
                    console.log('下标',xls);
                    $$(elm).find('.gy2 .ipt').val(this.dutys[xls].positionsName);
                    $$(elm).find('.gy2 .ipt').data('id',this.dutys[xls].id);
                    console.log($$(elm).find('.gy2 .ipt').data('id'));
                })
            }
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
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
    .cent .gy2{
        width: 100%; padding-bottom: 14px; display: flex;
    }
    .cent .gy2 img{
        width: 12px; height: 12px; margin-top: 13px; margin-right: 0.5rem;
    }
    .cent .gy2 input{
        flex: 1; height: 35px; border: 1px solid #f4f4f4; padding-left: 0.6rem;
    }

    .down{
        width: 108px; height: 2rem; line-height: 2rem; border-radius: 6px; margin: 0 auto; background: #438CFF; text-align: center;
        margin-top: 3rem; font-size: 0.8rem; color: #fff;
    }
</style>