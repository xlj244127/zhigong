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

let isEnabled = function () {
    return new Promise((resolve, reject) => {
        ble.isEnabled(resolve, reject);
    });
};

let enable = function () {
    return new Promise((resolve, reject) => {
        ble.enable(resolve, reject);
    });
};

let scan = function (success, failure, deviceIds = [], timeout = 60) {
    ble.scan(deviceIds, timeout, success, failure);
};

let startScan = function (success, failure, deviceIds = []) {
    ble.startScan(deviceIds, success, failure);
};

let stopScan = function () {
    return new Promise((resolve, reject) => {
        ble.stopScan(resolve, reject);
    });
};

let isConnected = function (deviceId) {
    return new Promise((resolve, reject) => {
        ble.isConnected(deviceId, resolve, reject);
    });
};

let connect = function (deviceId) {
    return new Promise((resolve, reject) => {
        ble.connect(deviceId, resolve, reject);
    });
};

let autoConnect = function (deviceId, connectCallback, disconnectCallback) {
    ble.autoConnect(deviceId, connectCallback, disconnectCallback);
};

let disconnect = function (deviceId) {
    return new Promise((resolve, reject) => {
        ble.disconnect(deviceId, resolve, reject);
    });
};

let mtu = function (deviceId, mtu = 300) {
    return new Promise((resolve, reject) => {
        if(window.cordova.platformId === 'android')
            ble.requestMtu(deviceId, mtu, resolve, reject);
        else
            resolve();
    });
};

let read = function (deviceId, service, characteristic) {
    return new Promise((resolve, reject) => {
        ble.read(deviceId, service, characteristic, resolve, reject);
    });
};

let write = function (deviceId, service, characteristic, data, withoutResponse = true) {
    return new Promise((resolve, reject) => {
        if(withoutResponse)
            ble.writeWithoutResponse(deviceId, service, characteristic, data, resolve, reject);
        else
            ble.write(deviceId, service, characteristic, data, resolve, reject);
    });
};

let startNotification = function (deviceId, service, characteristic) {
    return new Promise((resolve, reject) => {
        ble.startNotification(deviceId, service, characteristic, resolve, reject);
    });
};

let stopNotification = function (deviceId, service, characteristic) {
    return new Promise((resolve, reject) => {
        ble.stopNotification(deviceId, service, characteristic, resolve, reject);
    });
};

export default {
    hasPermission, requestPermission, isEnabled, enable, isConnected, connect, autoConnect, disconnect, mtu, read, write,
    startNotification, stopNotification, scan, startScan, stopScan
}
