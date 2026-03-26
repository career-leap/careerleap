import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  Trash2, 
  Clock, 
  User, 
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  FileSpreadsheet,
  FileCode,
  X,
  Download,
  Search,
  Filter,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useFileStore } from '../store/fileStore';
import { useAuthStore } from '../store/authStore';

// File type icons mapping
const getFileIcon = (type) => {
  if (type?.startsWith('image/')) return Image;
  if (type?.includes('pdf')) return FileText;
  if (type?.includes('sheet') || type?.includes('excel') || type?.includes('csv')) return FileSpreadsheet;
  if (type?.includes('code') || type?.includes('javascript') || type?.includes('json')) return FileCode;
  return File;
};

// Get category color
const getCategoryColor = (category) => {
  const colors = {
    image: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    document: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    spreadsheet: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    presentation: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    code: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  };
  return colors[category] || colors.other;
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date
const formatDate = (isoString) => {
  if (!isoString) return { date: '-', time: '-', full: '-' };
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    time: date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }),
    full: date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  };
};

// Upload Progress Component
const UploadProgress = ({ progress, filename }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-indigo-100 dark:border-indigo-900/30">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
        <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 dark:text-white truncate">{filename}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
      </div>
      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
    </div>
    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  </div>
);

// Upload Card Component
const UploadCard = ({ upload, onDelete, onDownload, currentUserId }) => {
  const FileIcon = getFileIcon(upload.file_type);
  const formattedDate = formatDate(upload.uploaded_at);
  const isRecent = new Date(upload.uploaded_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
  const isOwner = upload.user_id === currentUserId || upload.user?.id === currentUserId;
  const categoryColor = getCategoryColor(upload.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* File Icon */}
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center shrink-0">
          <FileIcon size={24} className="text-indigo-600 dark:text-indigo-400" />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate" title={upload.original_filename}>
                {upload.original_filename}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {upload.formatted_size || formatFileSize(upload.file_size)}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${categoryColor}`}>
                  {upload.category}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDownload(upload.id, upload.original_filename)}
                className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                title="Download file"
              >
                <Download size={18} />
              </button>
              {isOwner && (
                <button
                  onClick={() => onDelete(upload.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete upload"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Upload Metadata */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {/* Date & Time */}
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Calendar size={14} className="text-indigo-500" />
                <span title={formattedDate.full}>{formattedDate.date}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Clock size={14} className="text-indigo-500" />
                <span>{formattedDate.time}</span>
              </div>

              {/* Recent Badge */}
              {isRecent && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Recent
                </span>
              )}
            </div>

            {/* Uploader Info */}
            <div className="flex items-center gap-2 mt-3">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {upload.user_name?.charAt(0).toUpperCase() || '?'}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {upload.user_name}
              </span>
              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full capitalize">
                {upload.user_role}
              </span>
              {isOwner && (
                <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full">
                  You
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Stats Card
const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default function FileUpload() {
  const { user } = useAuthStore();
  const { 
    uploads, 
    uploadFile, 
    deleteUpload, 
    fetchUploads,
    fetchStats,
    stats,
    isUploading, 
    isLoading,
    uploadProgress,
    error, 
    clearError 
  } = useFileStore();
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showMyUploadsOnly, setShowMyUploadsOnly] = useState(false);
  const inputRef = useRef(null);

  // Fetch uploads on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchUploads(),
      fetchStats()
    ]);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      await handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file) => {
    clearError();
    setUploadSuccess(null);
    setCurrentFile(file);
    
    const result = await uploadFile(file, {
      description: '',
      category: 'other',
      isPublic: false
    });
    
    if (result.success) {
      setUploadSuccess(`"${file.name}" uploaded successfully!`);
      setTimeout(() => {
        setUploadSuccess(null);
        setCurrentFile(null);
      }, 3000);
      // Refresh stats
      fetchStats();
    } else {
      setCurrentFile(null);
    }
  };

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleDelete = async (uploadId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      const result = await deleteUpload(uploadId);
      if (result.success) {
        fetchStats();
      }
    }
  };

  const handleDownload = async (uploadId, filename) => {
    const { downloadFile } = useFileStore.getState();
    await downloadFile(uploadId, filename);
  };

  // Filter uploads
  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = !searchQuery || 
      upload.original_filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upload.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || upload.category === filterCategory;
    
    const matchesOwner = !showMyUploadsOnly || 
      upload.user_id === user?.id || 
      upload.user?.id === user?.id;
    
    return matchesSearch && matchesCategory && matchesOwner;
  });

  // Calculate stats
  const totalUploads = stats?.total_uploads || uploads.length;
  const recentUploads = stats?.recent_uploads || uploads.filter(u => 
    new Date(u.uploaded_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;
  const myUploads = stats?.my_uploads || uploads.filter(u => 
    u.user_id === user?.id || u.user?.id === user?.id
  ).length;
  const totalStorage = stats?.my_storage_formatted || formatFileSize(
    uploads
      .filter(u => u.user_id === user?.id || u.user?.id === user?.id)
      .reduce((sum, u) => sum + (u.file_size || 0), 0)
  );

  // Get unique categories from uploads
  const categories = [...new Set(uploads.map(u => u.category))];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-8 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                File Upload Center
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Upload and manage assignments, documents, and resources. All uploads are timestamped for tracking.
              </p>
            </div>
            <button
              onClick={loadData}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatsCard 
            title="Total Uploads" 
            value={totalUploads} 
            icon={File} 
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatsCard 
            title="Last 24 Hours" 
            value={recentUploads} 
            icon={Clock} 
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatsCard 
            title="My Uploads" 
            value={myUploads} 
            icon={User} 
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatsCard 
            title="My Storage" 
            value={totalStorage} 
            icon={Upload} 
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            subtitle="Total used"
          />
        </motion.div>

        {/* Upload Area */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              multiple={false}
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                dragActive 
                  ? 'bg-indigo-100 dark:bg-indigo-900/40' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <Upload 
                  size={32} 
                  className={`transition-colors ${
                    dragActive 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`} 
                />
              </div>
              
              <div>
                <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                  {dragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or{' '}
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    browse to upload
                  </button>
                </p>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                Supports all file types • Maximum file size: 50MB
              </p>
            </div>

            {/* Uploading Indicator */}
            {isUploading && currentFile && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                  <UploadProgress progress={uploadProgress} filename={currentFile.name} />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3"
            >
              <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200">{uploadSuccess}</p>
              <button 
                onClick={() => setUploadSuccess(null)}
                className="ml-auto text-green-600 dark:text-green-400 hover:text-green-800"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
            >
              <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <button 
                onClick={clearError}
                className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800"
              >
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <motion.div 
          className="mb-6 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
              <option value="spreadsheet">Spreadsheets</option>
              <option value="presentation">Presentations</option>
              <option value="code">Code</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* My Uploads Toggle */}
          <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={showMyUploadsOnly}
              onChange={(e) => setShowMyUploadsOnly(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">My uploads only</span>
          </label>
        </motion.div>

        {/* Uploads List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {searchQuery ? `Search Results (${filteredUploads.length})` : 'Recent Uploads'}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredUploads.length} {filteredUploads.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          {isLoading && uploads.length === 0 ? (
            <div className="text-center py-16">
              <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Loading uploads...</p>
            </div>
          ) : filteredUploads.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <File size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                {searchQuery ? 'No files found' : 'No uploads yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery 
                  ? 'Try adjusting your search or filters' 
                  : 'Upload your first file to get started'}
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid gap-4"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredUploads.map((upload) => (
                  <UploadCard 
                    key={upload.id} 
                    upload={upload} 
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    currentUserId={user?.id}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
