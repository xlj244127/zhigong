<template>
    <div class="page">
        <div class="page-content">
            <div class="navbar">
                <div class="navbar-inner">
                    <div class="left sliding">
                        <a href="#" class="back link">
                            <i class="icon icon-back"></i>
                        </a>
                    </div>
                    <div class="center sliding">认证身份</div>
                </div>
            </div>
            <div class="header">
                <div class="box">
                    <div class="box-inner">
                        <img src="../../../../../static/img/but_add_photo.png"/> <br/>
                        <span>身份证正面</span>
                    </div>
                </div>
                <div class="box">
                    <div class="box-inner">
                        <img src="../../../../../static/img/but_add_photo.png"/> <br/>
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

                <from id="my-form" class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">姓名</div>
                                    <div class="item-input">
                                        <input type="text" name="name" readonly placeholder="姓名（可修改）">
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">性别</div>
                                    <div class="item-input">
                                        <input type="text" class="ac-1" name="trade" readonly placeholder="性别（可修改）">
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">身份证号</div>
                                    <div class="item-input">
                                        <input type="text" class="ac-2" name="scale" readonly placeholder="身份证号码（可修改）">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </from>
            </div>
        </div>
    </div>
</template>

<script  type="text/ecmascript-6">
    export default {
        data(){
            return{

            }
        },
        methods:{

        },
        mounted(){

        }
    }
</script>

<style scoped>
    .header{
        width: 100%;  box-sizing: border-box; padding: 0 2.4rem;
    }
    .header .box{
        width: 100%; height: 7.25rem; border: 1px solid #438cff; margin-top: 0.5rem;
        border-radius: 0.4rem;
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
        width: 60px; padding: 0 0.6rem; font-size: 0.7rem;
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