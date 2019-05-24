<template>
    <div data-page="infoEntering" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">信息录入</div>
            </div>
        </div>
        <!---侧边栏--->
        <proj-admin></proj-admin>
        <!--页面主要类容-->
        <div class="page-content">
            <div class="line"></div>
            <div class="ipt" @click.stop.prevent="selectProject">
                <span v-if="this.projectName.length>20">{{this.projectName.substr(0,20)}}...</span>
                <span v-else>{{this.projectName}}</span>
                <img class="i-img" src="../../../../static/img/btn_drop_down.png"/>
                <input type="text" readonly id="picker-device">
            </div>
            <div class="line"></div>
            <div class="top">
                <div class="box">
                    <a>
                        <span>总人数</span>
                        <br/>
                        <span class="size">{{this.enterSum.projectsUsersCount}}</span><span class="size2">人</span>
                    </a>
                </div>
                <div class="box">
                    <a>
                        <span>未录入身份证</span>
                        <br/>
                        <span class="size colorRed">{{this.enterSum.noIDUsersCount}}</span><span class="size2 colorRed">人</span>
                    </a>
                </div>
                <div class="box">
                    <a>
                        <span>未录入人脸</span>
                        <br/>
                        <span class="size colorRed">{{this.enterSum.noFacedUsersCount}}</span><span class="size2 colorRed">个</span>
                    </a>
                </div>
            </div>
            <div class="line"></div>
            <div class="main">
                <div class="head">
                    <div>项目信息录入情况</div> <div v-if="showMachine" @click.stop.prevent="selectMachine" class="h-1"> {{ machineLabel }} <img src="../../../../static/img/btn_drop_down.png"/></div>
                </div>
                <div class="nav row">
                    <div class="col-50">班组</div>
                    <div class="col-25">未录身份证</div><div class="col-25">未录人脸</div>
                </div>

                <div class="list-block accordion-list">
                    <ul class="aul">
                        <li class="accordion-item" v-for="item in groupList">
                            <a href="#" class="item-content item-link">
                                <div class="item-inner row">
                                    <div class="col-50 tov">
                                        <span>{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                                        <span class="Img" v-if="item.typeName == 'admin'" @click.stop.prevent="addProjer"><img class="imgTwo" src="../../../../static/img/addprojer.png"/></span>
                                        <span class="Img" v-if="item.typeName == 'normal'" @click.stop.prevent="addWorker"><img class="imgOne" src="../../../../static/img/addwork.png"/></span>
                                        <span class="Img" v-if="item.typeName == 'temp'" @click.stop.prevent="addTemper"><img class="imgthree" src="../../../../static/img/addtemp.png"/></span>
                                    </div>
                                    <div class="col-25 one">{{item.noIDCount}}</div>
                                    <div class="col-25 one">{{item.noFacedCount}}</div>
                                </div>
                            </a>
                            <div class="accordion-item-content">
                                <div class="content-block">
                                    <press-staff :list="item.members" :isGrouper="item.user" :projectId="projectId" :machineId="machineId" :hasMachine="hasMachine"></press-staff>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="foot" @click="skipInfoEnteringGroup">
                    <a>查看全部班组信息录入 ></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { projectApi, machineApi, commonApi } from '../../../api'
    import bluetooth from '../../../lib/bluetoothUtil'
    import pressStaff from '../../../components/personInfoEntering/pressStaff'
    import projAdmin from '../../../components/broadside-navigation/projAdmin'

    let pickerProject, pickerDevice, flush;
    export default {
        data(){
            return{
                list:[],
                projectId: '',
                projectName: '',
                projSum: {},
                enterSum: {},
                groupList: [],
                projList: [],
                staffList: '',
                showMachine: false,
                machineId: '',
                machineLabel: '选择考勤机',
                number: {},
                imUser: null,
                hasMachine: ''
            }
        },
        components: {
            pressStaff, projAdmin
        },
        methods:{
            back() {
                projectApi.projEnterSum(this.projectId).then((result)=>{
                    console.log('我获取的项目汇总');
                    console.log(result);
                    this.projSum = result.data;
                });
                projectApi.projInfoEnterSum().then((result)=>{
                    console.log('我获取的项目信息汇总');
                    console.log(result);
                    this.enterSum = result.data;
                });
                projectApi.projEnterGroup(this.projectId).then((result)=>{
                    console.log('项目群组列表');
                    console.log(result);
                    this.groupList = result.data;
                });
                if(this.$store.state.selectedMachine[this.projectId]) {
                    for(let i = 0; i < this.$store.state.machineList[this.projectId].length; i++){
                        let item = this.$store.state.machineList[this.projectId][i];
                        if(item.id == this.$store.state.selectedMachine[this.projectId]) {
                            this.machineId = item.id;
                            this.machineLabel = item.code.substr(-6, 6);
                            break;
                        }
                    }
                    if(pickerDevice)
                        pickerDevice.value = [this.$store.state.selectedMachine[this.projectId]];
                }
            },
            addProjer(){
                this.$router.load({url: '/company/phoneAdd/'+this.projectId+'/'+1});
            },
            addWorker(){
                this.$router.load({url: '/company/phoneAdd/'+this.projectId+'/'+4});
            },
            addTemper(){
                this.$router.load({url: '/company/phoneAdd/'+this.projectId+'/'+3});
            },
            skipInfoEnteringGroup(){
                this.$router.load({url: '/company/groupInfoEnteringList/'+this.projectId+'/'+this.projectName});
            },
            machineList() {
                let that = this;
                return new Promise((resolve, reject) => {
                    if(typeof that.$store.state.machineList !== 'object')
                        that.$store.state.machineList = {};
                    if(typeof that.$store.state.selectedMachine !== 'object')
                        that.$store.state.selectedMachine = {};
                    if(that.$store.state.machineList[that.projectId]) {
                        resolve(that.$store.state.machineList[that.projectId]);
                    }
                    else {
                        machineApi.projectMachineList(that.projectId).then((result)=>{
                            that.$store.state.machineList[that.projectId] = result.data.list;
                            resolve(result.data.list);
                        }, reject);
                    }

                });
            },
            selectProject(){
                pickerProject.open();
            },
            selectMachine(){
                this.createPickerDevice(this.$store.state.machineList[this.projectId]);
                pickerDevice.open();
            },
            createPickerDevice(machineList) {
                if(!flush)
                    return;
                flush = false;

                let that = this;
                if(pickerDevice) {
                    pickerDevice.cols[0].replaceValues(
                        machineList.map((item)=>{return item.id}),
                        machineList.map((item)=>{return item.code.substr(-6, 6)})
                    );
                    if(that.$store.state.selectedMachine[that.projectId])
                        pickerDevice.value = [that.$store.state.selectedMachine[that.projectId]];
                }
                else {
                    pickerDevice = this.$f7.picker({
                        input: '#picker-device',
                        toolbarTemplate:
                        '<div class="toolbar">' +
                        '<div class="toolbar-inner">' +
                        '<div class="left">' +
                        '<a href="#" class="link close-picker">取消</a>' +
                        '</div>' +
                        '<div class="right"><a href="#" class="link close-picker" id="btnOk">确定</a></div>' +
                        '</div>' +
                        '</div>',
                        value: that.$store.state.selectedMachine[that.projectId]?[that.$store.state.selectedMachine[that.projectId]]:[],
                        onOpen:  (p)=>{
                            p.container.find('#btnOk').click(()=>{
                                console.log(pickerDevice.cols[0].value);
                                that.machineId = pickerDevice.cols[0].value;
                                that.machineLabel = pickerDevice.cols[0].displayValue;
                                that.$store.state.selectedMachine[that.projectId] = that.machineId;
                            });
                        },
                        cols: [
                            {
                                textAlign: 'center',
                                values: machineList.map((item)=>{return item.id}),
                                displayValues: machineList.map((item)=>{return item.code.substr(-6, 6)})
                            }
                        ]
                    });
                    pickerDevice.setValue([machineList[0].id]);
                }
            }
        },
        created() {
            pickerDevice = null;
            flush = true;

            let that = this;
            let account = 'account' + this.$store.state.userInfo.id;
            commonApi.getXaiomiApiToken(account).then((response)=>{
                let token = response.body;
                if(!token) {
                    that.$f7.alert('获取消息令牌失败，Token为空');
                    return;
                }
                that.imUser = new MIMCUser(account);
                that.imUser.registerFetchToken(()=>{
                    return token;
                });
                that.imUser.registerStatusChange((bindResult, errType, errReason, errDesc)=>{
                    /**
                     * @param[bindResult] bool: true/false 表示登录成功/失败
                     * @param[errType] string: 登录失败类型
                     * @param[errReason] string: 登录失败原因
                     * @param[errDesc] string: 登录失败描述
                     **/
                    if(!bindResult)
                        console.log('Xiaomi account status changed: result: ' + bindResult + ', errType: '+errType + ', errReason: '+errReason + ', errDesc: '+errDesc);
                });
                that.imUser.registerP2PMsgHandler((msg)=>{
//                    msg.getPacketId(); // 客户端生成的消息ID
//                    msg.getSequence(); // 由服务器生成，用于去重排序(升序)
//                    msg.getFromAccount(); // 消息发送者在APP帐号系统的帐号ID
//                    msg.getTimeStamp(); // 消息发送时间戳
//                    msg.getPayload(); // payload为用户自定义消息，utf-8 string类型
                    that.$root.eventHub.$emit('pushNotification', msg.getPayload());
                });
                that.imUser.registerServerAckHandler((packetId, sequence, timeStamp, errMsg)=>{

                });
                that.imUser.login();
            });
        },
        destroyed() {
            if(this.imUser)
                this.imUser.logout();
        },
        mounted(){
            let that = this;

            projectApi.projerProjList().then((result)=>{    //根据用户id获取有项目
                console.log('项目列表');
                console.log(result);
                this.projList = result.data;
                this.projectName = this.projList[0].name;
                this.projectId = this.projList[0].id;

                this.machineList().then((result)=>{
                    this.hasMachine = result.length;
                    console.log('===============',this.hasMachine);

                    if(result.length === 0) {
                        that.showMachine = false;
                    }
                    else if(result.length === 1) {
                        that.machineId = result[0].id;
                        that.machineLabel = result[0].code.substr(-6, 6);
                        that.showMachine = false;
                    }
                    else {
                        that.showMachine = true;
                        if(that.$store.state.selectedMachine[that.projectId]) {
                            for(let i = 0; i < result.length; i++){
                                let item = result[i];
                                if(item.id == that.$store.state.selectedMachine[that.projectId]) {
                                    that.machineId = item.id;
                                    that.machineLabel = item.code.substr(-6, 6);
                                    break;
                                }
                            }
                        }
                    }
                });

                projectApi.projEnterSum(this.projectId).then((result)=>{
                    console.log('我获取的项目汇总');
                    console.log(result);
                    this.projSum = result.data;
                });
                projectApi.projInfoEnterSum().then((result)=>{
                    console.log('我获取的项目信息汇总');
                    console.log(result);
                    this.enterSum = result.data;
                });
                projectApi.projEnterGroup(this.projectId).then((result)=>{
                    console.log('项目群组列表');
                    console.log(result);
                    this.groupList = result.data;
                });

                pickerProject = this.$f7.picker({
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
                    onOpen:  (p)=>{
                        p.container.find('#btnOk').click(()=>{
                            let index = pickerProject.cols[0].activeIndex;
                            console.log(pickerProject.cols[0].value);
                            this.projectName = pickerProject.cols[0].displayValues[index];
                            this.projectId = pickerProject.cols[0].values[index];
                            console.log(this.projectId);
                            flush = true;
                            projectApi.projEnterSum(this.projectId).then((result)=>{
                                console.log('我获取的项目汇总');
                                console.log(result);
                                this.projSum = result.data;
                            });
                            projectApi.projInfoEnterSum().then((result)=>{
                                console.log('我获取的项目信息汇总');
                                console.log(result);
                                this.enterSum = result.data;
                            });
                            projectApi.projEnterGroup(this.projectId).then((result)=>{
                                console.log('项目群组列表');
                                console.log(result);
                                this.groupList = result.data;
                            });

                            that.machineList().then((result)=>{
                                this.hasMachine = result.length;
                                console.log('+++++++++++++++++++++',this.hasMachine);

                                if(result.length === 0) {
                                    that.showMachine = false;
                                    that.machineId = '';
                                    that.machineLabel = '请选择考勤机';
                                }
                                else if(result.length === 1) {
                                    that.machineId = result[0].id;
                                    that.machineLabel = result[0].code.substr(-6, 6);
                                    that.showMachine = false;
                                }
                                else {
                                    that.showMachine = true;
                                    if(that.$store.state.selectedMachine[that.projectId]) {
                                        for(let i = 0; i < result.length; i++){
                                            let item = result[i];
                                            if(item.id == that.$store.state.selectedMachine[that.projectId]) {
                                                that.machineId = item.id;
                                                that.machineLabel = item.code.substr(-6, 6);
                                                break;
                                            }
                                        }
                                    }
                                }
                            });
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
            });
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #fff;
    }
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }

    .ipt{
        width: 100%; height: 2rem; line-height: 2rem; position: relative; box-sizing: border-box; padding: 0 0.6rem; background: #fff; text-align: center;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .ipt #picker-device{
        position: absolute;  left: 0;  right: 0;  top: 0;  bottom: 0; opacity: 0;
    }
    .ipt .i-img{
        width: 0.6rem; height: 0.6rem; display: inline;
    }

    .top{
        width: 100%; height: 4.5rem; display: flex; justify-content: space-between; padding: 0.6rem; box-sizing: border-box;
        background: #fff; margin-top: 0.5rem;
    }
    .top .box{
        width: 100px; height: 3.5rem; text-align: center; box-sizing: border-box; padding-top: 0.6rem;
    }
    .top .box a{
        width: 100%; height:100%; font-size: 0.65rem; color: #666;
    }
    .top .box .size{
        font-size: 1.15rem; color: #438cff;
    }
    .top .box .size2{
        color: #438cff; font-size: 0.7rem;
    }
    .top .box .colorRed{
        color: #ef7373;
    }
    .line{
        width: 100%; height: 0.5rem; background: #f4f4f4;
    }

    .main{

    }
    .main .head{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; display: flex; justify-content: space-between;
        border-bottom: 1px solid #f4f4f4;  box-sizing: border-box; padding: 0 0.6rem;
    }
    .main .head .h-1{
        color: #438cff;
    }
    .main .nav{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; justify-content: space-between; border-bottom: 1px solid #f4f4f4;
    }
    .main .nav div{
        text-align: center; font-size: 0.7rem; color: #999;
    }
    .main .aul li{
        position: relative; box-sizing: border-box; padding: 0 0.6rem;
    }
    .list-block .item-content{
        padding: 0; margin: 0;
    }
    .list-block .item-inner{
        display: flex; margin: 0; padding: 0;

    }
    .list-block .item-inner div{
        height: 2.2rem; line-height: 2.2rem;
    }
    .list-block .item-inner .tov{

    }
    .list-block .item-inner .tov .Img{
        display: inline-block; height: 2.2rem;
    }
    .list-block .item-inner .tov .Img .imgOne{
        width: 2.75rem; height: 0.9rem; display: inline-block; transform: translateY(0.2rem);
    }
    .list-block .item-inner .tov .Img .imgTwo{
        width: 3.2rem; height: 0.9rem; display: inline-block; transform: translateY(0.2rem);
    }
    .list-block .item-inner .tov .Img .imgthree{
        width: 3.2rem; height: 0.9rem; display: inline-block; transform: translateY(0.2rem);
    }

    .list-block .item-inner .one{
        text-align: center;
    }

    .main .foot{
        width: 100%; height: 2.5rem; line-height: 2.5rem; text-align: center; font-size: 0.7rem; color: #438cff;
    }
    .list-block{
        font-size: 0.7rem; color: #666; margin: 0;
    }

    .head img {
        width: 0.6rem;
        height: 0.6rem;
    }
    .head input {
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
    }
</style>