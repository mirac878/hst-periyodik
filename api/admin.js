import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ALLOWED_TABLES = ['blogs', 'client_references', 'services', 'contact_info', 'hero_slides', 'faq_items', 'about_content', 'site_stats', 'city_pages'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, table, data, id, password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Yetkisiz erişim' });
  }

  if (action === 'login') return res.status(200).json({ success: true });

  if (action === 'upload_image') {
    try {
      const { fileName, fileData, contentType } = req.body;
      const buffer = Buffer.from(fileData, 'base64');
      const path = `uploads/${Date.now()}_${fileName}`;
      const { error } = await supabase.storage.from('images').upload(path, buffer, { contentType, upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(path);
      return res.status(200).json({ url: urlData.publicUrl });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (!ALLOWED_TABLES.includes(table)) {
    return res.status(400).json({ error: 'Geçersiz tablo' });
  }

  try {
    switch (action) {
      case 'list': {
        const query = supabase.from(table).select('*');
        if (table === 'blogs') query.order('created_at', { ascending: false });
        else if (table === 'contact_info') query.limit(1);
        else if (table === 'about_content') query.order('key');
        else query.order('order_index', { ascending: true });
        const { data: rows, error } = await query;
        if (error) throw error;
        return res.status(200).json(rows);
      }
      case 'create': {
        const { data: row, error } = await supabase.from(table).insert(data).select().single();
        if (error) throw error;
        return res.status(200).json(row);
      }
      case 'update': {
        const { data: row, error } = await supabase.from(table).update(data).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(row);
      }
      case 'delete': {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
        return res.status(200).json({ success: true });
      }
      default:
        return res.status(400).json({ error: 'Geçersiz işlem' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
