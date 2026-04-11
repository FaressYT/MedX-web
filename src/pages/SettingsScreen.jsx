import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Shield, Bell, User, Lock, Save, Sliders, Globe } from 'lucide-react';

export const SettingsScreen = () => {
  const comp = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.anim-fade', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="pt-8 pb-12 w-full max-w-5xl mx-auto anim-fade">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-on-surface">System Settings</h1>
        <p className="text-on-surface-variant mt-1 font-medium">Manage preferences, security, and integration options.</p>
      </div>

      <div className="grid grid-cols-12 gap-8 mt-8">
        
        {/* Left Side: Settings Nav Rail */}
        <div className="col-span-12 md:col-span-3 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary text-primary font-bold rounded-r-xl transition-colors">
            <User className="w-5 h-5" /> Account
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-surface-container-lowest hover:text-slate-900 border-l-4 border-transparent font-medium rounded-r-xl transition-colors">
            <Shield className="w-5 h-5" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-surface-container-lowest hover:text-slate-900 border-l-4 border-transparent font-medium rounded-r-xl transition-colors">
            <Bell className="w-5 h-5" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-surface-container-lowest hover:text-slate-900 border-l-4 border-transparent font-medium rounded-r-xl transition-colors">
            <Sliders className="w-5 h-5" /> Preferences
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-surface-container-lowest hover:text-slate-900 border-l-4 border-transparent font-medium rounded-r-xl transition-colors">
            <Globe className="w-5 h-5" /> Integrations
          </button>
        </div>

        {/* Right Side: Options Surface */}
        <div className="col-span-12 md:col-span-9 space-y-8">
          
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-display font-bold mb-6 pb-4 border-b border-outline-variant/10">Profile Data</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Full Name</label>
                <input type="text" defaultValue="Dr. Julian Vance" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Clinical Designation</label>
                <input type="text" defaultValue="System Lead / Administrator" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Email Address</label>
                <input type="email" defaultValue="j.vance@medxcore.hospital" className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium" />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-tertiary"></div>
            <h3 className="text-xl font-display font-bold mb-4">Two-Factor Authentication</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">Add an extra layer of security to your clinical portal by enabling MFA. Required for HIPAA compliance.</p>
            
            <div className="flex items-center justify-between p-4 bg-tertiary/5 rounded-xl border border-tertiary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">Authenticator App</p>
                  <p className="text-xs font-medium text-slate-500">Configured via Google Auth</p>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-tertiary text-white text-xs font-bold rounded-lg tracking-widest uppercase shadow-sm">
                Active
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-md hover:scale-[1.02] transform transition-transform active:scale-95 text-sm uppercase tracking-widest">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
