import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaBuilding, FaPalette } from 'react-icons/fa';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('general');

    const [formData, setFormData] = useState({
        name: '',
        logo_url: '',
        primary_color: '#000000',
        background_color: '#ffffff',
        font_color: '#111827',
        address: '',
        contact_phone: ''
    });

    // Halls State
    const [halls, setHalls] = useState([]);
    const [hallName, setHallName] = useState('');

    useEffect(() => {
        if (activeTab === 'halls') {
            fetchHalls();
        }
    }, [activeTab]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/settings/center', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({
                name: res.data.name || '',
                logo_url: res.data.logo_url || '',
                primary_color: res.data.primary_color || '#000000',
                background_color: res.data.background_color || '#ffffff',
                font_color: res.data.font_color || '#111827',
                address: res.data.address || '',
                contact_phone: res.data.contact_phone || ''
            });
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('/api/settings/center', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Settings updated successfully!');

            // Update local storage to reflect changes immediately in UI (Sidebar/Theme)
            localStorage.setItem('center_name', res.data.name);
            localStorage.setItem('center_logo', res.data.logo_url || '');
            localStorage.setItem('center_color', res.data.primary_color);

            // Force reload or event dispatch could be better, but simple reload works for theme
            // window.location.reload(); // Optional: to refresh sidebar immediately
            // Better: Dispatch a custom event or let the user see the message
            document.documentElement.style.setProperty('--primary', res.data.primary_color);
            document.documentElement.style.setProperty('--background', res.data.background_color);
            document.documentElement.style.setProperty('--text-main', res.data.font_color);

            // Store in LocalStorage for persistence
            localStorage.setItem('center_bg', res.data.background_color);
            localStorage.setItem('center_font', res.data.font_color);

        } catch (error) {
            setMessage('Failed to update settings.');
            console.error(error);
        }
    };

    const fetchHalls = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/resources', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHalls(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddHall = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/resources', { name: hallName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHallName('');
            fetchHalls();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteHall = async (id) => {
        if (!window.confirm('Delete this hall?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/resources/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchHalls();
        } catch (error) {
            alert('Cannot delete hall with bookings.');
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Center Settings</h1>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setActiveTab('general')}
                        style={{
                            padding: '1rem',
                            border: 'none',
                            background: activeTab === 'general' ? 'white' : '#F9FAFB',
                            borderBottom: activeTab === 'general' ? '2px solid var(--primary)' : 'none',
                            fontWeight: activeTab === 'general' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <FaBuilding /> General Info
                    </button>
                    <button
                        onClick={() => setActiveTab('halls')}
                        style={{
                            padding: '1rem',
                            border: 'none',
                            background: activeTab === 'halls' ? 'white' : '#F9FAFB',
                            borderBottom: activeTab === 'halls' ? '2px solid var(--primary)' : 'none',
                            fontWeight: activeTab === 'halls' ? 'bold' : 'normal',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <FaPalette /> Halls & Resources
                    </button>
                </div>

                <div style={{ padding: '2rem' }}>
                    {loading ? <p>Loading...</p> : (
                        <>
                            {activeTab === 'general' && (
                                <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                                    {message && <div style={{
                                        padding: '1rem', marginBottom: '1rem', borderRadius: '4px',
                                        backgroundColor: message.includes('success') ? '#DEF7EC' : '#FDE8E8',
                                        color: message.includes('success') ? '#03543F' : '#9B1C1C'
                                    }}>{message}</div>}

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Center Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g., MT Hall"
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        <small style={{ color: '#6B7280' }}>This name will be displayed on the sidebar and login screen.</small>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Logo URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://example.com/logo.png"
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            value={formData.logo_url}
                                            onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                                        />
                                        {formData.logo_url && (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <img src={formData.logo_url} alt="Logo Preview" style={{ height: '50px', objectFit: 'contain' }} />
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Primary Color</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input
                                                    type="color"
                                                    style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
                                                    value={formData.primary_color}
                                                    onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    style={{ width: '80px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                    value={formData.primary_color}
                                                    onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Background Color</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input
                                                    type="color"
                                                    style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
                                                    value={formData.background_color || '#ffffff'}
                                                    onChange={e => setFormData({ ...formData, background_color: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    style={{ width: '80px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                    value={formData.background_color || '#ffffff'}
                                                    onChange={e => setFormData({ ...formData, background_color: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Font Color</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input
                                                    type="color"
                                                    style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
                                                    value={formData.font_color || '#111827'}
                                                    onChange={e => setFormData({ ...formData, font_color: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    style={{ width: '80px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                    value={formData.font_color || '#111827'}
                                                    onChange={e => setFormData({ ...formData, font_color: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Address</label>
                                        <textarea
                                            rows="3"
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Contact Phone</label>
                                        <input
                                            type="text"
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            value={formData.contact_phone}
                                            onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        style={{
                                            backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem 2rem',
                                            borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold'
                                        }}
                                    >
                                        <FaSave /> Save Changes
                                    </button>
                                </form>
                            )}

                            {activeTab === 'halls' && (
                                <div>
                                    <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Enter Hall Name (e.g. Dining Hall)"
                                            style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            value={hallName}
                                            onChange={e => setHallName(e.target.value)}
                                        />
                                        <button
                                            onClick={handleAddHall}
                                            disabled={!hallName}
                                            style={{
                                                backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem 1.5rem',
                                                borderRadius: 'var(--radius)', border: 'none', cursor: !hallName ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                                            }}
                                        >
                                            Add Hall
                                        </button>
                                    </div>

                                    <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Existing Halls</h3>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {halls.map(hall => (
                                            <li key={hall.id} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '1rem', borderBottom: '1px solid #eee'
                                            }}>
                                                <span style={{ fontWeight: 500 }}>{hall.name}</span>
                                                <button
                                                    onClick={() => handleDeleteHall(hall.id)}
                                                    style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        ))}
                                        {halls.length === 0 && <p style={{ color: '#666' }}>No halls added yet.</p>}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
