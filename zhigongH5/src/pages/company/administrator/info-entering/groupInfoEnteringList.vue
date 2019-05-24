<template>
    <div data-page="groupInfoEnteringList" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">班组信息录入情况</div>
            </div>
        </div>
        <div class="page-content">
            <div class="header">
                {{ projName }}
                <span v-if="showMachine" @click.stop.prevent="selectAction" class="h-1"> {{ machineLabel }} <img src="../../../../../static/img/btn_drop_down.png"/></span>
                <input id="pick-device">
            </div>
            <div class="main2">
                <div class="nav row">
                    <div class="col-50"><span v-show="this.projectId==0">人员</span><span v-show="this.projectId!=0">班组</span></div><div class="col-25">未录身份证</div><div class="col-25">未录人脸</div>
                </div>

                <div class="list-block accordion-list">
                    <ul class="aul">
                        <li class="accordion-item" v-for="item in list">
                            <a href="#" class="item-content item-link">
                                <div class="item-inner row">
                                    <div class="col-50 tov">
                                        <span>{{(item.name?item.name:item.nickname)?(item.name?item.name:item.nickname):item.mobile}}</span>
                                        <span class="Img" v-if="item.typeName == 'admin'" @click.stop.prevent="addProjer"><img class="imgTwo" src="../../../../../static/img/addprojer.png"/></span>
                                        <span class="Img" v-if="item.typeName == 'normal'" @click.stop.prevent="addWorker(item)"><img class="imgOne" src="../../../../../static/img/addwork.png"/></span>
                                        <span class="Img" v-if="item.typeName == 'temp'" @click.stop.prevent="addTemper"><img class="imgthree" src="../../../../../static/img/addtemp.png"/></span>
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
            </div>
            <div class="footer">
                <img @click="btnAction" src="../../../../../static/img/renzhengduibi.png"/>
                <img @click="btnAction" src="../../../../../static/img/fangzhuichaxun.png"/>
            </div>
        </div>
    </div>
</template>

<script>
    import pressStaff from '../../../../components/personInfoEntering/pressStaff'
    import bluetooth from '../../../../lib/bluetoothUtil'
    import { projectApi, machineApi, commonApi } from '../../../../api'

    let pickerDevice;
    export default {
        data() {
            return {
                list: [],
                projectId: '',
                projName: '',
                grouperId: '',
                showMachine: false,
                machineId: '',
                machineLabel: '选择考勤机',
                imUser: null,
                hasMachine: ''
            }
        }, components: {
            pressStaff
        },
        methods:{
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
            selectAction(){
                pickerDevice.open();
            },
            back(){
                projectApi.projEnterGroup(this.projectId).then((result)=>{
                    console.log("list: ",result.data);
                    this.list = result.data;
                })
            },
            addProjer(){
                console.log('项目id是多少:',this.projectId);
                if(this.projectId==0){
                    this.$router.load({url: '/company/addCompanyer'});    //添加企业管理员
                }else{
                    this.$router.load({url: '/company/phoneAdd/'+this.projectId+'/'+1});    //添加项目管理员
                }
            },
            addWorker(item){
                this.$router.load({url: '/company/phoneAdd/'+this.projectId+'/'+5});
                this.$store.state.groupId = item.id;
            },
            addTemper(){
                this.$router.load({url: '/company/phoneAdd/'+this.projectId+'/'+3});
            },
            btnAction(){
                this.$f7.alert('后续将开通此功能');
            }
        },
        created() {
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
            this.projectId = this.$route.params.id;
            this.projName = decodeURIComponent(this.$route.params.name);

            let that = this;
            projectApi.projEnterGroup(this.projectId).then((result)=>{
                console.log('projEnterGroup',result.data);
                that.list = result.data;
            });

            this.machineList().then((result)=>{
                console.log('考勤机',result);
                this.hasMachine = result.length;   //判断是否有考勤机绑定

                if(result.length === 0) {
                    that.showMachine = false;
                    return;
                }

                if(result.length === 1) {
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
                            values: result.map((item)=>{return item.id}),
                            displayValues: result.map((item)=>{return item.code.substr(-6, 6)})
                        }
                    ]
                });

            });
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .header{
        box-sizing: border-box; padding: 1rem 0 0.5rem 0.6rem; font-size: 0.7rem; color: #999; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .main2{
        width: 100%; margin-top: 0.5rem;
    }
    .main2 .nav{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; border-bottom: 1px solid #f4f4f4; background: #fff;
        font-size: 0.7rem; color: #999; box-sizing: border-box; padding: 0 0.6rem;
    }
    .main2 .nav div{
        text-align: center;
    }
    .main2 .aul{
        background: #f4f4f4;
    }
    .main2 .aul li{
        position: relative; box-sizing: border-box; padding: 0 0.6rem; margin-bottom: 0.25rem; background: #fff;
    }

    .list-block .item-content{
        padding: 0;
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

    .list-block{
        margin: 0; font-size: 0.7rem; color: #666;
    }

    .header span {
        position: absolute;
        right: 0.6rem;
        color: #438cff;
        z-index: 1;
    }
    .header img {
        width: 0.6rem;
        height: 0.6rem;
    }
    .header input {
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
    }

    .footer{
        height: 2.5rem; display: flex; justify-content: space-around; margin-top: 0.5rem; background: #fff;
    }
    .footer img{
        width: 4.2rem; height: 1.5rem; margin-top: 0.5rem;
    }
</style>