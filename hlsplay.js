//by https://github.com/video-dev/hls.js/

var newscript = document.createElement('script');
newscript.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.1.5/dist/hls.min.js';
document.head.appendChild(newscript);

var hls;

function Hlsplay(video, videoSrc, config) {
  if (Hls.isSupported()) {
    hls = new Hls(config);
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
  }
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
  }
}

function Hlsoff() {
  try {
    hls.stopLoad();
    hls.destory();
  } catch (e) {
  }
}