import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaShoppingCart, FaCalendarCheck, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
    <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        border: '1px solid var(--border)'
    }}>
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: color + '20', // 20% opacity
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
        }}>
            {icon}
        </div>
        <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</p>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [navigate]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading stats...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.5rem' }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard
                    title="Monthly Income"
                    value={`$${stats?.monthly_income || 0}`}
                    icon={<FaWallet />}
                    color="var(--success)"
                />
                <StatCard
                    title="Monthly Expenses"
                    value={`$${stats?.monthly_expense || 0}`}
                    icon={<FaShoppingCart />}
                    color="var(--danger)"
                />
                <StatCard
                    title="Net Profit"
                    value={`$${stats?.profit || 0}`}
                    icon={<FaChartLine />}
                    color="var(--primary)"
                />
                <StatCard
                    title="Upcoming Events"
                    value={stats?.upcoming_events || 0}
                    icon={<FaCalendarCheck />}
                    color="var(--warning)"
                />
                <StatCard
                    title="Total Events"
                    value={stats?.total_events || 0}
                    icon={<FaCalendarAlt />}
                    color="#8B5CF6"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Recent Events</h3>
                    {stats?.recent_events?.length > 0 ? (
                        <ul style={{ listStyle: 'none' }}>
                            {stats.recent_events.map(event => (
                                <li key={event.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 500 }}>{event.event_type || 'Event'}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{event.event_date}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>No recent events found.</p>
                    )}
                </div>

                <div style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Events by Type</h3>
                    {stats?.events_by_type?.length > 0 ? (
                        <ul style={{ listStyle: 'none' }}>
                            {stats.events_by_type.map(type => (
                                <li key={type.event_type} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 500 }}>{type.event_type}</span>
                                    <span style={{
                                        backgroundColor: '#EEF2FF',
                                        color: '#4F46E5',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}>
                                        {type.count}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>No events recorded.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
