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
                            <span class="namePart" v-if="userInfo.name">{{userInfo.name}}</span>
                            <span class="namePart" v-else-if="userInfo.wxOpenid">{{userInfo.nickname}}</span>
                            <span class="namePart" v-else>{{userInfo.mobile}}</span>
                            <br/>
                            <span class="text-2" v-if="userInfo.name==null"><a href="/company/addIdentityCard/">去认证></a></span>
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
                    <a href="/company/staffSetting/">
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
    import unMyAttend from '../../../static/img/attendance_sidebar_unselected.png';
    import myAttend from '../../../static/img/attendance_sidebar_checked.png';
    import unPersonCenter from '../../../static/img/personal_sidebar_unselected.png';
    import personCenter from '../../../static/img/personal_sidebar_checked.png';
    import findJob from '../../../static/img/searchJob.png';
    import approve from '../../../static/img/approve.png';
    import { companyApi,userApi } from '../../api'

    export default {
        name: 'staff-nav',
        data(){
            return{
                indexAction: '',
                list: [
                    {name: '首页', img: unHomePic, img2: homePic, link: '/user/staffhome/'},
                    {name: '我的考勤', img: unMyAttend, img2: myAttend, link: '/user/myAttend/'},
                    {name: '个人中心', img: unPersonCenter, img2: personCenter, link: '/user/personCenter/'},
                    {name: '找工作', img: findJob, img2: findJob, link: '/user/workSearchJob/'},
                    // {name: '审批申请', img: approve, img2: approve, link: '/user/approveApply/'}
                ],
                userInfo:{},
                companyName:''
            }
        },
        methods:{
            bgAction(index){
                this.indexAction = index;
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
            console.log('geren详情'+JSON.stringify(this.userInfo));
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
        margin-top: 0.25rem; display: inline-block;
    }
    .content-block .common-header .common-nav .common-text .text-2 a{
        font-size: 0.6rem; color: #005499;
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
    .content-block .item2 img{
        width: 1.5rem; height: 1.5rem; margin-top: 0.45rem;
    }
    .content-block .item2 span{
        display: inline-block; transform: translateY(-0.5rem); color: #666;
    }
</style>