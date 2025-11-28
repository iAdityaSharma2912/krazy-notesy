import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  CloudArrowUpIcon, 
  CalendarDaysIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { signOut } from 'firebase/auth'; 

// --- FIREBASE CONTEXT SETUP ---
const firebaseAuth = typeof window !== 'undefined' ? window.auth : null;

const Sidebar = () => {
  const router = useRouter();
  const [user, setUser] = useState({ name: 'Creator', email: '' });

  useEffect(() => {
    // Retrieve user info from localStorage
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser({ name: 'Creator', email: '' });
      }
    }
  }, [router.pathname]);

  const handleLogout = async () => {
    localStorage.removeItem('user');
    if (firebaseAuth) await signOut(firebaseAuth);
    router.push('/');
  };

  const menuItems = [
    // Dashboard should go to /dashboard
    { name: 'Dashboard', icon: <HomeIcon className="w-6 h-6" />, path: '/dashboard' },
    { name: 'Media Dropbox', icon: <CloudArrowUpIcon className="w-6 h-6" />, path: '/dropbox' },
    { name: 'Socials', icon: <Cog6ToothIcon className="w-6 h-6" />, path: '/config' },
    { name: 'Scheduler', icon: <CalendarDaysIcon className="w-6 h-6" />, path: '/scheduler' },
    { name: 'Analytics', icon: <ChartBarIcon className="w-6 h-6" />, path: '/analytics' },
  ];

  return (
    <div className="h-screen w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col fixed left-0 top-0">
      <div className="p-8">
        <Link href="/dashboard" className="cursor-pointer">
          <h1 className="text-2xl font-black tracking-tighter text-white">
            KRAZY<span className="text-yellow-400">NOTESY</span>.
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = router.pathname === item.path;
          return (
            <Link
              href={item.path}
              key={item.name}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-yellow-400 text-neutral-900 font-bold shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-neutral-800'
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-800 cursor-pointer transition-colors group">
          <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-yellow-400 font-bold border border-neutral-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <Link href="/profile">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate group-hover:text-yellow-400 transition">
                View Profile
              </p>
            </Link>
          </div>
          <button onClick={handleLogout} title="Sign Out">
            <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500 hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <Sidebar />
      <main className="ml-64 w-full p-8">{children}</main>
    </div>
  );
};

export default Layout;
