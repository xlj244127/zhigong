import { Buffer } from 'buffer';
import { crc16 } from 'js-crc';

const packageSize = 255, headerSize = 8, dataSize = 247;

class pkg {
    _buffer;

    static from(buf) {
        let p =  new pkg();
        p.buffer = buf;

        return p;
    }

    static fromBigData(seq, aryBuffer) {
        let startPos = (seq-1) * dataSize;

        let buffer;
        let isEnd = 0;
        if(startPos >= aryBuffer.byteLength)
            return null;
        if((startPos + dataSize) < aryBuffer.byteLength) {
            buffer = new Buffer(packageSize);
        }
        else {
            buffer = new Buffer(aryBuffer.byteLength - startPos + headerSize);
            isEnd = 1;
        }
        buffer.writeUInt8(buffer.length, 0);  //设置包长度
        buffer.writeUInt32BE(seq, 1);               //设置包序列号
        buffer.writeInt8(isEnd, 7);              //设置是否最后一个包
        let srcBuffer = new Buffer.from(aryBuffer, startPos, buffer.length - headerSize);
        srcBuffer.copy(buffer, headerSize);
        //计算CRC
        let crc = crc16(buffer.buffer.slice(headerSize));
        let crcBuffer = Buffer.from(crc, 'hex');
        crcBuffer.copy(buffer, 5);

        return pkg.from(buffer.buffer);
    }

    static calcPercent(seq, totalLength) {
        return Math.round(seq * 100 / Math.ceil(totalLength / dataSize));
    }

    static isLast(seq, totalLength) {
        return Math.ceil(totalLength / dataSize) === seq;
    }

    toBigData(aryBuffer) {
        let buf = new Buffer(aryBuffer);
        this._buffer.copy(buf, (this.seq - 1) * dataSize, headerSize);
    }

    isCrcCorrect() {
        let crc = crc16(this._buffer.slice(headerSize));
        let crcBuffer = Buffer.from(crc, 'hex');
        if(crcBuffer.readUInt16BE(0) === this.crc)
            return true;
        else
            return false;
    }

    get buffer() {
        if(!this._buffer)
            this._buffer = new Buffer(packageSize);
        return this._buffer.buffer;
    }

    set buffer(buf) {
        this._buffer = new Buffer(buf);
    }

    get length() {
        return this._buffer.readUInt8(0);
    }

    get seq() {
        return this._buffer.readUInt32BE(1);
    }

    get crc() {
        return this._buffer.readUInt16BE(5);
    }

    get isEnd() {
        return this._buffer.readUInt8(7);
    }

    get data() {
        return this._buffer.buffer.slice(headerSize);
    }
}

export {
    packageSize, headerSize, dataSize, pkg
}
