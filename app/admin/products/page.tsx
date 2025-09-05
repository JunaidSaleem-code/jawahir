"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';

export default function AdminProductsPage() {
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [items, setItems] = useState<Array<{ title: string; price: number; stock: number; sku: string; category: string; active: boolean }>>([
    { title: 'Abstract Harmony', price: 299, stock: 24, sku: 'ART-001', category: 'Abstract', active: true },
    { title: 'Urban Reflections', price: 249, stock: 12, sku: 'ART-002', category: 'Photography', active: true },
  ]);
  const [form, setForm] = useState({ title: '', price: 0, stock: 0, sku: '', category: 'Abstract', active: true });

  const startAdd = () => { setEditingIndex(null); setForm({ title: '', price: 0, stock: 0, sku: '', category: 'Abstract', active: true }); setOpen(true); };
  const startEdit = (index: number) => { const it = items[index]; setEditingIndex(index); setForm({ ...it }); setOpen(true); };
  const saveItem = () => {
    if (editingIndex === null) setItems([form, ...items]);
    else setItems(items.map((it, i) => i === editingIndex ? form : it));
    setOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-charcoal">Products</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Import CSV</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={startAdd} className="bg-gradient-gold">Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{editingIndex === null ? 'Add Product' : 'Edit Product'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input type="number" value={form.price} onChange={(e)=>setForm({ ...form, price: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <Input type="number" value={form.stock} onChange={(e)=>setForm({ ...form, stock: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>SKU</Label>
                    <Input value={form.sku} onChange={(e)=>setForm({ ...form, sku: e.target.value })} />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v)=>setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Abstract">Abstract</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Minimalist">Minimalist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Images</Label>
                  <Input type="file" multiple accept="image/*" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
                  <Button onClick={saveItem} className="bg-gradient-gold">Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <DataTable
          rows={items}
          columns={[
            { key: 'title', header: 'Title' },
            { key: 'price', header: 'Price' },
            { key: 'stock', header: 'Stock' },
            { key: 'sku', header: 'SKU' },
            { key: 'category', header: 'Category' },
            { key: 'actions', header: 'Actions', render: (_)=> <Button size="sm" variant="outline" onClick={()=>startEdit(items.findIndex(x=>x===_))}>Edit</Button> },
          ]}
        />
      </Card>
    </div>
  );
}


