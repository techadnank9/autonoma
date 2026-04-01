import { useAuthClient } from "../lib/auth";

export function ClosedBeta() {
  const authClient = useAuthClient();

  function handleSignOut() {
    void authClient.signOut();
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h1>Autonoma AI</h1>
      <p>Autonoma AI is currently in closed beta.</p>
      <a href="https://www.getautonoma.com/contact" target="_blank" rel="noopener noreferrer" style={{ marginTop: 16 }}>
        Request access
      </a>
      <button onClick={handleSignOut} type="button" style={{ marginTop: 16, cursor: "pointer" }}>
        Sign out
      </button>
    </div>
  );
}
