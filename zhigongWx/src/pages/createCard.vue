<template>
    <div data-page="createCard" class="page navbar-fixed toolbar-fixed createCard" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">工人名片</div>
            </div>
        </div>
        <div class="page-content">
            <div class="avatarPart">
                <img class="part" src="../../static/img/edit_resume_bg.png"/>
                <div class="avatar">
                    <img :src="avatar" alt="">
                </div>
            </div>
            <div class="tip">
                * 完善您的工人简历，找活更方便
            </div>
            <div class="cardList">
                <div class="cardItem">
                    <div class="fl icon"><img src="../../static/img/search_chenghu.png" alt="" /></div>
                    <div class="fl cardName">称　　呼</div>
                    <div class="fl cardMain">{{toNull(userCard.displayName)}}</div>
                </div>
                <div class="cardItem">
                    <div class="fl icon"><img src="../../static/img/search_dianhua.png" alt="" /></div>
                    <div class="fl cardName">联系电话</div>
                    <div class="fl cardMain">{{toNull(userCard.user.contact)}}</div>
                </div>
                <div class="cardItem ">
                    <div class="fl icon"><img src="../../static/img/search_biaoqian.png" alt="" /></div>
                    <div class="fl cardName">工种标签</div>
                    <div class="fl cardMain cardScroll" v-if="workTypeListExist">
                        <span class="tagItem" v-for="(item,index) in userCard.workTypeList"><span class="workerType">{{item.workerType}}</span><span class="workerSize">{{item.workerSize}}</span></span>
                    </div>
                    <div class="fl cardMain cardScroll" v-else>--</div>
                </div>
                <div class="cardItem">
                    <div class="fl icon"><img src="../../static/img/search_jingyan.png" alt="" /></div>
                    <div class="fl cardName">工作经验</div>
                    <div class="fl cardMain">{{toNull(userCard.user.workingExp)}}年</div>
                </div>
                <div class="cardItem">
                    <div class="fl icon"><img src="../../static/img/search_birthplace.png" alt="" /></div>
                    <div class="fl cardName">籍　　贯</div>
                    <div class="fl cardMain" v-show="userCard.nativeProvinceName==userCard.nativeCityName">{{toNull(userCard.nativeProvinceName)}}</div>
                    <div class="fl cardMain" v-show="userCard.nativeProvinceName!=userCard.nativeCityName">{{userCard.nativeProvinceName}}--{{userCard.nativeCityName}}</div>
                </div>
            </div>
            <div class="cardList mt5">
                <div class="cardItem">
                    <div class="fl icon"><img src="../../static/img/search_didian.png" alt="" /></div>
                    <div class="fl cardName">工作地点</div>
                    <div class="fl cardMain" v-show="userCard.user.province==userCard.user.city">{{userCard.user.province}}</div>
                    <div class="fl cardMain" v-show="userCard.user.province!=userCard.user.city">{{userCard.user.province}}--{{userCard.user.city}}</div>
                </div>
                <div class="cardItem">
                    <div class="fl icon"><img src="../../static/img/search_riqi.png" alt="" /></div>
                    <div class="fl cardName">空闲预期</div>
                    <div class="fl cardMain" v-if="userCardExist">{{userCard.expectTime}}</div>
                    <div class="fl cardMain" v-else>--</div>
                </div>
                <div class="cardItem ">
                    <div class="fl icon"><img src="../../static/img/search_xinzi_big.png" alt="" /></div>
                    <div class="fl cardName">期望薪资</div>
                    <div class="fl cardMain" v-if="userCardExist">{{userCard.salary}}{{salaryType}}</div>
                    <div class="fl cardMain" v-else>--</div>
                </div>
                <div class="cardItem">
                    <div class="fl icon"><img src="../../static/img/search_daiyu.png" alt="" /></div>
                    <div class="fl cardName">待遇需求</div>
                    <div class="fl cardMain" v-if="userCardExist">{{toNull(treatmentLabels)}}</div>
                    <div class="fl cardMain" v-else>--</div>
                </div>
                <div class="cardItem">
                    <div class="fl icon"><img src="../../static/img/search_remark.png" alt="" /></div>
                    <div class="fl cardName">个人说明</div>
                    <div class="fl cardMain" v-if="userCardExist">{{toNull(userCard.user.remark)}}</div>
                    <div class="fl cardMain" v-else>--</div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div @click="editResume" class="f-1">
                <span>编辑</span>
            </div>
            <div class="f-1" @click="makerIdCard">
                <span >生成名片</span>
            </div>
        </div>

    </div>
</template>

<script>
    var $$ = Dom7;
    import { LocalCache } from "../lib/utils";
    import { wxApi,userApi } from "../api";
    import moment from "moment";
    export default {
        name: "createCard",
        data() {
            return {
                userId:"",
                workerTitle: [],
                userCard:{
                    displayName:'--',
                    user:{
                        workingExp:'--',
                        contact:'--',
                        city:'-',
                        province:"-",
                        workTypeList:[],
                        treatments:[]
                    }
                },
                avatar: '',
                workTypesCode:[],
                littleBigsCode:[],
                workTypes:[],
                littleBigs:[],
                salaryType:'',
                treatment:[],
                treatmentLabels:[],
                workTypeList:[],
                userCardExist:false,
                editStatus:0,
                workTypeListExist:false,
            }
        },
        components:{
        },
        methods: {
            makerIdCard(){
                this.$router.load({url: '/user/businessCard/'+this.userId});

            },
            toNull(val){
                if(val==""||val==undefined || val==null){
                    return "--"
                }  else {
                    return val
                }
            },
            editResume(){
                this.$router.load({url: '/user/editResume/'+this.userId+'/'+this.editStatus});
            },
            back(){
                this.getData()
            },
            getData(){
                let userInfo = LocalCache.get("userInfo")
                this.userId = userInfo.id
                wxApi.userInfo(this.userId).then((res)=>{
                    console.log("userInfo",res);
                    if( res.data!=null ){
                        this.userCardExist = true
                        let resData = res.data
                        this.userCard = resData
                        this.avatar = resData.user.avatar
                        this.userCard.user.salary = resData.salary
                        this.userCard.user.salaryType = resData.salaryType
                        this.userCard.user.avatar = resData.user.avatar
                        if(resData.user.avatar){
                            this.avatar = resData.user.avatar+'?'+Math.random();
                        }else{
                            this.avatar = userInfo.avatar
                        }
                        this.workTypesCode = resData.workTypes.split(",")
                        this.littleBigsCode = resData.littleBigs.split(",")
                        this.userCard.expectTime  = moment(resData.expectTime).format('YYYY-MM-DD')+'起'
                        for(var i=0;i<this.workTypesCode.length;i++){
                            if(this.littleBigsCode[i]==0){
                                this.littleBigs.push("大工")
                            }else if(this.littleBigsCode[i]==1){
                                this.littleBigs.push("小工")
                            }
                        }
                        if(resData.user.avatar){
                            this.avatar = resData.user.avatar
                        }else{
                            this.avatar = userInfo.avatar
                        }
                        if(resData.salaryType == 1){
                            this.salaryType ="/每天"
                        }else if(resData.salaryType == 2) {
                            this.salaryType ="/每小时"
                        }else if(resData.salaryType == 4) {
                            this.salaryType ="/每月"
                        }else if(resData.salaryType == 5) {
                            this.salaryType ="/每平方"
                        }else{
                            this.salaryType ="面议"
                            this.salary =""
                        }
                        this.userCard.treatments = this.userCard.treatments.split(',')
                        wxApi.getTreatments().then((result)=>{
                            this.treatment = result.data;
                            this.$store.state.treatment = this.treatment;
                            this.treatmentLabels = []
                            if(this.userCard.treatments[0]!=""){
                                for(var j=0;j<this.userCard.treatments.length;j++){
                                    console.log('treatmentLabels',this.treatment[this.treatment.findIndex(v => v.code == this.userCard.treatments[j])].value,this.treatmentLabels);
                                    this.treatmentLabels.push(this.treatment[this.treatment.findIndex(v=>v.code==this.userCard.treatments[j])].value)
                                }
                                this.treatmentLabels = this.treatmentLabels.join('、')
                            }else{
                                this.treatmentLabels = ""
                            }
                            this.userCard.treatments = this.treatmentLabels
                        })
                        //console.log(resData.workTypes.split(','));
                        //let workTypeList = LocalCache.get("workTypeList")
                        this.workTypeList = []
                        if(resData.workTypes.split(',')[0]!=""){
                            for(var k=0;k<resData.workTypes.split(',').length;k++){
                                console.log(this.workerTitle.findIndex(v => v.code == resData.workTypes.split(',')[k]));
                                let obj={
                                    workerType:this.workerTitle[this.workerTitle.findIndex(v=>v.code==resData.workTypes.split(',')[k])].value,
                                    workerTypeCode:this.workTypesCode[k],
                                    workerSize:this.littleBigs[k],
                                    workerSizeCode:this.littleBigsCode[k],
                                }
                                this.workTypeList.push(obj)
                                this.userCard.workTypeList = this.workTypeList
                            }
                            this.workTypeListExist = true
                        }else{
                            this.workTypeListExist = false
                        }
                        this.$store.state.userCard = this.userCard;
                        this.editStatus = 1
                    } else {
                        //console.log('个人详情');
                        this.userCard.treatments="--";
                        this.userCardExist = false
                        this.editStatus = 0
                        this.avatar  = userInfo.avatar
                        this.userCard.displayName  = userInfo.name
                        this.userCard.user.contact = userInfo.mobile
                        this.userCard.user.province= userInfo.province
                        this.userCard.user.provinceId= userInfo.provinceId
                        this.userCard.user.city    = userInfo.city
                        this.userCard.user.contact = userInfo.mobile
                        this.userCard.user.cityId  = userInfo.cityId
                        this.userCard.user.workingExp = userInfo.workingExp
                        let workTypeList = this.$store.state.workerTitle,littleBigLabel,workerSizeCode;
                        this.userCard.workTypeList = []
                        if(userInfo.workType!=null){
                            if(userInfo.littleBig==null||userInfo.littleBig==0){
                                littleBigLabel = "大工";
                                workerSizeCode = 0
                            }else{
                                littleBigLabel = "小工"
                                workerSizeCode = 1
                            }
                            let obj={
                                workerType:workTypeList[workTypeList.findIndex(v=>v.code==userInfo.workType)].value,
                                workerTypeCode:userInfo.workType,
                                workerSize:littleBigLabel,
                                workerSizeCode:workerSizeCode
                            }
                            this.workTypeListExist = true
                            this.userCard.workTypeList.push(obj)
                        }else{
                            this.workTypeListExist = false
                        }
                        this.$store.state.userCard = this.userCard;

                    }
                    //console.log("editStatus",this.userCard);
                }).catch((res)=>{
                    console.log("error", res);
                })
            }
        },
        beforeMount(){
            this.getData()

            if(this.$store.state.workerTitle){
                this.workerTitle = this.$store.state.workerTitle;
            }else{
                tabulateStatisticsApi.typeSort('workType').then((result)=> {
                    this.workerTitle = result.data.list.reverse();
                    this.$store.state.workerTitle = this.workerTitle;
                    console.log(this.workerTitle);
                })
            }
        },
        mounted(){
        }
    }
</script>

<style  scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .avatarPart{
        width: 100%; height: 4.5rem; position: relative;
    }
    .avatarPart .part{
        width: 100%; height: 100%; display: block;
    }
    .avatar{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3rem;
        height: 3rem;
        background: #ffffff;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        overflow: hidden;
        margin-top: -1.5rem;
        margin-left: -1.5rem;
    }
    .avatar img{
        width: 3rem;
        height: 3rem;
    }
    .tip{
        font-size: 12px;
        line-height: 22px;
        text-align: center;
        color: #aeaeae;
    }
    .cardList .cardItem{
        clear: both;
        zoom: 1;
        height: 45px;
        line-height: 44px;
        background: #ffffff;
    }
    .cardItem .icon{
        width: 44px;
        height: 44px;
        display: block;

    }
    .cardItem .icon img{
        width: 24px;
        height: 24px;
        padding-top: 10px;
        padding-left: 10px;
    }
    .cardList .cardItem .fl{
        float: left;
    }
    .cardName,.cardMain{
        height: 44px;
        border-bottom: 1px solid #E1E1E1;
    }
    .cardName {
        width: 25%;
        color: #666666;
        font-size: 16px;
    }
    .cardItem:last-child .cardName,.cardItem:last-child .cardMain{
        border-bottom: none ;
    }
    .cardMain{
        width: calc(75% - 44px);
    }
    .cardScroll{
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
    }
    .tagItem{
        -webkit-border-radius: 15px;
        -moz-border-radius: 15px;
        border-radius: 15px;
        padding: 3px 6px;
        line-height: 16px;
        display: inline;
        margin-right: 6px;
        border: 1px solid #ddd;
        margin-top:  10px;
    }
    .tagItem  .workerType{
        font-size: 14px;
        color: #7e91b6;
        padding-right: 4px;
        border-right: 1px solid #ddd;

    }
    .tagItem  .workerSize{
        font-size: 12px;
        color: #B4C1DA;
        padding-left: 4px;
    }
    .mt5{
        margin-top: 5px;
    }
    .cardList.mt5{
        padding-bottom: 2.5rem;
    }
    .footer{
        width: 98%; height: 2.5rem; background: #fff; margin-top: 1.7rem; overflow: hidden;
        padding-left: 2%;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 666;
    }
    .footer .f-1{
        margin-left: 4%; width: 42%;
        display: inline-block;
        height: 1.5rem; line-height: 1.5rem; text-align: center; border-radius: 5px; color: #fff; background: #F5921E; margin-top: 0.4rem;
    }
    .navbar .right{
        font-size: .7rem;
        color: #438cff;
    }
</style>