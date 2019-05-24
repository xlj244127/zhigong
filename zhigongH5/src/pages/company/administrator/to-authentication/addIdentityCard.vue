<template>
    <f7-page name="addIdentityCard" navbar-fixed>
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div v-if="this.isIdCard == false" class="center sliding">认证身份</div>
                <div v-if="this.isIdCard == true" class="center sliding">修改认证身份</div>
            </div>
        </div>
        <div class="header">
            <div class="box" @click="getIdCardFront">
                <img class="id-card-img frontImg" id="frontImg" data-changed="false" :class="{active: blurOne==1}">
                <div class="box-inner innerOne">
                    <img src="../../../../../static/img/but_add_photo.png"> <br/>
                    <span>身份证正面</span>
                </div>
            </div>
            <div class="box" @click="getIdCardBack">
                <img class="id-card-img backImg" id="backImg" data-changed="false" :class="{active: blurTwo==1}">
                <div class="box-inner innerTwo">
                    <img src="../../../../../static/img/but_add_photo.png"> <br/>
                    <span>身份证背面</span>
                </div>
            </div>
            <p class="tst">
                <a href="/user/sample/"> 查看示例 </a>
            </p>
        </div>
        <div class="line"></div>
        <div class="footer">
            <div class="foot">
                <div class="f-1">提示:</div>
                <div class="f-2">拍照或上传身份证照可自动识别下列信息请核对您的身份证信息,如有误可进行手动输入</div>
            </div>

            <form id="idcard-form" class="list-block">
                <input name="idPhotoFront" id="idPhotoFront" type="hidden">
                <input name="idPhotoBack" id="idPhotoBack" type="hidden">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">姓名</div>
                                <div class="item-input">
                                    <input type="text" name="name" id="name" placeholder="姓名（可修改）">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">性别</div>
                                <div class="item-input row">
                                    <div class="col-50">
                                        <label class="label-radio item-content">
                                            <!-- Checked by default -->
                                            <input type="radio" name="gender" value="1" id="gender1">
                                            <div class="item-media">
                                                <i class="icon icon-form-radio"></i>
                                            </div>
                                            <div class="item-inner">
                                                <div class="item-title">男</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div class="col-50">
                                        <label class="label-radio item-content">
                                            <!-- Checked by default -->
                                            <input type="radio" name="gender" value="2" id="gender2">
                                            <div class="item-media">
                                                <i class="icon icon-form-radio"></i>
                                            </div>
                                            <div class="item-inner">
                                                <div class="item-title">女</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">民族</div>
                                <div class="item-input">
                                    <input type="text" class="ac-2" name="nation" id="nation" placeholder="所属民族（可修改）">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">身份证号</div>
                                <div class="item-input">
                                    <input type="text" class="ac-2" name="idNumber" id="idNumber" placeholder="身份证号码（可修改）">
                                    <div class="imgBox" @click="delIdNumber">
                                        <img src="../../../../../static/img/btn_del.png"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </form>

            <div class="content-block" @click="submitAction">
                <a href="#" class="button form-to-json">提交</a>
            </div>
        </div>
        <!--上传身份证正面照的两种方式-->
        <div class="popover popover-linkOne">
            <div class="popover-angle"></div>
            <div class="popover-inner">
                <div class="list-block">
                    <ul>
                        <li @click="onFrontClick"><a href="#" class="list-button item-link">拍照上传</a></li>
                        <li @click="onGetFront"><a href="#" class="list-button item-link">相册上传</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <!--上传身份证反面照的两种方式-->
        <div class="popover popover-linkTwo">
            <div class="popover-angle"></div>
            <div class="popover-inner">
                <div class="list-block">
                    <ul>
                        <li @click="onBackClick"><a href="#" class="list-button item-link">拍照上传</a></li>
                        <li @click="onGetBack"><a href="#" class="list-button item-link">相册上传</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script  type="text/ecmascript-6">
    import { userApi, commonApi } from '../../../../api';
    import { common } from '../../../../lib/common';
    import { LocalCache } from '../../../../lib/utils'

    let $$ = Dom7;

    export default {
        data(){
            return{
                userId: 0,
                companyId: '',
                isIdCard: false,    //是否经过认证
                blurOne: 1,         //身份证正面是否模糊
                blurTwo: 1          //身份证背面是否模糊
            }
        },
        methods:{
            //- 表单提交
            async submitAction(){
                var formData = this.$f7.formToJSON('#idcard-form');
                console.log('????',JSON.stringify(formData));
                if($$('#frontImg').data('changed') === 'false' && !formData.idPhotoFront) {
                    this.$f7.alert('身份证正面照不能为空');
                    return false;
                }
                if($$('#backImg').data('changed') === 'false' && !formData.idPhotoBack) {
                    this.$f7.alert('身份证背面照不能为空');
                    return false;
                }

                common.showLoading(true, '正在上传');
                if($$('#frontImg').data('changed') === 'true' || $$('#backImg').data('changed') === 'true') {
                    try {
                        if($$('#frontImg').data('changed') === 'true') {
                            let data = await common.getBase64ImageData($$('#frontImg')[0]);
                            let result = await commonApi.uploadBase64('image/jpeg',data);
                            console.log('Result: ' + JSON.stringify(result));
                            $$('#frontImg').data('changed', 'false');
                            $$('#idPhotoFront').val(result.data);
                            formData.idPhotoFront = result.data;
                        }
                        if($$('#backImg').data('changed') === 'true') {
                            let data = await common.getBase64ImageData($$('#backImg')[0]);
                            let result = await commonApi.uploadBase64('image/jpeg',data);
                            console.log('Result: ' + JSON.stringify(result));
                            $$('#backImg').data('changed', 'false');
                            $$('#idPhotoBack').val(result.data);
                            formData.idPhotoBack = result.data;
                        }
                    }
                    catch(e) {
                        console.log('身份证上传错误');
                        console.log('Upload error: ' + JSON.stringify(e));
                        common.hideLoading(true, '正在上传');
                        this.$f7.alert('身份证上传错误');
                        return;
                    }
                }
                common.hideLoading(true, '正在上传');

                if(!formData.idPhotoFront) {
                    this.$f7.alert('身份证正面照不能为空');
                    return false;
                }
                if(!formData.idPhotoBack) {
                    this.$f7.alert('身份证背面照不能为空');
                    return false;
                }
                var idNumber_res = /^\d{17}[0-9a-zA-Z]$/;
                if(!idNumber_res.test(formData.idNumber)){
                    this.$f7.alert('身份证号码不正确，请从新输入');
                    return;
                }
                if(!formData.name) {
                    this.$f7.alert('身份证名字不能为空');
                    return false;
                }
                if(!formData.gender) {
                    this.$f7.alert('性别不能为空');
                    return false;
                }
                let that = this;
                if(this.userId)
                    formData.id = that.userId;
                else
                    formData.id = that.$store.state.userInfo.id;

                formData.companyId = this.companyId;
                userApi.changeIdcard(formData).then((result)=>{
                    console.log('Change id card result: ' + JSON.stringify(result));
                    if(that.userId) {
                        that.$store.state.addIdentityCard = 'done';
                    }
                    else {
                        let userInfo = LocalCache.get('userInfo');
                        userInfo.name = formData.name;
                        userInfo.gender = formData.gender;
                        LocalCache.set('userInfo', userInfo);
                        that.$store.state.userInfo.name = formData.name;
                        that.$store.state.userInfo.gender = formData.gender;
                        that.$store.state.userDetail = result.data;
                    }
                    that.$router.back();
                });
            },
            getIdCardFront(){
                console.log('111');
                this.$f7.popover('.popover-linkOne', '.innerOne');
            },
            getIdCardBack(){
                console.log('222');
                this.$f7.popover('.popover-linkTwo', '.innerTwo');
            },
            onFrontClick() {
                this.$f7.closeModal('.popover-linkOne');
                $$('#frontImg').data('changed', 'true');
                navigator.camera.getPicture((imageData)=>{
                    console.log(imageData);
                    this.blurOne = 2;
                    $$('#frontImg').data('changed', 'true');
                    $$('#frontImg').attr('src', imageData);
                },(error)=>{
                    console.log(error);
                },{
                    quality: 80,
                    allowEdit: false,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    correctOrientation: true
                });
            },
            onGetFront(){
                this.$f7.closeModal('.popover-linkOne');
                $$('#frontImg').data('changed', 'true');
                navigator.camera.getPicture((imageData)=>{
                    console.log(imageData);
                    this.blurOne = 2;
                    $$('#frontImg').data('changed', 'true');
                    $$('#frontImg').attr('src', imageData);
                },(error)=>{
                    console.log(error);
                },{
                    quality: 80,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: false,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    correctOrientation: true
                });
            },
            onBackClick() {
                this.$f7.closeModal('.popover-linkTwo');
                $$('#backImg').data('changed', 'true');
                navigator.camera.getPicture((imageData)=>{
                    this.blurTwo = 2;
                    $$('#backImg').data('changed', 'true');
                    $$('#backImg').attr('src', imageData);
                }, (error)=>{
                    console.log(error);
                }, {
                    quality: 80,
                    allowEdit: false,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    correctOrientation: true
                });
            },
            onGetBack(){
                this.$f7.closeModal('.popover-linkTwo');
                $$('#backImg').data('changed', 'true');
                navigator.camera.getPicture((imageData)=>{
                    console.log(imageData);
                    this.blurTwo = 2;
                    $$('#backImg').data('changed', 'true');
                    $$('#backImg').attr('src', imageData);
                },(error)=>{
                    console.log(error);
                },{
                    quality: 80,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: false,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    correctOrientation: true
                });
            },
            delIdNumber(){
                console.log('点击了');
                $$('#idNumber').val("");
            },
            changeScale(className){
                let  w = $$('.'+className).width(),
                    h = $$('.'+className).height(),
                    nw = $$('.'+className)[0].naturalWidth,
                    nh = $$('.'+className)[0].naturalHeight,
                    scale = w/h,
                    naturalScale =nw/nh;
                console.log(scale,naturalScale);
                console.log(w,h,nw,nh);
                if(1>naturalScale){
                    let offX = (h-w)/2,
                        offY = (h/naturalScale-h)/2
                    $$('#'+className).css({
                        transform:'rotate(-90deg)',
                        transformOrigin:'center center',
                        width:h+'px',
                        height:h/naturalScale+'px',
                        left:-1*offX+'px',
                        top:-1*offY+'px'
                    })
                }else{
                    console.log(100);
                    let offX = (w-h*naturalScale)/2
                    $$('#'+className).css({
                        width:h*naturalScale+'px',
                        height:h+'px',
                        left:offX+'px',
                        top:0+'px',
                    })
                }
            },
        },
        created(){
            this.companyId = this.$store.state.roleInfo.companyId;
        },
        mounted(){
            if(this.$route.query.id)
                this.userId = this.$route.query.id;

            $$('#gender'+this.$store.state.userInfo.gender).prop('checked', true);
            let frontImg = $$('#frontImg')[0],backImg =$$('#backImg')[0];
//            frontImg.crossOrigin = "Anonymous";
            frontImg.onload = function () {
                if($$('#frontImg').data('changed') === 'false')
                    return;

                common.getBase64ImageData(frontImg).then((image)=>{

                    return commonApi.baiduIdcardRecognize("front", image);

                }).then((result)=>{
                    console.log('Baidu recognize result: ' + JSON.stringify(result));
                    if(result.words_result) {
                        if(result.words_result['姓名']) {
                            $$('#idcard-form #name').val(result.words_result['姓名'].words);
                        }
                        if(result.words_result['公民身份号码']) {
                            $$('#idcard-form #idNumber').val(result.words_result['公民身份号码'].words);
                        }
                        if(result.words_result['性别']) {
                            let sex = result.words_result['性别'].words == '男'?1:2;
                            $$('#idcard-form #gender'+sex).prop('checked', true);
                        }
                        if(result.words_result['民族']) {
                            $$('#idcard-form #nation').val(result.words_result['民族'].words);
                        }
                    }
                }).catch((err)=>{
                    console.log('Err: ' + JSON.stringify(err));
                });
            };

            if(this.userId) {
                let groupMember = this.$store.state.addIdentityCard;
                if(groupMember.userDetail.idNumber)
                    this.isIdCard = true;
                let idNumberStr= groupMember.userDetail.idNumber.substr(0,3)+'***********'+groupMember.userDetail.idNumber.substr(14);
                $$('#idNumber').val(idNumberStr);
                console.log(groupMember.userDetail.idNumber);
                if(groupMember.userDetail.idPhotoFront) {
                    let that = this
                    $$('#frontImg').attr('src', groupMember.userDetail.idPhotoFront);
                    $$('#idPhotoFront').val(groupMember.userDetail.idPhotoFront);
                    setTimeout(function () {
                        that.changeScale('frontImg')
                    },1000)
                }
                if(groupMember.userDetail.idPhotoBack)
                {
                    let that = this
                    $$('#backImg').attr('src', groupMember.userDetail.idPhotoBack);
                    $$('#idPhotoBack').val(groupMember.userDetail.idPhotoBack);
                    setTimeout(function () {
                        that.changeScale('backImg')
                    },1000)

                }
                if(groupMember.name)
                    $$('#name').val(groupMember.name);
                if(groupMember.gender)
                    $$('#gender'+groupMember.gender).attr("checked", true);
                if(groupMember.userDetail.nation)
                    $$('#nation').val(groupMember.userDetail.nation);
            }
            else {
                if(this.$store.state.userDetail) {
                    if(this.$store.state.userDetail.idNumber)
                        this.isIdCard = true;
                    let idNumberStr= this.$store.state.userDetail.idNumber.substr(0,3)+'***********'+this.$store.state.userDetail.idNumber.substr(14);
                    $$('#idNumber').val(idNumberStr);
                    console.log(this.$store.state.userDetail.idNumber);
                    if(this.$store.state.userDetail.idPhotoFront) {
                        let that = this
                        $$('#frontImg').attr('src', this.$store.state.userDetail.idPhotoFront);
                        $$('#idPhotoFront').val(this.$store.state.userDetail.idPhotoFront);
                        setTimeout(function () {
                            that.changeScale('frontImg')
                        },1000)
                    }
                    if(this.$store.state.userDetail.idPhotoBack)
                    {
                        let that = this
                        $$('#backImg').attr('src', this.$store.state.userDetail.idPhotoBack);
                        $$('#idPhotoBack').val(this.$store.state.userDetail.idPhotoBack);
                        setTimeout(function () {
                            that.changeScale('backImg')
                        },1000)
                    }
                    if(this.$store.state.userDetail.nation)
                        $$('#nation').val(this.$store.state.userDetail.nation);
                }
                if(this.$store.state.userInfo.name)
                    $$('#name').val(this.$store.state.userInfo.name);
                if(this.$store.state.userInfo.gender)
                    $$('#gender'+this.$store.state.userInfo.gender).attr("checked", true);
            }
        }
    }
</script>

<style scoped>
    .popover{
        width: 130px; left: 140px;
    }
    .header{
        width: 100%;  box-sizing: border-box; padding: 0 2.4rem;
    }
    .header .box{
        width: 100%; height: 7.25rem; border: 1px solid #438cff; margin-top: 0.5rem;
        border-radius: 0.4rem; position: relative;
    }
    .header .box .id-card-img {
        left: 0; top: 0; width: 100%; height: 100%; border-radius: 0.4rem; position: absolute; z-index: 100;
    }
    .header .box .id-card-img.active{
        -webkit-filter: blur(0.25rem); /* Chrome, Opera */
        -moz-filter: blur(0.25rem);
        -ms-filter: blur(0.25rem);
        filter: blur(0.25rem);
    }
    .header .box .box-inner{
        text-align: center; margin-top: 2rem;
    }
    .header .box .box-inner img{
        width: 1.4rem; height: 1.2rem;
    }
    .header .box .box-inner span{
        padding-top: 0.5rem; display: inline-block;
    }
    .header .tst{
        text-align: right; color: #438cff; transform: translateX(1.5rem); margin: 0.75rem 0;
    }
    .line{
        width: 100%; height: 0.5rem; background: #f4f4f4;
    }
    .footer{
        width: 100%; box-sizing: border-box; padding: 0.5rem 0.6rem;
    }
    .footer .foot{
        display: flex; font-size: 0.6rem; color: #999; margin-bottom: 0.5rem;
    }
    .footer .foot .f-1{
        width: 1.5rem;
    }
    /*表单提交*/
    .list-block{
        margin: 0;
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
        width: 3rem; padding: 0 0.6rem; font-size: 0.7rem;
    }
    .list-block .item-title.label+.item-input{
        margin: 0; position: relative;
    }
    .list-block .item-title.label+.item-input input{
        height: 1.65rem; border: 1px solid lightgray; border-radius: 0.4rem; padding-left: 0.5rem; font-size: 0.7rem;
    }
    .list-block .item-title.label+.item-input .imgBox{
        width: 24px; text-align: center; line-height: 30px; position: absolute; right: 6px; top: 4px;
    }
    .list-block .item-title.label+.item-input img{
        width: 0.75rem; height: 0.75rem; display: inline;
    }
    .content-block{
        margin: 0.6rem 0 1.5rem 0;
    }
    .content-block .button{
        height: 2rem; width: 6rem; background: #438cff; color: #fff; line-height: 2rem; margin: 0 auto; font-size: 0.8rem;
    }
</style>