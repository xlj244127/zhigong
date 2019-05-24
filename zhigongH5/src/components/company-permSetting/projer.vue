<template>
    <div>
        <div class="list-block accordion-list">
            <ul class="aul">
                <li class="accordion-item" v-for="item in dutyList">
                    <a href="#" class="item-content item-link">
                        <div class="item-inner">
                            <div class="tov">
                                <span>{{item.name==""?"暂无职务":item.name}}</span> <img @click.stop.prevent="addPersonPage" src="../../../static/img/addPerson_icon.png"/>
                            </div>
                        </div>
                    </a>
                    <div class="accordion-item-content">
                        <div class="content-block">
                            <div class="top" v-for="two in item.list">
                                <div class="a2"><img :src="two.avatar"/></div>
                                <div class="a3">
                                    <div class="left">
                                        <span class="a3-1">{{(two.name?two.name:two.nickname)?(two.name?two.name:two.nickname):two.mobile}}</span>
                                        <br/>
                                        <span class="a3-2">{{two.mobile}}</span>
                                    </div>
                                    <div class="right">
                                        <img src="../../../static/img/btn_right.png"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="footer">
            <div><a href="/project/setDuty/">设置职务</a></div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { rightsApi } from '../../api';
    export default {
        name: "projer",
        data(){
            return{
                companyId: '',
            }
        },
        props:["dutyList","dutys"],
        methods: {
            addPersonPage(){
                this.$router.load({url: '/company/addPhone/'})
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            rightsApi.accordDutyProjer().then((res)=>{
                console.log('企业项目管理员列表',res.data);
            })
        }
    }
</script>

<style scoped>
    .list-block .item-content{
        padding: 0;
    }
    .list-block .item-inner{
        display: flex; margin: 0; padding: 0;

    }
    .list-block .item-inner div{
        height: 2.2rem; line-height: 2.2rem; padding-left: 0.6rem;
    }
    .list-block .item-inner .tov{

    }
    .list-block .item-inner .tov img{
        width: 55px; height: 0.8rem; display: inline; padding-left: 0.5rem; transform: translateY(2px);
    }
    .list-block{
        margin: 0; font-size: 0.7rem; color: #666;
    }
    .list-block ul{
        background: #f4f4f4;
    }
    .list-block li{
        margin-bottom: 5px; background: #fff;
    }
    .top{
        display: flex; width: 100%; height: 65px; border-top: 1px solid #f4f4f4;
    }
    .top .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem; margin-left: 14px;
    }
    .top .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .top .a3{
        padding: 0.7rem 0 0 0.8rem; flex: 1; overflow: hidden; position: relative;
    }
    .top .a3 .left .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .top .a3 .left .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .top .a3 .right{
        position: absolute; right: 17px; top: 20px;
    }
    .top .a3 .right img{
        width: 0.9rem; height: 0.9rem;
    }

    .footer{
        width: 100%; height: 40px; display: flex; background: #438cff;
        position: fixed; left: 0; bottom: 0;
    }
    .footer div{
        width: 100%; text-align: center; line-height: 2rem;
    }
    .footer div a{
        width: 100%; height: 100%; font-size: 0.75rem; color: #fff; display: inline-block;
    }

</style>