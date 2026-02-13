export type AgeRange = '12-17' | '18-25' | '26-35' | '36-45' | '46+';
export type Gender = 'Male' | 'Female' | 'Prefer not to say';
export type Role = 'Attendee' | 'Executive' | 'Guest Minister';

export interface RegistrationFormData {
  full_name: string;
  phone_number: string;
  email?: string;
  age_range: AgeRange;
  gender?: Gender;
  first_time_attendee: boolean;
  role: Role;
  executive_department?: string;
  area_residence?: string;
}

export interface Registration extends RegistrationFormData {
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
}