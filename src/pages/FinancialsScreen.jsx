import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import {
  DollarSign, TrendingUp, Activity, Info, BarChart,
  UserPlus, RefreshCw, AlertTriangle, Download
} from 'lucide-react';
import api from '../services/api';

export const FinancialsScreen = () => {
  const comp = useRef(null);
  const [summary, setSummary] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [patientInflow, setPatientInflow] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deptBreakdown, setDeptBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.financials.getSummary(),
      api.financials.getMonthlyRevenue(),
      api.financials.getPatientInflow(),
      api.financials.getAlert(),
      api.financials.getDepartmentBreakdown(),
    ]).then(([summaryData, revenueData, inflowData, alertData, breakdownData]) => {
      setSummary(summaryData);
      setMonthlyRevenue(revenueData);
      setPatientInflow(inflowData);
      setAlert(alertData);
      setDeptBreakdown(breakdownData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      let ctx = gsap.context(() => {
        gsap.from('.anim-fade', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
      }, comp);
      return () => ctx.revert();
    }
  }, [loading]);

  if (loading || !summary) {
    return (
      <div className="pt-8 pb-12 w-full flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-outline uppercase tracking-widest animate-pulse">Loading financials...</div>
      </div>
    );
  }

  const utilizationStyles = {
    success: 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed/50',
    neutral: 'bg-surface-container-highest text-on-surface-variant',
    error: 'bg-error-container text-on-error-container border border-error-container/50',
  };

  return (
    <div ref={comp} className="pt-8 pb-12 w-full anim-fade">
      <div className="space-y-8">

        {/* Dashboard Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-4 anim-fade">
          <div>
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-display">Financial Performance</h2>
            <p className="text-on-surface-variant font-medium mt-1">Year-to-date Real-time Analytics</p>
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
                  <TrendingUp className="w-3.5 h-3.5" /> {summary.revenueGrowth}
                </span>
              </div>
              <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-extrabold text-on-surface mt-1 font-display">{summary.totalRevenue}</h3>
            </div>
          </div>

          <div className="md:col-span-1 bg-surface-container-low rounded-[2rem] p-6 flex flex-col justify-between border border-transparent hover:border-tertiary/10 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-3 bg-tertiary-fixed text-tertiary rounded-xl">
                  <Activity className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-tertiary flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> {summary.marginGrowth}
                </span>
              </div>
              <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">Operating Margin</p>
              <h3 className="text-2xl font-extrabold text-on-surface mt-1 font-display">{summary.operatingMargin}</h3>
            </div>
          </div>

          <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container text-white rounded-[2rem] p-6 flex items-center justify-between relative overflow-hidden group shadow-lg shadow-primary/20">
            <div className="relative z-10">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Projected Surplus (Q4)</p>
              <h3 className="text-4xl font-extrabold text-white mt-2 font-display">{summary.projectedSurplus}</h3>
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

            {/* Chart Bars */}
            <div className="h-64 flex items-end gap-4 px-4 border-b border-outline-variant/20">
              {monthlyRevenue.map((item, i) => {
                const barStyles = [
                  'bg-primary/20 hover:bg-primary/40',
                  'bg-primary/40 hover:bg-primary/60',
                  'bg-primary/20 hover:bg-primary/40',
                  'bg-primary/60 hover:bg-primary/80',
                  'bg-primary/30 hover:bg-primary/50',
                  'bg-primary hover:opacity-90',
                ];
                return (
                  <div
                    key={item.month}
                    className={`flex-1 rounded-t-xl transition-colors cursor-pointer group/bar relative ${barStyles[i] || 'bg-primary/40'}`}
                    style={{
                      height: `${item.percent}%`,
                      animation: `growUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${0.3 + i * 0.1}s both`,
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {item.month}: ${Math.round(item.value / 1000)}k
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between px-4 pt-4 text-[10px] font-bold text-on-surface-variant uppercase">
              {monthlyRevenue.map((item) => (
                <span key={item.month}>{item.month}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-low rounded-[2rem] p-8 flex-1">
              <h3 className="text-xl font-bold mb-6 font-display">Patient Inflow</h3>
              <div className="space-y-6">

                {patientInflow && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center">
                        <UserPlus className="w-6 h-6 text-on-secondary-container" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs font-bold text-on-surface">New Patients</span>
                          <span className="text-xs font-extrabold text-primary">+{patientInflow.newPatients.count}</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${patientInflow.newPatients.percent}%` }}></div>
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
                          <span className="text-xs font-extrabold text-tertiary">{patientInflow.returning.count.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-tertiary rounded-full" style={{ width: `${patientInflow.returning.percent}%` }}></div>
                        </div>
                      </div>
                    </div>

                  </>
                )}

              </div>
            </div>

            {alert && (
              <div className="p-4 rounded-[1.5rem] bg-orange-100 flex items-center gap-3 anim-fade">
                <div className="p-2 bg-orange-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface uppercase tracking-wider">{alert.title}</p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">{alert.message}</p>
                </div>
              </div>
            )}
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
                {deptBreakdown.map((row, i) => (
                  <tr key={i} className={`${row.utilizationStyle === 'error' ? 'hover:bg-error/5' : 'hover:bg-primary/5'} transition-colors group cursor-pointer ${i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface'}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-${row.dotColor}`}></div>
                        <span className="text-sm font-bold text-on-surface">{row.department}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-display font-semibold text-on-surface">{row.grossRevenue}</td>
                    <td className="px-8 py-6 font-display text-on-surface-variant">{row.operationalCost}</td>
                    <td className={`px-8 py-6 font-display font-bold text-${row.netProfitColor}`}>{row.netProfit}</td>
                    <td className="px-8 py-6 text-right">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${utilizationStyles[row.utilizationStyle] || utilizationStyles.neutral}`}>{row.utilization}</span>
                    </td>
                  </tr>
                ))}
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
