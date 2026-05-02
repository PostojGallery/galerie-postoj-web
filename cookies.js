(function(){
  var CONSENT_KEY='postoj_ga_consent';
  var DISMISSED_KEY='postoj_cookies_v2';

  function loadGA(){
    if(window._gaLoaded)return;
    window._gaLoaded=true;
    var s=document.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id=G-E435HM6L2R';
    document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    window.gtag('js',new Date());
    window.gtag('config','G-E435HM6L2R');
  }

  // Returning visitor who already accepted — load GA silently
  if(localStorage.getItem(CONSENT_KEY)==='1'){loadGA();return;}

  // Returning visitor who already dismissed — don't show bar
  if(localStorage.getItem(DISMISSED_KEY))return;

  // First visit — show consent bar
  var style=document.createElement('style');
  style.textContent=
    '#cookie-bar{position:fixed;bottom:0;left:0;right:0;z-index:40000;'+
    'background:#fff;'+
    'border-top:1px solid rgba(0,0,0,0.1);'+
    'padding:1.1rem 2.5rem;'+
    'display:flex;align-items:center;gap:1.5rem;'+
    'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;'+
    'font-size:0.82rem;letter-spacing:0.04em;color:#000;}'+
    '#cookie-bar-text{flex:1;}'+
    '#cookie-bar-accept{background:#000;color:#fff;border:none;'+
    'padding:0.45rem 1.1rem;font-size:0.7rem;letter-spacing:0.14em;'+
    'text-transform:uppercase;font-weight:700;font-family:inherit;cursor:none;'+
    'flex-shrink:0;transition:background 0.2s;}'+
    '#cookie-bar-accept:hover{background:#333;}'+
    '#cookie-bar-close{background:none;border:none;padding:0.3rem 0.5rem;'+
    'font-size:1.3rem;line-height:1;color:rgba(0,0,0,0.4);'+
    'cursor:none;font-family:inherit;flex-shrink:0;transition:color 0.2s;}'+
    '#cookie-bar-close:hover{color:#000;}'+
    '@media(max-width:768px){'+
    '#cookie-bar{padding:1rem 1.2rem;font-size:0.78rem;flex-wrap:wrap;}'+
    '#cookie-bar-accept{font-size:0.68rem;padding:0.4rem 0.9rem;}}';
  document.head.appendChild(style);

  var bar=document.createElement('div');
  bar.id='cookie-bar';
  bar.innerHTML=
    '<span id="cookie-bar-text">Umění pro lidi, ne pro data. Souhlasíte s analytickými cookies pro zlepšení webu?</span>'+
    '<button id="cookie-bar-accept">Souhlasím</button>'+
    '<button id="cookie-bar-close" aria-label="Zavřít">&#215;</button>';
  document.body.appendChild(bar);

  function hideBar(){
    bar.style.transition='opacity 0.25s';
    bar.style.opacity='0';
    setTimeout(function(){bar.remove();},250);
  }

  document.getElementById('cookie-bar-accept').addEventListener('click',function(){
    localStorage.setItem(CONSENT_KEY,'1');
    loadGA();
    hideBar();
  });

  document.getElementById('cookie-bar-close').addEventListener('click',function(){
    localStorage.setItem(DISMISSED_KEY,'1');
    hideBar();
  });
})();
