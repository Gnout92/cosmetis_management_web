import React, { useState, useEffect } from 'react';
import styles from '../../../styles/NoiBo/QLBH.module.css';

const QLBH = () => {
  // State chính
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    price: '',
    costPrice: '',
    category: '',
    brand: '',
    unit: '',
    description: '',
    stock: '',
    color: '',
    skinType: '',
    volume: '',
    image: ''
  });

  const [orderForm, setOrderForm] = useState({
    customerId: '',
    items: [],
    total: '',
    paymentMethod: 'cash',
    status: 'pending',
    shippingAddress: '',
    phone: ''
  });

  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    skinType: '',
    notes: '',
    tier: 'bronze'
  });

  // Load initial data
  useEffect(() => {
    // Load sample data
    setProducts([
      {
        id: 1,
        name: 'Kem dưỡng ẩm Eucerin',
        sku: 'EUCH001',
        price: 450000,
        costPrice: 300000,
        category: 'Kem dưỡng',
        brand: 'Eucerin',
        unit: 'hộp',
        stock: 25,
        color: 'Trắng',
        skinType: 'Da khô',
        volume: '50ml',
        description: 'Kem dưỡng ẩm chuyên sâu cho da khô và nhạy cảm'
      },
      {
        id: 2,
        name: 'Sữa rửa mặt CeraVe',
        sku: 'CERV001',
        price: 280000,
        costPrice: 180000,
        category: 'Sữa rửa mặt',
        brand: 'CeraVe',
        unit: 'chai',
        stock: 12,
        color: 'Xanh lá',
        skinType: 'Da hỗn hợp',
        volume: '473ml',
        description: 'Sữa rửa mặt làm sạch nhẹ nhàng, không gây khô da'
      }
    ]);

    setOrders([
      {
        id: 'ORD001',
        customerName: 'Nguyễn Thị Lan',
        customerPhone: '0901234567',
        items: ['Kem dưỡng ẩm Eucerin (2x)', 'Sữa rửa mặt CeraVe (1x)'],
        total: 1180000,
        status: 'processing',
        paymentMethod: 'transfer',
        date: '2025-11-18',
        address: '123 Nguyễn Văn Cừ, Q1, TP.HCM'
      },
      {
        id: 'ORD002',
        customerName: 'Trần Văn Minh',
        customerPhone: '0987654321',
        items: ['Sữa rửa mặt CeraVe (3x)'],
        total: 840000,
        status: 'shipped',
        paymentMethod: 'card',
        date: '2025-11-17',
        address: '456 Lê Lai, Q3, TP.HCM'
      }
    ]);

    setCustomers([
      {
        id: 1,
        name: 'Nguyễn Thị Lan',
        email: 'lan.nguyen@gmail.com',
        phone: '0901234567',
        address: '123 Nguyễn Văn Cừ, Q1, TP.HCM',
        skinType: 'Da khô',
        tier: 'gold',
        totalOrders: 15,
        totalSpent: 6750000,
        lastOrder: '2025-11-18',
        notes: 'Da nhạy cảm, thích sản phẩm Eucerin'
      },
      {
        id: 2,
        name: 'Trần Văn Minh',
        email: 'minh.tran@gmail.com',
        phone: '0987654321',
        address: '456 Lê Lai, Q3, TP.HCM',
        skinType: 'Da dầu',
        tier: 'silver',
        totalOrders: 8,
        totalSpent: 2240000,
        lastOrder: '2025-11-17',
        notes: 'Thích sản phẩm làm sạch sâu'
      }
    ]);
  }, []);

  // Handle form submissions
  const handleProductSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...productForm,
      id: Date.now(),
      price: parseInt(productForm.price),
      costPrice: parseInt(productForm.costPrice),
      stock: parseInt(productForm.stock)
    };

    if (editingItem) {
      setProducts(products.map(p => p.id === editingItem.id ? { ...newProduct, id: editingItem.id } : p));
    } else {
      setProducts([...products, newProduct]);
    }

    resetProductForm();
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      ...orderForm,
      id: `ORD${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      total: parseInt(orderForm.total)
    };

    setOrders([newOrder, ...orders]);
    resetOrderForm();
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    const newCustomer = {
      ...customerForm,
      id: Date.now(),
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: null
    };

    if (editingItem) {
      setCustomers(customers.map(c => c.id === editingItem.id ? { ...newCustomer, id: editingItem.id } : c));
    } else {
      setCustomers([...customers, newCustomer]);
    }

    resetCustomerForm();
  };

  // Reset forms
  const resetProductForm = () => {
    setProductForm({
      name: '', sku: '', price: '', costPrice: '', category: '',
      brand: '', unit: '', description: '', stock: '', color: '',
      skinType: '', volume: '', image: ''
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const resetOrderForm = () => {
    setOrderForm({
      customerId: '', items: [], total: '', paymentMethod: 'cash',
      status: 'pending', shippingAddress: '', phone: ''
    });
    setShowForm(false);
    setEditingItem(null);
  };

  const resetCustomerForm = () => {
    setCustomerForm({
      name: '', email: '', phone: '', address: '',
      skinType: '', notes: '', tier: 'bronze'
    });
    setShowForm(false);
    setEditingItem(null);
  };

  // Edit functions
  const editProduct = (product) => {
    setProductForm(product);
    setEditingItem(product);
    setShowForm(true);
  };

  const editCustomer = (customer) => {
    setCustomerForm(customer);
    setEditingItem(customer);
    setShowForm(true);
  };

  // Delete functions
  const deleteProduct = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const deleteCustomer = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khách hàng này?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  // Helper functions
  const getStockStatus = (stock) => {
    if (stock > 20) return 'high';
    if (stock > 5) return 'medium';
    return 'low';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: styles.tierBronze,
      silver: styles.tierSilver,
      gold: styles.tierGold,
      diamond: styles.tierDiamond
    };
    return colors[tier] || styles.tierBronze;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: styles.statusPending,
      processing: styles.statusProcessing,
      shipped: styles.statusShipped,
      delivered: styles.statusDelivered,
      cancelled: styles.statusCancelled
    };
    return colors[status] || styles.statusPending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      processing: 'Đang chuẩn bị',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  // Filter data
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  // Statistics
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalRevenue: orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    lowStockProducts: products.filter(product => product.stock <= 5).length
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>🛍️ Quản Lý Bán Hàng</h1>
        <p className={styles.subtitle}>Hệ thống POS và quản lý đơn hàng hiện đại</p>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.totalProducts}</div>
          <div className={styles.statLabel}>Sản phẩm</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.totalOrders}</div>
          <div className={styles.statLabel}>Đơn hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.totalCustomers}</div>
          <div className={styles.statLabel}>Khách hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{formatPrice(stats.totalRevenue)}</div>
          <div className={styles.statLabel}>Doanh thu</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsNav}>
          <button
            className={`${styles.tabButton} ${activeTab === 'products' ? styles.active : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Quản lý Sản phẩm
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🛒 Quản lý Đơn hàng
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'customers' ? styles.active : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            👥 Quản lý Khách hàng
          </button>
        </div>

        <div className={styles.tabContent}>
          {/* Search and Filter */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {activeTab === 'orders' && (
              <select
                className={styles.filterSelect}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang chuẩn bị</option>
                <option value="shipped">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            )}
            <button
              className={styles.addButton}
              onClick={() => setShowForm(true)}
            >
              + Thêm mới
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              {showForm && activeTab === 'products' && (
                <form className={styles.formContainer} onSubmit={handleProductSubmit}>
                  <h3 className={styles.formTitle}>
                    {editingItem ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                  </h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tên sản phẩm *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Mã SKU *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={productForm.sku}
                        onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Giá bán *</label>
                      <input
                        type="number"
                        className={styles.formInput}
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Giá vốn *</label>
                      <input
                        type="number"
                        className={styles.formInput}
                        value={productForm.costPrice}
                        onChange={(e) => setProductForm({...productForm, costPrice: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Danh mục *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Thương hiệu *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={productForm.brand}
                        onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Đơn vị tính *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={productForm.unit}
                        onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tồn kho *</label>
                      <input
                        type="number"
                        className={styles.formInput}
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Màu sắc</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={productForm.color}
                        onChange={(e) => setProductForm({...productForm, color: e.target.value})}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Loại da phù hợp</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={productForm.skinType}
                        onChange={(e) => setProductForm({...productForm, skinType: e.target.value})}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Dung tích/Khối lượng</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={productForm.volume}
                        onChange={(e) => setProductForm({...productForm, volume: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mô tả/Công dụng</label>
                    <textarea
                      className={styles.formTextarea}
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={`${styles.submitButton} ${styles.saveButton}`}>
                      {editingItem ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    <button
                      type="button"
                      className={`${styles.submitButton} ${styles.cancelButton}`}
                      onClick={resetProductForm}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              <div className={styles.productGrid}>
                {filteredProducts.map(product => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.productHeader}>
                      <div>
                        <h3 className={styles.productTitle}>{product.name}</h3>
                        <p className={styles.productSku}>{product.sku}</p>
                      </div>
                    </div>
                    <div className={styles.productPrice}>{formatPrice(product.price)}</div>
                    <span className={styles.productCategory}>{product.category}</span>
                    <div className={styles.productStock}>
                      <div className={`${styles.stockIndicator} ${styles[`stock${getStockStatus(product.stock).charAt(0).toUpperCase() + getStockStatus(product.stock).slice(1)}`]}`}></div>
                      <span>Tồn kho: {product.stock} {product.unit}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px' }}>
                      <div>Thương hiệu: {product.brand}</div>
                      {product.skinType && <div>Phù hợp: {product.skinType}</div>}
                      {product.volume && <div>Dung tích: {product.volume}</div>}
                    </div>
                    <div className={styles.productActions}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => editProduct(product)}
                      >
                        Sửa
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => deleteProduct(product.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              {showForm && activeTab === 'orders' && (
                <form className={styles.formContainer} onSubmit={handleOrderSubmit}>
                  <h3 className={styles.formTitle}>Tạo đơn hàng mới</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Khách hàng</label>
                      <select
                        className={styles.formSelect}
                        value={orderForm.customerId}
                        onChange={(e) => setOrderForm({...orderForm, customerId: e.target.value})}
                      >
                        <option value="">Chọn khách hàng</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Số điện thoại</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tổng tiền</label>
                      <input
                        type="number"
                        className={styles.formInput}
                        value={orderForm.total}
                        onChange={(e) => setOrderForm({...orderForm, total: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Phương thức thanh toán</label>
                      <select
                        className={styles.formSelect}
                        value={orderForm.paymentMethod}
                        onChange={(e) => setOrderForm({...orderForm, paymentMethod: e.target.value})}
                      >
                        <option value="cash">Tiền mặt</option>
                        <option value="transfer">Chuyển khoản</option>
                        <option value="card">Thẻ</option>
                        <option value="e-wallet">Ví điện tử</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Trạng thái</label>
                      <select
                        className={styles.formSelect}
                        value={orderForm.status}
                        onChange={(e) => setOrderForm({...orderForm, status: e.target.value})}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang chuẩn bị</option>
                        <option value="shipped">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Địa chỉ giao hàng</label>
                    <textarea
                      className={styles.formTextarea}
                      value={orderForm.shippingAddress}
                      onChange={(e) => setOrderForm({...orderForm, shippingAddress: e.target.value})}
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={`${styles.submitButton} ${styles.saveButton}`}>
                      Tạo đơn hàng
                    </button>
                    <button
                      type="button"
                      className={`${styles.submitButton} ${styles.cancelButton}`}
                      onClick={resetOrderForm}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              <div className={styles.ordersList}>
                {filteredOrders.map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div className={styles.orderId}>#{order.id}</div>
                      <div className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </div>
                    </div>
                    <div className={styles.orderInfo}>
                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Khách hàng</div>
                        <div className={styles.infoValue}>{order.customerName}</div>
                      </div>
                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Số điện thoại</div>
                        <div className={styles.infoValue}>{order.customerPhone}</div>
                      </div>
                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Ngày đặt</div>
                        <div className={styles.infoValue}>{order.date}</div>
                      </div>
                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Thanh toán</div>
                        <div className={styles.infoValue}>
                          {order.paymentMethod === 'cash' ? 'Tiền mặt' :
                           order.paymentMethod === 'transfer' ? 'Chuyển khoản' :
                           order.paymentMethod === 'card' ? 'Thẻ' : 'Ví điện tử'}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <div className={styles.infoLabel}>Sản phẩm</div>
                      <div style={{ color: '#374151', fontSize: '0.9rem' }}>
                        {order.items.join(', ')}
                      </div>
                    </div>
                    <div className={styles.orderTotal}>
                      Tổng: {formatPrice(order.total)}
                    </div>
                    <div className={styles.orderActions}>
                      <button className={`${styles.actionButton} ${styles.editButton}`}>
                        Xem chi tiết
                      </button>
                      {order.status === 'pending' && (
                        <button className={`${styles.actionButton} ${styles.saveButton}`}>
                          Xác nhận
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <div>
              {showForm && activeTab === 'customers' && (
                <form className={styles.formContainer} onSubmit={handleCustomerSubmit}>
                  <h3 className={styles.formTitle}>
                    {editingItem ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
                  </h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Họ và tên *</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email *</label>
                      <input
                        type="email"
                        className={styles.formInput}
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Số điện thoại *</label>
                      <input
                        type="tel"
                        className={styles.formInput}
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Hạng thành viên</label>
                      <select
                        className={styles.formSelect}
                        value={customerForm.tier}
                        onChange={(e) => setCustomerForm({...customerForm, tier: e.target.value})}
                      >
                        <option value="bronze">Đồng</option>
                        <option value="silver">Bạc</option>
                        <option value="gold">Vàng</option>
                        <option value="diamond">Kim Cương</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Loại da</label>
                      <input
                        type="text"
                        className={styles.formInput}
                        value={customerForm.skinType}
                        onChange={(e) => setCustomerForm({...customerForm, skinType: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Địa chỉ</label>
                    <textarea
                      className={styles.formTextarea}
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ghi chú đặc biệt</label>
                    <textarea
                      className={styles.formTextarea}
                      value={customerForm.notes}
                      onChange={(e) => setCustomerForm({...customerForm, notes: e.target.value})}
                      placeholder="Sở thích, dị ứng, loại da, v.v."
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={`${styles.submitButton} ${styles.saveButton}`}>
                      {editingItem ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    <button
                      type="button"
                      className={`${styles.submitButton} ${styles.cancelButton}`}
                      onClick={resetCustomerForm}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              <div className={styles.customersList}>
                {filteredCustomers.map(customer => (
                  <div key={customer.id} className={styles.customerCard}>
                    <div className={styles.customerHeader}>
                      <div className={styles.customerAvatar}>
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className={styles.customerName}>{customer.name}</div>
                        <div className={styles.customerEmail}>{customer.email}</div>
                      </div>
                    </div>
                    <div className={`${styles.customerTier} ${getTierColor(customer.tier)}`}>
                      {customer.tier === 'bronze' ? 'Đồng' :
                       customer.tier === 'silver' ? 'Bạc' :
                       customer.tier === 'gold' ? 'Vàng' : 'Kim Cương'}
                    </div>
                    <div className={styles.customerStats}>
                      <div className={styles.statItem}>
                        <div className={styles.statValue}>{customer.totalOrders}</div>
                        <div className={styles.statLabel}>Đơn hàng</div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statValue}>{formatPrice(customer.totalSpent)}</div>
                        <div className={styles.statLabel}>Tổng chi tiêu</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px' }}>
                      <div>📞 {customer.phone}</div>
                      {customer.skinType && <div>👤 Loại da: {customer.skinType}</div>}
                      {customer.lastOrder && <div>📅 Mua hàng: {customer.lastOrder}</div>}
                    </div>
                    <div className={styles.productActions}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => editCustomer(customer)}
                      >
                        Sửa
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => deleteCustomer(customer.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QLBH;