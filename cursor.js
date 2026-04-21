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
var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in');});},{threshold:0.06});
document.querySelectorAll('.rv').forEach(function(el){obs.observe(el);});
