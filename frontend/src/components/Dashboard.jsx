import React, { useState, useEffect } from 'react';
import { dashboardAPI, recordAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Wallet, Plus, Filter } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import TransactionTable from './TransactionTable';
import AddRecordModal from './AddRecordModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user, isAnalyst } = useAuth();
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    startDate: '',
    endDate: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await dashboardAPI.getStats(filters);
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filters]);

  if (loading && !stats) return <div className="p-8 text-center">Loading Dashboard...</div>;

  const summary = stats?.summary || { totalIncome: 0, totalExpense: 0, netBalance: 0 };
  const monthlyTrends = stats?.monthlyTrends || [];
  const categoryStats = stats?.categoryStats || [];
  const recentTransactions = stats?.recentTransactions || [];

  // Chart Data Preparation
  const trendLabels = [...new Set(monthlyTrends.map(t => `${t._id.month}/${t._id.year}`))];
  const lineData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Income',
        data: trendLabels.map(label => {
          const entry = monthlyTrends.find(t => `${t._id.month}/${t._id.year}` === label && t._id.type === 'income');
          return entry ? entry.total : 0;
        }),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: trendLabels.map(label => {
          const entry = monthlyTrends.find(t => `${t._id.month}/${t._id.year}` === label && t._id.type === 'expense');
          return entry ? entry.total : 0;
        }),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const donutData = {
    labels: categoryStats.map(s => s._id || 'Other'),
    datasets: [{
      data: categoryStats.map(s => s.total),
      backgroundColor: ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="dashboard-content fade-in">
      <div className="dashboard-grid mt-12 gap-10">
        <div className="card stat-card income slide-up">
          <div className="icon">💰</div>
          <div className="stat-info">
            <p>Total Income</p>
            <h2>₹{summary.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          </div>
        </div>
        <div className="card stat-card expense slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="icon">💸</div>
          <div className="stat-info">
            <p>Total Expenses</p>
            <h2>₹{summary.totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          </div>
        </div>
        <div className="card stat-card balance slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="icon">🏦</div>
          <div className="stat-info">
            <p>Net Balance</p>
            <h2>₹{summary.netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          </div>
        </div>
      </div>

      <div className="charts-wrapper mt-8">
        <div className="card charts-section slide-up" style={{ animationDelay: '0.3s' }}>
          <h3>Financial Trends</h3>
          <div className="chart-container">
            <Line 
              data={lineData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top', labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 }, usePointStyle: true, padding: 20 } }
                },
                scales: { 
                  y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                  x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
              }} 
            />
          </div>
        </div>
        <div className="card charts-section slide-up" style={{ animationDelay: '0.4s' }}>
          <h3>Category Breakdown</h3>
          <div className="chart-container doughnut-container">
            <Doughnut 
              data={donutData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20, usePointStyle: true, font: { family: 'Outfit', size: 11 } } },
                  tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: 12, displayColors: false }
                },
                cutout: '70%'
              }} 
            />
          </div>
        </div>
      </div>

      <div className="card mt-8 p-0 overflow-hidden">
        <div className="card-header flex justify-between items-center p-6 border-b border-white/10">
          <h3>Recent Transactions</h3>
          <div className="flex gap-4">
            {isAnalyst && (
              <button 
                className="btn-primary flex items-center gap-2"
                onClick={() => setShowModal(true)}
              >
                <Plus size={18} />
                <span>Add Record</span>
              </button>
            )}
          </div>
        </div>
        
        <TransactionTable 
          transactions={recentTransactions} 
          filters={filters}
          setFilters={setFilters}
          onDelete={async (id) => {
            if (window.confirm('Delete this record?')) {
              await recordAPI.deleteRecord(id);
              fetchStats();
            }
          }}
        />
      </div>

      {showModal && (
        <AddRecordModal 
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
