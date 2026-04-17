import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MousePointerClick, TrendingUp, Calendar, Package } from 'lucide-react';
import { Product } from '../../types';
import { motion } from 'motion/react';

interface AnalyticsProps {
  products: Product[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ products }) => {
  const chartData = products
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 10)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      clicks: p.clicks || 0
    }));

  const totalClicks = products.reduce((acc, p) => acc + (p.clicks || 0), 0);
  const topProduct = products.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0];

  return (
    <div className="space-y-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-white/10 p-8 rounded-[30px] soft-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-red-600/10 text-red-600">
              <MousePointerClick size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1">
              <Calendar size={12} /> Lifetime
            </span>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Affiliate Clicks</p>
          <h3 className="text-4xl font-black tracking-tighter mt-1">{totalClicks.toLocaleString()}</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 border border-white/10 p-8 rounded-[30px] soft-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-green-600/10 text-green-500">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1">
              <TrendingUp size={12} /> Hot
            </span>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Top Performing Product</p>
          <h3 className="text-xl font-black tracking-tight mt-1 truncate uppercase">
            {topProduct?.name || 'No Data'}
          </h3>
          <p className="text-[10px] text-zinc-500 font-bold mt-1">{topProduct?.clicks || 0} Clicks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-white/10 p-8 rounded-[30px] soft-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500">
              <Package size={24} />
            </div>
          </div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Active Affiliate Links</p>
          <h3 className="text-4xl font-black tracking-tighter mt-1">{products.length}</h3>
        </motion.div>
      </div>

      {/* Chart Section */}
      <div className="bg-zinc-900 border border-white/10 p-10 rounded-[40px] soft-shadow">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter font-display">Click Distribution</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Top 10 products by performance</p>
          </div>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={10} 
                fontWeight="black" 
                tickLine={false} 
                axisLine={false}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={10} 
                fontWeight="black" 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'black',
                  textTransform: 'uppercase'
                }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="clicks" radius={[10, 10, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#dc2626' : '#3f3f46'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
