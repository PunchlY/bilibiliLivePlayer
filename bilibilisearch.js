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

const liveResponse = {
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
                        liveResponse.NumPages = json.data.numPages;
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
        quality_description: [],
    },
    regist: (cid, qn = roomPlayInfo.data.current_qn) =>
        mergeUrl('https://api.live.bilibili.com/room/v1/Room/playUrl', {
            platform: 'h5',
            cid: cid,
            qn: qn,
        })
            .then(url => autoGet(url))
            .then(json => {
                return new Promise(function (resolve, reject) {
                    try {
                        roomPlayInfo.data = {
                            current_qn: json.data.current_qn,
                            quality_description: json.data.quality_description,
                        };
                        let url_info = [];
                        json.data.durl.forEach(function (url) {
                            url_info.push(url.url);
                        });
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
                    liveIcon.data[parent.name]={}
                    parent.list.forEach(function (element) {
                        liveIcon.data[parent.name][element.name] = element.pic;
                    });
                });
            }),
};