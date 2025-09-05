'use client';

import { useMemo, useState } from 'react';

type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, any>>({ rows, columns }: { rows: T[]; columns: Column<T>[] }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [asc, setAsc] = useState(true);
  const [visible, setVisible] = useState<Record<string, boolean>>(() => Object.fromEntries(columns.map(c => [String(c.key), true])));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const base = q ? rows.filter(r => JSON.stringify(r).toLowerCase().includes(q)) : rows;
    if (!sortKey) return base;
    return [...base].sort((a,b)=>{
      const av = String((a as any)[sortKey] ?? '');
      const bv = String((b as any)[sortKey] ?? '');
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [rows, query, sortKey, asc]);

  // CSV Export
  const csv = useMemo(() => {
    const keys = columns.filter(c => visible[String(c.key)]).map(c => String(c.key));
    const head = keys.join(',');
    const body = filtered.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(',')).join('\n');
    return head + '\n' + body;
  }, [filtered, columns, visible]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search..." className="border rounded px-2 py-1 text-sm" />
        <div className="flex gap-2">
          <select value={sortKey} onChange={(e)=>setSortKey(e.target.value)} className="border rounded px-2 py-1 text-sm">
            <option value="">Sort by</option>
            {columns.map(c=> (
              <option key={String(c.key)} value={String(c.key)}>{c.header}</option>
            ))}
          </select>
          <button className="border rounded px-2 py-1 text-sm" onClick={()=>setAsc(!asc)}>{asc ? 'Asc' : 'Desc'}</button>
          <details className="relative">
            <summary className="border rounded px-2 py-1 text-sm cursor-pointer">Columns</summary>
            <div className="absolute right-0 mt-2 bg-white border rounded shadow p-2 text-sm z-10">
              {columns.map(c => (
                <label key={String(c.key)} className="flex items-center gap-2 py-1">
                  <input type="checkbox" checked={visible[String(c.key)]} onChange={(e)=>setVisible(v=>({ ...v, [String(c.key)]: e.target.checked }))} />
                  {c.header}
                </label>
              ))}
            </div>
          </details>
          <a
            className="border rounded px-2 py-1 text-sm"
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
            download="export.csv"
          >
            Export CSV
          </a>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              {columns.filter(c => visible[String(c.key)]).map(c => (
                <th key={String(c.key)} className="text-left px-3 py-2">{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr key={i} className="border-t">
                {columns.filter(c => visible[String(c.key)]).map(c => (
                  <td key={String(c.key)} className="px-3 py-2">{c.render ? c.render(row) : String(row[c.key as keyof typeof row] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-sm">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">
            {[10,20,50,100].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="border rounded px-2 py-1" onClick={()=>setPage(p=>Math.max(1, p-1))} disabled={page===1}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button className="border rounded px-2 py-1" onClick={()=>setPage(p=>Math.min(totalPages, p+1))} disabled={page===totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}


