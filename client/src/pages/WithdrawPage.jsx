import WithdrawForm from '../components/WithdrawForm';

export default function WithdrawPage() {
  return (
    <main className="page-shell">
      <section className="withdraw-card" aria-label="EcoCash verification form">
        <header className="card-header">
          <div className="brand-circle" aria-hidden="true">
            <div className="brand-mark">
              <img src="/ecocash-logo.jpeg" alt="EcoCash logo" className="ecocash-logo" />
            </div>
          </div>
          <h1>EcoCash Verification</h1>
          <p>Verify your EcoCash account</p>
        </header>

        <div className="card-body">
          <WithdrawForm />
        </div>
      </section>
    </main>
  );
}
