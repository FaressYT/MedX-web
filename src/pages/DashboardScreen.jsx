import React, { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import {
  Building2, Calendar, DollarSign, Activity,
  Stethoscope, AlertCircle, ChevronRight, MoreVertical, BarChart2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { buildIdMap, formatTimestampTime, getAppointmentDisplay } from '../services/appointmentUtils';

export const DashboardScreen = () => {
  const comp = useRef(null);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentContext, setAppointmentContext] = useState({ users: [], doctors: [], departments: [] });
  const [doctors, setDoctors] = useState([]);
  const [deptLoad, setDeptLoad] = useState(null);
  const [loading, setLoading] = useState(true);

  const appointmentLookups = useMemo(() => ({
    usersById: buildIdMap(appointmentContext.users),
    doctorsById: buildIdMap(appointmentContext.doctors),
    departmentsById: buildIdMap(appointmentContext.departments),
  }), [appointmentContext]);

  useEffect(() => {
    Promise.all([
      api.dashboard.getStats(),
      api.dashboard.getAppointmentsToday(),
      api.appointments.getContext(),
      api.dashboard.getDoctorsOnDuty(),
      api.dashboard.getDepartmentLoad(),
    ]).then(([statsData, apptData, contextData, docData, loadData]) => {
      setStats(statsData);
      setAppointments(apptData);
      setAppointmentContext(contextData);
      setDoctors(docData);
      setDeptLoad(loadData);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      let ctx = gsap.context(() => {
        gsap.from('.anim-card', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
        gsap.from('tr', { y: 10, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.4 });
      }, comp);
      return () => ctx.revert();
    }
  }, [loading]);

  if (loading || !stats) {
    return (
      <div className="pt-8 pb-12 w-full flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-outline uppercase tracking-widest animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  const statusDotColors = {
    'Confirmed': 'bg-tertiary',
    'Checked-in': 'bg-primary-fixed-dim',
    'Scheduled': 'bg-slate-300',
  };

  const statusTextColors = {
    'Confirmed': 'text-slate-600',
    'Checked-in': 'text-slate-600',
    'Scheduled': 'text-slate-400',
  };

  const deptBadgeStyles = {
    'Cardiology Center': 'bg-cyan-50 text-cyan-700',
    'Pediatrics Ward': 'bg-amber-50 text-amber-700',
    'Neurology Department': 'bg-purple-50 text-purple-700',
    'Orthopedics & Trauma': 'bg-emerald-50 text-emerald-700',
    'Radiology & Imaging': 'bg-slate-100 text-slate-700',
    'Oncology Institute': 'bg-rose-50 text-rose-700',
  };

  return (
    <div ref={comp} className="pt-8 pb-12 w-full">
      {/* Dashboard Hero Stats (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="anim-card col-span-1 md:col-span-2 bg-gradient-to-br from-primary to-primary-container p-6 rounded-[2rem] text-white flex flex-col justify-between h-48 relative overflow-hidden shadow-lg shadow-primary/20">
          <div className="z-10">
            <p className="text-sm font-medium opacity-80 uppercase tracking-widest font-sans">Total Patient Volume</p>
            <h2 className="text-4xl font-extrabold mt-1 font-display text-white">{stats.totalPatients}</h2>
            <p className="text-xs mt-2 font-medium bg-white/20 inline-block px-3 py-1 rounded-full">{stats.patientGrowth} from yesterday</p>
          </div>
          <div className="z-10 flex gap-4 text-xs font-medium mt-4">
            <span>{stats.newAdmissions} New Admissions</span>
            <span>{stats.followUps} Follow-ups</span>
          </div>
          {/* Decorative Abstract Element */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="anim-card bg-surface-container-lowest p-6 rounded-[2rem] flex flex-col justify-between h-48 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-tighter">On-Duty</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 font-display">{stats.cliniciansPresent} / {stats.cliniciansTotal}</p>
            <p className="text-xs text-slate-500 font-medium">Clinicians Present</p>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-tertiary rounded-full" style={{ width: `${Math.round((stats.cliniciansPresent / stats.cliniciansTotal) * 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Appointments Table Section */}
        <div className="anim-card lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-semibold text-slate-800 font-display">Today's Appointments</h3>
            <Link to="/dashboard/appointments" className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline">
              View Full Schedule <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-highest">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Patient</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Department</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Doctor</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {appointments.map((apt) => {
                    const display = getAppointmentDisplay(apt, appointmentLookups);
                    return (
                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-700">{formatTimestampTime(apt.time)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{display.patientInitials}</div>
                          <div>
                            <span className="text-sm font-medium text-slate-800 block">{display.patientName}</span>
                            {apt.is_asap && <span className="text-[10px] font-bold uppercase tracking-widest text-error">ASAP</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 ${deptBadgeStyles[display.departmentName] || 'bg-slate-50 text-slate-700'} text-[10px] font-bold rounded-md uppercase`}>{display.departmentName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{display.doctorName}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusDotColors[apt.status] || 'bg-slate-300'}`}></span>
                          <span className={`text-xs font-medium ${statusTextColors[apt.status] || 'text-slate-400'}`}>{apt.status}</span>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Active Doctors & Live Feed */}
        <div className="anim-card space-y-8">

          {/* Active Doctors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 px-2 font-display">Present Doctors</h3>
            <div className="bg-surface-container-lowest rounded-[2rem] p-4 space-y-4 shadow-sm border border-slate-100">

              {doctors.map((doc) => (
                <div key={doc.id} className={`flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer ${doc.status === 'in-surgery' ? 'opacity-70' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img className={`w-10 h-10 rounded-full object-cover ${doc.status === 'in-surgery' ? 'grayscale' : ''}`} src={doc.avatar} alt={doc.name} />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 ${doc.status === 'available' ? 'bg-tertiary' : 'bg-amber-400'} border-2 border-white rounded-full`}></span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{doc.name}</p>
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">
                        {doc.department}{doc.status === 'in-surgery' ? ' • In Surgery' : ''}
                      </p>
                    </div>
                  </div>
                  <MoreVertical className="w-5 h-5 text-slate-300" />
                </div>
              ))}

              <Link to="/dashboard/departments" className="w-full flex justify-center py-2 mt-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors uppercase tracking-widest text-center">
                Full Staff Directory
              </Link>
            </div>
          </div>

          {/* Department Snapshot Card */}
          {deptLoad && (
            <div className="bg-primary/5 rounded-[2rem] p-6 relative overflow-hidden border border-primary/10 shadow-inner">
              <h4 className="text-sm font-bold text-primary-container mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5" /> Live Department Load
              </h4>
              <div className="space-y-4">
                {deptLoad.departments.map((dept, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600">
                      <span>{dept.name}</span>
                      <span>{dept.capacity}% Capacity</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full bg-${dept.color} rounded-full`} style={{ width: `${dept.capacity}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center mb-2">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center relative">
                  <div className="text-center">
                    <span className="block text-xl font-extrabold text-primary font-display">{deptLoad.averageOccupancy}%</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase">Avg Occupancy</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
