import React, { useEffect, useState, useRef } from "react";

// Single-file React component for a homepage designed for people with special needs.
// - TailwindCSS classes are used for styling (no imports required per canvas rules)
// - Accessibility-first: semantic HTML, ARIA attributes, keyboard focus states, large hit targets
// - Includes: Hero, Features, Visual Schedule, Community Callout, Footer
// - Simple voice navigation (Web Speech API) and Adaptive UI toggles

export default function SpecialNeedsHubHomepage() {
  // Adaptive UI state
  const [fontSize, setFontSize] = useState(18);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sensoryMode, setSensoryMode] = useState(false); // sensory-friendly mode

  // Voice nav
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Example schedule items
  const [schedule, setSchedule] = useState([
    { id: 1, time: "09:00", title: "Morning Routine", icon: "☀️" },
    { id: 2, time: "11:00", title: "Speech Practice", icon: "🗣️" },
    { id: 3, time: "14:00", title: "Sensory Break", icon: "🌿" },
  ]);

  useEffect(() => {
    // Setup Web Speech API for voice navigation (basic)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const r = new SpeechRecognition();
    r.lang = "en-US";
    r.interimResults = false;
    r.maxAlternatives = 1;

    r.onresult = (e) => {
      const transcript = e.results[0][0].transcript.toLowerCase().trim();
      handleVoiceCommand(transcript);
    };

    r.onend = () => setListening(false);

    recognitionRef.current = r;
  }, []);

  function startVoice() {
    if (!recognitionRef.current) return;
    setListening(true);
    try { recognitionRef.current.start(); } catch (e) { /* ignore start errors */ }
  }

  function stopVoice() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  }

  function handleVoiceCommand(cmd) {
    // Basic voice nav commands
    if (cmd.includes("go to resources") || cmd.includes("resources")) {
      document.getElementById("resources")?.focus();
    } else if (cmd.includes("open schedule") || cmd.includes("schedule")) {
      document.getElementById("schedule")?.focus();
    } else if (cmd.includes("toggle contrast")) {
      setHighContrast(h => !h);
    } else if (cmd.includes("increase text") || cmd.includes("bigger text")) {
      setFontSize(s => Math.min(28, s + 2));
    } else if (cmd.includes("decrease text") || cmd.includes("smaller text")) {
      setFontSize(s => Math.max(14, s - 2));
    } else if (cmd.includes("help") || cmd.includes("what can i say")) {
      alert(
        "Try commands like: 'Go to resources', 'Open schedule', 'Toggle contrast', 'Increase text'"
      );
    } else {
      // fallback: announce unrecognized
      alert(`Sorry — I didn't understand: \n\"${cmd}\"`);
    }
  }

  // Accessibility helpers
  const focusable = "focus:outline-none focus:ring-4 focus:ring-offset-2";

  return (
    <div
      className={`min-h-screen ${highContrast ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}
      style={{ fontSize }}
    >
      {/* Topbar / Utility bar */}
      <header className="w-full border-b" role="banner">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#main" className="text-2xl font-bold" aria-label="Go to main content">SpecialNeeds Hub</a>

          <nav aria-label="Top utility">
            <ul className="flex items-center gap-3">
              <li>
                <button
                  onClick={() => setSensoryMode(s => !s)}
                  className={`px-3 py-2 rounded-lg ${focusable}`}
                  aria-pressed={sensoryMode}
                >
                  Sensory Mode
                </button>
              </li>
              <li>
                <button
                  onClick={() => setReducedMotion(m => !m)}
                  className={`px-3 py-2 rounded-lg ${focusable}`}
                  aria-pressed={reducedMotion}
                >
                  Reduced Motion
                </button>
              </li>
              <li>
                <button
                  onClick={() => setHighContrast(c => !c)}
                  className={`px-3 py-2 rounded-lg ${focusable}`}
                  aria-pressed={highContrast}
                >
                  High Contrast
                </button>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <label htmlFor="fontRange" className="sr-only">Font size</label>
                  <input
                    id="fontRange"
                    type="range"
                    min={14}
                    max={28}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    aria-label="Adjust font size"
                  />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main id="main" tabIndex={-1} className="max-w-6xl mx-auto px-4 py-10">
        <section
          className={`rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center ${sensoryMode ? "bg-white" : "bg-gradient-to-r from-indigo-50 to-white"}`}
          aria-labelledby="hero-title"
          style={{ transition: reducedMotion ? "none" : "all 300ms ease" }}
        >
          <div>
            <h1 id="hero-title" className="text-3xl md:text-4xl font-extrabold leading-tight">
              A kinder, simpler web — built for everyone.
            </h1>
            <p className="mt-4 text-lg">
              Tools, routines, and community spaces designed for people with special needs and their
              caregivers. Customize your experience, learn at your pace, and connect safely.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#features"
                className={`inline-block px-5 py-3 rounded-lg shadow-md ${focusable}`}
                role="button"
              >
                Explore features
              </a>

              <button
                onClick={() => startVoice()}
                onPointerDown={() => startVoice()}
                onPointerUp={() => stopVoice()}
                className={`inline-block px-5 py-3 rounded-lg ${focusable}`}
                aria-pressed={listening}
                aria-label="Start voice navigation"
              >
                {listening ? "Listening..." : "Voice navigation"}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a href="#schedule" id="schedule" className="p-3 rounded-lg border ${focusable}">
                Visual Schedule
              </a>
              <a href="#community" id="resources" className="p-3 rounded-lg border ${focusable}">
                Community & Resources
              </a>
            </div>
          </div>

          <div aria-hidden={sensoryMode} className="flex items-center justify-center">
            {/* Illustration placeholder: could be an SVG or accessible image */}
            <svg
              width="320"
              height="220"
              viewBox="0 0 320 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Illustration: happy diverse group"
            >
              <rect width="320" height="220" rx="16" fill="#EEF2FF" />
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18">
                Inclusive illustration
              </text>
            </svg>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-12">
          <h2 className="text-2xl font-bold">Key features</h2>
          <p className="mt-2">Designed around independence, learning, and connection.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <article className="p-4 rounded-lg border" tabIndex={0} aria-labelledby="f1">
              <h3 id="f1" className="font-semibold">Adaptive Learning</h3>
              <p className="mt-2">Multimodal lessons that adapt to pace and preferences (audio, text, visuals).</p>
            </article>

            <article className="p-4 rounded-lg border" tabIndex={0} aria-labelledby="f2">
              <h3 id="f2" className="font-semibold">Visual Schedules</h3>
              <p className="mt-2">Drag-and-drop daily routines with images, alarms, and caregiver sync.</p>
            </article>

            <article className="p-4 rounded-lg border" tabIndex={0} aria-labelledby="f3">
              <h3 id="f3" className="font-semibold">Safe Community</h3>
              <p className="mt-2">Moderated spaces for families, peer groups, and professionals.</p>
            </article>
          </div>
        </section>

        {/* Visual Schedule */}
        <section id="schedule" className="mt-12" aria-labelledby="schedule-title">
          <h2 id="schedule-title" className="text-2xl font-bold">Visual Schedule</h2>
          <p className="mt-2">Create predictable routines with picture-based cards and simple timers.</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {schedule.map(item => (
              <div key={item.id} className="p-4 rounded-lg border flex items-center gap-3" tabIndex={0}>
                <div className="text-2xl" aria-hidden>{item.icon}</div>
                <div>
                  <div className="font-semibold">{item.time}</div>
                  <div className="text-sm">{item.title}</div>
                </div>
                <div className="ml-auto flex gap-2">
                  <button
                    aria-label={`Mark ${item.title} complete`}
                    className={`px-3 py-1 rounded ${focusable}`}
                    onClick={() => setSchedule(s => s.filter(si => si.id !== item.id))}
                  >
                    Done
                  </button>
                </div>
              </div>
            ))}

            {/* Quick add UI */}
            <AddScheduleCard
              onAdd={(newItem) => setSchedule(s => [...s, { id: Date.now(), ...newItem }])}
            />
          </div>
        </section>

        {/* Community callout */}
        <section id="community" className="mt-12 rounded-2xl p-6 bg-white border" aria-labelledby="community-title">
          <h2 id="community-title" className="text-2xl font-bold">Community & Caregiver Space</h2>
          <p className="mt-2">Join moderated groups, find local services, and book short consultations with specialists.</p>

          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <a href="#" className={`px-4 py-3 rounded-lg ${focusable}`} role="button">Find groups</a>
            <a href="#" className={`px-4 py-3 rounded-lg ${focusable}`} role="button">Book a consult</a>
            <a href="#" className={`px-4 py-3 rounded-lg ${focusable}`} role="button">Resource library</a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 py-8 border-t">
          <div className="max-w-6xl mx-auto px-4 text-sm flex flex-col md:flex-row justify-between gap-4">
            <div>
              <strong>SpecialNeeds Hub</strong>
              <div>Built for accessibility — contact us at <a href="mailto:hello@specialneedshub.example">hello@specialneedshub.example</a></div>
            </div>
            <nav aria-label="Footer">
              <ul className="flex gap-4">
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Accessibility</a></li>
              </ul>
            </nav>
          </div>
        </footer>
      </main>
    </div>
  );
}


// --- Small subcomponents below ---

function AddScheduleCard({ onAdd }) {
  const [time, setTime] = useState(15 + ":00");
  const [title, setTitle] = useState("");

  return (
    <div className="p-4 rounded-lg border" role="region" aria-label="Add schedule card">
      <h4 className="font-semibold">Add item</h4>
      <label className="sr-only">Time</label>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="mt-2 block w-full p-2 rounded"
      />
      <label className="sr-only">Title</label>
      <input
        type="text"
        placeholder="Title (e.g. Snack)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-2 block w-full p-2 rounded"
      />
      <button
        onClick={() => {
          if (!title) return alert("Please enter a title");
          onAdd({ time, title, icon: "🟢" });
          setTitle("");
        }}
        className="mt-3 px-3 py-2 rounded-lg"
      >
        Add
      </button>
    </div>
  );
}
