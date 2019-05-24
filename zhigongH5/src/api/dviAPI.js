import { common } from '../lib/common'

var dviApi = {
    getData (type) {
        return common.getRequest('/dictionary/listByType', {type})
    },

    getProfessions () {
        return common.getRequest('/dictionary/listByType', {type: 'profession'})
    },

    getDimensions () {
        return common.getRequest('/dictionary/listByType', {type: 'CompanyDimension'})
    },

    getWorkTypes () {
        return common.getRequest('/dictionary/listByType', {type: 'WorkType'})
    },
};

export {
    dviApi
}