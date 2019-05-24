s<template>
    <div data-page="delgroupsWorker" class="page navbar-fixed toolbar-fixed">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">删除项目工人</div>
                <div class="right sliding" @click="selectAction">
                    全选
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                <span class="h-1">班组成员列表</span>
            </div>
            <div class="main">
                <ul class="aul">
                    <li v-for="item in list">
                        <div class="a2"><img :src="item.avatar"/></div>
                        <label class="label-checkbox item-content">
                            <div class="a3">
                                <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span> <br/> <span class="a3-2">{{item.mobile}}</span> <span class="a3-3">{{item.workGroupName}}</span>
                            </div>
                            <input type="checkbox" name="put" :data-id="item.id">
                            <div class="item-media">
                                <i class="icon icon-form-checkbox"></i>
                            </div>
                        </label>
                    </li>
                </ul>
            </div>
            <div class="foot" @click="skipAction">
                删除
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { projectApi, groupApi } from '../../../../api';
    export default {
        data(){
            return{
                list: [],
                grouperDetail: '',  //班组长详情
                projectId: '',
                grouperId: '',  //班组长id
                groupId: '',    //班组id
                workIdList: []
            }
        },
        methods:{
            selectAction(){
                this.checked = !this.checked;
                if(this.checked) {
                    Dom7("input[name=put]").each(function() {
                        Dom7(this).prop("checked", false);
                    });
                }else{
                    Dom7("input[name=put]").each(function() {
                        Dom7(this).prop("checked", true);
                    });
                }
            },
            arrayHover(arr){   //数组去重
                var res = [];
                var json = {};
                for(var i = 0; i < arr.length; i++){
                    if(!json[arr[i]]){
                        res.push(arr[i]);
                        json[arr[i]] = 1;
                    }
                }
                return res;
            },
            skipAction(){
                //删除，添加从项目成员
                this.workIdList = [];
                let idsObj = {};
                Dom7('input[name=put]:checked').each((idx, elm)=>{
                    let id = Dom7(elm).data('id');
                    idsObj[id] = id;
                    this.workIdList.push(id);
                });
                this.workIdList = this.arrayHover(this.workIdList);
                console.log(this.workIdList);
                console.log(this.workIdList.join(','));

                this.$f7.confirm('是否确认将工人从项目中删除', '', ()=>{
                    projectApi.delProjUsers(this.projectId, this.workIdList.join(',')).then((result)=>{
                        console.log('删除项目工人');
                        console.log(result);
                        this.list = this.list.filter((item)=>{
                            return !idsObj[item.id];
                        })
                    })
                })
            }
        },
        mounted(){
            this.projectId = this.$route.params.project;
            this.grouperId = this.$route.params.grouperId;
            this.workType = this.$route.params.workType;
            this.groupId = this.$store.state.groupId;
            console.log('项目id',this.projectId,'班组长id',this.grouperId,'工种',this.workType,'班组id',this.groupId);

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
    .navbar .right{
        color: #438cff;
    }
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
        width: 100%; background: #fff; position: relative; margin-bottom: 1.5rem;
    }
    .main .aul li{
        width: 100%; height: 3.25rem; border-bottom: 1px solid #f4f4f4; box-sizing: border-box; padding-left: 0.6rem;
        position: relative; display: flex;
    }
    .main .aul li .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .main .aul li .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .main .aul li .a3{
        padding: 0 0 0 0.75rem;
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
    label.label-checkbox{
        flex: 1; padding: 0.8rem 1rem 0 0.75rem; display: flex; justify-content: space-between;
    }
    .form-checkbox i, label.label-checkbox i.icon-form-checkbox{
        width: 0.75rem; height: 0.75rem; top: 0.5rem;
    }

    .foot{
        width: 100%; height: 2.5rem; background: #ea5250; position: fixed; left: 0; bottom: 0; text-align: center;
        line-height: 2.5rem;  font-size: 0.8rem; color: #fff;
    }
</style>