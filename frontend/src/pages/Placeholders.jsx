import React from 'react';

const PlaceholderPage = ({ title }) => (
    <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem' }}>{title}</h1>
        <div style={{ padding: '2rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
            Feature coming soon...
        </div>
    </div>
);

export const Events = () => <PlaceholderPage title="Events Management" />;
export const Clients = () => <PlaceholderPage title="Client Database" />;
export const Finances = () => <PlaceholderPage title="Financial Overview" />;
export const Reports = () => <PlaceholderPage title="Analytics & Reports" />;
export const Settings = () => <PlaceholderPage title="System Settings" />;
