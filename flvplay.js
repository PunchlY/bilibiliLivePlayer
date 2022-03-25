//by https://github.com/xqq/mpegts.js

function flvLoad(video, videoSrc) {
    player = mpegts.createPlayer({
        type: 'mse',
        isLive: true,
        url: videoSrc,
    });
    player.attachMediaElement(video);
    player.load();
    player.play();
}

function flvDestroy() {
    try {
        player.pause();
        player.unload();
        player.detachMediaElement();
        player.destroy();
        player = null;
        return console.log('flv stop.');
    } catch (e) {
        return console.log('flv stop error.');
    }
}
