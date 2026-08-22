var isMobile=window.matchMedia('(max-width:768px)').matches||('ontouchstart' in window);
var cdot=document.getElementById('cdot');
if(!isMobile){
  var _cw=document.getElementById('cw'),_cimg=_cw.querySelector('img');
  var mx=-200,my=-200,cx=-200,cy=-200,lmx=-200,ldir=0,snapped=false;
  document.addEventListener('mousemove',function(e){
    var pg=document.getElementById('pg');if(pg){pg.style.display='none';}
    cdot.style.left=e.clientX+'px';cdot.style.top=e.clientY+'px';
    mx=e.clientX;my=e.clientY;
    if(!snapped){cx=mx;cy=my;snapped=true;}
    var dx=mx-lmx;if(dx>2)ldir=1;else if(dx<-2)ldir=-1;lmx=mx;
    _cimg.style.transform='rotate('+(ldir*18)+'deg)';
  },{passive:true});
  (function loop(){
    cx+=(mx-cx)*0.13;cy+=(my-cy)*0.13;
    _cw.style.left=cx+'px';_cw.style.top=cy+'px';
    var el=document.elementFromPoint(cx,cy);
    document.body.classList.toggle('cursor-on-light',bgLuminance(el)>128);
    requestAnimationFrame(loop);
  })();
  function bgLuminance(el){
    while(el&&el.tagName!=='HTML'){
      var bg=window.getComputedStyle(el).backgroundColor;
      var m=bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
      if(m){var a=m[4]===undefined?1:parseFloat(m[4]);if(a>0.05){return 0.299*+m[1]+0.587*+m[2]+0.114*+m[3];}}
      el=el.parentElement;
    }
    return 0;
  }
}
window.addEventListener('scroll',function(){document.querySelector('nav').classList.toggle('scrolled',window.scrollY>60);},{passive:true});
function _initBurger(){
  var burger=document.getElementById('nav-burger');
  var nav=document.querySelector('nav');
  var links=document.querySelector('.nav-links');
  if(!burger)return;
  var scrollY=0;
  function openMenu(){scrollY=window.scrollY;nav.classList.add('mob-open');links.classList.add('mob-open');document.body.style.position='fixed';document.body.style.top='-'+scrollY+'px';document.body.style.width='100%';}
  function closeMenu(){nav.classList.remove('mob-open');links.classList.remove('mob-open');document.body.style.position='';document.body.style.top='';document.body.style.width='';window.scrollTo(0,scrollY);}
  burger.addEventListener('click',function(){nav.classList.contains('mob-open')?closeMenu():openMenu();});
  links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
}
_initBurger();
var _rvObs;
function _initRV(){
  if(_rvObs)_rvObs.disconnect();
  _rvObs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in');});},{threshold:0.06});
  document.querySelectorAll('.rv').forEach(function(el){_rvObs.observe(el);});
}
_initRV();
var _pjaxBusy=false;
document.addEventListener('click',function(e){
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target.closest('a[href]');
  if(!a)return;
  var href=a.getAttribute('href');
  if(!href||href.charAt(0)==='#'||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('http')||a.target==='_blank')return;
  e.preventDefault();
  _pjax(href,false);
},false);
window.addEventListener('popstate',function(){_pjax(location.pathname,true);});
function _pjax(href,isPop){
  if(_pjaxBusy)return;
  _pjaxBusy=true;
  // Release any body scroll lock (iOS freeze pattern used by lightbox/mobile menu)
  // so the new page can scroll and window.scrollTo works correctly
  if(document.body.style.position==='fixed'){
    var _ft=parseInt(document.body.style.top||'0');
    document.body.style.position='';document.body.style.top='';document.body.style.width='';
    window.scrollTo(0,-_ft);
  }
  var pg=document.getElementById('pg');
  if(pg)pg.style.cssText='position:fixed;inset:0;background:#0a0a0a;z-index:10000;opacity:1;animation:none;cursor:url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") 0 0,none;';
  fetch(href).then(function(r){if(!r.ok)throw 0;return r.text();}).then(function(html){
    try{
      var nd=(new DOMParser()).parseFromString(html,'text/html');
      // Fix relative src URLs — resolve against the target URL, not the current page URL
      var _pjaxBase=new URL((href.indexOf('#')!==-1?href.slice(0,href.indexOf('#')):href),location.origin);
      nd.querySelectorAll('[src]').forEach(function(el){
        var v=el.getAttribute('src');
        if(v&&!v.startsWith('data:')&&!v.startsWith('http')&&!v.startsWith('//'))
          try{el.setAttribute('src',new URL(v,_pjaxBase).href);}catch(ex){}
      });
      nd.querySelectorAll('[srcset]').forEach(function(el){
        var v=el.getAttribute('srcset');
        if(v)el.setAttribute('srcset',v.replace(/([^,\s]+)(\s[^,]*)?(,|$)/g,function(m,url,w,sep){
          if(url.startsWith('data:')||url.startsWith('http')||url.startsWith('//'))return m;
          try{return new URL(url,_pjaxBase).href+(w||'')+sep;}catch(ex){return m;}
        }));
      });
      // Update head
      document.title=nd.title;
      var nm=nd.querySelector('meta[name=description]'),om=document.querySelector('meta[name=description]');
      if(nm&&om)om.setAttribute('content',nm.getAttribute('content'));
      document.querySelectorAll('head style:not(#postoj-cookie-css)').forEach(function(s){s.remove();});
      nd.querySelectorAll('head style').forEach(function(s){var n=document.createElement('style');n.textContent=s.textContent;document.head.appendChild(n);});
      // Move #pg to <html> during swap so it stays in document (cursor stays covered)
      var ePg=document.getElementById('pg'),eCdot=document.getElementById('cdot'),eCw=document.getElementById('cw');
      if(ePg)document.documentElement.appendChild(ePg);if(eCdot)eCdot.remove();if(eCw)eCw.remove();
      // Swap body
      document.body.innerHTML=nd.body.innerHTML;
      // Move #pg back to top of body, remove duplicate from new HTML
      var nPg=document.getElementById('pg');if(nPg)nPg.remove();
      if(ePg)document.body.insertBefore(ePg,document.body.firstChild);
      // Re-insert cursor elements
      var nCdot=document.getElementById('cdot');
      if(nCdot&&eCdot)nCdot.replaceWith(eCdot);else if(eCdot){var ap=document.getElementById('pg');document.body.insertBefore(eCdot,ap?ap.nextSibling:document.body.firstChild);}
      var nCw=document.getElementById('cw');
      if(nCw&&eCw)nCw.replaceWith(eCw);else if(eCw){var ac=document.getElementById('cdot');document.body.insertBefore(eCw,ac?ac.nextSibling:document.body.firstChild);}
      // Update URL before executing scripts so location.search is correct
      if(!isPop)history.pushState({},document.title,href);
      // Execute page-specific inline scripts
      nd.querySelectorAll('body script:not([src])').forEach(function(s){try{var n=document.createElement('script');n.textContent=s.textContent;document.body.appendChild(n);}catch(ex){}});
      // Re-init components
      _initBurger();
      _initRV();
      if(typeof window._postojSyncCookieLang==='function')window._postojSyncCookieLang();
      if(typeof gtag==='function')gtag('event','page_view',{page_path:location.pathname});
      var hashIdx=href.indexOf('#');
      if(hashIdx!==-1){var _ht=document.getElementById(href.slice(hashIdx+1));if(_ht){requestAnimationFrame(function(){if(window.innerWidth<=768){var _sb=document.querySelector('.artists-sidebar,.exh-sidebar');var _off=60+(_sb?_sb.offsetHeight:0);window.scrollTo(0,Math.max(0,_ht.getBoundingClientRect().top+window.scrollY-_off));}else{_ht.scrollIntoView();}});}}else{window.scrollTo(0,0);}
      // Restart pg fade-out animation
      if(ePg){ePg.style.animation='none';void ePg.offsetHeight;ePg.style.cssText='';}
      _pjaxBusy=false;
    }catch(ex){_pjaxBusy=false;window.location.href=href;}
  }).catch(function(){_pjaxBusy=false;window.location.href=href;});
}
(function(){var pg=document.getElementById('pg');if(pg&&isMobile){pg.addEventListener('animationend',function(){pg.style.display='none';});}})();
