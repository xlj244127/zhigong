import Vue from 'vue'
import Router from 'vue-router'
import myOptional from '@/components/myOptional'
import search from '@/components/search'
import optionalNews from '@/components/optionalNews'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'myOptional',
      component: myOptional
    },{
      path: '/search',
      name: 'search',
      component: search
    },{
      path: '/optionalNews',
      name: 'optionalNews',
      component: optionalNews
    }]
})
