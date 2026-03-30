import { useEffect, useMemo, useState } from "react";

const C = {
  navy: "#0F2B4C",
  orange: "#C75B12",
  cream: "#faf9f6",
  gray: "#6b7280",
  border: "#e5e2dc",
};

const API_URL = "/api/admin";

const TAB_ORDER = [
  "hero_slides",
  "blogs",
  "services",
  "client_references",
  "faq_items",
  "site_stats",
  "about_content",
  "contact_info",
  "city_pages",
  "city_service_pages",
];

const TAB_LABELS = {
  hero_slides: "Hero Slider",
  blogs: "Blog",
  services: "Hizmetler",
  client_references: "Referanslar",
  faq_items: "SSS",
  site_stats: "İstatistikler",
  about_content: "Hakkımızda",
  contact_info: "İletişim",
  city_pages: "İl SEO",
  city_service_pages: "İl + Hizmet SEO",
};

const EMPTY_FORMS = {
  hero_slides: { title: "", subtitle: "", image_url: "", button_text: "", button_link: "", order_index: 0, is_active: true },
  blogs: { title: "", slug: "", excerpt: "", cover_image: "", content: "", author: "HST Periyodik", published: true },
  services: { title: "", description: "", icon: "", category: "", price_info: "", order_index: 0, is_active: true },
  client_references: { company_name: "", description: "", service_type: "", location: "", image_url: "", order_index: 0, is_active: true },
  faq_items: { question: "", answer: "", order_index: 0, is_active: true },
  site_stats: { label: "", value: "", order_index: 0, is_active: true },
  city_pages: {
    city_name: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    hero_title: "",
    hero_subtitle: "",
    content: "",
    services_intro: "",
    cta_text: "Hemen Teklif Alın",
    image_url: "",
    order_index: 0,
    is_active: true,
  },
  city_service_pages: {
    city_name: "",
    city_slug: "",
    service_key: "",
    service_name: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    hero_title: "",
    hero_subtitle: "",
    content: "",
    cta_text: "Hemen Teklif Alın",
    image_url: "",
    order_index: 0,
    is_active: true,
  },
};

function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function adminPost(password, body) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "İşlem başarısız");
  return json;
}

async function fileToBase64(file) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.slice(i, i + chunk));
  }
  return btoa(binary);
}

function Field({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{label}</div>
      {children}
      {hint ? <div style={{ fontSize: 12, color: C.gray, marginTop: 4 }}>{hint}</div> : null}
    </div>
  );
}

function TextInput(props) {
  return <input {...props} style={{ width: "100%", padding: "12px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none", ...props.style }} />;
}

function TextArea(props) {
  return <textarea {...props} style={{ width: "100%", padding: "12px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", ...props.style }} />;
}

function CheckBox({ checked, onChange, label }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: C.navy, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function UploadField({ value, onChange, password, onUploaded }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileData = await fileToBase64(file);
      const json = await adminPost(password, {
        action: "upload_image",
        fileName: file.name,
        fileData,
        contentType: file.type || "application/octet-stream",
      });
      onChange(json.url);
      if (onUploaded) onUploaded(json.url);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
        <TextInput value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="URL yapıştır veya dosya yükle" />
        <label style={{ background: C.orange, color: "#fff", borderRadius: 8, padding: "11px 16px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
          {uploading ? "Yükleniyor..." : "Yükle"}
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
        </label>
      </div>
      {value ? <img src={value} alt="Önizleme" style={{ marginTop: 10, maxWidth: 220, borderRadius: 8, border: `1px solid ${C.border}` }} /> : null}
    </div>
  );
}

function LoginScreen({ password, setPassword, onLogin, busy }) {
  return (
    <div style={{ minHeight: "100vh", background: C.cream, display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
        <h1 style={{ color: C.navy, marginTop: 0, marginBottom: 10 }}>HST Admin Panel</h1>
        <p style={{ color: C.gray, lineHeight: 1.6, marginBottom: 18 }}>Yönetim paneline erişmek için şifreyi girin.</p>
        <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin şifresi" />
        <button onClick={onLogin} disabled={busy} style={{ marginTop: 12, width: "100%", background: C.orange, color: "#fff", border: 0, borderRadius: 10, padding: "12px 16px", fontWeight: 700, cursor: "pointer" }}>
          {busy ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </div>
    </div>
  );
}

function BlogEditor({ form, setForm, password }) {
  return (
    <>
      <Field label="Başlık">
        <TextInput value={form.title} onChange={(e) => {
          const title = e.target.value;
          setForm((p) => ({ ...p, title, slug: p.slug && p.slug !== slugify(p.title) ? p.slug : slugify(title) }));
        }} />
      </Field>
      <Field label="Slug (URL)" hint="Başlığa göre otomatik oluşturulur, istersen elle de değiştirebilirsin.">
        <TextInput value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))} />
      </Field>
      <Field label="Özet">
        <TextArea rows={3} value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} />
      </Field>
      <Field label="Kapak Görseli">
        <UploadField value={form.cover_image} onChange={(url) => setForm((p) => ({ ...p, cover_image: url }))} password={password} />
      </Field>
      <Field label="İçerik">
        <TextArea rows={16} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Yazar">
          <TextInput value={form.author || ""} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} />
        </Field>
        <Field label="Durum">
          <div style={{ paddingTop: 12 }}><CheckBox checked={!!form.published} onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))} label="Yayınla" /></div>
        </Field>
      </div>
    </>
  );
}

function CityEditor({ form, setForm, password }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="İl Adı">
          <TextInput value={form.city_name} onChange={(e) => {
            const city_name = e.target.value;
            setForm((p) => ({
              ...p,
              city_name,
              slug: p.slug && p.slug !== slugify(p.city_name) ? p.slug : slugify(city_name),
              hero_title: p.hero_title || `${city_name} Periyodik Kontrol Hizmetleri`,
            }));
          }} />
        </Field>
        <Field label="Slug">
          <TextInput value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))} />
        </Field>
      </div>
      <Field label="Meta Title">
        <TextInput value={form.meta_title} onChange={(e) => setForm((p) => ({ ...p, meta_title: e.target.value }))} placeholder="Ankara Periyodik Kontrol Hizmetleri | HST Periyodik" />
      </Field>
      <Field label="Meta Description">
        <TextArea rows={3} value={form.meta_description} onChange={(e) => setForm((p) => ({ ...p, meta_description: e.target.value }))} />
      </Field>
      <Field label="Hero Başlık">
        <TextInput value={form.hero_title} onChange={(e) => setForm((p) => ({ ...p, hero_title: e.target.value }))} />
      </Field>
      <Field label="Hero Alt Başlık">
        <TextArea rows={3} value={form.hero_subtitle} onChange={(e) => setForm((p) => ({ ...p, hero_subtitle: e.target.value }))} />
      </Field>
      <Field label="Ana İçerik" hint="Şehir sayfasının ana SEO metni burada yer alır.">
        <TextArea rows={14} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} />
      </Field>
      <Field label="Hizmetler Giriş Başlığı">
        <TextInput value={form.services_intro} onChange={(e) => setForm((p) => ({ ...p, services_intro: e.target.value }))} placeholder="Ankara'da sunduğumuz hizmetler:" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="CTA Buton Metni">
          <TextInput value={form.cta_text} onChange={(e) => setForm((p) => ({ ...p, cta_text: e.target.value }))} />
        </Field>
        <Field label="Sıralama">
          <TextInput type="number" value={form.order_index ?? 0} onChange={(e) => setForm((p) => ({ ...p, order_index: Number(e.target.value || 0) }))} />
        </Field>
      </div>
      <Field label="Kapak Görseli / Hero Görseli">
        <UploadField value={form.image_url} onChange={(url) => setForm((p) => ({ ...p, image_url: url }))} password={password} />
      </Field>
      <CheckBox checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} label="Sayfa aktif" />
    </>
  );
}


function CityServiceEditor({ form, setForm, password }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="İl Adı">
          <TextInput value={form.city_name} onChange={(e) => {
            const city_name = e.target.value;
            setForm((p) => ({ ...p, city_name, city_slug: p.city_slug && p.city_slug !== slugify(p.city_name) ? p.city_slug : slugify(city_name) }));
          }} />
        </Field>
        <Field label="İl Slug">
          <TextInput value={form.city_slug} onChange={(e) => setForm((p) => ({ ...p, city_slug: slugify(e.target.value) }))} />
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Hizmet Adı">
          <TextInput value={form.service_name} onChange={(e) => {
            const service_name = e.target.value;
            setForm((p) => ({ ...p, service_name, hero_title: p.hero_title || `${p.city_name || ''} ${service_name}`.trim() }));
          }} />
        </Field>
        <Field label="Hizmet Key">
          <TextInput value={form.service_key} onChange={(e) => setForm((p) => ({ ...p, service_key: slugify(e.target.value) }))} hint="Örn: raf-statik-analizi" />
        </Field>
      </div>
      <Field label="Slug">
        <TextInput value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))} placeholder="ankara-raf-statik-analizi" />
      </Field>
      <Field label="Meta Title"><TextInput value={form.meta_title} onChange={(e) => setForm((p) => ({ ...p, meta_title: e.target.value }))} /></Field>
      <Field label="Meta Description"><TextArea rows={3} value={form.meta_description} onChange={(e) => setForm((p) => ({ ...p, meta_description: e.target.value }))} /></Field>
      <Field label="Hero Başlık"><TextInput value={form.hero_title} onChange={(e) => setForm((p) => ({ ...p, hero_title: e.target.value }))} /></Field>
      <Field label="Hero Alt Başlık"><TextArea rows={3} value={form.hero_subtitle} onChange={(e) => setForm((p) => ({ ...p, hero_subtitle: e.target.value }))} /></Field>
      <Field label="Ana İçerik"><TextArea rows={14} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="CTA Buton Metni"><TextInput value={form.cta_text} onChange={(e) => setForm((p) => ({ ...p, cta_text: e.target.value }))} /></Field>
        <Field label="Sıralama"><TextInput type="number" value={form.order_index ?? 0} onChange={(e) => setForm((p) => ({ ...p, order_index: Number(e.target.value || 0) }))} /></Field>
      </div>
      <Field label="Kapak Görseli / Hero Görseli"><UploadField value={form.image_url} onChange={(url) => setForm((p) => ({ ...p, image_url: url }))} password={password} /></Field>
      <CheckBox checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} label="Sayfa aktif" />
    </>
  );
}

function SimpleEditor({ tab, form, setForm, password }) {
  if (tab === "blogs") return <BlogEditor form={form} setForm={setForm} password={password} />;
  if (tab === "city_pages") return <CityEditor form={form} setForm={setForm} password={password} />;
  if (tab === "city_service_pages") return <CityServiceEditor form={form} setForm={setForm} password={password} />;

  if (tab === "hero_slides") {
    return (
      <>
        <Field label="Başlık"><TextInput value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></Field>
        <Field label="Alt Başlık"><TextArea rows={3} value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} /></Field>
        <Field label="Görsel"><UploadField value={form.image_url} onChange={(url) => setForm((p) => ({ ...p, image_url: url }))} password={password} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Buton Metni"><TextInput value={form.button_text} onChange={(e) => setForm((p) => ({ ...p, button_text: e.target.value }))} /></Field>
          <Field label="Buton Linki"><TextInput value={form.button_link} onChange={(e) => setForm((p) => ({ ...p, button_link: e.target.value }))} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
          <Field label="Sıralama"><TextInput type="number" value={form.order_index ?? 0} onChange={(e) => setForm((p) => ({ ...p, order_index: Number(e.target.value || 0) }))} /></Field>
          <div style={{ paddingTop: 28 }}><CheckBox checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} label="Aktif" /></div>
        </div>
      </>
    );
  }

  if (tab === "services") {
    return (
      <>
        <Field label="Başlık"><TextInput value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} /></Field>
        <Field label="Açıklama"><TextArea rows={5} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label="İkon"><TextInput value={form.icon || ""} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} /></Field>
          <Field label="Kategori"><TextInput value={form.category || ""} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} /></Field>
          <Field label="Fiyat Bilgisi"><TextInput value={form.price_info || ""} onChange={(e) => setForm((p) => ({ ...p, price_info: e.target.value }))} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
          <Field label="Sıralama"><TextInput type="number" value={form.order_index ?? 0} onChange={(e) => setForm((p) => ({ ...p, order_index: Number(e.target.value || 0) }))} /></Field>
          <div style={{ paddingTop: 28 }}><CheckBox checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} label="Aktif" /></div>
        </div>
      </>
    );
  }

  if (tab === "client_references") {
    return (
      <>
        <Field label="Firma Adı"><TextInput value={form.company_name} onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))} /></Field>
        <Field label="Açıklama"><TextArea rows={4} value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Hizmet Tipi"><TextInput value={form.service_type || ""} onChange={(e) => setForm((p) => ({ ...p, service_type: e.target.value }))} /></Field>
          <Field label="Konum"><TextInput value={form.location || ""} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} /></Field>
        </div>
        <Field label="Logo"><UploadField value={form.image_url} onChange={(url) => setForm((p) => ({ ...p, image_url: url }))} password={password} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
          <Field label="Sıralama"><TextInput type="number" value={form.order_index ?? 0} onChange={(e) => setForm((p) => ({ ...p, order_index: Number(e.target.value || 0) }))} /></Field>
          <div style={{ paddingTop: 28 }}><CheckBox checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} label="Aktif" /></div>
        </div>
      </>
    );
  }

  if (tab === "faq_items") {
    return (
      <>
        <Field label="Soru"><TextInput value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} /></Field>
        <Field label="Cevap"><TextArea rows={5} value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
          <Field label="Sıralama"><TextInput type="number" value={form.order_index ?? 0} onChange={(e) => setForm((p) => ({ ...p, order_index: Number(e.target.value || 0) }))} /></Field>
          <div style={{ paddingTop: 28 }}><CheckBox checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} label="Aktif" /></div>
        </div>
      </>
    );
  }

  if (tab === "site_stats") {
    return (
      <>
        <Field label="Etiket"><TextInput value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} /></Field>
        <Field label="Değer"><TextInput value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
          <Field label="Sıralama"><TextInput type="number" value={form.order_index ?? 0} onChange={(e) => setForm((p) => ({ ...p, order_index: Number(e.target.value || 0) }))} /></Field>
          <div style={{ paddingTop: 28 }}><CheckBox checked={!!form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} label="Aktif" /></div>
        </div>
      </>
    );
  }

  return null;
}

export default function AdminPanel() {
  const [password, setPassword] = useState(sessionStorage.getItem("admin_password") || "");
  const [authorized, setAuthorized] = useState(!!sessionStorage.getItem("admin_password"));
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("hero_slides");
  const [rowsByTab, setRowsByTab] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORMS.hero_slides);
  const [loading, setLoading] = useState(false);

  const rows = rowsByTab[tab] || [];

  const selectedRow = useMemo(() => rows.find((r) => r.id === selectedId) || null, [rows, selectedId]);

  useEffect(() => {
    if (!authorized) return;
    loadTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized, tab]);

  useEffect(() => {
    if (selectedRow && tab !== "about_content" && tab !== "contact_info") {
      setForm({ ...selectedRow });
    }
  }, [selectedRow, tab]);

  async function loadTab(currentTab) {
    setLoading(true);
    try {
      const rows = await adminPost(password, { action: "list", table: currentTab });
      setRowsByTab((prev) => ({ ...prev, [currentTab]: rows }));

      if (currentTab === "contact_info") {
        const row = rows?.[0] || { phone: "", whatsapp: "", email: "", address: "", working_hours: "", google_maps_url: "" };
        setSelectedId(row.id || null);
        setForm(row);
      } else if (currentTab === "about_content") {
        const map = Object.fromEntries((rows || []).map((r) => [r.key, r]));
        setForm({
          main_text: map.main_text?.value || "",
          mission: map.mission?.value || "",
          vision: map.vision?.value || "",
        });
      } else if (rows?.length) {
        setSelectedId(rows[0].id);
        setForm({ ...rows[0] });
      } else {
        setSelectedId(null);
        setForm({ ...(EMPTY_FORMS[currentTab] || {}) });
      }
    } catch (err) {
      alert(err.message);
      if (/Yetkisiz/.test(err.message)) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    setBusy(true);
    try {
      await adminPost(password, { action: "login" });
      sessionStorage.setItem("admin_password", password);
      setAuthorized(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_password");
    setAuthorized(false);
    setPassword("");
  }

  function startCreate() {
    setSelectedId(null);
    if (tab === "about_content") return;
    if (tab === "contact_info") return;
    setForm({ ...(EMPTY_FORMS[tab] || {}) });
  }

  async function save() {
    setBusy(true);
    try {
      if (tab === "about_content") {
        const currentRows = rowsByTab.about_content || [];
        const map = Object.fromEntries(currentRows.map((r) => [r.key, r]));
        const payloads = [
          ["main_text", form.main_text],
          ["mission", form.mission],
          ["vision", form.vision],
        ];
        for (const [key, value] of payloads) {
          if (map[key]?.id) {
            await adminPost(password, { action: "update", table: "about_content", id: map[key].id, data: { value } });
          } else {
            await adminPost(password, { action: "create", table: "about_content", data: { key, value } });
          }
        }
        await loadTab("about_content");
        alert("Hakkımızda alanı kaydedildi.");
        return;
      }

      if (tab === "contact_info") {
        if (selectedId) {
          await adminPost(password, { action: "update", table: "contact_info", id: selectedId, data: form });
        } else {
          await adminPost(password, { action: "create", table: "contact_info", data: form });
        }
        await loadTab("contact_info");
        alert("İletişim bilgileri kaydedildi.");
        return;
      }

      if (selectedId) {
        await adminPost(password, { action: "update", table: tab, id: selectedId, data: form });
      } else {
        await adminPost(password, { action: "create", table: tab, data: form });
      }
      await loadTab(tab);
      alert("Kaydedildi.");
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeRow(id) {
    if (!window.confirm("Bu kaydı silmek istediğine emin misin?")) return;
    setBusy(true);
    try {
      await adminPost(password, { action: "delete", table: tab, id });
      await loadTab(tab);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!authorized) {
    return <LoginScreen password={password} setPassword={setPassword} onLogin={login} busy={busy} />;
  }

  return (
    <div style={{ background: C.cream, minHeight: "100vh", padding: "24px 28px 40px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, borderBottom: `2px solid ${C.navy}`, paddingBottom: 16, marginBottom: 22 }}>
          <h1 style={{ color: C.navy, margin: 0, fontSize: 28 }}>HST Admin Panel</h1>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="/" target="_blank" rel="noreferrer" style={{ border: `1px solid ${C.border}`, padding: "10px 16px", borderRadius: 8, color: C.navy, textDecoration: "none", fontSize: 14 }}>Siteyi Gör ↗</a>
            <button onClick={logout} style={{ border: `1px solid ${C.orange}`, padding: "10px 16px", borderRadius: 8, color: C.orange, background: "#fff", cursor: "pointer" }}>Çıkış</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
          {TAB_ORDER.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: "transparent",
                border: 0,
                borderBottom: tab === t ? `3px solid ${C.navy}` : "3px solid transparent",
                color: tab === t ? C.navy : C.gray,
                padding: "10px 18px",
                cursor: "pointer",
                fontWeight: tab === t ? 700 : 500,
                whiteSpace: "nowrap",
              }}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {tab === "about_content" ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <Field label="Ana Metin"><TextArea rows={8} value={form.main_text || ""} onChange={(e) => setForm((p) => ({ ...p, main_text: e.target.value }))} /></Field>
              <button onClick={save} disabled={busy} style={{ background: C.navy, color: "#fff", border: 0, borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontWeight: 700 }}>Kaydet</button>
            </div>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <Field label="Misyon"><TextArea rows={5} value={form.mission || ""} onChange={(e) => setForm((p) => ({ ...p, mission: e.target.value }))} /></Field>
              <button onClick={save} disabled={busy} style={{ background: C.navy, color: "#fff", border: 0, borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontWeight: 700 }}>Kaydet</button>
            </div>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <Field label="Vizyon"><TextArea rows={5} value={form.vision || ""} onChange={(e) => setForm((p) => ({ ...p, vision: e.target.value }))} /></Field>
              <button onClick={save} disabled={busy} style={{ background: C.navy, color: "#fff", border: 0, borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontWeight: 700 }}>Kaydet</button>
            </div>
          </div>
        ) : tab === "contact_info" ? (
          <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Telefon"><TextInput value={form.phone || ""} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></Field>
              <Field label="WhatsApp"><TextInput value={form.whatsapp || ""} onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))} /></Field>
            </div>
            <Field label="E-posta"><TextInput value={form.email || ""} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></Field>
            <Field label="Adres"><TextArea rows={4} value={form.address || ""} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} /></Field>
            <Field label="Çalışma Saatleri"><TextInput value={form.working_hours || ""} onChange={(e) => setForm((p) => ({ ...p, working_hours: e.target.value }))} /></Field>
            <Field label="Google Maps URL"><TextInput value={form.google_maps_url || ""} onChange={(e) => setForm((p) => ({ ...p, google_maps_url: e.target.value }))} /></Field>
            <button onClick={save} disabled={busy} style={{ background: C.navy, color: "#fff", border: 0, borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontWeight: 700 }}>Kaydet</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 18 }}>
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", minHeight: 560 }}>
              <div style={{ padding: 16, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: C.navy }}>{TAB_LABELS[tab]}</strong>
                <button onClick={startCreate} style={{ border: `1px solid ${C.orange}`, background: "#fff", color: C.orange, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontWeight: 700 }}>Yeni</button>
              </div>
              <div style={{ maxHeight: 680, overflow: "auto" }}>
                {loading ? <div style={{ padding: 16, color: C.gray }}>Yükleniyor...</div> : null}
                {!loading && rows.length === 0 ? <div style={{ padding: 16, color: C.gray }}>Kayıt bulunamadı.</div> : null}
                {rows.map((row) => {
                  const title = row.title || row.city_name || row.company_name || row.question || row.label || row.slug || row.id;
                  const sub = row.slug || row.email || row.service_type || row.value || row.created_at;
                  return (
                    <button
                      key={row.id}
                      onClick={() => { setSelectedId(row.id); setForm({ ...row }); }}
                      style={{ width: "100%", textAlign: "left", padding: 14, border: 0, borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: selectedId === row.id ? "#fff8f2" : "#fff" }}
                    >
                      <div style={{ fontWeight: 700, color: C.navy, fontSize: 14 }}>{title}</div>
                      {sub ? <div style={{ color: C.gray, fontSize: 12, marginTop: 4 }}>{String(sub)}</div> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ margin: 0, color: C.navy, fontSize: 24 }}>{selectedId ? "Kaydı Düzenle" : `Yeni ${TAB_LABELS[tab]}`}</h2>
                {selectedId ? (
                  <button onClick={() => removeRow(selectedId)} disabled={busy} style={{ border: "1px solid #d9534f", color: "#d9534f", background: "#fff", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontWeight: 700 }}>Sil</button>
                ) : null}
              </div>
              <SimpleEditor tab={tab} form={form} setForm={setForm} password={password} />
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button onClick={save} disabled={busy} style={{ background: C.navy, color: "#fff", border: 0, borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontWeight: 700 }}>Kaydet</button>
                <button onClick={() => { if (selectedRow) setForm({ ...selectedRow }); else setForm({ ...(EMPTY_FORMS[tab] || {}) }); }} style={{ background: "#fff", color: C.gray, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px", cursor: "pointer" }}>İptal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
