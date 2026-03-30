import { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, Link, useNavigate, useParams, useLocation, Outlet } from "react-router-dom";
import { supabase } from "./lib/supabase";
import AdminPanel from "./pages/AdminPanel";

const C = { navy:"#0F2B4C", navyL:"#163a5e", orange:"#C75B12", orangeL:"#e8782e", cream:"#faf9f6" };
const PRICING=[{id:"raf",tr:"Endüstriyel Raf",items:[{id:"rk",tr:"Raf Periyodik Kontrolü",price:1000,pu:1},{id:"rs",tr:"Raf Statik Hesaplama",price:2500,pu:1}]},{id:"ortam",tr:"Ortam Ölçümü (İSG)",items:[{id:"go",tr:"Ortam Gürültü Ölçümü",price:25000},{id:"to",tr:"Ortam Toz Ölçümü",price:25000},{id:"gm",tr:"Gürültü Maruziyeti",price:1000,pu:1},{id:"tk",tr:"Termal Konfor",price:1000,pu:1},{id:"tm",tr:"Toz Maruziyeti",price:1000,pu:1},{id:"vc",tr:"VOC Ölçümü",price:7000,pu:1},{id:"ay",tr:"Aydınlatma",price:15000},{id:"ek",tr:"El-Kol Titreşim",price:1000,pu:1},{id:"tv",tr:"Tüm Vücut Titreşim",price:1250,pu:1},{id:"em",tr:"Elektromanyetik Alan",price:5000}]},{id:"cev",tr:"Çevresel Ölçüm",items:[{id:"cg",tr:"Çevresel Gürültü",price:45000},{id:"ct",tr:"Çevresel Titreşim",price:80000},{id:"pm",tr:"PM10 Örneklemesi",price:40000},{id:"yg",tr:"Yanma Gazları",price:40000},{id:"ab",tr:"Asbest Analizi",price:10000,pu:1}]},{id:"bas",tr:"Basınçlı Kaplar",items:[{id:"ko",tr:"Kompresör",price:500,pu:1},{id:"hi",tr:"Hidrofor",price:500,pu:1},{id:"ge",tr:"Genleşme Tankı",price:500,pu:1},{id:"kz",tr:"Kazan",price:1250,pu:1}]},{id:"kal",tr:"Kaldırma Ekipmanları",items:[{id:"fl",tr:"Forklift",price:1100,pu:1},{id:"vi",tr:"Vinç",price:1250,pu:1},{id:"pl",tr:"Kaldırma Platformu",price:1250,pu:1},{id:"tp",tr:"Transpalet",price:500,pu:1},{id:"al",tr:"Araç Kaldırma Lifti",price:700,pu:1},{id:"tf",tr:"Teleskobik Forklift",price:1100,pu:1},{id:"sp",tr:"Sepetli Platform",price:1250,pu:1}]},{id:"mak",tr:"İş Makineleri & Araçlar",items:[{id:"ex",tr:"Ekskavatör",price:1250,pu:1},{id:"dz",tr:"Dozer",price:1250,pu:1},{id:"gr",tr:"Greyder",price:1250,pu:1},{id:"yk",tr:"Yükleyici",price:1250,pu:1},{id:"si",tr:"Silindir",price:1250,pu:1},{id:"dk",tr:"Damperli Kamyon",price:700,pu:1},{id:"km",tr:"Kamyonet",price:500,pu:1},{id:"tn",tr:"Tanker",price:1250,pu:1},{id:"ck",tr:"Çekici",price:1250,pu:1},{id:"tr",tr:"Treyler/Lowbed",price:1250,pu:1},{id:"bk",tr:"Beko Loader",price:1250,pu:1},{id:"mx",tr:"Transmikser",price:1250,pu:1},{id:"bp",tr:"Beton Pompası",price:1250,pu:1},{id:"kk",tr:"Konkasör",price:1250,pu:1}]},{id:"elk",tr:"Elektrik Tesisatı",items:[{id:"it",tr:"İç Tesisat Uygunluk",price:3500},{id:"tl",tr:"Topraklama",price:5000},{id:"ka",tr:"Kaçak Akım Rölesi",price:2500},{id:"jn",tr:"Jeneratör",price:750,pu:1},{id:"pa",tr:"Paratoner",price:1250,pu:1},{id:"kp",tr:"Kompanzasyon",price:2500}]},{id:"yan",tr:"Yangın Sistemleri",items:[{id:"yt",tr:"Yangın Tesisatı",price:5000},{id:"sn",tr:"Portatif Söndürücü",price:150,pu:1},{id:"ag",tr:"Algılama Sistemi",price:8250}]},{id:"dig",tr:"Diğer Ekipmanlar",items:[{id:"ek2",tr:"Endüstriyel Kapı",price:1000,pu:1},{id:"hv",tr:"Havalandırma",price:2500},{id:"ky",tr:"Kaynak Makinası",price:500,pu:1},{id:"pr",tr:"Pres",price:700,pu:1},{id:"tz",tr:"Tezgah/Matkap",price:750,pu:1},{id:"db",tr:"Demir Kesme/Bükme",price:750,pu:1},{id:"bc",tr:"Baca Muayenesi",price:3500}]}];
const WHATSAPP = "905348814040";

const SITE_URL = "https://hstperiyodik.com";
const DEFAULT_SEO = {
  title: "HST Periyodik Mühendislik Hizmetleri",
  description: "HST Periyodik Mühendislik Hizmetleri; periyodik kontrol, patlamadan korunma dokümanı, endüstriyel raf statik analizi ve ortam ölçümleri alanlarında Kastamonu merkezli olarak Türkiye genelinde hizmet verir.",
  image: `${SITE_URL}/logo.png`
};

function ensureAbsoluteUrl(value) {
  if (!value) return DEFAULT_SEO.image;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`;
}

function upsertMeta(selector, attrs, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function usePageSeo({ title, description, path = '/', image, noindex = false, schema = [] }) {
  useEffect(() => {
    const cleanTitle = title || DEFAULT_SEO.title;
    const cleanDescription = description || DEFAULT_SEO.description;
    const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;
    const ogImage = ensureAbsoluteUrl(image);

    document.title = cleanTitle;
    upsertMeta('meta[name="description"]', { name: 'description' }, cleanDescription);
    upsertMeta('meta[name="robots"]', { name: 'robots' }, noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, cleanTitle);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, cleanDescription);
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, ogImage);
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale' }, 'tr_TR');
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, cleanTitle);
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, cleanDescription);
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, ogImage);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    const existing = document.head.querySelector('#seo-schema');
    if (existing) existing.remove();

    const baseSchemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'HST Periyodik Mühendislik Hizmetleri',
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.png`,
        image: `${SITE_URL}/logo.png`,
        telephone: '+90 534 881 40 40',
        email: 'miracnecmihasturk@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'İnönü Mah. Alparslan Türkeş Blv. Ilgaz Sok. Saray Apt',
          addressLocality: 'Kastamonu',
          addressCountry: 'TR'
        },
        areaServed: { '@type': 'Country', name: 'Türkiye' }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'HST Periyodik',
        url: SITE_URL,
        inLanguage: 'tr-TR'
      },
      ...schema.filter(Boolean)
    ];

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-schema';
    script.text = JSON.stringify(baseSchemas.length === 1 ? baseSchemas[0] : baseSchemas);
    document.head.appendChild(script);

    return () => {
      const schemaEl = document.head.querySelector('#seo-schema');
      if (schemaEl) schemaEl.remove();
    };
  }, [title, description, path, image, noindex, JSON.stringify(schema)]);
}

function SeoPage({ title, description, path, image, noindex = false, schema = [], children }) {
  usePageSeo({ title, description, path, image, noindex, schema });
  return children;
}

function useSupabase(table, options = {}) {
  const [data, setData] = useState(options.single ? null : []);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetch() {
      try {
        let q = supabase.from(table).select('*');
        if (options.filter) q = q.eq(options.filter[0], options.filter[1]);
        if (options.order) q = q.order(options.order, { ascending: options.asc !== false });
        if (options.limit) q = q.limit(options.limit);
        if (options.single) q = q.limit(1).single();
        const { data: d, error } = await q;
        if (error) { console.warn('Supabase:', error.message); }
        else { setData(d); }
      } catch (e) { console.warn('Supabase fetch error:', e); }
      setLoading(false);
    }
    fetch();
  }, [table]);
  return { data, loading };
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function useInView(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.1 });
    o.observe(ref.current);
    return () => o.disconnect();
  }, [ref]);
  return v;
}

function FadeIn({ children, delay = 0, style = {}, className = "" }) {
  const r = useRef(null);
  const v = useInView(r);
  return <div ref={r} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(24px)', transition: `all .7s cubic-bezier(.22,1,.36,1) ${delay}s`, ...style }} className={className}>{children}</div>;
}

const GlobalCSS = () => <style>{`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Source Sans 3',system-ui,sans-serif;background:#faf9f6;color:#1a2332}
h1,h2,h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700}
a{text-decoration:none;color:inherit}
::selection{background:#C75B1233}
img{max-width:100%;height:auto}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;font-weight:700;font-size:13px;letter-spacing:.8px;text-transform:uppercase;cursor:pointer;transition:all .25s;border:none;font-family:inherit}
.btn-primary{background:#C75B12;color:#fff}
.btn-primary:hover{background:#0F2B4C;transform:translateY(-2px);box-shadow:0 8px 24px #0F2B4C33}
.btn-outline{background:transparent;border:2px solid #e5e2dc;color:#1a2332}
.btn-outline:hover{border-color:#C75B12;color:#C75B12}
.btn-white{background:#fff;color:#0F2B4C}
.btn-white:hover{background:#C75B12;color:#fff}
.card{background:#fff;border:1px solid #e5e2dc;padding:28px;transition:all .3s;position:relative;overflow:hidden}
.card::after{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:#C75B12;transform:scaleY(0);transition:transform .3s;transform-origin:top}
.card:hover::after{transform:scaleY(1)}
.card:hover{border-color:#C75B1244;box-shadow:0 8px 32px rgba(0,0,0,.06)}
.container{max-width:1200px;margin:0 auto;padding:0 36px}
.section{padding:80px 0}
.section-label{font-size:11px;font-weight:800;letter-spacing:4px;text-transform:uppercase;color:#C75B12;margin-bottom:12px}
.section-title{font-size:clamp(28px,4vw,42px);color:#0F2B4C;margin-bottom:16px;line-height:1.2}
input,textarea{width:100%;padding:13px 16px;border:1px solid #e5e2dc;background:#faf9f6;color:#1a2332;font-size:14px;font-family:inherit;outline:none;transition:border .2s}
input:focus,textarea:focus{border-color:#C75B12}
@media(max-width:768px){.container{padding:0 20px}.section{padding:50px 0}.hide-mobile{display:none!important}.mobile-menu-btn{display:flex!important}.nav-links{display:none!important}.hero-grid{grid-template-columns:1fr!important}.stats-grid{grid-template-columns:repeat(2,1fr)!important}.services-grid{grid-template-columns:1fr!important}.blog-grid{grid-template-columns:1fr!important}.refs-grid{grid-template-columns:repeat(2,1fr)!important}.faq-grid{grid-template-columns:1fr!important}.contact-grid{grid-template-columns:1fr!important}.footer-inner{flex-direction:column;text-align:center;gap:16px}.about-features{grid-template-columns:1fr!important}.city-grid{grid-template-columns:1fr!important}}
`}</style>;

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const location = useLocation();
  useEffect(() => { const h = () => setScrolled(window.scrollY > 30); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);
  useEffect(() => { setMob(false); }, [location]);
  const links = [{to:"/",label:"Ana Sayfa"},{to:"/hizmetler",label:"Hizmetler"},{to:"/hizmet-bolgeleri",label:"İller"},{to:"/hakkimizda",label:"Hakkımızda"},{to:"/referanslar",label:"Referanslar"},{to:"/blog",label:"Blog"},{to:"/teklif-hesapla",label:"Teklif Al"},{to:"/iletisim",label:"İletişim"}];
  return <>
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:150,background:scrolled?"#faf9f6e8":"#faf9f6",backdropFilter:"blur(14px)",borderBottom:`1px solid ${scrolled?"#e5e2dc":"transparent"}`,padding:"0 36px",display:"flex",alignItems:"center",justifyContent:"space-between",height:72,transition:"all .3s"}}>
      <Link to="/" style={{display:"flex",alignItems:"center",gap:12}}><img src="/amblem.png" alt="HST" style={{height:40}} onError={e=>{e.target.style.display='none'}}/><div><div style={{fontWeight:900,fontSize:16,letterSpacing:1.5,color:C.navy}}>HST</div><div style={{fontSize:9,fontWeight:700,letterSpacing:3,color:"#6b7280",textTransform:"uppercase"}}>Periyodik</div></div></Link>
      <div className="nav-links" style={{display:"flex",gap:4}}>{links.map(l=><Link key={l.to} to={l.to} style={{padding:"10px 14px",fontSize:13,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",color:location.pathname===l.to?C.orange:"#6b7280",borderBottom:`2px solid ${location.pathname===l.to?C.orange:"transparent"}`,transition:"all .2s"}}>{l.label}</Link>)}</div>
      <div className="mobile-menu-btn" style={{display:"none",cursor:"pointer",padding:8,flexDirection:"column",gap:5}} onClick={()=>setMob(!mob)}><div style={{width:22,height:2,background:C.navy}}/><div style={{width:22,height:2,background:C.navy}}/><div style={{width:22,height:2,background:C.navy}}/></div>
    </nav>
    {mob&&<div style={{position:"fixed",inset:0,background:"#faf9f6f5",zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24}}>
      <div style={{position:"absolute",top:20,right:28,fontSize:28,cursor:"pointer",color:C.navy}} onClick={()=>setMob(false)}>✕</div>
      {links.map(l=><Link key={l.to} to={l.to} style={{fontSize:20,fontWeight:800,letterSpacing:1,color:location.pathname===l.to?C.orange:C.navy}}>{l.label}</Link>)}
    </div>}
  </>;
}

function Footer() {
  const { data: contact } = useSupabase('contact_info', { single: true });
  return <footer style={{borderTop:"1px solid #e5e2dc",background:"#fff",padding:"48px 0"}}>
    <div className="container footer-inner" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
      <div><div style={{fontWeight:900,fontSize:16,letterSpacing:1,color:C.navy}}>HST <span style={{fontWeight:400,fontSize:13,color:"#6b7280"}}>Periyodik Mühendislik Hizmetleri</span></div><div style={{fontSize:12,color:"#6b7280"}}>© 2026 Tüm hakları saklıdır.</div></div>
      <div style={{fontSize:13,color:"#6b7280",textAlign:"right"}}><div>{contact?.phone}</div><div>{contact?.email}</div></div>
    </div>
  </footer>;
}

function Layout() {
  return <>
    <Navbar />
    <Outlet />
    <Footer />
    <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" style={{position:"fixed",bottom:24,right:24,width:56,height:56,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 16px #25D36644",zIndex:99,color:"#fff",fontSize:26}}>💬</a>
  </>;
}

function HeroSlider() {
  const { data: slides, loading } = useSupabase('hero_slides', { order: 'order_index' });
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const timer = useRef(null);
  useEffect(() => { if (slides.length < 2) return; timer.current = setInterval(() => setIdx(i => (i + 1) % slides.length), 5000); return () => clearInterval(timer.current); }, [slides.length]);
  const goTo = (i) => { setIdx(i); if(timer.current) clearInterval(timer.current); if(slides.length>1) timer.current = setInterval(() => setIdx(i => (i + 1) % slides.length), 5000); };
  if (loading) return <div style={{height:"85vh",background:`linear-gradient(135deg,${C.navy},${C.navyL})`}} />;
  if (slides.length === 0) return <div style={{height:"85vh",background:`linear-gradient(135deg,${C.navy},${C.navyL})`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center",color:"#fff",padding:36}}><h1 style={{fontSize:48,marginBottom:16}}>HST Periyodik</h1><p style={{fontSize:18,opacity:.7}}>Mühendislik Hizmetleri</p></div></div>;
  return <div style={{position:"relative",height:"85vh",minHeight:500,maxHeight:800,overflow:"hidden"}}>
    {slides.map((s, i) => (<div key={s.id} style={{position:"absolute",inset:0,background:s.image_url?`linear-gradient(rgba(15,43,76,.72),rgba(15,43,76,.82)),url(${s.image_url}) center/cover`:`linear-gradient(135deg,${C.navy} 0%,${C.navyL} 50%,${C.navy} 100%)`,opacity:i===idx?1:0,transition:"opacity .8s ease",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{maxWidth:800,textAlign:"center",padding:"0 36px",transform:i===idx?"translateY(0)":"translateY(20px)",transition:"all .8s ease .2s",opacity:i===idx?1:0}}>
        <h1 style={{fontSize:"clamp(32px,5vw,56px)",color:"#fff",lineHeight:1.15,marginBottom:20}}>{s.title}</h1>
        {s.subtitle&&<p style={{fontSize:18,color:"rgba(255,255,255,.75)",lineHeight:1.7,marginBottom:32,maxWidth:600,margin:"0 auto 32px"}}>{s.subtitle}</p>}
        {s.button_text&&<button className="btn btn-white" onClick={()=>navigate(s.button_link||"/")}>{s.button_text} →</button>}
      </div>
    </div>))}
    <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",gap:10,zIndex:10}}>{slides.map((_,i)=><div key={i} onClick={()=>goTo(i)} style={{width:i===idx?32:10,height:10,borderRadius:5,background:i===idx?"#fff":"rgba(255,255,255,.4)",cursor:"pointer",transition:"all .3s"}}/>)}</div>
    {slides.length>1&&<><div onClick={()=>goTo((idx-1+slides.length)%slides.length)} style={{position:"absolute",left:20,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:20}}>‹</div><div onClick={()=>goTo((idx+1)%slides.length)} style={{position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",width:48,height:48,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:20}}>›</div></>}
  </div>;
}

function Home() {
  const { data: services } = useSupabase('services', { order:'order_index' });
  const { data: stats } = useSupabase('site_stats', { order:'order_index' });
  const { data: blogs } = useSupabase('blogs', { order:'created_at', asc:false, filter:['published',true] });
  const { data: refs } = useSupabase('client_references', { order:'order_index' });
  const { data: faqs } = useSupabase('faq_items', { order:'order_index' });
  const { data: cities } = useSupabase('city_pages', { order:'order_index' });
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();
  const recentBlogs = (blogs || []).slice(0, 4);
  const svcList = (services || []).slice(0, 6);

  return <>
    <HeroSlider />
    {stats && stats.length > 0 && <section style={{background:C.navy}}><div className="container stats-grid" style={{display:"grid",gridTemplateColumns:`repeat(${stats.length},1fr)`,gap:28,padding:"36px",textAlign:"center"}}>{stats.map((s,i)=><FadeIn key={s.id} delay={i*.1}><div><div style={{fontSize:36,fontWeight:900,fontFamily:"Cormorant Garamond",color:C.orange}}>{s.value}</div><div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.6)",letterSpacing:2,textTransform:"uppercase",marginTop:4}}>{s.label}</div></div></FadeIn>)}</div></section>}

    <section className="section"><div className="container">
      <FadeIn><div className="section-label">Hizmetler</div></FadeIn>
      <FadeIn delay={.1}><h2 className="section-title" style={{marginBottom:40}}>Sunduğumuz Hizmetler</h2></FadeIn>
      <div className="services-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16}}>
        {svcList.map((s,i)=><FadeIn key={s.id} delay={i*.08}><div className="card" style={{minHeight:180}}><div style={{fontSize:11,fontWeight:900,letterSpacing:3,color:C.orange,marginBottom:14}}>0{i+1}</div>{s.icon&&<div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>}<h3 style={{fontSize:20,marginBottom:10,color:C.navy}}>{s.title}</h3><p style={{fontSize:14,lineHeight:1.85,color:"#6b7280"}}>{s.description}</p></div></FadeIn>)}
      </div>
      <FadeIn delay={.3}><div style={{textAlign:"center",marginTop:32}}><Link to="/hizmetler" className="btn btn-outline">Tüm Hizmetler →</Link></div></FadeIn>
    </div></section>

    <section style={{margin:"0 36px"}}><div style={{background:`linear-gradient(135deg,${C.navy},${C.navyL})`,padding:"56px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20,maxWidth:1128,margin:"0 auto"}}><div><h2 style={{color:"#fff",fontSize:28}}>Hemen Teklif Alın</h2><p style={{color:"rgba(255,255,255,.6)",fontSize:15,marginTop:6}}>Online sihirbazımızla anında fiyat aralığı hesaplayın.</p></div><Link to="/teklif-hesapla" className="btn" style={{background:C.orange,color:"#fff"}}>Teklif Hesapla →</Link></div></section>

    {recentBlogs.length>0&&<section className="section"><div className="container">
      <FadeIn><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}><div><div className="section-label">Blog</div><h2 className="section-title">Güncel Makaleler</h2></div><Link to="/blog" className="btn btn-outline" style={{padding:"10px 20px",fontSize:12}}>Tümünü Gör →</Link></div></FadeIn>
      <div className="blog-grid" style={{display:"grid",gridTemplateColumns:recentBlogs.length>1?"1.3fr 1fr":"1fr",gap:16}}>
        <FadeIn><div className="card" style={{cursor:"pointer"}} onClick={()=>navigate(`/blog/${recentBlogs[0].slug}`)}>{recentBlogs[0].cover_image&&<div style={{height:220,background:`url(${recentBlogs[0].cover_image}) center/cover`,marginBottom:20}}/>}<div style={{fontSize:12,fontWeight:700,color:C.orange,letterSpacing:1,marginBottom:10}}>{new Date(recentBlogs[0].created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</div><h3 style={{fontSize:22,color:C.navy,lineHeight:1.35,marginBottom:12}}>{recentBlogs[0].title}</h3><p style={{fontSize:14,color:"#6b7280",lineHeight:1.7}}>{recentBlogs[0].excerpt}</p><span style={{fontSize:13,fontWeight:700,color:C.orange,marginTop:14,display:"inline-block"}}>Devamını Oku →</span></div></FadeIn>
        {recentBlogs.length>1&&<div style={{display:"flex",flexDirection:"column",gap:16}}>{recentBlogs.slice(1,4).map((b,i)=><FadeIn key={b.id} delay={(i+1)*.1}><div className="card" style={{cursor:"pointer",display:"flex",gap:16,alignItems:"center"}} onClick={()=>navigate(`/blog/${b.slug}`)}>{b.cover_image&&<div style={{width:120,minWidth:120,height:90,background:`url(${b.cover_image}) center/cover`}} className="hide-mobile"/>}<div><div style={{fontSize:11,fontWeight:700,color:C.orange,letterSpacing:1,marginBottom:6}}>{new Date(b.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</div><h4 style={{fontSize:15,color:C.navy,lineHeight:1.35}}>{b.title}</h4></div></div></FadeIn>)}</div>}
      </div>
    </div></section>}

    {cities&&cities.length>0&&<section className="section" style={{paddingTop:20}}><div className="container">
      <FadeIn><div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:16,marginBottom:24,flexWrap:"wrap"}}><div><div className="section-label">Hizmet Verdiğimiz İller</div><h2 className="section-title" style={{marginBottom:0}}>Şehirlere Özel Çalışmalarımız </h2></div><Link to="/hizmet-bolgeleri" className="btn btn-outline" style={{padding:"10px 20px",fontSize:12}}>Tüm İlleri Gör →</Link></div></FadeIn>
      <div className="city-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>{cities.slice(0,12).map((c,i)=><FadeIn key={c.id} delay={i*.05}><Link to={`/periyodik-kontrol/${c.slug}`} className="card" style={{display:"block",padding:20,minHeight:120}}><div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.orange,textTransform:"uppercase",marginBottom:10}}>{c.city_name}</div><h3 style={{fontSize:18,color:C.navy,marginBottom:8}}>{c.hero_title||`${c.city_name} Periyodik Kontrol`}</h3><p style={{fontSize:13,lineHeight:1.7,color:"#6b7280"}}>{(c.meta_description||c.hero_subtitle||"").slice(0,120)}{(c.meta_description||c.hero_subtitle||"").length>120?"...":""}</p></Link></FadeIn>)}</div>
    </div></section>}

    {refs&&refs.length>0&&<section style={{background:"#f0ece6",borderTop:"1px solid #e5e2dc",borderBottom:"1px solid #e5e2dc"}}><div className="container section">
      <FadeIn><div style={{textAlign:"center",marginBottom:40}}><div className="section-label">Referanslar</div><h2 className="section-title">Hizmet Verdiğimiz Firmalar</h2></div></FadeIn>
      <div className="refs-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16}}>{refs.map((r,i)=><FadeIn key={r.id} delay={i*.06}><div style={{background:"#fff",border:"1px solid #e5e2dc",padding:24,textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",minHeight:100}}>{r.image_url?<img src={r.image_url} alt={r.company_name} style={{maxHeight:60,maxWidth:"80%",objectFit:"contain"}}/>:<div style={{fontSize:14,fontWeight:700,color:C.navy}}>{r.company_name}</div>}</div></FadeIn>)}</div>
    </div></section>}

    {faqs&&faqs.length>0&&<section className="section"><div className="container">
      <FadeIn><div style={{textAlign:"center",marginBottom:40}}><div className="section-label">SSS</div><h2 className="section-title">Sıkça Sorulan Sorular</h2></div></FadeIn>
      <div className="faq-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:900,margin:"0 auto"}}>{faqs.map((f,i)=><FadeIn key={f.id} delay={i*.06}><div style={{border:"1px solid #e5e2dc",background:"#fff",borderColor:openFaq===f.id?C.orange:"#e5e2dc"}}><div onClick={()=>setOpenFaq(openFaq===f.id?null:f.id)} style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",gap:12}}><span style={{fontSize:14,fontWeight:600,color:C.navy,lineHeight:1.4}}>{f.question}</span><span style={{fontSize:18,color:C.orange,fontWeight:700,flexShrink:0,transition:"transform .3s",transform:openFaq===f.id?"rotate(45deg)":"none"}}>+</span></div>{openFaq===f.id&&<div style={{padding:"0 20px 16px",fontSize:14,lineHeight:1.7,color:"#6b7280",borderTop:"1px solid #e5e2dc",paddingTop:12}}>{f.answer}</div>}</div></FadeIn>)}</div>
    </div></section>}
  </>;
}

function ServicesPage() {
  const { data: services } = useSupabase('services', { order: 'order_index' });
  return <div style={{paddingTop:72}}><section className="section"><div className="container">
    <FadeIn><div className="section-label">Hizmetlerimiz</div></FadeIn>
    <FadeIn delay={.1}><h1 className="section-title" style={{marginBottom:40}}>Tüm Hizmetlerimiz</h1></FadeIn>
    {(services||[]).map((s,i)=><FadeIn key={s.id} delay={i*.08}><div className="card" style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:20,marginBottom:16}}><div style={{fontSize:28,fontWeight:900,color:C.orange,fontFamily:"Cormorant Garamond"}}>0{i+1}</div><div><h3 style={{fontSize:20,marginBottom:8,color:C.navy}}>{s.title}</h3><p style={{fontSize:15,lineHeight:1.9,color:"#6b7280"}}>{s.description}</p></div></div></FadeIn>)}
  </div></section></div>;
}

function AboutPage() {
  const { data: about } = useSupabase('about_content');
  const getVal = (key) => (about||[]).find(a => a.key === key)?.value || '';
  return <div style={{paddingTop:72}}><section className="section"><div className="container" style={{maxWidth:800}}>
    <FadeIn><div className="section-label">Hakkımızda</div></FadeIn>
    <FadeIn delay={.1}><h1 className="section-title" style={{marginBottom:28}}>Firmamız</h1></FadeIn>
    <FadeIn delay={.2}><div style={{fontSize:16,lineHeight:2,color:"#6b7280",marginBottom:36,whiteSpace:"pre-line"}}>{getVal('main_text')}</div></FadeIn>
    <div className="about-features" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      {["İnşaat Mühendisi kadrosu","TÜRKAK akredite iş birlikleri","SAP2000 yapısal analiz","81 il genelinde hizmet"].map((h,i)=><FadeIn key={i} delay={i*.1}><div className="card" style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}><span style={{color:C.orange,fontWeight:900,fontSize:18}}>✓</span><span style={{fontSize:14,fontWeight:600}}>{h}</span></div></FadeIn>)}
    </div>
    {getVal('mission')&&<FadeIn delay={.4}><div style={{marginTop:36,padding:28,background:C.navy,color:"#fff"}}><div style={{fontSize:11,fontWeight:800,letterSpacing:3,color:C.orange,marginBottom:10}}>MİSYONUMUZ</div><p style={{fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,.8)"}}>{getVal('mission')}</p></div></FadeIn>}
  </div></section></div>;
}

function ReferencesPage() {
  const { data: refs } = useSupabase('client_references', { order: 'order_index' });
  return <div style={{paddingTop:72}}><section className="section"><div className="container">
    <FadeIn><div className="section-label">Referanslar</div></FadeIn>
    <FadeIn delay={.1}><h1 className="section-title" style={{marginBottom:40}}>Hizmet Verdiğimiz Firmalar</h1></FadeIn>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>{(refs||[]).map((r,i)=><FadeIn key={r.id} delay={i*.06}><div className="card" style={{textAlign:"center",padding:28,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:140}}>{r.image_url?<img src={r.image_url} alt={r.company_name} style={{maxHeight:70,maxWidth:"80%",objectFit:"contain",marginBottom:12}}/>:<div style={{fontSize:24,fontWeight:900,color:C.orange,fontFamily:"Cormorant Garamond",marginBottom:8}}>0{i+1}</div>}<div style={{fontSize:14,fontWeight:700,color:C.navy}}>{r.company_name}</div></div></FadeIn>)}</div>
  </div></section></div>;
}

function BlogPage() {
  const { data: blogs } = useSupabase('blogs', { order:'created_at', asc:false, filter:['published',true] });
  const navigate = useNavigate();
  return <div style={{paddingTop:72}}><section className="section"><div className="container" style={{maxWidth:900}}>
    <FadeIn><div className="section-label">Blog</div></FadeIn>
    <FadeIn delay={.1}><h1 className="section-title" style={{marginBottom:40}}>Makaleler</h1></FadeIn>
    {(blogs||[]).map((b,i)=><FadeIn key={b.id} delay={i*.08}><div className="card" style={{cursor:"pointer",marginBottom:16}} onClick={()=>navigate(`/blog/${b.slug}`)}><div style={{fontSize:12,fontWeight:700,color:C.orange,letterSpacing:1,marginBottom:8}}>{new Date(b.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</div><h3 style={{fontSize:20,color:C.navy,lineHeight:1.35,marginBottom:10}}>{b.title}</h3><p style={{fontSize:14,color:"#6b7280",lineHeight:1.7}}>{b.excerpt}</p><span style={{fontSize:13,fontWeight:700,color:C.orange,marginTop:10,display:"inline-block"}}>Devamını Oku →</span></div></FadeIn>)}
  </div></section></div>;
}

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => { supabase.from('blogs').select('*').eq('slug',slug).eq('published',true).single().then(({data})=>setPost(data)); }, [slug]);
  usePageSeo({
    title: post ? `${post.title} | HST Periyodik Blog` : 'Blog Yazısı | HST Periyodik',
    description: post?.excerpt || DEFAULT_SEO.description,
    path: `/blog/${slug}`,
    image: post?.cover_image || DEFAULT_SEO.image,
    schema: post ? [{
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || DEFAULT_SEO.description,
      image: ensureAbsoluteUrl(post.cover_image || '/logo.png'),
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
      author: { '@type': 'Organization', name: post.author || 'HST Periyodik' },
      publisher: { '@type': 'Organization', name: 'HST Periyodik', logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.png` } },
      mainEntityOfPage: `${SITE_URL}/blog/${slug}`
    }] : []
  });
  if (!post) return <div style={{paddingTop:140,textAlign:"center",color:"#6b7280"}}>Yükleniyor...</div>;
  return <div style={{paddingTop:72}}><section className="section"><div className="container" style={{maxWidth:740}}>
    <Link to="/blog" style={{fontSize:13,fontWeight:700,color:C.orange}}>← Tüm Makaleler</Link>
    <div style={{fontSize:12,fontWeight:700,color:C.orange,letterSpacing:1,marginTop:20,marginBottom:10}}>{new Date(post.created_at).toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})}</div>
    <FadeIn><h1 style={{fontSize:32,color:C.navy,lineHeight:1.35,marginBottom:28}}>{post.title}</h1></FadeIn>
    <FadeIn delay={.1}><div style={{fontSize:16,lineHeight:2.1,color:"#6b7280",whiteSpace:"pre-line"}}>{post.content}</div></FadeIn>
  </div></section></div>;
}

function CityPage() {
  const { slug } = useParams();
  const [city, setCity] = useState(null);
  const { data: services } = useSupabase('services', { order: 'order_index' });
  const { data: contact } = useSupabase('contact_info', { single: true });
  const navigate = useNavigate();
  useEffect(() => {
    supabase.from('city_pages').select('*').eq('slug', slug).eq('is_active', true).single()
      .then(({ data }) => setCity(data));
  }, [slug]);
  usePageSeo({
    title: city?.meta_title || (city ? `${city.city_name} Periyodik Kontrol Hizmetleri | HST Periyodik` : 'İl Hizmet Sayfası | HST Periyodik'),
    description: city?.meta_description || city?.hero_subtitle || DEFAULT_SEO.description,
    path: `/periyodik-kontrol/${slug}`,
    image: city?.image_url || DEFAULT_SEO.image,
    schema: city ? [{
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: city.hero_title || `${city.city_name} Periyodik Kontrol Hizmetleri`,
      description: city.meta_description || city.hero_subtitle || DEFAULT_SEO.description,
      areaServed: { '@type': 'City', name: city.city_name },
      provider: { '@type': 'Organization', name: 'HST Periyodik Mühendislik Hizmetleri', url: SITE_URL },
      serviceType: 'Periyodik kontrol, endüstriyel raf statik analizi, ortam ölçümleri ve patlamadan korunma dokümanı'
    }, {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Hizmet Bölgeleri', item: `${SITE_URL}/hizmet-bolgeleri` },
        { '@type': 'ListItem', position: 3, name: city.city_name, item: `${SITE_URL}/periyodik-kontrol/${slug}` }
      ]
    }] : []
  });
  if (!city) return <div style={{paddingTop:140,textAlign:"center",color:"#6b7280"}}>Yükleniyor...</div>;
  return <div style={{paddingTop:72}}>
    {/* Hero */}
    <section style={{background:city.image_url?`linear-gradient(rgba(15,43,76,.78),rgba(22,58,94,.86)),url(${city.image_url}) center/cover`:`linear-gradient(135deg,${C.navy},${C.navyL})`,padding:"80px 0"}}>
      <div className="container" style={{textAlign:"center",color:"#fff"}}>
        <FadeIn><div style={{fontSize:11,fontWeight:800,letterSpacing:4,textTransform:"uppercase",color:C.orange,marginBottom:16}}>Periyodik Kontrol</div></FadeIn>
        <FadeIn delay={.1}><h1 style={{fontSize:"clamp(30px,4.5vw,48px)",lineHeight:1.2,marginBottom:16}}>{city.hero_title}</h1></FadeIn>
        {city.hero_subtitle && <FadeIn delay={.2}><p style={{fontSize:17,color:"rgba(255,255,255,.7)",maxWidth:700,margin:"0 auto 32px",lineHeight:1.7}}>{city.hero_subtitle}</p></FadeIn>}
        <FadeIn delay={.3}><button className="btn btn-white" onClick={()=>navigate('/teklif-hesapla')}>{city.cta_text || 'Hemen Teklif Alın'} →</button></FadeIn>
      </div>
    </section>

    {/* İçerik */}
    <section className="section"><div className="container city-grid" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:40}}>
      <div>
        <FadeIn><div style={{fontSize:16,lineHeight:2,color:"#6b7280",whiteSpace:"pre-line"}}>{city.content}</div></FadeIn>

        {/* Hizmetler Listesi */}
        {city.services_intro && <FadeIn delay={.2}><div style={{marginTop:40}}>
          <h2 style={{fontSize:24,color:C.navy,marginBottom:20}}>{city.services_intro}</h2>
          <div style={{display:"grid",gap:10}}>
            {(services||[]).map((s,i) => (
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:"#fff",border:"1px solid #e5e2dc",transition:"all .2s"}}>
                <span style={{fontSize:11,fontWeight:900,color:C.orange,letterSpacing:2}}>0{i+1}</span>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:C.navy}}>{s.title}</div>
                  {s.description && <div style={{fontSize:13,color:"#6b7280",marginTop:2}}>{s.description}</div>}
                </div>
              </div>
            ))}
          </div>
        </div></FadeIn>}
      </div>

      {/* Sidebar */}
      <div>
        <FadeIn delay={.15}>
          <div style={{background:C.navy,padding:28,color:"#fff",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:3,color:C.orange,marginBottom:14}}>İLETİŞİM</div>
            <div style={{fontSize:14,lineHeight:2,color:"rgba(255,255,255,.8)"}}>
              <div>📞 {contact?.phone}</div>
              <div>✉️ {contact?.email}</div>
              <div>📍 {contact?.address}</div>
            </div>
            <a href={`https://wa.me/${contact?.whatsapp||WHATSAPP}`} target="_blank" rel="noopener" className="btn" style={{background:"#25D366",color:"#fff",width:"100%",justifyContent:"center",marginTop:16,padding:"12px 20px"}}>WhatsApp ile Yazın</a>
          </div>
        </FadeIn>
        <FadeIn delay={.25}>
          <div className="card" style={{padding:24}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:3,color:C.orange,marginBottom:14}}>TEKLİF ALIN</div>
            <p style={{fontSize:14,color:"#6b7280",lineHeight:1.7,marginBottom:16}}>{city.city_name} ve çevresindeki tesisleriniz için ücretsiz teklif alın.</p>
            <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={()=>navigate('/teklif-hesapla')}>Teklif Hesapla →</button>
          </div>
        </FadeIn>
        <FadeIn delay={.35}>
          <div className="card" style={{padding:24,marginTop:16}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:3,color:C.orange,marginBottom:14}}>DİĞER BÖLGELER</div>
            <CityLinks currentSlug={slug} />
          </div>
        </FadeIn>
      </div>
    </div></section>
  </div>;
}

function CityLinks({ currentSlug }) {
  const { data: cities } = useSupabase('city_pages', { order: 'order_index' });
  return <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {(cities||[]).filter(c=>c.slug!==currentSlug).slice(0,10).map(c=>(
      <Link key={c.id} to={`/periyodik-kontrol/${c.slug}`} style={{fontSize:13,fontWeight:600,color:C.navy,padding:"6px 0",borderBottom:"1px solid #f0ece6",transition:"color .2s"}}>{c.city_name} Periyodik Kontrol →</Link>
    ))}
  </div>;
}

function RegionsPage() {
  const { data: cities } = useSupabase('city_pages', { order: 'order_index' });
  return <div style={{paddingTop:72}}><section className="section"><div className="container">
    <FadeIn><div className="section-label">Hizmet Bölgeleri</div></FadeIn>
    <FadeIn delay={.1}><h1 className="section-title" style={{marginBottom:14}}>İllere Özel Hizmet Sayfaları</h1></FadeIn>
    <FadeIn delay={.15}><p style={{fontSize:15,color:"#6b7280",lineHeight:1.8,maxWidth:760,marginBottom:32}}>Periyodik kontrol, patlamadan korunma dokümanı, endüstriyel raf statik analizi ve ortam ölçümleri hizmetlerimizi Türkiye genelinde sunuyoruz. Aşağıdaki şehir sayfalarından bulunduğunuz ile özel içeriklere ulaşabilirsiniz.</p></FadeIn>
    <div className="city-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>{(cities||[]).map((c,i)=><FadeIn key={c.id} delay={i*.04}><Link to={`/periyodik-kontrol/${c.slug}`} className="card" style={{display:"block",minHeight:180}}><div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.orange,textTransform:"uppercase",marginBottom:12}}>{c.city_name}</div><h3 style={{fontSize:22,color:C.navy,lineHeight:1.35,marginBottom:10}}>{c.hero_title}</h3><p style={{fontSize:14,color:"#6b7280",lineHeight:1.8}}>{c.meta_description||c.hero_subtitle}</p><span style={{fontSize:13,fontWeight:700,color:C.orange,marginTop:12,display:"inline-block"}}>Sayfaya Git →</span></Link></FadeIn>)}</div>
  </div></section></div>;
}

function QuotePage() {
  const[sel,setSel]=useState({});const[oc,setOc]=useState(null);const[fm,setFm]=useState({c:"",p:"",t:"",e:""});
  const tog=id=>setSel(p=>{const n={...p};if(n[id])delete n[id];else n[id]=1;return n});
  const sq=(id,q)=>{if(q<1){setSel(p=>{const n={...p};delete n[id];return n});return}setSel(p=>({...p,[id]:q}))};
  let tot=0;PRICING.forEach(c=>c.items.forEach(i=>{if(sel[i.id])tot+=i.price*(i.pu?sel[i.id]:1)}));
  const up=Math.round(tot*1.25),cnt=Object.keys(sel).length;
  const send=()=>{let m=`*Teklif Talebi — HST*\n\nFirma: ${fm.c}\nYetkili: ${fm.p}\nTel: ${fm.t}\nE-posta: ${fm.e}\n\n*Seçilenler:*\n`;PRICING.forEach(c=>c.items.forEach(i=>{if(sel[i.id])m+=`• ${i.tr}${i.pu?` ×${sel[i.id]}`:""}\n`}));m+=`\n*Tahmini: ${tot.toLocaleString("tr-TR")} – ${up.toLocaleString("tr-TR")} TL +KDV*`;window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(m)}`,"_blank")};
  return <div style={{paddingTop:72}}><section className="section"><div className="container" style={{maxWidth:860}}>
    <FadeIn><div className="section-label">Teklif Hesapla</div></FadeIn>
    <FadeIn delay={.1}><h1 className="section-title" style={{marginBottom:6}}>Online Teklif Sihirbazı</h1></FadeIn>
    <FadeIn delay={.15}><p style={{color:"#6b7280",marginBottom:32,fontSize:14}}>Hizmetleri seçin, anında tahmini fiyat aralığı görün.</p></FadeIn>
    <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:28}}>{PRICING.map(cat=><div key={cat.id}>
      <div onClick={()=>setOc(oc===cat.id?null:cat.id)} style={{padding:"14px 18px",border:"1px solid #e5e2dc",background:"#fff",cursor:"pointer",marginBottom:3,borderColor:oc===cat.id?C.orange:"#e5e2dc",borderLeft:oc===cat.id?`3px solid ${C.orange}`:"1px solid #e5e2dc"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:13}}>{cat.tr}</span><span style={{fontSize:10,color:"#6b7280"}}>{oc===cat.id?"▲":"▼"}</span></div></div>
      {oc===cat.id&&<div style={{borderLeft:`2px solid ${C.orange}22`,marginLeft:1,padding:"6px 0"}}>{cat.items.map(it=>{const on=!!sel[it.id];return <div key={it.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 18px",background:on?`${C.orange}08`:"transparent"}}><label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",flex:1,fontSize:13}}><input type="checkbox" checked={on} onChange={()=>tog(it.id)} style={{width:16,height:16,accentColor:C.orange}}/>{it.tr}</label>{it.pu&&on&&<div style={{display:"flex",alignItems:"center",gap:5}}><button onClick={()=>sq(it.id,(sel[it.id]||1)-1)} style={{width:28,height:28,border:"1px solid #e5e2dc",background:"#fff",cursor:"pointer",fontWeight:700}}>−</button><span style={{fontWeight:700,fontSize:13,minWidth:24,textAlign:"center"}}>{sel[it.id]}</span><button onClick={()=>sq(it.id,(sel[it.id]||1)+1)} style={{width:28,height:28,border:"1px solid #e5e2dc",background:"#fff",cursor:"pointer",fontWeight:700}}>+</button></div>}</div>})}</div>}
    </div>)}</div>
    {cnt>0&&<FadeIn><div className="card" style={{borderLeft:`3px solid ${C.orange}`}}>
      <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.orange,textTransform:"uppercase",marginBottom:14}}>Tahmini Fiyat Aralığı</div>
      <div style={{fontSize:36,fontWeight:900,fontFamily:"Cormorant Garamond",marginBottom:6,color:C.navy}}>{tot.toLocaleString("tr-TR")} – {up.toLocaleString("tr-TR")} <span style={{fontSize:16,fontWeight:400}}>TL</span></div>
      <p style={{fontSize:11,color:"#6b7280",marginBottom:20}}>* KDV hariç tahminidir.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}><input placeholder="Firma Adı" value={fm.c} onChange={e=>setFm({...fm,c:e.target.value})}/><input placeholder="Yetkili Kişi" value={fm.p} onChange={e=>setFm({...fm,p:e.target.value})}/><input placeholder="Telefon" value={fm.t} onChange={e=>setFm({...fm,t:e.target.value})}/><input placeholder="E-posta" value={fm.e} onChange={e=>setFm({...fm,e:e.target.value})}/></div>
      <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={send}>Teklif Talebini Gönder →</button>
    </div></FadeIn>}
  </div></section></div>;
}

function ContactPage() {
  const { data: contact } = useSupabase('contact_info', { single: true });
  return <div style={{paddingTop:72}}><section className="section"><div className="container">
    <FadeIn><div className="section-label">İletişim</div></FadeIn>
    <FadeIn delay={.1}><h1 className="section-title" style={{marginBottom:40}}>Bize Ulaşın</h1></FadeIn>
    <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28}}>
      <FadeIn delay={.15}><div className="card" style={{padding:28}}><h3 style={{fontSize:18,marginBottom:16,color:C.navy}}>Mesaj Gönderin</h3><div style={{display:"flex",flexDirection:"column",gap:12}}><input placeholder="Ad Soyad"/><input placeholder="E-posta"/><input placeholder="Telefon"/><textarea rows={4} placeholder="Mesajınız" style={{resize:"vertical"}}/><button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}}>Gönder</button></div></div></FadeIn>
      <FadeIn delay={.25}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="card" style={{padding:"18px 22px"}}><div style={{fontSize:11,fontWeight:800,color:C.orange,letterSpacing:1.5,marginBottom:4}}>TELEFON</div><div style={{fontWeight:700,fontSize:15}}>{contact?.phone}</div></div>
        <div className="card" style={{padding:"18px 22px"}}><div style={{fontSize:11,fontWeight:800,color:C.orange,letterSpacing:1.5,marginBottom:4}}>E-POSTA</div><div style={{fontWeight:700,fontSize:13}}>{contact?.email}</div></div>
        <div className="card" style={{padding:"18px 22px"}}><div style={{fontSize:11,fontWeight:800,color:C.orange,letterSpacing:1.5,marginBottom:4}}>ADRES</div><div style={{fontWeight:600,fontSize:13,lineHeight:1.6}}>{contact?.address}</div></div>
        <a href={`https://wa.me/${contact?.whatsapp||WHATSAPP}`} target="_blank" rel="noopener" className="btn" style={{background:"#25D366",color:"#fff",justifyContent:"center"}}>WhatsApp ile Yazın</a>
      </div></FadeIn>
    </div>
  </div></section></div>;
}

function NotFoundPage() {
  usePageSeo({ title: 'Sayfa Bulunamadı | HST Periyodik', description: 'Aradığınız sayfa bulunamadı.', path: '/404', noindex: true });
  return <div style={{paddingTop:120}}><section className="section"><div className="container" style={{maxWidth:700,textAlign:'center'}}><h1 className="section-title">Sayfa Bulunamadı</h1><p style={{fontSize:15,color:'#6b7280',lineHeight:1.8,marginBottom:24}}>İstediğiniz sayfa taşınmış, kaldırılmış veya yanlış yazılmış olabilir.</p><Link to="/" className="btn btn-primary">Ana Sayfaya Dön</Link></div></section></div>;
}

export default function App() {
  return <>
    <GlobalCSS />
    <ScrollToTop />
    <Routes>
      <Route path="/admin" element={<SeoPage title="Admin Panel | HST Periyodik" description="Yönetim paneli" path="/admin" noindex><AdminPanel /></SeoPage>} />
      <Route element={<Layout />}>
        <Route path="/" element={<SeoPage title="HST Periyodik Mühendislik Hizmetleri" description={DEFAULT_SEO.description} path="/" schema={[{ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'HST Periyodik Mühendislik Hizmetleri', url: SITE_URL, image: `${SITE_URL}/logo.png`, logo: `${SITE_URL}/favicon.png`, telephone: '+90 534 881 40 40', email: 'miracnecmihasturk@gmail.com', address: { '@type': 'PostalAddress', addressLocality: 'Kastamonu', addressCountry: 'TR' }, areaServed: 'TR', priceRange: '$$', description: DEFAULT_SEO.description }]}><Home /></SeoPage>} />
        <Route path="/hizmetler" element={<SeoPage title="Hizmetlerimiz | HST Periyodik" description="Periyodik kontrol, patlamadan korunma dokümanı, endüstriyel raf statik analizi, ortam ölçümleri ve diğer mühendislik hizmetlerimizi inceleyin." path="/hizmetler"><ServicesPage /></SeoPage>} />
        <Route path="/hizmet-bolgeleri" element={<SeoPage title="Hizmet Bölgeleri | HST Periyodik" description="Türkiye genelinde hizmet verdiğimiz illere özel periyodik kontrol sayfalarını inceleyin." path="/hizmet-bolgeleri"><RegionsPage /></SeoPage>} />
        <Route path="/hakkimizda" element={<SeoPage title="Hakkımızda | HST Periyodik" description="HST Periyodik Mühendislik Hizmetleri'nin tecrübesi, yaklaşımı ve Türkiye genelindeki hizmet ağı hakkında bilgi alın." path="/hakkimizda"><AboutPage /></SeoPage>} />
        <Route path="/referanslar" element={<SeoPage title="Referanslarımız | HST Periyodik" description="HST Periyodik'in hizmet verdiği firmaları ve referanslarını inceleyin." path="/referanslar"><ReferencesPage /></SeoPage>} />
        <Route path="/blog" element={<SeoPage title="Blog | HST Periyodik" description="Periyodik kontrol, raf analizi, patlamadan korunma ve ortam ölçümleri hakkında güncel makalelerimizi okuyun." path="/blog"><BlogPage /></SeoPage>} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/periyodik-kontrol/:slug" element={<CityPage />} />
        <Route path="/teklif-hesapla" element={<SeoPage title="Teklif Hesapla | HST Periyodik" description="Online teklif sihirbazı ile ihtiyaç duyduğunuz periyodik kontrol ve mühendislik hizmetleri için hızlı fiyat aralığı görün." path="/teklif-hesapla"><QuotePage /></SeoPage>} />
        <Route path="/iletisim" element={<SeoPage title="İletişim | HST Periyodik" description="HST Periyodik Mühendislik Hizmetleri ile telefon, e-posta veya WhatsApp üzerinden iletişime geçin." path="/iletisim"><ContactPage /></SeoPage>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </>;
}
