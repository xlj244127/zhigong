/**
 * Created by Administrator on 2017/5/11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
/* import * as actions from './actions';*/
/* import * as mutations from './mutations';*/


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sessionkey: '',
    userId: '',
    userInfo: null,
    scanCache: {deviceName: '', deviceAdr: ''}
  }
})
