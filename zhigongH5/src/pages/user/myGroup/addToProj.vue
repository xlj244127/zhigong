<template>
    <div data-page="delWorker" class="page navbar-fixed toolbar-fixed">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">变更工人项目</div>
                <div class="right sliding" @click="ckAll">
                    全选
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="ipt" @click.stop.prevent="selectAction">
                <span v-if="this.projectName.length>20">{{this.projectName.substr(0,20)}}...</span>
                <span v-else>{{this.projectName}}</span>
                <img class="i-img" src="../../../../static/img/btn_drop_down.png"/>
                <input type="text" readonly id="picker-project">
            </div>
            <div class="title">说明: 可变更您班组内的工人至您所参与的项目,请先选择项目,再选择添加至该项目的班组工人</div>

            <div class="aside">
                <div class="box">
                    <ul class="aul">
                        <li v-for="item in staffList">
                            <div class="a2"><img :src="item.avatar"></div>
                            <label class="label-checkbox item-content">
                                <div class="item-inner">
                                    <div class="item-title">
                                        <span class="a3-1" v-if="item.name" v-else-if="item.nickname">{{item.name?item.name:item.nickname}}&nbsp; &nbsp;<i>{{item.mobile}}</i></span>
                                        <span class="a4-1" v-else>{{item.mobile}}</span>
                                        <br/>
                                        <span class="a3-2">{{item.projectName}}</span>&nbsp;&nbsp;&nbsp;<span class="a3-3">{{item.workGroupName}}</span>
                                    </div>
                                </div>
                                <input type="checkbox" name="put" :data-id="item.id"
                                       :checked="item.projectName?false:true">
                                <div class="item-media">
                                    <i class="icon icon-form-checkbox"></i>
                                </div>
                            </label>
                        </li>

                    </ul>
                </div>
            </div>
            <div class="footer" @click="addToProj">添加到项目</div>
        </div>
    </div>
</template>

<script>
    import {projectApi} from '../../../api'

    let $$ = Dom7;
    let pickerProjects;
    let groupId;
    let grouperId;
    let workIdList = [];
    export default {
        data() {
            return {
                projectId: '',
                groupName: '',
                staffList: [],
                projList: [],
                projectName: '请选择项目'
            }
        },
        methods: {
            ckAll() {
                $$("input[name=put]").prop('checked', !$$('input[name=put]').prop('checked'));
            },
            selectAction() {
                if (this.projList.length == 0)
                    this.$f7.alert('您还没有加入任何项目');
                else
                    pickerProjects.open();
            },

            addToProj() {
                workIdList = [];
                $$('input[name=put]:checked').each((idx, elm) => {
                    let id = Dom7(elm).data('id');
                    workIdList.push(id);
                })
                console.log(workIdList);
                console.log(this.projectId);
                if (this.projectId) {
                    projectApi.addRoleToList(this.projectId, 2, groupId).then((result)=>{
                        console.log('我添加班组长到项目')
                        console.log(result);
                    })
                    projectApi.addWorkerToprojGroup(this.projectId, 3, workIdList.join(','), groupId).then((result) => {   //选中工人添加到项目未选中移除
                        console.log('我添加工人到项目中');
                        console.log(result);
                    })
                    this.$f7.alert('添加成功');
                } else {
                    this.$f7.alert('请先选择项目');
                }

            },
            initPicker(projs) {
                if (projs.length == 0)
                    return;

                let that = this;
                this.projList = projs;
                pickerProjects = this.$f7.picker({
                    input: '#picker-project',
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onClose(p) {
                        let index = p.cols[0].activeIndex;
                        $$('#project').text(p.cols[0].displayValues[index]).data('id', p.cols[0].values[index])
                        that.projectId = p.cols[0].values[index];
                        console.log(that.projectId);
                        console.log(p.cols[0].displayValues[index]);
                        that.projectName = p.cols[0].displayValues[index];
                        projectApi.lookProjGroupMenber(that.projectId, groupId).then((result) => {  //查看项目班组成员接口
                            console.log('项目班组成员');
                            console.log(result);
                        })
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: projs.map((project) => {
                                return project.id;
                            }),
                            displayValues: projs.map((project) => {
                                return project.name;
                            }),
                        }
                    ]
                });
            }
        },
        mounted() {
            groupId = this.$store.state.roleInfo.groupId;
            grouperId = this.$store.state.userInfo.id; //班组长id
            if (this.$store.state.summary_type2)
                this.groupName = this.$store.state.summary_type2.groupName;
            if (this.$store.state.groupMemberList)
                this.staffList = this.$store.state.groupMemberList;

            //根据id获取所在项目
            if (!this.$store.state.projects) {
                projectApi.userProjs().then((result) => {
                    console.log('我获取了班组长所在的所有项目');
                    console.log(result);
                    this.$store.state.projects = result.data;
                    this.initPicker(result.data);
                });
            }
            else
                this.initPicker(this.$store.state.projects)
        }

    }
</script>

<style scoped>
    .navbar .right {
        color: #438cff;
    }

    .page-content {
        width: 100%;
        height: 100%;
        background: #f4f4f4;
    }

    .ipt {
        width: 100%;
        height: 2rem;
        line-height: 2rem;
        font-size: 0.7rem;
        color: #666;
        position: relative;
        box-sizing: border-box;
        padding: 0 0.6rem;
        background: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: 1px solid #f4f4f4;
    }

    .ipt #picker-project {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
    }

    .ipt .i-img {
        width: 0.6rem;
        height: 0.6rem;
        display: inline;
    }

    .title {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        box-sizing: border-box;
        padding-left: 0.6rem;
        background: #fff;
        font-size: 0.4rem;
        color: #aaa;
    }

    .aside .box .title {
        width: 100%;
        height: 2rem;
        line-height: 2rem;
        font-size: 0.7rem;
        color: #666;
        border-bottom: 1px solid #f4f4f4;
    }

    .aside .box {
        background: #fff;
        margin-top: 0.5rem;
        box-sizing: border-box;
        padding: 0 0.6rem;
    }

    .aside .aul li {
        width: 100%;
        height: 3.25rem;
        display: flex;
        border-bottom: 1px solid #f4f4f4;
    }

    .aside .aul li .a2 {
        width: 2rem;
        height: 2rem;
        border: 1px solid #000;
        border-radius: 50%;
        margin-top: 0.5rem;
    }

    .aside .aul li .a2 img {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
    }

    label.label-checkbox {
        flex: 1;
        padding: 0.8rem 0 0 0.75rem;
        display: flex;
        justify-content: space-between;
    }

    .form-checkbox i, label.label-checkbox i.icon-form-checkbox {
        width: 0.75rem;
        height: 0.75rem;
    }

    .item-title .a3-1 {
        font-size: 0.8rem;
        color: #438cff;
    }
    .item-title .a3-1 i{
        font-size: 0.55rem;
    }
    .item-title .a4-1{
        font-size: 0.55rem; color: #999;
    }

    .item-title .a3-2 {
        font-size: 0.6rem;
        color: #999;
        max-width: 9rem;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .item-title .a3-3 {
        font-size: 0.6rem;
        color: #438cff;
    }

    .form-checkbox i, label.label-checkbox i.icon-form-checkbox {
        top: 0.5rem;
    }

    .footer {
        width: 100%;
        height: 2.5rem;
        line-height: 2.5rem;
        background: #438cff;
        color: #fff;
        font-size: 0.8rem;
        text-align: center;
        position: fixed;
        right: 0;
        bottom: 0;
    }
</style>