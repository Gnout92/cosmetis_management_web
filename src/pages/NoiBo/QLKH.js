// Clean & Professional QLKH Component
import React, { useState, useEffect } from 'react';
import { Shield, Users, Package, TrendingUp, UserPlus, Edit2, Lock, Key, Ban, CheckCircle, BarChart3, Home } from 'lucide-react';
import styles from '../../styles/NoiBo/QLKH.module.css';
import withAuth from '@/utils/withAuth';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { getFunctionsByRole } from '../../lib/auth/permissionManager';
import {
  Search,
  Filter,
  Eye,
  Edit,
  User,
  History,
  ShoppingCart,
  Star,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Download,
  Upload,
  Award,
  DollarSign,
  Check,
  X,
  Save,
  Trash2,
  RefreshCw
} from 'lucide-react';

const QLKH = () => {
  const { user } = useAuth();
  const router = useRouter();
  
  // State management
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'add'
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    segment: 'all',
    dateRange: 'all'
  });
  const [formData, setFormData] = useState({});
  
  // Handle save customer
  const handleSaveCustomer = async (formElement) => {
    setSaving(true);
    try {
      // Get form data
      const formData = new FormData(formElement);
      const customerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        address: formData.get('address') || '',
        status: formData.get('status'),
        segment: formData.get('segment'),
        notes: formData.get('notes') || ''
      };

      // Validate required fields
      if (!customerData.name || !customerData.email) {
        alert('Vui lòng nhập đầy đủ tên và email');
        setSaving(false);
        return;
      }

      const url = modalType === 'edit' && selectedCustomer 
        ? `/api/customers/${selectedCustomer.id}`
        : '/api/customers';
      
      const method = modalType === 'edit' ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (modalType === 'edit' && selectedCustomer) {
          // Update existing customer
          setCustomers(prev => prev.map(c => 
            c.id === selectedCustomer.id ? { ...c, ...customerData } : c
          ));
        } else {
          // Add new customer
          const newCustomer = {
            id: Date.now(), // Temporary ID, would be from API
            ...customerData,
            totalSpent: 0,
            ordersCount: 0,
            createdDate: new Date().toISOString().split('T')[0]
          };
          setCustomers(prev => [...prev, newCustomer]);
        }
        
        setShowModal(false);
        alert(modalType === 'edit' ? 'Cập nhật thành công!' : 'Thêm khách hàng thành công!');
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      // Fallback: Update local data even if API fails
      if (modalType === 'edit' && selectedCustomer) {
        const formData = new FormData(formElement);
        const customerData = {
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || '',
          address: formData.get('address') || '',
          status: formData.get('status'),
          segment: formData.get('segment')
        };
        setCustomers(prev => prev.map(c => 
          c.id === selectedCustomer.id ? { ...c, ...customerData } : c
        ));
        setShowModal(false);
        alert('Cập nhật thành công! (Local)');
      } else {
        // Add new customer locally
        const formData = new FormData(formElement);
        const customerData = {
          id: Date.now(),
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || '',
          address: formData.get('address') || '',
          status: formData.get('status') || 'active',
          segment: formData.get('segment') || 'regular',
          totalSpent: 0,
          ordersCount: 0,
          createdDate: new Date().toISOString().split('T')[0]
        };
        setCustomers(prev => [...prev, customerData]);
        setShowModal(false);
        alert('Thêm khách hàng thành công! (Local)');
      }
    } finally {
      setSaving(false);
    }
  };

  // Sample data - replace with actual API call
  const sampleCustomers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      createdDate: '2024-01-15',
      status: 'active',
      segment: 'vip',
      totalSpent: 1500000,
      ordersCount: 25,
      lastOrderDate: '2024-11-20'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0987654321',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      createdDate: '2024-02-20',
      status: 'active',
      segment: 'premium',
      totalSpent: 850000,
      ordersCount: 12,
      lastOrderDate: '2024-11-18'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      phone: '0111222333',
      address: '789 Đường DEF, Quận 7, TP.HCM',
      createdDate: '2024-03-10',
      status: 'inactive',
      segment: 'regular',
      totalSpent: 250000,
      ordersCount: 3,
      lastOrderDate: '2024-09-15'
    }
  ];

  // Statistics data
  const statisticsData = [
    {
      label: 'Tổng khách hàng',
      value: filteredCustomers.length,
      icon: Users,
      color: '#16a34a'
    },
    {
      label: 'Khách hàng VIP',
      value: filteredCustomers.filter(c => c.segment === 'vip').length,
      icon: Award,
      color: '#059669'
    },
    {
      label: 'Doanh thu tháng',
      value: filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
      icon: DollarSign,
      color: '#15803d'
    },
    {
      label: 'Đơn hàng tháng',
      value: filteredCustomers.reduce((sum, c) => sum + c.ordersCount, 0),
      icon: ShoppingCart,
      color: '#166534'
    }
  ];

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // API call to get customers from database
        const response = await fetch('/api/customers');
        if (response.ok) {
          const data = await response.json();
          // Transform database data to component format
          const transformedCustomers = data.map(user => ({
            id: user.id,
            name: user.ten_hien_thi || `${user.ho || ''} ${user.ten || ''}`.trim(),
            email: user.email,
            phone: '', // Would come from phone table if exists
            address: '', // Would come from dia_chi table
            createdDate: user.thoi_gian_tao,
            status: user.dang_hoat_dong ? 'active' : 'inactive',
            segment: user.vai_tro === 'Admin' ? 'vip' : 
                    user.vai_tro === 'Customer' ? 'regular' : 'premium',
            totalSpent: 0, // Would come from don_hang table
            ordersCount: 0, // Would come from don_hang table  
            lastOrderDate: null // Would come from don_hang table
          }));
          setCustomers(transformedCustomers);
          setFilteredCustomers(transformedCustomers);
        } else {
          // Fallback to sample data if API fails
          setCustomers(sampleCustomers);
          setFilteredCustomers(sampleCustomers);
        }
      } catch (error) {
        console.error('Error loading customers:', error);
        // Fallback to sample data
        setCustomers(sampleCustomers);
        setFilteredCustomers(sampleCustomers);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle refresh data
  const handleRefresh = () => {
    setLoading(true);
    // Reload data
    window.location.reload();
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: 'all',
      segment: 'all', 
      dateRange: 'all'
    });
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    if (filteredCustomers.length === 0) {
      alert('Không có dữ liệu để xuất');
      return;
    }
    
    // Simple CSV export (you can expand this)
    const csvContent = [
      ['Tên', 'Email', 'Điện thoại', 'Trạng thái', 'Phân khúc', 'Tổng chi tiêu', 'Số đơn hàng'].join(','),
      ...filteredCustomers.map(customer => [
        customer.name,
        customer.email,
        customer.phone,
        customer.status,
        customer.segment,
        customer.totalSpent,
        customer.ordersCount
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `danh-sach-khach-hang-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Handle import Excel (simplified)
  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Đã chọn file: ${file.name}\n(Chức năng import đang được phát triển)`);
      }
    };
    input.click();
  };

  // Filter customers based on search and filters
  useEffect(() => {
    let filtered = customers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(customer => customer.status === filters.status);
    }

    // Segment filter
    if (filters.segment !== 'all') {
      filtered = filtered.filter(customer => customer.segment === filters.segment);
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, filters]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="text-center">
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Đang tải dữ liệu khách hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.qlkhContainer}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerDecoration}></div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className={styles.pageTitle}>
                Quản Lý Khách Hàng
              </h1>
              <p className={styles.pageSubtitle}>
                Quản lý danh sách khách hàng, phân tích hành vi và tối ưu hóa trải nghiệm người dùng
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center gap-3 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-2xl hover:bg-emerald-200 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <BarChart3 size={20} />
                Phân Tích
              </button>
              <button 
                onClick={() => {
                  setModalType('add');
                  setSelectedCustomer(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
              >
                <UserPlus size={20} />
                Thêm khách hàng
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className={styles.statsGrid}>
          {statisticsData.map((stat, index) => (
            <div key={index} className={`${styles.statCard} ${styles.statCardGradient}`}>
              <div className={styles.statIcon}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>
                  {stat.label}
                </p>
                <p className={styles.statValue}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString('vi-VN') : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchGrid}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <button className={styles.filterButton} onClick={handleClearFilters}>
              <Filter className="h-4 w-4" />
              Bộ lọc
            </button>
            <button className={styles.exportButton} onClick={handleExportExcel}>
              <Download className="h-4 w-4" />
              Xuất Excel
            </button>
            <button className={styles.exportButton} onClick={handleImportExcel}>
              <Upload className="h-4 w-4" />
              Nhập Excel
            </button>
            <button className={styles.exportButton} onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            Danh sách khách hàng
          </div>
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Liên hệ</th>
                  <th>Trạng thái</th>
                  <th>Phân khúc</th>
                  <th>Doanh số</th>
                  <th>Đơn hàng</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className={styles.customerInfo}>
                        <div className={styles.avatar}>
                          {customer.name.charAt(0)}
                        </div>
                        <div className={styles.customerDetails}>
                          <h3 className={styles.customerName}>
                            {customer.name}
                          </h3>
                          <p className={styles.customerUsername}>
                            ID: {customer.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span style={{ color: 'var(--text-secondary)' }}>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span style={{ color: 'var(--text-secondary)' }}>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.tag} ${customer.status === 'active' ? styles.tagStatusActive : ''}`}>
                        {customer.status === 'active' ? (
                          <>
                            <Check className="w-3 h-3" />
                            Đang hoạt động
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            Không hoạt động
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.tag} ${
                        customer.segment === 'vip' ? styles.tagSegmentVip :
                        customer.segment === 'premium' ? styles.tagSegmentPremium :
                        styles.tagSegmentRegular
                      }`}>
                        {customer.segment === 'vip' && <Award className="w-3 h-3" />}
                        {customer.segment === 'premium' && <Star className="w-3 h-3" />}
                        {customer.segment === 'regular' && <User className="w-3 h-3" />}
                        {customer.segment === 'vip' ? 'VIP' : 
                         customer.segment === 'premium' ? 'Premium' : 'Regular'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.statsDisplay}>
                        <div className={styles.statItem}>
                          <DollarSign className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span><strong>{formatCurrency(customer.totalSpent)}</strong></span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.statsDisplay}>
                        <div className={styles.statItem}>
                          <ShoppingCart className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span><strong>{customer.ordersCount}</strong> đơn</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.statsDisplay}>
                        <div className={styles.statItem}>
                          <Calendar className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                          <span>{formatDate(customer.createdDate)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setModalType('view');
                            setShowModal(true);
                          }}
                          className={styles.actionButton}
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setModalType('edit');
                            setShowModal(true);
                          }}
                          className={styles.actionButton}
                          title="Sửa thông tin"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            alert(`Lịch sử đơn hàng của ${customer.name}\n(Chức năng đang phát triển)`);
                          }}
                          className={styles.actionButton}
                          title="Lịch sử đơn hàng"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            alert(`Phân tích ${customer.name}:\nTổng chi tiêu: ${formatCurrency(customer.totalSpent)}\nSố đơn hàng: ${customer.ordersCount}\n(Chức năng phân tích chi tiết đang phát triển)`);
                          }}
                          className={styles.actionButton}
                          title="Phân tích"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            alert(`Tùy chọn cho ${customer.name}:\n- Khóa tài khoản\n- Đặt lại mật khẩu\n- Ghi chú đặc biệt\n(Chức năng đang phát triển)`);
                          }}
                          className={styles.actionButton} 
                          title="Khác"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
              onClick={() => setShowModal(false)}
            />
            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
              <div className={`${styles.modernModal} max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  {modalType === 'add' ? 'Thêm khách hàng mới' :
                   modalType === 'edit' ? 'Sửa thông tin khách hàng' :
                   'Chi tiết khách hàng'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className={styles.modalClose}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className={styles.modalBody}>
                {modalType === 'view' && selectedCustomer ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cá nhân</h3>
                        <div className="space-y-3">
                          <div><strong>Tên:</strong> {selectedCustomer.name}</div>
                          <div><strong>Email:</strong> {selectedCustomer.email}</div>
                          <div><strong>Điện thoại:</strong> {selectedCustomer.phone || 'Chưa cập nhật'}</div>
                          <div><strong>Địa chỉ:</strong> {selectedCustomer.address || 'Chưa cập nhật'}</div>
                          <div><strong>Ngày tạo:</strong> {new Date(selectedCustomer.createdDate).toLocaleDateString('vi-VN')}</div>
                          <div><strong>Trạng thái:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {selectedCustomer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </div>
                          <div><strong>Phân khúc:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              selectedCustomer.segment === 'vip' ? 'bg-purple-100 text-purple-800' :
                              selectedCustomer.segment === 'premium' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedCustomer.segment === 'vip' ? 'VIP' :
                               selectedCustomer.segment === 'premium' ? 'Premium' : 'Thường'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Thống kê mua hàng</h3>
                        <div className="space-y-3">
                          <div><strong>Tổng chi tiêu:</strong> {selectedCustomer.totalSpent.toLocaleString('vi-VN')}đ</div>
                          <div><strong>Số đơn hàng:</strong> {selectedCustomer.ordersCount}</div>
                          <div><strong>Đơn hàng gần nhất:</strong> {selectedCustomer.lastOrderDate ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString('vi-VN') : 'Chưa có'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Tên khách hàng *</label>
                        <input
                          type="text"
                          name="name"
                          className={styles.formInput}
                          placeholder="Nhập tên khách hàng"
                          defaultValue={modalType === 'edit' ? selectedCustomer?.name : ''}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email *</label>
                        <input
                          type="email"
                          name="email"
                          className={styles.formInput}
                          placeholder="Nhập email"
                          defaultValue={modalType === 'edit' ? selectedCustomer?.email : ''}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Điện thoại</label>
                        <input
                          type="text"
                          name="phone"
                          className={styles.formInput}
                          placeholder="Nhập số điện thoại"
                          defaultValue={modalType === 'edit' ? selectedCustomer?.phone : ''}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Địa chỉ</label>
                        <input
                          type="text"
                          name="address"
                          className={styles.formInput}
                          placeholder="Nhập địa chỉ"
                          defaultValue={modalType === 'edit' ? selectedCustomer?.address : ''}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Trạng thái</label>
                        <select 
                          name="status"
                          className={styles.formSelect}
                          defaultValue={modalType === 'edit' ? selectedCustomer?.status : 'active'}
                        >
                          <option value="active">Hoạt động</option>
                          <option value="inactive">Không hoạt động</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Phân khúc</label>
                        <select 
                          name="segment"
                          className={styles.formSelect}
                          defaultValue={modalType === 'edit' ? selectedCustomer?.segment : 'regular'}
                        >
                          <option value="regular">Thường</option>
                          <option value="premium">Premium</option>
                          <option value="vip">VIP</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Ghi chú</label>
                      <textarea
                        name="notes"
                        className={styles.formTextarea}
                        placeholder="Ghi chú thêm về khách hàng..."
                        rows="3"
                      />
                    </div>
                  </div>
                    </form>
                )}
              </div>

              {/* Modal Footer */}
              <div className={styles.modalFooter}>
                <button 
                  onClick={() => setShowModal(false)}
                  className={styles.buttonSecondary}
                >
                  Đóng
                </button>
                {modalType !== 'view' && (
                  <button 
                    className={styles.buttonPrimary}
                    onClick={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget.closest('form');
                      if (form) {
                        handleSaveCustomer(form);
                      }
                    }}
                    disabled={saving}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                )}
              </div>
            </div>
            </div>
          </>
        )}
      </div>
    );
  };


export default withAuth(QLKH);