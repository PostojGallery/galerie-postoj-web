(function(){
  var KEY='postoj_cookies_v2';
  if(localStorage.getItem(KEY))return;

  var style=document.createElement('style');
  style.textContent=
    '#cookie-bar{position:fixed;bottom:0;left:0;right:0;z-index:40000;'+
    'background:rgba(10,10,10,0.95);backdrop-filter:blur(6px);'+
    'border-top:1px solid rgba(255,255,255,0.07);'+
    'padding:0.55rem 2.5rem;'+
    'display:flex;align-items:center;gap:1.2rem;'+
    'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;'+
    'font-size:0.63rem;letter-spacing:0.08em;color:rgba(255,255,255,0.32);}'+
    '#cookie-bar-text{flex:1;}'+
    '#cookie-bar-close{background:none;border:none;padding:0.2rem 0.4rem;'+
    'font-size:1rem;line-height:1;color:rgba(255,255,255,0.25);'+
    'cursor:pointer;font-family:inherit;flex-shrink:0;'+
    'transition:color 0.2s;}'+
    '#cookie-bar-close:hover{color:rgba(255,255,255,0.7);}'+
    '@media(max-width:768px){#cookie-bar{padding:0.55rem 1.2rem;}}';
  document.head.appendChild(style);

  var bar=document.createElement('div');
  bar.id='cookie-bar';
  bar.innerHTML=
    '<span id="cookie-bar-text">Umění pro lidi, ne pro data. Používáme pouze nezbytné technické cookies.</span>'+
    '<button id="cookie-bar-close" aria-label="Zavřít">&#215;</button>';
  document.body.appendChild(bar);

  document.getElementById('cookie-bar-close').addEventListener('click',function(){
    localStorage.setItem(KEY,'1');
    bar.style.transition='opacity 0.25s';
    bar.style.opacity='0';
    setTimeout(function(){bar.remove();},250);
  });
})();
