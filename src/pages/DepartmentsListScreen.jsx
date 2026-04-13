import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Star, ChevronRight, Users, Activity, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export const DepartmentsListScreen = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const comp = useRef(null);

  useEffect(() => {
    let mounted = true;

    api.departments.getAll()
      .then((data) => {
        if (!mounted) return;
        setDepartments(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading || departments.length === 0 || !comp.current) return undefined;

    const ctx = gsap.context((self) => {
      const cards = self.selector('.dept-card');
      if (!cards.length) return;

      gsap.killTweensOf(cards);
      gsap.fromTo(
        cards,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'transform,opacity,visibility',
          overwrite: 'auto',
        }
      );
    }, comp);

    return () => ctx.revert();
  }, [loading, departments.length]);

  const colorMap = {
    primary: { bg: 'bg-primary/10', text: 'text-primary', bar: 'bg-primary' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', bar: 'bg-purple-500' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', bar: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', bar: 'bg-emerald-500' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', bar: 'bg-cyan-500' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-600', bar: 'bg-rose-500' },
  };

  return (
    <div ref={comp} className="pt-8 pb-12 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-extrabold text-on-surface tracking-tight">Departments</h1>
        <p className="text-on-surface-variant mt-1 font-medium">Browse and manage all clinical departments across the facility.</p>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Total Departments</p>
          <p className="text-2xl font-extrabold font-display text-on-surface">{departments.length}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Active Specialists</p>
          <p className="text-2xl font-extrabold font-display text-on-surface">{departments.reduce((sum, d) => sum + d.specialistCount, 0)}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Pending Admissions</p>
          <p className="text-2xl font-extrabold font-display text-on-surface">{departments.reduce((sum, d) => sum + d.pendingAdmissions, 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-5 text-white shadow-md">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Avg. Rating</p>
          <p className="text-2xl font-extrabold font-display">{departments.length ? (departments.reduce((sum, d) => sum + d.rating, 0) / departments.length).toFixed(1) : '—'}</p>
        </div>
      </div>

      {/* Department Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-sm font-bold text-outline uppercase tracking-widest animate-pulse">Loading departments...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const colors = colorMap[dept.color] || colorMap.primary;
            return (
              <Link
                key={dept.id}
                to={`/dashboard/departments/${dept.id}`}
                className="dept-card group bg-surface-container-lowest rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer block"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center ${colors.text}`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-on-surface">{dept.rating}</span>
                  </div>
                </div>

                {/* Name & Location */}
                <h3 className="text-lg font-bold font-display text-on-surface group-hover:text-primary transition-colors">{dept.name}</h3>
                <p className="text-xs font-medium text-outline mt-1">{dept.location}</p>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mt-5 pt-5 border-t border-outline-variant/10">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-outline" />
                    <span className="text-xs font-bold text-on-surface-variant">{dept.specialistCount} Specialists</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-outline" />
                    <span className="text-xs font-bold text-on-surface-variant">{dept.pendingAdmissions} Pending</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-widest mb-1.5">
                    <span>Capacity</span>
                    <span>{dept.capacity}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${colors.bar} rounded-full transition-all duration-500`} style={{ width: `${dept.capacity}%` }}></div>
                  </div>
                </div>

                {/* Reviews Footer */}
                <div className="flex items-center justify-between mt-5">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{dept.reviewCount.toLocaleString()} reviews</span>
                  <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
