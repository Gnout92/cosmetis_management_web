import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/cuahang.module.css';

const CuaHang = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const modules = [
    { id: 'products', name: 'Quản lý sản phẩm', icon: '📦' },
    { id: 'customers', name: 'Quản lý khách hàng', icon: '👥' },
    { id: 'employees', name: 'Quản lý nhân viên', icon: '👨‍💼' },
    { id: 'orders', name: 'Quản lý đơn hàng', icon: '📋' },
    { id: 'warehouse', name: 'Quản lý kho', icon: '🏪' },
    { id: 'marketing', name: 'Marketing & Khuyến mãi', icon: '📢' },
    { id: 'reports', name: 'Báo cáo & Phân tích', icon: '📊' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🌟 Hệ Thống Quản Lý Cửa Hàng Mỹ Phẩm</h1>
        <p className={styles.subtitle}>Quản lý hiệu quả - Phát triển bền vững</p>
      </div>

      <div className={styles.navigation}>
        <button 
          className={`${styles.navButton} ${activeModule === 'dashboard' ? styles.active : ''}`}
          onClick={() => setActiveModule('dashboard')}
        >
          🏠 Dashboard
        </button>
        {modules.map(module => (
          <button 
            key={module.id}
            className={`${styles.navButton} ${activeModule === module.id ? styles.active : ''}`}
            onClick={() => setActiveModule(module.id)}
          >
            {module.icon} {module.name}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeModule === 'dashboard' && <DashboardView />}
        {activeModule === 'products' && <ProductManagement />}
        {activeModule === 'customers' && <CustomerManagement />}
        {activeModule === 'employees' && <EmployeeManagement />}
        {activeModule === 'orders' && <OrderManagement />}
        {activeModule === 'warehouse' && <WarehouseManagement />}
        {activeModule === 'marketing' && <MarketingManagement />}
        {activeModule === 'reports' && <ReportsAnalytics />}
      </div>
    </div>
  );
};

// Dashboard Component
const DashboardView = () => {
  const stats = [
    { title: 'Tổng sản phẩm', value: '1,247', change: '+12%', color: '#4F46E5' },
    { title: 'Khách hàng', value: '8,942', change: '+8%', color: '#059669' },
    { title: 'Đơn hàng hôm nay', value: '156', change: '+15%', color: '#DC2626' },
    { title: 'Doanh thu tháng', value: '₫245M', change: '+23%', color: '#7C3AED' }
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statTitle}>{stat.title}</div>
            <div className={styles.statChange} style={{color: stat.color}}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.quickActions}>
        <h3>Thao tác nhanh</h3>
        <div className={styles.actionGrid}>
          <button className={styles.actionButton}>➕ Thêm sản phẩm</button>
          <button className={styles.actionButton}>👤 Thêm khách hàng</button>
          <button className={styles.actionButton}>📝 Tạo đơn hàng</button>
          <button className={styles.actionButton}>📊 Xem báo cáo</button>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h3>Hoạt động gần đây</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>📦</span>
            <span>Sản phẩm "Son môi đỏ Ruby" đã được cập nhật</span>
            <span className={styles.activityTime}>5 phút trước</span>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>👤</span>
            <span>Khách hàng mới "Nguyễn Văn A" đã đăng ký</span>
            <span className={styles.activityTime}>10 phút trước</span>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityIcon}>📋</span>
            <span>Đơn hàng #HD001 đã được xác nhận</span>
            <span className={styles.activityTime}>15 phút trước</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Management Component
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // Mock data từ CSDL
    const mockCategories = [
      { MaDanhMuc: 1, TenDanhMuc: 'Sữa rửa mặt', MoTa: 'Các loại sữa rửa mặt cho da mặt' },
      { MaDanhMuc: 2, TenDanhMuc: 'Kem chống nắng', MoTa: 'Kem chống nắng bảo vệ da khỏi tia UV' },
      { MaDanhMuc: 3, TenDanhMuc: 'Dầu gội', MoTa: 'Dầu gội chăm sóc tóc' },
      { MaDanhMuc: 4, TenDanhMuc: 'Mặt nạ', MoTa: 'Mặt nạ dưỡng da' }
    ];

    const mockProducts = [
      { MaSanPham: 1, TenSanPham: 'Son môi đỏ Ruby', MoTa: 'Son đỏ Ruby lâu trôi', MaDanhMuc: 1, Gia: 200000, GiaGoc: 250000, SoLuong: 50 },
      { MaSanPham: 2, TenSanPham: 'Kem dưỡng ẩm ban ngày', MoTa: 'Dưỡng ẩm và chống nắng', MaDanhMuc: 2, Gia: 150000, GiaGoc: 180000, SoLuong: 30 },
      { MaSanPham: 3, TenSanPham: 'Serum vitamin C', MoTa: 'Serum sáng da và mờ thâm', MaDanhMuc: 2, Gia: 220000, GiaGoc: 260000, SoLuong: 5 },
      { MaSanPham: 4, TenSanPham: 'Sữa rửa mặt làm sạch sâu', MoTa: 'Loại bỏ bụi bẩn và bã nhờn', MaDanhMuc: 1, Gia: 120000, GiaGoc: 150000, SoLuong: 0 }
    ];

    setCategories(mockCategories);
    setProducts(mockProducts);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'Hết hàng', className: 'outOfStock' };
    if (quantity <= 10) return { status: 'Sắp hết', className: 'lowStock' };
    return { status: 'Còn hàng', className: 'inStock' };
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.MaDanhMuc === categoryId);
    return category ? category.TenDanhMuc : 'N/A';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.TenSanPham.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.MaDanhMuc === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <h2>📦 Quản lý sản phẩm</h2>
        <button 
          className={styles.primaryButton}
          onClick={() => setShowAddForm(true)}
        >
          ➕ Thêm sản phẩm
        </button>
      </div>

      {/* Cảnh báo tồn kho */}
      <div className={styles.stockAlerts}>
        {products.filter(p => p.SoLuong <= 10).length > 0 && (
          <div className={styles.alertBanner}>
            <span className={styles.alertIcon}>⚠️</span>
            <span>Có {products.filter(p => p.SoLuong <= 10).length} sản phẩm sắp hết hoặc đã hết hàng!</span>
          </div>
        )}
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map(category => (
            <option key={category.MaDanhMuc} value={category.MaDanhMuc}>
              {category.TenDanhMuc}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Giá gốc</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(product.SoLuong);
              return (
                <tr key={product.MaSanPham}>
                  <td>SP{product.MaSanPham.toString().padStart(3, '0')}</td>
                  <td>
                    <div className={styles.productCell}>
                      <strong>{product.TenSanPham}</strong>
                      <span className={styles.productDesc}>{product.MoTa}</span>
                    </div>
                  </td>
                  <td>{getCategoryName(product.MaDanhMuc)}</td>
                  <td>{formatCurrency(product.Gia)}</td>
                  <td className={styles.originalPrice}>{formatCurrency(product.GiaGoc)}</td>
                  <td>{product.SoLuong}</td>
                  <td>
                    <span className={`${styles.status} ${styles[stockStatus.className]}`}>
                      {stockStatus.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.editButton}
                      onClick={() => setEditingProduct(product)}
                    >
                      ✏️
                    </button>
                    <button className={styles.deleteButton}>🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Thêm sản phẩm mới</h3>
            <form className={styles.form}>
              <input type="text" placeholder="Tên sản phẩm" className={styles.input} />
              <select className={styles.input}>
                <option>Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat.MaDanhMuc} value={cat.MaDanhMuc}>
                    {cat.TenDanhMuc}
                  </option>
                ))}
              </select>
              <input type="number" placeholder="Giá bán" className={styles.input} />
              <input type="number" placeholder="Giá gốc" className={styles.input} />
              <input type="number" placeholder="Số lượng" className={styles.input} />
              <textarea placeholder="Mô tả sản phẩm" className={styles.textarea}></textarea>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowAddForm(false)} className={styles.cancelButton}>Hủy</button>
                <button type="submit" className={styles.primaryButton}>Thêm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Customer Management Component
const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const mockCustomers = [
      { MaKH: 1, HoVaTen: 'Nguyễn Văn K', DienThoai: '0981111111', Email: 'k@shop.com', DiaChi: '123 Đường Lê Lợi, Quận 1, TP.HCM', SoDonHang: 5, TongChiTieu: 2500000 },
      { MaKH: 2, HoVaTen: 'Trần Thị L', DienThoai: '0982222222', Email: 'l@shop.com', DiaChi: '456 Đường Trần Hưng Đạo, Quận 5, TP.HCM', SoDonHang: 3, TongChiTieu: 1800000 },
      { MaKH: 3, HoVaTen: 'Lê Văn M', DienThoai: '0983333333', Email: 'm@shop.com', DiaChi: '789 Đường Nguyễn Văn Cừ, Quận 3, TP.HCM', SoDonHang: 8, TongChiTieu: 4200000 },
      { MaKH: 4, HoVaTen: 'Phạm Thị N', DienThoai: '0984444444', Email: 'n@shop.com', DiaChi: '321 Đường Lê Văn Sỹ, Quận 10, TP.HCM', SoDonHang: 2, TongChiTieu: 950000 }
    ];
    setCustomers(mockCustomers);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getCustomerType = (totalSpent) => {
    if (totalSpent >= 5000000) return { type: 'VIP', className: 'vip' };
    if (totalSpent >= 2000000) return { type: 'Thường', className: 'regular' };
    return { type: 'Mới', className: 'new' };
  };

  const filteredCustomers = customers.filter(customer =>
    customer.HoVaTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.DienThoai.includes(searchTerm) ||
    customer.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <h2>👥 Quản lý khách hàng</h2>
        <button className={styles.primaryButton}>➕ Thêm khách hàng</button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.customerStats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{customers.length}</div>
          <div className={styles.statTitle}>Tổng khách hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{customers.filter(c => c.TongChiTieu >= 5000000).length}</div>
          <div className={styles.statTitle}>Khách VIP</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatCurrency(customers.reduce((sum, c) => sum + c.TongChiTieu, 0))}</div>
          <div className={styles.statTitle}>Tổng chi tiêu</div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã KH</th>
              <th>Họ và tên</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th>Đơn hàng</th>
              <th>Tổng chi tiêu</th>
              <th>Loại KH</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => {
              const customerType = getCustomerType(customer.TongChiTieu);
              return (
                <tr key={customer.MaKH}>
                  <td>KH{customer.MaKH.toString().padStart(3, '0')}</td>
                  <td>
                    <div className={styles.customerCell}>
                      <strong>{customer.HoVaTen}</strong>
                      <span className={styles.customerAddress}>{customer.DiaChi}</span>
                    </div>
                  </td>
                  <td>{customer.DienThoai}</td>
                  <td>{customer.Email}</td>
                  <td>{customer.SoDonHang}</td>
                  <td>{formatCurrency(customer.TongChiTieu)}</td>
                  <td>
                    <span className={`${styles.customerType} ${styles[customerType.className]}`}>
                      {customerType.type}
                    </span>
                  </td>
                  <td>
                    <button className={styles.editButton}>✏️</button>
                    <button className={styles.viewButton}>👁️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Employee Management Component
const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const mockEmployees = [
      { MaNV: 1, HoVaTen: 'Nguyen Van A', DienThoai: '0901234567', Email: 'a@shop.com', VaiTro: 'Admin', TrangThai: 'Hoạt động' },
      { MaNV: 2, HoVaTen: 'Tran Thi B', DienThoai: '0902345678', Email: 'b@shop.com', VaiTro: 'Nhân viên', TrangThai: 'Hoạt động' },
      { MaNV: 3, HoVaTen: 'Le Thi C', DienThoai: '0903456789', Email: 'c@shop.com', VaiTro: 'Nhân viên', TrangThai: 'Hoạt động' },
      { MaNV: 4, HoVaTen: 'Pham Van D', DienThoai: '0904567890', Email: 'd@shop.com', VaiTro: 'Nhân viên', TrangThai: 'Tạm nghỉ' }
    ];
    setEmployees(mockEmployees);
  }, []);

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <h2>👨‍💼 Quản lý nhân viên</h2>
        <button className={styles.primaryButton}>➕ Thêm nhân viên</button>
      </div>

      <div className={styles.employeeStats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{employees.length}</div>
          <div className={styles.statTitle}>Tổng nhân viên</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{employees.filter(e => e.TrangThai === 'Hoạt động').length}</div>
          <div className={styles.statTitle}>Đang hoạt động</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{employees.filter(e => e.VaiTro === 'Admin').length}</div>
          <div className={styles.statTitle}>Quản trị viên</div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Họ và tên</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.MaNV}>
                <td>NV{employee.MaNV.toString().padStart(3, '0')}</td>
                <td>{employee.HoVaTen}</td>
                <td>{employee.DienThoai}</td>
                <td>{employee.Email}</td>
                <td>
                  <span className={`${styles.role} ${employee.VaiTro === 'Admin' ? styles.admin : styles.staff}`}>
                    {employee.VaiTro}
                  </span>
                </td>
                <td>
                  <span className={`${styles.status} ${employee.TrangThai === 'Hoạt động' ? styles.active : styles.inactive}`}>
                    {employee.TrangThai}
                  </span>
                </td>
                <td>
                  <button className={styles.editButton}>✏️</button>
                  <button className={styles.deleteButton}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Order Management Component
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const mockOrders = [
      { MaHD: 1, KhachHang: 'Nguyễn Văn K', NgayLap: '2024-01-15', TongTien: 450000, TrangThai: 'Đã giao', PhuongThucThanhToan: 'Tiền mặt' },
      { MaHD: 2, KhachHang: 'Trần Thị L', NgayLap: '2024-01-16', TongTien: 320000, TrangThai: 'Đang xử lý', PhuongThucThanhToan: 'Thẻ' },
      { MaHD: 3, KhachHang: 'Lê Văn M', NgayLap: '2024-01-16', TongTien: 680000, TrangThai: 'Đang giao', PhuongThucThanhToan: 'Ví điện tử' },
      { MaHD: 4, KhachHang: 'Phạm Thị N', NgayLap: '2024-01-17', TongTien: 290000, TrangThai: 'Chờ xác nhận', PhuongThucThanhToan: 'COD' }
    ];
    setOrders(mockOrders);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'Chờ xác nhận': 'pending',
      'Đang xử lý': 'processing',
      'Đang giao': 'shipping',
      'Đã giao': 'delivered',
      'Đã hủy': 'cancelled'
    };
    return statusMap[status] || 'pending';
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.TrangThai === filterStatus
  );

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <h2>📋 Quản lý đơn hàng</h2>
        <button className={styles.primaryButton}>➕ Tạo đơn hàng</button>
      </div>

      <div className={styles.orderStats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{orders.length}</div>
          <div className={styles.statTitle}>Tổng đơn hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{orders.filter(o => o.TrangThai === 'Chờ xác nhận').length}</div>
          <div className={styles.statTitle}>Chờ xử lý</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatCurrency(orders.reduce((sum, o) => sum + o.TongTien, 0))}</div>
          <div className={styles.statTitle}>Tổng giá trị</div>
        </div>
      </div>

      <div className={styles.filters}>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Chờ xác nhận">Chờ xác nhận</option>
          <option value="Đang xử lý">Đang xử lý</option>
          <option value="Đang giao">Đang giao</option>
          <option value="Đã giao">Đã giao</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.MaHD}>
                <td>HD{order.MaHD.toString().padStart(3, '0')}</td>
                <td>{order.KhachHang}</td>
                <td>{order.NgayLap}</td>
                <td>{formatCurrency(order.TongTien)}</td>
                <td>{order.PhuongThucThanhToan}</td>
                <td>
                  <span className={`${styles.status} ${styles[getStatusColor(order.TrangThai)]}`}>
                    {order.TrangThai}
                  </span>
                </td>
                <td>
                  <button className={styles.viewButton}>👁️</button>
                  <button className={styles.editButton}>✏️</button>
                  <button className={styles.printButton}>🖨️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Warehouse Management Component
const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    const mockWarehouses = [
      { MaKho: 1, TenKho: 'Kho trung tâm', ViTri: 'Hà Nội', SucChua: 1000, DangSuDung: 750, SoLoaiSP: 245 },
      { MaKho: 2, TenKho: 'Kho chi nhánh HCM', ViTri: 'TP.HCM', SucChua: 800, DangSuDung: 600, SoLoaiSP: 180 },
      { MaKho: 3, TenKho: 'Kho Đà Nẵng', ViTri: 'Đà Nẵng', SucChua: 500, DangSuDung: 300, SoLoaiSP: 120 }
    ];
    setWarehouses(mockWarehouses);
  }, []);

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <h2>🏪 Quản lý kho</h2>
        <button className={styles.primaryButton}>➕ Thêm kho</button>
      </div>

      <div className={styles.warehouseGrid}>
        {warehouses.map(warehouse => {
          const usagePercent = (warehouse.DangSuDung / warehouse.SucChua) * 100;
          return (
            <div key={warehouse.MaKho} className={styles.warehouseCard}>
              <h3>{warehouse.TenKho}</h3>
              <p>📍 {warehouse.ViTri}</p>
              <div className={styles.warehouseStats}>
                <div className={styles.capacityBar}>
                  <div 
                    className={styles.capacityFill}
                    style={{ 
                      width: `${usagePercent}%`,
                      backgroundColor: usagePercent > 80 ? '#ef4444' : usagePercent > 60 ? '#f59e0b' : '#10b981'
                    }}
                  ></div>
                </div>
                <p>{warehouse.DangSuDung}/{warehouse.SucChua} sản phẩm ({usagePercent.toFixed(1)}%)</p>
                <p>📦 {warehouse.SoLoaiSP} loại sản phẩm</p>
              </div>
              <button className={styles.editButton}>Quản lý</button>
            </div>
          );
        })}
      </div>

      <div className={styles.inventoryAlerts}>
        <h3>Cảnh báo tồn kho</h3>
        <div className={styles.alertList}>
          <div className={styles.alertItem}>
            <span className={styles.alertIcon}>⚠️</span>
            <span>Serum vitamin C - Còn 5 sản phẩm</span>
            <button className={styles.alertButton}>Nhập hàng</button>
          </div>
          <div className={styles.alertItem}>
            <span className={styles.alertIcon}>🚨</span>
            <span>Sữa rửa mặt làm sạch sâu - Hết hàng</span>
            <button className={styles.alertButton}>Nhập hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Marketing Management Component
const MarketingManagement = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const mockCampaigns = [
      { id: 1, TenChienDich: 'Khuyến mãi mùa hè', LoaiKM: 'Giảm giá %', GiaTri: 20, NgayBatDau: '2024-06-01', NgayKetThuc: '2024-06-30', TrangThai: 'Đang chạy' },
      { id: 2, TenChienDich: 'Flash Sale cuối tuần', LoaiKM: 'Giảm tiền', GiaTri: 50000, NgayBatDau: '2024-01-20', NgayKetThuc: '2024-01-21', TrangThai: 'Sắp tới' },
      { id: 3, TenChienDich: 'Mua 2 tặng 1', LoaiKM: 'Khuyến mãi combo', GiaTri: 0, NgayBatDau: '2024-01-15', NgayKetThuc: '2024-01-31', TrangThai: 'Đã kết thúc' }
    ];
    setCampaigns(mockCampaigns);
  }, []);

  const getStatusColor = (status) => {
    const statusMap = {
      'Đang chạy': 'active',
      'Sắp tới': 'upcoming',
      'Đã kết thúc': 'ended'
    };
    return statusMap[status] || 'ended';
  };

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <h2>📢 Marketing & Khuyến mãi</h2>
        <button className={styles.primaryButton}>➕ Tạo chiến dịch</button>
      </div>

      <div className={styles.campaignGrid}>
        {campaigns.map(campaign => (
          <div key={campaign.id} className={styles.campaignCard}>
            <h3>{campaign.TenChienDich}</h3>
            <p><strong>Loại:</strong> {campaign.LoaiKM}</p>
            <p><strong>Giảm:</strong> {campaign.LoaiKM.includes('%') ? `${campaign.GiaTri}%` : `${campaign.GiaTri.toLocaleString()}₫`}</p>
            <p><strong>Thời gian:</strong> {campaign.NgayBatDau} - {campaign.NgayKetThuc}</p>
            <span className={`${styles.status} ${styles[getStatusColor(campaign.TrangThai)]}`}>
              {campaign.TrangThai}
            </span>
            <div className={styles.campaignActions}>
              <button className={styles.editButton}>✏️ Sửa</button>
              <button className={styles.viewButton}>📊 Thống kê</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.couponSection}>
        <h3>Mã giảm giá</h3>
        <div className={styles.couponList}>
          <div className={styles.couponItem}>
            <code>SUMMER2024</code>
            <span>Giảm 15% - Còn 50 lượt</span>
            <button className={styles.editButton}>Sửa</button>
          </div>
          <div className={styles.couponItem}>
            <code>NEWCUSTOMER</code>
            <span>Giảm 30.000₫ - Còn 100 lượt</span>
            <button className={styles.editButton}>Sửa</button>
          </div>
        </div>
        <button className={styles.primaryButton}>➕ Tạo mã mới</button>
      </div>
    </div>
  );
};

// Reports & Analytics Component
const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportsData, setReportsData] = useState({});

  useEffect(() => {
    const mockData = {
      today: { revenue: 2500000, orders: 15, customers: 12, avgOrderValue: 166667 },
      week: { revenue: 18000000, orders: 85, customers: 68, avgOrderValue: 211765 },
      month: { revenue: 75000000, orders: 340, customers: 250, avgOrderValue: 220588 }
    };
    setReportsData(mockData);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const topProducts = [
    { TenSanPham: 'Son môi đỏ Ruby', SoLuongBan: 45, DoanhThu: 9000000 },
    { TenSanPham: 'Kem dưỡng ẩm ban ngày', SoLuongBan: 38, DoanhThu: 5700000 },
    { TenSanPham: 'Serum vitamin C', SoLuongBan: 32, DoanhThu: 7040000 },
    { TenSanPham: 'Sữa rửa mặt làm sạch sâu', SoLuongBan: 29, DoanhThu: 3480000 }
  ];

  const currentData = reportsData[selectedPeriod] || {};

  return (
    <div className={styles.module}>
      <div className={styles.moduleHeader}>
        <h2>📊 Báo cáo & Phân tích</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="today">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
        </select>
      </div>

      <div className={styles.reportsStats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatCurrency(currentData.revenue || 0)}</div>
          <div className={styles.statTitle}>Doanh thu</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{currentData.orders || 0}</div>
          <div className={styles.statTitle}>Đơn hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{currentData.customers || 0}</div>
          <div className={styles.statTitle}>Khách hàng</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatCurrency(currentData.avgOrderValue || 0)}</div>
          <div className={styles.statTitle}>Giá trị TB/đơn</div>
        </div>
      </div>

      <div className={styles.reportsGrid}>
        <div className={styles.reportCard}>
          <h3>Sản phẩm bán chạy</h3>
          <div className={styles.topProductsList}>
            {topProducts.map((product, index) => (
              <div key={index} className={styles.topProductItem}>
                <span className={styles.rank}>#{index + 1}</span>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>{product.TenSanPham}</div>
                  <div className={styles.productStats}>
                    Đã bán: {product.SoLuongBan} | Doanh thu: {formatCurrency(product.DoanhThu)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.reportCard}>
          <h3>Biểu đồ doanh thu</h3>
          <div className={styles.chartPlaceholder}>
            📊 Biểu đồ doanh thu theo thời gian
            <br />Tích hợp Chart.js để hiển thị biểu đồ thực tế
          </div>
        </div>
      </div>

      <div className={styles.customerAnalytics}>
        <h3>Phân tích khách hàng</h3>
        <div className={styles.customerSegments}>
          <div className={styles.segmentCard}>
            <h4>Khách hàng VIP</h4>
            <div className={styles.segmentValue}>15</div>
            <div className={styles.segmentDesc}>Chi tiêu trên 5M</div>
          </div>
          <div className={styles.segmentCard}>
            <h4>Khách hàng thường</h4>
            <div className={styles.segmentValue}>120</div>
            <div className={styles.segmentDesc}>Chi tiêu 1M-5M</div>
          </div>
          <div className={styles.segmentCard}>
            <h4>Khách hàng mới</h4>
            <div className={styles.segmentValue}>35</div>
            <div className={styles.segmentDesc}>Dưới 1M</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuaHang;