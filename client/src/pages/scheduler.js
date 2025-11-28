import React, { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  PhotoIcon, 
  SparklesIcon,
  CheckCircleIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import axios from 'axios';

export default function Scheduler() {
  // State for data
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // State for form
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  // UI States
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Fetch Real Media Files on Load
  useEffect(() => {
    axios.get('https://stupendously-unligatured-tamar.ngrok-free.dev/api/files')
      .then(res => {
        setMediaFiles(res.data);
      })
      .catch(err => console.error("Error loading files:", err));
  }, []);

  // Mock function to simulate AI generation
  const handleAiCaption = () => {
    if (!selectedFile) {
        alert("Please select a media file first so AI knows what to write about!");
        return;
    }
    setIsAiGenerating(true);
    // Simulating AI analyzing the image...
    setTimeout(() => {
      const aiCaptions = [
        `Just dropped this amazing content! 📸✨ #${selectedFile.type === 'video' ? 'Reels' : 'Photo'} #KrazyNotesy`,
        `Behind the scenes vibes. 🎥 What do you think? #CreatorLife`,
        `Creating magic with Krazy Notesy. 🚀 #Automation #Tech`
      ];
      setCaption(aiCaptions[Math.floor(Math.random() * aiCaptions.length)]);
      setIsAiGenerating(false);
    }, 1500);
  };

  const handleSchedule = () => {
    if (!selectedFile || !date || !time) {
        alert("Please select a file, date, and time.");
        return;
    }

    setIsScheduling(true);
    
    // Simulate Backend API Call
    setTimeout(() => {
        setIsScheduling(false);
        setSuccessMsg("Post scheduled successfully! 🚀");
        
        // Reset after 3 seconds
        setTimeout(() => {
            setSuccessMsg('');
            setCaption('');
            setDate('');
            setTime('');
            setSelectedFile(null);
        }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-yellow-400 rounded-xl text-neutral-900">
          <CalendarDaysIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Scheduler</h2>
          <p className="text-neutral-400">Plan your content supply chain.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: The Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Select Media (Real Data) */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-neutral-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Select Content
            </h3>
            
            {mediaFiles.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800">
                {mediaFiles.map((file) => (
                    <div 
                        key={file.id} 
                        onClick={() => setSelectedFile(file)}
                        className={`relative w-32 h-32 bg-neutral-900 rounded-xl border-2 cursor-pointer flex-shrink-0 overflow-hidden group transition-all
                            ${selectedFile?.id === file.id ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-neutral-700 hover:border-neutral-500'}`}
                    >
                        {file.type === 'image' || file.type === 'pictures' ? (
                            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <VideoCameraIcon className="w-8 h-8 text-neutral-600" />
                            </div>
                        )}
                        
                        {/* Selected Indicator */}
                        {selectedFile?.id === file.id && (
                            <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                                <CheckCircleIcon className="w-8 h-8 text-yellow-400 bg-black rounded-full" />
                            </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-white p-1 truncate">
                            {file.name}
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-neutral-500 text-sm italic py-4">No media found. Upload something in the Dropbox first!</div>
            )}
          </div>

          {/* 2. Date & Time */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-neutral-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Schedule Time
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-2">Date</label>
                <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:border-yellow-400 outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-2">Time</label>
                <div className="relative">
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:border-yellow-400 outline-none transition-colors" 
                  />
                  <ClockIcon className="w-5 h-5 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Caption & Platforms */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-neutral-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
              Details
            </h3>
            
            {/* Platform Toggles */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { id: 'instagram', label: 'Instagram', icon: <FaInstagram className="w-4 h-4" /> },
                { id: 'youtube', label: 'YouTube', icon: <FaYoutube className="w-4 h-4" /> },
                { id: 'twitter', label: 'X / Twitter', icon: <FaXTwitter className="w-4 h-4" /> },
              ].map(platform => {
                const isSelected = selectedPlatform === platform.id;
                return (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center gap-2
                      ${isSelected 
                        ? 'bg-yellow-400 text-black border-yellow-400' 
                        : 'bg-transparent text-neutral-400 border-neutral-600 hover:border-neutral-400 hover:text-white'}`}
                  >
                    {platform.icon}
                    {platform.label}
                  </button>
                )
              })}
            </div>

            {/* Caption Box */}
            <div className="relative">
              <textarea 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption here..." 
                className="w-full h-32 bg-neutral-900 border border-neutral-700 text-white rounded-lg p-4 focus:border-yellow-400 outline-none resize-none"
              ></textarea>
              
              {/* AI Button */}
              <button 
                onClick={handleAiCaption}
                disabled={isAiGenerating}
                className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
              >
                {isAiGenerating ? (
                  <span className="animate-pulse">Thinking...</span>
                ) : (
                  <>
                    <SparklesIcon className="w-3 h-3" /> AI Generate
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: The Preview Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <h3 className="text-sm font-bold text-neutral-500 mb-4 uppercase tracking-wider">Preview</h3>
            
            {/* Mock Phone UI */}
            <div className="bg-black border-[8px] border-neutral-800 rounded-[2.5rem] overflow-hidden shadow-2xl h-[600px] relative flex flex-col">
              
              {/* Success Overlay */}
              {successMsg && (
                  <div className="absolute inset-0 z-50 bg-neutral-900/90 backdrop-blur-sm flex items-center justify-center p-6 text-center animate-in fade-in zoom-in">
                      <div>
                          <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-white">Success!</h3>
                          <p className="text-neutral-400 mt-2">{successMsg}</p>
                      </div>
                  </div>
              )}

              {/* Phone Header */}
              <div className="bg-neutral-900 p-4 flex items-center gap-3 border-b border-neutral-800 shrink-0">
                <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-purple-500 rounded-full"></div>
                <div>
                  <p className="text-xs font-bold text-white">KrazyUser</p>
                  <p className="text-[10px] text-neutral-400">
                    {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} • {date ? date : 'Now'}
                  </p>
                </div>
              </div>

              {/* Phone Content (Dynamic) */}
              <div className="flex-1 bg-neutral-800 flex items-center justify-center overflow-hidden bg-black relative">
                 {selectedFile ? (
                    selectedFile.type === 'image' || selectedFile.type === 'pictures' ? (
                        <img src={selectedFile.url} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-center">
                            <VideoCameraIcon className="w-12 h-12 text-neutral-600 mx-auto mb-2" />
                            <p className="text-xs text-neutral-500">Video Preview</p>
                        </div>
                    )
                 ) : (
                    <div className="text-center p-6">
                        <PhotoIcon className="w-12 h-12 text-neutral-700 mx-auto mb-2" />
                        <p className="text-xs text-neutral-600">Select content to preview</p>
                    </div>
                 )}
              </div>

              {/* Phone Footer (Caption) */}
              <div className="p-4 bg-neutral-900 shrink-0">
                <div className="flex gap-4 mb-3">
                   <div className="w-5 h-5 rounded-full border border-neutral-600"></div>
                   <div className="w-5 h-5 rounded-full border border-neutral-600"></div>
                   <div className="w-5 h-5 rounded-full border border-neutral-600"></div>
                </div>
                <div className="text-xs text-white max-h-20 overflow-y-auto">
                  <span className="font-bold mr-1">KrazyUser</span>
                  {caption || <span className="text-neutral-600 italic">Caption will appear here...</span>}
                </div>
              </div>

              {/* Schedule Button */}
              <div className="p-4 pt-0 bg-neutral-900 shrink-0">
                <button 
                    onClick={handleSchedule}
                    disabled={isScheduling}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-900 font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isScheduling ? 'Scheduling...' : 'Confirm Schedule 🚀'}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}