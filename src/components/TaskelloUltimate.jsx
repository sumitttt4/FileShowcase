import React, { useState, useEffect } from 'react';
import {
  Moon, Sun, FileText, ChevronLeft, MoreHorizontal,
  ArrowUpRight, Presentation, Archive, Video, Plus
} from 'lucide-react';

/**
 * Taskello "Ultimate" Replica
 * Focus: High-fidelity color matching (Deep Reds/Creams), 
 * precise geometry, and fluid physics-based interactions.
 */

const TaskelloUltimate = () => {
  const [isDark, setIsDark] = useState(true); // Default to Dark (Magma)
  const [viewState, setViewState] = useState('summary'); // 'summary' | 'details'

  // Counters
  const [docCount, setDocCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);

  const [mounted, setMounted] = useState(false);

  // 3D Parallax Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (isDetails) return; // Disable tilt when expanded

    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;

    const centerX = box.width / 2;
    const centerY = box.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -4; // Max rotation deg
    const rotateYValue = ((x - centerX) / centerX) * 4;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setGlarePos({ x: (x / box.width) * 100, y: (y / box.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  // Prevent hydration mismatch & animate counters
  useEffect(() => {
    setMounted(true);

    // Only animate if we are in the summary view
    if (viewState === 'summary') {

      // 1. Animate Docs (Slow count: 1... 2... 3... 4... 5)
      let currentDoc = 0;
      const targetDoc = 5;
      const docTimer = setInterval(() => {
        currentDoc += 1;
        if (currentDoc <= targetDoc) setDocCount(currentDoc);
        else clearInterval(docTimer);
      }, 250); // Updates every 250ms

      // 2. Animate Notes (Fast count: 0 -> 1270)
      let currentNote = 0;
      const targetNote = 1270;
      const duration = 2000; // 2 seconds total duration
      const totalSteps = 60; // Total number of updates
      const increment = Math.ceil(targetNote / totalSteps);
      const intervalTime = duration / totalSteps;

      const noteTimer = setInterval(() => {
        currentNote += increment;
        if (currentNote >= targetNote) {
          setNoteCount(targetNote);
          clearInterval(noteTimer);
        } else {
          setNoteCount(currentNote);
        }
      }, intervalTime);

      // Cleanup
      return () => {
        clearInterval(docTimer);
        clearInterval(noteTimer);
      };
    } else {
      // Reset counters when leaving summary so they animate again when returning
      setDocCount(0);
      setNoteCount(0);
    }
  }, [viewState]);

  if (!mounted) return null;

  const toggleView = () => setViewState(prev => prev === 'summary' ? 'details' : 'summary');
  const isDetails = viewState === 'details';

  // Docs data for the expanded view
  const docs = [
    { id: 1, title: 'Q3 Financials.pdf', date: '2 hrs ago', size: '2.4 MB', type: 'pdf', color: 'bg-red-500' },
    { id: 2, title: 'Brand Guidelines.key', date: 'Yesterday', size: '14 MB', type: 'key', color: 'bg-blue-500' },
    { id: 3, title: 'Design Sync_Final.m4a', date: 'Oct 23', size: '4.2 MB', type: 'voice', color: 'bg-emerald-500' }, // NEW: Active Audio Item
    { id: 4, title: 'User Interview_01.mp4', date: 'Oct 24', size: '450 MB', type: 'vid', color: 'bg-purple-500' },
    { id: 5, title: 'Launch Assets', date: 'Oct 20', size: '128 MB', type: 'zip', color: 'bg-yellow-500' },
  ];

  return (
    <div
      className={`
        min-h-screen w-full flex flex-col items-center justify-center p-6 
        transition-colors duration-700 ease-out font-sans relative
        ${isDark ? 'bg-[#050505]' : 'bg-[#F2F2F7]'}
      `}
      style={{ backfaceVisibility: 'hidden' }}
    >
      {/* Open Source "Dot Matrix" Pattern Background (Figma-esque) */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(#ffffff 1.5px, transparent 1.5px)'
            : 'radial-gradient(#1a1a1a 1.5px, transparent 1.5px)', // Dark grey/black for high visibility in light mode
          backgroundSize: '24px 24px',
          opacity: isDark ? 0.08 : 0.07 // Optimized opacity for the darker dots
        }}
      />
      {/* --- Procedural Noise Filter --- */}
      <svg className="hidden">
        <filter id="noiseFilterUltimate">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0.33 0 0 0 0  0 0.33 0 0 0  0 0 0.33 0 0  0 0 0 0.4 0" />
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
      </svg>

      {/* --- Toggle Controls --- */}
      <div className={`mb-12 transition-all duration-700 ${isDetails ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => setIsDark(!isDark)}
          className={`
            relative flex items-center w-[80px] h-[44px] rounded-full p-1 cursor-pointer
            transition-all duration-500 hover:scale-105 active:scale-95 shadow-lg
            ${isDark
              ? 'bg-[#1C1C1E] border border-[#2C2C2E]'
              : 'bg-[#E5E5EA] border border-white'
            }
          `}
        >
          {/* Icons Track */}
          <div className="absolute inset-0 flex justify-between items-center px-3">
            <Sun size={16} className={`transition-all duration-300 ${isDark ? 'opacity-30 text-gray-500' : 'opacity-100 text-amber-500 scale-110'}`} />
            <Moon size={16} className={`transition-all duration-300 ${isDark ? 'opacity-100 text-indigo-400 scale-110' : 'opacity-30 text-gray-400'}`} />
          </div>
          {/* Thumb */}
          <div
            className={`
              relative z-10 w-9 h-9 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] 
              transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              flex items-center justify-center
              ${isDark ? 'translate-x-[36px] bg-[#3A3A3C]' : 'translate-x-0 bg-white'}
            `}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-amber-500'}`} />
          </div>
        </button>
      </div>

      {/* --- The Card Container --- */}
      <div
        onClick={!isDetails ? toggleView : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`
          relative group
          transition-[width,height,border-radius,transform,box-shadow] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isDetails ? 'w-[360px] h-[640px] cursor-default rounded-[40px]' : 'w-[340px] h-[340px] cursor-pointer rounded-[36px] hover:scale-[1.02]'}
          overflow-hidden
          ${isDark
            ? 'bg-[#151516] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]'
            : 'bg-[#F3F2EA] shadow-[0_25px_50px_-12px_rgba(100,90,80,0.25)]'
          }
        `}
        style={{
          willChange: 'width, height, transform',
          transform: isDetails
            ? 'translateZ(0) rotateX(0deg) rotateY(0deg)'
            : `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`,
          backfaceVisibility: 'hidden'
        }}
      >

        {/* Dynamic Glare Overlay */}
        <div
          className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, transparent 80%)`
          }}
        />

        {/* === 1. HEADER (The "Deep Ember" Gradient) === */}
        <div
          className={`
            absolute inset-x-0 top-0 w-full z-0
            transition-[height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isDetails ? 'h-[28%]' : 'h-[55%]'}
          `}
          style={{
            willChange: 'height',
            transform: 'translateZ(0)'
          }}
        >
          {/* Animated "Lava" Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div
              className="absolute inset-0 scale-110 animate-magma-flow"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0) scale(1.1)'
              }}
            >
              {/* Deep base */}
              <div className="absolute inset-0 bg-black"></div>

              {/* The "Embers" - Optimized blur values for performance */}
              <div className="absolute top-[-50%] left-[-20%] w-[120%] h-[120%] bg-[#4a0404] blur-[40px] rounded-full mix-blend-screen opacity-100"></div>
              <div className="absolute top-[0%] right-[-20%] w-[100%] h-[100%] bg-[#b91c1c] blur-[35px] rounded-full mix-blend-screen opacity-90"></div>
              <div className="absolute bottom-[-20%] left-[10%] w-[80%] h-[80%] bg-[#ea580c] blur-[30px] rounded-full mix-blend-screen opacity-80"></div>

              {/* Highlight flare */}
              <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] bg-white blur-[35px] opacity-30 mix-blend-overlay"></div>
            </div>

            {/* Noise & Vignette Overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ filter: 'url(#noiseFilterUltimate)' }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          </div>

          {/* Navigation (Back Button) */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleView(); }}
            className={`
              absolute top-6 left-6 z-30 p-2.5 rounded-full backdrop-blur-md bg-black/20 text-white/90 border border-white/10
              transition-all duration-500 hover:bg-black/40
              ${isDetails ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}
            `}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          {/* Header Text */}
          <div
            className={`
              absolute z-10 text-right transition-all duration-700
              ${isDetails ? 'top-8 right-8' : 'top-6 right-6'}
            `}
          >
            <h3 className="text-white text-[13px] font-bold tracking-wider uppercase opacity-90 drop-shadow-lg">
              Taskello App<br />
              <span className="opacity-70 font-normal normal-case tracking-normal text-[15px]">Design Vault</span>
            </h3>
          </div>
        </div>

        {/* === 2. BODY (The "Folder" Shape) === */}
        <div
          className={`
            absolute bottom-0 w-full z-10
            transition-[height,border-radius] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isDetails ? 'h-[75%] rounded-t-[32px]' : 'h-[62%] rounded-b-[36px]'}
            ${isDark ? 'bg-[#151516]' : 'bg-[#F3F2EA]'} 
          `}
          style={{
            willChange: 'height',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* -- The Tab Geometry -- */}
          {/* Only visible in summary mode to create that "cutout" look */}
          <div
            className={`
               absolute -top-[50px] left-0 w-[58%] h-[50px]
               rounded-tr-[28px] 
               transition-[opacity,transform] duration-400 ease-out
               ${isDark ? 'bg-[#151516]' : 'bg-[#F3F2EA]'}
               ${isDetails ? 'opacity-0 scale-y-0 origin-bottom' : 'opacity-100 scale-y-100'}
             `}
            style={{
              willChange: 'opacity, transform',
              transform: isDetails ? 'scaleY(0) translateZ(0)' : 'scaleY(1) translateZ(0)'
            }}
          >
            {/* The "Inverse" Radius Curve */}
            <div
              className="absolute bottom-0 -right-[28px] w-[28px] h-[28px]"
              style={{
                background: isDark
                  ? 'radial-gradient(circle at top right, transparent 28px, #151516 28px)'
                  : 'radial-gradient(circle at top right, transparent 28px, #F3F2EA 28px)'
              }}
            />
          </div>

          {/* -- Content Container -- */}
          <div className="relative h-full flex flex-col">

            {/* Title Block */}
            <div className={`px-8 pt-2 transition-all duration-700 ${isDetails ? 'translate-y-4' : '-translate-y-[42px] z-20'}`}>
              <h1
                className={`
                   font-bold tracking-tight mb-1 transition-all duration-500 leading-none
                   ${isDark ? 'text-white' : 'text-[#2D2D2E]'}
                   ${isDetails ? 'text-2xl' : 'text-[22px]'}
                 `}
              >
                Daily memo
              </h1>
              <div className="flex items-center justify-between mt-1.5">
                <p
                  className={`
                     text-[15px] font-medium transition-colors duration-500
                     ${isDark ? 'text-[#8E8E93]' : 'text-[#86868B]'}
                   `}
                >
                  Notes & Journaling
                </p>

                {/* Option Dots (Detail view only) */}
                <div className={`transition-all duration-500 ${isDetails ? 'opacity-100' : 'opacity-0 scale-50'}`}>
                  <MoreHorizontal size={22} className={isDark ? 'text-[#8E8E93]' : 'text-[#86868B]'} />
                </div>
              </div>
            </div>

            {/* === SUMMARY VIEW CONTENT === */}
            <div
              className={`
                 absolute bottom-0 left-0 w-full px-8 pb-10 pt-6
                 flex items-end justify-between
                 transition-all duration-500 delay-100
                 ${isDetails ? 'opacity-0 translate-y-12 pointer-events-none' : 'opacity-100 translate-y-0'}
               `}
            >
              {/* Divider Line */}
              <div className={`absolute top-0 left-8 right-8 h-[1px] ${isDark ? 'bg-white/10' : 'bg-black/5'}`} />

              <div className="flex items-baseline space-x-2">
                {/* Counter */}
                <span
                  className={`
                     text-[56px] leading-none font-light tracking-tighter tabular-nums
                     transition-colors duration-500
                     ${isDark ? 'text-white' : 'text-[#1D1D1F]'}
                   `}
                >
                  0{docCount}
                </span>
                <span
                  className={`
                     text-xl font-medium mb-1.5
                     transition-colors duration-500
                     ${isDark ? 'text-[#636366]' : 'text-[#86868B]'}
                   `}
                >
                  Doc
                </span>
              </div>
              <div className="mb-2.5">
                {/* Animated Notes Counter */}
                <span className={`text-[15px] font-bold tracking-wide tabular-nums ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}>
                  {noteCount} Notes
                </span>
              </div>
            </div>

            {/* === DETAIL VIEW CONTENT (List) === */}
            <div
              className={`
                 flex-1 overflow-y-auto mt-8 px-5 pb-6 space-y-3
                 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                 ${isDetails ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-24 pointer-events-none'}
               `}
              style={{
                willChange: 'opacity, transform',
                transform: isDetails ? 'translateY(0) translateZ(0)' : 'translateY(3rem) translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              {docs.map((doc, idx) => (
                <div
                  key={doc.id}
                  className={`
                     group relative flex items-center p-3.5 rounded-2xl cursor-pointer overflow-hidden
                     transition-all duration-300 border border-transparent
                     ${isDark
                      ? 'hover:bg-white/5 active:bg-white/10'
                      : 'hover:bg-white active:bg-white/80 hover:shadow-sm hover:border-black/5'
                    }
                   `}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  {/* File Icon or Waveform */}
                  <div
                    className={`
                       w-[52px] h-[52px] rounded-[18px] flex items-center justify-center mr-4 shadow-sm relative overflow-hidden
                       ${isDark ? 'bg-[#2C2C2E]' : 'bg-[#FFFFFF]'}
                     `}
                  >
                    <div className={`absolute inset-0 opacity-10 ${doc.color}`} />

                    {/* Render Icon based on Type */}
                    {doc.type === 'pdf' && <FileText size={22} className={isDark ? 'text-red-400' : 'text-red-500'} strokeWidth={2} />}
                    {doc.type === 'key' && <Presentation size={22} className={isDark ? 'text-blue-400' : 'text-blue-500'} strokeWidth={2} />}
                    {doc.type === 'vid' && <Video size={22} className={isDark ? 'text-purple-400' : 'text-purple-500'} strokeWidth={2} />}
                    {doc.type === 'zip' && <Archive size={22} className={isDark ? 'text-yellow-400' : 'text-yellow-500'} strokeWidth={2} />}

                    {/* NEW: Active Audio Visualizer for Voice Notes */}
                    {doc.type === 'voice' && (
                      <div className="flex items-end gap-[3px] h-3.5">
                        <div className="w-[3px] bg-emerald-500 rounded-full animate-equalizer" style={{ animationDelay: '0ms' }} />
                        <div className="w-[3px] bg-emerald-500 rounded-full animate-equalizer" style={{ animationDelay: '150ms' }} />
                        <div className="w-[3px] bg-emerald-500 rounded-full animate-equalizer" style={{ animationDelay: '300ms' }} />
                        <div className="w-[3px] bg-emerald-500 rounded-full animate-equalizer" style={{ animationDelay: '75ms' }} />
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[15px] font-semibold truncate mb-0.5 ${isDark ? 'text-gray-100' : 'text-[#1D1D1F]'}`}>
                      {doc.title}
                    </h4>
                    <p className={`text-[13px] ${isDark ? 'text-[#8E8E93]' : 'text-[#86868B]'}`}>
                      {doc.date} <span className="mx-1 opacity-50">|</span> {doc.size}
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  <div className={`
                     w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                     ${isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}
                     opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
                   `}>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              ))}

              {/* Add Button */}
              <div className={`
                 mt-6 py-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer
                 transition-all duration-300
                 ${isDark
                  ? 'border-[#3A3A3C] text-[#8E8E93] hover:border-[#636366] hover:text-white hover:bg-white/5'
                  : 'border-[#D1D1D6] text-[#86868B] hover:border-[#AEAEB2] hover:text-[#1D1D1F] hover:bg-black/5'
                }
               `}>
                <div className="flex items-center gap-2">
                  <Plus size={18} strokeWidth={2.5} />
                  <span className="text-sm font-semibold">Create New Note</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Global Texture (Grain) - Crucial for the "Paper" feel */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4] mix-blend-overlay z-20"
          style={{ filter: 'url(#noiseFilterUltimate)' }}
        ></div>

      </div>

      <style>{`
        @keyframes magma-flow {
          0%, 100% { transform: scale(1.1) rotate(0deg) translateZ(0); }
          50% { transform: scale(1.15) rotate(1deg) translateZ(0); }
        }
        @keyframes equalizer {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        .animate-magma-flow {
          animation: magma-flow 12s ease-in-out infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .animate-equalizer {
          animation: equalizer 1s ease-in-out infinite;
        }
        /* GPU acceleration for smooth animations */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        /* Hide scrollbar for clean UI */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default TaskelloUltimate;
