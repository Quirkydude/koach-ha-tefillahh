'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, CheckCircle2, User, Phone, Mail, Calendar, Users, MapPin, Briefcase, AlertCircle, HeartPulse, Utensils } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// Validation Schema
const registrationSchema = z.object({
  full_name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  phone_number: z.string().regex(/^0[0-9]{9}$/, 'Please enter a valid Ghana phone number (e.g., 0241234567)'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  age_range: z.enum(['12-17', '18-25', '26-35', '36+']),
  gender: z.enum(['Male', 'Female']),
  area_residence: z.string().min(2, 'Please enter where you stay').max(100),
  medical_condition: z.string().max(500).optional().or(z.literal('')),
  student_or_worker: z.enum(['Student', 'Worker']),
  occupation: z.string().max(100).optional().or(z.literal('')),
  will_sleep: z.boolean(),
  days_attending: z.array(z.string()).min(1, 'Please select at least one day'),
  emergency_contact_name: z.string().min(3, 'Emergency contact name is required').max(100),
  emergency_contact_phone: z.string().regex(/^0[0-9]{9}$/, 'Please enter a valid Ghana phone number'),
  dietary_restrictions: z.string().max(200).optional().or(z.literal('')),
  consent: z.boolean().refine((val) => val === true, 'You must agree to receive updates'),
});

type FormData = z.infer<typeof registrationSchema>;

const DAYS = [
  { value: 'day1', label: 'Day 1 - Feb 18' },
  { value: 'day2', label: 'Day 2 - Feb 19' },
  { value: 'day3', label: 'Day 3 - Feb 20' },
  { value: 'day4', label: 'Day 4 - Feb 21' },
  { value: 'day5', label: 'Day 5 - Feb 22' },
];

export default function RegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      will_sleep: false,
      days_attending: [],
      consent: false,
      student_or_worker: 'Student',
    },
  });

  const watchStudentOrWorker = watch('student_or_worker');
  const watchWillSleep = watch('will_sleep');
  const watchDaysAttending = watch('days_attending');
  const watchGender = watch('gender');

  // Toggle day selection
  const toggleDay = (day: string) => {
    const current = watchDaysAttending || [];
    if (current.includes(day)) {
      setValue('days_attending', current.filter(d => d !== day));
    } else {
      setValue('days_attending', [...current, day]);
    }
  };

  // Select all days
  const selectAllDays = () => {
    setValue('days_attending', DAYS.map(d => d.value));
  };

  // Form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Registration successful! 🎉');
        
        setTimeout(() => {
          router.push(`/thank-you?reg=${result.registration_number}&name=${encodeURIComponent(data.full_name)}`);
        }, 1000);
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Something went wrong. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <>
      <Toaster position="top-center" />
      
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background py-8 px-4 sm:py-12 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
              Register for the Conference
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Koach Ha-Tefillah Prayer Conference 2026
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-xs sm:text-sm font-medium text-primary">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-border"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {/* STEP 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                        Personal Information
                      </h2>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Let us know who you are
                      </p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="flex items-center gap-2 text-sm sm:text-base">
                        <User className="w-4 h-4 text-primary flex-shrink-0" />
                        Full Name *
                      </Label>
                      <Input
                        id="full_name"
                        placeholder="e.g., John Mensah"
                        {...register('full_name')}
                        className={cn("h-12 text-base", errors.full_name && "border-red-500")}
                      />
                      {errors.full_name && (
                        <p className="text-sm text-red-500">⚠️ {errors.full_name.message}</p>
                      )}
                      {!errors.full_name && watch('full_name')?.length >= 3 && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Looking good!
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label htmlFor="phone_number" className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        placeholder="e.g., 0241234567"
                        {...register('phone_number')}
                        className={cn("h-12 text-base", errors.phone_number && "border-red-500")}
                      />
                      <p className="text-xs text-muted-foreground">
                        We'll send your confirmation via SMS
                      </p>
                      {errors.phone_number && (
                        <p className="text-sm text-red-500">⚠️ {errors.phone_number.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email Address (optional)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g., john@example.com"
                        {...register('email')}
                        className="h-12 text-base"
                      />
                    </div>

                    {/* Age Range */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Age Range *
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {['12-17', '18-25', '26-35', '36+'].map((age) => (
                          <motion.button
                            key={age}
                            type="button"
                            onClick={() => setValue('age_range', age as any)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "p-3 rounded-xl border-2 transition-all text-center",
                              watch('age_range') === age
                                ? "border-primary bg-primary/5 text-primary font-semibold"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {age} years
                          </motion.button>
                        ))}
                      </div>
                      {errors.age_range && (
                        <p className="text-sm text-red-500">⚠️ Please select your age range</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Gender *
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          type="button"
                          onClick={() => setValue('gender', 'Male')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all",
                            watchGender === 'Male'
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">👨</div>
                            <div className="font-semibold">Male</div>
                          </div>
                        </motion.button>

                        <motion.button
                          type="button"
                          onClick={() => setValue('gender', 'Female')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all",
                            watchGender === 'Female'
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">👩</div>
                            <div className="font-semibold">Female</div>
                          </div>
                        </motion.button>
                      </div>
                      {errors.gender && (
                        <p className="text-sm text-red-500">⚠️ Please select your gender</p>
                      )}
                    </div>

                    {/* Where you stay */}
                    <div className="space-y-2">
                      <Label htmlFor="area_residence" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Where do you stay? *
                      </Label>
                      <Input
                        id="area_residence"
                        placeholder="e.g., Accra, Tema, Kumasi"
                        {...register('area_residence')}
                        className={cn("h-12 text-base", errors.area_residence && "border-red-500")}
                      />
                      {errors.area_residence && (
                        <p className="text-sm text-red-500">⚠️ {errors.area_residence.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Logistics & Attendance */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Logistics & Attendance
                      </h2>
                      <p className="text-muted-foreground">
                        Help us plan for your stay
                      </p>
                    </div>

                    {/* Student or Worker */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        Are you a Student or Worker? *
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Student', 'Worker'].map((type) => (
                          <motion.button
                            key={type}
                            type="button"
                            onClick={() => setValue('student_or_worker', type as any)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all",
                              watchStudentOrWorker === type
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{type === 'Student' ? '📚' : '💼'}</div>
                              <div className="font-semibold">{type}</div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Occupation (if Worker) */}
                    <AnimatePresence>
                      {watchStudentOrWorker === 'Worker' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Label htmlFor="occupation">
                            What do you do? *
                          </Label>
                          <Input
                            id="occupation"
                            placeholder="e.g., Teacher, Nurse, Engineer"
                            {...register('occupation')}
                            className="h-12 text-base"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Will Sleep */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        Will you sleep at the venue? *
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          type="button"
                          onClick={() => setValue('will_sleep', true)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all",
                            watchWillSleep === true
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">🛏️</div>
                            <div className="font-semibold">Yes, I'll sleep</div>
                          </div>
                        </motion.button>

                        <motion.button
                          type="button"
                          onClick={() => setValue('will_sleep', false)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "p-4 rounded-xl border-2 transition-all",
                            watchWillSleep === false
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">🚶</div>
                            <div className="font-semibold">No, I'll leave daily</div>
                          </div>
                        </motion.button>
                      </div>
                    </div>

                    {/* Days Attending */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Which days will you attend? *
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={selectAllDays}
                          className="text-xs"
                        >
                          Select All
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {DAYS.map((day) => (
                          <motion.button
                            key={day.value}
                            type="button"
                            onClick={() => toggleDay(day.value)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={cn(
                              "p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between",
                              watchDaysAttending?.includes(day.value)
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <span className="font-medium">{day.label}</span>
                            {watchDaysAttending?.includes(day.value) && (
                              <CheckCircle2 className="w-5 h-5" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                      {errors.days_attending && (
                        <p className="text-sm text-red-500">⚠️ {errors.days_attending.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Health & Emergency */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Health & Emergency Contact
                      </h2>
                      <p className="text-muted-foreground">
                        For your safety and well-being
                      </p>
                    </div>

                    {/* Medical Condition */}
                    <div className="space-y-2">
                      <Label htmlFor="medical_condition" className="flex items-center gap-2">
                        <HeartPulse className="w-4 h-4 text-primary" />
                        Medical Condition (optional)
                      </Label>
                      <Textarea
                        id="medical_condition"
                        placeholder="Any allergies, health conditions, or medications we should know about?"
                        {...register('medical_condition')}
                        className="min-h-[80px] text-base resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        This helps us provide better care if needed
                      </p>
                    </div>

                    {/* Emergency Contact Name */}
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact_name" className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        Emergency Contact Name *
                      </Label>
                      <Input
                        id="emergency_contact_name"
                        placeholder="e.g., Mary Mensah (Mother)"
                        {...register('emergency_contact_name')}
                        className={cn("h-12 text-base", errors.emergency_contact_name && "border-red-500")}
                      />
                      {errors.emergency_contact_name && (
                        <p className="text-sm text-red-500">⚠️ {errors.emergency_contact_name.message}</p>
                      )}
                    </div>

                    {/* Emergency Contact Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact_phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Emergency Contact Phone *
                      </Label>
                      <Input
                        id="emergency_contact_phone"
                        type="tel"
                        placeholder="e.g., 0241234567"
                        {...register('emergency_contact_phone')}
                        className={cn("h-12 text-base", errors.emergency_contact_phone && "border-red-500")}
                      />
                      {errors.emergency_contact_phone && (
                        <p className="text-sm text-red-500">⚠️ {errors.emergency_contact_phone.message}</p>
                      )}
                    </div>

                    {/* Dietary Restrictions */}
                    <div className="space-y-2">
                      <Label htmlFor="dietary_restrictions" className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-primary" />
                        Dietary Restrictions (optional)
                      </Label>
                      <Textarea
                        id="dietary_restrictions"
                        placeholder="e.g., Vegetarian, No pork, Allergic to nuts"
                        {...register('dietary_restrictions')}
                        className="min-h-[60px] text-base resize-none"
                      />
                    </div>

                    {/* Consent */}
                    <div className="space-y-3 bg-muted/50 p-4 rounded-xl">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          {...register('consent')}
                          className="mt-0.5 w-5 h-5 text-primary rounded focus:ring-primary flex-shrink-0"
                        />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                          I agree to receive event updates and important information via SMS and email *
                        </span>
                      </label>
                      {errors.consent && (
                        <p className="text-sm text-red-500 ml-8">⚠️ {errors.consent.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1 h-12"
                    disabled={isSubmitting}
                  >
                    ← Back
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90"
                  >
                    Continue →
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white font-bold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Registering...
                      </>
                    ) : (
                      'Complete Registration 🙏'
                    )}
                  </Button>
                )}
              </div>

              {/* Security Badge */}
              <div className="text-center pt-4">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <span>🔒</span>
                  Your information is secure and will not be shared
                </p>
              </div>
            </form>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 text-sm text-muted-foreground"
          >
            Need help? Contact the organizing team
          </motion.div>
        </div>
      </div>
    </>
  );
}