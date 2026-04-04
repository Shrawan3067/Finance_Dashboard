import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Edit2, Trash2, Search, Filter, X, Calendar, 
  DollarSign, Tag, Type, FileText, ArrowUpDown, 
  Download, ChevronLeft, ChevronRight, Eye 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const { isAnalyst } = useAuth();

  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterAndSortTransactions();
  }, [transactions, searchTerm, filterType, filterCategory, sortBy, sortOrder]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/api/transactions');
      setTransactions(response.data.transactions);
      setFilteredTransactions(response.data.transactions);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.transactions.map(t => t.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch(sortBy) {
        case 'date':
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
        case 'category':
          aVal = a.category;
          bVal = b.category;
          break;
        default:
          aVal = new Date(a.date);
          bVal = new Date(b.date);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await api.put(`/api/transactions/${editingTransaction._id}`, formData);
        toast.success('Transaction updated successfully');
      } else {
        await api.post('/api/transactions', formData);
        toast.success('Transaction created successfully');
      }
      fetchTransactions();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/api/transactions/${id}`);
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const openModal = (transaction = null) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date.split('T')[0],
        description: transaction.description || ''
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  const exportToCSV = () => {
    const csvData = filteredTransactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Description: t.description || '-',
      Category: t.category,
      Type: t.type,
      Amount: t.amount
    }));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(csvData[0]).join(",") + "\n"
      + csvData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Transactions exported successfully!');
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const getTotalStats = () => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Transactions
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all your financial activities</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          {isAnalyst && (
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 shadow-lg">
          <p className="text-white text-sm opacity-90">Total Income</p>
          <p className="text-white text-2xl font-bold">${stats.totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-4 shadow-lg">
          <p className="text-white text-sm opacity-90">Total Expenses</p>
          <p className="text-white text-2xl font-bold">${stats.totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-4 shadow-lg">
          <p className="text-white text-sm opacity-90">Net Balance</p>
          <p className="text-white text-2xl font-bold">${stats.balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-indigo-500 transition-all flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          
          {(searchTerm || filterType !== 'all' || filterCategory !== 'all') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-slideDown">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <select
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <div className="flex space-x-2">
                <select
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border-2 border-gray-200 rounded-xl hover:border-indigo-500 transition-all"
                >
                  <ArrowUpDown className={`w-5 h-5 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.map((transaction, index) => (
                <tr 
                  key={transaction._id} 
                  className={`hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setShowDetailsModal(true);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(transaction.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.description || 'No description'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowDetailsModal(true);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAnalyst && (
                        <>
                          <button
                            onClick={() => openModal(transaction)}
                            className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction._id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border-2 border-gray-200 rounded-lg hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border-2 border-gray-200 rounded-lg hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform animate-slideUp">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    required
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Food, Rent, Salary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    required
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105">
                  {editingTransaction ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Transaction Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Amount</span>
                <span className={`text-2xl font-bold ${
                  selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTransaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedTransaction.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{selectedTransaction.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">
                  {new Date(selectedTransaction.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {selectedTransaction.description && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Description</span>
                  <span className="font-medium text-right max-w-[200px]">{selectedTransaction.description}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Transactions;