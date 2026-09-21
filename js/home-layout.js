(function(){
  var home=document.querySelector('.home-content'),media=document.querySelector('.room-media'),video=document.getElementById('room-video'),notice=document.querySelector('.home-notice');
  if(!home||!media||!video||!notice)return;
  function fit(){
    if(innerWidth<=820){['--home-media-width','--home-media-height','--home-notice-width'].forEach(function(key){home.style.removeProperty(key)});return}
    if(!home.clientHeight)return;
    var style=getComputedStyle(home),width=home.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight),height=home.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom),ratio=video.videoWidth/video.videoHeight||16/9,gap=parseFloat(style.rowGap)||16;
    // Keep text readable while looking for a shared width that fits the viewport.
    var minimum=Math.min(width,460),fitted=0;
    for(var candidate=width;candidate>=minimum;candidate-=8){
      home.style.setProperty('--home-notice-width',candidate+'px');
      if(candidate/ratio+notice.offsetHeight+gap<=height-2){fitted=candidate;break}
    }
    if(!fitted){
      // Short windows need a wider text block so line wrapping cannot collapse the video.
      home.style.setProperty('--home-notice-width',width+'px');
      fitted=Math.min(width,Math.max(0,height-notice.offsetHeight-gap-2)*ratio);
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
