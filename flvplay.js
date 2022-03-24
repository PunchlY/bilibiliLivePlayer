
function player_load() {
    if (mpegts.getFeatureList().mseLivePlayback) {
        var videoElement = document.getElementById('videoElement');
        player = mpegts.createPlayer({
            type: 'mse',
            isLive: true,
            url: 'https://d1--ov-gotcha07.bilivideo.com/live-bvc/943405/live_8795938_2820068.flv?expires=1648067359&len=0&oi=1608048765&pt=h5&qn=10000&trid=10009d8840817e3c45218c6826664cea1811&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=ov-gotcha07&sign=a8763435d4390917db526b1102cfcfdd&sk=860decc1a377ac6043585e49b7f4d2d2&p2p_type=0&src=4&sl=1&free_type=0&flowtype=0&machinezone=ylf&pp=srt&slot=8&source=onetier&order=2&site=a9e25392237b7cfa902d5f874e97e0b5'
        });
        player.attachMediaElement(videoElement);
        player.load();
        player.play();
    }
}
function player_destroy() {
    player.pause();
    player.unload();
    player.detachMediaElement();
    player.destroy();
    player = null;
}
