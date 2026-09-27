import React, { useState } from 'react';
import { 
  Bell, Plus, Search, Pin, Calendar, User as UserIcon, 
  Info, X, Send, Trash2, Shield
} from 'lucide-react';

export default function NoticeBoard({ notices, onAddNotice, onDeleteNotice, onTogglePinNotice, user, onOpenLogin, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for New Notice
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newContent, setNewContent] = useState('');
  const [newImportant, setNewImportant] = useState(false);
  const [newPinned, setNewPinned] = useState(false);
  const [authorName, setAuthorName] = useState(user ? user.name : 'Society Resident');

  const categories = ['All', 'Urgent', 'Maintenance', 'Event', 'General'];

  // Category badge styling helper
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Urgent':
        return 'bg-rose-100 text-rose-900 border-rose-200 font-bold';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Event':
        return 'bg-purple-100 text-purple-900 border-purple-200 font-bold';
      case 'General':
      default:
        return `${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} font-bold`;
    }
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notice.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePostNotice = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const noticeItem = {
      id: 'n_' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      author: authorName.trim() || (user ? user.name : 'Resident'),
      date: new Date().toISOString().split('T')[0],
      pinned: newPinned,
      important: newImportant || newCategory === 'Urgent'
    };

    onAddNotice(noticeItem);

    // Reset Form
    setNewTitle('');
    setNewCategory('General');
    setNewContent('');
    setNewImportant(false);
    setNewPinned(false);
    setShowAddModal(false);
  };

  return (
    <section id="notices" className="py-20 bg-slate-50 text-slate-800 relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-xs font-semibold uppercase tracking-wider`}>
              <Bell className={`w-4 h-4 ${theme.iconColor}`} />
              <span>Society Bulletin & Announcements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Community Notice Board
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              Stay updated with official society announcements, emergency alerts, maintenance schedules, and upcoming resident events.
            </p>
          </div>

          {/* Action Button: Post Notice */}
          <div>
            <button
              onClick={() => {
                if (!user) {
                  onOpenLogin();
                } else {
                  setShowAddModal(true);
                }
              }}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl ${theme.buttonBg} text-white font-bold text-sm shadow-md transition-all`}
            >
              <Plus className="w-5 h-5" />
              <span>Post New Notice</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? `${theme.buttonBg} text-white font-bold shadow-sm`
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Notice List Container */}
        {filteredNotices.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <Info className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="text-lg font-bold text-slate-800">No notices found</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              There are no notices matching your search criteria or category filter.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
              className={`text-xs ${theme.highlightText} hover:underline font-bold`}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className={`relative bg-white border rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  notice.pinned ? theme.ringColor : 'border-slate-200'
                }`}
              >
                {/* Notice Top Metadata */}
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 text-xs rounded-lg border ${getCategoryBadge(notice.category)}`}>
                        {notice.category}
                      </span>
                      {notice.pinned && (
                        <span className="flex items-center space-x-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          <Pin className="w-3 h-3 fill-amber-700" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{notice.date}</span>
                      </div>

                      {/* Admin Quick Options */}
                      {user && user.role === 'Admin' && (
                        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 ml-2">
                          <button
                            onClick={() => onTogglePinNotice && onTogglePinNotice(notice.id)}
                            className={`p-1.5 rounded-md text-xs transition-colors ${
                              notice.pinned ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
                            }`}
                            title={notice.pinned ? 'Unpin Notice' : 'Pin Notice to Top'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteNotice && onDeleteNotice(notice.id)}
                            className="p-1.5 rounded-md text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Delete Notice (Admin Only)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold text-slate-900 mb-2 leading-snug hover:${theme.highlightText} transition-colors`}>
                    {notice.title}
                  </h3>

                  {/* Content Paragraph */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line mb-4">
                    {notice.content}
                  </p>
                </div>

                {/* Footer Author Details */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <UserIcon className={`w-3.5 h-3.5 ${theme.iconColor}`} />
                    <span>Posted by <strong className="text-slate-800">{notice.author}</strong></span>
                  </div>
                  {user && user.role === 'Admin' ? (
                    <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-indigo-600" /> Admin Options Active
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">Official Entry</span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal Dialog: Add New Notice */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl ${theme.badgeBg} ${theme.badgeText} flex items-center justify-center font-bold`}>
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Create Notice Announcement</h3>
                  <p className="text-xs text-slate-500">Broadcast updates to all Grand Horizon residents</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostNotice} className="space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notice Subject Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scheduled Water Tank Cleaning on Sunday"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none"
                />
              </div>

              {/* Grid: Category & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category Tag *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="General">General Announcement</option>
                    <option value="Maintenance">Maintenance & Repairs</option>
                    <option value="Urgent">Urgent / Emergency Alert</option>
                    <option value="Event">Community Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Author / Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Content Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Announcement Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide complete details, timings, affected blocks, or action items required from residents..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none resize-none"
                />
              </div>

              {/* Pinned Checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newPinned}
                  onChange={(e) => setNewPinned(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="pinCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Pin this notice to top of notice board
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl ${theme.buttonBg} text-white font-bold text-sm shadow-md`}
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Notice</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
}
