import { LocalCache } from './utils'
import bleUtil from './bleUtil'
import fileUtil from './fileUtil'
import { Buffer } from 'buffer';
import { pkg } from './pkg';
import { commonApi, projectApi } from "../api";
import store from '../store'
import moment from 'moment'

let _deviceNames = [];
let deviceId = null;
let deviceName = '';
let isInit = false;
let isScanLocked = false;
let isConnected = false;
let isSendSubscribed = false;
let isReceiveSubscribed = false;
let isSending = false;
let isReceiving = false;

const upDownloadGap = 1; //缺省更新的时间间隔是1天
const serviceId = '1706BBC0-88AB-4B8D-877E-2237916EE929';
const sendWriteId = 'e6025621-5797-4c0a-ab6d-e6c0dea3dc3f';
const sendSubscribeId = '8bd362fa-20e9-41e0-a1bc-0ae0f819a58c';
const receiveWriteId = 'a088ff9b-7f73-4728-a8f5-a2754d5b7feb';
const receiveSubscribeId = '919d132b-fcca-424f-bad7-296291c30589';

let isOfflineModeEnabled = function () {
    return LocalCache.get('isOfflineModeEnabled');
};

let uploadAttend = function (i) {
    if(i == _deviceNames.length)
        return;

    let fileName = _deviceNames[i];
    fileUtil.getDataDirectory().then((dirEntry)=>{
        console.log('uploadAttend Dir entry: ' + JSON.stringify(dirEntry));
        dirEntry.getFile(fileName, {}, (fileEntry)=>{
            console.log('File entry: ' + JSON.stringify(fileEntry));
            fileEntry.file((file)=>{
                commonApi.uploadAttend(file).then(()=>{
                    console.log('Upload ' + fileName + ' successfully.');
                    uploadAttend(i++);
                }).catch(()=>{
                    uploadAttend(i++);
                });
            }, ()=>{
                console.log('Error read file entry');
                uploadAttend(i++);
            });
        });
    });
};

let uploadAttends = function () {
    if(_deviceNames.length === 0)
        return;

    uploadAttend(0);
};

let downloadFace = function () {
    let roleInfo = store.state.roleInfo;
    if(!roleInfo) {
        console.log('No project Id for getting face');
        return;
    }
    console.log("face文件正在下载");
     fileUtil.getDataDirectory().then((dirEntry)=>{
         console.log('downloadFace Dir entry: ' + JSON.stringify(dirEntry));
         dirEntry.getFile('face.zip', { create: true, exclusive: false }, (fileEntry)=>{
             console.log('File entry: ' + JSON.stringify(fileEntry));
             return commonApi.downloadFace(roleInfo.projectId, fileEntry.nativeURL);

         });
     }).then((res)=>{
         console.log(res);
     }).catch((err)=>{
         console.log(err);
     });
};

let autoUpDownload = function () {
    //console.log("isInit:"+isInit);
    if(isInit)
        return;

    //每10分钟调用一次，如果发现录脸特征库太旧就更新。或者有最新的考勤包就上传
    setInterval(()=>{
        /*let lastDownload = LocalCache.get('lastDownload');
        let lastUpload = LocalCache.get('lastUpload');
        console.log("lastDownload: "+lastDownload);
        if(lastDownload) {
            console.log("lastDownload true:"+lastDownload);
            lastDownload = moment(lastDownload).add(upDownloadGap, 'hours');
            if(lastDownload.isBefore(moment())) {
                //下载文件超时，重新下载
                downloadFace();
            }
        }
        else {
            //第一次直接下载
            downloadFace();
        }
        if(lastUpload) {
            console.log("lastUpload true:"+lastUpload);
            lastUpload = moment(lastUpload).add(upDownloadGap, 'days');
            if(lastUpload.isBefore(moment())) {
                //上传文件超时，重新上传
                LocalCache.set('lastUpload', lastUpload.format('YYYY-MM-DD HH:mm:ss'));
            }
        }
        else {
            //第一次直接上传
            //console.log("lastUpload false:"+lastUpload);
            LocalCache.set('lastUpload', moment().format('YYYY-MM-DD HH:mm:ss'));
            uploadAttends();
        }*/
        upDownload()
    }, 300000);
};

let upDownload = function () {
    console.log("upDownload isInit"+isInit);
    if(isInit)
        return;
    let lastDownload = LocalCache.get('lastDownload');
    let lastUpload = LocalCache.get('lastUpload');
    console.log("lastDownload: "+lastDownload);
    if(lastDownload) {
        console.log("lastDownload true:"+lastDownload);
        lastDownload = moment(lastDownload).add(upDownloadGap, 'hours');
        if(lastDownload.isBefore(moment())) {
            //下载文件超时，重新下载
            downloadFace();
        }
    }
    else {
        //第一次直接下载
        downloadFace();
    }
    if(lastUpload) {
        console.log("lastUpload true:"+lastUpload);
        lastUpload = moment(lastUpload).add(upDownloadGap, 'hours');
        if(lastUpload.isBefore(moment())) {
            //上传文件超时，重新上传
            LocalCache.set('lastUpload', lastUpload.format('YYYY-MM-DD HH:mm:ss'));
        }
    }
    else {
        //第一次直接上传
        //console.log("lastUpload false:"+lastUpload);
        LocalCache.set('lastUpload', moment().format('YYYY-MM-DD HH:mm:ss'));
        uploadAttends();
    }
}
let connect = function(deviceNames) {
    _deviceNames = deviceNames;
    return new Promise((resolve, reject) => {
        if(!isInit) {
            autoUpDownload();
            isInit = true;
            bleUtil.isEnabled().then((result)=>{
                console.log('Is enabled: ' + JSON.stringify(result));
                return new Promise((resol, rej) => {
                    if(deviceId)
                        resol();
                    else {
                        bleUtil.startScan((result)=>{
                            console.log(JSON.stringify(result));
                            if(deviceNames.indexOf(result.name) !== -1) {
                                console.log('Resolve device: ' + result.name);
                                if(isScanLocked) {
                                    console.log('Scan locked.');
                                }
                                else {
                                    deviceName = result.name;
                                    deviceId = result.id;
                                    isScanLocked = true;
                                    resol(result);
                                }
                            }
                        }, rej);
                    }
                });
            }, reject).then(()=>{
                console.log('Start connect to device.');
                return bleUtil.connect(deviceId);
            }, reject).then(()=>{
                if(isConnected === null) {
                    console.log(deviceName + ' Connected.');
                    isConnected = true;
                }
                else {
                    console.log(deviceName + ' Reconnected.');
                    isConnected = true;
                }
            }, ()=>{
                console.log(deviceName + ' Disconnected.');
                isConnected = false;
            }).then(()=>{
                return bleUtil.mtu(deviceId);
            }).then((result)=>{
                console.log('Request Mtu: ' + JSON.stringify(result));
                resolve({
                    name: deviceName,
                    id: deviceId
                });
            });
        }
    });
};

let disconnect = function() {
    if(isConnected !== null) {
        //断开连接
        bleUtil.disconnect(deviceId);
        //恢复所有状态
        isConnected = false;
        isSendSubscribed = false;
        isReceiveSubscribed = false;
        isSending = false;
        isReceiving = false;
    }
    isScanLocked = false;
};

let close = function() {
    disconnect();
    deviceId = null;
    deviceName = '';
};

let sendFile = function (fileName, processCallback) {
    return new Promise((resolve, reject) => {

        console.log("isSending:"+isSending);
        if(isSending) {
            return reject('Data is sending');
        }
        isSending = true;
        let seq = 1;
        let aryBuffer;
        //let isSendSubscribed = false
        console.log("isSendSubscribed:"+isSendSubscribed);
        if(!isSendSubscribed) {
            ble.startNotification(deviceId, serviceId, sendSubscribeId, (result)=>{
                let buf = Buffer.from(result);
                console.log('Notification: ' + buf.toString());

                let percent = pkg.calcPercent(seq, aryBuffer.byteLength);
                processCallback(percent);
                seq++;
                let p = pkg.fromBigData(seq, aryBuffer);
                if(p) {
                    console.log(p.length);

                    ble.writeWithoutResponse(deviceId, serviceId, sendWriteId, p.buffer, (result)=>{
                        console.log('Write result: ' + JSON.stringify(result));
                    }, (err)=>{
                        console.log('Write error: ' + JSON.stringify(err));
                    });
                }
                else {
                    console.log('Finished, stop notification!');
                    isSending = false;
                    // ble.stopNotification(deviceId, serviceId, sendSubscribeId);
                }
            }, (err)=>{
                console.log('Subscribe err: ' + JSON.stringify(err));
            });
        }

        fileUtil.getDataDirectory().then((dirEntry)=>{
            console.log('sendFile Dir entry: ' + JSON.stringify(dirEntry));
            dirEntry.getFile(fileName, {}, (fileEntry)=>{
                console.log('File entry: ' + JSON.stringify(fileEntry));
                fileEntry.file((file)=>{
                    let reader = new FileReader();
                    reader.onloadend = (evt)=>{
                        aryBuffer = evt.target.result;

                        let p = pkg.fromBigData(seq, aryBuffer);
                        console.log(p.length);

                        ble.writeWithoutResponse(deviceId, serviceId, sendWriteId, p.buffer, (result)=>{
                            console.log('Write result: ' + JSON.stringify(result));
                        }, (err)=>{
                            console.log('Write error: ' + JSON.stringify(err));
                        });
                    };
                    reader.readAsArrayBuffer(file);
                }, (error)=>{
                    console.log('Error read file entry');
                });
            });
        });
    });
};

let receiveFile = function (fileName, processCallback) {
    return new Promise((resolve, reject) => {
        console.log("isReceiving:"+isReceiving);
        if(isReceiving) {
            return reject('Data is receiving');
        }
        let fileWriter;
        isReceiving = true;
        let seq = 1;
        let totalLength = 0;
        console.log("isReceiveSubscribed:"+isReceiveSubscribed);
        if(!isReceiveSubscribed) {
            ble.startNotification(deviceId, serviceId, receiveSubscribeId, (result)=>{
                console.log("1263456134561321a6fqr23r42rfasfaf"+JSON.stringify(result))
                let uintArr = new Uint8Array(result);
                console.log('First uint8; ' + uintArr[0] + ', length: ' + uintArr.length);
                if(uintArr[0] != uintArr.length) {
                    let buf = Buffer.from(result, 'ascii');
                    let str = buf.toString();
                    console.log('Receive return length: ' + str);
                    let type15 = JSON.parse(str);
                    if(type15.type && type15.type === 15) {
                        totalLength = type15.content.length;
                        console.log('Total length: ' + totalLength);

                        if(totalLength > 0) {
                            let msg = JSON.stringify({type: 17, content: {seq}});
                            console.log(msg);
                            let buf = Buffer.from(msg, 'ascii');

                            ble.writeWithoutResponse(deviceId, serviceId, receiveWriteId, buf.buffer, (result)=>{
                                console.log('Write result_type_17: ' + JSON.stringify(result));
                            }, (err)=>{
                                console.log('Write error_type_17: ' + JSON.stringify(err));
                            });
                        }
                        else
                            reject('没有考勤数据下载。');
                    }
                    else {
                        console.log('Wrong type15 package');
                        isReceiving = false;
                        reject('Wrong type15 package');
                    }
                    return;
                }

                let p = pkg.from(result);
                console.log('Package length: ' + p.length + ', seq: ' + p.seq + ', isEnd: ' +  p.isEnd + ', CRC: ' + p.crc);
                console.log('Is crc correct: ' + p.isCrcCorrect());

                fileWriter.write(p.data);
                if(p.isEnd != 0){
                    console.log(fileName + ' Receive finished');
                    isReceiving = false;
                    if(fileWriter) {
                        fileWriter = null;
                    }
                    // ble.stopNotification(that.address, '1706BBC0-88AB-4B8D-877E-2237916EE929', '919d132b-fcca-424f-bad7-296291c30589');
                }
            }, (err)=>{
                console.log('Subscribe err: ' + JSON.stringify(err));
            });
        }
        fileUtil.getDataDirectory().then((dirEntry)=>{
            console.log('receiveFile Dir entry: ' + JSON.stringify(dirEntry));
            dirEntry.getFile(fileName, { create: true, exclusive: false }, (fileEntry)=>{
                console.log('File entry: ' + JSON.stringify(fileEntry));
                fileEntry.createWriter((writer)=>{
                    fileWriter = writer;
                    console.log("writer:"+JSON.stringify(fileWriter));
                    fileWriter.onwriteend = () =>{
                        console.log("Successful file write..." + seq);
                        let percent = pkg.calcPercent(seq, totalLength);
                        processCallback(percent);

                        if(pkg.isLast(seq, totalLength)) {
                            resolve('Receive successfully.');
                            return;
                        }

                        seq++;
                        let msg = JSON.stringify({type: 17, content: {seq}});
                        console.log(msg);
                        let buf = Buffer.from(msg, 'ascii');

                        ble.writeWithoutResponse(deviceId, serviceId, receiveWriteId, buf.buffer, (result)=>{
                            console.log('Write result: ' + JSON.stringify(result));
                        }, (err)=>{
                            console.log('Write error: ' + JSON.stringify(err));
                        });
                    };
                    fileWriter.onerror = (e) => {
                        console.log("Write file failed: " + e.toString());
                        isReceiving = false;
                        if(fileWriter) {
                            fileWriter = null;
                        }
                    };
                }, (error)=>{
                    console.log('Open file ' + fileName + ' failed. ' + JSON.stringify(error));
                    isReceiving = false;
                });
            });
        });
        let msg = JSON.stringify({type: 14, content: {}});
        console.log(msg);
        let buf = Buffer.from(msg, 'ascii');
        ble.writeWithoutResponse(deviceId, serviceId, receiveWriteId, buf.buffer, (result)=>{
            console.log('Write result_type_14: ' + JSON.stringify(result));
        }, (err)=>{
            console.log('Write error_type_14: ' + JSON.stringify(err));
        });
    });
};

export default {
    connect, disconnect, sendFile, receiveFile, close, isOfflineModeEnabled, autoUpDownload, downloadFace, upDownload
}
