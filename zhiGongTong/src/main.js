import 'babel-polyfill'
import Vue from 'vue'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import store from './store'
import './permission'
import VueResource from 'vue-resource'

Vue.use(VueResource);
Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
var app = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
export {app}
