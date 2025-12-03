import React, { useState, useEffect } from 'react';
import {
  CalendarDaysIcon,
  ClockIcon,
  PhotoIcon,
  SparklesIcon,
  CheckCircleIcon,
  VideoCameraIcon,
  QueueListIcon,
  ArrowsRightLeftIcon,
  CheckBadgeIcon,
  XMarkIcon,
  ArchiveBoxIcon,
  RssIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import API_URL from '@/utils/api';
import {
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon,
  ThreadsIcon,
  PinterestIcon,
} from '@/components/SocialIcons';

// (Present but currently unused – you can wire these later if needed)
const db = typeof window !== 'undefined' ? window.db : null;
const appId = typeof window !== 'undefined' ? window.appId : 'default-app-id';

export default function Scheduler() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());
  const [scheduleType, setScheduleType] = useState('one-time'); // 'one-time' | 'fully-auto'
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [caption, setCaption] = useState('');

  // Smart queue spacing for multiple posts (hours)
  const [minDelayHours, setMinDelayHours] = useState(0);

  const [isAutoAiEnabled, setIsAutoAiEnabled] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [connectedPlatforms, setConnectedPlatforms] = useState({});
  const [loadError, setLoadError] = useState('');
  const [userName, setUserName] = useState('KrazyUser');

  // Platforms (using shared SocialIcons)
  const platformOptions = [
    { id: 'instagram', label: 'Instagram', icon: <InstagramIcon className="w-4 h-4" /> },
    { id: 'threads', label: 'Threads', icon: <ThreadsIcon className="w-4 h-4 text-black bg-white rounded-full p-0.5" /> },
    { id: 'facebook', label: 'Facebook', icon: <FacebookIcon className="w-4 h-4 text-blue-600" /> },
    { id: 'youtube', label: 'YouTube', icon: <YoutubeIcon className="w-4 h-4" /> },
    { id: 'twitter', label: 'X / Twitter', icon: <TwitterIcon className="w-4 h-4" /> },
    { id: 'pinterest', label: 'Pinterest', icon: <PinterestIcon className="w-4 h-4 text-red-600" /> },
  ];

  // -------- Initial load: user, connections, media ----------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // User
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user?.name) setUserName(user.name);
      }

      // Connected platforms
      const savedConfig = localStorage.getItem('social_connections');
      if (savedConfig) {
        setConnectedPlatforms(JSON.parse(savedConfig));
      }
    } catch (e) {
      console.error('LocalStorage read failed:', e);
    }

    // Files from API
    axios
      .get(`${API_URL}/api/files`)
      .then((res) => setMediaFiles(res.data || []))
      .catch((err) => {
        console.error('Failed to load files:', err);
        setLoadError('Failed to load files from API. Check Node server console.');
      });
  }, []);

  // -------- Auto AI trigger when toggled / files change ----------
  useEffect(() => {
    if (
      scheduleType !== 'fully-auto' &&
      isAutoAiEnabled &&
      selectedFiles.size > 0 &&
      !isAiGenerating
    ) {
      handleAiCaption();
    } else if (selectedFiles.size === 0 && isAutoAiEnabled) {
      setCaption('');
    }
  }, [isAutoAiEnabled, selectedFiles.size, isAiGenerating, scheduleType]);

  // -------- Selection logic ----------
  const toggleFileSelection = (fileId) => {
    const next = new Set(selectedFiles);
    if (next.has(fileId)) next.delete(fileId);
    else next.add(fileId);
    setSelectedFiles(next);
  };

  const handleAutoSelect = () => {
    if (!mediaFiles.length) return;
    const next = new Set();
    const filesToSelect = mediaFiles
      .slice(0, 5)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    filesToSelect.forEach((f) => next.add(f.id));
    setSelectedFiles(next);
  };

  const togglePlatform = (platformId) => {
    const next = new Set(selectedPlatforms);
    if (next.has(platformId)) next.delete(platformId);
    else next.add(platformId);
    setSelectedPlatforms(next);
  };

  const handleSelectAllPlatforms = () => {
    const connectable = platformOptions.filter((p) => connectedPlatforms[p.id]).map((p) => p.id);
    const allSelected = connectable.length === selectedPlatforms.size;
    setSelectedPlatforms(allSelected ? new Set() : new Set(connectable));
  };

  // -------- AI Caption ----------
  const handleAiCaption = () => {
    if (selectedFiles.size === 0 && scheduleType !== 'fully-auto') {
      alert('Please select a media file first so AI knows what to write about!');
      return;
    }

    setIsAiGenerating(true);

    const firstFile = mediaFiles.find((f) => selectedFiles.has(f.id));
    const mediaType = firstFile
      ? firstFile.type === 'pictures' || firstFile.type === 'image'
        ? 'Photo'
        : 'Video/Reel'
      : 'Random Content';

    setTimeout(() => {
      let captionTemplates = [];

      if (mediaType === 'Photo') {
        captionTemplates = [
          `Just dropped this epic shot! What do you think of the composition? 📸 #Photography #KrazyNotesy`,
          `Captured the moment perfectly. Ready to go viral! #Aesthetic #Visuals`,
          `This photo is too good not to share. Automated via AI! #PictureOfTheDay`,
        ];
      } else if (mediaType === 'Video/Reel') {
        captionTemplates = [
          `New ${mediaType} alert! Check out the full story later. 🎥 #Shorts #ReelsViral`,
          `Behind the scenes magic! Scheduled for prime time viewing. #ContentCreator`,
          `Watch till the end! Powered by Krazy Notesy AI. 🤖 #VideoOfTheDay`,
        ];
      } else {
        captionTemplates = [
          `General automated post. Chaos managed! #KrazyNotesy`,
          `AI is feeling lucky today. Let's see how this performs! #Automation`,
        ];
      }

      setCaption(
        captionTemplates[Math.floor(Math.random() * captionTemplates.length)]
      );
      setIsAiGenerating(false);
    }, 1500);
  };

  // -------- Schedule API call ----------
  const handleSchedule = async () => {
    // Validation
    if (selectedPlatforms.size === 0) {
      alert('Please select at least one platform to publish to.');
      return;
    }
    if (scheduleType !== 'fully-auto' && selectedFiles.size === 0) {
      alert('Please select at least one file to post.');
      return;
    }
    if (scheduleType === 'one-time' && (!date || !time)) {
      alert('Please select a date and time for the one-time post.');
      return;
    }
    if (!time) {
      alert('Please select a time for the automated post.');
      return;
    }

    setIsScheduling(true);
    setLoadError('');
    setSuccessMsg('');

    // For fully-auto we only care about time; use dummy date
    const dateTimeString =
      scheduleType === 'one-time' ? `${date}T${time}:00` : `1970-01-01T${time}:00`;

    const jobPayload = {
      scheduleType,
      dateTime: dateTimeString,
      time,
      selectedPlatforms: Array.from(selectedPlatforms),
      selectedFileIds: Array.from(selectedFiles),
      caption,
      minDelayHours,
    };

    try {
      const response = await axios.post(`${API_URL}/api/schedule/create`, jobPayload);
      setSuccessMsg(response.data?.message || 'Job created successfully.');
    } catch (error) {
      console.error('Scheduling failed:', error);
      setLoadError(
        error.response?.data?.message || 'Scheduling failed. API error.'
      );
    } finally {
      setIsScheduling(false);
      // Soft reset after a few seconds
      setTimeout(() => {
        setSuccessMsg('');
        setLoadError('');
        setSelectedFiles(new Set());
        setSelectedPlatforms(new Set());
        setIsAutoAiEnabled(false);
        setScheduleType('one-time');
        setCaption('');
        setDate('');
        setTime('');
        setMinDelayHours(0);
      }, 4000);
    }
  };

  const selectedPreviewFile = mediaFiles.find((f) => selectedFiles.has(f.id));
  const scheduleTimeLabel = scheduleType === 'one-time' ? 'One Time' : 'Every Day';
  const isStep2Complete = !!time && (scheduleType === 'fully-auto' || !!date);

  // -------- JSX ----------
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

      {loadError && (
        <div className="p-4 mb-4 bg-red-800/20 border border-red-700 rounded-xl text-red-400 font-bold">
          Error: {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: Media Selection */}
          <div
            className={`bg-neutral-800 p-6 rounded-2xl border ${
              scheduleType === 'fully-auto' ? 'opacity-40' : 'border-neutral-700'
            }`}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-neutral-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                1
              </span>
              Select Content ({selectedFiles.size} selected)
            </h3>

            {scheduleType === 'fully-auto' ? (
              <div className="text-neutral-500 text-sm italic py-4 flex items-center gap-2">
                <ArchiveBoxIcon className="w-5 h-5" />
                System will randomly select from all available media files daily.
              </div>
            ) : mediaFiles.length > 0 ? (
              <>
                <div className="mb-4 flex gap-3">
                  <button
                    onClick={handleAutoSelect}
                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm font-bold text-white transition-colors"
                  >
                    <ArrowsRightLeftIcon className="w-4 h-4" />
                    Auto-Select (Random)
                  </button>
                  <button
                    onClick={() => setSelectedFiles(new Set())}
                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700/50 hover:bg-neutral-700 rounded-lg text-sm font-bold text-neutral-400 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Clear Selection
                  </button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4">
                  {mediaFiles.map((file) => {
                    const isSelected = selectedFiles.has(file.id);
                    const isImage =
                      file.type === 'image' || file.type === 'pictures';

                    return (
                      <div
                        key={file.id}
                        onClick={() => toggleFileSelection(file.id)}
                        className={`relative w-28 h-28 bg-neutral-900 rounded-xl border-2 cursor-pointer flex-shrink-0 overflow-hidden group transition-all ${
                          isSelected
                            ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                            : 'border-neutral-700 hover:border-neutral-500'
                        }`}
                      >
                        {isImage ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <VideoCameraIcon className="w-8 h-8 text-neutral-600" />
                          </div>
                        )}

                        <div className="absolute top-1 right-1">
                          {isSelected ? (
                            <CheckCircleIcon className="w-6 h-6 text-yellow-400 bg-neutral-900 rounded-full" />
                          ) : (
                            <CheckBadgeIcon className="w-6 h-6 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/50 rounded-full" />
                          )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-white p-1 truncate">
                          {file.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-neutral-500 text-sm italic py-4">
                No media found. Upload something in the Dropbox first!
              </div>
            )}
          </div>

          {/* STEP 2: Scheduling & Recurrence */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-yellow-400/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-yellow-400 text-neutral-900 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                2
              </span>
              Scheduling & Recurrence
            </h3>

            <div className="flex gap-4 mb-4 bg-neutral-900 p-2 rounded-xl">
              <button
                onClick={() => setScheduleType('one-time')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  scheduleType === 'one-time'
                    ? 'bg-yellow-400 text-neutral-900 shadow-lg'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                One-Time Post
              </button>
              <button
                onClick={() => setScheduleType('fully-auto')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  scheduleType === 'fully-auto'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                Fully Automated
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {scheduleType === 'one-time' && (
                <div>
                  <label className="block text-xs text-neutral-400 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:border-yellow-400 outline-none transition-colors"
                  />
                </div>
              )}

              <div className={scheduleType === 'one-time' ? '' : 'col-span-full'}>
                <label className="block text-xs text-neutral-400 mb-2">
                  Time ({scheduleTimeLabel})
                </label>
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

            {/* Smart Queue Rule */}
            <div
              className={`mt-6 pt-4 border-t border-neutral-700 ${
                scheduleType === 'one-time' ? '' : 'opacity-40'
              }`}
            >
              <h4 className="text-sm font-bold text-neutral-400 mb-2 flex items-center gap-2">
                <RssIcon className="w-4 h-4 text-purple-400" />
                Smart Queue Rules
              </h4>
              <div className="flex items-center gap-3">
                <label className="text-sm text-white flex-1">
                  Min Delay Between Posts (Hours):
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={minDelayHours}
                  onChange={(e) => setMinDelayHours(Number(e.target.value))}
                  disabled={scheduleType !== 'one-time' || selectedFiles.size <= 1}
                  className="w-20 bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-white text-sm outline-none focus:border-yellow-400"
                />
              </div>
              {minDelayHours > 0 && selectedFiles.size > 1 && (
                <p className="text-xs text-yellow-500/80 mt-2">
                  Posts will be automatically spaced {minDelayHours} hours apart.
                </p>
              )}
            </div>
          </div>

          {/* STEP 3: Platforms & Caption */}
          <div
            className={`bg-neutral-800 p-6 rounded-2xl border ${
              isStep2Complete ? 'border-neutral-700' : 'opacity-40 border-neutral-800'
            }`}
            title={!isStep2Complete ? 'Complete Step 2 to unlock details' : ''}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isStep2Complete ? 'bg-yellow-400 text-neutral-900' : 'bg-neutral-700'
                }`}
              >
                3
              </span>
              Details & Processing
            </h3>

            <fieldset disabled={!isStep2Complete}>
              {/* Platforms */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-neutral-400 mb-2">
                  Target Platforms
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSelectAllPlatforms}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 ${
                      selectedPlatforms.size > 0
                        ? 'bg-purple-600/20 text-purple-400 border-purple-500/50'
                        : 'bg-neutral-700/50 text-neutral-400 border-neutral-600'
                    }`}
                  >
                    <QueueListIcon className="w-4 h-4" />
                    {platformOptions.filter((p) => connectedPlatforms[p.id]).length ===
                    selectedPlatforms.size
                      ? 'Deselect All'
                      : 'Select All'}{' '}
                    (
                    {selectedPlatforms.size}/
                    {platformOptions.filter((p) => connectedPlatforms[p.id]).length})
                  </button>

                  {platformOptions.map((platform) => {
                    const isSelected = selectedPlatforms.has(platform.id);
                    const isConnected = connectedPlatforms[platform.id];

                    return (
                      <button
                        key={platform.id}
                        onClick={() => {
                          if (isConnected) togglePlatform(platform.id);
                          else
                            alert(
                              `Please connect your ${platform.label} account in the Configuration tab first.`
                            );
                        }}
                        disabled={!isConnected}
                        title={
                          !isConnected ? `Connect ${platform.label} in Config tab` : ''
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-yellow-400 text-black border-yellow-400'
                            : isConnected
                            ? 'bg-transparent text-neutral-400 border-neutral-600 hover:border-neutral-400 hover:text-white'
                            : 'bg-neutral-900/50 text-neutral-700 border-neutral-800 cursor-not-allowed'
                        }`}
                      >
                        {platform.icon}
                        {platform.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Toggle */}
              <div
                className={`flex justify-between items-center bg-neutral-900/50 p-4 rounded-xl border border-neutral-700 mb-4 ${
                  scheduleType === 'fully-auto'
                    ? 'border-yellow-400/50 shadow-inner'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <SparklesIcon
                    className={`w-6 h-6 ${
                      isAutoAiEnabled || scheduleType === 'fully-auto'
                        ? 'text-yellow-400'
                        : 'text-neutral-500'
                    }`}
                  />
                  <span className="text-sm font-bold text-white">
                    Auto AI Captioning
                  </span>
                </div>
                <button
                  onClick={() => setIsAutoAiEnabled(!isAutoAiEnabled)}
                  disabled={scheduleType === 'fully-auto'}
                  className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                    isAutoAiEnabled || scheduleType === 'fully-auto'
                      ? 'bg-yellow-500'
                      : 'bg-neutral-600'
                  }`}
                >
                  <span className="sr-only">Toggle AI Captioning</span>
                  <span
                    aria-hidden="true"
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isAutoAiEnabled || scheduleType === 'fully-auto'
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Caption */}
              <div className="relative">
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write your caption here..."
                  disabled={
                    isAutoAiEnabled || isAiGenerating || scheduleType === 'fully-auto'
                  }
                  className={`w-full h-32 bg-neutral-900 border border-neutral-700 text-white rounded-lg p-4 outline-none resize-none ${
                    isAutoAiEnabled || scheduleType === 'fully-auto'
                      ? 'opacity-70 italic cursor-not-allowed'
                      : 'focus:border-yellow-400'
                  }`}
                />
                {isAutoAiEnabled && scheduleType !== 'fully-auto' && (
                  <button
                    onClick={handleAiCaption}
                    disabled={isAiGenerating}
                    className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
                  >
                    {isAiGenerating ? (
                      <span className="animate-pulse">Thinking...</span>
                    ) : (
                      <>
                        <SparklesIcon className="w-3 h-3" /> Re-Generate
                      </>
                    )}
                  </button>
                )}
              </div>
            </fieldset>
          </div>
        </div>

        {/* RIGHT: Preview phone */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <h3 className="text-sm font-bold text-neutral-500 mb-4 uppercase tracking-wider">
              Preview
            </h3>

            <div className="bg-neutral-900 border-[8px] border-neutral-800 rounded-[2.5rem] overflow-hidden shadow-2xl h-[600px] relative flex flex-col">
              {successMsg && (
                <div className="absolute inset-0 z-50 bg-neutral-900/90 backdrop-blur-sm flex items-center justify-center p-6 text-center animate-in fade-in zoom-in">
                  <div>
                    <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white">Post Job Created!</h3>
                    <p className="text-neutral-400 mt-2">{successMsg}</p>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="bg-neutral-900 p-4 flex items-center gap-3 border-b border-neutral-800 shrink-0">
                <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-purple-500 rounded-full" />
                <div>
                  <p className="text-xs font-bold text-white">{userName}</p>
                  <p className="text-[10px] text-neutral-400">
                    {scheduleType === 'fully-auto'
                      ? 'FULLY AUTOMATED JOB'
                      : Array.from(selectedPlatforms).join(', ').toUpperCase() ||
                        'SELECT PLATFORMS'}
                  </p>
                </div>
              </div>

              {/* Media */}
              <div className="flex-1 bg-neutral-800 flex items-center justify-center overflow-hidden relative">
                {selectedPreviewFile ? (
                  selectedPreviewFile.type === 'image' ||
                  selectedPreviewFile.type === 'pictures' ? (
                    <img
                      src={selectedPreviewFile.url}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <video
                      src={selectedPreviewFile.url}
                      className="w-full h-full object-contain"
                      preload="metadata"
                    />
                  )
                ) : (
                  <div className="text-center p-6">
                    <PhotoIcon className="w-12 h-12 text-neutral-700 mx-auto mb-2" />
                    <p className="text-xs text-neutral-600">
                      {scheduleType === 'fully-auto'
                        ? 'Random Media Selection'
                        : 'Select content to preview'}
                    </p>
                  </div>
                )}
              </div>

              {/* Caption preview */}
              <div className="p-4 bg-neutral-900 shrink-0">
                <div className="flex gap-4 mb-3">
                  <div className="w-5 h-5 rounded-full border border-neutral-600" />
                  <div className="w-5 h-5 rounded-full border border-neutral-600" />
                  <div className="w-5 h-5 rounded-full border border-neutral-600" />
                </div>
                <div className="text-xs text-white max-h-20 overflow-y-auto">
                  <span className="font-bold mr-1">{userName}</span>
                  {caption || (
                    <span className="text-neutral-600 italic">
                      Caption will appear here...
                    </span>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="p-4 pt-0 bg-neutral-900 shrink-0">
                <button
                  onClick={handleSchedule}
                  disabled={
                    !isStep2Complete ||
                    selectedPlatforms.size === 0 ||
                    (scheduleType !== 'fully-auto' && selectedFiles.size === 0) ||
                    isScheduling
                  }
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-neutral-900 font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isScheduling
                    ? 'Scheduling Job...'
                    : scheduleType === 'fully-auto'
                    ? 'Activate Automated Job 🚀'
                    : 'Confirm Schedule 🚀'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
