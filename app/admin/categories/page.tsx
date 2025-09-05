"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function AdminCategoriesPage() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Array<{ name: string; parent?: string }>>([
    { name: 'Abstract' },
    { name: 'Photography' },
  ]);
  const [form, setForm] = useState({ name: '', parent: '' });
  const add = () => { setItems([{ name: form.name, parent: form.parent || undefined }, ...items]); setOpen(false); setForm({ name: '', parent: '' }); };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-charcoal">Categories</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-gold">Add Category</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Input placeholder="Name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Input placeholder="Parent (optional)" value={form.parent} onChange={(e)=>setForm({ ...form, parent: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
                <Button onClick={add} className="bg-gradient-gold">Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Parent</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i)=> (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">{it.name}</td>
                <td className="px-4 py-3 text-gray-500">{it.parent || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}


