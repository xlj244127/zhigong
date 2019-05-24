<template>
    <div data-page="createCompany" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">创建公司</div>
            </div>
        </div>
        <div class="page-content">
            <div class="logo">
                <div class="img" @click="getLogo" id="logo">
                    <img src="../../../../../static/img/but_add_avatar.png"/>
                </div>
                <p class="text">上传公司LOGO(选填)</p>
            </div>
            <form id="my-form" class="list-block" name="myFrom">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">公司名称</div>
                                <div class="item-input">
                                    <input type="text" name="name" v-model="name" placeholder="请与营业执照一致（必填项）">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">所属行业</div>
                                <div class="item-input">
                                    <input type="text" class="ac-1" name="trade" readonly @click="selectTradeAction" placeholder="请选择（必填项）">
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
                                    <input type="text" class="ac-2" name="scale" readonly @click="selectScaleAction" placeholder="请选择(选填)">
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
                                    <input type="text" name="contact" v-model="contact" placeholder="请填写公司联系人姓名(选填)">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">联系电话</div>
                                <div class="item-input">
                                    <input type="tel" name="phone" v-model="mobile" placeholder="请填写公司联系人手机号(选填)">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">公司详细地址</div>
                                <div class="item-input">
                                    <input type="text" name="address" v-model="detailAddress" placeholder="请填写公司地址（必填项）">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">办公电话</div>
                                <div class="item-input">
                                    <input type="tel" v-model="phone" placeholder="请输入您的办公电话(选填)">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">联系邮箱</div>
                                <div class="item-input">
                                    <input type="text" name="email" v-model="email" placeholder="请输入您的联系邮箱(选填)">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">公司官网</div>
                                <div class="item-input">
                                    <input type="text" v-model="homepage" placeholder="请输入公司官网链接(选填)">
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="photo" name="photo" id="license">
                    <a @click="openPopover" class="openLink">
                        <img src="../../../../../static/img/but_add_photo.png"/>
                        <div class="photoTxt">拍照/上传营业执照(选填)</div>
                    </a>
                </div>
            </form>

            <div class="content-block" @click=createAction>
                <a href="#" class="button form-to-json">创建公司</a>
            </div>

            <!--上传营业执照的两种方式-->
            <div class="popover popover-links">
                <div class="popover-angle"></div>
                    <div class="popover-inner">
                    <div class="list-block">
                        <ul>
                            <li @click="getLicense"><a href="#" class="list-button item-link">拍照上传</a></li>
                            <li @click="getPicktrue"><a href="#" class="list-button item-link">相册上传</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { companyApi } from '../../../../api'
    import { dviApi, commonApi } from '../../../../api'
    import { LocalCache } from '../../../../lib/utils'

    let $$ = Dom7;

    export default {
        data(){
            return{
                tradeArr: [],
                scaleArr: [],
                tradeList: [],
                scaleList: [],

                name: '',
                detailAddress: '',
                contact: '',
                mobile: '',
                phone:'',
                logo:'',
                license: '',
                dimension: '',
                profession: '',
                email: '',
                homepage: ''
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
                            $$('.ac-1').val(this.text);
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
                            $$('.ac-2').val(this.text);
                            that.dimension = this.code;
                        }
                    });
                }
                this.$f7.actions(buttons);
            },
            //相册上传
            getLogo() {
                console.log("Get logo.....");
                let that = this;
                navigator.camera.getPicture((imageData)=>{
                    console.log('File: ' + imageData);
                    commonApi.uploadCordova(imageData).then((result)=>{
                        that.logo = result.data;
                        $$('#logo img').attr('src', result.data);
                    }, (error)=>{
                        console.log('Upload error: ' + JSON.stringify(error));
                        that.$f7.alert('上传失败');
                    });
                },(error)=>{
                    console.log(error);
                },{
                    quality: 80,
                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                    allowEdit: true,
                    correctOrientation: true,
                    targetWidth: 200,
                    targetHeight: 200
                });
            },

            //营业执照的调摄像头
            getLicense(){
                this.$f7.closeModal('.popover-links');
                console.log("营业执照的拍照上传")
                let that = this;
                navigator.camera.getPicture((imageData)=>{
                    console.log('File: ' + imageData);
                    commonApi.uploadCordova(imageData).then((result)=>{
                        that.license = result.data;
                        $$('#license img').attr('src', result.data).css({
                            'margin':'0 auto',
                            'width':'60%',
                            'display':'block'
                        });
                        $$('.list-block .photo span').css('display','none');
                    }, (error)=>{
                        console.log('Upload error: ' + JSON.stringify(error));
                        that.$f7.alert('上传失败');
                    });
                }, (error)=>{
                    console.log(error);
                }, {
                    quality: 75,
                    allowEdit: false,
                    correctOrientation: true
                });
            },
            //营业执照的相册选择
            getPicktrue(){
                this.$f7.closeModal('.popover-links');
                console.log("营业执照的相册上传")
                let that = this;
                navigator.camera.getPicture((imageData)=>{
                    console.log('File: ' + imageData);
                    commonApi.uploadCordova(imageData).then((result)=>{
                        that.license = result.data;
                        $$('#license img').attr('src', result.data).css({
                            'margin':'0 auto',
                            'width':'60%',
                            'display':'block'
                        });
                        $$('.list-block .photo span').css('display','none');
                    }, (error)=>{
                        console.log('Upload error: ' + JSON.stringify(error));
                        that.$f7.alert('上传失败');
                    });
                }, (error)=>{
                    console.log(error);
                }, {
                    quality: 80,
                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                    allowEdit: false,
                    correctOrientation: true,
                    targetWidth: 1000
                });
            },
            openPopover(){
                this.$f7.popover('.popover-links', '.openLink');
            },

            //表单验证
            createAction(){
                if (myFrom.name.value==""){
                    alert("公司名不能为空");
                    return false;
                }
                if (myFrom.trade.value==""){
                    alert("所属行业不能为空");
                    return false;
                }
                if (myFrom.address.value==""){
                    alert("公司地址不能为空");
                    return false;
                }

                // var mobile_reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                // if(!mobile_reg.test(myFrom.phone.value)){
                //     alert('请输入正确格式的手机号码');
                //     return false;
                // }
                companyApi.create(
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
                    this.$store.state.roleInfo.companyId = result.data.id;
                    this.$router.back();
                })
            },

        },
        mounted(){
            //获取所属行业和用工规模
            dviApi.getData(
                'profession'
            ).then((result)=>{
                console.log(result.data.list);
                this.tradeArr = result.data.list;
                this.$store.state.tradeArr = result.data.list;
                for(var i=0; i<this.tradeArr.length; i++){
                    this.tradeList.unshift(this.tradeArr[i].value);
                }
                this.$store.state.tradeList = this.tradeList;
            })
            dviApi.getData(
                'CompanyDimension'
            ).then((result)=>{
                this.scaleArr = result.data.list;
                this.$store.state.scaleArr = result.data.list;
                for(var i=0; i<this.scaleArr.length; i++){
                    this.scaleList.unshift(this.scaleArr[i].value);
                }
                this.$store.state.scaleList = this.scaleList;
            })
        }

    }
</script>

<style scoped>
    .popover{
        width: 130px; left: 140px;
    }
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
        width: 16rem;
        border: 1px solid #438cff; border-radius: 0.4rem; text-align: center;
        margin: 0 auto;
        position: relative;
    }
    .list-block .photo a{
        display: inline-block; margin-top: 1.6rem;
    }
    .list-block .photo a img{
        width: 1.4rem;
    }
    .list-block .photo a .photoTxt{
        font-size: 0.7rem; color: #438cff;
        margin-bottom: 1.6rem;
        margin-top: 0.4rem;
    }
    .content-block{
        margin: 0.6rem 0 1.5rem 0;
    }
    .content-block .button{
        height: 2rem; width: 10rem; background: #438cff; color: #fff; line-height: 2rem; margin: 0 auto;
    }

</style>
