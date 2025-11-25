// src/pages/NoiBo/QLSP.js
import React, { useState, useEffect } from 'react';
import styles from '../../styles/NoiBo/QLSP.module.css';
import { useAuth } from '../../context/AuthContext';
import { getFunctionsByRole } from '../../lib/auth/permissionManager';

const QLSP = () => {
  const { authUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit', 'view'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    TenSanPham: '',
    MoTa: '',
    Gia: '',
    GiaGoc: '',
    SoLuongTon: '',
    MaDanhMuc: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RBAC: Kiểm tra quyền thực tế từ database
  // TODO: Replace với API call thật từ backend
  const userPermissions = authUser?.permissions || [
    'product.view', 'product.create', 'product.update', 'product.delete_soft',
    'promo.manage', 'review.moderate', 'product.price_update', 'product.media_update'
  ];
  const userRole = authUser?.vai_tro || 'QL_SanPham';
  
  // Kiểm tra quyền cụ thể
  const hasPermission = (permission) => userPermissions.includes(permission);
  const canView = hasPermission('product.view');
  const canCreate = hasPermission('product.create');
  const canUpdate = hasPermission('product.update');
  const canDeleteSoft = hasPermission('product.delete_soft');

  // Mock data dựa trên cấu trúc database
  const mockProducts = [
    {
      MaSanPham: 1,
      MaDanhMuc: 1,
      TenSanPham: "Kem dưỡng ẩm ban đêm",
      MoTa: "Phù hợp da khô",
      Gia: 159000,
      GiaGoc: 199000,
      SoLuongTon: 50,
      anh_dai_dien: null,
      MaThuongHieu: 1
    },
    {
      MaSanPham: 2,
      MaDanhMuc: 2,
      TenSanPham: "Dầu gội Romano Classic",
      MoTa: "Công thức cải tiến cho tóc nam",
      Gia: 95000,
      GiaGoc: 109000,
      SoLuongTon: 100,
      anh_dai_dien: null,
      MaThuongHieu: 2
    },
    {
      MaSanPham: 3,
      MaDanhMuc: 2,
      TenSanPham: "Dầu gội Romano Force",
      MoTa: "Chứa Pro-Vitamin B5, mạnh mẽ",
      Gia: 99000,
      GiaGoc: 115000,
      SoLuongTon: 80,
      anh_dai_dien: null,
      MaThuongHieu: 2
    },
    {
      MaSanPham: 4,
      MaDanhMuc: 2,
      TenSanPham: "Dầu gội Romano Attitude",
      MoTa: "Hương thơm nam tính, hiện đại",
      Gia: 98000,
      GiaGoc: 110000,
      SoLuongTon: 120,
      anh_dai_dien: null,
      MaThuongHieu: 2
    },
    {
      MaSanPham: 5,
      MaDanhMuc: 2,
      TenSanPham: "Dầu gội Romano Cleansing",
      MoTa: "Làm sạch sâu da đầu",
      Gia: 92000,
      GiaGoc: 105000,
      SoLuongTon: 90,
      anh_dai_dien: null,
      MaThuongHieu: 2
    },
    {
      MaSanPham: 6,
      MaDanhMuc: 2,
      TenSanPham: "Dầu gội Romano Premium",
      MoTa: "Dòng cao cấp, chuyên nghiệp",
      Gia: 125000,
      GiaGoc: 149000,
      SoLuongTon: 60,
      anh_dai_dien: null,
      MaThuongHieu: 2
    },
    {
      MaSanPham: 7,
      MaDanhMuc: 2,
      TenSanPham: "Dầu gội Romano Anti-Dandruff",
      MoTa: "Công thức ZPTO chống gàu",
      Gia: 105000,
      GiaGoc: 120000,
      SoLuongTon: 75,
      anh_dai_dien: null,
      MaThuongHieu: 2
    },
    {
      MaSanPham: 8,
      MaDanhMuc: 2,
      TenSanPham: "Dầu gội 3-in-1 Romano Sport",
      MoTa: "Dùng cho tóc/mặt/toàn thân",
      Gia: 110000,
      GiaGoc: 129000,
      SoLuongTon: 45,
      anh_dai_dien: null,
      MaThuongHieu: 2
    },
    {
      MaSanPham: 9,
      MaDanhMuc: 2,
      TenSanPham: "Dầu gội Romano Elegance",
      MoTa: "Hương thơm lịch lãm, sang trọng",
      Gia: 97000,
      GiaGoc: 112000,
      SoLuongTon: 85,
      anh_dai_dien: null,
      MaThuongHieu: 2
    },
    {
      MaSanPham: 10,
      MaDanhMuc: 2,
      TenSanPham: "Dầu gội Romano Strong Hold",
      MoTa: "Giữ nếp lâu, mạnh mẽ",
      Gia: 102000,
      GiaGoc: 118000,
      SoLuongTon: 70,
      anh_dai_dien: null,
      MaThuongHieu: 2
    },
    {
      MaSanPham: 11,
      MaDanhMuc: 2,
      TenSanPham: "Dầu gội Romano Detox",
      MoTa: "Than hoạt tính, làm sạch",
      Gia: 108000,
      GiaGoc: 125000,
      SoLuongTon: 55,
      anh_dai_dien: null,
      MaThuongHieu: 2
    }
  ];

  // Lấy danh sách sản phẩm từ database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Chỉ load nếu có quyền xem
        if (!canView) {
          setLoading(false);
          return;
        }
        
        // TODO: Replace với API call thật từ backend
        // const response = await fetch('/api/products', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // const data = await response.json();
        // setProducts(data);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(mockProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]); // Clear products on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [canView]);

  // Xử lý tìm kiếm và lọc
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.TenSanPham?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.MoTa?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.MaDanhMuc?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Xử lý mở modal
  const openModal = (type, product = null) => {
    // Kiểm tra quyền trước khi mở modal
    if (type === 'create' && !canCreate) return;
    if (type === 'edit' && !canUpdate) return;
    if (type === 'view' && !canView) return;
    
    setModalType(type);
    setSelectedProduct(product);
    
    // Reset form data
    if (type === 'create') {
      setFormData({
        TenSanPham: '',
        MoTa: '',
        Gia: '',
        GiaGoc: '',
        SoLuongTon: '',
        MaDanhMuc: ''
      });
    } else if (type === 'edit' && product) {
      setFormData({
        TenSanPham: product.TenSanPham || '',
        MoTa: product.MoTa || '',
        Gia: product.Gia?.toString() || '',
        GiaGoc: product.GiaGoc?.toString() || '',
        SoLuongTon: product.SoLuongTon?.toString() || '',
        MaDanhMuc: product.MaDanhMuc?.toString() || ''
      });
    }
    
    setShowModal(true);
  };

  // Xử lý đóng modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setModalType('');
    setFormData({
      TenSanPham: '',
      MoTa: '',
      Gia: '',
      GiaGoc: '',
      SoLuongTon: '',
      MaDanhMuc: ''
    });
  };

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // API Functions để kết nối database
  const createProduct = async (productData) => {
    try {
      // TODO: Replace với API call thật từ backend
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          TenSanPham: productData.TenSanPham,
          MoTa: productData.MoTa,
          Gia: parseFloat(productData.Gia),
          GiaGoc: parseFloat(productData.GiaGoc),
          SoLuongTon: parseInt(productData.SoLuongTon),
          MaDanhMuc: parseInt(productData.MaDanhMuc)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      // Fallback to mock data for testing
      return {
        MaSanPham: Date.now(),
        ...productData,
        Gia: parseFloat(productData.Gia),
        GiaGoc: parseFloat(productData.GiaGoc),
        SoLuongTon: parseInt(productData.SoLuongTon),
        MaDanhMuc: parseInt(productData.MaDanhMuc),
        anh_dai_dien: null,
        MaThuongHieu: 1
      };
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      // TODO: Replace với API call thật từ backend
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          TenSanPham: productData.TenSanPham,
          MoTa: productData.MoTa,
          Gia: parseFloat(productData.Gia),
          GiaGoc: parseFloat(productData.GiaGoc),
          SoLuongTon: parseInt(productData.SoLuongTon),
          MaDanhMuc: parseInt(productData.MaDanhMuc)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      // Fallback to mock data for testing
      return {
        MaSanPham: productId,
        ...productData,
        Gia: parseFloat(productData.Gia),
        GiaGoc: parseFloat(productData.GiaGoc),
        SoLuongTon: parseInt(productData.SoLuongTon),
        MaDanhMuc: parseInt(productData.MaDanhMuc),
        anh_dai_dien: null,
        MaThuongHieu: 1
      };
    }
  };

  // Xử lý submit form với kết nối database
  const handleFormSubmit = async () => {
    // Validate form data
    if (!formData.TenSanPham || !formData.Gia || !formData.SoLuongTon || !formData.MaDanhMuc) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Validate số liệu
    if (parseFloat(formData.Gia) <= 0 || parseInt(formData.SoLuongTon) < 0) {
      alert('Giá và số lượng phải là số dương!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let newProduct;
      
      if (modalType === 'create') {
        newProduct = await createProduct(formData);
        // Cập nhật danh sách sản phẩm
        setProducts(prev => [...prev, newProduct]);
        alert('Tạo sản phẩm mới thành công!');
      } else if (modalType === 'edit' && selectedProduct) {
        const updatedProduct = await updateProduct(selectedProduct.MaSanPham, formData);
        // Cập nhật danh sách sản phẩm
        setProducts(prev => prev.map(p => 
          p.MaSanPham === selectedProduct.MaSanPham ? { ...p, ...updatedProduct } : p
        ));
        alert('Cập nhật sản phẩm thành công!');
      }
      
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Kiểm tra quyền truy cập
  if (!canView) {
    return (
      <div style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        padding: '40px 80px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginTop: '100px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '16px'
          }}>
            Không có quyền truy cập
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem'
          }}>
            Bạn không có quyền xem trang này. Vui liên hệ quản trị viên để được cấp quyền.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        padding: '40px 80px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginTop: '100px'
        }}>
          <div style={{
            fontSize: '1.1rem',
            color: '#374151',
            fontWeight: '500'
          }}>
            Đang tải dữ liệu sản phẩm...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      padding: '40px 80px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '32px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '12px'
        }}>
          Quản Lý Sản Phẩm
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#6b7280',
          fontWeight: '400'
        }}>
          Quản lý danh sách sản phẩm, giá cả và thuộc tính một cách hiệu quả
        </p>
        <div style={{
          marginTop: '16px',
          padding: '8px 16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          display: 'inline-block'
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: '#374151',
            fontWeight: '500'
          }}>
            Vai trò: {userRole} | Quyền: {userPermissions.length} chức năng
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            {products.length}
          </div>
          <div style={{
            fontSize: '1rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            Tổng Sản Phẩm
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#059669',
            marginBottom: '8px'
          }}>
            {products.filter(p => p.SoLuongTon > 10).length}
          </div>
          <div style={{
            fontSize: '1rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            Còn Hàng
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#dc2626',
            marginBottom: '8px'
          }}>
            {products.filter(p => p.GiaGoc && p.GiaGoc > p.Gia).length}
          </div>
          <div style={{
            fontSize: '1rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            Đang Giảm Giá
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#7c3aed',
            marginBottom: '8px'
          }}>
            {formatPrice(products.reduce((sum, p) => sum + (p.Gia * p.SoLuongTon), 0))}
          </div>
          <div style={{
            fontSize: '1rem',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            Tổng Giá Trị
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '32px',
        alignItems: 'center',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          position: 'relative',
          flex: '1',
          maxWidth: '400px'
        }}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#ffffff',
              color: '#374151',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
            }}
          />
        </div>

        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#ffffff',
            color: '#374151',
            minWidth: '160px',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="">Tất cả danh mục</option>
          <option value="1">Điện tử</option>
          <option value="2">Thời trang</option>
          <option value="3">Gia dụng</option>
        </select>

        {canCreate && (
          <button
            onClick={() => openModal('create')}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}
          >
            Thêm Sản Phẩm
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        marginTop: '32px'
      }}>
        {filteredProducts.map((product) => (
          <div key={product.MaSanPham} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            transition: 'box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
          }}
          >
            
            {/* Product Image */}
            <div style={{
              aspectRatio: '1',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '1px solid #e5e7eb'
            }}>
              {product.anh_dai_dien ? (
                <img
                  src={product.anh_dai_dien}
                  alt={product.TenSanPham}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              ) : (
                <span style={{
                  fontSize: '2rem',
                  color: '#9ca3af'
                }}>
                  IMG
                </span>
              )}
            </div>

            {/* Product Info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  {product.TenSanPham}
                </h3>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontFamily: 'monospace',
                  backgroundColor: '#f3f4f6',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  SKU: {product.MaSanPham}
                </span>
              </div>
            </div>

            <p style={{
              color: '#6b7280',
              marginBottom: '16px',
              lineHeight: '1.5',
              fontSize: '0.875rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {product.MoTa}
            </p>
            
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              {formatPrice(product.Gia)}
            </div>

            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: '500',
              marginBottom: '16px'
            }}>
              Danh mục {product.MaDanhMuc}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: product.SoLuongTon > 50 ? '#10b981' : 
                               product.SoLuongTon > 10 ? '#f59e0b' : '#ef4444'
              }}></div>
              <span>Còn lại: {product.SoLuongTon} sản phẩm</span>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px'
            }}>
              {canView && (
                <button
                  onClick={() => openModal('view', product)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    backgroundColor: '#ffffff',
                    color: '#374151',
                    flex: 1
                  }}
                >
                  Xem
                </button>
              )}
              
              {canUpdate && (
                <button
                  onClick={() => openModal('edit', product)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    backgroundColor: '#f9fafb',
                    color: '#374151',
                    flex: 1
                  }}
                >
                  Sửa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginTop: '40px'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Không có sản phẩm nào
          </h3>
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            {searchTerm || selectedCategory ? 
              'Không tìm thấy sản phẩm phù hợp với bộ lọc.' : 
              'Chưa có sản phẩm nào trong hệ thống.'}
          </p>
          {canCreate && !searchTerm && !selectedCategory && (
            <button
              onClick={() => openModal('create')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Thêm Sản Phẩm Đầu Tiên
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '24px',
              textAlign: 'center',
              color: '#1f2937'
            }}>
              {modalType === 'create' ? 'Thêm Sản Phẩm Mới' :
               modalType === 'edit' ? 'Chỉnh Sửa Sản Phẩm' : 'Chi Tiết Sản Phẩm'}
            </h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '32px',
              textAlign: 'center',
              lineHeight: '1.6'
            }}>
              {modalType === 'create' ? 'Điền thông tin để tạo sản phẩm mới' :
               modalType === 'edit' ? 'Cập nhật thông tin sản phẩm' : 'Xem chi tiết thông tin sản phẩm'}
            </p>
            
            {/* View mode - Display product details */}
            {selectedProduct && modalType === 'view' && (
              <div style={{marginBottom: '24px'}}>
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Tên sản phẩm
                  </h4>
                  <p style={{
                    color: '#1f2937'
                  }}>
                    {selectedProduct.TenSanPham}
                  </p>
                </div>
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Giá bán
                  </h4>
                  <p style={{
                    color: '#1f2937'
                  }}>
                    {formatPrice(selectedProduct.Gia)}
                  </p>
                </div>
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <h4 style={{
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Số lượng tồn
                  </h4>
                  <p style={{
                    color: '#1f2937'
                  }}>
                    {selectedProduct.SoLuongTon} sản phẩm
                  </p>
                </div>
              </div>
            )}

            {/* Create/Edit mode - Form fields */}
            {(modalType === 'create' || modalType === 'edit') && (
              <div style={{marginBottom: '24px'}}>
                {/* Tên sản phẩm */}
                <div style={{marginBottom: '16px'}}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    name="TenSanPham"
                    value={formData.TenSanPham}
                    onChange={handleFormChange}
                    placeholder="Nhập tên sản phẩm"
                    required
                    maxLength="255"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Mô tả */}
                <div style={{marginBottom: '16px'}}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Mô tả
                  </label>
                  <textarea
                    name="MoTa"
                    value={formData.MoTa}
                    onChange={handleFormChange}
                    placeholder="Nhập mô tả sản phẩm"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Giá bán và Giá gốc */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Giá bán (VND)
                    </label>
                    <input
                      type="number"
                      name="Gia"
                      value={formData.Gia}
                      onChange={handleFormChange}
                      placeholder="0"
                      min="1"
                      step="1000"
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Giá gốc (VND)
                    </label>
                    <input
                      type="number"
                      name="GiaGoc"
                      value={formData.GiaGoc}
                      onChange={handleFormChange}
                      placeholder="0"
                      min="1"
                      step="1000"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Số lượng tồn */}
                <div style={{marginBottom: '16px'}}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Số lượng tồn
                  </label>
                  <input
                    type="number"
                    name="SoLuongTon"
                    value={formData.SoLuongTon}
                    onChange={handleFormChange}
                    placeholder="0"
                    min="0"
                    step="1"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Danh mục */}
                <div style={{marginBottom: '16px'}}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Danh mục
                  </label>
                  <select
                    name="MaDanhMuc"
                    value={formData.MaDanhMuc}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="1">1 - Dưỡng da</option>
                    <option value="2">2 - Dầu Gội</option>
                    <option value="3">3 - Chăm sóc da</option>
                    <option value="4">4 - Sáp/Gel Tóc</option>
                    <option value="5">5 - Nước Hoa</option>
                  </select>
                </div>
              </div>
            )}
            
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px'
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: '#ffffff',
                  color: '#374151'
                }}
              >
                Đóng
              </button>
              {modalType !== 'view' && (
                <button 
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: modalType === 'create' ? '#10b981' : '#f59e0b',
                    color: 'white',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                >
                  {isSubmitting ? 'Đang xử lý...' : (modalType === 'create' ? 'Tạo Sản Phẩm' : 'Lưu Thay Đổi')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QLSP;