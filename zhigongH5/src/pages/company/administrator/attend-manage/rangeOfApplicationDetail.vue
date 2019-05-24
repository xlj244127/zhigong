<template>
    <div data-page="attendManage" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">适用范围详情</div>
            </div>
        </div>
        <div class="page-content">
            <div class="nav">
                <div class="box" @click="projAction"><span :class="{active: isShow==1}">项目部</span></div>
                <div class="box" @click="departAction"><span :class="{active: isShow==2}">按项目</span></div>
            </div>
            <div v-show="isShow==2" v-for="item in projMemberList">
                <div class="title">{{item.name}}</div>
                <div class="list-block accordion-list">
                    <ul class="aul">
                        <li class="accordion-item" v-for="one in item.list" v-if="one.isCheck==1">
                            <a href="#" class="item-content item-link">
                                <div class="item-inner">
                                    <div class="aside">{{one.name}}</div>
                                </div>
                            </a>
                            <div class="accordion-item-content" v-for="two in one.list" v-if="two.ischeck==1">
                                <div class="content-block">
                                    <div class="item-inner">
                                        <div class="item-title">
                                            <div class="tov">
                                                <div class="left"><img :src="two.avatar"/></div>
                                                <div class="right">
                                                    <span class="a3-1">{{two.user_name?two.user_name:two.mobile}}</span>
                                                    <br/>
                                                    <span class="a3-2">{{two.mobile}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-show="isShow==1">
                <div class="title">适用部门列表</div>
                <div class="list-block accordion-list">
                    <ul class="aul">
                        <li class="accordion-item" v-for="item in departMentList">
                            <a href="#" class="item-content item-link">
                                <div class="item-inner">
                                    <div class="tnt">{{item.name}}</div>
                                </div>
                            </a>
                            <div class="accordion-item-content" v-for="one in item.list" v-if="one.ischeck==1">
                                <div class="content-block">
                                    <div class="item-inner">
                                        <div class="item-title">
                                            <div class="tvt">
                                                <div class="a2"><img :src="one.avatar"/></div>
                                                <div class="a3">
                                                    <span class="a3-1">{{one.user_name?one.user_name:one.mobile}}</span>
                                                    <br/>
                                                    <span class="a3-2">{{one.mobile}}</span>&nbsp;  &nbsp;&nbsp;
                                                    <span class="a3-3">{{one.positions_name}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {dutyApi} from '../../../../api'
    export default {
        data(){
            return{
                isShow: 2,
                companyId: '',
                ruleId: '',
                departMentList: [],
                projMemberList: []
            }
        },
        methods:{
            departAction(){
                this.isShow = 2;
            },
            projAction(){
                this.isShow = 1;
            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            this.ruleId = this.$route.params.id;
            console.log(this.companyId, this.ruleId);
            dutyApi.accordDepartentGetRange(this.companyId, this.ruleId).then((result)=>{
                console.log('按部门2',result.data);
                result.data.map((res)=>{
                    if(res.isCheck==1){
                        console.log(res);
                        this.departMentList.push(res);
                    }
                })
                console.log('规则下范围列表',this.departMentList);
            })
            dutyApi.accordProjGetRange(this.ruleId, this.companyId, false).then((result)=>{
                console.log('按项目3',result.data);
                result.data.map((res)=>{
                    res.list.map((one)=>{
                        if(one.isCheck==1){
                            console.log(res);
                            this.projMemberList.push(res);
                        }
                    })
                })
                console.log('规则下范围列表2',this.projMemberList);

                var res =[];
                var json = [];
                for(var i=0; i<this.projMemberList.length; i++){
                    if(json.indexOf(this.projMemberList[i].id)==-1){
                        res.push(this.projMemberList[i]);
                        json.push(this.projMemberList[i].id);
                    }
                }
                this.projMemberList = res;

                console.log('规则下范围列表3',this.projMemberList);

            })
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .nav{
        width: 100%; height: 2rem; display: flex;
    }
    .nav .box{
        width: 50%; text-align: center; font-size: 0.8rem; color: #666; background: #fff;
    }
    .nav .box span{
        display: inline-block; height: 2rem; line-height: 2rem;
    }
    .nav .box span.active{
        border-bottom: 2px solid #438cff;
    }


    .title{
        width: 100%; height: 2rem; line-height: 2rem; box-sizing: border-box; padding-left: 0.6rem; font-size: 0.7rem; color: #999; background: #fff;
        margin-top: 10px;
    }
    .list-block .item-content{
        padding: 0; min-height: 35px;
    }
    .list-block .item-inner{
        display: flex; margin: 0; padding: 0; min-height: 35px;
    }
    .list-block .item-inner .tnt{
        height: 2rem; line-height: 2rem; padding-left: 0.6rem;
    }
    .list-block .item-inner .aside{
        width: 100%; box-sizing: border-box; padding-left: 12px;
    }

    .list-block .item-title{
        width: 100%;
    }
    .list-block .item-title .tov{
        height: 55px; padding-left: 1rem;  display: flex;
    }
    .list-block .item-title .tov .left{
        width: 2rem; height: 2rem; border-radius: 50%; border: 1px solid #438CFF; margin-top: 0.5rem;
    }
    .list-block .item-title .tov .left img{
        width: 2rem; height: 2rem; border-radius: 50%; display: inline-block;
    }
    .list-block .item-title .tov .right{
        padding: 0.7rem 0 0 0.8rem; flex: 1; overflow: hidden;
    }
    .list-block .item-title .tov .right .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .list-block .item-title .tov .right .a3-2{
        font-size: 0.6rem; color: #999;
    }

    .list-block .item-title .tvt{
        display: flex; height: 65px; margin-left: 12px;
    }
    .list-block .item-title .tvt .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .list-block .item-title .tvt .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .list-block .item-title .tvt .a3{
        padding: 0.7rem 0 0 0.8rem; flex: 1; overflow: hidden;
    }
    .list-block .item-title .tvt .a3 .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .list-block .item-title .tvt .a3 .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .list-block .item-title .tvt .a3 .a3-3{
        font-size: 0.6rem; color: #438CFF;
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
</style>