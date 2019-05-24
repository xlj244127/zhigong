import { common } from '../lib/common'

var projectApi = {
    //添加班组长和改变班组工种
    addGroupLeader (projectId, userId, workType) {
        return common.postRequest('/project/addGroup', {projectId, userId, workType})
    },

    //创建项目
    createProj (companyId, name, provinceId, cityId, districtId, address, startTime, projectAdmins, company) {
        return common.postRequest('/project/save', {companyId, name, provinceId, cityId, districtId, address, startTime, projectAdmins, company})
    },
    //编辑项目
    editProj (id, companyId, name, provinceId, cityId, districtId, address, startTime, company) {
        return common.postRequest('/project/save', {id, companyId, name, provinceId, cityId, districtId, address, startTime, company})
    },
    //项目管理员设置项目
    projerEditProj (id, companyId, name, provinceId, cityId, districtId, address, company) {
        return common.postRequest('/project/save', {id, companyId, name, provinceId, cityId, districtId, address, company})
    },
    //公司项目列表
    //不传参数表示搜索公司下面所有项目
    //name 根据项目名称搜索项目
    //provinceId, cityId, districtId 根据省市区id搜索项目
    allProjectList (page, pageSize, name, provinceId, cityId, districtId) {
        return common.getRequest('/project/getProjects', {page, pageSize, name, provinceId, cityId, districtId})
    },
    addressProjectList (provinceId, cityId, districtId) {
        return common.getRequest('/project/getProjects', {provinceId, cityId, districtId})
    },
    //获取班组长所在的项目列表
    getProjectListByGroupLeader (status) {
        return common.getRequest('/project/getProjectsByGroupLeader', {status})
    },
    //项目录入汇总
    projEnterSum (projectId) {
        return common.getRequest('/project/summaryProjectInput', {projectId})
    },
    //项目信息录入汇总
    projInfoEnterSum () {
        return common.getRequest('/project/sumInput')
    },
    //查询项目录入群组列表
    projEnterGroup (projectId) {
        return common.getRequest('/project/getProjectGroupsForInput',{projectId})
    },
    //查询项目管理员项目列表
    projerProjList () {
        return common.getRequest('/project/getAdminProjects')
    },

    //添加 项目成员 和 班组长 到项目
    addRoleToList (projectId, role, userIds) {
        return common.postRequest('/project/addMembers', {projectId, role, userIds})
    },
    //添加临时工到项目
    //增加参数：职务position
    addTempToProj (projectId, role, userIds, position) {
        return common.postRequest('/project/addMembers', {projectId, role, userIds, position})
    },
    //添加工人到项目
    //增加参数：班组id role: 3,大工;4,小工；
    addWorkerToprojGroup (projectId, role, userIds, workGroupId, workType, position) {
        return common.postRequest('/project/addMembers', {projectId, role, userIds, workGroupId, workType, position})
    },

    //删除项目成员 一:临时工，二:项目管理员: 项目班组工人（不是删除班组工人）
    delProjUsers (projectId, userIds) {
        return common.postRequest('/project/deleteUsers', {projectId, userIds})
    },
    //班组列表
    groupWorkers(projectId, workGroupId, workType){
        return common.getRequest('/project/groupWorkers', {projectId, workGroupId, workType})
    },
    //修改大小工
    changeWorkerLevel(projectId, userId, level){
        return common.postRequest('/project/changeWorkerLevel', {projectId, userId, level})
    },
    //删除班组
    delGroup (projectId, groups) {
        return common.postRequest('/project/deleteGroup', {projectId, groups})
    },
    //修改临时工职务
    changeTempType(projectId, userId, position){
        return common.postRequest('/project/updateTempPosition', {projectId, userId, position})
    },
    //修改工人工种
    projChangeWorkType(userId, workType){
        return common.postRequest('/project/updateWorkType', {userId, workType})
    },
    //查看项目班组成员
    lookProjGroupMenber (page, pageSize, projectId, workGroupId) {
        return common.getRequest('/project/getProjectGroupUsers', {page, pageSize, projectId, workGroupId})
    },

    //根据id获取所在所有项目
    userProjs () {
        return common.getRequest('/project/getUserProjects')
    },

    //根据项目id删除项目
    delProj (id) {
        return common.postRequest('/project/'+id)
    },

    projectDetail (id) {
        return common.getRequest('/project/'+id)
    },

    projManagerList (projectId,page,pageSize,companyId,searchPara,viewRights) {
        return common.getRequest('/project/getProjectAdmins',{projectId,page,pageSize,companyId,searchPara,viewRights})
    },
    projGroupsList (projectId) {
        return common.getRequest('/project/getProjectGroups',{projectId})
    },
    projTemporaryWorkerList (projectId) {
        return common.getRequest('/project/getProjectTemps',{projectId})
    },
    getProjectFaces(projectId) {
        return common.getRequest('/project/getProjectFaces',{projectId})
    },

    //查询项目管理员列表
    getProjectAdminsNew(companyId, page, pageSize, viewRights, projectId) {
        return common.getRequest('/project/getProjectAdminsNew',{companyId, page, pageSize, viewRights, projectId})
    },
    //获取登录用户所在所有项目的所有项目管理员
    getUserProjectAdmins(companyId, page, pageSize, viewRights) {
        return common.getRequest('/project/getUserProjectAdmins',{companyId, page, pageSize, viewRights})
    },




};

export {
    projectApi
}
