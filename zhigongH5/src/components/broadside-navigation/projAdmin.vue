<template>
    <div>
        <!-- Panels Overlay 空白处点击事件-->
        <div class="panel-overlay"></div>
        <!-- Left Panel with Reveal effect 左侧侧边栏-->
        <div class="panel panel-left panel-cover">
            <div class="content-block">
                <div class="common-header">
                    <div class="common-nav">
                        <div class="imgBox">
                            <img :src="userInfo.avatar"/>
                        </div>
                        <p class="common-text">
                            <span class="namePart" v-if="userInfo.name!==null">{{userInfo.name}}</span>
                            <span class="namePart" v-else-if="userInfo.wxOpenid!==null">{{userInfo.nickname}}</span>
                            <span class="namePart" v-else>{{userInfo.mobile}}</span>
                            <br/>
                            <span class="text-2" @click="enterIdCart" v-if="userInfo.name==null">去认证></span>
                        </p>
                    </div>
                    <p class="common-tst">{{companyName?companyName:'暂无公司'}}</p>
                </div>
                <div class="item">
                    <ul>
                        <li v-for="(one, index) in list" @click="bgAction(index)" ><!--:class="{active: indexAction==index}"-->
                            <a href="javascript:;" @click="reloadFunc(one.link)" class="close-panel">
                                <img :src="one.img"/><!--indexAction==index?one.img2:one.img-->
                                <span >{{one.name}}</span><!--:class="{active: indexAction==index}"-->
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="item2">
                    <a href="/company/adminSetting/">
                        <img src="../../../static/img/set_sidebar.png"/>
                        <span>设置</span>
                    </a>
                    <a href="/company/callCenter/">
                        <img src="../../../static/img/service_sidebar.png"/>
                        <span>客服</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script  type="text/ecmascript-6">
    import unHomePic from '../../../static/img/home_sidebar_unselected.png';
    import homePic from '../../../static/img/home_sidebar_checked.png';
    import unProjectManagementPic from '../../../static/img/project_sidebar_unselected.png';
    import projectManagementPic from '../../../static/img/project_sidebar_checked.png';
    import unAttendanceManagementPic from '../../../static/img/attendance_sidebar_unselected.png';
    import attendanceManagementPic from '../../../static/img/attendance_sidebar_checked.png';
    import unDeviceManagementPic from '../../../static/img/shebei-icon.png';
    import deviceManagementPic from '../../../static/img/shebei-icon.png';
    import unblacklist from '../../../static/img/blacklist_sidebar_unselected.png';
    import blacklist from '../../../static/img/blacklist_sidebar_checked.png';
    import unInformationInputPic from '../../../static/img/approved_sidebar_unselected.png';
    import informationInputPic from '../../../static/img/approved_sidebar_unselected.png';
    import offLineMode from '../../../static/img/langya2.png';
    import yonggongguanli from '../../../static/img/yonggongguanli.png';
    import approve from '../../../static/img/approve.png';
    import unPermissionSettingPic from '../../../static/img/quanxian-icon.png';
    import { companyApi,userApi } from '../../api'

    export default {
        name: 'proj-admin',
        data(){
            return{
                indexAction: '',
                list: [
                    {name: '首页', img: unHomePic, img2: homePic, link: '/user/adminhome/'},
                    {name: '考勤管理', img: unAttendanceManagementPic, img2: attendanceManagementPic, link: '/project/attendManage/'},
                    {name: '项目管理', img: unProjectManagementPic, img2: projectManagementPic, link: '/project/projManage/'},
                    {name: '信息录入', img: unInformationInputPic, img2: informationInputPic, link: '/project/infoEntering/'},
                    {name: '劳务招工', img: yonggongguanli, img2: yonggongguanli, link: '/company/laborManagement/'},
                    {name: '黑名单管理', img: unblacklist, img2: blacklist, link: '/company/blackListManage/'},
                    {name: '设备管理', img: unDeviceManagementPic, img2: deviceManagementPic, link: '/company/equipManage/'},
                    // {name: '权限设置', img: unPermissionSettingPic, img2: unPermissionSettingPic, link: '/project/projPermSetting/'},
                    {name: '审批管理', img: approve, img2: approve, link: '/company/approve/'},
                    // {name: '离线模式', img: offLineMode, img2: offLineMode, link: '/company/offLineMode/'}
                ],
                userInfo:{},
                companyName:''
            }
        },

        methods:{
            enterIdCart(){
                this.$router.load({url: '/company/addIdentityCard/'});
            },
            bgAction(index){
                this.indexAction = index;
                console.log(this.indexAction);
            },
            reloadFunc(link){
                console.log(Dom7('.panel-overlay').length);
                f7.closePanel();
                setTimeout(function () {
                    let mainView = window.f7.getCurrentView(0);
                    mainView.router.reloadPage(link);
                },450)
            }
        },
        mounted(){
            this.userInfo = this.$store.state.userInfo;
            userApi.information().then((result)=>{
                this.companyId = result.data.companyId;
                if(this.companyId != 0){
                    companyApi.companyInfo(this.companyId).then((res)=>{
                        //console.log("res",res.data);
                        this.companyName = res.data.name;
                    })
                }else{
                    this.companyName = null
                }
            });
        }
    }
</script>

<style scoped>
    /*侧边栏*/
    .panel.panel-left.panel-cover{
        background: #fff;
    }
    .content-block{
        margin: 0; padding: 0; margin-top: 1.8rem;
    }
    .content-block .common-header{
        display: block;
    }
    .content-block .common-header .common-nav{
        display: flex; padding-left: 0.9rem;
    }
    .content-block .common-header .common-tst{
        padding-left: 1.25rem;
    }
    .content-block .common-header .common-nav .imgBox{
        width: 60px;
        height: 60px;
        border: 1px solid #ddd;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }
    .content-block .common-header .common-nav img{
        width: 60px;
        height: 60px;
    }
    .content-block .common-header .common-nav .common-text{
        padding: 0.25rem 0 0 0.6rem;
        overflow: hidden;
        width: 100%;
    }
    .content-block .common-header .common-nav .common-text .namePart{
        width: 90%;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: block;
        float: right;
        padding-right: 10%;
    }
    .content-block .common-header .common-nav .common-text .text-1{
        font-size: 0.7rem;
    }
    .content-block .common-header .common-nav .common-text .text-2{
        font-size: 0.6rem; color: #005499; margin-top: 0.25rem; display: inline-block;
    }
    .content-block .item{
        border-top: 1px solid #f4f4f4;
    }
    .content-block .item ul{
        padding: 0; margin: 0;
    }
    .content-block .item ul li{
        padding-left: 1.25rem; width: 100%; height: 2.5rem; box-sizing: border-box;
    }
    .content-block .item ul li.active{
        background: #f2f9ff;
    }
    .content-block .item ul li a{
        width: 100%; height: 100%; display: block; line-height: 2.5rem;
    }
    .content-block .item ul li a img{
        width: 1.5rem; height: 1.5rem; margin-top: 0.45rem;
    }
    .content-block .item ul li a span{
        display: inline-block; transform: translateY(-0.5rem); color: #666;
    }
    .content-block .item ul li a span.active{
        color: #367eb2;
    }
    .content-block .item2{
        width: 100%; height: 2.5rem; display: flex; box-sizing: border-box; padding-left: 1.25rem; position: fixed;
        left: 0; bottom: 0; border-top: 1px solid #f4f4f4;
    }
    .content-block .item2 a{
        width: 50%; height: 100%; display: block;
    }
    .content-block .item2 a img{
        width: 1.5rem; height: 1.5rem; margin-top: 0.45rem;
    }
    .content-block .item2 a span{
        display: inline-block; transform: translateY(-0.5rem); color: #666;
    }
</style>