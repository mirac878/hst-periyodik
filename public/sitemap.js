import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    // Sabit sayfalar
    const staticPages = [
      { loc: '/', changefreq: 'weekly', priority: '1.0' },
      { loc: '/hizmetler', changefreq: 'monthly', priority: '0.9' },
      { loc: '/hizmet-bolgeleri', changefreq: 'weekly', priority: '0.9' },
      { loc: '/hakkimizda', changefreq: 'monthly', priority: '0.7' },
      { loc: '/referanslar', changefreq: 'monthly', priority: '0.7' },
      { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
      { loc: '/teklif-hesapla', changefreq: 'monthly', priority: '0.9' },
      { loc: '/iletisim', changefreq: 'monthly', priority: '0.8' },
    ];

    // Şehir sayfaları
    const { data: cities } = await supabase
      .from('city_pages')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('order_index');

    // Şehir-hizmet sayfaları
    const { data: cityServices } = await supabase
      .from('city_service_pages')
      .select('city_slug, service_key, updated_at')
      .eq('is_active', true);

    // Blog yazıları
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    // XML oluştur
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Sabit sayfalar
    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>https://hstperiyodik.com${page.loc}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Şehir sayfaları
    if (cities) {
      for (const city of cities) {
        xml += `  <url>\n`;
        xml += `    <loc>https://hstperiyodik.com/periyodik-kontrol/${city.slug}</loc>\n`;
        if (city.updated_at) xml += `    <lastmod>${city.updated_at.split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    // Şehir-hizmet sayfaları
    if (cityServices) {
      for (const cs of cityServices) {
        xml += `  <url>\n`;
        xml += `    <loc>https://hstperiyodik.com/hizmet-bolgeleri/${cs.city_slug}/${cs.service_key}</loc>\n`;
        if (cs.updated_at) xml += `    <lastmod>${cs.updated_at.split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    // Blog yazıları
    if (blogs) {
      for (const blog of blogs) {
        xml += `  <url>\n`;
        xml += `    <loc>https://hstperiyodik.com/blog/${blog.slug}</loc>\n`;
        if (blog.updated_at) xml += `    <lastmod>${blog.updated_at.split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += '</urlset>';

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(xml);

  } catch (error) {
    console.error('Sitemap error:', error);
    return res.status(500).send('Sitemap generation error');
  }
}
