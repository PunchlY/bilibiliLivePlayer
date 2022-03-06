var Hls = window.Hls
var url = 'https://d1--cn-gotcha204.bilivideo.com/live-bvc/932460/live_23671902_59068738/index.m3u8?expires=1646419447&len=0&oi=2634039685&pt=h5&qn=10000&trid=1007c7612ae449054a628575221f9ebd1bbc&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=cn-gotcha204&sign=ed297e5ac4fdd0eeef26f0e786949394&sk=4e0b953959391775926f0ac3ed24850e&p2p_type=0&src=57349&sl=1&free_type=0&flowtype=1&machinezone=jd&pp=srt&slot=2&source=onetier&order=1&site=331f6bb66f3f407a883136f5a8aa2762'
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