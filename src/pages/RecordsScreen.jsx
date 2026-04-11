import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Search, Filter, FileText, Download, Eye, MoreVertical } from 'lucide-react';
import api from '../services/api';

export const RecordsScreen = () => {
  const [records, setRecords] = useState([]);
  const comp = useRef(null);

  useEffect(() => {
    api.getRecords().then(data => {
      setRecords(data);
      let ctx = gsap.context(() => {
        gsap.from('.rec-row', { y: 15, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
      }, comp);
      return () => ctx.revert();
    });
  }, []);

  return (
    <div ref={comp} className="pt-8 pb-12 w-full anim-fade">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-on-surface">Medical Records</h1>
          <p className="text-on-surface-variant mt-1 font-medium">Search and export patient documentation.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-outline-variant/10">
          <div className="flex gap-2">
            <div className="relative w-72">
               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-outline" />
               <input type="text" placeholder="Search title or ID..." className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"/>
            </div>
            <button className="flex items-center space-x-2 text-xs text-on-surface-variant font-bold uppercase tracking-widest px-4 py-2.5 bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors">
              <Filter className="w-4 h-4" /> <span>Filters</span>
            </button>
          </div>
          <button className="flex items-center space-x-2 text-xs text-primary font-bold uppercase tracking-widest px-4 py-2.5 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors">
            <Download className="w-4 h-4" /> <span>Export List</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-surface border-b border-outline-variant/10">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Document Title</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Patient Profile</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date Added</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Size</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {records.map((rec, index) => (
                <tr key={rec.id} className={`rec-row hover:bg-primary/5 transition-colors group cursor-pointer ${index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface'}`}>
                  <td className="px-8 py-4 w-2/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-surface-container rounded-xl group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-5 h-5 text-on-surface-variant group-hover:text-primary" />
                      </div>
                      <span className="font-semibold text-on-surface font-display">{rec.docTitle}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="font-medium text-sm text-on-surface-variant">{rec.patient}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">{rec.date}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">{rec.size}</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
                      <button className="p-2 text-slate-300 hover:text-primary rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};
