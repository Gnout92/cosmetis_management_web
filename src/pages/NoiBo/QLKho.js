import React, { useState, useEffect } from 'react';
import { Warehouse, Package, TrendingUp, TrendingDown, AlertTriangle, Search, Calendar } from 'lucide-react';
import styles from '../../styles/NoiBo/QLKho.module.css';

const QLKho = () => {
  const [activeTab, setActiveTab] = useState('stocks');
  const [stocks, setStocks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  
  // Transaction form
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState('import'); // import | export
  const [transactionForm, setTransactionForm] = useState({
    productId: '',
    warehouseId: '1',
    quantity: '',
    note: '',
  });

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token?.startsWith('Bearer ') ? token : `Bearer ${token}`;
  };

  useEffect(() => {
    loadStocks();
    loadWarehouses();
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [searchTerm, filterWarehouse, showLowStock, activeTab]);

  const loadStocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        search: searchTerm,
        warehouseId: filterWarehouse,
        lowStock: showLowStock,
        limit: 100,
      });

      const response = await fetch(`/api/qlkho/stocks?${params}`, {
        headers: { Authorization: token },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi tải tồn kho');
      }

      setStocks(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadWarehouses = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('/api/qlkho/warehouses', {
        headers: { Authorization: token },
      });
      const data = await response.json();
      if (data.success) {
        setWarehouses(data.data || []);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách kho:', err);
    }
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch('/api/qlkho/history?limit=50', {
        headers: { Authorization: token },
      });
      const data = await response.json();
      if (data.success) {
        setHistory(data.data || []);
      }
    } catch (err) {
      console.error('Lỗi tải lịch sử:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const endpoint = transactionType === 'import' ? '/api/qlkho/import' : '/api/qlkho/export';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(transactionForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi thực hiện giao dịch');
      }

      alert(data.message || 'Thành công!');
      resetTransactionForm();
      loadStocks();
      loadHistory();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      productId: '',
      warehouseId: '1',
      quantity: '',
      note: '',
    });
    setShowTransactionForm(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStockStatus = (available) => {
    if (available > 20) return { text: 'Nhiều', color: '#10b981' };
    if (available > 5) return { text: 'Vừa', color: '#f59e0b' };
    return { text: 'Thấp', color: '#ef4444' };
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Quản Lý Kho</h1>
        <p className={styles.subtitle}>Theo dõi tồn kho và xuất nhập hàng</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stocks.length}</div>
          <div className={styles.statLabel}>Sản phẩm trong kho</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {stocks.filter((s) => s.availableQuantity <= 10).length}
          </div>
          <div className={styles.statLabel}>Cảnh báo tồn thấp</div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsNav}>
          <button
            className={`${styles.tabButton} ${activeTab === 'stocks' ? styles.active : ''}`}
            onClick={() => setActiveTab('stocks')}
          >
            <Package size={18} /> Tồn kho
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'history' ? styles.active : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Calendar size={18} /> Lịch sử
          </button>
        </div>

        <div className={styles.tabContent}>
          {/* Stocks Tab */}
          {activeTab === 'stocks' && (
            <>
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
                  value={filterWarehouse}
                  onChange={(e) => setFilterWarehouse(e.target.value)}
                >
                  <option value="">Tất cả kho</option>
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' }}>
                  <input
                    type="checkbox"
                    checked={showLowStock}
                    onChange={(e) => setShowLowStock(e.target.checked)}
                  />
                  Chỉ hiện tồn thấp
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={styles.addButton}
                    onClick={() => {
                      setTransactionType('import');
                      setShowTransactionForm(true);
                    }}
                  >
                    <TrendingUp size={18} /> Nhập kho
                  </button>
                  <button
                    className={styles.addButton}
                    onClick={() => {
                      setTransactionType('export');
                      setShowTransactionForm(true);
                    }}
                  >
                    <TrendingDown size={18} /> Xuất kho
                  </button>
                </div>
              </div>

              {/* Transaction Form */}
              {showTransactionForm && (
                <form className={styles.formContainer} onSubmit={handleTransaction}>
                  <h3 className={styles.formTitle}>
                    {transactionType === 'import' ? 'Nhập kho' : 'Xuất kho'}
                  </h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Mã sản phẩm *</label>
                      <input
                        type="number"
                        className={styles.formInput}
                        value={transactionForm.productId}
                        onChange={(e) =>
                          setTransactionForm({ ...transactionForm, productId: e.target.value })
                        }
                        required
                        placeholder="Nhập ID sản phẩm"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Kho</label>
                      <select
                        className={styles.formSelect}
                        value={transactionForm.warehouseId}
                        onChange={(e) =>
                          setTransactionForm({ ...transactionForm, warehouseId: e.target.value })
                        }
                      >
                        {warehouses.map((wh) => (
                          <option key={wh.id} value={wh.id}>
                            {wh.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Số lượng *</label>
                      <input
                        type="number"
                        className={styles.formInput}
                        value={transactionForm.quantity}
                        onChange={(e) =>
                          setTransactionForm({ ...transactionForm, quantity: e.target.value })
                        }
                        required
                        min="1"
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Ghi chú</label>
                    <textarea
                      className={styles.formTextarea}
                      value={transactionForm.note}
                      onChange={(e) =>
                        setTransactionForm({ ...transactionForm, note: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={`${styles.submitButton} ${styles.saveButton}`}
                      disabled={loading}
                    >
                      {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                    <button
                      type="button"
                      className={`${styles.submitButton} ${styles.cancelButton}`}
                      onClick={resetTransactionForm}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* Error */}
              {error && (
                <div
                  style={{
                    padding: '15px',
                    background: '#fee',
                    color: '#c00',
                    borderRadius: '8px',
                    marginBottom: '20px',
                  }}
                >
                  <AlertTriangle size={20} style={{ display: 'inline', marginRight: '8px' }} />
                  {error}
                </div>
              )}

              {/* Stocks Table */}
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  Đang tải...
                </div>
              ) : stocks.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Sản phẩm</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Danh mục</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Kho</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Tồn kho</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Đã giữ</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Khả dụng</th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map((stock, idx) => {
                        const status = getStockStatus(stock.availableQuantity);
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}>
                              <div style={{ fontWeight: 600 }}>{stock.productName}</div>
                              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>ID: {stock.productId}</div>
                            </td>
                            <td style={{ padding: '12px' }}>{stock.categoryName || '-'}</td>
                            <td style={{ padding: '12px' }}>{stock.warehouseName}</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>{stock.quantityOnHand}</td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>{stock.quantityReserved}</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700 }}>{stock.availableQuantity}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, background: `${status.color}22`, color: status.color }}>
                                {status.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <Warehouse size={64} />
                  </div>
                  <div className={styles.emptyTitle}>Chưa có dữ liệu tồn kho</div>
                </div>
              )}
            </>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <>
              {loading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  Đang tải...
                </div>
              ) : history.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Thời gian</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Loại</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Sản phẩm</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Số lượng</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Kho</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Người thực hiện</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '12px', fontSize: '0.9rem' }}>{formatDate(item.timestamp)}</td>
                          <td style={{ padding: '12px' }}>
                            <span
                              style={{
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                background: item.transactionType === 'NHAP' ? '#dcfce722' : '#fee2e222',
                                color: item.transactionType === 'NHAP' ? '#16a34a' : '#dc2626',
                              }}
                            >
                              {item.transactionType === 'NHAP' ? 'Nhập kho' : 'Xuất kho'}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>{item.productName}</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>
                            {item.transactionType === 'NHAP' ? '+' : '-'}{item.quantity}
                          </td>
                          <td style={{ padding: '12px' }}>{item.warehouseName}</td>
                          <td style={{ padding: '12px' }}>{item.performedByName || 'N/A'}</td>
                          <td style={{ padding: '12px', fontSize: '0.9rem', color: '#64748b' }}>{item.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <Calendar size={64} />
                  </div>
                  <div className={styles.emptyTitle}>Chưa có lịch sử giao dịch</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QLKho;
