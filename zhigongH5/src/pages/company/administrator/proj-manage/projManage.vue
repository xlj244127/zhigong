<template>
    <div data-page="projManage" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">项目管理</div>
            </div>
        </div>
        <!---侧边栏--->
        <company-admin></company-admin>
        <!--页面主要类容-->
        <no-company v-if="companyId==0 || companyRole==3"></no-company>
        <div v-else class="page-content">
            <div class="head">
                <div class="h1">
                    <span class="h-1">项目总数</span>
                    <br/>
                    <span class="h-2">{{this.totalItems}}</span><span class="h-3">个</span>
                </div>
            </div>
            <div class="btt">
                <div class="build">
                    <div class="main">
                        <div class="m-1">
                            <div class="one">项目名称</div>
                            <div class="one">创建时间</div>
                        </div>
                        <div class="m-2">
                            <div class="two" v-for="(item, index) in list" v-if="index<7" @click="enteringAction(item)">
                                <a>
                                    <div class="let">{{item.name}}</div><div class="rit">{{new Date(item.startTime).getFullYear()}}-{{new Date(item.startTime).getMonth()+1}}-{{new Date(item.startTime).getDate()}}</div>
                                    <img src="../../../../../static/img/btn_right.png"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <a href="/company/allBuildProj/">
                        查看全部在建项目 >
                    </a>
                </div>
            </div>
            <div class="boot">
                <a href="/company/createProject/:id/:statu/">创建项目</a>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { projectApi } from '../../../../api'
    import companyAdmin from '../../../../components/broadside-navigation/companyAdmin'
    import noCompany from '../../../../components/company-home/noCompany'
    import moment from 'moment'
    export default {
        data(){
            return{
                list: [],
                companyId:'',
                companyRole: '',
                totalItems: ''
            }
        },
        components: {
            companyAdmin,noCompany
        },
        methods:{
            back(){
                console.log('back.....');
                if(this.companyId!=0){
                    projectApi.allProjectList().then((result)=>{
                        console.log('所有项目');
                        console.log(result);
                        this.list = result.data;
                    })
                }
            },
            enteringAction(item){
                this.$router.load({url: '/company/buildProjDetail/'+item.id});
            }
        },
        mounted(){
            console.log('roleInfo',this.$store.state.roleInfo);
            this.companyId=this.$store.state.roleInfo.companyId;
            this.companyRole=this.$store.state.roleInfo.companyRole;
            if(this.companyId!=0){
                projectApi.allProjectList(1, 10).then((result)=>{
                    console.log('所有项目');
                    console.log(result);
                    this.list = result.data;
                    this.totalItems = result.pagination.totalItems;
                })
            }
        }
    }
</script>

<style scoped>
    /*主页类容*/
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .right{
        font-size: 0.7rem;
    }
    .head{
        background: #fff; width: 100%; height: 4.5rem; overflow: hidden;
    }
    .head .h1{
        margin-top: 25px; text-align: center;
    }
    .head .h1 .h-1{
        font-size: 0.65rem; color: #666;
    }
    .head .h1 .h-2{
        font-size: 1.15rem; color: #438cff;
    }
    .head .h1 .h-3{
        font-size: 0.65rem; color: #438cff;
    }
    .btt{
        width: 100%; overflow: hidden;  margin-top: 0.5rem;
    }
    .build{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .build .p1{
        width: 100%; height: 2rem; font-size: 0.8rem; color: #666; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
        display: flex; justify-content: space-between;
    }
    .build .p1 .p{
        color: #438cff;
    }
    .build .main{
        width: 100%; font-size: 0.7rem; color: #aaa; border-bottom: 1px solid #f4f4f4;
    }

    .build .main .m-1{
        width: 100%; height: 1.45rem; line-height: 1.45rem; font-size: 0.7rem; color: #666; display: flex; border-bottom: 1px solid #f4f4f4;
    }
    .build .main .m-1 .one{
        flex: 1; text-align: left;
    }
    .build .main .m-2{
        min-height: 7.2rem;
    }
    .build .main .m-2 .two{
        width: 100%; height: 2.5rem; line-height: 2.5rem; position: relative; border-bottom: 1px solid #f4f4f4;
    }
    .build .main .m-2 .two a{
        display: flex; width: 100%; height: 100%; font-size: 0.7rem; color: #999;
    }
    .build .main .m-2 .two a .let, .rit{
        flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .build .main .m-2 .two img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.5rem; right: 0;
    }

    .btt .footer{
        width: 100%; height: 2.5rem; line-height: 2.5rem; text-align: center;
    }
    .btt .footer a{
        width: 100%; height: 100%; display: inline-block;
    }

    .boot{
        width: 100%; height: 2rem; line-height: 2rem; background: #438CFF; text-align: center;
        position: fixed; left: 0; bottom: 0;
    }
    .boot a{
        width: 100%; height: 100%; display: inline-block; font-size: 0.8rem; color: #ffffff;
    }
</style>