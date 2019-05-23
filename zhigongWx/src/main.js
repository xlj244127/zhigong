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

// const wx_hide_menu = function () {
//     wx.ready(() => {
//         wx.hideMenuItems({
//             menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
//         })
//     })
// };
// window.wx_hide_menu = wx_hide_menu;

let setUserInfo = function (data) {
    store.state.userInfo = data;
    Cache.set('userInfo', data);
    store.state.sessionkey = data.sessionkey;
    let wxConfig = JSON.parse(data.wx_config);
    // 微信配置
    wx.config({...wxConfig})
};
let userInfo = Cache.get('userInfo');
// if (commonly.isEmptyObject(userInfo)) {
//     commonApi.wxLogin(function (data) {
//         setUserInfo(data)
//     })
// } else {
//     setUserInfo(userInfo)
// }

wx.error(function (res) {
    // err
});
// wx.ready(() => {
//     wx.hideMenuItems({
//         menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
//     })
// });

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
    pushState: true,
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

import { Cache } from './lib/utils'

window.addEventListener('popstate', function () {
    app.$f7.closeModal()
});
