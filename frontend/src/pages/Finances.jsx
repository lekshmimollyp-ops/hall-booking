import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyBillWave, FaDownload } from 'react-icons/fa';

const Finances = () => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [incRes, expRes] = await Promise.all([
                    axios.get('/api/incomes', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/expenses', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setIncomes(incRes.data);
                setExpenses(expRes.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount_received), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const netProfit = totalIncome - totalExpense;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Finances</h1>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#DEF7EC', padding: '1rem', borderRadius: '50%', color: '#03543F' }}>
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Income</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#03543F' }}>₹{totalIncome.toLocaleString()}</div>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#FDE8E8', padding: '1rem', borderRadius: '50%', color: '#9B1C1C' }}>
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Expenses</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9B1C1C' }}>₹{totalExpense.toLocaleString()}</div>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: netProfit >= 0 ? '#E1EFFE' : '#FDE8E8', padding: '1rem', borderRadius: '50%', color: netProfit >= 0 ? '#1A56DB' : '#9B1C1C' }}>
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Net Profit</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: netProfit >= 0 ? '#1A56DB' : '#9B1C1C' }}>
                            {netProfit >= 0 ? '+' : ''}₹{netProfit.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>Income Ledger</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Event Info</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Mode</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomes.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>{item.received_date}</td>
                                <td style={{ padding: '1rem' }}>
                                    {item.event ? (
                                        <>
                                            <div style={{ fontWeight: 500 }}>{item.event.event_type}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.event.event_date}</div>
                                        </>
                                    ) : 'N/A'}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '0.25rem 0.5rem', background: '#F3F4F6', borderRadius: '4px', fontSize: '0.875rem' }}>
                                        {item.payment_mode}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#03543F' }}>
                                    +₹{item.amount_received}
                                </td>
                            </tr>
                        ))}
                        {incomes.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No income records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Finances;
