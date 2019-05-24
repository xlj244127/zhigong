<template>
    <div data-page="setDepartmentPosition" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">设置部门职务</div>
            </div>
        </div>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="up">深圳南方科技大学</div>
            <div class="list-block accordion-list">
                <ul class="aul">
                    <li class="accordion-item" v-for="item in departments">
                        <a href="#" class="item-content item-link">
                            <div class="item-inner">
                                <div class="tov">
                                    <span>{{item.name}}</span>
                                </div>
                                <div class="edit" @click.stop.prevent="editdepartment(item)"><img src="../../../../../static/img/bainji@2x.png"/></div>
                            </div>
                        </a>
                        <div class="accordion-item-content">
                            <div class="content-block" v-for="one in item.list">
                                {{one.positionsName}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="footer">
                <a href="/company/addDepartmentPosition/">新增部门职务</a>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { rightsApi } from '../../../../api';
    export default {
        data(){
            return{
                companyId: '',
                departments: []
            }
        },
        methods:{
            back(){
              this.getData()
            },
            editdepartment(item){
                console.log(item);
                this.$router.load({url: '/company/editDepartmentPosition/'});
                this.$store.state.departmentDetail = item;
            },
            getData(){
                rightsApi.getPositionsNew(this.companyId, 0).then((result)=>{
                    console.log('部门职务列表',result.data);
                    this.departments = result.data;
                })
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            this.getData()
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .up{
        width: 100%; height: 44px; line-height: 44px; font-size: 0.7rem; color: #6AA2FA; padding-left: 0.6rem;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap; background: #fff; margin-bottom: 6px;
    }

    .list-block{
        margin: 0;
    }
    .list-block ul{
        background: #f4f4f4;
    }
    .list-block li{
        margin-bottom: 10px;
    }
    .list-block .item-content{
        background: #F5F9FE; font-size: 0.7rem; color: #666; padding-left: 0;
    }
    .list-block .item-inner{
        display: flex; margin: 0; padding-left: 0.6rem;

    }
    .list-block .item-inner .tov{
        flex: 1;
    }
    .list-block .item-inner .edit{
        width: 70px; text-align: center;
    }
    .list-block .item-inner .edit img{
        width: 40px; height: 12px;
    }
    .content-block{
        width: 100%; height: 35px; line-height: 35px; border-top: 1px solid #f4f4f4; font-size: 0.7rem; color: #999; padding-left: 12px;
    }
    .accordion-item-content{
        background: #fff;
    }

    .footer{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.8rem; position: fixed; left: 0; bottom: 0; background: #438CFF;
    }
    .footer a{
        color: #fff;
    }
</style>