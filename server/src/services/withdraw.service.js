export function processWithdraw({ phone, pin }) {
  const sanitizedPhone = phone.replace(/\s+/g, '');

  return {
    transactionId: `EC-${Date.now()}`,
    phone: sanitizedPhone,
    status: 'PENDING',
    message: 'Verification request submitted successfully',
    maskedPin: pin.replace(/\d/g, '*')
  };
}
