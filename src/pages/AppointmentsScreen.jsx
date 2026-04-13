import React, { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
  const mondayOffset = (start.getDay() + 6) % 7; // Monday=0
  start.setDate(start.getDate() - mondayOffset);
  start.setHours(0, 0, 0, 0);
  return start;
};

const parseTimeToMinutes = (timeLabel) => {
  const match = String(timeLabel || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return Number.NaN;

  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM') hours += 12;

  return (hours * 60) + minutes;
};

const formatMinutesLabel = (totalMinutes) => {
  const period = totalMinutes >= 12 * 60 ? 'PM' : 'AM';
  let hours = Math.floor(totalMinutes / 60) % 12;
  if (hours === 0) hours = 12;
  return `${hours}:00 ${period}`;
};

export const WeeklyCalendar = ({ appointments, loading }) => {
  const comp = useRef(null);

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
      if (grouped[appointment.date]) {
        grouped[appointment.date].push(appointment);
      }
    });
    Object.values(grouped).forEach((dayAppointments) => {
      dayAppointments.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
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
  }, [loading, appointments]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-outline uppercase tracking-widest animate-pulse">Loading appointments...</div>
      </div>
    );
  }

  const statusEventStyles = {
    Confirmed: { wrap: 'bg-emerald-50 hover:bg-emerald-100/80 ring-emerald-500/30 text-emerald-900 shadow-sm hover:shadow-md hover:scale-[1.02] hover:z-20 transition-all duration-300', accent: 'bg-emerald-500', time: 'text-emerald-700', name: 'text-emerald-900', meta: 'text-emerald-700/80' },
    'Checked-in': { wrap: 'bg-sky-50 hover:bg-sky-100/80 ring-sky-500/30 text-sky-900 shadow-sm hover:shadow-md hover:scale-[1.02] hover:z-20 transition-all duration-300', accent: 'bg-sky-500', time: 'text-sky-700', name: 'text-sky-900', meta: 'text-sky-700/80' },
    Scheduled: { wrap: 'bg-amber-50 hover:bg-amber-100/80 ring-amber-500/30 text-amber-900 shadow-sm hover:shadow-md hover:scale-[1.02] hover:z-20 transition-all duration-300', accent: 'bg-amber-500', time: 'text-amber-700', name: 'text-amber-900', meta: 'text-amber-700/80' },
  };
  const fallbackStyle = { wrap: 'bg-slate-50 hover:bg-slate-100/80 ring-slate-500/30 text-slate-900 shadow-sm hover:shadow-md hover:scale-[1.02] hover:z-20 transition-all duration-300', accent: 'bg-slate-400', time: 'text-slate-700', name: 'text-slate-900', meta: 'text-slate-700/80' };

  return (
    <div ref={comp} className="bg-surface border border-slate-100/80 shadow-sm rounded-3xl overflow-hidden ring-1 ring-slate-900/5">
      <div className="w-full">
        <div className="w-full">
          {/* Header */}
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

          {/* Grid */}
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
                    const startMinutes = parseTimeToMinutes(appointment.time);
                    if (Number.isNaN(startMinutes)) return null;

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
                        className="calendar-event absolute inset-x-1.5 z-10 hover:z-20"
                        style={{ top, height }}
                      >
                        <article
                          className={`w-full h-full relative rounded-xl ring-1 ring-inset px-2 md:px-3 py-2 flex flex-col justify-between cursor-pointer ${style.wrap}`}
                        >
                          <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-1 rounded-r-md ${style.accent}`} />

                          <div className="flex flex-col gap-0.5 min-h-0 pl-1">
                            <p className={`text-[10px] md:text-[12px] font-bold leading-tight truncate ${style.name}`}>
                              {appointment.patient}
                            </p>
                            <p className={`hidden md:block text-[10px] font-medium leading-tight truncate ${style.meta}`}>
                              {appointment.type}
                            </p>
                          </div>
                          <p className={`hidden md:block text-[9px] font-semibold leading-none truncate ${style.meta} mt-auto pt-1 pl-1`}>
                            {appointment.doctor} • {appointment.time}
                          </p>
                        </article>
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
  const [loading, setLoading] = useState(true);

  const weekRangeLabel = useMemo(() => {
    const start = getWeekStart(new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}`;
  }, []);

  useEffect(() => {
    let mounted = true;
    api.appointments.getAll()
      .then((data) => {
        if (!mounted) return;
        setAppointments(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="pt-8 pb-12 w-full anim-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-on-surface tracking-tight">Schedule</h1>
          <p className="text-on-surface-variant mt-2 font-medium text-sm">
            {weekRangeLabel} <span className="mx-2 opacity-50">•</span> {appointments.length} appointments
          </p>
        </div>
        <Link
          to="/dashboard/appointments/new"
          className="px-5 py-2.5 bg-primary text-surface rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 hover:bg-on-surface hover:text-white transform transition-all active:scale-95"
        >
          <CalendarIcon className="w-4 h-4" /> New Appointment
        </Link>
      </div>

      <WeeklyCalendar appointments={appointments} loading={loading} />
    </div>
  );
};
