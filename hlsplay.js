//by https://github.com/video-dev/hls.js/
//https://cdn.jsdelivr.net/npm/hls.js@1.1.5/dist/hls.min.js

var hls;

function hlsLoad(video, videoSrc) {
    hls = new Hls({
        liveSyncDurationCount: undefined,
        liveMaxLatencyDurationCount: undefined,
        liveSyncDuration: 1,
        liveMaxLatencyDuration: 5,
    });
    hls.attachMedia(video);
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        hls.loadSource(videoSrc);
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log("fatal network error encountered, try to recover");
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log("fatal media error encountered, try to recover");
                        hls.recoverMediaError();
                        break;
                    default:
                        hlsDestroy();
                        break;
                }
            }
        });
    });
}

function hlsDestroy() {
    try {
        hls.stopLoad();
        hls.destroy();
        return console.log('hls stop.');
    } catch (e) {
        return console.log('hls stop error.');
    }
}