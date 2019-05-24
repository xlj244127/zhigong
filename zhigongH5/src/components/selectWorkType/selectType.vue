<template>
    <div>
        <div class="main">
            <div class="box" v-for="item in workerKind">
                <div class="up">{{item.name}}</div>
                <div class="down">
                    <div class="type2" v-for="(one, index) in item.list" @click="selectType(one.code, index)" :data-id="one.code" :data-size="one.size" :data-index="index" :class="{ref2: one.size!=3}">
                        <span>{{one.value}}</span>
                        <div class="size">
                            <img class="da" v-show="one.size==0" src="../../../static/img/dagong.png"/>
                            <img class="xiao" v-show="one.size==1" src="../../../static/img/xiaogong.png"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="f-1" @click="configAction">
                <span >保存</span>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7
    import { projectApi } from '../../api'
    export default {
        name: "selectType",
        data(){
            return{
                codeList: []
            }
        },
        props: ['projectId', 'userId', 'status','isBlack','workerKind'],
        methods: {
            selectType(param, index){
                $$('.type2').each((xls, xlm)=>{
                    if($$(xlm).data('id')==param){
                        $$(xlm).toggleClass('ref2')
                    }
                })
            },
            configAction(){
                this.codeList = [];
                $$('.ref2').each((xls, xlm)=>{
                    this.codeList.push($$(xlm).data('id'));
                })
                console.log('传值', this.projectId, this.userId, this.status, this.isBlack, this.codeList);
                if(this.status==0){
                    if(this.isBlack == true){
                        projectApi.addGroupLeader(this.projectId, this.userId, this.codeList.join(',')).then((result)=>{
                            console.log('我把人员设置成了班组长');
                            console.log(result);

                            blackListApi.addProjToBlackList(this.projectId, this.userId).then((result)=>{  //添加项目到黑名单
                                console.log('我把这个项目添加到了黑名单管理',result);
                                this.$router.back();
                            })
                        })
                    }else{
                        projectApi.addGroupLeader(this.projectId, this.userId, this.codeList.join(',')).then((result)=>{
                            console.log('我把人员设置成了班组长');
                            console.log(result.data);
                            this.$router.back();
                        })
                    }
                }
                if(this.status==1){
                    projectApi.addGroupLeader(this.projectId,this.userId,this.codeList.join(',')).then((res)=>{
                        console.log(res.data);
                        this.$router.back();
                    })
                }
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>
    .main{
        width: 100%; height: 100%;
    }
    .main .box .up{
        width: 100%; height: 2rem; line-height: 2rem; background: #F1F5F8; font-size: 0.65rem; color: #495368; box-sizing: border-box;
        padding-left: 0.6rem;
    }
    .main .box:last-child{
        margin-bottom: 2rem;
    }
    .main .box .down{
        background: #fff; display: flex; flex-wrap: wrap;
    }
    .main .box .down .type2{
        width: 33%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.65rem; color: #333; border-bottom: 1px solid #EEEEEE; border-right: 1px solid #EEEEEE;
        position: relative;
    }
    .main .box .down .type2 img{
        width: 0.6rem; height: 0.6rem; position: absolute; right: 2px; top: 2px;
    }
    .main .box .down .ref2{
        background: #438cff; color: #fff;
    }

    .footer{
        width: 100%; height: 2.5rem; background: #fff; position: fixed; left: 0; bottom: 0;
    }
    .footer .f-1{
        margin: 0 auto; width: 90%; height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 0.75rem; color: #fff; background: #438CFF; margin-top: 0.5rem;
    }
</style>