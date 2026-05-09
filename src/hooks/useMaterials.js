import { useState, useMemo } from 'react';
import { materials } from '../data/materials';
import { filterMaterials } from '../utils/helpers';

export function useMaterials() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(
    () => filterMaterials(materials, { query, category }),
    [query, category]
  );

  return { materials: filtered, total: materials.length, query, setQuery, category, setCategory };
}
