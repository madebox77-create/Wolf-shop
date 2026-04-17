import { supabase } from '../lib/supabase';
import { Product, Banner } from '../types';

// Products
export const getProducts = (callback: (products: Product[]) => void) => {
  // Initial fetch
  supabase
    .from('products')
    .select('*')
    .order('name')
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        callback(data || []);
      }
    });

  // Real-time subscription
  const channel = supabase
    .channel('products-changes')
    .on('postgres_changes', { event: '*', table: 'products', schema: 'public' }, () => {
      // Re-fetch everything on change for simplicity, or we could handle individual events
      supabase
        .from('products')
        .select('*')
        .order('name')
        .then(({ data }) => callback(data || []));
    })
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      ...product,
      clicks: 0,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Analytics
export const trackClick = async (productId: string) => {
  // Increment clicks in products table
  const { data: currentProduct, error: fetchError } = await supabase
    .from('products')
    .select('clicks')
    .eq('id', productId)
    .single();

  if (fetchError) throw fetchError;

  const { error: updateError } = await supabase
    .from('products')
    .update({
      clicks: (currentProduct?.clicks || 0) + 1,
      last_clicked: new Date().toISOString()
    })
    .eq('id', productId);

  if (updateError) throw updateError;

  // Log to analytics table
  const { error: logError } = await supabase
    .from('analytics')
    .insert([{
      product_id: productId,
      created_at: new Date().toISOString(),
      type: 'click'
    }]);

  if (logError) throw logError;
};

// Banners
export const getBanners = (callback: (banners: Banner[]) => void) => {
  supabase
    .from('banners')
    .select('*')
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching banners:', error);
      } else {
        callback(data || []);
      }
    });

  const channel = supabase
    .channel('banners-changes')
    .on('postgres_changes', { event: '*', table: 'banners', schema: 'public' }, () => {
      supabase
        .from('banners')
        .select('*')
        .then(({ data }) => callback(data || []));
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const addBanner = async (banner: Omit<Banner, 'id'>) => {
  const { data, error } = await supabase
    .from('banners')
    .insert([banner])
    .select()
    .single();

  if (error) throw error;
  return data;
};
