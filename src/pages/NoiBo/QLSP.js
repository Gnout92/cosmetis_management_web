import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Search, Filter, AlertCircle, CheckCircle, X } from 'lucide-react';
import styles from '../../styles/NoiBo/QLSP.module.css';

const QLSP = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    categoryId: '',
    brandId: '',
  });

  // Helper: Get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
  };

  // Load data
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
  }, [currentPage, searchTerm, filterCategory, filterBrand, filterStatus]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        search: searchTerm,
        categoryId: filterCategory,
        brandId: filterBrand,
        status: filterStatus,
      });

      const response = await fetch(`/api/qlsp/products?${params}`, {
        headers: { Authorization: token },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Lỗi tải sản phẩm');
      }

      setProducts(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/qlsp/categories', {
        headers: { Authorization: token },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Lỗi tải danh mục:', err);
    }
  };

  const loadBrands = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/qlsp/brands', {
        headers: { Authorization: token },
      });
      const data = await response.json();
      if (data.success) {
        setBrands(data.data || []);
      }
    } catch (err) {
      console.error('Lỗi tải thương hiệu:', err);
    }
  };

  // Handle form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const url = editingProduct
        ? `/api/qlsp/products/${editingProduct.id}`
        : '/api/qlsp/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(productForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi lưu sản phẩm');
      }

      alert(data.message || 'Lưu sản phẩm thành công!');
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice,
      categoryId: product.categoryId,
      brandId: product.brandId || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn ẩn sản phẩm này?')) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/qlsp/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi xóa sản phẩm');
      }

      alert(data.message || 'Đã ẩn sản phẩm');
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      categoryId: '',
      brandId: '',
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock > 20) return { text: 'Nhiều', class: styles.stockHigh };
    if (stock > 5) return { text: 'Vừa', class: styles.stockMedium };
    return { text: 'Thấp', class: styles.stockLow };
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản Lý Sản Phẩm</h1>
        <p className={styles.subtitle}>Quản lý kho sản phẩm mỹ phẩm</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{products.length}</div>
          <div className={styles.statLabel}>Sản phẩm</div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabContent}>
          {/* Search & Filter */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              className={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hiển thị</option>
              <option value="hidden">Đã ẩn</option>
            </select>
            <button className={styles.addButton} onClick={() => setShowForm(true)}>
              <Plus size={20} /> Thêm sản phẩm
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '15px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '20px' }}>
              <AlertCircle size={20} style={{ display: 'inline', marginRight: '8px' }} />
              {error}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <form className={styles.formContainer} onSubmit={handleSubmit}>
              <h3 className={styles.formTitle}>
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tên sản phẩm *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Giá bán *</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Giá gốc</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Danh mục *</label>
                  <select
                    className={styles.formSelect}
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Thương hiệu</label>
                  <select
                    className={styles.formSelect}
                    value={productForm.brandId}
                    onChange={(e) => setProductForm({ ...productForm, brandId: e.target.value })}
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mô tả</label>
                <textarea
                  className={styles.formTextarea}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={`${styles.submitButton} ${styles.saveButton}`} disabled={loading}>
                  {loading ? 'Đang lưu...' : editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button
                  type="button"
                  className={`${styles.submitButton} ${styles.cancelButton}`}
                  onClick={resetForm}
                >
                  Hủy
                </button>
              </div>
            </form>
          )}

          {/* Loading */}
          {loading && !showForm && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              Đang tải...
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className={styles.productGrid}>
              {products.map((product) => {
                const stockStatus = getStockStatus(product.totalStock || 0);
                return (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.productHeader}>
                      <div>
                        <h3 className={styles.productTitle}>{product.name}</h3>
                        <p className={styles.productSku}>ID: {product.id}</p>
                      </div>
                    </div>
                    <div className={styles.productPrice}>{formatPrice(product.price)}</div>
                    {product.categoryName && (
                      <span className={styles.productCategory}>{product.categoryName}</span>
                    )}
                    <div className={styles.productStock}>
                      <div className={`${styles.stockIndicator} ${stockStatus.class}`}></div>
                      <span>Tồn kho: {product.totalStock || 0} - {stockStatus.text}</span>
                    </div>
                    {product.brandName && (
                      <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '12px' }}>
                        Thương hiệu: {product.brandName}
                      </div>
                    )}
                    {product.isHidden === 1 && (
                      <div style={{ padding: '6px', background: '#fee', color: '#c00', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '12px' }}>
                        Đã ẩn
                      </div>
                    )}
                    <div className={styles.productActions}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => handleEdit(product)}
                      >
                        <Edit2 size={16} /> Sửa
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={16} /> Ẩn
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && products.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Package size={64} />
              </div>
              <div className={styles.emptyTitle}>Chưa có sản phẩm</div>
              <div className={styles.emptyDescription}>
                Hãy thêm sản phẩm đầu tiên vào kho
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#667eea', color: 'white', cursor: 'pointer' }}
              >
                Trước
              </button>
              <span style={{ padding: '8px 16px', background: '#f1f5f9', borderRadius: '8px' }}>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#667eea', color: 'white', cursor: 'pointer' }}
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QLSP;
