//by https://github.com/video-dev/hls.js/

var newscript = document.createElement('script');
newscript.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.1.5/dist/hls.min.js';
document.head.appendChild(newscript);

var hls;
const config = {
    liveSyncDurationCount: undefined,
    liveMaxLatencyDurationCount: undefined,
    liveSyncDuration: 1,
    liveMaxLatencyDuration: 5,
}

function hlsPlay(video, videoSrc) {
    if (Hls.isSupported()) {
        hls = new Hls(config);
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
                            hlsStop();
                            break;
                    }
                }
            });
        });
    }
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
    }
}

function hlsStop() {
    try {
        hls.stopLoad();
        hls.destroy();
        return console.log('stop.');
    } catch (e) {
        return console.log('stop error.');
    }
}