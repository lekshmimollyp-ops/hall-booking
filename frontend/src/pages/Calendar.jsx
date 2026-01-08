import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        fetchEvents();
    }, [year, month]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const start = new Date(year, month, 1).toLocaleDateString('en-CA');
            const end = new Date(year, month + 1, 0).toLocaleDateString('en-CA');

            const res = await axios.get(`/api/events?start_date=${start}&end_date=${end}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(res.data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

    // Calendar Grid Logic
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    const days = [];
    // Empty cells for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const getEventsForDay = (day) => {
        if (!day) return [];
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => e.event_date === dateStr);
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Event Calendar</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
                    <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><FaChevronLeft /></button>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, minWidth: '150px', textAlign: 'center' }}>
                        {monthNames[month]} {year}
                    </span>
                    <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><FaChevronRight /></button>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                {/* Weekday Headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#F9FAFB', borderBottom: '1px solid var(--border)' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>{day}</div>
                    ))}
                </div>

                {/* Days Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderLeft: '1px solid var(--border)' }}>
                    {days.map((day, index) => (
                        <div key={index} style={{
                            minHeight: '120px',
                            padding: '0.5rem',
                            borderRight: '1px solid var(--border)',
                            borderBottom: '1px solid var(--border)',
                            backgroundColor: day ? 'white' : '#F9FAFB'
                        }}>
                            {day && (
                                <>
                                    <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{day}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {getEventsForDay(day).map(ev => (
                                            <div key={ev.id} style={{
                                                fontSize: '0.75rem',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                backgroundColor: ev.status === 'booked' ? '#D1FAE5' : '#FEE2E2',
                                                color: ev.status === 'booked' ? '#065F46' : '#991B1B',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                cursor: 'pointer'
                                            }} title={`${ev.event_type} - ${ev.client?.name || 'Unknown Client'}`}>
                                                {ev.start_time.slice(0, 5)} {ev.event_type}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#D1FAE5', borderRadius: '2px' }}></span> Booked
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#FEE2E2', borderRadius: '2px' }}></span> Blocked/Tentative
                </div>
            </div>
        </div>
    );
};

export default Calendar;
