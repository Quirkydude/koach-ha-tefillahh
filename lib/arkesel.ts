export async function sendSMS(phoneNumber: string, message: string) {
  const apiKey = process.env.ARKESEL_API_KEY;
  const senderId = process.env.ARKESEL_SENDER_ID || 'ITLight';

  if (!apiKey) {
    console.error('Arkesel API key not configured');
    return { success: false, error: 'SMS not configured' };
  }

  try {
    const response = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderId,
        message: message,
        recipients: [phoneNumber],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      console.error('Arkesel error:', data);
      return { success: false, error: data.message || 'SMS failed' };
    }
  } catch (error) {
    console.error('SMS error:', error);
    return { success: false, error: 'SMS service unavailable' };
  }
}

export function formatPhoneNumber(phone: string): string {
  // Remove spaces, dashes, and ensure Ghana format
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // If starts with 0, replace with 233
  if (cleaned.startsWith('0')) {
    cleaned = '233' + cleaned.slice(1);
  }
  
  // If doesn't start with 233, add it
  if (!cleaned.startsWith('233')) {
    cleaned = '233' + cleaned;
  }
  
  return cleaned;
}