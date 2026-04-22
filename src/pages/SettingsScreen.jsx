import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import {
  Shield,
  User,
  Save,
  Sliders,
  Upload,
  LogOut,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const SettingsScreen = () => {
  const comp = useRef(null);
  const { logout, updateUser } = useAuth();

  const [activeSection, setActiveSection] = useState('account');

  const [profile, setProfile] = useState({
    fullName: '',
    designation: '',
    email: '',
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileStatus, setProfileStatus] = useState('');

  const [clinicRequest, setClinicRequest] = useState({
    currentName: 'MedX Core Hospital',
    requestedName: '',
    reason: '',
    attachment: null,
  });
  const [clinicSubmitting, setClinicSubmitting] = useState(false);
  const [clinicStatus, setClinicStatus] = useState('');
  const [clinicFileInputKey, setClinicFileInputKey] = useState(0);

  const [passwordRequest, setPasswordRequest] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    reason: '',
  });
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityStatus, setSecurityStatus] = useState('');

  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: 'Asia/Damascus (UTC+03:00)',
  });
  const [preferencesStatus, setPreferencesStatus] = useState('');

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.anim-fade', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
    }, comp);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      setProfileLoading(true);
      try {
        const profileData = await api.settings.getProfile();

        if (!mounted) return;

        setProfile(profileData);
      } catch (error) {
        if (!mounted) return;
        setProfileStatus(error?.message || 'Failed to load settings.');
      } finally {
        if (mounted) {
          setProfileLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const navSections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus('');
    setProfileSaving(true);

    try {
      const updated = await api.settings.updateProfile(profile);
      updateUser({ name: updated.fullName });
      setProfileStatus('Profile updated successfully.');
    } catch (error) {
      setProfileStatus(error?.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleClinicSubmit = async (e) => {
    e.preventDefault();
    setClinicStatus('');
    setClinicSubmitting(true);

    try {
      const result = await api.settings.submitClinicNameChange(clinicRequest);
      setClinicStatus(`Request submitted. Ticket: ${result.ticketId}`);
      setClinicRequest(prev => ({
        ...prev,
        requestedName: '',
        reason: '',
        attachment: null,
      }));
      setClinicFileInputKey(prev => prev + 1);
    } catch (error) {
      setClinicStatus(error?.message || 'Failed to submit clinic name change request.');
    } finally {
      setClinicSubmitting(false);
    }
  };

  const handlePasswordChangeRequest = async (e) => {
    e.preventDefault();
    setSecurityStatus('');
    setSecurityLoading(true);

    try {
      if (passwordRequest.newPassword !== passwordRequest.confirmPassword) {
        throw new Error('New password and confirm password do not match.');
      }

      await api.settings.requestPasswordChange(passwordRequest);
      setSecurityStatus('Password change request submitted.');
      setPasswordRequest({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        reason: '',
      });
    } catch (error) {
      setSecurityStatus(error?.message || 'Failed to submit password change request.');
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleSavePreferences = () => {
    setPreferencesStatus('Preferences saved.');
  };

  const renderLogoutButton = () => (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={logout}
        className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm uppercase tracking-widest"
      >
        <LogOut className="w-4 h-4" /> Log Out
      </button>
    </div>
  );

  const renderAccountSection = () => (
    <>
      <form onSubmit={handleProfileSubmit} className="bg-surface-container-lowest rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-display font-bold mb-2">Profile Data</h3>
          <p className="text-sm text-on-surface-variant">Update your personal profile data used across MedX Core.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
              required
              disabled={profileLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Clinical Designation</label>
            <input
              type="text"
              value={profile.designation}
              onChange={(e) => setProfile(prev => ({ ...prev, designation: e.target.value }))}
              className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
              required
              disabled={profileLoading}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
              required
              disabled={profileLoading}
            />
          </div>
        </div>

        {profileStatus && (
          <p className="text-xs font-semibold text-primary">{profileStatus}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-md hover:scale-[1.02] transform transition-transform active:scale-95 text-sm uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={profileSaving || profileLoading}
          >
            {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {profileSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>

      <form onSubmit={handleClinicSubmit} className="bg-surface-container-lowest rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-display font-bold mb-2">Clinic Name Change Request</h3>
          <p className="text-sm text-on-surface-variant">Submit a clinic rename request with a required supporting file.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Current Clinic Name</label>
            <input
              type="text"
              value={clinicRequest.currentName}
              readOnly
              className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none text-sm font-medium text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Requested New Name</label>
            <input
              type="text"
              value={clinicRequest.requestedName}
              onChange={(e) => setClinicRequest(prev => ({ ...prev, requestedName: e.target.value }))}
              className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Reason / Notes</label>
            <textarea
              value={clinicRequest.reason}
              onChange={(e) => setClinicRequest(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium min-h-24 resize-y"
              placeholder="Add context for approval."
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Supporting File</label>
            <label className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl p-5 cursor-pointer text-slate-600 hover:bg-slate-50 transition-colors">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">
                {clinicRequest.attachment ? clinicRequest.attachment.name : 'Upload supporting document'}
              </span>
              <input
                key={clinicFileInputKey}
                type="file"
                className="hidden"
                onChange={(e) => setClinicRequest(prev => ({ ...prev, attachment: e.target.files?.[0] || null }))}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required
              />
            </label>
          </div>
        </div>

        {clinicStatus && (
          <p className="text-xs font-semibold text-primary">{clinicStatus}</p>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3">

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-md hover:scale-[1.02] transform transition-transform active:scale-95 text-sm uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={clinicSubmitting}
          >
            {clinicSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {clinicSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </>
  );

  const renderSecuritySection = () => (
    <form onSubmit={handlePasswordChangeRequest} className="bg-surface-container-lowest rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-display font-bold mb-2">Password Change Request</h3>
        <p className="text-sm text-on-surface-variant">Submit a request to change your account password.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Current Password</label>
          <input
            type="password"
            value={passwordRequest.currentPassword}
            onChange={(e) => setPasswordRequest(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">New Password</label>
          <input
            type="password"
            value={passwordRequest.newPassword}
            onChange={(e) => setPasswordRequest(prev => ({ ...prev, newPassword: e.target.value }))}
            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            required
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Confirm New Password</label>
          <input
            type="password"
            value={passwordRequest.confirmPassword}
            onChange={(e) => setPasswordRequest(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            required
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Reason (Optional)</label>
          <textarea
            value={passwordRequest.reason}
            onChange={(e) => setPasswordRequest(prev => ({ ...prev, reason: e.target.value }))}
            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium min-h-24 resize-y"
            placeholder="Add context for audit trail."
          />
        </div>
      </div>

      {securityStatus && <p className="text-xs font-semibold text-primary">{securityStatus}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={securityLoading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-md hover:scale-[1.02] transform transition-transform active:scale-95 text-sm uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {securityLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          {securityLoading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );

  const renderPreferencesSection = () => (
    <div className="bg-surface-container-lowest rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-display font-bold mb-2">Preferences</h3>
        <p className="text-sm text-on-surface-variant">Set workspace language and timezone defaults.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Language</label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
          >
            <option>English</option>
            <option>Arabic</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-outline-variant uppercase tracking-widest">Timezone</label>
          <select
            value={preferences.timezone}
            onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
            className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
          >
            <option>Asia/Damascus (UTC+03:00)</option>
            <option>UTC</option>
            <option>America/New_York (UTC-04:00)</option>
          </select>
        </div>
      </div>

      {preferencesStatus && <p className="text-xs font-semibold text-primary">{preferencesStatus}</p>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSavePreferences}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-md hover:scale-[1.02] transform transition-transform active:scale-95 text-sm uppercase tracking-widest"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>
    </div>
  );

  const sectionContent = {
    account: renderAccountSection(),
    security: renderSecuritySection(),
    preferences: renderPreferencesSection(),
  };

  if (profileLoading) {
    return (
      <div className="pt-8 pb-12 w-full flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-outline uppercase tracking-widest animate-pulse">Loading settings...</div>
      </div>
    );
  }

  return (
    <div ref={comp} className="pt-8 pb-12 w-full max-w-5xl mx-auto anim-fade">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-on-surface">System Settings</h1>
        <p className="text-on-surface-variant mt-1 font-medium">Manage profile, clinic requests, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-12 gap-8 mt-8">

        {/* Left Side: Settings Nav Rail */}
        <div className="col-span-12 md:col-span-3 space-y-2">
          {navSections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-l-4 font-medium rounded-r-xl transition-colors ${activeSection === id
                ? 'bg-gradient-to-r from-primary/10 to-transparent border-l-primary text-primary font-bold'
                : 'text-slate-500 hover:bg-surface-container-lowest hover:text-slate-900 border-l-transparent'
                }`}
            >
              <Icon className="w-5 h-5" /> {label}
            </button>
          ))}
        </div>

        {/* Right Side: Options Surface */}
        <div className="col-span-12 md:col-span-9 space-y-8">
          {sectionContent[activeSection]}
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-slate-100">
        {renderLogoutButton()}
      </div>
    </div>
  );
};
