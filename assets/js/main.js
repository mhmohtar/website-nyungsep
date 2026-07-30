const CONFIG = {
  whatsapp: "6281234567890",
  whatsappDisplay: "[Masukkan nomor WhatsApp]",
  instagram: "https://instagram.com/",
  instagramDisplay: "[Masukkan username Instagram]",
  maps: "https://maps.google.com/?q=Malang,+Jawa+Timur",
  address: "[Masukkan alamat Ayam Nyungsep]",
  hours: "[Masukkan jam operasional]"
};

const menu = [
  ["Ayam Nyungsep Original","Ayam gurih klasik, sambal, dan lalapan.","Rp15.000","Best Seller","ayam"],
  ["Ayam Sambal Bawang","Gurih pedas dengan sambal bawang wangi.","Rp17.000","Pedas","ayam"],
  ["Ayam Sambal Ijo","Ayam renyah dengan sambal ijo segar.","Rp17.000","Favorit","ayam"],
  ["Nasi Campur Ayam Gurih","Nasi, ayam, tahu tempe, dan sayur.","Rp20.000","Komplet","paket"],
  ["Paket Ayam Komplet","Ayam, nasi, sambal, lalapan, dan es teh.","Rp22.000","Best Seller","paket"],
  ["Paket Hemat Pelajar","Kenyang bersahabat untuk dompet pelajar.","Rp18.000","Hemat","paket"],
  ["Green Tea Ice","Segar, creamy, cocok setelah kepedasan.","Rp10.000","Dingin","minuman"],
  ["Es Teh Manis","Teman setia segala level sambal.","Rp5.000","Favorit","minuman"],
  ["Tahu dan Tempe","Goreng hangat, gurih, dan renyah.","Rp7.000","Tambahan","tambahan"],
  ["Lalapan Tambahan","Timun dan daun segar penyeimbang pedas.","Rp4.000","Fresh","tambahan"]
];

const waLink = message => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
document.querySelectorAll("[data-config]").forEach(el => el.textContent = CONFIG[el.dataset.config]);
document.querySelectorAll(".order-link").forEach(a => { a.href = waLink("Halo Ayam Nyungsep, saya ingin memesan. Bisa kirim daftar menu hari ini?"); a.target="_blank"; a.rel="noopener"; });
document.querySelectorAll(".package-order").forEach(b => b.addEventListener("click", () => window.open(waLink(`Halo Ayam Nyungsep, saya ingin memesan ${b.dataset.menu}.`),"_blank","noopener")));
document.querySelector("#instagram-button").href = CONFIG.instagram;
document.querySelector("#footer-instagram").href = CONFIG.instagram;
document.querySelector("#maps-button").href = CONFIG.maps;
document.querySelector("#footer-maps").href = CONFIG.maps;
document.querySelector("#year").textContent = new Date().getFullYear();

const schema = {"@context":"https://schema.org","@type":["Restaurant","LocalBusiness"],"name":"Ayam Nyungsep","image":location.origin+"/assets/images/ayam-nyungsep-hero.jpg","description":"Warung makan ayam gurih dan sambal di Malang.","servesCuisine":["Masakan Indonesia","Ayam Goreng"],"priceRange":"Rp","telephone":"+"+CONFIG.whatsapp,"address":{"@type":"PostalAddress","streetAddress":CONFIG.address,"addressLocality":"Malang","addressRegion":"Jawa Timur","addressCountry":"ID"},"openingHours":CONFIG.hours,"url":location.href,"sameAs":[CONFIG.instagram],"hasMenu":{"@type":"Menu","name":"Menu Ayam Nyungsep","hasMenuSection":{"@type":"MenuSection","name":"Menu Favorit","hasMenuItem":menu.map(m=>({"@type":"MenuItem","name":m[0],"description":m[1],"offers":{"@type":"Offer","priceCurrency":"IDR","price":m[2].replace(/\D/g,"")}}))}}};
document.querySelector("#business-schema").textContent = JSON.stringify(schema);

const grid = document.querySelector("#menu-grid");
function renderMenu(filter="all"){
  grid.innerHTML = menu.filter(m => filter==="all" || m[4]===filter).map((m,i)=>`<article class="menu-card"><div class="menu-img"><img loading="lazy" src="assets/images/ayam-nyungsep-hero.jpg" alt="${m[0]}" style="object-position:${55+(i%4)*8}% ${35+(i%3)*18}%"><span>${m[3]}</span></div><div class="menu-body"><h3>${m[0]}</h3><p>${m[1]}</p><div class="menu-bottom"><strong>${m[2]}</strong><button data-order="${m[0]}" aria-label="Pesan ${m[0]}">Pesan Ini</button></div></div></article>`).join("");
  grid.querySelectorAll("[data-order]").forEach(b=>b.addEventListener("click",()=>window.open(waLink(`Halo Ayam Nyungsep, saya ingin memesan ${b.dataset.order}.`),"_blank","noopener")));
}
renderMenu();
document.querySelectorAll(".filters button").forEach(b=>b.addEventListener("click",()=>{document.querySelector(".filters .active").classList.remove("active");b.classList.add("active");renderMenu(b.dataset.filter)}));

const header=document.querySelector("#header"), progress=document.querySelector(".progress");
addEventListener("scroll",()=>{header.classList.toggle("scrolled",scrollY>30);progress.style.width=`${scrollY/(document.documentElement.scrollHeight-innerHeight)*100}%`},{passive:true});
const toggle=document.querySelector(".nav-toggle"), nav=document.querySelector(".nav-menu");
toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",open);toggle.setAttribute("aria-label",open?"Tutup menu":"Buka menu")});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false")}));

const sectionLinks=[...nav.querySelectorAll('a[href^="#"]:not([href="#"])')];
const linkedSections=sectionLinks.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
const navObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  sectionLinks.forEach(link=>{
    const active=link.getAttribute("href")===`#${visible.target.id}`;
    link.classList.toggle("active",active);
    if(active)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current");
  });
},{rootMargin:"-25% 0px -60%",threshold:[0,.2,.5]});
linkedSections.forEach(section=>navObserver.observe(section));

const motionOff=matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets=[
  ...document.querySelectorAll(".reveal"),
  ...document.querySelectorAll(".section-head, .about-photo, .about-copy, .menu-card, .package, .gallery-item, .location-card, .map, .accordion details")
];
revealTargets.forEach((el,index)=>{
  el.classList.add("reveal");
  if(el.matches(".benefit-card, .menu-card, .package, .gallery-item, .accordion details")){
    el.style.setProperty("--reveal-delay",`${(index%4)*70}ms`);
  }
});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.1,rootMargin:"0px 0px -35px"});
revealTargets.forEach(el=>observer.observe(el));
const countObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=+el.dataset.count,duration=1300,start=performance.now();function tick(now){const p=Math.min((now-start)/duration,1),value=target*(1-Math.pow(1-p,3));el.textContent=target%1?value.toFixed(1):Math.round(value).toLocaleString("id-ID");if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);countObserver.unobserve(el)}),{threshold:.7});
document.querySelectorAll("[data-count]").forEach(el=>countObserver.observe(el));

let slide=0,touchStart=0;const track=document.querySelector(".testimonial-track"),slides=[...track.children],dots=document.querySelector(".dots");
dots.innerHTML=slides.map((_,i)=>`<i class="${i===0?"active":""}"></i>`).join("");
function go(n){slide=(n+slides.length)%slides.length;track.style.transform=`translateX(-${slide*100}%)`;dots.querySelectorAll("i").forEach((d,i)=>d.classList.toggle("active",i===slide))}
document.querySelector(".next").onclick=()=>go(slide+1);document.querySelector(".prev").onclick=()=>go(slide-1);
track.addEventListener("pointerdown",e=>touchStart=e.clientX);track.addEventListener("pointerup",e=>{if(Math.abs(e.clientX-touchStart)>40)go(slide+(e.clientX<touchStart?1:-1))});
if(!motionOff)setInterval(()=>go(slide+1),5500);

const dialog=document.querySelector(".lightbox");
document.querySelectorAll(".gallery-item").forEach(b=>b.addEventListener("click",()=>{const source=b.querySelector("img");dialog.querySelector("img").src=source.src;dialog.querySelector("img").alt=source.alt;dialog.showModal()}));
dialog.querySelector("button").onclick=()=>dialog.close();dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
