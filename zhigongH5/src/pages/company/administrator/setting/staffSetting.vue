<template>
    <f7-page name="staffSetting">
        <div class="page-content">
            <div class="navbar">
                <div class="navbar-inner">
                    <div class="left sliding">
                        <a href="#" class="back link">
                            <i class="icon icon-back"></i>
                        </a>
                    </div>
                    <div class="center sliding">设置</div>
                </div>
            </div>
            <div class="content-inner">
                <div class="edit edit2">
                    <a href="/company/userDescription/">
                        <span>使用说明</span>
                        <img src="../../../../../static/img/btn_right.png" />
                    </a>
                </div>
                <div class="edit">
                    <a @click.prevent.stop="switchToAdmin">
                        <span>切换到企业版</span>
                        <img src="../../../../../static/img/btn_right.png" />
                    </a>
                </div>
                <ul class="inner">
                    <li>
                        <div class="left">清理缓存</div>
                        <div class="right">24M</div>
                    </li>
                    <li>
                        <div class="left">版本</div>
                        <div class="right">V{{ version }}</div>
                    </li>
                </ul>
                <button class="butt" @click="logout">退出登录</button>
            </div>
        </div>
    </f7-page>
</template>

<script>
    import { LocalCache } from '../../../../lib/utils'
    import { version } from '../../../../config'

    export default {
        data() {
            return {
                version
            }
        },
        methods: {
            switchToAdmin() {
                LocalCache.set('isAdmin', true);
                window.location.reload();
            },
            logout() {
                LocalCache.del('userInfo');
                LocalCache.del('sessionkey');
                LocalCache.del('isAdmin');
                window.location.reload();
            }
        }
    }
</script>

<style scoped>
    .page-content{
        width: 100%; height: 100%; background: #f4f4f4;
    }
    .navbar{
        background: #fff;
    }
    .content-inner{
        margin-top: 0.5rem;
    }
    .inner{
        width: 100%; box-sizing: border-box; padding: 0 0.6rem;  background: #fff;
    }
    .inner li{
        width: 100%; height: 2.5rem; line-height: 2.5rem; display: flex; justify-content: space-between;
        border-bottom: 1px solid #f4f4f4;
    }
    .inner li .left{
        font-size: 0.7rem; color: #666;
    }
    .inner li .right{
        font-size: 0.7rem; color: #438cff;
    }
    .edit2{
        margin-top: 0.5rem;
    }
    .edit{
        width: 100%; height: 2.5rem; background: #fff; line-height: 2.5rem; padding-left: 0.6rem;
        position: relative; box-sizing: border-box; border-bottom: 1px solid #f4f4f4;
    }
    .edit a{
        width: 100%; height: 100%; display: block;
    }
    .edit a span{
        font-size: 0.7rem; color: #666;
    }
    .edit a img{
        width: 0.9rem; height: 0.9rem; position: absolute; top: 0.8rem; right: 0.6rem;
    }
    .butt{
        width: 78%; height: 2rem; background: #438cff; color: #fff; font-size: 0.8rem; margin-left: 12%; margin-top: 1rem;
        -webkit-border-radius: 0.25rem;
        -moz-border-radius: 0.25rem;
        border-radius: 0.25rem;
        border: none;
    }
</style>