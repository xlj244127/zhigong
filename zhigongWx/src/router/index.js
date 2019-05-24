var loadbyUserViewName = function (name) {
    return require(`../pages/${name}.vue`)
}

export default [
    {path: '/user/searchJob/', component: loadbyUserViewName('searchJob')},
    {path: '/user/pubilcFreeGroup/', component: loadbyUserViewName('pubilcFreeGroup')},
    {path: '/user/pubilcWorkerNeed/:id/', component: loadbyUserViewName('pubilcWorkerNeed')},
    {path: '/user/searchProj/', component: loadbyUserViewName('searchProj')},
    {path: '/user/searchWorker/', component: loadbyUserViewName('searchWorker')},
    {path: '/user/sendHistory/', component: loadbyUserViewName('sendHistory')},
    {path: '/user/editGroupFree/', component: loadbyUserViewName('editGroupFree')},
    {path: '/user/editGroupRemark/', component: loadbyUserViewName('editGroupRemark')},
    {path: '/user/contactWorkerHistory/', component: loadbyUserViewName('contactWorkerHistory')},
    {path: '/user/myAttend/', component: loadbyUserViewName('myAttend')},
    {path: '/user/idCardIdentification/', component: loadbyUserViewName('idCardIdentification')},
    {path: '/user/contactRecord/', component: loadbyUserViewName('contactRecord')},
    {path: '/user/sample/', component: loadbyUserViewName('sample')},
    {path: '/user/appDownLoad/', component: loadbyUserViewName('appDownLoad')},
    {path: '/user/addFocus/', component: loadbyUserViewName('addFocus')},
    {path: '/user/personCenter/', component: loadbyUserViewName('personCenter')},
    {path: '/user/changeTel/', component: loadbyUserViewName('changeTel')},
    {path: '/user/groupRenZheng/', component: loadbyUserViewName('groupRenZheng')},
    {path: '/user/sharePubilcFreeGroup/', component: loadbyUserViewName('sharePubilcFreeGroup')},
    {path: '/user/sharePubilcWorkerNeed/', component: loadbyUserViewName('sharePubilcWorkerNeed')},
    {path: '/user/shareMyFreeGroup/', component: loadbyUserViewName('shareMyFreeGroup')},
    {path: '/user/shareMyRecruit/', component: loadbyUserViewName('shareMyRecruit')},
    {path: '/user/shareItemJob/', component: loadbyUserViewName('shareItemJob')},
    {path: '/user/shareItemProj/', component: loadbyUserViewName('shareItemProj')},
    {path: '/user/shareItemWorker/', component: loadbyUserViewName('shareItemWorker')},
    {path: '/user/shareWorkerRecruit/', component: loadbyUserViewName('shareWorkerRecruit')},
    {path: '/user/cityGroupFree/:provinceId/:cityId/', component: loadbyUserViewName('cityGroupFree')},
    {path: '/user/oneRecruit/', component: loadbyUserViewName('oneRecruit')},
    {path: '/user/businessCard/:userId', component: loadbyUserViewName('businessCard')},
    {path: '/user/createCard/', component: loadbyUserViewName('createCard')},
    {path: '/user/editResume/:userId/:editStatus', component: loadbyUserViewName('editResume')},
    {path: '/user/sharePubilcResume/', component: loadbyUserViewName('sharePubilcResume')},
    {path: '/user/groupRenZhengLogin/', component: loadbyUserViewName('groupRenZhengLogin')},
    {path: '/user/shareProjRecruit/', component: loadbyUserViewName('shareProjRecruit')},
    {path: '/user/loginAfterPublic/', component: loadbyUserViewName('loginAfterPublic')},
    {path: '/user/bindWx/', component: loadbyUserViewName('bindWx')},

    {path: '/user/selectType/:status/:arguments/', component: loadbyUserViewName('selectType')},
    {path: '/user/searchType/:status/:arguments/', component: loadbyUserViewName('searchType')},
    {path: '/user/selectTypeAddSize/:status/:id/', component: loadbyUserViewName('selectTypeAddSize')},
    {path: '/user/searchSelectTypeAddSize/:status/:id/', component: loadbyUserViewName('searchSelectTypeAddSize')},

    {path: '/user/Home/', component: loadbyUserViewName('Home')},
    {path: '/user/sharePage/', component: loadbyUserViewName('sharePage')},
    {path: '/user/shareAllData/', component: loadbyUserViewName('shareAllData')},    //分享页面

    {path: '/user/downloadList/', component: loadbyUserViewName('downloadList')},    //下载页面
    {path: '/user/rechargeList/', component: loadbyUserViewName('rechargeList')},    //充值页面

    // {path: '/user/grouperSearchProj/', component: loadbyUserViewName('grouperSearchProj')},
    // {path: '/user/groupSearchWorker/', component: loadbyUserViewName('groupSearchWorker')},
    // {path: '/user/searchJob/', component: loadbyUserViewName('searchJob')},
    // {path: '/user/groupPublishStatus/', component: loadbyUserViewName('groupPublishStatus')},
    // {path: '/user/publishNeedWork/:id/', component: loadbyUserViewName('publishNeedWork')},
    // {path: '/user/sendHistory/', component: loadbyUserViewName('sendHistory')},
    // {path: '/user/contactRecord/', component: loadbyUserViewName('contactRecord')},
    // {path: '/user/idCardIdentification/', component: loadbyUserViewName('idCardIdentification')},
    // {path: '/user/sample/', component: loadbyUserViewName('sample')},
    // {path: '/user/myAttend/', component: loadbyUserViewName('myAttend')},
    // {path: '/user/appDownLoad/', component: loadbyUserViewName('appDownLoad')},
    // {path: '/user/addFocus/', component: loadbyUserViewName('addFocus')},
    // {path: '/user/personCenter/', component: loadbyUserViewName('personCenter')},
    // {path: '/user/changeTel/', component: loadbyUserViewName('changeTel')},
    // {path: '/user/historyProject/', component: loadbyUserViewName('historyProject')},

]
