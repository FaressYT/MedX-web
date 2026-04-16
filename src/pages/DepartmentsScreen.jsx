import React, { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import {
  Star, ChevronRight, Stethoscope, ChevronLeft,
  Heart, Filter, FileText, MoreVertical, ArrowLeft,
  X, MessageSquare
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { WeeklyCalendar } from './AppointmentsScreen';
import { buildIdMap } from '../services/appointmentUtils';

// --- Slot rendering helper ---
const SlotCell = ({ slot }) => {
  if (!slot) return <div className="p-1 border-r border-outline-variant/15"></div>;
  const styles = {
    primary: 'bg-secondary-container/40 border-l-[3px] border-primary',
    tertiary: 'bg-tertiary/10 border-l-[3px] border-tertiary',
    highlight: 'bg-primary-container text-white shadow-md',
  };
  const textStyles = {
    primary: { name: 'text-on-secondary-container', type: 'text-on-secondary-container/70' },
    tertiary: { name: 'text-on-tertiary-fixed-variant', type: 'text-on-tertiary-fixed-variant/70' },
    highlight: { name: 'text-white', type: 'text-white/80' },
  };
  const s = styles[slot.variant] || styles.primary;
  const t = textStyles[slot.variant] || textStyles.primary;
  return (
    <div className="p-1 border-r border-outline-variant/15">
      <div className={`h-full rounded-lg p-2 ${s}`}>
        <p className={`text-[10px] font-bold ${t.name}`}>{slot.patient}</p>
        <p className={`text-[9px] ${t.type}`}>{slot.type}</p>
      </div>
    </div>
  );
};

export const DepartmentDetailScreen = () => {
  const { id } = useParams();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [appointmentContext, setAppointmentContext] = useState({ users: [], doctors: [], departments: [] });
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const comp = useRef(null);

  const appointmentLookups = useMemo(() => ({
    usersById: buildIdMap(appointmentContext.users),
    doctorsById: buildIdMap(appointmentContext.doctors),
    departmentsById: buildIdMap(appointmentContext.departments),
  }), [appointmentContext]);

  useEffect(() => {
    setLoading(true);
    setAppointmentsLoading(true);
    
    Promise.all([
      api.departments.getById(id),
      api.appointments.getAll(),
      api.appointments.getContext(),
    ]).then(([deptData, allAppointments, contextData]) => {
      setDept(deptData);
      setLoading(false);

      setAppointmentContext(contextData);
      const departmentRecord = contextData.departments.find((department) => department.slug === id);
      const filtered = allAppointments.filter((app) => Number(app.dep_id) === Number(departmentRecord?.id));
      setAppointments(filtered);
      setAppointmentsLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!loading && dept) {
      let ctx = gsap.context(() => {
        gsap.from('.anim-card', { y: 20, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
      }, comp);
      return () => ctx.revert();
    }
  }, [loading, dept]);

  if (loading || !dept) {
    return (
      <div className="pt-8 pb-12 w-full flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-outline uppercase tracking-widest animate-pulse">Loading department...</div>
      </div>
    );
  }

  const riskColors = {
    high: { dot: 'bg-error', text: 'text-error' },
    moderate: { dot: 'bg-amber-500', text: 'text-amber-600' },
    low: { dot: 'bg-tertiary', text: 'text-tertiary' },
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div ref={comp} className="pt-8 pb-12 w-full max-w-7xl mx-auto">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 anim-card">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 uppercase tracking-widest">
            <Link to="/dashboard/departments" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Departments
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary font-bold">{dept.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-extrabold font-display text-on-surface tracking-tight">{dept.name}</h2>
            <div className="flex items-center gap-1.5 bg-tertiary/10 px-3 py-1.5 rounded-xl border border-tertiary/20">
              <Star className="w-4 h-4 fill-tertiary text-tertiary" />
              <span className="text-sm font-bold text-on-tertiary-fixed-variant">{dept.rating}</span>
              <span className="text-[10px] text-slate-500 font-bold tracking-widest">({dept.reviewCount.toLocaleString()} REVIEWS)</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-medium mt-1">{dept.location} • {dept.specialistCount} Active Specialists</p>
        </div>

        <div className="flex -space-x-3">
          {dept.specialists.slice(0, 3).map((s, i) => (
            <div key={s.id} className={`w-10 h-10 rounded-full border-2 border-surface ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-tertiary' : 'bg-slate-700'} text-white flex items-center justify-center text-xs font-bold shadow-sm`} style={{ zIndex: 30 - i * 10 }}>
              {s.name.split(' ').map(w => w[0]).slice(1).join('')}
            </div>
          ))}
          {dept.specialistCount > 3 && (
            <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
              +{dept.specialistCount - 3}
            </div>
          )}
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Left Rail */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Specialists */}
          <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-slate-100 anim-card">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-xl"><Stethoscope className="w-5 h-5 text-primary" /></div>
              Specialists on Duty
            </h3>
            <div className="space-y-4">
              {dept.specialists.map(spec => (
                <div key={spec.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm">
                        {spec.name.split(' ').map(w => w[0]).slice(1).join('')}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 ${spec.status === 'available' ? 'bg-tertiary' : 'bg-error'} border-2 border-white rounded-full`}></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm">{spec.name}</p>
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-tertiary">
                          <Star className="w-3 h-3 fill-tertiary" /> {spec.rating}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{spec.role}</p>
                    </div>
                  </div>
                  {spec.status === 'in-surgery' ? (
                    <span className="bg-error-container text-on-error-container text-[10px] px-2 py-1 rounded font-bold uppercase">In Surgery</span>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Stats */}
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-[2rem] p-8 text-white shadow-lg overflow-hidden relative anim-card">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold opacity-80 mb-6 uppercase tracking-widest text-white">Live Department Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-4xl font-extrabold font-display">{dept.pendingAdmissions}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Pending<br />Admissions</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold font-display">{dept.capacity}%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1"><br />Capacity</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Heart className="w-48 h-48" />
            </div>
          </div>

          {/* Reviews Preview */}
          {dept.reviews.length > 0 && (
            <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-slate-100 anim-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-lg">Patient Reviews</h3>
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{dept.reviews.length} reviews</span>
              </div>
              <div className="space-y-3">
                {dept.reviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="p-4 bg-surface-container-low/40 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-0.5 text-tertiary">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} className="w-3 h-3 fill-tertiary" />
                        ))}
                        {Array.from({ length: 5 - review.rating }).map((_, j) => (
                          <Star key={`e-${j}`} className="w-3 h-3 text-slate-200" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{review.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px] font-bold text-primary">— {review.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{review.doctor}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowReviews(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-xs font-bold text-primary uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-colors border border-primary/10"
              >
                <MessageSquare className="w-4 h-4" />
                View All Reviews
              </button>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-full anim-card">
          <WeeklyCalendar appointments={appointments} loading={appointmentsLoading} lookups={appointmentLookups} />
        </div>
      </div>

      {/* Patient Files Table */}
      {dept.patients.length > 0 && (
        <section className="bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 anim-card">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="font-display font-semibold text-lg">Active Department Files</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 bg-surface text-slate-600 px-4 py-2 rounded-xl text-xs font-bold border border-outline-variant/20 hover:bg-surface-container-low transition-colors uppercase tracking-widest"><FileText className="w-3.5 h-3.5" /> Export PDF</button>
              <button className="flex items-center gap-2 bg-surface text-slate-600 px-4 py-2 rounded-xl text-xs font-bold border border-outline-variant/20 hover:bg-surface-container-low transition-colors uppercase tracking-widest"><Filter className="w-3.5 h-3.5" /> Filter</button>
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
                {dept.patients.map((patient, i) => {
                  const risk = riskColors[patient.risk] || riskColors.moderate;
                  return (
                    <tr key={patient.id} className={`hover:bg-primary/5 transition-colors group cursor-pointer ${i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface'}`}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {patient.name.split(' ').map(w => w[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold font-display">{patient.name}</p>
                            <p className="text-[10px] font-bold text-outline uppercase tracking-wider">ID: #{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5"><p className="text-sm font-medium">{patient.doctor}</p></td>
                      <td className="px-8 py-5"><span className="text-sm font-medium text-slate-600">{patient.condition}</span></td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${risk.dot} shadow-sm`}></div>
                          <span className={`text-xs font-bold ${risk.text} uppercase tracking-widest`}>{patient.risk}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-slate-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"><MoreVertical className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Reviews Modal ────────────────────────────────── */}
      {showReviews && dept && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
            onClick={() => setShowReviews(false)}
            aria-label="Close reviews"
          />

          {/* Panel */}
          <section className="relative w-full max-w-4xl max-h-[85vh] bg-surface rounded-[2rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-outline-variant/10 flex-shrink-0">
              <div>
                <h3 className="text-2xl font-bold font-display text-on-surface">All Patient Reviews</h3>
                <p className="text-sm text-on-surface-variant mt-1">{dept.name} — {dept.reviews.length} reviews</p>
              </div>
              <button
                onClick={() => setShowReviews(false)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reviews List */}
            <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-4">
              {dept.reviews.map((review) => (
                <div key={review.id} className="bg-surface-container-lowest rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  {/* Top Row: Patient + Date */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {review.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{review.patientName}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`w-4 h-4 ${j < review.rating ? 'fill-tertiary text-tertiary' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{review.text}</p>

                  {/* Footer: Doctor + Appointment ID */}
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">{review.doctor}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-surface-container-high px-2 py-1 rounded-md">{review.appointmentId}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-outline-variant/10 flex-shrink-0">
              <button
                onClick={() => setShowReviews(false)}
                className="px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
