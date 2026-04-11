import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Search, Filter, MoreVertical, Plus } from 'lucide-react';
import api from '../services/api';

export const PatientDirectoryScreen = () => {
  const [patients, setPatients] = useState([]);
  const comp = useRef(null);

  useEffect(() => {
    api.getPatients().then(data => {
      setPatients(data);
      let ctx = gsap.context(() => {
        gsap.from('.patient-row', { y: 15, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
      }, comp);
      return () => ctx.revert();
    });
  }, []);

  return (
    <div ref={comp} className="pt-8 pb-12 w-full anim-fade">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-on-surface">Patient Directory</h1>
          <p className="text-on-surface-variant mt-1 font-medium">Manage and view all registered patients.</p>
        </div>
        <button className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 hover:opacity-90 transform transition-transform active:scale-95">
          <Plus className="w-4 h-4"/> New Patient
        </button>
      </div>

      {/* Filters Rack */}
      <div className="bg-surface-container-lowest p-3 rounded-[2rem] border border-slate-100 shadow-sm flex space-x-2 items-center mb-6 w-fit">
         <button className="flex items-center space-x-2 text-xs text-on-surface-variant font-bold uppercase tracking-widest px-4 py-2 hover:bg-surface-container-low rounded-xl transition-colors">
           <Filter className="w-4 h-4" /> <span>Status: All</span>
         </button>
         <div className="w-px h-6 bg-outline-variant/30"></div>
         <button className="flex items-center space-x-2 text-xs text-on-surface-variant font-bold uppercase tracking-widest px-4 py-2 hover:bg-surface-container-low rounded-xl transition-colors">
           <span>Doctor: Any</span>
         </button>
      </div>

      {/* Data Table Array */}
      <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/10">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Patient Name</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Condition</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Physician</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-on-surface-variant font-medium">Loading records...</td>
                </tr>
              ) : (
                patients.map((p, index) => (
                  <tr key={p.id} className={`patient-row hover:bg-primary/5 transition-colors group cursor-pointer ${index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface'}`}>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface font-display">{p.name}</p>
                          <p className="text-[10px] font-bold text-outline uppercase tracking-wider">{p.id} • {p.age} yrs</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${p.status === 'Active' ? 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-fixed/50' : 'bg-surface-container-highest text-on-surface-variant border-transparent'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-medium text-on-surface-variant">{p.condition}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-medium text-on-surface-variant">{p.doctor}</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button className="p-2 text-slate-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};
