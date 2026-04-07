import React from 'react';
import { Search, Filter, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TransactionTable = ({ transactions, filters, setFilters, onDelete }) => {
  const { isAnalyst } = useAuth();
  const [showFilters, setShowFilters] = React.useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <div className="mobile-only mb-4">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="btn-filter w-full flex items-center justify-center gap-2"
        >
          <Filter size={18} />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      <div className={`filter-wrapper ${showFilters ? 'show' : ''}`}>
        <div className="filter-bar flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="search"
              placeholder="Search records..."
              value={filters.search}
              onChange={handleFilterChange}
              className="pl-10 w-full"
            />
          </div>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="filter-date"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="filter-date"
          />
        </div>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              {isAnalyst && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx._id}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.category || 'Other'}</td>
                <td>
                  <span className={`type-badge ${tx.type}`}>
                    {tx.type}
                  </span>
                </td>
                <td style={{ color: tx.type === 'income' ? '#10b981' : '#f43f5e' }}>
                  ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                {isAnalyst && (
                  <td>
                    <button 
                      onClick={() => onDelete(tx._id)}
                      className="btn-danger p-2"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={isAnalyst ? 5 : 4} className="text-center py-8 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
