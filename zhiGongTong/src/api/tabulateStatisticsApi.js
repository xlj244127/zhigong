import { common } from '../lib/common'

var tabulateStatisticsApi = {
    //用工规模,行业, 班组类型, 职务
    typeSort (type) {
        return common.getRequest('/dictionary/listByType', {type})
    }



};

export {
    tabulateStatisticsApi
}