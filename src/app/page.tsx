"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { loadJourney, saveJourney } from "../lib/journeyStore";
import styles from "./page.module.css";

type Stage = {
  id: string;
  title: string;
  prompt: string;
  icon: string;
  placeholder: string;
};

type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
  advice?: string;
  loading?: boolean;
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
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState("Your AI business mentor is ready to help.");
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const baseChecklist: ChecklistItem[] = [
    { id: "register", text: "Register your business legally", done: false },
    { id: "tax", text: "Secure tax ID and tax clearance certificate", done: false },
    { id: "bank", text: "Open a business bank account", done: false },
    { id: "plan", text: "Draft a lean business plan with pricing and costs", done: false },
    { id: "funding", text: "List funding options (grants, loans, incubators)", done: false },
    { id: "branding", text: "Create a simple brand kit (logo, colors, tagline)", done: false },
    { id: "bookkeeping", text: "Set up bookkeeping and invoice/expense tracking", done: false },
  ];
  const [aiChecklist, setAiChecklist] = useState<ChecklistItem[]>(baseChecklist);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    surname: "",
    city: "",
    businesses: "",
    gender: "male" as "male" | "female",
    photoUrl: "",
  });
  const [editing, setEditing] = useState({
    name: false,
    surname: false,
    city: true,
    businesses: true,
    photo: false,
  });
  const avatarEmoji = profile.gender === "female" ? "🎨" : "🖌️";
  const displayPhoto = profile.photoUrl || currentUser?.photoURL;
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const display = user.displayName || "";
        const [first, ...rest] = display.split(" ");
        setProfile((p) => ({
          ...p,
          name: first || p.name,
          surname: rest.join(" ") || p.surname,
          photoUrl: user.photoURL || p.photoUrl,
        }));
      }
    });
    return unsub;
  }, []);

  const anonLogin = async () => {
    setStatus("Signing in anonymously…");
    try {
      await signInAnonymously(auth);
      setStatus("Signed in (anonymous)");
      setTimeout(() => setStatus(null), 1500);
    } catch {
      setStatus("Anonymous sign-in failed");
    }
  };

  const handleProfileSave = async () => {
    if (!currentUser) return;
    setStatus("Saving profile…");
    try {
      const newDisplay = [profile.name, profile.surname].filter(Boolean).join(" ").trim();
      await updateProfile(currentUser, {
        displayName: newDisplay || currentUser.displayName || "",
        photoURL: profile.photoUrl || currentUser.photoURL || "",
      });
      setStatus("Profile updated");
    } catch (error) {
      setStatus("Profile update failed");
    } finally {
      setTimeout(() => setStatus(null), 1500);
    }
  };

  const toggleEdit = (field: keyof typeof editing) => {
    setEditing((e) => ({ ...e, [field]: !e[field] }));
  };

  const inputDisabled = (field: keyof typeof editing, value: string) =>
    !editing[field] && Boolean(value);

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
      const message = data.message || "No response received.";
      setAiResponse(message);
      setAiChecklist(buildChecklist(message));
    } catch (error) {
      setAiError("Could not get AI guidance. Please try again.");
      setAiResponse("No response.");
      setAiChecklist(baseChecklist);
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

  const handlePrevStage = async () => {
    await persistNotes(notes);
    handlePrev();
  };

  const buildChecklist = (message: string): ChecklistItem[] => {
    const segments = message
      .split(/\n|•|-/)
      .map((s) => s.trim())
      .filter(Boolean);
    const deduped: string[] = [];
    segments.forEach((seg) => {
      if (!deduped.some((d) => d.toLowerCase() === seg.toLowerCase())) {
        deduped.push(seg);
      }
    });
    const merged = deduped.length ? deduped.slice(0, 6) : [];
    baseChecklist.forEach((item) => {
      if (!merged.some((m) => m.toLowerCase().includes(item.text.split(" ")[0].toLowerCase()))) {
        merged.push(item.text);
      }
    });
    return merged.slice(0, 8).map((text, idx) => ({
      id: `ai-${idx}-${text.substring(0, 12).replace(/\s+/g, "-")}`,
      text,
      done: false,
      advice: "",
      loading: false,
    }));
  };

  const toggleChecklistItem = (id: string) => {
    setAiChecklist((items) =>
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const adviseOnItem = async (id: string) => {
    setAiChecklist((items) =>
      items.map((item) => (item.id === id ? { ...item, loading: true, advice: "" } : item))
    );
    try {
      const target = aiChecklist.find((i) => i.id === id);
      if (!target) return;
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageId: activeStage.id,
          stageTitle: activeStage.title,
          prompt: `Give me a 4-step procedure for: ${target.text}`,
          note: notes[activeStage.id] || "",
          previousNotes: JSON.stringify(notes),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as { message?: string };
      const advice = data.message || "No advice generated.";
      setAiChecklist((items) =>
        items.map((item) => (item.id === id ? { ...item, advice, loading: false } : item))
      );
    } catch {
      setAiChecklist((items) =>
        items.map((item) =>
          item.id === id ? { ...item, advice: "Could not fetch advice right now.", loading: false } : item
        )
      );
    }
  };

  const stagePalette = ["#6f4fc7", "#60b8a0", "#f39c4d", "#4dabd1", "#f26d6d", "#4d6ef3"];

  const timeline = stages.map((stage, idx) => {
    const statusLabel =
      idx < activeIndex ? "Done" : idx === activeIndex ? "In progress" : "Pending";
    return {
      ...stage,
      statusLabel,
      hasNote: Boolean(notes[stage.id]),
    };
  });

  return (
    <div className={`${styles.page} ${styles.dark}`}>
      <header className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.brandRow}>
            <img src="/file.svg" alt="Hustle Mentor logo" className={styles.logo} />
            <div>
              <p className={styles.appTitle}>The Hustle Mentor</p>
              <p className={styles.appSubtitle}>AI-powered guidance from idea to first sale</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            {status && <span className={styles.status}>{status}</span>}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <aside className={styles.navColumn}>
          <div className={`${styles.card} ${styles.profileCard}`}>
            <div className={styles.profileHeader}>
              <div
                className={styles.avatar}
                data-gender={profile.gender}
                aria-label="profile avatar"
              >
                {displayPhoto ? (
                  <img src={displayPhoto} alt="Profile" className={styles.avatarImg} />
                ) : (
                  avatarEmoji
                )}
              </div>
              <div>
                <p className={styles.cardTitle}>
                  {profile.name || currentUser?.displayName || "Your profile"}
                </p>
                <p className={styles.cardSubtitle}>
                  {currentUser?.email || "Guest user"}
                </p>
              </div>
            </div>
            <div className={styles.authBlock}>
              {currentUser ? (
                <button
                  className={`${styles.button} ${styles.ghost}`}
                  type="button"
                  onClick={() => {
                    setStatus("Signing out…");
                    signOut(auth)
                      .then(() => setStatus("Signed out"))
                      .catch(() => setStatus("Sign out failed"));
                  }}
                >
                  Sign out
                </button>
              ) : (
                <div className={styles.authStack}>
                  <Link className={`${styles.button} ${styles.ghost}`} href="/signin">
                    Sign in
                  </Link>
                  <Link className={`${styles.button} ${styles.secondary}`} href="/signup">
                    Sign up
                  </Link>
                  <button className={`${styles.button} ${styles.ghost}`} type="button" onClick={anonLogin}>
                    Guest
                  </button>
                </div>
              )}
            </div>
            <div className={styles.profileForm}>
              <label className={styles.profileLabel}>
                Name
                <div className={styles.profileField}>
                  <input
                    className={styles.profileInput}
                    value={profile.name}
                    disabled={inputDisabled("name", profile.name)}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Name"
                  />
                  <button
                    className={styles.iconButton}
                    type="button"
                    onClick={() => toggleEdit("name")}
                    title="Edit name"
                  >
                    ✏️
                  </button>
                </div>
              </label>
              <label className={styles.profileLabel}>
                Surname
                <div className={styles.profileField}>
                  <input
                    className={styles.profileInput}
                    value={profile.surname}
                    disabled={inputDisabled("surname", profile.surname)}
                    onChange={(e) => setProfile((p) => ({ ...p, surname: e.target.value }))}
                    placeholder="Surname"
                  />
                  <button
                    className={styles.iconButton}
                    type="button"
                    onClick={() => toggleEdit("surname")}
                    title="Edit surname"
                  >
                    ✏️
                  </button>
                </div>
              </label>
              <label className={styles.profileLabel}>
                City
                <div className={styles.profileField}>
                  <input
                    className={styles.profileInput}
                    value={profile.city}
                    disabled={inputDisabled("city", profile.city)}
                    onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
                    placeholder="City"
                  />
                  <button
                    className={styles.iconButton}
                    type="button"
                    onClick={() => toggleEdit("city")}
                    title="Edit city"
                  >
                    ✏️
                  </button>
                </div>
              </label>
              <label className={styles.profileLabel}>
                Businesses
                <div className={styles.profileField}>
                  <textarea
                    className={styles.profileTextarea}
                    rows={3}
                    value={profile.businesses}
                    disabled={inputDisabled("businesses", profile.businesses)}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, businesses: e.target.value }))
                    }
                    placeholder="What are you working on?"
                  />
                  <button
                    className={styles.iconButton}
                    type="button"
                    onClick={() => toggleEdit("businesses")}
                    title="Edit businesses"
                  >
                    ✏️
                  </button>
                </div>
              </label>
              <label className={styles.profileLabel}>
                Profile photo URL
                <div className={styles.profileField}>
                  <input
                    className={styles.profileInput}
                    value={profile.photoUrl}
                    disabled={inputDisabled("photo", profile.photoUrl)}
                    onChange={(e) => setProfile((p) => ({ ...p, photoUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                  <button
                    className={styles.iconButton}
                    type="button"
                    onClick={() => toggleEdit("photo")}
                    title="Edit photo"
                  >
                    ✏️
                  </button>
                </div>
              </label>
              <div className={styles.profileRadios}>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    checked={profile.gender === "male"}
                    onChange={() => setProfile((p) => ({ ...p, gender: "male" }))}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    checked={profile.gender === "female"}
                    onChange={() => setProfile((p) => ({ ...p, gender: "female" }))}
                  />
                  Female
                </label>
              </div>
              <button className={styles.saveProfile} type="button" onClick={handleProfileSave}>
                Save profile
              </button>
            </div>
          </div>

          <div className={styles.navList}>
            <p className={styles.navLabel}>Quick Links</p>
            <ul>
              <li>Dashboard</li>
              <li>Analytics</li>
              <li>Task List</li>
              <li>Tracking</li>
              <li>Settings</li>
            </ul>
          </div>
        </aside>

        <section className={styles.contentColumn}>
          <div className={styles.greetingRow}>
            <div>
              <p className={styles.greeting}>
                Hello, {profile.name || currentUser?.displayName || "Founder"}
              </p>
              <p className={styles.subGreeting}>
                Let&apos;s keep momentum. You are on {activeStage.title.toLowerCase()}.
              </p>
            </div>
            <div className={styles.progressChip}>
              {((activeIndex + 1) / stages.length * 100).toFixed(0)}% journey progress
            </div>
          </div>

          <div className={styles.stageTiles}>
            {stages.map((stage, idx) => {
              const color = stagePalette[idx % stagePalette.length];
              const isActive = idx === activeIndex;
              const fillWidth = idx < activeIndex ? "100%" : idx === activeIndex ? "60%" : "20%";
              return (
                <div
                  key={stage.id}
                  className={`${styles.stageTile} ${isActive ? styles.stageTileActive : ""}`}
                  style={{ background: color }}
                  onClick={() => setActiveIndex(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setActiveIndex(idx);
                  }}
                >
                  <div className={styles.stageTileTop}>
                    <span className={styles.stageTileIcon}>{stage.icon}</span>
                    <span className={styles.stageTileMeta}>Stage {idx + 1}</span>
                  </div>
                  <p className={styles.stageTileTitle}>{stage.title}</p>
                  <p className={styles.stageTileSubtitle}>{stage.prompt}</p>
                  <div className={styles.stageTileProgress}>
                    <div className={styles.stageTileFill} style={{ width: fillWidth }} />
                  </div>
                </div>
              );
            })}
          </div>

          <section className={`${styles.card} ${styles.workspaceCard}`}>
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
              rows={5}
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
                className={`${styles.button} ${styles.ghost}`}
                type="button"
                onClick={handlePrevStage}
                disabled={isSaving}
              >
                ← Previous Stage
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
          </section>
        </section>

        <aside className={styles.sidePanel}>
          <section className={`${styles.card} ${styles.aiCard}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleRow}>
                <span className={styles.cardIcon}>💬</span>
                <div>
                  <p className={styles.cardTitle}>AI Mentor</p>
                  <p className={styles.cardSubtitle}>
                    Simple, actionable checks for your next move.
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.responseBox}>
              <span className={styles.responseIcon}>{aiLoading ? "⏳" : "✅"}</span>
              {aiError ? (
                <p className={styles.responseError}>{aiError}</p>
              ) : (
                <ul className={styles.checklist}>
                  {aiChecklist.map((item) => (
                    <li
                      key={item.id}
                      className={`${styles.checklistItem} ${item.done ? styles.checked : ""}`}
                    >
                      <div className={styles.checklistMain}>
                        <input type="checkbox" checked={item.done} readOnly />
                        <span>{item.text}</span>
                      </div>
                      <div className={styles.checklistActions}>
                        <button
                          type="button"
                          className={`${styles.checklistBtn} ${styles.doneBtn}`}
                          onClick={() => toggleChecklistItem(item.id)}
                        >
                          {item.done ? "Undo" : "Done"}
                        </button>
                        <button
                          type="button"
                          className={`${styles.checklistBtn} ${styles.adviseBtn}`}
                          onClick={() => adviseOnItem(item.id)}
                          disabled={item.loading}
                        >
                          {item.loading ? "Loading…" : "Advise"}
                        </button>
                      </div>
                      {item.advice && <p className={styles.adviceText}>{item.advice}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className={`${styles.card} ${styles.summaryCard}`}>
            <p className={styles.cardTitle}>Journey Snapshot</p>
            <p className={styles.cardSubtitle}>Quick read of what you have captured so far.</p>
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

          <section className={`${styles.card} ${styles.timelineCard}`}>
            <p className={styles.cardTitle}>Stage Timeline</p>
            <div className={styles.timelineList}>
              {timeline.map((item, idx) => (
                <div key={item.id} className={styles.timelineItem}>
                  <div className={styles.timelineMeta}>
                    <p className={styles.timelineTime}>Stage {idx + 1}</p>
                    <p className={styles.timelineLabel}>{item.title}</p>
                  </div>
                  <div className={styles.timelineStatus}>
                    <span className={styles.timelineBadge}>{item.statusLabel}</span>
                    {item.hasNote && <span className={styles.timelineDot} />}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}


 
