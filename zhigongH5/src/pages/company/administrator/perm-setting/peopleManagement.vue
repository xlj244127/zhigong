<template>
    <div data-page="peopleManagement" class="page navbar-fixed toolbar-fixed" >   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">人员管理</div>
                <div class="right sliding" @click="delAction">
                    删除
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="up">
                <div class="u-1">人员类别</div>
                <div class="u-2" @click.stop.prevent="setJobAction">
                    <div class="shan">
                        <img src="../../../../../static/img/setJobTitle.png"/><span>设置部门职务</span>
                    </div>
                    <div class="xia">
                        <input type="text" id="picker_position" readonly/>
                    </div>
                </div>
            </div>
            <div class="top" v-show="isShow==1">
                <div class="oneBox" v-for="item in userList">
                    <div class="a2"><img :src="item.avatar"/></div>
                    <div class="a3">
                        <div class="left">
                            <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                            <br/>
                            <span class="a3-2">{{item.mobile}}</span>&nbsp;  &nbsp;&nbsp;
                            <span class="a3-3">{{item.userRights.positions_name}}</span>
                        </div>
                        <div class="right">
                            <img src="../../../../../static/img/btn_right.png"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="top2" v-show="isShow==2" v-for="item in userList">
                <label class="label-checkbox item-content">
                    <div class="item-inner">
                        <div class="a2"><img :src="item.avatar"/></div>
                        <div class="a3">
                            <span class="a3-1">{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                            <br/>
                            <span class="a3-2">{{item.mobile}}</span>&nbsp;  &nbsp;&nbsp;
                            <span class="a3-3">{{item.userRights.positions_name}}</span>
                        </div>
                    </div>
                    <input type="checkbox" name="put" :data-id="item.id">
                    <div class="item-media">
                        <i class="icon icon-form-checkbox"></i>
                    </div>
                </label>
            </div>

            <div class="footer" v-show="delIsShow==1">
                <div class="left" @click="isAll">
                    <input name="ipt" type="checkbox"/>全选
                </div>
                <div class="right">
                    <div @click="cancelDelete">取消</div>
                    <div @click="comfigDelete">删除</div>
                </div>
            </div>
        </div>

        <div class="picker-modal picker-info">
            <div class="toolbar">
                <div class="toolbar-inner">
                    <div class="one">部门</div>
                    <div class="two">职务</div>
                    <div class="three" @click="cancelAction">取消</div>
                    <div class="right" @click="comfigAction"><a href="#" class="close-picker">确定</a></div>
                </div>
            </div>
            <div class="picker-modal-inner">
                <div class="content-block">
                    <div class="left">
                        <div class="f-1" v-for="(item, index) in departmentList" :data-id="item.id" @click="selectDepartment(item, index)" :class="{active: time==index}">{{item.name}}</div>
                    </div>
                    <div class="right">
                        <div class="git">
                            <div class="g-1" v-for="(item, index) in dutyList" @click="selectDuty(item, index)" :class="{active: num==index}" data-id="index">{{item.positionsName}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import { rightsApi, companyApi, projectApi} from '../../../../api';
    var idList = [], idMap = {}, pickPosition;
    export default {
        data(){
            return{
                num: 0,
                time: 0,
                isShow: 1,
                companyId: '',
                userList: [],
                page: 1,
                pageSize: 10,
                departmentList: [],
                dutyList: [],
                departmentId: '',
                dutyId: '',
                role: '',  //设置企业管理员(1),设置项目管理员(2)
                dutys: [],
                delIsShow: 0
            }
        },
        methods: {
            delAction(){                    //点击删除按钮
                this.isShow = 2;
                this.delIsShow = 1;
            },
            setJobAction(){                //设置部门职务
                console.log('我点击了', this.role);
                this.isShow = 2;
                this.delIsShow = 0;
                if(this.role==1){
                    this.$f7.pickerModal('.picker-info');
                }
                if(this.role!=1){
                    pickPosition.open();
                }
            },
            cancelAction(){                //取消设置
                this.$f7.closeModal('.picker-info');
                this.isShow = 1;
            },
            comfigAction(){               //确定设置部门职务
                idList = [];
                $$('input[name=put]:checked').each((idx, elm)=>{
                    let id = $$(elm).data('id');
                    idList.push(id);
                });
                console.log('我点击了2',idList, this.companyId, this.dutyId, this.departmentId);
                rightsApi.addProjectAdminPositionAndProjectBatch(this.companyId, this.dutyId, idList.join(','), this.departmentId).then((result)=>{
                    console.log(result.data);
                    this.isShow = 1;
                    companyApi.companyAdmins(this.page, this.pageSize, true).then((result)=>{      //刷新列表
                        console.log('企业管理员列表',result.data);
                        this.userList = result.data;
                    })
                })

            },
            selectDepartment(item, index){       //选择部门
                this.time = index;
                //用你选的部门调接口得到职务列表然后展示
                this.departmentId = item.id;
                this.dutyList = item.list;
                if(this.dutyList.length!=0){
                    this.dutyId = this.dutyList[0].id;
                }else{
                    this.dutyId = "";
                }
                console.log(this.departmentId,this.dutyId);
            },
            selectDuty(item, index){                     //选择职务
                this.num = index;
                this.dutyId = item.id;
                console.log(this.dutyId);
            },
            isAll(){                              //删除时是否全选
                this.checked = !this.checked;
                if(this.checked) {
                    $$("input[name=ipt]").prop("checked", false);
                    $$("input[name=put]").each(function() {
                        $$(this).prop("checked", false);
                    });
                }else{
                    $$("input[name=ipt]").prop("checked", true);
                    $$("input[name=put]").each(function() {
                        $$(this).prop("checked", true);
                    });
                }
            },
            cancelDelete(){                       //取消删除
                this.isShow = 1;
            },
            comfigDelete(){                       //确定删除
                idList = [];
                idMap = {};
                $$('input[name=put]:checked').each((idx, elm)=>{
                    let id = $$(elm).data('id');
                    idList.push(id);
                    idMap[id] = id;
                });
                console.log(idList);
                if(this.userList.length-idList.length==0){
                    this.$f7.alert('不能把企业管理员全部删除');
                }else{
                    this.$f7.confirm('是否确认删除该项目管理员?', '', ()=>{
                        companyApi.delCompanyManager(idList.join(',')).then(()=>{
                            console.log('删除了企业管理员');
                            this.userList = this.userList.filter((item)=>{
                                return !idMap[item.id];
                            })
                        })
                    })
                }
            }
        },
        mounted(){
            this.role = this.$route.params.status;
            console.log(this.role);
            this.companyId = this.$store.state.roleInfo.companyId;
            if(this.role==1){
                companyApi.companyAdmins(this.page, this.pageSize, true).then((result)=>{
                    console.log('企业管理员列表',result.data);
                    this.userList = result.data;
                })
                rightsApi.getPositionsNew(this.companyId, 0).then((result)=>{
                    console.log('部门列表',result.data);
                    this.departmentList = result.data;
                    this.departmentId = this.departmentList[0].id;
                    if(this.departmentList[0].list.length!=0){
                        this.dutyId = this.departmentList[0].list.id;
                    }
                    console.log(this.departmentId,this.dutyId);
                })
            }
            if(this.role==2){
                projectApi.getProjectAdminsNew(this.companyId, this.page, this.pageSize, true, '').then((result)=>{
                    console.log('项目管理员列表',result.data);
                    this.userList = result.data;
                })
                if(this.$store.state.dutys){
                    this.dutys = this.$store.state.dutys;
                    this.departmentId = this.$store.state.dutys[0].department.id;
                    console.log('职务列表', this.dutys, this.departmentId);

                    var that = this;
                    pickPosition = this.$f7.picker({
                        input: '#picker_position',
                        toolbarTemplate:
                        '<div class="toolbar">' +
                        '<div class="toolbar-inner">' +
                        '<div class="left">' +
                        '<a href="#" class="link close-picker">取消</a>' +
                        '</div>' +
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                        '</div>' +
                        '</div>',
                        onOpen(p){
                            p.container.find('#btnOk').click(()=>{
                                that.dutyId = p.cols[0].value;
                                idList = [];
                                $$('input[name=put]:checked').each((idx, elm)=>{
                                    let id = $$(elm).data('id');
                                    idList.push(id);
                                });
                                console.log('我点击了5',idList, that.companyId, that.dutyId, that.departmentId);
                                    rightsApi.addProjectAdminPositionAndProjectBatch(that.companyId, that.dutyId, idList.join(','), that.departmentId).then((result)=>{
                                        console.log(result.data);
                                        that.isShow = 1;
                                        projectApi.getProjectAdminsNew(that.companyId, that.page, that.pageSize, true, '').then((res)=>{
                                            console.log('项目管理员列表',res.data);
                                            that.userList = res.data;
                                        })
                                    })
                            })
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values: that.dutys.map((one)=>{return one.id;}),
                                displayValues: that.dutys.map((one)=>{return one.positionsName;})
                            }
                        ]
                    });
                }
            }
            if(this.role==3){
                projectApi.getUserProjectAdmins(this.companyId, this.page, this.pageSize, true).then((result)=>{
                    console.log('项目管理员列表2',result.data);
                    this.userList = result.data;
                })

                if(this.$store.state.dutys){
                    this.dutys = this.$store.state.dutys;
                    this.departmentId = this.$store.state.dutys[0].department.id;
                    console.log('职务列表2', this.dutys, this.departmentId);

                    var that = this;
                    pickPosition = this.$f7.picker({
                        input: '#picker_position',
                        toolbarTemplate:
                        '<div class="toolbar">' +
                        '<div class="toolbar-inner">' +
                        '<div class="left">' +
                        '<a href="#" class="link close-picker">取消</a>' +
                        '</div>' +
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                        '</div>' +
                        '</div>',
                        onOpen(p){
                            p.container.find('#btnOk').click(()=>{
                                that.dutyId = p.cols[0].value;
                                idList = [];
                                $$('input[name=put]:checked').each((idx, elm)=>{
                                    let id = $$(elm).data('id');
                                    idList.push(id);
                                });
                                console.log('我点击了5',idList, that.companyId, that.dutyId, that.departmentId);
                                rightsApi.addProjectAdminPositionAndProjectBatch(that.companyId, that.dutyId, idList.join(','), that.departmentId).then((result)=>{
                                    console.log(result.data);
                                    that.isShow = 1;
                                    projectApi.getUserProjectAdmins(that.companyId, that.page, that.pageSize, true).then((res)=>{
                                        console.log('项目管理员列表',res.data);
                                        that.userList = res.data;
                                    })
                                })
                            })
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values: that.dutys.map((one)=>{return one.id;}),
                                displayValues: that.dutys.map((one)=>{return one.positionsName;})
                            }
                        ]
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .navbar .right{
        font-size: 0.7rem; color: #438CFF;
    }
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .up{
        width: 100%; height: 40px; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
    }
    .up .u-1{
        line-height: 40px; font-size: 0.7rem; color: #999999;
    }
    .up .u-2{

    }
    .up .u-2 .shan{
        width: 80px; height: 20px; line-height: 20px; background: #438CFF; font-size: 0.5rem; color: #fff; margin-top: 0.5rem;
    }
    .up .u-2 .shan img{
        width: 12px; height: 12px; display: inline; padding-left: 2px; transform: translateY(2px);
    }
    .up .u-2 .xia{
        position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: -1;
    }

    .top{

    }
    .top .oneBox{
        display: flex; width: 100%; height: 65px; border-top: 1px solid #f4f4f4; background: #fff;
    }
    .top .oneBox .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem; margin-left: 14px;
    }
    .top .oneBox .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .top .oneBox .a3{
        padding: 0.7rem 0 0 0.8rem; flex: 1; overflow: hidden; position: relative;
    }
    .top .oneBox .a3 .left .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .top .oneBox .a3 .left .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .top .oneBox .a3 .left .a3-3{
        font-size: 0.6rem; color: #438CFF;
    }
    .top .oneBox .a3 .right{
        position: absolute; right: 17px; top: 20px;
    }
    .top .oneBox .a3 .right img{
        width: 0.9rem; height: 0.9rem;
    }

    .top2{
        width: 100%; height: 65px; border-top: 1px solid #f4f4f4; background: #fff; position: relative;
    }
    .top2 .item-inner{
        width: 100%; height: 65px; display: flex;
    }
    .top2 .item-inner .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem; margin-left: 46px;
    }
    .top2 .item-inner .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .top2 .item-inner .a3{
        padding: 0.7rem 0 0 0.8rem; flex: 1; overflow: hidden;
    }
    .top2 .item-inner .a3 .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .top2 .item-inner .a3 .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .form-checkbox i, label.label-checkbox i.icon-form-checkbox{
        width: 18px; height: 18px; position: absolute; left: 16px; top: 24px;
    }

    .footer{
        width: 100%; height: 2rem; position: fixed; left: 0; bottom: 0; display: flex; justify-content: space-between;
    }
    .footer .left{
        background: #fff; flex: 1; font-size: 0.6rem; color: #999999; padding-left: 20px; line-height: 2rem;
    }
    .footer .left input{
        transform: translateY(2px);
    }
    .footer .right{
        width: 9rem; background: -webkit-linear-gradient(left,#C0D4FF,#3885FE); display: flex;
    }
    .footer .right div{
        width: 4.5rem; line-height: 2rem; text-align: center; font-size: 0.8rem; color: #fff;
    }

    .toolbar-inner .one{
         width: 98px; border-right: 1px solid #fff; font-size: 0.5rem; color: #999; text-align: center;
    }
    .toolbar-inner .two{
        width: 48px; font-size: 0.5rem; color: #999; text-align: center; transform: translateX(-40px);
    }
    .toolbar-inner .three{
        color: #666;
    }
    .content-block{
        width: 100%; height: 100%; display: flex; background: #fff;
    }
    .content-block .left{
        width: 104px; height: 100%; border-right: 1px solid #f4f4f4; overflow: auto;
    }
    .content-block .left .f-1{
        width: 104px; height: 40px; text-align: center; line-height: 2rem; border-bottom: 1px solid #f4f4f4;
    }
    .content-block .left .f-1.active{
        color: #438CFF;
    }
    .content-block .right{
        flex: 1; width: 100%; overflow: auto;
    }
    .content-block .right .git{
        margin: 14px 0 0 18px;
    }
    .content-block .right .git .g-1{
        box-sizing: border-box; height: 22px; line-height: 22px; padding: 0 14px; background: #F1F1F1; color: #666666; font-size: 0.5rem;
        float: left; margin: 0 24px 18px 0;
    }
    .content-block .right .git .g-1.active{
        background: #D2E3FE; color: #438CFF;
    }
</style>