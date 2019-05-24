<template>
    <div data-page="delGroups" class="page navbar-fixed toolbar-fixed" @page:reinit="back">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">删除项目班组</div>
                <div class="right sliding" @click="ckAll">
                    全选
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                <span class="h-1">项目班组</span> <span class="h-2">（非必填，可由项目管理员添加）</span>
            </div>
            <div class="main">
                <div class="content-block">
                    <ul class="list2 row">
                        <li class="col-25">班组长</li>
                        <li class="col-40">班组</li>
                        <li class="col-35 three">班组工人</li>
                    </ul>

                    <div class="matter">
                        <div class="box" v-for="item in grouperList" :data-id="item.id">
                            <div class="left">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</div>
                            <div class="right">
                                <label v-if="projectId==':id'" class="label-checkbox item-content label2">
                                    <input type="checkbox" name="put">
                                    <div class="item-media">
                                        <i class="icon icon-form-checkbox two"></i>
                                    </div>
                                </label>
                                <div v-else>
                                    <div class="one" v-for="trade in item.types">
                                        <label class="label-checkbox item-content">
                                            <div class="r-1">{{trade.name}}</div>
                                            <div class="r-2">{{trade.workerCount}}</div>
                                            <input type="checkbox" name="put" :data-workType="trade.workType">
                                            <div class="item-media">
                                                <i class="icon icon-form-checkbox"></i>
                                            </div>
                                        </label>
                                    </div>

                                    <label v-if='item.types.length==0' class="label-checkbox item-content label2">
                                        <input type="checkbox" name="put">
                                        <div class="item-media">
                                            <i class="icon icon-form-checkbox two"></i>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bott" @click="delAction">
                删除
            </div>
        </div>
    </div>
</template>

<script>
    import { projectApi } from '../../../../api'
    var idList = [];
    export default {
        data(){
            return{
                projectId: '',
                checked: 'false',
                grouperList: [],
                groupId: '',
                workType: ''

            }
        },
        methods: {
            back(){
                if(this.projectId==':id'){
                    this.grouperList = this.$store.state.grouperList;
                }else{
                    projectApi.projGroupsList(this.projectId).then((result)=>{
                        console.log(result);
                        this.grouperList = result.data;
                        this.groupId = result.data.id;
                    })
                }
            },
            ckAll(){
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
            delAction() {
                console.log('我点击了删除');
                idList = [];
                var that = this;
                if (this.projectId == ':id') {
                    this.$f7.confirm('是否确认删除该工种?', '', function () {
                        var idsObj = {};
                        Dom7('input[name=put]:checked').each((idx, elm) => {
                            let ids = Dom7(elm).parents('.box').data('id');
                            idsObj[ids] = ids;
                        });
                        that.grouperList = that.grouperList.filter((item) => {
                            return !idsObj[item.id];
                        });
                        console.log(that.grouperList);
                        that.$store.state.grouperList = that.grouperList;
                        console.log(that.$store.state.grouperList);
                        that.back();
                    });
                }else{
                    this.$f7.confirm('是否确认删除该工种?', '', function () {
                        let type = [];
                        Dom7('input[name=put]:checked').each((idx, elm) => {
                            let ids = Dom7(elm).parents('.box').data('id');
                            let worktype = Dom7(elm).data('workType');
                            type.push({'workType': worktype});
                            if(Dom7(elm).parents('.box').data('id') && Dom7(elm).data('workType')){
                                var obj = {
                                    id: ids,
                                    types: type
                                }
                            }else{
                                var obj = {
                                    id: ids,
                                    types: []
                                }
                            }
                            idList.push(obj);
                        })
                        console.log(JSON.stringify(idList));
                        projectApi.delGroup(that.projectId, JSON.stringify(idList)).then((result)=>{
                            console.log(result);
                            that.back();
                        })
                    });
                }
            }
        },
        mounted(){
            this.projectId = this.$route.params.id;
            if(this.projectId==':id'){
                this.grouperList = this.$store.state.grouperList;
                console.log(this.grouperList)
            }else{
                projectApi.projGroupsList(this.projectId).then((result)=>{
                    console.log('项目班组列表');
                    console.log(result);
                    this.grouperList = result.data;
                    this.groupId = result.data.id;
                })
            }
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
    .header .h-2{
        font-size: 0.6rem; color: #ccc;
    }
    .main{
        background: #fff;
    }
    .list2{
        display: flex; border-bottom: 1px solid #f4f4f4; box-sizing:border-box; padding-left: 0.6rem;
    }
    .list2 li{
        height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #999;
    }
    .list2 .three{
        position: relative; left: -0.6rem;
    }

    .matter .box{
        width: 100%; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem; border-bottom: 1px solid #f4f4f4;
    }
    .matter .box .left{
        width: 5rem; transform: translateY(36%); font-size: 0.7rem; color: #666; min-height: 2.5rem;
    }
    .matter .box .right{
        flex: 1;
    }
    .matter .box .right .one{
        width: 100%; display: flex; font-size: 0.7rem; color: #666;
    }
    .matter .box .right .one .r-1, .r-2{
        width: 6.25rem; height: 2.5rem; line-height: 2.5rem;  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .matter .box .right .one .r-2{
        transform: translateX(0.6rem);
    }
    label.label-checkbox, label.label-radio{
        width: 100%; height: 2.5rem; display: flex;
    }

    .form-checkbox i, label.label-checkbox i.icon-form-checkbox{
        width: 0.75rem; height: 0.75rem; position: relative; top: 0.85rem; right: 0.6rem;
    }
    .two{
        transform: translateX(11.8rem);
    }

    .bott{
        width: 100%; height: 2.5rem; background: #ea5250; position: fixed; left: 0; bottom: 0; text-align: center;
        line-height: 2.5rem;  font-size: 0.8rem; color: #fff;
    }
</style>