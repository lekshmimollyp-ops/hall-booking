import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPrint, FaTable } from 'react-icons/fa';

const Reports = () => {
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [eventStats, setEventStats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterType, setFilterType] = useState('year'); // 'all', 'year', 'month', 'custom'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const calculateDateRange = (type) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        if (type === 'year') {
            return {
                start: `${year}-01-01`,
                end: `${year}-12-31`
            };
        } else if (type === 'month') {
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 0);

            // Format as YYYY-MM-DD manually to avoid timezone issues
            const formatDate = (d) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
            };

            return { start: formatDate(start), end: formatDate(end) };
        }
        return { start: '', end: '' }; // All time
    };

    useEffect(() => {
        // Init default range (This Year)
        const { start, end } = calculateDateRange('year');
        setStartDate(start);
        setEndDate(end);
        // fetchReports will trigger via dependency array
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            let query = '';
            if (filterType !== 'all') {
                if (startDate && endDate) {
                    query = `?start_date=${startDate}&end_date=${endDate}`;
                }
            }

            const [monthRes, catRes, evtRes] = await Promise.all([
                axios.get(`/api/reports/monthly${query}`, { headers }),
                axios.get(`/api/reports/categories${query}`, { headers }),
                axios.get(`/api/reports/events${query}`, { headers })
            ]);

            setMonthlyStats(monthRes.data);
            setCategoryStats(catRes.data);
            setEventStats(evtRes.data);
        } catch (error) {
            console.error("Failed to load reports", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch only if not custom, OR if custom and both dates are set
        if (filterType !== 'custom' || (startDate && endDate)) {
            fetchReports();
        }
    }, [filterType, startDate, endDate]);

    const handleFilterChange = (type) => {
        setFilterType(type);
        if (type === 'custom') return;

        const { start, end } = calculateDateRange(type);
        setStartDate(start);
        setEndDate(end);
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading && !monthlyStats.length) return <div>Loading Reports...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Reports & Analytics</h1>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                        value={filterType}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', cursor: 'pointer' }}
                    >
                        <option value="all">All Time</option>
                        <option value="year">This Year</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom Range</option>
                    </select>

                    {filterType === 'custom' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ padding: '0.4rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                            />
                            <span style={{ color: '#666' }}>-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ padding: '0.4rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                            />
                            <button
                                onClick={fetchReports}
                                style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                            >
                                Apply
                            </button>
                        </div>
                    )}

                    <button
                        onClick={handlePrint}
                        style={{
                            backgroundColor: 'white',
                            color: 'var(--text-main)',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginLeft: '1rem'
                        }}
                    >
                        <FaPrint /> Print
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Monthly Breakdown */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaTable /> Monthly Financial Breakdown
                        {startDate && endDate && <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#666', marginLeft: 'auto' }}>({startDate} to {endDate})</span>}
                    </h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#F9FAFB' }}>
                            <tr>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Month</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Events</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#03543F' }}>Income</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: '#9B1C1C' }}>Expense</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>Net Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyStats.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.75rem' }}>{item.month}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        <span style={{
                                            backgroundColor: '#EEF2FF',
                                            color: '#4F46E5',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                            {item.event_count || 0}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{Number(item.income).toLocaleString()}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{Number(item.expense).toLocaleString()}</td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: item.profit >= 0 ? '#03543F' : '#9B1C1C' }}>
                                        ₹{Number(item.profit).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {monthlyStats.length === 0 && <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>No data available for this period</td></tr>}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    {/* Expense Breakdown */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Expense by Category</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#F9FAFB' }}>
                                <tr>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Category</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>Total Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryStats.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '0.75rem' }}>{item.name}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{Number(item.total).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {categoryStats.length === 0 && <tr><td colSpan="2" style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>No expenses recorded</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    {/* Event Performance */}
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Event Profitability</span>
                            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'normal' }}>
                                Total Events: <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                    {eventStats.reduce((sum, item) => sum + Number(item.count), 0)}
                                </span>
                            </span>
                        </h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#F9FAFB' }}>
                                <tr>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Type</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600 }}>Count</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>Avg Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventStats.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '0.75rem' }}>{item.event_type}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.count}</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{Number(item.avg_revenue).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    </tr>
                                ))}
                                {eventStats.length === 0 && <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>No events recorded</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Reports;
