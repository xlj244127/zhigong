<template>
    <div class="page" @page:reinit="back">
        <!---侧边栏--->
        <proj-admin v-if="companyRole==2"></proj-admin>
        <company-nav v-else></company-nav>

        <div class="page-content">
            <div class="logo" style="background-image: url('./static/img/home_Imge.png');">
                <!-- If no data-panel attribute, Left panel will be opened by default -->
                <a href="#" class="open-panel"><img class="left" src="../../../static/img/baisechebianlan.png" /></a>
                <!-- Click on link with "open-panel" and data-panel="right" attribute will open Right panel -->
                <scan-icon></scan-icon>

                <div class="img">
                    <img :src="logo"/>
                </div>
            </div>

            <no-company v-if="companyId==0"></no-company>
            <div v-else-if="companyRole==1">
                <have-attendance :companyName="companyName"></have-attendance>
                <!--<no-attendance :companyName="companyName" v-else></no-attendance>-->
            </div>
            <div v-else-if="companyRole==2">
                <have-attend :companyName="companyName"></have-attend>
                <!--<no-attend :companyName="companyName" v-else></no-attend>-->
            </div>
            <div v-else-if="companyRole==3" class="switch text-center">
                <div>您是项目员工，请切换到员工界面</div>
                <div><button class="button button-fill button-big" @click="switchToStaff" id="switchToStaff">切换到员工界面</button></div>
            </div>
            <div class="loading" v-else>
                <i class="fa fa-spinner fa-pulse fa-5x fa-fw color-blue"></i>
            </div>

        </div>
    </div>
    
</template>

<script  type="text/ecmascript-6">
    import { companyApi } from '../../api'
    import { projectApi } from '../../api'
    import { userApi, machineApi } from '../../api'
    import { statisticalSummaryApi } from '../../api'
    import { LocalCache } from '../../lib/utils'
    import offlineUtil from '../../lib/offlineUtil'
 	import scanIcon from '../../components/scan-icon/scanIcon'
    // 侧边栏引入
    import companyNav from '../../components/broadside-navigation/companyAdmin'
    import projAdmin from '../../components/broadside-navigation/projAdmin'

    import noCompany from '../../components/company-home/noCompany'
    import noAttendance from '../../components/company-home/noAttendance'
    import haveAttendance from '../../components/company-home/haveAttendance'
   
    import haveAttend from '../../components/proj-home/haveAttend'
    import noAttend from '../../components/proj-home/noAttend'

    let $$ = Dom7;
    let locked = false;

    export default {
        data(){
            return{
                companyId: null,
                companyRole: '',
                projectId: '',
                logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUI3NTRGMUNGRTc1MTFFNzgzRUNDNkVCRERBOEE5NzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUI3NTRGMURGRTc1MTFFNzgzRUNDNkVCRERBOEE5NzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxQjc1NEYxQUZFNzUxMUU3ODNFQ0M2RUJEREE4QTk3NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxQjc1NEYxQkZFNzUxMUU3ODNFQ0M2RUJEREE4QTk3NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpD0qCcAAAFDSURBVHja7JpBDoIwEEUF9Dq49BSew8TEMxjPQGLiOTyFSzmOxuIsZkVSpUJLbd8kky6cQB/TTv8gRdd1i5ysXGRmAAMMMMAAAxyRLYcGbo7Xuwy1x7m04mvbj7fTNniGa88Pv2ZJz7mke1ZMOIegYp4qDTDAAAOcMnAj/tKjxeYvjUsCeDfgGqXGJQF8ETdfYozGRWHF0LeW0jx0ESutVpqLdU5Fqw61pLNpHrxtMZd+uLfNyDDACA+ER3rCYyzwQbzS6mrzSuPGbJuHVOQmBuAQthdf6ZgFcDnlXDmWAAYY4eFbeJjemLzwOIs/dZy9PTyMFBWD72H5u9Ro0kyoDM9tztlf/jOtZN15hXEsAQzwf9uvRcvXZwrW60o//OmcP2sByyLDTkrOBbiNFNhJyRV8EQ8wwAADDDDAAAPsyd4CDABe+mFwR72ukgAAAABJRU5ErkJggg==',
                companyName: '',
                projectName: '',
                mobile: '',
                userId: '',
                offlineModeEnabled: false
            }
        },
        components: {
            companyNav, projAdmin, noCompany, noAttendance, haveAttendance, scanIcon, haveAttend, noAttend
        },
        methods:{
            back(){
                userApi.information().then((result)=>{
                    console.log(result.data);
                    this.$store.state.roleInfo = result.data;
                    this.companyId = result.data.companyId;
                    this.companyRole = result.data.companyRole;
                    this.projectId = result.data.projectId;
                    if(this.companyId > 0) {
                        this.getSummary();
                    }
                });
                //判断离线状态是否改变
                if(this.offlineModeEnabled != offlineUtil.isOfflineModeEnabled()) {
                    this.offlineModeEnabled = offlineUtil.isOfflineModeEnabled();
                    if(this.companyRole == 2 && offlineUtil.isOfflineModeEnabled()) {
                        this.machineList().then((result)=>{
                            if(result.length > 0) {
                                let machines = result.map(item=>item.code);
                                this.offlineScan(machines);
                            }
                        });
                    }
                }

                if(this.offlineModeEnabled)
                    locked = false;
                else
                    locked = true;
            },
            switchToStaff() {
                LocalCache.set('isAdmin', false);
                window.location.reload();
            },
            switchOffline(offlineEnabled) {
                console.log(offlineEnabled);
            },
            getSummary() {
                companyApi.companyInfo(this.companyId).then((result)=>{
                    console.log("companyApi",result);
                    this.logo = result.data.logo;
                    this.companyName = result.data.name;
                    this.mobile = result.data.mobile;
                    this.userId = result.data.creatorId;
                })
            },
            machineList() {
                let that = this;
                return new Promise((resolve, reject) => {
                    if(typeof that.$store.state.machineList !== 'object')
                        that.$store.state.machineList = {};
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
            offlineScan(machines) {
                console.log(machines);
                offlineUtil.connect(machines).then((result)=>{
//                offlineUtil.connect(['YWe685412785d9d774']).then((result)=>{
                    if (locked) return;

                    locked = true;
                    let mainView = window.f7.getCurrentView(0);
                    mainView.router.loadPage('/company/offLineMode');

//                    console.log('Connect result:' + JSON.stringify(result));
//                    return offlineUtil.sendFile('face.zip', (progress)=>{
//                        console.log('上传进度：' + progress);
//                    });

//                    return offlineUtil.receiveFile('attend.zip', (progress)=>{
//                        console.log('接收进度：' + progress);
//                    });
                }, (error)=>{
                    console.log('Error: ' + JSON.stringify(error));
                    $$('.modal-after-text').addClass('color-error').html('连接考勤机错误');
                })
//                    .then(()=>{
//                    console.log('Upload successfully.');
//                }, (error)=>{
//                    console.log('Download Error: ' + JSON.stringify(error));
//                    $$('.modal-after-text').addClass('color-error').html('下载保存考勤数据错误');
//                });
            }
        },
        mounted(){
            let that = this;
            userApi.information().then((result)=>{
                console.log(result.data);
                that.$store.state.roleInfo = result.data;
                that.companyId = result.data.companyId;
                that.companyRole = result.data.companyRole;
                that.projectId = result.data.projectId;
                if(that.companyId > 0) {
                    that.getSummary();
                }
                //离线功能，只有项目管理员才有离线功能
                that.offlineModeEnabled = offlineUtil.isOfflineModeEnabled();
                if(that.companyRole == 2 && offlineUtil.isOfflineModeEnabled()) {
                    that.machineList().then((result)=>{
                        if(result.length > 0) {
                            let machines = result.map(item=>item.code);
                            that.offlineScan(machines);
                        }
                    });
                }
            })
        }
    }
</script>

<style scoped>
    /*主页面类容*/
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .logo{
        width: 100%; height: 11.8rem; background-size: 100% 100%; background-image: url('../../../static/img/home_Imge.png');
        position: relative;
    }
    .logo a img{
        width: 1.5rem; height: 1.5rem; position: absolute; top: 0.5rem;
    }
    .logo a .left{
        left: 0.5rem;
    }
    .img{
        width: 4.5rem; height: 4.5rem; border: 1px solid gray; border-radius: 50%;
        position: absolute;  background: #fff;
        top: 50%;
        left: 50%;
        margin-top: 3.2rem;
        margin-left: -2.25rem;
        overflow: hidden;
    }
    .img img{
        width: 4.5rem; height: 4.5rem; border-radius: 50%;
    }
    .switch {
        padding-top: 3rem;
    }
    #switchToStaff {
        display: inline-block;
        margin-top: 0.5rem;
        width: 50%;
    }
    .loading {
        margin-top: 4rem;
        text-align: center;
    }
</style>