// src/components/Demopage.jsx
import React, { useState, useEffect, useRef } from "react";
import "@fontsource/poppins";
import "@fontsource/montserrat";
import plantsData from "./plants.json";

/* ─── Global animation styles injected once ─────────────────────────────── */
const GLOBAL_STYLES = `
  @keyframes floatLeaf {
    0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0; }
    10%  { opacity: 0.75; }
    90%  { opacity: 0.55; }
    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
  }

  @keyframes sway {
    0%, 100% { margin-left: 0px; }
    25%       { margin-left: 30px; }
    75%       { margin-left: -30px; }
  }

  @keyframes soundWave {
    0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
    50%       { transform: scaleY(1);   opacity: 1;   }
  }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  @keyframes fadeSlideOut {
    from { opacity: 1; transform: translateY(0);    }
    to   { opacity: 0; transform: translateY(-28px); }
  }

  @keyframes heroReveal {
    from { opacity: 0; transform: scale(1.04) translateY(16px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }

  @keyframes progressPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(46,125,50,0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(46,125,50,0);  }
  }

  .leaf {
    position: fixed;
    top: -60px;
    font-size: 22px;
    pointer-events: none;
    z-index: 0;
    user-select: none;
    animation: floatLeaf linear infinite, sway ease-in-out infinite;
  }

  .page-enter {
    animation: fadeSlideIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .hero-reveal {
    animation: heroReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  .card-hover {
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
                box-shadow 0.25s ease;
  }
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(46,125,50,0.18);
  }

  .btn-bounce {
    transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.2s;
  }
  .btn-bounce:hover  { transform: translateY(-3px) scale(1.04); }
  .btn-bounce:active { transform: scale(0.96); }

  .progress-active {
    animation: progressPulse 1.4s ease-in-out infinite;
  }

  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.12s; }
  .stagger-3 { animation-delay: 0.20s; }
  .stagger-4 { animation-delay: 0.28s; }
`;

/* ─── Floating leaves layer ─────────────────────────────────────────────── */
const LEAVES = [
  { left: "6%",  dur: 12, swayDur: 4.5, delay: 0,   emoji: "🍃" },
  { left: "22%", dur: 17, swayDur: 5.8, delay: 3,   emoji: "🌿" },
  { left: "40%", dur: 15, swayDur: 4.0, delay: 6,   emoji: "🍃" },
  { left: "58%", dur: 20, swayDur: 6.2, delay: 1.5, emoji: "🌿" },
  { left: "74%", dur: 18, swayDur: 5.0, delay: 9,   emoji: "🍃" },
  { left: "90%", dur: 13, swayDur: 3.8, delay: 4.5, emoji: "🌿" },
];

const FloatingLeaves = () => (
  <>
    {LEAVES.map((l, i) => (
      <div
        key={i}
        className="leaf"
        style={{
          left: l.left,
          animationDuration: `${l.dur}s, ${l.swayDur}s`,
          animationDelay: `${l.delay}s, ${l.delay}s`,
        }}
      >
        {l.emoji}
      </div>
    ))}
  </>
);

/* ─── Main component ────────────────────────────────────────────────────── */
const Navbar = () => {
  const [darkMode, setDarkMode]       = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [quizAnswer, setQuizAnswer]   = useState(null);
  const [pageKey, setPageKey]         = useState(0); // triggers re-mount animation

  /* Audio state */
  const [isPlaying, setIsPlaying]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]     = useState(0);
  const audioRef = useRef(null);

  const getSlug = () => window.location.hash.replace(/^#\/?/, "").trim();
  const [slug, setSlug] = useState(getSlug);

  /* Inject global styles once */
  useEffect(() => {
    const tag = document.createElement("style");
    tag.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  useEffect(() => {
    const handler = () => {
      setSlug(window.location.hash.replace(/^#\/?/, "").trim());
      setOpenAccordion(null);
      setQuizAnswer(null);
      stopAudio();
      setPageKey((k) => k + 1); // restart enter animation
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  /* ── Audio helpers ─────────────────────────────────────────────────────── */
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleListen = () => {
    if (!plant?.voiceFile) return;
    if (isPlaying) { stopAudio(); return; }

    const audio = new Audio(plant.voiceFile);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(100);
    });

    audio.play();
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const bar   = e.currentTarget;
    const ratio = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth;
    audioRef.current.currentTime = ratio * duration;
    setProgress(ratio * 100);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const toggleAccordion = (index) =>
    setOpenAccordion(openAccordion === index ? null : index);

  /* ── Theme ─────────────────────────────────────────────────────────────── */
  const theme = {
    bg:          darkMode ? "bg-[#0f1a14]"          : "bg-[#e8f3ec]",
    text:        darkMode ? "text-[#e6f3ec]"         : "text-[#1c2b22]",
    cardBg:      darkMode ? "bg-[#16241d]"           : "bg-white",
    cardText:    darkMode ? "text-[#e6f3ec]"         : "text-[#1c2b22]",
    cardBorder:  darkMode ? "border border-[#2e7d3240]" : "border border-[#2e7d3220]",
    footerText:  darkMode ? "text-[#a5c8ad]"         : "text-[#4a6652]",
  };

  const plant = plantsData.plants.find((p) => p.slug === slug);

  /* ════════════════════════════════════════════════════════════════════════
     Plant LIST page
  ════════════════════════════════════════════════════════════════════════ */
  if (!slug || !plant) {
    return (
      <div
        key={`list-${pageKey}`}
        className={`${theme.bg} ${theme.text} min-h-screen transition-colors duration-500 font-['Poppins'] overflow-x-hidden relative page-enter`}
      >
        <FloatingLeaves />

        {/* Hero */}
        <section
          className="hero-reveal relative text-white text-center py-[100px] px-[10px] rounded-[40px] overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="font-['Montserrat'] text-[56px] tracking-[3px] drop-shadow-lg">
            BOTANICAL GARDEN
          </h1>
          <p className="text-[20px] mt-[15px] opacity-90">Scan a plant QR to explore</p>
        </section>

        {/* Dark Mode toggle */}
        <div className="flex justify-center py-[20px] px-[30px]">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn-bounce px-[18px] py-[10px] rounded-[30px] bg-[#2e7d32] text-white font-semibold shadow-md"
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Plant list */}
        <div className="my-[40px] space-y-[16px] max-w-[600px] mx-auto px-[20px]">
          <p className="text-center font-semibold text-[#2e7d32] mb-[20px]">
            Select a plant to view:
          </p>
          {plantsData.plants.map((p, i) => (
            <div
              key={p.slug}
              onClick={() => { window.location.hash = "/" + p.slug; }}
              className={`${theme.cardBg} ${theme.cardText} ${theme.cardBorder} p-[18px] rounded-[16px] font-semibold cursor-pointer flex justify-between items-center shadow-md card-hover page-enter stagger-${Math.min(i + 1, 4)}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div>
                <div>{p.name}</div>
                <div className="text-sm font-normal opacity-60">{p.tagline}</div>
              </div>
              <span className="text-[#2e7d32]">▶</span>
            </div>
          ))}
        </div>

        <footer className={`text-center py-[40px] ${theme.footerText}`}>
          Designed &amp; Developed by{" "}
          <span className="text-[#2e7d32] font-semibold">Jay Shinde</span>
        </footer>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════════════
     Plant DETAIL page
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <div
      key={`detail-${slug}-${pageKey}`}
      className={`${theme.bg} ${theme.text} min-h-screen transition-colors duration-500 font-['Poppins'] overflow-x-hidden relative page-enter`}
    >
      <FloatingLeaves />

      {/* Scroll progress indicator */}
      <ScrollProgressBar />

      {/* Hero */}
      <section
        className="hero-reveal relative text-white text-center py-[100px] px-[10px] rounded-[40px] overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('${plant.heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="font-['Montserrat'] text-[56px] tracking-[3px] drop-shadow-lg">
          {plant.name}
        </h1>
        <p className="text-[20px] mt-[15px] opacity-90">{plant.tagline}</p>
      </section>

      {/* Topbar buttons */}
      <div className="flex justify-center items-center gap-[20px] py-[20px] px-[30px] flex-wrap">
        <button
          onClick={handleListen}
          className={`btn-bounce px-[18px] py-[10px] rounded-[30px] font-semibold shadow-md ${
            isPlaying ? "bg-red-500 text-white" : "bg-[#2e7d32] text-white"
          }`}
        >
          {isPlaying ? "⏹ Stop" : plant.listenLabel}
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="btn-bounce px-[18px] py-[10px] rounded-[30px] bg-[#2e7d32] text-white font-semibold shadow-md"
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          onClick={() => { window.location.hash = ""; }}
          className="btn-bounce px-[18px] py-[10px] rounded-[30px] bg-[#1b5e20] text-white font-semibold shadow-md"
        >
          ← All Plants
        </button>
      </div>

      {/* Audio Progress Bar */}
      {(isPlaying || progress > 0) && (
        <div
          className={`mx-[20px] mb-[10px] px-[20px] py-[14px] rounded-[16px] shadow-md ${theme.cardBg} ${theme.cardBorder} page-enter`}
        >
          <div className="flex justify-between items-center mb-[8px]">
            <span className="text-xs font-semibold text-[#2e7d32] truncate max-w-[70%]">
              {isPlaying ? "🔊 Playing..." : "⏹ Stopped"} — {plant.name}
            </span>
            <span className={`text-xs font-mono ${theme.cardText}`}>
              {fmt(currentTime)} / {fmt(duration)}
            </span>
          </div>

          <div
            onClick={handleSeek}
            className="w-full h-[8px] rounded-full cursor-pointer overflow-hidden"
            style={{ background: darkMode ? "#2e7d3240" : "#2e7d3220" }}
          >
            <div
              className={`h-full rounded-full transition-all duration-200 ${isPlaying ? "progress-active" : ""}`}
              style={{
                width: `${progress}%`,
                background: isPlaying
                  ? "linear-gradient(90deg, #2e7d32, #66bb6a)"
                  : "#9e9e9e",
              }}
            />
          </div>

          {isPlaying && (
            <div className="flex items-end justify-center gap-[3px] mt-[10px] h-[18px]">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full bg-[#2e7d32]"
                  style={{
                    animation: `soundWave 0.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                    height: "100%",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Accordion sections */}
      <div className="my-[60px] mx-[20px] space-y-[20px]">
        {plant.sections.map((section, index) => (
          <div
            key={index}
            className="page-enter"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div
              onClick={() => toggleAccordion(index)}
              className={`${theme.cardBg} ${theme.cardText} ${theme.cardBorder} p-[18px] rounded-[16px] font-semibold cursor-pointer flex justify-between items-center shadow-md card-hover`}
            >
              {section.title}
              <span
                className="transition-transform duration-300 text-[#2e7d32]"
                style={{ transform: openAccordion === index ? "rotate(90deg)" : "rotate(0deg)" }}
              >
                ▶
              </span>
            </div>

            <div
              className="overflow-hidden"
              style={{
                maxHeight: openAccordion === index ? "500px" : "0px",
                transition: "max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div
                className={`${theme.cardBg} ${theme.cardText} ${theme.cardBorder} p-[18px] mt-[12px] rounded-[14px] leading-[1.7] shadow-md whitespace-pre-line`}
                style={{
                  opacity: openAccordion === index ? 1 : 0,
                  transform: openAccordion === index ? "translateY(0)" : "translateY(-8px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                }}
              >
                {section.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz */}
      <div className="my-[60px] mx-[20px] page-enter" style={{ animationDelay: "0.3s" }}>
        <div className="bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white p-[20px] rounded-[18px] shadow-lg">
          <b>Quick Quiz</b>
          <br /><br />
          {plant.quiz.question}
          <br />
          {plant.quiz.options.map((option) => {
            const isSelected = quizAnswer === option;
            const isCorrect  = option === plant.quiz.answer;
            let style =
              "btn-bounce mt-[10px] mr-[10px] px-[16px] py-[8px] rounded-[12px] font-semibold ";
            if (!quizAnswer) {
              style += "bg-white text-black hover:bg-gray-100";
            } else if (isSelected && isCorrect) {
              style += "bg-green-400 text-white";
            } else if (isSelected && !isCorrect) {
              style += "bg-red-400 text-white";
            } else if (isCorrect) {
              style += "bg-green-200 text-green-900";
            } else {
              style += "bg-white text-black opacity-50";
            }
            return (
              <button
                key={option}
                className={style}
                onClick={() => !quizAnswer && setQuizAnswer(option)}
              >
                {option}
              </button>
            );
          })}
          {quizAnswer && (
            <p className="mt-[12px] font-semibold text-sm page-enter">
              {quizAnswer === plant.quiz.answer
                ? "✅ Correct!"
                : `❌ Wrong! Answer: ${plant.quiz.answer}`}
            </p>
          )}
        </div>
      </div>

      <footer className={`text-center py-[40px] ${theme.footerText}`}>
        Designed &amp; Developed by{" "}
        <span className="text-[#2e7d32] font-semibold">Jay Shinde</span>
      </footer>
    </div>
  );
};

/* ─── Scroll progress bar component ────────────────────────────────────── */
const ScrollProgressBar = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setWidth(Math.min(pct, 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[4px] z-50 transition-all duration-100"
      style={{
        width: `${width}%`,
        background: "linear-gradient(90deg, #2e7d32, #66bb6a)",
        boxShadow: "0 0 8px rgba(46,125,50,0.6)",
      }}
    />
  );
};

export default Navbar;