import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, ArrowUpOnSquareStackIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import API_URL from '@/utils/api';
import { doc, setDoc } from 'firebase/firestore';

// --- FIREBASE CONTEXT SETUP ---
// NOTE: These are assumed to be initialized in _app.js and available globally
const db = typeof window !== 'undefined' ? window.db : null; 
const appId = typeof window !== 'undefined' ? window.appId : 'default-app-id';

const createMockFileRecord = async (file, userId) => {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name.replace(/\s+/g, '_')}`;
  const fileType = file.type.startsWith('image')
    ? 'pictures'
    : file.size < 10485760
    ? 'shorts'
    : 'videos';

  const fileRecord = {
    id: fileName,
    name: file.name,
    type: fileType,
    size: file.size,
    date: new Date().toISOString(),
    url: `${API_URL}/uploads/${fileName}`, 
    userId,
  };

  if (db && userId) {
    const docRef = doc(db, `artifacts/${appId}/users/${userId}/media`, fileRecord.id);
    await setDoc(docRef, fileRecord);
  }

  return fileRecord;
};

const MediaDropzone = ({ userId: propUserId }) => {
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [fileQueue, setFileQueue] = useState([]);

  // 🔑 Resolve userId: prop first, then localStorage fallback
  const userId = useMemo(() => {
    if (propUserId) return propUserId;
    if (typeof window === 'undefined') return null;

    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;

    try {
      const user = JSON.parse(savedUser);
      // Try common ID shapes, fall back to a stable string
      return (
        user.id ||
        user.uid ||
        user.userId ||
        user._id ||
        user.email ||
        'local-user'
      );
    } catch (e) {
      console.error('Failed to parse user from localStorage in MediaDropzone', e);
      return 'local-user';
    }
  }, [propUserId]);

  const uploadFiles = useCallback(
    async (files) => {
      setLoading(true);
      setUploadError('');
      try {
        if (!userId) throw new Error('Authentication required for upload.');

        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);

          // 1. Upload file to local Node server (disk storage)
          await axios.post(`${API_URL}/api/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          // 2. Store metadata in Firestore
          await createMockFileRecord(file, userId);
        }

        setFileQueue([]);
      } catch (error) {
        setUploadError(
          error.message || 'Upload failed. Is the local Node API server running on :5000?'
        );
        console.error('Upload Error:', error);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFileQueue(acceptedFiles);
      if (acceptedFiles.length === 1) {
        uploadFiles(acceptedFiles);
      }
    },
    [uploadFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    disabled: loading || !userId,
  });

  const isDisabled = loading || !userId;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
          ${
            isDragActive
              ? 'border-yellow-400 bg-yellow-400/10 scale-[1.02]'
              : 'border-neutral-700 hover:border-yellow-400/50 hover:bg-neutral-800'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon
          className={`w-12 h-12 mb-3 ${
            isDragActive ? 'text-yellow-400' : 'text-neutral-500'
          }`}
        />
        <p className="text-neutral-400 font-medium">
          {loading
            ? 'Processing...'
            : isDragActive
            ? 'Drop files here!'
            : !userId
            ? 'Sign in to enable Dropbox'
            : 'Drag & Drop media here'}
        </p>
        <p className="text-xs text-neutral-600 mt-1">Supports JPG, PNG, MP4</p>
        {uploadError && <p className="text-red-400 text-xs mt-2">{uploadError}</p>}
      </div>

      {fileQueue.length > 1 && (
        <div className="flex justify-center">
          <button
            onClick={() => uploadFiles(fileQueue)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-neutral-900 font-bold rounded-xl shadow-md hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            <ArrowUpOnSquareStackIcon className="w-5 h-5" />
            Upload All {fileQueue.length} Files
          </button>
        </div>
      )}

      {fileQueue.length > 0 && (
        <div className="text-center text-sm text-neutral-400 mt-2">
          {fileQueue.length} files staged.
          <button
            onClick={() => setFileQueue([])}
            className="ml-2 text-red-400 hover:text-red-300 underline"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaDropzone;
