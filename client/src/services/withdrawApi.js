const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
