import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  Star, ChevronRight, Stethoscope, ChevronLeft,
  Heart, Filter, FileText, Download, MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DepartmentsScreen = () => {
  const comp = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.anim-card', { y: 20, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="pt-8 pb-12 w-full max-w-7xl mx-auto">
      {/* Header Section with Rating */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 anim-card">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 uppercase tracking-widest">
            <span>Departments</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary font-bold">Cardiology</span>
          </nav>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-extrabold font-display text-on-surface tracking-tight">Cardiology Center</h2>
            <div className="flex items-center gap-1.5 bg-tertiary/10 px-3 py-1.5 rounded-xl border border-tertiary/20">
              <Star className="w-4 h-4 fill-tertiary text-tertiary" />
              <span className="text-sm font-bold text-on-tertiary-fixed-variant">4.9</span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest">(1,240 REVIEWS)</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-medium mt-1">Level 4, East Wing • 12 Active Specialists</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-surface bg-primary text-white flex items-center justify-center text-xs font-bold z-30 shadow-sm">JV</div>
            <div className="w-10 h-10 rounded-full border-2 border-surface bg-tertiary text-white flex items-center justify-center text-xs font-bold z-20 shadow-sm">SJ</div>
            <div className="w-10 h-10 rounded-full border-2 border-surface bg-slate-700 text-white flex items-center justify-center text-xs font-bold z-10 shadow-sm">RC</div>
            <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-xs font-bold text-slate-600 z-0 shadow-sm">+9</div>
          </div>
        </div>
      </section>

      {/* Bento Grid Dashboard Layout */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        
        {/* Specialists on Duty (Left Rail) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-slate-100 anim-card">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              Specialists on Duty
            </h3>
            <div className="space-y-4">
              {/* Doctor Card 1 */}
              <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold">JV</div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-tertiary border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm">Dr. Julian Vane</p>
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-tertiary">
                        <Star className="w-3 h-3 fill-tertiary" /> 5.0
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Senior Electrophysiologist</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
              </div>
              {/* Doctor Card 2 */}
              <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold">SJ</div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-tertiary border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm">Dr. Sarah Jenkins</p>
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-tertiary">
                        <Star className="w-3 h-3 fill-tertiary" /> 4.8
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Interventional Cardiology</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>

          {/* Department Stats */}
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-[2rem] p-8 text-white shadow-lg overflow-hidden relative anim-card">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold opacity-80 mb-6 uppercase tracking-widest">Live Department Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-4xl font-extrabold font-display">24</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Pending<br/>Admissions</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold font-display">86%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Theater<br/>Capacity</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Heart className="w-48 h-48" />
            </div>
          </div>
        </div>

        {/* Detailed Calendar (Main Action) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-full anim-card">
          <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-full flex-1 overflow-hidden">
            {/* Calendar Header */}
            <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-4">
                <h3 className="font-display font-semibold text-lg">Schedule: Oct 14 - 18</h3>
                <div className="flex bg-surface-container px-1 py-1 rounded-lg border border-outline-variant/10 shadow-inner">
                  <button className="px-4 py-1.5 text-xs font-bold bg-surface-container-lowest text-primary rounded-md shadow-sm">Week</button>
                  <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-md transition-colors">Day</button>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant/30 hover:bg-surface-container-low transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center border border-outline-variant/30 hover:bg-surface-container-low transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Calendar Grid Mockup */}
            <div className="flex-1 overflow-x-auto min-h-[300px] p-6 flex flex-col justify-center items-center opacity-60">
              <Calendar className="w-12 h-12 text-outline-variant mb-4" />
              <p className="text-sm font-bold text-outline uppercase tracking-widest">Calendar view rendering...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Patient List */}
      <section className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 anim-card">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="font-display font-semibold text-lg">Active Department Files</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-surface text-slate-600 px-4 py-2 rounded-xl text-xs font-bold border border-outline-variant/20 hover:bg-surface-container-low transition-colors uppercase tracking-widest"><FileText className="w-3.5 h-3.5"/> Export PDF</button>
            <button className="flex items-center gap-2 bg-surface text-slate-600 px-4 py-2 rounded-xl text-xs font-bold border border-outline-variant/20 hover:bg-surface-container-low transition-colors uppercase tracking-widest"><Filter className="w-3.5 h-3.5"/> Filter</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface">
                <th className="px-8 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Patient Name</th>
                <th className="px-8 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Assigned Doctor</th>
                <th className="px-8 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Condition</th>
                <th className="px-8 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Risk Level</th>
                <th className="px-8 py-4 text-[10px] uppercase font-bold text-slate-500 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              <tr className="hover:bg-primary/5 transition-colors group cursor-pointer bg-surface-container-lowest">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">BP</div>
                    <div>
                      <p className="text-sm font-semibold font-display">Benjamin Parker</p>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-wider">ID: #CRT-9021</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-medium">Dr. Vane</p>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-medium text-slate-600">Atrial Fibrillation</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-error shadow-sm"></div>
                    <span className="text-xs font-bold text-error uppercase tracking-widest">High</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-slate-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"><MoreVertical className="w-5 h-5"/></button>
                </td>
              </tr>
              <tr className="hover:bg-primary/5 transition-colors group cursor-pointer bg-surface">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">MS</div>
                    <div>
                      <p className="text-sm font-semibold font-display">Miriam Stone</p>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-wider">ID: #CRT-8842</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-medium">Dr. Jenkins</p>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-medium text-slate-600">Hypertension</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Moderate</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-slate-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"><MoreVertical className="w-5 h-5"/></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
