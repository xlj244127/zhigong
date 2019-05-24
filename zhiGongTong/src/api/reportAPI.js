import { common } from '../lib/common'

var reportApi = {
    salary (projectId) {
        return common.getRequest('/reports/salary', {projectId})
    },
};

export {
    reportApi
}
