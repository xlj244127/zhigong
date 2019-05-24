import { common } from '../lib/common'

var rightsApi = {
    //  添加或修改部门 ID(只有编辑时才需要)
    addDepartment(id, companyId, departmentName){
        return common.getRequest('/rightsManage/addDepartment', {id, companyId, departmentName})
    },
    //	分配权限
    addPermissionList(departmentId, positionsId, companyId, permissionId){
        return common.postRequest('/rightsManage/addPermissionList', {departmentId, positionsId, companyId, permissionId})
    },
    //	添加或修改职务 ID(只有编辑时才需要) 部门ID,不填的话将用于项目职务
    addPositions(id, departmentId, companyId, positionsName){
        return common.getRequest('/rightsManage/addPositions', {id, departmentId, companyId, positionsName})
    },
    //	批量添加或修改职务
    addPositionsBatch(addParamaters, departmentId, companyId){
        return common.postRequest('/rightsManage/addPositionsBatch', {addParamaters, departmentId, companyId})
    },
    //	添加或修改职务 ID(只有编辑时才需要) 部门ID,不填的话将用于项目职务
    addProjectAdminPositionAndProject(positionsId, userId, projectIds, departmentId, companyId ,contact){
        return common.postRequest('/rightsManage/addProjectAdminPositionAndProject', {positionsId, userId, projectIds, departmentId, companyId, contact})
    },
    //	批量设置职务 企业管理员项目管理公用一个
    addProjectAdminPositionAndProjectBatch(positionsId, userIdList, departmentId, companyId){
        return common.getRequest('/rightsManage/addProjectAdminPositionAndProjectBatch', {positionsId, userIdList, departmentId, companyId})
    },
    //	获取公司企业管理员列表,按部门
    admins(page, pageSize, searchPara, viewRights){
        return common.getRequest('/rightsManage/admins', {page, pageSize, searchPara, viewRights})
    },
    //  删除部门
    delDepartment(departmentId){
      return common.getRequest('/rightsManage/delDepartment', {departmentId})
    },
    //  删除职务
    delPositions(positionsId, departmentId){
      return common.getRequest('/rightsManage/delPositions', {positionsId, departmentId})
    },
    //	人员管理删除职务信息
	deleteUserDepartment(userPositionsRelationshipIds){
      return common.postRequest('/rightsManage/deleteUserDepartment', {userPositionsRelationshipIds})
    },
	//  查询公司部门列表 departmentType 0企业   1项目
	getDepartments(companyId, departmentType){
		return common.getRequest('/rightsManage/getDepartments', {companyId, departmentType})
	},
	//  权限设置列表分页
	getPermissionListPage(page, pageSize, order, departmentId, positionsId, companyId){
		return common.getRequest('/rightsManage/getPermissionListPage', {page, pageSize, order, departmentId, positionsId, companyId})
	},
	//  查询公司职务列表
	getPositions(companyId, departmentId ){
		return common.getRequest('/rightsManage/getPositions', {companyId, departmentId})
	},
  //  查询公司职务列表  0企业   1项目
  getPositionsNew(companyId, departmentType, departmentId ){
    return common.getRequest('/rightsManage/getPositionsNew', {companyId,departmentType, departmentId})
  },
	//  查询公司人员列表
	getUsers(companyId, departmentId ){
		return common.getRequest('/rightsManage/getUsers', {companyId, departmentId})
	},
  //  获取项目管理员列表，按职务分组
  projectAdmins(page, pageSize, searchPara, viewRights){
    return common.getRequest('/rightsManage/projectAdmins', {page, pageSize, searchPara, viewRights})
  },
  getUserRights(companyId,userId){
    return common.getRequest('/rightsManage/getUserRights', {companyId,userId})
  },
};

export {
    rightsApi
}
