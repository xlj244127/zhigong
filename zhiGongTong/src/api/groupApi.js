import { common } from '../lib/common'

var groupApi = {
    //项目管理员添加工人
    projAddWorker (workType, userId, groupId, littleBig) {
        return common.postRequest('/workGroup/addWorker',{workType, userId, groupId, littleBig})
    },

    //添加班组成员列表
    //参数: 工种，用户id
    addGroupMember (workType, userId) {
        return common.postRequest('/workGroup/addWorker',{workType, userId})
    },
    //班组成员添加到班组
    //参数: 工种，班组长id
    addToWorkGroup (workType, groupLeaderId) {
        return common.postRequest('/workGroup/addToWorkGroup',{workType, groupLeaderId})
    },
    //删除班组成员
    //参数: 用户id
    delGroupMember (userIds) {
        return common.postRequest('/workGroup/deleteWorkers',{userIds})
    },
    //班组成员列表
    //参数: 班组长id
    groupMemberList (userId) {
        return common.getRequest('/workGroup/getWorkGroupWorkers', {userId})
    },
    //添加/修改工人工种
    //参数: 人员id，工种
    addWorkType (userIds, workType) {
        return common.postRequest('/workGroup/updateWorkType', {userIds, workType})
    },
    getWorkersAttend (page, pageSize, order,projectId, groupId, day, username) {
      return common.getRequest('/workGroup/getWorkersAttend', {page, pageSize, order,projectId, groupId, day, username})
    },
    getWorkGroup (id) {
      return common.getRequest('/workGroup/'+id)
    }
};

export {
    groupApi
}
