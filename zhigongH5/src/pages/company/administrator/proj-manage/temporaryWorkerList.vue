<template>
    <div data-page="temporaryWorker" class="page navbar-fixed toolbar-fixed" @page:reinit="back">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">查看项目临时工</div>
                <div class="right sliding" @click="delAction">
                    <a>
                        删除
                    </a>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                <span class="h-1">设置项目临时人员</span> <span class="h-2">（可设置多名临时人员）</span>
            </div>
            <div class="main">
                <ul class="aul">
                    <!--<li v-for="item in temporaryWorkerList" @click="enterDeatil(item)">
                        <a>
                            <div class="a2"><img :src="item.avatar"/></div>
                            <div class="a3">
                                <div class="wid"><span class="a3-1">{{item.name? item.name:item.nickname}}</span> <br/> <span class="a3-2">{{item.mobile}}</span></div>
                                <div class="add" @click.stop.prevent="setTitle(item)">
                                    {{item.positionName?item.positionName:'设置职务'}}
                                </div>
                            </div>
                            <img class="img" src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                        屏蔽掉了查看详情
                    -->
                    <li v-for="item in temporaryWorkerList">
                        <a>
                            <div class="a2"><img :src="item.avatar"/></div>
                            <div class="a3">
                                <div class="wid"><span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span> <br/> <span class="a3-2">{{item.mobile}}</span></div>
                                <div class="add" @click.stop.prevent="setTitle(item)">
                                    {{item.positionName?item.positionName:'设置职务'}}
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { projectApi } from '../../../../api'
    import { tabulateStatisticsApi } from '../../../../api'
    var projectId;
    export default {
        data(){
            return{
                temporaryWorkerList: [],
                tempTitle: []
            }
        },
        methods:{
            back(){
                console.log('back....');
                //没有项目id就从缓存中获取数据，有项目id就从接口获取数据
                if(projectId==':id'){
                    this.temporaryWorkerList = this.$store.state.temporaryWorkerList;
                    console.log(this.temporaryWorkerList);
                }else{
                    projectApi.projTemporaryWorkerList(projectId).then((result)=>{
                        console.log(result);
                        this.temporaryWorkerList = result.data;
                    })
                }
            },
            delAction(){
                this.$router.load({url: '/company/delTemporaryWorker/'+projectId});
            },
            enterDeatil(item){
                this.$router.load({url: '/company/temporaryWorkerDetail/'+item.id});
            },
            setTitle(item){
                //修改临时工职务
                if(projectId==':id'){
                    this.$f7.confirm('是否确认修改临时工职务?', ()=>{
                        let buttons = [];
                        for (var i = 0; i < this.tempTitle.length; i++) {
                            let value = this.tempTitle[i];
                            let index = this.tempTitle.indexOf(this.tempTitle[i]);
                            console.log(index);
                            buttons.push({
                                text: value,
                                onClick: () => {
                                    item.position = index+1;
                                    item.positionName = value;
                                    this.$store.state.temporaryWorkerList = this.temporaryWorkerList
                                    console.log(this.$store.state.temporaryWorkerList);
                                }
                            })
                        }
                        let that = this;
                        that.$f7.modal({
                            title: '请选择临时工职务:',
                            verticalButtons: true,
                            buttons
                        })
                    })
                }else{
                    this.$f7.confirm('是否确认修改临时工职务?', ()=>{
                        let buttons = [];
                        for (var i = 0; i < this.tempTitle.length; i++) {
                            let value = this.tempTitle[i].value;
                            let index = this.tempTitle[i].code;
                            console.log(index);
                            buttons.push({
                                text: value,
                                onClick: () => {
                                    projectApi.changeTempType(projectId, item.id , index).then((result)=>{
                                        console.log(result);
                                        that.back();
                                    })
                                }
                            })
                        }
                        let that = this;
                        that.$f7.modal({
                            title: '请选择临时工职务:',
                            verticalButtons: true,
                            buttons
                        })
                    })
                }
            }
        },
        mounted(){
            projectId = this.$route.params.id;
            projectApi.projTemporaryWorkerList(projectId).then((result)=>{
                console.log(result);
                this.temporaryWorkerList = result.data;
            })

            if(this.$store.state.tempTitle){
                this.tempTitle = this.$store.state.tempTitle;
            }else{
                tabulateStatisticsApi.typeSort('Position').then((result)=>{
                    console.log('临时工职务',result);
                    this.tempTitle = result.data.list;
                    this.$store.state.tempTitle = this.tempTitle;
                })
            }
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
        width: 100%; background: #fff;
    }
    .main .aul li{
        width: 100%; height: 3.25rem; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding: 0 1.65rem 0 0.6rem; position: relative;
    }
    .main .aul li a{
        width: 100%; height: 100%; display: flex;
    }
    .main .aul li a .img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.5rem; top: 1.15rem;
    }
    .main .aul li .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .main .aul li .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .main .aul li .a3{
        flex: 1; display: flex; justify-content: space-between;
    }
    .main .aul li .a3 .wid{
        width: 7.5rem; padding: 0.8rem 0 0 0.75rem;
    }
    .main .aul li .a3 .add{
        width: 3rem; height: 3.25rem; line-height: 3.25rem; text-align: right; overflow: hidden; color: #438cff;
    }
    .main .aul li .a3 .wid .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .main .aul li .a3 .wid .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .foot{
        width: 100%; height: 2.5rem; background: #438cff; position: fixed; left: 0; bottom: 0; text-align: center;
        line-height: 2.5rem;
    }
    .foot a{
        width: 100%; height: 100%; display: block; font-size: 0.8rem; color: #fff;
    }
</style>