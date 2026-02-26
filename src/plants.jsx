// src/components/Demopage.jsx
import React, { useState, useEffect, useRef } from "react";
import "@fontsource/poppins";
import "@fontsource/montserrat";
import plantsData from "./plants.json";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);

  // ── Audio state ─────────────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);       // 0–100
  const [currentTime, setCurrentTime] = useState(0); // seconds
  const [duration, setDuration] = useState(0);       // seconds
  const audioRef = useRef(null);

  const getSlug = () => window.location.hash.replace(/^#\/?/, "").trim();
  const [slug, setSlug] = useState(getSlug);

  useEffect(() => {
    const handler = () => {
      setSlug(window.location.hash.replace(/^#\/?/, "").trim());
      setOpenAccordion(null);
      setQuizAnswer(null);
      stopAudio();
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // ── Stop helper ─────────────────────────────────────────────────────────────
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

  // ── Play / Stop toggle ──────────────────────────────────────────────────────
  const handleListen = () => {
    if (!plant?.voiceFile) return;

    if (isPlaying) {
      stopAudio();
      return;
    }

    const audio = new Audio(plant.voiceFile);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

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

  // ── Seek by clicking progress bar ──────────────────────────────────────────
  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const bar = e.currentTarget;
    const clickX = e.clientX - bar.getBoundingClientRect().left;
    const ratio = clickX / bar.offsetWidth;
    audioRef.current.currentTime = ratio * duration;
    setProgress(ratio * 100);
  };

  // ── Time formatter mm:ss ────────────────────────────────────────────────────
  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const theme = {
    bg: darkMode ? "bg-[#0f1a14]" : "bg-[#e8f3ec]",
    text: darkMode ? "text-[#e6f3ec]" : "text-[#1c2b22]",
    cardBg: darkMode ? "bg-[#16241d]" : "bg-white",
    cardText: darkMode ? "text-[#e6f3ec]" : "text-[#1c2b22]",
    cardBorder: darkMode ? "border border-[#2e7d3240]" : "border border-[#2e7d3220]",
    footerText: darkMode ? "text-[#a5c8ad]" : "text-[#4a6652]",
  };

  const plant = plantsData.plants.find((p) => p.slug === slug);

  // ── Plant list page ─────────────────────────────────────────────────────────
  if (!slug || !plant) {
    return (
      <div className={`${theme.bg} ${theme.text} min-h-screen transition-all duration-300 font-['Poppins'] overflow-x-hidden`}>
        <section
          className="relative text-white text-center py-[100px] px-[10px] rounded-[40px]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="font-['Montserrat'] text-[56px] tracking-[3px]">BOTANICAL GARDEN</h1>
          <p className="text-[20px] mt-[15px]">Scan a plant QR to explore</p>
        </section>

        <div className="flex justify-center items-center gap-[20px] py-[20px] px-[30px]">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-[18px] py-[10px] rounded-[30px] bg-[#2e7d32] text-white font-semibold shadow-md transition"
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="my-[40px] mx-[20px] space-y-[16px] max-w-[600px] mx-auto">
          <p className="text-center font-semibold text-[#2e7d32] mb-[20px]">Select a plant to view:</p>
          {plantsData.plants.map((p) => (
            <div
              key={p.slug}
              onClick={() => { window.location.hash = "/" + p.slug; window.scrollTo(0, 0); }}
              className={`${theme.cardBg} ${theme.cardText} ${theme.cardBorder} p-[18px] rounded-[16px] font-semibold cursor-pointer flex justify-between items-center shadow-md transition hover:-translate-y-1`}
            >
              <div>
                <div>{p.name}</div>
                <div className="text-sm font-normal opacity-60">{p.tagline}</div>
              </div>
              <span>▶</span>
            </div>
          ))}
        </div>

        <footer className={`text-center py-[40px] ${theme.footerText}`}>
          Designed &amp; Developed by <span className="text-[#2e7d32] font-semibold">Jay Shinde</span>
        </footer>
      </div>
    );
  }

  // ── Plant detail page ───────────────────────────────────────────────────────
  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen transition-all duration-300 font-['Poppins'] overflow-x-hidden`}>

      {/* Page Scroll Indicator */}
      <div className="fixed top-0 left-0 h-[4px] bg-[#2e7d32] w-0 z-50"></div>

      {/* Hero */}
      <section
        className="relative text-white text-center py-[100px] px-[10px] rounded-[40px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)), url('${plant.heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="font-['Montserrat'] text-[56px] tracking-[3px]">{plant.name}</h1>
        <p className="text-[20px] mt-[15px]">{plant.tagline}</p>
      </section>

      {/* Topbar */}
      <div className="flex justify-center items-center gap-[20px] py-[20px] px-[30px] flex-wrap">
        <button
          onClick={handleListen}
          className={`px-[18px] py-[10px] rounded-[30px] font-semibold shadow-md hover:-translate-y-1 transition ${
            isPlaying ? "bg-red-500 text-white" : "bg-[#2e7d32] text-white"
          }`}
        >
          {isPlaying ? "⏹ Stop" : plant.listenLabel}
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-[18px] py-[10px] rounded-[30px] bg-[#2e7d32] text-white font-semibold shadow-md transition"
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          onClick={() => { window.location.hash = ""; window.scrollTo(0, 0); }}
          className="px-[18px] py-[10px] rounded-[30px] bg-[#1b5e20] text-white font-semibold shadow-md transition hover:-translate-y-1"
        >
          ← All Plants
        </button>
      </div>

      {/* ── Audio Progress Bar — shown only when audio has been loaded ── */}
      {(isPlaying || progress > 0) && (
        <div className={`mx-[20px] mb-[10px] px-[20px] py-[14px] rounded-[16px] shadow-md ${theme.cardBg} ${theme.cardBorder}`}>

          {/* Track label */}
          <div className="flex justify-between items-center mb-[8px]">
            <span className="text-xs font-semibold text-[#2e7d32] truncate max-w-[70%]">
              {isPlaying ? "🔊 Playing..." : "⏹ Stopped"} — {plant.name}
            </span>
            <span className={`text-xs font-mono ${theme.cardText}`}>
              {fmt(currentTime)} / {fmt(duration)}
            </span>
          </div>

          {/* Clickable progress bar */}
          <div
            onClick={handleSeek}
            className="w-full h-[8px] rounded-full cursor-pointer overflow-hidden"
            style={{ background: darkMode ? "#2e7d3240" : "#2e7d3220" }}
          >
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${progress}%`,
                background: isPlaying
                  ? "linear-gradient(90deg, #2e7d32, #66bb6a)"
                  : "#9e9e9e",
              }}
            />
          </div>

          {/* Animated sound waves when playing */}
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
              <style>{`
                @keyframes soundWave {
                  0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
                  50% { transform: scaleY(1); opacity: 1; }
                }
              `}</style>
            </div>
          )}
        </div>
      )}

      {/* Sections */}
      <div className="my-[60px] mx-[20px] space-y-[20px]">
        {plant.sections.map((section, index) => (
          <div key={index}>
            <div
              onClick={() => toggleAccordion(index)}
              className={`${theme.cardBg} ${theme.cardText} ${theme.cardBorder} p-[18px] rounded-[16px] font-semibold cursor-pointer flex justify-between items-center shadow-md transition`}
            >
              {section.title}
              <span className={`transition-transform duration-300 ${openAccordion === index ? "rotate-90" : ""}`}>▶</span>
            </div>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: openAccordion === index ? "500px" : "0px" }}
            >
              <div className={`${theme.cardBg} ${theme.cardText} ${theme.cardBorder} p-[18px] mt-[12px] rounded-[14px] leading-[1.7] shadow-md whitespace-pre-line`}>
                {section.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz */}
      <div className="my-[60px] mx-[20px]">
        <div className="bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white p-[20px] rounded-[18px]">
          <b>Quick Quiz</b>
          <br /><br />
          {plant.quiz.question}
          <br />
          {plant.quiz.options.map((option) => {
            const isSelected = quizAnswer === option;
            const isCorrect = option === plant.quiz.answer;
            let style = "mt-[10px] mr-[10px] px-[16px] py-[8px] rounded-[12px] font-semibold transition ";
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
              <button key={option} className={style} onClick={() => !quizAnswer && setQuizAnswer(option)}>
                {option}
              </button>
            );
          })}
          {quizAnswer && (
            <p className="mt-[12px] font-semibold text-sm">
              {quizAnswer === plant.quiz.answer ? "✅ Correct!" : `❌ Wrong! Answer: ${plant.quiz.answer}`}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={`text-center py-[40px] ${theme.footerText}`}>
        Designed &amp; Developed by <span className="text-[#2e7d32] font-semibold">Jay Shinde</span>
      </footer>
    </div>
  );
};

export default Navbar;