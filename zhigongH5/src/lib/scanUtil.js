let barcodeScan = function () {
    return new Promise((resolve, reject) => {
        cordova.plugins.barcodeScanner.scan(function(result){
            if(result.cancelled) {
                console.log("User cancelled the scanner.");
                reject('cancelled');
            }
            else {
                console.log('Barcode is: ' + result.text);
                resolve(result);
            }
        }, function(error){
            console.log('Scan error: ' + error);
            reject(error);
        });
    });
};

let barcodeEncode = function (data) {
    return new Promise((resolve, reject) => {
        cordova.plugins.barcodeScanner.encode('TEXT_TYPE', data, function(result){
            console.log("Bacode encode result: " + JSON.stringify(result));
            resolve(result);
        }, function(error){
            console.log('Bacode encode error: ' + error);
            reject(error);
        });
    });
};

export default {
    barcodeScan, barcodeEncode
}