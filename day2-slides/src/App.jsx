import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Menu,
  X,
  Keyboard,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Terminal,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Shield,
  ShieldOff,
  Globe,
  HardDrive,
  FileText,
  Plug,
  Palette,
  Code2,
  Users,
  Search,
  Lock,
  Unlock,
  ChevronRight,
  Eye,
  EyeOff,
  Zap,
  HelpCircle,
  Award,
  Layers,
  Star,
  Mail,
  Link2,
  Wifi,
  WifiOff,
  Database,
  ArrowRightLeft,
  Cable,
  Unplug,
  Cloud,
  CloudOff,
  MessageSquare,
  GitBranch,
  Inbox,
  Send,
  ShieldCheck,
  Router,
} from 'lucide-react';

/* ──────────────────────────────────────────────
   WEB AUDIO SFX
   ────────────────────────────────────────────── */
const playSound = (type = 'click', muted = false) => {
  if (muted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'slide') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'success') {
      [523, 659, 784, 1047].forEach((f, i) => {
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine'; o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.07);
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.03, ctx.currentTime + i * 0.07 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.2);
        o.start(ctx.currentTime + i * 0.07); o.stop(ctx.currentTime + i * 0.07 + 0.2);
      });
    }
  } catch (e) { /* AudioContext blocked */ }
};

/* ──────────────────────────────────────────────
   REUSABLE SLIDE COMPONENTS
   ────────────────────────────────────────────── */
const Slide = ({ children, current, index }) => (
  <div className={`absolute inset-0 w-full h-full px-8 md:px-14 lg:px-20 py-6 flex flex-col transition-all duration-500 ease-out ${
    current === index
      ? 'opacity-100 scale-100 z-10 pointer-events-auto slide-enter'
      : 'opacity-0 scale-[0.98] z-0 pointer-events-none'
  }`}>
    {children}
  </div>
);

const SlideTag = ({ text }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-500 font-semibold">
      {text || 'SAGO / Prompt Engineering'}
    </span>
  </div>
);

const SlideNum = ({ n }) => (
  <div className="absolute bottom-6 right-8 md:right-14 lg:right-20 bg-cream-100 border border-cream-400 rounded-lg px-3 py-1.5 font-mono text-sm font-bold text-ink-600">
    {String(n).padStart(2, '0')}
  </div>
);

/* ──────────────────────────────────────────────
   MAIN APP
   ────────────────────────────────────────────── */
export default function App() {
  const [day, setDay] = useState(2);
  const [cur, setCur] = useState(0);
  const [muted, setMuted] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const [shortcuts, setShortcuts] = useState(false);
  const [scale, setScale] = useState(1.5);

  const day2Titles = [
    'Day 2: Prompt Engineering',
    'System Prompt vs User Prompt',
    'The 5-Part Prompt Framework',
    'When AI Makes Things Up',
    'Zero-Shot vs Few-Shot',
    'Feynman Checkpoint',
    '3-Round Prompt Challenge',
    'Open Source vs Closed Source',
    'Running a Model Locally',
    'Custom GPTs — ChatGPT',
    'Gems — Google Gemini',
    'Skills — Anthropic Claude',
    'Platform Comparison',
    'Model Profile: Claude 3.5 Sonnet',
    'Model Profile: Gemini 1.5 Pro',
    'Model Profile: GPT-4o',
    'Final Checkpoint',
  ];

  const day3Titles = [
    'Day 3: Connect AI to Everything',
    'AI Is Trapped in a Box',
    'What If AI Could Plug In?',
    'MCP: The USB-C for AI',
    'How MCP Works',
    'What Flows Through MCP?',
    'Setting Up a Connector',
    'The Connector Directory',
    'What Each Connector Unlocks',
    'Skills + Connectors = Superpowers',
    'Real SAGO Workflows',
    'Security Rules',
    'Feynman Lab: Skill + Connector',
    'Final Checkpoint',
  ];

  const day4Titles = [
    'Day 4: Slack Email Orchestrator',
    'System Architecture',
    'The Queue File',
    'State Management',
    'The Agent Workflow',
    'The Email Drafting Skill',
    'Live Execution Flow',
    'Hands-On: Build It',
    'Scheduling & Automation',
    'Final Checkpoint',
  ];

  const titles = day === 2 ? day2Titles : day === 3 ? day3Titles : day4Titles;
  const total = titles.length;

  const switchDay = (d) => {
    if (d !== day) {
      setDay(d);
      setCur(0);
      playSound('slide', muted);
    }
  };

  const go = useCallback((i) => {
    setCur(i);
    playSound('slide', muted);
    if (i === total - 1) {
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.65 }, colors: ['#DC2626','#2563EB','#0D9488','#F59E0B','#1A1A2E'] });
        playSound('success', muted);
      }, 400);
    }
  }, [muted, total]);
  const next = useCallback(() => { if (cur < total - 1) go(cur + 1); }, [cur, go, total]);
  const prev = useCallback(() => { if (cur > 0) go(cur - 1); }, [cur, go]);

  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === '?') setShortcuts(p => !p);
      if (e.key === 'Escape') { setSidebar(false); setShortcuts(false); }
      if (e.key === 'm' || e.key === 'M') setMuted(p => !p);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [next, prev]);

  /* ── Slide 3: Prompt Builder State ── */
  const frameworkParts = [
    { label: 'Role', text: 'You are a professional proposal writer for a media agency.', icon: <Users className="w-4 h-4" /> },
    { label: 'Context', text: 'SAGO Media Groups is a 2-person AI automation agency based in India.', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Task', text: 'Write a project proposal based on the following client brief.', icon: <FileText className="w-4 h-4" /> },
    { label: 'Format', text: 'Use this structure: Summary → Deliverables → Timeline → Price.', icon: <Layers className="w-4 h-4" /> },
    { label: 'Constraints', text: 'Keep it under 300 words. Do not add anything not mentioned in the brief.', icon: <Shield className="w-4 h-4" /> },
  ];
  const [toggles, setToggles] = useState([true, false, false, false, false]);
  const activeCount = toggles.filter(Boolean).length;
  const qualityLabel = activeCount <= 1 ? 'Weak' : activeCount <= 3 ? 'Good' : 'Excellent';
  const qualityColor = activeCount <= 1 ? 'bg-coral-500' : activeCount <= 3 ? 'bg-amber-500' : 'bg-emerald-600';

  /* ── Slide 5: Zero/Few-Shot State ── */
  const [shotMode, setShotMode] = useState('zero');

  /* ── Slide 6: Timer State ── */
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerOn, setTimerOn] = useState(false);
  const timerRef = useRef(null);
  const startTimer = () => {
    if (timerOn) { clearInterval(timerRef.current); setTimerOn(false); return; }
    setTimerOn(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          clearInterval(timerRef.current); setTimerOn(false);
          confetti({ particleCount: 40, spread: 50 }); return 0;
        }
        return p - 1;
      });
    }, 1000);
  };
  const resetTimer = () => { clearInterval(timerRef.current); setTimerOn(false); setTimeLeft(120); };
  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  useEffect(() => () => clearInterval(timerRef.current), []);

  /* ── Slide 7: Lab Checklist State ── */
  const [labDone, setLabDone] = useState([false, false, false]);
  const toggleLab = (i) => {
    setLabDone(p => { const c = [...p]; c[i] = !c[i]; if (c[i]) { playSound('click', muted); confetti({ particleCount: 12, spread: 35, origin: { y: 0.8 } }); } return c; });
  };

  /* ── Slide 13: Platform Highlight ── */
  const [platform, setPlatform] = useState(null);

  /* ── Slide 14: Answer Reveal ── */
  const [revealed, setRevealed] = useState(false);

  /* ── Day 3 State ── */
  const [d3BeforeAfter, setD3BeforeAfter] = useState('before');
  const [d3McpStep, setD3McpStep] = useState(null);
  const [d3TechTab, setD3TechTab] = useState('arch');
  const [d3ArchFocus, setD3ArchFocus] = useState('client');
  const [d3FlowCard, setD3FlowCard] = useState(null);
  const [d3Category, setD3Category] = useState(null);
  const [d3Connector, setD3Connector] = useState(null);
  const [d3SecurityDone, setD3SecurityDone] = useState([false, false, false, false, false]);
  const [d3LabDone, setD3LabDone] = useState([false, false, false, false]);
  const [d3Revealed, setD3Revealed] = useState(false);

  /* ── Day 4 State ── */
  const [d4PipelineStep, setD4PipelineStep] = useState(null);
  const [d4QueueTab, setD4QueueTab] = useState('before');
  const [d4LabDone, setD4LabDone] = useState([false, false, false, false]);
  const [d4Revealed, setD4Revealed] = useState(false);
  const [d4ScheduleMode, setD4ScheduleMode] = useState('manual');

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-cream-200">
      <div
        style={{
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        className="flex flex-col font-sans text-ink-900 overflow-hidden"
      >

        {/* ═══ TOP BAR ═══ */}
        <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-3.5 flex justify-between items-center bg-cream-200/85 backdrop-blur-md border-b border-cream-400/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 bg-cream-50 border border-cream-400 rounded-lg p-0.5">
              <button
                onClick={() => switchDay(2)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  day === 2 ? 'bg-navy-600 text-white shadow-sm' : 'text-ink-500 hover:text-ink-900 hover:bg-cream-200'
                }`}
              >Day 02</button>
              <button
                onClick={() => switchDay(3)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  day === 3 ? 'bg-teal-600 text-white shadow-sm' : 'text-ink-500 hover:text-ink-900 hover:bg-cream-200'
                }`}
              >Day 03</button>
              <button
                onClick={() => switchDay(4)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  day === 4 ? 'bg-coral-500 text-white shadow-sm' : 'text-ink-500 hover:text-ink-900 hover:bg-cream-200'
                }`}
              >Day 04</button>
            </div>
            <span className="font-bold tracking-[0.15em] text-[11px] uppercase text-ink-700">
              {day === 2 ? 'Prompt Engineering' : day === 3 ? 'Connectors & MCP' : 'Email Orchestrator'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-cream-50 border border-cream-400 rounded-lg p-0.5" title="Scale Factor">
              <button 
                onClick={() => { setScale(s => Math.max(0.8, parseFloat((s - 0.1).toFixed(1)))); playSound('click', muted); }} 
                className="px-2 py-1 text-xs font-bold hover:bg-cream-200 rounded text-ink-500 hover:text-ink-950 transition-colors"
                title="Zoom Out"
              >
                -
              </button>
              <span className="font-mono text-xs font-bold text-ink-800 min-w-[36px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button 
                onClick={() => { setScale(s => Math.min(2.0, parseFloat((s + 0.1).toFixed(1)))); playSound('click', muted); }} 
                className="px-2 py-1 text-xs font-bold hover:bg-cream-200 rounded text-ink-500 hover:text-ink-950 transition-colors"
                title="Zoom In"
              >
                +
              </button>
              {scale !== 1.5 && (
                <button 
                  onClick={() => { setScale(1.5); playSound('click', muted); }} 
                  className="text-[9px] font-bold text-coral-500 hover:text-coral-600 px-1 border-l border-cream-300 ml-0.5"
                  title="Reset to 150%"
                >
                  Reset
                </button>
              )}
            </div>

            <button onClick={() => setMuted(!muted)} className="p-2 rounded-lg border border-cream-400 hover:bg-cream-100 text-ink-500 hover:text-ink-900 transition-colors" title={muted ? 'Unmute' : 'Mute'}>
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-navy-600" />}
            </button>
            <button onClick={() => setSidebar(true)} className="px-3 py-2 rounded-lg border border-cream-400 hover:bg-cream-100 text-ink-500 hover:text-ink-900 transition-colors flex items-center gap-1.5 text-xs font-semibold" title="Index">
              <Menu className="w-4 h-4" /><span className="hidden md:inline">Index</span>
            </button>
            <button onClick={() => setShortcuts(!shortcuts)} className="p-2 rounded-lg border border-cream-400 hover:bg-cream-100 text-ink-500 hover:text-ink-900 transition-colors" title="Shortcuts">
              <Keyboard className="w-4 h-4" />
            </button>
          </div>
        </header>

      {/* ═══ SLIDES ═══ */}
      <main className="flex-1 relative overflow-hidden mt-[52px] mb-[56px]">

        {day === 2 && (<>
        {/* ── SLIDE 1: TITLE ── */}
        <Slide current={cur} index={0}>
          <div className="flex-1 flex items-center">
            <div className="flex-1 max-w-xl pr-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded bg-coral-500 text-white font-bold text-[11px] uppercase tracking-wider">Prompt Engineering</span>
                <span className="text-ink-400 text-xs">• SAGO / MEDIA GROUPS</span>
              </div>
              <p className="text-navy-600 font-mono text-lg font-bold tracking-wider uppercase mb-2">Day 02</p>
              <h1 className="text-4xl md:text-[3.4rem] leading-[1.1] font-display text-ink-900 mb-2">
                PROMPT<br/>ENGINEERING
              </h1>
              <p className="text-2xl md:text-3xl font-editorial italic text-ink-600 mb-6">The Core Skill</p>
              <p className="text-ink-500 leading-relaxed max-w-md mb-10 border-l-2 border-cream-500 pl-4 text-sm">
                "Why does the same AI give great answers sometimes and terrible answers other times?" Learn the framework that makes every prompt predictable.
              </p>
              <div className="grid grid-cols-2 gap-6 border-t border-cream-400 pt-5">
                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-100 text-teal-600 shrink-0"><BookOpen className="w-5 h-5" /></div>
                  <div>
                    <p className="text-teal-600 font-mono text-[10px] uppercase tracking-wider font-bold mb-0.5">Topics</p>
                    <ul className="text-ink-500 text-xs space-y-0.5"><li>• Prompt Anatomy</li><li>• Hallucinations & Safety</li><li>• Zero vs Few-Shot</li></ul>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-navy-100 text-navy-600 shrink-0"><Layers className="w-5 h-5" /></div>
                  <div>
                    <p className="text-navy-600 font-mono text-[10px] uppercase tracking-wider font-bold mb-0.5">Platforms</p>
                    <ul className="text-ink-500 text-xs space-y-0.5"><li>• Custom GPTs (ChatGPT)</li><li>• Gems (Gemini)</li><li>• Skills (Claude)</li></ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block flex-1 max-w-md">
              <img src="/title-illustration.png" alt="Editorial illustration" className="w-full h-auto rounded-2xl shadow-lg object-cover max-h-[420px]" />
            </div>
          </div>
        </Slide>

        {/* ── SLIDE 2: SYSTEM vs USER PROMPT ── */}
        <Slide current={cur} index={1}>
          <SlideTag />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Two Layers of Instruction</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-6">System Prompt vs User Prompt</p>
          <div className="grid grid-cols-2 gap-6 flex-1 items-stretch max-h-[360px]">
            {/* System */}
            <div className="bg-cream-50 border-2 border-navy-600/20 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-3"><Shield className="w-5 h-5 text-navy-600" /><span className="font-mono text-xs uppercase tracking-wider text-navy-600 font-bold">System Prompt</span></div>
              <h3 className="text-2xl font-bold text-navy-700 mb-3">The Law</h3>
              <p className="text-ink-500 text-sm leading-relaxed mb-4">Always active. Sets identity, tone, rules, and boundaries. The model obeys this for <strong>every single message</strong>.</p>
              <div className="bg-navy-100/50 rounded-xl p-3.5 border border-navy-600/10 mt-auto">
                <p className="text-[11px] font-mono text-navy-700 leading-relaxed">"You are a professional proposal writer for SAGO Media Groups. Always respond in formal English. Never invent information not provided."</p>
              </div>
            </div>
            {/* User */}
            <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-3"><FileText className="w-5 h-5 text-ink-500" /><span className="font-mono text-xs uppercase tracking-wider text-ink-500 font-bold">User Prompt</span></div>
              <h3 className="text-2xl font-bold text-ink-800 mb-3">The Task</h3>
              <p className="text-ink-500 text-sm leading-relaxed mb-4">Sent per-request. The specific question or job the user needs done <strong>right now</strong>. Changes every message.</p>
              <div className="bg-cream-300/50 rounded-xl p-3.5 border border-cream-500 mt-auto">
                <p className="text-[11px] font-mono text-ink-700 leading-relaxed">"Write a proposal for Client X who needs a landing page with animations and SEO optimization. Budget: $2,000."</p>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-teal-100/50 border border-teal-600/20 rounded-xl p-3.5 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-xs text-ink-700"><strong className="text-teal-600">SAGO Rule:</strong> Every pipeline starts with a crafted system prompt. The user prompt is just the variable input.</p>
          </div>
          <SlideNum n={2} />
        </Slide>

        {/* ── SLIDE 3: PROMPT BUILDER (INTERACTIVE) ── */}
        <Slide current={cur} index={2}>
          <SlideTag />
          <h1 className="text-3xl md:text-4xl font-display mb-1">The 5-Part Prompt Framework</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-4">Interactive Prompt Builder</p>
          <div className="grid grid-cols-5 gap-6 flex-1 max-h-[380px]">
            {/* Toggle Cards */}
            <div className="col-span-2 space-y-2 overflow-y-auto pr-1">
              {frameworkParts.map((part, i) => (
                <button
                  key={i}
                  onClick={() => { setToggles(p => { const c = [...p]; c[i] = !c[i]; return c; }); playSound('click', muted); }}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 ${
                    toggles[i]
                      ? 'bg-navy-100/50 border-navy-600/40 shadow-sm'
                      : 'bg-cream-50 border-cream-400 hover:border-cream-500 opacity-60'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${toggles[i] ? 'bg-navy-600 text-white' : 'bg-cream-300 text-ink-400'}`}>{part.icon}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-xs uppercase tracking-wider">{part.label}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${toggles[i] ? 'bg-navy-600 text-white' : 'bg-cream-400 text-ink-400'}`}>{toggles[i] ? 'ON' : 'OFF'}</span>
                    </div>
                    <p className="text-[11px] text-ink-500 leading-snug truncate">{part.text}</p>
                  </div>
                </button>
              ))}
            </div>
            {/* Live Preview */}
            <div className="col-span-3 bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold">Constructed Prompt Preview</span>
                <button onClick={() => setToggles([false, false, false, false, false])} className="text-[10px] text-ink-400 hover:text-ink-700 font-mono bg-cream-200 px-2 py-0.5 rounded border border-cream-400">Clear All</button>
              </div>
              <div className="flex-1 bg-white rounded-xl p-4 border border-cream-300 overflow-y-auto text-sm font-mono text-ink-800 leading-relaxed min-h-[120px]">
                {activeCount === 0 ? (
                  <p className="text-ink-300 italic font-sans">Toggle sections on the left to build your prompt...</p>
                ) : (
                  frameworkParts.map((part, i) => toggles[i] ? (
                    <p key={i} className="mb-2"><span className="text-navy-600 font-bold">[{part.label}]</span> {part.text}</p>
                  ) : null)
                )}
              </div>
              {/* Quality Meter */}
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-400 shrink-0">Quality:</span>
                <div className="flex-1 h-2.5 bg-cream-300 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${qualityColor}`} style={{ width: `${(activeCount / 5) * 100}%` }} />
                </div>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                  activeCount <= 1 ? 'bg-coral-100 text-coral-500' : activeCount <= 3 ? 'bg-amber-100 text-amber-500' : 'bg-emerald-100 text-emerald-600'
                }`}>{qualityLabel} ({activeCount}/5)</span>
              </div>
            </div>
          </div>
          <SlideNum n={3} />
        </Slide>

        {/* ── SLIDE 4: HALLUCINATIONS ── */}
        <Slide current={cur} index={3}>
          <SlideTag />
          <h1 className="text-3xl md:text-4xl font-display mb-1">When AI Makes Things Up</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-coral-500 font-bold mb-5">Hallucination</p>
          <div className="grid grid-cols-2 gap-8 flex-1 items-center max-h-[340px]">
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-lg mb-1.5 text-ink-800">What is it?</h3>
                <p className="text-ink-500 text-sm leading-relaxed">The model generates <strong>confident, fluent text</strong> that is factually wrong. It sounds perfectly right — but it isn't.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1.5 text-ink-800">Why does it happen?</h3>
                <p className="text-ink-500 text-sm leading-relaxed">The model predicts the most <strong className="text-coral-500">likely</strong> next word — not the most <strong className="text-coral-500">true</strong> word. It has no concept of fact vs fiction.</p>
              </div>
              <div className="bg-cream-50 border border-cream-400 rounded-xl p-3.5">
                <p className="text-[11px] text-ink-500 font-mono"><span className="text-coral-500 font-bold">Try it:</span> Ask Claude "Who founded SAGO Media Groups and when?" It will confidently invent a name, a year, and a backstory.</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-2 text-ink-800 flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-600" /> How to Prevent It</h3>
              {[
                { n: '01', title: 'Supply facts in the prompt', desc: "Don't ask the model to recall — tell it the facts." },
                { n: '02', title: 'Add constraints', desc: '"Only use information below. If unsure, say I don\'t know."' },
                { n: '03', title: 'Verify critical outputs', desc: 'Always cross-check facts before publishing or shipping.' },
              ].map((item) => (
                <div key={item.n} className="flex items-start gap-3 bg-cream-50 border border-cream-400 rounded-xl p-3">
                  <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded shrink-0">{item.n}</span>
                  <div><p className="font-bold text-sm text-ink-800">{item.title}</p><p className="text-[11px] text-ink-500 mt-0.5">{item.desc}</p></div>
                </div>
              ))}
              <div className="bg-coral-100/50 border border-coral-500/20 rounded-xl p-3 flex items-start gap-2.5 mt-3">
                <AlertTriangle className="w-5 h-5 text-coral-500 shrink-0 mt-0.5" />
                <p className="text-xs text-ink-700"><strong className="text-coral-500">Warning:</strong> Hallucination is the #1 reason AI projects fail in production. Every SAGO pipeline must include a verification step.</p>
              </div>
            </div>
          </div>
          <SlideNum n={4} />
        </Slide>

        {/* ── SLIDE 5: ZERO-SHOT vs FEW-SHOT (INTERACTIVE) ── */}
        <Slide current={cur} index={4}>
          <SlideTag />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Show, Don't Just Tell</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-4">Zero-Shot vs Few-Shot</p>
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <button
              onClick={() => { setShotMode('zero'); playSound('click', muted); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${shotMode === 'zero' ? 'bg-ink-900 text-cream-50 border-ink-900' : 'bg-cream-50 text-ink-500 border-cream-400 hover:border-ink-300'}`}
            >Zero-Shot</button>
            <button
              onClick={() => { setShotMode('few'); playSound('click', muted); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${shotMode === 'few' ? 'bg-navy-600 text-white border-navy-600' : 'bg-cream-50 text-ink-500 border-cream-400 hover:border-ink-300'}`}
            >Few-Shot</button>
          </div>
          <div className="grid grid-cols-2 gap-6 flex-1 max-h-[290px]">
            {/* Prompt */}
            <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-3">The Prompt</span>
              <div className="flex-1 bg-white rounded-xl p-3.5 border border-cream-300 font-mono text-xs text-ink-700 leading-relaxed overflow-y-auto">
                {shotMode === 'zero' ? (
                  <p>Classify this client email as: <strong>Inquiry</strong>, <strong>Complaint</strong>, or <strong>Follow-up</strong>.<br/><br/>Email: "Hi, I'd like to know more about your web design services and pricing."</p>
                ) : (
                  <>
                    <p className="mb-2">Classify client emails. Here are examples:</p>
                    <div className="space-y-1.5 mb-3 pl-2 border-l-2 border-navy-600/20">
                      <p><span className="text-ink-400">Email:</span> "What are your rates for a landing page?"<br/><span className="text-navy-600 font-bold">→ Inquiry</span></p>
                      <p><span className="text-ink-400">Email:</span> "The project was delayed again, very disappointed."<br/><span className="text-navy-600 font-bold">→ Complaint</span></p>
                      <p><span className="text-ink-400">Email:</span> "Following up on last week's meeting about the project."<br/><span className="text-navy-600 font-bold">→ Follow-up</span></p>
                    </div>
                    <p>Now classify:<br/>"Hi, I'd like to know more about your web design services and pricing."</p>
                  </>
                )}
              </div>
            </div>
            {/* Output */}
            <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-3">AI Output</span>
              <div className="flex-1 bg-white rounded-xl p-3.5 border border-cream-300 flex flex-col justify-center">
                {shotMode === 'zero' ? (
                  <>
                    <p className="text-lg font-bold text-ink-800 mb-2">Inquiry</p>
                    <p className="text-sm text-ink-500 mb-4">The email is asking for more information.</p>
                    <span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg bg-amber-100 text-amber-500 text-xs font-bold border border-amber-500/20">
                      <AlertTriangle className="w-3.5 h-3.5" /> Acceptable — but inconsistent
                    </span>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold text-ink-800 mb-2">Inquiry</p>
                    <p className="text-sm text-ink-500 mb-1">This is a new potential client asking about services and pricing information.</p>
                    <p className="text-xs text-ink-400 italic mb-4">Confidence: High — matches the pattern of Example 1.</p>
                    <span className="inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-600 text-xs font-bold border border-emerald-600/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reliable & consistent
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 bg-teal-100/50 border border-teal-600/20 rounded-xl p-3 flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-xs text-ink-700"><strong className="text-teal-600">Key insight:</strong> Examples are the single most powerful prompt engineering technique. When in doubt, add examples.</p>
          </div>
          <SlideNum n={5} />
        </Slide>

        {/* ── SLIDE 6: FEYNMAN CHECKPOINT ── */}
        <Slide current={cur} index={5}>
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
            <span className="px-3 py-1 rounded-full bg-coral-100 text-coral-500 text-[10px] font-mono font-bold uppercase tracking-widest border border-coral-500/20 mb-4">Feynman Checkpoint • Day 02</span>
            <h1 className="text-4xl md:text-5xl font-display text-ink-900 mb-6">YOUR TURN TO JUDGE</h1>
            <div className="grid grid-cols-2 gap-5 w-full mb-6 text-left">
              <div className="bg-coral-100/30 border-2 border-coral-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2"><X className="w-4 h-4 text-coral-500" /><span className="font-bold text-coral-500 text-xs uppercase tracking-wider">Bad Prompt</span></div>
                <p className="font-mono text-sm text-ink-600">"Write me a proposal."</p>
              </div>
              <div className="bg-emerald-100/30 border-2 border-emerald-600/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="font-bold text-emerald-600 text-xs uppercase tracking-wider">Good Prompt</span></div>
                <p className="font-mono text-[11px] text-ink-600 leading-relaxed">"You are a professional proposal writer for SAGO Media Groups, a 2-person AI automation agency. Write a project proposal for a client who wants a website with animations. Use: Summary, Deliverables, Timeline, Price. Keep under 300 words."</p>
              </div>
            </div>
            <p className="text-ink-500 text-sm mb-5 font-editorial italic">Explain to your neighbor why the second prompt is better. Name at least 3 reasons.</p>
            {/* Timer */}
            <div className="flex items-center gap-4 bg-cream-50 border-2 border-cream-400 py-2.5 px-5 rounded-xl">
              <span className="text-ink-400 text-xs font-mono uppercase tracking-wider">Timer:</span>
              <span className={`text-3xl font-mono font-bold ${timeLeft <= 20 ? 'text-coral-500' : 'text-navy-700'} ${timerOn && timeLeft <= 20 ? 'animate-pulse' : ''}`}>{fmtTime(timeLeft)}</span>
              <button onClick={startTimer} className="p-2 rounded-lg bg-navy-100 text-navy-600 hover:bg-navy-600 hover:text-white transition-colors border border-navy-600/20">
                {timerOn ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={resetTimer} className="p-2 rounded-lg bg-cream-300 text-ink-500 hover:text-ink-700 transition-colors"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>
          <SlideNum n={6} />
        </Slide>

        {/* ── SLIDE 7: 3-ROUND LAB ── */}
        <Slide current={cur} index={6}>
          <SlideTag />
          <div className="flex justify-between items-start mb-4">
            <div><h1 className="text-3xl md:text-4xl font-display mb-1">The 3-Round Prompt Challenge</h1><p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold">Hands-on Lab</p></div>
            <span className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-600 border border-teal-600/20 font-mono text-[10px] font-bold uppercase">~15 mins</span>
          </div>
          <div className="grid grid-cols-3 gap-5 flex-1 max-h-[240px]">
            {[
              { n: '01', title: 'Vague Prompt', desc: 'Ask Claude: "Write a proposal for a website." Observe the generic, unfocused output.', foot: 'Baseline: No structure' },
              { n: '02', title: 'Add Role + Context', desc: 'Same task, but add your role and SAGO context. Observe the immediate improvement.', foot: 'Toggle: 2 parts enabled' },
              { n: '03', title: 'Full Framework', desc: 'Add format + constraints + 1 few-shot example. Observe professional-grade output.', foot: 'Toggle: All 5 parts enabled' },
            ].map((lab, i) => (
              <button key={i} onClick={() => toggleLab(i)} className={`text-left border-2 rounded-2xl p-5 flex flex-col transition-all ${labDone[i] ? 'bg-teal-100/30 border-teal-600/30' : 'bg-cream-50 border-cream-400 hover:border-cream-500'}`}>
                <div className="flex justify-between items-start w-full mb-2">
                  <span className="font-mono text-xs font-bold text-teal-600 tracking-wider">Round {lab.n}</span>
                  {labDone[i] ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <div className="w-5 h-5 rounded-full border-2 border-cream-500" />}
                </div>
                <h3 className="font-bold text-lg text-ink-800 mb-2">{lab.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed mb-auto">{lab.desc}</p>
                <p className="mt-3 pt-2 border-t border-cream-400 text-[10px] font-mono text-ink-400">{lab.foot}</p>
              </button>
            ))}
          </div>
          <div className="mt-5 text-center border-t border-cream-400 pt-4">
            <p className="text-ink-400 font-mono text-[10px] uppercase tracking-widest mb-1">Deliverable</p>
            <p className="text-lg font-bold text-ink-800">Save your final prompt as <span className="text-teal-600 font-mono">sago_system_prompt_v1.txt</span></p>
          </div>
          <SlideNum n={7} />
        </Slide>

        {/* ── SLIDE 8: OPEN vs CLOSED SOURCE ── */}
        <Slide current={cur} index={7}>
          <SlideTag />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Open Source vs Closed Source</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">The Model Landscape</p>
          <div className="grid grid-cols-2 gap-6 flex-1 items-stretch max-h-[300px]">
            <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3"><Lock className="w-5 h-5 text-navy-600" /><span className="font-bold text-navy-700 text-sm">Closed Source</span></div>
              <div className="flex flex-wrap gap-1.5 mb-3">{['Claude','GPT-4','Gemini'].map(m => <span key={m} className="px-2 py-0.5 rounded bg-navy-100 text-navy-600 text-[10px] font-mono font-bold">{m}</span>)}</div>
              <ul className="text-xs text-ink-500 space-y-1.5 flex-1"><li>• Access via API only</li><li>• Cannot see or modify model weights</li><li>• Strongest performance & reliability</li><li>• Pay per token (usage-based cost)</li><li>• Data transits through provider servers</li></ul>
            </div>
            <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3"><Unlock className="w-5 h-5 text-emerald-600" /><span className="font-bold text-emerald-600 text-sm">Open Source</span></div>
              <div className="flex flex-wrap gap-1.5 mb-3">{['Llama','Gemma','Mistral','Phi'].map(m => <span key={m} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-600 text-[10px] font-mono font-bold">{m}</span>)}</div>
              <ul className="text-xs text-ink-500 space-y-1.5 flex-1"><li>• Weights publicly downloadable</li><li>• Run on your own hardware</li><li>• Free inference, full privacy</li><li>• Full customization & fine-tuning</li><li>• Requires technical setup & hardware</li></ul>
            </div>
          </div>
          <div className="mt-4 bg-teal-100/50 border border-teal-600/20 rounded-xl p-3 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-xs text-ink-700"><strong className="text-teal-600">SAGO Rule:</strong> Use closed-source APIs for production pipelines (reliability). Use open-source for experimentation, privacy-sensitive work, and cost optimization.</p>
          </div>
          <SlideNum n={8} />
        </Slide>

        {/* ── SLIDE 9: RUNNING LOCALLY ── */}
        <Slide current={cur} index={8}>
          <SlideTag />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Your PC Is a Mini AI Lab</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">Running Gemma Locally</p>
          <div className="grid grid-cols-2 gap-8 flex-1 items-center max-h-[330px]">
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-lg mb-1.5">Why this matters</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[{icon:<Globe className="w-4 h-4"/>,t:'Zero API cost'},{icon:<Shield className="w-4 h-4"/>,t:'Full privacy'},{icon:<Zap className="w-4 h-4"/>,t:'Works offline'}].map((b,i)=>(
                    <div key={i} className="bg-cream-50 border border-cream-400 rounded-xl p-2.5 text-center"><div className="text-teal-600 flex justify-center mb-1">{b.icon}</div><p className="text-[10px] font-bold text-ink-700">{b.t}</p></div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">What you need</h3>
                <ul className="text-sm text-ink-500 space-y-1"><li>• Modern laptop/desktop with <strong>16GB+ RAM</strong></li><li>• A tool like <strong className="text-teal-600">Ollama</strong> or LM Studio</li></ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Steps</h3>
                <div className="space-y-1.5">
                  {['Install Ollama from ollama.com','Run: ollama run gemma3','Chat with it in your terminal'].map((s,i)=>(
                    <div key={i} className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{i+1}</span><p className="text-xs text-ink-600">{s}</p></div>
                  ))}
                </div>
              </div>
            </div>
            {/* Terminal mockup */}
            <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-lg border border-ink-700/20">
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#252542] border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-coral-500/80" /><div className="w-3 h-3 rounded-full bg-amber-500/80" /><div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-white/40 font-mono ml-2">Terminal — Ollama</span>
              </div>
              <div className="p-4 font-mono text-xs leading-relaxed text-white/80 space-y-2">
                <p><span className="text-emerald-400">$</span> ollama run gemma3</p>
                <p className="text-white/40">pulling manifest...</p>
                <p className="text-emerald-400">✓ gemma3:latest ready</p>
                <p className="mt-3 text-white/40">{'>>>'} <span className="text-white">What is prompt engineering?</span></p>
                <p className="mt-2 text-teal-400/80">Prompt engineering is the art of crafting effective inputs to AI language models. A well-structured prompt includes a clear role, relevant context, a specific task, the desired output format, and any constraints.</p>
                <p className="mt-2 text-white/40">{'>>>'} <span className="text-white/60 animate-pulse">_</span></p>
              </div>
            </div>
          </div>
          <SlideNum n={9} />
        </Slide>

        {/* ── SLIDE 10: CUSTOM GPTs ── */}
        <Slide current={cur} index={9}>
          <SlideTag text="SAGO / Platform Features" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-ink-900 flex items-center justify-center"><Sparkles className="w-5 h-5 text-cream-50" /></div>
            <div><h1 className="text-3xl font-display mb-0">Custom GPTs</h1><p className="font-mono text-xs uppercase tracking-widest text-ink-400 font-bold">ChatGPT / OpenAI</p></div>
          </div>
          <p className="text-sm text-ink-500 mb-4 max-w-2xl">A persistent, reusable ChatGPT assistant with custom instructions, uploaded knowledge files, and connected tools — created via a no-code conversational builder.</p>
          <div className="grid grid-cols-4 gap-3 mb-4 max-h-[140px]">
            {[
              { icon: <FileText className="w-5 h-5" />, title: 'Custom Instructions', desc: 'Define behavior, tone, goals, boundaries, and rules', color: 'text-navy-600 bg-navy-100' },
              { icon: <BookOpen className="w-5 h-5" />, title: 'Knowledge Files', desc: 'Upload PDFs, CSVs as a private RAG database', color: 'text-teal-600 bg-teal-100' },
              { icon: <Plug className="w-5 h-5" />, title: 'Actions (APIs)', desc: 'Connect external services via OpenAPI schema', color: 'text-coral-500 bg-coral-100' },
              { icon: <Code2 className="w-5 h-5" />, title: 'Built-in Tools', desc: 'DALL·E, Code Interpreter, Web Browsing', color: 'text-amber-500 bg-amber-100' },
            ].map((f, i) => (
              <div key={i} className="bg-cream-50 border border-cream-400 rounded-xl p-3 flex flex-col">
                <div className={`p-2 rounded-lg w-fit mb-2 ${f.color}`}>{f.icon}</div>
                <h4 className="font-bold text-xs text-ink-800 mb-1">{f.title}</h4>
                <p className="text-[10px] text-ink-500 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-coral-100/30 border border-coral-500/20 rounded-xl p-3 flex items-center gap-3">
              <Lock className="w-5 h-5 text-coral-500 shrink-0" />
              <div><p className="text-xs font-bold text-ink-800">Create: Paid Only ($20/mo Plus)</p><p className="text-[10px] text-ink-500">Free users can <em>use</em> existing GPTs, not create them.</p></div>
            </div>
            <div className="bg-navy-100/30 border border-navy-600/20 rounded-xl p-3 flex items-center gap-3">
              <Star className="w-5 h-5 text-navy-600 shrink-0" />
              <div><p className="text-xs font-bold text-ink-800">GPT Store</p><p className="text-[10px] text-ink-500">Publish publicly. Revenue sharing program available.</p></div>
            </div>
          </div>
          <SlideNum n={10} />
        </Slide>

        {/* ── SLIDE 11: GEMS ── */}
        <Slide current={cur} index={10}>
          <SlideTag text="SAGO / Platform Features" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-navy-600 flex items-center justify-center"><Search className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-3xl font-display mb-0">Gems</h1><p className="font-mono text-xs uppercase tracking-widest text-ink-400 font-bold">Google Gemini</p></div>
          </div>
          <p className="text-sm text-ink-500 mb-4 max-w-2xl">Specialized, reusable Gemini assistants configured with custom instructions and uploaded knowledge. One-click access from the sidebar.</p>
          <div className="grid grid-cols-4 gap-3 mb-4 max-h-[140px]">
            {[
              { icon: <FileText className="w-5 h-5" />, title: 'Custom Instructions', desc: 'Define persona, task, context, output format', color: 'text-navy-600 bg-navy-100' },
              { icon: <HardDrive className="w-5 h-5" />, title: 'Knowledge Files', desc: 'Attach from device or Google Drive', color: 'text-teal-600 bg-teal-100' },
              { icon: <Zap className="w-5 h-5" />, title: 'Default Tools', desc: 'Deep Research, image generation, Workspace', color: 'text-amber-500 bg-amber-100' },
              { icon: <Users className="w-5 h-5" />, title: 'Sharing', desc: 'Distribute to teammates for standardized workflows', color: 'text-emerald-600 bg-emerald-100' },
            ].map((f, i) => (
              <div key={i} className="bg-cream-50 border border-cream-400 rounded-xl p-3 flex flex-col">
                <div className={`p-2 rounded-lg w-fit mb-2 ${f.color}`}>{f.icon}</div>
                <h4 className="font-bold text-xs text-ink-800 mb-1">{f.title}</h4>
                <p className="text-[10px] text-ink-500 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-100/30 border border-emerald-600/20 rounded-xl p-3 flex items-center gap-3">
              <Unlock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div><p className="text-xs font-bold text-ink-800">Free for All Users (18+)</p><p className="text-[10px] text-ink-500">Paid plans unlock higher limits and better models.</p></div>
            </div>
            <div className="bg-navy-100/30 border border-navy-600/20 rounded-xl p-3 flex items-center gap-3">
              <Globe className="w-5 h-5 text-navy-600 shrink-0" />
              <div><p className="text-xs font-bold text-ink-800">Google Ecosystem</p><p className="text-[10px] text-ink-500">Deep Drive, Docs, Sheets integration. "Magic wand" auto-improves instructions.</p></div>
            </div>
          </div>
          <SlideNum n={11} />
        </Slide>

        {/* ── SLIDE 12: SKILLS ── */}
        <Slide current={cur} index={11}>
          <SlideTag text="SAGO / Platform Features" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center"><Award className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-3xl font-display mb-0">Skills</h1><p className="font-mono text-xs uppercase tracking-widest text-ink-400 font-bold">Anthropic Claude</p></div>
          </div>
          <p className="text-sm text-ink-500 mb-4 max-w-2xl">Modular packages of instructions + scripts that teach Claude specific workflows. Uses <strong>"progressive disclosure"</strong> — loads full instructions only when the task is relevant.</p>
          <div className="grid grid-cols-4 gap-3 mb-4 max-h-[140px]">
            {[
              { icon: <FileText className="w-5 h-5" />, title: 'skill.md', desc: 'YAML frontmatter with name, description, and steps', color: 'text-teal-600 bg-teal-100' },
              { icon: <BookOpen className="w-5 h-5" />, title: 'Support Assets', desc: 'Template files, reference docs, examples', color: 'text-navy-600 bg-navy-100' },
              { icon: <Terminal className="w-5 h-5" />, title: 'Scripts', desc: 'Executable scripts running in Claude sandbox', color: 'text-coral-500 bg-coral-100' },
              { icon: <Plug className="w-5 h-5" />, title: 'MCP Tools', desc: 'Slack, Notion, GitHub, Drive via MCP protocol', color: 'text-amber-500 bg-amber-100' },
            ].map((f, i) => (
              <div key={i} className="bg-cream-50 border border-cream-400 rounded-xl p-3 flex flex-col">
                <div className={`p-2 rounded-lg w-fit mb-2 ${f.color}`}>{f.icon}</div>
                <h4 className="font-bold text-xs text-ink-800 mb-1">{f.title}</h4>
                <p className="text-[10px] text-ink-500 leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-100/30 border border-emerald-600/20 rounded-xl p-3 flex items-center gap-3">
              <Unlock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div><p className="text-xs font-bold text-ink-800">Free on All Plans</p><p className="text-[10px] text-ink-500">Code execution must be enabled in settings.</p></div>
            </div>
            <div className="bg-teal-100/30 border border-teal-600/20 rounded-xl p-3 flex items-center gap-3">
              <Zap className="w-5 h-5 text-teal-600 shrink-0" />
              <div><p className="text-xs font-bold text-ink-800">Progressive Disclosure</p><p className="text-[10px] text-ink-500">~100 tokens loaded initially. Full instructions load on-demand. Most efficient.</p></div>
            </div>
          </div>
          <SlideNum n={12} />
        </Slide>

        {/* ── SLIDE 13: PLATFORM COMPARISON (INTERACTIVE) ── */}
        <Slide current={cur} index={12}>
          <SlideTag text="SAGO / Platform Features" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Skills vs Gems vs Custom GPTs</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-4">Choose Your Platform — Click to Highlight</p>
          <div className="flex-1 overflow-auto max-h-[340px]">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-cream-400">
                  <th className="text-left py-2.5 px-3 font-mono text-[10px] uppercase tracking-widest text-ink-400 w-[140px]">Feature</th>
                  {[
                    { key: 'claude', label: 'Claude Skills', color: 'teal' },
                    { key: 'gemini', label: 'Gemini Gems', color: 'navy' },
                    { key: 'chatgpt', label: 'Custom GPTs', color: 'ink' },
                  ].map(p => (
                    <th key={p.key}
                      onClick={() => { setPlatform(prev => prev === p.key ? null : p.key); playSound('click', muted); }}
                      className={`text-center py-2.5 px-3 cursor-pointer transition-all rounded-t-xl ${
                        platform === p.key
                          ? p.key === 'claude' ? 'bg-teal-100 text-teal-600' : p.key === 'gemini' ? 'bg-navy-100 text-navy-600' : 'bg-cream-300 text-ink-800'
                          : 'hover:bg-cream-100 text-ink-600'
                      }`}
                    >
                      <span className="font-bold text-sm">{p.label}</span>
                      {p.key === 'claude' && <span className="ml-1.5 text-[8px] bg-teal-600 text-white px-1.5 py-0.5 rounded font-mono">SAGO</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feat: 'Platform', claude: 'Anthropic Claude', gemini: 'Google Gemini', chatgpt: 'OpenAI ChatGPT' },
                  { feat: 'Creation Method', claude: 'File-based (skill.md)', gemini: 'UI Builder', chatgpt: 'Chat Builder (no-code)' },
                  { feat: 'Knowledge Files', claude: '✅ Bundled assets', gemini: '✅ Device + Google Drive', chatgpt: '✅ Upload (RAG)' },
                  { feat: 'Tool Connections', claude: 'MCP Protocol', gemini: 'Google Workspace', chatgpt: 'OpenAPI Actions' },
                  { feat: 'Code Execution', claude: '✅ Bundled scripts', gemini: '❌ Not available', chatgpt: '✅ Code Interpreter' },
                  { feat: 'Sharing', claude: 'Team / Org', gemini: 'Link / Team', chatgpt: 'GPT Store (Public)' },
                  { feat: 'Free Plan Access', claude: '✅ Full access', gemini: '✅ Full access', chatgpt: '❌ Create = Paid' },
                  { feat: 'Context Efficiency', claude: '⭐ Progressive disclosure', gemini: 'Standard', chatgpt: 'Standard' },
                  { feat: 'Best For', claude: 'Dev workflows, pipelines', gemini: 'Google ecosystem users', chatgpt: 'No-code business tools' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-cream-300">
                    <td className="py-2.5 px-3 font-bold text-ink-600">{row.feat}</td>
                    {['claude', 'gemini', 'chatgpt'].map(k => (
                      <td key={k} className={`py-2.5 px-3 text-center transition-all ${
                        platform === k
                          ? k === 'claude' ? 'bg-teal-100/50' : k === 'gemini' ? 'bg-navy-100/50' : 'bg-cream-300/50'
                          : ''
                      }`}>
                        <span className={row[k].startsWith('✅') ? 'text-emerald-600 font-bold' : row[k].startsWith('❌') ? 'text-coral-500 font-bold' : row[k].startsWith('⭐') ? 'text-amber-500 font-bold' : 'text-ink-600'}>
                          {row[k]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SlideNum n={13} />
        </Slide>

        {/* ── SLIDE 14: CLAUDE 3.5 SONNET MODEL PROFILE ── */}
        <Slide current={cur} index={13}>
          <SlideTag text="SAGO / Model Profiles" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 font-bold font-mono text-sm">Cl</div>
            <div>
              <h1 className="text-3xl font-display mb-0">Claude 3.5 Sonnet</h1>
              <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold">The Precision Developer & Writer</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-6 flex-1 max-h-[340px] items-stretch">
            <div className="col-span-3 bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-ink-800 mb-3">Key Abilities & Strengths</h3>
                <ul className="text-xs text-ink-600 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                    <span><strong>Industry-Leading Code Generation:</strong> Unmatched at writing clean scripts, understanding complex repositories, and debugging.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                    <span><strong>Natural & Nuanced Copywriting:</strong> Writes in a warm, professional, human-like voice. Far less robotic or repetitive than standard LLMs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                    <span><strong>Strict Constraint Following:</strong> Highly obedient to detailed system instructions, making it ideal for automation pipelines.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-teal-100/40 border border-teal-600/20 rounded-xl p-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                <p className="text-[11px] text-teal-800 font-mono"><strong>Best For:</strong> Writing production code, draft reports, and client proposals.</p>
              </div>
            </div>
            <div className="col-span-2 space-y-3 flex flex-col">
              <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-4 flex-1 flex flex-col justify-center">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-2">Ideal Use Cases</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs"><Code2 className="w-4 h-4 text-teal-600" /><span className="text-ink-700">Software development & scripts</span></div>
                  <div className="flex items-center gap-2 text-xs"><FileText className="w-4 h-4 text-teal-600" /><span className="text-ink-700">Technical documentation & briefs</span></div>
                  <div className="flex items-center gap-2 text-xs"><Users className="w-4 h-4 text-teal-600" /><span className="text-ink-700">Writing custom agent system prompts</span></div>
                </div>
              </div>
              <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-4 flex-1 flex flex-col justify-center">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-2.5">Core Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-cream-200/50 border border-cream-300 rounded-lg p-1.5"><p className="text-[10px] font-mono text-ink-400 uppercase">Context</p><p className="font-bold text-xs text-ink-800">200,000 Tokens</p></div>
                  <div className="bg-cream-200/50 border border-cream-300 rounded-lg p-1.5"><p className="text-[10px] font-mono text-ink-400 uppercase">Coding Level</p><p className="font-bold text-xs text-teal-600">State-of-the-Art</p></div>
                </div>
              </div>
            </div>
          </div>
          <SlideNum n={14} />
        </Slide>

        {/* ── SLIDE 15: GEMINI 1.5 PRO MODEL PROFILE ── */}
        <Slide current={cur} index={14}>
          <SlideTag text="SAGO / Model Profiles" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center text-navy-600 font-bold font-mono text-sm">Ge</div>
            <div>
              <h1 className="text-3xl font-display mb-0">Gemini 1.5 Pro</h1>
              <p className="font-mono text-xs uppercase tracking-widest text-navy-600 font-bold">The Mega-Context & Multimodal Giant</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-6 flex-1 max-h-[340px] items-stretch">
            <div className="col-span-3 bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-ink-800 mb-3">Key Abilities & Strengths</h3>
                <ul className="text-xs text-ink-600 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy-600 mt-1.5 shrink-0" />
                    <span><strong>Unrivaled Memory (2 Million Tokens):</strong> Can upload up to 60,000 lines of code, a 1,500-page book, or 1 hour of video in a single prompt.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy-600 mt-1.5 shrink-0" />
                    <span><strong>Native Multimodal Architecture:</strong> Built to process video, audio, text, charts, and diagrams together without losing details.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy-600 mt-1.5 shrink-0" />
                    <span><strong>Deep Google Integration:</strong> Seamlessly retrieves files, drafts emails, and edits sheets directly inside Google Workspace.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-navy-100/40 border border-navy-600/20 rounded-xl p-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-navy-600 shrink-0" />
                <p className="text-[11px] text-navy-800 font-mono"><strong>Best For:</strong> Mass data analysis, video files, and Google Drive integrations.</p>
              </div>
            </div>
            <div className="col-span-2 space-y-3 flex flex-col">
              <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-4 flex-1 flex flex-col justify-center">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-2">Ideal Use Cases</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs"><Globe className="w-4 h-4 text-navy-600" /><span className="text-ink-700">Analyzing long video tutorials / meetings</span></div>
                  <div className="flex items-center gap-2 text-xs"><HardDrive className="w-4 h-4 text-navy-600" /><span className="text-ink-700">Searching full database folders at once</span></div>
                  <div className="flex items-center gap-2 text-xs"><Users className="w-4 h-4 text-navy-600" /><span className="text-ink-700">Workspace document collaboration</span></div>
                </div>
              </div>
              <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-4 flex-1 flex flex-col justify-center">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-2.5">Core Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-cream-200/50 border border-cream-300 rounded-lg p-1.5"><p className="text-[10px] font-mono text-ink-400 uppercase">Context</p><p className="font-bold text-xs text-ink-800">2,000,000 Tokens</p></div>
                  <div className="bg-cream-200/50 border border-cream-300 rounded-lg p-1.5"><p className="text-[10px] font-mono text-ink-400 uppercase">Multimodal</p><p className="font-bold text-xs text-navy-600">Video + Audio + Text</p></div>
                </div>
              </div>
            </div>
          </div>
          <SlideNum n={15} />
        </Slide>

        {/* ── SLIDE 16: GPT-4o MODEL PROFILE ── */}
        <Slide current={cur} index={15}>
          <SlideTag text="SAGO / Model Profiles" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center text-cream-50 font-bold font-mono text-sm">Gp</div>
            <div>
              <h1 className="text-3xl font-display mb-0">GPT-4o / Reasoning Models</h1>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-700 font-bold">The Advanced Reasoner & Agentic Utility Knife</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-6 flex-1 max-h-[340px] items-stretch">
            <div className="col-span-3 bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-ink-800 mb-3">Key Abilities & Strengths</h3>
                <ul className="text-xs text-ink-600 space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-800 mt-1.5 shrink-0" />
                    <span><strong>Deep Step-by-Step Reasoning (o1/o3):</strong> Solves complex math, advanced programming, and scientific logic by "thinking" before answering.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-800 mt-1.5 shrink-0" />
                    <span><strong>Unmatched Speed & Action Ecosystem:</strong> Real-time APIs, rich custom tools (DALL·E, Code Interpreter), and a vast ecosystem of custom APIs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-800 mt-1.5 shrink-0" />
                    <span><strong>Ultra-Low Latency Conversational Voice:</strong> Native real-time audio and voice support for fluid dialogue applications.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-ink-100 border border-ink-400/20 rounded-xl p-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ink-700 shrink-0" />
                <p className="text-[11px] text-ink-800 font-mono"><strong>Best For:</strong> Real-time search, voice assistants, and advanced logic/math.</p>
              </div>
            </div>
            <div className="col-span-2 space-y-3 flex flex-col">
              <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-4 flex-1 flex flex-col justify-center">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-2">Ideal Use Cases</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs"><Zap className="w-4 h-4 text-ink-600" /><span className="text-ink-700">Math, logic, and reasoning pipelines</span></div>
                  <div className="flex items-center gap-2 text-xs"><Plug className="w-4 h-4 text-ink-600" /><span className="text-ink-700">Connecting external web APIs & Actions</span></div>
                  <div className="flex items-center gap-2 text-xs"><Search className="w-4 h-4 text-ink-600" /><span className="text-ink-700">Real-time search & agentic browsing</span></div>
                </div>
              </div>
              <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-4 flex-1 flex flex-col justify-center">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-2.5">Core Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-cream-200/50 border border-cream-300 rounded-lg p-1.5"><p className="text-[10px] font-mono text-ink-400 uppercase">Context</p><p className="font-bold text-xs text-ink-800">128,000 Tokens</p></div>
                  <div className="bg-cream-200/50 border border-cream-300 rounded-lg p-1.5"><p className="text-[10px] font-mono text-ink-400 uppercase">Ecosystem</p><p className="font-bold text-xs text-ink-600">Plug & Play APIs</p></div>
                </div>
              </div>
            </div>
          </div>
          <SlideNum n={16} />
        </Slide>

        {/* ── SLIDE 17: FEYNMAN FINAL ── */}
        <Slide current={cur} index={16}>
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
            <span className="px-3 py-1 rounded-full bg-coral-100 text-coral-500 text-[10px] font-mono font-bold uppercase tracking-widest border border-coral-500/20 mb-4 animate-pulse">Final Checkpoint • Day 02</span>
            <h1 className="text-4xl md:text-5xl font-display text-ink-900 mb-6">YOUR TURN TO BUILD</h1>
            <div className="bg-cream-50 border-2 border-cream-400 p-6 rounded-2xl mb-6 w-full text-left">
              <p className="text-lg md:text-xl text-ink-700 leading-relaxed font-editorial">
                "You need to create a reusable AI assistant that writes SAGO client proposals. It must know SAGO's brand voice, follow a specific template, and refuse to add information not in the client brief.<br/><br/>
                <strong className="text-ink-900">Which platform feature would you use — and what 5 elements must your instructions include?</strong>"
              </p>
            </div>
            <button
              onClick={() => { setRevealed(!revealed); if (!revealed) { confetti({ particleCount: 60, spread: 55 }); playSound('success', muted); } }}
              className="px-6 py-3 rounded-xl bg-navy-600 hover:bg-navy-700 text-white font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-navy-600/20 flex items-center gap-2 mb-5"
            >
              {revealed ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              {revealed ? 'Hide Solution' : 'Reveal Suggested Solution'}
            </button>
            <div className={`w-full text-left transition-all duration-500 overflow-hidden ${revealed ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="border-t-2 border-cream-400 pt-4">
                <p className="text-teal-600 text-xs uppercase tracking-widest font-mono font-bold mb-2">What Good Looks Like</p>
                <div className="bg-cream-50 border border-cream-400 p-4 rounded-xl">
                  <p className="text-sm text-ink-600 leading-relaxed mb-2">Use <strong className="text-teal-600">Claude Skills</strong> (or Custom GPTs / Gems — all valid). The 5 required elements:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Role','Context','Task','Format','Constraints'].map((e,i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-600 text-xs font-bold border border-teal-600/20">{i+1}. {e}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SlideNum n={17} />
        </Slide>
        </>)}

        {day === 3 && (<>
        {/* ── DAY 3 SLIDE 1: TITLE ── */}
        <Slide current={cur} index={0}>
          <div className="flex-1 flex items-center">
            <div className="flex-1 max-w-xl pr-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded bg-teal-600 text-white font-bold text-[11px] uppercase tracking-wider">Connectors & MCP</span>
                <span className="text-ink-400 text-xs">• SAGO / MEDIA GROUPS</span>
              </div>
              <p className="text-teal-600 font-mono text-lg font-bold tracking-wider uppercase mb-2">Day 03</p>
              <h1 className="text-4xl md:text-[3.4rem] leading-[1.1] font-display text-ink-900 mb-2">
                CONNECT AI<br/>TO EVERYTHING
              </h1>
              <p className="text-2xl md:text-3xl font-editorial italic text-ink-600 mb-6">The Universal Plug</p>
              <p className="text-ink-500 leading-relaxed max-w-md mb-10 border-l-2 border-cream-500 pl-4 text-sm">
                "A powerful brain is useless if it can't see, hear, or touch the world." Learn how to give Claude direct access to your tools.
              </p>
              <div className="grid grid-cols-2 gap-6 border-t border-cream-400 pt-5">
                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-100 text-teal-600 shrink-0"><Cable className="w-5 h-5" /></div>
                  <div>
                    <p className="text-teal-600 font-mono text-[10px] uppercase tracking-wider font-bold mb-0.5">Topics</p>
                    <ul className="text-ink-500 text-xs space-y-0.5"><li>• MCP Protocol</li><li>• Claude Connectors</li><li>• Skills + Connectors</li></ul>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-navy-100 text-navy-600 shrink-0"><Layers className="w-5 h-5" /></div>
                  <div>
                    <p className="text-navy-600 font-mono text-[10px] uppercase tracking-wider font-bold mb-0.5">Outcome</p>
                    <ul className="text-ink-500 text-xs space-y-0.5"><li>• Connect Gmail, Drive, Slack</li><li>• Build real workflows</li><li>• Combine with Day 2 Skills</li></ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block flex-1 max-w-md">
              <img src="/day3-illustration.png" alt="Editorial illustration" className="w-full h-auto rounded-2xl shadow-lg object-cover max-h-[420px]" />
            </div>
          </div>
        </Slide>

        {/* ── DAY 3 SLIDE 2: AI IS TRAPPED ── */}
        <Slide current={cur} index={1}>
          <SlideTag text="SAGO / The Problem" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">AI Lives in a Copy-Paste Prison</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-coral-500 font-bold mb-5">The Problem</p>
          <div className="grid grid-cols-2 gap-8 flex-1 items-center max-h-[340px]">
            <div className="space-y-4">
              <p className="text-sm text-ink-600 leading-relaxed">Without connections, <strong>you</strong> are the middleman. Every interaction is a manual loop of copying and pasting between tools.</p>
              <div className="space-y-2">
                {['Open Google Drive → Copy client brief', 'Switch to Claude → Paste the brief', 'Copy Claude\'s response', 'Switch to Slack → Paste the reply'].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-cream-50 border border-cream-400 rounded-xl p-3">
                    <span className="w-6 h-6 rounded-full bg-coral-100 text-coral-500 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-xs text-ink-600">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 mb-2">
                <WifiOff className="w-5 h-5 text-coral-500" />
                <span className="font-mono text-xs uppercase tracking-wider text-coral-500 font-bold">Disconnected</span>
              </div>
              <div className="w-full space-y-2">
                <div className="bg-white border border-cream-300 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-ink-700">👤 You</p>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-coral-500" /></div>
                <div className="bg-coral-100/50 border border-coral-500/20 rounded-xl p-2 text-center">
                  <p className="text-[10px] font-mono text-coral-500">Copy from Drive</p>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-coral-500" /></div>
                <div className="bg-cream-100 border border-cream-400 rounded-xl p-2 text-center">
                  <p className="text-[10px] font-mono text-ink-500">Paste into Claude</p>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-4 h-4 text-coral-500" /></div>
                <div className="bg-coral-100/50 border border-coral-500/20 rounded-xl p-2 text-center">
                  <p className="text-[10px] font-mono text-coral-500">Copy response → Paste into Slack</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-coral-100/50 border border-coral-500/20 rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-coral-500 shrink-0" />
            <p className="text-xs text-ink-700"><strong className="text-coral-500">Reality:</strong> Every time you copy-paste, you lose time, context, and accuracy.</p>
          </div>
          <SlideNum n={2} />
        </Slide>

        {/* ── DAY 3 SLIDE 3: WHAT IF AI COULD PLUG IN ── */}
        <Slide current={cur} index={2}>
          <SlideTag text="SAGO / The Solution" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Direct Access, Zero Middleman</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-4">Before vs After</p>
          <div className="flex items-center justify-center gap-4 mb-5">
            <button onClick={() => { setD3BeforeAfter('before'); playSound('click', muted); }} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${d3BeforeAfter === 'before' ? 'bg-coral-500 text-white border-coral-500' : 'bg-cream-50 text-ink-500 border-cream-400 hover:border-ink-300'}`}>Without Connectors</button>
            <button onClick={() => { setD3BeforeAfter('after'); playSound('click', muted); }} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${d3BeforeAfter === 'after' ? 'bg-teal-600 text-white border-teal-600' : 'bg-cream-50 text-ink-500 border-cream-400 hover:border-ink-300'}`}>With Connectors</button>
          </div>
          <div className="flex-1 max-h-[300px]">
            {d3BeforeAfter === 'before' ? (
              <div className="bg-cream-50 border-2 border-coral-500/20 rounded-2xl p-6 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4"><WifiOff className="w-5 h-5 text-coral-500" /><span className="font-bold text-coral-500 text-sm">Manual Workflow</span></div>
                <div className="space-y-3">
                  {['You open Google Drive and copy the client brief', 'You switch to Claude and paste the content', 'You copy Claude\'s response manually', 'You switch to Slack and paste the message'].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-coral-100 text-coral-500 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <div className="flex-1 bg-white border border-cream-300 rounded-lg p-2"><p className="text-xs text-ink-600">{s}</p></div>
                      {i < 3 && <ArrowRight className="w-4 h-4 text-coral-400 shrink-0" />}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-[10px] font-mono text-coral-500">4 steps • 4 tab switches • context lost each time</p>
              </div>
            ) : (
              <div className="bg-cream-50 border-2 border-teal-600/20 rounded-2xl p-6 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4"><Wifi className="w-5 h-5 text-teal-600" /><span className="font-bold text-teal-600 text-sm">Connected Workflow</span></div>
                <div className="flex items-center justify-center gap-6">
                  <div className="bg-teal-100 border-2 border-teal-600/30 rounded-2xl p-4 text-center">
                    <Sparkles className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <p className="font-bold text-sm text-teal-700">Claude</p>
                  </div>
                  <div className="space-y-3">
                    {[{name: 'Google Drive', icon: <HardDrive className="w-4 h-4" />}, {name: 'Slack', icon: <MessageSquare className="w-4 h-4" />}, {name: 'Gmail', icon: <Mail className="w-4 h-4" />}].map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <ArrowRightLeft className="w-4 h-4 text-teal-500" />
                        <div className="bg-white border border-teal-600/20 rounded-lg px-3 py-2 flex items-center gap-2">
                          <span className="text-teal-600">{t.icon}</span>
                          <span className="text-xs font-bold text-ink-700">{t.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-center text-[10px] font-mono text-teal-600">1 message • 0 tab switches • full context preserved</p>
              </div>
            )}
          </div>
          <div className="mt-3 bg-teal-100/50 border border-teal-600/20 rounded-xl p-3 flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-xs text-ink-700"><strong className="text-teal-600">Key insight:</strong> Connectors don't make Claude smarter — they make Claude <em>useful</em>. Access is the missing piece.</p>
          </div>
          <SlideNum n={3} />
        </Slide>

        {/* ── DAY 3 SLIDE 4: MCP USB-C ── */}
        <Slide current={cur} index={3}>
          <SlideTag text="SAGO / Protocol" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">One Standard to Connect Them All</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">MCP: The USB-C for AI</p>
          <div className="grid grid-cols-2 gap-6 flex-1 items-stretch max-h-[300px]">
            <div className="bg-cream-50 border-2 border-coral-500/20 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3"><X className="w-5 h-5 text-coral-500" /><span className="font-bold text-coral-500 text-sm">Before MCP</span></div>
              <div className="space-y-3 flex-1">
                {['Claude → Custom API → Google Drive', 'Claude → Different API → Slack', 'Claude → Another API → Gmail'].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 bg-coral-100/30 border border-coral-500/15 rounded-lg p-2.5">
                    <Unplug className="w-4 h-4 text-coral-500 shrink-0" />
                    <p className="text-[11px] text-ink-600 font-mono">{s}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] font-mono text-coral-500 text-center">3 different integrations • 3 different formats</p>
            </div>
            <div className="bg-cream-50 border-2 border-teal-600/20 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3"><CheckCircle2 className="w-5 h-5 text-teal-600" /><span className="font-bold text-teal-600 text-sm">After MCP</span></div>
              <div className="flex items-center justify-center gap-4 flex-1">
                <div className="bg-teal-100 border border-teal-600/20 rounded-xl p-3 text-center">
                  <Sparkles className="w-6 h-6 text-teal-600 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-teal-700">Claude</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ArrowRightLeft className="w-5 h-5 text-teal-500" />
                  <span className="text-[8px] font-mono font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded">MCP</span>
                </div>
                <div className="space-y-2">
                  {['Drive', 'Slack', 'Gmail'].map((t, i) => (
                    <div key={i} className="bg-white border border-teal-600/15 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px] font-bold text-ink-700">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-[10px] font-mono text-teal-600 text-center">1 protocol • 1 format • infinite tools</p>
            </div>
          </div>
          <div className="mt-4 bg-navy-100/50 border border-navy-600/20 rounded-xl p-3.5 flex items-center gap-4">
            <div className="space-y-1">
              {[{l: 'Created by', v: 'Anthropic (Nov 2024)'}, {l: 'License', v: 'Open Source (Linux Foundation)'}, {l: 'Ecosystem', v: '400+ connectors available'}].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-[10px] text-navy-600 font-bold w-20">{f.l}:</span>
                  <span className="text-ink-600">{f.v}</span>
                </div>
              ))}
            </div>
          </div>
          <SlideNum n={4} />
        </Slide>

        {/* ── DAY 3 SLIDE 5: HOW MCP WORKS ── */}
        <Slide current={cur} index={4}>
          <SlideTag text="SAGO / Protocol" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Three Actors, One Conversation</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">How MCP Works</p>
          <div className="flex items-center justify-center gap-4 flex-1 max-h-[300px]">
            {[
              { id: 0, icon: <Sparkles className="w-8 h-8" />, title: 'Claude', subtitle: 'The Brain', desc: 'Thinks, reasons, and decides what to do. Sends structured requests through MCP.', color: 'teal' },
              { id: 1, icon: <Cable className="w-8 h-8" />, title: 'Connector', subtitle: 'The Bridge', desc: 'Translates Claude\'s request into the tool\'s language. Handles auth and formatting.', color: 'navy' },
              { id: 2, icon: <Cloud className="w-8 h-8" />, title: 'Tool', subtitle: 'The Service', desc: 'Google Drive, Slack, Gmail, etc. Does the actual work and returns results.', color: 'ink' },
            ].map((card, i) => (
              <React.Fragment key={card.id}>
                <button
                  onClick={() => { setD3McpStep(d3McpStep === card.id ? null : card.id); playSound('click', muted); }}
                  className={`flex-1 max-w-[220px] border-2 rounded-2xl p-5 text-center transition-all flex flex-col items-center gap-3 ${
                    d3McpStep === card.id
                      ? card.color === 'teal' ? 'bg-teal-100/50 border-teal-600/40 shadow-lg' : card.color === 'navy' ? 'bg-navy-100/50 border-navy-600/40 shadow-lg' : 'bg-cream-100 border-ink-400/40 shadow-lg'
                      : 'bg-cream-50 border-cream-400 hover:border-cream-500'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${
                    card.color === 'teal' ? 'bg-teal-100 text-teal-600' : card.color === 'navy' ? 'bg-navy-100 text-navy-600' : 'bg-cream-200 text-ink-600'
                  }`}>{card.icon}</div>
                  <h3 className="font-bold text-lg text-ink-800">{card.title}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-400 font-bold">{card.subtitle}</span>
                  <p className={`text-xs text-ink-500 leading-relaxed transition-all ${d3McpStep === card.id ? 'opacity-100 max-h-20' : 'opacity-60 max-h-8 overflow-hidden'}`}>{card.desc}</p>
                </button>
                {i < 2 && <ArrowRight className="w-5 h-5 text-ink-300 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-4 bg-teal-100/50 border border-teal-600/20 rounded-xl p-3 flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-xs text-ink-700"><strong className="text-teal-600">Key insight:</strong> Claude never talks to tools directly. The Connector is always the translator in the middle.</p>
          </div>
          <SlideNum n={5} />
        </Slide>

        {/* ── DAY 3 SLIDE 6: WHAT FLOWS THROUGH MCP ── */}
        <Slide current={cur} index={5}>
          <SlideTag text="SAGO / Protocol" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Three Types of Data</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">What Flows Through MCP?</p>
          <div className="grid grid-cols-3 gap-5 flex-1 max-h-[320px]">
            {[
              { id: 0, icon: <Zap className="w-6 h-6" />, title: 'Tools', desc: 'Actions Claude can perform', examples: ['Send a Slack message', 'Create a GitHub issue', 'Draft an email'], color: 'teal' },
              { id: 1, icon: <Database className="w-6 h-6" />, title: 'Resources', desc: 'Data Claude can read', examples: ['Files in Drive', 'Emails in inbox', 'Database rows'], color: 'navy' },
              { id: 2, icon: <FileText className="w-6 h-6" />, title: 'Prompts', desc: 'Pre-built templates', examples: ['Summarize this thread', 'Draft a reply', 'Triage this issue'], color: 'amber' },
            ].map(card => (
              <button
                key={card.id}
                onClick={() => { setD3FlowCard(d3FlowCard === card.id ? null : card.id); playSound('click', muted); }}
                className={`text-left border-2 rounded-2xl p-5 flex flex-col transition-all ${
                  d3FlowCard === card.id
                    ? card.color === 'teal' ? 'bg-teal-100/50 border-teal-600/40 shadow-md' : card.color === 'navy' ? 'bg-navy-100/50 border-navy-600/40 shadow-md' : 'bg-amber-100/50 border-amber-500/40 shadow-md'
                    : 'bg-cream-50 border-cream-400 hover:border-cream-500'
                }`}
              >
                <div className={`p-2.5 rounded-xl mb-3 w-fit ${
                  card.color === 'teal' ? 'bg-teal-100 text-teal-600' : card.color === 'navy' ? 'bg-navy-100 text-navy-600' : 'bg-amber-100 text-amber-500'
                }`}>{card.icon}</div>
                <h3 className="font-bold text-xl text-ink-800 mb-1">{card.title}</h3>
                <p className="text-xs text-ink-500 mb-3">{card.desc}</p>
                <div className={`space-y-1.5 transition-all ${d3FlowCard === card.id ? 'opacity-100 max-h-40' : 'opacity-50 max-h-16 overflow-hidden'}`}>
                  {card.examples.map((ex, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <ChevronRight className="w-3 h-3 text-ink-400 shrink-0" />
                      <span className="text-ink-600">{ex}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <SlideNum n={6} />
        </Slide>

        {/* ── DAY 3 SLIDE 7: SETTING UP ── */}
        <Slide current={cur} index={6}>
          <SlideTag text="SAGO / Connectors" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">3 Clicks. That's It.</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">Setting Up a Connector</p>
          <div className="grid grid-cols-3 gap-5 flex-1 max-h-[280px]">
            {[
              { n: '01', title: 'Click + in chat bar', desc: 'Open any Claude conversation and click the + button next to the message input.', icon: <Plug className="w-6 h-6" /> },
              { n: '02', title: 'Browse & pick', desc: 'Search the connector directory. Find Gmail, Drive, Slack, or any of 400+ options.', icon: <Search className="w-6 h-6" /> },
              { n: '03', title: 'Sign in with OAuth', desc: 'Authorize with your existing account. No API keys, no code, no configuration files.', icon: <ShieldCheck className="w-6 h-6" /> },
            ].map((step, i) => (
              <div key={i} className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col items-center text-center">
                <span className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold text-lg flex items-center justify-center mb-3">{step.n}</span>
                <div className="p-3 rounded-xl bg-teal-100 text-teal-600 mb-3">{step.icon}</div>
                <h3 className="font-bold text-lg text-ink-800 mb-2">{step.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-emerald-100/50 border border-emerald-600/20 rounded-xl p-3.5 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs text-ink-700"><strong className="text-emerald-600">Available on ALL plans including Free.</strong> No coding required. No API keys. Just click, connect, go.</p>
          </div>
          <SlideNum n={7} />
        </Slide>

        {/* ── DAY 3 SLIDE 8: CONNECTOR DIRECTORY ── */}
        <Slide current={cur} index={7}>
          <SlideTag text="SAGO / Connectors" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">400+ Connectors, Every Category</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-4">The Connector Directory</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'productivity', label: 'Productivity', icon: <Layers className="w-3.5 h-3.5" /> },
              { key: 'communication', label: 'Communication', icon: <MessageSquare className="w-3.5 h-3.5" /> },
              { key: 'development', label: 'Development', icon: <Code2 className="w-3.5 h-3.5" /> },
              { key: 'creative', label: 'Creative', icon: <Palette className="w-3.5 h-3.5" /> },
              { key: 'finance', label: 'Finance', icon: <Star className="w-3.5 h-3.5" /> },
              { key: 'search', label: 'Search', icon: <Search className="w-3.5 h-3.5" /> },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => { setD3Category(d3Category === cat.key ? null : cat.key); playSound('click', muted); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                  d3Category === cat.key ? 'bg-teal-600 text-white border-teal-600' : 'bg-cream-50 text-ink-500 border-cream-400 hover:border-cream-500'
                }`}
              >{cat.icon} {cat.label}</button>
            ))}
          </div>
          <div className="flex-1 max-h-[260px] overflow-y-auto">
            {(() => {
              const data = {
                productivity: ['Google Drive', 'Google Calendar', 'Notion', 'Asana', 'Jira', 'Linear', 'Microsoft 365'],
                communication: ['Slack', 'Gmail'],
                development: ['GitHub', 'Sentry', 'Vercel', 'Supabase', 'MongoDB'],
                creative: ['Figma', 'Adobe CC', 'Blender', 'Canva'],
                finance: ['Stripe', 'Xero', 'HubSpot', 'Shopify'],
                search: ['Tavily', 'Exa', 'Firecrawl'],
              };
              const items = d3Category ? data[d3Category] || [] : Object.values(data).flat();
              return (
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {items.map((name, i) => (
                    <div key={i} className="bg-cream-50 border border-cream-400 rounded-xl p-2.5 text-center hover:border-teal-600/30 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-1.5">
                        <Plug className="w-4 h-4" />
                      </div>
                      <p className="text-[10px] font-bold text-ink-700 leading-tight">{name}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
          <SlideNum n={8} />
        </Slide>

        {/* ── DAY 3 SLIDE 9: CONNECTOR CAPABILITIES ── */}
        <Slide current={cur} index={8}>
          <SlideTag text="SAGO / Connectors" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Real Capabilities, Real Power</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-4">What Each Connector Unlocks</p>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[340px]">
            {[
              { id: 0, name: 'Gmail', icon: <Mail className="w-5 h-5" />, caps: ['Search inbox by sender, subject, or date', 'Read full email threads', 'Draft professional replies', 'Send emails on your behalf'] },
              { id: 1, name: 'Google Drive', icon: <HardDrive className="w-5 h-5" />, caps: ['Browse folders and file trees', 'Read Google Docs, Sheets, and PDFs', 'Search files by name or content', 'Upload and organize files'] },
              { id: 2, name: 'Slack', icon: <MessageSquare className="w-5 h-5" />, caps: ['Read channel messages', 'Summarize long threads', 'Draft and send messages', 'Search message history'] },
              { id: 3, name: 'Notion', icon: <BookOpen className="w-5 h-5" />, caps: ['Search across all pages', 'Create new pages and content', 'Update database entries', 'Query and filter tables'] },
              { id: 4, name: 'GitHub', icon: <GitBranch className="w-5 h-5" />, caps: ['Read repository contents', 'Manage issues and labels', 'Create pull requests', 'Review code changes'] },
            ].map(conn => (
              <button
                key={conn.id}
                onClick={() => { setD3Connector(d3Connector === conn.id ? null : conn.id); playSound('click', muted); }}
                className={`w-full text-left border-2 rounded-xl p-3.5 transition-all ${
                  d3Connector === conn.id ? 'bg-teal-100/50 border-teal-600/30 shadow-sm' : 'bg-cream-50 border-cream-400 hover:border-cream-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-600 shrink-0">{conn.icon}</div>
                  <span className="font-bold text-sm text-ink-800 flex-1">{conn.name}</span>
                  <ChevronRight className={`w-4 h-4 text-ink-400 transition-transform ${d3Connector === conn.id ? 'rotate-90' : ''}`} />
                </div>
                <div className={`transition-all overflow-hidden ${d3Connector === conn.id ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="grid grid-cols-2 gap-1.5 pl-12">
                    {conn.caps.map((cap, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-xs text-ink-600">
                        <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <SlideNum n={9} />
        </Slide>

        {/* ── DAY 3 SLIDE 10: SKILLS + CONNECTORS ── */}
        <Slide current={cur} index={9}>
          <SlideTag text="SAGO / The Combo" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Day 2 + Day 3 = Magic</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">Skills + Connectors = Superpowers</p>
          <div className="flex-1 flex flex-col items-center justify-center max-h-[340px]">
            <div className="flex items-center gap-5 mb-6">
              <div className="bg-coral-100/50 border-2 border-coral-500/30 rounded-2xl p-5 w-52 text-center">
                <Award className="w-8 h-8 text-coral-500 mx-auto mb-2" />
                <h3 className="font-bold text-base text-coral-600 mb-2">Your Skill</h3>
                <ul className="text-[10px] text-ink-500 space-y-1 text-left">
                  <li>• Custom personality</li>
                  <li>• Tone & rules</li>
                  <li>• 5-part framework</li>
                </ul>
              </div>
              <span className="text-3xl font-bold text-ink-300">+</span>
              <div className="bg-teal-100/50 border-2 border-teal-600/30 rounded-2xl p-5 w-52 text-center">
                <Cable className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <h3 className="font-bold text-base text-teal-700 mb-2">Connector</h3>
                <ul className="text-[10px] text-ink-500 space-y-1 text-left">
                  <li>• Gmail access</li>
                  <li>• Drive access</li>
                  <li>• Real-time data</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 border-t-2 border-dashed border-ink-300" />
              <span className="text-2xl font-bold text-ink-300">=</span>
              <div className="w-8 border-t-2 border-dashed border-ink-300" />
            </div>
            <div className="bg-navy-100/50 border-2 border-navy-600/30 rounded-2xl p-5 max-w-md text-center">
              <Sparkles className="w-8 h-8 text-navy-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg text-navy-700 mb-2">Superpower</h3>
              <p className="text-sm text-ink-600">Claude writes emails in <strong>YOUR</strong> voice using <strong>YOUR</strong> data — automatically.</p>
            </div>
          </div>
          <SlideNum n={10} />
        </Slide>

        {/* ── DAY 3 SLIDE 11: REAL WORKFLOWS ── */}
        <Slide current={cur} index={10}>
          <SlideTag text="SAGO / Use Cases" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Workflows You Can Build Today</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">Real SAGO Workflows</p>
          <div className="grid grid-cols-2 gap-4 flex-1 max-h-[340px]">
            {[
              { icon: <FileText className="w-5 h-5" />, title: 'Proposal Skill + Drive', color: 'teal', steps: ['Client brief in Drive', 'Claude reads it via connector', 'Drafts proposal in SAGO format'] },
              { icon: <Mail className="w-5 h-5" />, title: 'Email Skill + Gmail', color: 'navy', steps: ['You say "email Ravi about the deadline"', 'Claude drafts in your tone', 'You approve & send'] },
              { icon: <Palette className="w-5 h-5" />, title: 'Social Media Skill + Notion', color: 'coral', steps: ['Content database in Notion', 'Claude generates Instagram captions', 'Saves drafts back to Notion'] },
              { icon: <MessageSquare className="w-5 h-5" />, title: 'Support Skill + Slack', color: 'amber', steps: ['Team question in Slack', 'Claude reads the thread', 'Responds with company knowledge'] },
            ].map((wf, i) => (
              <div key={i} className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-4 flex flex-col hover:border-cream-500 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-2 rounded-lg ${
                    wf.color === 'teal' ? 'bg-teal-100 text-teal-600' : wf.color === 'navy' ? 'bg-navy-100 text-navy-600' : wf.color === 'coral' ? 'bg-coral-100 text-coral-500' : 'bg-amber-100 text-amber-500'
                  }`}>{wf.icon}</div>
                  <h3 className="font-bold text-sm text-ink-800">{wf.title}</h3>
                </div>
                <div className="space-y-2 flex-1">
                  {wf.steps.map((step, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cream-300 text-ink-500 text-[9px] font-bold flex items-center justify-center shrink-0">{j + 1}</span>
                      <p className="text-[11px] text-ink-600">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <SlideNum n={11} />
        </Slide>

        {/* ── DAY 3 SLIDE 12: SECURITY ── */}
        <Slide current={cur} index={11}>
          <SlideTag text="SAGO / Safety" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">5 Rules to Stay Safe</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-coral-500 font-bold mb-5">Security Rules</p>
          <div className="flex-1 space-y-2.5 max-h-[340px] overflow-y-auto">
            {[
              { icon: <Shield className="w-5 h-5" />, rule: 'Claude acts as YOU — your permissions, your access level' },
              { icon: <Eye className="w-5 h-5" />, rule: 'Dangerous actions always ask for your approval first' },
              { icon: <Lock className="w-5 h-5" />, rule: 'Your connector data is NOT used for AI training' },
              { icon: <ShieldCheck className="w-5 h-5" />, rule: 'Only connect what you need — least privilege' },
              { icon: <RotateCcw className="w-5 h-5" />, rule: 'Review and revoke unused connectors regularly' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!d3SecurityDone[i]) {
                    setD3SecurityDone(p => { const c = [...p]; c[i] = true; return c; });
                    playSound('click', muted);
                    confetti({ particleCount: 15, spread: 30, origin: { y: 0.7 } });
                  }
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  d3SecurityDone[i] ? 'bg-emerald-100/30 border-emerald-600/30' : 'bg-cream-50 border-cream-400 hover:border-cream-500'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${d3SecurityDone[i] ? 'bg-emerald-100 text-emerald-600' : 'bg-cream-200 text-ink-500'}`}>{item.icon}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-ink-800">{item.rule}</p>
                </div>
                {d3SecurityDone[i] ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-cream-500 shrink-0" />}
              </button>
            ))}
          </div>
          <div className="mt-3 text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
              d3SecurityDone.every(Boolean) ? 'bg-emerald-100 text-emerald-600 border-emerald-600/20' : 'bg-cream-100 text-ink-400 border-cream-400'
            }`}>
              {d3SecurityDone.filter(Boolean).length}/5 acknowledged
            </span>
          </div>
          <SlideNum n={12} />
        </Slide>

        {/* ── DAY 3 SLIDE 13: FEYNMAN LAB ── */}
        <Slide current={cur} index={12}>
          <SlideTag text="SAGO / Hands-On" />
          <div className="flex justify-between items-start mb-4">
            <div><h1 className="text-3xl md:text-4xl font-display mb-1">Lab: Skill + Connector in Action</h1><p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold">Feynman Lab</p></div>
            <span className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-600 border border-teal-600/20 font-mono text-[10px] font-bold uppercase">~15 mins</span>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1 max-h-[280px]">
            {[
              { n: '01', title: 'Connect Gmail', desc: 'Open Claude → Click + → Add the Gmail connector and authorize with your Google account.' },
              { n: '02', title: 'Activate Your Skill', desc: 'Activate your Email Writing Skill from Day 2. If you don\'t have one, create a quick system prompt.' },
              { n: '03', title: 'Run the Combo', desc: 'Ask Claude: "Using my email skill, draft a professional follow-up email to Ravi about the website project deadline next Friday."' },
              { n: '04', title: 'Evaluate the Result', desc: 'Does the email match YOUR preferred voice and style? Is the tone right? Would you actually send this?' },
            ].map((step, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!d3LabDone[i]) {
                    setD3LabDone(p => { const c = [...p]; c[i] = true; return c; });
                    playSound('click', muted);
                    confetti({ particleCount: 12, spread: 35, origin: { y: 0.8 } });
                  }
                }}
                className={`text-left border-2 rounded-2xl p-4 flex flex-col transition-all ${
                  d3LabDone[i] ? 'bg-teal-100/30 border-teal-600/30' : 'bg-cream-50 border-cream-400 hover:border-cream-500'
                }`}
              >
                <div className="flex justify-between items-start w-full mb-2">
                  <span className="font-mono text-xs font-bold text-teal-600 tracking-wider">Step {step.n}</span>
                  {d3LabDone[i] ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <div className="w-5 h-5 rounded-full border-2 border-cream-500" />}
                </div>
                <h3 className="font-bold text-base text-ink-800 mb-2">{step.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{step.desc}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center border-t border-cream-400 pt-3">
            <p className="text-ink-400 font-mono text-[10px] uppercase tracking-widest mb-1">Deliverable</p>
            <p className="text-base font-bold text-ink-800">Save a screenshot of the result as <span className="text-teal-600 font-mono">proof_skill_connector.png</span></p>
          </div>
          <SlideNum n={13} />
        </Slide>

        {/* ── DAY 3 SLIDE 14: FINAL CHECKPOINT ── */}
        <Slide current={cur} index={13}>
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
            <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-600 text-[10px] font-mono font-bold uppercase tracking-widest border border-teal-600/20 mb-4 animate-pulse">Final Checkpoint • Day 03</span>
            <h1 className="text-4xl md:text-5xl font-display text-ink-900 mb-6">PROVE YOU LEARNED IT</h1>
            <div className="bg-cream-50 border-2 border-cream-400 p-6 rounded-2xl mb-6 w-full text-left">
              <p className="text-lg md:text-xl text-ink-700 leading-relaxed font-editorial">
                "What protocol powers Claude Connectors? Name 3 connectors you can use today. What happens when you combine a Skill with a Connector?"<br/><br/>
                <strong className="text-ink-900">Answer all three questions to pass.</strong>
              </p>
            </div>
            <button
              onClick={() => { setD3Revealed(!d3Revealed); if (!d3Revealed) { confetti({ particleCount: 60, spread: 55 }); playSound('success', muted); } }}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-teal-600/20 flex items-center gap-2 mb-5"
            >
              {d3Revealed ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              {d3Revealed ? 'Hide Solution' : 'Reveal Suggested Solution'}
            </button>
            <div className={`w-full text-left transition-all duration-500 overflow-hidden ${d3Revealed ? 'max-h-[250px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="border-t-2 border-cream-400 pt-4">
                <p className="text-teal-600 text-xs uppercase tracking-widest font-mono font-bold mb-2">What Good Looks Like</p>
                <div className="bg-cream-50 border border-cream-400 p-4 rounded-xl">
                  <p className="text-sm text-ink-600 leading-relaxed mb-3"><strong className="text-teal-600">MCP</strong> (Model Context Protocol) powers Claude Connectors.</p>
                  <p className="text-sm text-ink-600 leading-relaxed mb-3"><strong className="text-teal-600">Connectors:</strong> Gmail, Google Drive, Slack (+ any 3 from the directory).</p>
                  <p className="text-sm text-ink-600 leading-relaxed"><strong className="text-teal-600">Skills + Connectors:</strong> Skills provide the brain (rules & personality) + Connectors provide the hands (access to real tools) = AI that works exactly how you want, with real data.</p>
                </div>
              </div>
            </div>
          </div>
          <SlideNum n={14} />
        </Slide>
        </>)}

        {day === 4 && (<>
        {/* ── DAY 4 SLIDE 1: TITLE ── */}
        <Slide current={cur} index={0}>
          <div className="flex-1 flex items-center">
            <div className="flex-1 max-w-xl pr-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded bg-coral-500 text-white font-bold text-[11px] uppercase tracking-wider">Agentic Automation</span>
                <span className="text-ink-400 text-xs">• SAGO / MEDIA GROUPS</span>
              </div>
              <p className="text-coral-500 font-mono text-lg font-bold tracking-wider uppercase mb-2">Day 04</p>
              <h1 className="text-4xl md:text-[3.2rem] leading-[1.1] font-display text-ink-900 mb-2">
                SLACK EMAIL<br/>ORCHESTRATOR
              </h1>
              <p className="text-2xl md:text-3xl font-editorial italic text-ink-600 mb-6">Build an Autonomous Agent</p>
              <p className="text-ink-500 leading-relaxed max-w-md mb-10 border-l-2 border-cream-500 pl-4 text-sm">
                "What if your AI could watch Slack, detect a command, draft custom emails, and report back — all without you lifting a finger?"
              </p>
              <div className="grid grid-cols-2 gap-6 border-t border-cream-400 pt-5">
                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-100 text-teal-600 shrink-0"><BookOpen className="w-5 h-5" /></div>
                  <div>
                    <p className="text-teal-600 font-mono text-[10px] uppercase tracking-wider font-bold mb-0.5">Concepts</p>
                    <ul className="text-ink-500 text-xs space-y-0.5"><li>• Queue Files &amp; State</li><li>• Agent Workflows</li><li>• Skill Definitions</li></ul>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2.5 rounded-xl bg-navy-100 text-navy-600 shrink-0"><Layers className="w-5 h-5" /></div>
                  <div>
                    <p className="text-navy-600 font-mono text-[10px] uppercase tracking-wider font-bold mb-0.5">MCP Tools</p>
                    <ul className="text-ink-500 text-xs space-y-0.5"><li>• Slack (poll, react, post)</li><li>• Gmail (send_email)</li><li>• Cron Scheduling</li></ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block flex-1 max-w-md">
              <img src="/day4-illustration.png" alt="Slack email orchestrator" className="w-full h-auto rounded-2xl shadow-lg object-cover max-h-[420px]" />
            </div>
          </div>
        </Slide>

        {/* ── DAY 4 SLIDE 2: ARCHITECTURE ── */}
        <Slide current={cur} index={1}>
          <SlideTag text="SAGO / Architecture" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">How the Pieces Connect</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">System Architecture</p>
          <div className="flex items-center justify-center gap-3 flex-1 max-h-[300px]">
            {[
              { id: 0, icon: <MessageSquare className="w-7 h-7" />, title: 'Slack', subtitle: 'Trigger', desc: 'User posts !run-emails in a channel. Agent polls history to detect new commands.', color: 'teal' },
              { id: 1, icon: <Sparkles className="w-7 h-7" />, title: 'AI Agent', subtitle: 'Orchestrator', desc: 'Reads agent.md rules. Checks state, processes queue, coordinates tools.', color: 'navy' },
              { id: 2, icon: <FileText className="w-7 h-7" />, title: 'State Files', subtitle: 'Memory', desc: 'emails_to_send.txt (queue) and last_processed_ts.txt (dedup state).', color: 'amber' },
              { id: 3, icon: <Mail className="w-7 h-7" />, title: 'Gmail', subtitle: 'Output', desc: 'Sends customized professional emails via the Gmail MCP connector.', color: 'coral' },
            ].map((card, i) => (
              <React.Fragment key={card.id}>
                <button
                  onClick={() => { setD4PipelineStep(d4PipelineStep === card.id ? null : card.id); playSound('click', muted); }}
                  className={`flex-1 max-w-[200px] border-2 rounded-2xl p-4 text-center transition-all flex flex-col items-center gap-2 ${
                    d4PipelineStep === card.id
                      ? card.color === 'teal' ? 'bg-teal-100/50 border-teal-600/40 shadow-lg' : card.color === 'navy' ? 'bg-navy-100/50 border-navy-600/40 shadow-lg' : card.color === 'amber' ? 'bg-amber-100/50 border-amber-500/40 shadow-lg' : 'bg-coral-100/50 border-coral-500/40 shadow-lg'
                      : 'bg-cream-50 border-cream-400 hover:border-cream-500'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${
                    card.color === 'teal' ? 'bg-teal-100 text-teal-600' : card.color === 'navy' ? 'bg-navy-100 text-navy-600' : card.color === 'amber' ? 'bg-amber-100 text-amber-500' : 'bg-coral-100 text-coral-500'
                  }`}>{card.icon}</div>
                  <h3 className="font-bold text-base text-ink-800">{card.title}</h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-ink-400 font-bold">{card.subtitle}</span>
                  <p className={`text-[10px] text-ink-500 leading-relaxed transition-all ${d4PipelineStep === card.id ? 'opacity-100 max-h-20' : 'opacity-50 max-h-6 overflow-hidden'}`}>{card.desc}</p>
                </button>
                {i < 3 && <ArrowRight className="w-4 h-4 text-ink-300 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-4 bg-teal-100/50 border border-teal-600/20 rounded-xl p-3 flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-xs text-ink-700"><strong className="text-teal-600">Key insight:</strong> The agent orchestrates everything. Slack is the trigger, files are the memory, Gmail is the output. No human in the loop.</p>
          </div>
          <SlideNum n={2} />
        </Slide>

        {/* ── DAY 4 SLIDE 3: QUEUE FILE ── */}
        <Slide current={cur} index={2}>
          <SlideTag text="SAGO / Queue" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">The Work Queue</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-4">emails_to_send.txt</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <button onClick={() => { setD4QueueTab('before'); playSound('click', muted); }} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${d4QueueTab === 'before' ? 'bg-navy-600 text-white border-navy-600' : 'bg-cream-50 text-ink-500 border-cream-400'}`}>Before (Pending)</button>
            <button onClick={() => { setD4QueueTab('after'); playSound('click', muted); }} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${d4QueueTab === 'after' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-cream-50 text-ink-500 border-cream-400'}`}>After (Sent)</button>
          </div>
          <div className="grid grid-cols-2 gap-6 flex-1 max-h-[280px]">
            <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-3">File Contents</span>
              <div className={`flex-1 rounded-xl p-4 border font-mono text-xs leading-relaxed overflow-y-auto ${d4QueueTab === 'before' ? 'bg-white border-cream-300 text-ink-700' : 'bg-emerald-100/30 border-emerald-600/20 text-ink-700'}`}>
                <p className="text-ink-400">---</p>
                <p>Email: <span className="text-navy-600">example@example.com</span></p>
                <p>Context: <span className="text-ink-600">Ask for feedback on the email automation workflow.</span></p>
                {d4QueueTab === 'before' ? (
                  <p>Status: <span className="text-amber-500 font-bold">Pending</span></p>
                ) : (
                  <p>Status: <span className="text-emerald-600 font-bold">Sent (ID: 19ec92fc at 2026-06-15)</span></p>
                )}
                <p className="text-ink-400">---</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2 text-ink-800">How It Works</h3>
                <div className="space-y-2">
                  {[
                    { n: '01', text: 'Each email block has Email, Context, and Status fields' },
                    { n: '02', text: 'Agent scans for blocks with Status: Pending' },
                    { n: '03', text: 'After sending, status updates to Sent with ID and timestamp' },
                  ].map(item => (
                    <div key={item.n} className="flex items-start gap-3 bg-cream-50 border border-cream-400 rounded-xl p-2.5">
                      <span className="font-mono text-xs font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded shrink-0">{item.n}</span>
                      <p className="text-xs text-ink-600">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-navy-100/50 border border-navy-600/20 rounded-xl p-3 flex items-center gap-2.5">
                <Lightbulb className="w-5 h-5 text-navy-600 shrink-0" />
                <p className="text-[11px] text-ink-700"><strong className="text-navy-600">Why text files?</strong> No database needed. Simple, readable, and the AI can read/write them directly.</p>
              </div>
            </div>
          </div>
          <SlideNum n={3} />
        </Slide>

        {/* ── DAY 4 SLIDE 4: STATE MANAGEMENT ── */}
        <Slide current={cur} index={3}>
          <SlideTag text="SAGO / State" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Preventing Duplicate Runs</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-coral-500 font-bold mb-5">State Management</p>
          <div className="grid grid-cols-2 gap-8 flex-1 items-center max-h-[340px]">
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-lg mb-1.5 text-ink-800">The Problem</h3>
                <p className="text-ink-500 text-sm leading-relaxed">If the agent polls Slack every 5 minutes and sees <strong className="text-coral-500">!run-emails</strong>, how does it know it hasn't already processed that command?</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1.5 text-ink-800">The Solution</h3>
                <p className="text-ink-500 text-sm leading-relaxed">Save the <strong className="text-teal-600">timestamp (ts)</strong> of the last processed trigger message. Only process commands with a timestamp <strong>strictly greater</strong> than the saved value.</p>
              </div>
              <div className="bg-cream-50 border border-cream-400 rounded-xl p-3.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-400 font-bold mb-2">last_processed_ts.txt</p>
                <p className="font-mono text-lg font-bold text-teal-600">1781447206.850019</p>
                <p className="text-[10px] text-ink-400 mt-1">Updated after every successful trigger execution</p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-lg mb-2 text-ink-800 flex items-center gap-2"><Shield className="w-5 h-5 text-teal-600" /> The Logic</h3>
              {[
                { n: '01', title: 'Initialize to 0', desc: 'File starts with "0" — process any trigger found.' },
                { n: '02', title: 'Poll Slack history', desc: 'Get latest messages from the channel.' },
                { n: '03', title: 'Compare timestamps', desc: 'If trigger message ts > saved ts → new command found.' },
                { n: '04', title: 'Update immediately', desc: 'Overwrite the file with the new ts BEFORE processing.' },
              ].map(item => (
                <div key={item.n} className="flex items-start gap-3 bg-cream-50 border border-cream-400 rounded-xl p-3">
                  <span className="font-mono text-xs font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded shrink-0">{item.n}</span>
                  <div><p className="font-bold text-sm text-ink-800">{item.title}</p><p className="text-[11px] text-ink-500 mt-0.5">{item.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <SlideNum n={4} />
        </Slide>

        {/* ── DAY 4 SLIDE 5: AGENT WORKFLOW ── */}
        <Slide current={cur} index={4}>
          <SlideTag text="SAGO / Workflow" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">The Agent's Rulebook</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">agent.md — Execution Pipeline</p>
          <div className="grid grid-cols-5 gap-3 flex-1 max-h-[320px]">
            {[
              { n: '1', title: 'Poll', desc: 'Call slack_get_channel_history for the target channel.', icon: <MessageSquare className="w-5 h-5" />, color: 'teal' },
              { n: '2', title: 'Detect', desc: 'Scan messages for !run-emails with ts > saved timestamp.', icon: <Search className="w-5 h-5" />, color: 'navy' },
              { n: '3', title: 'Acknowledge', desc: 'React with eyes emoji to the trigger message.', icon: <Eye className="w-5 h-5" />, color: 'amber' },
              { n: '4', title: 'Execute', desc: 'Process all Pending emails from the queue file.', icon: <Send className="w-5 h-5" />, color: 'coral' },
              { n: '5', title: 'Complete', desc: 'React with checkmark and post confirmation to Slack.', icon: <CheckCircle2 className="w-5 h-5" />, color: 'emerald' },
            ].map(step => (
              <div key={step.n} className="border-2 rounded-2xl p-4 flex flex-col items-center text-center transition-all bg-cream-50 border-cream-400 hover:shadow-md">
                <span className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center mb-2 ${
                  step.color === 'teal' ? 'bg-teal-600 text-white' : step.color === 'navy' ? 'bg-navy-600 text-white' : step.color === 'amber' ? 'bg-amber-500 text-white' : step.color === 'coral' ? 'bg-coral-500 text-white' : 'bg-emerald-600 text-white'
                }`}>{step.n}</span>
                <div className={`p-2 rounded-xl mb-2 ${
                  step.color === 'teal' ? 'bg-teal-100 text-teal-600' : step.color === 'navy' ? 'bg-navy-100 text-navy-600' : step.color === 'amber' ? 'bg-amber-100 text-amber-500' : step.color === 'coral' ? 'bg-coral-100 text-coral-500' : 'bg-emerald-100 text-emerald-600'
                }`}>{step.icon}</div>
                <h3 className="font-bold text-sm text-ink-800 mb-1">{step.title}</h3>
                <p className="text-[10px] text-ink-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-teal-100/50 border border-teal-600/20 rounded-xl p-3 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-xs text-ink-700"><strong className="text-teal-600">Key Rule:</strong> If no new trigger is found, the agent does nothing. No unnecessary API calls, no wasted tokens.</p>
          </div>
          <SlideNum n={5} />
        </Slide>

        {/* ── DAY 4 SLIDE 6: SKILL DEFINITION ── */}
        <Slide current={cur} index={5}>
          <SlideTag text="SAGO / Skill" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Teaching AI to Write Emails</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">draft_email_skill.md</p>
          <div className="grid grid-cols-2 gap-6 flex-1 items-stretch max-h-[320px]">
            <div className="bg-cream-50 border-2 border-cream-400 rounded-2xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3"><Award className="w-5 h-5 text-teal-600" /><span className="font-mono text-xs uppercase tracking-wider text-teal-600 font-bold">Drafting Rules</span></div>
              <div className="space-y-2.5 flex-1">
                {[
                  { label: 'Subject Line', rule: 'Professional, engaging, 5-8 words, relevant to context' },
                  { label: 'Greeting', rule: 'Use name if known. Otherwise "Hello,"' },
                  { label: 'Body', rule: 'Direct Translation — convert the context meaning into business language. NO generic templates.' },
                  { label: 'Sign-off', rule: '"Best regards, Automated Assistant"' },
                ].map((r, i) => (
                  <div key={i} className="bg-white border border-cream-300 rounded-xl p-2.5">
                    <p className="font-bold text-xs text-teal-600 mb-0.5">{r.label}</p>
                    <p className="text-[10px] text-ink-600 leading-snug">{r.rule}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-coral-100/30 border-2 border-coral-500/20 rounded-2xl p-4 flex-1">
                <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-coral-500" /><span className="font-bold text-coral-500 text-xs uppercase tracking-wider">Critical Rule</span></div>
                <p className="text-sm text-ink-600 leading-relaxed mb-3">The <strong className="text-coral-500">Direct Translation Rule</strong> is the most important. The AI must NOT use generic status-update templates.</p>
                <div className="bg-white border border-coral-500/10 rounded-xl p-3">
                  <p className="text-[10px] font-mono text-ink-500 mb-1"><span className="text-coral-500">Context:</span> "gokul you're a fool you given task can't be finishable"</p>
                  <p className="text-[10px] font-mono text-ink-500"><span className="text-emerald-600">Email:</span> "I am writing to address your note regarding the feasibility of the task. I would like to reassure you that..."</p>
                </div>
              </div>
              <div className="bg-emerald-100/30 border border-emerald-600/20 rounded-xl p-3 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs text-ink-700"><strong className="text-emerald-600">Result:</strong> Every email is unique, context-aware, and professional — never robotic or templated.</p>
              </div>
            </div>
          </div>
          <SlideNum n={6} />
        </Slide>

        {/* ── DAY 4 SLIDE 7: LIVE EXECUTION ── */}
        <Slide current={cur} index={6}>
          <SlideTag text="SAGO / Demo" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Watch It Run</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-5">Live Execution Flow</p>
          <div className="flex-1 max-h-[340px]">
            <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden shadow-lg border border-ink-700/20 h-full flex flex-col">
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#252542] border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-coral-500/80" /><div className="w-3 h-3 rounded-full bg-amber-500/80" /><div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-white/40 font-mono ml-2">Agent Execution Log — Slack Email Orchestrator</span>
              </div>
              <div className="p-4 font-mono text-[11px] leading-relaxed text-white/80 space-y-2 overflow-y-auto flex-1">
                <p><span className="text-teal-400">[1]</span> Polling Slack channel <span className="text-amber-400">C0B7UV0F7PH</span>...</p>
                <p><span className="text-teal-400">[2]</span> Reading saved timestamp: <span className="text-white/50">1781447206.850019</span></p>
                <p><span className="text-teal-400">[3]</span> Found trigger: <span className="text-emerald-400">!run-emails</span> at ts <span className="text-amber-400">1781491986.194239</span> {'>'} saved ts ✓</p>
                <p><span className="text-teal-400">[4]</span> Adding reaction <span className="text-amber-400">👀</span> to trigger message...</p>
                <p><span className="text-teal-400">[5]</span> Updating <span className="text-white">last_processed_ts.txt</span> → <span className="text-amber-400">1781491986.194239</span></p>
                <p><span className="text-teal-400">[6]</span> Reading queue: <span className="text-white">emails_to_send.txt</span></p>
                <p><span className="text-teal-400">[7]</span> Found <span className="text-emerald-400">1 pending</span> email(s)</p>
                <p className="text-white/40">─────────────────────────────────</p>
                <p><span className="text-navy-400">[DRAFT]</span> To: <span className="text-amber-400">example@example.com</span></p>
                <p><span className="text-navy-400">[DRAFT]</span> Subject: <span className="text-white">"Feedback Request: Email Automation Workflow"</span></p>
                <p><span className="text-navy-400">[SEND]</span> Dispatching via Gmail MCP...</p>
                <p><span className="text-emerald-400">[✓]</span> Email sent successfully — ID: <span className="text-amber-400">19ec92fcf7b39a35</span></p>
                <p className="text-white/40">─────────────────────────────────</p>
                <p><span className="text-teal-400">[8]</span> Posting confirmation to Slack...</p>
                <p><span className="text-teal-400">[9]</span> Updating queue status → <span className="text-emerald-400">Sent</span></p>
                <p><span className="text-teal-400">[10]</span> Adding reaction <span className="text-emerald-400">✅</span> to trigger message</p>
                <p className="mt-2 text-emerald-400">═══ Pipeline complete. All pending emails processed. ═══</p>
              </div>
            </div>
          </div>
          <SlideNum n={7} />
        </Slide>

        {/* ── DAY 4 SLIDE 8: HANDS-ON LAB ── */}
        <Slide current={cur} index={7}>
          <SlideTag text="SAGO / Hands-On" />
          <div className="flex justify-between items-start mb-4">
            <div><h1 className="text-3xl md:text-4xl font-display mb-1">Build It Yourself</h1><p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold">Hands-On Lab</p></div>
            <span className="px-3 py-1.5 rounded-lg bg-teal-100 text-teal-600 border border-teal-600/20 font-mono text-[10px] font-bold uppercase">~20 mins</span>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1 max-h-[280px]">
            {[
              { n: '01', title: 'Create the Queue File', desc: 'Create emails_to_send.txt with one pending email block: Email, Context, and Status: Pending.' },
              { n: '02', title: 'Create the State File', desc: 'Create last_processed_ts.txt initialized with "0". This is the deduplication memory.' },
              { n: '03', title: 'Write the Workflow', desc: 'Create agent.md with the 5-step pipeline: Poll → Detect → Acknowledge → Execute → Complete.' },
              { n: '04', title: 'Write the Skill', desc: 'Create draft_email_skill.md with the Direct Translation Rule and email formatting guidelines.' },
            ].map((step, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!d4LabDone[i]) {
                    setD4LabDone(p => { const c = [...p]; c[i] = true; return c; });
                    playSound('click', muted);
                    confetti({ particleCount: 12, spread: 35, origin: { y: 0.8 } });
                  }
                }}
                className={`text-left border-2 rounded-2xl p-4 flex flex-col transition-all ${
                  d4LabDone[i] ? 'bg-teal-100/30 border-teal-600/30' : 'bg-cream-50 border-cream-400 hover:border-cream-500'
                }`}
              >
                <div className="flex justify-between items-start w-full mb-2">
                  <span className="font-mono text-xs font-bold text-teal-600 tracking-wider">Step {step.n}</span>
                  {d4LabDone[i] ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <div className="w-5 h-5 rounded-full border-2 border-cream-500" />}
                </div>
                <h3 className="font-bold text-base text-ink-800 mb-2">{step.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{step.desc}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center border-t border-cream-400 pt-3">
            <p className="text-ink-400 font-mono text-[10px] uppercase tracking-widest mb-1">After Building</p>
            <p className="text-base font-bold text-ink-800">Post <span className="text-coral-500 font-mono">!run-emails</span> in Slack and run the agent manually to verify</p>
          </div>
          <SlideNum n={8} />
        </Slide>

        {/* ── DAY 4 SLIDE 9: SCHEDULING ── */}
        <Slide current={cur} index={8}>
          <SlideTag text="SAGO / Automation" />
          <h1 className="text-3xl md:text-4xl font-display mb-1">Put It on Autopilot</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-teal-600 font-bold mb-4">Scheduling &amp; Automation</p>
          <div className="flex items-center justify-center gap-4 mb-5">
            <button onClick={() => { setD4ScheduleMode('manual'); playSound('click', muted); }} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${d4ScheduleMode === 'manual' ? 'bg-navy-600 text-white border-navy-600' : 'bg-cream-50 text-ink-500 border-cream-400'}`}>Manual Run</button>
            <button onClick={() => { setD4ScheduleMode('cron'); playSound('click', muted); }} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${d4ScheduleMode === 'cron' ? 'bg-teal-600 text-white border-teal-600' : 'bg-cream-50 text-ink-500 border-cream-400'}`}>Cron (Every 5 Min)</button>
          </div>
          <div className="flex-1 max-h-[290px]">
            {d4ScheduleMode === 'manual' ? (
              <div className="bg-cream-50 border-2 border-navy-600/20 rounded-2xl p-6 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4"><Terminal className="w-5 h-5 text-navy-600" /><span className="font-bold text-navy-700 text-sm">Manual Execution</span></div>
                <div className="space-y-3">
                  {['Open the agent.md file as a skill instruction', 'The AI reads the pipeline rules and checks Slack', 'If a trigger is found, it executes the full queue', 'You watch the reactions appear on Slack in real time'].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-navy-100 text-navy-600 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <div className="flex-1 bg-white border border-cream-300 rounded-lg p-2"><p className="text-xs text-ink-600">{s}</p></div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center text-[10px] font-mono text-navy-600">Good for testing • Full visibility • One-time execution</p>
              </div>
            ) : (
              <div className="bg-cream-50 border-2 border-teal-600/20 rounded-2xl p-6 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4"><RotateCcw className="w-5 h-5 text-teal-600" /><span className="font-bold text-teal-600 text-sm">Automated Cron Schedule</span></div>
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="bg-teal-100 border-2 border-teal-600/30 rounded-2xl p-4 text-center">
                    <RotateCcw className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                    <p className="font-bold text-sm text-teal-700">Every 5 Minutes</p>
                    <p className="text-[10px] text-ink-500 mt-1">*/5 * * * *</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-teal-500" />
                  <div className="space-y-2">
                    <div className="bg-white border border-teal-600/15 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /><span className="text-[10px] font-bold text-ink-700">Poll Slack</span>
                    </div>
                    <div className="bg-white border border-teal-600/15 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /><span className="text-[10px] font-bold text-ink-700">Process Queue</span>
                    </div>
                    <div className="bg-white border border-teal-600/15 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /><span className="text-[10px] font-bold text-ink-700">Report to Slack</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[10px] font-mono text-teal-600">Zero human intervention • Runs indefinitely • Use /schedule command</p>
              </div>
            )}
          </div>
          <SlideNum n={9} />
        </Slide>

        {/* ── DAY 4 SLIDE 10: FINAL CHECKPOINT ── */}
        <Slide current={cur} index={9}>
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
            <span className="px-3 py-1 rounded-full bg-coral-100 text-coral-500 text-[10px] font-mono font-bold uppercase tracking-widest border border-coral-500/20 mb-4 animate-pulse">Final Checkpoint • Day 04</span>
            <h1 className="text-4xl md:text-5xl font-display text-ink-900 mb-6">PROVE YOU LEARNED IT</h1>
            <div className="bg-cream-50 border-2 border-cream-400 p-6 rounded-2xl mb-6 w-full text-left">
              <p className="text-lg md:text-xl text-ink-700 leading-relaxed font-editorial">
                "Name the 4 files needed for this automation. Explain how the agent prevents duplicate processing. What is the Direct Translation Rule?"<br/><br/>
                <strong className="text-ink-900">Answer all three questions without looking at your notes.</strong>
              </p>
            </div>
            <button
              onClick={() => { setD4Revealed(!d4Revealed); if (!d4Revealed) { confetti({ particleCount: 60, spread: 55 }); playSound('success', muted); } }}
              className="px-6 py-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-coral-500/20 flex items-center gap-2 mb-5"
            >
              {d4Revealed ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              {d4Revealed ? 'Hide Solution' : 'Reveal Suggested Solution'}
            </button>
            <div className={`w-full text-left transition-all duration-500 overflow-hidden ${d4Revealed ? 'max-h-[250px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="border-t-2 border-cream-400 pt-4">
                <p className="text-coral-500 text-xs uppercase tracking-widest font-mono font-bold mb-2">What Good Looks Like</p>
                <div className="bg-cream-50 border border-cream-400 p-4 rounded-xl">
                  <p className="text-sm text-ink-600 leading-relaxed mb-2"><strong className="text-teal-600">4 Files:</strong> emails_to_send.txt (queue), last_processed_ts.txt (state), agent.md (workflow), draft_email_skill.md (skill).</p>
                  <p className="text-sm text-ink-600 leading-relaxed mb-2"><strong className="text-teal-600">Deduplication:</strong> The agent saves the timestamp of the last processed trigger. It only acts on messages with a strictly greater timestamp.</p>
                  <p className="text-sm text-ink-600 leading-relaxed"><strong className="text-teal-600">Direct Translation:</strong> The AI must convert the raw context meaning into professional business language — never use generic templates.</p>
                </div>
              </div>
            </div>
          </div>
          <SlideNum n={10} />
        </Slide>
        </>)}

      </main>

      {/* ═══ BOTTOM NAV ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 md:px-10 py-3 flex justify-between items-center bg-cream-200/85 backdrop-blur-md border-t border-cream-400/50">
        <button onClick={prev} disabled={cur === 0} className="flex items-center gap-1.5 text-ink-500 hover:text-ink-900 disabled:opacity-25 transition-colors text-xs font-semibold uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        {/* Dots */}
        <div className="hidden md:flex items-center gap-1.5">
          {titles.map((t, i) => (
            <button key={i} onClick={() => go(i)} className={`h-2.5 rounded-full transition-all duration-300 ${cur === i ? 'w-7 bg-coral-500' : 'w-2.5 bg-cream-500 hover:bg-ink-400'}`} title={t} />
          ))}
        </div>
        <div className="font-mono text-sm text-ink-500 bg-cream-50 border border-cream-400 px-3 py-1 rounded-lg flex items-center gap-1">
          <span className="font-bold text-ink-800">{cur + 1}</span><span className="opacity-40">/</span><span>{total}</span>
        </div>
        <button onClick={next} disabled={cur === total - 1} className="flex items-center gap-1.5 text-ink-500 hover:text-ink-900 disabled:opacity-25 transition-colors text-xs font-semibold uppercase tracking-wider">
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </nav>

      {/* ═══ SIDEBAR INDEX ═══ */}
      <div className={`fixed inset-0 z-[60] bg-ink-900/30 backdrop-blur-sm transition-opacity duration-300 ${sidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed right-0 top-0 bottom-0 w-80 bg-cream-100 border-l border-cream-400 p-5 flex flex-col transition-transform duration-300 shadow-2xl ${sidebar ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-5">
            <span className="font-bold text-xs uppercase tracking-widest text-ink-500">Slide Index</span>
            <button onClick={() => setSidebar(false)} className="p-1.5 rounded-lg text-ink-500 hover:text-ink-900 hover:bg-cream-300"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5">
            {titles.map((t, i) => (
              <button key={i} onClick={() => { go(i); setSidebar(false); }} className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                cur === i ? 'bg-navy-100/50 border-navy-600/30 text-navy-700 font-bold' : 'bg-cream-50 border-cream-400 text-ink-500 hover:border-cream-500 hover:text-ink-700'
              }`}>
                <span className={`font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${cur === i ? 'border-navy-600 text-navy-600 font-bold' : 'border-cream-500 text-ink-400'}`}>{i + 1}</span>
                <span className="text-xs leading-tight">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SHORTCUTS MODAL ═══ */}
      {shortcuts && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-cream-100 border border-cream-400 rounded-2xl p-6 relative shadow-2xl">
            <button onClick={() => setShortcuts(false)} className="absolute top-4 right-4 text-ink-400 hover:text-ink-700"><X className="w-5 h-5" /></button>
            <h3 className="font-bold text-sm uppercase tracking-widest text-ink-700 mb-4 flex items-center gap-1.5"><Keyboard className="w-4 h-4 text-teal-600" /> Keyboard Shortcuts</h3>
            <div className="space-y-2.5 text-xs">
              {[['Next Slide','→ / Space'],['Previous Slide','← Arrow'],['Toggle Mute','M Key'],['Toggle Help','? Key'],['Close Panels','Escape']].map(([a,k])=>(
                <div key={a} className="flex justify-between items-center border-b border-cream-400 pb-2">
                  <span className="text-ink-500">{a}</span>
                  <span className="font-mono bg-cream-50 border border-cream-400 px-2 py-0.5 rounded text-teal-600 font-bold">{k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
