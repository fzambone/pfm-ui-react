function App(): React.ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background font-sans">
      <div className="rounded-card border border-border bg-surface p-card shadow-glass backdrop-blur-[var(--blur-glass)]">
        <h1 className="text-2xl font-bold text-foreground">PFM</h1>
        <p className="mt-inline text-sm text-foreground-muted">
          Personal Financial Manager
        </p>
      </div>
    </main>
  );
}

export default App;
