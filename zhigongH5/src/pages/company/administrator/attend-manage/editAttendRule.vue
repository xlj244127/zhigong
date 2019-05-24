<template>
    <div data-page="createrAttendRules" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">编辑考勤规则</div>
            </div>
        </div>
        <div class="page-content">
            <div class="nav">规则一</div>
            <div class="cent">
                <ul>
                    <li>
                        <div class="c-1">考勤规则名称</div>
                        <div class="c-3">
                            <input type="text" placeholder="请输入考勤规则名称"/>
                        </div>
                    </li>
                    <li>
                        <div class="c-1">考勤日期</div>
                        <div class="right">
                            <span>请选择（必选项) </span>
                            <img src="../../../../../static/img/btn_more.png"/>
                        </div>
                    </li>
                    <li>
                        <div class="c-1">考勤时间</div>
                        <div class="right">
                            <span>请选择（必选项) </span>
                            <img src="../../../../../static/img/btn_more.png"/>
                        </div>
                    </li>
                    <li>
                        <div class="c-1">适用范围</div>
                        <div class="right">
                            <span>请选择（必选项) </span>
                            <img src="../../../../../static/img/btn_more.png"/>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="bott">
                <div class="left">开启法定节假日自动排序</div>
                <div class="item-input">
                    <label class="label-switch" @click="infoAction()">
                        <input v-if="canCall==true" class="lect" type="checkbox" checked>
                        <input v-if="canCall==false" class="lect" type="checkbox">
                        <div class="checkbox"></div>
                    </label>
                </div>
            </div>

            <div class="footer">保存</div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                canCall: true
            }
        },
        methods:{
            infoAction(){
                this.canCall = !this.canCall;
            }
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .nav{
        width: 100%; height: 2rem; line-height: 2rem; box-sizing: border-box; padding-left: 0.6rem;
        border-bottom: 1px solid #f4f4f4; background: #fff; margin-top: 0.5rem;
    }
    .cent{
        width: 100%; box-sizing: border-box; padding: 0 28px 0 0.6rem; background: #fff;
    }
    .cent ul{
        overflow: hidden;
    }
    .cent ul li{
        width: 100%; height: 2rem; line-height: 2rem; display: flex; padding: 5px 0;
    }
    .cent ul li .c-1{
        font-size: 0.7rem; color: #666;
    }
    .cent ul li .c-3{
        flex: 1; height: 2rem; margin-left: 0.6rem; color: #999;
    }
    .cent ul li .c-3 input{
        width: 100%; height: 100%; box-sizing: border-box; padding-left: 0.6rem; border: 1px solid #E1E1E1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .cent ul li .right{
        flex: 1; height: 2rem; border: 1px solid #E1E1E1; margin-left: 0.6rem; box-sizing: border-box; padding-left: 0.6rem;
        position: relative; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.7rem; color: #999;
    }
    .cent ul li .right img{
        width: 0.9rem; height: 0.9rem; position: absolute; right: 4px; top: 10px;
    }

    .bott{
        width: 100%; height: 2.5rem; background: #fff; display: flex; justify-content: space-between; box-sizing: border-box; padding: 0 28px 0 0.6rem;
    }
    .bott .left{
        font-size: 0.7rem; color: #666; line-height: 2.5rem;
    }
    .bott .item-input{
        width: auto; margin-top: 16px; margin-left: 4px;
    }
    .label-switch{
        width: 36px; height: 18px;
    }
    .label-switch .checkbox{
        width: 36px; height: 18px;
    }
    .label-switch input[type=checkbox]:checked+.checkbox{
        background: #438CFF;
    }
    .label-switch .checkbox:before{
        width: 36px; height: 18px;
    }
    .label-switch .checkbox:after{
        width: 14px; height: 14px;
    }

    .footer{
        width: 100%; height: 2rem; line-height: 2rem; text-align: center; font-size: 0.8rem; color: #fff; background: #438CFF;
        position: fixed; left: 0; bottom: 0;
    }
</style>