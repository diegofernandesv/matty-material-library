import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export function useMaterials() {
  const [allMaterials, setAllMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      // Fetch in pages of 1000 to get all rows
      let rows = [];
      let from = 0;
      const pageSize = 1000;
      while (true) {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .range(from, from + pageSize - 1)
          .order('material_number', { ascending: false });
        if (error) { console.error('Supabase fetch error:', error); break; }
        if (!data?.length) break;
        rows = rows.concat(data);
        if (data.length < pageSize) break;
        from += pageSize;
      }
      setAllMaterials(rows);
      setLoading(false);
    }
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allMaterials.filter(m => {
      const matchesCategory = !category || category === 'All' || m.category === category;
      const matchesQuery =
        !q ||
        (m.name || '').toLowerCase().includes(q) ||
        (m.short_name || '').toLowerCase().includes(q) ||
        (m.category || '').toLowerCase().includes(q) ||
        (m.subcategory || '').toLowerCase().includes(q) ||
        (m.brand || '').toLowerCase().includes(q) ||
        (m.composition || '').toLowerCase().includes(q) ||
        (m.material_number || '').toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [allMaterials, query, category]);

  return { materials: filtered, total: allMaterials.length, loading, query, setQuery, category, setCategory };
}
