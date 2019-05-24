  <template>
    <div data-page="phoneAdd" class="page navbar-fixed toolbar-fixed">   <!--&lt;!&ndash;固定导航栏&ndash;&gt;-->
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
                <div class="center sliding">
                    <span v-if="role == 1">添加项目管理员</span>
                    <span v-if="role == 2"><span v-show="isShow2==1">添加班组长</span><span v-show="isShow2==2">选择工种</span></span>
                    <span v-if="role == 3">添加临时工</span>
                    <span v-if="role == 4">添加工人</span>
                    <span v-if="role == 5">添加工人</span>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div v-show="isShow2==1">
                <div class="header">
                    <span class="h-1">搜索手机号码添加</span>
                </div>
                <div class="ipt">
                    <input v-model="mobile" placeholder="请输入手机号码" type="tel"/>
                    <button class="sub" @click="confirmAction">搜索</button>
                    <img src="../../../../../static/img/icon_search.png"/>
                </div>

                <div class="aside" v-if="isShow == -1">
                    <div class="tst">搜索结果</div>
                    <div class='ali' v-if="this.code==0">
                        <div class="other">
                            <div class="a2"><img :src="this.personInfo.avatar" /></div>
                            <div class="a3">
                                <div><span class="a3-1">{{(personInfo.name?personInfo.name:personInfo.nickname)?(personInfo.name?personInfo.name:personInfo.nickname):personInfo.mobile}}</span>
                                    <span v-if="this.isBlack==true" class="a3-3">黑名单人员</span>
                                    <br/>
                                    <span class="a3-2">{{this.personInfo.mobile}}</span>
                                </div>
                                <div class="fr">
                                    <input class="add" id="picker-device" @click.stop.prevent="addAction" value="添加" readonly/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-show="isShow2==2">
                <selectType :projectId="projectId" :userId="userIds" :status="0" :isBlack="isBlack" :workerKind="workerKind"></selectType>
            </div>

        </div>
    </div>
</template>

<script>
    import { userApi } from '../../../../api'
    import { projectApi } from '../../../../api'
    import { companyApi } from '../../../../api'
    import { groupApi } from '../../../../api'
    import { tabulateStatisticsApi } from '../../../../api'
    import { blackListApi } from '../../../../api'
    import selectType from '../../../../components/selectWorkType/selectType'
    var $$ = Dom7;
    var pickerDevice;
    var groupDeviceNo;
    var infoGroupNo;
    export default {
        data(){
            return{
                isShow: 1,
                isShow2: 1,
                role: '',
                groupId: '',
                projerList: [],
                grouperList: [],
                temporaryWorkerList: [],
                userIds: '',
                workType: '',
                mobile: '',
                personInfo: [],
                code: '2',
                projectId: '',
                workerTitle: [],
                lackThreeWorkerTitle: [],   //缺少前三个班组工种数组
                tempTitle: [],
                groupList: '',
                isBlack: '',
                companyId: '',
                isOff: 1,
                groupType: [],   //班组工种code数组
                groupWorkType: [],   //企业版加工人时这个项目下面每个班组下面的班组工种
                groupWorkTypeName: [],
                groupWorkTypeCode: [],
                sizeWork: [{'id': 3, 'name': '大工'},{'id': 4, 'name': '小工'}],
                size: '',
                workerKind: []
            }
        },
        components: {
            selectType
        },
        methods:{
            changeState(){
                this.isShow2 = 1;
            },
            confirmAction(){
                this.isShow = -1;
                userApi.searchUser(this.companyId, this.mobile).then((result)=>{
                    this.personInfo = result.data.list[0];
                    this.userIds = result.data.list[0].id;
                    // this.workType = result.data.list[0].workType;
                    this.code = result.code;
                    this.isBlack = result.data.list[0].isBlack;
                    console.log(this.isBlack);
                },(result)=>{
                    this.code = result.code;
                });
            },
            addAction(){
                let that = this;
                //没有项目id就缓存数据，有项目id就添加到接口
                if(this.projectId==':id') {
                    if (this.role == 1) {
                        console.log('我添加项目管理员到了缓存中');
                        if (this.$store.state.projerList) {
                            this.projerList = this.$store.state.projerList;
                            this.projerList.push(this.personInfo);
                            this.$store.state.projerList = this.projerList;
                            console.log(this.projerList);
                            this.$router.back();
                        } else {
                            this.projerList.push(this.personInfo);
                            this.$store.state.projerList = this.projerList;
                            console.log(this.projerList);
                            this.$router.back();
                        }
                    }
                    if(this.role == 4) {    //班组长添加工人
                        this.$router.load({url: '/company/selectTypeAddSize/0/'+this.userIds})
                    }
                }else{
                    if(this.role == 4){
                        if(this.groupList.length == 0){
                            this.$f7.alert('请先添加班组长');
                        }else{
                            groupDeviceNo.open();   //项目管理员添加工人
                        }
                    }
                    if(this.role == 1){                                                                //添加项目管理员
                        projectApi.addRoleToList(this.projectId, 1, this.userIds).then((result)=>{
                            console.log('我添加到了项目管理员列表中');
                            console.log(result);
                            this.$router.back();
                        })
                    }
                    if(this.role == 2){
                        console.log('我点击了');
                        this.isShow2 = 2;
                        // this.$router.load({url: '/company/selectType/0/'+this.isBlack+'_'+this.projectId+'_'+this.userIds})
                    }
                    if(this.role == 3){
                        this.$f7.confirm('是否确认添加临时工?', ()=>{
                            let buttons = [];
                            for (var i = 0; i < this.tempTitle.length; i++) {
                                let value = this.tempTitle[i].value;
                                let index = this.tempTitle[i].code;
                                buttons.push({
                                    text: value,
                                    onClick: () => {
                                        console.log(index);                                                              //添加临时工到项目
                                        projectApi.addTempToProj(this.projectId, 3, this.userIds, index).then((result)=>{
                                            console.log('我添加到了临时工到项目');
                                            console.log(result);
                                            that.$router.back();
                                        })
                                    }
                                })
                            }
                            buttons.push(
                                {
                                    text: '<div style="width: 100%; color: red">取消添加</div>',
                                    onClick: ()=>{
                                        this.$f7.closeModal();
                                    }
                                }
                            )
                            that.$f7.modal({
                                title: '请选择临时工职务:',
                                verticalButtons: true,
                                buttons
                            })
                        })
                    }
                    if(this.role == 5){         //信息录入里面添加工人
                        infoGroupNo.open();
                    }

                }
            }
        },
        created(){
            this.companyId = this.$store.state.roleInfo.companyId;
        },
        mounted(){
            this.projectId = this.$route.params.id;
            this.role = this.$route.params.role;
            this.groupId = this.$store.state.groupId;
            this.workerTitle = this.$store.state.workerTitle;
            console.log(this.projectId);
            console.log(this.role);
            console.log(this.groupId);

    //项目添加班组长用到的列表数据
            if(this.projectId != ':id' && this.role == 2) {
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

    //企业版身份添加工人
            if(this.projectId != 0) {
                projectApi.projGroupsList(this.projectId).then((result) => {
                    console.log('项目班组', result);
                    this.groupList = result.data;

                    groupDeviceNo = this.$f7.picker({
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
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                        '</div>' +
                        '</div>',
                        cols: [
                            {
                                values: this.groupList.map((one) => {return one.id}),
                                displayValues: this.groupList.map((one) => {return one.displayName}),
                                onChange: (Picker, value, displayValue) => {
                                    this.groupId = value;
                                    console.log('班组id',this.groupId);
                                    for(var i=0; i<this.groupList.length; i++){
                                        if(this.groupList[i].id == value){
                                            this.groupWorkType = this.groupList[i].types;
                                            console.log('班组工种',this.groupWorkType);
                                            if (groupDeviceNo.cols[1].replaceValues) {
                                                this.workType = this.groupWorkType[0].workType;
                                                groupDeviceNo.cols[1].replaceValues(
                                                   this.groupWorkType.map((item)=>{return item.workType}),
                                                   this.groupWorkType.map((item)=>{return item.name})
                                                )
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                values: [''],
                                displayValues: [''],
                                onChange: (Picker, value, displayValue) => {
                                    if(value){
                                        this.workType = value;
                                        console.log('工种', this.workType);
                                    }
                                },
                            },
                            {
                                values: this.sizeWork.map((one) => {return one.id}),
                                displayValues: this.sizeWork.map((one) => {return one.name}),
                                onChange: (Picker, value, displayValue) => {
                                    this.size = value;
                                    console.log('大小工',value);
                                }
                            }
                        ],
                        onOpen: (picker)=>{
                            groupDeviceNo.cols[0].onChange(picker, this.groupId);

                            $$('#btnOk').off('click').click(()=>{
                                console.log('确定',this.groupId,this.workType,this.size);
                                if (this.isBack == true) {
                                    groupApi.projAddWorker(this.workType, this.userIds, this.groupId).then((result) => {     //添加工人到班组
                                        console.log('我添加了工人工种');
                                        console.log(result);

                                        projectApi.addWorkerToprojGroup(this.projectId, this.size, this.userIds, this.groupId, this.workType).then((result) => { //添加工人到项目
                                            console.log('我把工人添加到项目');
                                            console.log(result);

                                            blackListApi.addProjToBlackList(this.projectId, this.userIds).then((result) => {  //添加项目到黑名单
                                                console.log('我把这个项目添加到了黑名单管理', result);
                                                this.$router.back();
                                            })
                                        })
                                    })
                                } else {
                                    groupApi.projAddWorker(this.workType, this.userIds, this.groupId).then((result) => {     //添加工人到班组
                                        console.log('我添加了工人工种');
                                        console.log(result);

                                        projectApi.addWorkerToprojGroup(this.projectId, this.size, this.userIds, this.groupId, this.workType).then((result) => { //添加工人到项目
                                            console.log('我把工人添加到项目');
                                            console.log(result);
                                            this.$router.back();
                                        })

                                    })
                                }
                            })
                        }
                    })
                })
            }

            if(this.$store.state.tempTitle){
                this.tempTitle = this.$store.state.tempTitle;
            }else{
                tabulateStatisticsApi.typeSort('position').then((result)=>{
                    console.log('临时工职务',result);
                    this.tempTitle = result.data.list;
                    this.$store.state.tempTitle = this.tempTitle;
                })
            }

    //企业版信息录入添加工人
            if(this.projectId != ':id') {
                projectApi.projGroupsList(this.projectId).then((result) => {
                    console.log('项目班组', result);
                    this.groupList = result.data;
                    for (var i = 0; i < this.groupList.length; i++) {
                        if (this.groupList[i].id == this.groupId) {
                            this.groupWorkType = this.groupList[i].types;
                        }
                    }

                    infoGroupNo = this.$f7.picker({        //工人没有工种的时候
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
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                        '</div>' +
                        '</div>',
                        onChange: () => {
                            $$('#btnOk').off('click').click(() => {
                                this.workType = infoGroupNo.cols[0].value;
                                console.log('工种', this.workType);

                                if (this.isBack == true) {
                                    console.log('工人没有工种的情况');
                                    groupApi.projAddWorker(this.workType, this.userIds, this.groupId).then((result) => {     //添加工人到班组
                                        console.log('我添加了工人工种');
                                        console.log(result);

                                        projectApi.addWorkerToprojGroup(this.projectId, 3, this.userIds, this.groupId, this.workType).then((result) => { //添加工人到项目
                                            console.log('我把工人添加到项目');
                                            console.log(result);

                                            blackListApi.addProjToBlackList(this.projectId, this.userIds).then((result) => {  //添加项目到黑名单
                                                console.log('我把这个项目添加到了黑名单管理', result);
                                                this.$router.back();
                                            })
                                        })
                                    })
                                } else {
                                    console.log('工人没有工种的情况');
                                    groupApi.projAddWorker(this.workType, this.userIds, this.groupId).then((result) => {     //添加工人到班组
                                        console.log('我添加了工人工种');
                                        console.log(result);

                                        projectApi.addWorkerToprojGroup(this.projectId, 3, this.userIds, this.groupId, this.workType).then((result) => { //添加工人到项目
                                            console.log('我把工人添加到项目');
                                            console.log(result);
                                            this.$router.back();
                                        })
                                    })
                                }
                            })
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values: this.groupWorkType.map((three) => {
                                    return three.workType
                                }),
                                displayValues: this.groupWorkType.map((three) => {
                                    return three.name
                                })
                            }
                        ]
                    });
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

    }
    .aside .ali .other{
        width: 100%; height: 3.25rem; display: flex; box-sizing: border-box; padding-left: 0.6rem;
    }
    .aside .ali .other .a2{
        width: 2rem; height: 2rem; border: 1px solid #000; border-radius: 50%; margin-top: 0.5rem;
    }
    .aside .ali .other .a2 img{
        width: 2rem; height: 2rem; border-radius: 50%;
    }
    .aside .ali .other .a3{
        flex: 1; padding: 0.8rem 0 0 0.75rem; display: flex; justify-content: space-between;
    }
    .aside .ali .other .a3 .add{
        width: 3rem; height: 1.5rem; line-height: 1.5rem; border-radius: 0.4rem; color: #fff; background: #438cff; text-align: center;
    }
    .aside .ali .other .a3 .a3-1{
        font-size: 0.8rem; color: #438cff;
    }
    .aside .ali .other .a3 .a3-2{
        font-size: 0.6rem; color: #999;
    }
</style>