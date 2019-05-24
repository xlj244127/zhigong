<template>
    <div data-page="permSetting2" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">权限设置</div>
                <div class="right" v-if="companyId!=0">
                    <a href="/company/delCompanyManager/">删除</a>
                </div>
            </div>
        </div>
        <!---侧边栏--->
        <company-admin></company-admin>
        <!--页面主要类容-->
        <no-company v-if="companyId==0 || companyRole==3"></no-company>
        <div v-else class="page-content">
            <div class="header">
                企业管理员列表
            </div>
            <div class="main">
                <ul class="aul">
                    <!--<li v-for="item in companyManagerList" @click="enterDetail(item)">
                        <a href="/company/companyMannagerDetail/">
                            <div class="a2"><img :src="item.avatar" ></div>
                            <div class="a3">
                                <span class="a3-1">{{item.name?item.name:item.nickname}}</span> <br/> <span class="a3-2">{{item.mobile}}</span>
                            </div>
                            <img class="img" src="../../../../../static/img/btn_right.png" />
                        </a>
                    </li>
                        屏蔽掉查看详情
                    -->
                    <li v-for="item in companyManagerList">
                        <a href="/company/companyMannagerDetail/">
                            <div class="a2"><img :src="item.avatar" ></div>
                            <div class="a3">
                                <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span> <br/> <span class="a3-2">{{item.mobile}}</span>
                            </div>
                        </a>
                    </li>
                </ul>
                <div class="title">
                    说明:设置企业管理员可对本平台账号
                    <br/>
                    进行管理及运营
                </div>
            </div>
            <div class="footer">
                <a href="/company/addCompanyer/">
                    添加企业管理员
                </a>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { companyApi } from '../../../../api'
    import companyAdmin from '../../../../components/broadside-navigation/companyAdmin'
    import noCompany from '../../../../components/company-home/noCompany'
    export default {
        data(){
            return{
                companyManagerList: [],
                companyId:'',
                companyRole: ''
            }
        },
        components: {
            companyAdmin,noCompany
        },
        methods:{
            back(){
                console.log('返回页面是刷新了.....')
                if(this.companyId != 0){
                    companyApi.companyManagerList().then((result)=>{
                        console.log(result);
                        this.companyManagerList = result.data;
                    })
                }

            }
            // enterDetail(item){
            //     this.$router.load({url: '/company/companyMannagerDetail/'+item.id});
            // }
        },

        mounted(){
            this.companyId=this.$store.state.roleInfo.companyId;
            this.companyRole=this.$store.state.roleInfo.companyRole;
            if(this.companyId !=0 ){
                companyApi.companyManagerList().then((result)=>{
                    console.log("companyManagerList",result);
                    this.companyManagerList = result.data;
                });
            }


        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .right{
        font-size: 0.7rem;
    }

    .header{
        width: 100%; height: 2rem; line-height: 2rem; background: #fff; font-size: 0.7rem; color: #999; margin-top: 0.5rem;
        box-sizing: border-box; padding: 0 0.6rem;  border-bottom: 1px solid #f4f4f4;
    }
    .main{

    }
    .main .aul{
        background: #fff;  box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .aul li{
        width: 100%; height: 3.25rem; border-bottom: 1px solid #f4f4f4; position: relative;
    }
    .main .aul li a{
        width: 100%; height: 100%; display: block; display: flex;
    }
    .main .aul li a .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .main .aul li a .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .main .aul li a .a3{
        flex: 1; padding: 0.8rem 0 0 1rem;
    }
    .main .aul li a .a3 .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .main .aul li a .a3 .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .main .aul li a .img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 1.2rem;
    }
    .main .title{
        width: 100%; text-align: center; margin-top: 1rem; font-size: 0.6rem; color: #aaa;
    }
    .footer{
        width: 100%; height: 2.5rem; line-height: 2.5rem; background: #438cff; text-align: center;
        position: fixed; left: 0; bottom: 0;
    }
    .footer a{
        width: 100%; height: 100%; display: block; color: #fff; font-size: 0.8rem;
    }
</style>