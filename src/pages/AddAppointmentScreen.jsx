import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import {
  ChevronRight, Search,
  Stethoscope, Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const getTodayLocalDate = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
};

const formatBirthdateLabel = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const getInitials = (firstName, lastName) => {
  const first = (firstName || '').trim().charAt(0);
  const last = (lastName || '').trim().charAt(0);
  const initials = `${first}${last}`.toUpperCase();
  return initials || 'P';
};

export const AddAppointmentScreen = () => {
  const comp = useRef(null);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPractitioner, setSelectedPractitioner] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDate());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientSubmitting, setPatientSubmitting] = useState(false);
  const [patientError, setPatientError] = useState('');
  const [patientForm, setPatientForm] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    address: '',
    phoneNumber: '',
    gender: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.appointments.getDepartmentOptions(),
    ]).then(([deptData]) => {
      setDepartments(deptData);
      setSelectedDepartment(deptData[0]?.id || '');
      setSearchResult(null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedDepartment) {
      setPractitioners([]);
      setSelectedPractitioner('');
      return;
    }

    let mounted = true;
    api.appointments.getPractitionerOptions(selectedDepartment).then((practData) => {
      if (!mounted) return;
      setPractitioners(practData);
      setSelectedPractitioner(practData[0]?.id || '');
    });

    return () => {
      mounted = false;
    };
  }, [selectedDepartment]);

  useEffect(() => {
    if (!selectedDepartment || !selectedDate) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      return;
    }

    let mounted = true;
    setSlotsLoading(true);

    api.appointments
      .getAvailableSlots(selectedDate, selectedDepartment)
      .then((slotsData) => {
        if (!mounted) return;
        setAvailableSlots(slotsData);
        setSelectedSlot(prev => (slotsData.includes(prev) ? prev : (slotsData[0] || null)));
      })
      .finally(() => {
        if (mounted) setSlotsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedDate, selectedDepartment]);

  useEffect(() => {
    if (!loading) {
      let ctx = gsap.context(() => {
        gsap.from('.anim-card', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
      }, comp);
      return () => ctx.revert();
    }
  }, [loading]);

  const openPatientModal = () => {
    setPatientError('');
    setIsPatientModalOpen(true);
  };

  const closePatientModal = () => {
    if (patientSubmitting) return;
    setIsPatientModalOpen(false);
  };

  const handlePatientFieldChange = (field, value) => {
    setPatientForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatePatientProfile = async (e) => {
    e.preventDefault();
    setPatientError('');
    setPatientSubmitting(true);

    try {
      const createdPatient = await api.patients.create(patientForm);
      const fullName = `${createdPatient.firstName} ${createdPatient.lastName}`.trim();
      setSearchResult({
        id: createdPatient.id,
        name: fullName,
        dob: formatBirthdateLabel(createdPatient.birthdate),
        initials: getInitials(createdPatient.firstName, createdPatient.lastName),
        verified: true,
      });
      setPatientForm({
        firstName: '',
        lastName: '',
        birthdate: '',
        address: '',
        phoneNumber: '',
        gender: '',
      });
      setIsPatientModalOpen(false);
    } catch (error) {
      setPatientError(error?.message || 'Failed to create patient profile.');
    } finally {
      setPatientSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-8 pb-12 w-full flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-outline uppercase tracking-widest animate-pulse">Loading form...</div>
      </div>
    );
  }

  return (
    <div ref={comp} className="pt-8 pb-12 w-full max-w-5xl mx-auto">
      {/* Breadcrumbs / Header */}
      <div className="mb-8 anim-card">
        <div className="flex items-center gap-2 text-sm text-outline mb-2">
          <Link to="/dashboard/appointments" className="hover:text-primary transition-colors">Appointments</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-medium tracking-wide">Schedule New Encounter</span>
        </div>
        <h2 className="text-3xl font-bold font-display text-on-surface tracking-tight">Add New Appointment</h2>
        <p className="text-on-surface-variant mt-1 font-medium">Configure clinical details for the upcoming visit.</p>
      </div>

      {/* Form Layout: Asymmetric Bento Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* Left Column: Patient & Department (Col-Span 8) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Patient Search & Info Card */}
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] border border-slate-100 shadow-sm anim-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display">Patient Information</h3>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Search Existing Patient</label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-12 pr-4 transition-all focus:ring-2 focus:ring-primary/20 outline-none text-sm placeholder:text-outline" placeholder="Enter name, ID, or SSN..." type="text" />
                  </div>
                  <button
                    type="button"
                    onClick={openPatientModal}
                    className="px-6 py-3 border border-outline-variant/30 text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors text-sm"
                  >
                    New Profile
                  </button>
                </div>
              </div>

              {/* Selected Patient */}
              {searchResult && (
                <div className="bg-surface p-4 rounded-2xl flex items-center gap-4 border border-outline-variant/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {searchResult.initials}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{searchResult.name}</p>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5 font-sans">ID: #{searchResult.id} • DOB: {searchResult.dob}</p>
                  </div>
                  {searchResult.verified && (
                    <div className="ml-auto px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] uppercase tracking-widest font-bold rounded-full border border-tertiary-fixed/50">
                      Verified
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Clinical Assignment Card */}
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] border border-slate-100 shadow-sm anim-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display">Clinical Assignment</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-slate-700 cursor-pointer transition-all"
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Practitioner</label>
                <select
                  value={selectedPractitioner}
                  onChange={(e) => setSelectedPractitioner(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-slate-700 cursor-pointer transition-all"
                  disabled={practitioners.length === 0}
                >
                  {practitioners.map(prac => (
                    <option key={prac.id} value={prac.id}>{prac.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Reason for Visit</label>
              <textarea className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-slate-700 resize-none transition-all placeholder:text-outline/70" placeholder="Symptoms, referral details, or follow-up notes..." rows="3"></textarea>
            </div>
          </section>
        </div>

        {/* Right Column: Scheduling (Col-Span 4) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Date & Time Card */}
          <section className="bg-surface-container-lowest p-8 rounded-[2rem] border border-slate-100 shadow-sm anim-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-display">Schedule</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Consultation Date</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium text-slate-700"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest mb-2">Available Slots</label>
                <div className="max-h-56 overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {slotsLoading && (
                      <div className="col-span-2 sm:col-span-3 text-xs font-semibold text-outline uppercase tracking-widest py-2">
                        Loading slots...
                      </div>
                    )}

                    {!slotsLoading && availableSlots.length === 0 && (
                      <div className="col-span-2 sm:col-span-3 text-xs font-semibold text-outline uppercase tracking-widest py-2">
                        No slots available
                      </div>
                    )}

                    {!slotsLoading && availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 text-sm font-semibold rounded-xl transition-colors ${selectedSlot === slot
                            ? 'bg-gradient-to-br from-primary to-primary-container text-white font-bold shadow-md'
                            : 'text-slate-600 border border-outline-variant/30 hover:border-primary/50 hover:bg-primary/5'
                          }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Action Bar */}
        <div className="col-span-12 mt-2 flex items-center justify-end gap-3 p-6 bg-surface-container-lowest rounded-[2rem] border border-slate-100 shadow-sm anim-card">
          <button
            onClick={() => navigate('/dashboard/appointments')}
            className="px-6 py-2.5 text-on-surface-variant font-bold hover:bg-surface-container-low transition-colors rounded-xl text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate('/dashboard/appointments')}
            className="px-8 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transform transition-transform active:scale-95 flex items-center gap-2 text-sm"
          >
            <Calendar className="w-4 h-4" /> Confirm Appointment
          </button>
        </div>

      </div>

      {isPatientModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
            onClick={closePatientModal}
            aria-label="Close Add Patient Profile"
          />

          <section className="relative w-full max-w-2xl bg-surface rounded-[2rem] border border-slate-200 shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold font-display text-on-surface">Add Patient Profile</h3>
                <p className="text-sm text-on-surface-variant mt-1">Create a new patient profile to use in this appointment.</p>
              </div>
              <button
                type="button"
                onClick={closePatientModal}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreatePatientProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest">First Name</label>
                  <input
                    type="text"
                    value={patientForm.firstName}
                    onChange={(e) => handlePatientFieldChange('firstName', e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest">Last Name</label>
                  <input
                    type="text"
                    value={patientForm.lastName}
                    onChange={(e) => handlePatientFieldChange('lastName', e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest">Birthdate</label>
                  <input
                    type="date"
                    value={patientForm.birthdate}
                    onChange={(e) => handlePatientFieldChange('birthdate', e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    value={patientForm.phoneNumber}
                    onChange={(e) => handlePatientFieldChange('phoneNumber', e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest">Address</label>
                  <textarea
                    value={patientForm.address}
                    onChange={(e) => handlePatientFieldChange('address', e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium min-h-20 resize-y"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold text-outline-variant uppercase tracking-widest">Gender</label>
                  <select
                    value={patientForm.gender}
                    onChange={(e) => handlePatientFieldChange('gender', e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-slate-700 cursor-pointer"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {patientError && (
                <p className="text-sm font-semibold text-error">{patientError}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePatientModal}
                  className="px-6 py-2.5 text-on-surface-variant font-bold hover:bg-surface-container-low transition-colors rounded-xl text-sm"
                  disabled={patientSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transform transition-transform active:scale-95 text-sm disabled:opacity-60"
                  disabled={patientSubmitting}
                >
                  {patientSubmitting ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};
