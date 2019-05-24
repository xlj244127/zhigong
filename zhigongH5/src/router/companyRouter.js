//企业管理员身份
var loadbyUserViewName = function (name) {
    return require(`../pages/company/${name}.vue`);
}
var companyManage = function (name) {                                               //公司管理
    return require(`../pages/company/administrator/company-manage/${name}.vue`);
}
var projectManage = function (name) {                                               //项目管理
    return require(`../pages/company/administrator/proj-manage/${name}.vue`);
}
var attendManage = function (name) {                                                //考勤管理
    return require(`../pages/company/administrator/attend-manage/${name}.vue`);
}
var information = function (name) {                                                  //公司信息
    return require(`../pages/company/administrator/information/${name}.vue`);
}
var equipManage = function (name) {                                                  //设备管理
    return require(`../pages/company/administrator/equip-manage/${name}.vue`);
}
var blackList = function (name) {                                                  //黑名单管理
    return require(`../pages/company/administrator/blacklist/${name}.vue`);
}
var permSetting = function (name) {                                                  //权限设置
    return require(`../pages/company/administrator/perm-setting/${name}.vue`);
}
var infoEntreing = function (name) {                                                 //信息录入
    return require(`../pages/company/administrator/info-entering/${name}.vue`);
}
var identityCard = function (name) {                                                 //去认证
    return require(`../pages/company/administrator/to-authentication/${name}.vue`);
}
var setting = function (name) {                                                 //设置
    return require(`../pages/company/administrator/setting/${name}.vue`);
}

var laborManagement = function (name) {                                                 //用工管理
    return require(`../pages/company/administrator/labor-management/${name}.vue`);
}
var approve = function (name) {                                                         //审批管理
    return require(`../pages/company/administrator/approve/${name}.vue`);
}
//项目管理员身份
var projManager = function (name) {
    return require(`../pages/company/proj-admin/${name}.vue`);
}

//这是要删除的
var deleteAction = function (name) {
    return require(`../pages/company/administrator/${name}.vue`);
}

var recharge = function (name) {                                                  //充值与下载APP
    return require(`../pages/company/administrator/recharge/${name}.vue`);
}

export default [
    //企业管理员身份
    {path: '/company/createCompany/', component: companyManage('createCompany')},    //公司管理

    {path: '/company/projectManage/', component: projectManage('projManage')},       //项目管理
    {path: '/company/createProject/:id/:statu/', component: projectManage('createProject')},
    {path: '/company/delProjManager/:id/', component: projectManage('delProjManager')},
    {path: '/company/phoneAdd/:id/:role/', component: projectManage('phoneAdd')},
    {path: '/company/workerAdd/:projectId/:groupId/:workType', component: projectManage('workerAdd')},
    {path: '/company/temporaryWorkerList/:id/', component: projectManage('temporaryWorkerList')},
    {path: '/company/projGroupsList/:id/', component: projectManage('projGroupsList')},
    {path: '/company/delGroups/:id/', component: projectManage('delGroups')},
    {path: '/company/delGroupsWorker/:project/:groupId/:workType', component: projectManage('delGroupsWorker')},
    {path: '/company/groupsWorkerList/:id/:groupId/:workType', component: projectManage('groupsWorkerList')},
    {path: '/company/allBuildProj/', component: projectManage('allBuildProj')},
    {path: '/company/buildProjDetail/:id/', component: projectManage('buildProjDetail')},
    {path: '/company/projManagerList/:id/', component: projectManage('projManagerList')},
    {path: '/company/delTemporaryWorker/:id/', component: projectManage('delTemporaryWorker')},
    {path: '/company/projectSeacher/', component: projectManage('projectSeacher')},

    {path: '/company/information/', component: information('information')},          //公司信息
    {path: '/company/editCompanyInfo/', component: information('editCompanyInfo')},

    {path: '/company/attendManage/', component: attendManage('attendManage')}, //考勤管理
    {path: '/company/allProjDayAttend/', component: attendManage('allProjDayAttend')},
    {path: '/company/projDayAttend/:id/', component: attendManage('projDayAttend')},
    {path: '/company/projDayAttendDetail/:id/', component: attendManage('projDayAttendDetail')},
    {path: '/company/projAbnormalAttend/:projId/:groupId/', component: attendManage('projAbnormalAttend')},
    {path: '/company/normalAttendDetail/:projId/:groupId/:userId/', component: attendManage('normalAttendDetail')},
    {path: '/company/tempAttendProjList/', component: attendManage('tempAttendProjList')},
    {path: '/company/tempAttendNumb/', component: attendManage('tempAttendNumb')},
    {path: '/company/passedAttendList/', component: attendManage('passedAttendList')},
    {path: '/company/createrAttendRules/', component: attendManage('createrAttendRules')},
    {path: '/company/attendRuleDetail/:id/', component: attendManage('attendRuleDetail')},
    {path: '/company/attendDate/:status/', component: attendManage('attendDate')},
    {path: '/company/applyRange/:status/', component: attendManage('applyRange')},
    {path: '/company/attendTime/:status/', component: attendManage('attendTime')},
    {path: '/company/rangeOfApplicationDetail/:id/', component: attendManage('rangeOfApplicationDetail')},
    // {path: '/company/allProjRangeAttend/', component: attendManage('allProjRangeAttend')},
    // {path: '/company/projRangeAttendDetail/', component: attendManage('projRangeAttendDetail')},
    // {path: '/company/groupRangeAttendDetail/', component: attendManage('groupRangeAttendDetail')},
    // {path: '/company/workerRangeAttendDetail/', component: attendManage('workerRangeAttendDetail')},

    {path: '/company/equipManage/', component: equipManage('equipManage')},          //设备管理
    {path: '/company/attendMachineDetail/:code/', component: equipManage('attendMachineDetail')},
    {path: '/company/addAttendMachine/', component: equipManage('addAttendMachine')},


    {path: '/company/blackListManage/', component: blackList('blackListManage')},          //黑名单管理
    {path: '/company/companyBlackList/', component: blackList('companyBlackList')},
    {path: '/company/addCompanyBlackList/:id/', component: blackList('addCompanyBlackList')},
    {path: '/company/blackListAlarm/', component: blackList('blackListAlarm')},
    {path: '/company/dealWithBlackList/', component: blackList('dealWithBlackList')},
    {path: '/company/search/', component: blackList('search')},
    {path: '/company/editPersonBlackList/:id/', component: blackList('editPersonBlackList')},
    {path: '/company/personBlackListDetail/:id/', component: blackList('personBlackListDetail')},
    {path: '/company/publicBlackList/', component: blackList('publicBlackList')},

    {path: '/company/permSetting/', component: permSetting('permSetting')},          //权限设置
    {path: '/company/permSetting2/', component: permSetting('permSetting2')},
    {path: '/company/companyMannagerDetail/:id/', component: permSetting('companyMannagerDetail')},
    {path: '/company/delCompanyManager/', component: permSetting('delCompanyManager')},
    {path: '/company/projMannagerDetail/:id/', component: permSetting('projMannagerDetail')},
    {path: '/company/workerDetail/:userId/:projectRole/', component: permSetting('workerDetail')},
    {path: '/company/groupLeaderDetail/:userId/', component: permSetting('groupLeaderDetail')},
    {path: '/company/temporaryWorkerDetail/:id/', component: permSetting('temporaryWorkerDetail')},
    {path: '/company/peopleManagement/:status/', component: permSetting('peopleManagement')},
    {path: '/company/setDepartmentPosition/', component: permSetting('setDepartmentPosition')},
    {path: '/company/addCompanyer/', component: permSetting('addCompanyer')},
    {path: '/company/addDepartmentPosition/', component: permSetting('addDepartmentPosition')},
    {path: '/company/editDepartmentPosition/', component: permSetting('editDepartmentPosition')},
    {path: '/company/setPerm/', component: permSetting('setPerm')},

    {path: '/company/infoEntering/', component: infoEntreing('infoEntering')},       //信息录入
    {path: '/company/projInfoEnteringList/', component: infoEntreing('projInfoEnteringList')},
    {path: '/company/groupInfoEnteringList/:id/:name/', component: infoEntreing('groupInfoEnteringList')},
    {path: '/company/lookFace/:id/', component: infoEntreing('lookFace')},

    {path: '/company/addIdentityCard/', component: identityCard('addIdentityCard')},       //去认证及选择工种
    {path: '/company/lookIdentityCard/:id/', component: identityCard('lookIdentityCard')},
    {path: '/company/selectType/:status/:arguments/', component: identityCard('selectType')},
    {path: '/company/searchType/:status/:arguments/', component: identityCard('searchType')},
    {path: '/company/selectTypeAddSize/:status/:id/', component: identityCard('selectTypeAddSize')},
    {path: '/company/searchSelectTypeAddSize/:status/:id/', component: identityCard('searchSelectTypeAddSize')},

    {path: '/company/adminSetting/', component: setting('adminSetting')},            //设置
    {path: '/company/staffSetting/', component: setting('staffSetting')},
    {path: '/company/userDescription/', component: setting('userDescription')},
    {path: '/company/IdentityExplain/', component: setting('IdentityExplain')},
    {path: '/company/dataExplain/', component: setting('dataExplain')},
    {path: '/company/callCenter/', component: setting('callCenter')},

    {path: '/company/laborManagement/', component: laborManagement('laborManagement')},            //用工管理
    {path: '/company/editLaborDemand/:id/', component: laborManagement('editLaborDemand')},
    {path: '/company/groupApplication/', component: laborManagement('groupApplication')},
    {path: '/company/publicLaborDemand/:is/', component: laborManagement('publicLaborDemand')},
    {path: '/company/myLaborDemand/', component: laborManagement('myLaborDemand')},
    {path: '/company/searchPage/', component: laborManagement('searchPage')},

    {path: '/company/approve/', component: approve('approve')},                  //审批管理

    //项目管理员身份
    {path: '/project/projManage/', component: projManager('projManage')},
    {path: '/project/setProj/:id/', component: projManager('setProj')},
    {path: '/project/attendManage/', component: projManager('attendManage')},
    {path: '/project/infoEntering/', component: projManager('infoEntering')},
    {path: '/project/projPermSetting/', component: projManager('projPermSetting')},
    {path: '/project/setDuty/', component: projManager('setDuty')},

    //离线模式
    {path: '/company/offLineMode/', component: loadbyUserViewName('offLineMode')},

    //下载与充值
    {path: '/company/downloadList/', component: recharge('downloadList')},
    {path: '/company/rechargeList/', component: recharge('rechargeList')},

]















