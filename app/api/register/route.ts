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
      gender: body.gender || null,
      first_time_attendee: body.first_time_attendee,
      role: body.role,
      executive_department: body.role === 'Executive' ? body.executive_department : null,
      area_residence: body.area_residence || null,
      registration_number: registrationNumber,
      sms_sent: false,
    };

    // Insert into database
    const { data, error } = await supabase
      .from('registrations')
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

    // Send SMS confirmation
    const smsMessage = `Hi ${body.full_name}! 🎉\n\nYou're registered for Divine Worship Splash 2026!\n\nRegistration #: ${registrationNumber}\nDate: SAT, 31 JAN 2026\nTime: 9AM-6:30PM\nVenue: Casely-Hayford field, UCC Campus\n\nSee you there!\n- Invitation to Light`;

    const smsResult = await sendSMS(formattedPhone, smsMessage);

    // Update SMS status
    if (smsResult.success) {
      await supabase
        .from('registrations')
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