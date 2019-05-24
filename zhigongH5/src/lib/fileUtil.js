let getDataDirectory = function () {
    return new Promise((resolve, reject) => {
        if(cordova.platformId === 'ios')
            resolveLocalFileSystemURL(cordova.file.dataDirectory, resolve, reject);
        else if(cordova.platformId === 'android') {
            resolveLocalFileSystemURL(cordova.file.externalDataDirectory, resolve, (error)=>{
                console.log('Resolve external app storage directory error: ' + JSON.stringify(error));
                resolveLocalFileSystemURL(cordova.file.dataDirectory, resolve, reject);
            });
        }
    });
};

let getCacheDirectory = function () {
    return new Promise((resolve, reject) => {
        if(cordova.platformId === 'ios')
            resolveLocalFileSystemURL(cordova.file.cacheDirectory, resolve, reject);
        else if(cordova.platformId === 'android') {
            resolveLocalFileSystemURL(cordova.file.externalCacheDirectory, resolve, (error)=>{
                console.log('Resolve external app storage directory error: ' + JSON.stringify(error));
                resolveLocalFileSystemURL(cordova.file.dataDirectory, resolve, reject);
            });
        }
    });
};

let getApplicationStorageDirectory = function () {
    return new Promise((resolve, reject) => {
        if(cordova.platformId === 'ios')
            resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, resolve, reject);
        else if(cordova.platformId === 'android') {
            resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, resolve, (error)=>{
                console.log('Resolve external app storage directory error: ' + JSON.stringify(error));
                resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, resolve, reject);
            });
        }
    });
};



let getSyncDataDirectory = function () {
    return new Promise((resolve, reject) => {
        getApplicationStorageDirectory().then((rootDir)=>{
            createDir(rootDir, 'sync').then(resolve, reject);
        }, reject);
    });
};

let createDir = function (dirEntry, dirName) {
    return new Promise((resolve, reject) => {
        dirEntry.getDirectory(dirName, { create:true }, resolve, (error)=>{
            reject(error);
        });
    });
};

let createFile = function(dirEntry, fileName) {
    return new Promise((resolve, reject) => {
        dirEntry.getFile(fileName, {}, (fileEntry)=>{
            fileEntry.remove(()=>{
                dirEntry.getFile(fileName, { create: true, exclusive: false }, resolve, reject);
            }, reject);
        }, (error)=>{
            if(error.code === FileError.NOT_FOUND_ERR)
                dirEntry.getFile(fileName, { create: true, exclusive: false }, resolve, reject);
            else
                reject(error);
        });
    });
};

export default {
    getDataDirectory, getCacheDirectory, getApplicationStorageDirectory, getSyncDataDirectory, createDir, createFile
}