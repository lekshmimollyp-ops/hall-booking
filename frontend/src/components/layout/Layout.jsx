import React from 'react';
import Sidebar from './Sidebar';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const Layout = () => {
    const navigate = useNavigate();
    const [centerName, setCenterName] = React.useState('MT Hall');
    const [centerLogo, setCenterLogo] = React.useState('');
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setMobileOpen(false); // Reset on desktop
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        // Load Branding
        const color = localStorage.getItem('center_color');
        const name = localStorage.getItem('center_name');
        const logo = localStorage.getItem('center_logo');

        if (color) {
            document.documentElement.style.setProperty('--primary', color);
        }
        if (name) setCenterName(name);
        if (logo) setCenterLogo(logo);
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (e) {
            console.error(e);
        } finally {
            localStorage.clear();
            document.documentElement.style.removeProperty('--primary');
            navigate('/login');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)', position: 'relative' }}>
            <Sidebar
                onLogout={handleLogout}
                centerName={centerName}
                centerLogo={centerLogo}
                isMobile={isMobile}
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            {/* Mobile Overlay */}
            {isMobile && mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 9
                    }}
                />
            )}

            <div style={{ flex: 1, marginLeft: isMobile ? 0 : '260px', width: '100%', transition: 'margin-left 0.3s ease' }}>
                <header style={{
                    height: '64px',
                    backgroundColor: 'var(--surface)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1rem', // Reduced padding for mobile
                    position: 'sticky',
                    top: 0,
                    zIndex: 5
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {isMobile && (
                            <button
                                onClick={() => setMobileOpen(true)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--text-main)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                &#9776; {/* Hamburger Icon */}
                            </button>
                        )}
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {isMobile ? 'Dashboard' : 'Welcome Back, Admin'}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                            fontWeight: 'bold'
                        }}>AU</div>
                    </div>
                </header>
                <main style={{ padding: isMobile ? '1rem' : '2rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
