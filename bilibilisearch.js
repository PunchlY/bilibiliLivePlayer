//

const cors = {
    value: false,
    set: (bool) => cors.value = bool,
};

const mergeUrl = (url, data) => {
    for (let k in data) url += `&${k}=${encodeURIComponent(data[k])}`;
    return new Promise(function (resolve, reject) {
        resolve(url.replace(/^(.*?)&(.*)$/, '$1?$2'));
    });
};

const get = url => fetch(url).then(r => r.json());
const corsGet = url =>
    fetch(`https://json2jsonp.com/?callback=cbfunc&url=${encodeURIComponent(url)}`)
        .then(r => r.text())
        .then(jsonp => JSON.parse(jsonp.replace(/^cbfunc\((.*)\)$/, '$1')));
const autoGet = url => (cors.value ? get(url) : corsGet(url));

const searchResponse = {
    NumPages: 1,
    get: (type, key, page = 1) =>
        mergeUrl('https://api.bilibili.com/x/web-interface/search/type', {
            search_type: type,
            keyword: key,
            page: page,
        })
            .then(url => autoGet(url))
            .then(json => {
                return new Promise(function (resolve, reject) {
                    try {
                        searchResponse.NumPages = json.data.numPages;
                        resolve(json.data.result);
                    }
                    catch (e) {
                        resolve([]);
                    }
                });
            }),
};

const roomPlayInfo = {
    data: {
        current_qn: 10000,
        accept_qn: [],
    },
    get: (room_id, qn = 10000, protocol = 0) =>
        mergeUrl('https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo', {
            protocol: protocol,
            format: '0,1,2',
            codec: '0,1',
            room_id: room_id,
            qn: qn,
            platform: 'h5',
            ptype: 8,
        })
            .then(url => autoGet(url))
            .then(json => {
                return new Promise(function (resolve, reject) {
                    try {
                        roomPlayInfo.data = {
                            current_qn: json.data.playurl_info.playurl.stream[0].format[0].codec[0].current_qn,
                            accept_qn: [],
                        };
                        let url_info = [];
                        json.data.playurl_info.playurl.stream[0].format.forEach(function (format) {
                            format.codec.forEach(function (codec) {
                                base_url = codec.base_url;
                                codec.url_info.forEach(function (element) {
                                    url_info.push(`${element.host}${base_url}${element.extra}`);
                                });
                                codec.accept_qn.forEach(function (element) {
                                    roomPlayInfo.data.accept_qn.push(element);
                                });
                            });
                        });
                        roomPlayInfo.data.accept_qn = [...new Set(roomPlayInfo.data.accept_qn)];
                        resolve(url_info);
                    }
                    catch (e) {
                        resolve([]);
                    }
                });
            }),
};

const liveIcon = {
    data: {},
    get: () =>
        autoGet('https://api.live.bilibili.com/room/v1/Area/getList')
            .then(json => {
                liveIcon.data = {};
                json.data.forEach(function (parent) {
                    liveIcon.data[parent.name] = {}
                    parent.list.forEach(function (element) {
                        liveIcon.data[parent.name][element.name] = element.pic;
                    });
                });
            }),
};