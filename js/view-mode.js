(function(){
var root=document.documentElement,forced=false;
try{forced=localStorage.getItem('arch-view-mode')==='desktop'}catch(e){}
function apply(){root.dataset.viewMode=forced?'desktop':'auto';var meta=document.querySelector('meta[name="viewport"]');if(meta)meta.content=forced?'width=1280':'width=device-width, initial-scale=1';}
apply();document.addEventListener('DOMContentLoaded',function(){var b=document.createElement('button');b.className='view-mode-toggle';b.type='button';b.textContent=forced?'모바일 보기':'PC 보기';b.addEventListener('click',function(){try{localStorage.setItem('arch-view-mode',forced?'auto':'desktop')}catch(e){}location.reload()});document.body.appendChild(b)});
})();