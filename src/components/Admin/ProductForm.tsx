import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Link as LinkIcon, 
  Tag, 
  IndianRupee, 
  FileText,
  Image as ImageIcon,
  Loader2,
  Check
} from 'lucide-react';
import { generateProductImages } from '../../services/gemini';
import { toast } from 'sonner';

interface ProductFormProps {
  onClose: () => void;
  onSave: (product: any) => void;
  initialData?: any;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    price: '',
    category: '',
    affiliateLink: '',
    images: [] as string[],
    stock: 100,
    rating: 4.8,
    featured: false
  });
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleGenerateImages = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Please enter a product name and description first');
      return;
    }
    setGenerating(true);
    try {
      const images = await generateProductImages(formData.name, formData.description);
      setGeneratedImages(images);
      toast.success('AI Images generated successfully');
    } catch (error) {
      toast.error('Failed to generate images');
    } finally {
      setGenerating(false);
    }
  };

  const toggleImageSelection = (img: string) => {
    setSelectedImages(prev => 
      prev.includes(img) ? prev.filter(i => i !== img) : [...prev, img]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImages = [...(formData.images || []), ...selectedImages];
    if (finalImages.length < 1) {
      toast.error('Please select at least one image');
      return;
    }
    onSave({
      ...formData,
      images: finalImages,
      image: finalImages[0], // Essential for ProductCard
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      rating: parseFloat(formData.rating),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-zinc-900 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[40px] flex flex-col soft-shadow"
      >
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter font-display">
              {initialData ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">
              Create a new entry in the Wolf ecosystem
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                  <Tag size={12} /> Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="e.g. Wolf Alpha Pro Headphones"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                  <FileText size={12} /> Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors min-h-[120px] resize-none"
                  placeholder="Describe the product features..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                    <IndianRupee size={12} /> Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                    <ImageIcon size={12} /> Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors appearance-none"
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                    placeholder="Stock count"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[20px] border border-white/10">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    formData.featured ? 'bg-red-600 border-red-600' : 'border-white/10 group-hover:border-white/30'
                  }`}>
                    {formData.featured && <Check size={14} className="text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.featured}
                    onChange={() => setFormData({ ...formData, featured: !formData.featured })}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Feature on Home</span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                  <LinkIcon size={12} /> Amazon Affiliate Link
                </label>
                <input
                  type="url"
                  value={formData.affiliateLink}
                  onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="https://amazon.in/..."
                  required
                />
              </div>
            </div>

            {/* Right Column: Images */}
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                  <ImageIcon size={12} /> Product Images
                </label>
                <button
                  type="button"
                  onClick={handleGenerateImages}
                  disabled={generating}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-white transition-colors disabled:opacity-50"
                >
                  {generating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  Generate AI Images
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Generated Images Preview */}
                <AnimatePresence>
                  {generatedImages.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative aspect-square rounded-[20px] overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImages.includes(img) ? 'border-red-600' : 'border-transparent'
                      }`}
                      onClick={() => toggleImageSelection(img)}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {selectedImages.includes(img) && (
                        <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                          <div className="bg-red-600 rounded-full p-1">
                            <Check size={16} className="text-white" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Upload Placeholder */}
                {generatedImages.length === 0 && (
                  <div className="col-span-2 aspect-[16/9] border-2 border-dashed border-white/10 rounded-[30px] flex flex-col items-center justify-center text-zinc-600 space-y-4">
                    <Upload size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Click Generate to see AI magic</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        <div className="p-8 border-t border-white/10 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-10 py-4 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-[15px] hover:bg-white hover:text-zinc-900 transition-all active:scale-95 soft-shadow"
          >
            Save Product
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
