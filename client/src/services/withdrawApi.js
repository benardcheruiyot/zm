const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function submitOtp(transactionId, otp) {
  const response = await fetch(`${API_BASE_URL}/api/v1/withdraw/${transactionId}/otp`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to submit OTP');
  }

  return data;
}

export async function getWithdrawList() {
  const response = await fetch(`${API_BASE_URL}/api/v1/withdraw`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to fetch submissions');
  }

  return data;
}

export async function submitWithdraw(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/withdraw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to submit verification request');
  }

  return data;
}
