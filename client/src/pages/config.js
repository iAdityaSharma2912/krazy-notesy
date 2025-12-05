import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XMarkIcon, 
  LinkIcon 
} from '@heroicons/react/24/outline';

import { 
  InstagramIcon, 
  YoutubeIcon, 
  TwitterIcon, 
  PinterestIcon, 
  FacebookIcon, 
  ThreadsIcon, 
  GoogleIcon,
  LinkedinIcon,
  TiktokIcon,
  RedditIcon,
  VimeoIcon,
} from '@/components/SocialIcons';

export default function Config() {
  // State for connections status (true/false)
  const [connections, setConnections] = useState({
    instagram: false,
    youtube: false,
    twitter: false,
    pinterest: false,
    threads: false,
    facebook: false,
    linkedin: false,
    tiktok: false,
    reddit: false,
    vimeo: false,
  });

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // Platform Definitions (Expanded list)
  const platforms = [
    { key: 'instagram', name: 'Instagram', icon: <InstagramIcon className="w-8 h-8" />, color: 'text-pink-500' },
    { key: 'facebook',  name: 'Facebook',  icon: <FacebookIcon  className="w-8 h-8" />, color: 'text-blue-600' },
    { key: 'threads',   name: 'Threads',   icon: <ThreadsIcon   className="w-8 h-8" />, color: 'text-black' },
    { key: 'linkedin',  name: 'LinkedIn',  icon: <LinkedinIcon  className="w-8 h-8" />, color: 'text-blue-400' },
    { key: 'youtube',   name: 'YouTube',   icon: <YoutubeIcon   className="w-8 h-8" />, color: 'text-red-500' },
    { key: 'tiktok',    name: 'TikTok',    icon: <TiktokIcon    className="w-8 h-8" />, color: 'text-black' },
    { key: 'twitter',   name: 'X / Twitter', icon: <TwitterIcon className="w-8 h-8" />, color: 'text-white' },
    { key: 'reddit',    name: 'Reddit',    icon: <RedditIcon    className="w-8 h-8" />, color: 'text-orange-500' },
    { key: 'vimeo',     name: 'Vimeo',     icon: <VimeoIcon     className="w-8 h-8" />, color: 'text-blue-500' },
    { key: 'pinterest', name: 'Pinterest', icon: <PinterestIcon className="w-8 h-8" />, color: 'text-red-600' },
  ];

  // 1. Load saved configuration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedConfig = localStorage.getItem('social_connections');
    if (savedConfig) {
      setConnections(JSON.parse(savedConfig));
    }
  }, []);

  // 2. Open Modal Logic
  const initiateConnection = (platform) => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  // 3. Handle Successful Login from Modal (Mock Verification)
  const handleLoginSuccess = (platformKey, username) => {
    const newConnections = { ...connections, [platformKey]: true };
    setConnections(newConnections);

    if (typeof window !== 'undefined') {
      localStorage.setItem('social_connections', JSON.stringify(newConnections));
      localStorage.setItem(
        `${platformKey}_session`,
        JSON.stringify({
          user: username,
          token: `mock_token_${Date.now()}`,
          connectedAt: new Date().toISOString(),
        })
      );
    }

    setIsModalOpen(false);
    setSelectedPlatform(null);
  };

  // 4. Handle Disconnect
  const handleDisconnect = (platformKey) => {
    const newConnections = { ...connections, [platformKey]: false };
    setConnections(newConnections);

    if (typeof window !== 'undefined') {
      localStorage.setItem('social_connections', JSON.stringify(newConnections));
      localStorage.removeItem(`${platformKey}_session`);
    }
  };

  // --- Login Modal Component (Nested) ---
  const LoginModal = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState('');

    if (!isModalOpen || !selectedPlatform) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!username || !password) {
        setModalError('Please enter both username and password.');
        return;
      }

      setModalLoading(true);
      setModalError('');

      try {
        // SIMULATION
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (username === 'test' && password === '123') {
          handleLoginSuccess(selectedPlatform.key, username);
        } else {
          throw new Error("Invalid username or password. Use 'test' / '123'.");
        }
      } catch (err) {
        setModalError(err.message || 'Connection failed. Please try again.');
      } finally {
        setModalLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-3xl">
                {selectedPlatform.icon}
              </div>
              <h3 className="text-2xl font-black text-white">
                Connect {selectedPlatform.name}
              </h3>
              <p className="text-neutral-400 text-sm mt-2">
                Enter your credentials to authorize Krazy Notesy.
              </p>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs font-bold text-center">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">
                  Username / Email
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                  placeholder={`Your ${selectedPlatform.name} ID`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-900 font-bold py-3 rounded-xl transition transform active:scale-[0.98] shadow-lg shadow-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {modalLoading ? 'Verifying...' : `Log In & Connect`}
              </button>
            </form>

            <p className="text-center text-xs text-neutral-600 mt-6">
              We securely verify your credentials via official APIs.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <LoginModal />

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-yellow-400 rounded-xl text-neutral-900">
          <LinkIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Socials</h2>
          <p className="text-neutral-400 mt-1">
            Manage your platform connections for scheduling.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const isConnected = connections[platform.key];

          return (
            <div
              key={platform.key}
              className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden
                ${
                  isConnected
                    ? 'bg-neutral-900 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                    : 'bg-neutral-900 border-neutral-800'
                }`}
            >
              {/* Background Success Glow */}
              {isConnected && (
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
              )}

              <div className="flex justify-between items-start mb-4 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3">
                  {platform.icon}
                  <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] font-bold text-green-400 uppercase">
                        Active
                      </span>
                    </div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" />
                  )}
                </div>
              </div>

              <p className="text-sm text-neutral-400 mb-6 ml-11 relative z-10">
                {isConnected
                  ? `Connected as ${
                      typeof window !== 'undefined' &&
                      localStorage.getItem(`${platform.key}_session`)
                        ? JSON.parse(
                            localStorage.getItem(`${platform.key}_session`)
                          ).user
                        : 'User'
                    }.`
                  : 'Not connected. Link your account to enable auto-posting.'}
              </p>

              {/* Action Button */}
              <button
                onClick={() =>
                  isConnected
                    ? handleDisconnect(platform.key)
                    : initiateConnection(platform)
                }
                className={`w-full py-3 rounded-xl font-bold transition-all relative z-10 flex items-center justify-center gap-2
                  ${
                    isConnected
                      ? 'bg-neutral-800 text-red-400 border border-neutral-700 hover:bg-red-500/10 hover:border-red-500/50'
                      : 'bg-white text-black hover:bg-yellow-400 hover:scale-[1.02]'
                  }`}
              >
                {isConnected ? 'Disconnect Account' : 'Connect Account'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
