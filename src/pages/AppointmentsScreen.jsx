import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { CalendarIcon, Clock, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export const AppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const comp = useRef(null);

  useEffect(() => {
    api.getAppointments().then(data => {
      setAppointments(data);
      let ctx = gsap.context(() => {
        gsap.from('.appt-card', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
      }, comp);
      return () => ctx.revert();
    });
  }, []);

  return (
    <div ref={comp} className="pt-8 pb-12 w-full anim-fade">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-on-surface">Appointments</h1>
          <p className="text-on-surface-variant mt-1 font-medium">Schedule management & visits.</p>
        </div>
        <Link to="/dashboard/appointments/new" className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 hover:opacity-90 transform transition-transform active:scale-95">
          <CalendarIcon className="w-4 h-4"/> New Appointment
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {appointments.map((apt, index) => (
          <div key={apt.id} className={`appt-card p-6 rounded-[2rem] border ${index % 2 === 0 ? 'bg-surface-container-lowest border-surface-variant' : 'bg-surface-container-low border-transparent'} flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer group shadow-sm`}>
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-on-surface text-lg font-display">{apt.patient}</p>
                <div className="flex items-center gap-3 mt-1 text-sm">
                  <span className="text-on-surface-variant font-medium">{apt.type}</span>
                  <span className="text-outline text-[10px] uppercase font-bold tracking-widest flex items-center gap-1"><Clock className="w-3 h-3"/> {apt.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-on-surface">{apt.doctor}</p>
                <p className="text-[10px] text-tertiary-fixed font-bold uppercase tracking-widest">{apt.status}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
