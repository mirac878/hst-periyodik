import { useState, useEffect, useRef } from "react";

const translations = {
  tr: {
    nav: {
      home: "Ana Sayfa",
      services: "Hizmetlerimiz",
      about: "Hakkımızda",
      contact: "İletişim",
    },
    hero: {
      badge: "Mühendislik & Periyodik Kontrol",
      title1: "Güvenliğiniz",
      title2: "Bizim İşimiz.",
      subtitle:
        "Endüstriyel tesislerinizin periyodik kontrol, statik analiz, ortam ölçümü ve patlamadan korunma hizmetlerinde güvenilir çözüm ortağınız.",
      cta: "Hizmetlerimizi İnceleyin",
      ctaContact: "Bize Ulaşın",
    },
    stats: [
      { value: "500+", label: "Tamamlanan Proje" },
      { value: "20+", label: "Yıllık Deneyim" },
      { value: "81", label: "İl Genelinde Hizmet" },
      { value: "%100", label: "Müşteri Memnuniyeti" },
    ],
    services: {
      title: "Hizmetlerimiz",
      subtitle: "Endüstriyel güvenliğiniz için kapsamlı mühendislik çözümleri sunuyoruz.",
      items: [
        {
          icon: "🔩",
          title: "Raf Periyodik Kontrol",
          desc: "Depo ve endüstriyel raf sistemlerinin mevzuata uygun periyodik kontrol ve muayeneleri. Raf stabilitesi, bağlantı elemanları, zemin ankrajları ve yük kapasitelerinin detaylı incelenmesi.",
          tags: ["TS EN 15635", "6331 Sayılı Kanun", "Yıllık Muayene"],
        },
        {
          icon: "📐",
          title: "Statik Analiz Raporu",
          desc: "SAP2000 tabanlı yapısal analiz ile raf sistemlerinin taşıma kapasitelerinin hesaplanması. Mevcut yükleme koşullarına göre güvenlik faktörlerinin belirlenmesi ve raporlanması.",
          tags: ["SAP2000", "Eurocode 3", "FEM 10.2.02"],
        },
        {
          icon: "🌡️",
          title: "Ortam Ölçümü",
          desc: "İşyeri ortamında gürültü, aydınlatma, termal konfor, toz ve kimyasal maruziyet ölçümleri. İş sağlığı ve güvenliği mevzuatına uygun akredite ölçüm hizmetleri.",
          tags: ["İSG Mevzuatı", "Akredite Ölçüm", "Maruziyet Analizi"],
        },
        {
          icon: "⚠️",
          title: "Patlamadan Korunma Dokümanı",
          desc: "ATEX direktiflerine uygun patlayıcı ortam risk değerlendirmesi, zone sınıflandırması ve patlamadan korunma dokümanı hazırlanması.",
          tags: ["ATEX", "Zone Sınıflandırma", "Risk Değerlendirme"],
        },
      ],
    },
    about: {
      title: "Neden HST Periyodik?",
      subtitle: "Teknik uzmanlık ve güvenilirlik bir arada.",
      features: [
        {
          icon: "✓",
          title: "Uzman Mühendis Kadrosu",
          desc: "Alanında deneyimli inşaat mühendisleri ile profesyonel hizmet.",
        },
        {
          icon: "✓",
          title: "Hızlı Raporlama",
          desc: "Kontrol ve analizlerinizi en kısa sürede tamamlayıp rapor teslimi.",
        },
        {
          icon: "✓",
          title: "Türkiye Geneli Hizmet",
          desc: "Kastamonu merkezli, tüm Türkiye'ye uzaktan ve yerinde hizmet.",
        },
        {
          icon: "✓",
          title: "Mevzuata Tam Uyum",
          desc: "6331 sayılı İSG Kanunu ve ilgili yönetmeliklere uygun raporlama.",
        },
      ],
    },
    contact: {
      title: "İletişim",
      subtitle: "Projeleriniz için bizimle iletişime geçin.",
      phone: "Telefon",
      email: "E-posta",
      whatsapp: "WhatsApp",
      address: "Adres",
      addressText: "Kastamonu, Türkiye",
      formName: "Adınız Soyadınız",
      formEmail: "E-posta Adresiniz",
      formMessage: "Mesajınız",
      formSend: "Mesaj Gönder",
    },
    footer: {
      rights: "Tüm hakları saklıdır.",
      tagline: "Mühendislik & Periyodik Kontrol Hizmetleri",
    },
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      about: "About",
      contact: "Contact",
    },
    hero: {
      badge: "Engineering & Periodic Inspection",
      title1: "Your Safety",
      title2: "Is Our Business.",
      subtitle:
        "Your reliable partner for periodic inspection, structural analysis, environmental measurement, and explosion protection services in industrial facilities.",
      cta: "Explore Services",
      ctaContact: "Contact Us",
    },
    stats: [
      { value: "500+", label: "Completed Projects" },
      { value: "20+", label: "Years of Experience" },
      { value: "81", label: "Provinces Covered" },
      { value: "100%", label: "Client Satisfaction" },
    ],
    services: {
      title: "Our Services",
      subtitle: "Comprehensive engineering solutions for your industrial safety.",
      items: [
        {
          icon: "🔩",
          title: "Rack Periodic Inspection",
          desc: "Periodic control and inspection of warehouse and industrial racking systems in compliance with regulations. Detailed examination of rack stability, connectors, floor anchors, and load capacities.",
          tags: ["EN 15635", "Occupational Safety", "Annual Inspection"],
        },
        {
          icon: "📐",
          title: "Structural Analysis Report",
          desc: "SAP2000-based structural analysis for calculating load-bearing capacities of racking systems. Determination and reporting of safety factors under current loading conditions.",
          tags: ["SAP2000", "Eurocode 3", "FEM 10.2.02"],
        },
        {
          icon: "🌡️",
          title: "Environmental Measurement",
          desc: "Workplace noise, lighting, thermal comfort, dust, and chemical exposure measurements. Accredited measurement services in compliance with occupational health and safety regulations.",
          tags: ["OHS Regulations", "Accredited", "Exposure Analysis"],
        },
        {
          icon: "⚠️",
          title: "Explosion Protection Document",
          desc: "ATEX-compliant explosive atmosphere risk assessment, zone classification, and explosion protection document preparation.",
          tags: ["ATEX", "Zone Classification", "Risk Assessment"],
        },
      ],
    },
    about: {
      title: "Why HST Periyodik?",
      subtitle: "Technical expertise combined with reliability.",
      features: [
        {
          icon: "✓",
          title: "Expert Engineering Team",
          desc: "Professional service with experienced civil engineers.",
        },
        {
          icon: "✓",
          title: "Fast Reporting",
          desc: "Complete inspections and deliver reports in the shortest time.",
        },
        {
          icon: "✓",
          title: "Nationwide Service",
          desc: "Based in Kastamonu, serving all of Turkey remotely and on-site.",
        },
        {
          icon: "✓",
          title: "Full Regulatory Compliance",
          desc: "Reporting in compliance with OHS Law No. 6331 and related regulations.",
        },
      ],
    },
    contact: {
      title: "Contact",
      subtitle: "Get in touch with us for your projects.",
      phone: "Phone",
      email: "Email",
      whatsapp: "WhatsApp",
      address: "Address",
      addressText: "Kastamonu, Turkey",
      formName: "Your Full Name",
      formEmail: "Your Email Address",
      formMessage: "Your Message",
      formSend: "Send Message",
    },
    footer: {
      rights: "All rights reserved.",
      tagline: "Engineering & Periodic Inspection Services",
    },
  },
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function App() {
  const [lang, setLang] = useState("tr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0A0E17", color: "#E8ECF4", minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        
        .nav-fixed {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-scrolled {
          background: rgba(10, 14, 23, 0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 140, 50, 0.1);
        }
        .nav-top { background: transparent; }
        
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 32px;
          transition: padding 0.4s;
        }
        .nav-scrolled .nav-inner { padding: 14px 32px; }
        
        .logo-text {
          font-family: 'Space Mono', monospace;
          font-weight: 700; font-size: 22px;
          color: #FF8C32;
          letter-spacing: 2px;
        }
        .logo-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; color: #8892A8;
          letter-spacing: 4px; text-transform: uppercase;
          margin-top: 2px;
        }
        
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-link {
          color: #8892A8; text-decoration: none; font-size: 14px;
          font-weight: 500; letter-spacing: 0.5px;
          transition: color 0.3s; cursor: pointer;
          background: none; border: none; font-family: inherit;
        }
        .nav-link:hover { color: #FF8C32; }
        
        .lang-btn {
          background: rgba(255, 140, 50, 0.1);
          border: 1px solid rgba(255, 140, 50, 0.3);
          color: #FF8C32; padding: 6px 14px;
          border-radius: 6px; font-size: 12px;
          font-weight: 700; cursor: pointer;
          letter-spacing: 1px;
          transition: all 0.3s;
          font-family: 'Space Mono', monospace;
        }
        .lang-btn:hover {
          background: rgba(255, 140, 50, 0.2);
          border-color: #FF8C32;
        }
        
        .hamburger {
          display: none; background: none; border: none;
          cursor: pointer; padding: 8px;
        }
        .hamburger span {
          display: block; width: 24px; height: 2px;
          background: #FF8C32; margin: 5px 0;
          transition: all 0.3s;
        }
        
        .mobile-menu {
          display: none;
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10, 14, 23, 0.98);
          backdrop-filter: blur(20px);
          z-index: 999;
          flex-direction: column;
          align-items: center; justify-content: center; gap: 32px;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu button {
          color: #E8ECF4; background: none; border: none;
          font-size: 24px; font-family: 'DM Sans', sans-serif;
          font-weight: 500; cursor: pointer;
          transition: color 0.3s;
        }
        .mobile-menu button:hover { color: #FF8C32; }
        .mobile-close {
          position: absolute; top: 24px; right: 32px;
          font-size: 32px !important; color: #FF8C32 !important;
        }
        
        .hero {
          min-height: 100vh;
          display: flex; align-items: center;
          position: relative;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: 
            radial-gradient(ellipse 80% 60% at 70% 20%, rgba(255, 140, 50, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(30, 60, 120, 0.12) 0%, transparent 60%),
            linear-gradient(180deg, #0A0E17 0%, #0D1220 100%);
        }
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255, 140, 50, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 140, 50, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent);
        }
        .hero-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 140px 32px 80px;
          position: relative; z-index: 1;
        }
        .hero-badge {
          display: inline-block;
          font-family: 'Space Mono', monospace;
          font-size: 11px; letter-spacing: 3px;
          text-transform: uppercase;
          color: #FF8C32;
          background: rgba(255, 140, 50, 0.08);
          border: 1px solid rgba(255, 140, 50, 0.2);
          padding: 8px 20px;
          border-radius: 4px;
          margin-bottom: 32px;
          animation: fadeInUp 0.8s ease both;
        }
        .hero h1 {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(42px, 7vw, 80px);
          font-weight: 700;
          line-height: 1.05;
          margin-bottom: 28px;
          animation: fadeInUp 0.8s ease 0.15s both;
        }
        .hero h1 .accent { color: #FF8C32; }
        .hero p {
          font-size: clamp(16px, 2vw, 19px);
          color: #8892A8;
          line-height: 1.7;
          max-width: 580px;
          margin-bottom: 40px;
          animation: fadeInUp 0.8s ease 0.3s both;
        }
        .hero-buttons {
          display: flex; gap: 16px; flex-wrap: wrap;
          animation: fadeInUp 0.8s ease 0.45s both;
        }
        .btn-primary {
          background: #FF8C32;
          color: #0A0E17;
          border: none;
          padding: 16px 32px;
          font-size: 15px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s;
          letter-spacing: 0.3px;
        }
        .btn-primary:hover { background: #FFA050; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255, 140, 50, 0.25); }
        .btn-secondary {
          background: transparent;
          color: #E8ECF4;
          border: 1px solid rgba(232, 236, 244, 0.2);
          padding: 16px 32px;
          font-size: 15px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s;
        }
        .btn-secondary:hover { border-color: #FF8C32; color: #FF8C32; }
        
        .stats-bar {
          max-width: 1200px; margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(255, 140, 50, 0.1);
          border-radius: 12px;
          overflow: hidden;
          transform: translateY(-40px);
          position: relative; z-index: 2;
        }
        .stat-item {
          background: rgba(13, 18, 32, 0.9);
          padding: 32px 24px;
          text-align: center;
        }
        .stat-value {
          font-family: 'Space Mono', monospace;
          font-size: 32px;
          font-weight: 700;
          color: #FF8C32;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 13px;
          color: #8892A8;
          letter-spacing: 0.5px;
        }
        
        .section {
          max-width: 1200px; margin: 0 auto;
          padding: 100px 32px;
        }
        .section-title {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 700;
          margin-bottom: 12px;
        }
        .section-subtitle {
          font-size: 17px;
          color: #8892A8;
          margin-bottom: 60px;
          max-width: 500px;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .service-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 40px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .service-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FF8C32, transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .service-card:hover {
          border-color: rgba(255, 140, 50, 0.15);
          background: rgba(255, 140, 50, 0.03);
          transform: translateY(-4px);
        }
        .service-card:hover::before { opacity: 1; }
        .service-icon {
          font-size: 36px;
          margin-bottom: 20px;
          display: block;
        }
        .service-card h3 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 14px;
          color: #E8ECF4;
        }
        .service-card p {
          font-size: 15px;
          color: #8892A8;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .service-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .service-tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #FF8C32;
          background: rgba(255, 140, 50, 0.08);
          border: 1px solid rgba(255, 140, 50, 0.15);
          padding: 4px 12px;
          border-radius: 4px;
        }
        
        .about-section {
          background: linear-gradient(180deg, transparent, rgba(255, 140, 50, 0.02), transparent);
        }
        .about-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .about-card {
          display: flex; gap: 16px;
          padding: 28px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          transition: all 0.3s;
        }
        .about-card:hover {
          border-color: rgba(255, 140, 50, 0.15);
        }
        .about-check {
          width: 32px; height: 32px;
          background: rgba(255, 140, 50, 0.1);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #FF8C32; font-weight: 700; font-size: 16px;
          flex-shrink: 0;
        }
        .about-card h4 {
          font-size: 16px; font-weight: 700;
          margin-bottom: 6px;
        }
        .about-card p {
          font-size: 14px; color: #8892A8; line-height: 1.6;
        }
        
        .contact-section {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }
        .contact-info { display: flex; flex-direction: column; gap: 28px; }
        .contact-item { display: flex; gap: 16px; align-items: flex-start; }
        .contact-icon {
          width: 44px; height: 44px;
          background: rgba(255, 140, 50, 0.08);
          border: 1px solid rgba(255, 140, 50, 0.15);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .contact-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #8892A8;
          margin-bottom: 4px;
          font-family: 'Space Mono', monospace;
        }
        .contact-value {
          font-size: 16px; color: #E8ECF4; font-weight: 500;
        }
        .contact-form { display: flex; flex-direction: column; gap: 16px; }
        .contact-form input, .contact-form textarea {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 14px 18px;
          color: #E8ECF4;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.3s;
          outline: none;
          width: 100%;
        }
        .contact-form input:focus, .contact-form textarea:focus {
          border-color: rgba(255, 140, 50, 0.4);
        }
        .contact-form input::placeholder, .contact-form textarea::placeholder {
          color: #555D70;
        }
        .contact-form textarea { resize: vertical; min-height: 120px; }
        
        .footer {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 40px 32px;
          text-align: center;
        }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
        }
        .footer-logo {
          font-family: 'Space Mono', monospace;
          font-weight: 700; font-size: 18px;
          color: #FF8C32; letter-spacing: 2px;
          margin-bottom: 8px;
        }
        .footer-tagline {
          font-size: 13px; color: #555D70;
          margin-bottom: 16px;
        }
        .footer-copy {
          font-size: 12px; color: #3A4158;
        }

        .animate-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: block; }
          .stats-bar { grid-template-columns: repeat(2, 1fr); }
          .services-grid { grid-template-columns: 1fr; }
          .about-grid { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; gap: 40px; }
          .hero-inner { padding: 120px 24px 60px; }
          .section { padding: 60px 24px; }
          .service-card { padding: 28px; }
        }
        
        @media (max-width: 480px) {
          .stats-bar { grid-template-columns: repeat(2, 1fr); transform: translateY(-20px); }
          .stat-item { padding: 20px 16px; }
          .stat-value { font-size: 24px; }
          .hero-buttons { flex-direction: column; }
          .btn-primary, .btn-secondary { text-align: center; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`nav-fixed ${scrolled ? "nav-scrolled" : "nav-top"}`}>
        <div className="nav-inner">
          <div>
            <div className="logo-text">HST</div>
            <div className="logo-sub">Periyodik</div>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => scrollTo("hero")}>{t.nav.home}</button>
            <button className="nav-link" onClick={() => scrollTo("services")}>{t.nav.services}</button>
            <button className="nav-link" onClick={() => scrollTo("about")}>{t.nav.about}</button>
            <button className="nav-link" onClick={() => scrollTo("contact")}>{t.nav.contact}</button>
            <button className="lang-btn" onClick={() => setLang(lang === "tr" ? "en" : "tr")}>
              {lang === "tr" ? "EN" : "TR"}
            </button>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>×</button>
        <button onClick={() => scrollTo("hero")}>{t.nav.home}</button>
        <button onClick={() => scrollTo("services")}>{t.nav.services}</button>
        <button onClick={() => scrollTo("about")}>{t.nav.about}</button>
        <button onClick={() => scrollTo("contact")}>{t.nav.contact}</button>
        <button className="lang-btn" style={{ fontSize: 16, padding: "10px 24px" }}
          onClick={() => { setLang(lang === "tr" ? "en" : "tr"); setMenuOpen(false); }}>
          {lang === "tr" ? "ENGLISH" : "TÜRKÇE"}
        </button>
      </div>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-badge">{t.hero.badge}</div>
          <h1>
            {t.hero.title1}<br />
            <span className="accent">{t.hero.title2}</span>
          </h1>
          <p>{t.hero.subtitle}</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollTo("services")}>{t.hero.cta}</button>
            <button className="btn-secondary" onClick={() => scrollTo("contact")}>{t.hero.ctaContact}</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {t.stats.map((s, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <ServiceSection t={t} />

      {/* ABOUT */}
      <AboutSection t={t} />

      {/* CONTACT */}
      <ContactSection t={t} />

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">HST PERİYODİK</div>
          <div className="footer-tagline">{t.footer.tagline}</div>
          <div className="footer-copy">© 2026 HST Periyodik. {t.footer.rights}</div>
        </div>
      </footer>
    </div>
  );
}

function ServiceSection({ t }) {
  const [ref, visible] = useInView();
  return (
    <section id="services" ref={ref} className={`section animate-in ${visible ? "visible" : ""}`}>
      <div className="section-title">{t.services.title}</div>
      <div className="section-subtitle">{t.services.subtitle}</div>
      <div className="services-grid">
        {t.services.items.map((item, i) => (
          <div className="service-card" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
            <span className="service-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <div className="service-tags">
              {item.tags.map((tag, j) => (
                <span className="service-tag" key={j}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection({ t }) {
  const [ref, visible] = useInView();
  return (
    <section id="about" className="about-section">
      <div ref={ref} className={`section animate-in ${visible ? "visible" : ""}`}>
        <div className="section-title">{t.about.title}</div>
        <div className="section-subtitle">{t.about.subtitle}</div>
        <div className="about-grid">
          {t.about.features.map((f, i) => (
            <div className="about-card" key={i}>
              <div className="about-check">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ t }) {
  const [ref, visible] = useInView();
  return (
    <section id="contact" className="contact-section">
      <div ref={ref} className={`section animate-in ${visible ? "visible" : ""}`}>
        <div className="section-title">{t.contact.title}</div>
        <div className="section-subtitle">{t.contact.subtitle}</div>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <div className="contact-label">{t.contact.phone}</div>
                <div className="contact-value">+90 534 881 40 40</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div>
                <div className="contact-label">{t.contact.email}</div>
                <div className="contact-value">info@hstperiyodik.com</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">💬</div>
              <div>
                <div className="contact-label">{t.contact.whatsapp}</div>
                <div className="contact-value">+90 534 881 40 40</div>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <div className="contact-label">{t.contact.address}</div>
                <div className="contact-value">{t.contact.addressText}</div>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <input type="text" placeholder={t.contact.formName} />
            <input type="email" placeholder={t.contact.formEmail} />
            <textarea placeholder={t.contact.formMessage} />
            <button className="btn-primary" style={{ width: "100%" }}>{t.contact.formSend}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
