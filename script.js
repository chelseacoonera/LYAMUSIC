const nav = document.querySelector("nav");

window.addEventListener("scroll",()=>{

if(window.scrollY>60){

nav.style.background="#000";

}else{

nav.style.background="rgba(0,0,0,.45)";

}

});


const cards=document.querySelectorAll(".card");

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

cards.forEach(card=>observer.observe(card));
