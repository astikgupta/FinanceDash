import React, { useState } from 'react';
import { recordAPI } from '../services/api';
import { X } from 'lucide-react';

const AddRecordModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await recordAPI.createRecord({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      if (response.data.success) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal card relative flex flex-col gap-10">
        <button 
          onClick={onClose} 
          className="btn-close absolute top-5 right-5"
        >
          <X size={20} />
        </button>
        <h3 className="text-2xl font-bold">Add New Record</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="form-group flex flex-col gap-4">
            <label className="text-sm font-semibold">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g., 50.00"
              required
            />
          </div>
          <div className="form-group flex flex-col gap-4">
            <label className="text-sm font-semibold">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group flex flex-col gap-4">
            <label className="text-sm font-semibold tracking-wide">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Food, Salary..."
              required
            />
          </div>
          <div className="form-group flex flex-col gap-4">
            <label className="text-sm font-semibold">Notes</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Optional notes"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="modal-actions flex justify-end gap-4 mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;
