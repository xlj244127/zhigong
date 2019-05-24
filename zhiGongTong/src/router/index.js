import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)
import Layout from '../views/layout/layout'
import login from '../views/layout/loginBg'
export const constantRouterMap = [
  /*{ path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },*/
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [{
      path: 'index',
      component: _import('index/index'),
      name: 'index',
      meta: { title: 'index', icon: 'index', noCache: true }
    }]
  },{
    path: '/information/',
    component: Layout,
    redirect: '/information/index',
    children: [{
      path: '/information/index',
      component: _import('information/information'),
      name: 'information',
    },{
      path: '/information/editInfo/',
      component: _import('information/editInfo'),
      name: 'editInfo',
    }]
  },{
    path: '/limit/',
    component: Layout,
    redirect: '/limit/index',
    children: [{
      path: '/limit/index',
      component: _import('limit/limitIndex'),
      name: 'limitIndex',
    },{
      path: '/limit/admin',
      component: _import('limit/limitAdmin'),
      name: 'limitAdmin',
    },{
      path: '/limit/project',
      component: _import('limit/limitProject'),
      name: 'limitProject',
    },{
      path: '/limit/settings',
      component: _import('limit/limitSettings'),
      name: 'limitSettings',
    }]
  }, {
    path: "/approve/",
    component: Layout,
    redirect:'/approve/index',
    children: [{
      path: '/approve/index',
      component: _import('approve/approve'),
      name: 'approve',
    }]
  }, {
    path: '/settings/',
    component: Layout,
    redirect: '/settings/index',
    children: [{
      path: '/settings/index',
      component: _import('settings/settings'),
      name: 'settings'
    }]
  },{
    path:'/create/',
    component:Layout,
    redirect:'/create/index',
    children:[
      {path:'/create/index',component: _import('create/company'),name: 'createCompany'},
      {path:'/create/infoChecking/', component: _import('create/infoChecking'), name: 'infoChecking'}
    ]
  },{
    path: '/attend/',
    component: Layout,
    redirect: '/attend/index',
    children: [
      {path: '/attend/index', component: _import('attend/attend'), name: 'attend'},
      {path: '/attend/rule', component: _import('attend/rule'), name: 'rule'},
      {path: '/attend/view/:dutyRuleId', component: _import('attend/view'), name: 'view'},
      {path: '/attend/viewDetail/:dutyRuleId/:projectId', component: _import('attend/viewDetail'), name: 'viewDetail'},
      {path: '/attend/createRule/:dutyRuleId', component: _import('attend/createRule'), name: 'createRule'},
      {path: '/attend/projectList/', component: _import('attend/projectList'), name: 'projectList'},
      {path: '/attend/groupList/:projectId', component: _import('attend/groupList'), name: 'groupList'},
      {path: '/attend/projAttend/:projectId', component: _import('attend/projAttend'), name: 'projAttend'},
      {path: '/attend/classAttend/:projectId/:groupId', component: _import('attend/classAttend'), name: 'classAttend'}
      ]
  },{
    path:'/login',
    component:login,
    redirect:'/login/index',
    children: [
      {path: '/login/index', component: _import('login/account'), name: 'account',hidden: true},
      {path: '/login/verification', component: _import('login/verification'), name: 'verification',hidden: true},
      {path: '/login/qrCode', component: _import('login/qrCode'), name: 'qrCode',hidden: true},
      {path: '/login/forgetPwd', component: _import('login/forgetPwd'), name: 'forgetPwd',hidden: true},
      {path: '/login/resetPwd', component: _import('login/resetPwd'), name: 'resetPwd',hidden: true},
      {path: '/login/resetSuccess', component: _import('login/resetSuccess'), name: 'resetSuccess',hidden: true},
    ]
  },{
    path: '/cert/',
    component: Layout,
    redirect: '/cert/index',
    children: [
      {path: '/cert/index', component: _import('cert/cert'), name: 'cert'},
      {path: '/cert/editCert/:id', component: _import('cert/editCert'), name: 'editCert'},
    ]
  },{
    path: '/infoEntry/',
    component: Layout,
    redirect: '/infoEntry/index',
    children: [
      {path: '/infoEntry/index', component: _import('infoEntry/entry'), name: 'infoEntry'},
      {path: '/infoEntry/projectEntry/:projectId', component: _import('infoEntry/projectEntry'), name: 'projectEntry'},
    ]
  },{
    path: '/blacklist/',
    component: Layout,
    redirect: '/blacklist/corporation',
    children: [
      {path: '/blacklist/index', component: _import('blacklist/corporation'), name: 'corporation'},
      {path: '/blacklist/alarm', component: _import('blacklist/alarm'), name: 'alarm'},
      {path: '/blacklist/public', component: _import('blacklist/public'), name: 'public'},
      {path: '/blacklist/processed', component: _import('blacklist/processed'), name: 'processed'},
    ]
  },{
    path: '/project/',
    component: Layout,
    redirect: '/project/index',
    children: [
      {path: '/project/index', component: _import('project/projectManage'), name: 'projectManage'},
      {path: '/project/detail/:projectId', component: _import('project/projectDetail'), name: 'projectDetail'},
      {path: '/project/editDetail/:projectId', component: _import('project/editDetail'), name: 'editDetail'},
      {path: '/project/groupDetail/:projectId/:groupId/:groupLeaderId', component: _import('project/groupDetail'), name: 'groupDetail'},
    ]
  }
]
export default new Router({
  mode:'hash',
  routes:constantRouterMap
})
