import React, { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  buildIdMap,
  extractTimestampDate,
  formatTimestampTime,
  getAppointmentDisplay,
  parseTimestampTimeToMinutes,
} from '../services/appointmentUtils';

const DAY_START_MINUTES = 8 * 60;
const DAY_END_MINUTES = 18 * 60;
const HOUR_ROW_HEIGHT = 72;
const DEFAULT_APPOINTMENT_DURATION_MINUTES = 50;

const toIsoDate = (dateObj) => {
  const local = new Date(dateObj);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().slice(0, 10);
};

const getWeekStart = (dateObj) => {
  const start = new Date(dateObj);
  const mondayOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - mondayOffset);
  start.setHours(0, 0, 0, 0);
  return start;
};

const formatMinutesLabel = (totalMinutes) => {
  const period = totalMinutes >= 12 * 60 ? 'PM' : 'AM';
  let hours = Math.floor(totalMinutes / 60) % 12;
  if (hours === 0) hours = 12;
  return `${hours}:00 ${period}`;
};

const buildLookups = (context) => ({
  usersById: buildIdMap(context?.users || []),
  doctorsById: buildIdMap(context?.doctors || []),
  departmentsById: buildIdMap(context?.departments || []),
});

export const WeeklyCalendar = ({ appointments, loading, lookups }) => {
  const comp = useRef(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const todayIso = toIsoDate(new Date());
  const totalCalendarHeight = ((DAY_END_MINUTES - DAY_START_MINUTES) / 60) * HOUR_ROW_HEIGHT;

  const weekDays = useMemo(() => {
    const start = getWeekStart(new Date());
    return Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(start);
      date.setDate(start.getDate() + dayIndex);
      return {
        iso: toIsoDate(date),
        dayLabel: date.toLocaleDateString(undefined, { weekday: 'short' }),
        dateLabel: date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }),
      };
    });
  }, [todayIso]);

  const hourMarks = useMemo(() => {
    const marks = [];
    for (let minute = DAY_START_MINUTES; minute <= DAY_END_MINUTES; minute += 60) {
      marks.push(minute);
    }
    return marks;
  }, []);

  const appointmentsByDate = useMemo(() => {
    const grouped = Object.fromEntries(weekDays.map((day) => [day.iso, []]));
    appointments.forEach((appointment) => {
      const dateValue = extractTimestampDate(appointment.date);
      if (grouped[dateValue]) {
        grouped[dateValue].push(appointment);
      }
    });
    Object.values(grouped).forEach((dayAppointments) => {
      dayAppointments.sort((a, b) => parseTimestampTimeToMinutes(a.time) - parseTimestampTimeToMinutes(b.time));
    });
    return grouped;
  }, [appointments, weekDays]);

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from('.calendar-day', { y: 18, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' });
        gsap.from('.calendar-event', { opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.15, ease: 'power3.out', delay: 0.1 });
      }, comp);
      return () => ctx.revert();
    }
    return undefined;
  }, [loading, appointments]);

  useEffect(() => {
    const handleGlobalClick = () => setSelectedAppointmentId(null);
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-outline uppercase tracking-widest animate-pulse">Loading appointments...</div>
      </div>
    );
  }

  const statusEventStyles = {
    Confirmed: { wrap: 'bg-emerald-50 hover:bg-emerald-100/80 ring-emerald-500/30 text-emerald-900 shadow-sm hover:shadow-md hover:scale-[1.02] hover:z-20 transition-all duration-300', accent: 'bg-emerald-500', name: 'text-emerald-900', meta: 'text-emerald-700/80' },
    'Checked-in': { wrap: 'bg-sky-50 hover:bg-sky-100/80 ring-sky-500/30 text-sky-900 shadow-sm hover:shadow-md hover:scale-[1.02] hover:z-20 transition-all duration-300', accent: 'bg-sky-500', name: 'text-sky-900', meta: 'text-sky-700/80' },
    Scheduled: { wrap: 'bg-amber-50 hover:bg-amber-100/80 ring-amber-500/30 text-amber-900 shadow-sm hover:shadow-md hover:scale-[1.02] hover:z-20 transition-all duration-300', accent: 'bg-amber-500', name: 'text-amber-900', meta: 'text-amber-700/80' },
  };
  const fallbackStyle = { wrap: 'bg-slate-50 hover:bg-slate-100/80 ring-slate-500/30 text-slate-900 shadow-sm hover:shadow-md hover:scale-[1.02] hover:z-20 transition-all duration-300', accent: 'bg-slate-400', name: 'text-slate-900', meta: 'text-slate-700/80' };

  return (
    <div ref={comp} className="bg-surface border border-slate-100/80 shadow-sm rounded-3xl ring-1 ring-slate-900/5">
      <div className="w-full overflow-x-auto pb-1">
        <div className="min-w-[800px] w-full">
          <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] md:grid-cols-[70px_repeat(7,minmax(0,1fr))] border-b border-slate-100/80 bg-surface/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-end justify-center pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-100/50">Time</div>
            {weekDays.map((day) => {
              const isToday = day.iso === todayIso;
              return (
                <div
                  key={`header-${day.iso}`}
                  className={`flex flex-col items-center justify-center py-4 border-r last:border-r-0 border-slate-100/50 relative ${isToday ? 'bg-primary/5' : ''}`}
                >
                  {isToday && <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-b-full mx-8" />}
                  <p className={`text-[11px] font-bold tracking-widest uppercase mb-1 ${isToday ? 'text-primary' : 'text-slate-400'}`}>
                    {day.dayLabel}
                  </p>
                  <p className={`text-base font-display font-semibold leading-none ${isToday ? 'text-primary' : 'text-slate-800'}`}>
                    {day.dateLabel}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] md:grid-cols-[70px_repeat(7,minmax(0,1fr))]">
            <div className="relative border-r border-slate-100/50 bg-slate-50/30">
              <div style={{ height: totalCalendarHeight }}>
                {hourMarks.map((minute, idx) => {
                  const top = ((minute - DAY_START_MINUTES) / (DAY_END_MINUTES - DAY_START_MINUTES)) * totalCalendarHeight;
                  return (
                    <div
                      key={`time-${minute}`}
                      className="absolute left-0 right-0 flex items-start justify-center"
                      style={{ top, paddingTop: idx === 0 ? 4 : 0 }}
                    >
                      <span className="-translate-y-1/2 text-[10px] md:text-[11px] font-medium text-slate-400 whitespace-nowrap" style={{ lineHeight: 1 }}>
                        {formatMinutesLabel(minute)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {weekDays.map((day) => {
              const isToday = day.iso === todayIso;
              const dayAppointments = appointmentsByDate[day.iso] || [];

              return (
                <div
                  key={day.iso}
                  className={`calendar-day relative border-r last:border-r-0 border-slate-100/50 ${isToday ? 'bg-primary/[0.02]' : 'bg-surface'}`}
                  style={{ height: totalCalendarHeight }}
                >
                  {hourMarks.map((minute) => {
                    const top = ((minute - DAY_START_MINUTES) / (DAY_END_MINUTES - DAY_START_MINUTES)) * totalCalendarHeight;
                    return (
                      <div
                        key={`${day.iso}-line-${minute}`}
                        className="absolute left-0 right-0 border-t border-dashed border-slate-200/60"
                        style={{ top }}
                      />
                    );
                  })}

                  {dayAppointments.map((appointment) => {
                    const startMinutes = parseTimestampTimeToMinutes(appointment.time);
                    if (Number.isNaN(startMinutes)) return null;

                    const display = getAppointmentDisplay(appointment, lookups);
                    const clampedStart = Math.min(
                      DAY_END_MINUTES - DEFAULT_APPOINTMENT_DURATION_MINUTES,
                      Math.max(DAY_START_MINUTES, startMinutes)
                    );

                    const top = ((clampedStart - DAY_START_MINUTES) / (DAY_END_MINUTES - DAY_START_MINUTES)) * totalCalendarHeight;
                    const height = Math.max(
                      54,
                      (DEFAULT_APPOINTMENT_DURATION_MINUTES / (DAY_END_MINUTES - DAY_START_MINUTES)) * totalCalendarHeight
                    );

                    const style = statusEventStyles[appointment.status] ?? fallbackStyle;
                    return (
                      <div
                        key={appointment.id}
                        className={`calendar-event absolute inset-x-1.5 ${selectedAppointmentId === appointment.id ? 'z-[9999]' : 'z-10 hover:z-20'}`}
                        style={{ top, height }}
                      >
                        <article
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointmentId(selectedAppointmentId === appointment.id ? null : appointment.id);
                          }}
                          className={`w-full h-full relative rounded-xl ring-1 ring-inset px-2 md:px-3 py-2 flex flex-col justify-between cursor-pointer ${style.wrap}`}
                        >
                          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-1 rounded-r-md ${style.accent}`} />
                          {appointment.is_asap && (
                            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-white/70 text-[8px] font-bold uppercase tracking-widest text-error">
                              ASAP
                            </span>
                          )}

                          <div className="flex flex-col gap-0.5 min-h-0 pl-1 pr-6 md:pr-8">
                            <p className={`text-[10px] md:text-[12px] font-bold leading-tight ${style.name}`}>
                              {display.patientName}
                            </p>
                            <p className={`text-[9px] md:text-[10px] font-medium leading-tight truncate ${style.meta}`}>
                              {appointment.user_notes || display.departmentName}
                            </p>
                          </div>
                          <p className={`text-[8px] md:text-[9px] font-semibold leading-none truncate ${style.meta} mt-auto pt-1 pl-1`}>
                            {display.doctorName} • {display.timeLabel}
                          </p>
                        </article>

                        {selectedAppointmentId === appointment.id && (
                          <div 
                            className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-48 md:w-64 bg-surface shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] rounded-2xl p-4 z-[99999] border border-slate-200 ring-1 ring-slate-900/10 cursor-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h4 className="font-bold text-slate-900 text-sm md:text-base mb-1 truncate">{display.patientName}</h4>
                            <div className="space-y-1.5 mt-2">
                              <p className="text-xs md:text-sm text-slate-700 font-medium truncate">
                                <span className="text-slate-400">Doctor:</span> {display.doctorName}
                              </p>
                              <p className="text-xs md:text-sm text-slate-700 font-medium truncate">
                                <span className="text-slate-400">Dept:</span> {display.departmentName}
                              </p>
                              <p className="text-xs md:text-sm text-slate-700 font-medium truncate">
                                <span className="text-slate-400">Time:</span> {display.timeLabel}
                              </p>
                              {appointment.user_notes && (
                                <p className="text-xs text-slate-500 italic mt-2 border-t border-slate-100 pt-2 break-words whitespace-pre-wrap">
                                  {appointment.user_notes}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [context, setContext] = useState({ users: [], doctors: [], departments: [] });
  const [loading, setLoading] = useState(true);

  const lookups = useMemo(() => buildLookups(context), [context]);

  const weekRangeLabel = useMemo(() => {
    const start = getWeekStart(new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}`;
  }, []);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      api.appointments.getAll(),
      api.appointments.getContext(),
    ])
      .then(([appointmentData, contextData]) => {
        if (!mounted) return;
        setAppointments(appointmentData);
        setContext(contextData);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="pt-8 pb-12 w-full anim-fade space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-on-surface tracking-tight">Appointments</h1>
          <p className="text-on-surface-variant mt-2 font-medium text-sm">
            {weekRangeLabel} <span className="mx-2 opacity-50">•</span> {appointments.length} Appointments
          </p>
        </div>
        <Link
          to="/dashboard/appointments/new"
          className="px-5 py-2.5 bg-primary text-surface rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-on-surface hover:text-white transform transition-all active:scale-95"
        >
          <CalendarIcon className="w-4 h-4" /> New Appointment
        </Link>
      </div>

      <WeeklyCalendar appointments={appointments} loading={loading} lookups={lookups} />

    </div>
  );
};
