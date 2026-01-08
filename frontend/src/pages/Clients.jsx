import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaUser, FaPhone, FaHistory, FaMoneyBillWave } from 'react-icons/fa';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);

    const fetchClients = async (search = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/clients?search=${search}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchClients(searchTerm);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Clients</h1>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="Search name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', width: '250px' }}
                    />
                    <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                        <FaSearch />
                    </button>
                </form>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Client Info</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Contact</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Events</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Total Spent</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Last Active</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 500 }}>{client.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: client.events_count > 1 ? '#059669' : 'var(--text-muted)' }}>
                                        {client.events_count > 1 ? 'Repeat Client' : 'New Client'}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                        <FaPhone size={12} /> {client.phone}
                                    </div>
                                    {client.address && <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{client.address}</div>}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{ padding: '0.25rem 0.75rem', background: '#EEF2FF', color: 'var(--primary)', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600 }}>
                                        {client.events_count}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>
                                    ₹{Number(client.events_sum_booked_amount || 0).toLocaleString()}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    {client.last_event_date || '-'}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => setSelectedClient(client)}
                                        style={{ fontSize: '0.875rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        View Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {clients.length === 0 && !loading && (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No clients found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Client Profile Modal */}
            {selectedClient && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
                }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                                    {selectedClient.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{selectedClient.name}</h2>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{selectedClient.phone}</div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedClient(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '1rem', backgroundColor: '#EEF2FF', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Spent</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{Number(selectedClient.events_sum_booked_amount || 0).toLocaleString()}</div>
                                </div>
                                <div style={{ padding: '1rem', backgroundColor: '#F3F4F6', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Events</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedClient.events_count}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FaHistory /> Key Dates
                                </h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>First Event</div>
                                        <div style={{ fontWeight: 500 }}>{selectedClient.first_event_date || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Event</div>
                                        <div style={{ fontWeight: 500 }}>{selectedClient.last_event_date || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
