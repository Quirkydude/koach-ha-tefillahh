export type AgeRange = '12-17' | '18-25' | '26-35' | '36+';
export type Gender = 'Male' | 'Female';
export type StudentOrWorker = 'Student' | 'Worker';
export type Role = 'Attendee' | 'Volunteer' | 'Media Team';

export interface Registration {
  id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  age_range: AgeRange;
  gender: Gender;
  area_residence: string;
  medical_condition: string | null;
  student_or_worker: StudentOrWorker;
  occupation: string | null;
  will_sleep: boolean;
  days_attending: string[]; // ['day1', 'day2', 'day3', 'day4', 'day5']
  role: Role;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  dietary_restrictions: string | null;
  registration_number: string;
  sms_sent: boolean;
  created_at: string;
}

export interface Stats {
  total: number;
  today: number;
  byGender: { Male: number; Female: number };
  byAge: Record<AgeRange, number>;
  byRole: Record<Role, number>;
  byDay: Record<string, number>;
  sleepingOver: number;
  byArea: Record<string, number>;
  withMedicalConditions: number;
  withDietaryRestrictions: number;
  studentWorkerRatio: { Student: number; Worker: number };
}

export const DAYS_MAP = {
  'day1': 'Day 1 (Feb 18)',
  'day2': 'Day 2 (Feb 19)',
  'day3': 'Day 3 (Feb 20)',
  'day4': 'Day 4 (Feb 21)',
  'day5': 'Day 5 (Feb 22)',
} as const;