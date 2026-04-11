import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { 
  DollarSign, TrendingUp, Activity, Info, BarChart, 
  UserPlus, RefreshCw, AlertCircle, AlertTriangle, Download 
} from 'lucide-react';

export const FinancialsScreen = () => {
  const comp = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.anim-fade', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
      gsap.from('.chart-bar', { height: 0, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.3 });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="pt-8 pb-12 w-full anim-fade">
      <div className="space-y-8">
        
        {/* Dashboard Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-4 anim-fade">
          <div>
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-display">Financial Performance</h2>
            <p className="text-on-surface-variant font-medium mt-1">Fiscal Year Q3 Real-time Analytics</p>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-low p-1.5 rounded-xl">
            <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-surface-container-lowest text-primary shadow-sm hover:scale-[1.02] transition-transform">Monthly</button>
            <button className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors">Quarterly</button>
            <button className="px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors">Yearly</button>
          </div>
        </section>

        {/* Bento Grid - Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 anim-fade">
          <div className="md:col-span-1 bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between border border-transparent hover:border-primary/10 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-3 bg-primary-fixed text-primary rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-tertiary flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> 12%
                </span>
              </div>
              <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-extrabold text-on-surface mt-1 font-display">$412,890</h3>
            </div>
          </div>

          <div className="md:col-span-1 bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between border border-transparent hover:border-tertiary/10 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-3 bg-tertiary-fixed text-tertiary rounded-xl">
                  <Activity className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-tertiary flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> 5.2%
                </span>
              </div>
              <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Operating Margin</p>
              <h3 className="text-2xl font-extrabold text-on-surface mt-1 font-display">28.4%</h3>
            </div>
          </div>

          <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container text-white rounded-[2rem] p-6 flex items-center justify-between relative overflow-hidden group shadow-lg shadow-primary/20">
            <div className="relative z-10">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Projected Surplus (Q4)</p>
              <h3 className="text-4xl font-extrabold text-white mt-2 font-display">$84,200</h3>
              <p className="text-white/60 text-[10px] mt-4 flex items-center gap-1 uppercase font-bold">
                <Info className="w-3.5 h-3.5" /> Data based on current growth trajectory
              </p>
            </div>
            {/* Decorative Graphic */}
            <div className="opacity-20 transform translate-x-12 translate-y-6">
              <BarChart className="w-32 h-32 stroke-[1]" />
            </div>
          </div>
        </section>

        {/* Revenue Trends - Main Visual */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 anim-fade">
          <div className="lg:col-span-2 bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold font-display">Monthly Revenue Distribution</h3>
                <p className="text-sm text-on-surface-variant mt-1">Comparative analysis across primary departments</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs font-medium text-on-surface-variant">Clinical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                  <span className="text-xs font-medium text-on-surface-variant">Diagnostics</span>
                </div>
              </div>
            </div>

            {/* Visualization Placeholder */}
            <div className="h-64 flex items-end gap-4 px-4 border-b border-outline-variant/20 relative">
              <div className="flex-1 bg-primary/20 rounded-t-xl hover:bg-primary/40 transition-all h-[40%] group relative chart-bar">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Jan: $42k</div>
              </div>
              <div className="flex-1 bg-primary/40 rounded-t-xl h-[60%] chart-bar hover:bg-primary/60 transition-all cursor-pointer"></div>
              <div className="flex-1 bg-primary/20 rounded-t-xl h-[45%] chart-bar hover:bg-primary/40 transition-all cursor-pointer"></div>
              <div className="flex-1 bg-primary/60 rounded-t-xl h-[75%] chart-bar hover:bg-primary/80 transition-all cursor-pointer"></div>
              <div className="flex-1 bg-primary/30 rounded-t-xl h-[55%] chart-bar hover:bg-primary/50 transition-all cursor-pointer"></div>
              <div className="flex-1 bg-primary rounded-t-xl h-[90%] chart-bar hover:opacity-90 transition-all cursor-pointer"></div>
            </div>
            <div className="flex justify-between px-4 pt-4 text-[10px] font-bold text-on-surface-variant uppercase">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-low rounded-[2rem] p-8 flex-1">
              <h3 className="text-xl font-bold mb-6 font-display">Patient Inflow</h3>
              <div className="space-y-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-on-secondary-container" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-bold text-on-surface">New Patients</span>
                      <span className="text-xs font-extrabold text-primary">+240</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[75%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-tertiary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-bold text-on-surface">Returning</span>
                      <span className="text-xs font-extrabold text-tertiary">1,102</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary w-[90%] rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-bold text-on-surface">Urgent Care</span>
                      <span className="text-xs font-extrabold text-slate-500">84</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 w-[15%] rounded-full"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-4 rounded-[1.5rem] bg-orange-100 flex items-center gap-3 anim-fade">
              <div className="p-2 bg-orange-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface uppercase tracking-wider">Action Required</p>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">Pharmacy inventory cost up by 14%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Departmental Breakdown Table */}
        <section className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 anim-fade">
          <div className="p-8 flex justify-between items-center border-b border-outline-variant/10">
            <h3 className="text-xl font-bold font-display">Departmental Breakdown</h3>
            <button className="text-primary flex items-center gap-2 text-sm font-semibold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" /> Export PDF Report
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-surface">
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Department</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Gross Revenue</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Operational Cost</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Net Profit</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                
                <tr className="hover:bg-primary/5 transition-colors group cursor-pointer bg-surface-container-lowest">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm font-bold text-on-surface">Cardiology</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-display font-semibold text-on-surface">$124,500</td>
                  <td className="px-8 py-6 font-display text-on-surface-variant">$48,200</td>
                  <td className="px-8 py-6 font-display font-bold text-tertiary">$76,300</td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded-full border border-tertiary-fixed/50">OPTIMAL</span>
                  </td>
                </tr>

                <tr className="hover:bg-primary/5 transition-colors group cursor-pointer bg-surface">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                      <span className="text-sm font-bold text-on-surface">Radiology</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-display font-semibold text-on-surface">$98,000</td>
                  <td className="px-8 py-6 font-display text-on-surface-variant">$62,100</td>
                  <td className="px-8 py-6 font-display font-bold text-tertiary">$35,900</td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold rounded-full">STEADY</span>
                  </td>
                </tr>

                <tr className="hover:bg-primary/5 transition-colors group cursor-pointer bg-surface-container-lowest">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span className="text-sm font-bold text-on-surface">General Surgery</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-display font-semibold text-on-surface">$205,000</td>
                  <td className="px-8 py-6 font-display text-on-surface-variant">$112,000</td>
                  <td className="px-8 py-6 font-display font-bold text-tertiary">$93,000</td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold rounded-full border border-tertiary-fixed/50">HIGH</span>
                  </td>
                </tr>

                <tr className="hover:bg-error/5 transition-colors group cursor-pointer bg-surface">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                      <span className="text-sm font-bold text-on-surface">Pediatrics</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-display font-semibold text-on-surface">$45,390</td>
                  <td className="px-8 py-6 font-display text-on-surface-variant">$48,000</td>
                  <td className="px-8 py-6 font-display font-bold text-error">($2,610)</td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded-full border border-error-container/50">LOW</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-surface text-center border-t border-outline-variant/10">
            <button className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">View All 12 Departments</button>
          </div>
        </section>
      </div>
    </div>
  );
};
