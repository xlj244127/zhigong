import { common } from '../lib/common'

var machineApi = {
    //公司绑定
    companyBind (code, companyId) {
        return common.postRequest('/machine/bind', {code, companyId})
    },
    //项目绑定
    projBind (code, projectId) {
        return common.postRequest('/machine/bind', {code, projectId})
    },
    //项目解绑
    projUnBind (machineId) {
        return common.postRequest('/machine/unbind', {machineId})
    },
    //未绑定考勤机列表
    listUnBind (){
        return common.getRequest('/machine/listUnBindMachines')
    },
    //已考勤机列表
    listBind (){
        return common.getRequest('/machine/listBindMachines')
    },
    //公司所有考勤机列表
    companyMachineList(companyId){
        return common.getRequest('/machine/list', {companyId})
    },
    //项目所有考勤机列表
    projectMachineList(projectId){
        return common.getRequest('/machine/list', {projectId})
    },
    //获取考勤机绑定的项目
    bindMachineProj(code){
        return common.getRequest('/machine/getBindProject',{code})
    }
};

export {
    machineApi
}
