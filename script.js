(() => {
  'use strict';
  const one = (s) => document.querySelector(s);
  const many = (s) => [...document.querySelectorAll(s)];
  const header = one('#siteHeader');
  const progress = one('#scrollProgress');
  const menu = one('#menuToggle');
  const nav = one('#primaryNav');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pending = false;
  function refreshScroll(){
    if (progress) {
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.width = (window.scrollY / total * 100) + '%';
    }
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
    pending = false;
  }
  window.addEventListener('scroll', () => {
    if (!pending) {pending=true;requestAnimationFrame(refreshScroll);}
  }, {passive:true});
  refreshScroll();
  if(menu && nav){
    menu.addEventListener('click',()=>{
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');menu.setAttribute('aria-expanded','false');
    }));
  }
  const reveals = many('.reveal');
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach(el=>el.classList.add('is-visible'));
  else {
    const obs = new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}
    }),{rootMargin:'0px 0px 45px 0px',threshold:.07});
    reveals.forEach(el=>obs.observe(el));
  }
  many('.accordion').forEach(accordion=>{
    accordion.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{
      if(detail.open) accordion.querySelectorAll('details').forEach(other=>{
        if(other!==detail && other.open) other.open=false;
      });
    }));
  });
  const dialog=one('#videoModal'),frame=one('#videoFrame'),close=one('#videoClose'),link=one('#videoYoutube');
  let priorFocus=null;
  function closeVideo(){
    if(dialog && dialog.open)dialog.close();
    if(frame)frame.replaceChildren();
    document.body.classList.remove('modal-open');
    if(priorFocus)priorFocus.focus();
  }
  if(dialog && frame && close && link){
    many('.video-trigger').forEach(button=>button.addEventListener('click',()=>{
      const id=button.dataset.video;
      if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
      priorFocus=button;
      link.href='https://www.youtube.com/watch?v='+id;
      const iframe=document.createElement('iframe');
      iframe.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';
      iframe.title=button.dataset.title||'Dyce Media video';
      iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.allowFullscreen=true;
      frame.replaceChildren(iframe);
      document.body.classList.add('modal-open');
      dialog.showModal();
      close.focus();
    }));
    close.addEventListener('click',closeVideo);
    dialog.addEventListener('click',e=>{if(e.target===dialog)closeVideo();});
    dialog.addEventListener('close',()=>{frame.replaceChildren();document.body.classList.remove('modal-open');});
  }
  const buddy=one('#storyBuddy');
  if(buddy){buddy.classList.add('is-ready');try{if(sessionStorage.getItem('dyce-hide-buddy')==='1')buddy.classList.add('is-hidden')}catch(_){}buddy.querySelector('.buddy-exit')?.addEventListener('click',()=>{buddy.classList.add('is-hidden');try{sessionStorage.setItem('dyce-hide-buddy','1')}catch(_){}});}
  const tabs=many('[role="tab"]');
  function activate(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});}
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>activate(t));t.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;activate(tabs[n]);tabs[n].focus();}});});
  many('.photo-card img').forEach(img=>{
    const fallback=()=>img.closest('.photo-card')?.classList.add('image-unavailable');
    img.addEventListener('error',fallback);
    if(img.complete && img.naturalWidth===0)fallback();
  });
  // Local previews intentionally open an email draft; Netlify handles forms only after deployment.
  many('form[data-netlify="true"]').forEach(form=>{
    if(location.protocol==='file:' || location.protocol==='about:' || ['localhost','127.0.0.1'].includes(location.hostname)){
      form.addEventListener('submit',event=>{
        event.preventDefault();
        if(!form.reportValidity())return;
        const data=new FormData(form);
        const selections=data.getAll('interest').join(', ');
        const subject=String(data.get('subject')||'Collaboration with Dyce Media');
        const message=[`Name: ${data.get('first-name')||''} ${data.get('last-name')||''}`,`Email: ${data.get('email')||''}`,`Interested in: ${selections||'Not specified'}`,'',String(data.get('message')||'')].join('\n');
        location.href='mailto:James@Dycemedia.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message);
      });
    }
  });
})();
