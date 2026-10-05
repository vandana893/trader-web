'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Link as LinkIcon, Shield, Bell, CreditCard, FileText, CheckCircle, Save, ExternalLink, Plus, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

import settingsDataRaw from '@/data/mock/settings.json';
import { SettingsTab, UserProfile, BrokerAccount, NotificationPreferences, BillingInfo } from '@/types/settings';

const mockData = {
  profile: (settingsDataRaw as any)?.profile || { name: 'User', email: '', phone: '', kycStatus: 'PENDING' },
  brokers: (settingsDataRaw as any)?.brokers || [],
  notificationPreferences: (settingsDataRaw as any)?.notificationPreferences || { orderExecuted: {}, orderRejected: {}, riskBreach: {}, promotional: {} },
  billing: (settingsDataRaw as any)?.billing || { invoices: [], activePlan: '', nextBillingDate: '', paymentMethod: '' }
};

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams?.get('tab') as SettingsTab) || 'profile';

  const handleTabChange = (tab: SettingsTab) => {
    router.push(`/settings?tab=${tab}`);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile': return <ProfileTab data={mockData.profile} />;
      case 'brokers': return <BrokersTab data={mockData.brokers} />;
      case 'security': return <SecurityTab />;
      case 'notifications': return <NotificationsTab data={mockData.notificationPreferences} />;
      case 'billing': return <BillingTab data={mockData.billing} />;
      case 'legal': return <LegalTab />;
      default: return <ProfileTab data={mockData.profile} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', padding: 'var(--spacing-4) var(--spacing-8)', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>Settings</h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            Manage your account, connected brokers, billing, and security preferences.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-8)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Sidebar Menu */}
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <MenuButton active={activeTab === 'profile'} onClick={() => handleTabChange('profile')} icon={<User size={18} />} label="Profile" />
          <MenuButton active={activeTab === 'brokers'} onClick={() => handleTabChange('brokers')} icon={<LinkIcon size={18} />} label="Broker Accounts" />
          <MenuButton active={activeTab === 'security'} onClick={() => handleTabChange('security')} icon={<Shield size={18} />} label="Security & API" />
          <MenuButton active={activeTab === 'notifications'} onClick={() => handleTabChange('notifications')} icon={<Bell size={18} />} label="Notifications" />
          <MenuButton active={activeTab === 'billing'} onClick={() => handleTabChange('billing')} icon={<CreditCard size={18} />} label="Billing & Plans" />
          <MenuButton active={activeTab === 'legal'} onClick={() => handleTabChange('legal')} icon={<FileText size={18} />} label="Legal Documents" />
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function MenuButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: 'var(--spacing-3) var(--spacing-4)',
        backgroundColor: active ? 'var(--color-surface)' : 'transparent', 
        border: 'none', 
        borderRadius: 'var(--radius-md)',
        color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        fontWeight: active ? 600 : 500, 
        fontSize: 'var(--font-size-sm)', 
        cursor: 'pointer',
        textAlign: 'left',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
      }}
    >
      {icon} {label}
    </button>
  );
}

// -------------------------------------------------------------
// Tabs Content
// -------------------------------------------------------------

function ProfileTab({ data }: { data: UserProfile }) {
  const handleSave = () => alert('FRONTEND SIMULATION: Profile updated.');
  if (!data) return <div style={{ padding: 'var(--spacing-6)', color: 'var(--color-text-muted)' }}>Loading profile data...</div>;
  return (
    <Card style={{ padding: 'var(--spacing-6)' }}>
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-6)' }}>Personal Profile</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
        <InputGroup label="Full Name" defaultValue={data.name} />
        <InputGroup label="Email Address" defaultValue={data.email} disabled />
        <InputGroup label="Phone Number" defaultValue={data.phone} />
        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>KYC Status</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-tinted)' }}>
            <CheckCircle size={16} color="var(--color-success)" /> <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{data.kycStatus}</span>
          </div>
        </div>
      </div>
      <Button variant="primary" onClick={handleSave}><Save size={16} style={{ marginRight: '8px' }} /> Save Changes</Button>
    </Card>
  );
}

function BrokersTab({ data }: { data: BrokerAccount[] }) {
  const handleAdd = () => alert('FRONTEND SIMULATION: Redirect to broker OAuth login.');
  if (!data || !Array.isArray(data)) return <div style={{ padding: 'var(--spacing-6)', color: 'var(--color-text-muted)' }}>Loading broker data...</div>;
  return (
    <Card style={{ padding: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>Connected Brokers</h3>
        <Button variant="outline" size="sm" onClick={handleAdd}><Plus size={16} style={{ marginRight: '8px' }} /> Connect Broker</Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {data.map(broker => (
          <div key={broker.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-1)' }}>
                <h4 style={{ fontWeight: 600, fontSize: 'var(--font-size-base)' }}>{broker.brokerName}</h4>
                <Badge variant={broker.status === 'ACTIVE' ? 'success' : 'danger'} style={{ fontSize: '10px' }}>{broker.status}</Badge>
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Account ID: {broker.accountRef} | Last Sync: {new Date(broker.lastSyncAt).toLocaleString()}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => alert('FRONTEND SIMULATION: Broker token refreshed.')}>Refresh Token</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SecurityTab() {
  const handleAction = (action: string) => alert(`FRONTEND SIMULATION: ${action}`);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <Card style={{ padding: 'var(--spacing-6)' }}>
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-6)' }}>Password & Authentication</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Change Password</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Update your account password securely.</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleAction('Change password modal opened.')}>Update</Button>
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Two-Factor Authentication (2FA)</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Add an extra layer of security using an Authenticator app.</div>
            </div>
            <Button variant="primary" size="sm" onClick={() => handleAction('2FA setup initiated.')}>Enable 2FA</Button>
          </div>
        </div>
      </Card>

      <Card style={{ padding: 'var(--spacing-6)' }}>
        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-4)' }}>API Permissions</h3>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
          Manage third-party applications that have access to your account data.
        </p>
        <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
          No active API keys or external applications connected.
        </div>
      </Card>
    </div>
  );
}

function NotificationsTab({ data }: { data: NotificationPreferences }) {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(data || null);
  const handleSave = () => alert('FRONTEND SIMULATION: Notification preferences saved.');
  
  if (!prefs) return <div style={{ padding: 'var(--spacing-6)', color: 'var(--color-text-muted)' }}>Loading preferences...</div>;

  const ToggleRow = ({ label, desc, stateKey }: { label: string, desc: string, stateKey: keyof NotificationPreferences }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-4) 0', borderBottom: '1px solid var(--color-border)' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{label}</div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{desc}</div>
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          <input type="checkbox" checked={prefs[stateKey].push} onChange={(e) => setPrefs({...prefs, [stateKey]: {...prefs[stateKey], push: e.target.checked}})} /> Push
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          <input type="checkbox" checked={prefs[stateKey].email} onChange={(e) => setPrefs({...prefs, [stateKey]: {...prefs[stateKey], email: e.target.checked}})} /> Email
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          <input type="checkbox" checked={prefs[stateKey].sms} onChange={(e) => setPrefs({...prefs, [stateKey]: {...prefs[stateKey], sms: e.target.checked}})} /> SMS
        </label>
      </div>
    </div>
  );

  return (
    <Card style={{ padding: 'var(--spacing-6)' }}>
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-6)' }}>Notification Preferences</h3>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 'var(--spacing-6)' }}>
        <ToggleRow label="Order Executed" desc="Receive alerts when your orders are successfully filled." stateKey="orderExecuted" />
        <ToggleRow label="Order Rejected" desc="Urgent alerts when a broker rejects an order." stateKey="orderRejected" />
        <ToggleRow label="Risk Breaches" desc="Critical alerts when global stop-loss or risk limits are hit." stateKey="riskBreach" />
        <ToggleRow label="Promotional & Updates" desc="Newsletter, new features, and marketplace offers." stateKey="promotional" />
      </div>
      <Button variant="primary" onClick={handleSave}><Save size={16} style={{ marginRight: '8px' }} /> Save Preferences</Button>
    </Card>
  );
}

function BillingTab({ data }: { data: BillingInfo }) {
  if (!data) return <div style={{ padding: 'var(--spacing-6)', color: 'var(--color-text-muted)' }}>Loading billing data...</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <Card style={{ padding: 'var(--spacing-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-6)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-1)' }}>Current Plan</h3>
            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>You are currently on the <strong style={{ color: 'var(--color-primary)' }}>{data.activePlan}</strong>.</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => alert('FRONTEND SIMULATION: Change plan modal opened.')}>Change Plan</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-tinted)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Next Billing Date</div>
            <div style={{ fontWeight: 600 }}>{new Date(data.nextBillingDate).toLocaleDateString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Payment Method</div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><CreditCard size={14} /> {data.paymentMethod}</div>
          </div>
        </div>
      </Card>

      <Card style={{ padding: 0 }}>
        <div style={{ padding: 'var(--spacing-4) var(--spacing-6)', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>Billing History</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-surface)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-6)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>Invoice ID</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-6)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>Date</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-6)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>Amount</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-6)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>Status</th>
              <th style={{ padding: 'var(--spacing-3) var(--spacing-6)', fontWeight: 600, borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {data.invoices.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-6)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{inv.id}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-6)', color: 'var(--color-text-primary)' }}>{new Date(inv.date).toLocaleDateString()}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-6)', color: 'var(--color-text-primary)' }}>₹{inv.amount}</td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-6)' }}><Badge variant="success" style={{ fontSize: '10px' }}>{inv.status}</Badge></td>
                <td style={{ padding: 'var(--spacing-3) var(--spacing-6)', textAlign: 'right' }}>
                  <Button variant="outline" size="sm" onClick={() => alert('FRONTEND SIMULATION: Downloading Invoice PDF.')}><Download size={14} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function LegalTab() {
  return (
    <Card style={{ padding: 'var(--spacing-6)' }}>
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--spacing-4)' }}>Legal Documents</h3>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>
        Review the platform's terms of service, privacy policies, and risk disclosures.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <LegalLink title="Terms of Service" desc="Rules and guidelines for using the algo trading platform." />
        <LegalLink title="Privacy Policy" desc="How we collect, use, and protect your personal data." />
        <LegalLink title="Risk Disclosure" desc="Mandatory disclosures regarding the risks of algorithmic trading." />
        <LegalLink title="API End-User License Agreement" desc="Terms for connecting and executing through broker APIs." />
      </div>
    </Card>
  );
}

function LegalLink({ title, desc }: { title: string, desc: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-4)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'background-color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-tinted)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => alert(`FRONTEND SIMULATION: Opening ${title} PDF.`)}>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>{title} <ExternalLink size={14} /></div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>{desc}</div>
      </div>
    </div>
  );
}

function InputGroup({ label, defaultValue, disabled = false }: { label: string, defaultValue: string, disabled?: boolean }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>{label}</label>
      <input 
        type="text" 
        defaultValue={defaultValue} 
        disabled={disabled}
        style={{ 
          width: '100%', 
          padding: '10px 12px', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--color-border)', 
          backgroundColor: disabled ? 'var(--color-surface-tinted)' : 'var(--color-surface)', 
          fontSize: 'var(--font-size-sm)', 
          color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)', 
          outline: 'none' 
        }} 
      />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div style={{ height: '100%', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Suspense fallback={<div style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading Settings...</div>}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}