<template>
    <div data-page="myLaborDemand" class="page navbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">我的用工需求</div>
                <div class="right" @click.stop.prevent="orderAction">
                    <span>日期</span>
                    <img src="../../../../../static/img/reserve_icon.png"/>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="ipt">
                <a href="/company/searchPage/">
                    <input placeholder="请输入项目名称搜索" type="text" readonly/>
                    <span class="sub">搜索</span>
                    <img src="../../../../../static/img/icon_search.png"/>
                </a>
                <div class="right" @click="operationAction">管理</div>
            </div>

            <div class="box" v-for="(item, index) in needWorkerList">
                <div class="top" v-show="isShow==true">
                    <div class="right" @click.stop.prevent="deleteAction(item.batchNumber)">
                        <img src="../../../../../static/img/grayDelete_icom.png"/>
                    </div>
                    <div class="right right2" @click.stop.prevent="editAction(item)">
                        <img src="../../../../../static/img/grayEdit_icom.png"/>
                    </div>
                </div>
                <div class="sit">
                    <div class="ent">
                        <img class="st" src="../../../../../static/img/wendan.png"/>
                        <div class="st2">
                            <div class="skew">
                                <div class="skew-main">{{item.workDemandList[0].title?item.workDemandList[0].title:item.city.name+'招'+item.workDemandList[0].workTypeName}}</div>
                            </div>
                        </div>
                        <img class="st3" src="../../../../../static/img/shibianxin_icom.png"/>
                    </div>
                </div>
                <div class="tov">
                    <div class="shan">
                        <img class="one" src="../../../../../static/img/projrenzhen.png"/>
                        <img class="two" src="../../../../../static/img/projzhizhao.png"/>
                        <span class="three" v-if="item.workDemandList[0].cost">工程造价{{item.workDemandList[0].cost}}万</span>
                    </div>
                    <div class="xia">
                        <span>{{item.project.name}}</span>
                        <img src="../../../../../static/img/btn_drop_down.png"/>
                    </div>
                </div>
                <div class="single">
                    <div class="up">
                        <div class="left">
                            <img src="../../../../../static/img/recruit_time_worker.png" v-if="item.workDemandList[0].demandType==1"/>
                            <img src="../../../../../static/img/recruit_contractor.png" v-else-if="item.workDemandList[0].demandType==2"/>
                            <img src="../../../../../static/img/recruit_group.png" v-else-if="item.workDemandList[0].demandType==3"/>
                            <img src="../../../../../static/img/recruit_worker.png" v-else-if="item.workDemandList[0].demandType==4"/>
                            <img src="../../../../../static/img/zhaogong.png" v-else/>
                            <span>{{item.workDemandList[0].workTypeName}}</span>
                        </div>
                        <div class="left2">需求 <span class="f-2">|</span> <span class="f-3">{{item.workDemandList[0].demandAmount}}</span>人</div>
                        <div class="left3">
                            <span>{{item.workDemandList[0].salary}}{{item.workDemandList[0].salaryLabel}}</span>
                        </div>
                    </div>
                    <div class="cent">
                        <div class="left">
                            <span v-show="item.workDemandList[0].treatmentsName!=''" v-for="one in item.workDemandList[0].treatmentsName.split(',')">{{one}}</span>
                            <span v-show="item.workDemandList[0].tlementName">{{item.workDemandList[0].tlementName}}</span>
                        </div>
                        <div class="right">时间 <span>|</span> {{item.workDemandList[0].demandTime}}</div>
                    </div>
                    <div class="cent2">
                        <div class="left">材料 <span>|</span> {{toNull(item.workDemandList[0].materialReqName)}}</div>
                        <div class="right">设备 <span>|</span> {{toNull(item.workDemandList[0].deviceReqName)}}</div>
                    </div>
                    <div class="cent3" v-show="item.workDemandList[0].remark!=''">
                        <img src="../../../../../static/img/tonggao.png"/>
                        <div class="right">{{item.workDemandList[0].remark}}</div>
                    </div>
                    <div class="down">
                        <!--<div class="left">-->
                            <!--<div>是否接收班组联系</div>-->
                            <!--<div class="item-input">-->
                                <!--<label class="label-switch" @click="infoAction(index, item)">-->
                                    <!--<input v-if="item.workDemandList[0].canCall==true" class="lect" type="checkbox" checked>-->
                                    <!--<input v-if="item.workDemandList[0].canCall==false" class="lect" type="checkbox">-->
                                    <!--<div class="checkbox"></div>-->
                                <!--</label>-->
                            <!--</div>-->
                        <!--</div>-->
                        <div class="left">
                            发布日期: <span>{{item.workDemandList[0].createTime}}</span>
                        </div>
                        <div class="right">
                            <img src="../../../../../static/img/grayxiaodinwei2.png"/>
                            <span>{{item.project.location}}</span>
                        </div>
                    </div>
                    <div class="bott">
                        <div class="option" @click="refresh(item.batchNumber)">
                            <img src="../../../../../static/img/search_refresh.png" alt="">
                        </div>
                        <div class="right" @click="shareAction(item)">
                            <img src="../../../../../static/img/search_share.png"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--分享蒙尘-->
        <div class="pick" v-show="mencheng==1" @click="cancelAction"></div>
        <div class="pickDown" v-show="mencheng==1">
            <div class="top">分享到</div>
            <div class="cent">
                <div class="c-1" @click="weixinAction">
                    <img src="../../../../../static/img/weixin_icon.png"/>
                    <br/>
                    <span>微信好友</span>
                </div>
                <div class="c-1" @click="pengyouquanAction">
                    <img src="../../../../../static/img/pengyouquan_icon.png"/>
                    <br/>
                    <span>朋友圈</span>
                </div>
            </div>
            <div class="bott" @click.stop.prevent="hiddenAction">取消</div>
        </div>
    </div>
</template>

<script>
    var $$ = Dom7;
    import {userApi, tabulateStatisticsApi, wxApi} from "../../../../api";
    import {shareServer, shareAppid} from "../../../../config";
    import { LocalCache } from '../../../../lib/utils';
    import moment from 'moment';
    export default {
        data(){
            return{
                userId: '',
                companyId: '',
                workerTitle: '',
                needWorkerList: [],
                sort: '',
                order: false,
                isShow: false,    //点击管理后展示删除和编辑
                treatment: '',     //待遇条件
                mencheng: 0,
                projectToHire: {}  //分享链接标题信息
            }
        },
        methods:{
            back(){
                wxApi.lookNeedWorker(this.companyId).then((result)=>{
                    this.needWorkerList = result.data;
                    for(var i=0; i<this.needWorkerList.length; i++){
                        this.needWorkerList[i].workDemandList[0].createTime = moment(this.needWorkerList[i].workDemandList[0].createTime).format('YYYY-MM-DD');

                        if(this.needWorkerList[i].workDemandList[0].salaryType == 1){
                            this.needWorkerList[i].workDemandList[0].salaryLabel= "元/天"
                        }else if(this.needWorkerList[i].workDemandList[0].salaryType == 2){
                            this.needWorkerList[i].workDemandList[0].salaryLabel= "元/小时"
                        }else if(this.needWorkerList[i].workDemandList[0].salaryType == 4){
                            this.needWorkerList[i].workDemandList[0].salaryLabel= "元/月"
                        }else if(this.needWorkerList[i].workDemandList[0].salaryType == 5){
                            this.needWorkerList[i].workDemandList[0].salaryLabel= "元/平方"
                        }else{
                            this.needWorkerList[i].workDemandList[0].salaryLabel= "面议"
                        }
                    }
                    console.log('列表',this.needWorkerList);
                })
            },
            toNull(val){
                if(val==""||val==undefined || val==null){
                    return "--"
                }  else {
                    return val
                }
            },
            operationAction(){
                this.isShow = !this.isShow;
            },
            orderAction(){
                console.log('我点击了');
                this.order = !this.order;
                if(this.order){
                    this.sort = 'desc';
                }else{
                    this.sort = 'asc';
                }
                wxApi.lookNeedWorker(this.companyId, '', this.sort).then((result)=>{
                    this.needWorkerList = result.data;
                    for(var i=0; i<this.needWorkerList.length; i++){
                        this.needWorkerList[i].workDemandList[0].createTime = moment(this.needWorkerList[i].workDemandList[0].createTime).format('YYYY-MM-DD');

                        if(this.needWorkerList[i].workDemandList[0].salaryType == 1){
                            this.needWorkerList[i].workDemandList[0].salaryLabel= "元/天"
                        }else if(this.needWorkerList[i].workDemandList[0].salaryType == 2){
                            this.needWorkerList[i].workDemandList[0].salaryLabel= "元/小时"
                        }else if(this.needWorkerList[i].workDemandList[0].salaryType == 4){
                            this.needWorkerList[i].workDemandList[0].salaryLabel= "元/月"
                        }else if(this.needWorkerList[i].workDemandList[0].salaryType == 5){
                            this.needWorkerList[i].workDemandList[0].salaryLabel= "元/平方"
                        }else{
                            this.needWorkerList[i].workDemandList[0].salaryLabel= "面议"
                        }
                    }
                    console.log('列表',this.needWorkerList);
                })
            },
            deleteAction(batch){
                this.$f7.confirm('是否确认删除项目的用工需求?', ()=>{
                    wxApi.deleteNeedWorker(batch).then((result)=>{
                        console.log(result.data);
                        this.needWorkerList = this.needWorkerList.filter((res)=>{
                            return !(batch==res.batchNumber);
                        })
                    })
                })
            },
            editAction(item){
                this.$router.load({url: '/company/publicLaborDemand/'+1});
                this.$store.state.projNeedList = item;
            },
            infoAction(index, item){
                let is = $$('.lect').eq(index).prop('checked')
                console.log(is);
                wxApi.isContact(item.batchNumber, !is).then((result)=>{
                    console.log(result.data);
                })
            },
            cancelAction(){
                this.mencheng = 0;
            },
            hiddenAction(){
                this.mencheng = 0;
            },
            shareAction(item){
                this.mencheng = 1;
                console.log(item);
                this.projectToHire = {};
                let salary = '';
                if(item.workDemandList[0].salaryType==1){
                    salary = item.workDemandList[0].salary+'元/天';
                }
                if(item.workDemandList[0].salaryType==2){
                    salary = item.workDemandList[0].salary+'元/小时';
                }
                if(item.workDemandList[0].salaryType==3){
                    salary = item.workDemandList[0].salary;
                }
                if(item.workDemandList[0].salaryType==4){
                    salary = item.workDemandList[0].salary+'元/月';
                }
                if(item.workDemandList[0].salaryType==5){
                    salary = item.workDemandList[0].salary+'元/平方';
                }
                this.projectToHire = {
                    'title': item.workDemandList[0].title,
                    'projName': item.project.name,
                    'workTypeName': item.workDemandList[0].workTypeName,
                    'demandAmount': item.workDemandList[0].demandAmount,
                    'salary': salary,
                    'treatmentsName': item.workDemandList[0].treatmentsName,
                    'batchNumber': item.batchNumber
                }
                console.log('分享链接文字提示',this.projectToHire);
            },
            weixinAction(){
                this.mencheng = 0;
                Wechat.share({
                    message: {
                        title: this.projectToHire.title,
                        description: this.projectToHire.projName+'项目招'+this.projectToHire.workTypeName+this.projectToHire.demandAmount+', '+this.projectToHire.treatmentsName, // 分享描述
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Scene.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareProjRecruit%3fparams%3d"+this.userId+"_"+this.projectToHire.batchNumber+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                        },
                    },
                    scene: Wechat.Scene.SESSION   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            pengyouquanAction(){
                this.mencheng = 0;
                Wechat.share({
                    message: {
                        title: this.projectToHire.title,
                        description: this.projectToHire.projName+'项目招'+this.projectToHire.workTypeName+this.projectToHire.demandAmount+', '+this.projectToHire.treatmentsName, // 分享描述
                        thumb: "http://images.zhigongxx.com/logo.png",
                        mediaTagName: "余",
                        messageExt: "这是第三方带的测试字段",
                        messageAction: "<action>消息</action>",
                        media: {
                            type: Wechat.Type.WEBPAGE,
                            webpageUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+shareAppid+"&redirect_uri="+encodeURIComponent(shareServer)+"%2f%23%2fuser%2fshareProjRecruit%3fparams%3d"+this.userId+"_"+this.projectToHire.batchNumber+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
                        },
                    },
                    scene: Wechat.Scene.TIMELINE   // share to Timeline
                },function () {
                    console.log('请求成功');
                },function (reason) {
                    alert("Failed: " + reason);
                });
            },
            refresh(batchNumber){
                console.log(batchNumber);
                wxApi.refreshWorkDemandByBatch(batchNumber).then((res)=>{
                    console.log(res);
                    if(res.code == 0 ){
                        this.$f7.alert("刷新成功")
                    }
                })
            }
        },
        mounted(){
            this.userId = LocalCache.get('userInfo').id;
            console.log('用户id',this.userId);
            this.companyId = this.$store.state.roleInfo.companyId;
            //选择工种
            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=>{
                    this.workerTitle = result.data.list;
                    this.$store.state.workerTitle = this.workerTitle;
                    console.log(this.workerTitle);
                })
            }
            wxApi.lookNeedWorker(this.companyId).then((result)=>{
                this.needWorkerList = result.data;
                for(var i=0; i<this.needWorkerList.length; i++){
                    this.needWorkerList[i].workDemandList[0].createTime = moment(this.needWorkerList[i].workDemandList[0].createTime).format('YYYY-MM-DD');

                    if(this.needWorkerList[i].workDemandList[0].salaryType == 1){
                        this.needWorkerList[i].workDemandList[0].salaryLabel= "元/天"
                    }else if(this.needWorkerList[i].workDemandList[0].salaryType == 2){
                        this.needWorkerList[i].workDemandList[0].salaryLabel= "元/小时"
                    }else if(this.needWorkerList[i].workDemandList[0].salaryType == 4){
                        this.needWorkerList[i].workDemandList[0].salaryLabel= "元/月"
                    }else if(this.needWorkerList[i].workDemandList[0].salaryType == 5){
                        this.needWorkerList[i].workDemandList[0].salaryLabel= "元/平方"
                    }else{
                        this.needWorkerList[i].workDemandList[0].salaryLabel= "面议"
                    }
                }
                console.log('列表',this.needWorkerList);
            })

            if(this.$store.state.treatment){
                this.treatment = this.$store.state.treatment;
            }else{
                wxApi.getTreatments().then((result)=>{
                    console.log('待遇条件',result.data);
                    this.treatment = result.data;
                    this.$store.state.treatment = this.treatment;
                })
            }
        }
    }
</script>

<style scoped>
.navbar .right span{
    font-size: 0.7rem; color: #438CFF;
}
.navbar .right img{
    width: 0.75rem; height: 0.75rem; display: inline-block;
}
.page-content{
    width: 100%; height: 100%; background: #f4f4f4;
}
.ipt{
    width: 100%; height: 2.2rem; line-height: 2.2rem; background: #F4F4F4; box-sizing: border-box; padding: 0 0.6rem; display: flex;
}
.ipt a{
    width: 90%; height: 100%; display: inline-block; position: relative;
}
.ipt a input{
      width: 82%; height: 30px; line-height: 30px; border-radius: 0.75rem; border: 1px solid #F4F4F4; padding-left: 32px; box-sizing: border-box;
}
.ipt a .sub{
    font-size: 0.65rem; color: #666;
}
.ipt a img{
    width: 0.9rem; height: 0.9rem; position: absolute; left: 0.6rem; top: 13px;
}
.ipt .right{
    width: 45px; height: 30px; text-align: center; line-height: 30px; margin-top: 8px; background: #fff; border-radius: 0.75rem; font-size: 0.65rem; color: #666666;
}

.box{
    width: 94%; margin: 0 auto; background: #fff; margin-bottom: 0.6rem; border-radius: 2px; box-shadow: 4px 4px 4px 1px #e3e3e3;
}
.box .top{
    width: 100%; height: 25px; text-align: right; box-sizing: border-box; padding-right: 0.6rem; background: #fff;
    border-bottom: 1px solid #DDD;
}
.box .top .right{
    display: inline-block; height: 100%; margin-left: 20px;
}
.box .top .right img{
    width: 1.85rem; height: 0.55rem; margin-top: 7px;
}
.box .sit{
    width: 100%; height: 35px; background: #fff;
}
.box .sit .ent{
    width: 100%; text-align: center;
}
.box .sit .ent .st{
    width: 1rem; height: 1rem; display: inline-block; margin-top: 6px; transform: translateX(5px);
}
.box .sit .ent .st2{
    color: #fff; display: inline-block; transform: translateY(-8px); position: relative; z-index: 2;
}
.box .sit .ent .st2 .skew{
    height: 22px; background: #9FC6FC; color: #123f65; font-weight: 700; letter-spacing: 1px; font-size: 0.65rem; transform: skew(-15deg);
}
.box .sit .ent .st2 .skew .skew-main{
    transform: skew(15deg); padding: 0 7px; transform: translateY(4px);
}
.box .sit .ent .st3{
    width: 1.7rem; height: 1.4rem; display: inline-block; transform: translateX(-26px); position: relative; top: 2px;
}
.tov{
    width: 100%; height: 1.9rem; background: #F6FAFD; box-sizing: border-box; padding: 0 0.6rem;
}
.tov .shan{
    display: flex;
}
.tov .shan .one{
    width: 2.85rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
}
.tov .shan .two{
    width: 2.55rem; height: 0.65rem; display: inline-block; padding-right: 0.6rem;
}
.tov .shan .three{
    height: 0.65rem; display: inline-block; box-sizing: border-box; padding: 0 0.2rem; border: 1px solid #8E9223; border-radius: 1px; font-size: 0.4rem; color: #8E9223;
}
.tov .xia{
    width: 100%; font-size: 0.65rem; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 5px;
}
.tov .xia img{
    width: 0.6rem; height: 0.6rem; display: inline-block; transform: translateY(2px);
}

.single{
    width: 100%; box-sizing: border-box; padding: 0 0.6rem; background: #fff;
}
.single .up{
    width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
}
.single .up .left{
    display: inline-block; font-size: 0.75rem; color: #438CFF; font-weight: 700;
}
.single .up .left img{
    height: 0.75rem; display: inline-block; transform: translateY(2px);
}
.single .up .left2{
    font-size: 0.6rem; color: #666666;
}
.single .up .left2 .f-2{
    color: #ccc;
}
.single .up .left2 .f-3{
    color: #F13333; font-size: 0.75rem;
}
.single .up .left3 span{
    box-sizing: border-box; padding: 3px 4px; background: #F05A5A; border-radius: 1px; font-size: 0.6rem; color: #fff;
}
.single .cent{
    width: 100%; height: 30px; line-height: 30px; display: flex; justify-content: space-between;
}
.single .cent .left span{
    display: inline-block; height: 0.8rem; line-height: 0.8rem; box-sizing: border-box; padding: 0 6px; background: #EEEEEE;
    font-size: 0.55rem; color: #666; margin-right: 5px;
}
.single .cent .right{
    font-size: 0.6rem; color: #666;
}
.single .cent .right span{
    color: #ccc;
}
.single .cent2{
    width: 100%; height: 30px; line-height: 30px; display: flex; font-size: 0.6rem; color: #666;
}
 .single .cent2 .left{
    width: 50%;
}
.single .cent2 .right{
    width: 50%;
}
.single .cent2 .left span, .right span{
    color: #ccc;
}
.single .cent3{
    display: flex; background: #f4f8fd; box-sizing: border-box; padding: 6px 0;
}
.single .cent3 img{
    width: 0.55rem; height: 0.55rem; display: inline-block; transform: translateY(2px); padding-right: 4px;
}
.single .cent3 .right{
    font-size: 0.55rem; color: #333;
}

.single .down{
    width: 100%; height: 1.2rem; line-height: 1.2rem; display: flex; justify-content: space-between;
}
.single .down .left{
    display: flex; font-size: 0.55rem; color: #888;
}
.single .down .right span{
    font-size: 0.55rem; color: #888;
}
.single .down .right img{
    width: 0.5rem; height: 0.6rem; display: inline-block; transform: translateY(2px);
}
.single .bott{
    width: 100%; height: 1.2rem; line-height: 1.2rem; display: flex; justify-content: space-between;
}
.single .bott .left{
    font-size: 0.6rem; color: #999;
}
.single .bott .right{
    font-size: 0.55rem; color: #999;
}
.single .bott .right img{
    height: 1.1rem; display: inline-block; transform: translateY(2px);
}
.single .bott .option{
    width: 50%; font-size: 0.55rem; color: #999999; box-sizing: border-box; background: #fff;
    height: 1.1rem;
    padding-top: .1rem;
    padding-bottom: .1rem;
}
.single .bott .option img{
    height: 1.1rem; display: inline-block;
    vertical-align: middle;
}

/*微信分享*/
.pick{
    width: 100%; height: 100%; position: fixed; left: 0; top: 0; background: #000; opacity: 0.5; z-index: 666;
}
.pickDown{
    width: 94%; background: #fff; overflow: hidden; position: fixed; left: 3%; bottom: 1rem; z-index: 999; border-radius: 0.9rem;
}
.pickDown .top{
    width: 100%; margin-top: 25px; text-align: center; font-size: 0.75rem ; color: #333333;
}
.pickDown .cent{
    width: 100%; display: flex; font-size: 0.9rem; color: #F87474; margin-top: 25px;
}
.pickDown .cent .c-1{
    margin-left: 30px; font-size: 0.55rem; color: #666; text-align: center;
}
.pickDown .cent .c-1 img{
    width: 55px; height: 55px; display: inline;
}
.pickDown .bott{
    width: 100%; height: 44px; line-height: 44px; text-align: center; font-size: 0.75rem; color: #666666; border-top: 1px solid #f4f4f4; margin-top: 1rem;
}
</style>