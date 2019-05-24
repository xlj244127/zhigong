import { pkg } from './pkg'
import { encode } from 'base64-arraybuffer'

let initialize = function () {
    return new Promise((resolve, reject) => {
        bluetoothle.isInitialized((result) => {
            console.log('Bluetooth isInitialized status: ' + JSON.stringify(result));
            if(result.isInitialized) {
                resolve(result);
            }
            else {
                bluetoothle.initialize(resolve, reject,
                    { request: true, statusReceiver: false });
            }
        });
    });
};

let isEnabled = function () {
    return new Promise((resolve, reject) => {
        initialize().then(()=>{
            bluetoothle.isEnabled(resolve);
        }, reject);
    });
};

let hasPermission = function () {
    return new Promise((resolve, reject) => {
        if(window.cordova.platformId === 'ios')
            resolve({hasPermission: true});
        else
            bluetoothle.hasPermission(resolve);
    });
};

let requestPermission = function () {
    return new Promise((resolve, reject) => {
        bluetoothle.requestPermission(resolve, reject);
    });
};

let initializePeripheral = function () {
    return new Promise((resolve, reject) => {
        bluetoothle.initializePeripheral(resolve, reject, {request: true, restoreKey: "Zhigong"});
    });
};

let discover = function (address) {
    return new Promise((resolve, reject) => {
        if(window.cordova.platformId === 'android')
            bluetoothle.isDiscovered((result)=>{
                console.log('Is discovery result: ' + JSON.stringify(result));
                if(result.isDiscovered)
                    resolve(result);
                else
                    bluetoothle.discover(resolve, reject, { address });
            }, reject, { address });
        else
            bluetoothle.services(resolve, reject, { address });
    });
};

let isConnected = function (address) {
    return new Promise((resolve, reject) => {
        bluetoothle.isConnected(resolve, reject, { address: address });
    });
};

let reconnect = function (address) {
    return new Promise((resolve, reject) => {
        bluetoothle.reconnect(resolve, reject, { address: address });
    });
};

let connect = function (address) {
    return new Promise((resolve, reject) => {
        isConnected(address).then((result)=>{
            console.log('Is connected: ' + JSON.stringify(result));
            if(result.isConnected)
                resolve(result);
            else
                bluetoothle.connect(resolve, reject, { address: address });
        }, (error)=>{
            console.log('Is connected error: ' + JSON.stringify(error));
            bluetoothle.connect(resolve, reject, { address: address });
        });
    });
};

let startScan = function (deviceNames, params = {}, timeout = 60) {
    return new Promise((resolve, reject) => {
        initialize().then(()=>{
            bluetoothle.startScan((result) => {
                if (result.status === "scanStarted") {
                    console.log("Scanning for devices..." + deviceNames.join(','));
                }
                else if (result.status === "scanResult") {
                    if(result.name) {
                        console.log('Scan get: ' + result.name);
                        if(deviceNames.indexOf(result.name) !== -1) {
                            console.log('Resolve device: ' + result.name);
                            stopScan();
                            resolve(result);
                        }
                    }
                }
            }, reject, params);

            setTimeout(()=>{
                stopScan().then(resolve, reject);
            }, timeout * 1000);
        }, reject);
    });
};

let stopScan = function () {
    return new Promise((resolve, reject) => {
        bluetoothle.stopScan(resolve, reject);
    });
};

let disconnect = function (address) {
    return new Promise((resolve, reject) => {
        bluetoothle.disconnect(resolve, reject, {address});
    });
};

let mtu = function (address, mtuNumber = 256) {
    return new Promise((resolve, reject) => {
        if(window.cordova.platformId === 'ios')
            resolve({mtu: mtuNumber});
        else
            bluetoothle.mtu(resolve, reject, {address, mtu: mtuNumber});
    });
};

let read = function (params) {
    return new Promise((resolve, reject) => {
        bluetoothle.read(resolve, reject, params);
    });
};

let write = function (params) {
    return new Promise((resolve, reject) => {
        bluetoothle.write(resolve, reject, params);
    });
};

let notify = function (params) {
    return new Promise((resolve, reject) => {
        bluetoothle.notify(resolve, reject, params);
    });
};

let subscribe = function (params) {
    return new Promise((resolve, reject) => {
        bluetoothle.subscribe(resolve, reject, params);
    });
};

let unsubscribe = function (params) {
    return new Promise((resolve, reject) => {
        bluetoothle.unsubscribe(resolve, reject, params);
    });
};

let decodeValue = function(value) {
    return bluetoothle.bytesToString(bluetoothle.encodedStringToBytes(value));
};

let encodeValue = function(value) {
    return bluetoothle.bytesToEncodedString(bluetoothle.stringToBytes(value));
};

let encodedStringToBytes = function(value) {
    return bluetoothle.encodedStringToBytes(value);
};

let bytesToEncodedString = function(value) {
    return bluetoothle.bytesToEncodedString(value);
};

let stringToBytes = function (value) {
    return bluetoothle.stringToBytes(value);
};

let bytesToString = function (value) {
    return bluetoothle.bytesToString(value);
};

let close = function (address) {
    return new Promise((resolve, reject) => {
        bluetoothle.close(resolve, reject, {address});
    });
};

let sendBigData = function (address, service, characteristicSend, characteristicNotify, aryBuffer, processCallback) {
    let seq = 1;
    let resendCount = 0;    //重复发送计数，重发3次未成功就算失败

    return new Promise((resolve, reject) => {
        subscribe({
            address, service, characteristic: characteristicNotify
        }).then((result)=>{
            console.log('Ack: '+JSON.stringify(result));
            if(result.type === 16) {
                if(result.content.success) {
                    processCallback(seq, aryBuffer.byteLength);

                    if(pkg.isLast(seq, aryBuffer.byteLength)) {
                        unsubscribe({
                            address, service, characteristicNotify
                        });
                        resolve('Success');
                        return;
                    }

                    seq++;
                    resendCount = 0;
                }
                else {
                    resendCount++;
                    if(resendCount >= 3) {
                        unsubscribe({
                            address, service, characteristic: characteristicNotify
                        });
                        reject();
                        return;
                    }
                }

                let p = pkg.fromBigData(seq, aryBuffer);
                if(p) {
                    let value = encode(p.buffer);
                    console.log('Write ' + value);
                    write({
                        address, service, characteristic: characteristicSend, type: 'noResponse', value
                    }).then((result)=>{
                        console.log('Write package success. Seq: ' + seq);
                    }, (error)=>{
                        console.log('Write package failed. Seq: ' + seq);
                        unsubscribe({
                            address, service, characteristicNotify
                        });
                        reject(error);
                    });
                }
            }
        }, (err)=>{
            if(err.error !== 'subscription' || err.message !== 'Already subscribed')
                reject(err);
        });

        let p = pkg.fromBigData(seq, aryBuffer);
        let value = encode(p.buffer);
        console.log('Write ' + value);
        write({
            address, service, characteristic: characteristicSend, type: 'noResponse', value
        }).then((result)=>{
            console.log('Write package success. Seq: ' + seq);
        }, (error)=>{
            console.log('Write package failed. Seq: ' + seq);
            unsubscribe({
                address, service, characteristic: characteristicNotify
            });
            reject();
        });
    });
};

let receivePackage = function(address, service, characteristic, seq) {
    return new Promise((resolve, reject) => {
        let params = {type: 17, content: {seq}};
        write({
            address, service, characteristic, value: encodeValue(JSON.stringify(params))
        }).then((result)=>{
            let p = pkg.from(result);
            if(p.seq === seq) {
                let crc = crc16(p.data);
                if(p.crc === crc) {
                    resolve(p);
                }
                else {
                    console.log('Wrong package crc, package crc is ' + p.crc + ', but calc result is ' + crc);
                    reject('Wrong package crc, package crc is ' + p.crc + ', but calc result is ' + crc);
                }
            }
            else {
                console.log('Wrong package seq, request seq: ' + seq + ', but get seq: ' + p.seq);
                reject('Wrong package seq, request seq: ' + seq + ', but get seq: ' + p.seq);
            }
        }, reject);
    });
};

let receivePackages = function (address, service, characteristic, seq, buffer, resolve, reject) {
    receivePackage(address, service, characteristic, seq).then((result)=>{
        result.toBigData(buffer);
        if(result.isEnd === 0) {
            seq++;
            receivePackages(address, service, characteristic, seq, buffer, resolve, reject);
        }
        else
            resolve();
    }, reject);
};

let receiveBigData = function (address, service, characteristic, dataLength) {
    let buffer = new ArrayBuffer(dataLength);

    return new Promise((resolve, reject) => {
        receivePackages(address, service, characteristic, 1, buffer, ()=>{
            resolve(buffer);
        }, reject);
    });
};

//连接到考勤机设备
//根据考勤机蓝牙名字为deviceName开始来匹配，一旦匹配上就开始连接并停止扫描
let connectToDevice = function(deviceNames) {
    return new Promise((resolve,reject) => {
        startScan(deviceNames).then((result)=>{
            console.log('Scan result: ' + JSON.stringify(result));
            if(result.status === 'scanResult') {
                console.log('Connecting to device: ' + JSON.stringify(result));
                connect(result.address).then((result)=>{
                    console.log('Connect result: ' + JSON.stringify(result));
                    resolve(result);
                }, reject);
            }
            else if(result.status === 'scanStopped') {
                console.log("Scan is stopped by timeout");
                reject(result);
            }
        }, reject);
    });
};

export default {
    connect, reconnect, disconnect, hasPermission, requestPermission, isEnabled,
    startScan, stopScan, read, write, subscribe, unsubscribe, connectToDevice, discover, initializePeripheral,
    encodedStringToBytes, bytesToEncodedString, stringToBytes, bytesToString, encodeValue, decodeValue, notify, close, mtu,
    sendBigData
}
