<template>
    <div data-page="infoEntering" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">信息录入</div>
            </div>
        </div>
        <!---侧边栏--->
        <company-admin></company-admin>
        <!--页面主要类容-->
        <no-company v-if="companyId==0 || companyRole==3"></no-company>
        <div v-else class="page-content infinite-scroll">
            <div class="line"></div>
            <div class="top">
                <div class="box">
                    <a>
                        <span>总人数</span>
                        <br/>
                        <span class="size">{{this.list.companyUsersCount}}</span><span class="size2">人</span>
                    </a>
                </div>
                <div class="box">
                    <a>
                        <span>未录入身份证</span>
                        <br/>
                        <span class="size colorRed">{{this.list.companyNoIDUsersCount}}</span><span class="size2 colorRed">人</span>
                    </a>
                </div>
                <div class="box">
                    <a>
                        <span>未录入人脸</span>
                        <br/>
                        <span class="size colorRed">{{this.list.companyNoFacedUsersCount}}</span><span class="size2 colorRed">个</span>
                    </a>
                </div>
            </div>
            <div class="line"></div>
            <div class="main">
                <div class="head">
                    <div>项目信息录入情况</div> <div class="h-1">{{this.list.projectCount}}个项目-{{this.list.companyUsersCount}}人</div>
                </div>
                <div class="nav row">
                    <div class="col-33">项目</div><div class="col-33">未录入身份证</div><div class="col-33">未录入人脸</div>
                </div>
                <ul class="aul">
                    <li v-for="item in list2" @click="enterAction(item)">
                        <a class="row">
                            <div class="col-33 tov">{{item.name}}</div><div class="col-33 one">{{item.noIDCount}}</div><div class="col-33 one">{{item.noFacedCount}}</div>
                            <img src="../../../../../static/img/btn_right.png" />
                        </a>
                    </li>
                </ul>
                <div class="foot">
                    <a href="/company/projInfoEnteringList/">查看全部项目信息录入 ></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { companyApi } from '../../../../api'
    import companyAdmin from '../../../../components/broadside-navigation/companyAdmin'
    import noCompany from '../../../../components/company-home/noCompany'
    export default {
        data(){
            return{
                list: {},
                list2: [],
                companyId:"",
                companyRole: '',
                page: 1,
                pageSize: 6,
                totalPages: ''
            }
        },
        components: {
            companyAdmin,noCompany
        },
        methods:{
            enterAction(item){
                this.$router.load({url: '/company/groupInfoEnteringList/'+item.id+'/'+item.name});
            }
        },
        mounted(){
            console.log(this.$store.state.roleInfo);
            this.companyId = this.$store.state.roleInfo.companyId;
            this.companyRole = this.$store.state.roleInfo.companyRole;
            if(this.companyId != 0){
                companyApi.companyInfoEnterSum().then((result)=>{
                    console.log('我获取了公司各人数总数');
                    console.log(result);
                    this.list = result.data;
                })
                companyApi.companyProjList(this.page, this.pageSize).then((result)=>{
                    console.log('我获取了公司项目列表');
                    console.log(result);
                    this.list2 = result.data;
                });
                console.log('roleInfo',this.$store.state);

                var loading = false;
                $$('.infinite-scroll').on('infinite', ()=>{
                    if(loading) return;
                    loading = true;

                    var that = this;
                    setTimeout(()=>{
                        that.page++;
                        console.log('我被点击了',that.page);
                        loading = false;

                        if (that.page <= that.totalPages) {
                            companyApi.companyProjList().then((result)=>{
                                console.log('我获取了公司项目列表');
                                console.log(result);
                                that.list2 = result.data;
                            });
                        }
                    }, 1000);
                })

            }
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #fff;
    }
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .top{
        width: 100%; height: 4.5rem; display: flex; justify-content: space-between; padding: 0.6rem; box-sizing: border-box;
        background: #fff; margin-top: 0.5rem;
    }
    .top .box{
        width: 5rem; height: 3.5rem; text-align: center; box-sizing: border-box; padding-top: 0.6rem;
    }
    .top .box a{
        width: 100%; height:100%; font-size: 0.65rem; color: #666;
    }
    .top .box .size{
        font-size: 1.15rem; color: #438cff;
    }
    .top .box .size2{
        color: #438cff; font-size: 0.7rem;
    }
    .top .box .colorRed{
        color: #ef7373;
    }
    .line{
        width: 100%; height: 0.5rem; background: #f4f4f4;
    }

    .main{
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .head{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; display: flex; justify-content: space-between;
        border-bottom: 1px solid #f4f4f4;
    }
    .main .head .h-1{
        color: #438cff;
    }
    .main .nav{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4;
    }
    .main .nav div{
        text-align: center; font-size: 0.7rem; color: #999;
    }
    .main .aul li{
        height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #f4f4f4; position: relative;
    }
    .main .aul li a{
        width: 100%; height: 100%; display: block; font-size: 0.7rem; color: #666; display: flex;
    }
    .main .aul li a .one{
        text-align: center;
    }
    .main .aul li a img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.8rem;
    }

    .main .foot{
        width: 100%; height: 2.5rem; line-height: 2.5rem; text-align: center; font-size: 0.7rem; color: #438cff;
    }
    .tov{
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>