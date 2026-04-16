export const buildIdMap = (items = []) => Object.fromEntries(items.map((item) => [String(item.id), item]));

export const getFullName = (firstName = '', lastName = '') => `${firstName} ${lastName}`.trim();

export const getNameInitials = (name = '') => {
  const initials = String(name)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return initials || 'NA';
};

export const extractTimestampDate = (timestamp = '') => String(timestamp).slice(0, 10);

export const extractTimestampClock = (timestamp = '') => {
  const match = String(timestamp).match(/T(\d{2}):(\d{2})/);
  if (!match) return null;
  return { hours: Number(match[1]), minutes: Number(match[2]) };
};

export const parseTimestampTimeToMinutes = (timestamp = '') => {
  const clock = extractTimestampClock(timestamp);
  if (!clock) return Number.NaN;
  return (clock.hours * 60) + clock.minutes;
};

export const formatTimestampTime = (timestamp = '') => {
  const clock = extractTimestampClock(timestamp);
  if (!clock) return 'Unknown';

  const period = clock.hours >= 12 ? 'PM' : 'AM';
  const hours = clock.hours % 12 || 12;
  const minutes = String(clock.minutes).padStart(2, '0');

  return `${hours}:${minutes} ${period}`;
};

export const createDateTimestamp = (dateValue) => `${dateValue}T00:00:00`;

export const createTimeTimestamp = (timeLabel) => {
  const match = String(timeLabel || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) {
    throw new Error('Invalid appointment time.');
  }

  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM') {
    hours += 12;
  }

  return `1970-01-01T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
};

export const getAppointmentDisplay = (appointment, lookups) => {
  const user = lookups?.usersById?.[String(appointment.user_id)];
  const doctor = lookups?.doctorsById?.[String(appointment.doctor_id)];
  const department = lookups?.departmentsById?.[String(appointment.dep_id)];

  const patientName = user
    ? getFullName(user.first_name, user.last_name)
    : `User #${appointment.user_id}`;

  return {
    patientName,
    patientInitials: getNameInitials(patientName),
    doctorName: doctor?.name || `Doctor #${appointment.doctor_id}`,
    departmentName: department?.name || `Department #${appointment.dep_id}`,
    dateValue: extractTimestampDate(appointment.date),
    timeLabel: formatTimestampTime(appointment.time),
    userNotesPreview: appointment.user_notes || 'No patient notes',
  };
};
