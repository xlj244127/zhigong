<template>
    <div>
        <div class="main">
            <div class="tst">请选择黑名单成员</div>
            <div class="box">
                <div class="left">所属项目</div>
                <input class="right" id="selectProject" @click="selectProjAction" v-model="projectName" type=text placeholder="项目（必选项）" readonly/>
                <img src="../../../static/img/btn_right.png"/>
            </div>
            <div class="box">
                <div class="left">所属班组</div>
                <input class="right" id="selectGroup" @click="selectGroupAction" v-model="groupName" type=text placeholder="班组（必选项)" readonly/>
                <img src="../../../static/img/btn_right.png"/>
            </div>
            <div class="box">
                <div class="left">人员姓名</div>
                <input class="right" id="selectPerson" @click
                        ="selectPersonAction" v-model="personName" type=text placeholder="姓名（必选项)" readonly/>
                <img src="../../../static/img/btn_right.png"/>
            </div>
            <div class="box">
                <div class="left">人员身份证</div>
                <input class="right" type=text v-model="idNumber" placeholder="可输入"/>
            </div>
            <div class="aside">
                <div class="left"><span class="f1">类型</span> <br/> <span class="f2">(可多选)</span></div>
                <ul class="right row">
                    <li class="col-33" v-for="item in typeList">
                        <label class="label-checkbox item-content">
                            <input type="checkbox" name="my-checkbox" :data-code="item.code">
                            <div class="item-media">
                                <i class="icon icon-form-checkbox"></i>
                            </div>&nbsp;
                            <div class="item-inner">
                                <div class="item-title">{{item.value}}</div>
                            </div>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
        <div class="line2"></div>
        <div class="boot">
            <div class="b-1">说明</div>
            <textarea class="b-2" draggable="false" v-model="remark" placeholder="请简要描述该人员的不良行为，有助于企业用工判断"></textarea>
        </div>
        <div class="footer" @click="addPersonAction">设为黑名单人员</div>
    </div>
</template>

<script>
    import { blackListApi, projectApi } from '../../api'
    var selectProject;
    var selectGroup;
    var selectPerson;
    export default {
        name: "oneAddCompanyBlackList",
        data(){
            return{
                typeList: [
                    {value: '恶意讨薪', code: '1'},{value: '打架闹事', code: '2'},{value: '盗窃', code: '3'},{value: '破坏损坏', code: '4'},{value: '在逃人员', code: '5'},{value: '其他', code: '6'}
                ],
                id: '',
                personDetail: {},

                projList: [],
                projectName: '',
                groupList: [],
                groupName: '',
                personList: [],
                personName: '',

                projectId: '',
                groupId: '',
                personId: '',
                idNumber: '',
                type: [],
                companyId: '',
                remark: ''
            }
        },
        methods:{
            selectProjAction(){
                if(selectGroup){
                    selectGroup.destroy();
                }
                if(selectPerson){
                    selectPerson.destroy();
                }

                selectProject.open();
            },
            selectGroupAction(){
                if(this.groupList.length > 0){
                    if(selectPerson){
                        selectPerson.destroy();
                    }
                    selectGroup.open();
                }
            },
            selectPersonAction(){
                if(this.personList.length > 0){
                    selectPerson.open();
                }
            },
            addPersonAction(){
                if(this.companyId==''){
                    this.$f7.alert('请先加入公司');
                    return;
                }
                if(this.projectName==''){
                    this.$f7.alert('请选择项目');
                    return;
                }
                if(this.groupName==''){
                    this.$f7.alert('请选择班组');
                    return;
                }
                if(this.personName==''){
                    this.$f7.alert('请选人员');
                    return;
                }
                if(this.idNumber!=''){
                    var idNumber_res = /^\d{17}[0-9a-zA-Z]$/;
                    if(!idNumber_res.test(this.idNumber)){
                        this.$f7.alert('身份证号码不正确，请从新输入');
                        return;
                    }
                }
                Dom7('input[name=my-checkbox]:checked').each((idx, elm)=>{
                    let id = Dom7(elm).data('code');
                    this.type.push(id);
                });
                if(this.type.length==0){
                    this.$f7.alert('请选择类型');
                    return;
                }
                console.log(this.type);
                console.log(this.remark);

                blackListApi.addBlackListMember(
                    1,
                    this.type.join(','),
                    this.personId,
                    this.groupId,
                    this.projectId,
                    this.companyId,
                    this.idNumber,
                    this.remark
                ).then((result)=>{
                    console.log(result);
                    this.$f7.showPreloader('添加成功');
                    setTimeout(()=>{
                        this.$f7.hidePreloader();
                    },1000);
                    this.$router.back();

                })

            }
        },
        created(){
            this.companyId = this.$store.state.roleInfo.companyId;

        },
        mounted(){
            projectApi.allProjectList().then((result)=>{
                console.log('公司项目列表');
                console.log(result);
                this.projList = result.data;

                selectProject = this.$f7.picker({
                    input: '#selectProject',
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    onChange:  ()=>{
                        Dom7('#btnOk').off('click').click(()=>{
                            this.groupList = [];
                            this.groupId = '';
                            this.groupName = '';
                            this.personList = [];
                            this.personId = '';
                            this.personName = '';
                            this.projectId = selectProject.cols[0].value;
                            this.projectName = selectProject.cols[0].displayValue;
                            console.log(this.projectId);
                            console.log(this.projectName);

                            projectApi.projGroupsList(this.projectId).then((result)=> {
                                console.log('项目班组列表');
                                this.groupList = result.data;
                                console.log('1', this.groupList);
                                selectGroup = this.$f7.picker({
                                    input: '#selectGroup',
                                    toolbarTemplate:
                                    '<div class="toolbar">' +
                                    '<div class="toolbar-inner">' +
                                    '<div class="left">' +
                                    '<a href="#" class="link close-picker">取消</a>' +
                                    '</div>' +
                                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                                    '</div>' +
                                    '</div>',
                                    onChange:  ()=> {
                                        Dom7('#btnOk').off('click').click(() => {
                                            this.personList = [];
                                            this.personId = '';
                                            this.personName = '';

                                            this.groupId = selectGroup.cols[0].value;
                                            this.groupName = selectGroup.cols[0].displayValue;
                                            console.log(this.groupId);
                                            console.log(this.groupName);

                                            projectApi.lookProjGroupMenber(this.projectId, this.groupId).then((result) => {
                                                console.log('班组成员列表', result);
                                                this.personList = result.data;
                                                selectPerson = this.$f7.picker({
                                                    input: '#selectPerson',
                                                    toolbarTemplate:
                                                    '<div class="toolbar">' +
                                                    '<div class="toolbar-inner">' +
                                                    '<div class="left">' +
                                                    '<a href="#" class="link close-picker">取消</a>' +
                                                    '</div>' +
                                                    '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                                                    '</div>' +
                                                    '</div>',
                                                    onChange:  ()=>{
                                                        Dom7('#btnOk').off('click').click(()=> {
                                                            this.personId = selectPerson.cols[0].value;
                                                            this.personName = selectPerson.cols[0].displayValue;
                                                            console.log(this.personId, this.personName);
                                                            for(var i=0; i<this.personList.length; i++){
                                                                if(this.personId == this.personList[i].id){
                                                                    console.log('无身份证');
                                                                    if(this.this.personList[i].userDetail.idNumber){          //如果idNumber为null则为空字符串
                                                                        this.idNumber = this.personList[i].userDetail.idNumber;
                                                                    }else{
                                                                        this.idNumber = '';
                                                                    }
                                                                }
                                                            }
                                                        })
                                                    },
                                                    cols: [
                                                        {
                                                            textAlign: 'center',
                                                            values: this.personList.map((item)=>{return item.id}),
                                                            displayValues: this.personList.map((item)=>{return (item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile})
                                                        }
                                                    ]
                                                });
                                            })
                                        });
                                    },
                                    cols: [
                                        {
                                            textAlign: 'center',
                                            values: this.groupList.map((item)=>{return item.id}),
                                            displayValues: this.groupList.map((item)=>{return item.name})
                                        }
                                    ]
                                })
                            })
                        });
                    },
                    cols: [
                        {
                            textAlign: 'center',
                            values: this.projList.map((project)=>{return project.id}),
                            displayValues: this.projList.map((project)=>{return project.name})
                        }
                    ]
                });
            })



        }
    }
</script>

<style scoped>
    .main{
        box-sizing: border-box; padding: 0 1.4rem 0 0.6rem;
    }
    .main .tst{
        width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #999; border-bottom: 1px solid #f4f4f4;
    }
    .main .box{
        display: flex; width: 100%; height: 2rem; line-height: 2rem; margin-top: 0.5rem; position: relative;
    }
    .main .box .left{
        font-size: 0.7rem; color: #666; padding-right: 0.6rem;
    }
    .main .box .right{
        flex: 1; padding-left: 0.45rem; border-radius: 0.2rem; font-size: 0.7rem; color: #ccc; border: 1px solid #ccc;
    }
    .main .box img{
        width: 0.4rem; height: 0.75rem; position: absolute; right: 0.5rem; top: 0.5rem;
    }

    .main .aside{
        width: 100%; display: flex; margin: 1rem 0 1rem 0;
    }
    .main .aside .left{
        width: 4.5rem; text-align: center;
    }
    .main .aside .left .f1{
        font-size: 0.7rem; color: #666;
    }
    .main .aside .left .f2{
        font-size: 0.5rem; color: #ccc;
    }

    label.label-checkbox, label.label-radio{
        display: flex; margin-top: 0.5rem;
    }
    .form-checkbox i, label.label-checkbox i.icon-form-checkbox{
        width: 0.6rem; height: 0.6rem; margin-top: 0.1rem;
    }
    .item-title{
        font-size: 0.65rem; color: #888;
    }

    .line2{
        width: 100%; height: 0.25rem; background: #f4f4f4;
    }
    .boot{
        box-sizing: border-box; padding: 0 0.6rem;
    }
    .boot .b-1{
        font-size: 0.7rem; color: #666; width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666;
    }
    .boot .b-2{
        width: 100%; height: 6rem; border: 1px solid #438CFF;
    }

    .footer{
        width: 46%; height: 2rem; background: #438CFF; font-size: 0.8rem; color: #fff; line-height: 2rem; text-align: center;
        margin: 1.3rem auto; border-radius: 0.25rem;
    }
</style>