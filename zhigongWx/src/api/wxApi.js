import { common } from '../lib/common'

var wxApi = {
    //公众号登陆
    wxRegister(name, mobile, profession, workType, workingExp, provinceId, cityId, littleBig, inviteUserId, code){
        return common.postRequest('/user/wxRegister', {name, mobile, profession, workType, workingExp, provinceId, cityId, littleBig, inviteUserId, code});
    },
    //班组长发布工种(修改班组长发布工种)
    grouperPublicType (provinceId, cityId, list, remark) {
        return common.postRequest('/workGroupFree/save', {provinceId, cityId, list, remark})
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
    grouperEditNeedWork (id, title, workType, demandTime, demandAmount, provinceId, cityId, districtId, address, salaryType, salary, treatments, settlement, remark, demandType) {
        return common.postRequest('/workDemand/save', {id, title, workType, demandTime, demandAmount, provinceId, cityId, districtId, address, salaryType, salary, treatments, settlement, remark, demandType   })
    },
    //班组获取单个用工需求
    grouperGetWorkNeedDetail (id) {
        return common.getRequest('/workDemand/'+id)
    },

    //工人找工作(班组长发布的招工消息)
    workerFindwork (page, pageSize, provinceId, cityId, workType, demandTime) {
        return common.getRequest('/workDemand/workQueryList', {page, pageSize, provinceId, cityId, workType, demandTime})
    },
    //分享页面工人找工作(班组长发布的招工消息)
    shareWorkerFindwork (page, pageSize, provinceId, cityId, workType, demandTime) {
        return common.getRequest('/workDemand/workQueryListAll', {page, pageSize, provinceId, cityId, workType, demandTime})
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
    //工人申请合作
    workerApplyFor (workDemandId) {
        return common.postRequest('/workDemandRecord/save', {workDemandId})
    },
    //班组长申请合作
    groupApplyFor (batchNumber) {
        return common.postRequest('/workDemandRecord/save', {batchNumber})
    },
    //根据班组id获取电话号码
    getGrouperPhone (workGroupid) {
        return common.getRequest('/workGroup/getPhoneByWorkGroupId', {workGroupid})
    },

    //获取微信js接口config
    getConfig (debug, url) {
        return common.getRequest('/weixinapi/generateConfigJson', {debug, url})
    },
    //用微信拍照从微信服务器获取图片
    getImage (mediaId) {
        return common.getRequest('/weixinapi/getMediaGetResult', {mediaId})
    },
    //根据市的id得到市的信息
    getCityName (cityId) {
        return common.getRequest('/address/getCityById', {cityId})
    },
    //根据省的名字获取省的id
    getProvinceName (provinceName) {
        return common.getRequest('/address/getProvinceByName', {provinceName})
    },
    //根据市的名字获取市的id
    getCityIdName (cityName) {
        return common.getRequest('/address/getCityByName', {cityName})
    },

    //用户更改工种年限
    editYear (workingExp) {
        return common.postRequest('/user/changeWorkingExp', {workingExp})
    },
    //查看班组说明
    groupExplain (workGroupId) {
        return common.getRequest('/workGroupFree/getWorkGroupRemark', {workGroupId})
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
    //班组长或工人联系班组长
    contactGroupApply (workDemandId) {
        return common.postRequest('/lookingJob/contactWorkGroup',{workDemandId})
    },
    //班组长或工人联系班组长历史
    contactGroupHistory () {
        return common.getRequest('/lookingJob/contactList')
    },
    //根据用户id获取用户电话号码
    getUserMobile (userId) {
        return common.getRequest('/user/getMobleByUserId',{userId})
    },

    //分享发布招工需求
    sharePublishWorkDemand (name, moblie, title, workType, demandTime, demandAmount, provinceId, cityId, districtId, address, salaryType, salary, treatments, settlement, remark, demandType) {
        return common.postRequest('/workDemand/publishWorkDemand',{name, moblie, title, workType, demandTime, demandAmount, provinceId, cityId, districtId, address, salaryType, salary, treatments, settlement, remark, demandType})
    },
    //分享发布班组用工
    sharePublishGroupFee (name, moblie, provinceId, cityId, list, remark) {
        return common.postRequest('/workGroupFree/publishWorkGroupFee',{name, moblie, provinceId, cityId, list, remark})
    },
    //查询某个省市下面的空闲班组
    listByShare (workGroupId, proviceId, cityId) {
        return common.getRequest('/workGroupFree/listByShare',{workGroupId, proviceId, cityId})
    },
    //查询班组某条招工信息
    getShare (id) {
        return common.getRequest('/workDemand/getShare',{id})
    },

    image(){
        return common.getRequest('/lookingJob/image')
    },
    //发布名片
    save (name, avatar, workingExp, provinceId, cityId, nativeProvinceId, nativeCityId, contact, remark, expectTime, workTypes, littleBigs, treatments, salaryType, salary, userId) {
        return common.postRequest('/lookingJob/save', {name, avatar, workingExp, provinceId, cityId, nativeProvinceId, nativeCityId, contact, remark, expectTime, workTypes, littleBigs, treatments, salaryType, salary, userId})
    },
    //分享发布名片
    shareSave (name, avatar, workingExp, provinceId, cityId, nativeProvinceId, nativeCityId, contact, remark, expectTime, workTypes, littleBigs, treatments, salaryType, salary) {
        return common.postRequest('/lookingJob/save', {name, avatar, workingExp, provinceId, cityId, nativeProvinceId, nativeCityId, contact, remark, expectTime, workTypes, littleBigs, treatments, salaryType, salary})
    },
    userInfo(userId){
        return common.getRequest('/lookingJob/'+userId)
    },
    getByUserId(userId){
        return common.getRequest('/lookingJob/getByUserId',{userId})
    },
    //分享加入到班组
    shareAddGroup (name, moblie, workType, workExp, provinceId, cityId, inviteUserId, littleBigs) {
        return common.postRequest('/workGroup/addWorkerShare', {name, moblie, workType, workExp, provinceId, cityId, inviteUserId, littleBigs})
    },
    //获取微信网页版通知
    notification(){
        return common.getRequest('/weixinapi/notification')
    },

    //根据批次号查询项目发布的招工信息
    getSharebatchNumber (batchNumber) {
        return common.getRequest('/workDemand/getSharebatchNumber', {batchNumber})
    },
    //刷新简历
    refreshLookingJob (lookingJobIds) {
        return common.getRequest('/lookingJob/refreshLookingJob',{lookingJobIds})
    },
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

    //	绑定微信
    phoneBindWx(code, mobile, vcode){
        return common.postRequest("/user/bindWx",{ code, mobile, vcode })
    },

};
export {
    wxApi
}