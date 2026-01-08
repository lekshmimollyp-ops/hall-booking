import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const [formData, setFormData] = useState({
        expense_date: new Date().toISOString().split('T')[0],
        amount: '',
        category_id: '',
        event_id: '',
        description: ''
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [expRes, catRes, evtRes] = await Promise.all([
                axios.get('/api/expenses', { headers }),
                axios.get('/api/expense-categories', { headers }),
                axios.get('/api/events', { headers })
            ]);

            setExpenses(expRes.data);
            setCategories(catRes.data);
            setEvents(evtRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = () => {
        setEditingExpense(null);
        setFormData({
            expense_date: new Date().toISOString().split('T')[0],
            amount: '',
            category_id: categories.length > 0 ? categories[0].id : '',
            event_id: '',
            description: ''
        });
        setShowModal(true);
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        setFormData({
            expense_date: expense.expense_date,
            amount: expense.amount,
            category_id: expense.category_id,
            event_id: expense.event_id || '',
            description: expense.description || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/expenses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to delete expense');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                event_id: formData.event_id || null // Ensure null if empty string
            };

            if (editingExpense) {
                await axios.put(`/api/expenses/${editingExpense.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/expenses', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to save expense');
        }
    };

    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Expenses</h1>
                <button
                    onClick={handleCreate}
                    style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <FaPlus /> Add Expense
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#FDE8E8', padding: '1rem', borderRadius: '50%', color: '#9B1C1C' }}>
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Expenses</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9B1C1C' }}>₹{totalExpense.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Category</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Description</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Related Event</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Amount</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>{item.expense_date}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '0.25rem 0.5rem', background: '#F3F4F6', borderRadius: '4px', fontSize: '0.875rem' }}>
                                        {item.category?.name}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{item.description || '-'}</td>
                                <td style={{ padding: '1rem' }}>
                                    {item.event ? (
                                        <div style={{ fontSize: '0.875rem' }}>
                                            <div style={{ fontWeight: 500 }}>{item.event.event_type}</div>
                                            <div style={{ color: 'var(--text-muted)' }}>{item.event.event_date}</div>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>General</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#9B1C1C' }}>
                                    -₹{item.amount}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => handleEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginRight: '1rem' }}>
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {expenses.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No expense records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50
                }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                                <input type="date" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    value={formData.expense_date} onChange={e => setFormData({ ...formData, expense_date: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category</label>
                                <select required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount</label>
                                <input type="number" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Link to Event (Optional)</label>
                                <select style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    value={formData.event_id} onChange={e => setFormData({ ...formData, event_id: e.target.value })}>
                                    <option value="">-- General Expense --</option>
                                    {events.map(ev => (
                                        <option key={ev.id} value={ev.id}>{ev.event_type} - {ev.event_date}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                                <textarea rows="3" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                <button type="button" onClick={() => setShowModal(false)}
                                    style={{ padding: '0.5rem 1rem', border: 'none', background: '#F3F4F6', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit"
                                    style={{ padding: '0.5rem 1rem', border: 'none', background: 'var(--primary)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Save Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
