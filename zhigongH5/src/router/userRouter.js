var loadbyUserViewName = function (name) {
    return require(`../pages/user/${name}.vue`)
};
var personCenter = function (name) {
    return require(`../pages/user/person-center/${name}.vue`)
}
var myGroup = function (name) {
    return require(`../pages/user/myGroup/${name}.vue`)
}
var searchJob = function (name) {
    return require(`../pages/user/searchJob/${name}.vue`)
}
var approveApply = function (name) {
    return require(`../pages/user/approveApply/${name}.vue`)
}

export default [
    {path: '/user/login/', component: loadbyUserViewName('Login')},
    {path: '/user/wechatBind/', component: loadbyUserViewName('WechatBind')},
    {path: '/user/adminhome/', component: loadbyUserViewName('AdminHome')},
    {path: '/user/staffhome/', component: loadbyUserViewName('StaffHome')},
    {path: '/user/workTypeList/', component: loadbyUserViewName('workTypeList')},
    {path: '/user/loginToken/:token/', component: loadbyUserViewName('loginToken')},

    {path: '/user/myAttend/', component: loadbyUserViewName('myAttend')},        //我的考勤

    {path: '/user/changeTel/', component: personCenter('changeTel')},            //个人中心
    {path: '/user/historyProject/', component: personCenter('historyProject')},
    {path: '/user/personCenter/', component: personCenter('personCenter')},
    {path: '/user/QR-code/', component: personCenter('QR-code')},
    {path: '/user/sample/', component: personCenter('sample')},

    {path: '/user/myGroup/', component: myGroup('myGroup')},                     //我的班组
    {path: '/user/groupQrcode/', component: myGroup('groupQrcode')},
    {path: '/user/delWorker/', component: myGroup('delWorker')},
    {path: '/user/addToProj/', component: myGroup('addToProj')},
    {path: '/user/infoState/', component: myGroup('infoState')},
    {path: '/user/workerAddWay/', component: myGroup('workerAddWay')},

    {path: '/user/groupAttend/', component: loadbyUserViewName('groupAttend')},  //班组考勤
    {path: '/user/allGroupRangeAttend/', component: loadbyUserViewName('allGroupRangeAttend')},

    {path: '/user/searchJob/', component: searchJob('searchJob')},  //班组长找工作
    {path: '/user/pubilcFreeGroup/', component: searchJob('pubilcFreeGroup')},
    {path: '/user/pubilcWorkerNeed/:id/', component: searchJob('pubilcWorkerNeed')},
    {path: '/user/searchProj/', component: searchJob('searchProj')},
    {path: '/user/editResume/:userId/:editStatus', component: searchJob('editResume')},//编辑简历
    {path: '/user/createCard/', component: searchJob('createCard')},//编辑简历
    {path: '/user/businessCard/:userId', component: searchJob('businessCard')},//编辑简历
    {path: '/user/searchWorker/', component: searchJob('searchWorker')},
    {path: '/user/sendHistory/', component: searchJob('sendHistory')},
    {path: '/user/editGroupFree/', component: searchJob('editGroupFree')},
    {path: '/user/editGroupRemark/', component: searchJob('editGroupRemark')},
    {path: '/user/contactWorkerHistory/', component: searchJob('contactWorkerHistory')},
    {path: '/user/contactRecord/', component: searchJob('contactRecord')},

    // {path: '/user/workSearchJob/', component: searchJob('workSearchJob')},  //工人找工作

    {path: '/user/approveApply/', component: approveApply('approveApply')},  //班组长或工人审批申请

    {path: '/user/addPage/', component: loadbyUserViewName('addPage')},   //每次新增页面

]

