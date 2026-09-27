import React, { useState } from 'react';
import { 
  Image as ImageIcon, Heart, Maximize2, X, Upload, 
  User, Lock, LogIn, Shield, PlusCircle, Check, Trash2
} from 'lucide-react';

export default function GallerySection({ gallery, onAddImage, onDeleteImage, user, onOpenLogin, theme }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [likesMap, setLikesMap] = useState({});

  // Multi-Image Upload Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Events');
  const [imageInputType, setImageInputType] = useState('FILE'); // FILE or URL
  const [imageUrlText, setImageUrlText] = useState('');
  const [multiFilePreviews, setMultiFilePreviews] = useState([]);

  const categories = ['All', 'Infrastructure', 'Facilities', 'Events', 'Gardens'];

  const filteredGallery = gallery.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const loadedPreviews = [];
    let readCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        loadedPreviews.push(reader.result);
        readCount++;
        if (readCount === files.length) {
          setMultiFilePreviews((prev) => [...prev, ...loadedPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePreview = (index) => {
    setMultiFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();

    let imageList = [];
    if (imageInputType === 'FILE') {
      imageList = multiFilePreviews;
    } else {
      imageList = imageUrlText.split('\n').map((u) => u.trim()).filter((u) => u.length > 0);
    }

    if (!title.trim() || imageList.length === 0) return;

    // Create a new photo entry for each image uploaded in batch
    imageList.forEach((imgUrl, idx) => {
      const newPhoto = {
        id: 'g_' + Date.now() + '_' + idx,
        title: imageList.length > 1 ? `${title.trim()} (${idx + 1}/${imageList.length})` : title.trim(),
        category: category,
        imageUrl: imgUrl,
        uploadedBy: user ? user.name : 'Resident',
        date: new Date().toISOString().split('T')[0],
        likes: 1
      };
      onAddImage(newPhoto);
    });

    // Reset Form
    setTitle('');
    setCategory('Events');
    setImageUrlText('');
    setMultiFilePreviews([]);
    setShowUploadModal(false);
  };

  const handleLike = (id) => {
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  // IF NOT LOGGED IN -> SHOW AUTH-GATED LOCK SCREEN
  if (!user) {
    return (
      <section id="gallery" className="py-20 bg-slate-50 text-slate-800 relative border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-xs font-semibold uppercase tracking-wider`}>
              <Lock className={`w-4 h-4 ${theme.iconColor}`} />
              <span>Resident Authentication Required</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Community Photo Gallery
            </h2>
            <p className="text-slate-600 text-sm">
              Our residential photo album and event snapshots are private for Grand Horizon members.
            </p>
          </div>

          {/* Locked Card Banner */}
          <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className={`w-16 h-16 rounded-2xl ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} flex items-center justify-center mx-auto shadow-sm`}>
              <ImageIcon className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl font-extrabold text-slate-900">
                Please Sign In To Access The Photo Gallery
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Log in with your resident account to view high-resolution community photos, participate in album likes, and upload multiple event images in a single post.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenLogin}
                className={`flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl ${theme.buttonBg} text-white font-extrabold text-sm shadow-md transition-all transform hover:scale-105`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In To Access Gallery</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className={`w-4 h-4 ${theme.iconColor}`} /> Multi-Image Batch Upload Supported
              </span>
              <span className="flex items-center gap-1.5">
                <Check className={`w-4 h-4 ${theme.iconColor}`} /> Private Resident Album Access
              </span>
            </div>
          </div>

        </div>
      </section>
    );
  }

  // IF LOGGED IN -> FULL INTERACTIVE GALLERY WITH MULTI-IMAGE BATCH UPLOAD
  return (
    <section id="gallery" className="py-20 bg-slate-50 text-slate-800 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-xs font-semibold uppercase tracking-wider`}>
              <ImageIcon className={`w-4 h-4 ${theme.iconColor}`} />
              <span>Community Photo Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Society Life Gallery
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              Explore snapshots of our architecture, green parks, festive celebrations, and vibrant community gatherings.
            </p>
          </div>

          {/* Upload Button */}
          <div>
            <button
              onClick={() => setShowUploadModal(true)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl ${theme.buttonBg} text-white font-bold text-sm shadow-md transition-all`}
            >
              <Upload className="w-5 h-5" />
              <span>Upload Photos (Batch Multi-Select)</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? `${theme.buttonBg} text-white font-bold shadow-sm`
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => {
            const currentLikes = item.likes + (likesMap[item.id] || 0);
            return (
              <div
                key={item.id}
                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Lightbox Overlay Trigger */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <button
                      onClick={() => setActiveLightbox(item)}
                      className={`p-3 bg-white text-slate-900 hover:${theme.buttonBg} hover:text-white rounded-full transition-colors shadow-lg`}
                      title="View Fullscreen"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    {user && user.role === 'Admin' && (
                      <button
                        onClick={() => onDeleteImage && onDeleteImage(item.id)}
                        className="p-3 bg-rose-600 text-white hover:bg-rose-700 rounded-full transition-colors shadow-lg"
                        title="Delete Photo (Admin Only)"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold bg-white/90 ${theme.badgeText} rounded-lg border border-slate-200 shadow-sm backdrop-blur-md`}>
                    {item.category}
                  </span>
                  {user && user.role === 'Admin' && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-black bg-rose-600 text-white rounded-md shadow-sm">
                      ADMIN
                    </span>
                  )}
                </div>

                {/* Footer Info */}
                <div className="p-5 space-y-3">
                  <h3 className={`text-base font-bold text-slate-900 hover:${theme.highlightText} transition-colors line-clamp-1`}>
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.uploadedBy}</span>
                    </div>

                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-semibold transition-colors border border-pink-200"
                    >
                      <Heart className="w-3.5 h-3.5 fill-pink-600" />
                      <span>{currentLikes}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Preview Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-slate-200 bg-slate-800/80 rounded-xl"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={activeLightbox.imageUrl}
              alt={activeLightbox.title}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-slate-700"
            />

            <div className="mt-4 text-center space-y-1">
              <h3 className="text-xl font-bold text-white">{activeLightbox.title}</h3>
              <p className="text-xs text-slate-300">
                Uploaded by {activeLightbox.uploadedBy} on {activeLightbox.date} • Category: {activeLightbox.category}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Multi-Image Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${theme.badgeBg} ${theme.badgeText} flex items-center justify-center font-bold`}>
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Upload Multiple Society Photos</h3>
                  <p className="text-xs text-slate-500">Select multiple image files or URLs in a single post</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              {/* Photo Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Album / Post Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Independence Day Cultural Concert"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Tag *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none"
                >
                  <option value="Events">Community Events</option>
                  <option value="Infrastructure">Infrastructure & Buildings</option>
                  <option value="Facilities">Clubhouse & Amenities</option>
                  <option value="Gardens">Parks & Gardens</option>
                </select>
              </div>

              {/* Input Type Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Multiple Images Source
                </label>
                
                <div className="flex space-x-4 text-xs font-medium">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imgType"
                      checked={imageInputType === 'FILE'}
                      onChange={() => setImageInputType('FILE')}
                      className="accent-slate-900"
                    />
                    <span className="text-slate-700">Select Multiple Files</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imgType"
                      checked={imageInputType === 'URL'}
                      onChange={() => setImageInputType('URL')}
                      className="accent-slate-900"
                    />
                    <span className="text-slate-700">Multiple Web URLs (One per line)</span>
                  </label>
                </div>
              </div>

              {imageInputType === 'FILE' ? (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 p-4 rounded-xl text-center bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleFilesChange}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-400 block mt-2 font-medium">
                      Tip: Hold Ctrl / Shift to pick multiple images at once
                    </span>
                  </div>

                  {/* Batch Previews Grid */}
                  {multiFilePreviews.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>Selected Batch Images ({multiFilePreviews.length})</span>
                        <button
                          type="button"
                          onClick={() => setMultiFilePreviews([])}
                          className="text-red-600 hover:underline"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                        {multiFilePreviews.map((prev, idx) => (
                          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                            <img src={prev} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemovePreview(idx)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full text-xs opacity-80 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <textarea
                    rows={4}
                    placeholder="Paste image URLs (one URL per line)&#10;https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                    value={imageUrlText}
                    onChange={(e) => setImageUrlText(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none resize-none font-mono text-xs"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl ${theme.buttonBg} text-white font-bold text-sm`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish All Selected Photos</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
}
