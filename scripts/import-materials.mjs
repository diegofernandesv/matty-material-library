/**
 * Import materials from output-all.json into Supabase.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJ... \
 *   node scripts/import-materials.mjs /path/to/output-all.json
 *
 * The service key (not anon key) is required to bypass RLS.
 * Get it from: Supabase Dashboard → Project Settings → API → service_role key
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const JSON_PATH = process.argv[2] ?? new URL('../output-all.json', import.meta.url).pathname;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars: SUPABASE_URL and SUPABASE_SERVICE_KEY required');
  process.exit(1);
}

const STATE_MAP = {
  ACTIVE:         'Active',
  NOT_ACTIVE:     'Inactive',
  DEACTIVATED:    'Deactivated',
  MISSING_INFO:   'Inactive',
  MISSING_UPDATE: 'Inactive',
};

function mapMaterial(raw) {
  const supplierIds = (raw.suppliers?.materialSupplierValue ?? [])
    .map(s => s.supplierPublicId)
    .filter(Boolean);

  return {
    material_number: raw.number,
    name:            raw.libraryRef || raw.number,
    short_name:      raw.libraryRef || null,
    category:        'Woven',   // JSON has no category — defaulting to Woven
    subcategory:     null,
    material_state:  STATE_MAP[raw.materialState] ?? 'Inactive',
    library:         raw.libraryPublicId ?? null,
    supplier_ids:    supplierIds.length ? supplierIds : null,
  };
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const raw = JSON.parse(readFileSync(JSON_PATH, 'utf8'));
console.log(`Loaded ${raw.length} materials from JSON`);

const rows = raw
  .filter(m => !m.deleted)
  .map(mapMaterial);

console.log(`Inserting ${rows.length} rows (deleted entries skipped)…`);

const BATCH = 500;
let inserted = 0;
let skipped = 0;

for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH);
  const { error, count } = await supabase
    .from('materials')
    .upsert(batch, { onConflict: 'material_number', count: 'exact' });

  if (error) {
    console.error(`Batch ${i}–${i + BATCH} error:`, error.message);
    skipped += batch.length;
  } else {
    inserted += batch.length;
    process.stdout.write(`\r  ${inserted} / ${rows.length}`);
  }
}

console.log(`\nDone. ${inserted} upserted, ${skipped} failed.`);
