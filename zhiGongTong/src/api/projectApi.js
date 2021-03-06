import { common } from '../lib/common'

var projectApi = {
    //添加班组长
    addGroupLeader (projectId, userId, workType) {
        return common.postRequest('/project/addGroup', {projectId, userId, workType})
    },

    //创建项目
    createProj (companyId, name, provinceId, cityId, districtId, address, startTime, projectAdmins, company) {
        return common.postRequest('/project/save', {companyId, name, provinceId, cityId, districtId, address, startTime, projectAdmins, company})
    },
    //编辑项目
    editProj (id, companyId, name, provinceId, cityId, districtId, address, startTime, projectAdmins, company) {
        return common.postRequest('/project/save', {id, companyId, name, provinceId, cityId, districtId, address, startTime, projectAdmins, company})
    },
    //项目管理员设置项目
    projerEditProj (id, companyId, name, provinceId, cityId, districtId, address, company) {
        return common.postRequest('/project/save', {id, companyId, name, provinceId, cityId, districtId, address, company})
    },
    //公司项目列表
    allProjectList (page,pageSize,status, name, provinceId, cityId, districtId, order, withDetail) {
        return common.getRequest('/project/getProjects', {page,pageSize,status, name, provinceId, cityId, districtId, order, withDetail})
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
    projerProjList (page, pageSize, name, provinceId, cityId, districtId, withDetail) {
        return common.getRequest('/project/getAdminProjects', {page, pageSize, name, provinceId, cityId, districtId, withDetail})
    },

    //添加 项目成员 和 班组长 到项目
    addRoleToList (projectId, role, userIds, position) {
        return common.postRequest('/project/addMembers', {projectId, role, userIds, position})
    },
    //添加临时工到项目
    //增加参数：职务position
    addTempToProj (projectId, role, userIds, position) {
        return common.postRequest('/project/addMembers', {projectId, role, userIds, position})
    },
    //添加工人到项目
    //增加参数：班组id
    addWorkerToprojGroup (projectId, role, userIds, workGroupId) {
        return common.postRequest('/project/addMembers', {projectId, role, userIds, workGroupId})
    },

    //删除项目成员 一:临时工，二:项目管理员: 项目班组工人（不是删除班组工人）
    delProjUsers (projectId, userIds) {
        return common.postRequest('/project/deleteUsers', {projectId, userIds})
    },

    //删除班组
    delGroup (projectId, groups) {
        return common.postRequest('/project/deleteGroup', {projectId, groups})
    },
    //修改临时工职务
    changeTempType(projectId, userId, position){
        return common.postRequest('/project/updateTempPosition', {projectId, userId, position})
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
    //查询项目管理员列表
    projManagerList (projectId) {
        return common.getRequest('/project/getProjectAdmins',{projectId})
    },
    //查询项目管理员列表new
    projManagerListNew (projectId, page, pageSize, companyId, searchPara, viewRights, positionsId) {
        return common.getRequest('/project/getProjectAdminsNew',{projectId, page, pageSize, companyId, searchPara, viewRights, positionsId})
    },
    projGroupsList (projectId) {
        return common.getRequest('/project/getProjectGroups',{projectId})
    },
    projTemporaryWorkerList (projectId) {
        return common.getRequest('/project/getProjectTemps',{projectId})
    },
    //获取员工在项目中的工资
    getSalary(projectId, userId){
        return common.getRequest('/project/getSalary',{ projectId, userId })
    },
    //修改员工在项目中的工资
    updateSalary( projectId, userId, salaryType, salary){
        return common.postRequest('/project/updateSalary',{ projectId, userId, salaryType, salary })
    },
    //新版本查询项目群组列表
    getProjectGroupsUserList(projectId,workGroupId){
        return common.getRequest('/project/getProjectGroupsUserList',{ projectId,workGroupId })
    }
};

export {
    projectApi
}
