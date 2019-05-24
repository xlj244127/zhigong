<template>
    <div class="page navbar-fixed toolbar-fixed" data-page="projGroupsList"  @page:reinit="back">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" v-if="isShow2==2" @click="changeState">
                        <i class="icon icon-back"></i>
                    </a>
                    <a href="#" v-else class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding"><span v-show="isShow2==1">查看项目班组</span><span v-show="isShow2==2">选择工种</span></div>
                <!--<div class="right sliding" @click="delAction">-->
                    <!--<a>-->
                        <!--删除班组-->
                    <!--</a>-->
                <!--</div>-->
            </div>
        </div>
        <div class="page-content">
            <div v-show="isShow2==1">
                <div class="header">
                    <span class="h-1">项目班组</span> <span class="h-2">（非必填，可由项目管理员添加）</span>
                </div>
                <div class="main">
                    <ul class="list2 row">
                        <li class="col-30 tac">班组长</li>
                        <li class="col-50 tac">班组</li>
                        <li class="col-20 tac">班组工人</li>
                    </ul>
                    <div class="matter">
                        <div class="box" v-for="(item,adf) in grouperList" ><!---->
                            <div class="listItem">
                                <div class="left"  :class="{more3:item.types.length>3}">
                                    <div class="groupLeader" @click="viewLeader(item.user.id)"><!--viewLeader-->
                                        <div class="avatar"><img :src="item.user.avatar" alt=""></div>
                                        <div class="name">
                                            {{(item.user.name?item.user.name:item.user.nickname)?(item.user.name?item.user.name:item.user.nickname):item.user.mobile}}
                                        </div>
                                        <div class="tel">{{item.user.mobile}}</div>
                                    </div>
                                    <div class="addWorkType" @click="addWorkType(item)"><!--addWorkType-->
                                        <img  src="../../../../../static/img/addWorkType.png" />
                                    </div>
                                </div>
                                <div class="right accordion-item"  :class="{ml30p:item.types.length>3}"><!--:class="'accordion-item'+adf"-->
                                    <div class="cord">
                                        <div class="one" v-for="(trade,index) in item.types">
                                            <div class="r-1"><div class="fl">{{trade.name}}</div><div class="addWork" @click="addworker(item,index)"><img src="../../../../../static/img/addwork.png" alt=""></div></div>
                                            <div class="r-1 color-blue" @click="enterWorkerList(item,index)">{{trade.workerCount}}</div>
                                            <img class="img fr" src="../../../../../static/img/btn_right.png" @click="enterWorkerList(item,index)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="isShow2==2">
                <selectType :projectId="projectId" :userId="groupLeaderId" :status="1" :isBlack="true" :workerKind="workerKind"></selectType>
            </div>
        </div>
    </div>
</template>

<script>
    let $$ = Dom7
    import { projectApi, dviApi, tabulateStatisticsApi } from '../../../../api'
    import selectType from '../../../../components/selectWorkType/selectType'
    export default {
        data(){
            return{
                projectId: '',
                grouperList: [],
                workTypeList: [],
                checkedTypes: [],
                groupLeaderId: '',
                offList: [],
                isShow2: 1,
                workerKind: []
            }
        },
        components: {
            selectType
        },
        methods:{
            back(){
                console.log('back....');
                this.getData(this.projectId);
            },
            changeState(){
                this.isShow2 = 1;
            },
            // delAction(){
            //     this.$router.load({url: '/company/delGroups/'+this.projectId});
            // },
            enterWorkerList(item,index){
                console.log(item,index);
                let _workType = item.types[index].workType;
                this.$store.state.groupId = item.id;         //把班组id存在store中
                this.$store.state.grouperId = item.user.id;  //班组长id
                //console.log(this.$store.state.groupId);
                this.$router.load({url: '/company/groupsWorkerList/'+this.projectId+'/'+item.id+"/"+_workType});
            },
            viewLeader(id){
                this.$router.load({url: '/company/groupLeaderDetail/'+id});
            },
            addWorkType(item){
                console.log(item);
                this.groupLeaderId = item.user.id
                this.isShow2 = 2
            },
            getData(projectId){
                projectApi.projGroupsList(projectId).then((result)=>{
                    console.log('projGroupsList',result);
                    this.grouperList = result.data.reverse();
                    for(var i=0;i<this.grouperList.length;i++){
                        this.offList[i]=true
                    }
                }).catch((res)=>{
                    console.log(res);
                })
            },
            addworker(item,index){
                let addWorkType = item.types[index].workType
                console.log(item,index,addWorkType);
                this.$router.load({url: '/company/workerAdd/'+this.projectId+"/"+item.id+"/"+addWorkType});
            }
        },
        beforeMount(){
            this.projectId = this.$route.params.id;
            dviApi.getWorkTypes().then((result)=>{
                console.log('getWorkTypes',result);
                this.workTypeList = result.data.list.reverse();
            })
        },
        mounted(){
            this.getData(this.projectId)

            //项目添加班组长用到的列表数据
            tabulateStatisticsApi.allWorkTypes().then((result) => {
                this.workerKind = result.data;
                this.workerKind.map((res) => {
                    res.list.map((key) => {
                        key.size = '3'
                    })
                })
                console.log('值2', this.workerKind);
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
    .header .h-2{
        font-size: 0.6rem; color: #ccc;
    }
    .main{
        background: #fff;
    }
    .main .list2{
        display: block; border-bottom: 1px solid #f4f4f4; box-sizing:border-box; padding-left: 0.6rem;
        overflow: hidden;
        padding-right: 0.6rem;
    }
    .main .list2 li{
        height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #999;
        float: left;
    }

    .main .matter{

    }
    .main .matter .box{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem; border-bottom: 1px solid #f4f4f4; position: relative;
    }
    .main .matter .box .img{
        width: 0.9rem; height: 0.9rem;
        margin-top: 0.75rem;
    }
    .main .matter .box .left{
        width:30%; font-size: 0.7rem; color: #666; min-height: 2.5rem;
        line-height: 2.5rem;
        overflow: hidden;
        white-space: nowrap;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
    }
    .main .matter .box .left.more3{
        position: absolute;
        top:50%;
        transform: translate(0,-50%);
        left: 0;
    }
    .main .matter .box .right.ml30p{
        margin-left: 30%;
    }
    .main .matter .box .left .avatar{
        width: 40px;
        height: 40px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        border: 1px solid #ccc;
        margin: 15px auto 0;
    }
    .main .matter .box .left .name{
        text-align: center;
        font-size: 0.8rem;
        line-height: 28px;
        margin-top: 8px;
    }
    .main .matter .box .left .tel{
        font-size: 0.6rem;
        color: #999999;
        text-align: center;
        line-height: 18px;
    }
    .main .matter .box .left .avatar img{
        width: 40px;
        height: 40px;
        display: block;
    }
    .main .matter .box .right{
        position: relative; display: flex;
    }
    .main .matter .box .right{
        width: 70%; height: 100%; display: block;
        float: left;
    }
    .main .matter .box .right .one{
        display: flex; font-size: 0.7rem; color: #666;
        height: 2.5rem;
    }

    .main .matter .box .right .one .r-1{
        width: 9rem; height: 2.5rem; line-height: 2.5rem;
        text-align: center;
    }
    .main .matter .box .right .one .r-1 .fl{
        padding-left:10%;
        width: 50%;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        float: left;
    }
    .main .matter .box .right .one .r-1 .addWork{
        width: 40%;
        float: left;
        line-height: 2.5rem;
    }
    .main .matter .box .right .one .r-1 img{
        width: 100%;
        display: block;
        margin-top: 0.8rem;
    }
    .main .matter .box .right .one .r-1.color-blue{
        color: #007aff;
        width: 3.5rem;
    }

    .row .col-33{
        width: 33.33%;
    }
    .row .col-20{
        width: 20%;
    }
    .row .tac{
        text-align: center;
    }
    .listItem{
        width: 100%; display: flex;
        position: relative;
    }
    .addWorkType{
        display: block;
        width: 80%;
        margin: 5px auto 10px ;
    }
    .addWorkType img{
        width: 100%;
        display: block;
    }
</style>