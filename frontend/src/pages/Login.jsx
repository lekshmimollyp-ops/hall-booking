import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/api/login', { email, password });
            const { token, center } = response.data;
            localStorage.setItem('token', token);

            // Store Branding Details
            if (center) {
                localStorage.setItem('center_name', center.name || 'HallBooking');
                localStorage.setItem('center_logo', center.logo_url || '');
                localStorage.setItem('center_color', center.primary_color || '#4F46E5');
                localStorage.setItem('center_id', center.id); // For API requests if needed
            }

            navigate('/dashboard');
        } catch (err) {
            console.error('Login Error Full:', err);
            console.log('Response Status:', err.response?.status);
            console.log('Response Data:', err.response?.data);
            setError(err.response?.data?.message || err.message || 'Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1a1a1a' }}>MT Hall</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a4a4a' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a4a4a' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                            required
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
