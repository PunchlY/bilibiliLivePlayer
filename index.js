var Hls = window.Hls
var url = 'https://d1--cn-gotcha03.bilivideo.com/live-bvc/346915/live_509069409_67641662.flv?cdn=cn-gotcha03&expires=1646578180&len=0&oi=2634039694&pt=web&qn=10000&trid=1000ae6c26c5431a42d09123c85ee80e9fa3&sigparams=cdn,expires,len,oi,pt,qn,trid&sign=fd0d73a50d12704cd55e45538e7e1ced&ptype=0&src=4&sl=1&sk=30ca2b1b36442cde4c50e29e44590c13&order=4'
if (Hls.isSupported()) {
  var hls = new Hls()
  hls.loadSource(url)
  hls.attachMedia(video)
  hls.on(Hls.Events.MANIFEST_PARSED, function () {
    // video.play()
  })
} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  video.src = url
  video.addEventListener('canplay', function () {
    // video.play()
  })
}