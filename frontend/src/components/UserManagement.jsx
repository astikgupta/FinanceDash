import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { CheckCircle, XCircle, UserCheck, Shield } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const { data } = await userAPI.getUsers();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (id, update) => {
        try {
            const { data } = await userAPI.updateUser(id, update);
            if (data.success) {
                fetchUsers();
            }
        } catch (err) {
            alert('Failed to update user');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Users...</div>;

    return (
        <div className="user-management-screen fade-in mt-8">
            <div className="card p-0 overflow-hidden shadow-2xl">
                <div className="card-header p-8 border-b border-white/5 bg-white/5">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Shield className="text-purple-400" />
                        User Management
                    </h3>
                    <p className="text-gray-400 mt-2">Manage access levels and account status</p>
                </div>
                <div className="table-responsive p-4">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td className="font-medium text-white">{u.name}</td>
                                    <td className="text-gray-400">{u.email}</td>
                                    <td>
                                        <select 
                                            value={u.role} 
                                            onChange={(e) => handleUpdateUser(u._id, { role: e.target.value })}
                                            className="bg-slate-800 border-slate-700 text-sm py-1 px-3"
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Analyst">Analyst</option>
                                            <option value="Viewer">Viewer</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className={`badge flex items-center gap-2 w-max ${u.status === 'Active' ? 'active' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                                            {u.status === 'Active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            {u.status}
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => handleUpdateUser(u._id, { status: u.status === 'Active' ? 'Inactive' : 'Active' })}
                                            className={`flex items-center gap-2 text-sm font-semibold transition-colors duration-200 ${u.status === 'Active' ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                                        >
                                            <UserCheck size={16} />
                                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
