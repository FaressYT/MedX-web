import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  ChevronRight, Search, UserPlus, 
  Stethoscope, Calendar, RefreshCw, 
  CheckCircle, Clock 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AddAppointmentScreen = () => {
  const comp = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.anim-card', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="pt-8 pb-12 w-full max-w-5xl mx-auto">
      {/* Breadcrumbs / Header */}
      <div className="mb-8 anim-card">
        <div className="flex items-center gap-2 text-sm text-outline mb-2">
          <Link to="/dashboard/appointments" className="hover:text-primary transition-colors">Appointments</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-medium tracking-wide">Schedule New Encounter</span>
        </div>
        <h2 className="text-3xl font-bold font-display text-on-surface tracking-tight">Add New Appointment</h2>
        <p className="text-on-surface-variant mt-1 font-medium">Configure clinical details and verify insurance for the upcoming visit.</p>
      </div>

      {/* Form Layout: Asymmetric Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Patient & Department (Col-Span 8) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Patient Search & Info Card */}
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] border border-slate-100 shadow-sm anim-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display">Patient Information</h3>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Search Existing Patient</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-12 pr-4 transition-all focus:ring-2 focus:ring-primary/20 outline-none text-sm placeholder:text-outline" placeholder="Enter name, ID, or SSN..." type="text" />
                  </div>
                  <button className="px-6 py-3 border border-outline-variant/30 text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors text-sm">
                    New Profile
                  </button>
                </div>
              </div>
              
              {/* Selected Patient (Simulated) */}
              <div className="bg-surface p-4 rounded-2xl flex items-center gap-4 border border-outline-variant/10">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  E
                </div>
                <div>
                  <p className="font-bold text-on-surface">Elena Rodriguez-Chen</p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5 font-sans">ID: #PX-88291 • DOB: 14 May 1985</p>
                </div>
                <div className="ml-auto px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] uppercase tracking-widest font-bold rounded-full border border-tertiary-fixed/50">
                  Verified
                </div>
              </div>
            </div>
          </section>

          {/* Clinical Assignment Card */}
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] border border-slate-100 shadow-sm anim-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display">Clinical Assignment</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Department</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-slate-700 cursor-pointer transition-all">
                  <option>Cardiology Center</option>
                  <option>Neurology Dept</option>
                  <option>Pediatrics</option>
                  <option>General Practice</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Practitioner</label>
                <select className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-slate-700 cursor-pointer transition-all">
                  <option>Dr. Sarah Jenkins</option>
                  <option>Dr. Michael Aris</option>
                  <option>NP. Kevin O'Brien</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Reason for Visit</label>
              <textarea className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-slate-700 resize-none transition-all placeholder:text-outline/70" placeholder="Symptoms, referral details, or follow-up notes..." rows="3"></textarea>
            </div>
          </section>
        </div>

        {/* Right Column: Scheduling & Insurance (Col-Span 4) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Date & Time Card */}
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] border border-slate-100 shadow-sm anim-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display">Schedule</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Consultation Date</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-slate-700" type="date" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Available Slots</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 text-sm font-semibold text-slate-600 border border-outline-variant/30 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-colors">09:30 AM</button>
                  <button className="py-2.5 text-sm bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-md">10:15 AM</button>
                  <button className="py-2.5 text-sm font-semibold text-slate-600 border border-outline-variant/30 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-colors">11:00 AM</button>
                  <button className="py-2.5 text-sm font-semibold text-slate-600 border border-outline-variant/30 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-colors">01:45 PM</button>
                </div>
              </div>
            </div>
          </section>

          {/* Insurance Verification Card */}
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] border border-slate-100 shadow-sm border-l-4 border-l-tertiary anim-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display">Insurance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-surface rounded-2xl border border-outline-variant/10">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1.5">Primary Carrier</p>
                <p className="font-bold text-on-surface font-display text-lg">BlueCross Shield PPO</p>
                <p className="text-xs font-medium text-outline-variant mt-0.5">Policy: #9001-22-AX</p>
              </div>
              
              <button className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-outline-variant/40 text-outline font-semibold rounded-xl hover:bg-surface-container-low hover:text-primary hover:border-primary/40 transition-colors text-sm">
                <RefreshCw className="w-4 h-4" /> Refresh Eligibility
              </button>
              
              <div className="flex items-center gap-2 text-tertiary justify-center pt-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Coverage Active</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Action Bar */}
        <div className="col-span-12 mt-2 flex items-center justify-end gap-3 p-6 bg-surface-container-lowest rounded-[2rem] border border-slate-100 shadow-sm anim-card">
          <button 
            onClick={() => navigate('/dashboard/appointments')}
            className="px-6 py-2.5 text-on-surface-variant font-bold hover:bg-surface-container-low transition-colors rounded-xl text-sm"
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="border border-outline-variant/30 text-on-surface font-bold px-6 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-sm"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => navigate('/dashboard/appointments')}
            className="px-8 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transform transition-transform active:scale-95 flex items-center gap-2 text-sm"
          >
            <Calendar className="w-4 h-4"/> Confirm Appointment
          </button>
        </div>
        
      </div>
    </div>
  );
};
