(function(){
  var KEY='postoj_cookies_v2';
  if(localStorage.getItem(KEY))return;

  var style=document.createElement('style');
  style.textContent=
    '#cookie-bar{position:fixed;bottom:0;left:0;right:0;z-index:40000;'+
    'background:#fff;'+
    'border-top:1px solid rgba(0,0,0,0.1);'+
    'padding:1.1rem 2.5rem;'+
    'display:flex;align-items:flex-start;gap:1.5rem;'+
    'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;'+
    'font-size:0.82rem;letter-spacing:0.04em;color:#000;}'+
    '#cookie-bar-text{flex:1;}'+
    '#cookie-bar-close{background:none;border:none;padding:0.3rem 0.5rem;'+
    'font-size:1.3rem;line-height:1;color:rgba(0,0,0,0.4);'+
    'cursor:none;font-family:inherit;flex-shrink:0;'+
    'transition:color 0.2s;}'+
    '#cookie-bar-close:hover{color:#000;}'+
    '@media(max-width:768px){#cookie-bar{padding:1rem 1.2rem;font-size:0.78rem;}}';
  document.head.appendChild(style);

  var bar=document.createElement('div');
  bar.id='cookie-bar';
  bar.innerHTML=
    '<span id="cookie-bar-text">Art for people, not data. We only use essential technical cookies.</span>'+
    '<button id="cookie-bar-close" aria-label="Close">&#215;</button>';
  document.body.appendChild(bar);

  document.getElementById('cookie-bar-close').addEventListener('click',function(){
    localStorage.setItem(KEY,'1');
    bar.style.transition='opacity 0.25s';
    bar.style.opacity='0';
    setTimeout(function(){bar.remove();},250);
  });
})();
