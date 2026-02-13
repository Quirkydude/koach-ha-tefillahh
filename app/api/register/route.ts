import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { generateRegistrationNumber } from '@/lib/utils';
import { sendSMS, formatPhoneNumber } from '@/lib/arkesel';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseClient();

    // Generate unique registration number
    const registrationNumber = generateRegistrationNumber();

    // Format phone number for SMS
    const formattedPhone = formatPhoneNumber(body.phone_number);

    // Prepare data for database
    const registrationData = {
      full_name: body.full_name,
      phone_number: body.phone_number,
      email: body.email || null,
      age_range: body.age_range,
      gender: body.gender,
      area_residence: body.area_residence,
      medical_condition: body.medical_condition || null,
      student_or_worker: body.student_or_worker,
      occupation: body.student_or_worker === 'Worker' ? body.occupation : null,
      will_sleep: body.will_sleep,
      days_attending: body.days_attending,
      emergency_contact_name: body.emergency_contact_name,
      emergency_contact_phone: body.emergency_contact_phone,
      dietary_restrictions: body.dietary_restrictions || null,
      registration_number: registrationNumber,
      sms_sent: false,
    };

    // Insert into database
    const { data, error } = await supabase
      .from('prayer_conference_registrations')
      .insert([registrationData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // Check for duplicate phone number
      if (error.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            message: 'This phone number is already registered. Please use a different number.',
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Registration failed. Please try again.',
        },
        { status: 500 }
      );
    }

    // Format days for SMS
    const daysText = body.days_attending
      .map((d: string) => {
        const dayMap: {[key: string]: string} = {
          'day1': 'Day 1 (Feb 18)',
          'day2': 'Day 2 (Feb 19)',
          'day3': 'Day 3 (Feb 20)',
          'day4': 'Day 4 (Feb 21)',
          'day5': 'Day 5 (Feb 22)',
        };
        return dayMap[d] || d;
      })
      .join(', ');

    // Send SMS confirmation
    const smsMessage = `Shalom ${body.full_name}! 🙏

You're registered for Koach Ha-Tefillah Prayer Conference!

Registration #: ${registrationNumber}
Days: ${daysText}
Time: 6:45 PM each night
Venue: Habitat Auditorium, Fosu

${body.will_sleep ? 'You registered to sleep at the venue. Please bring bedding.' : ''}

#ThereIsPowerInMyPrayers

See you there!`;

    const smsResult = await sendSMS(formattedPhone, smsMessage);

    // Update SMS status
    if (smsResult.success) {
      await supabase
        .from('prayer_conference_registrations')
        .update({ sms_sent: true })
        .eq('id', data.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      registration_number: registrationNumber,
      data: data,
      sms_sent: smsResult.success,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}