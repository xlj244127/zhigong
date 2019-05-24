<template>
    <div>
        <div class='up'>
            <div class="left">企业管理员列表</div>
            <div class="filter" @click="filterAction"><span>筛选</span><img src="../../../static/img/xiala_.icom.png"/></div>
        </div>
        <div class="list-block accordion-list" v-show="filter==1">
            <ul class="aul">
                <li class="accordion-item" v-for="item in departmentAdmins">
                    <a href="#" class="item-content item-link">
                        <div class="item-inner">
                            <div class="tov">
                                <span>{{item.name}}</span> <img @click.stop.prevent="addPersonPage" src="../../../static/img/addPerson_icon.png"/>
                            </div>
                        </div>
                    </a>
                    <div class="accordion-item-content">
                        <div class="content-block">
                            <div class="top" v-for="one in item.list">
                                <div class="a2"><img :src="one.avatar"/></div>
                                <div class="a3">
                                    <div class="left">
                                        <span class="a3-1">{{(one.name?one.name:one.nickname)?(one.name?one.name:one.nickname):one.mobile}}</span>
                                        <br/>
                                        <span class="a3-2">{{one.mobile}}</span>
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

        <div class="box2" v-show="filter==2">
            <div class="xo" v-for="(item, index) in firstLetterAdmins">
                <div class="title" :ref="item.name">
                    {{item.name}}
                </div>
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
            <div class="order">
                <div class="o2" @click.stop.prevent="btnAction(index, item)" v-for="(item, index) in firstLetterList">
                    <a href="#F">{{item}}</a>
                </div>
            </div>
        </div>

        <div class="footer">
            <div><a href="/company/setDepartmentPosition/">设置部门职务</a></div>
            <div><a href="/company/addCompanyer/">添加企业管理员</a></div>
        </div>

        <!--筛选按钮-->
        <div class="popover popover-links">
            <div class="popover-angle"></div>
            <div class="popover-inner">
                <div class="list-block">
                    <ul>
                        <li @click="accordingAction"><a href="#" class="list-button item-link">按部门</a></li>
                        <li @click="allManAction"><a href="#" class="list-button item-link">所有人员</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { rightsApi } from '../../api';
    export default {
        name: "companyer",
        data(){
            return{
                filter: 1,
                companyId: '',
                listPosition: []
            }
        },
        props:["departmentAdmins","firstLetterList","firstLetterAdmins"],
        methods: {
            filterAction(){
                this.$f7.popover('.popover-links', '.filter');
            },
            accordingAction(){
                this.$f7.closeModal('.popover-links');
                this.filter = 1;
            },
            allManAction(){
                this.$f7.closeModal('.popover-links');
                this.filter = 2;
            },
            addPersonPage(){
                this.$router.load({url: '/company/addCompanyer/'})
            },
            btnAction(index, item){
                console.log('two',this.firstLetterList);
                console.log('three',this.firstLetterAdmins);
                console.log('four',this.$refs);

                this.firstLetterList.map((res)=>{
                    console.log(res);
                    let el = this.$refs[res][0];
                    var top = el.offsetTop;
                    this.listPosition.push(top);
                })
                console.log(this.listPosition);
                console.log(item, this.$refs[item][0], this.listPosition[index], $$('.page-content').height());
                $$('.page-content').scrollTop(this.listPosition[index],0);
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
        }
    }
</script>

<style scoped>
    .popover {
        width: 8rem; border-radius: 2px;
    }
    .up{
        width: 100%; height: 40px; line-height: 40px; box-sizing: border-box; padding: 0 0.6rem; display: flex; justify-content: space-between;
        background: #fff; border-bottom: 1px solid #f4f4f4;
    }
    .up .left{
        font-size: 0.7rem; color: #999999;
    }
    .up .filter{
        font-size: 0.6rem; color: #AAAAAA;
    }
    .up .filter img{
        width: 0.5rem; height: 0.5rem; display: inline;
    }

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

    .box2{
        margin-bottom: 2rem; position: relative;
    }
    .box2 .xo{
        background: #fff; margin-top: 0.5rem;
    }
    .box2 .xo .title{
        display: inline-block; width: 100%; height: 1.25rem; line-height: 1.25rem; box-sizing: border-box; padding-left: 1rem; font-size: 0.65rem; color: #999;
    }
    .box2 .xo .top .a3 .right{
        position: absolute; right: 2rem; top: 20px;
    }
    .box2 .order{
        width: 44px; text-align: center; position: fixed; right: 0; top: 22%; font-size: 0.5rem; color: #999;
    }
    .box2 .order .o2{
        height: 17px; line-height: 17px;
    }
    .box2 .order .o2 a{
        width: 100%; height: 100%; display: inline-block;
    }

    .footer{
        width: 100%; height: 40px; display: flex; background: -webkit-linear-gradient(left,#C0D4FF,#3885FE);
        position: fixed; left: 0; bottom: 0;
    }
    .footer div{
        width: 50%; text-align: center; line-height: 2rem;
    }
    .footer div a{
        width: 100%; height: 100%; font-size: 0.75rem; color: #fff;
    }
    .footer div:first-of-type{
        border-right: 1px solid #6498FF;
    }
</style>