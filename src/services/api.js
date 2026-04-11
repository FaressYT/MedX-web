// Mock API service for MedX Core

const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const api = {
  auth: {
    login: async (credentials) => {
      await delay();
      if (credentials.email && credentials.password) {
         return { token: 'mock-jwt-token', user: { name: 'Dr. Sarah Jenkins', role: 'admin' } };
      }
      throw new Error('Invalid credentials');
    }
  },
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
    }
  },
  dashboard: {
    getStats: async () => {
      await delay();
      return {
        totalPatients: 1284,
        appointmentsToday: 24,
        revenueMTD: 45200,
        activeStaff: 18,
      }
    }
  },
  // Methods directly accessed by some screens
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
  }
};

export default api;
