import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaCheckDouble } from 'react-icons/fa';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data.data);
        } catch (error) {
            console.error("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications(); // Refresh
        } catch (error) {
            console.error(error);
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/notifications/read-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading Notifications...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Notifications</h1>
                <button
                    onClick={markAllRead}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                >
                    <FaCheckDouble /> Mark All Read
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.map(notif => (
                    <div key={notif.id} style={{
                        backgroundColor: notif.read_at ? 'white' : '#F0F9FF',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius)',
                        boxShadow: 'var(--shadow-sm)',
                        borderLeft: notif.read_at ? 'none' : '4px solid var(--primary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                {notif.data.message}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>
                                {new Date(notif.created_at).toLocaleString()}
                            </div>
                        </div>
                        {!notif.read_at && (
                            <button
                                onClick={() => markAsRead(notif.id)}
                                style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', background: 'white' }}
                            >
                                Mark Read
                            </button>
                        )}
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666', background: 'white', borderRadius: 'var(--radius)' }}>
                        No notifications found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
