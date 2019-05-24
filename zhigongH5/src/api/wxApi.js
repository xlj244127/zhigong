import { common } from '../lib/common'

var wxApi = {
    //公众号登陆
    wxRegister(name, mobile, profession, workType, workingExp, provinceId, cityId, identityType, code){
        return common.postRequest('/user/wxRegister', {name, mobile, profession, workType, workingExp, provinceId, cityId, identityType, code});
    },
    //班组长发布工种
    grouperPublicType (provinceId, cityId, list, remark) {
        return common.postRequest('/workGroupFree/save', {provinceId, cityId, list, remark})
    },
    //查看班组说明
    groupExplain (workGroupId) {
        return common.getRequest('/workGroupFree/getWorkGroupRemark', {workGroupId})
    },
    //修改班组长发布工种
    modifyGrouperPublicType (list) {
        return common.postRequest('/workGroupFree/save', {list})
    },
    //查看班组长发布的工种
    lookGrouperPublic (workGroupId, proviceId, cityId) {
        return common.getRequest('/workGroupFree/listByCity', {workGroupId, proviceId, cityId})
    },
    //删除班组长发布的工种
    deleteGrouperPublic (ids) {
        return common.postRequest('/workGroupFree/delete', {ids})
    },
    //班组长发布招工
    grouperNeedWork (title, workType, demandTime, demandAmount, provinceId, cityId, districtId, address, salaryType, salary, treatments, settlement, remark, demandType) {
        return common.postRequest('/workDemand/save', {title, workType, demandTime, demandAmount, provinceId, cityId, districtId, address, salaryType, salary, treatments, settlement, remark, demandType})
    },
    //班组长找工人
    lookGrouperPublicWorkerList (workGroupId) {
        return common.getRequest('/workDemand/list', {workGroupId})
    },
    //班组长删除用工需求
    grouperDeleteNeedWork (id) {
        return common.postRequest('/workDemand/delete', {id})
    },
    //班组长编辑用工需求
    grouperEditNeedWork (id, title, workType, demandTime, demandAmount, provinceId, cityId, districtId, address, salaryType, salary, treatments, settlement, remark) {
        return common.postRequest('/workDemand/save', {id, title, workType, demandTime, demandAmount, provinceId, cityId, districtId, address, salaryType, salary, treatments, settlement, remark})
    },
    //班组获取单个用工需求
    grouperGetWorkNeedDetail (id) {
        return common.getRequest('/workDemand/'+id)
    },

    //工人找工作(班组长发布的招工消息)
    workerFindwork (page, pageSize, provinceId, cityId, workType, demandTime) {
        return common.getRequest('/workDemand/workQueryList', {page, pageSize, provinceId, cityId, workType, demandTime})
    },
    //班组长找工作(项目管理员或企业管理员发布的招工消息)
    grouperFindwork (page, pageSize, provinceId, cityId, workType, demandTime) {
        return common.getRequest('/workDemand/listByCompany', {page, pageSize, provinceId, cityId, workType, demandTime})
    },

    //查询用户可用次数
    lookUserContact (userId) {
        return common.getRequest('/userContact/query', {userId})
    },
    //联系次数 +1
    addOneTimes (userId) {
        return common.postRequest('/userContact/addOneTimes', {userId})
    },
    //联系次数 -1
    subOneTimes (userId) {
        return common.postRequest('/userContact/subOneTimes', {userId})
    },

    //班组查看发送历史 或 工人查看联系记录
    lookContactRecord () {
        return common.getRequest('/workDemandRecord/list')
    },
    //判断是否绑定微信
    judgeBindWx (code) {
        return common.getRequest('/user/wx-isbind', {code})
    },
    //企业版查看班组空闲
    companyLookGroupFree (page, pageSize, provinceId, cityId, workType, freeTime) {
        return common.getRequest('/workGroupFree/adminQueryList', {page, pageSize, provinceId, cityId, workType, freeTime})
    },
    //项目管理员，企业管理员查看用工需求（分权限）
    lookNeedWorker (companyId, projectName, sort) {
        return common.getRequest('/workDemand/adminQueryList', {companyId, projectName, sort})
    },
    //项目管理员，企业管理员查看班组合作申请（分权限）
    lookApplication (companyId) {
        return common.getRequest('/workDemandRecord/listCooperationReq', {companyId})
    },
    //项目管理员，企业管理员得到需要编辑工人列表
    getEditContent (batchNumber) {
        return common.getRequest('/workDemand/queryByBatchNumber', {batchNumber})
    },
    //项目管理员，企业管理员添加用工需求（包括编辑用工需求）
    addOreditNeedWorker (batchNumber, title, projectId, list, cost, salaryType, salary, treatments, materialReq, deviceReq, settlement, remark, demandType) {
        return common.postRequest('/workDemand/adminSave', {batchNumber, title, projectId, list, cost, salaryType, salary, treatments, materialReq, deviceReq, settlement, remark, demandType})
    },
    //项目管理员，企业管理员删除用工需求
    deleteNeedWorker (batchNumber) {
        return common.postRequest('/workDemand/adminDelete', {batchNumber})
    },
    //企业管理员修改是否能被班组长联系
    isContact (batchNumber, canCall) {
        return common.postRequest('/workDemand/updateCanCall', {batchNumber, canCall})
    },

    //班组长申请合作意向（向项目）
    groupApplyFor (batchNumber) {
        return common.postRequest('/workDemandRecord/save', {batchNumber})
    },
    //工人申请合作（向班组长）
    workerApplyFor (workDemandId) {
        return common.postRequest('/workDemandRecord/save', {workDemandId})
    },

    //工人首页数据统计
    workerHome () {
        return common.getRequest('/workDemand/countWoker')
    },
    //班组长首页数据统计
    grouperHome () {
        return common.getRequest('/workDemand/countWorkGroup')
    },
    //根据班组id获取电话号码
    getGrouperPhone (workGroupid) {
        return common.getRequest('/workGroup/getPhoneByWorkGroupId', {workGroupid})
    },

    //企业版首页统计
    laborCount (companyId) {
        return common.getRequest('/workGroupFree/workTypeFreeCount', {companyId})
    },
    //根据公司id和省市区筛选项目(企业管理和项目管理员都可以用)
    projectList (companyId, provinceId, cityId, page, pageSize) {
        return common.getRequest('/project/getCompanyAdminProjects', {companyId, provinceId, cityId, page, pageSize})
    },
    projectList2 (companyId, page, pageSize) {
        return common.getRequest('/project/getCompanyAdminProjects', {companyId, page, pageSize})
    },

    //根据市的id得到市的信息
    getCityName (cityId) {
        return common.getRequest('/address/getCityById', {cityId})
    },
    //根据省的id得到省的信息
    getProvinceName (proviceId) {
        return common.getRequest('/address/getProvinceById', {proviceId})
    },
    //根据区的id得到区的信息
    getDistrictName (districtId) {
        return common.getRequest('/address/getDistrictById', {districtId})
    },

    //用户更改工种年限
    editYear (workingExp) {
        return common.postRequest('/user/changeWorkingExp', {workingExp})
    },

    //查询可招工用户列表
    recruitWorkerList (page, pageSize, cityId, workType, workingExp) {
        return common.getRequest('/user/workerList', {page, pageSize, cityId, workType, workingExp})
    },
    //获取待遇条件列表
    getTreatments () {
        return common.getRequest('/workDemand/treatments')
    },
    //获取材料要求列表
    getMaterial () {
        return common.getRequest('/workDemand/materialReqs')
    },
    //获取设备要求列表
    getDevice () {
        return common.getRequest('/workDemand/deviceReqs')
    },
    //获取结算方式列表
    getTlements () {
        return common.getRequest('/workDemand/settlements')
    },
    //班组长联系工人历史
    concatWorkerHistory (page, pageSize, order) {
        return common.getRequest('/workDemand/getUserRecordHistory',{page, pageSize, order})
    },
    //班组长联系工人拨号后调
    contactUserRecord (contactUserId) {
        return common.postRequest('/workDemand/contactUserRecord',{contactUserId})
    },
    //修改班组说明
    amendGroupRemark (workGroupId, remark) {
        return common.getRequest('/workGroupFree/updateWorkGroupRemark',{workGroupId, remark})
    },

    image(){
        return common.getRequest('/lookingJob/image')
    },
    // //保存考勤信息
    // save (name, avatar, workingExp, provinceId, cityId, contact, remark, expectTime, workTypes, littleBigs, treatments, salaryType, salary, userId) {
    //     return common.postRequest('/lookingJob/save', {name, avatar, workingExp, provinceId, cityId, contact, remark, expectTime, workTypes, littleBigs, treatments, salaryType, salary, userId})
    // },
    //保存考勤信息(加了籍贯参数)
    save (name, avatar, workingExp, provinceId, cityId, nativeProvinceId, nativeCityId, contact, remark, expectTime, workTypes, littleBigs, treatments, salaryType, salary, userId) {
        return common.postRequest('/lookingJob/save', {name, avatar, workingExp, provinceId, cityId, nativeProvinceId, nativeCityId, contact, remark, expectTime, workTypes, littleBigs, treatments, salaryType, salary, userId})
    },
    userInfo(userId){
        return common.getRequest('/lookingJob/'+userId)
    },

    //班组长或工人联系班组长
    contactGroupApply (workDemandId) {
        return common.postRequest('/lookingJob/contactWorkGroup',{workDemandId})
    },
    //班组长或工人联系班组长历史
    contactGroupHistory () {
        return common.getRequest('/lookingJob/contactList')
    },
    //刷新简历
    refreshLookingJob (lookingJobIds) {
        return common.getRequest('/lookingJob/refreshLookingJob',{lookingJobIds})
    },
    //根据用户id获取用户电话号码
    getUserMobile (userId) {
        return common.getRequest('/user/getMobleByUserId',{userId})
    },

    //获取微信网页版通知
    notification(){
        return common.getRequest('/weixinapi/notification')
    },

    //查询班组某条招工信息
    getShare (id) {
        return common.getRequest('/workDemand/getShare',{id})
    },

    //根据批次号查询项目发布的招工信息
    getSharebatchNumber (batchNumber) {
        return common.getRequest('/workDemand/getSharebatchNumber',{batchNumber})
    },
    //刷新空闲发布时间
    refreshWorkFree (workFreeIds, workGroupId, proviceId, cityId) {
        return common.getRequest('/workGroupFree/refreshWorkFree',{workFreeIds, workGroupId, proviceId, cityId})
    },
    //刷新招工需求发布时间 (企业管理员，项目管理员)
    refreshWorkDemandByBatch (batchNumber) {
        return common.getRequest('/workDemand/refreshWorkDemandByBatch',{batchNumber})
    },
    //刷新招工需求发布时间 (班组长)
    refreshWorkDemand (wordDemandIds) {
        return common.getRequest('/workDemand/refreshWorkDemand',{wordDemandIds})
    },
    demandType(){
        return common.getRequest("/workDemand/demandType",)
    },
    demandTypeWorkType(){
        return common.getRequest("/workDemand/demandTypeWorkType",)
    },

    //用户是否能签到
    isSignin(){
        return common.getRequest("/recharge/getUserPunchStatus",)
    },
    //签到
    signin(){
        return common.getRequest("/recharge/userPunch",)
    },
    //下载APP列表
    getAppList(page,pageSize,order){
        return common.getRequest("/recharge/getAppList",{page,pageSize,order})
    },
    //下载APP
    downApp(id){
        return common.getRequest("/recharge/downApp",{id})
    },
    //积分套餐列表 工人版
    scoreList(){
        return common.getRequest("/suit/scoreList")
    },
    //积分套餐列表 管理员版
    periodList(){
        return common.getRequest("/suit/periodList")
    },
    //查询自己的订单列表
    orderList(){
        return common.getRequest("/order/list")
    },
    //	生成一个新订单
    orderAdd(suitId){
        return common.postRequest("/order/add",{ suitId })
    },
    //	微信支付
    wxPay(orderId){
        return common.postRequest("/order/wxPay",{ orderId })
    },
    //項目联系班组长历史
    projContactGroupHistory(page, pageSize, order){
        return common.getRequest("/workDemand/getUserWorkGroupRecordHistory",{page, pageSize, order})
    },
    //項目联系班组长
    projContactGroup(workGroupId, provinceId, cityId){
        return common.postRequest("/workDemand/contactWorkGroupRecord",{workGroupId, provinceId, cityId})
    },




};

export {
    wxApi
}