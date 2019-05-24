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
                    <a @click.prevent.stop="switchToStaff">
                        <span>切换到员工版</span>
                        <img src="../../../../../static/img/btn_right.png" />
                    </a>
                </div>
                <ul class="inner">
                    <!--<li>-->
                        <!--<div class="left">开启离线模式</div>-->
                        <!--<div class="right">-->
                            <!--<label class="label-switch">-->
                            <!--<input type="checkbox" @change="offlineModeChanged" v-model="offlineModeEnabled">-->
                            <!--<div class="checkbox"></div>-->
                            <!--</label>-->
                        <!--</div>-->
                    <!--</li>-->
                    <li>
                        <div class="left">开启离线模式</div>
                        <div class="right">
                            <label class="label-switch">
                            <input type="checkbox" @change="offlineModeChanged" v-model="offlineModeEnabled">
                            <div class="checkbox"></div>
                            </label>
                        </div>
                    </li>
                    <li @click="delCache">
                        <div class="left">清理缓存</div>
                    </li>
                    <!--<li @click="fileAction">-->
                        <!--<div class="left">插入文件和删除文件</div>-->
                    <!--</li>-->
                    <li>
                        <div class="left">版本</div>
                        <div class="right">V{{ version }}</div>
                    </li>
                </ul>
                <button class="butt" @click="logout">退出登录</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { LocalCache } from '../../../../lib/utils'
    import bleUtil from '../../../../lib/bleUtil'
    import { version } from '../../../../config'
    import fileUtil from '../../../../lib/fileUtil'
    import offlineUtil from "../../../../lib/offlineUtil";
    let $$ = Dom7;

    export default {
        data() {
            return {
                version,
                offlineModeEnabled: false
            }
        },
        methods: {
            switchToStaff() {
                LocalCache.set('isAdmin', false);
                window.location.reload();
            },
            offlineModeChanged() {
                this.$emit('switchOffline', true);
                let that = this;
                console.log("offlineModeEnabled: "+this.offlineModeEnabled);
                if(this.offlineModeEnabled) {
                    offlineUtil.upDownload()
                    bleUtil.hasPermission().then((result)=>{
                        console.log("hasPermission result" + JSON.stringify(result));
                        if(result.hasPermission) {
                            LocalCache.set('isOfflineModeEnabled', this.offlineModeEnabled);
                        }
                        else{
                            bleUtil.requestPermission((result)=>{
                                console.log('Request permission result: ' + JSON.stringify(result));
                                if(result.requestPermission) {
                                    LocalCache.set('isOfflineModeEnabled', this.offlineModeEnabled);
                                }
                                else {
                                    that.offlineModeEnabled = false;
                                    console.log('No permission for bluetooth.');
                                }
                            }, ()=>{
                                console.log('Request permission error, this is maybe a low version android system.');
                                LocalCache.set('isOfflineModeEnabled', this.offlineModeEnabled);
                            });
                        }
                    });
                }
            },
            logout() {
                LocalCache.del('userInfo');
                LocalCache.del('sessionkey');
                LocalCache.del('isAdmin');
                LocalCache.del('lastDownload');
                LocalCache.del('lastUpload');
                window.location.reload();
            },
            delCache() {
                // cordova.file.cacheDirectory
                let _this = this
                _this.$f7.confirm('点击确认后会清除所有本地缓存，是否确认?', () => {
                    fileUtil.getCacheDirectory().then((dirEntry) => {
                        console.log('第一个方法的值'+JSON.stringify(dirEntry));
                        function toArray(list) {
                            console.log('第二个方法的值'+JSON.stringify(list));
                            return Array.prototype.slice.call(list || [], 0);
                        }
                        function listResults(entries) {
                            console.log('第三个方法的值'+JSON.stringify(entries));
                            entries.forEach(function(entry, i) {
                                console.log('第四个方法的值'+JSON.stringify(entry));
                                if(entry.isDirectory){
                                    entry.removeRecursively(function(e) {
                                        console.log('Directory removed.');
                                    },function (e) {
                                        console.log("error directory remove:"+JSON.stringify(e));
                                    });
                                }else{
                                    entry.remove(function(e) {
                                        console.log('file removed.');
                                    },function (e) {
                                        console.log("error file remove:"+JSON.stringify(e));
                                    });
                                }
                            });


                        }
                        var dirReader = dirEntry.createReader();
                        var entries = [];
                        var delEntries = function() {
                            dirReader.readEntries (function(results) {
                                console.log('第五个方法的值'+JSON.stringify(results));
                                if (!results.length) {
                                    listResults(entries.sort());
                                } else {
                                    entries = entries.concat(toArray(results));
                                    delEntries();
                                }
                            }, function (e) {
                                console.log("error:"+JSON.stringify(e));
                            })
                        };

                        delEntries(); // Start reading dirs.
                        setTimeout(function () {
                            _this.$f7.alert("清除本地缓存成功！")
                        },500)
                    })
                })
            },
            // fileAction(){
            //
            // }
        },
        mounted() {
            this.offlineModeEnabled =  LocalCache.get('isOfflineModeEnabled');
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