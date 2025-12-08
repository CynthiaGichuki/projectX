import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Shield, Users, Eye } from "lucide-react";
import "../styles/carousel.css";

// --- Theme Constants ---
const GOLD = "var(--gold)";
const GOLD_DEEP = "var(--gold-deep)";
const BG_DARK = "var(--bg-dark-2)";
const DOT_INACTIVE = "var(--bg-dark)";
const GOLD_RGB = "249, 178, 51";


// --- Slide Data ---
const slides = [
  {
    id: 1,
    title: "Transparent Governance",
    icon: Eye,
    description:
      "Every vote, every decision, every milestone is cryptographically verified and publicly accessible on the blockchain.",
    color: GOLD, // Now only used for shadow and dot accent, not background
  },
  {
    id: 2,
    title: "Citizen Empowerment",
    icon: Users,
    description:
      "Your voice matters. Propose projects, vote on initiatives, and track implementation in real-time with complete transparency.",
    color: GOLD,
  },
  {
    id: 3,
    title: "Verified Trust",
    icon: Shield,
    description:
      "Independent experts verify every milestone. Smart contracts ensure funds are released only when work is validated.",
    color: GOLD,
  },
];

// --- Main Carousel Component ---
export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () =>
    setCurrentIndex(
      currentIndex === 0 ? slides.length - 1 : currentIndex - 1
    );

  const next = () =>
    setCurrentIndex(
      currentIndex === slides.length - 1 ? 0 : currentIndex + 1
    );

  const getSlide = (offset) =>
    slides[(currentIndex + offset + slides.length) % slides.length];

  return (
    <div className="carousel-wrapper">
      <div className="carousel">
        
        {/* Left preview */}
        <div className="side-card left" onClick={prev}>
          <SlidePreview slide={getSlide(-1)} />
        </div>

        {/* Main center card */}
        <div className="main-card">
          <SlideFull slide={slides[currentIndex]} />
        </div>

        {/* Right preview */}
        <div className="side-card right" onClick={next}>
          <SlidePreview slide={getSlide(1)} />
        </div>

        {/* Buttons (Icons colored gold for better visibility/theming) */}
        <button className="nav-btn left-btn" onClick={prev}>
          <ChevronLeft size={22} style={{ color: GOLD }} />
        </button>

        <button className="nav-btn right-btn" onClick={next}>
          <ChevronRight size={22} style={{ color: GOLD }} />
        </button>
      </div>

      {/* Dots (Colored gold/dark gray) */}
      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`dot ${i === currentIndex ? "active" : ""}`}
            style={{
              backgroundColor:
                i === currentIndex ? GOLD : DOT_INACTIVE,
              boxShadow:
                i === currentIndex ? `0 0 10px ${GOLD_RGB}80` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// --- Sub-Components ---

function SlidePreview({ slide }) {
  const Icon = slide.icon;
  return (
    <div
      className="slide-preview"
      style={{ 
        backgroundColor: BG_DARK,
        boxShadow: `0 8px 30px -5px rgba(${GOLD_RGB},50)` 
      }}
    >
      <Icon className="icon" style={{ color: GOLD }} /> 
      <h3>{slide.title}</h3>
    </div>
  );
}

function SlideFull({ slide }) {
  const Icon = slide.icon;
  return (
    <div
      className="slide-full"
      style={{
        backgroundColor: BG_DARK, 
         boxShadow: `0 10px 50px -5px rgba(${GOLD_RGB},0.7)`
      }}
    >
      <div className="header">
        <Icon className="icon-large" style={{ color: GOLD }} />
        <h2 style={{ color: GOLD }}>{slide.title}</h2>
      </div>

      <p className="description">{slide.description}</p>

      <span className="number">0{slide.id}</span>
    </div>
  );
}