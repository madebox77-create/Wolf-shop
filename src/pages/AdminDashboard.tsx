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
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ProductForm } from '../components/Admin/ProductForm';
import { Analytics } from '../components/Admin/Analytics';
import { OrdersView } from '../components/Admin/OrdersView';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/database';
import { Product } from '../types';

import { 
  productService, 
  Product as AffiliateProduct, 
  Banner as AffiliateBanner 
} from '../services/productService';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'banners' | 'analytics'>('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [banners, setBanners] = useState<AffiliateBanner[]>([]);
  const [editingProduct, setEditingProduct] = useState<AffiliateProduct | null>(null);
  
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Check if logged in with special creditentials
    const isAdmin = localStorage.getItem('is_wolf_admin') === 'true';
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    const unsubscribeProducts = productService.subscribeProducts(setProducts);
    const unsubscribeBanners = productService.subscribeBanners(setBanners);
    
    return () => {
      unsubscribeProducts();
      unsubscribeBanners();
    };
  }, [navigate]);

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct?.id) {
        await productService.updateProduct(editingProduct.id, productData);
        toast.success('Affiliate product updated');
      } else {
        await productService.addProduct(productData);
        toast.success('Affiliate product added to inventory');
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error('Failed to sync product with Firestore');
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.addBanner({
        title: bannerTitle,
        description: bannerDesc,
        imageUrl: bannerImage,
        isActive: true
      });
      setBannerTitle('');
      setBannerDesc('');
      setBannerImage('');
      setShowBannerForm(false);
      toast.success('Banner added to slider');
    } catch (error) {
      toast.error('Failed to create banner');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (window.confirm('Remove this banner from homepage?')) {
      await productService.deleteBanner(id);
      toast.success('Banner removed');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Remove this product permanently?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product removed');
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('is_wolf_admin');
    toast.success('Safe travels, Alpha');
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
              {/* @ts-ignore */}
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
              {activeTab === 'overview' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mt-1">
              {activeTab === 'analytics' ? 'Real-time performance metrics' : 'Scale your affiliate network'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {activeTab === 'products' && (
              <button 
                onClick={() => setShowProductForm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white hover:text-zinc-900 transition-all soft-shadow"
              >
                <Plus size={16} /> Add Affiliate Product
              </button>
            )}
            {activeTab === 'banners' && (
              <button 
                onClick={() => setShowBannerForm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white hover:text-zinc-900 transition-all soft-shadow"
              >
                <Plus size={16} /> New Slider Banner
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="grid grid-cols-1 gap-8">
          {(activeTab === 'overview' || activeTab === 'analytics') && (
            <Analytics products={products as any} />
          )}

          {activeTab === 'banners' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map(banner => (
                <div key={banner.id} className="bg-zinc-900 rounded-[30px] overflow-hidden border border-white/10 soft-shadow group">
                  <div className="aspect-video relative">
                    <img src={banner.imageUrl} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <button 
                      onClick={() => banner.id && handleDeleteBanner(banner.id)}
                      className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="p-6">
                    <h4 className="font-black uppercase tracking-tight text-white">{banner.title}</h4>
                    <p className="text-zinc-500 text-xs mt-1">{banner.description}</p>
                  </div>
                </div>
              ))}
              {banners.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                  <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">No banners added yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden soft-shadow">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Product Info</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Price</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Clicks</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Last Clicked</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="truncate max-w-[200px]">
                            <p className="font-black uppercase tracking-tight text-sm truncate">{product.name}</p>
                            <a href={product.affiliateLink} target="_blank" rel="noreferrer" className="text-[9px] text-red-600 font-bold flex items-center gap-1 hover:underline">
                              View Link <ExternalLink size={10} />
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black">{product.price || 'N/A'}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="font-black text-lg">{product.clicks || 0}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-zinc-500 uppercase">
                        {product.lastClickedAt?.toDate ? product.lastClickedAt.toDate().toLocaleString() : 'Never'}
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
                            onClick={() => product.id && handleDeleteProduct(product.id)}
                            className="p-2 hover:bg-red-600/10 rounded-lg transition-colors text-zinc-400 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Banner Modal */}
      {showBannerForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-[40px] p-10 space-y-8 soft-shadow">
            <h2 className="text-2xl font-black uppercase tracking-tighter">New Slider Banner</h2>
            <form onSubmit={handleCreateBanner} className="space-y-6">
              <input value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4" placeholder="Title" required />
              <input value={bannerDesc} onChange={e => setBannerDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4" placeholder="Subtitle" required />
              <input value={bannerImage} onChange={e => setBannerImage(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4" placeholder="Image URL" required />
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowBannerForm(false)} className="flex-1 py-4 text-zinc-500 font-black">Cancel</button>
                <button type="submit" className="flex-2 py-4 bg-red-600 text-white rounded-2xl font-black">Create Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
