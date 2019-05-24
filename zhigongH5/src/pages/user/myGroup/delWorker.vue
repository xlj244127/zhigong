<template>
    <div data-page="delWorker" class="page navbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">管理工人</div>
            </div>
        </div>
        <div class="page-content">
            <div class="aside">
                <div class="box">
                    <ul class="aul">
                        <li v-for="staff in staffList">
                            <div class="up">
                                <div class="a2"><img :src="staff.avatar"></div>
                                <div class="item-inner">
                                    <div class="item-title">
                                        <span class="a3-1">{{(staff.name?staff.name:staff.nickname)?(staff.name?staff.name:staff.nickname):staff.mobile}}</span>&nbsp;&nbsp;<span class="a3-3">{{staff.mobile}}</span>
                                        <br/>
                                        <span class="a3-2">{{staff.projectName}}</span>
                                        <span class="a3-3">{{staff.workGroupName}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="boot">
                                <div class="bo2" @click="delAction(staff)">
                                    <img class="oneImg" src="../../../../static/img/shangchu.png"/>
                                </div>
                                <div class="bo3" @click="changeType">
                                    <img class="twoImg" src="../../../../static/img/biangenggongzhong.png"/>
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
    import { groupApi } from '../../../api'
    let $$ = Dom7;
    export default {
        data() {
            return {
                groupName: '',
                staffList: []
            }
        },
        methods: {
            delAction(staff){
                let that = this;
                groupApi.delGroupMember(staff.id).then((result)=>{
                    console.log(result);

                    this.staffList = this.staffList.filter((res)=>{
                        return !(res.id == staff.id);
                    })
                    that.$store.state.groupMemberList = this.staffList;
                });
            },
            changeType(){
                this.$f7.alert('后续将开通此功能');
            }
        },
        mounted() {
            if(this.$store.state.summary_type2)
                this.groupName = this.$store.state.summary_type2.groupName;
            if(this.$store.state.groupMemberList)
                this.staffList = this.$store.state.groupMemberList;
            console.log('123',this.staffList);
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .aside .box{

    }
    .aside .aul li{
        margin-bottom: 0.25rem; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
    }
    .aside .aul li .up{
        width: 100%; height: 3.25rem; display: flex;
    }
    .aside .aul li .up .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .aside .box .aul li .up .a2 img {
        width: 2rem; height: 2rem; border-radius: 50%
    }

    .aside .aul li .up .item-inner{
        flex: 1; padding-left: 0.75rem; margin-top: 0.6rem;
    }
    .aside .aul li .up .item-inner .item-title{
        width: 100%;
    }

    .item-title .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .item-title .a3-2{
        font-size: 0.6rem; color: #999; max-width: 12rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; box-sizing: border-box;
    }
    .item-title .a3-3{
        font-size: 0.6rem; color: #438cff;
    }

    .boot{
        width: 100%; height: 2.75rem; line-height: 2.75rem; display: flex; justify-content: space-around;
    }
    .boot .bo2{

    }
    .boot .bo2 .oneImg{
        width: 3.5rem; height: 1.5rem; margin-top: 0.3rem;
    }
    .boot .bo3{

    }
    .boot .bo3 .twoImg{
        width: 4.2rem; height: 1.5rem; margin-top: 0.3rem;
    }
</style>