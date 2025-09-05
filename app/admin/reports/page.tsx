"use client";

import { Card } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const data = [
  { name: 'Mon', sales: 420 },
  { name: 'Tue', sales: 530 },
  { name: 'Wed', sales: 390 },
  { name: 'Thu', sales: 610 },
  { name: 'Fri', sales: 700 },
  { name: 'Sat', sales: 480 },
  { name: 'Sun', sales: 520 },
];

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal mb-4">Analytics & Reports</h1>
      <Card className="p-6">
        <ChartContainer config={{ sales: { label: 'Sales', color: '#C9A227' } }}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  );
}


