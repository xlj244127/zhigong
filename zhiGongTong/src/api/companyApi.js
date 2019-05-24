import { common } from '../lib/common'

var companyApi = {
    //创建公司
    create (name, detailAddress, contact, mobile, phone, logo,
            license, dimension, profession, email, homepage) {
      return common.postRequest('/company/save', {name, detailAddress, contact, mobile, phone, logo,
        license, dimension, profession, email, homepage})
    },
    //编辑公司
    editCompany (id, name, detailAddress, contact, mobile, phone, logo,
            license, dimension, profession, email, homepage) {
        return common.postRequest('/company/save', {id, name, detailAddress, contact, mobile, phone, logo,
            license, dimension, profession, email, homepage})
    },
    //公司详情
    admins(name,page,pageSize,searchPara,viewRights,departmentId,positionsId) {
       return common.getRequest('/company/admins',{name,page,pageSize,searchPara,viewRights,departmentId,positionsId})
    },
    companyInfo (id) {
        return common.getRequest('/company/' + id)
    },
    //添加企业管理员
    addCompanyManager (userId) {
        return common.postRequest('/company/addCompanyAdminUser',{userId})
    },
    //查询企业管理员
    companyManagerList (page,pageSize) {
        return common.getRequest('/company/getCompanyAdminUsers',{page,pageSize})
    },
    //删除企业管理员
    delCompanyManager(userIds){
        return common.postRequest('/company/deleteCompanyAdminUser',{userIds})
    },

    //公司信息录入汇总
    companyInfoEnterSum(){
        return common.getRequest('/company/sumInput')
    },
    //查询公司项目录入列表
    companyProjList(name, provinceId, cityId, page, pageSize){
        return common.getRequest('/company/getCompanyProjectsForInput',{name, cityId,provinceId, page, pageSize})
    },



};

export {
    companyApi
}
