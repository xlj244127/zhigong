import { lookingJobApi } from '../lib/common'

var lookingJobApi = {
    contactList(){
        return common.getRequest('/lookingJob/contactList')
    },
    contactWorkGroup(workGroupId){
        return common.postRequest('/lookingJob/contactWorkGroup',{workGroupId})
    },
    image(){
        return common.getRequest('/lookingJob/image')
    },
    //保存考勤信息
    save (name, workingExp, provinceId, cityId, contact, remark, expectTime, treatments, salaryType, salary, userId) {
        return common.postRequest('/lookingJob/save', {name, workingExp, provinceId, cityId, contact, remark, expectTime, treatments, salaryType, salary, userId})
    },
    userInfo(userId){
        return common.getRequest('/lookingJob/',{userId})
    },
};

export {
    lookingJobApi
}