import React from 'react';
import Sidebar from './Sidebar';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const Layout = () => {
    const navigate = useNavigate();
    const [centerName, setCenterName] = React.useState('MT Hall');
    const [centerLogo, setCenterLogo] = React.useState('');

    React.useEffect(() => {
        // Load Branding
        const color = localStorage.getItem('center_color');
        const name = localStorage.getItem('center_name');
        const logo = localStorage.getItem('center_logo');

        if (color) {
            document.documentElement.style.setProperty('--primary', color);
            // Optional: Generate a darker variant for hover states if you had a utility for it
            // document.documentElement.style.setProperty('--primary-dark', darken(color)); 
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
            localStorage.clear(); // Clear all auth & branding data
            // Reset theme to default on logout
            document.documentElement.style.removeProperty('--primary');
            navigate('/login');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <Sidebar onLogout={handleLogout} centerName={centerName} centerLogo={centerLogo} />
            <div style={{ flex: 1, marginLeft: '260px' }}>
                <header style={{
                    height: '64px',
                    backgroundColor: 'var(--surface)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 5
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Welcome Back, Admin</h2>
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
                <main style={{ padding: '2rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
