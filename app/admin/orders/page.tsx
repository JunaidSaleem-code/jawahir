"use client";

import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { MOCK_ORDERS, MOCK_ORDER_ITEMS } from '@/lib/mock-data';
import { useState, useMemo } from 'react';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<'All'|'Pending'|'Shipped'|'Delivered'|'Cancelled'>('All');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const rows = useMemo(()=> status==='All' ? orders : orders.filter(o=>o.status===status), [status, orders]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(()=> orders.find(o=>o.id===selectedId) || null, [orders, selectedId]);
  const [draftStatus, setDraftStatus] = useState<'Pending'|'Shipped'|'Delivered'|'Cancelled'>('Pending');
  const [tracking, setTracking] = useState('');
  const [shipping, setShipping] = useState<Record<string, string>>({});
  const [billing, setBilling] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const viewOrder = (id: string) => {
    const o = orders.find(x=>x.id===id);
    if (!o) return;
    setSelectedId(id);
    setDraftStatus(o.status);
    setTracking('');
    setShipping(s => ({
      ...s,
      [id]: s[id] ?? `${o.customerEmail}\n123 Example St\nNew York, NY 10001\nUnited States`,
    }));
    setBilling(b => ({
      ...b,
      [id]: b[id] ?? `${o.customerEmail}\n456 Billing Ave\nNew York, NY 10002\nUnited States`,
    }));
    setNotes(n => ({ ...n, [id]: n[id] ?? '' }));
    setOpen(true);
  };

  const applyUpdate = () => {
    setOrders(prev => prev.map(o => o.id===selectedId ? { ...o, status: draftStatus } : o));
    setOpen(false);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-charcoal">Orders</h1>
        <div className="flex items-center gap-2 text-sm">
          <span>Status</span>
          <select value={status} onChange={(e)=>setStatus(e.target.value as any)} className="border rounded px-2 py-1">
            {['All','Pending','Shipped','Delivered','Cancelled'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <Card className="p-0 overflow-hidden">
        <DataTable
          rows={rows}
          columns={[
            { key: 'id', header: 'Order ID', render: (r:any) => <button data-testid="order-id" className="text-gold hover:underline" onClick={()=>viewOrder(r.id)}>{r.id}</button> },
            { key: 'customerEmail', header: 'Customer' },
            { key: 'status', header: 'Status' },
            { key: 'items', header: 'Items' },
            { key: 'total', header: 'Total' },
            { key: 'createdAt', header: 'Date' },
          ]}
        />
      </Card>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="max-w-3xl mx-auto w-full" data-testid="order-drawer">
            <DrawerHeader>
              <DrawerTitle>Order Details</DrawerTitle>
            </DrawerHeader>
            {!selected ? (
              <div className="p-4 text-sm text-gray-600">No order selected.</div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><div className="text-gray-500">Order ID</div><div className="font-medium">{selected.id}</div></div>
                  <div><div className="text-gray-500">Customer</div><div className="font-medium">{selected.customerEmail}</div></div>
                  <div><div className="text-gray-500">Date</div><div className="font-medium">{selected.createdAt}</div></div>
                  <div><div className="text-gray-500">Items</div><div className="font-medium">{selected.items}</div></div>
                  <div><div className="text-gray-500">Total</div><div className="font-medium">${selected.total}</div></div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Items</div>
                  <div className="border rounded">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-3 py-2">Title</th>
                          <th className="text-left px-3 py-2">Qty</th>
                          <th className="text-left px-3 py-2">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(MOCK_ORDER_ITEMS[selected.id] || []).map((it, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-3 py-2">{it.title}</td>
                            <td className="px-3 py-2">{it.qty}</td>
                            <td className="px-3 py-2">${it.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Timeline</div>
                  <ol className="text-sm text-gray-700 space-y-1">
                    <li>Order placed • {selected.createdAt}</li>
                    <li>Processed • {selected.createdAt}</li>
                    <li>Shipped • {selected.status==='Shipped' || selected.status==='Delivered' ? 'Recently' : '—'}</li>
                    <li>Delivered • {selected.status==='Delivered' ? 'Recently' : '—'}</li>
                  </ol>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Status</div>
                    <select className="border rounded px-2 py-2 w-full" value={draftStatus} onChange={(e)=>setDraftStatus(e.target.value as any)}>
                      {['Pending','Shipped','Delivered','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Tracking Number</div>
                    <Input placeholder="e.g. 1Z999..." value={tracking} onChange={(e)=>setTracking(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-semibold mb-2">Shipping Address</div>
                    <Textarea rows={4} value={shipping[selected.id]} onChange={(e)=>setShipping(s=>({ ...s, [selected.id]: e.target.value }))} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-2">Billing Address</div>
                    <Textarea rows={4} value={billing[selected.id]} onChange={(e)=>setBilling(b=>({ ...b, [selected.id]: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Internal Notes</div>
                  <Textarea rows={3} placeholder="Add any notes for staff..." value={notes[selected.id]} onChange={(e)=>setNotes(n=>({ ...n, [selected.id]: e.target.value }))} />
                </div>
              </div>
            )}
            <DrawerFooter>
              <Button className="bg-gradient-gold" onClick={applyUpdate} disabled={!selected}>Update</Button>
              <Button variant="outline" onClick={()=>setOpen(false)}>Close</Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}


