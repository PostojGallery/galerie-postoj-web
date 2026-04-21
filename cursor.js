var cdot=document.getElementById('cdot');
document.addEventListener('mousemove',function(e){cdot.style.left=e.clientX+'px';cdot.style.top=e.clientY+'px';});
(function(){
  var cw=document.getElementById('cw'),cimg=cw.querySelector('img');
  var mx=-200,my=-200,cx=-200,cy=-200,lmx=-200,ldir=0,snapped=false;
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;if(!snapped){cx=mx;cy=my;snapped=true;}var dx=mx-lmx;if(dx>2)ldir=1;else if(dx<-2)ldir=-1;lmx=mx;cimg.style.transform='rotate('+(ldir*18)+'deg)';});
  (function loop(){cx+=(mx-cx)*0.13;cy+=(my-cy)*0.13;cw.style.left=cx+'px';cw.style.top=cy+'px';requestAnimationFrame(loop);})();
})();
window.addEventListener('scroll',function(){document.querySelector('nav').classList.toggle('scrolled',window.scrollY>60);},{passive:true});
(function(){
  function bgLuminance(el){
    while(el&&el.tagName!=='HTML'){
      var bg=window.getComputedStyle(el).backgroundColor;
      var m=bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
      if(m){
        var a=m[4]===undefined?1:parseFloat(m[4]);
        if(a>0.05){return 0.299*+m[1]+0.587*+m[2]+0.114*+m[3];}
      }
      el=el.parentElement;
    }
    return 0;
  }
  document.addEventListener('mousemove',function(e){
    var el=document.elementFromPoint(e.clientX,e.clientY);
    document.body.classList.toggle('cursor-on-light',bgLuminance(el)>128);
  },{passive:true});
})();
(function(){
  var burger=document.getElementById('nav-burger');
  var nav=document.querySelector('nav');
  var links=document.querySelector('.nav-links');
  if(!burger)return;
  var scrollY=0;
  function openMenu(){
    scrollY=window.scrollY;
    nav.classList.add('mob-open');
    links.classList.add('mob-open');
    document.body.style.position='fixed';
    document.body.style.top='-'+scrollY+'px';
    document.body.style.width='100%';
  }
  function closeMenu(){
    nav.classList.remove('mob-open');
    links.classList.remove('mob-open');
    document.body.style.position='';
    document.body.style.top='';
    document.body.style.width='';
    window.scrollTo(0,scrollY);
  }
  burger.addEventListener('click',function(){
    nav.classList.contains('mob-open')?closeMenu():openMenu();
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',closeMenu);
  });
})();
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in');});},{threshold:0.06});
document.querySelectorAll('.rv').forEach(function(el){obs.observe(el);});
