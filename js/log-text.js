(function(){
 function format(root){
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[],node;
  while(node=walker.nextNode()){if(!node.parentElement.closest('code,pre,mark,.log-quote'))nodes.push(node)}
  nodes.forEach(function(node){
   var text=node.nodeValue,pattern=/`([^`\n]+)`|“([^”]+)”|"([^"\n]+)"|‘([^’]+)’|(?<![\p{L}\p{N}])'([^'\n]+)'(?![\p{L}\p{N}])/gu;
   var fragment=document.createDocumentFragment(),last=0,match;
   while(match=pattern.exec(text)){
    fragment.appendChild(document.createTextNode(text.slice(last,match.index)));
    var code=match[1]!==undefined,el=document.createElement(code?'code':'span');
    el.className=code?'log-code':(match[4]!==undefined||match[5]!==undefined?'log-quote log-thought':'log-quote log-dialogue');
    if(el.classList.contains('log-dialogue')){
     var before=text.slice(0,match.index).split('\n').pop();
     var after=text.slice(pattern.lastIndex).split('\n')[0];
     if(!before.trim()&&!after.trim())el.classList.add('log-dialogue-block');
    }
    el.textContent=code?match[1]:match[0];fragment.appendChild(el);last=pattern.lastIndex;
   }
   if(last){fragment.appendChild(document.createTextNode(text.slice(last)));node.replaceWith(fragment)}
  });
 }
 window.formatLogText=format;
 document.querySelectorAll('.detail-body').forEach(format);
})();
