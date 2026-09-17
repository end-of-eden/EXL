(function(){
  var home=document.querySelector('.home-content'),media=document.querySelector('.room-media'),video=document.getElementById('room-video'),notice=document.querySelector('.home-notice');
  if(!home||!media||!video||!notice)return;
  function fit(){
    if(innerWidth<=820){home.style.removeProperty('--home-media-width');home.style.removeProperty('--home-media-height');return}
    if(!home.clientHeight)return;
    var style=getComputedStyle(home),width=home.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight),height=home.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom),ratio=video.videoWidth/video.videoHeight||16/9;
    var fitted=width;
    for(var i=0;i<4;i++){
      home.style.setProperty('--home-media-width',fitted+'px');
      fitted=Math.min(width,Math.max(0,height-notice.offsetHeight-(parseFloat(style.rowGap)||16)-1)*ratio);
    }
    home.style.setProperty('--home-media-width',fitted+'px');
    home.style.setProperty('--home-media-height',(fitted/ratio)+'px');
  }
  new ResizeObserver(fit).observe(home);
  video.addEventListener('loadedmetadata',fit);
  window.addEventListener('resize',fit);
  if(document.fonts)document.fonts.ready.then(fit);
  fit();
})();
