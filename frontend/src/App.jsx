function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (err) {
    return <div style={{ color: "red" }}>Error: {err.message}</div>;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
