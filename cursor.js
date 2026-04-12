var cdot=document.getElementById('cdot');
document.addEventListener('mousemove',function(e){cdot.style.left=e.clientX+'px';cdot.style.top=e.clientY+'px';});
(function(){
  var cw=document.getElementById('cw'),cimg=cw.querySelector('img');
  var mx=-200,my=-200,cx=-200,cy=-200,lmx=-200,ldir=0;
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;var dx=mx-lmx;if(dx>2)ldir=1;else if(dx<-2)ldir=-1;lmx=mx;cimg.style.transform='rotate('+(ldir*18)+'deg)';});
  (function loop(){cx+=(mx-cx)*0.13;cy+=(my-cy)*0.13;cw.style.left=cx+'px';cw.style.top=cy+'px';requestAnimationFrame(loop);})();
})();
window.addEventListener('scroll',function(){document.querySelector('nav').classList.toggle('scrolled',window.scrollY>60);},{passive:true});
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in');});},{threshold:0.06});
document.querySelectorAll('.rv').forEach(function(el){obs.observe(el);});
document.getElementById('cw').style.filter='invert(1)';
