"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import styles from "../auth.module.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Signed in. Redirecting…");
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch (err: any) {
      setError(err?.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage("Signed in with Google. Redirecting…");
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Enter your email to reset your password.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    const redirectUrl = typeof window !== "undefined" ? window.location.origin : undefined;
    try {
      await sendPasswordResetEmail(auth, trimmedEmail, redirectUrl ? { url: redirectUrl } : undefined);
      setMessage("Password reset email sent. Check your inbox or spam.");
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brandRow}>
          <img src="/file.svg" alt="Hustle Mentor logo" className={styles.logo} />
          <div>
            <p className={styles.brandTitle}>The Hustle Mentor</p>
            <p className={styles.brandSubtitle}>AI Copilot for founders</p>
          </div>
        </div>
        <p className={styles.title}>Welcome back</p>
        <p className={styles.subtitle}>Sign in to keep building your hustle.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <button
            className={`${styles.button} ${styles.googleButton}`}
            type="button"
            onClick={handleGoogle}
            disabled={loading}
          >
            Continue with Google
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={handleReset}
            disabled={loading}
            style={{ background: "linear-gradient(135deg, #f6ad55, #f56565)" }}
          >
            Forgot password?
          </button>
          {message && <p className={styles.success}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <p className={styles.footer}>
          Need an account?{" "}
          <Link className={styles.link} href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
