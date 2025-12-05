import React, { useState, useEffect } from 'react';
import MediaDropzone from '@/components/MediaDropzone';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  PlayCircleIcon, 
  EllipsisHorizontalIcon,
  ArrowPathIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import API_URL from '@/utils/api';

export default function Dropbox() {
  const [activeTab, setActiveTab] = useState('pictures');
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // userId for MediaDropzone (optional – it will also fall back to localStorage)
  const [userId, setUserId] = useState(null);

  // NEW: State for selected files
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // Load user from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserId(user.id || user.uid || user.userId || user._id || null);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }
  }, []);

  // Normalise media URL (handles absolute + relative paths)
  const getMediaUrl = (url) => {
    if (!url) return '';
    // Already an absolute URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Make it absolute using API_URL
    const base = API_URL.replace(/\/+$/, ''); // trim trailing slash
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  };

  // Fetch files from Backend
  const fetchFiles = async () => {
    setLoading(true);
    try {
      // Use the same API base everywhere
      const res = await axios.get(`${API_URL}/api/files`);
      setGalleryItems(res.data || []);
      setSelectedFiles(new Set()); // Reset selection on refresh
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const filteredItems = galleryItems.filter((item) => item.type === activeTab);

  const getIcon = (type) => {
    if (type === 'pictures') return <PhotoIcon className="w-8 h-8 text-purple-400" />;
    if (type === 'shorts') return <PlayCircleIcon className="w-8 h-8 text-pink-500" />;
    return <VideoCameraIcon className="w-8 h-8 text-blue-400" />;
  };

  // --- SELECTION LOGIC ---
  const toggleSelection = (id) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedFiles(newSelection);
  };

  const deleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedFiles.size} files?`)) return;

    try {
      await axios.post(`${API_URL}/api/files/delete`, {
        ids: Array.from(selectedFiles),
      });
      fetchFiles(); // Refresh list after delete
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete files.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">Media Dropbox</h2>
          <p className="text-neutral-400 mt-1">
            Centralized storage for your content supply chain.
          </p>
        </div>

        <div className="flex gap-3">
          {selectedFiles.size > 0 && (
            <button
              onClick={deleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors font-bold border border-red-500/20"
            >
              <TrashIcon className="w-5 h-5" />
              Delete ({selectedFiles.size})
            </button>
          )}

          <button
            onClick={fetchFiles}
            className="flex items-center gap-2 text-sm font-bold text-yellow-400 hover:text-white transition-colors bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-700"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* 2. Upload Zone */}
      <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 mb-10">
        <h3 className="text-white font-bold mb-4">Upload New Assets</h3>
        {/* pass userId (dropzone also falls back to localStorage) */}
        <MediaDropzone userId={userId} />
      </div>

      {/* 3. Tabs */}
      <div className="mb-6 border-b border-neutral-700">
        <div className="flex gap-8">
          {[
            { id: 'pictures', label: 'Pictures' },
            { id: 'shorts', label: 'Short Videos' },
            { id: 'videos', label: 'Videos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold transition-all relative
                ${
                  activeTab === tab.id
                    ? 'text-yellow-400'
                    : 'text-neutral-400 hover:text-white'
                }
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-neutral-500">
            Loading your media...
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isSelected = selectedFiles.has(item.id);
            const src = getMediaUrl(item.url);

            return (
              <div
                key={item.id}
                onClick={() => toggleSelection(item.id)}
                className={`group relative bg-neutral-900 border rounded-xl overflow-hidden cursor-pointer transition-all duration-200
                  ${
                    isSelected
                      ? 'border-yellow-400 ring-1 ring-yellow-400'
                      : 'border-neutral-800 hover:border-neutral-600'
                  }
                `}
              >
                {/* Thumbnail / Icon */}
                <div className="h-32 bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-700 transition-colors overflow-hidden">
                  {item.type === 'pictures' && src ? (
                    <img
                      src={src}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    getIcon(item.type)
                  )}
                </div>

                {/* Selection Checkbox Overlay */}
                <div className="absolute top-2 right-2 z-10">
                  {isSelected ? (
                    <CheckCircleSolid className="w-6 h-6 text-yellow-400 bg-neutral-900 rounded-full" />
                  ) : (
                    <CheckCircleIcon className="w-6 h-6 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/50 rounded-full" />
                  )}
                </div>

                {/* Details */}
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <p
                      className="text-sm font-bold text-white truncate w-24"
                      title={item.name}
                    >
                      {item.name}
                    </p>
                    <button className="text-neutral-500 hover:text-white">
                      <EllipsisHorizontalIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {(item.size / 1024 / 1024).toFixed(2)} MB • {item.date}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-neutral-500 border border-dashed border-neutral-700 rounded-xl">
            <p>No files found in {activeTab}. Upload something above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
