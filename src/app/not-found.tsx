import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 48, textAlign: "center" }}>
      <h1 style={{ fontSize: 32 }}>404</h1>
      <p>That route does not exist.</p>
      <p>
        <Link href="/">← Back to start</Link>
      </p>
    </main>
  );
}
