import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Filter, Shield, UserCheck, UserX, Trash2, 
  Edit2, Mail, Calendar, Award, TrendingUp, ChevronLeft, 
  ChevronRight, Eye, Download, RefreshCw, Crown, 
  Star, User as UserIcon, Activity, Clock, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { isAdmin, user: currentUser } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setTimeout(() => setRefreshing(false), 1000);
    toast.success('Users refreshed!');
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRole('all');
    setFilterStatus('all');
    setShowFilters(false);
  };

  const updateUserRole = async (userId, role) => {
    try {
      await api.put(`/api/users/${userId}`, { role });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await api.put(`/api/users/${userId}`, { status });
      toast.success(`User ${status === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    if (userId === currentUser?.id) {
      toast.error('You cannot delete your own account');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/api/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'analyst': return <Star className="w-4 h-4 text-blue-500" />;
      default: return <UserIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': 
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800">Admin</span>;
      case 'analyst': 
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800">Analyst</span>;
      default: 
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Viewer</span>;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'analyst': return 'bg-gradient-to-r from-blue-400 to-indigo-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = users.filter(u => u.status === 'inactive').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const analystUsers = users.filter(u => u.role === 'analyst').length;
    const viewerUsers = users.filter(u => u.role === 'viewer').length;
    
    return { totalUsers, activeUsers, inactiveUsers, adminUsers, analystUsers, viewerUsers };
  };

  const stats = getStats();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 bg-white rounded-xl border border-gray-200 hover:border-indigo-500 transition-all duration-300"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm opacity-90">Total Users</p>
              <p className="text-white text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <UserIcon className="w-8 h-8 text-white opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm opacity-90">Active</p>
              <p className="text-white text-2xl font-bold">{stats.activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-white opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm opacity-90">Inactive</p>
              <p className="text-white text-2xl font-bold">{stats.inactiveUsers}</p>
            </div>
            <UserX className="w-8 h-8 text-white opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm opacity-90">Admins</p>
              <p className="text-white text-2xl font-bold">{stats.adminUsers}</p>
            </div>
            <Crown className="w-8 h-8 text-white opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm opacity-90">Analysts</p>
              <p className="text-white text-2xl font-bold">{stats.analystUsers}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-white opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm opacity-90">Viewers</p>
              <p className="text-white text-2xl font-bold">{stats.viewerUsers}</p>
            </div>
            <Eye className="w-8 h-8 text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filterRole !== 'all' || filterStatus !== 'all') && (
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            )}
          </button>
          
          {(searchTerm || filterRole !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="analyst">Analyst</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                currentItems.map((user, index) => (
                  <tr 
                    key={user._id} 
                    className={`hover:bg-indigo-50 transition-colors duration-200 cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDetailsModal(true);
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center ${getRoleColor(user.role)}`}>
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                            {user._id === currentUser?.id && (
                              <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">You</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {getRoleIcon(user.role)}
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="analyst">Analyst</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={user.status}
                        onChange={(e) => updateUserStatus(user._id, e.target.value)}
                        className={`text-sm px-3 py-1 rounded-full font-medium border-0 cursor-pointer ${getStatusColor(user.status)}`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          disabled={user._id === currentUser?.id}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user._id === currentUser?.id 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={user._id === currentUser?.id ? 'Cannot delete your own account' : 'Delete User'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg transition-all ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-200 hover:border-indigo-500'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full animate-fadeIn">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r flex items-center justify-center ${getRoleColor(selectedUser.role)}`}>
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  {selectedUser._id === currentUser?.id && (
                    <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Current User</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Role</span>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(selectedUser.role)}
                    <span className="text-sm font-medium capitalize text-gray-900">{selectedUser.role}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">User ID</span>
                  <span className="text-xs font-mono text-gray-500">{selectedUser._id}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Joined</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedUser._id !== currentUser?.id && (
              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    deleteUser(selectedUser._id);
                    setShowDetailsModal(false);
                  }}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete User
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;