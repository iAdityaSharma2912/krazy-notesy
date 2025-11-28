import React from 'react';
import { 
  ArrowTrendingUpIcon, 
  UsersIcon, 
  CursorArrowRaysIcon, 
  EyeIcon 
} from '@heroicons/react/24/outline';

// 1. Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// 2. Import Brand Icons
import { FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

// 3. Register the components so Chart.js can use them
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  
  // 4. Configure the Chart Data
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#e5e5e5' } // White text for Dark Mode
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: { color: '#a3a3a3' },
        grid: { color: '#404040' } // Dark grey grid lines
      },
      x: {
        ticks: { color: '#a3a3a3' },
        grid: { display: false } // Hide vertical grid lines
      }
    }
  };

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Instagram Reach',
        data: [12000, 19000, 3000, 5000, 2000, 3000, 15000],
        backgroundColor: '#facc15', // Tailwind Yellow-400
        borderRadius: 4,
      },
      {
        label: 'YouTube Views',
        data: [8000, 15000, 10000, 12000, 8000, 10000, 20000],
        backgroundColor: '#a855f7', // Tailwind Purple-500
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-white">Analytics</h2>
          <p className="text-neutral-400">Track your cross-platform growth.</p>
        </div>
        <select className="bg-neutral-800 text-white border border-neutral-700 px-4 py-2 rounded-lg text-sm outline-none focus:border-yellow-400">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      {/* 1. Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Reach', value: '128.4k', change: '+12%', icon: <UsersIcon className="w-5 h-5"/>, color: 'text-blue-400' },
          { title: 'Impressions', value: '450.2k', change: '+8%', icon: <EyeIcon className="w-5 h-5"/>, color: 'text-purple-400' },
          { title: 'Engagement', value: '84.5k', change: '+24%', icon: <CursorArrowRaysIcon className="w-5 h-5"/>, color: 'text-yellow-400' },
          { title: 'Growth Rate', value: '4.2%', change: '+1.1%', icon: <ArrowTrendingUpIcon className="w-5 h-5"/>, color: 'text-green-400' }
        ].map((stat, i) => (
          <div key={i} className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 hover:border-neutral-500 transition-colors">
            <div className={`flex justify-between items-start ${stat.color} mb-4`}>
              <div className="p-2 bg-neutral-900 rounded-lg">{stat.icon}</div>
              <span className="text-xs font-bold bg-green-500/10 text-green-400 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <p className="text-neutral-400 text-xs uppercase font-bold tracking-wider">{stat.title}</p>
            <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Main Chart (Chart.js Integration) */}
        <div className="lg:col-span-2 bg-neutral-800 p-8 rounded-2xl border border-neutral-700">
          <h3 className="text-lg font-bold text-white mb-8">Engagement Overview</h3>
          
          <div className="h-80 w-full">
             <Bar options={options} data={data} />
          </div>
        </div>

        {/* 3. Platform Breakdown (Pie Visual - UPDATED ICONS) */}
        <div className="lg:col-span-1 bg-neutral-800 p-8 rounded-2xl border border-neutral-700">
          <h3 className="text-lg font-bold text-white mb-6">Audience Source</h3>
          
          <div className="space-y-6">
            {[
              { name: 'Instagram', val: '65%', color: 'bg-pink-500', icon: <FaInstagram className="w-4 h-4 text-pink-500"/> },
              { name: 'YouTube', val: '25%', color: 'bg-red-500', icon: <FaYoutube className="w-4 h-4 text-red-500"/> },
              { name: 'Twitter / X', val: '10%', color: 'bg-white', icon: <FaXTwitter className="w-4 h-4 text-white"/> },
            ].map((platform) => (
              <div key={platform.name}>
                <div className="flex justify-between text-sm font-bold text-white mb-2">
                  <span className="flex items-center gap-2">{platform.icon} {platform.name}</span>
                  <span>{platform.val}</span>
                </div>
                <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden">
                  <div 
                    style={{ width: platform.val }} 
                    className={`h-full ${platform.color} rounded-full`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
            <p className="text-neutral-400 text-xs mb-2">Top Performing Platform</p>
            <div className="flex items-center justify-center gap-2">
              <FaInstagram className="w-6 h-6 text-pink-500" />
              <p className="text-xl font-black text-white">Instagram</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}