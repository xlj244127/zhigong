<template>
    <div data-page="projDayAttendDetail" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">项目日考勤详情</div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                <span class="h-1">{{this.projectName}}</span>
            </div>
            <div class="main">
                <div class="top">
                    <div class="cent2"></div>
                    <div class="cent3">
                        <span>{{this.date}}</span> &nbsp;
                        <span>{{this.xingqi}}</span>
                    </div>
                </div>
                <ul class="list row">
                    <li class="col-25">班组</li>
                    <li class="col-25">无考勤</li>
                    <li class="col-25">缺卡</li>
                    <li class="col-25">正常考勤</li>
                </ul>
                <div class="block" v-for="item in groupDayAttendList" @click="enterDetail(item)">
                    <a>
                        <ul class="list2 row">
                            <li class="col-25">{{item.groupName}}</li>
                            <li class="col-25">{{item.noAttend}}人</li>
                            <li class="col-25">{{item.lackAttend}}人</li>
                            <li class="col-25">{{item.attendNormal}}人</li>
                        </ul>
                        <img src="../../../../../static/img/btn_right.png"/>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { statisticalSummaryApi } from '../../../../api'
    var projectId;
    export default {
        data(){
            return{
                xingqi: '',
                date: '',
                projectName: '',
                groupDayAttendList: []
            }
        },
        methods:{
            enterDetail(item){
                this.$router.load({url: '/company/projAbnormalAttend/'+projectId+'/'+item.groupId})
                this.$store.state.groupName = item.groupName;
            }
        },
        mounted(){
            projectId = this.$route.params.id;
            this.projectName = this.$store.state.projectName;

            let year = new Date(new Date().getTime()).getFullYear();
            let month = new Date(new Date().getTime()).getMonth()+1;
            month = month>9?month:'0'+month;
            let day  = new Date(new Date().getTime()).getDate()>9?new Date(new Date().getTime()).getDate():'0'+new Date(new Date().getTime()).getDate();
            this.xingqi = "周" + "日一二三四五六".charAt(new Date().getDay());
            this.date = year + '-' + month + '-' + day;
            console.log(this.date);
            console.log('xingqi',this.xingqi);
            statisticalSummaryApi.groupDayAttend(projectId, this.date).then((result)=>{
                console.log('groupDayAttendList',result);
                this.groupDayAttendList = result.data;
            })
        }
    }
</script>

<style scoped>
.page-content{
    width: 100%; height: 100%; background: #f4f4f4;
}
.header{
    box-sizing: border-box; padding: 1rem 0 0.5rem 0.6rem;
}
.header .h-1{
    font-size: 0.7rem; color: #999;
}
.main{
    width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem;
}
.main .top{
    width: 100%; height: 2rem; color: #666; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
    display: flex; justify-content: space-between; font-size: 0.7rem;
}
.main .top .cent2{
    color: #999; font-size: 0.6rem; color: #999;
}
.main .top .cent3{
    color: #438cff;
}

.main .list, .main .block .list2{
    width: 100%; display: flex; font-size: 0.7rem; color: #aaa; border-bottom: 1px solid #f4f4f4;
    box-sizing: border-box; padding: 0 0.6rem;
}
.main .list li{
    height: 2rem; line-height: 2rem;
}
.main .block .list2 li{
    height: 2.5rem; line-height: 2.5rem;
}
.main .block{
    position: relative;
}
.main .block img{
    width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.8rem;
}
</style>