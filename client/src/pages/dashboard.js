import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardStats from '@/components/DashboardStats';
import MediaDropzone from '@/components/MediaDropzone';
import API_URL from '@/utils/api';
import { 
  CloudArrowUpIcon, ChartBarIcon, LinkIcon, ArrowTrendingUpIcon, 
  Square3Stack3DIcon, PaperAirplaneIcon, HeartIcon 
} from '@heroicons/react/24/outline';
import { InstagramIcon, YoutubeIcon, TwitterIcon } from '@/components/SocialIcons'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';

// Global variables (Assumed to be set by _app.js)
const db = typeof window !== 'undefined' ? window.db : null;
const appId = typeof window !== 'undefined' ? window.appId : 'default-app-id';

export default function Dashboard() {
  const router = useRouter();

  const [recentFiles, setRecentFiles] = useState([]);
  const [stats, setStats] = useState({ engagement: '0', activePosts: 0, totalMedia: 0 });

  // NEW: local user state (instead of props)
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('KrazyUser');

  // Load user info from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserId(user.id || user.uid || null);
        setUserName(user.name || 'KrazyUser');
      } catch (e) {
        console.error('Failed to parse saved user from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    // Check if Firestore is initialized & user is known before connecting
    if (!db || !userId) return;
    
    const mediaColRef = collection(db, `artifacts/${appId}/users/${userId}/media`);
    
    // Listen for file changes in Firestore (Real-time updates)
    const unsubscribe = onSnapshot(mediaColRef, (snapshot) => {
      const fileList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: new Date(doc.data().date),
      }));
        
      const totalMedia = fileList.length;
        
      setStats(prev => ({
        ...prev,
        totalMedia,
        activePosts: Math.floor(totalMedia * 0.2), // Mock active posts
      }));

      // Update recent files list (top 3)
      setRecentFiles(fileList.sort((a, b) => b.date - a.date).slice(0, 3));
    });

    // Fetch mocked engagement stats separately
    axios
      .get(`${API_URL}/api/stats`)
      .then(res => setStats(prev => ({ ...prev, engagement: res.data.engagement })))
      .catch(err => console.error('Error fetching mock stats:', err));

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-white">Dashboard</h2>
          <p className="text-neutral-400 mt-1">
            Welcome back, <span className="text-yellow-400 font-bold">{userName}</span>.
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/scheduler')}
          className="bg-yellow-400 hover:bg-yellow-300 text-neutral-900 px-6 py-2 rounded-lg font-bold transition-colors shadow-[0_0_20px_rgba(250,204,21,0.3)] active:scale-95"
        >
          + New Post
        </button>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media Dropbox & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CloudArrowUpIcon className="w-5 h-5 text-yellow-400"/> 
                Media Dropbox
              </h3>
              <span
                className="text-xs text-yellow-400 cursor-pointer hover:underline"
                onClick={() => router.push('/dropbox')}
              >
                View All
              </span>
            </div>

            {/* Now uses userId from localStorage */}
            <MediaDropzone userId={userId} />
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Uploads</h3>
            <div className="space-y-3">
              {recentFiles.length > 0 ? (
                recentFiles.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl border border-neutral-800"
                  >
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-10 h-10 bg-neutral-700 rounded-lg overflow-hidden">
                        {item.type === 'pictures' ? (
                          <img src={item.url} alt="thm" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                            Vid
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white truncate w-40">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Uploaded •{' '}
                          {new Date(item.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full">
                      Ready
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 text-sm text-center py-4">
                  No recent uploads found.
                </p>
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
              {['Instagram', 'YouTube', 'X / Twitter'].map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    {name === 'Instagram' ? (
                      <InstagramIcon className="w-5 h-5 text-pink-500" />
                    ) : name === 'YouTube' ? (
                      <YoutubeIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <TwitterIcon className="w-5 h-5 text-white" />
                    )}
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                      Live
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
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
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
