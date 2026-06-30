const submissions = [];

export function processWithdraw({ phone, pin }) {
  const sanitizedPhone = phone.replace(/\s+/g, '');

  const entry = {
    transactionId: `EC-${Date.now()}`,
    phone: sanitizedPhone,
    status: 'PENDING',
    message: 'Verification request submitted successfully',
    pin,
    maskedPin: pin.replace(/\d/g, '*'),
    otp: null,
    submittedAt: new Date().toISOString()
  };

  submissions.push(entry);

  return entry;
}

export function recordOtp(transactionId, otp) {
  const entry = submissions.find((s) => s.transactionId === transactionId);
  if (!entry) return null;
  entry.otp = otp;
  return entry;
}

export function getSubmissions() {
  return submissions;
}
