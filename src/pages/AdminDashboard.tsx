import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  BarChart3, 
  LogOut, 
  Plus, 
  Search,
  TrendingUp,
  MousePointerClick,
  Calendar,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ProductForm } from '../components/Admin/ProductForm';
import { Analytics } from '../components/Admin/Analytics';
import { OrdersView } from '../components/Admin/OrdersView';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/database';
import { Product } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'banners' | 'analytics' | 'orders'>('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const unsubscribe = getProducts(setProducts);
    return () => unsubscribe();
  }, [navigate]);

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully');
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-900 border-r border-white/10 flex flex-col p-8 fixed h-full z-30">
        <div className="flex items-center gap-4 mb-12 px-2">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center soft-shadow">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter font-display">Wolf Admin</h2>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'banners', label: 'Banners', icon: ImageIcon },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] ${
                activeTab === item.id 
                  ? 'bg-red-600 text-white soft-shadow' 
                  : 'text-zinc-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              {/* @ts-ignore - Dynamic icon component */}
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl text-zinc-500 hover:bg-red-600/10 hover:text-red-600 transition-all font-black uppercase tracking-widest text-[10px] mt-auto"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter font-display">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-1">
              Manage your affiliate empire
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-zinc-900 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors w-64"
              />
            </div>
            {activeTab === 'products' && (
              <button 
                onClick={() => setShowProductForm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white hover:text-zinc-900 transition-all soft-shadow"
              >
                <Plus size={16} /> Add Product
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="grid grid-cols-1 gap-8">
          {activeTab === 'overview' && (
            <Analytics products={products} />
          )}

          {activeTab === 'analytics' && (
            <Analytics products={products} />
          )}

          {activeTab === 'orders' && (
            <OrdersView />
          )}

          {activeTab === 'products' && (
            <div className="bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden soft-shadow">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Product</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Category</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Price</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Clicks</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden">
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-black uppercase tracking-tight text-sm">{product.name}</p>
                            <p className="text-[10px] text-zinc-500 font-bold">ID: {product.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-zinc-400 uppercase tracking-widest">{product.category}</td>
                      <td className="px-8 py-6 font-black">₹{product.price.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <MousePointerClick size={14} className="text-red-600" />
                          <span className="font-black">{product.clicks || 0}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductForm(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 hover:bg-red-600/10 rounded-lg transition-colors text-zinc-400 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="space-y-4">
                          <Package size={48} className="text-zinc-700 mx-auto" />
                          <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">No products found. Add your first one!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showProductForm && (
        <ProductForm 
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }} 
          onSave={handleSaveProduct}
          initialData={editingProduct}
        />
      )}
    </div>
  );
};
