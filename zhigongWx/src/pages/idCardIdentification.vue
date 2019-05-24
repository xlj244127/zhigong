<template>
    <f7-page name="idCardIdentification" navbar-fixed>
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
            <div class="box" @click="onFrontClick">
                <img class="id-card-img" id="frontImg" data-changed="false">
                <div class="box-inner">
                    <img src="../../static/img/but_add_photo.png"> <br/>
                    <!--<img src="../../../../../static/img/front.jpg"> <br/>-->
                    <span>身份证正面</span>
                </div>
            </div>
            <div class="box" @click="onBackClick">
                <img class="id-card-img" id="backImg" data-changed="false">
                <div class="box-inner">
                    <img src="../../static/img/but_add_photo.png"> <br/>
                    <!--<img src="../../../../../static/img/back.jpg"> <br/>-->
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
                                <div class="item-title label">名族</div>
                                <div class="item-input">
                                    <input type="text" class="ac-2" name="nation" id="nation" placeholder="名族（必填项）">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">身份证号</div>
                                <div class="item-input">
                                    <input type="text" class="ac-2" name="idNumber" id="idNumber" placeholder="身份证号码（必填项）">
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

    </f7-page>
</template>

<script  type="text/ecmascript-6">
    let $$ = Dom7;
    import { userApi, commonApi, wxApi} from '../api';
    import { common } from '../lib/common';
    import { LocalCache } from '../lib/utils';
    var frontImg = '';
    var backImg = '';
    export default {
        data(){
            return{
                userId: '',
                userInfo: {},
                companyId: '',
                isIdCard: false,    //是否经过认证
                blurOne: 1,         //身份证正面是否模糊
                blurTwo: 1         //身份证背面是否模糊,

            }
        },
        methods:{
            //- 表单提交
            async submitAction(){
                var formData = this.$f7.formToJSON('#idcard-form');
                console.log(JSON.stringify(formData));
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
                            let result = await commonApi.uploadBase64('image/jpeg',frontImg);
                            console.log('Result: 这是啥' + JSON.stringify(result));
                            $$('#frontImg').data('changed', 'false');
                            $$('#idPhotoFront').val(result.data);
                            formData.idPhotoFront = result.data;
                        }
                        if($$('#backImg').data('changed') === 'true') {
                            let result = await commonApi.uploadBase64('image/jpeg',backImg);
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
                        this.$f7.alert('身份证上传错误one');
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
                    this.$f7.alert('身份证号错误，请重新输入');
                    return false;
                }
                if(!formData.name) {
                    this.$f7.alert('身份证名字不能为空');
                    return false;
                }
                if(!formData.gender) {
                    this.$f7.alert('性别不能为空');
                    return false;
                }
                formData.id = this.userId;
                formData.companyId = this.companyId;

                console.log('性别',formData.gender);
                userApi.changeIdcard(formData).then((result)=>{
                    console.log('实名认证成功' + JSON.stringify(result));
                    this.userInfo = LocalCache.get('userInfo');
                    this.userInfo.name = formData.name;
                    this.userInfo.gender = formData.gender;
                    LocalCache.set('userInfo', this.userInfo);

                    this.$router.back();
                });
            },
            onFrontClick() {
                $$('#frontImg').data('changed', 'true');
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        console.log(JSON.stringify(localIds[0]));

                        wx.uploadImage({
                            localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (resTwo) {
                                var serverId = resTwo.serverId; // 返回图片的服务器端ID
                                // $$('#idcard-form #name').val(serverId);
                                wxApi.getImage(serverId).then((result)=>{
                                    this.blurOne = 2;
                                    $$('#frontImg').data('changed', 'true');
                                    // $$('#frontImg').attr('src', localIds);
                                    frontImg = result.data.bytes;
                                    $$('#frontImg').attr('src', localIds);

                                    commonApi.baiduIdcardRecognize("front", frontImg).then((result)=>{
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

                                })
                            }
                        });
                    }
                });
            },
            onBackClick() {
                $$('#backImg').data('changed', 'true');
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        console.log(JSON.stringify(localIds[0]));

                        wx.uploadImage({
                            localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (resTwo) {
                                var serverId = resTwo.serverId; // 返回图片的服务器端ID
                                // $$('#idcard-form #name').val(serverId);
                                wxApi.getImage(serverId).then((result) => {
                                    this.blurOne = 2;
                                    $$('#backImg').data('changed', 'true');
                                    // $$('#frontImg').attr('src', localIds);
                                    backImg = result.data.bytes;
                                    $$('#backImg').attr('src', localIds);
                                })
                            }
                        })
                    }
                })
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
        mounted(){
            this.userId = LocalCache.get('userInfo').id;

            userApi.detail().then((result)=>{
                console.log(result.data);
                if(result.data.userDetail && result.data.userDetail.idNumber){
                    this.isIdCard = true;
                    $$('#frontImg').attr('src', result.data.userDetail.idPhotoFront);
                    $$('#idPhotoFront').val(result.data.userDetail.idPhotoFront);
                    $$('#backImg').attr('src', result.data.userDetail.idPhotoBack);
                    $$('#idPhotoBack').val(result.data.userDetail.idPhotoBack);
                    $$('#idcard-form #name').val(result.data.name);
                    $$('#idcard-form #idNumber').val(result.data.userDetail.idNumber);
                    let sex = result.data.gender;         //'男'?1:2
                    $$('#idcard-form #gender'+sex).prop('checked', true);
                    $$('#idcard-form #nation').val(result.data.userDetail.nation);
                }
            })

            userApi.information().then((result)=>{
                console.log(result.data);
                this.companyId = result.data.companyId;
                console.log('公司id'+this.companyId);
            });

        }
    }
</script>

<style scoped>
    .page-on-left{
        transform: translate3d(0,0,0);  -webkit-transform: translate3d(0,0,0);
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
    .header .box .box-inner{
        text-align: center;
    }
    .header .box .box-inner img{
        width: 1.4rem; height: 1.2rem; margin-top: 2rem;
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
    .content-block{
        margin: 0.6rem 0 1.5rem 0;
    }
    .content-block .button{
        height: 2rem; width: 6rem; background: #438cff; color: #fff; line-height: 2rem; margin: 0 auto; font-size: 0.8rem;
    }
</style>