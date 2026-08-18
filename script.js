const tracks=[
 {title:"Magnetic",artist:"ILLIT",img:"https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=700&q=85",time:"2:40"},
 {title:"Supernova",artist:"aespa",img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=85",time:"2:58"},
 {title:"EASY",artist:"LE SSERAFIM",img:"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=85",time:"2:44"},
 {title:"Love wins all",artist:"IU",img:"https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=700&q=85",time:"4:05"}
];
const releases=[
 ["THE WINTER","Red Velvet","https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=700&q=85"],
 ["Eternal","TAEYEON","https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=700&q=85"],
 ["ATE","Stray Kids","https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=85"],
 ["ROMANCE : UNTOLD","ENHYPEN","https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=700&q=85"]
];
const charts=[
 ["Supernova","aespa",tracks[1].img,"2:58"],["Magnetic","ILLIT",tracks[0].img,"2:40"],["Love wins all","IU",tracks[3].img,"4:05"],["EASY","LE SSERAFIM",tracks[2].img,"2:44"],["Drama","aespa","https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=85","3:34"]
];

const trackGrid=document.getElementById("trackGrid");
trackGrid.innerHTML=tracks.map((t,i)=>`<article class="track" data-title="${t.title} ${t.artist}">
<img src="${t.img}" alt="${t.title} by ${t.artist}" loading="lazy">
<div class="track-meta"><div><h3>${t.title}</h3><p>${t.artist}</p></div><span class="track-num">0${i+1}</span></div>
<button class="track-play" data-index="${i}" aria-label="Play ${t.title}">▶</button></article>`).join("");

document.getElementById("releaseRow").innerHTML=releases.map(r=>`<article class="release"><img src="${r[2]}" alt="${r[0]} album cover" loading="lazy"><h3>${r[0]}</h3><p>${r[1]}</p></article>`).join("");
document.getElementById("chartList").innerHTML=charts.map((c,i)=>`<div class="chart-row"><span class="rank">0${i+1}</span><div class="chart-main"><img src="${c[2]}" alt="${c[0]}" loading="lazy"><div><h3>${c[0]}</h3><p>${c[1]}</p></div></div><span class="duration">${c[3]}</span><button class="chart-play" data-chart="${i}">▶</button></div>`).join("");

const player=document.getElementById("player"), pImg=document.getElementById("playerImg"), pTitle=document.getElementById("playerTitle"), pArtist=document.getElementById("playerArtist"), pPlay=document.getElementById("playerPlay"), bar=document.getElementById("progressBar");
let playing=false, timer;
function playTrack(t){
 pImg.src=t.img;pTitle.textContent=t.title;pArtist.textContent=t.artist;player.classList.add("active");playing=true;pPlay.textContent="Ⅱ";bar.style.width="5%";clearInterval(timer);
 let x=5;timer=setInterval(()=>{x+=1;if(x>100)x=5;bar.style.width=x+"%"},800);
}
document.addEventListener("click",e=>{
 const b=e.target.closest(".track-play"); if(b) playTrack(tracks[+b.dataset.index]);
 const cb=e.target.closest(".chart-play"); if(cb){const c=charts[+cb.dataset.chart];playTrack({title:c[0],artist:c[1],img:c[2]})}
});
pPlay.onclick=()=>{playing=!playing;pPlay.textContent=playing?"Ⅱ":"▶";};
document.getElementById("closePlayer").onclick=()=>{player.classList.remove("active");clearInterval(timer)};
document.getElementById("heroPlay").onclick=()=>playTrack(tracks[0]);

document.getElementById("menuBtn").onclick=()=>document.getElementById("nav").classList.toggle("open");
document.querySelectorAll(".nav a").forEach(a=>a.onclick=()=>document.getElementById("nav").classList.remove("open"));

const searchPanel=document.getElementById("searchPanel"), searchInput=document.getElementById("searchInput");
document.querySelector(".search-toggle").onclick=()=>{searchPanel.classList.toggle("open");if(searchPanel.classList.contains("open"))searchInput.focus()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")searchPanel.classList.remove("open")});
searchInput.addEventListener("input",()=>{const q=searchInput.value.toLowerCase();document.querySelectorAll(".track").forEach(el=>el.style.display=el.dataset.title.toLowerCase().includes(q)?"":"none")});

document.getElementById("prevBtn").onclick=()=>document.getElementById("releaseRow").scrollBy({left:-350,behavior:"smooth"});
document.getElementById("nextBtn").onclick=()=>document.getElementById("releaseRow").scrollBy({left:350,behavior:"smooth"});

function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
document.getElementById("randomBtn").onclick=()=>{const t=tracks[Math.floor(Math.random()*tracks.length)];playTrack(t);toast("Random pick: "+t.title)};
document.getElementById("viewAllBtn").onclick=()=>toast("You're already exploring the NRMUSIC weekly picks.");
document.getElementById("newsletterForm").onsubmit=e=>{e.preventDefault();toast("Welcome to NRMUSIC ✦");e.target.reset()};

document.querySelectorAll("img").forEach(img=>img.addEventListener("error",()=>{img.src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80"}));


/* =========================================================
   NRMUSIC AUTO SCROLL
   - Starts after 2 seconds without user activity.
   - Scrolls slowly toward the bottom.
   - At the bottom, quickly returns to the top.
   - Then repeats while the user remains inactive.
   - Any click, wheel, touch, or keyboard activity pauses
     auto-scroll and starts the 2-second inactivity timer again.
   ========================================================= */
const autoScroll = (() => {
  const IDLE_DELAY = 2000;
  const SCROLL_SPEED = 32;       // pixels per second — slow and smooth
  const TOP_RESET_SPEED = 1400;  // pixels per second — quick return to top
  const BOTTOM_TOLERANCE = 4;

  let idleTimer = null;
  let rafId = null;
  let lastFrame = 0;
  let active = false;
  let returningToTop = false;

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const stop = () => {
    active = false;
    returningToTop = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastFrame = 0;
  };

  const animate = (timestamp) => {
    if (!active || document.hidden) return;

    if (!lastFrame) lastFrame = timestamp;
    const delta = Math.min((timestamp - lastFrame) / 1000, 0.05);
    lastFrame = timestamp;

    const limit = maxScroll();
    const current = window.scrollY;

    if (returningToTop) {
      const next = Math.max(0, current - TOP_RESET_SPEED * delta);
      window.scrollTo(0, next);

      if (next <= 0) {
        returningToTop = false;
        lastFrame = timestamp;
      }
    } else {
      const next = Math.min(limit, current + SCROLL_SPEED * delta);
      window.scrollTo(0, next);

      if (limit - next <= BOTTOM_TOLERANCE) {
        returningToTop = true;
        lastFrame = timestamp;
      }
    }

    rafId = requestAnimationFrame(animate);
  };

  const start = () => {
    if (active || document.hidden || maxScroll() <= 0) return;
    active = true;
    returningToTop = false;
    lastFrame = 0;
    rafId = requestAnimationFrame(animate);
  };

  const resetIdleTimer = () => {
    stop();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(start, IDLE_DELAY);
  };

  // Real user interactions reset the 2-second inactivity countdown.
  ["pointerdown", "wheel", "touchstart", "keydown", "click"].forEach(eventName => {
    document.addEventListener(eventName, resetIdleTimer, { passive: true });
  });

  // Pause while the tab is hidden; restart the inactivity countdown when visible.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
      clearTimeout(idleTimer);
    } else {
      resetIdleTimer();
    }
  });

  // Start the first inactivity countdown.
  resetIdleTimer();

  return { reset: resetIdleTimer };
})();
