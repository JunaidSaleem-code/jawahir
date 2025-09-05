"use client";

import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { MOCK_CUSTOMERS } from '@/lib/mock-data';

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal mb-4">Customers</h1>
      <Card className="p-0 overflow-hidden">
        <DataTable
          rows={MOCK_CUSTOMERS}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'orders', header: 'Orders' },
            { key: 'totalSpent', header: 'Total Spent' },
            { key: 'createdAt', header: 'Since' },
          ]}
        />
      </Card>
    </div>
  );
}


