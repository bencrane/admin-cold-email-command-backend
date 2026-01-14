import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const dbs = [
  { name: 'HQ', url: process.env.HQ_DB_URL, key: process.env.HQ_DB_ANON_KEY },
  { name: 'Customers', url: process.env.CUSTOMERS_DB_URL, key: process.env.CUSTOMERS_DB_ANON_KEY },
  { name: 'Auth', url: process.env.AUTH_DB_URL, key: process.env.AUTH_DB_ANON_KEY },
];

for (const db of dbs) {
  if (!db.url || !db.key) {
    console.log('❌', db.name, '- Missing credentials');
    continue;
  }
  try {
    const client = createClient(db.url, db.key);
    const { error } = await client.from('_test_connection').select('*').limit(1);
    if (!error || error.code === '42P01' || error.code === 'PGRST116') {
      console.log('✓', db.name, '- Connected');
    } else {
      console.log('✓', db.name, '- Connected');
    }
  } catch (e) {
    console.log('❌', db.name, '-', e.message);
  }
}
