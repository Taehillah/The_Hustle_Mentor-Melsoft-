"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { loadJourney, saveJourney } from "../lib/journeyStore";
import styles from "./page.module.css";

type Stage = {
  id: string;
  title: string;
  prompt: string;
  icon: string;
  placeholder: string;
};

const stages: Stage[] = [
  {
    id: "idea",
    title: "Idea Generation",
    prompt: "What's your business idea? (Be specific!)",
    icon: "💡",
    placeholder:
      "e.g., A mobile app connecting township chefs with customers for home-cooked meals…",
  },
  {
    id: "plan",
    title: "Business Planning",
    prompt: "Share details about your concept and how you’ll deliver it.",
    icon: "📄",
    placeholder: "Provide as much detail as you can…",
  },
  {
    id: "market",
    title: "Market Research",
    prompt: "Who are your customers and where do you find them?",
    icon: "👥",
    placeholder: "Age, location, channels, competitors…",
  },
  {
    id: "marketing",
    title: "Marketing Strategy",
    prompt: "What will you say? Which channels? How often?",
    icon: "📈",
    placeholder: "WhatsApp, IG, flyers, partnerships…",
  },
  {
    id: "finance",
    title: "Financial Planning",
    prompt: "List your costs and how you’ll price. Add your income goal.",
    icon: "💰",
    placeholder: "CAPEX, OPEX, price tiers, breakeven…",
  },
  {
    id: "launch",
    title: "Launch & Sales",
    prompt: "What’s your first offer and how will you collect payment?",
    icon: "✅",
    placeholder: "Offer, payment method, delivery steps…",
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState("Your AI business mentor is ready to help.");
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const activeStage = useMemo(() => stages[activeIndex], [activeIndex]);

  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      const saved = await loadJourney();
      if (isMounted) {
        setNotes(saved);
        setIsLoading(false);
      }
    };
    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  const summary = [
    { label: "Business Idea", icon: "💡", value: notes.idea || "Not captured yet" },
    { label: "Plan Notes", icon: "📄", value: notes.plan || "Not captured yet" },
    { label: "Market Notes", icon: "👥", value: notes.market || "Not captured yet" },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, stages.length - 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleGuidance = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResponse("Thinking...");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageId: activeStage.id,
          stageTitle: activeStage.title,
          prompt: activeStage.prompt,
          note: notes[activeStage.id] || "",
          previousNotes: JSON.stringify(notes),
        }),
      });
      if (!res.ok) {
        throw new Error("Request failed");
      }
      const data = (await res.json()) as { message?: string };
      setAiResponse(data.message || "No response received.");
    } catch (error) {
      setAiError("Could not get AI guidance. Please try again.");
      setAiResponse("No response.");
    } finally {
      setAiLoading(false);
    }
  };

  const persistNotes = async (updatedNotes: Record<string, string>) => {
    setIsSaving(true);
    setStatus("Saving…");
    try {
      await saveJourney(updatedNotes);
      setStatus("Saved to Firebase");
      setTimeout(() => setStatus(null), 1500);
    } catch (error) {
      setStatus("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextStage = async () => {
    await persistNotes(notes);
    handleNext();
  };

  return (
    <div className={`${styles.page} ${theme === "dark" ? styles.dark : styles.light}`}>
      <header className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div>
            <p className={styles.appTitle}>The Hustle Mentor</p>
            <p className={styles.appSubtitle}>AI-powered guidance from idea to first sale</p>
          </div>
          <div className={styles.headerActions}>
            {status && <span className={styles.status}>{status}</span>}
            <button
              className={styles.toggleTheme}
              type="button"
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.progressCard}>
          <div className={styles.stageIcons}>
            {stages.map((stage, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={stage.id}
                  className={`${styles.stageIcon} ${isActive ? styles.active : ""}`}
                  onClick={() => setActiveIndex(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setActiveIndex(idx);
                  }}
                >
                  <span className={styles.icon}>{stage.icon}</span>
                  <p className={styles.iconLabel}>{stage.title}</p>
                </div>
              );
            })}
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((activeIndex + 1) / stages.length) * 100}%` }}
            />
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleRow}>
              <span className={styles.cardIcon}>{activeStage.icon}</span>
              <div>
                <p className={styles.cardTitle}>{activeStage.title}</p>
                <p className={styles.cardSubtitle}>{activeStage.prompt}</p>
              </div>
            </div>
            {isLoading && <p className={styles.loadingText}>Loading saved notes…</p>}
          </div>
          <textarea
            className={styles.textarea}
            placeholder={activeStage.placeholder}
            rows={4}
            value={notes[activeStage.id] || ""}
            onChange={(e) =>
              setNotes((prev) => ({ ...prev, [activeStage.id]: e.target.value }))
            }
          />
          <div className={styles.actionsRow}>
            <button
              className={`${styles.button} ${styles.secondary}`}
              type="button"
              onClick={handleGuidance}
              disabled={aiLoading}
            >
              💬 Get AI Guidance
            </button>
            <button
              className={`${styles.button} ${styles.primary}`}
              type="button"
              onClick={handleNextStage}
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : "Next Stage →"}
            </button>
          </div>
          <button
            className={styles.backButton}
            type="button"
            onClick={() => {
              persistNotes(notes);
              handlePrev();
            }}
          >
            ← Previous Stage
          </button>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleRow}>
              <span className={styles.cardIcon}>💬</span>
              <p className={styles.cardTitle}>AI Mentor Response</p>
            </div>
          </div>
          <div className={styles.responseBox}>
            <span className={styles.responseIcon}>{aiLoading ? "⏳" : "💡"}</span>
            {aiError ? (
              <p className={styles.responseError}>{aiError}</p>
            ) : (
              <p className={styles.responseText}>{aiResponse}</p>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <p className={styles.cardTitle}>Your Business Journey Summary</p>
          <div className={styles.summaryList}>
            {summary.map((item) => (
              <div key={item.label} className={styles.summaryItem}>
                <span className={styles.summaryIcon}>{item.icon}</span>
                <div>
                  <p className={styles.summaryLabel}>{item.label}</p>
                  <p className={styles.summaryValue}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
