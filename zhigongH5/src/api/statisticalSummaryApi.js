import { common } from '../lib/common'

var statisticalSummaryApi = {

    //一:今日考勤
    dayAttend(type, day) {
        return common.getRequest('/summary/daily', {type, day});
    },
    //一:项目日考勤
    oneProjDayAttend(type, day, projectId) {
        return common.getRequest('/summary/daily', {type, day, projectId});
    },

    //公司项目日考勤统计
    allProjDayAttend(page, pageSize, day, provinceId, cityId) {
        return common.getRequest('/summary/getProjectsAttends', {page, pageSize, day, provinceId, cityId});
    },
    //项目班组日考勤统计
    groupDayAttend(projectId, day) {
        return common.getRequest('/summary/getGroupsAttends', {projectId, day});
    },
    //项目临时工日考勤统计
    temperDayAttend(projectId, day) {
        return common.getRequest('/summary/getTempAttendsGroup', {projectId, day});
    },
    //项目管理员日考勤统计
    projerDayAttend(projectId, day) {
        return common.getRequest('/summary/getAdminAttendsGroup', {projectId, day});
    },

    //项目班组日考勤分组统计
    groupingDayAttendSum(projectId, workGroupId, day) {
        return common.getRequest('/summary/getGroupAttendsGroup', {projectId, workGroupId, day});
    },
    //日考勤明细
    DayAttendDetail(userId, day, projectId, groupId) {
        return common.getRequest('/attend/dayDetail', {userId, day, projectId, groupId});
    },

    //主页汇总列表
    summary(type, projectId) {
        return common.getRequest('/summary/home', {type, projectId});
    },
    //项目汇总列表
    projSummary(type) {
        return common.getRequest('/summary/home', {type});
    },

    //按月汇总
    //type: 1-企业, 2-员工
    //month: 格式为:2018-01
    monthly(type, month, projectId) {
        return common.getRequest('/summary/monthly', {type, month, projectId});
    },

    //图表月考勤
    monthEcharts(type, month, projectId){
        return common.getRequest('/summary/month', {type, month, projectId});
    }

};

export {
    statisticalSummaryApi
}