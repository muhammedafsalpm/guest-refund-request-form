'use client';

import { useState } from 'react';
import { Upload, X, FileImage, FileText, CheckCircle } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept = 'image/*,.pdf', maxSize = 10 * 1024 * 1024 }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    
    if (!selectedFile) return;
    
    if (selectedFile.size > maxSize) {
      setError(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
      return;
    }
    
    setUploading(true);
    setFile(selectedFile);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        onFileSelect({
          file: selectedFile,
          url: result.url
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setError(error.message);
      setFile(null);
      onFileSelect(null);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      {!file ? (
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            accept={accept}
            disabled={uploading}
            className="w-full px-5 py-3 border-2 border-dashed border-gray-200 rounded-lg 
                       file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                       file:text-sm file:font-bold file:bg-deluxe-blue file:text-white
                       hover:file:bg-deluxe-navy cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-deluxe-blue/20"
          />
          <p className="text-[10px] uppercase font-bold text-gray-500 mt-2 tracking-wider">
            Supports images and PDFs (Max {maxSize / (1024 * 1024)}MB)
          </p>
          {uploading && <p className="text-sm text-deluxe-blue mt-2 font-bold animate-pulse">Uploading...</p>}
        </div>
      ) : (
        <div className="border border-blue-100 rounded-lg p-4 bg-blue-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {file.type.startsWith('image/') ? (
                <FileImage className="h-6 w-6 text-deluxe-blue" />
              ) : (
                <FileText className="h-6 w-6 text-deluxe-blue" />
              )}
              <div>
                <p className="text-sm font-bold text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-red-500 transition"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <CheckCircle className="h-4 w-4 text-deluxe-blue" />
            <p className="text-xs text-deluxe-blue font-bold">File uploaded successfully</p>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-600 font-bold mt-1 tracking-tight">{error}</p>}
    </div>
  );
}
