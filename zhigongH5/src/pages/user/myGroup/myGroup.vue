<template>
    <div data-page="myGroup" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">我的班组</div>
                <div class="right">
                    <a href="#" @click="openPopover" class="openLink2">
                        <img class="r-img" src="../../../../static/img/shezhi-icon.png"/>
                    </a>
                </div>
            </div>
        </div>

        <div class="foot" @click="addGroupMember">添加工人</div>
        <!---侧边栏--->
        <group-nav></group-nav>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="header">
                <div class="top">
                    <span class="t-1">{{groupName}}</span>
                </div>
            </div>
            <div class="aside" v-if="hasStaff">
                <div class="top">
                    <div class="box">
                        <span>总人数</span>
                        <br/>
                        <span class="size">{{ groupMemberCount }}</span><span class="size2">人</span>
                    </div>
                    <div class="box">
                        <span>未录入身份证</span>
                        <br/>
                        <span class="size3">{{ withoutIDCount }}</span><span class="size4">人</span>
                    </div>
                    <div class="box">
                        <span>未录入人脸</span>
                        <br/>
                        <span class="size3">{{ withoutFaceCount }}</span><span class="size4">人</span>
                    </div>
                </div>
                <div class="main">
                    <div class="nav">
                        <div class="n-1">姓名</div> <div class="n-2">身份证</div> <div class="n-2">人脸</div>
                    </div>
                    <ul class="aul">
                        <li v-for="item in staffList">
                            <div class="a2"><img :src="item.avatar"></div>
                            <div class="a3">
                                <div class="left">
                                    <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                                    <br/>
                                    <span class="a3-2">{{ item.projectName }}</span>
                                    <br/>
                                    <span class="a3-2">{{ item.workGroupName }}</span>
                                </div>
                                <div class="center">
                                    <span class="a3-3" v-if="item.userDetail && item.userDetail.idNumber">已录</span>
                                    <span class="a3-4" v-else>未录</span>
                                </div>
                                <div class="right">
                                    <span class="a3-3" v-if="item.faced">已录</span>
                                    <span class="a3-4" v-else>未录</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="aside-empty" v-else>
                暂无成员
                <br/>
                请先添加班组成员
            </div>

            <!--右上角设置按钮-->
            <div class="popover popover-links">
                <div class="popover-angle"></div>
                <div class="popover-inner">
                    <div class="list-block">
                        <ul>
                            <li><a href="/user/delWorker/" class="list-button item-link close-popover">管理工人</a></li>
                            <li><a href="/user/addToProj/" class="list-button item-link close-popover">变更工人项目</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import groupNav from '../../../components/broadside-navigation/group'
    import { groupApi } from '../../../api'
    var userId;
    export default {
        data(){
            return{
                groupName: '',
                grouperDetail: {},
                staffList: [],
                hasStaff: false,
                groupMemberCount: 0,
                withoutIDCount: 0,
                withoutFaceCount: 0,
                companyRole: '',
                groupId: ''
            }
        },
        components: {
            groupNav
        },
        methods:{
            back(){
                this.groupId = this.$store.state.roleInfo.groupId;
                if(this.groupId!=0){
                    groupApi.groupMemberList(userId).then((result)=>{
                        console.log(result);
                        this.hasStaff = result.data.length;
                        this.staffList = result.data.filter((res)=>{
                            return !(res.id == userId);
                        })
                        this.$store.state.groupMemberList = this.staffList;
                    })
                }
            },
            addGroupMember(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    this.$router.load({url: '/company/phoneAdd/:id/'+4});
                }
            },
            openPopover(){
                if(this.companyRole==1 || this.companyRole==2){
                    this.$f7.alert('您当前为管理员身份，如需使用工人版招工劳务功能，请更换账号');
                }else{
                    this.$f7.popover('.popover-links', '.openLink2');
                }
            }
        },
        mounted() {
            this.companyRole = this.$store.state.roleInfo.companyRole;
            this.groupId = this.$store.state.roleInfo.groupId;
            userId = this.$store.state.userInfo.id;
            console.log(this.$store.state.summary_type2);
            if(this.$store.state.summary_type2){
                this.groupName = this.$store.state.summary_type2.groupName;
                this.groupMemberCount = this.$store.state.summary_type2.groupMemberCount;
                this.withoutIDCount = this.$store.state.summary_type2.withoutIDCount;
                this.withoutFaceCount = this.$store.state.summary_type2.withoutFaceCount;
            }
            let that = this;
            if(this.groupId!=0){
                groupApi.groupMemberList(userId).then((result)=>{
                    console.log('one',result);
                    this.hasStaff = result.data.length;
                    console.log('two',this.hasStaff);
                    this.staffList = result.data.filter((res)=>{
                        return !(res.id == userId);
                    })
                    console.log('three',this.staffList);
                    that.$store.state.groupMemberList = this.staffList;
                });
            }else{

            }
        }
    }
</script>

<style scoped>
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .right{
        box-sizing: border-box;
    }
    .navbar .right .r-img{
        width: 1.5rem; height: 1.5rem; padding-left: 1.5rem;
    }
    .popover {
        width: 10rem;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .header{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
    }
    .header .top{
        width: 100%; height: 2rem; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
    }
    .header .top .t-1{
        font-size: 0.7rem; color: #666;
    }

    .aside .top{
        width: 100%; height: 4.5rem; display: flex; justify-content: space-between; padding: 0.6rem; box-sizing: border-box;
        background: #fff;
    }
    .aside .top .box{
        width: 4.9rem; height: 3.5rem; text-align: center; box-sizing: border-box; padding-top: 0.6rem;
        font-size: 0.7rem; color: #666;
    }
    .aside .top .box .size{
        font-size: 1.25rem; color: #438cff;
    }
    .aside .top .box .size2{
        color: #438cff; font-size: 0.7rem;
    }
    .aside .top .box .size3{
        color: #ef7373; font-size: 1.25rem;
    }
    .aside .top .box .size4{
        color: #ef7373; font-size: 0.7rem;
    }

    .aside .main{
        width: 100%; background: #fff; margin-top: 0.5rem; box-sizing: border-box; padding: 0 0.6rem;
    }
    .aside .main .nav{
        display: flex; width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #999; border-bottom: 1px solid #f4f4f4;
    }
    .aside .main .nav .n-1{
        width: 9.35rem;
    }
    .aside .main .nav .n-2{
        flex: 1; text-align: center;
    }

    .aside .main .aul{
        margin-bottom: 5rem;
    }
    .aside .main .aul li{
        width: 100%; height: 4rem; border-bottom: 1px solid #f4f4f4; display: flex;  border-bottom: 1px solid #f4f4f4;
    }
    .aside .main .aul li .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .aside .main .aul li .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .aside .main .aul li .a3{
        flex: 1; padding: 0.8rem 0 0 1rem; display: flex;
    }
    .aside .main .aul li .a3 .left{
        width: 6.5rem; overflow: hidden;  text-overflow: ellipsis; white-space: nowrap;
    }
    .aside .main .aul li .a3 .left .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .aside .main .aul li .a3 .left .a3-2{
        font-size: 0.6rem; color: #999; max-width: 5rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .aside .main .aul li .a3 .center, .right{
        width: 3rem; line-height: 1.7rem; font-size: 0.7rem; color: #666; text-align: center; display: inline-block;
    }
    .aside .main .aul li .right{
        transform: translateX(1.2rem);
    }
    .aside .main .aul li .a3 .center .a3-3, .right .a3-3{
        color: #666;
    }
    .aside .main .aul li .a3 .center .a3-4, .right .a3-4{
        color: #ef7373;
    }

    .foot{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; background: #438CFF; font-size: 0.8rem; color: #fff;
        position: fixed; left: 0; bottom: 0; z-index: 100
    }

    .aside-empty{
        width: 100%; height: 100%; margin-top: 8rem; text-align: center; font-size: 0.8rem; color: #999;
    }
</style>