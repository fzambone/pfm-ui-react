function App(): React.ReactElement {
  return (
    <div className="bg-mesh min-h-screen font-sans antialiased tracking-tight">
      {/* Top Nav Bar */}
      <nav className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-border bg-glass-strong px-8 backdrop-blur-[var(--blur-glass-lg)] glass-edge">
        <div className="text-2xl font-bold tracking-tighter text-foreground">
          Luminous Ledger
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <button
            type="button"
            className="border-b-2 border-primary pb-1 text-foreground"
          >
            Dashboard
          </button>
          <button
            type="button"
            className="text-foreground-muted transition-colors duration-normal hover:text-foreground"
          >
            Accounts
          </button>
          <button
            type="button"
            className="text-foreground-muted transition-colors duration-normal hover:text-foreground"
          >
            Transactions
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-pill p-2 text-foreground-muted transition-all duration-slow hover:bg-glass-hover"
            aria-label="Notifications"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-pill p-2 text-foreground-muted transition-all duration-slow hover:bg-glass-hover"
            aria-label="Settings"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
          <div className="h-10 w-10 rounded-pill border border-border-strong bg-surface-high glass-edge" />
        </div>
      </nav>

      {/* Side Nav Bar (Pill Floating) */}
      <aside className="glass-edge fixed bottom-4 left-4 top-24 z-50 hidden w-64 flex-col rounded-card border border-border bg-glass py-8 shadow-glass backdrop-blur-[var(--blur-glass-lg)] md:flex">
        <div className="px-4 py-6">
          <div className="text-lg font-black text-foreground">
            Luminous Ledger
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[0.05em] text-foreground-muted opacity-70">
            The Digital Curator
          </div>
        </div>
        <div className="flex-1 space-y-1 px-2">
          <button
            type="button"
            className="glass-edge mx-2 my-1 flex items-center gap-3 rounded-pill bg-glass-hover px-4 py-3 text-xs font-medium uppercase tracking-[0.05em] text-foreground shadow-[0_0_15px_rgba(255,159,74,0.3)] backdrop-blur-[var(--blur-glass-sm)]"
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
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
            Dashboard
          </button>
          {['Accounts', 'Transactions'].map((item) => (
            <button
              key={item}
              type="button"
              className="mx-2 my-1 flex items-center gap-3 rounded-pill px-4 py-3 text-xs font-medium uppercase tracking-[0.05em] text-foreground-muted transition-all duration-normal hover:translate-x-1 hover:bg-glass hover:text-foreground"
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
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              {item}
            </button>
          ))}
        </div>
        <div className="mb-6 px-6">
          <button
            type="button"
            className="glass-edge w-full rounded-pill bg-gradient-to-r from-primary to-primary-container py-3 text-xs font-bold uppercase tracking-[0.05em] text-primary-foreground transition-transform active:scale-95"
          >
            Add Transaction
          </button>
        </div>
        <div className="space-y-1 border-t border-border-subtle px-2 pt-4">
          {['Support', 'Logout'].map((item) => (
            <button
              key={item}
              type="button"
              className="mx-2 my-1 flex items-center gap-3 rounded-pill px-4 py-3 text-xs font-medium uppercase tracking-[0.05em] text-foreground-muted transition-all duration-normal hover:translate-x-1 hover:bg-glass hover:text-foreground"
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
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
              {item}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] px-6 pb-12 pt-28 md:pl-80 md:pr-12">
        {/* Header */}
        <header className="mb-10">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Executive Summary
          </span>
          <h1 className="text-5xl font-black tracking-tighter text-foreground">
            Unified Dashboard
          </h1>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Balance Card (Large) */}
          <section className="glass-edge relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-card border border-border bg-glass p-8 backdrop-blur-[var(--blur-glass)] md:col-span-8">
            <div className="absolute -mr-32 -mt-32 right-0 top-0 h-64 w-64 rounded-full bg-primary opacity-20 blur-[100px]" />
            <div className="relative z-10">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground-muted">
                Current Liquidity
              </p>
              <h2 className="text-6xl font-black tracking-tighter text-foreground">
                $142,850.
                <span className="text-4xl opacity-40">65</span>
              </h2>
              <div className="mt-2 inline-flex items-center gap-1 rounded-pill border border-primary-muted bg-primary-muted px-4 py-1 text-sm font-bold text-primary">
                +12.5%
              </div>
            </div>
            <div className="relative z-10 mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { label: 'Checking', value: '$42,300' },
                { label: 'Investment', value: '$89,120' },
                { label: 'Savings', value: '$11,430' },
                { label: 'Crypto', value: '$0.00' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="mb-1 text-[10px] font-bold uppercase text-foreground-muted">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions (Right Column) */}
          <div className="flex flex-col gap-6 md:col-span-4">
            <div className="glass-edge group flex cursor-pointer flex-col items-center justify-center rounded-card border border-border bg-surface-high p-6 text-center backdrop-blur-[var(--blur-glass)] transition-all duration-slow hover:bg-glass-hover">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-pill bg-gradient-to-br from-tertiary to-tertiary-container shadow-glow-tertiary">
                <svg
                  className="h-8 w-8 text-tertiary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </div>
              <p className="text-lg font-bold text-foreground">
                Transfer Funds
              </p>
              <p className="mt-1 text-xs text-foreground-muted">
                Instant peer-to-peer
              </p>
            </div>
            <div className="glass-edge group flex cursor-pointer flex-col items-center justify-center rounded-card border border-border bg-surface-high p-6 text-center backdrop-blur-[var(--blur-glass)] transition-all duration-slow hover:bg-glass-hover">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-pill bg-glass-hover">
                <svg
                  className="h-8 w-8 text-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <p className="text-lg font-bold text-foreground">Link Account</p>
              <p className="mt-1 text-xs text-foreground-muted">
                Open Banking Integration
              </p>
            </div>
          </div>

          {/* Performance Analytics */}
          <section className="glass-edge rounded-card border border-border bg-glass p-8 backdrop-blur-[var(--blur-glass)] md:col-span-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Performance Analytics
                </h3>
                <p className="text-sm text-foreground-muted">
                  Annual portfolio yield analysis
                </p>
              </div>
              <div className="flex gap-2">
                {['Week', 'Month', 'Year'].map((period) => (
                  <button
                    key={period}
                    type="button"
                    className={`rounded-pill px-4 py-1.5 text-xs font-bold ${
                      period === 'Month'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-glass-hover text-foreground'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative flex h-64 w-full items-end justify-between px-4">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
                <span className="text-8xl font-black tracking-tighter">
                  DATA VIZ
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex w-full justify-between px-8 py-2 text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map(
                  (m) => (
                    <span key={m}>{m}</span>
                  ),
                )}
              </div>
            </div>
          </section>

          {/* Financial Goals */}
          <section className="glass-edge rounded-card border border-border bg-glass p-8 backdrop-blur-[var(--blur-glass)] md:col-span-4">
            <h3 className="mb-6 text-xl font-bold text-foreground">
              Financial Goals
            </h3>
            <div className="space-y-8">
              {[
                {
                  name: 'New Home Fund',
                  current: '$375,000',
                  target: '$500,000',
                  pct: 75,
                  color: '#ff9f4a',
                },
                {
                  name: 'Tesla Model S',
                  current: '$28,000',
                  target: '$89,000',
                  pct: 32,
                  color: '#ffd709',
                },
                {
                  name: 'Emergency Buffer',
                  current: '$23,000',
                  target: '$25,000',
                  pct: 92,
                  color: '#4aedef',
                },
              ].map((goal) => (
                <div key={goal.name} className="flex items-center gap-6">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <svg
                      className="-rotate-90 h-full w-full"
                      aria-hidden="true"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke={goal.color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="175"
                        strokeDashoffset={String(175 - (175 * goal.pct) / 100)}
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-foreground">
                      {String(goal.pct)}%
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{goal.name}</p>
                    <p className="text-xs text-foreground-muted">
                      {goal.current} / {goal.target}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-8 w-full rounded-xl border border-border py-3 text-xs font-bold uppercase tracking-widest text-foreground-muted transition-all hover:bg-glass"
            >
              View All Goals
            </button>
          </section>

          {/* Recent Artifacts */}
          <section className="glass-edge rounded-card border border-border bg-glass p-8 backdrop-blur-[var(--blur-glass)] md:col-span-12">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">
                Recent Artifacts
              </h3>
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-bold text-primary"
              >
                View Statement
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              {[
                {
                  name: 'Apple Store Infinite Loop',
                  category: 'Technology & Lifestyle • 2 hours ago',
                  amount: '-$1,299.00',
                  status: 'Pending',
                  positive: false,
                },
                {
                  name: 'Stripe Payout - Project Luminous',
                  category: 'Business Income • Yesterday',
                  amount: '+$8,400.00',
                  status: 'Cleared',
                  positive: true,
                },
                {
                  name: 'The Alchemist Brasserie',
                  category: 'Dining & Entertainment • Nov 21',
                  amount: '-$240.50',
                  status: 'Cleared',
                  positive: false,
                },
              ].map((tx) => (
                <div
                  key={tx.name}
                  className="group flex items-center justify-between rounded-2xl p-4 transition-all duration-slow hover:bg-glass"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-high transition-colors group-hover:border-primary-muted">
                      <svg
                        className="h-5 w-5 text-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{tx.name}</p>
                      <p className="text-xs text-foreground-muted">
                        {tx.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${tx.positive ? 'text-tertiary' : 'text-foreground'}`}
                    >
                      {tx.amount}
                    </p>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-widest ${tx.status === 'Pending' ? 'text-danger' : 'text-foreground-muted'}`}
                    >
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Floating FAB */}
      <button
        type="button"
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-pill bg-gradient-to-br from-primary to-primary-container text-primary-foreground shadow-glow-primary transition-transform active:scale-90"
        aria-label="Add transaction"
      >
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  );
}

export default App;
