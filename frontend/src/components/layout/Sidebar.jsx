import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaHome,
    FaCalendarAlt,
    FaUsers,
    FaMoneyBillWave,
    FaChartBar,
    FaCogs,
    FaSignOutAlt,
    FaReceipt,
    FaBell
} from 'react-icons/fa';

const Sidebar = ({ onLogout, centerName, centerLogo, isMobile, isOpen, onClose }) => {
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { path: '/settings', label: 'Settings', icon: <FaCogs /> },
        { path: '/users', label: 'Users', icon: <FaUsers /> },
        { path: '/events', label: 'Events', icon: <FaCalendarAlt /> },
        { path: '/calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
        { path: '/clients', label: 'Clients', icon: <FaUsers /> },
        { path: '/expenses', label: 'Expenses', icon: <FaReceipt /> },
        { path: '/finances', label: 'Finances', icon: <FaMoneyBillWave /> },
        { path: '/reports', label: 'Reports', icon: <FaChartBar /> },
        { path: '/notifications', label: 'Notifications', icon: <FaBell /> },
    ];

    const sidebarStyle = {
        width: '260px',
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        transition: 'transform 0.3s ease-in-out',
        transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
        boxShadow: isMobile && isOpen ? '4px 0 24px rgba(0,0,0,0.1)' : 'none'
    };

    return (
        <aside style={sidebarStyle}>
            <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                    {centerLogo ? (
                        <img src={centerLogo} alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'contain' }} />
                    ) : (
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: 'var(--primary)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            flexShrink: 0
                        }}>{centerName.substring(0, 2).toUpperCase()}</div>
                    )}
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{centerName}</span>
                </div>
                {isMobile && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.25rem',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        &#10005;
                    </button>
                )}
            </div>

            <nav style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                onClick={() => isMobile && onClose()}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius)',
                                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                    backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                                    fontWeight: isActive ? 600 : 500,
                                    transition: 'all 0.2s'
                                })}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <button
                    onClick={onLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: 'none',
                        backgroundColor: '#FEF2F2',
                        color: 'var(--danger)',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#FEE2E2'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#FEF2F2'}
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
