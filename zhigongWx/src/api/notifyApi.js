import { common } from '../lib/common'

var notifyApi = {
    //调起录脸
    launchFace (machineId, userId, userName, cbUserId) {
        return common.postRequest('/notify/launchFace', {machineId, userId, userName, cbUserId}, {show: false})
    },
    //停止录脸
    stopFace (machineId) {
        return common.postRequest('/notify/stopFace', {machineId}, {show: false})
    },
};

export {
    notifyApi
}
