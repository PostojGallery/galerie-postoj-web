(function(){
  var KEY='postoj_consent_v4';
  var GA_ID='G-E435HM6L2R';
  var EXP=365*24*60*60*1000;
  var _bar=null,_modal=null;

  /* ── helpers ── */
  function getConsent(){
    try{
      var d=JSON.parse(localStorage.getItem(KEY)||'null');
      if(d&&Date.now()-d.ts<EXP)return d;
      if(d)localStorage.removeItem(KEY);
    }catch(e){}
    return null;
  }
  function saveConsent(analytics,marketing){
    try{localStorage.setItem(KEY,JSON.stringify({ts:Date.now(),analytics:!!analytics,marketing:!!marketing}));}catch(e){}
  }
  function loadGA(){
    if(window._gaLoaded)return;window._gaLoaded=true;
    var s=document.createElement('script');s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;
    document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    gtag('js',new Date());gtag('config',GA_ID);
  }

  /* ── styles ── */
  var css=document.createElement('style');
  css.id='postoj-cookie-css';
  css.textContent=
    '#cbar{position:fixed;bottom:0;left:0;right:0;z-index:40000;background:#0a0a0a;'+
    'border-top:1px solid rgba(255,255,255,0.08);padding:1.4rem 2.5rem;'+
    'display:flex;align-items:center;gap:2rem;'+
    'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;'+
    'font-size:0.8rem;line-height:1.55;color:rgba(255,255,255,0.5);}'+
    '#cbar-text{flex:1;}'+
    '#cbar-btns{display:flex;gap:0.75rem;align-items:center;flex-shrink:0;}'+
    '.cbtn{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:0.7rem;'+
    'letter-spacing:0.13em;text-transform:uppercase;font-weight:700;cursor:none;'+
    'padding:0.65rem 1.3rem;transition:background 0.2s,color 0.2s,border-color 0.2s;}'+
    '.cbtn-primary{background:#fff;color:#000;border:1px solid #fff;}'+
    '.cbtn-primary:hover{background:#e8e8e8;}'+
    '.cbtn-ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.3);}'+
    '.cbtn-ghost:hover{border-color:#fff;}'+
    '.cbtn-text{background:transparent;color:rgba(255,255,255,0.35);border:none;'+
    'padding:0.65rem 0.4rem;font-size:0.68rem;text-decoration:underline;text-underline-offset:3px;}'+
    '.cbtn-text:hover{color:#fff;}'+
    '#cmodal-ov{position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:50000;'+
    'display:flex;align-items:center;justify-content:center;padding:1rem;}'+
    '#cmodal{background:#0a0a0a;border:1px solid rgba(255,255,255,0.1);'+
    'padding:2.5rem;max-width:520px;width:100%;position:relative;'+
    'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;color:#fff;'+
    'max-height:90vh;overflow-y:auto;}'+
    '#cmodal h2{font-size:1.25rem;font-weight:900;letter-spacing:-0.02em;margin-bottom:0.5rem;}'+
    '#cmodal-desc{font-size:0.8rem;color:rgba(255,255,255,0.4);line-height:1.6;margin-bottom:1.8rem;}'+
    '.crow{display:flex;align-items:flex-start;justify-content:space-between;gap:1.5rem;'+
    'padding:1.2rem 0;border-top:1px solid rgba(255,255,255,0.07);}'+
    '.crow-info strong{display:block;font-size:0.85rem;font-weight:700;margin-bottom:0.2rem;}'+
    '.crow-info span{font-size:0.75rem;color:rgba(255,255,255,0.3);line-height:1.5;}'+
    '.crow-always{font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;'+
    'color:rgba(255,255,255,0.2);padding-top:0.25rem;flex-shrink:0;white-space:nowrap;}'+
    '.ctoggle{position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;margin-top:0.15rem;}'+
    '.ctoggle input{opacity:0;width:0;height:0;position:absolute;}'+
    '.ctoggle-s{position:absolute;cursor:none;inset:0;background:rgba(255,255,255,0.1);'+
    'border-radius:12px;transition:background 0.2s;}'+
    '.ctoggle-s::before{content:"";position:absolute;height:18px;width:18px;left:3px;bottom:3px;'+
    'background:rgba(255,255,255,0.35);border-radius:50%;transition:transform 0.2s,background 0.2s;}'+
    '.ctoggle input:checked+.ctoggle-s{background:rgba(255,255,255,0.85);}'+
    '.ctoggle input:checked+.ctoggle-s::before{transform:translateX(20px);background:#0a0a0a;}'+
    '#cmodal-save{margin-top:2rem;width:100%;text-align:center;background:#fff;color:#000;'+
    'font-size:0.75rem;letter-spacing:0.14em;text-transform:uppercase;padding:0.9rem 2rem;'+
    'font-weight:700;font-family:inherit;cursor:none;border:none;transition:background 0.2s;}'+
    '#cmodal-save:hover{background:#e8e8e8;}'+
    '#cmodal-close{position:absolute;top:1rem;right:1rem;background:none;border:none;'+
    'font-size:1.4rem;line-height:1;color:rgba(255,255,255,0.25);cursor:none;'+
    'font-family:inherit;padding:0.3rem 0.6rem;transition:color 0.2s;}'+
    '#cmodal-close:hover{color:#fff;}'+
    '@media(max-width:768px){'+
    '#cbar{flex-direction:column;align-items:flex-start;padding:1.2rem 1.2rem 1.5rem;gap:1rem;}'+
    '#cbar-btns{flex-wrap:wrap;gap:0.5rem;width:100%;}'+
    '.cbtn{flex:1;text-align:center;min-width:calc(50% - 0.25rem);}'+
    '.cbtn-text{flex:0 0 100%;text-align:center;}'+
    '#cmodal{padding:2rem 1.5rem;}'+
    '.ctoggle-s{cursor:auto;}}';
  document.head.appendChild(css);

  /* ── settings modal ── */
  function openSettings(){
    if(_modal)return;
    var consent=getConsent();
    var analyticsOn=consent?!!consent.analytics:false;
    var marketingOn=consent?!!consent.marketing:false;
    var ov=document.createElement('div');
    ov.id='cmodal-ov';
    ov.innerHTML=
      '<div id="cmodal">'+
      '<button id="cmodal-close" aria-label="Zavřít">&#215;</button>'+
      '<h2>Nastavení cookies</h2>'+
      '<p id="cmodal-desc">Spravujte své předvolby. Nezbytné cookies jsou nutné pro fungování webu a nelze je vypnout. Ostatní cookies aktivujete dobrovolně.</p>'+
      '<div class="crow">'+
        '<div class="crow-info"><strong>Nezbytné cookies</strong>'+
        '<span>Základní funkce a zabezpečení webu. Nelze vypnout.</span></div>'+
        '<span class="crow-always">Vždy aktivní</span>'+
      '</div>'+
      '<div class="crow">'+
        '<div class="crow-info"><strong>Analytické cookies</strong>'+
        '<span>Počítají návštěvnost webu a sběrem anonymních statistik umožňují provozovateli lépe pochopit své návštěvníky a stránky tak neustále vylepšovat.</span></div>'+
        '<label class="ctoggle"><input type="checkbox" id="cmodal-analytics">'+
        '<span class="ctoggle-s"></span></label>'+
      '</div>'+
      '<div class="crow">'+
        '<div class="crow-info"><strong>Marketingové cookies</strong>'+
        '<span>Shromažďují informace pro lepší přizpůsobení reklamy vašim zájmům, a to na těchto webových stránkách i mimo ně.</span></div>'+
        '<label class="ctoggle"><input type="checkbox" id="cmodal-marketing">'+
        '<span class="ctoggle-s"></span></label>'+
      '</div>'+
      '<button id="cmodal-save">Uložit nastavení</button>'+
      '</div>';
    document.documentElement.appendChild(ov);
    _modal=ov;
    document.getElementById('cmodal-analytics').checked=analyticsOn;
    document.getElementById('cmodal-marketing').checked=marketingOn;
    ov.addEventListener('click',function(e){if(e.target===ov)closeSettings();});
    document.getElementById('cmodal-close').addEventListener('click',closeSettings);
    document.getElementById('cmodal-save').addEventListener('click',function(){
      var analytics=document.getElementById('cmodal-analytics').checked;
      var marketing=document.getElementById('cmodal-marketing').checked;
      saveConsent(analytics,marketing);
      if(analytics)loadGA();
      closeSettings();
      hideBanner();
    });
  }
  function closeSettings(){if(_modal){_modal.remove();_modal=null;}}

  /* ── banner ── */
  function hideBanner(){
    if(!_bar)return;
    _bar.style.transition='opacity 0.25s';
    _bar.style.opacity='0';
    setTimeout(function(){if(_bar){_bar.remove();_bar=null;}},250);
  }
  function showBanner(){
    _bar=document.createElement('div');
    _bar.id='cbar';
    _bar.innerHTML=
      '<div id="cbar-text">30\u202f000 lidí denně projde okolo galerie POSTOJ. Online kustod Cookies nám pomáhá zjistit, kolik z nich dorazí i sem. A pokud se mu budeš chtít vyhnout, můžeš tak udělat kdykoliv v patičce webu. U nás v galerii neklademe žádné bariéry.</div>'+
      '<div id="cbar-btns">'+
        '<button class="cbtn cbtn-primary" id="cbar-accept">Přijmout vše</button>'+
        '<button class="cbtn cbtn-ghost" id="cbar-reject">Povolit nezbytné</button>'+
        '<button class="cbtn cbtn-text" id="cbar-settings">Nastavení cookies</button>'+
      '</div>';
    document.documentElement.appendChild(_bar);
    document.getElementById('cbar-accept').addEventListener('click',function(){saveConsent(true,true);loadGA();hideBanner();});
    document.getElementById('cbar-reject').addEventListener('click',function(){saveConsent(false,false);hideBanner();});
    document.getElementById('cbar-settings').addEventListener('click',openSettings);
  }

  /* ── footer link handler (event delegation — survives PJAX) ── */
  document.addEventListener('click',function(e){
    var el=e.target.closest('[data-cookie-settings]');
    if(el){e.preventDefault();openSettings();}
  });

  /* ── expose global for footer links ── */
  window._postojCookieSettings=openSettings;

  /* ── init ── */
  var consent=getConsent();
  if(consent){if(consent.analytics)loadGA();return;}
  showBanner();
})();
