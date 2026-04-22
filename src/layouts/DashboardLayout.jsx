import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Building2, Calendar, DollarSign, Activity,
  Search, Bell, HelpCircle, Settings,
  HeadphonesIcon, LogOut, Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active }) => {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
        ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold transform scale-[0.98]'
        : 'text-slate-600 hover:text-primary hover:bg-slate-200/50'
        }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-outline'} group-hover:text-primary transition-colors`} />
      <span className="font-medium text-sm tracking-wide font-sans">{label}</span>
    </Link>
  );
};

export const DashboardLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Activity, label: 'Overview', path: '/dashboard' },
    { icon: Building2, label: 'Departments', path: '/dashboard/departments' },
    { icon: Calendar, label: 'Appointments', path: '/dashboard/appointments' },
    { icon: DollarSign, label: 'Financials', path: '/dashboard/financials' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-surface font-sans">

      {/* Navigation Rail / Sidebar */}
      <aside className="w-64 bg-slate-100 flex-col p-4 z-50 border-r border-slate-200/50 hidden md:flex shrink-0 overflow-y-auto">
        <div className="mb-8 px-2 flex flex-col gap-2">
          {/* Logo placeholder mimicking Image */}
          <div className="w-10 h-10 rounded text-primary flex items-center justify-center font-bold text-xl border-2 border-primary/20 bg-white">
            M<span className="text-secondary/50">X</span>
          </div>
          <div className="flex flex-col mt-2">
            <h1 className="text-xl font-extrabold tracking-tight text-cyan-900 font-display">MedX Core</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1 scale-90 origin-left">Enterprise Portal</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 mt-4">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard')}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-200/80 space-y-1">
          <Link to="/dashboard/appointments/new" className="w-full mb-6 px-4 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 hover:opacity-90 transform transition-transform active:scale-95">
            <Plus className="w-4 h-4" /> New Appointment
          </Link>



          <div className="flex items-center gap-3 px-4 py-4 mt-2 hover:bg-slate-200/50 rounded-xl cursor-pointer transition-colors" onClick={logout}>
            <div className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center text-white font-bold shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">Admin Profile</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">Super User</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-surface">

        {/* Top Navbar */}
        <header className="h-20 shrink-0 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 border-b border-transparent">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="pl-10 pr-4 py-2.5 bg-surface-container-low border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-600 placeholder:text-slate-400"
                placeholder="Search Patient Files..."
                type="text"
              />
            </div>
            <nav className="hidden md:flex items-center gap-6">

              {/* Rating Pill */}
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/50">
                <span className="text-amber-600 text-xs font-bold">4.8</span>
                <div className="flex gap-0.5 text-amber-400">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <span className="text-[10px] text-slate-400 font-medium ml-1">Clinic Rating</span>
                </div>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard/appointments/new"
              className="ml-2 px-5 py-2.5 bg-primary-container text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Check In Patient
            </Link>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 relative">
          <div className="max-w-7xl mx-auto w-full relative">
            {children}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <nav className="md:hidden shrink-0 bg-surface border-t border-slate-200/50 flex items-center justify-around z-50">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 py-3 gap-1 ${active ? 'text-primary' : 'text-slate-500'}`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-primary/10' : 'transparent'}`}>
                  <item.icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-slate-400'}`} />
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-primary' : 'text-slate-500'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  )
};
