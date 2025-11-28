import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, VideoCameraIcon, XMarkIcon, CheckCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const MediaDropzone = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({}); 

  const onDrop = useCallback((acceptedFiles) => {
    // FIX: We use 'category' instead of 'type' because 'type' is read-only in browsers
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      category: file.type.startsWith('image/') ? 'image' : 'video' 
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'image/*': [],
      'video/*': []
    }
  });

  const removeFile = (name) => {
    setFiles(files.filter(file => file.name !== name));
  };

  const handleUpload = async (file) => {
    setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://stupendously-unligatured-tamar.ngrok-free.dev/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("Server Response:", response.data);
      setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
    } catch (error) {
      console.error("Upload failed", error);
      setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
    }
  };

  return (
    <div className="space-y-4">
      
      {/* 1. The Drop Area */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-yellow-400 bg-yellow-400/10 scale-[1.02]' 
            : 'border-neutral-700 hover:border-yellow-400/50 hover:bg-neutral-800'
          }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className={`w-12 h-12 mb-3 ${isDragActive ? 'text-yellow-400' : 'text-neutral-500'}`} />
        <p className="text-neutral-400 font-medium">
          {isDragActive ? "Drop it like it's hot! 🔥" : "Drag & Drop media here"}
        </p>
        <p className="text-xs text-neutral-600 mt-1">Supports JPG, PNG, MP4</p>
      </div>

      {/* 2. The File Preview List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div 
              key={file.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-neutral-800 p-2 rounded-lg border border-neutral-700 flex items-center gap-3"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 bg-neutral-900 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                {file.category === 'image' ? (
                  <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <VideoCameraIcon className="w-6 h-6 text-neutral-500" />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">{file.name}</p>
                <p className="text-xs text-yellow-500 capitalize">{file.category} • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                {/* Upload Status/Button */}
                {uploadStatus[file.name] === 'success' ? (
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <CheckCircleIcon className="w-3 h-3"/> Uploaded
                  </p>
                ) : uploadStatus[file.name] === 'uploading' ? (
                  <p className="text-xs text-yellow-400 animate-pulse mt-1">Uploading...</p>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUpload(file); }}
                    className="mt-1 text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded font-bold hover:bg-yellow-300 transition-colors"
                  >
                    Upload
                  </button>
                )}
              </div>

              {/* Remove Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                className="p-1 hover:bg-neutral-700 rounded-full text-neutral-400 hover:text-red-400"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default MediaDropzone;