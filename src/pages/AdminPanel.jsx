import { useState, useEffect, useCallback } from 'react';

const API_URL = '/api/admin';
const C = { navy:"#0F2B4C", orange:"#C75B12" };

async function adminFetch(body) {
  const pw = sessionStorage.getItem('hst_admin_pw');
  const res = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...body, password:pw}) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Hata');
  return data;
}

async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result.split(',')[1];
        const res = await adminFetch({ action:'upload_image', fileName:file.name, fileData:base64, contentType:file.type });
        resolve(res.url);
      } catch (e) { reject(e); }
    };
    reader.readAsDataURL(file);
  });
}

/* ── Styles ── */
const S = {
  container:{maxWidth:1000,margin:'0 auto',padding:'40px 20px',fontFamily:"'Source Sans 3',system-ui,sans-serif",minHeight:'100vh',background:'#f8f7f4'},
  header:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32,paddingBottom:16,borderBottom:`2px solid ${C.navy}`},
  title:{fontSize:28,fontWeight:700,color:C.navy,margin:0,fontFamily:"'Cormorant Garamond',serif"},
  tabs:{display:'flex',gap:0,marginBottom:32,borderBottom:'1px solid #ddd',flexWrap:'wrap'},
  tab:a=>({padding:'12px 18px',cursor:'pointer',border:'none',borderBottom:a?`3px solid ${C.navy}`:'3px solid transparent',background:'none',color:a?C.navy:'#888',fontWeight:a?600:400,fontSize:14,transition:'all .2s'}),
  card:{background:'#fff',borderRadius:8,padding:20,marginBottom:12,border:'1px solid #eee',boxShadow:'0 1px 3px rgba(0,0,0,.04)'},
  input:{width:'100%',padding:'10px 14px',border:'1px solid #ddd',borderRadius:6,fontSize:14,fontFamily:'inherit',boxSizing:'border-box',marginBottom:10},
  textarea:{width:'100%',padding:'10px 14px',border:'1px solid #ddd',borderRadius:6,fontSize:14,fontFamily:'inherit',boxSizing:'border-box',marginBottom:10,minHeight:100,resize:'vertical'},
  label:{display:'block',marginBottom:3,fontSize:12,fontWeight:600,color:'#555'},
  row:{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8},
  btnP:{background:C.navy,color:'#fff',border:'none',padding:'9px 20px',borderRadius:6,cursor:'pointer',fontSize:13,fontWeight:500},
  btnD:{background:'#dc3545',color:'#fff',border:'none',padding:'7px 14px',borderRadius:6,cursor:'pointer',fontSize:12},
  btnS:{background:'none',border:'1px solid #ddd',color:'#555',padding:'9px 20px',borderRadius:6,cursor:'pointer',fontSize:13},
  btnO:{background:C.orange,color:'#fff',border:'none',padding:'9px 20px',borderRadius:6,cursor:'pointer',fontSize:13,fontWeight:500},
  badge:a=>({display:'inline-block',padding:'2px 10px',borderRadius:20,fontSize:11,fontWeight:600,background:a?'#d4edda':'#fff3cd',color:a?'#155724':'#856404'}),
  msg:t=>({padding:'10px 14px',borderRadius:6,marginBottom:12,background:t==='error'?'#f8d7da':'#d4edda',color:t==='error'?'#721c24':'#155724',fontSize:13}),
};

/* ── ImageField Component ── */
function ImageField({label, value, onChange}) {
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) { alert('Yükleme hatası: ' + err.message); }
    setUploading(false);
  };
  return <div style={{marginBottom:10}}>
    <label style={S.label}>{label}</label>
    <div style={{display:'flex',gap:8,alignItems:'center'}}>
      <input style={{...S.input,marginBottom:0,flex:1}} value={value||''} onChange={e=>onChange(e.target.value)} placeholder="URL yapıştır veya dosya yükle" />
      <label style={{...S.btnO,cursor:'pointer',whiteSpace:'nowrap',padding:'9px 14px'}}>
        {uploading?'Yükleniyor...':'📷 Yükle'}
        <input type="file" accept="image/*" onChange={handleFile} style={{display:'none'}} />
      </label>
    </div>
    {value && <img src={value} alt="" style={{height:60,marginTop:6,objectFit:'contain',borderRadius:4,border:'1px solid #eee'}} />}
  </div>;
}

/* ── Login Screen ── */
function LoginScreen({onLogin}) {
  const [pw,setPw]=useState('');
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const handle=async(e)=>{
    e.preventDefault();setLoading(true);setError('');
    try{sessionStorage.setItem('hst_admin_pw',pw);await adminFetch({action:'login'});onLogin();}
    catch{setError('Yanlış şifre');sessionStorage.removeItem('hst_admin_pw');}
    setLoading(false);
  };
  return<div style={{...S.container,display:'flex',justifyContent:'center',alignItems:'center'}}>
    <div style={{...S.card,maxWidth:380,width:'100%',textAlign:'center',padding:32}}>
      <div style={{fontSize:40,marginBottom:12}}>🔒</div>
      <h2 style={{color:C.navy,marginBottom:20,fontFamily:"'Cormorant Garamond',serif"}}>HST Admin Panel</h2>
      {error&&<div style={S.msg('error')}>{error}</div>}
      <input type="password" placeholder="Admin şifresi" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handle(e)} style={S.input} autoFocus/>
      <button onClick={handle} style={{...S.btnP,width:'100%'}} disabled={loading}>{loading?'Giriş yapılıyor...':'Giriş Yap'}</button>
    </div>
  </div>;
}

/* ══════════════════════════════════════════
   GENERIC CRUD MANAGER
   ══════════════════════════════════════════ */
function CrudManager({table, title, fields, emptyItem, renderCard}) {
  const [items,setItems]=useState([]);
  const [editing,setEditing]=useState(null);
  const [msg,setMsg]=useState(null);
  const [loading,setLoading]=useState(true);

  const load=useCallback(async()=>{
    try{const d=await adminFetch({action:'list',table});setItems(d);}catch(e){setMsg({type:'error',text:e.message});}
    setLoading(false);
  },[table]);
  useEffect(()=>{load();},[load]);

  const save=async()=>{
    try{
      const cleanData={...editing};delete cleanData.id;delete cleanData.created_at;delete cleanData.updated_at;
      if(editing.id){await adminFetch({action:'update',table,id:editing.id,data:cleanData});setMsg({type:'success',text:'Güncellendi'});}
      else{await adminFetch({action:'create',table,data:cleanData});setMsg({type:'success',text:'Oluşturuldu'});}
      setEditing(null);load();
    }catch(e){setMsg({type:'error',text:e.message});}
  };
  const remove=async(id)=>{
    if(!confirm('Silmek istediğine emin misin?'))return;
    try{await adminFetch({action:'delete',table,id});setMsg({type:'success',text:'Silindi'});load();}catch(e){setMsg({type:'error',text:e.message});}
  };

  if(loading)return<p>Yükleniyor...</p>;

  if(editing)return<div>
    <h3 style={{color:C.navy,marginBottom:14,fontFamily:"'Cormorant Garamond',serif"}}>{editing.id?`${title} Düzenle`:`Yeni ${title}`}</h3>
    {fields.map(f=>{
      if(f.type==='image')return<ImageField key={f.key} label={f.label} value={editing[f.key]} onChange={v=>setEditing({...editing,[f.key]:v})}/>;
      if(f.type==='textarea')return<div key={f.key}><label style={S.label}>{f.label}</label><textarea style={S.textarea} value={editing[f.key]||''} onChange={e=>setEditing({...editing,[f.key]:e.target.value})} rows={f.rows||4}/></div>;
      if(f.type==='checkbox')return<div key={f.key} style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}><input type="checkbox" checked={!!editing[f.key]} onChange={e=>setEditing({...editing,[f.key]:e.target.checked})}/><span style={{fontSize:13}}>{f.label}</span></div>;
      if(f.type==='number')return<div key={f.key}><label style={S.label}>{f.label}</label><input style={S.input} type="number" value={editing[f.key]||0} onChange={e=>setEditing({...editing,[f.key]:parseInt(e.target.value)||0})}/></div>;
      return<div key={f.key}><label style={S.label}>{f.label}</label><input style={S.input} value={editing[f.key]||''} onChange={e=>setEditing({...editing,[f.key]:e.target.value})}/></div>;
    })}
    <div style={{display:'flex',gap:8,marginTop:8}}>
      <button style={S.btnP} onClick={save}>Kaydet</button>
      <button style={S.btnS} onClick={()=>setEditing(null)}>İptal</button>
    </div>
  </div>;

  return<div>
    {msg&&<div style={S.msg(msg.type)}>{msg.text}</div>}
    <div style={{...S.row,marginBottom:16}}><h3 style={{color:C.navy,margin:0,fontFamily:"'Cormorant Garamond',serif"}}>{title} ({items.length})</h3><button style={S.btnO} onClick={()=>setEditing({...emptyItem})}>+ Yeni</button></div>
    {items.length===0&&<p style={{color:'#888'}}>Henüz kayıt yok.</p>}
    {items.map(item=><div key={item.id} style={S.card}>
      <div style={S.row}>
        <div style={{flex:1}}>{renderCard?renderCard(item):<strong>{item.title||item.company_name||item.question||item.label||item.key}</strong>}</div>
        <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
          {item.hasOwnProperty('published')&&<span style={S.badge(item.published)}>{item.published?'Yayında':'Taslak'}</span>}
          {item.hasOwnProperty('is_active')&&item.hasOwnProperty('order_index')&&<span style={S.badge(item.is_active)}>{item.is_active?'Aktif':'Pasif'}</span>}
          <button style={S.btnP} onClick={()=>setEditing({...item})}>Düzenle</button>
          <button style={S.btnD} onClick={()=>remove(item.id)}>Sil</button>
        </div>
      </div>
    </div>)}
  </div>;
}

/* ══════════════════════════════════════════
   CONTACT MANAGER (special - single row)
   ══════════════════════════════════════════ */
function ContactManager() {
  const [c,setC]=useState(null);
  const [msg,setMsg]=useState(null);
  const [loading,setLoading]=useState(true);
  const load=useCallback(async()=>{
    try{const d=await adminFetch({action:'list',table:'contact_info'});if(d.length>0)setC(d[0]);}catch(e){setMsg({type:'error',text:e.message});}
    setLoading(false);
  },[]);
  useEffect(()=>{load();},[load]);
  const save=async()=>{try{await adminFetch({action:'update',table:'contact_info',id:c.id,data:c});setMsg({type:'success',text:'Güncellendi'});load();}catch(e){setMsg({type:'error',text:e.message});}};
  if(loading)return<p>Yükleniyor...</p>;
  if(!c)return<p>İletişim bilgisi bulunamadı.</p>;
  return<div>
    {msg&&<div style={S.msg(msg.type)}>{msg.text}</div>}
    <h3 style={{color:C.navy,marginBottom:14,fontFamily:"'Cormorant Garamond',serif"}}>İletişim Bilgileri</h3>
    <div style={S.card}>
      {[{k:'phone',l:'Telefon'},{k:'whatsapp',l:'WhatsApp (905...)'},{k:'email',l:'E-posta'},{k:'address',l:'Adres',ta:true},{k:'working_hours',l:'Çalışma Saatleri'},{k:'google_maps_url',l:'Google Maps URL'}].map(f=>
        <div key={f.k}><label style={S.label}>{f.l}</label>
        {f.ta?<textarea style={S.textarea} value={c[f.k]||''} onChange={e=>setC({...c,[f.k]:e.target.value})} rows={2}/>
        :<input style={S.input} value={c[f.k]||''} onChange={e=>setC({...c,[f.k]:e.target.value})}/>}
        </div>
      )}
      <button style={S.btnP} onClick={save}>Kaydet</button>
    </div>
  </div>;
}

/* ══════════════════════════════════════════
   ABOUT MANAGER (key-value pairs)
   ══════════════════════════════════════════ */
function AboutManager() {
  const [items,setItems]=useState([]);
  const [msg,setMsg]=useState(null);
  const [loading,setLoading]=useState(true);
  const labels={main_text:'Ana Metin',mission:'Misyon',vision:'Vizyon'};
  const load=useCallback(async()=>{
    try{const d=await adminFetch({action:'list',table:'about_content'});setItems(d);}catch(e){setMsg({type:'error',text:e.message});}
    setLoading(false);
  },[]);
  useEffect(()=>{load();},[load]);
  const save=async(item)=>{try{await adminFetch({action:'update',table:'about_content',id:item.id,data:{value:item.value}});setMsg({type:'success',text:'Güncellendi'});load();}catch(e){setMsg({type:'error',text:e.message});}};

  if(loading)return<p>Yükleniyor...</p>;
  return<div>
    {msg&&<div style={S.msg(msg.type)}>{msg.text}</div>}
    <h3 style={{color:C.navy,marginBottom:14,fontFamily:"'Cormorant Garamond',serif"}}>Hakkımızda İçeriği</h3>
    {items.map(item=><div key={item.id} style={S.card}>
      <label style={{...S.label,fontSize:13,fontWeight:700,color:C.navy}}>{labels[item.key]||item.key}</label>
      <textarea style={S.textarea} value={item.value} onChange={e=>{const n=[...items];const idx=n.findIndex(x=>x.id===item.id);n[idx]={...item,value:e.target.value};setItems(n);}} rows={item.key==='main_text'?6:3}/>
      <button style={S.btnP} onClick={()=>save(item)}>Kaydet</button>
    </div>)}
  </div>;
}

/* ══════════════════════════════════════════
   MAIN ADMIN PANEL
   ══════════════════════════════════════════ */
export default function AdminPanel() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [tab,setTab]=useState('slides');
  useEffect(()=>{
    const pw=sessionStorage.getItem('hst_admin_pw');
    if(pw){adminFetch({action:'login'}).then(()=>setLoggedIn(true)).catch(()=>sessionStorage.removeItem('hst_admin_pw'));}
  },[]);
  const logout=()=>{sessionStorage.removeItem('hst_admin_pw');setLoggedIn(false);};
  if(!loggedIn)return<LoginScreen onLogin={()=>setLoggedIn(true)}/>;

  const tabs=[
    {key:'slides',label:'Hero Slider'},
    {key:'blogs',label:'Blog'},
    {key:'services',label:'Hizmetler'},
    {key:'refs',label:'Referanslar'},
    {key:'faq',label:'SSS'},
    {key:'stats',label:'İstatistikler'},
    {key:'about',label:'Hakkımızda'},
    {key:'contact',label:'İletişim'},
  ];

  const slugify=(t)=>t.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  return<div style={S.container}>
    <div style={S.header}>
      <h1 style={S.title}>HST Admin Panel</h1>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <a href="/" target="_blank" style={{...S.btnS,textDecoration:'none',fontSize:12}}>Siteyi Gör ↗</a>
        <button style={{...S.btnS,color:C.orange,borderColor:C.orange}} onClick={logout}>Çıkış</button>
      </div>
    </div>

    <div style={S.tabs}>{tabs.map(t=><button key={t.key} style={S.tab(tab===t.key)} onClick={()=>setTab(t.key)}>{t.label}</button>)}</div>

    {tab==='slides'&&<CrudManager table="hero_slides" title="Slide" emptyItem={{title:'',subtitle:'',image_url:'',button_text:'',button_link:'',order_index:0,is_active:true}}
      fields={[{key:'title',label:'Başlık'},{key:'subtitle',label:'Alt Başlık',type:'textarea',rows:2},{key:'image_url',label:'Arka Plan Görseli',type:'image'},{key:'button_text',label:'Buton Metni'},{key:'button_link',label:'Buton Linki (örn: /teklif-hesapla)'},{key:'order_index',label:'Sıra',type:'number'},{key:'is_active',label:'Aktif',type:'checkbox'}]}
      renderCard={item=><div><strong>{item.title}</strong><div style={{fontSize:12,color:'#888',marginTop:2}}>Sıra: {item.order_index} · {item.button_text&&`Buton: ${item.button_text}`}</div></div>}
    />}

    {tab==='blogs'&&<CrudManager table="blogs" title="Blog Yazısı" emptyItem={{title:'',slug:'',content:'',excerpt:'',cover_image:'',published:false}}
      fields={[
        {key:'title',label:'Başlık'},
        {key:'slug',label:'Slug (URL) — otomatik oluşur'},
        {key:'excerpt',label:'Özet'},
        {key:'cover_image',label:'Kapak Görseli',type:'image'},
        {key:'content',label:'İçerik',type:'textarea',rows:12},
        {key:'published',label:'Yayınla',type:'checkbox'}
      ]}
      renderCard={item=><div><strong>{item.title}</strong><div style={{fontSize:12,color:'#888',marginTop:2}}>/blog/{item.slug}</div></div>}
    />}

    {tab==='services'&&<CrudManager table="services" title="Hizmet" emptyItem={{title:'',description:'',icon:'',category:'',price_info:'',order_index:0,is_active:true}}
      fields={[{key:'title',label:'Hizmet Adı'},{key:'description',label:'Açıklama',type:'textarea',rows:4},{key:'icon',label:'İkon (emoji)'},{key:'category',label:'Kategori'},{key:'price_info',label:'Fiyat Bilgisi'},{key:'order_index',label:'Sıra',type:'number'},{key:'is_active',label:'Aktif',type:'checkbox'}]}
      renderCard={item=><div><strong>{item.icon} {item.title}</strong>{item.category&&<span style={{fontSize:12,color:'#888'}}> · {item.category}</span>}</div>}
    />}

    {tab==='refs'&&<CrudManager table="client_references" title="Referans" emptyItem={{company_name:'',description:'',service_type:'',location:'',image_url:'',order_index:0,is_active:true}}
      fields={[{key:'company_name',label:'Firma Adı'},{key:'description',label:'Açıklama',type:'textarea',rows:2},{key:'service_type',label:'Hizmet Türü'},{key:'location',label:'Konum'},{key:'image_url',label:'Firma Logosu',type:'image'},{key:'order_index',label:'Sıra',type:'number'},{key:'is_active',label:'Aktif',type:'checkbox'}]}
      renderCard={item=><div style={{display:'flex',alignItems:'center',gap:10}}>
        {item.image_url&&<img src={item.image_url} alt="" style={{height:30,objectFit:'contain'}}/>}
        <div><strong>{item.company_name}</strong>{item.location&&<span style={{fontSize:12,color:'#888'}}> · {item.location}</span>}</div>
      </div>}
    />}

    {tab==='faq'&&<CrudManager table="faq_items" title="SSS" emptyItem={{question:'',answer:'',order_index:0,is_active:true}}
      fields={[{key:'question',label:'Soru'},{key:'answer',label:'Cevap',type:'textarea',rows:4},{key:'order_index',label:'Sıra',type:'number'},{key:'is_active',label:'Aktif',type:'checkbox'}]}
      renderCard={item=><div><strong>{item.question}</strong><div style={{fontSize:12,color:'#888',marginTop:2}}>{item.answer?.substring(0,80)}...</div></div>}
    />}

    {tab==='stats'&&<CrudManager table="site_stats" title="İstatistik" emptyItem={{label:'',value:'',order_index:0,is_active:true}}
      fields={[{key:'value',label:'Değer (örn: 500+, 81, %100)'},{key:'label',label:'Etiket (örn: Proje, İl, Yıl Deneyim)'},{key:'order_index',label:'Sıra',type:'number'},{key:'is_active',label:'Aktif',type:'checkbox'}]}
      renderCard={item=><div><strong style={{color:C.orange,fontSize:18}}>{item.value}</strong> <span style={{fontSize:13}}>{item.label}</span></div>}
    />}

    {tab==='about'&&<AboutManager/>}
    {tab==='contact'&&<ContactManager/>}
  </div>;
}
