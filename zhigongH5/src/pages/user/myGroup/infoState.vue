<template>
    <div data-page="allBuildProj" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">信息状况</div>
            </div>
        </div>
        <div class="page-content">
            <div class="top">
                <div class="box">
                    <span>总人数</span>
                    <br/>
                    <span class="size">{{ groupMemberCount }}</span><span class="size2">人</span>
                </div>
                <div class="box">
                    <span>未实名认证</span>
                    <br/>
                    <span class="size3">{{ withoutIDCount }}</span><span class="size4">人</span>
                </div>
                <div class="box">
                    <span>未采集面部人像</span>
                    <br/>
                    <span class="size3">{{ withoutFaceCount }}</span><span class="size4">人</span>
                </div>
            </div>
            <div class="main">
                <div class="title">我的班组信息录入情况</div>
                <div class="nav">
                    <div class="n-1">姓名</div> <div class="n-2">认证身份</div> <div class="n-2">采集人像</div>
                </div>
                <ul class="aul">
                    <li v-for="item in staffList">
                        <div class="a2"><img :src="item.avatar"></div>
                        <div class="a3">
                            <div class="left">
                                <span class="a3-1">{{item.name}}</span> <br/> <span class="a3-2">{{ item.mobile }}</span>
                            </div>
                            <div class="center">
                                <span class="color-green" v-if="item.userDetail && item.userDetail.idNumber">已认证</span>
                                <span class="color-red" v-else>未认证</span>
                            </div>
                            <div class="right">
                                <span class="color-green" v-if="item.faced">已录入</span>
                                <span class="color-red" v-else>未录入</span>
                            </div>
                        </div>
                    </li>

                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                staffList:[],
                groupMemberCount: 0,
                withoutIDCount: 0,
                withoutFaceCount: 0
            }
        },
        mounted() {
            if(this.$store.state.summary_type2) {
                this.groupMemberCount = this.$store.state.summary_type2.groupMemberCount;
                this.withoutIDCount = this.$store.state.summary_type2.withoutIDCount;
                this.withoutFaceCount = this.$store.state.summary_type2.withoutFaceCount;
            }
            if(this.$store.state.groupMemberList)
                this.staffList = this.$store.state.groupMemberList;
        },
        methods:{

        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .top{
        width: 100%; height: 4.5rem; display: flex; justify-content: space-between; padding: 0.6rem; box-sizing: border-box;
        background: #fff; margin-top: 0.5rem;
    }
    .top .box{
        width: 4.9rem; height: 3.5rem; text-align: center; box-sizing: border-box; padding-top: 0.6rem;
        font-size: 0.7rem; color: #666;
    }
    .top .box .size{
        font-size: 1.25rem; color: #438cff;
    }
    .top .box .size2{
        color: #438cff; font-size: 0.7rem;
    }
    .top .box .size3{
        color: #ef7373; font-size: 1.25rem;
    }
    .top .box .size4{
        color: #ef7373; font-size: 0.7rem;
    }

    .main{
        width: 100%; background: #fff; margin-top: 0.5rem; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .title{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
    }
    .main .nav{
        display: flex; width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #999; border-bottom: 1px solid #f4f4f4;
    }
    .main .nav .n-1{
        width: 9.35rem;
    }
    .main .nav .n-2{
        flex: 1; text-align: center;
    }

    .main .aul li{
        width: 100%; height: 3.25rem; border-bottom: 1px solid #f4f4f4; display: flex;  border-bottom: 1px solid #f4f4f4;
    }
    .main .aul li .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .main .aul li .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .main .aul li .a3{
        flex: 1; padding: 0.8rem 0 0 1rem; display: flex; justify-content: space-between;
    }
    .main .aul li .a3 .left .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .main .aul li .a3 .left .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .main .aul li .center, .right{
        line-height: 1.7rem; font-size: 0.7rem; color: #666;
    }
    .main .aul li .right{
        transform: translateX(-1.1rem);
    }
</style>