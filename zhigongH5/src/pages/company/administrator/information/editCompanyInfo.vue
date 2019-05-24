<template>
    <div data-page="createCompany" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">编辑企业信息</div>
            </div>
        </div>
        <div class="page-content">
            <div class="logo">
                <div class="img" @click="getLogo" id="logo">
                    <img src="../../../../../static/img/but_add_avatar.png"/>
                </div>
                <p class="text">上传公司LOGO</p>
            </div>
            <form id="my-form" class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">公司名称</div>
                                <div class="item-input">
                                    <input type="text" name="name" v-model="name">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">所属行业</div>
                                <div class="item-input">
                                    <input type="text" class="ac-1" name="trade" v-model="trade" readonly @click="selectTradeAction">
                                    <img class="arrows" src="../../../../../static/img/icon_nav_right.png"/>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">用工规模</div>
                                <div class="item-input">
                                    <input type="text" class="ac-2" name="scale" v-model="scale" readonly @click="selectScaleAction">
                                    <img class="arrows" src="../../../../../static/img/icon_nav_right.png"/>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">联系人</div>
                                <div class="item-input">
                                    <input type="text" name="contact" value="张三" v-model="contact">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">联系电话</div>
                                <div class="item-input">
                                    <input type="tel" name="phone" v-model="mobile">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">公司详细地址</div>
                                <div class="item-input">
                                    <input type="text" name="address" v-model="detailAddress">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">办公电话</div>
                                <div class="item-input">
                                    <input type="tel" v-model="phone">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">联系邮箱</div>
                                <div class="item-input">
                                    <input type="text" v-model="email">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">公司官网</div>
                                <div class="item-input">
                                    <input type="text" v-model="homepage">
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </form>

            <div class="content-block" @click=saveAction>
                <a class="button">保存</a>
            </div>
        </div>
    </div>
</template>

<script>
    import { companyApi, commonApi } from '../../../../api'
    import { dviApi } from '../../../../api'
    let companyInfo;
    let companyId;
    let $$ = Dom7;

    export default {
        data(){
            return{
                tradeArr: [],
                scaleArr: [],
                tradeList: [],
                scaleList: [],
                trade: '',
                scale: '',
                name: '',
                detailAddress: '',
                contact: '',
                mobile: '',
                phone: '',
                logo: '',
                license: '',
                dimension: '',
                profession: '',
                email: '',
                homepage: '',
                plus: ''
            }
        },
        methods:{
            selectTradeAction(){
                //- 所属行业
                var buttons = [];
                var that = this;
                for(var i=0; i<this.tradeArr.length; i++){
                    buttons.unshift({
                        code: this.tradeArr[i].code,
                        text: this.tradeArr[i].value,
                        onClick: function(){
                            console.log(this.text);
                            that.trade = this.text;
                            that.profession = this.code;
                        }
                    });
                }
                this.$f7.actions(buttons);
            },
            selectScaleAction(){
                //- 用工规模
                var buttons = [];
                var that = this;
                for(var i=0; i<this.scaleArr.length; i++){
                    buttons.unshift({
                        code: this.scaleArr[i].code,
                        text: this.scaleArr[i].value,
                        onClick: function(){
                            that.scale = this.text;
                            that.dimension = this.code;
                        }
                    });
                }
                this.$f7.actions(buttons);
            },
            getLogo() {
                console.log("Get logo.....");
                let that = this;
                navigator.camera.getPicture((imageData)=>{
                    console.log('File: ' + imageData);
                    commonApi.uploadCordova(imageData).then((result)=>{
                        console.log('Upload result: ' + JSON.stringify(result));
                        that.logo = result.data;
                        $$('#logo img').attr('src', result.data);
                    }, (error)=>{
                        console.log('Upload error: ' + JSON.stringify(error));
                        that.$f7.alert('上传失败');
                    });
                }, (error)=>{
                    console.log(error);
                }, {
                    quality: 80,
                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                    allowEdit: true,
                    correctOrientation: true,
                    targetWidth: 200,
                    targetHeight: 200
                });
            },
            //保存类容
            saveAction(){
                companyApi.editCompany (
                    companyId,
                    this.name,
                    this.detailAddress,
                    this.contact,
                    this.mobile,
                    this.phone,
                    this.logo,
                    this.license,
                    this.dimension,
                    this.profession,
                    this.email,
                    this.homepage
                ).then((result)=>{
                    console.log(result);
                    this.$router.back();
                })
            }

        },
        mounted(){
            let image = $$('#logo img')[0];
            this.plus = image.src;
            let that = this;
            image.onerror = function () {
                image.src = that.plus;
            };
            companyId = this.$store.state.roleInfo.companyId;
            console.log(companyId);
            companyInfo = this.$store.state.companyInfo;
            if(companyInfo){
                this.name = companyInfo.name;
                this.detailAddress = companyInfo.detailAddress;
                this.contact = companyInfo.contact;
                this.mobile = companyInfo.mobile;
                this.phone = companyInfo.phone;
                this.logo = companyInfo.logo;
                this.license = companyInfo.license;
                this.dimension = companyInfo.dimension;
                this.profession = companyInfo.profession;
                this.email = companyInfo.email;
                this.homepage = companyInfo.homepage;
                $$('#logo img').attr('src', this.logo);
                if(this.$store.state.tradeList && this.$store.state.scaleList){
                    this.tradeArr = this.$store.state.tradeArr;
                    this.scaleArr = this.$store.state.scaleArr;
                    this.tradeList = this.$store.state.tradeList;
                    this.scaleList = this.$store.state.scaleList;
                    this.trade = this.tradeList[companyInfo.profession-1];
                    this.scale = this.scaleList[companyInfo.dimension-1];
                }else{
                    //获取所属行业和用工规模
                    dviApi.getData(
                        'profession'
                    ).then((result2)=>{
                        this.tradeArr = result2.data.list;
                        this.$store.state.tradeArr = this.tradeArr;
                        for(var i=0; i<this.tradeArr.length; i++){
                            this.tradeList.unshift(this.tradeArr[i].value);
                        }
                        this.$store.state.tradeList = this.tradeList;
                        this.trade = this.tradeList[companyInfo.profession-1];
                    })
                    dviApi.getData(
                        'CompanyDimension'
                    ).then((result3)=>{
                        this.scaleArr = result3.data.list;
                        this.$store.state.scaleArr = this.scaleArr;
                        for(var i=0; i<this.scaleArr.length; i++){
                            this.scaleList.unshift(this.scaleArr[i].value);
                        }
                        this.$store.state.scaleList = this.scaleList;
                        this.scale = this.scaleList[companyInfo.dimension-1];
                    })
                }
            }else{
                companyApi.companyInfo(this.companyId).then((result)=>{
                    console.log(result);
                    this.$store.state.companyInfo = result.data;

                    this.name = result.data.name;
                    this.detailAddress = result.data.detailAddress;
                    this.contact = result.data.contact;
                    this.mobile = result.data.mobile;
                    this.phone = result.data.phone;
                    this.logo = result.data.logo;
                    this.license = result.data.license;
                    this.dimension = result.data.dimension;
                    this.profession = result.data.profession;
                    this.email = result.data.email;
                    this.homepage = result.data.homepage;
                    $$('#logo img').attr('src', this.logo);
                    if(this.$store.state.tradeList && this.$store.state.scaleList){
                        this.tradeList = this.$store.state.tradeList;
                        this.scaleList = this.$store.state.scaleList;
                        this.trade = this.tradeList[result.data.profession-1];
                        this.scale = this.scaleList[result.data.dimension-1];
                    }else{
                        //获取所属行业和用工规模
                        dviApi.getData(
                            'profession'
                        ).then((result2)=>{
                            this.tradeArr = result2.data.list;
                            this.$store.state.tradeArr = this.tradeArr;
                            for(var i=0; i<this.tradeArr.length; i++){
                                this.tradeList.unshift(this.tradeArr[i].value);
                            }
                            this.$store.state.tradeList = this.tradeList;
                            this.trade = this.tradeList[result.data.profession-1];
                        })
                        dviApi.getData(
                            'CompanyDimension'
                        ).then((result3)=>{
                            this.scaleArr = result3.data.list;
                            this.$store.state.scaleArr = this.scaleArr;
                            for(var i=0; i<this.scaleArr.length; i++){
                                this.scaleList.unshift(this.scaleArr[i].value);
                            }
                            this.$store.state.scaleList = this.scaleList;
                            this.scale = this.scaleList[result.data.dimension-1];
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #fff;
    }
    .page-content .logo{
    width: 100%; text-align: center;
    }
    .page-content .logo .img{
        width: 4.5rem; height: 4.5rem; border: 0.1rem solid gainsboro; border-radius: 50%; margin: 0.25rem auto;
    }
    .page-content .logo .img img{
        width: 4.5rem; height: 4.5rem; border-radius: 50%;
    }
    .page-content .logo .text{
        font-size: 0.6rem; color: #999;
    }
    .list-block{
        margin: 0; margin-top: 1rem;
    }
    .list-block ul:before{
        display: none;
    }
    .list-block ul:after{
        display: none;
    }
    .list-block li{
        border: none; margin-bottom: 0.3rem;
    }
    .list-block .item-content{
        padding: 0; min-height: 1.75rem; height: 1.75rem; margin-right: 1.3rem;
    }
    .list-block .item-inner{
        padding: 0; min-height: 1.75rem;
    }
    .list-block .item-inner:after{
        display: none;
    }
    .list-block .item-title.label{
        width: auto; padding: 0 0.6rem; font-size: 0.7rem;
    }
    .list-block .item-title.label+.item-input{
        margin: 0; position: relative;
    }
    .list-block .item-title.label+.item-input input{
        height: 1.65rem; border: 1px solid lightgray; border-radius: 0.4rem; padding-left: 0.5rem; font-size: 0.7rem;
    }
    .list-block .item-title.label+.item-input .arrows{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 0.4rem; top: 0.35rem;
    }
    .list-block .photo{
        width: 16.85rem; height: 5.8rem; border: 1px solid #438cff; border-radius: 0.4rem; text-align: center;
        margin: 0 auto;
    }
    .list-block .photo img{
        width: 1.4rem; height: 1.2rem; margin-top: 1.6rem;
    }
    .list-block .photo span{
        font-size: 0.7rem; color: #438cff;
    }
    .content-block{
        margin: 0.6rem 0 1.5rem 0;
    }
    .content-block .button{
        height: 2rem; width: 10rem; background: #438cff; color: #fff; line-height: 2rem; margin: 0 auto;
    }
</style>