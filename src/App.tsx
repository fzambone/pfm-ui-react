function App(): React.ReactElement {
  return (
    <div className="relative min-h-screen bg-background font-sans">
      {/* Ambient warm glow background — sharper gradients for visible glass effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
        {/* Large soft glows for ambient warmth */}
        <div className="absolute -left-20 -top-20 h-[700px] w-[700px] rounded-full bg-primary opacity-30 blur-[130px]" />
        <div className="absolute -bottom-20 right-[-10%] h-[800px] w-[800px] rounded-full bg-accent opacity-25 blur-[150px]" />
        {/* Sharper, smaller blobs — these create visible frosted distortion through glass */}
        <div className="absolute left-[30%] top-[15%] h-[250px] w-[250px] rounded-full bg-primary opacity-40 blur-[60px]" />
        <div className="absolute right-[20%] top-[5%] h-[200px] w-[200px] rounded-full bg-accent opacity-35 blur-[50px]" />
        <div className="absolute bottom-[15%] left-[15%] h-[200px] w-[200px] rounded-full bg-primary opacity-30 blur-[40px]" />
        <div className="absolute bottom-[30%] right-[30%] h-[180px] w-[180px] rounded-full bg-accent opacity-25 blur-[45px]" />
        <div className="absolute left-[55%] top-[40%] h-[150px] w-[150px] rounded-full bg-primary opacity-35 blur-[35px]" />
        <div className="absolute left-[10%] top-[50%] h-[220px] w-[220px] rounded-full bg-accent opacity-30 blur-[55px]" />
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="flex w-16 flex-col items-center gap-element border-r border-border bg-surface-overlay py-6 backdrop-blur-[var(--blur-glass)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <nav
            className="mt-section flex flex-col items-center gap-element"
            aria-label="Main navigation"
          >
            {[
              'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
              'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
              'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
              'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
            ].map((d) => (
              <button
                key={d.slice(0, 20)}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground-muted transition-colors duration-normal hover:bg-surface-raised hover:text-foreground"
                aria-label="Navigation item"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={d}
                  />
                </svg>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-page">
          <div className="mx-auto max-w-6xl space-y-section">
            {/* Page Header */}
            <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 gap-element md:grid-cols-3">
              {[
                {label: 'Total Balance', value: '$789,999.56', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'},
                {label: 'Earnings', value: '$998,999.56', icon: 'M7 11l5-5m0 0l5 5m-5-5v12'},
                {label: 'Expenses', value: '$39,999.67', icon: 'M17 13l-5 5m0 0l-5-5m5 5V6'},
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-inline rounded-card border border-border bg-surface p-card backdrop-blur-[var(--blur-glass)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-raised">
                    <svg
                      className="h-5 w-5 text-foreground-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted">{stat.label}</p>
                    <p className="text-lg font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-section lg:grid-cols-5">
              {/* Left Column — 3/5 */}
              <div className="space-y-section lg:col-span-3">
                {/* Statistic Card */}
                <div className="rounded-card border border-border bg-surface p-card shadow-glass backdrop-blur-[var(--blur-glass)]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                      Statistic
                    </h2>
                    <span className="rounded-button border border-border bg-surface-raised px-3 py-1 text-sm text-foreground-muted">
                      All Transaction
                    </span>
                  </div>

                  <div className="mt-section">
                    <p className="text-sm font-medium text-foreground">
                      Top Contributor
                    </p>
                    <p className="text-xs text-foreground-muted">
                      Top half-year Earning and Expenses source
                    </p>
                  </div>

                  {/* Mock Chart Area */}
                  <div className="mt-element h-48 rounded-lg border border-border-subtle bg-surface-overlay p-card-sm">
                    <div className="flex h-full items-end justify-between gap-tight px-4">
                      {[40, 65, 85, 55, 70, 45].map((h, i) => (
                        <div key={i} className="flex flex-1 flex-col items-center gap-tight">
                          <div
                            className="w-full rounded-t-md bg-primary opacity-60"
                            style={{height: `${String(h)}%`}}
                          />
                          <span className="text-xs text-foreground-subtle">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Row — Goals & Business */}
                <div className="grid grid-cols-1 gap-element md:grid-cols-2">
                  {/* My Goals */}
                  <div className="rounded-card border border-border bg-surface p-card shadow-glass-sm backdrop-blur-[var(--blur-glass)]">
                    <h2 className="text-lg font-semibold text-foreground">
                      My Goals
                    </h2>
                    <div className="mt-element grid grid-cols-2 gap-element">
                      {[
                        {name: 'Travel Abroad', pct: 60},
                        {name: 'Real Estate', pct: 89},
                      ].map((goal) => (
                        <div
                          key={goal.name}
                          className="rounded-lg border border-border-subtle bg-surface-overlay p-card-sm text-center"
                        >
                          <p className="text-2xl font-bold text-foreground">
                            {goal.pct}%
                          </p>
                          <div className="mx-auto mt-tight h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{width: `${String(goal.pct)}%`}}
                            />
                          </div>
                          <p className="mt-tight text-xs text-foreground-muted">
                            {goal.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Business */}
                  <div className="rounded-card border border-border bg-surface p-card shadow-glass-sm backdrop-blur-[var(--blur-glass)]">
                    <h2 className="text-lg font-semibold text-foreground">
                      Business
                    </h2>
                    <div className="mt-element space-y-element">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground-muted">
                          Target Savings
                        </span>
                        <span className="rounded-button border border-primary-muted bg-primary-muted px-2 py-0.5 text-xs font-medium text-primary">
                          $1,000,000.00
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-foreground-muted">
                          Total Savings
                        </span>
                        <p className="text-xl font-semibold text-foreground">
                          $700,345.98
                        </p>
                      </div>
                      {/* Progress ring mock */}
                      <div className="flex items-center justify-end">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary">
                          <span className="text-sm font-bold text-foreground">
                            65%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column — 2/5 */}
              <div className="space-y-section lg:col-span-2">
                {/* Profile Card */}
                <div className="rounded-card border border-border bg-surface p-card shadow-glass backdrop-blur-[var(--blur-glass)]">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-surface-raised" />
                    <span className="mt-tight inline-block rounded-badge bg-surface-raised px-2 py-0.5 text-xs text-foreground-muted">
                      Exclusive Card
                    </span>
                    <p className="mt-tight text-lg font-semibold text-foreground">
                      Fernando Zambone
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-element grid grid-cols-4 gap-tight">
                    {['Transfer', 'Receive', 'Bill', 'Top up'].map(
                      (action) => (
                        <button
                          key={action}
                          type="button"
                          className="flex flex-col items-center gap-tight rounded-lg p-2 text-foreground-muted transition-colors duration-normal hover:bg-surface-raised hover:text-foreground"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-overlay">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                          <span className="text-xs">{action}</span>
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Card Preview */}
                <div className="overflow-hidden rounded-card bg-gradient-to-br from-primary via-accent to-primary p-card shadow-glass">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-primary-foreground opacity-90">
                      PFM Card
                    </span>
                    <span className="text-xl font-bold text-primary-foreground">
                      Visa
                    </span>
                  </div>
                  <div className="mt-section flex items-end justify-between">
                    <div>
                      <p className="text-xs text-primary-foreground opacity-70">
                        Expired
                      </p>
                      <p className="text-sm font-medium text-primary-foreground">
                        09/27
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary-foreground opacity-70">
                        Total Balance
                      </p>
                      <p className="text-xl font-bold text-primary-foreground">
                        $74,330
                      </p>
                    </div>
                  </div>
                </div>

                {/* Month Transactions */}
                <div className="rounded-card border border-border bg-surface p-card shadow-glass-sm backdrop-blur-[var(--blur-glass)]">
                  <h2 className="text-lg font-semibold text-foreground">
                    Month Transaction
                  </h2>
                  <div className="mt-element space-y-element">
                    {[
                      {name: 'January Salary', date: '15.01.2024', amount: '$2,000.99', positive: true},
                      {name: 'Grocery Store', date: '14.01.2024', amount: '-$145.50', positive: false},
                      {name: 'Freelance Work', date: '12.01.2024', amount: '$850.00', positive: true},
                    ].map((tx) => (
                      <div
                        key={tx.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-inline">
                          <div className="h-8 w-8 rounded-full bg-surface-raised" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {tx.name}
                            </p>
                            <p className="text-xs text-foreground-subtle">
                              {tx.date}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-button px-2 py-0.5 text-sm font-medium ${
                            tx.positive
                              ? 'bg-success-muted text-success'
                              : 'bg-danger-muted text-danger'
                          }`}
                        >
                          {tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-element flex w-full items-center justify-between text-sm text-foreground-muted transition-colors duration-normal hover:text-foreground"
                  >
                    See all transactions
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
