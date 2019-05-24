import { common } from '../lib/common'

var dutyApi = {
	//	添加修改考勤规则
	createDutyRule(companyId, dutyTimeListStr, userDutyListStr, dutyRuleName, uselegalday, dutyDate, dutyId){
		return common.postRequest('/dutyManage/addDutyRule', {companyId, dutyTimeListStr, userDutyListStr, dutyRuleName, uselegalday, dutyDate, dutyId})
	},
    editDutyRule(dutyId, companyId, dutyTimeListStr, userDutyListStr, dutyRuleName, uselegalday, dutyDate){
        return common.postRequest('/dutyManage/addDutyRule', {dutyId, companyId, dutyTimeListStr, userDutyListStr, dutyRuleName, uselegalday, dutyDate})
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
	getDutyRuleByRuleId(companyId, dutyRuleId){
		return common.getRequest('/dutyManage/getDutyRuleByRuleId',{companyId, dutyRuleId})
	},
	//	获取规则列表或者某个规则明细
	getDutyRuleDetail(page, pageSize, companyId, dutyRuleId, dutyRuleName){
		return common.postRequest('/dutyManage/getDutyRuleDetail', {page, pageSize, companyId, dutyRuleId, dutyRuleName})
	},
    // //	根据规则id获取这个规则详情
    // oneRuleDetail(companyId, dutyRuleId){
    //     return common.postRequest('/dutyManage/getDutyRuleDetail', {companyId, dutyRuleId})
    // },
	//	获取公司项目班组信息，或者某个规则的项目班组明细列表
	getProjWorkGroupList(dutyRuleId, companyId, projectId, provinceId, cityId, viewUserInfo){
		return common.postRequest('/dutyManage/getProjectWorkGroupList', {dutyRuleId, companyId, projectId, provinceId, cityId, viewUserInfo})
	},
    //	公司某个规则的部门适用人群
    accordDepartentGetRange(companyId, dutyRuleId){
        return common.getRequest('/dutyManage/getDutyRuleByRuleIdAndDepartment', {companyId, dutyRuleId})
    },
	//	某个规则的项目班组明细列表
    accordProjGetRange(dutyRuleId, companyId, viewUserInfo){
        return common.postRequest('/dutyManage/getProjectWorkGroupList', {dutyRuleId, companyId, viewUserInfo})
    },

    //	申请考勤审批
    applyAttendApproval(projectId, dutyType, dutyDate, dutyTimes, dutyRemark){
        return common.postRequest('/dutyManage/addDutyAudit', {projectId, dutyType, dutyDate, dutyTimes, dutyRemark})
    },
	//	补卡类型
    cardType(){
        return common.getRequest('/dutyManage/getDutyAuditEnum')
    },
	//	获取审批人员列表
    getAuditUserList(companyId, projectId){
        return common.getRequest('/dutyManage/getDutyAuditUserList',{companyId, projectId})
    },
	//	获取补卡统计
    myAuditHistary(companyId, auditType, isAudit){
        return common.getRequest('/dutyManage/getDutyAuditCount',{companyId, auditType, isAudit})
    },
	//	考勤审批列表
    // auditType考情类型, isAudit审批结果(0未审批)(1未通过)(2通过), userName名字模糊查询, companyId公司ID,必填,page第几页,pageSize每页条数,
	// order排序字段,searchDate查询日期可以按天按月份,searchDateTyp1按天2按月查询
    auditList(companyId, page, pageSize, isAudit, auditType, searchDateType, searchDate){
        return common.getRequest('/dutyManage/getDutyAuditList',{companyId, page, pageSize, isAudit, auditType, searchDateType, searchDate})
    },
    //	补卡申请历史列表
    twoList(page, pageSize, auditType, searchDateType, searchDate){
        return common.getRequest('/dutyManage/getDutyAuditHistoryList',{page, pageSize, auditType, searchDateType, searchDate})
    },
    //	审核考勤申请
    isPassAudit(id, isAudit, auditRemark){
        return common.getRequest('/dutyManage/auditDutyAudit',{id, isAudit, auditRemark})
    },
    //	获取考勤适用范围下面的所有人（包括部门和项目）
    oneDutyAllPerson(dutyRuleId){
        return common.postRequest('/dutyManage/getDutyRuleUseList',{dutyRuleId})
    },




};

export {
  dutyApi
}
