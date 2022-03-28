//bilibili弹幕 by https://blog.csdn.net/yyznm/article/details/116543107

var timer = null;
var ws;

function WebSocketTest(roomid) {
    var roomid = roomid;
    var url = 'wss://broadcastlv.chat.bilibili.com/sub';
    if (ws)
        ws.close()
    ws = new WebSocket(url);
    ws.onopen = function () {
        ws.send(getCertification(JSON.stringify({
            'uid': 0,
            'roomid': parseInt(roomid),
            'protover': 1,
            'platform': 'web',
            'clientver': '1.4.0',
        })).buffer);
        timer = setInterval(function () {
            var n1 = new ArrayBuffer(16)
            var i = new DataView(n1);
            (
                i.setUint32(0, 0),
                i.setUint16(4, 16),
                i.setUint16(6, 1),
                i.setUint32(8, 2),
                i.setUint32(12, 1)
            );
            ws.send(i.buffer);
        }, 30000)
    };
    ws.onclose = function () {
        if (timer != null)
            clearInterval(timer);
    };
    ws.onmessage = function (evt) {
        let blob = evt.data;
        decode(blob, function (packet) {
            if (packet.op == 5) {
                packet.body.forEach(function (element) {
                    analyDanmuPacket(element)
                });
            }
        });
    };
}

var textDecoder = new TextDecoder('utf-8');

const readInt = function (buffer, start, len) {
    let result = 0
    for (let i = len - 1; i >= 0; i--) {
        result += Math.pow(256, len - i - 1) * buffer[start + i]
    }
    return result
}

function decode(blob, call) {
    let reader = new FileReader();
    reader.onload = function (e) {
        let buffer = new Uint8Array(e.target.result)
        let result = {}
        result.packetLen = readInt(buffer, 0, 4)
        result.headerLen = readInt(buffer, 4, 2)
        result.ver = readInt(buffer, 6, 2)
        result.op = readInt(buffer, 8, 4)
        result.seq = readInt(buffer, 12, 4)
        if (result.op == 5) {
            result.body = []
            let offset = 0;
            while (offset < buffer.length) {
                let packetLen = readInt(buffer, offset + 0, 4)
                let headerLen = 16// readInt(buffer,offset + 4,4)
                let data = buffer.slice(offset + headerLen, offset + packetLen);

                let body = '{}'
                if (result.ver == 2) {
                    body = textDecoder.decode(pako.inflate(data));
                } else {
                    body = textDecoder.decode(data);
                }
                if (body) {
                    const group = body.split(/[\x00-\x1f]+/);
                    group.forEach(item => {
                        try {
                            result.body.push(JSON.parse(item));
                        } catch (e) {
                        }
                    });
                }
                offset += packetLen;
            }
        }
        call(result);
    }
    reader.readAsArrayBuffer(blob);
}

function getCertification(json) {
    var bytes = str2bytes(json);
    var n1 = new ArrayBuffer(bytes.length + 16)
    var i = new DataView(n1);
    (
        i.setUint32(0, bytes.length + 16),
        i.setUint16(4, 16),
        i.setUint16(6, 1),
        i.setUint32(8, 7),
        i.setUint32(12, 1)
    );
    bytes.forEach(function (element, index) {
        i.setUint8(16 + index, element);
    });
    return i;
}

function str2bytes(str) {
    const bytes = []
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i)
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0)
            bytes.push(((c >> 12) & 0x3F) | 0x80)
            bytes.push(((c >> 6) & 0x3F) | 0x80)
            bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0)
            bytes.push(((c >> 6) & 0x3F) | 0x80)
            bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0)
            bytes.push((c & 0x3F) | 0x80)
        } else {
            bytes.push(c & 0xFF)
        }
    }
    return bytes
}