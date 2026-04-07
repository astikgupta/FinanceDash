import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header>
            <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                Finance<span>Dash</span>
            </div>
            <nav className="main-nav">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end
                >
                    <button className="flex items-center gap-2">
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </button>
                </NavLink>
                {isAdmin && (
                  <NavLink 
                    to="/users" 
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                      <button className="flex items-center gap-2">
                          <Users size={18} />
                          <span>Manage Users</span>
                      </button>
                  </NavLink>
                )}
            </nav>
            <div className="user-info">
                <div className="profile-pill">
                    <User size={16} className="avatar-icon" />
                    <span id="user-name">{user?.name} ({user?.role})</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="logout-icon-btn" 
                  title="Logout"
                >
                    <LogOut size={16} />
                    <span>Exit</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
