"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import styles from "../auth.module.css";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      setMessage("Account created. Redirecting…");
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch (err: any) {
      setError(err?.message || "Failed to sign up");
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
        <p className={styles.title}>Create your account</p>
        <p className={styles.subtitle}>Join The Hustle Mentor to save your journey.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Name
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </label>
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
              autoComplete="new-password"
              required
            />
            <span className={styles.hint}>Use at least 8 characters.</span>
          </label>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Creating…" : "Sign up"}
          </button>
          <button
            className={`${styles.button} ${styles.googleButton}`}
            type="button"
            onClick={handleGoogle}
            disabled={loading}
          >
            Continue with Google
          </button>
          {message && <p className={styles.success}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <p className={styles.footer}>
          Already have an account?{" "}
          <Link className={styles.link} href="/signin">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
