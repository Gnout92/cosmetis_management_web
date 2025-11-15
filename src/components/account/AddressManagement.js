import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/login.module.css';

const AddressManagement = ({ user, updateUser, showNotification }) => {
  const router = useRouter();
  const [addresses, setAddresses] = useState(user?.profile?.addresses || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      isDefault: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let newAddresses = [...addresses];
      
      // Nếu đây là địa chỉ mặc định, bỏ mặc định của các địa chỉ khác
      if (formData.isDefault) {
        newAddresses = newAddresses.map(addr => ({ ...addr, isDefault: false }));
      }

      if (editingIndex >= 0) {
        // Chỉnh sửa địa chỉ
        newAddresses[editingIndex] = {
          id: newAddresses[editingIndex].id,
          ...formData,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Thêm địa chỉ mới
        const newAddress = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        newAddresses.push(newAddress);
      }

      // Nếu đây là địa chỉ đầu tiên, tự động đặt làm mặc định
      if (newAddresses.length === 1) {
        newAddresses[0].isDefault = true;
      }

      await updateUser({
        profile: {
          ...user?.profile,
          addresses: newAddresses
        }
      });

      setAddresses(newAddresses);
      setShowAddForm(false);
      setEditingIndex(-1);
      resetForm();
      
      showNotification(
        editingIndex >= 0 ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ thành công!', 
        'success'
      );
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (index) => {
    const address = addresses[index];
    setFormData(address);
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleDelete = async (index) => {
    if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      try {
        const newAddresses = addresses.filter((_, i) => i !== index);
        
        // Nếu xóa địa chỉ mặc định và còn địa chỉ khác, đặt địa chỉ đầu tiên làm mặc định
        if (addresses[index].isDefault && newAddresses.length > 0) {
          newAddresses[0].isDefault = true;
        }

        await updateUser({
          profile: {
            ...user?.profile,
            addresses: newAddresses
          }
        });

        setAddresses(newAddresses);
        showNotification('Xóa địa chỉ thành công!', 'success');
      } catch (error) {
        showNotification('Có lỗi xảy ra khi xóa địa chỉ', 'error');
      }
    }
  };

  const handleSetDefault = async (index) => {
    try {
      const newAddresses = addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index
      }));

      await updateUser({
        profile: {
          ...user?.profile,
          addresses: newAddresses
        }
      });

      setAddresses(newAddresses);
      showNotification('Đã đặt làm địa chỉ mặc định!', 'success');
    } catch (error) {
      showNotification('Có lỗi xảy ra', 'error');
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingIndex(-1);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Địa chỉ giao hàng</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Quản lý địa chỉ giao hàng của bạn</p>
        </div>

        {/* Add Address Button */}
        {!showAddForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
            >
              ➕ Thêm địa chỉ mới
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingIndex >= 0 ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Họ tên người nhận
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    placeholder="Nhập họ tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Địa chỉ cụ thể
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  placeholder="Số nhà, tên đường"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phường/Xã
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    placeholder="Nhập phường/xã"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    placeholder="Nhập quận/huyện"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tỉnh/Thành phố
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    placeholder="Nhập tỉnh/thành phố"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Đang lưu...' : (
                    editingIndex >= 0 ? '💾 Cập nhật' : '💾 Lưu địa chỉ'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        {addresses.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Danh sách địa chỉ ({addresses.length})
              </h2>
            </div>

            <div className="grid gap-4">
              {addresses.map((address, index) => (
                <div key={address.id} className={`p-6 rounded-lg border-2 transition-all ${
                  address.isDefault 
                    ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}>
                  {address.isDefault && (
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 bg-pink-600 text-white text-xs font-medium rounded-full">
                        ⭐ Mặc định
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {address.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        📞 {address.phone}
                      </p>
                      <div className="text-gray-700 dark:text-gray-300">
                        <p>{address.address}</p>
                        <p>{address.ward}, {address.district}, {address.city}</p>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2 lg:justify-end">
                      <button
                        onClick={() => handleEdit(index)}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        ✏️ Chỉnh sửa
                      </button>
                      
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(index)}
                          className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                        >
                          ⭐ Đặt làm mặc định
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(index)}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !showAddForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Chưa có địa chỉ nào
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thêm địa chỉ giao hàng để mua sắm dễ dàng hơn
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
                >
                  ➕ Thêm địa chỉ đầu tiên
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AddressManagement;