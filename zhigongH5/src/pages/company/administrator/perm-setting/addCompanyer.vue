<template>
    <div data-page="addCompanyer" class="page navbar-fixed toolbar-fixed">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">
                    添加企业管理员
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                <span class="h-1">搜索手机号码添加</span>
            </div>
            <div class="ipt">
                <input v-model="mobile" placeholder="请输入手机号码" type="tel"/>
                <button class="sub" @click="confirmAction">搜索</button>
                <img src="../../../../../static/img/icon_search.png"/>
            </div>

            <div class="aside" v-show="isShow==-1">
                <div class="tst">搜索结果</div>
                <div class='ali'>
                    <div class="a2"><img :src="this.personInfo.avatar" /></div>
                    <div class="a3">
                        <div><span class="a3-1">{{(personInfo.name?personInfo.name:personInfo.nickname)?(personInfo.name?personInfo.name:personInfo.nickname):personInfo.mobile}}</span>
                            <br/>
                            <span class="a3-2">{{personInfo.mobile}}</span>
                        </div>
                        <input class="add" id="picker-device" @click.stop.prevent="addAction" value="添加" readonly/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { companyApi, userApi, rightsApi} from '../../../../api';
    var $$ = Dom7, addCompanyerDevice;
    export default {
        data(){
            return{
                isShow: 1,
                personInfo: {},
                userId: '',
                mobile: '',
                departmentList: [],
                positionList: [],
                departmentId: '',
                positionId: '',
                positionIdList: [],
                positionNameList: []
            }
        },
        methods:{
            confirmAction(){
                this.isShow = -1,
                userApi.searchUser(this.companyId, this.mobile).then((result)=>{
                    this.personInfo = result.data.list[0];
                    this.userId = result.data.list[0].id;
                    console.log('用户信息',this.personInfo,this.userId);
                },(result)=>{
                    this.code = result.code;
                });
            },
            addAction(){
                addCompanyerDevice.open();
                // companyApi.addCompanyManager(this.userId).then((result)=>{
                //     console.log('添加企业管理员');
                //     console.log(result);
                //     this.$router.back();
                // })
            }
        },
        mounted(){
            this.companyId=this.$store.state.roleInfo.companyId;
            this.companyRole=this.$store.state.roleInfo.companyRole;
            console.log('公司id和角色信息', this.companyId, this.companyRole);

            rightsApi.getPositionsNew(this.companyId, 0).then((result)=>{
                console.log('公司下面所有部门',result.data);
                this.departmentList  = result.data;

                addCompanyerDevice = this.$f7.picker({
                    input: '#picker-devicc',
                    formatValue(p, values, displayValues) {
                        return displayValues;
                    },
                    toolbarTemplate:
                    '<div class="toolbar">' +
                    '<div class="toolbar-inner">' +
                    '<div class="left">' +
                    '<a href="#" class="link close-picker">取消</a>' +
                    '</div>' +
                    '<div class="right"><a href="#" class="link close-picker" id="btnOk2">确定</a></div>' +
                    '</div>' +
                    '</div>',
                    cols: [
                        {
                            values: this.departmentList.map((one) => {return one.id}),
                            displayValues: this.departmentList.map((one) => {return one.name}),
                            onChange: (Picker, value, displayValue) => {
                                this.departmentId = Picker.cols[0].value;
                                if (value == Picker.cols[0].value) {
                                    for(var i=0; i<this.departmentList.length; i++){
                                        if(this.departmentList[i].id == this.departmentId) {
                                            this.positionList = this.departmentList[i].list;
                                            this.positionId = '';
                                            this.positionNameList = [''];
                                            this.positionIdList = [''];
                                            for (var j = 0; j < this.positionList.length; j++) {
                                                if(this.positionList.length != 0){
                                                    this.positionNameList.push(this.positionList[j].positionsName)
                                                    this.positionIdList.push(this.positionList[j].id);
                                                }
                                            }
                                            console.log(this.positionNameList, this.positionIdList);
                                            if (addCompanyerDevice.cols[1].replaceValues) {
                                                addCompanyerDevice.cols[1].replaceValues(
                                                    this.positionIdList,
                                                    this.positionNameList,
                                                );

                                                this.positionId = this.positionIdList[0];
                                                console.log(this.positionId);
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            values: [''],
                            displayValues: [''],
                            onChange: (Picker, value, displayValue)=>{
                                if(value){
                                    console.log('进入了这里')
                                    this.positionId = value;
                                }
                            }
                        }
                    ],
                    onOpen: (picker)=>{
                        $$('#btnOk2').off('click').click(()=>{
                            console.log('确定')
                            if(this.positionId == ''){
                                this.$f7.alert('请先添加部门职务');
                            }else{
                                rightsApi.addProjectAdminPositionAndProject(
                                    this.companyId,
                                    this.departmentId,
                                    this.positionId,
                                    this.userId,
                                    this.contact
                                ).then((result)=>{
                                    console.log(result.data);
                                })
                            }
                        })
                    }
                })
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
    .ipt{
        width: 100%; height: 2.5rem; background: #fff; box-sizing: border-box; padding: 0 0.6rem; display: flex;
        justify-content: space-between; position: relative;
    }
    .ipt input{
        flex: 1;  margin-left: 1.25rem; border: none;
    }
    .ipt .sub{
        width: 2.7rem; height: 1.5rem; line-height: 1.5rem; border-radius: 0.3rem; margin-top: 0.5rem; color: #fff; background: #438cff;
        border:  none;
    }
    .ipt img{
        width: 0.9rem; height: 0.9rem; position: absolute; left: 0.6rem; top: 0.8rem;
    }
    .aside{
        width: 100%; background: #fff; box-sizing: border-box; padding: 0 0.6rem; margin-top: 1rem;
    }
    .aside .tst{
        width: 100%; height: 2rem; border-bottom: 1px solid #f4f4f4; font-size: 0.7rem; line-height: 2rem; color: #999;
    }
    .aside .ali{
        width: 100%; height: 3.25rem; display: flex; box-sizing: border-box; padding-left: 0.6rem;
    }
    .aside .ali .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .aside .ali .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .aside .ali .a3{
        flex: 1; padding: 0.8rem 0 0 0.75rem; display: flex; justify-content: space-between;
    }
    .aside .ali .a3 .add{
        width: 3rem; height: 1.5rem; line-height: 1.5rem; border-radius: 0.4rem; color: #fff; background: #438cff; text-align: center;
    }
    .aside .ali .a3 .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .aside .ali .a3 .a3-2{
        font-size: 0.6rem; color: #999;
    }
    .aside .ali .a3 .a3-3{
        font-size: 0.45rem; color: #fff; background: #FF0000; box-sizing: border-box; padding: 1px 0.5rem; border-radius: 0.5rem;
    }
    .aside .ali .a3 .a4-1{
        font-size: 0.8rem; color: #999; padding-top: 0.2rem;
    }


    .aside .list li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; border-bottom: 1px solid #ccc; box-sizing: border-box; padding: 0 0.6rem; position: relative;
    }
    .aside .list li a{
        width: 100%; height: 100%; display: block; font-size: 0.8rem; color: #438cff;
    }
    .aside .list li a img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.6rem; top: 0.8rem;
    }
</style>