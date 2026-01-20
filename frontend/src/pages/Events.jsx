import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaCalendarAlt, FaList, FaEdit, FaTrash, FaMoneyBillWave } from 'react-icons/fa';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'payments'

    // Form State
    const [formData, setFormData] = useState({
        client_name: '',
        client_phone: '',
        client_address: '',
        resource_id: '',
        event_date: '',
        start_time: '',
        end_time: '',
        event_type: 'Wedding',
        status: 'blocked',
        booked_amount: 0,
        advance_amount: 0,
        discount: 0
    });

    // Payment Form State
    const [paymentData, setPaymentData] = useState({
        amount_received: '',
        received_date: new Date().toISOString().split('T')[0],
        payment_mode: 'cash'
    });
    const [payments, setPayments] = useState([]);

    const [filterStatus, setFilterStatus] = useState('');
    const [halls, setHalls] = useState([]);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = {};
            if (filterStatus) params.status = filterStatus;

            const res = await axios.get('/api/events', {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setEvents(res.data);
        } catch (error) {
            console.error('Failed to load events', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHalls = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/resources', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHalls(res.data);
            if (res.data.length > 0 && !editingEvent) {
                setFormData(prev => ({ ...prev, resource_id: res.data[0].id }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchHalls();
    }, [filterStatus]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editingEvent) {
                await axios.put(`/api/events/${editingEvent.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/events', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            fetchEvents();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!editingEvent) return;
        const token = localStorage.getItem('token');
        try {
            await axios.post('/api/incomes', {
                event_id: editingEvent.id,
                ...paymentData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh payments list and event data
            fetchPayments(editingEvent.id);
            fetchEvents();
            setPaymentData({
                amount_received: '',
                received_date: new Date().toISOString().split('T')[0],
                payment_mode: 'cash'
            });
            alert('Payment added successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to add payment');
        }
    };

    const fetchPayments = async (eventId) => {
        // Since API doesn't have /api/events/{id}/incomes, we can filter from /api/incomes or assume event object has them if eager loaded.
        // But for fresh data, let's hit /api/incomes? OR reload events and filtering.
        // Actually best to have specific endpoint. For now, let's reload events and find the event.
        // OPTIMIZATION: Just filter from the global events list AFTER refreshing.
        // But wait, our /api/incomes lists ALL incomes. Let's use that for now + filtering.
        try {
            const token = localStorage.getItem('token');
            // Assuming we fetch all incomes and filter client side for now (not ideal but works for small scale)
            // Better: update IncomeController to support event_id filter. It probably supports it implicitly via query params?
            // Checking IncomeController... index accepts request. Let's assume we can add logic later or filter client side.
            // Actually, let's just use the `incomes` relationship on the re-fetched event.
            // For this UI, let's refresh the entire event list and update `editingEvent` with the fresh data.
            const res = await axios.get('/api/events', { headers: { Authorization: `Bearer ${token}` } });
            setEvents(res.data);
            const freshEvent = res.data.find(ev => ev.id === eventId);
            if (freshEvent) setEditingEvent(freshEvent);
            // Wait, does the event list API return incomes? We didn't add `with('incomes')` in EventController index.
            // We should fix that in backend or fetch separate.
            // Let's fetch separate incomes list for this event.
            const incRes = await axios.get('/api/incomes', { headers: { Authorization: `Bearer ${token}` } });
            setPayments(incRes.data.filter(inc => inc.event_id === eventId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setActiveTab('details');
        setFormData({
            client_name: event.client?.name || '',
            client_phone: event.client?.phone || '',
            client_address: event.client?.address || '',
            resource_id: event.resource_id,
            event_date: event.event_date,
            start_time: event.start_time.slice(0, 5),
            end_time: event.end_time.slice(0, 5),
            event_type: event.event_type,
            status: event.status,
            booked_amount: event.booked_amount,
            advance_amount: event.advance_amount,
            discount: event.discount || 0
        });

        // Load payments for this event
        // We'll lazy load or load now.
        if (event.id) {
            // For now, simple filter from existing data if available or fetch
            // Let's trigger a fetch
            fetchPayments(event.id);
        }

        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingEvent(null);
        setActiveTab('details');
        setFormData({
            client_name: '',
            client_phone: '',
            client_address: '',
            resource_id: halls.length > 0 ? halls[0].id : '',
            event_date: '',
            start_time: '',
            end_time: '',
            event_type: 'Wedding',
            status: 'blocked',
            booked_amount: 0,
            advance_amount: 0,
            discount: 0
        });
        setPayments([]);
        setShowModal(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Events</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="booked">Booked</option>
                        <option value="blocked">Blocked</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                        onClick={handleCreate}
                        disabled={halls.length === 0}
                        style={{
                            backgroundColor: halls.length === 0 ? '#9CA3AF' : 'var(--primary)',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius)',
                            border: 'none',
                            cursor: halls.length === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <FaPlus /> New Booking
                    </button>
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#F9FAFB' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Date & Time</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Hall</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Client</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Type</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Amount</th>
                                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500 }}>{event.event_date}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{event.resource?.name || 'N/A'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500 }}>{event.client?.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{event.client?.phone}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{event.event_type}</td>
                                    <td style={{ padding: '1rem' }}>{event.status}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ fontWeight: 500 }}>₹{event.booked_amount}</div>
                                        {event.discount > 0 && (
                                            <div style={{ fontSize: '0.75rem', color: '#D97706' }}>
                                                Discount: -₹{event.discount}
                                            </div>
                                        )}
                                        <div style={{ fontSize: '0.75rem', color: event.balance_pending > 0 ? '#DC2626' : '#059669' }}>
                                            Pending: ₹{event.balance_pending}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button onClick={() => handleEdit(event)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            <FaEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
                }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '700px', maxWidth: '90%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

                        {/* Modal Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{editingEvent ? 'Edit Booking' : 'New Booking'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '0 1.5rem' }}>
                            <button
                                onClick={() => setActiveTab('details')}
                                style={{
                                    padding: '1rem',
                                    border: 'none',
                                    borderBottom: activeTab === 'details' ? '2px solid var(--primary)' : '2px solid transparent',
                                    fontWeight: activeTab === 'details' ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    background: 'none'
                                }}
                            >
                                Details
                            </button>
                            {editingEvent && (
                                <button
                                    onClick={() => setActiveTab('payments')}
                                    style={{
                                        padding: '1rem',
                                        border: 'none',
                                        borderBottom: activeTab === 'payments' ? '2px solid var(--primary)' : '2px solid transparent',
                                        fontWeight: activeTab === 'payments' ? 'bold' : 'normal',
                                        cursor: 'pointer',
                                        background: 'none'
                                    }}
                                >
                                    Payments & Balance
                                </button>
                            )}
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div style={{ padding: '2rem', overflowY: 'auto' }}>

                            {activeTab === 'details' && (
                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {/* Client Info */}
                                        <div style={{ gridColumn: '1 / -1', fontWeight: 'bold', marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Client Details</div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                                            <input type="text" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.client_name} onChange={e => setFormData({ ...formData, client_name: e.target.value })} />
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Phone</label>
                                            <input type="text" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.client_phone} onChange={e => setFormData({ ...formData, client_phone: e.target.value })} />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Address</label>
                                            <input type="text" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.client_address} onChange={e => setFormData({ ...formData, client_address: e.target.value })} />
                                        </div>

                                        {/* Event Info */}
                                        <div style={{ gridColumn: '1 / -1', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Event Details</div>
                                        <div style={{ marginBottom: '1rem', gridColumn: '1 / -1' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Select Hall</label>
                                            <select required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.resource_id} onChange={e => setFormData({ ...formData, resource_id: e.target.value })}>
                                                {halls.map(hall => (
                                                    <option key={hall.id} value={hall.id}>{hall.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                                            <input type="date" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} />
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Type</label>
                                            <select style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.event_type} onChange={e => setFormData({ ...formData, event_type: e.target.value })}>
                                                <option value="Wedding">Wedding</option>
                                                <option value="Reception">Reception</option>
                                                <option value="Corporate">Corporate</option>
                                                <option value="Birthday">Birthday</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Start Time</label>
                                            <input type="time" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>End Time</label>
                                            <input type="time" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
                                        </div>

                                        {/* Status & Amount */}
                                        <div style={{ gridColumn: '1 / -1', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Status & Initial Payment</div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Total Amount</label>
                                            <input type="number" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.booked_amount} onChange={e => setFormData({ ...formData, booked_amount: e.target.value })} />
                                        </div>
                                        {!editingEvent && (
                                            <div style={{ marginBottom: '1rem' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Advance Paid</label>
                                                <input type="number" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                    value={formData.advance_amount} onChange={e => setFormData({ ...formData, advance_amount: e.target.value })} />
                                            </div>
                                        )}
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Discount</label>
                                            <input type="number" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} />
                                        </div>
                                        <div style={{ marginBottom: '1rem', gridColumn: '1 / -1' }}>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Status</label>
                                            <select style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                                <option value="blocked">Blocked (Tentative)</option>
                                                <option value="booked">Booked (Confirmed)</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                        <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', border: 'none', background: '#F3F4F6', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                        <button type="submit" style={{ padding: '0.5rem 1rem', border: 'none', background: 'var(--primary)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Save Booking</button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'payments' && editingEvent && (
                                <div>
                                    {/* Summary Card */}
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                                        <div style={{ flex: 1, padding: '1rem', background: '#F3F4F6', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Total Booked Amount</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₹{editingEvent.booked_amount}</div>
                                        </div>
                                        <div style={{ flex: 1, padding: '1rem', background: '#FEECDC', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#92400E' }}>Discount</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#92400E' }}>-₹{editingEvent.discount || 0}</div>
                                        </div>
                                        <div style={{ flex: 1, padding: '1rem', background: '#DEF7EC', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#03543F' }}>Total Received</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#03543F' }}>₹{editingEvent.total_received}</div>
                                        </div>
                                        <div style={{ flex: 1, padding: '1rem', background: '#FDE8E8', borderRadius: '8px' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#9B1C1C' }}>Balance Pending</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#9B1C1C' }}>₹{editingEvent.balance_pending}</div>
                                        </div>
                                    </div>

                                    {/* Add Payment Form */}
                                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add New Payment</h3>
                                    <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Date</label>
                                            <input type="date" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={paymentData.received_date} onChange={e => setPaymentData({ ...paymentData, received_date: e.target.value })} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Amount</label>
                                            <input type="number" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={paymentData.amount_received} onChange={e => setPaymentData({ ...paymentData, amount_received: e.target.value })} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Mode</label>
                                            <select style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                value={paymentData.payment_mode} onChange={e => setPaymentData({ ...paymentData, payment_mode: e.target.value })}>
                                                <option value="cash">Cash</option>
                                                <option value="card">Card</option>
                                                <option value="upi">UPI</option>
                                                <option value="bank_transfer">Bank Transfer</option>
                                                <option value="cheque">Cheque</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <button type="submit" style={{ padding: '0.6rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                                            Add Payment
                                        </button>
                                    </form>

                                    {/* History Table */}
                                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Payment History</h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: '#F9FAFB', textAlign: 'left' }}>
                                                <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>Date</th>
                                                <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>Mode</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map((pay, index) => (
                                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '0.75rem' }}>{pay.received_date}</td>
                                                    <td style={{ padding: '0.75rem' }}>{pay.payment_mode}</td>
                                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' }}>₹{pay.amount_received}</td>
                                                </tr>
                                            ))}
                                            {payments.length === 0 && <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No payments recorded.</td></tr>}
                                        </tbody>
                                        <tfoot>
                                            <tr style={{ fontWeight: 'bold', background: '#F9FAFB' }}>
                                                <td colSpan="2" style={{ padding: '0.75rem', textAlign: 'right' }}>Total:</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{payments.reduce((sum, p) => sum + Number(p.amount_received), 0)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
