import React from 'react';
import { Bell, Search, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout, title, subtitle }) => {
  const navigate = useNavigate();

  return (
    // Added z-50 to ensure header stays on top of page content
    <div className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-slate-800 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 max-w-7xl mx-auto">
        
        {/* Page Title Section */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            {title}
            <span className="text-[10px] md:text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
               v2.4
            </span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">{subtitle}</p>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800 backdrop-blur-sm">
          
          {/* Search */}
          <div className="hidden md:flex items-center px-3 py-1.5 bg-slate-950/50 rounded-lg border border-slate-800/50 focus-within:border-indigo-500/50 transition-colors">
            <Search size={14} className="text-slate-500 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none focus:outline-none text-sm w-32 text-slate-300 placeholder:text-slate-600" 
            />
          </div>

          <div className="h-6 w-px bg-slate-800 mx-1"></div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>

          {/* User Dropdown - FIXED Z-INDEX */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-slate-800 transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                     {/* Show Initials or Icon */}
                     {user.name ? (
                       <span className="text-xs font-bold text-white">{user.name.charAt(0)}</span>
                     ) : (
                       <UserIcon size={14} className="text-white"/>
                     )}
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{user.role}</p>
                </div>
              </button>

              {/* Dropdown Menu with High Z-Index */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-[100] overflow-hidden">
                <div className="p-1">
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="flex items-center w-full gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition"
                  >
                    <UserIcon size={14} /> My Profile
                  </button>
                  <button className="flex items-center w-full gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition">
                    <Settings size={14} /> Settings
                  </button>
                  <div className="h-px bg-slate-800 my-1"></div>
                  <button 
                    onClick={onLogout}
                    className="flex items-center w-full gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/auth')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;