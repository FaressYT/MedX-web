// ─────────────────────────────────────────────────────────────
// Mock API service for MedX Core
// Replace each method body with real fetch/axios calls when
// the backend is ready.  The signatures & return shapes are
// the contract the UI depends on.
// ─────────────────────────────────────────────────────────────

const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const api = {

  // ── Auth ──────────────────────────────────────────────────
  auth: {
    login: async (credentials) => {
      await delay();
      if (credentials.email && credentials.password) {
        return { token: 'mock-jwt-token', user: { name: 'Dr. Sarah Jenkins', role: 'admin' } };
      }
      throw new Error('Invalid credentials');
    },
  },

  // ── Dashboard ────────────────────────────────────────────
  dashboard: {
    getStats: async () => {
      await delay(300);
      return {
        totalPatients: 128,
        patientGrowth: '+12%',
        newAdmissions: 84,
        followUps: 44,
        cliniciansPresent: 24,
        cliniciansTotal: 30,
      };
    },
    getAppointmentsToday: async () => {
      await delay(300);
      return [
        { id: 'APT-1', time: '09:30 AM', patient: 'Eleanor Lewis', initials: 'EL', department: 'Cardiology', departmentColor: 'cyan', doctor: 'Dr. Sarah Vance', status: 'Confirmed', statusColor: 'tertiary' },
        { id: 'APT-2', time: '10:15 AM', patient: 'Julian Hayes', initials: 'JH', department: 'Pediatrics', departmentColor: 'amber', doctor: 'Dr. Marc Aris', status: 'Checked-in', statusColor: 'primary-fixed-dim' },
        { id: 'APT-3', time: '11:00 AM', patient: 'Rita Morales', initials: 'RM', department: 'Neurology', departmentColor: 'purple', doctor: 'Dr. Elena Kostic', status: 'Scheduled', statusColor: 'slate-300' },
        { id: 'APT-4', time: '1:00 PM', patient: 'Rita Morales', initials: 'RM', department: 'Neurology', departmentColor: 'purple', doctor: 'Dr. Elena Kostic', status: 'Scheduled', statusColor: 'slate-300' },
        { id: 'APT-5', time: '3:00 PM', patient: 'Rita Morales', initials: 'RM', department: 'Neurology', departmentColor: 'purple', doctor: 'Dr. Elena Kostic', status: 'Scheduled', statusColor: 'slate-300' },
        { id: 'APT-6', time: '4:00 PM', patient: 'Rita Morales', initials: 'RM', department: 'Neurology', departmentColor: 'purple', doctor: 'Dr. Elena Kostic', status: 'Scheduled', statusColor: 'slate-300' },

      ];
    },
    getDoctorsOnDuty: async () => {
      await delay(300);
      return [
        { id: 'doc-dm', name: 'Dr. David Miller', department: 'Orthopedics', status: 'available', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop' },
        { id: 'doc-sv', name: 'Dr. Sarah Vance', department: 'Cardiology', status: 'available', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop' },
        { id: 'doc-ma', name: 'Dr. Marc Aris', department: 'Pediatrics', status: 'in-surgery', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop' },
      ];
    },
    getDepartmentLoad: async () => {
      await delay(300);
      return {
        departments: [
          { name: 'Emergency Room', capacity: 85, color: 'error' },
          { name: 'Radiology', capacity: 40, color: 'tertiary' },
          { name: 'General Ward', capacity: 62, color: 'primary' },
        ],
        averageOccupancy: 68,
      };
    },
  },

  // ── Patients ─────────────────────────────────────────────
  patients: {
    getAll: async () => {
      await delay(200);
      return [
        { id: 'PT-1001', name: 'Eleanor Vance', age: 42, status: 'Active', nextAppointment: '2026-04-12T09:00:00Z', condition: 'Hypertension', doctor: 'Dr. Smith' },
        { id: 'PT-1002', name: 'Marcus Sterling', age: 28, status: 'Pending', nextAppointment: '2026-04-14T14:30:00Z', condition: 'Post-Op Knee', doctor: 'Dr. Jenkins' },
      ];
    },
    getById: async (id) => {
      await delay(200);
      return { id, name: 'Eleanor Vance', age: 42, status: 'Active', bloodType: 'O+', history: ['Asthma', 'Appendectomy (2015)'] };
    },
    create: async (patientData) => {
      await delay(400);
      if (!patientData?.firstName || !patientData?.lastName || !patientData?.birthdate) {
        throw new Error('First name, last name, and birthdate are required.');
      }
      return {
        id: `PT-${Date.now()}`,
        ...patientData,
      };
    },
  },

  // ── Departments ──────────────────────────────────────────
  departments: {
    getAll: async () => {
      await delay(300);
      return [
        { id: 'cardiology', name: 'Cardiology Center', location: 'Level 4, East Wing', specialistCount: 12, rating: 4.9, reviewCount: 1240, color: 'primary', icon: 'heart', pendingAdmissions: 24, capacity: 86 },
        { id: 'neurology', name: 'Neurology Department', location: 'Level 3, West Wing', specialistCount: 8, rating: 4.7, reviewCount: 890, color: 'purple', icon: 'brain', pendingAdmissions: 16, capacity: 72 },
        { id: 'pediatrics', name: 'Pediatrics Ward', location: 'Level 2, South Wing', specialistCount: 10, rating: 4.8, reviewCount: 1560, color: 'amber', icon: 'baby', pendingAdmissions: 31, capacity: 65 },
        { id: 'orthopedics', name: 'Orthopedics & Trauma', location: 'Level 1, North Wing', specialistCount: 9, rating: 4.6, reviewCount: 720, color: 'emerald', icon: 'bone', pendingAdmissions: 18, capacity: 78 },
        { id: 'radiology', name: 'Radiology & Imaging', location: 'Level B1, Central', specialistCount: 6, rating: 4.5, reviewCount: 430, color: 'cyan', icon: 'scan', pendingAdmissions: 8, capacity: 40 },
        { id: 'oncology', name: 'Oncology Institute', location: 'Level 5, East Wing', specialistCount: 11, rating: 4.9, reviewCount: 980, color: 'rose', icon: 'ribbon', pendingAdmissions: 22, capacity: 91 },
      ];
    },
    getById: async (id) => {
      await delay(300);
      const departments = {
        cardiology: {
          id: 'cardiology', name: 'Cardiology Center', location: 'Level 4, East Wing', specialistCount: 12, rating: 4.9, reviewCount: 1240, pendingAdmissions: 24, capacity: 86,
          specialists: [
            { id: 'doc-1', name: 'Dr. Julian Vane', role: 'Senior Electrophysiologist', rating: 5.0, status: 'available' },
            { id: 'doc-2', name: 'Dr. Sarah Jenkins', role: 'Interventional Cardiology', rating: 4.8, status: 'available' },
            { id: 'doc-3', name: 'Dr. Robert Chen', role: 'Pediatric Cardiologist', rating: 4.9, status: 'in-surgery' },
          ],
          schedule: [
            { time: '08:00 AM', slots: [{ day: 'mon', patient: 'Michael T.', type: 'ECG Screening', variant: 'primary' }, null, { day: 'wed', patient: 'Sarah G.', type: 'Follow-up', variant: 'tertiary' }, null, null] },
            { time: '10:00 AM', slots: [null, { day: 'tue', patient: 'Arthur P.', type: 'Pre-Op Consult', variant: 'highlight' }, null, { day: 'thu', patient: 'Linda Wu', type: 'Stress Test', variant: 'primary' }, null] },
            { time: '12:00 PM', slots: 'break' },
            { time: '02:00 PM', slots: [null, { day: 'tue', patient: 'Janice R.', type: 'Echo Scan', variant: 'tertiary' }, { day: 'wed', patient: 'David Kim', type: 'Initial Eval', variant: 'primary' }, null, { day: 'fri', patient: 'Robert S.', type: 'Check-up', variant: 'primary' }] },
          ],
          patients: [
            { id: 'CRT-9021', name: 'Benjamin Parker', doctor: 'Dr. Vane', condition: 'Atrial Fibrillation', risk: 'high', status: 'Stable' },
            { id: 'CRT-8842', name: 'Miriam Stone', doctor: 'Dr. Jenkins', condition: 'Hypertension', risk: 'moderate', status: 'Monitoring' },
          ],
          reviews: [
            { id: 'REV-C01', patientName: 'Michael Torres', date: '2026-04-12', rating: 5, text: 'The staff was incredibly attentive during my ECG screening. Dr. Vane explained everything clearly.', doctor: 'Dr. Julian Vane', appointmentId: 'APT-C101' },
            { id: 'REV-C02', patientName: 'Sarah Greenfield', date: '2026-04-07', rating: 4, text: 'Very professional environment. Short wait times for follow-up appointments.', doctor: 'Dr. Sarah Jenkins', appointmentId: 'APT-C102' },
            { id: 'REV-C03', patientName: 'Arthur Pemberton', date: '2026-04-03', rating: 5, text: 'Dr. Jenkins took the time to explain my options thoroughly. Highly recommend this department.', doctor: 'Dr. Sarah Jenkins', appointmentId: 'APT-C103' },
            { id: 'REV-C04', patientName: 'Linda Wu', date: '2026-03-28', rating: 4, text: 'Great facilities and caring staff. The stress test was handled smoothly.', doctor: 'Dr. Robert Chen', appointmentId: 'APT-C104' },
            { id: 'REV-C05', patientName: 'David Kim', date: '2026-03-22', rating: 5, text: 'World-class cardiac care. Dr. Vane is exceptional at what he does.', doctor: 'Dr. Julian Vane', appointmentId: 'APT-C105' },
          ],
        },
        neurology: {
          id: 'neurology', name: 'Neurology Department', location: 'Level 3, West Wing', specialistCount: 8, rating: 4.7, reviewCount: 890, pendingAdmissions: 16, capacity: 72,
          specialists: [
            { id: 'doc-4', name: 'Dr. Elena Kostic', role: 'Neuro-Oncologist', rating: 4.9, status: 'available' },
            { id: 'doc-5', name: 'Dr. Aman Patel', role: 'Epileptologist', rating: 4.7, status: 'available' },
          ],
          schedule: [
            { time: '09:00 AM', slots: [{ day: 'mon', patient: 'Rita M.', type: 'MRI Review', variant: 'primary' }, null, null, { day: 'thu', patient: 'Kevin L.', type: 'EEG', variant: 'tertiary' }, null] },
            { time: '11:00 AM', slots: [null, { day: 'tue', patient: 'Anna B.', type: 'Consult', variant: 'highlight' }, null, null, { day: 'fri', patient: 'Tom H.', type: 'Follow-up', variant: 'primary' }] },
            { time: '12:00 PM', slots: 'break' },
            { time: '02:00 PM', slots: [{ day: 'mon', patient: 'Lisa K.', type: 'Nerve Study', variant: 'tertiary' }, null, { day: 'wed', patient: 'James P.', type: 'Review', variant: 'primary' }, null, null] },
          ],
          patients: [
            { id: 'NRL-4401', name: 'Rita Morales', doctor: 'Dr. Kostic', condition: 'Migraine Disorder', risk: 'moderate', status: 'Active' },
            { id: 'NRL-4390', name: 'Kevin Liu', doctor: 'Dr. Patel', condition: 'Epilepsy', risk: 'high', status: 'Monitoring' },
          ],
          reviews: [
            { id: 'REV-N01', patientName: 'Rita Morales', date: '2026-04-11', rating: 5, text: 'Dr. Kostic is extremely thorough. I feel I\'m in the best hands.', doctor: 'Dr. Elena Kostic', appointmentId: 'APT-N201' },
            { id: 'REV-N02', patientName: 'Kevin Liu', date: '2026-04-05', rating: 4, text: 'The EEG procedure was quick and well-explained. Excellent follow-up care.', doctor: 'Dr. Aman Patel', appointmentId: 'APT-N202' },
            { id: 'REV-N03', patientName: 'Anna Bryce', date: '2026-03-30', rating: 5, text: 'Compassionate and highly skilled team. Dr. Patel really listens.', doctor: 'Dr. Aman Patel', appointmentId: 'APT-N203' },
          ],
        },
        pediatrics: {
          id: 'pediatrics', name: 'Pediatrics Ward', location: 'Level 2, South Wing', specialistCount: 10, rating: 4.8, reviewCount: 1560, pendingAdmissions: 31, capacity: 65,
          specialists: [
            { id: 'doc-6', name: 'Dr. Marc Aris', role: 'General Pediatrics', rating: 4.8, status: 'in-surgery' },
            { id: 'doc-7', name: 'Dr. Laura Kim', role: 'Neonatologist', rating: 4.9, status: 'available' },
          ],
          schedule: [
            { time: '08:30 AM', slots: [{ day: 'mon', patient: 'Julian H.', type: 'Vaccination', variant: 'primary' }, null, { day: 'wed', patient: 'Mia S.', type: 'Check-up', variant: 'tertiary' }, null, null] },
            { time: '10:30 AM', slots: [null, { day: 'tue', patient: 'Leo B.', type: 'Growth Review', variant: 'highlight' }, null, { day: 'thu', patient: 'Zoe T.', type: 'Allergy Test', variant: 'primary' }, null] },
            { time: '12:00 PM', slots: 'break' },
            { time: '01:30 PM', slots: [null, null, { day: 'wed', patient: 'Sam W.', type: 'Ear Exam', variant: 'primary' }, null, { day: 'fri', patient: 'Ava L.', type: 'Follow-up', variant: 'tertiary' }] },
          ],
          patients: [
            { id: 'PED-2201', name: 'Julian Hayes', doctor: 'Dr. Aris', condition: 'Asthma', risk: 'low', status: 'Active' },
            { id: 'PED-2198', name: 'Mia Sanders', doctor: 'Dr. Kim', condition: 'Routine Wellness', risk: 'low', status: 'Scheduled' },
          ],
          reviews: [
            { id: 'REV-P01', patientName: 'Julian Hayes (parent)', date: '2026-04-13', rating: 5, text: 'The entire ward is so welcoming for kids. Dr. Aris is amazing with children.', doctor: 'Dr. Marc Aris', appointmentId: 'APT-P301' },
            { id: 'REV-P02', patientName: 'Mia Sanders (parent)', date: '2026-04-08', rating: 5, text: 'Very gentle approach with our daughter. Dr. Kim made us feel at ease.', doctor: 'Dr. Laura Kim', appointmentId: 'APT-P302' },
            { id: 'REV-P03', patientName: 'Leo Benton (parent)', date: '2026-04-01', rating: 4, text: 'Good overall experience. The growth review was thorough and reassuring.', doctor: 'Dr. Marc Aris', appointmentId: 'APT-P303' },
          ],
        },
        orthopedics: {
          id: 'orthopedics', name: 'Orthopedics & Trauma', location: 'Level 1, North Wing', specialistCount: 9, rating: 4.6, reviewCount: 720, pendingAdmissions: 18, capacity: 78,
          specialists: [
            { id: 'doc-8', name: 'Dr. David Miller', role: 'Spine Surgeon', rating: 4.7, status: 'available' },
            { id: 'doc-9', name: 'Dr. Nina Park', role: 'Sports Medicine', rating: 4.6, status: 'available' },
          ],
          schedule: [
            { time: '08:00 AM', slots: [{ day: 'mon', patient: 'Marcus S.', type: 'Post-Op', variant: 'primary' }, null, null, { day: 'thu', patient: 'Clara J.', type: 'X-Ray Review', variant: 'tertiary' }, null] },
            { time: '10:00 AM', slots: [null, { day: 'tue', patient: 'Dan R.', type: 'Knee Consult', variant: 'highlight' }, { day: 'wed', patient: 'Sara P.', type: 'Physio Eval', variant: 'primary' }, null, null] },
            { time: '12:00 PM', slots: 'break' },
            { time: '02:00 PM', slots: [null, null, null, { day: 'thu', patient: 'Alex M.', type: 'Cast Removal', variant: 'primary' }, { day: 'fri', patient: 'Beth K.', type: 'Follow-up', variant: 'tertiary' }] },
          ],
          patients: [
            { id: 'ORT-3301', name: 'Marcus Sterling', doctor: 'Dr. Miller', condition: 'Lumbar Disc Herniation', risk: 'moderate', status: 'Post-Op' },
          ],
          reviews: [
            { id: 'REV-O01', patientName: 'Marcus Sterling', date: '2026-04-09', rating: 4, text: 'Recovery has been smooth thanks to the excellent surgical team.', doctor: 'Dr. David Miller', appointmentId: 'APT-O401' },
            { id: 'REV-O02', patientName: 'Clara Jensen', date: '2026-04-02', rating: 5, text: 'Dr. Park\'s sports medicine expertise is outstanding. Back to training in weeks.', doctor: 'Dr. Nina Park', appointmentId: 'APT-O402' },
          ],
        },
        radiology: {
          id: 'radiology', name: 'Radiology & Imaging', location: 'Level B1, Central', specialistCount: 6, rating: 4.5, reviewCount: 430, pendingAdmissions: 8, capacity: 40,
          specialists: [
            { id: 'doc-10', name: 'Dr. Thomas Hale', role: 'Diagnostic Radiologist', rating: 4.5, status: 'available' },
          ],
          schedule: [
            { time: '08:00 AM', slots: [{ day: 'mon', patient: 'Patient A', type: 'CT Scan', variant: 'primary' }, null, { day: 'wed', patient: 'Patient B', type: 'MRI', variant: 'tertiary' }, null, null] },
            { time: '10:00 AM', slots: [null, { day: 'tue', patient: 'Patient C', type: 'X-Ray', variant: 'highlight' }, null, null, { day: 'fri', patient: 'Patient D', type: 'Ultrasound', variant: 'primary' }] },
            { time: '12:00 PM', slots: 'break' },
            { time: '02:00 PM', slots: [null, null, { day: 'wed', patient: 'Patient E', type: 'PET Scan', variant: 'tertiary' }, null, null] },
          ],
          patients: [],
          reviews: [],
        },
        oncology: {
          id: 'oncology', name: 'Oncology Institute', location: 'Level 5, East Wing', specialistCount: 11, rating: 4.9, reviewCount: 980, pendingAdmissions: 22, capacity: 91,
          specialists: [
            { id: 'doc-11', name: 'Dr. Grace Lim', role: 'Medical Oncologist', rating: 5.0, status: 'available' },
            { id: 'doc-12', name: 'Dr. Peter Osei', role: 'Radiation Oncologist', rating: 4.8, status: 'available' },
          ],
          schedule: [
            { time: '09:00 AM', slots: [{ day: 'mon', patient: 'Carol W.', type: 'Chemo Review', variant: 'primary' }, null, null, { day: 'thu', patient: 'Frank D.', type: 'Consult', variant: 'tertiary' }, null] },
            { time: '11:00 AM', slots: [null, { day: 'tue', patient: 'Diana P.', type: 'Treatment', variant: 'highlight' }, null, null, { day: 'fri', patient: 'George L.', type: 'Follow-up', variant: 'primary' }] },
            { time: '12:00 PM', slots: 'break' },
            { time: '02:00 PM', slots: [null, null, { day: 'wed', patient: 'Helen M.', type: 'Biopsy Review', variant: 'primary' }, null, null] },
          ],
          patients: [
            { id: 'ONC-5501', name: 'Carol Williams', doctor: 'Dr. Lim', condition: 'Breast Cancer Stage II', risk: 'high', status: 'In Treatment' },
          ],
          reviews: [
            { id: 'REV-ON01', patientName: 'Carol Williams', date: '2026-04-10', rating: 5, text: 'Dr. Lim treats you like family. The entire oncology team is outstanding.', doctor: 'Dr. Grace Lim', appointmentId: 'APT-ON501' },
            { id: 'REV-ON02', patientName: 'Frank Dobson', date: '2026-04-04', rating: 5, text: 'Incredibly supportive through a very difficult time. Dr. Osei is a true professional.', doctor: 'Dr. Peter Osei', appointmentId: 'APT-ON502' },
            { id: 'REV-ON03', patientName: 'Diana Patel', date: '2026-03-29', rating: 4, text: 'Treatment plan was clearly explained. The team goes above and beyond.', doctor: 'Dr. Grace Lim', appointmentId: 'APT-ON503' },
          ],
        },
      };
      return departments[id] || departments.cardiology;
    },
  },

  // ── Appointments ─────────────────────────────────────────
  appointments: {
    getAll: async () => {
      await delay(300);
      const toIsoDate = (dateObj) => {
        const local = new Date(dateObj);
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
        return local.toISOString().slice(0, 10);
      };

      const today = new Date();
      const mondayOffset = (today.getDay() + 6) % 7; // Monday=0
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - mondayOffset);
      weekStart.setHours(0, 0, 0, 0);

      const makeDate = (dayIndex) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + dayIndex);
        return toIsoDate(date);
      };

      const weeklyAppointments = [
        { patient: 'Eleanor Lewis', type: 'Cardiology', time: '09:30 AM', doctor: 'Dr. Sarah Vance', status: 'Confirmed', dayIndex: 0 },
        { patient: 'Julian Hayes', type: 'Pediatrics', time: '10:15 AM', doctor: 'Dr. Marc Aris', status: 'Checked-in', dayIndex: 0 },
        { patient: 'Mia Stone', type: 'Radiology', time: '11:00 AM', doctor: 'Dr. Thomas Hale', status: 'Scheduled', dayIndex: 1 },
        { patient: 'Rita Morales', type: 'Neurology', time: '01:00 PM', doctor: 'Dr. Elena Kostic', status: 'Scheduled', dayIndex: 2 },
        { patient: 'Carla Nguyen', type: 'General', time: '09:00 AM', doctor: 'Dr. Sarah Jenkins', status: 'Confirmed', dayIndex: 3 },
        { patient: 'Omar Haddad', type: 'Orthopedics', time: '02:30 PM', doctor: 'Dr. David Miller', status: 'Checked-in', dayIndex: 3 },
        { patient: 'Layla Thomas', type: 'Pediatrics', time: '11:30 AM', doctor: 'Dr. Marc Aris', status: 'Scheduled', dayIndex: 4 },
        { patient: 'Nora Elsen', type: 'Cardiology', time: '03:15 PM', doctor: 'Dr. Sarah Vance', status: 'Confirmed', dayIndex: 5 },
        { patient: 'Adam Perez', type: 'Neurology', time: '10:00 AM', doctor: 'Dr. Elena Kostic', status: 'Scheduled', dayIndex: 6 },
      ];

      return weeklyAppointments.map((appointment, index) => ({
        id: `APT-${index + 1}`,
        patient: appointment.patient,
        type: appointment.type,
        time: appointment.time,
        doctor: appointment.doctor,
        status: appointment.status,
        date: makeDate(appointment.dayIndex),
      }));
    },
    create: async (appointmentData) => {
      await delay(500);
      return { id: 'APT-' + Date.now(), ...appointmentData, status: 'Scheduled' };
    },
    getAvailableSlots: async (date, departmentId) => {
      await delay(200);
      const baseSlots = ['08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:15 AM', '11:00 AM', '11:30 AM', '12:15 PM', '01:00 PM', '01:45 PM', '02:30 PM', '03:15 PM', '04:00 PM'];
      const seedSource = `${date || ''}-${departmentId || ''}`;
      const seed = seedSource.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const count = 4 + (seed % 7); // 4-10 slots
      const start = seed % Math.max(1, baseSlots.length - count + 1);
      return baseSlots.slice(start, start + count);
    },
    getDepartmentOptions: async () => {
      await delay(200);
      return [
        { id: 'cardiology', name: 'Cardiology Center' },
        { id: 'neurology', name: 'Neurology Dept' },
        { id: 'pediatrics', name: 'Pediatrics' },
        { id: 'general', name: 'General Practice' },
      ];
    },
    getPractitionerOptions: async (departmentId) => {
      await delay(200);
      return [
        { id: 'doc-sj', name: 'Dr. Sarah Jenkins' },
        { id: 'doc-ma', name: 'Dr. Michael Aris' },
        { id: 'doc-ko', name: "NP. Kevin O'Brien" },
      ];
    },
    searchPatient: async (query) => {
      await delay(200);
      return {
        id: 'PX-88291',
        name: 'Elena Rodriguez-Chen',
        dob: '14 May 1985',
        initials: 'E',
        verified: true,
      };
    },
    getInsurance: async (patientId) => {
      await delay(200);
      return {
        carrier: 'BlueCross Shield PPO',
        policyNumber: '#9001-22-AX',
        coverageActive: true,
      };
    },
  },

  // ── Records ──────────────────────────────────────────────
  records: {
    getAll: async () => {
      await delay(300);
      return [
        { id: 'REC-001', docTitle: 'Cardiology Assessment Report', patient: 'Eleanor Vance', date: '12 Apr 2026', size: '2.4 MB' },
        { id: 'REC-002', docTitle: 'MRI Scan Results — Lumbar', patient: 'Marcus Sterling', date: '10 Apr 2026', size: '18.1 MB' },
        { id: 'REC-003', docTitle: 'Post-Op Recovery Notes', patient: 'John Montague', date: '08 Apr 2026', size: '540 KB' },
        { id: 'REC-004', docTitle: 'Prenatal Ultrasound — Week 22', patient: 'Sarah Connor', date: '07 Apr 2026', size: '12.3 MB' },
        { id: 'REC-005', docTitle: 'Blood Work Panel — Full CBC', patient: 'Rita Morales', date: '05 Apr 2026', size: '320 KB' },
      ];
    },
    getById: async (id) => {
      await delay(200);
      return { id, docTitle: 'Cardiology Assessment Report', patient: 'Eleanor Vance', date: '12 Apr 2026', size: '2.4 MB', content: 'Full document content...' };
    },
  },

  // ── Financials ───────────────────────────────────────────
  financials: {
    getSummary: async () => {
      await delay(300);
      return {
        totalRevenue: '$412,890',
        revenueGrowth: '12%',
        operatingMargin: '28.4%',
        marginGrowth: '5.2%',
        projectedSurplus: '$84,200',
      };
    },
    getMonthlyRevenue: async () => {
      await delay(300);
      return [
        { month: 'Jan', value: 42000, percent: 40 },
        { month: 'Feb', value: 63000, percent: 60 },
        { month: 'Mar', value: 47000, percent: 45 },
        { month: 'Apr', value: 79000, percent: 75 },
        { month: 'May', value: 58000, percent: 55 },
        { month: 'Jun', value: 95000, percent: 90 },
      ];
    },
    getPatientInflow: async () => {
      await delay(300);
      return {
        newPatients: { count: 240, percent: 75 },
        returning: { count: 1102, percent: 90 },
      };
    },
    getAlert: async () => {
      await delay(200);
      return {
        title: 'Action Required',
        message: 'Pharmacy inventory cost up by 14%',
      };
    },
    getDepartmentBreakdown: async () => {
      await delay(300);
      return [
        { department: 'Cardiology', dotColor: 'primary', grossRevenue: '$124,500', operationalCost: '$48,200', netProfit: '$76,300', netProfitColor: 'tertiary', utilization: 'OPTIMAL', utilizationStyle: 'success' },
        { department: 'Radiology', dotColor: 'tertiary', grossRevenue: '$98,000', operationalCost: '$62,100', netProfit: '$35,900', netProfitColor: 'tertiary', utilization: 'STEADY', utilizationStyle: 'neutral' },
        { department: 'General Surgery', dotColor: 'indigo-500', grossRevenue: '$205,000', operationalCost: '$112,000', netProfit: '$93,000', netProfitColor: 'tertiary', utilization: 'HIGH', utilizationStyle: 'success' },
        { department: 'Pediatrics', dotColor: 'rose-400', grossRevenue: '$45,390', operationalCost: '$48,000', netProfit: '($2,610)', netProfitColor: 'error', utilization: 'LOW', utilizationStyle: 'error' },
      ];
    },
  },

  // ── Settings ─────────────────────────────────────────────
  settings: {
    getProfile: async () => {
      await delay(300);
      return {
        fullName: 'Dr. Julian Vance',
        designation: 'System Lead / Administrator',
        email: 'j.vance@medxcore.hospital',
      };
    },
    updateProfile: async (profileData) => {
      await delay(500);
      return { success: true, ...profileData };
    },
    submitClinicNameChange: async ({ currentName, requestedName, reason, attachment }) => {
      await delay(700);
      if (!requestedName || !attachment) {
        throw new Error('Requested clinic name and supporting attachment are required.');
      }
      return {
        success: true,
        ticketId: `CLN-${Math.floor(10000 + Math.random() * 90000)}`,
        currentName,
        requestedName,
        reason,
        attachmentName: attachment.name,
      };
    },
    requestPasswordChange: async ({ currentPassword, newPassword, confirmPassword, reason }) => {
      await delay(600);
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error('All password fields are required.');
      }
      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirm password do not match.');
      }
      return {
        success: true,
        ticketId: `PWD-${Math.floor(10000 + Math.random() * 90000)}`,
        reason: reason || '',
      };
    },
    getSecurity: async () => {
      await delay(200);
      return {
        mfaEnabled: true,
        mfaMethod: 'Authenticator App',
        mfaProvider: 'Google Auth',
      };
    },
    toggleMfa: async (enabled) => {
      await delay(500);
      return { mfaEnabled: enabled };
    },
  },

  // ── Legacy flat methods (kept for backwards-compat) ──────
  // TODO: migrate remaining consumers, then remove
  getPatients: async () => {
    await delay(300);
    return [
      { id: 'PT-1001', name: 'Eleanor Vance', age: 42, status: 'Active', condition: 'Hypertension', doctor: 'Dr. Smith' },
      { id: 'PT-1002', name: 'Marcus Sterling', age: 28, status: 'Pending', condition: 'Post-Op Knee', doctor: 'Dr. Jenkins' },
      { id: 'PT-1003', name: 'John Montague', age: 55, status: 'Discharged', condition: 'Routine Checkup', doctor: 'Dr. Smith' },
      { id: 'PT-1004', name: 'Sarah Connor', age: 33, status: 'Active', condition: 'Prenatal Care', doctor: 'Dr. Lee' },
    ];
  },
  getAppointments: async () => {
    await delay(300);
    return [
      { id: 'APT-1', patient: 'Eleanor Lewis', type: 'Cardiology', time: '09:30 AM', doctor: 'Dr. Sarah Vance', status: 'Confirmed' },
      { id: 'APT-2', patient: 'Julian Hayes', type: 'Pediatrics', time: '10:15 AM', doctor: 'Dr. Marc Aris', status: 'Checked-in' },
      { id: 'APT-3', patient: 'Rita Morales', type: 'Neurology', time: '11:00 AM', doctor: 'Dr. Elena Kostic', status: 'Scheduled' },
    ];
  },
  getRecords: async () => {
    await delay(300);
    return [
      { id: 'REC-001', docTitle: 'Cardiology Assessment Report', patient: 'Eleanor Vance', date: '12 Apr 2026', size: '2.4 MB' },
      { id: 'REC-002', docTitle: 'MRI Scan Results — Lumbar', patient: 'Marcus Sterling', date: '10 Apr 2026', size: '18.1 MB' },
      { id: 'REC-003', docTitle: 'Post-Op Recovery Notes', patient: 'John Montague', date: '08 Apr 2026', size: '540 KB' },
      { id: 'REC-004', docTitle: 'Prenatal Ultrasound — Week 22', patient: 'Sarah Connor', date: '07 Apr 2026', size: '12.3 MB' },
      { id: 'REC-005', docTitle: 'Blood Work Panel — Full CBC', patient: 'Rita Morales', date: '05 Apr 2026', size: '320 KB' },
    ];
  },
};

export default api;
