import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';
import Clients from './pages/Clients';
import Calendar from './pages/Calendar';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Events from './pages/Events';
import Settings from './pages/Settings';
import Finances from './pages/Finances';
import Expenses from './pages/Expenses';
import './App.css';

function App() {
  React.useEffect(() => {
    const primary = localStorage.getItem('center_color');
    const background = localStorage.getItem('center_bg');
    const font = localStorage.getItem('center_font');

    if (primary) document.documentElement.style.setProperty('--primary', primary);
    if (background) document.documentElement.style.setProperty('--background', background);
    if (font) document.documentElement.style.setProperty('--text-main', font);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/events" element={<Events />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
