import React, { useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COLORS = {
  primary: "#1a1a2e",
  accent: "#e94560",
  accent2: "#0f3460",
  gold: "#f5a623",
  bg: "#0d0d1a",
  card: "#16213e",
  cardLight: "#1a2a4a",
  text: "#e0e0e0",
  muted: "#8892a4",
  border: "#2a3a5c",
  success: "#00d4aa",
  warning: "#f5a623",
  danger: "#ff6b6b",
};

const CATEGORY_COLORS = {
  Tech: "#e94560",
  Gaming: "#9b59b6",
  Workshop: "#00d4aa",
  Pitching: "#f5a623",
};

const DUMMY_SPONSORS = [
  {
    id: 1,
    name: "TechVerse Corp",
    category: "Tech",
    description: "Leading technology company sponsoring innovation events globally.",
    location: "Mumbai, India",
    pricing: "Rs. 50,000 - Rs. 500,000",
    contact: "partnerships@techverse.com",
    logo: "TV",
    color: "#e94560",
  },
  {
    id: 2,
    name: "GameForge Studios",
    category: "Gaming",
    description: "Premier gaming studio backing esports and gaming tournaments.",
    location: "Bengaluru, India",
    pricing: "Rs. 25,000 - Rs. 200,000",
    contact: "sponsors@gameforge.io",
    logo: "GF",
    color: "#0f3460",
  },
  {
    id: 3,
    name: "StartupBoost Fund",
    category: "Pitching",
    description: "VC fund investing in pitch competitions and startup ecosystems.",
    location: "Delhi, India",
    pricing: "Rs. 100,000 - Rs. 1,000,000",
    contact: "hello@startupboost.in",
    logo: "SB",
    color: "#f5a623",
  },
  {
    id: 4,
    name: "EduTech Alliance",
    category: "Workshop",
    description: "EdTech consortium supporting educational workshops and seminars.",
    location: "Pune, India",
    pricing: "Rs. 10,000 - Rs. 75,000",
    contact: "collab@edutech.in",
    logo: "EA",
    color: "#00d4aa",
  },
  {
    id: 5,
    name: "NovaCoin Crypto",
    category: "Tech",
    description: "Blockchain company sponsoring hackathons and Web3 events.",
    location: "Hyderabad, India",
    pricing: "Rs. 30,000 - Rs. 300,000",
    contact: "events@novacoin.io",
    logo: "NC",
    color: "#9b59b6",
  },
  {
    id: 6,
    name: "RedBull India",
    category: "Gaming",
    description: "Energy drink brand powering gaming marathons and esports events.",
    location: "Pan India",
    pricing: "Rs. 50,000 - Rs. 800,000",
    contact: "india@redbull.com",
    logo: "RB",
    color: "#e74c3c",
  },
];

const DUMMY_VENUES = [
  {
    id: 1,
    name: "The Innovation Hub",
    category: "Tech",
    description: "State-of-the-art co-working space with a 500-seat auditorium and high-speed internet.",
    location: "Connaught Place, Delhi",
    pricing: "Rs. 15,000 / day",
    contact: "book@innovationhub.in",
    logo: "IH",
    color: "#e94560",
  },
  {
    id: 2,
    name: "Esports Arena Delhi",
    category: "Gaming",
    description: "Dedicated gaming venue with 200 rigs, streaming setup, and arena seating.",
    location: "Dwarka, Delhi",
    pricing: "Rs. 25,000 / day",
    contact: "events@esportsarena.in",
    logo: "EA",
    color: "#0f3460",
  },
  {
    id: 3,
    name: "Startup Palace",
    category: "Pitching",
    description: "Premium pitch hall with investor lounges, recording facilities, and networking spaces.",
    location: "Gurugram, Haryana",
    pricing: "Rs. 20,000 / day",
    contact: "hello@startuppalace.in",
    logo: "SP",
    color: "#f5a623",
  },
  {
    id: 4,
    name: "Knowledge Garden",
    category: "Workshop",
    description: "Workshop campus with breakout rooms, AV equipment, and outdoor spaces.",
    location: "Greater Noida, Uttar Pradesh",
    pricing: "Rs. 8,000 / day",
    contact: "book@knowledgegarden.in",
    logo: "KG",
    color: "#00d4aa",
  },
  {
    id: 5,
    name: "TechPark Convention Centre",
    category: "Tech",
    description: "Large-scale convention centre with 2,000+ capacity, multiple halls, and catering access.",
    location: "Electronic City, Bengaluru",
    pricing: "Rs. 40,000 / day",
    contact: "events@techpark.in",
    logo: "TC",
    color: "#9b59b6",
  },
  {
    id: 6,
    name: "The Boardroom Suite",
    category: "Pitching",
    description: "Executive pitch rooms with panoramic city views, ideal for investor days.",
    location: "BKC, Mumbai",
    pricing: "Rs. 12,000 / day",
    contact: "reserve@boardroomsuite.in",
    logo: "BS",
    color: "#e67e22",
  },
];

const DUMMY_CONTACTS = [
  {
    id: 1,
    name: "Arjun Mehta",
    category: "Tech",
    description: "Senior event coordinator with 8+ years in tech summits and hackathons.",
    location: "Delhi, India",
    pricing: "Rs. 5,000 / event",
    contact: "arjun@eventpro.in",
    logo: "AM",
    color: "#e94560",
  },
  {
    id: 2,
    name: "Priya Sharma",
    category: "Workshop",
    description: "Workshop facilitator and curriculum designer with 200+ events delivered.",
    location: "Bengaluru, India",
    pricing: "Rs. 8,000 / day",
    contact: "priya@workshops.in",
    logo: "PS",
    color: "#00d4aa",
  },
  {
    id: 3,
    name: "Rohan Kapoor",
    category: "Gaming",
    description: "Esports event manager and tournament director for major gaming properties.",
    location: "Mumbai, India",
    pricing: "Rs. 10,000 / event",
    contact: "rohan@esportsin.com",
    logo: "RK",
    color: "#0f3460",
  },
  {
    id: 4,
    name: "Neha Gupta",
    category: "Pitching",
    description: "Startup ecosystem builder, pitch coach, and investor relations specialist.",
    location: "Gurugram, India",
    pricing: "Rs. 7,500 / event",
    contact: "neha@pitchlab.in",
    logo: "NG",
    color: "#f5a623",
  },
  {
    id: 5,
    name: "Vikram Singh",
    category: "Tech",
    description: "AV and logistics specialist for large-scale conferences and expos.",
    location: "Greater Noida, India",
    pricing: "Rs. 4,000 / day",
    contact: "vikram@avlogistics.in",
    logo: "VS",
    color: "#9b59b6",
  },
];

const TEMPLATES = {
  hackathon: {
    title: "Hackathon",
    label: "Build",
    color: "#e94560",
    timeline: [
      { phase: "Week 1-2", task: "Venue booking, sponsor outreach, theme finalization" },
      { phase: "Week 3-4", task: "Participant registration opens, judge selection" },
      { phase: "Week 5", task: "Marketing push and community outreach" },
      { phase: "Day -1", task: "Setup, check-in desk, and technical rehearsal" },
      { phase: "Day 1", task: "Opening ceremony and hacking begins" },
      { phase: "Day 2", task: "Presentations, judging, and prize distribution" },
    ],
    checklist: [
      "Venue with reliable internet",
      "Power backup",
      "Food and snacks planned",
      "Mentors assigned",
      "Judging criteria documented",
      "Prize pool secured",
      "Emergency support arranged",
    ],
    budget: { venue: 30000, food: 50000, marketing: 20000, speakers: 15000, prizes: 50000, misc: 15000 },
  },
  workshop: {
    title: "Workshop",
    label: "Learn",
    color: "#00d4aa",
    timeline: [
      { phase: "Week 1", task: "Topic finalization and speaker booking" },
      { phase: "Week 2", task: "Venue booking and registration setup" },
      { phase: "Week 3", task: "Promotion and outreach" },
      { phase: "Day -1", task: "Material printing and AV check" },
      { phase: "Day 1", task: "Session delivery, Q&A, and networking" },
    ],
    checklist: [
      "Projector and screen",
      "Printed handouts",
      "Recording equipment",
      "Certificates ready",
      "Refreshments arranged",
      "Feedback form prepared",
    ],
    budget: { venue: 8000, food: 10000, marketing: 5000, speakers: 20000, prizes: 0, misc: 5000 },
  },
  gaming: {
    title: "Gaming Tournament",
    label: "Play",
    color: "#9b59b6",
    timeline: [
      { phase: "Week 1-2", task: "Game title selection and prize pool confirmation" },
      { phase: "Week 3", task: "Team registrations and bracket creation" },
      { phase: "Week 4", task: "Promotion in gaming communities" },
      { phase: "Day -1", task: "Rig, console, and stream setup" },
      { phase: "Tournament Day", task: "Group stage, playoffs, and final" },
    ],
    checklist: [
      "Gaming rigs or consoles prepared",
      "LAN setup ready",
      "Live stream setup tested",
      "Commentators booked",
      "Referees assigned",
      "Prize distribution plan",
      "Anti-cheat process defined",
    ],
    budget: { venue: 25000, food: 15000, marketing: 10000, speakers: 5000, prizes: 40000, misc: 10000 },
  },
  pitching: {
    title: "Pitch Event",
    label: "Pitch",
    color: "#f5a623",
    timeline: [
      { phase: "Week 1", task: "Application form live and judge outreach" },
      { phase: "Week 2-3", task: "Startup screening and shortlisting" },
      { phase: "Week 4", task: "Pitch coaching sessions" },
      { phase: "Day -1", task: "Pitch order, AV test, and investor briefing" },
      { phase: "Event Day", task: "Presentations, networking, and awards" },
    ],
    checklist: [
      "Investor panel confirmed",
      "Pitch deck portal ready",
      "Timer system on stage",
      "Recording arranged",
      "Networking lounge planned",
      "Media coverage booked",
    ],
    budget: { venue: 20000, food: 25000, marketing: 15000, speakers: 30000, prizes: 50000, misc: 10000 },
  },
};

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "sponsors", label: "Sponsors" },
  { id: "venues", label: "Venues" },
  { id: "contacts", label: "Contacts" },
  { id: "ai", label: "AI Planner" },
  { id: "budget", label: "Budget" },
  { id: "templates", label: "Templates" },
];

function formatMoney(value) {
  return `Rs. ${Number(value).toLocaleString("en-IN")}`;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed.");
  }

  return data;
}

function readStoredUser() {
  try {
    const value = window.localStorage.getItem("confluence-user");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user) {
  if (!user) {
    window.localStorage.removeItem("confluence-user");
    return;
  }

  window.localStorage.setItem("confluence-user", JSON.stringify(user));
}

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [contactModal, setContactModal] = useState(null);
  const [contactMessage, setContactMessage] = useState("");
  const [contactNotice, setContactNotice] = useState("");
  const [chatModal, setChatModal] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState("");
  const [aiForm, setAiForm] = useState({ type: "hackathon", budget: "", audience: "", location: "" });
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [budget, setBudget] = useState({ venue: "", food: "", marketing: "", speakers: "", misc: "" });
  const [activeTemplate, setActiveTemplate] = useState("hackathon");
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const chatEndRef = useRef(null);

  const isTablet = viewportWidth < 960;
  const isPhone = viewportWidth < 640;

  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatModal]);

  const openAuthModal = (mode) => {
    setAuthModal(mode);
    setAuthError("");
    setAuthNotice("");
    setAuthForm({ name: "", email: "", password: "" });
  };

  const closeAuthModal = () => {
    setAuthModal(null);
    setAuthError("");
    setAuthNotice("");
    setAuthForm({ name: "", email: "", password: "" });
  };

  const handleAuth = async () => {
    const isLogin = authModal === "login";
    const trimmedName = authForm.name.trim();
    const trimmedEmail = authForm.email.trim().toLowerCase();
    const password = authForm.password;

    if (!isLogin && !trimmedName) {
      setAuthError("Please enter your full name.");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");
    setAuthNotice("");

    try {
      const path = isLogin ? "/auth/login" : "/auth/signup";
      const payload = isLogin
        ? { email: trimmedEmail, password }
        : { name: trimmedName, email: trimmedEmail, password };

      const data = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setUser(data.user);
      writeStoredUser(data.user);
      setAuthNotice(data.message || (isLogin ? "Logged in successfully." : "Account created successfully."));

      window.setTimeout(() => {
        closeAuthModal();
      }, 700);
    } catch (error) {
      setAuthError(error.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    writeStoredUser(null);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    if (nextPage !== "home") {
      setActiveCategory("All");
    }
  };

  const filterItems = (items) =>
    items.filter((item) => {
      const query = search.toLowerCase();
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

  const totalBudget = Object.values(budget).reduce((sum, value) => sum + (Number.parseFloat(value) || 0), 0);
  const sponsorshipNeeded = Math.max(0, totalBudget * 0.6);

  const runAI = () => {
    setAiLoading(true);

    window.setTimeout(() => {
      const template = TEMPLATES[aiForm.type];
      const budgetAmount = Number.parseFloat(aiForm.budget) || 100000;
      const suggestedVenues = DUMMY_VENUES.filter((venue) => venue.category === template.title.split(" ")[0]).slice(0, 2);
      const suggestedSponsors = DUMMY_SPONSORS.filter((sponsor) => sponsor.category === template.title.split(" ")[0]).slice(0, 2);

      setAiResult({
        summary: `For a ${template.title.toLowerCase()} with ${formatMoney(budgetAmount)}, around ${aiForm.audience || "100"} attendees, and a target location of ${aiForm.location || "your city"}, here is a starter plan.`,
        venues: suggestedVenues.length ? suggestedVenues : DUMMY_VENUES.slice(0, 2),
        sponsors: suggestedSponsors.length ? suggestedSponsors : DUMMY_SPONSORS.slice(0, 2),
        plan: template.timeline.slice(0, 4),
      });
      setAiLoading(false);
    }, 900);
  };

  const sendChatMessage = (listing) => {
    if (!chatInput.trim()) {
      return;
    }

    const key = `${listing.id}-${listing.name}`;
    const outgoing = {
      from: user?.name || "You",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((previous) => ({
      ...previous,
      [key]: [...(previous[key] || []), outgoing],
    }));
    setChatInput("");

    window.setTimeout(() => {
      const reply = {
        from: listing.name,
        text: "Thanks for reaching out. We will follow up shortly with details for your event.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((previous) => ({
        ...previous,
        [key]: [...(previous[key] || []), reply],
      }));
    }, 700);
  };

  const handleContactSend = () => {
    if (!contactMessage.trim()) {
      setContactNotice("Please enter a short message before sending.");
      return;
    }

    setContactNotice("Message prepared. Use the listed email to continue the conversation.");
    setContactMessage("");
  };

  const S = {
    app: {
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'DM Sans', sans-serif",
    },
    nav: {
      background: COLORS.primary,
      borderBottom: `1px solid ${COLORS.border}`,
      padding: isPhone ? "0.9rem 1rem" : "0.9rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      flexWrap: "wrap",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    logo: {
      fontSize: 20,
      fontWeight: 800,
      color: "#fff",
      letterSpacing: "-0.5px",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    navLinks: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      justifyContent: isPhone ? "center" : "flex-start",
      flex: 1,
      minWidth: isPhone ? "100%" : "auto",
    },
    navLink: (active) => ({
      padding: "6px 14px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      border: "none",
      background: active ? COLORS.accent : "transparent",
      color: active ? "#fff" : COLORS.muted,
    }),
    authBtn: (primary) => ({
      padding: "7px 18px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      border: primary ? "none" : `1px solid ${COLORS.border}`,
      background: primary ? COLORS.accent : "transparent",
      color: "#fff",
      opacity: authLoading ? 0.8 : 1,
    }),
    hero: {
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent2} 60%, #0d0d1a 100%)`,
      padding: isPhone ? "4rem 1rem 3rem" : "5rem 2rem 4rem",
      textAlign: "center",
    },
    heroTitle: {
      fontSize: "clamp(2rem, 5vw, 3.2rem)",
      fontWeight: 800,
      color: "#fff",
      lineHeight: 1.15,
      marginBottom: "1rem",
    },
    section: {
      padding: isPhone ? "2.2rem 1rem" : "3rem 2rem",
      maxWidth: 1200,
      margin: "0 auto",
    },
    sectionTitle: {
      fontSize: 26,
      fontWeight: 700,
      color: "#fff",
      marginBottom: 6,
    },
    sectionSub: {
      color: COLORS.muted,
      marginBottom: "2rem",
      fontSize: 14,
    },
    catBtn: (active, color) => ({
      padding: "7px 18px",
      borderRadius: 50,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      border: `2px solid ${active ? color : COLORS.border}`,
      background: active ? color : "transparent",
      color: active ? "#fff" : COLORS.muted,
    }),
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
      gap: "1.25rem",
    },
    card: {
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 14,
      padding: "1.25rem",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: "0.75rem",
    },
    avatar: (color) => ({
      width: 42,
      height: 42,
      borderRadius: 10,
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      fontWeight: 700,
      color: "#fff",
      flexShrink: 0,
    }),
    cardName: {
      fontSize: 15,
      fontWeight: 700,
      color: "#fff",
      marginBottom: 2,
    },
    catTag: (color) => ({
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 50,
      fontSize: 11,
      fontWeight: 600,
      background: `${color}22`,
      color,
      border: `1px solid ${color}44`,
    }),
    cardDesc: {
      color: COLORS.muted,
      fontSize: 13,
      lineHeight: 1.6,
      marginBottom: "0.75rem",
    },
    cardMeta: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: "0.75rem",
    },
    metaItem: {
      fontSize: 12,
      color: COLORS.muted,
    },
    cardActions: {
      display: "flex",
      gap: 8,
    },
    btn: (primary) => ({
      flex: 1,
      padding: "8px 0",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      border: primary ? "none" : `1px solid ${COLORS.border}`,
      background: primary ? COLORS.accent : "transparent",
      color: primary ? "#fff" : COLORS.muted,
    }),
    modal: {
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem",
    },
    modalBox: {
      background: COLORS.card,
      borderRadius: 16,
      padding: "2rem",
      width: "100%",
      maxWidth: 440,
      border: `1px solid ${COLORS.border}`,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 700,
      color: "#fff",
      marginBottom: "1.5rem",
    },
    input: {
      width: "100%",
      padding: "10px 14px",
      background: COLORS.primary,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      color: "#fff",
      fontSize: 14,
      outline: "none",
      boxSizing: "border-box",
      marginBottom: 12,
    },
    label: {
      fontSize: 12,
      color: COLORS.muted,
      marginBottom: 4,
      display: "block",
    },
    innerCard: {
      background: COLORS.cardLight,
      borderRadius: 12,
      padding: "1.25rem",
      marginBottom: "1rem",
      border: `1px solid ${COLORS.border}`,
    },
    statCard: {
      background: COLORS.card,
      borderRadius: 12,
      padding: "1.5rem",
      border: `1px solid ${COLORS.border}`,
      textAlign: "center",
    },
    statNum: {
      fontSize: 30,
      fontWeight: 800,
      color: COLORS.accent,
    },
    statLabel: {
      fontSize: 12,
      color: COLORS.muted,
      marginTop: 4,
    },
    timelineItem: {
      display: "flex",
      gap: 10,
      marginBottom: 10,
    },
    dot: (color) => ({
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: color || COLORS.accent,
      marginTop: 5,
      flexShrink: 0,
    }),
    checkItem: {
      display: "flex",
      gap: 8,
      alignItems: "flex-start",
      marginBottom: 8,
      fontSize: 13,
      color: COLORS.muted,
    },
    chatBox: {
      background: COLORS.primary,
      borderRadius: 10,
      padding: "1rem",
      height: 260,
      overflowY: "auto",
      marginBottom: "0.75rem",
    },
    chatMsg: (mine) => ({
      display: "flex",
      justifyContent: mine ? "flex-end" : "flex-start",
      marginBottom: 8,
    }),
    chatBubble: (mine) => ({
      maxWidth: "75%",
      padding: "8px 12px",
      borderRadius: mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
      background: mine ? COLORS.accent : COLORS.card,
      fontSize: 13,
      color: "#fff",
    }),
    status: (tone) => ({
      borderRadius: 10,
      padding: "0.8rem 1rem",
      marginBottom: "1rem",
      fontSize: 13,
      background:
        tone === "error" ? "rgba(255, 107, 107, 0.14)" : tone === "success" ? "rgba(0, 212, 170, 0.14)" : "rgba(245, 166, 35, 0.14)",
      border:
        tone === "error"
          ? `1px solid ${COLORS.danger}55`
          : tone === "success"
            ? `1px solid ${COLORS.success}55`
            : `1px solid ${COLORS.warning}55`,
      color: tone === "error" ? COLORS.danger : tone === "success" ? COLORS.success : COLORS.warning,
    }),
  };

  const ListingCard = ({ item }) => (
    <div
      style={S.card}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-4px)";
        event.currentTarget.style.boxShadow = "0 12px 40px rgba(233, 69, 96, 0.15)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "";
        event.currentTarget.style.boxShadow = "";
      }}
    >
      <div style={S.cardHeader}>
        <div style={S.avatar(item.color)}>{item.logo}</div>
        <div>
          <div style={S.cardName}>{item.name}</div>
          <span style={S.catTag(CATEGORY_COLORS[item.category] || COLORS.accent)}>{item.category}</span>
        </div>
      </div>
      <p style={S.cardDesc}>{item.description}</p>
      <div style={S.cardMeta}>
        <span style={S.metaItem}>Location: {item.location}</span>
        {item.pricing ? <span style={S.metaItem}>Pricing: {item.pricing}</span> : null}
      </div>
      <div style={S.cardActions}>
        <button
          style={S.btn(true)}
          onClick={() => {
            if (!user) {
              openAuthModal("login");
              return;
            }
            setContactNotice("");
            setContactMessage("");
            setContactModal(item);
          }}
        >
          Contact
        </button>
        <button
          style={S.btn(false)}
          onClick={() => {
            if (!user) {
              openAuthModal("login");
              return;
            }
            setChatModal(item);
          }}
        >
          Chat
        </button>
      </div>
    </div>
  );

  const CategoryFilter = () => (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1.5rem" }}>
      {["All", "Tech", "Gaming", "Workshop", "Pitching"].map((category) => (
        <button
          key={category}
          style={S.catBtn(activeCategory === category, CATEGORY_COLORS[category] || COLORS.accent)}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );

  const EmptyState = ({ message }) => (
    <div style={{ ...S.innerCard, color: COLORS.muted, textAlign: "center" }}>{message}</div>
  );

  const AuthForm = () => (
    <div style={S.modal} onClick={(event) => event.target === event.currentTarget && closeAuthModal()}>
      <div style={S.modalBox}>
        <div style={S.modalTitle}>{authModal === "login" ? "Welcome Back" : "Create Account"}</div>
        {authError ? <div style={S.status("error")}>{authError}</div> : null}
        {authNotice ? <div style={S.status("success")}>{authNotice}</div> : null}
        {authModal === "signup" ? (
          <>
            <label style={S.label}>Full Name</label>
            <input
              style={S.input}
              placeholder="Your name"
              value={authForm.name}
              onChange={(event) => setAuthForm((previous) => ({ ...previous, name: event.target.value }))}
            />
          </>
        ) : null}
        <label style={S.label}>Email</label>
        <input
          style={S.input}
          type="email"
          placeholder="you@example.com"
          value={authForm.email}
          onChange={(event) => setAuthForm((previous) => ({ ...previous, email: event.target.value }))}
        />
        <label style={S.label}>Password</label>
        <input
          style={S.input}
          type="password"
          placeholder="At least 6 characters"
          value={authForm.password}
          onChange={(event) => setAuthForm((previous) => ({ ...previous, password: event.target.value }))}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleAuth();
            }
          }}
        />
        <button
          style={{ ...S.btn(true), width: "100%", padding: 12, fontSize: 14, marginTop: 4 }}
          onClick={handleAuth}
          disabled={authLoading}
        >
          {authLoading ? "Please wait..." : authModal === "login" ? "Login" : "Create Account"}
        </button>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: COLORS.muted }}>
          {authModal === "login" ? "No account yet? " : "Already have an account? "}
          <span
            style={{ color: COLORS.accent, cursor: "pointer" }}
            onClick={() => openAuthModal(authModal === "login" ? "signup" : "login")}
          >
            {authModal === "login" ? "Sign up" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    if (page === "sponsors") {
      const sponsors = filterItems(DUMMY_SPONSORS);
      return (
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Sponsors</h2>
          <p style={S.sectionSub}>Find sponsors that fit your event format and budget.</p>
          <CategoryFilter />
          {sponsors.length ? (
            <div style={S.grid}>{sponsors.map((item) => <ListingCard key={item.id} item={item} />)}</div>
          ) : (
            <EmptyState message="No sponsors match the current search and category filters." />
          )}
        </div>
      );
    }

    if (page === "venues") {
      const venues = filterItems(DUMMY_VENUES);
      return (
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Venues</h2>
          <p style={S.sectionSub}>Browse event spaces for workshops, tournaments, and pitch days.</p>
          <CategoryFilter />
          {venues.length ? (
            <div style={S.grid}>{venues.map((item) => <ListingCard key={item.id} item={item} />)}</div>
          ) : (
            <EmptyState message="No venues match the current search and category filters." />
          )}
        </div>
      );
    }

    if (page === "contacts") {
      const contacts = filterItems(DUMMY_CONTACTS);
      return (
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Contacts</h2>
          <p style={S.sectionSub}>Connect with experienced event professionals.</p>
          <CategoryFilter />
          {contacts.length ? (
            <div style={S.grid}>{contacts.map((item) => <ListingCard key={item.id} item={item} />)}</div>
          ) : (
            <EmptyState message="No contacts match the current search and category filters." />
          )}
        </div>
      );
    }

    if (page === "ai") {
      return (
        <div style={S.section}>
          <h2 style={S.sectionTitle}>AI Event Planner</h2>
          <p style={S.sectionSub}>Describe your event and get a fast planning guide.</p>
          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: "2rem" }}>
            <div style={S.innerCard}>
              <label style={S.label}>Event Type</label>
              <select
                style={{ ...S.input, marginBottom: 14 }}
                value={aiForm.type}
                onChange={(event) => setAiForm((previous) => ({ ...previous, type: event.target.value }))}
              >
                {Object.keys(TEMPLATES).map((key) => (
                  <option key={key} value={key}>
                    {TEMPLATES[key].title}
                  </option>
                ))}
              </select>
              <label style={S.label}>Total Budget</label>
              <input
                style={S.input}
                placeholder="e.g. 200000"
                value={aiForm.budget}
                onChange={(event) => setAiForm((previous) => ({ ...previous, budget: event.target.value }))}
              />
              <label style={S.label}>Audience Size</label>
              <input
                style={S.input}
                placeholder="e.g. 200"
                value={aiForm.audience}
                onChange={(event) => setAiForm((previous) => ({ ...previous, audience: event.target.value }))}
              />
              <label style={S.label}>Location</label>
              <input
                style={S.input}
                placeholder="e.g. Greater Noida"
                value={aiForm.location}
                onChange={(event) => setAiForm((previous) => ({ ...previous, location: event.target.value }))}
              />
              <button
                style={{ ...S.btn(true), width: "100%", padding: "12px", fontSize: 14, marginTop: 4 }}
                onClick={runAI}
                disabled={aiLoading}
              >
                {aiLoading ? "Generating plan..." : "Generate Plan"}
              </button>
            </div>

            {aiResult ? (
              <div>
                <div style={{ ...S.innerCard, borderColor: COLORS.accent, marginBottom: "1rem" }}>
                  <div style={{ color: COLORS.accent, fontWeight: 700, marginBottom: 6, fontSize: 14 }}>Plan Ready</div>
                  <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>{aiResult.summary}</p>
                </div>

                <div style={{ ...S.innerCard, marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: 10, fontSize: 14 }}>Suggested Venues</div>
                  {aiResult.venues.map((venue) => (
                    <div key={venue.id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                      <div style={S.avatar(venue.color)}>{venue.logo}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{venue.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.muted }}>{venue.pricing}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ ...S.innerCard, marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: 10, fontSize: 14 }}>Suggested Sponsors</div>
                  {aiResult.sponsors.map((sponsor) => (
                    <div key={sponsor.id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                      <div style={S.avatar(sponsor.color)}>{sponsor.logo}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{sponsor.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.muted }}>{sponsor.pricing}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={S.innerCard}>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: 10, fontSize: 14 }}>Timeline</div>
                  {aiResult.plan.map((step, index) => (
                    <div key={`${step.phase}-${index}`} style={S.timelineItem}>
                      <div style={S.dot(COLORS.accent)} />
                      <div>
                        <span style={{ color: COLORS.accent, fontSize: 12, fontWeight: 600 }}>{step.phase}: </span>
                        <span style={{ color: COLORS.muted, fontSize: 12 }}>{step.task}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.muted,
                  fontSize: 14,
                  border: `2px dashed ${COLORS.border}`,
                  borderRadius: 12,
                  minHeight: 250,
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                Fill in the form and generate your plan.
              </div>
            )}
          </div>
        </div>
      );
    }

    if (page === "budget") {
      return (
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Budget Calculator</h2>
          <p style={S.sectionSub}>Plan your event finances with a clear funding view.</p>
          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: "2rem" }}>
            <div style={S.innerCard}>
              {[
                ["venue", "Venue Cost"],
                ["food", "Food and Beverages"],
                ["marketing", "Marketing"],
                ["speakers", "Speakers"],
                ["misc", "Miscellaneous"],
              ].map(([key, label]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={S.label}>{label}</label>
                  <input
                    style={S.input}
                    type="number"
                    placeholder="0"
                    value={budget[key]}
                    onChange={(event) => setBudget((previous) => ({ ...previous, [key]: event.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div>
              <div style={{ ...S.statCard, marginBottom: "1rem", borderColor: COLORS.accent }}>
                <div style={S.statNum}>{formatMoney(Math.round(totalBudget))}</div>
                <div style={S.statLabel}>Total Budget Required</div>
              </div>
              <div style={{ ...S.statCard, marginBottom: "1rem" }}>
                <div style={{ ...S.statNum, color: COLORS.success }}>{formatMoney(Math.round(totalBudget * 0.4))}</div>
                <div style={S.statLabel}>Self Funding at 40 Percent</div>
              </div>
              <div style={{ ...S.statCard, marginBottom: "1rem" }}>
                <div style={{ ...S.statNum, color: COLORS.gold }}>{formatMoney(Math.round(sponsorshipNeeded))}</div>
                <div style={S.statLabel}>Sponsorship Needed at 60 Percent</div>
              </div>
              <div style={S.innerCard}>
                {[
                  ["venue", "Venue"],
                  ["food", "Food"],
                  ["marketing", "Marketing"],
                  ["speakers", "Speakers"],
                  ["misc", "Misc"],
                ].map(([key, label]) => {
                  const value = Number.parseFloat(budget[key]) || 0;
                  const percentage = totalBudget > 0 ? ((value / totalBudget) * 100).toFixed(1) : "0.0";

                  return (
                    <div key={key} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: COLORS.muted }}>{label}</span>
                        <span style={{ color: "#fff" }}>{percentage}%</span>
                      </div>
                      <div style={{ height: 5, background: COLORS.primary, borderRadius: 50 }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${percentage}%`,
                            background: COLORS.accent,
                            borderRadius: 50,
                            transition: "width 0.4s",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (page === "templates") {
      const template = TEMPLATES[activeTemplate];

      return (
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Event Templates</h2>
          <p style={S.sectionSub}>Ready-made timelines, checklists, and budget structures.</p>
          <div style={{ display: "flex", gap: 10, marginBottom: "2rem", flexWrap: "wrap" }}>
            {Object.keys(TEMPLATES).map((key) => (
              <button
                key={key}
                style={{
                  padding: "9px 20px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: activeTemplate === key ? "none" : `1px solid ${COLORS.border}`,
                  background: activeTemplate === key ? COLORS.accent : "transparent",
                  color: activeTemplate === key ? "#fff" : COLORS.muted,
                }}
                onClick={() => setActiveTemplate(key)}
              >
                {TEMPLATES[key].label} {TEMPLATES[key].title}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <div style={{ ...S.innerCard, borderColor: template.color }}>
                <div style={{ fontWeight: 700, color: "#fff", marginBottom: 14, fontSize: 16 }}>{template.title} Timeline</div>
                {template.timeline.map((item, index) => (
                  <div key={`${item.phase}-${index}`} style={S.timelineItem}>
                    <div style={S.dot(template.color)} />
                    <div>
                      <span style={{ color: template.color, fontSize: 12, fontWeight: 600 }}>{item.phase}: </span>
                      <span style={{ color: COLORS.muted, fontSize: 13 }}>{item.task}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={S.innerCard}>
                <div style={{ fontWeight: 700, color: "#fff", marginBottom: 12, fontSize: 15 }}>Checklist</div>
                {template.checklist.map((item, index) => (
                  <div key={`${item}-${index}`} style={S.checkItem}>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        border: `2px solid ${template.color}`,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={S.innerCard}>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 14, fontSize: 15 }}>Budget Structure</div>
              {Object.entries(template.budget).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "9px 0",
                    borderBottom: `1px solid ${COLORS.border}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: COLORS.muted, textTransform: "capitalize" }}>{key}</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{formatMoney(value)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 15, fontWeight: 700 }}>
                <span style={{ color: "#fff" }}>Total Estimate</span>
                <span style={{ color: template.color }}>
                  {formatMoney(Object.values(template.budget).reduce((sum, value) => sum + value, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div style={S.hero}>
          <h1 style={S.heroTitle}>
            Find <span style={{ color: COLORS.accent }}>Sponsors</span>, Venues,
            <br />
            and Contacts for Your Event
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 16, marginBottom: "2.5rem" }}>
            One place to plan hackathons, workshops, gaming events, and pitch days.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: isPhone ? "column" : "row",
              maxWidth: 560,
              margin: "0 auto",
              background: "#fff",
              borderRadius: isPhone ? 18 : 50,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            }}
          >
            <input
              style={{
                flex: 1,
                padding: "13px 22px",
                border: "none",
                fontSize: 15,
                outline: "none",
                color: "#333",
              }}
              placeholder="Search sponsors, venues, contacts..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                if (event.target.value) {
                  setPage("sponsors");
                  setActiveCategory("All");
                }
              }}
            />
            <button
              style={{
                padding: "13px 26px",
                background: COLORS.accent,
                color: "#fff",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
              }}
              onClick={() => setPage("sponsors")}
            >
              Search
            </button>
          </div>
        </div>

        <div style={S.section}>
          <h2 style={S.sectionTitle}>Browse by Category</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.25rem",
              marginTop: "1.25rem",
            }}
          >
            {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
              <div
                key={category}
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}44`,
                  borderRadius: 14,
                  padding: "1.75rem 1rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "";
                }}
                onClick={() => {
                  setActiveCategory(category);
                  setPage("sponsors");
                }}
              >
                <div style={{ fontSize: 13, marginBottom: 10, color, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                  {category.slice(0, 4)}
                </div>
                <div style={{ fontWeight: 700, color, fontSize: 17 }}>{category}</div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 5 }}>
                  {{
                    Tech: "Hackathons and summits",
                    Gaming: "Esports and tournaments",
                    Workshop: "Skill workshops",
                    Pitching: "Pitch competitions",
                  }[category]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.section}>
          <h2 style={S.sectionTitle}>Featured Listings</h2>
          <p style={S.sectionSub}>Top-rated sponsors and venues this month.</p>
          <div style={S.grid}>
            {[...DUMMY_SPONSORS.slice(0, 2), ...DUMMY_VENUES.slice(0, 2)].map((item) => (
              <ListingCard key={`${item.id}-${item.name}`} item={item} />
            ))}
          </div>
        </div>

        <div style={{ background: COLORS.primary, padding: isPhone ? "2.4rem 1rem" : "3rem 2rem" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2 style={{ ...S.sectionTitle, textAlign: "center", marginBottom: "2rem" }}>Platform at a Glance</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem" }}>
              {[
                ["500+", "Events Organized"],
                ["120+", "Active Sponsors"],
                ["80+", "Verified Venues"],
                ["1,200+", "Organizers"],
              ].map(([value, label]) => (
                <div key={label} style={S.statCard}>
                  <div style={S.statNum}>{value}</div>
                  <div style={S.statLabel}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const activeChatKey = chatModal ? `${chatModal.id}-${chatModal.name}` : null;
  const activeChatMessages = activeChatKey ? chatMessages[activeChatKey] || [] : [];

  return (
    <div style={S.app}>
      <nav style={S.nav}>
        <div style={S.logo} onClick={() => setPage("home")}>
          The<span style={{ color: COLORS.accent }}>Confluence</span>
        </div>
        <div style={S.navLinks}>
          {NAV_ITEMS.map((item) => (
            <button key={item.id} style={S.navLink(page === item.id)} onClick={() => handlePageChange(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {user ? (
            <>
              <div style={{ ...S.avatar(COLORS.accent), width: 34, height: 34, fontSize: 13 }}>
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <button style={S.authBtn(false)} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button style={S.authBtn(false)} onClick={() => openAuthModal("login")}>
                Login
              </button>
              <button style={S.authBtn(true)} onClick={() => openAuthModal("signup")}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {renderPage()}

      {authModal ? <AuthForm /> : null}
      {contactModal ? (
        <div style={S.modal} onClick={(event) => event.target === event.currentTarget && setContactModal(null)}>
          <div style={S.modalBox}>
            <div style={S.modalTitle}>Contact {contactModal.name}</div>
            <div style={{ ...S.innerCard, marginBottom: "1.25rem" }}>
              <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 5 }}>Email</div>
              <div style={{ color: COLORS.accent, fontWeight: 600, fontSize: 14 }}>{contactModal.contact}</div>
              {contactModal.pricing ? (
                <>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 10, marginBottom: 5 }}>Pricing</div>
                  <div style={{ color: "#fff", fontSize: 14 }}>{contactModal.pricing}</div>
                </>
              ) : null}
            </div>
            {contactNotice ? <div style={S.status("success")}>{contactNotice}</div> : null}
            <label style={S.label}>Your Message</label>
            <textarea
              style={{ ...S.input, height: 90, resize: "vertical" }}
              placeholder="Introduce yourself and your event..."
              value={contactMessage}
              onChange={(event) => setContactMessage(event.target.value)}
            />
            <button style={{ ...S.btn(true), width: "100%", padding: 12, fontSize: 14 }} onClick={handleContactSend}>
              Send Message
            </button>
          </div>
        </div>
      ) : null}

      {chatModal ? (
        <div style={S.modal} onClick={(event) => event.target === event.currentTarget && setChatModal(null)}>
          <div style={{ ...S.modalBox, maxWidth: 460 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
              <div style={S.avatar(chatModal.color)}>{chatModal.logo}</div>
              <div>
                <div style={S.cardName}>{chatModal.name}</div>
                <div style={{ fontSize: 12, color: COLORS.success }}>Available</div>
              </div>
            </div>
            <div style={S.chatBox}>
              {!activeChatMessages.length ? (
                <div style={{ textAlign: "center", color: COLORS.muted, fontSize: 13, marginTop: "4rem" }}>
                  Start the conversation.
                </div>
              ) : null}
              {activeChatMessages.map((message, index) => {
                const isMine = message.from === (user?.name || "You");

                return (
                  <div key={`${message.time}-${index}`} style={S.chatMsg(isMine)}>
                    <div style={S.chatBubble(isMine)}>
                      <div>{message.text}</div>
                      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2, textAlign: "right" }}>{message.time}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{ ...S.input, flex: 1, marginBottom: 0 }}
                placeholder="Type a message..."
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendChatMessage(chatModal);
                  }
                }}
              />
              <button style={{ ...S.btn(true), flex: "0 0 auto", padding: "10px 16px" }} onClick={() => sendChatMessage(chatModal)}>
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <Analytics />
    </div>
  );
}
