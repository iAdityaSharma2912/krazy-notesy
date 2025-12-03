import React, { useEffect, useState } from 'react';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  CalendarDaysIcon, 
  ArrowLeftOnRectangleIcon,
  PhoneIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Initialize form with saved data
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        bio: parsedUser.bio || ''
      });
    } else {
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    
    // 1. Save updated data to local storage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // 2. Update local state
    setUser(updatedUser);
    setIsEditing(false);
    
    // 3. --- NEW: Force the Sidebar to reload the new user data ---
    router.reload();
    // -----------------------------------------------------------
  };

  const handleCancel = () => {
    // Revert form data to original user data
    setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
    });
    setIsEditing(false);
  };

  if (!user) return <div className="text-white p-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white">User Profile</h2>
          <p className="text-neutral-400 mt-1">Manage your account settings.</p>
        </div>
        
        {/* Edit Toggle Button */}
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
          >
            <PencilSquareIcon className="w-5 h-5" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        
        {/* Content Container */}
        <div className="flex flex-col md:flex-row items-start gap-10">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-neutral-700 flex items-center justify-center border-4 border-neutral-600 shadow-2xl relative group mb-6">
              <span className="text-6xl font-black text-yellow-400 select-none">
                {formData.name.charAt(0).toUpperCase()}
              </span>
              {/* Photo Edit Overlay (Visual Only) */}
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm border-2 border-dashed border-yellow-400/50">
                    <span className="text-xs font-bold text-white">Change Photo</span>
                </div>
              )}
            </div>
            
            <div className="text-center">
                <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">Member Since</p>
                <div className="flex items-center justify-center gap-2 text-white bg-neutral-900/50 px-4 py-2 rounded-full border border-neutral-700">
                    <CalendarDaysIcon className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">{user.joined || 'Nov 2025'}</span>
                </div>
            </div>
          </div>

          {/* Right Column: Editable Fields */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Full Name Field */}
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-neutral-500 pointer-events-none">
                    <UserCircleIcon className="w-5 h-5" />
                </div>
                {isEditing ? (
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-neutral-900 border border-neutral-600 rounded-xl py-3 pl-12 pr-4 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                ) : (
                    <div className="w-full bg-neutral-900/30 border border-transparent rounded-xl py-3 pl-12 pr-4 text-white font-bold text-lg">
                        {user.name}
                    </div>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-neutral-500 pointer-events-none">
                    <EnvelopeIcon className="w-5 h-5" />
                </div>
                {isEditing ? (
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-neutral-900 border border-neutral-600 rounded-xl py-3 pl-12 pr-4 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                ) : (
                    <div className="w-full bg-neutral-900/30 border border-transparent rounded-xl py-3 pl-12 pr-4 text-white font-medium">
                        {user.email}
                    </div>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Phone Number</label>
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-neutral-500 pointer-events-none">
                    <PhoneIcon className="w-5 h-5" />
                </div>
                {isEditing ? (
                    <input 
                        type="tel" 
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-neutral-900 border border-neutral-600 rounded-xl py-3 pl-12 pr-4 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                ) : (
                    <div className="w-full bg-neutral-900/30 border border-transparent rounded-xl py-3 pl-12 pr-4 text-white font-medium">
                        {user.phone || <span className="text-neutral-600 italic">No phone number added</span>}
                    </div>
                )}
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Bio</label>
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-neutral-500 pointer-events-none">
                    <IdentificationIcon className="w-5 h-5" />
                </div>
                {isEditing ? (
                    <textarea 
                        name="bio"
                        placeholder="Tell us a bit about yourself..."
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        className="w-full bg-neutral-900 border border-neutral-600 rounded-xl py-3 pl-12 pr-4 text-white focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                    ></textarea>
                ) : (
                    <div className="w-full bg-neutral-900/30 border border-transparent rounded-xl py-3 pl-12 pr-4 text-neutral-300">
                        {user.bio || <span className="text-neutral-600 italic">No bio added yet.</span>}
                    </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="mt-10 pt-8 border-t border-neutral-700 flex justify-between items-center">
          
          {/* Sign Out (Always Visible) */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition text-sm font-bold"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            Sign Out
          </button>

          {/* Save/Cancel Buttons (Only in Edit Mode) */}
          {isEditing && (
            <div className="flex gap-3">
                <button 
                    onClick={handleCancel}
                    className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-bold transition flex items-center gap-2"
                >
                    <XMarkIcon className="w-5 h-5" />
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-neutral-900 rounded-lg font-bold transition shadow-lg shadow-yellow-400/20 flex items-center gap-2"
                >
                    <CheckIcon className="w-5 h-5" />
                    Save Changes
                </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}