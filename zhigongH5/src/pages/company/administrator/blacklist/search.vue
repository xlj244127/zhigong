<template>
    <div data-page="search" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center">搜索页面</div>
            </div>
        </div>
        <div class="page-content">
            <div class="ipt">
                <input name="put" placeholder="请输入姓名" v-model="name" type="text" autofocus="autofocus"/>
                <button class="sub" @click="confirmAction">搜索</button>
                <img src="../../../../../static/img/icon_search.png"/>
            </div>

            <div class="oneself">
                <div v-if="isShow == 1" class="other">未找到对应人员,请重新输入</div>
                <ul v-else class="aul">
                    <li v-for="item in blackList" @click="enterDetail(item)">
                        <div class="up">
                            <div class="a2"><img src="../../../../../static/img/avatar.png"/></div>
                            <div class="a3">
                                <div class="left">
                                    <span class="a3-1">{{item.name?item.name:item.mobile}}</span> <br/> <span class="a3-2">{{item.idNumber}}</span>
                                </div>
                                <div class="right">{{item.typeName}}</div>
                            </div>
                            <img class="img" src="../../../../../static/img/btn_right.png"/>
                        </div>

                        <div class="down row" v-if="companyRole==1">
                            <div class="col-50 left" @click="editAction(item)">
                                <img src="../../../../../static/img/bianji.png"/>
                                <span>编辑</span>
                            </div>
                            <div class="col-50 right" @click="removeAction(item)">
                                <img src="../../../../../static/img/jiesuo.png"/>
                                <span>解除黑名单</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { blackListApi } from '../../../../api'
    export default {
        data(){
            return{
                companyRole: '',
                companyId: '',
                blackList: [],
                name: '',
                isShow: ''
            }
        },
        methods:{
            confirmAction(){
                // this.name = encodeURI(this.name);
                blackListApi.searchByName(this.companyId, this.name).then((result)=>{
                    console.log('搜索结果', result);
                    this.blackList = result.data;
                    if(this.blackList.length == 0){
                        this.isShow = 1
                    }
                })
            },
            enterDetail(item){
                this.$router.load({url: '/company/personBlackListDetail/'+item.id})
            }
        },
        created(){
            this.companyId = this.$store.state.roleInfo.companyId;
            this.companyRole = this.$store.state.roleInfo.companyRole;
        },
        mounted(){
            Dom7('input[name=put]').trigger("click").focus();
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .ipt{
        width: 100%; height: 2.5rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem; display: flex;
        justify-content: space-between; position: relative; margin-top: 0.5rem;
    }
    .ipt input{
        flex: 1;  margin-left: 1.25rem; border: none;
    }
    .ipt .sub{
        width: 2.7rem; height: 1.5rem; line-height: 1.5rem; border-radius: 0.3rem; margin-top: 0.5rem; color: #fff; background: #438cff;
        border:  none;
    }
    .ipt img{
        width: 0.9rem; height: 0.9rem; position: absolute; left: 0.6rem; top: 0.8rem;
    }

    .aul li{
        margin-bottom: 0.25rem; background: #fff; margin-bottom: 0.25rem;
    }
    .aul li .up{
        width: 100%; height: 3.25rem; box-sizing: border-box; padding-left: 0.6rem; position: relative; display: flex;
    }
    .aul li .up .img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.6rem; top: 1.15rem;
    }
    .aul li .up .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .aul li .up .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .aul li .up .a3{
        width: 100%; padding: 0.8rem 0 0 0.75rem; display: flex; justify-content: space-between;
    }
    .aul li .up .a3 .left{
        flex: 1;
    }
    .aul li .up .a3 .left .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .aul li .up .a3 .left .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .aul li .up .a3 .right{
        width: 6.5rem; font-size: 0.6rem; color: #EF7373; padding-top: 0.25rem;
        transform: translateX(-1.3rem); height: 1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .aul li .down{
        width: 100%; height: 2.5rem; line-height: 2.5rem; box-sizing: border-box; display: flex;
    }
    .aul li .down .left, .right{
        text-align: center; font-size: 0.75rem; color: #438CFF;
    }
    .aul li .down .left img{
        width: 0.7rem; height: 0.7rem; display: inline;
    }
    .aul li .down .right img{
        width: 0.55rem; height: 0.7rem; display: inline;
    }

    .oneself{
        margin-top: 0.5rem;
    }
    .other{
        width: 100%; text-align: center; font-size: 0.7rem; color: #999; margin-top: 4.25rem;
    }
</style>