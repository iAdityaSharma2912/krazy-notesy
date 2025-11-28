import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Square3Stack3DIcon, 
  PaperAirplaneIcon, 
  HeartIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-2xl relative overflow-hidden group hover:border-yellow-400/50 transition-all duration-300">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-400/10 rounded-full group-hover:bg-yellow-400/20 transition-all blur-xl"></div>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-neutral-900 rounded-lg text-yellow-400 border border-neutral-700">
          {icon}
        </div>
        {trend && (
          <span className="flex items-center text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-neutral-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-black text-white mt-1">{value}</p>
    </div>
  );
};

const DashboardStats = () => {
  const [stats, setStats] = useState({ totalMedia: 0, activePosts: 0, engagement: '0' });

  useEffect(() => {
    // Fetch real stats from our new API
    axios.get('https://stupendously-unligatured-tamar.ngrok-free.dev/api/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Stats Error:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="Total Media" 
        value={stats.totalMedia} 
        icon={<Square3Stack3DIcon className="w-6 h-6"/>} 
        trend="+12%"
      />
      <StatCard 
        title="Active Posts" 
        value={stats.activePosts} 
        icon={<PaperAirplaneIcon className="w-6 h-6"/>} 
      />
      <StatCard 
        title="Engagement" 
        value={stats.engagement} 
        icon={<HeartIcon className="w-6 h-6"/>} 
        trend="+5.3%"
      />
    </div>
  );
};

export default DashboardStats;