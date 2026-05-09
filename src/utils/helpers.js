export function filterMaterials(materials, { query, category }) {
  return materials.filter((m) => {
    const matchesCategory = !category || category === 'All' || m.category === category;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.shortName.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.tags.some((t) => t.toLowerCase().includes(q)) ||
      m.description.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

export function getCategoryColor(category) {
  const map = {
    Metals: '#94a3b8',
    Polymers: '#86efac',
    Ceramics: '#fde68a',
    Composites: '#818cf8',
    Biomaterials: '#f9a8d4',
    'Smart Materials': '#67e8f9',
    Nanomaterials: '#fb923c',
  };
  return map[category] || '#a0a0a0';
}

export function truncate(str, len = 120) {
  if (str.length <= len) return str;
  return str.slice(0, len).trimEnd() + '…';
}
