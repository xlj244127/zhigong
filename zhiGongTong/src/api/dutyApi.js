import { common } from '../lib/common'

var dutyApi = {
	//	添加修改考勤规则
	addDutyRule(dutyTimeListStr, userDutyListStr, dutyId, dutyRuleName, uselegalday, dutyDate, companyId){
		return common.postRequest('/dutyManage/addDutyRule', {dutyTimeListStr, userDutyListStr, dutyId, dutyRuleName, uselegalday, dutyDate, companyId})
	},
	//	删除规则
	deleteDutyRule(dutyId, companyId){
		return common.postRequest('/dutyManage/deleteDutyRule', {dutyId, companyId})
	},
	//  获取考勤日期键值对
	getDutyDateEnum(){
		return common.getRequest('/dutyManage/getDutyDateEnum')
	},
	//  获取考勤明细企业适用范围详细情况
	getDutyRuleByRuleId(dutyRuleId, companyId){
		return common.getRequest('/dutyManage/getDutyRuleByRuleId',{dutyRuleId, companyId})
	},
  //获取考勤明细企业适用范围详细情况,按部门
  getDutyRuleByRuleIdAndDepartment(dutyRuleId, companyId){
    return common.getRequest('/dutyManage/getDutyRuleByRuleIdAndDepartment',{dutyRuleId, companyId})
  },
	//	获取规则列表或者某个规则明细
	getDutyRuleDetail(dutyRuleId, companyId, dutyRuleName, page, pageSize){
		return common.postRequest('/dutyManage/getDutyRuleDetail', {dutyRuleId, companyId, dutyRuleName, page, pageSize})
	},
	//	获取公司项目班组信息，或者某个规则的项目班组明细列表
	getProjectWorkGroupList(companyId, projectId, provinceId, cityId, districtId, dutyRuleId, viewUserInfo){
		return common.postRequest('/dutyManage/getProjectWorkGroupList', {companyId, projectId, provinceId, cityId, districtId, dutyRuleId, viewUserInfo})
	},
  //	获取公司项目班组信息，或者某个规则的项目班组明细列表,按班组分组
  getProjectWorkGroupListByWorkGroup(companyId, projectId, provinceId, cityId, districtId, dutyRuleId, viewUserInfo){
    return common.postRequest('/dutyManage/getProjectWorkGroupListByWorkGroup', {companyId, projectId, provinceId, cityId, districtId, dutyRuleId, viewUserInfo})
  },
  //searchDateType1按天2按月查询
  getDutyAuditList(auditType, isAudit, userName, companyId, page, pageSize, order, searchDate, searchDateType){
    return common.getRequest('/dutyManage/getDutyAuditList', {auditType, isAudit, userName, companyId, page, pageSize, order, searchDate, searchDateType})
  },
  auditDutyAudit(id, isAudit, auditRemark){
    return common.getRequest('/dutyManage/auditDutyAudit', {id, isAudit, auditRemark})
  },
  getDutyAuditEnum(){
    return common.getRequest('/dutyManage/getDutyAuditEnum')
  },
  //	获取考勤适用范围下面的所有人（包括部门和项目）
  getDutyRuleUseList(dutyRuleId){
    return common.postRequest('/dutyManage/getDutyRuleUseList',{dutyRuleId})
  },
  //	获取公司项目班组信息，或者某个规则的项目班组统计
  getProjectCountList(companyId,projectId,provinceId,cityId,districtId,dutyRuleId){
    return common.postRequest('/dutyManage/getProjectCountList',{companyId,projectId,provinceId,cityId,districtId,dutyRuleId})
  },
};

export {
  dutyApi
}
