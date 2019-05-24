s<template>
    <div data-page="groupsWorker" class="page navbar-fixed toolbar-fixed" @page:reinit="back">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">查看项目工人</div>
                <div class="right sliding" @click="enterDelPage">
                    <a>
                        删除
                    </a>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                <span class="h-1">项目成员列表</span>
            </div>
            <div class="main">
                <ul class="aul">
                    <li v-for="(item, index) in list" @click="enterWorkerDetail(item)">
                        <div class="a2"><img :src="item.avatar"/></div>
                        <div class="a3">
                            <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span> <br/> <span class="a3-2">{{item.mobile}}</span> <span class="a3-3">{{item.workGroupName}}</span>
                        </div>
                        <div class="worker">
                            <div v-show="item.projectRole==3" @click.stop.prevent="changeWorkerLevel(item,index)">
                                <span>大工</span><img src="../../../../../static/img/btn_drop_down.png"/>
                            </div>
                            <div v-show="item.projectRole==4" @click.stop.prevent="changeWorkerLevel(item,index)">
                                <span>小工</span><img src="../../../../../static/img/btn_drop_down.png"/>
                            </div>
                            <input class="add" id="picker-device" type="hidden" :value="item.projectRole" readonly/>
                        </div>
                        <img class="oneImg" src="../../../../../static/img/btn_right.png"/>
                    </li>
                </ul>
            </div>
            <img @click="goTopAction" class="returnTop" src="../../../../../static/img/btn_return_top.png"/>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { projectApi } from '../../../../api'

    var projectId, grouperId, groupId, groupDeviceHave,
        workerLevel = [{projectRole:3,value:"大工"},{projectRole:4,value:"小工"}];

    export default {
        data(){
            return{
                list: [],
                page: '',
                pageSize: '',
                totalPages: '',
                totalItems: '',
                projectId:'',
                grouperId:'',
                groupId:'',
                workType:'',
            }
        },
        methods:{
            back(){
                projectApi.groupWorkers(this.projectId,this.groupId,this.workType).then((result)=>{
                    console.log('groupWorkers',result);
                    this.list = result.data;
                }).catch((result)=>{

                })
            },
            enterDelPage(){
                console.log(this)
                this.$router.load({url: '/company/delGroupsWorker/'+this.projectId+'/'+this.groupId+'/'+this.workType});
            },
            goTopAction(){
                $$('.page-content').scrollTop(0,0);
            },
            enterWorkerDetail(item){
                console.log(item);
                this.$store.state.workerId = item.id;         //把工人id存在store中
                this.$router.load({url: '/company/workerDetail/'+item.id+"/"+item.projectRole});
            },
            changeWorkerLevel(item,index){
                groupDeviceHave = this.$f7.picker({              //工人有工种的时候
                    input: '#picker-device',
                    formatValue(p, values, displayValues) {
                        return displayValues;
                    },
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="center">请选择大小工</div>'+
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onChange: () => {
                        $$('#btnOk').off('click').click(() => {
                            //this.levelId = groupDeviceHave.cols[0].value;
                            console.log(item,groupDeviceHave.cols[0].value);
                            let levelId;
                            this.list[index].projectRole = groupDeviceHave.cols[0].value;
                            if(groupDeviceHave.cols[0].value==3){
                                levelId = 1
                            }else{
                                levelId = 2
                            };
                            projectApi.changeWorkerLevel(this.projectId,item.id,levelId).then((res)=>{
                                console.log('changeWorkerLevel success',res);
                                this.$f7.alert('修改大小工成功！')
                            }).catch((res)=>{
                                console.log('changeWorkerLevel failed ',res);
                            })

                        })
                    },
                    cols: [
                        {
                            textAlign: 'left',
                            values: workerLevel.map((one) => {
                                return one.projectRole
                            }),
                            displayValues: workerLevel.map((one) => {
                                return one.value
                            })
                        }
                    ]
                });
                groupDeviceHave.open();   //项目管理员添加工人，工人已有工种
            },
            getData(){

            }
        },
        beforeMount(){
            this.projectId = this.$route.params.id;
            this.grouperId = this.$route.params.grouperId;
            this.workType = this.$route.params.workType;
            this.groupId = this.$store.state.groupId;
        },
        mounted(){
            projectApi.groupWorkers(this.projectId,this.groupId,this.workType).then((result)=>{
                console.log('groupWorkers',result);
                this.list = result.data;
            }).catch((result)=>{
                console.log('groupWorkers error',result);
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
        width: 100%; background: #fff;
    }
    .main .aul{
        position: relative;
    }
    .main .aul li{
        width: 100%; height: 3.25rem; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding-left: 0.6rem;
        position: relative; display: flex;
    }
    .main .aul li .oneImg{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.6rem; top: 1.15rem;
    }
    .main .aul li .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .main .aul li .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .main .aul li .a3{
        padding: 0 0 0 0.75rem; overflow: hidden; width: 5.4rem; margin-top: 0.8rem;
    }
    .main .aul li .a3 .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .main .aul li .a3 .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .main .aul li .a3 .a3-3{
        font-size: 0.6rem; color: #438cff;
    }
    .main .aul li .worker div{
        width: 58px; height: 0.8rem; line-height: 0.8rem; text-align: center; border: 1px solid #438CFF; font-size: 0.6rem; color: #438CFF;
        border-radius: 0.5rem; margin-top: 38px; margin-left: 10px;
    }
    .main .aul li .worker div img{
        width: 0.6rem; height: 0.6rem; display: inline-block; transform: translateY(2px);
    }

    .fixed{
        width: 100%; height: 20px; line-height: 20px; text-align: center; font-size: 0.5rem; color: #999999; position: fixed; left: 0; bottom: 0; background: #fff;
    }
    .returnTop{
        width: 1.5rem; height: 1.5rem; position: fixed; right: 20px; bottom: 20px;
    }
    .fl{
        float: left;
    }
    .fr{
        float: right;
    }
</style>