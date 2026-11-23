var isMobile=window.matchMedia('(max-width:768px)').matches||('ontouchstart' in window);
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
if(!isMobile){
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
}
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
  if(pg)pg.style.cssText='position:fixed;inset:0;background:#0a0a0a;z-index:10000;opacity:1;animation:none;';
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
      // Move #pg to <html> during swap so it stays in document
      var ePg=document.getElementById('pg');
      if(ePg)document.documentElement.appendChild(ePg);
      // Swap body
      document.body.innerHTML=nd.body.innerHTML;
      // Move #pg back to top of body, remove duplicate from new HTML
      var nPg=document.getElementById('pg');if(nPg)nPg.remove();
      if(ePg)document.body.insertBefore(ePg,document.body.firstChild);
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
