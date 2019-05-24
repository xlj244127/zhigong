import { common } from '../lib/common'

var rightsApi = {
    //  添加或修改部门 ID(只有编辑时才需要)
    addDepartment(companyId, departmentName){
        return common.getRequest('/rightsManage/addDepartment', {companyId, departmentName})
    },
    //  批量添加或修改职务
    addPositionsBatch(companyId, departmentId, addParamaters){
        return common.postRequest('/rightsManage/addPositionsBatch', {companyId, departmentId, addParamaters})
    },
    //  项目管理员批量添加或修改职务
    projerAddPositionsBatch(companyId, addParamaters){
        return common.postRequest('/rightsManage/addPositionsBatch', {companyId, addParamaters})
    },
    editDepartment(id, companyId, departmentName){
        return common.getRequest('/rightsManage/addDepartment', {id, companyId, departmentName})
    },
    //	分配权限
    addPermissionList(companyId, departmentId, positionsId, permissionId){
        return common.postRequest('/rightsManage/addPermissionList', {companyId, departmentId, positionsId, permissionId})
    },
    //	添加或修改职务 ID(只有编辑时才需要) 部门ID,不填的话将用于项目职务
    addPositions(id, departmentId, companyId, positionsName){
        return common.postRequest('/rightsManage/addPositions', {id, departmentId, companyId, positionsName})
    },
    //	添加或修改职务 ID(只有编辑时才需要) 部门ID,不填的话将用于项目职务
    addProjectAdminPositionAndProject(companyId, departmentId, positionsId, userId, contact, projectId){
        return common.postRequest('/rightsManage/addProjectAdminPositionAndProject', {companyId, departmentId, positionsId, userId, contact, projectId})
    },
    //	批量设置职务 企业管理员项目管理公用一个
    addProjectAdminPositionAndProjectBatch(companyId, positionsId, userIdList, departmentId){
        return common.getRequest('/rightsManage/addProjectAdminPositionAndProjectBatch', {companyId, positionsId, userIdList, departmentId})
    },
    //  删除部门
    delDepartment(departmentId){
      return common.getRequest('/rightsManage/delDepartment', {departmentId})
    },
    //  删除部门
    delPositions(positionsId, departmentId){
      return common.getRequest('/rightsManage/delPositions', {positionsId, departmentId})
    },
    //	人员管理删除职务信息
	deleteUserDepartment(userPositionsRelationshipIds){
      return common.postRequest('/rightsManage/deleteUserDepartment', {userPositionsRelationshipIds})
    },
	//  查询公司部门列表
	getDepartments(companyId, departmentType){
		return common.getRequest('/rightsManage/getDepartments', {companyId, departmentType})
	},
	//  权限设置列表分页
	getPermissionListPage(companyId, page, pageSize, departmentId, positionsId, order){
		return common.getRequest('/rightsManage/getPermissionListPage', {companyId, page, pageSize, departmentId, positionsId, order})
	},
	//  查询公司职务列表
	getPositions(companyId, departmentId){
		return common.getRequest('/rightsManage/getPositions', {companyId, departmentId})
	},
    //  查询公司职务列表
    getPositionsNew(companyId, departmentType, departmentId){
        return common.getRequest('/rightsManage/getPositionsNew', {companyId, departmentType, departmentId})
    },
	//  查询公司人员列表
	getUsers(companyId, roleId, departmentId){
		return common.getRequest('/rightsManage/getUsers', {companyId, roleId, departmentId})
	},
    //  查询企业管理列表（按部门）
    accordDepartmentGetCompanyer(page, pageSize, viewRights){
        return common.getRequest('/rightsManage/admins', {page, pageSize, viewRights})
    },
    //  查询企业管理列表（按人员首字母）
    accordFirstLetterGetCompanyer(){
        return common.getRequest('/rightsManage/adminsByFirst')
    },
    //  获取项目管理员列表，按职务分组
    accordDutyProjer(page, pageSize, viewRights){
        return common.getRequest('/rightsManage/projectAdmins', {page, pageSize, viewRights})
    },

    // //获取企业的所有项目管理员，按职务分组
    // companyAllProjer(){
    //     return common.getRequest('/rightsManage/getProjectAdminsNew')
    // },


};

export {
    rightsApi
}
