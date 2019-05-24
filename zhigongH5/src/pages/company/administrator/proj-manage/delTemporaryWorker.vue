<template>
    <div data-page="delManager" class="page navbar-fixed toolbar-fixed">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">删除临时工</div>
                <div class="right sliding" @click="ckAll">
                    全选
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                <span class="h-1">删除临时工</span> <span class="h-2">（可删除多名临时工）</span>
            </div>
            <div class="main">
                <ul class="aul">
                    <li v-for="item in temporaryWorkerList">
                        <div class="a2"><img :src="item.avatar"/></div>
                        <label class="label-checkbox item-content">
                            <div class="item-inner">
                                <div class="item-title">
                                    <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span> <br/> <span class="a3-2">{{item.mobile}}</span>
                                </div>
                            </div>
                            <input type="checkbox" name="put" :data-id="item.id">
                            <div class="item-media">
                                <i class="icon icon-form-checkbox"></i>
                            </div>
                        </label>
                    </li>

                </ul>
            </div>
            <div class="footer" @click="delAction">
                删除
            </div>
        </div>
    </div>
</template>

<script  type="text/ecmascript-6">
    import { projectApi } from '../../../../api'
    var projectId;
    var idList = [];
    export default {
        data() {
            return {
                checked: 'false',
                temporaryWorkerList: []
            }
        },
        methods: {
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
            delAction(){
                var that = this;
                if(projectId==':id'){
                    console.log('我点击了删除');
                    let idsObj = {};
                    Dom7('input[name=put]:checked').each((idx, elm)=>{
                        var id = Dom7(elm).data('id');
                        idsObj[id] = id;
                        idList.push(id);
                    });
                    this.$f7.confirm('是否确认删除该临时工?', '', function (){
                        that.temporaryWorkerList = that.temporaryWorkerList.filter((item)=>{
                            return !idsObj[item.id];
                        })
                        that.$store.state.temporaryWorkerList = that.temporaryWorkerList;
                    });
                }else{
                    console.log('我点击了删除');
                    this.$f7.confirm('是否确认删除该临时工?', '', function (){
                        let idsObj = {};
                        Dom7('input[name=put]:checked').each((idx, elm)=>{
                            var id = Dom7(elm).data('id');
                            idsObj[id] = id;
                            idList.push(id);
                        });
                        projectApi.delProjUsers(projectId, idList.join(',')).then((result)=>{
                            that.temporaryWorkerList = that.temporaryWorkerList.filter((item)=>{
                                return !idsObj[item.id];
                            })
                            that.$store.state.temporaryWorkerList = that.temporaryWorkerList;
                        })
                    });
                }
            }
        },
        mounted() {
            projectId = this.$route.params.id;
            if(projectId==':id'){
                this.temporaryWorkerList = this.$store.state.temporaryWorkerList;
            }else{
                projectApi.projTemporaryWorkerList(projectId).then((result)=>{
                    console.log(result);
                    this.temporaryWorkerList = result.data;
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
        width: 100%; background: #fff;
    }
    .main .aul li{
        width: 100%; height: 3.25rem; display: flex; border-bottom: 1px solid #ccc; box-sizing: border-box; padding-left: 0.6rem;
    }
    .main .aul li .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .main .aul li .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    label.label-checkbox{
        flex: 1; padding: 0.8rem 1rem 0 0.75rem; display: flex; justify-content: space-between;
    }
    .form-checkbox i, label.label-checkbox i.icon-form-checkbox{
        width: 0.75rem; height: 0.75rem;
    }
    .item-title .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .item-title .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .form-checkbox i, label.label-checkbox i.icon-form-checkbox{
        top: 0.5rem;
    }
    .footer{
        width: 100%; height: 2.5rem; background: #ea5250; position: fixed; left: 0; bottom: 0; text-align: center;
        line-height: 2.5rem;  font-size: 0.8rem; color: #fff;
    }
</style>