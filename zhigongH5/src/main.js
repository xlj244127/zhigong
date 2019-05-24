// Import Vue
import Vue from 'vue'
import store from './store'

import FastClick from 'fastclick'

// Import F7
import Framework7 from 'framework7'

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue'
import 'velocity-animate'

// Import F7 iOS Theme Styles
import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'
/* OR for Material Theme:
import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'
*/

// Import App Custom Styles
import AppStyles from './css/app.css'

// Import Routes
import Routes from './router'

// Import App Component
import App from './app.vue'
import VueResource from 'vue-resource'
Vue.use(VueResource);

// Init F7 Vue Plugin
Vue.use(Framework7Vue);

import back from './components/back/back.vue'
Vue.component('back', back);

//F7 Toast plugin
import './lib/toast'

// Init App
var app = new Vue({
  el: '#app',
  template: '<app/>',
  // Init Framework7 by passing parameters here
  data: {
    eventHub: new Vue()
  },
  framework7: {
    root: '#app',
    /* Uncomment to enable Material theme: */
    // material: true,
    routes: Routes,
    pushState: false,
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    pushStateSeparator: '#',
    swipeBackPage: false,
    modalTitle: '',
    pushStatePreventOnLoad: false,
    pushStateNoAnimation: true,
    cache: true,
    // preroute(view, options) {
    //   let userInfo = LocalCache.get('userInfo');
    //   if(!userInfo && options.url != '/project-home/login') {
    //     //没有登录信息,需要登录
    //     store.state.loginBackUrl = options.url;
    //     view.router.load({url: '/project-home/login'});
    //     return false;
    //   }
    //   return true;normalAttendDetail
    // },
  },
  // Register App Component
  components: {
    app: App
  },
  store
});

export { app }

import { getui } from './config'
import { Cache } from './lib/utils'


document.addEventListener('deviceready', function () {
    console.log('Platform Id:' + window.cordova.platformId);
    app.eventHub.$emit('cordovaReady', 'Cordova is ready!');
    if(window.cordova.platformId === 'android') {
        console.log('This andorid');
        GeTuiSdkPlugin.callback_init(function (type, data) {
            console.log("Getui callback type: " + type);
            if(type === 'cid') {
                Cache.set('getuiCID', data);
            }
            else if(type === 'payload') {
                console.log('Getui payload notification: ' + JSON.stringify(data));
                app.eventHub.$emit('pushNotification', data);
            }
        });
        GeTuiSdkPlugin.initialize();
    }
    else if(window.cordova.platformId === 'ios') {
        console.log('This ios');
        GeTuiSdk.setGeTuiSdkDidRegisterClientCallback(function (clientId) {
            console.log("Getui on register client id: " + clientId);
            Cache.set('getuiCID', clientId);
        });
        GeTuiSdk.setGeTuiSdkDidReceivePayloadCallback(function onReceivePayload(payload, taskId, msgId, offLine, appId) {
            //TODO playload = 透传数据
            //TODO taskId = 推送消息的任务id
            //TODO msgId = 推送消息的messageid
            //TODO offLine = 是否是离线消息，YES.是离线消息
            //TODO appId = 应用的appId
            console.log('Payload', payload);
            app.eventHub.$emit('pushNotification', payload);
        });
        // 个推平台申请的参数KAppId, KAppKey, KAppSecret
        GeTuiSdk.startSdkWithAppId(getui.appId, getui.appKey, getui.appSecret);


        PushNotification.hasPermission(function (data) {
            console.log('Has permission: ' + JSON.stringify(data));
        });

        let push = PushNotification.init({
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            }
        });

        push.on('registration', function(data) {
            console.log(data.registrationId+' deviceToken');
            // 获取 deviceToken 成功，注册 deviceToken 到个推 SDK
            GeTuiSdk.registerDeviceToken(data.registrationId);
        });

        push.on('notification', function(data) {
            var date = new Date();
            var dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            console.log('[APN] ' + dateStr + 'title:' + data.title + ' message:' + data.message);
        });

        push.on('error', function(e) {
            GeTuiSdk.registerDeviceToken('');
            console.log('didFailToRegisterForRemoteNotificationsWithError' + e.message);
        });
    }
});

var clicked = false;
document.addEventListener("backbutton", function () {
    console.log("Back button is click");
    var currentView = window.f7.getCurrentView();
    if (currentView.history.length > 1) {
        currentView.router.back();//返回上一级
    }
    else if(history.length > 1) {
        history.back();
    }
    else {
        console.log("Root page is hit.");
        if(clicked) {
            navigator.app.exitApp();
        }
        else {
            window.f7.toast("再次点击返回键退出智工通");
            clicked = true;
            setTimeout(function(){
                clicked = false;
            }, 3000);
        }
    }
}, false);
