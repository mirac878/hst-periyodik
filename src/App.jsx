import { useState } from "react";

const CONTACT = { phone:"0534 881 40 40", whatsapp:"905348814040", email:"miracnecmihasturk@gmail.com", address:"İnönü Mah. Alparslan Türkeş Blv. Ilgaz Sok. Saray Apt, Kastamonu", mapLat:41.3887, mapLng:33.7827 };
const C = { navy:"#0F2B4C", navyL:"#163a5e", orange:"#C75B12", orangeL:"#e8782e" };

const PRICING=[{id:"raf",tr:"Endüstriyel Raf",en:"Industrial Racking",items:[{id:"rk",tr:"Raf Periyodik Kontrolü",en:"Rack Inspection",price:1000,pu:1},{id:"rs",tr:"Raf Statik Hesaplama",en:"Rack Static Analysis",price:2500,pu:1}]},{id:"ortam",tr:"Ortam Ölçümü (İSG)",en:"Environmental (OHS)",items:[{id:"go",tr:"Ortam Gürültü Ölçümü",en:"Ambient Noise",price:25000},{id:"to",tr:"Ortam Toz Ölçümü",en:"Ambient Dust",price:25000},{id:"gm",tr:"Gürültü Maruziyeti",en:"Noise Exposure",price:1000,pu:1},{id:"tk",tr:"Termal Konfor",en:"Thermal Comfort",price:1000,pu:1},{id:"tm",tr:"Toz Maruziyeti",en:"Dust Exposure",price:1000,pu:1},{id:"vc",tr:"VOC Ölçümü",en:"VOC",price:7000,pu:1},{id:"ay",tr:"Aydınlatma",en:"Lighting",price:15000},{id:"ek",tr:"El-Kol Titreşim",en:"Hand-Arm Vibration",price:1000,pu:1},{id:"tv",tr:"Tüm Vücut Titreşim",en:"Whole Body Vibration",price:1250,pu:1},{id:"em",tr:"Elektromanyetik Alan",en:"EMF",price:5000}]},{id:"cev",tr:"Çevresel Ölçüm",en:"Environmental Monitoring",items:[{id:"cg",tr:"Çevresel Gürültü",en:"Env. Noise",price:45000},{id:"ct",tr:"Çevresel Titreşim",en:"Env. Vibration",price:80000},{id:"pm",tr:"PM10 Örneklemesi",en:"PM10",price:40000},{id:"yg",tr:"Yanma Gazları",en:"Combustion Gases",price:40000},{id:"ab",tr:"Asbest Analizi",en:"Asbestos",price:10000,pu:1}]},{id:"bas",tr:"Basınçlı Kaplar",en:"Pressure Vessels",items:[{id:"ko",tr:"Kompresör",en:"Compressor",price:500,pu:1},{id:"hi",tr:"Hidrofor",en:"Hydrophore",price:500,pu:1},{id:"ge",tr:"Genleşme Tankı",en:"Expansion Tank",price:500,pu:1},{id:"kz",tr:"Kazan",en:"Boiler",price:1250,pu:1}]},{id:"kal",tr:"Kaldırma Ekipmanları",en:"Lifting Equipment",items:[{id:"fl",tr:"Forklift",en:"Forklift",price:1100,pu:1},{id:"vi",tr:"Vinç",en:"Crane",price:1250,pu:1},{id:"pl",tr:"Kaldırma Platformu",en:"Platform",price:1250,pu:1},{id:"tp",tr:"Transpalet",en:"Pallet Jack",price:500,pu:1},{id:"al",tr:"Araç Kaldırma Lifti",en:"Vehicle Lift",price:700,pu:1},{id:"tf",tr:"Teleskobik Forklift",en:"Telehandler",price:1100,pu:1},{id:"sp",tr:"Sepetli Platform",en:"Boom Lift",price:1250,pu:1}]},{id:"mak",tr:"İş Makineleri & Araçlar",en:"Construction Equipment",items:[{id:"ex",tr:"Ekskavatör",en:"Excavator",price:1250,pu:1},{id:"dz",tr:"Dozer",en:"Bulldozer",price:1250,pu:1},{id:"gr",tr:"Greyder",en:"Grader",price:1250,pu:1},{id:"yk",tr:"Yükleyici",en:"Loader",price:1250,pu:1},{id:"si",tr:"Silindir",en:"Roller",price:1250,pu:1},{id:"dk",tr:"Damperli Kamyon",en:"Dump Truck",price:700,pu:1},{id:"km",tr:"Kamyonet",en:"Pickup",price:500,pu:1},{id:"tn",tr:"Tanker",en:"Tanker",price:1250,pu:1},{id:"ck",tr:"Çekici",en:"Tractor",price:1250,pu:1},{id:"tr",tr:"Treyler/Lowbed",en:"Trailer",price:1250,pu:1},{id:"bk",tr:"Beko Loader",en:"Backhoe",price:1250,pu:1},{id:"mx",tr:"Transmikser",en:"Transit Mixer",price:1250,pu:1},{id:"bp",tr:"Beton Pompası",en:"Concrete Pump",price:1250,pu:1},{id:"kk",tr:"Konkasör",en:"Crusher",price:1250,pu:1}]},{id:"elk",tr:"Elektrik Tesisatı",en:"Electrical",items:[{id:"it",tr:"İç Tesisat Uygunluk",en:"Internal Installation",price:3500},{id:"tl",tr:"Topraklama",en:"Grounding",price:5000},{id:"ka",tr:"Kaçak Akım Rölesi",en:"RCD",price:2500},{id:"jn",tr:"Jeneratör",en:"Generator",price:750,pu:1},{id:"pa",tr:"Paratoner",en:"Lightning Rod",price:1250,pu:1},{id:"kp",tr:"Kompanzasyon",en:"Power Factor",price:2500}]},{id:"yan",tr:"Yangın Sistemleri",en:"Fire Systems",items:[{id:"yt",tr:"Yangın Tesisatı",en:"Fire System",price:5000},{id:"sn",tr:"Portatif Söndürücü",en:"Extinguisher",price:150,pu:1},{id:"ag",tr:"Algılama Sistemi",en:"Detection",price:8250}]},{id:"dig",tr:"Diğer Ekipmanlar",en:"Other",items:[{id:"ek2",tr:"Endüstriyel Kapı",en:"Industrial Door",price:1000,pu:1},{id:"hv",tr:"Havalandırma",en:"Ventilation",price:2500},{id:"ky",tr:"Kaynak Makinası",en:"Welding",price:500,pu:1},{id:"pr",tr:"Pres",en:"Press",price:700,pu:1},{id:"tz",tr:"Tezgah/Matkap",en:"Lathe/Drill",price:750,pu:1},{id:"db",tr:"Demir Kesme/Bükme",en:"Rebar Machine",price:750,pu:1},{id:"bc",tr:"Baca Muayenesi",en:"Chimney",price:3500}]}];

const BLOG=[{id:"1",tr:{title:"Endüstriyel Raf Periyodik Kontrolü Nedir ve Neden Zorunludur?",date:"28 Mart 2026",excerpt:"Depo ve endüstriyel tesislerde kullanılan raf sistemlerinin periyodik kontrolü yasal bir zorunluluktur.",content:"Endüstriyel depolarda kullanılan raf sistemleri, ağır yükleri taşımak üzere tasarlanmış çelik yapılardır. Bu yapılar zamanla çeşitli nedenlerle hasar görebilir: forklift çarpmaları, aşırı yükleme, zemin çökmeleri, korozyon ve montaj hataları bunların başında gelir.\n\n6331 Sayılı İş Sağlığı ve Güvenliği Kanunu ve İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği kapsamında, işverenler iş ekipmanlarının periyodik kontrollerini yaptırmakla yükümlüdür.\n\nTS EN 15635 standardı, çelik statik depolama sistemlerinin kullanımı ve bakımı için temel referans standarttır. Bu standarda göre raf sistemlerinin düzenli olarak kontrol edilmesi ve hasar seviyelerinin sınıflandırılması gerekmektedir.\n\nRaf periyodik kontrolünde incelenen başlıca unsurlar: Dikme elemanlarının düşey doğrultusu ve eğilme kontrolü, kiriş elemanlarının yatay doğrultusu ve bağlantı sağlamlığı, zemin ankraj bağlantıları, yük dağılımı ve kapasite etiketleri.\n\nKontrol sonucunda tespit edilen hasarlar üç seviyede sınıflandırılır: Yeşil (düşük risk), Turuncu (orta risk), Kırmızı (yüksek risk — derhal boşaltılmalı).\n\nPeriyodik kontrol sıklığı en fazla 12 ay olmalıdır. Yoğun kullanılan depolarda bu süre kısaltılmalıdır. Kontrol yaptırmamanın yaptırımları ciddidir — iş kazası durumunda işverenin cezai ve hukuki sorumluluğu doğar."},en:{title:"What is Industrial Rack Periodic Inspection?",date:"Mar 28, 2026",excerpt:"Periodic inspection of racking systems is a legal requirement.",content:"Industrial racking systems are steel structures designed to carry heavy loads..."}},{id:"2",tr:{title:"İş Ekipmanlarında Periyodik Kontrol Zorunluluğu: 6331 Sayılı Kanun",date:"28 Mart 2026",excerpt:"İş ekipmanlarının periyodik kontrolü, 6331 sayılı İSG Kanunu kapsamında işverenlerin en temel yükümlülüklerinden biridir.",content:"İş sağlığı ve güvenliği mevzuatı kapsamında, işyerlerinde kullanılan tüm iş ekipmanlarının belirli periyotlarla kontrol ve muayenelerinin yaptırılması zorunludur.\n\nBasınçlı kaplar yılda bir kez kontrol edilmelidir. Kaldırma ekipmanları da yılda bir kez periyodik kontrole tabi tutulmalıdır. İş makineleri genellikle yılda bir kez kontrol edilir.\n\nElektrik tesisatı kontrolleri ayrı bir öneme sahiptir. Periyodik kontrol yaptırmamanın sonuçları ağırdır: idari para cezaları, işyeri kapatma, ağır cezai ve tazminat sorumlulukları."},en:{title:"Mandatory Periodic Inspection: Law 6331",date:"Mar 28, 2026",excerpt:"Periodic inspection is a fundamental employer obligation under OHS Law 6331.",content:"Under OHS legislation, all work equipment must be inspected at specified intervals..."}},{id:"3",tr:{title:"İşyerlerinde Ortam Ölçümü Neden Zorunludur?",date:"28 Mart 2026",excerpt:"Gürültü, toz, aydınlatma, termal konfor ve diğer parametrelerin ölçümü yasal zorunluluktur.",content:"İş Hijyeni Ölçüm, Test ve Analizi kapsamında ortam ölçümleri yapılmaktadır.\n\nGürültü ölçümü TS EN ISO 9612 standardına göre, toz ölçümü HSE MDHS 14/3 yöntemine göre, termal konfor TS EN ISO 7730 standardına göre yapılır.\n\nBu ölçümler TÜRKAK akreditasyonuna sahip laboratuvarlar tarafından yapılmalıdır. Ölçüm raporlarının eksikliği idari para cezasına neden olur."},en:{title:"Why Are Environmental Measurements Mandatory?",date:"Mar 28, 2026",excerpt:"Measurement of noise, dust, lighting and other parameters is legally required.",content:"Environmental measurements identify risks in workplaces..."}},{id:"4",tr:{title:"Basınçlı Kaplar Periyodik Muayenesi: Kompresör, Hidrofor, Genleşme Tankı",date:"28 Mart 2026",excerpt:"Basınçlı kapların periyodik muayenesi can güvenliği açısından kritik öneme sahiptir.",content:"Basınçlı kaplar, içlerinde atmosfer basıncının üzerinde gaz veya sıvı barındıran ekipmanlardır.\n\nHidrostatik basınç testi en güvenilir yöntemdir. Emniyet ventili kontrolü kritik bir aşamadır — arızalı ventil patlama nedenlerinin başında gelir.\n\nBasınçlı kap muayenesini ihmal etmenin sonuçları çok ağır olabilir. Patlama durumunda ölüm veya ağır yaralanmalar meydana gelebilir."},en:{title:"Pressure Vessel Inspection",date:"Mar 28, 2026",excerpt:"Periodic inspection of pressure vessels is critical for safety.",content:"Pressure vessels contain gas or liquid above atmospheric pressure..."}},{id:"5",tr:{title:"Periyodik Kontrol Yaptırmayan İşverenleri Bekleyen Cezalar (2026)",date:"28 Mart 2026",excerpt:"2026 yılında periyodik kontrol yaptırmayan işverenler ciddi yaptırımlarla karşı karşıya.",content:"6331 Sayılı Kanun'un 26. maddesi idari para cezalarını düzenlemektedir. Her ihlal için ayrı ceza uygulanır.\n\nİş kazası durumunda işveren TCK kapsamında yargılanabilir. SGK rücu davası açabilir. Sigorta şirketleri periyodik kontrol raporlarını talep eder.\n\nSonuç olarak periyodik kontrol yaptırmak bir maliyet değil, yatırımdır."},en:{title:"Penalties for Skipping Inspections (2026)",date:"Mar 28, 2026",excerpt:"Employers face serious fines and legal consequences.",content:"Law 6331 Article 26 regulates administrative penalties..."}}];

const SVC=[{n:1,tr:"Raf Periyodik Kontrol",en:"Rack Inspection",trD:"TS EN 15635 standardına uygun endüstriyel raf sistemlerinin periyodik kontrol ve muayeneleri.",enD:"Periodic inspection of industrial racking per TS EN 15635."},{n:2,tr:"Statik Analiz Raporu",en:"Static Analysis",trD:"SAP2000 tabanlı yapısal analiz ile raf sistemlerinin taşıma kapasitesi hesaplama ve raporlama.",enD:"SAP2000-based structural analysis and reporting."},{n:3,tr:"Ortam Ölçümü",en:"Environmental Measurement",trD:"Gürültü, toz, aydınlatma, termal konfor, titreşim, VOC ölçümleri. TÜRKAK akredite raporlama.",enD:"Noise, dust, lighting, vibration, VOC measurements."},{n:4,tr:"PKD Hazırlama",en:"Explosion Protection",trD:"Patlamadan Korunma Dokümanı, ATEX bölge sınıflandırması ve risk değerlendirmesi.",enD:"EPD preparation, ATEX zone classification."},{n:5,tr:"Ekipman Periyodik Kontrol",en:"Equipment Inspection",trD:"Basınçlı kaplar, kaldırma ekipmanları, iş makineleri ve tüm iş ekipmanlarının yasal periyodik muayeneleri.",enD:"Legal periodic inspection of all work equipment."},{n:6,tr:"Elektrik & Yangın Kontrolü",en:"Electrical & Fire",trD:"Elektrik tesisatı, topraklama, paratoner, jeneratör, yangın tesisatı ve algılama sistemleri.",enD:"Electrical, grounding, fire systems inspections."}];

const PG=["home","services","about","references","blog","quote","contact"];

export default function App(){
  const[lang,setLang]=useState("tr");
  const[dk,setDk]=useState(false);
  const[pg,setPg]=useState("home");
  const[mob,setMob]=useState(false);
  const[bp,setBp]=useState(null);
  const go=(p,b=null)=>{setPg(p);setBp(b);setMob(false);window.scrollTo({top:0,behavior:'smooth'})};
  const t=lang==="tr";
  const bg=dk?"#080e1a":"#faf9f6";
  const bgC=dk?"#0f1926":"#fff";
  const tx=dk?"#cdd5e0":"#1a2332";
  const txM=dk?"#6b7a8e":"#6b7280";
  const bd=dk?"#1a2940":"#e5e2dc";
  const ac=dk?"#e8782e":"#C75B12";
  const nv=dk?"#c0cfe0":"#0F2B4C";
  const nl={home:t?"Ana Sayfa":"Home",services:t?"Hizmetler":"Services",about:t?"Hakkımızda":"About",references:t?"Referanslar":"References",blog:"Blog",quote:t?"Teklif Al":"Get Quote",contact:t?"İletişim":"Contact"};

  return(<div style={{background:bg,color:tx,minHeight:"100vh",fontFamily:'"Source Sans 3",system-ui,sans-serif',transition:"all .4s"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:wght@600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}h1,h2,h3{font-family:'Cormorant Garamond',Georgia,serif;font-weight:700}::selection{background:#C75B1233}.fi{opacity:0;transform:translateY(16px);animation:fu .6s ease forwards}.f2{animation-delay:.12s}.f3{animation-delay:.24s}.f4{animation-delay:.36s}@keyframes fu{to{opacity:1;transform:none}}.nl{padding:10px 14px;font-size:13px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;cursor:pointer;color:${txM};transition:color .2s;border-bottom:2px solid transparent}.nl:hover,.nl.on{color:${ac};border-bottom-color:${ac}}@media(max-width:960px){.dln{display:none!important}.hmb{display:flex!important}}.sc{background:${bgC};border:1px solid ${bd};padding:32px;transition:all .3s;position:relative;overflow:hidden}.sc::after{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:${ac};transform:scaleY(0);transition:transform .3s;transform-origin:top}.sc:hover::after{transform:scaleY(1)}.sc:hover{border-color:${ac}44;box-shadow:0 8px 28px ${dk?"#00000030":"#0000000a"}}.ob{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;font-weight:700;font-size:13px;letter-spacing:.8px;text-transform:uppercase;cursor:pointer;transition:all .25s;border:none;font-family:inherit}.obf{background:${ac};color:#fff}.obf:hover{background:${C.navy};transform:translateY(-2px)}.obg{background:transparent;border:2px solid ${bd};color:${tx}}.obg:hover{border-color:${ac};color:${ac}}.wc{padding:14px 18px;border:1px solid ${bd};background:${bgC};cursor:pointer;transition:all .2s;margin-bottom:3px}.wc:hover,.wc.op{border-color:${ac};border-left:3px solid ${ac}}.wi{display:flex;align-items:center;justify-content:space-between;padding:8px 18px;transition:background .15s}.wi:hover{background:${ac}08}.qb{width:28px;height:28px;border:1px solid ${bd};background:${bgC};color:${tx};display:flex;align-items:center;justify-content:center;cursor:pointer;font-weight:700;transition:all .15s}.qb:hover{border-color:${ac};color:${ac}}input,textarea{width:100%;padding:13px 16px;border:1px solid ${bd};background:${dk?"#080e1a":"#faf9f6"};color:${tx};font-size:14px;font-family:inherit;outline:none;transition:border .2s}input:focus,textarea:focus{border-color:${ac}}`}</style>

    {/* NAV */}
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:150,background:dk?"#080e1ae8":"#faf9f6e8",backdropFilter:"blur(14px)",borderBottom:`1px solid ${bd}`,padding:"0 36px",display:"flex",alignItems:"center",justifyContent:"space-between",height:68}}>
      <div style={{cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onClick={()=>go("home")}>
        <div style={{width:38,height:38,borderRadius:4,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:20,fontFamily:"Cormorant Garamond"}}>H</div>
        <div><div style={{fontWeight:900,fontSize:15,letterSpacing:1.5,color:nv}}>HST</div><div style={{fontSize:9,fontWeight:700,letterSpacing:3,color:txM,textTransform:"uppercase"}}>Periyodik</div></div>
      </div>
      <div className="dln" style={{display:"flex",gap:2}}>{PG.map(p=><span key={p} className={`nl ${pg===p?"on":""}`} onClick={()=>go(p)}>{nl[p]}</span>)}</div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span onClick={()=>setLang(lang==="tr"?"en":"tr")} style={{cursor:"pointer",padding:"5px 12px",fontSize:11,fontWeight:800,letterSpacing:1.5,border:`1px solid ${bd}`,color:txM}}>{lang==="tr"?"EN":"TR"}</span>
        <span onClick={()=>setDk(!dk)} style={{cursor:"pointer",fontSize:16,padding:4}}>{dk?"☀️":"🌙"}</span>
        <div className="hmb" style={{display:"none",cursor:"pointer",padding:6,flexDirection:"column",gap:4}} onClick={()=>setMob(!mob)}><div style={{width:20,height:2,background:tx}}/><div style={{width:20,height:2,background:tx}}/><div style={{width:20,height:2,background:tx}}/></div>
      </div>
    </nav>

    {mob&&<div style={{position:"fixed",inset:0,background:dk?"#080e1af0":"#faf9f6f0",zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
      <div style={{position:"absolute",top:16,right:24,fontSize:24,cursor:"pointer"}} onClick={()=>setMob(false)}>✕</div>
      {PG.map(p=><span key={p} style={{fontSize:18,fontWeight:800,cursor:"pointer",color:pg===p?ac:tx,letterSpacing:1}} onClick={()=>go(p)}>{nl[p]}</span>)}
    </div>}

    <div style={{paddingTop:68}}>

    {/* HOME */}
    {pg==="home"&&<>
      <section style={{padding:"90px 36px 70px",maxWidth:1140,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}}>
        <div>
          <div className="fi" style={{fontSize:11,fontWeight:800,letterSpacing:4,textTransform:"uppercase",color:ac,marginBottom:20}}>{t?"Mühendislik Hizmetleri":"Engineering Services"}</div>
          <h1 className="fi f2" style={{fontSize:"clamp(34px,4.5vw,52px)",lineHeight:1.15,marginBottom:20,color:nv}}>{t?"Endüstriyel":"Industrial"}<br/><span style={{color:ac}}>{t?"Güvenliğinizde":"Safety —"}</span><br/>{t?"Güvenilir Ortağınız":"Your Trusted Partner"}</h1>
          <p className="fi f3" style={{fontSize:16,lineHeight:1.85,color:txM,marginBottom:32,maxWidth:440}}>{t?"18 yılı aşkın deneyimimizle periyodik kontrol, statik analiz, ortam ölçümü ve mühendislik hizmetlerinde yanınızdayız.":"With 18+ years of experience in periodic inspection, static analysis and engineering services."}</p>
          <div className="fi f4" style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <button className="ob obf" onClick={()=>go("quote")}>{t?"Teklif Hesapla":"Get Quote"} →</button>
            <button className="ob obg" onClick={()=>go("contact")}>{t?"İletişim":"Contact"}</button>
          </div>
        </div>
        <div className="fi f3" style={{display:"flex",justifyContent:"center"}}>
          <div style={{width:280,height:280,borderRadius:"50%",background:`linear-gradient(135deg,${C.navy},${C.navyL})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 20px 56px ${C.navy}33`,position:"relative"}}>
            <div style={{color:"#fff",fontSize:100,fontWeight:900,fontFamily:"Cormorant Garamond",opacity:.12,position:"absolute"}}>H</div>
            <div style={{textAlign:"center",color:"#fff",zIndex:1}}>
              <div style={{fontSize:56,fontWeight:900,fontFamily:"Cormorant Garamond"}}>18+</div>
              <div style={{fontSize:12,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:.65}}>{t?"Yıl Deneyim":"Years Exp."}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{background:dk?"#0f1926":"#f0ece6",borderTop:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`}}>
        <div style={{maxWidth:1140,margin:"0 auto",padding:"36px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:28,textAlign:"center"}}>
          {[{v:"500+",l:t?"Proje":"Projects"},{v:"81",l:t?"İl":"Provinces"},{v:"18+",l:t?"Yıl":"Years"},{v:t?"%100":"100%",l:t?"Memnuniyet":"Satisfaction"}].map((s,i)=>(
            <div key={i}><div style={{fontSize:32,fontWeight:900,fontFamily:"Cormorant Garamond",color:ac}}>{s.v}</div><div style={{fontSize:12,fontWeight:700,color:txM,letterSpacing:1.5,textTransform:"uppercase",marginTop:2}}>{s.l}</div></div>
          ))}
        </div>
      </section>

      <section style={{maxWidth:1140,margin:"0 auto",padding:"72px 36px"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:4,textTransform:"uppercase",color:ac,marginBottom:10}}>{t?"Hizmetler":"Services"}</div>
        <h2 className="fi" style={{fontSize:34,color:nv,marginBottom:40}}>{t?"Sunduğumuz Hizmetler":"Our Services"}</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:16}}>
          {SVC.map((s,i)=>(<div key={i} className={`sc fi f${(i%4)+1}`}><div style={{fontSize:11,fontWeight:900,letterSpacing:3,color:ac,marginBottom:14}}>0{s.n}</div><h3 style={{fontSize:20,marginBottom:10,color:nv}}>{t?s.tr:s.en}</h3><p style={{fontSize:14,lineHeight:1.85,color:txM}}>{t?s.trD:s.enD}</p></div>))}
        </div>
      </section>

      <section style={{margin:"0 36px 72px",maxWidth:1068,marginLeft:"auto",marginRight:"auto"}}>
        <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyL})`,padding:"52px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
          <div><h2 style={{color:"#fff",fontSize:26,marginBottom:6}}>{t?"Hemen Teklif Alın":"Get a Quote"}</h2><p style={{color:"#fff8",fontSize:14}}>{t?"Online sihirbazımızla anında fiyat aralığı hesaplayın.":"Calculate instant price ranges online."}</p></div>
          <button className="ob" style={{background:ac,color:"#fff"}} onClick={()=>go("quote")}>{t?"Teklif Hesapla":"Calculate"} →</button>
        </div>
      </section>
    </>}

    {/* SERVICES */}
    {pg==="services"&&<section style={{maxWidth:900,margin:"0 auto",padding:"56px 36px"}}>
      <div style={{fontSize:11,fontWeight:800,letterSpacing:4,color:ac,textTransform:"uppercase",marginBottom:10}}>{t?"Hizmetlerimiz":"Services"}</div>
      <h1 className="fi" style={{fontSize:38,color:nv,marginBottom:40}}>{t?"Tüm Hizmetlerimiz":"All Services"}</h1>
      {SVC.map((s,i)=>(<div key={i} className={`sc fi f${(i%4)+1}`} style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:20,marginBottom:16}}><div style={{fontSize:28,fontWeight:900,color:ac,fontFamily:"Cormorant Garamond"}}>0{s.n}</div><div><h3 style={{fontSize:20,marginBottom:8,color:nv}}>{t?s.tr:s.en}</h3><p style={{fontSize:15,lineHeight:1.9,color:txM}}>{t?s.trD:s.enD}</p></div></div>))}
    </section>}

    {/* ABOUT */}
    {pg==="about"&&<section style={{maxWidth:800,margin:"0 auto",padding:"56px 36px"}}>
      <div style={{fontSize:11,fontWeight:800,letterSpacing:4,color:ac,textTransform:"uppercase",marginBottom:10}}>{t?"Hakkımızda":"About"}</div>
      <h1 className="fi" style={{fontSize:38,color:nv,marginBottom:28}}>{t?"Firmamız":"Our Company"}</h1>
      <div className="fi f2" style={{fontSize:16,lineHeight:2,color:txM,marginBottom:36}}>
        <p style={{marginBottom:14}}>{t?"HST Periyodik Mühendislik Hizmetleri olarak 18 yılı aşkın süredir endüstriyel tesislerin periyodik kontrol, muayene ve mühendislik hizmetlerini profesyonel bir anlayışla yürütmekteyiz.":"HST has been providing professional periodic inspection and engineering services for over 18 years."}</p>
        <p>{t?"Tüm hizmetlerimizde 6331 Sayılı İSG Kanunu ve ulusal/uluslararası standartlara tam uyumluluk sağlamaktayız.":"All services comply with Law 6331 and national/international standards."}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {(t?["İnşaat Mühendisi kadrosu","TÜRKAK akredite iş birlikleri","SAP2000 yapısal analiz","81 il genelinde hizmet"]:["Civil Engineering team","TURKAK accredited","SAP2000 analysis","81 provinces"]).map((h,i)=>(<div key={i} className={`sc fi f${i+1}`} style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}><span style={{color:ac,fontWeight:900}}>✓</span><span style={{fontSize:14,fontWeight:600}}>{h}</span></div>))}
      </div>
    </section>}

    {/* REFERENCES */}
    {pg==="references"&&<section style={{maxWidth:900,margin:"0 auto",padding:"56px 36px"}}>
      <div style={{fontSize:11,fontWeight:800,letterSpacing:4,color:ac,textTransform:"uppercase",marginBottom:10}}>{t?"Referanslar":"References"}</div>
      <h1 className="fi" style={{fontSize:38,color:nv,marginBottom:40}}>{t?"Hizmet Verdiğimiz Sektörler":"Sectors We Serve"}</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
        {(t?["Kamu Kurumları","İnşaat Firmaları","Gıda Sanayi","Lojistik & Depolama","Enerji Sektörü","Üretim Tesisleri"]:["Government","Construction","Food Industry","Logistics","Energy","Manufacturing"]).map((s,i)=>(<div key={i} className={`sc fi f${(i%4)+1}`} style={{textAlign:"center",padding:28}}><div style={{fontSize:24,fontWeight:900,color:ac,fontFamily:"Cormorant Garamond",marginBottom:6}}>0{i+1}</div><div style={{fontSize:14,fontWeight:700}}>{s}</div></div>))}
      </div>
    </section>}

    {/* BLOG */}
    {pg==="blog"&&!bp&&<section style={{maxWidth:900,margin:"0 auto",padding:"56px 36px"}}>
      <div style={{fontSize:11,fontWeight:800,letterSpacing:4,color:ac,textTransform:"uppercase",marginBottom:10}}>Blog</div>
      <h1 className="fi" style={{fontSize:38,color:nv,marginBottom:40}}>{t?"Makaleler":"Articles"}</h1>
      {BLOG.map((p,i)=>{const d=t?p.tr:p.en;return(<div key={p.id} className={`sc fi f${(i%4)+1}`} style={{cursor:"pointer",marginBottom:14}} onClick={()=>go("blog",p)}><div style={{fontSize:11,fontWeight:700,color:ac,letterSpacing:1,marginBottom:8}}>{d.date}</div><h3 style={{fontSize:18,marginBottom:8,color:nv,lineHeight:1.4}}>{d.title}</h3><p style={{fontSize:14,color:txM,lineHeight:1.7}}>{d.excerpt}</p><span style={{fontSize:13,fontWeight:700,color:ac,marginTop:10,display:"inline-block"}}>{t?"Devamını Oku":"Read More"} →</span></div>)})}
    </section>}

    {pg==="blog"&&bp&&<section style={{maxWidth:700,margin:"0 auto",padding:"56px 36px"}}>
      <span style={{cursor:"pointer",fontSize:13,fontWeight:700,color:ac}} onClick={()=>go("blog")}>← {t?"Tüm Makaleler":"All Articles"}</span>
      <div style={{fontSize:11,fontWeight:700,color:ac,letterSpacing:1,marginTop:20,marginBottom:8}}>{(t?bp.tr:bp.en).date}</div>
      <h1 className="fi" style={{fontSize:30,color:nv,lineHeight:1.35,marginBottom:28}}>{(t?bp.tr:bp.en).title}</h1>
      <div className="fi f2" style={{fontSize:16,lineHeight:2.1,color:txM,whiteSpace:"pre-line"}}>{(t?bp.tr:bp.en).content}</div>
    </section>}

    {/* QUOTE */}
    {pg==="quote"&&<QuoteW t={t} ac={ac} nv={nv} tx={tx} txM={txM} bgC={bgC} bd={bd} dk={dk} bg={bg}/>}

    {/* CONTACT */}
    {pg==="contact"&&<section style={{maxWidth:960,margin:"0 auto",padding:"56px 36px"}}>
      <div style={{fontSize:11,fontWeight:800,letterSpacing:4,color:ac,textTransform:"uppercase",marginBottom:10}}>{t?"İletişim":"Contact"}</div>
      <h1 className="fi" style={{fontSize:38,color:nv,marginBottom:40}}>{t?"Bize Ulaşın":"Get in Touch"}</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:28}}>
        <div className="sc fi f2" style={{padding:28}}>
          <h3 style={{fontSize:18,marginBottom:16,color:nv}}>{t?"Mesaj Gönderin":"Send Message"}</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input placeholder={t?"Ad Soyad":"Full Name"}/><input placeholder={t?"E-posta":"Email"}/><input placeholder={t?"Telefon":"Phone"}/><textarea rows={4} placeholder={t?"Mesajınız":"Message"}/>
            <button className="ob obf" style={{width:"100%",justifyContent:"center"}}>{t?"Gönder":"Send"}</button>
          </div>
        </div>
        <div className="fi f3" style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="sc" style={{padding:"18px 22px"}}><div style={{fontSize:11,fontWeight:800,color:ac,letterSpacing:1.5,marginBottom:4}}>{t?"TELEFON":"PHONE"}</div><div style={{fontWeight:700,fontSize:15}}>{CONTACT.phone}</div></div>
          <div className="sc" style={{padding:"18px 22px"}}><div style={{fontSize:11,fontWeight:800,color:ac,letterSpacing:1.5,marginBottom:4}}>E-POSTA</div><div style={{fontWeight:700,fontSize:13}}>{CONTACT.email}</div></div>
          <div className="sc" style={{padding:"18px 22px"}}><div style={{fontSize:11,fontWeight:800,color:ac,letterSpacing:1.5,marginBottom:4}}>{t?"ADRES":"ADDRESS"}</div><div style={{fontWeight:600,fontSize:13,lineHeight:1.6}}>{CONTACT.address}</div></div>
          <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener" className="ob" style={{background:"#25D366",color:"#fff",justifyContent:"center",textDecoration:"none"}}>{t?"WhatsApp ile Yazın":"WhatsApp"}</a>
          <div style={{border:`1px solid ${bd}`,height:180,overflow:"hidden"}}><iframe src={`https://maps.google.com/maps?q=${CONTACT.mapLat},${CONTACT.mapLng}&z=15&output=embed`} width="100%" height="100%" style={{border:0}} loading="lazy"/></div>
        </div>
      </div>
    </section>}

    </div>

    {/* FOOTER */}
    <footer style={{borderTop:`1px solid ${bd}`,padding:"40px 36px",marginTop:32}}>
      <div style={{maxWidth:1140,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div><div style={{fontWeight:900,fontSize:15,letterSpacing:1,color:nv}}>HST <span style={{fontWeight:400,fontSize:12,color:txM}}>Periyodik Mühendislik Hizmetleri</span></div><div style={{fontSize:11,color:txM,marginTop:2}}>© 2026 {t?"Tüm hakları saklıdır.":"All rights reserved."}</div></div>
        <div style={{fontSize:12,color:txM}}>{CONTACT.phone} · {CONTACT.email}</div>
      </div>
    </footer>

    <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener" style={{position:"fixed",bottom:24,right:24,width:52,height:52,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 4px 14px #25D36644",zIndex:99,textDecoration:"none",color:"#fff",fontSize:24}}>💬</a>
  </div>)}

function QuoteW({t,ac,nv,tx,txM,bgC,bd,dk,bg}){
  const[sel,setSel]=useState({});
  const[oc,setOc]=useState(null);
  const[fm,setFm]=useState({c:"",p:"",t:"",e:""});
  const tog=id=>setSel(p=>{const n={...p};if(n[id])delete n[id];else n[id]=1;return n});
  const sq=(id,q)=>{if(q<1){setSel(p=>{const n={...p};delete n[id];return n});return}setSel(p=>({...p,[id]:q}))};
  let tot=0;PRICING.forEach(c=>c.items.forEach(i=>{if(sel[i.id])tot+=i.price*(i.pu?sel[i.id]:1)}));
  const up=Math.round(tot*1.25),cnt=Object.keys(sel).length;
  const send=()=>{let m=`*${t?"Teklif Talebi":"Quote"} — HST*\n\nFirma: ${fm.c}\nYetkili: ${fm.p}\nTel: ${fm.t}\nE-posta: ${fm.e}\n\n*${t?"Seçilenler":"Selected"}:*\n`;PRICING.forEach(c=>c.items.forEach(i=>{if(sel[i.id])m+=`• ${t?i.tr:i.en}${i.pu?` ×${sel[i.id]}`:""}\n`}));m+=`\n*${t?"Tahmini":"Est."}: ${tot.toLocaleString("tr-TR")} – ${up.toLocaleString("tr-TR")} TL +KDV*`;window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(m)}`,"_blank")};

  return(<section style={{maxWidth:860,margin:"0 auto",padding:"56px 36px"}}>
    <div style={{fontSize:11,fontWeight:800,letterSpacing:4,color:ac,textTransform:"uppercase",marginBottom:10}}>{t?"Teklif Hesapla":"Get Quote"}</div>
    <h1 className="fi" style={{fontSize:34,color:nv,marginBottom:6}}>{t?"Online Teklif Sihirbazı":"Online Quote Calculator"}</h1>
    <p className="fi f2" style={{color:txM,marginBottom:32,fontSize:14}}>{t?"Hizmetleri seçin, anında tahmini fiyat aralığı görün.":"Select services, see instant price estimates."}</p>

    <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:28}}>
      {PRICING.map(cat=>(<div key={cat.id}>
        <div className={`wc ${oc===cat.id?"op":""}`} onClick={()=>setOc(oc===cat.id?null:cat.id)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:700,fontSize:13,letterSpacing:.5}}>{t?cat.tr:cat.en}</span><span style={{fontSize:10,color:txM}}>{oc===cat.id?"▲":"▼"}</span></div>
        </div>
        {oc===cat.id&&<div style={{borderLeft:`2px solid ${ac}22`,marginLeft:1,padding:"6px 0"}}>
          {cat.items.map(it=>{const on=!!sel[it.id];return(<div key={it.id} className="wi" style={{background:on?`${ac}08`:"transparent"}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",flex:1,fontSize:13}}><input type="checkbox" checked={on} onChange={()=>tog(it.id)} style={{width:16,height:16,accentColor:ac}}/>{t?it.tr:it.en}</label>
            {it.pu&&on&&<div style={{display:"flex",alignItems:"center",gap:5}}><button className="qb" onClick={()=>sq(it.id,(sel[it.id]||1)-1)}>−</button><span style={{fontWeight:700,fontSize:13,minWidth:24,textAlign:"center"}}>{sel[it.id]}</span><button className="qb" onClick={()=>sq(it.id,(sel[it.id]||1)+1)}>+</button></div>}
          </div>)})}
        </div>}
      </div>))}
    </div>

    {cnt>0&&<div className="sc fi" style={{borderLeft:`3px solid ${ac}`,marginBottom:28}}>
      <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:ac,textTransform:"uppercase",marginBottom:14}}>{t?"Tahmini Fiyat Aralığı":"Estimated Price Range"}</div>
      <div style={{fontSize:36,fontWeight:900,fontFamily:"Cormorant Garamond",marginBottom:6,color:nv}}>{tot.toLocaleString("tr-TR")} – {up.toLocaleString("tr-TR")} <span style={{fontSize:16,fontWeight:400}}>TL</span></div>
      <p style={{fontSize:11,color:txM,marginBottom:20}}>{t?"* KDV hariç tahminidir. Kesin fiyat için iletişime geçin.":"* Estimated, VAT excluded."}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <input placeholder={t?"Firma Adı":"Company"} value={fm.c} onChange={e=>setFm({...fm,c:e.target.value})}/>
        <input placeholder={t?"Yetkili Kişi":"Contact"} value={fm.p} onChange={e=>setFm({...fm,p:e.target.value})}/>
        <input placeholder={t?"Telefon":"Phone"} value={fm.t} onChange={e=>setFm({...fm,t:e.target.value})}/>
        <input placeholder="E-posta" value={fm.e} onChange={e=>setFm({...fm,e:e.target.value})}/>
      </div>
      <button className="ob obf" style={{width:"100%",justifyContent:"center"}} onClick={send}>{t?"Teklif Talebini Gönder":"Send Request"} →</button>
    </div>}
  </section>);
}
