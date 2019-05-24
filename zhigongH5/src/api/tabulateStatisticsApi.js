import { common } from '../lib/common'

var tabulateStatisticsApi = {
    //用工规模,行业, 班组类型, 职务
    typeSort (type) {
        return common.getRequest('/dictionary/listByType', {type})
    },
    //获取工种类型列表，按种类分组
    allWorkTypes(name){
        return common.getRequest("/workDemand/workTypes",{name})
    }


};

export {
    tabulateStatisticsApi
}