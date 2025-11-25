// src/pages/NoiBo/QLKho.js
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import {
  Package,
  Warehouse,
  TrendingUp,
  TrendingDown,
  Clock,
  BarChart,
  Search,
  AlertTriangle,
  Plus,
  Minus,
  MoreVertical
} from 'lucide-react';

const QLKho = () => {
  const { authUser, getFunctionsByRole } = useAuth();
  const [activeTab, setActiveTab] = useState('qlkho');
  const [stocks, setStocks] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  // Get user functions for QLKho
  const functions = getFunctionsByRole(authUser?.vai_tro || 'QL_Kho');
  const warehouseFunctions = functions.filter(f => f.group === 'Kho');

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockStocks = [
          {
            id: 1,
            san_pham_id: 'SP001',
            TenSanPham: 'iPhone 15 Pro',
            kho_id: 1,
            TenKho: 'Kho Chính',
            so_luong_ton: 25,
            Gia: 25990000
          },
          {
            id: 2,
            san_pham_id: 'SP002',
            TenSanPham: 'Samsung Galaxy S24',
            kho_id: 1,
            TenKho: 'Kho Chính',
            so_luong_ton: 8,
            Gia: 18990000
          },
          {
            id: 3,
            san_pham_id: 'SP003',
            TenSanPham: 'MacBook Air M3',
            kho_id: 2,
            TenKho: 'Kho Phụ',
            so_luong_ton: 0,
            Gia: 32990000
          }
        ];

        const mockWarehouses = [
          { id: 1, ten_kho: 'Kho Chính' },
          { id: 2, ten_kho: 'Kho Phụ' }
        ];

        setStocks(mockStocks);
        setWarehouses(mockWarehouses);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter stocks based on search and warehouse
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.TenSanPham?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.TenKho?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = !selectedWarehouse || stock.kho_id?.toString() === selectedWarehouse;
    return matchesSearch && matchesWarehouse;
  });

  // Calculate statistics
  const totalStockValue = filteredStocks.reduce((sum, stock) => {
    return sum + (stock.so_luong_ton * stock.Gia);
  }, 0);

  const lowStockItems = filteredStocks.filter(stock => stock.so_luong_ton < 10).length;
  const outOfStockItems = filteredStocks.filter(stock => stock.so_luong_ton === 0).length;

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Format stock quantity with colors
  const formatStockQuantity = (quantity) => {
    if (quantity === 0) {
      return <span style={{ color: '#dc2626', fontWeight: '600' }}>Hết hàng</span>;
    } else if (quantity < 10) {
      return <span style={{ color: '#ea580c', fontWeight: '600' }}>{quantity}</span>;
    } else {
      return <span style={{ color: '#059669', fontWeight: '600' }}>{quantity}</span>;
    }
  };

  if (loading) {
    return (
      <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#6b7280' }}>Đang tải dữ liệu...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: '#111827', 
            marginBottom: '8px' 
          }}>
            Quản Lý Kho
          </h1>
          <p style={{ color: '#6b7280' }}>
            Quản lý tồn kho, nhập xuất hàng và theo dõi lịch sử kho
          </p>
        </div>

        {/* Statistics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Tổng giá trị tồn
                </p>
                <p style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#111827' 
                }}>
                  {formatPrice(totalStockValue)}
                </p>
              </div>
              <div style={{ 
                padding: '12px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%'
              }}>
                <BarChart style={{ color: '#2563eb', width: '24px', height: '24px' }} />
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Tổng mặt hàng
                </p>
                <p style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#111827' 
                }}>
                  {filteredStocks.length}
                </p>
              </div>
              <div style={{ 
                padding: '12px',
                backgroundColor: '#d1fae5',
                borderRadius: '50%'
              }}>
                <Package style={{ color: '#059669', width: '24px', height: '24px' }} />
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Sắp hết hàng
                </p>
                <p style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#ea580c' 
                }}>
                  {lowStockItems}
                </p>
              </div>
              <div style={{ 
                padding: '12px',
                backgroundColor: '#fed7aa',
                borderRadius: '50%'
              }}>
                <AlertTriangle style={{ color: '#ea580c', width: '24px', height: '24px' }} />
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Hết hàng
                </p>
                <p style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#dc2626' 
                }}>
                  {outOfStockItems}
                </p>
              </div>
              <div style={{ 
                padding: '12px',
                backgroundColor: '#fecaca',
                borderRadius: '50%'
              }}>
                <Package style={{ color: '#dc2626', width: '24px', height: '24px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: '280px', maxWidth: '400px' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                width: '20px',
                height: '20px'
              }} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm trong kho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="">Tất cả kho</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.ten_kho}
                  </option>
                ))}
              </select>

              {warehouseFunctions.find(f => f.name === 'Lịch sử kho') && (
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <Clock size={20} />
                  Lịch Sử
                </button>
              )}

              {warehouseFunctions.find(f => f.name === 'Điều chỉnh nhập/xuất') && (
                <>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <TrendingUp size={20} />
                    Nhập Kho
                  </button>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <TrendingDown size={20} />
                    Xuất Kho
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stocks Table */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ 
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Sản Phẩm
                  </th>
                  <th style={{ 
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Kho
                  </th>
                  <th style={{ 
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Số Lượng Tồn
                  </th>
                  <th style={{ 
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Giá
                  </th>
                  <th style={{ 
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Tổng Giá Trị
                  </th>
                  <th style={{ 
                    padding: '12px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid #e5e7eb' }}>
                {filteredStocks.map((stock, index) => (
                  <tr key={stock.id} style={{ 
                    backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'
                  }}>
                    {/* Product Info */}
                    <td style={{ padding: '16px 24px' }}>
                      <div>
                        <div style={{ 
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#111827'
                        }}>
                          {stock.TenSanPham}
                        </div>
                        <div style={{ 
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          Mã: {stock.san_pham_id}
                        </div>
                      </div>
                    </td>

                    {/* Warehouse */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Warehouse style={{ 
                          width: '16px', 
                          height: '16px', 
                          color: '#9ca3af', 
                          marginRight: '8px' 
                        }} />
                        <span style={{ fontSize: '14px', color: '#111827' }}>
                          {stock.TenKho}
                        </span>
                      </div>
                    </td>

                    {/* Stock Quantity */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {formatStockQuantity(stock.so_luong_ton)}
                        {stock.so_luong_ton === 0 && (
                          <AlertTriangle style={{ 
                            width: '16px', 
                            height: '16px', 
                            color: '#dc2626' 
                          }} />
                        )}
                        {stock.so_luong_ton > 0 && stock.so_luong_ton < 10 && (
                          <AlertTriangle style={{ 
                            width: '16px', 
                            height: '16px', 
                            color: '#ea580c' 
                          }} />
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#111827' }}>
                      {formatPrice(stock.Gia)}
                    </td>

                    {/* Total Value */}
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      {formatPrice(stock.so_luong_ton * stock.Gia)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {warehouseFunctions.find(f => f.name === 'Điều chỉnh nhập/xuất') && (
                          <>
                            <button
                              style={{
                                color: '#059669',
                                padding: '4px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer'
                              }}
                              title="Nhập thêm"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              style={{
                                color: '#dc2626',
                                padding: '4px',
                                borderRadius: '4px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                cursor: 'pointer'
                              }}
                              title="Xuất bớt"
                            >
                              <Minus size={16} />
                            </button>
                          </>
                        )}
                        <button
                          style={{
                            color: '#9ca3af',
                            padding: '4px',
                            borderRadius: '4px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer'
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredStocks.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px',
            backgroundColor: 'white',
            borderRadius: '8px',
            marginTop: '24px',
            border: '1px solid #e5e7eb'
          }}>
            <Package style={{ 
              width: '64px', 
              height: '64px', 
              color: '#d1d5db', 
              margin: '0 auto 16px' 
            }} />
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '500', 
              color: '#111827',
              marginBottom: '8px'
            }}>
              Không có dữ liệu tồn kho
            </h3>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '24px' 
            }}>
              {searchTerm || selectedWarehouse ? 'Không tìm thấy sản phẩm phù hợp với bộ lọc' : 'Chưa có dữ liệu tồn kho'}
            </p>
            {warehouseFunctions.find(f => f.name === 'Điều chỉnh nhập/xuất') && (
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  margin: '0 auto'
                }}
              >
                <TrendingUp size={20} />
                Nhập Hàng Đầu Tiên
              </button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default QLKho;