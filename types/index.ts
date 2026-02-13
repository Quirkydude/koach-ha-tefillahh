export type AgeRange = '12-17' | '18-25' | '26-35' | '36+';
export type Gender = 'Male' | 'Female';
export type StudentOrWorker = 'Student' | 'Worker';

export interface RegistrationFormData {
  full_name: string;
  phone_number: string;
  email?: string;
  age_range: AgeRange;
  gender: Gender;
  area_residence: string;
  medical_condition?: string;
  student_or_worker: StudentOrWorker;
  occupation?: string;
  will_sleep: boolean;
  days_attending: string[];
  emergency_contact_name: string;
  emergency_contact_phone: string;
  dietary_restrictions?: string;
  consent: boolean;
}

export interface Registration extends Omit<RegistrationFormData, 'consent'> {
  id: string;
  registration_number: string;
  sms_sent: boolean;
  created_at: string;
}

export interface RegistrationResponse {
  success: boolean;
  registration_number?: string;
  message: string;
  data?: Registration;
  sms_sent?: boolean;
}