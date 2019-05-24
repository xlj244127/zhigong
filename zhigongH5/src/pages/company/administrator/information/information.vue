<template>
    <div data-page="projManage" class="page navbar-fixed toolbar-fixed" @page:reinit="back">
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="open-panel">
                        <img class="left" src="../../../../../static/img/cebianlan_icom.png"/>
                    </a>
                </div>
                <div class="center">企业信息</div>
                <div class="right" v-if="!(companyId==0 || companyRole==3)">
                    <a href="/company/editCompanyInfo/">编辑</a>
                </div>
            </div>
        </div>
        <!---侧边栏--->
        <company-admin></company-admin>
        <!--页面主要类容-->
        <no-company v-if="companyId==0 || companyRole==3"></no-company>
        <div v-else class="page-content">
            <div class="nav">
                <div class="n-1" id="logo">
                    <img src="../../../../../static/img/icon_avatar_home.png" />
                </div>
            </div>
            <div class="infoMain">
                <ul class="aul">
                    <li>公司名称:<span>{{conpanyInfo.name}}</span></li>
                    <li>所属行业:<span>{{trade}}</span></li>
                    <li>用工规模:<span>{{scale}}</span></li>
                    <li>联系人:<span>{{conpanyInfo.contact}}</span></li>
                    <li>联系电话:<span>{{conpanyInfo.mobile}}</span></li>
                    <li>办公电话:<span>{{conpanyInfo.phone}}</span></li>
                    <li>联系邮箱:<span>{{conpanyInfo.email}}</span></li>
                    <li>公司官网:<span>{{conpanyInfo.homepage}}</span></li>
                </ul>
                <div class="footer">
                    <div class="f-1">公司详细地址:</div>
                    <div class="f-2">{{conpanyInfo.detailAddress}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script  type="text/ecmascript-6">
    import { companyApi } from '../../../../api'
    import { dviApi } from '../../../../api'
    import companyAdmin from '../../../../components/broadside-navigation/companyAdmin'
    import noCompany from '../../../../components/company-home/noCompany'

    let $$ = Dom7;
    export default {
        data(){
            return{
                tradeArr: [],       //tradeArr表示所有行业名称及id等，scaleArr只表示所有行业名称，tradeList只表示行业名称，scaleList只表示行业规模
                scaleArr: [],
                tradeList: [],
                scaleList: [],

                companyId: '',
                companyRole: '',
                conpanyInfo: {},
                trade: '',
                scale: '',
                logo: '../../../../../static/img/icon_avatar_home.png',
                companyId:''
            }
        },
        components: {
            companyAdmin,noCompany
        },
        methods:{
            back(){
                if(this.companyId != 0){
                    companyApi.companyInfo(this.companyId).then((result)=>{
                        console.log('公司信息');
                        console.log(result.data);
                        this.logo = result.data.logo;
                        this.$store.state.companyInfo = result.data;
                        this.conpanyInfo = result.data;
                        $$('#logo img').attr('src', result.data.logo);
                        if(this.$store.state.tradeList && this.$store.state.scaleList){
                            this.scaleList = this.$store.state.scaleList;
                            this.tradeList = this.$store.state.tradeList;
                            this.scale = this.scaleList[result.data.dimension - 1];
                            this.trade = this.tradeList[result.data.profession - 1];
                        }else{
                            //获取所属行业和用工规模
                            dviApi.getData('profession').then((res2)=>{
                                this.tradeArr = res2.data.list;
                                this.$store.state.tradeArr = this.tradeArr;
                                for(var i=0; i<this.tradeArr.length; i++){
                                    this.tradeList.unshift(this.tradeArr[i].value);
                                }
                                this.$store.state.tradeList = this.tradeList;
                                this.trade = this.tradeList[result.data.profession - 1];
                                console.log(this.tradeList);
                                console.log(result.data.profession);
                            })
                            dviApi.getData('CompanyDimension').then((res3)=>{
                                this.scaleArr = res3.data.list;
                                this.$store.state.scaleArr = this.scaleArr;
                                for(var i=0; i<this.scaleArr.length; i++){
                                    this.scaleList.unshift(this.scaleArr[i].value);
                                }
                                this.$store.state.scaleList = this.scaleList;
                                this.scale = this.scaleList[result.data.dimension - 1];
                                console.log(this.scaleList);
                                console.log(result.data.dimension);
                            })
                        }
                    })
                }

            }
        },
        mounted(){
            this.companyId = this.$store.state.roleInfo.companyId;
            this.companyRole = this.$store.state.roleInfo.companyRole;
            if(this.companyId!=0){
                companyApi.companyInfo(this.companyId).then((result)=>{
                    console.log('公司信息');
                    console.log(result.data);
                    this.logo = result.data.logo;
                    this.$store.state.companyInfo = result.data;
                    this.conpanyInfo = result.data;
                    $$('#logo img').attr('src', result.data.logo);
                    if(this.$store.state.tradeList && this.$store.state.scaleList){
                        this.scaleList = this.$store.state.scaleList;
                        this.tradeList = this.$store.state.tradeList;
                        this.scale = this.scaleList[result.data.dimension - 1];
                        this.trade = this.tradeList[result.data.profession - 1];
                        console.log('$store.scale',this.scale);
                    }else{
                        //获取所属行业和用工规模
                        dviApi.getData('profession').then((res2)=>{
                            this.tradeArr = res2.data.list;
                            this.$store.state.tradeArr = this.tradeArr;
                            for(var i=0; i<this.tradeArr.length; i++){
                                this.tradeList.unshift(this.tradeArr[i].value);
                            }
                            this.$store.state.tradeList = this.tradeList;
                            this.trade = this.tradeList[result.data.profession - 1];
                            console.log(this.tradeList);
                            console.log(result.data.profession);
                        })
                        dviApi.getData('CompanyDimension').then((res3)=>{
                            this.scaleArr = res3.data.list;
                            this.$store.state.scaleArr = this.scaleArr;
                            for(var j=0; j<this.scaleArr.length; j++){
                                this.scaleList.unshift(this.scaleArr[j].value);
                            }
                            this.$store.state.scaleList = this.scaleList;
                            this.scale = this.scaleList[result.data.dimension - 1];
                            console.log(this.scaleList);
                            console.log('get.scale:'+this.scale);
                            console.log(result.data.dimension);
                        })
                    }
                })
            }

        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .navbar .left{
        width: 1.5rem; height: 1.5rem;
    }
    .navbar .right{
        font-size: 0.7rem;
    }
    .nav{
        width: 100%; background: #fff; padding: 0.5rem 0;
    }
    .nav .n-1{
        width: 4.5rem; height: 4.5rem; border-radius: 50%; border: 1px solid #aaa; margin: 0 auto;
    }
    .nav .n-1 img{
        width: 4.5rem; height: 4.5rem; border-radius: 50%;
    }
    .infoMain{
        box-sizing: border-box; padding: 0 0.6rem;  background: #fff;

    }
    .infoMain .aul li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
    }
    .infoMain .aul li span{
        padding-left: 0.5rem;
    }
    .infoMain .footer{
        width: 100%; height: 3.25rem; display: flex; font-size: 0.7rem; color: #666; box-sizing: border-box; padding-top: 0.7rem;
    }
    .infoMain .footer .f-1{
        width: 6.25rem;
    }
</style>