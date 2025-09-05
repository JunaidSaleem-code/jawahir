"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminSecurityPage() {
  const [roleView, setRoleView] = useState<'super'|'staff'>('super');
  const [captcha, setCaptcha] = useState(true);
  const [activity] = useState([
    { who: 'admin@site.com', what: 'Approved review #abc123', when: '2h ago' },
    { who: 'staff@site.com', what: 'Edited product ART-001', when: '1d ago' },
  ]);
  return (
    <div>
      <h1 className="text-2xl font-semibold text-charcoal mb-4">Security</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="font-semibold">Roles & Permissions</div>
          <div className="mt-3 flex gap-2">
            <Button variant={roleView==='super'?'default':'outline'} onClick={()=>setRoleView('super')}>Super Admin</Button>
            <Button variant={roleView==='staff'?'default':'outline'} onClick={()=>setRoleView('staff')}>Staff</Button>
          </div>
          <ul className="mt-4 text-sm list-disc pl-5 text-gray-700">
            {roleView==='super' ? (
              <>
                <li>Full access to all modules</li>
                <li>Manage roles and security settings</li>
                <li>Delete data and export reports</li>
              </>
            ) : (
              <>
                <li>Manage products, orders, and customers</li>
                <li>No access to security settings</li>
                <li>Cannot delete critical data</li>
              </>
            )}
          </ul>
        </Card>
        <Card className="p-6">
          <div className="font-semibold">Login Security</div>
          <div className="mt-3 text-sm text-gray-700">CAPTCHA: {captcha ? 'Enabled' : 'Disabled'}</div>
          <div className="mt-2 flex gap-2">
            <Button variant={captcha?'default':'outline'} onClick={()=>setCaptcha(true)}>Enable</Button>
            <Button variant={!captcha?'default':'outline'} onClick={()=>setCaptcha(false)}>Disable</Button>
          </div>
          <div className="mt-6 font-semibold">Recent Activity</div>
          <ul className="mt-2 text-sm text-gray-700 space-y-1">
            {activity.map((a,i)=> (
              <li key={i} className="flex justify-between"><span>{a.what}</span><span className="text-gray-500">{a.when}</span></li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}


