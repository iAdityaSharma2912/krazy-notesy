import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardStats from '@/components/DashboardStats';
import { CloudArrowUpIcon, ChartBarIcon, LinkIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import MediaDropzone from '@/components/MediaDropzone';
import { FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [recentFiles, setRecentFiles] = useState([]);
  const [stats, setStats] = useState({ engagement: '0', activePosts: 0, totalMedia: 0 });
  const [userName, setUserName] = useState('Creator');

  useEffect(() => {
    // 1. Get User Name from Local Storage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.name) setUserName(user.name);
    } else {
        // Optional: Redirect to login if no user found
        router.push('/auth');
    }

    // 2. Fetch Recent Files from Backend
    axios.get('https://stupendously-unligatured-tamar.ngrok-free.dev/api/files')
      .then(res => {
        setRecentFiles(res.data.slice(0, 3));
      })
      .catch(err => console.error("Error fetching files:", err));

    // 3. Fetch Stats from Backend
    axios.get('https://stupendously-unligatured-tamar.ngrok-free.dev/api/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err));
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-white">Dashboard</h2>
          <p className="text-neutral-400 mt-1">Welcome back, <span className="text-yellow-400 font-bold">{userName}</span>.</p>
        </div>
        
        <button 
          onClick={() => router.push('/scheduler')}
          className="bg-yellow-400 hover:bg-yellow-300 text-neutral-900 px-6 py-2 rounded-lg font-bold transition-colors shadow-[0_0_20px_rgba(250,204,21,0.3)] active:scale-95"
        >
          + New Post
        </button>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media Dropbox & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CloudArrowUpIcon className="w-5 h-5 text-yellow-400"/> 
                Media Dropbox
              </h3>
              <span className="text-xs text-yellow-400 cursor-pointer hover:underline" onClick={() => router.push('/dropbox')}>
                View All
              </span>
            </div>
            <MediaDropzone />
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Uploads</h3>
            <div className="space-y-3">
              {recentFiles.length > 0 ? (
                recentFiles.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-700 rounded-lg overflow-hidden">
                        {item.type === 'pictures' ? (
                          <img src={item.url} alt="thm" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">Vid</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white truncate w-40">{item.name}</p>
                        <p className="text-xs text-gray-500">Uploaded • {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full">
                      Ready
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 text-sm text-center py-4">No recent uploads found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Socials */}
        <div className="space-y-8">
          
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-yellow-400"/> Active Channels
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Instagram', icon: <FaInstagram className="w-5 h-5 text-pink-500"/>, status: 'Live' },
                { name: 'YouTube', icon: <FaYoutube className="w-5 h-5 text-red-500"/>, status: 'Synced' },
                { name: 'X / Twitter', icon: <FaXTwitter className="w-5 h-5 text-white"/>, status: 'Live' }
              ].map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <div className="flex items-center gap-3">
                    {platform.icon}
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">{platform.status}</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-yellow-400"/> Performance
            </h3>
            
            <div className="space-y-5">
              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-neutral-400 text-xs font-bold uppercase">Engagement</span>
                   <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                     <ArrowTrendingUpIcon className="w-3 h-3" /> +12%
                   </span>
                </div>
                <div className="text-2xl font-black text-white">{stats.engagement}</div>
              </div>

              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-neutral-400 text-xs font-bold uppercase">Active Posts</span>
                   <span className="text-yellow-400 text-xs font-bold">Running</span>
                </div>
                <div className="text-2xl font-black text-white">{stats.activePosts}</div>
              </div>

              <div className="pt-2">
                 <div className="flex justify-between text-xs mb-2">
                   <span className="text-neutral-400 font-medium">Monthly Goal</span>
                   <span className="text-yellow-400 font-bold">85%</span>
                 </div>
                 <div className="w-full bg-neutral-900 rounded-full h-2">
                   <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: '85%' }}></div>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}