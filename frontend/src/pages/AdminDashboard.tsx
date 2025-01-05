import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Category } from '../types';
import { Plus, Edit, Trash } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // 导入 useAuth
import { AdminAlbumList } from '../components/admin/AdminAlbumList.tsx';  // 导入 AdminAlbumList
import { AdminCommentList } from '../components/admin/AdminCommentList.tsx';  // 导入 AdminCommentList
import { AdminSettings } from '../components/admin/AdminSettings.tsx';  // 导入 AdminSettings

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();  // 获取用户的角色
  const [activeTab, setActiveTab] = useState('categories'); // 当前活跃的标签
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // 获取所有分类
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // 添加分类
  const handleAddCategory = async () => {
    try {
      const newCategory = { name: categoryName, description: categoryDescription };
      const response = await axios.post('/api/categories', newCategory);
      setCategories([...categories, response.data]);
      setShowModal(false); // 关闭 Modal
      setCategoryName('');
      setCategoryDescription('');
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // 编辑分类
  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    try {
      const updatedCategory = { ...selectedCategory, name: categoryName, description: categoryDescription };
      const response = await axios.put(`/api/categories/${selectedCategory.id}`, updatedCategory);
      const updatedCategories = categories.map((category) =>
          category.id === updatedCategory.id ? response.data : category
      );
      setCategories(updatedCategories);
      setShowModal(false); // 关闭 Modal
      setCategoryName('');
      setCategoryDescription('');
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  // 删除分类
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await axios.delete(`/api/categories/${categoryId}`);
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // 打开编辑 Modal
  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
    setShowModal(true);
  };

  // 切换显示标签
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
                className={`px-4 py-2 ${activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleTabChange('categories')}
            >
              Category Management
            </button>
            <button
                className={`px-4 py-2 ${activeTab === 'albums' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleTabChange('albums')}
            >
              Album Management
            </button>
            <button
                className={`px-4 py-2 ${activeTab === 'comments' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleTabChange('comments')}
            >
              Comment Management
            </button>
            <button
                className={`px-4 py-2 ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                onClick={() => handleTabChange('settings')}
            >
              Settings
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow">
          {activeTab === 'categories' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Category Management</h2>
                  {isAdmin && (
                      <button
                          onClick={() => setShowModal(true)}
                          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Category
                      </button>
                  )}
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{category.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {isAdmin && (
                              <>
                                <button
                                    onClick={() => handleOpenEditModal(category)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                  <Trash className="h-5 w-5" />
                                </button>
                              </>
                          )}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </>
          )}

          {activeTab === 'albums' && <AdminAlbumList />}  {/* 管理专辑的组件 */}
          {activeTab === 'comments' && <AdminCommentList />}  {/* 管理评论的组件 */}
          {activeTab === 'settings' && <AdminSettings />}  {/* 管理设置的组件 */}
        </div>

        {/* Modal */}
        {showModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">{selectedCategory ? 'Edit Category' : 'Add Category'}</h2>
                <div className="mb-4">
                  <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <input
                      type="text"
                      id="category-name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="category-description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                      id="category-description"
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={selectedCategory ? handleEditCategory : handleAddCategory}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {selectedCategory ? 'Save Changes' : 'Add Category'}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};
