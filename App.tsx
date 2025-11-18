import React, { useState, useEffect } from 'react';
import { IconMenu, IconX, IconMusic, IconMic, IconVideo, IconBook } from './components/Icons';
import Hero from './components/Hero';
import MediaCard from './components/MediaCard';
import QuizSection from './components/QuizSection';
import DevotionalSection from './components/DevotionalSection';
import DonateSection from './components/DonateSection';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { MediaItem, MediaType } from './types';
import { getMedia } from './services/dataService';

type AppView = 'public' | 'admin-login' | 'admin-dashboard';

const App: React.FC = () => {
  // App View State
  const [view, setView] = useState<AppView>('public');
  
  // Data State
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [scrolled, setScrolled] = useState(false);

  // Load data on mount
  useEffect(() => {
    refreshData();
    
    // Check URL hash for simple admin routing
    if (window.location.hash === '#admin') {
      setView('admin-login');
    }

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const refreshData = () => {
    setMediaItems(getMedia());
  };

  const handleAdminLogin = () => {
    setView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setView('public');
    window.location.hash = '';
  };

  // Filter logic
  const filteredMedia = activeFilter === 'All' 
    ? mediaItems 
    : mediaItems.filter(m => m.type === activeFilter);

  // If in Admin View, render Admin Dashboard or Login
  if (view === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} onBack={() => { setView('public'); window.location.hash = ''; }} />;
  }

  if (view === 'admin-dashboard') {
    return <AdminDashboard onLogout={handleAdminLogout} onDataChange={refreshData} />;
  }

  // Public Navigation Links
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Library', href: '#media' },
    { name: 'Devotional', href: '#devotional' },
    { name: 'Bible Quiz', href: '#quiz' },
    { name: 'Give', href: '#donate' },
    { name: 'About', href: '#about' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl ${scrolled ? 'bg-brand-900 text-white' : 'bg-white text-brand-900'}`}>
               GV
             </div>
             <span className={`text-xl font-serif font-bold tracking-tight ${scrolled ? 'text-brand-900' : 'text-white'}`}>GOSPELVOICE</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`font-medium text-sm uppercase tracking-wide transition-colors ${scrolled ? 'text-gray-600 hover:text-brand-600' : 'text-white/90 hover:text-white'}`}
              >
                {link.name}
              </a>
            ))}
            <a href="#donate" className={`px-5 py-2 rounded font-bold text-sm transition-colors ${scrolled ? 'bg-brand-900 text-white hover:bg-brand-800' : 'bg-white text-brand-900 hover:bg-gray-100'}`}>
              Donate
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden ${scrolled ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t md:hidden p-4 flex flex-col gap-4 text-center">
             {navLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                className="block py-2 px-4 hover:bg-gray-50 text-gray-800 font-medium rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="border-t pt-2">
              <a href="#admin" onClick={() => { setView('admin-login'); setMobileMenuOpen(false); }} className="text-sm text-gray-400 hover:text-brand-600">Admin Portal</a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Hero />

        {/* Media Section */}
        <section id="media" className="py-20 container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-brand-500 font-bold tracking-wider uppercase text-sm">Our Resources</span>
              <h2 className="font-serif text-4xl font-bold text-brand-900 mt-2">Media Library</h2>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
               {['All', MediaType.MUSIC, MediaType.SERMON, MediaType.VIDEO, MediaType.EBOOK].map(f => (
                 <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === f ? 'bg-brand-900 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                 >
                   {f}
                 </button>
               ))}
            </div>
          </div>

          {filteredMedia.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMedia.map(item => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No media found in this category.</p>
            </div>
          )}
        </section>

        <DevotionalSection />
        <QuizSection />
        <DonateSection />

        {/* About Section */}
        <section id="about" className="py-20 bg-brand-50">
          <div className="container mx-auto px-6 text-center max-w-3xl">
             <h2 className="font-serif text-4xl font-bold text-brand-900 mb-8">About GospelVoice</h2>
             <p className="text-gray-600 text-lg mb-8 leading-relaxed">
               Founded in 2024, GospelVoice Media is dedicated to leveraging technology to spread the unadulterated Word of God. We believe in the transformative power of the Gospel and aim to make spiritual resources accessible to believers worldwide. Whether through music, teaching, or interactive study, our mission remains the same: to glorify Jesus.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="bg-white p-6 rounded shadow-sm">
                   <div className="text-brand-500 mb-4 flex justify-center"><IconMusic className="w-8 h-8"/></div>
                   <h4 className="font-bold text-brand-900 mb-2">Worship</h4>
                   <p className="text-sm text-gray-500">Connecting hearts to God through divine melody.</p>
                </div>
                <div className="bg-white p-6 rounded shadow-sm">
                   <div className="text-brand-500 mb-4 flex justify-center"><IconMic className="w-8 h-8"/></div>
                   <h4 className="font-bold text-brand-900 mb-2">Word</h4>
                   <p className="text-sm text-gray-500">Deep insights into the scriptures for daily living.</p>
                </div>
                <div className="bg-white p-6 rounded shadow-sm">
                   <div className="text-brand-500 mb-4 flex justify-center"><IconBook className="w-8 h-8"/></div>
                   <h4 className="font-bold text-brand-900 mb-2">Wisdom</h4>
                   <p className="text-sm text-gray-500">Books and articles to build your spiritual capacity.</p>
                </div>
             </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-950 text-white py-12 border-t border-brand-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
             <div className="col-span-1 md:col-span-2">
               <h3 className="font-serif text-2xl font-bold mb-4">GOSPELVOICE</h3>
               <p className="text-brand-200 max-w-xs">Spreading the light of Christ through media, technology, and innovation.</p>
             </div>
             <div>
               <h4 className="font-bold text-white mb-4">Quick Links</h4>
               <ul className="space-y-2 text-brand-200 text-sm">
                 <li><a href="#" className="hover:text-white">Home</a></li>
                 <li><a href="#media" className="hover:text-white">Sermons</a></li>
                 <li><a href="#donate" className="hover:text-white">Donate</a></li>
                 <li><a href="#admin" className="hover:text-white" onClick={(e) => {e.preventDefault(); setView('admin-login'); }}>Admin Portal</a></li>
               </ul>
             </div>
             <div>
                <h4 className="font-bold text-white mb-4">Connect</h4>
                <p className="text-brand-200 text-sm mb-2">info@gospelvoice.media</p>
                <p className="text-brand-200 text-sm">+1 (555) 123-4567</p>
                <div className="flex gap-4 mt-4">
                  {/* Social Placeholders */}
                  <div className="w-8 h-8 bg-brand-800 rounded flex items-center justify-center hover:bg-brand-700 cursor-pointer">fb</div>
                  <div className="w-8 h-8 bg-brand-800 rounded flex items-center justify-center hover:bg-brand-700 cursor-pointer">tw</div>
                  <div className="w-8 h-8 bg-brand-800 rounded flex items-center justify-center hover:bg-brand-700 cursor-pointer">ig</div>
                </div>
             </div>
          </div>
          <div className="border-t border-brand-800 pt-8 text-center text-brand-400 text-sm">
            &copy; {new Date().getFullYear()} GospelVoice Media. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;