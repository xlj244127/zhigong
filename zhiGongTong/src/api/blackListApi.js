import { common } from '../lib/common'

var blackListApi = {
    //黑名单管理统计
    blackListStat (companyId) {
        return common.getRequest('/blacklist/stat',{companyId})
    },
    //企业黑名单列表
    blackList (page, pageSize,  name, type ,companyId) {
        return common.getRequest('/blacklist/list',{page, pageSize, name, type, companyId})
    },
    blackListSimple (companyId) {
      return common.getRequest('/blacklist/list',{companyId})
    },
    //按姓名收索黑名单列表
    searchByName (companyId, name) {
        return common.getRequest('/blacklist/list',{companyId, name})
    },
    //按黑名单类型收索黑名单列表
    searchByType (companyId, type) {
        return common.getRequest('/blacklist/list',{companyId, type})
    },
    //黑名单警报和已处理黑名单
    alarmAddNoDealWith (companyId, status) {
        return common.getRequest('/blacklist/project',{companyId, status})
    },
    //添加黑名单人员
    addBlackListMember (cata, type, userId, workGroupId, projectId, companyId, idNumber, remark) {
        return common.postRequest('/blacklist/save',{cata, type, userId, workGroupId, projectId, companyId, idNumber, remark})
    },
    otherAddBlackListMember(companyId, name, idNumber, type, remark, mobile){
        return common.postRequest('/blacklist/save',{companyId, name, idNumber, type, remark, mobile})
    },
    //编辑黑名单人员
    editBlackListMember (companyId, id, userId, mobile, type, remark) {
        return common.postRequest('/blacklist/save',{companyId, id, userId, mobile, type, remark})
    },

    //人员解除黑名单
    removeBlackList (id) {
        return common.postRequest('/blacklist/remove',{id})
    },
    //项目解除黑名单
    projRemoveBlackList (id) {
        return common.postRequest('/blacklist/removewarn',{id})
    },
    //根据黑名单人员id获取他的个人详情
    personDetail (id) {
        return common.getRequest('/blacklist/'+id)
    },
    //添加人到项目，如果这个人是黑名单，就把这个项目加到黑名单中去
    addProjToBlackList (projectId, userId) {
        return common.postRequest('/blacklist/saveProject',{projectId, userId})
    }

};

export {
    blackListApi
}
