(function(){
var frame=document.getElementById('archive-frame'),dialog=document.createElement('dialog');
dialog.className='mobile-popup';dialog.setAttribute('aria-labelledby','mobile-popup-title');
dialog.innerHTML='<header><h2 id="mobile-popup-title"></h2><button type="button" aria-label="닫기"><span class="arch-icon" data-icon="x" aria-hidden="true"></span></button></header><div class="mobile-popup-body"></div>';
document.body.appendChild(dialog);
dialog.querySelector('button').onclick=function(){dialog.close()};
dialog.addEventListener('click',function(e){if(e.target===dialog){var r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
window.addEventListener('message',function(e){
if(e.origin!==location.origin||e.source!==frame.contentWindow||!e.data||e.data.type!=='archive-mobile-popup'||innerWidth>820)return;
if(!['care-list-window','banner-window'].includes(e.data.id))return;
var source=document.getElementById(e.data.id).querySelector('.banner-window__body');
dialog.querySelector('h2').textContent=e.data.id==='care-list-window'?'LIST':'BANNER';
dialog.querySelector('.mobile-popup-body').replaceChildren(...Array.from(source.children,function(child){return child.cloneNode(true)}));
if(!dialog.open)dialog.showModal();
});
window.addEventListener('resize',function(){if(innerWidth>820&&dialog.open)dialog.close()});
})();
