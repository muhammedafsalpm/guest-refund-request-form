'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept = 'image/*,.pdf', maxSize = 10 * 1024 * 1024 }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFile({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          url: result.url,
        });
        onFileSelect(result);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [maxSize, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? accept.split(',').reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}) : undefined,
    maxFiles: 1,
    disabled: !!file || uploading,
  });

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);
    setError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type?.includes('image')) return <ImageIcon className="h-8 w-8 text-blue-500" />;
    return <FileText className="h-8 w-8 text-indigo-500" />;
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`relative group cursor-pointer transition-all duration-300 rounded-2xl border-2 border-dashed
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
              : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className={`p-4 rounded-2xl transition-all duration-300 
              ${isDragActive ? 'bg-blue-100 scale-110' : 'bg-slate-100 group-hover:bg-blue-50'}`}>
              <Upload className={`h-8 w-8 ${isDragActive ? 'text-blue-600' : 'text-slate-500'}`} />
            </div>
            
            {uploading ? (
              <div className="flex items-center space-x-2 text-blue-600 font-medium tracking-tight">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing data...</span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-700 uppercase tracking-widest">
                  {isDragActive ? 'Release Now' : 'Drop Evidence'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  or <span className="text-blue-600 underline underline-offset-4 decoration-blue-200">Select locally</span>
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in glass-card p-5 rounded-2xl flex items-center justify-between border-blue-100 bg-white/60">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 shadow-inner">
              {getFileIcon(file.type)}
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 truncate max-w-[200px] tracking-tight">
                {file.name}
              </p>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {formatFileSize(file.size)}
                </span>
                <span className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                <span className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                   Analyzed & Ready
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-2.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100"
            title="Remove attachment"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="animate-fade-in text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center bg-red-50 p-3 rounded-xl border border-red-100">
          <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center mr-3 text-[10px]">!</div>
          {error}
        </div>
      )}
    </div>
  );
}
