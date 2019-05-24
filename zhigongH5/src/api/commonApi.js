import Vue from 'vue'
import { common } from '../lib/common'
import { serverUrl } from '../config'
import { version, channel } from '../config'
import { LocalCache } from '../lib/utils'
import moment from "moment"
let lastDownload = LocalCache.get('lastDownload');

const upDownloadGap = 1; //缺省更新的时间间隔是1小时

lastDownload = moment(lastDownload).add(upDownloadGap, 'hours');
let _downloadCordova = function (url, filePath) {
    console.log('Uri: ' + serverUrl + url);

    return new Promise((resolve, reject) => {
        let ft = new FileTransfer();

        ft.download(serverUrl + url, filePath, function (entry) {
            console.log('Download completed. ' + entry.toURL());
            LocalCache.set('lastDownload', lastDownload.format('YYYY-MM-DD HH:mm:ss'));
            resolve(entry);
        }, function (error) {
            console.log('Download error. ' + JSON.stringify(error));
        });
    });
};

let _uploadCordova = function (url, file, fileName = '', mimeType = 'image/jpeg', params = {}) {
    console.log('File: ' + file);
    return new Promise((resolve, reject) => {
        common.showLoading(true, '正在上传');
        let options = new FileUploadOptions();
        options.fileKey = "file";
        if(fileName)
            options.fileName = fileName;
        else
            options.fileName = '';
        options.mimeType = mimeType;

        Object.assign(params, {sessionkey: LocalCache.get('sessionkey'), version, channel, timestamp: new Date().getTime()});
        options.params = params;

        let ft = new FileTransfer();
        ft.upload(file, serverUrl + url, (result)=>{
            console.log('Cordova upload: ' + JSON.stringify(result));
            result = JSON.parse(result.response);
            common.hideLoading(true, '正在上传');
            if(result.code == 0)
                resolve(result);
            else
                reject(result.msg);
        }, (error)=>{
            console.log('Cordova upload error: ' + JSON.stringify(error));
            common.hideLoading(true, '正在上传');
            reject(error);
        }, options);
    });
};

var commonApi = {
    uploadFaceBase64(type, data, fileName) {
        let file = common.base64ToBlob(type, data);
        if(fileName)
            return common.postFileRequest('/common/faceUpload', {file:{file, fileName}}, {show: false, title:''});
        else
            return common.postFileRequest('/common/faceUpload', {file}, {show: false, title:''});
    },
    uploadBase64(type, data) {
        let file = common.base64ToBlob(type, data);
        return common.postFileRequest('/common/upload', {file}, {show: false, title:''});
    },
    upload(file, fileName) {
        if(fileName)
            return common.postFileRequest('/common/upload', {file:{file, fileName}}, {show: false, title:''});
        else
            return common.postFileRequest('/common/upload', {file}, {show: false, title:''});
    },
    uploadImage(file, fileName) {
        if(fileName)
            return common.postFileRequest('/common/uploadImage', {file:{file, fileName}}, {show: false, title:''});
        else
            return common.postFileRequest('/common/uploadImage', {file}, {show: false, title:''});
    },
    uploadFace(file, fileName, genData) {
        return _uploadCordova('/common/faceUpload', file, fileName, 'image/jpeg', {genData});
    },
    deleteFace(userId) {
        return common.postRequest('/common/deleteFace', {userId});
    },
    uploadCordova(file, fileName = '') {
        return  _uploadCordova('/common/upload', file, fileName);
    },
    getBaiduApiToken () {
        return common.getRequest('/common/getBaiduApiToken', {}, {show: false, title:''});
    },
    baiduIdcardRecognize(id_card_side, image) {
        return new Promise((resolve, reject) => {
            common.showLoading(true, '正在识别');
            this.getBaiduApiToken().then((result)=>{
                console.log('Baidu Token: ' + JSON.stringify(result));
                return Vue.http.post('https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token='+result.data.Access_Token, {
                    detect_direction: 'true',
                    id_card_side, //正反面，front, back
                    image, //Base64格式
                    detect_risk: 'false'
                }, {
                    emulateJSON: true
                });
            }).then((response) => {
                common.hideLoading(true, '正在识别');
                resolve(response.body);
            }).catch((err) => {
                console.log('Recognize err: ' + JSON.stringify(err));
                common.hideLoading(true, '正在识别');
                reject(err);
            });
        });
    },
    getXaiomiApiToken(account) {
        return Vue.http.get(serverUrl+'/common/getXiaomiApiToken?account='+account, {
        }, {
            emulateJSON: true
        });
    },

    //上传考勤数据
    uploadAttend (file) {
        return  _uploadCordova('/attend/uploadAttend', file, 'attend.zip', 'application/x-zip-compressed');
    },

    //下载并且保存录脸数据
    downloadFace(projectId, filePath) {
        return _downloadCordova('/project/getProjectFaces?projectId='+projectId+'&sessionkey='+LocalCache.get('sessionkey'), filePath);
    }
};

export {
    commonApi
}
