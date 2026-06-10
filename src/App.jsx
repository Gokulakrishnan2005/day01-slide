import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  ArrowLeft, 
  Brain, 
  Cpu, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Menu, 
  X, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  BookOpen,
  Keyboard,
  Layers,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

// --- Web Audio Synthesizer for High-Tech SFX ---
const playSound = (type = 'click', isMuted = false) => {
  if (isMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'slide') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'confetti') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + index * 0.08);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.04, now + index * 0.08 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.25);
        o.start(now + index * 0.08);
        o.stop(now + index * 0.08 + 0.25);
      });
    }
  } catch (e) {
    console.warn('AudioContext not allowed or not supported yet.', e);
  }
};

// --- Reusable Slide Layout Components ---
const SlideContainer = ({ children, current, index }) => (
  <div 
    className={`absolute inset-0 w-full h-full p-8 md:p-12 flex flex-col transition-all duration-500 ease-out bg-[#070708] ${
      current === index 
        ? 'opacity-100 scale-100 z-10 pointer-events-auto slide-enter' 
        : 'opacity-0 scale-95 z-0 pointer-events-none'
    }`}
  >
    {children}
  </div>
);

const SlideHeader = ({ text }) => (
  <div className="w-full flex justify-between items-start mb-6 border-b border-white/5 pb-4">
    <div className="flex items-center space-x-2">
      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
      <h3 className="text-neutral-500 font-mono text-xs tracking-[0.25em] uppercase font-bold">{text || 'SAGO / AI Foundations'}</h3>
    </div>
    <span className="text-neutral-600 font-mono text-xs">MODULE 01 • BASICS</span>
  </div>
);

const SlideFooter = ({ title, pageNumber }) => (
  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end border-t border-neutral-900 pt-4 mt-auto">
    <span className="text-neutral-500 font-medium tracking-wide text-xs uppercase">{title}</span>
    <span className="text-blue-500 font-mono text-base font-bold bg-blue-950/20 px-2 py-0.5 rounded border border-blue-900/30">
      {String(pageNumber).padStart(2, '0')}
    </span>
  </div>
);

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const totalSlides = 12;

  // --- Slide Data ---
  const slideTitles = [
    "Introduction & Welcome",
    "How Computers Learn (Machine Learning)",
    "The Next-Word Engine (LLMs)",
    "Tool Kit Selection Guide",
    "The Two Phases of AI",
    "Feynman Checkpoint: Day 1",
    "Day 2: Tokens, Context & Model Size",
    "What Is a Token?",
    "The Context Window",
    "Model Size = Brain Size",
    "Day 2 Hands-on Lab",
    "Feynman Checkpoint: Day 2"
  ];

  // --- Sound Effects and slide change trigger ---
  const changeSlide = useCallback((newIndex) => {
    setCurrentSlide(newIndex);
    playSound('slide', isMuted);
    if (newIndex === totalSlides - 1) {
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ffffff']
        });
        playSound('confetti', isMuted);
      }, 500);
    }
  }, [isMuted]);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) changeSlide(currentSlide + 1);
  }, [currentSlide, changeSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) changeSlide(currentSlide - 1);
  }, [currentSlide, changeSlide]);

  // --- Keyboard navigation ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
      if (e.key === '?') {
        setShowShortcuts((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
        setShowShortcuts(false);
      }
      if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // --- Slide 3: Next Word Interactive Simulator ---
  const [promptText, setPromptText] = useState("I'll be there in a");
  const [customPromptInput, setCustomPromptInput] = useState("");
  
  const promptsData = {
    "I'll be there in a": [
      { word: "minute", prob: 71, nextPrompt: "I'll be there in a minute" },
      { word: "second", prob: 19, nextPrompt: "I'll be there in a second" },
      { word: "while", prob: 7, nextPrompt: "I'll be there in a while" },
      { word: "heartbeat", prob: 3, nextPrompt: "I'll be there in a heartbeat" }
    ],
    "I'll be there in a minute": [
      { word: ".", prob: 50, nextPrompt: "I'll be there in a minute." },
      { word: "to", prob: 25, nextPrompt: "I'll be there in a minute to" },
      { word: "and", prob: 15, nextPrompt: "I'll be there in a minute and" },
      { word: "buddy", prob: 10, nextPrompt: "I'll be there in a minute buddy" }
    ],
    "I'll be there in a minute.": [
      { word: "Don't", prob: 40, nextPrompt: "I'll be there in a minute. Don't" },
      { word: "Wait", prob: 30, nextPrompt: "I'll be there in a minute. Wait" },
      { word: "See", prob: 20, nextPrompt: "I'll be there in a minute. See" },
      { word: "Thanks", prob: 10, nextPrompt: "I'll be there in a minute. Thanks" }
    ],
    "The cat sat on the": [
      { word: "mat", prob: 65, nextPrompt: "The cat sat on the mat" },
      { word: "couch", prob: 20, nextPrompt: "The cat sat on the couch" },
      { word: "floor", prob: 10, nextPrompt: "The cat sat on the floor" },
      { word: "laptop", prob: 5, nextPrompt: "The cat sat on the laptop" }
    ],
    "The cat sat on the mat": [
      { word: "and", prob: 50, nextPrompt: "The cat sat on the mat and" },
      { word: "while", prob: 25, nextPrompt: "The cat sat on the mat while" },
      { word: "sleeping", prob: 15, nextPrompt: "The cat sat on the mat sleeping" },
      { word: "happily", prob: 10, nextPrompt: "The cat sat on the mat happily" }
    ],
    "Artificial intelligence is changing the": [
      { word: "world", prob: 55, nextPrompt: "Artificial intelligence is changing the world" },
      { word: "industry", prob: 25, nextPrompt: "Artificial intelligence is changing the industry" },
      { word: "future", prob: 15, nextPrompt: "Artificial intelligence is changing the future" },
      { word: "game", prob: 5, nextPrompt: "Artificial intelligence is changing the game" }
    ]
  };

  const getNextWordPredictions = (phrase) => {
    const trimmed = phrase.trim().replace(/\s+/g, ' ');
    if (promptsData[trimmed]) {
      return promptsData[trimmed];
    }
    
    // Standard random-ish generator for any typed prompt
    const hash = trimmed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const vocabulary = ["future", "system", "outcome", "process", "details", "solution", "value", "growth", "challenge"];
    const seedWords = vocabulary.slice(hash % 5, (hash % 5) + 4);
    
    let remainder = 100;
    const items = seedWords.map((w, index) => {
      const p = index === 3 ? remainder : Math.max(5, Math.floor((remainder - 10) * (0.6 - index * 0.15)));
      remainder -= p;
      return {
        word: w,
        prob: p,
        nextPrompt: trimmed + " " + w
      };
    });
    return items.sort((a, b) => b.prob - a.prob);
  };

  const activePredictions = getNextWordPredictions(promptText);

  // --- Slide 6: Interactive 2 Minute timer ---
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const toggleTimer = () => {
    if (timerRunning) {
      clearInterval(timerRef.current);
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            confetti({ particleCount: 50, spread: 60 });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimeLeft(120);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // --- Slide 8: Custom Interactive Tokenizer ---
  const [tokenizerInput, setTokenizerInput] = useState("hamburger");
  
  const getTokens = (text) => {
    if (!text) return [];
    if (text.toLowerCase().trim() === 'hamburger') {
      return [
        { text: 'ham', id: 2057, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
        { text: 'bur', id: 9624, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
        { text: 'ger', id: 1063, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' }
      ];
    }
    
    // Split into words, spaces, or symbols
    const matches = [...text.matchAll(/(\s+)|([a-zA-Z0-9]+)|([^\s\w]+)/g)];
    const colorClasses = [
      'bg-blue-500/15 text-blue-400 border-blue-500/25',
      'bg-purple-500/15 text-purple-400 border-purple-500/25',
      'bg-pink-500/15 text-pink-400 border-pink-500/25',
      'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
      'bg-amber-500/15 text-amber-400 border-amber-500/25'
    ];

    return matches.map((match, idx) => {
      const val = match[0];
      let hash = 0;
      for (let i = 0; i < val.length; i++) {
        hash = val.charCodeAt(i) + ((hash << 5) - hash);
      }
      const tokenVal = Math.abs(hash % 9999) + 1000;
      return {
        text: val,
        id: tokenVal,
        color: colorClasses[idx % colorClasses.length]
      };
    });
  };

  const currentTokens = getTokens(tokenizerInput);

  // --- Slide 9: Context Window memory visualizer ---
  const initialDocs = [
    { id: 1, name: "Client Onboarding Checklist", tokens: 15000, color: "bg-teal-500/25 border-teal-500/40 text-teal-300" },
    { id: 2, name: "Quarterly Marketing Strategy", tokens: 55000, color: "bg-indigo-500/25 border-indigo-500/40 text-indigo-300" },
    { id: 3, name: "2-Hour Interview Audio Transcript", tokens: 80000, color: "bg-amber-500/25 border-amber-500/40 text-amber-300" },
    { id: 4, name: "SAGO Dev Pipeline Core Codebase", tokens: 110000, color: "bg-rose-500/25 border-rose-500/40 text-rose-300" },
    { id: 5, name: "Industry Competitor Overview Report", tokens: 45000, color: "bg-emerald-500/25 border-emerald-500/40 text-emerald-300" },
  ];

  const [activeContextDocs, setActiveContextDocs] = useState([
    { id: 1, name: "Client Onboarding Checklist", tokens: 15000, color: "bg-teal-500/25 border-teal-500/40 text-teal-300" }
  ]);
  const [droppedContextDocs, setDroppedContextDocs] = useState([]);
  
  const totalContextTokens = activeContextDocs.reduce((sum, d) => sum + d.tokens, 0);

  const addDocToContext = (doc) => {
    setActiveContextDocs((prev) => {
      const updated = [...prev, { ...doc, id: Date.now() }];
      
      // Let's check overflow (200,000 threshold)
      let sum = updated.reduce((s, d) => s + d.tokens, 0);
      const newActive = [...updated];
      const newDropped = [...droppedContextDocs];
      
      while (sum > 200000 && newActive.length > 0) {
        const removed = newActive.shift();
        newDropped.push(removed);
        sum = newActive.reduce((s, d) => s + d.tokens, 0);
      }
      
      if (newDropped.length > droppedContextDocs.length) {
        setDroppedContextDocs(newDropped);
        playSound('click', isMuted);
      }
      return newActive;
    });
  };

  const clearContext = () => {
    setActiveContextDocs([]);
    setDroppedContextDocs([]);
  };

  // --- Slide 10: Model Parameter Size Interactive Slider ---
  const [paramSize, setParamSize] = useState(70);

  const getModelSpec = (size) => {
    if (size <= 10) {
      return {
        label: "Edge / Small Model (e.g. Llama-3-8B, Gemma-7B)",
        capability: "Basic summaries, classification, quick text formatting.",
        speed: "~120 tokens/sec (Blazing Fast)",
        cost: "Ultra cheap (~$0.05 / 1M tokens)",
        hardware: "Can run locally on a phone, laptop, or edge device.",
        rating: "Perfect for high-volume, simple tasks."
      };
    } else if (size <= 90) {
      return {
        label: "Mid-Range / Balanced Model (e.g. Llama-70B, GPT-4o-Mini)",
        capability: "Reasoning, code writing, multi-step agent pipelines, tool use.",
        speed: "~60 tokens/sec (Fast & Responsive)",
        cost: "Very cost-effective (~$0.15 - $0.60 / 1M tokens)",
        hardware: "Requires specialized cloud servers or high-end dev workstations.",
        rating: "The default workhorse for most corporate agent pipelines."
      };
    } else {
      return {
        label: "Frontier / Reasoning Model (e.g. Claude 3.5 Sonnet, GPT-4o, o1)",
        capability: "Complex programming, deep logical reasoning, writing novel papers.",
        speed: "~20 tokens/sec (Slow, Deliberate)",
        cost: "Premium (~$3.00 - $15.00 / 1M tokens)",
        hardware: "Requires multi-GPU computing clusters in data centers.",
        rating: "Best reserved for orchestrators, code creation, and validation."
      };
    }
  };

  const activeSpec = getModelSpec(paramSize);

  // --- Slide 11: Try It Yourself Lab Checklist ---
  const [labChecks, setLabChecks] = useState([false, false, false]);
  const toggleLabCheck = (idx) => {
    setLabChecks((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      if (copy[idx]) {
        playSound('click', isMuted);
        // confetty mini burst
        confetti({
          particleCount: 15,
          spread: 40,
          origin: { y: 0.8 }
        });
      }
      return copy;
    });
  };

  // --- Slide 12: Answer reveal ---
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#030304] flex flex-col items-center justify-center p-4 md:p-6 font-sans text-neutral-100 overflow-hidden relative">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none"></div>

      {/* Main Container: 16:9 Aspect Ratio with premium frame */}
      <div className="relative w-full max-w-6xl aspect-[16/9] bg-[#070708]/90 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/[0.06] overflow-hidden flex flex-col">
        
        {/* --- Top Utility Bar --- */}
        <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
          {/* Audio toggle */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-neutral-900/60 border border-white/5 hover:border-white/20 text-neutral-400 hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute Sound SFX"}
          >
            {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5 text-blue-400" />}
          </button>

          {/* Sidebar trigger */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-neutral-900/60 border border-white/5 hover:border-white/20 text-neutral-400 hover:text-white transition-colors flex items-center space-x-1.5"
            title="Slide Overview"
          >
            <Menu className="w-4.5 h-4.5" />
            <span className="text-xs font-mono hidden md:inline">Index</span>
          </button>

          {/* Keyboard shortcuts helper */}
          <button 
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-2 rounded-lg bg-neutral-900/60 border border-white/5 hover:border-white/20 text-neutral-400 hover:text-white transition-colors"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* --- PAGE 1: TITLE SLIDE --- */}
        <SlideContainer current={currentSlide} index={0}>
          <div className="flex-1 flex flex-col justify-center max-w-4xl pt-4">
            <div className="flex items-center space-x-2.5 mb-4">
              <span className="px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs uppercase tracking-wider">FOUNDATIONS</span>
              <span className="text-neutral-500 font-mono text-xs">• SAGO / MEDIA GROUPS</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight text-white font-display text-gradient">
              WELCOME TO<br/>AI FOUNDATIONS
            </h1>
            <h2 className="text-2xl md:text-3xl text-neutral-400 font-light mb-8">What Actually Is AI?</h2>
            
            <p className="text-lg text-neutral-400 mb-10 max-w-xl leading-relaxed">
              A plain-English starting point for team collaboration — zero math, zero jargon, and zero hype.
            </p>
            
            <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-6 mt-auto">
                <div className="flex space-x-4">
                  <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 h-fit">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                      <p className="text-blue-400 font-mono text-xs mb-1 uppercase tracking-wider">01 / Introduction</p>
                      <ul className="text-neutral-400 text-sm space-y-0.5">
                          <li>Course: AI Foundations</li>
                          <li>Modules: Day 1 & Day 2</li>
                          <li>Audience: New Interns & Developers</li>
                      </ul>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 h-fit">
                    <Layers className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                      <p className="text-purple-400 font-mono text-xs mb-1 uppercase tracking-wider">02 / Deep Dive</p>
                      <ul className="text-neutral-400 text-sm space-y-0.5">
                          <li>Tokens & Context Windows</li>
                          <li>Model Size & Parameter Tradeoffs</li>
                          <li>Hands-on Experiments</li>
                      </ul>
                  </div>
                </div>
            </div>
          </div>
        </SlideContainer>

        {/* --- PAGE 2: MACHINE LEARNING --- */}
        <SlideContainer current={currentSlide} index={1}>
          <SlideHeader />
          <div className="flex-1 flex flex-col pt-2 justify-center">
            <h1 className="text-4xl font-bold mb-1 text-white text-display">How Computers Learn</h1>
            <h2 className="text-blue-400 font-mono tracking-widest uppercase text-xs mb-6">Machine Learning</h2>
            
            <div className="grid grid-cols-2 gap-12 flex-1 items-center">
              <div className="flex flex-col">
                <h3 className="text-2xl md:text-3xl font-medium text-white leading-snug mb-5">
                  It isn't magic. It's pattern recognition at scale.
                </h3>
                <p className="text-neutral-400 leading-relaxed text-sm md:text-base">
                  A model finds repeating signals buried inside enormous quantities of training data, then uses that mathematical pattern to recognize similar concepts in the future.
                </p>
                
                <div className="mt-6 p-4 rounded-xl bg-blue-950/20 border border-blue-900/30 flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-300">
                    <strong>Fact Check:</strong> The AI doesn't understand "what a cat is" the way humans do. It understands the matrix of pixels that frequently correlate with the word "cat".
                  </p>
                </div>
              </div>
              
              <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden dark-glass">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full"></div>
                <h4 className="text-blue-400 font-mono text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
                  <Brain className="w-4 h-4" /> The Cat Analogy
                </h4>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-neutral-950/40 border border-white/5 rounded-xl p-4">
                        <div className="text-neutral-500 text-xs uppercase tracking-wider mb-1">A child</div>
                        <div className="text-3xl font-bold text-white mb-1">10,000</div>
                        <div className="text-neutral-400 text-xs">real cats encountered in everyday life</div>
                    </div>
                    <div className="bg-neutral-950/40 border border-blue-900/20 rounded-xl p-4">
                        <div className="text-blue-400 text-xs uppercase tracking-wider mb-1">A model</div>
                        <div className="text-3xl font-bold text-white mb-1">Millions</div>
                        <div className="text-neutral-400 text-xs">cat photos scanned for geometric features</div>
                    </div>
                </div>
                
                <div className="border-t border-white/5 pt-4">
                    <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1.5">Both end up with</p>
                    <p className="text-sm text-white font-medium bg-neutral-950/50 p-2.5 rounded-lg border border-white/5">
                      The core pattern — pointed ears, whisker structures, facial shapes.
                    </p>
                </div>
              </div>
            </div>
          </div>
          <SlideFooter title="How Computers Learn / AI Foundations" pageNumber={2} />
        </SlideContainer>

        {/* --- PAGE 3: LLMs --- */}
        <SlideContainer current={currentSlide} index={2}>
          <SlideHeader />
          <div className="flex-1 flex flex-col pt-2 justify-center">
            <h1 className="text-4xl font-bold mb-1 text-white text-display">The Next-Word Engine</h1>
            <h2 className="text-blue-400 font-mono tracking-widest uppercase text-xs mb-6">Large Language Model</h2>
            
            <div className="grid grid-cols-5 gap-10 flex-1 items-center">
              <div className="col-span-2 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-medium text-white leading-snug mb-4">
                  It doesn't think. It calculates probability.
                </h3>
                <p className="text-neutral-400 leading-relaxed text-xs md:text-sm mb-5">
                  An LLM reads your prompt and computes the statistical likelihood of the next word. It appends the selected word and repeats the process.
                </p>
                
                <div className="bg-blue-950/20 border-l-2 border-blue-500 p-3.5 rounded-r-lg">
                    <p className="text-blue-400 text-xs">
                      It is essentially a super-powered version of autocomplete on your smartphone, scaled up a trillion times.
                    </p>
                </div>
              </div>
              
              <div className="col-span-3 bg-neutral-900/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-center dark-glass h-full max-h-[340px]">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-neutral-400 font-mono text-xs tracking-widest uppercase flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> Interactive Autocomplete
                  </h4>
                  <button 
                    onClick={() => setPromptText("I'll be there in a")}
                    className="text-xs text-blue-400 hover:text-blue-300 font-mono bg-blue-950/30 px-2 py-0.5 rounded border border-blue-800/30"
                  >
                    Reset
                  </button>
                </div>
                
                <div className="w-full">
                    <div className="bg-neutral-950/80 border border-white/5 rounded-lg p-3 text-lg font-light text-white mb-4 flex items-center justify-between min-h-[48px]">
                        <span>
                          "{promptText}
                          <span className="text-blue-500 font-bold ml-1 animate-pulse">_</span>"
                        </span>
                        
                        {promptText.length > 20 && (
                          <button 
                            onClick={() => {
                              const words = promptText.split(' ');
                              if (words.length > 1) {
                                setPromptText(words.slice(0, -1).join(' '));
                                playSound('click', isMuted);
                              }
                            }} 
                            className="p-1 rounded text-neutral-500 hover:text-neutral-300"
                            title="Undo word"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                        )}
                    </div>
                    
                    <div className="text-neutral-500 font-mono text-xs uppercase tracking-wider mb-2">Next Word Candidates (Click to select):</div>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {activePredictions.map((pred, i) => (
                          <button
                            key={pred.word + i}
                            onClick={() => {
                              setPromptText(pred.nextPrompt);
                              playSound('click', isMuted);
                            }}
                            className="w-full flex justify-between items-center bg-neutral-950/40 border border-white/5 hover:border-blue-500/30 hover:bg-blue-950/10 rounded-lg p-2.5 transition-all text-left group"
                          >
                            <div className="flex items-center space-x-2">
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-blue-400" />
                              <span className="text-sm font-semibold text-white group-hover:text-blue-300">{pred.word}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-20 bg-neutral-850 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                <div className="bg-blue-500 h-full" style={{ width: `${pred.prob}%` }}></div>
                              </div>
                              <span className="text-xs text-blue-400 font-mono font-bold w-8 text-right">{pred.prob}%</span>
                            </div>
                          </button>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          </div>
          <SlideFooter title="The Next-Word Engine / AI Foundations" pageNumber={3} />
        </SlideContainer>

        {/* --- PAGE 4: THE TOOL KIT --- */}
        <SlideContainer current={currentSlide} index={3}>
          <SlideHeader />
          <div className="flex-1 flex flex-col pt-2 justify-center">
            <h1 className="text-4xl font-bold mb-8 text-white text-display">Pick the Right Tool for the Job</h1>
            
            <div className="grid grid-cols-3 gap-5 flex-1 max-h-[240px]">
              
              {/* Card 1 */}
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-5 flex flex-col relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-lg border border-blue-600/30">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full"></div>
                <div className="text-blue-200 font-mono text-xs mb-3 font-semibold">01 / NATURAL LANGUAGE</div>
                <h2 className="text-2xl font-bold text-white mb-1">LLMs</h2>
                <p className="text-blue-100 text-xs mb-auto">Claude • ChatGPT • Gemini</p>
                <div className="mt-6 border-t border-blue-500/30 pt-3 flex justify-between items-center">
                    <div>
                      <p className="text-blue-200/70 font-mono text-[10px] uppercase tracking-wider">Best For</p>
                      <p className="text-lg font-bold text-white">Text & Code</p>
                    </div>
                    <Sparkles className="w-5 h-5 text-white/30" />
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-5 flex flex-col hover:scale-[1.02] transition-transform hover:border-white/10 dark-glass">
                <div className="text-neutral-500 font-mono text-xs mb-3">02 / VISUAL MEDIA</div>
                <h2 className="text-2xl font-bold text-white mb-1">Diffusion Models</h2>
                <p className="text-neutral-400 text-xs mb-auto">Midjourney • Stable Diffusion • Flux</p>
                <div className="mt-6 border-t border-white/5 pt-3">
                    <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-wider">Best For</p>
                    <p className="text-lg font-bold text-neutral-300">Images & Art</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-5 flex flex-col hover:scale-[1.02] transition-transform hover:border-white/10 dark-glass">
                <div className="text-neutral-500 font-mono text-xs mb-3">03 / AUDIO & MOTION</div>
                <h2 className="text-2xl font-bold text-white mb-1">Sora & ElevenLabs</h2>
                <p className="text-neutral-400 text-xs mb-auto">Voice Synthesis • Video Clips</p>
                <div className="mt-6 border-t border-white/5 pt-3">
                    <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-wider">Best For</p>
                    <p className="text-lg font-bold text-neutral-300">Media Generation</p>
                </div>
              </div>

            </div>

            <div className="mt-8 bg-neutral-900/40 border border-white/5 p-4 rounded-xl flex items-center justify-between dark-glass">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 font-mono text-xs uppercase tracking-wider whitespace-nowrap">
                    The SAGO Focus
                  </div>
                  <p className="text-sm text-neutral-300">
                    At SAGO, we focus entirely on <strong>LLMs</strong> to automate text analysis, structure messy documents, and orchestrate intelligent agent loops.
                  </p>
                </div>
            </div>

          </div>
          <SlideFooter title="Pick the Right Tool / AI Foundations" pageNumber={4} />
        </SlideContainer>

        {/* --- PAGE 5: TWO PHASES --- */}
        <SlideContainer current={currentSlide} index={4}>
          <SlideHeader />
          <div className="flex-1 flex flex-col pt-2 justify-center">
            <h1 className="text-4xl font-bold mb-6 text-white text-display">The Two Phases of AI</h1>
            
            <div className="grid grid-cols-2 gap-6 flex-1 items-stretch max-h-[300px]">
              
              {/* Training */}
              <div className="bg-neutral-900/20 border border-white/5 rounded-xl p-5 flex flex-col dark-glass relative">
                <div className="text-neutral-500 font-mono text-xs tracking-wider uppercase mb-2">Phase 01</div>
                <h2 className="text-2xl font-bold text-white mb-4 pb-3 border-b border-white/5">Model Training</h2>
                
                <div className="space-y-3.5 text-xs flex-1">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-neutral-500 font-mono">Who</span>
                        <span className="text-neutral-300 font-medium">Tech giants (Google, Anthropic, Meta)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-neutral-500 font-mono">Cost</span>
                        <span className="text-neutral-300 font-medium">Millions in compute + months of processing</span>
                    </div>
                    <div className="flex justify-between pb-1">
                        <span className="text-neutral-500 font-mono">Process</span>
                        <span className="text-neutral-300 font-medium">Model absorbs patterns from the open web</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 bg-neutral-950/40 p-2.5 rounded-lg border border-red-500/10 text-center">
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">SAGO DOES NOT DO THIS</p>
                </div>
              </div>

              {/* Inference */}
              <div className="bg-blue-900/10 border border-blue-500/25 rounded-xl p-5 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-bl-[80px]"></div>
                <div className="text-blue-400 font-mono text-xs tracking-wider uppercase mb-2">Phase 02</div>
                <h2 className="text-2xl font-bold text-blue-400 mb-4 pb-3 border-b border-blue-500/20">Inference (Prompting)</h2>
                
                <div className="space-y-3.5 text-xs flex-1 relative z-10">
                    <div className="flex justify-between border-b border-blue-500/10 pb-1">
                        <span className="text-blue-300/60 font-mono">Who</span>
                        <span className="text-white font-medium">Developers, agents, and normal users</span>
                    </div>
                    <div className="flex justify-between border-b border-blue-500/10 pb-1">
                        <span className="text-blue-300/60 font-mono">Cost</span>
                        <span className="text-white font-medium">Fractions of a cent, completes in seconds</span>
                    </div>
                    <div className="flex justify-between pb-1">
                        <span className="text-blue-300/60 font-mono">Process</span>
                        <span className="text-white font-medium">Trained model answers user/system prompt</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-500/20 bg-blue-950/40 p-2.5 rounded-lg border border-blue-500/20 text-center relative z-10">
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> THIS IS WHAT SAGO DOES
                    </p>
                </div>
              </div>

            </div>
          </div>
          <SlideFooter title="The Two Phases of AI / AI Foundations" pageNumber={5} />
        </SlideContainer>

        {/* --- PAGE 6: FEYNMAN DAY 1 --- */}
        <SlideContainer current={currentSlide} index={5}>
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 text-xs font-mono mb-4 uppercase tracking-widest">
              Feynman Checkpoint • Module 01
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white text-display text-gradient">
              YOUR TURN TO TEACH
            </h1>
            
            <div className="bg-neutral-900/60 border border-white/5 p-6 rounded-2xl mb-6 w-full dark-glass relative">
                <div className="absolute top-2 right-2">
                  <Lightbulb className="w-6 h-6 text-yellow-500/30" />
                </div>
                <p className="text-xl md:text-2xl text-neutral-200 leading-relaxed font-light">
                  "Explain what an LLM is to someone who has never heard of it, using exactly one analogy."
                </p>
            </div>

            {/* Timer Widget */}
            <div className="flex items-center space-x-4 bg-neutral-950 border border-white/5 py-2 px-4 rounded-xl mb-8">
              <span className="text-neutral-400 text-xs font-mono uppercase tracking-wider">Exercise Timer:</span>
              <span className={`text-2xl font-mono font-bold ${timeLeft <= 20 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                {formatTime(timeLeft)}
              </span>
              <button 
                onClick={toggleTimer}
                className="p-1.5 rounded-lg bg-blue-950/40 text-blue-400 hover:bg-blue-900/20 border border-blue-500/20"
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button 
                onClick={resetTimer}
                className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 w-full text-left">
                <div className="border-t border-white/5 pt-3">
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">Step 01</p>
                    <p className="text-neutral-300 text-xs">Formulate your response in your head for 1 minute.</p>
                </div>
                <div className="border-t border-white/5 pt-3">
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">Step 02</p>
                    <p className="text-neutral-300 text-xs">Say it out loud to the person sitting next to you.</p>
                </div>
                <div className="border-t border-white/5 pt-3">
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">Step 03</p>
                    <p className="text-neutral-300 text-xs">Identify any gaps where you had to pause or explain.</p>
                </div>
            </div>
          </div>
          <SlideFooter title="End of Day 1 / AI Foundations" pageNumber={6} />
        </SlideContainer>

        {/* --- PAGE 7: DAY 2 TITLE --- */}
        <SlideContainer current={currentSlide} index={6}>
          <div className="flex-1 flex flex-col justify-center max-w-4xl pt-4">
            <h3 className="text-blue-400 font-mono tracking-[0.3em] text-sm mb-4">SAGO / MEDIA GROUPS</h3>
            <div className="inline-flex items-center space-x-2.5 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                <span className="text-neutral-400 font-mono text-xs uppercase tracking-wider">~25 minutes • whiteboard + interactive sandbox</span>
            </div>
            
            <h1 className="text-blue-500 font-mono text-2xl tracking-widest uppercase mb-2 font-bold">Day 02</h1>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white text-display text-gradient">
              Tokens, Context & Model Size
            </h2>
            
            <p className="text-xl text-neutral-400 leading-relaxed border-l-2 border-blue-500 pl-5 max-w-2xl font-light">
              Why does AI sometimes "forget" what you said earlier — and why do different models cost different amounts?
            </p>
          </div>
          <SlideFooter title="Day 2 / AI Foundations" pageNumber={7} />
        </SlideContainer>

        {/* --- PAGE 8: TOKENS --- */}
        <SlideContainer current={currentSlide} index={7}>
          <SlideHeader />
          <div className="flex-1 flex flex-col pt-2 justify-center">
            <h1 className="text-4xl font-bold mb-4 text-white text-display">What Is a Token?</h1>
            
            <div className="grid grid-cols-2 gap-10 flex-1 items-center">
              <div className="flex flex-col space-y-6">
                <div>
                    <h2 className="text-neutral-500 font-mono tracking-widest uppercase text-xs mb-2">The Unit of Input</h2>
                    <h3 className="text-2xl font-medium text-white mb-3 leading-snug">
                      A token is a fragment of text — roughly 3/4 of a word.
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      Models do not read character-by-character or word-by-word. Text is translated into numerical Token IDs via a dictionary before the neural network processes it.
                    </p>
                </div>
                <div className="bg-neutral-900/60 border border-white/5 p-4 rounded-xl dark-glass">
                    <h2 className="text-blue-400 font-mono tracking-widest uppercase text-xs mb-2 font-bold">Why It Matters</h2>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      LLM APIs bill you per token (input + output). Optimizing token counts directly speeds up the system and saves money.
                    </p>
                </div>
              </div>
              
              <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-center dark-glass h-full max-h-[340px]">
                <h4 className="text-neutral-400 font-mono text-xs tracking-widest uppercase mb-4 text-center">
                  Live Token Analyzer
                </h4>
                
                {/* Visual Hamburger Example */}
                <div className="flex items-center justify-center space-x-1.5 mb-4 bg-neutral-950 p-2.5 rounded-lg border border-white/5">
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mr-2">Example:</div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded px-2.5 py-1 text-sm font-mono font-bold">ham</div>
                    <span className="text-[10px] text-neutral-600 font-mono mt-0.5">2057</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded px-2.5 py-1 text-sm font-mono font-bold">bur</div>
                    <span className="text-[10px] text-neutral-600 font-mono mt-0.5">9624</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded px-2.5 py-1 text-sm font-mono font-bold">ger</div>
                    <span className="text-[10px] text-neutral-600 font-mono mt-0.5">1063</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">Type something to test:</label>
                  <input
                    type="text"
                    value={tokenizerInput}
                    onChange={(e) => setTokenizerInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/5 focus:border-blue-500/40 outline-none rounded-lg p-2 text-sm font-light text-white font-mono"
                    placeholder="Type words here..."
                  />
                </div>
                
                {/* Dynamically Tokenized text display */}
                <div className="bg-neutral-950/80 rounded-lg p-3 border border-white/5 h-20 overflow-y-auto mb-2 flex flex-wrap gap-1 content-start">
                  {currentTokens.length > 0 ? (
                    currentTokens.map((token, i) => (
                      <span 
                        key={i} 
                        className={`text-xs px-1.5 py-0.5 rounded border font-mono font-medium ${token.color}`}
                        title={`ID: ${token.id}`}
                      >
                        {token.text}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-600 font-mono">No input text yet</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 border-t border-white/5 pt-2">
                  <span>Characters: {tokenizerInput.length}</span>
                  <span className="text-blue-400 font-bold">Est. Tokens: {Math.max(1, Math.ceil(currentTokens.length))}</span>
                </div>
              </div>
            </div>
          </div>
          <SlideFooter title="What Is a Token / AI Foundations" pageNumber={8} />
        </SlideContainer>

        {/* --- PAGE 9: CONTEXT WINDOW --- */}
        <SlideContainer current={currentSlide} index={8}>
          <SlideHeader />
          <div className="flex-1 flex flex-col pt-2 justify-center">
            <h1 className="text-4xl font-bold mb-4 text-white text-display">The Context Window</h1>
            
            <div className="grid grid-cols-12 gap-8 flex-1 items-center">
              <div className="col-span-5 flex flex-col justify-between h-full max-h-[340px]">
                <div className="space-y-4">
                    <h2 className="text-neutral-500 font-mono tracking-widest uppercase text-xs">Short-Term Memory Limits</h2>
                    <p className="text-xl text-white font-medium leading-snug">
                      The context window represents the model's total operational memory for a single request.
                    </p>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      Modern models (like Claude Sonnet) support up to <strong>200,000 tokens</strong> (~500 pages). If your prompt + history exceeds this, old information is discarded.
                    </p>
                </div>
                
                <div className="bg-blue-950/20 border border-blue-500/20 p-4 rounded-xl mt-4">
                    <h3 className="text-blue-400 font-mono text-xs uppercase tracking-wider mb-1 font-bold">The SAGO Rule</h3>
                    <p className="text-[11px] text-neutral-300 leading-normal">
                      Do not inject raw files indiscriminately. Summarize data first, and build target retrieval tools (RAG) to fetch only relevant context.
                    </p>
                </div>
              </div>
              
              <div className="col-span-7 bg-neutral-900/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between dark-glass h-full max-h-[340px]">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-neutral-400 font-mono text-xs tracking-widest uppercase">
                      Memory Stack (Limit: 200,000 Tokens)
                    </h4>
                    <button 
                      onClick={clearContext}
                      className="text-[10px] text-neutral-500 hover:text-white font-mono bg-neutral-950 px-2 py-0.5 rounded border border-white/5"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Context Visualizer Bar */}
                  <div className="relative h-12 w-full bg-neutral-950 border border-white/5 rounded-xl flex items-center p-1.5 overflow-hidden mb-4">
                    {activeContextDocs.length === 0 && (
                      <span className="text-[11px] text-neutral-600 font-mono mx-auto">Context Empty. Click files to load.</span>
                    )}
                    <div className="flex h-full w-full gap-0.5">
                      {activeContextDocs.map((doc, idx) => (
                        <div 
                          key={doc.id}
                          style={{ width: `${(doc.tokens / 200000) * 100}%` }}
                          className={`h-full rounded border flex items-center justify-center overflow-hidden text-[9px] font-mono font-bold px-1 transition-all duration-300 ${doc.color}`}
                          title={`${doc.name}: ${doc.tokens.toLocaleString()} tokens`}
                        >
                          <span className="truncate">{doc.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active vs Dropoff counters */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4">
                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-blue-500/20 text-center">
                      <span className="text-neutral-500 block text-[10px] uppercase">Active Context</span>
                      <span className="text-sm font-bold text-blue-400">{(totalContextTokens).toLocaleString()} / 200,000</span>
                    </div>
                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-red-500/20 text-center">
                      <span className="text-neutral-500 block text-[10px] uppercase">Forgotten (Dropped)</span>
                      <span className={`text-sm font-bold ${droppedContextDocs.length > 0 ? 'text-red-500' : 'text-neutral-600'}`}>
                        {droppedContextDocs.reduce((sum, d) => sum + d.tokens, 0).toLocaleString()} tokens
                      </span>
                    </div>
                  </div>
                </div>

                {/* Document selectors */}
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-2">Simulate uploading files:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {initialDocs.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => addDocToContext(doc)}
                        className="text-[10px] font-mono bg-neutral-950 border border-white/5 hover:border-blue-500/30 px-2 py-1.5 rounded-lg text-neutral-300 hover:text-white transition-all text-left flex items-center justify-between"
                      >
                        <span className="max-w-[140px] truncate mr-1.5">{doc.name}</span>
                        <span className="text-[9px] text-blue-400 font-bold bg-blue-950/50 px-1 py-0.5 rounded shrink-0">+{Math.round(doc.tokens/1000)}k</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
          <SlideFooter title="The Context Window / AI Foundations" pageNumber={9} />
        </SlideContainer>

        {/* --- PAGE 10: MODEL SIZE --- */}
        <SlideContainer current={currentSlide} index={9}>
          <SlideHeader />
          <div className="flex-1 flex flex-col pt-2 justify-center">
            <h1 className="text-4xl font-bold mb-4 text-white text-display">Model Size = Brain Size</h1>
            
            <div className="grid grid-cols-2 gap-10 flex-1 items-center">
              <div className="flex flex-col space-y-6">
                <div>
                    <h2 className="text-neutral-500 font-mono tracking-widest uppercase text-xs mb-2">Parameters & Capacity</h2>
                    <h3 className="text-2xl font-medium text-white mb-3 leading-snug">
                      Parameters are variables that dictate model capability.
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      More parameters means stronger reasoning but higher costs and slower inference speeds. Developers choose the smallest, fastest model suited for each pipeline step.
                    </p>
                </div>
                
                <div className="bg-neutral-900/60 border border-white/5 p-4 rounded-xl dark-glass">
                    <h2 className="text-blue-400 font-mono tracking-widest uppercase text-xs mb-2 font-bold">The SAGO Rule</h2>
                    <p className="text-xs text-neutral-300 leading-normal">
                      Use small, fast models (e.g. 8B) for classification, formatting, and preprocessing. Save the massive models (e.g. Claude Sonnet) for orchestrating reasoning and writing critical code.
                    </p>
                </div>
              </div>
              
              <div className="bg-neutral-900/40 border border-white/5 rounded-2xl p-5 flex flex-col dark-glass h-full max-h-[340px]">
                <h4 className="text-neutral-400 font-mono text-xs tracking-widest uppercase mb-4 text-center">
                  Interactive Brain Size Specifier
                </h4>
                
                {/* Slider */}
                <div className="mb-4">
                  <div className="flex justify-between font-mono text-[10px] text-neutral-500 mb-1">
                    <span>Edge (7B)</span>
                    <span className="text-blue-400 font-bold">Active Selection: {paramSize}B Parameters</span>
                    <span>Frontier (400B+)</span>
                  </div>
                  <input
                    type="range"
                    min="7"
                    max="200"
                    value={paramSize}
                    onChange={(e) => setParamSize(Number(e.target.value))}
                    className="w-full h-1 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-blue-500 border border-white/5"
                  />
                </div>

                {/* Spec details card */}
                <div className="bg-neutral-950/80 border border-white/5 p-4 rounded-xl flex-1 flex flex-col justify-center">
                  <span className="text-xs text-blue-400 font-mono font-bold block mb-1.5">{activeSpec.label}</span>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-neutral-500">Core Use Case:</span>
                      <span className="text-white text-right font-medium max-w-[180px] truncate">{activeSpec.capability}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-neutral-500">Inference Speed:</span>
                      <span className="text-emerald-400 font-mono font-bold">{activeSpec.speed}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-neutral-500">Cost Factor:</span>
                      <span className="text-yellow-500 font-mono font-bold">{activeSpec.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Hardware Profile:</span>
                      <span className="text-neutral-300 text-right max-w-[180px] truncate">{activeSpec.hardware}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <SlideFooter title="Model Size / AI Foundations" pageNumber={10} />
        </SlideContainer>

        {/* --- PAGE 11: HANDS ON --- */}
        <SlideContainer current={currentSlide} index={10}>
          <div className="w-full flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1 text-white text-display">Try It Yourself</h1>
              <h3 className="text-blue-400 font-mono tracking-[0.2em] uppercase text-xs">Hands-on Lab • Module 02</h3>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-400 border border-blue-900/40 font-mono text-xs font-bold uppercase">~15 mins</span>
          </div>
          
          <div className="grid grid-cols-3 gap-5 flex-1 max-h-[220px]">
            {/* Card 1 */}
            <button
              onClick={() => toggleLabCheck(0)}
              className={`border rounded-xl p-5 flex flex-col text-left transition-all ${
                labChecks[0] 
                  ? 'bg-blue-950/20 border-blue-500/40 text-neutral-300' 
                  : 'bg-neutral-900/40 border-white/5 hover:border-white/20 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="flex justify-between items-start w-full mb-3">
                <span className="text-blue-500 font-mono text-xs tracking-wider">LAB 01</span>
                {labChecks[0] ? <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" /> : <div className="w-5 h-5 rounded-full border-2 border-neutral-700" />}
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Count the tokens</h2>
              <p className="text-xs leading-relaxed mb-auto">Paste a standard email into a tokenizer tool. Compare words vs token length.</p>
              <div className="mt-4 border-t border-neutral-805 pt-2 w-full text-[10px] font-mono text-neutral-500">
                platform.openai.com/tokenizer
              </div>
            </button>

            {/* Card 2 */}
            <button
              onClick={() => toggleLabCheck(1)}
              className={`border rounded-xl p-5 flex flex-col text-left transition-all ${
                labChecks[1] 
                  ? 'bg-blue-950/20 border-blue-500/40 text-neutral-300' 
                  : 'bg-neutral-900/40 border-white/5 hover:border-white/20 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="flex justify-between items-start w-full mb-3">
                <span className="text-blue-500 font-mono text-xs tracking-wider">LAB 02</span>
                {labChecks[1] ? <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" /> : <div className="w-5 h-5 rounded-full border-2 border-neutral-700" />}
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Break the memory</h2>
              <p className="text-xs leading-relaxed mb-auto">Inject a 400-page doc, then ask about paragraph 1. Observe responses.</p>
              <div className="mt-4 border-t border-neutral-805 pt-2 w-full text-[10px] font-mono text-neutral-500">
                tests model context threshold
              </div>
            </button>

            {/* Card 3 */}
            <button
              onClick={() => toggleLabCheck(2)}
              className={`border rounded-xl p-5 flex flex-col text-left transition-all ${
                labChecks[2] 
                  ? 'bg-blue-950/20 border-blue-500/40 text-neutral-300' 
                  : 'bg-neutral-900/40 border-white/5 hover:border-white/20 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="flex justify-between items-start w-full mb-3">
                <span className="text-blue-500 font-mono text-xs tracking-wider">LAB 03</span>
                {labChecks[2] ? <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" /> : <div className="w-5 h-5 rounded-full border-2 border-neutral-700" />}
              </div>
              <h2 className="text-lg font-bold text-white mb-2">Run the numbers</h2>
              <p className="text-xs leading-relaxed mb-auto">Calculate token API costs for processing 1,500 transcript inputs monthly.</p>
              <div className="mt-4 border-t border-neutral-805 pt-2 w-full text-[10px] font-mono text-neutral-500">
                anthropic.com/pricing comparison
              </div>
            </button>
          </div>

          <div className="mt-8 text-center border-t border-white/5 pt-4">
            <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest mb-1">Deliverable Requirement</p>
            <p className="text-xl font-bold text-white">Write one paragraph detailing: <span className="text-blue-400 font-normal">what surprised you the most?</span></p>
          </div>
          
          <SlideFooter title="Try It Yourself / AI Foundations" pageNumber={11} />
        </SlideContainer>

        {/* --- PAGE 12: FEYNMAN DAY 2 --- */}
        <SlideContainer current={currentSlide} index={11}>
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 text-xs font-mono mb-4 uppercase tracking-widest animate-pulse">
              Final Checkpoint • Module 02
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white text-gradient text-display">
              YOUR TURN TO SOLVE
            </h1>
            
            <div className="bg-neutral-900/60 border border-white/5 p-6 rounded-2xl mb-6 w-full dark-glass relative">
                <p className="text-xl md:text-2xl text-neutral-200 leading-relaxed font-light">
                  "A client sends a 200-page PDF containing core meeting notes. What problem does this create for the AI — and how would you solve it?"
                </p>
            </div>

            <div className="flex flex-col items-center w-full">
              <button 
                onClick={() => {
                  setShowAnswer(!showAnswer);
                  if(!showAnswer) {
                    confetti({ particleCount: 30, spread: 50 });
                    playSound('click', isMuted);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-blue-500/20 flex items-center gap-2"
              >
                <HelpCircle className="w-4.5 h-4.5" />
                {showAnswer ? "Hide Suggested Solution" : "Reveal Suggested Solution"}
              </button>

              <div className={`mt-5 text-left w-full border-t border-white/5 pt-4 transition-all duration-500 overflow-hidden ${
                showAnswer ? 'max-h-[160px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 pointer-events-none'
              }`}>
                  <p className="text-blue-400 text-xs uppercase tracking-widest font-mono mb-1">What Good Looks Like</p>
                  <p className="text-neutral-400 text-sm leading-relaxed bg-neutral-950/60 p-4 rounded-xl border border-white/5">
                    It may exceed active context windows or dilute reasoning accuracy. 
                    <strong> The fix:</strong> Chunk the document into structural sections, summarize each segment independently, and combine summaries into a master document.
                  </p>
              </div>
            </div>
          </div>
          <SlideFooter title="End of Day 2 / AI Foundations" pageNumber={12} />
        </SlideContainer>

      </div>
      
      {/* Navigation Controls Overlay (Outside the 16:9 box) */}
      <div className="w-full max-w-6xl mt-4 flex justify-between items-center text-neutral-500 px-2">
        <button 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="flex items-center space-x-2 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-500 transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="w-4 h-4" /> <span className="text-sm">Previous</span>
        </button>
        
        {/* Slide Counter Dots */}
        <div className="hidden md:flex items-center space-x-1.5">
          {slideTitles.map((title, idx) => (
            <button
              key={idx}
              onClick={() => changeSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx 
                  ? 'w-7 bg-blue-500' 
                  : 'w-2.5 bg-neutral-800 hover:bg-neutral-600'
              }`}
              title={title}
            />
          ))}
        </div>

        <div className="font-mono text-sm tracking-widest text-neutral-400 bg-neutral-900 border border-white/5 px-3 py-1 rounded-full flex items-center gap-1">
            <span className="font-bold text-white">{currentSlide + 1}</span> 
            <span className="opacity-30">/</span> 
            <span>{totalSlides}</span>
        </div>
        
        <button 
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="flex items-center space-x-2 hover:text-white disabled:opacity-20 disabled:hover:text-neutral-500 transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
        >
          <span className="text-sm">Next</span> <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* --- Interactive Sidebar (Drawer) --- */}
      <div className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`fixed right-0 top-0 bottom-0 w-80 bg-[#0a0a0c] border-l border-white/10 p-6 flex flex-col transition-transform duration-300 shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-neutral-400 font-mono text-xs uppercase tracking-wider font-bold">Slide Overview</span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {slideTitles.map((title, idx) => (
              <button
                key={idx}
                onClick={() => {
                  changeSlide(idx);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-start space-x-3 p-3 rounded-xl border transition-all text-left group ${
                  currentSlide === idx 
                    ? 'bg-blue-600/10 border-blue-500 text-white font-semibold' 
                    : 'bg-neutral-950/40 border-white/5 text-neutral-400 hover:border-white/15 hover:text-neutral-200'
                }`}
              >
                <span className={`font-mono text-xs shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${
                  currentSlide === idx ? 'border-blue-400 text-blue-400' : 'border-neutral-800 text-neutral-500'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xs leading-normal">{title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Keyboard Shortcuts Modal Overlay --- */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#0a0a0c] border border-white/10 rounded-2xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowShortcuts(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-white font-mono text-xs uppercase tracking-wider mb-4 font-bold flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-blue-400" /> Controls & Shortcuts
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Next Slide</span>
                <span className="font-mono bg-neutral-900 border border-white/5 px-2 py-0.5 rounded text-blue-400">Right Arrow / Space</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Previous Slide</span>
                <span className="font-mono bg-neutral-900 border border-white/5 px-2 py-0.5 rounded text-blue-400">Left Arrow</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Toggle Mute SFX</span>
                <span className="font-mono bg-neutral-900 border border-white/5 px-2 py-0.5 rounded text-blue-400">M Key</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Toggle Helper Info</span>
                <span className="font-mono bg-neutral-900 border border-white/5 px-2 py-0.5 rounded text-blue-400">? Key</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Close Panels</span>
                <span className="font-mono bg-neutral-900 border border-white/5 px-2 py-0.5 rounded text-blue-400">Escape Key</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
