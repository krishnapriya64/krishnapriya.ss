"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRight, Download, Play, Layers, Cpu, Sparkles,
  ExternalLink, Send, Mail, Check,
  MousePointer, Heart, Compass, Search, PenTool, CheckCircle2,
  Activity, Award, Terminal, Code, Monitor, Smartphone, Globe
} from 'lucide-react';

const Github = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.39-3.6 5 5 0 0 0-.12-3.5s-1.13-.36-3.7 1.37a12.8 12.8 0 0 0-7 0C6.27 1.84 5.14 2.2 5.14 2.2a5 5 0 0 0-.12 3.5A5.2 5.2 0 0 0 3.6 9.34c0 5.22 3 6.42 6 6.76-.7.63-1 1.5-1 2.82V22"></path>
    <path d="M9 20c-5 1.5-5-2.5-7-3"></path>
  </svg>
);

const Linkedin = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

/* =========================================================================
   1. HIGH-PERFORMANCE ANTI-GRAVITY / PHYSICS SYSTEM
   ========================================================================= */
interface PhysicsItem {
  id: string;
  label: string | React.ReactNode;
  initialX: number; // Percent of screen width
  initialY: number; // Percent of screen height
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  sizeClass: string;
}

const AntiGravityWorkspace: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [items, setItems] = useState<PhysicsItem[]>([]);

  // Initialize floating elements with anchor points
  useEffect(() => {
    const rawItems = [
      { id: 'figma', label: <div className="flex items-center gap-2"><span className="text-[#F24E1E] font-bold">F</span> Figma Frame</div>, initialX: 12, initialY: 18, color: 'border-orange-500/30 text-orange-600 bg-orange-50/50' },
      {
        id: 'code-block', label: <div className="text-left font-mono text-[10px] p-2 leading-none">
          <span className="text-blue-500">const</span> Design = () =&gt; &#123;<br />
          &nbsp;&nbsp;<span className="text-purple-500">return</span> &lt;<span className="text-emerald-500">div</span> class=<span className="text-orange-500">"ux"</span>&gt;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;Create Impact<br />
          &nbsp;&nbsp;&lt;/<span className="text-emerald-500">div</span>&gt;<br />
          &#125;
        </div>, initialX: 85, initialY: 22, color: 'border-blue-500/20 text-slate-700 bg-white shadow-md'
      },
      { id: 'type', label: <div className="flex items-center gap-1.5 font-sans font-semibold"><span className="text-lg">Aa</span> Inter</div>, initialX: 88, initialY: 12, color: 'border-purple-500/30 text-purple-600 bg-purple-50/50' },
      { id: 'ux-badge', label: 'UX', initialX: 4, initialY: 32, color: 'border-pink-500/40 text-pink-500 bg-pink-50 font-bold text-xs rounded-full px-3 py-1' },
      { id: 'div-tag', label: '<div>', initialX: 78, initialY: 34, color: 'border-emerald-500/20 text-emerald-600 font-mono text-xs' },
      { id: 'tailwind', label: 'flex items-center', initialX: 42, initialY: 11, color: 'border-cyan-500/20 text-cyan-600 font-mono text-xs' },
      { id: 'bracket', label: '{ }', initialX: 15, initialY: 40, color: 'border-amber-500/20 text-amber-600 font-mono text-lg font-bold' },
      { id: 'userflow', label: '📍 User Flow Map', initialX: 45, initialY: 38, color: 'border-slate-300 text-slate-700 bg-white/80 backdrop-blur shadow-sm' },
    ];

    const processed = rawItems.map((item, idx) => ({
      id: item.id,
      label: item.label,
      initialX: item.initialX,
      initialY: item.initialY,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      color: item.color,
      sizeClass: 'px-4 py-2 text-xs rounded-xl border font-medium shadow-sm transition-shadow hover:shadow-md'
    }));

    setItems(processed);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let animFrame: number;
    const updatePhysics = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      setItems(prevItems => {
        return prevItems.map(item => {
          // Absolute coordinates of the anchor spot
          const anchorX = (item.initialX / 100) * width;
          const anchorY = (item.initialY / 100) * height;

          // If item hasn't been placed yet, jump directly to anchor
          let currentX = item.x === 0 ? anchorX : item.x;
          let currentY = item.y === 0 ? anchorY : item.y;

          // Physics Constants
          const springK = 0.015;  // Pull to return to original location
          const friction = 0.88; // Damping
          const pushForce = 350; // Cursor repulsion field radius
          const repulsionStrength = 1.2;

          // Calculate spring return forces
          let ax = (anchorX - currentX) * springK;
          let ay = (anchorY - currentY) * springK;

          // Calculate repulsion if mouse is active
          if (mouseRef.current.active) {
            const dx = currentX - mouseRef.current.x;
            const dy = currentY - mouseRef.current.y;
            const dist = Math.hypot(dx, dy);

            if (dist < pushForce && dist > 0) {
              const force = (pushForce - dist) / pushForce; // scale 0 to 1
              ax += (dx / dist) * force * repulsionStrength;
              ay += (dy / dist) * force * repulsionStrength;
            }
          }

          // Apply forces to velocity
          let vx = (item.vx + ax) * friction;
          let vy = (item.vy + ay) * friction;

          // Update positioning
          let x = currentX + vx;
          let y = currentY + vy;

          // Prevent items from floating completely off viewport limits
          if (x < 10) { x = 10; vx *= -0.5; }
          if (x > width - 10) { x = width - 10; vx *= -0.5; }
          if (y < 10) { y = 10; vy *= -0.5; }
          if (y > height - 10) { y = height - 10; vy *= -0.5; }

          return { ...item, x, y, vx, vy };
        });
      });

      animFrame = requestAnimationFrame(updatePhysics);
    };

    animFrame = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-10 overflow-hidden blur-sm lg:blur-none">
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute pointer-events-auto select-none cursor-grab active:cursor-grabbing ${item.sizeClass} ${item.color}`}
          style={{
            transform: `translate3d(${item.x}px, ${item.y}px, 0px) translate(-50%, -50%)`,
            transition: 'border-color 0.2s, background-color 0.2s'
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

/* =========================================================================
   2. MAIN PORTFOLIO COMPONENT
   ========================================================================= */
export default function Portfolio() {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const stats = [
    { value: "2+", label: "Years Experience", icon: <Layers className="w-5 h-5 text-blue-500" /> },
    { value: "15+", label: "Projects Completed", icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
    { value: "8+", label: "Design Systems", icon: <Cpu className="w-5 h-5 text-indigo-500" /> },
    { value: "10+", label: "Websites Developed", icon: <Code className="w-5 h-5 text-emerald-500" /> }
  ];

  const experience = [
    {
      id: "01",
      date: "Aug 2020 – Aug 2021",
      role: "Graphic Designer",
      company: "Prayaana, Kochi",
      points: [
        "Created digital creatives",
        "Branding materials",
        "Social media campaigns",
        "Marketing visuals"
      ]
    },
    {
      id: "02",
      date: "Sep 2023 – Oct 2025",
      role: "UI/UX Developer",
      company: "Viceroy Solutions Inc.",
      points: [
        "Led UI design and frontend development",
        "Improved usability and user experience",
        "Collaborated on architecture building",
        "Worked on AI healthcare products"
      ],
      featuredProduct: { name: "QureNote AI", link: "https://qurenote.ai/" }
    },
    {
      id: "03",
      date: "Dec 2025 – Mar 2026",
      role: "Web Designer",
      company: "Netroxe IT Solutions, Trivandrum",
      points: [
        "Designed responsive websites",
        "Developed modern UI components",
        "Built engaging digital experiences",
        "Collaborated with development teams"
      ]
    }
  ];

  const skills = {
    "UI/UX": ["UX Research", "User Flow", "Wireframing", "Prototyping", "Design Systems", "Accessibility", "Usability Testing"],
    "Frontend": ["HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "Vue.js", "Tailwind CSS", "Bootstrap", "Material UI"],
    "Tools": ["Figma", "Adobe XD", "FigJam", "Miro", "Git", "GitHub", "ChatGPT", "GitHub Copilot"]
  };

  const projects = [
    {
      id: 1,
      title: "Viceroy Solutions Website",
      link: "https://viceroysolutions.com/",
      category: "UI/UX + Frontend Development",
      tags: ["UI/UX", "Frontend"],
      tech: "WordPress",
      image: "linear-gradient(135deg, #4285F4 0%, #34A853 100%)",
      overview: "Designed and engineered the primary high-converting corporate presence representing state-of-the-art tech operations.",
      challenge: "Transforming abstract technological stacks and cloud architectures into a simplified layout.",
      solution: "Engineered responsive layout grids with dynamic vector pathways highlighting system integration schemas.",
      learnings: "Achieved modular component scaling across standard responsive desktop breakpoints."
    },
    {
      id: 2,
      title: "Netroxe IT Solutions Website",
      link: "https://netroxe.com/",
      category: "Web Design",
      tags: ["Web Design", "Frontend"],
      tech: "React.js",
      image: "linear-gradient(135deg, #12c2e9 0%, #c471ed 100%)",
      overview: "Complete digital identity layout including wireframes and frontend components implementation.",
      challenge: "Providing a unified aesthetic system representing complex B2B services.",
      solution: "Engineered responsive layout grids with dynamic vector pathways highlighting system integration schemas.",
      learnings: "Mastered semantic structural elements mapping and accessibility specs."
    },
    {
      id: 3,
      title: "Visualtake Website",
      link: "https://visualtake.ai/",
      category: "Website Design",
      tags: "Web Design",
      tech: ["HTML5", "CSS3", "CSS Animations"],
      image: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
      overview: "Premium platform showcasing interactive imagery with highly structured visual hierarchies.",
      challenge: "Organizing multiple high-density media feeds without causing layout shift or latency.",
      solution: "Built clean design tokens using elegant Swiss typography frameworks.",
      learnings: "Learned deep visual asset optimization routines."
    },
    {
      id: 4,
      title: "Movytech Website",
      link: "https://movytech.co/",
      category: "Website Design",
      tags: "Web Design",
      tech: ["HTML5", "CSS3", "CSS Animations"],
      image: "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)",
      overview: "Sleek movie catalog and presentation environment incorporating micro-interactive triggers.",
      challenge: "Keeping users engaged through fluid, non-disruptive transitions.",
      solution: "Designed subtle page-based scroll effects using modern CSS properties.",
      learnings: "Mastered layout stability during heavy animation sequences."
    },
    {
      id: 5,
      title: "QureNote AI Website",
      link: "https://qurenote.ai/",
      category: "AI Healthcare Web App",
      tags: ["UI/UX", "Frontend"],
      tech: ["React.js", "Figma"],
      image: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
      overview: "QureNote AI's public-facing web presence showcasing the AI-powered clinical documentation platform for healthcare providers.",
      challenge: "Communicating the sophistication of an AI healthcare product to both clinical and non-technical audiences.",
      solution: "Designed a clean, trust-first layout with clear value propositions and product feature highlights.",
      learnings: "Gained deep insight into healthcare UX conventions and accessibility requirements for medical audiences."
    },
    {
      id: 6,
      title: "Trendy",
      link: "https://krishnapriyass.framer.website/trendy",
      category: "Fashion App UI Design",
      tags: ["UI/UX", "Mobile"],
      tech: "Adobe XD",
      image: "linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)",
      overview: "Fashion shopping app with a stylish UI kit featuring rich visual product browsing and a modern dark-themed aesthetic.",
      challenge: "Creating a high-energy fashion experience that feels premium yet approachable for diverse shoppers.",
      solution: "Designed bold, image-forward layouts with dynamic typography and vibrant accent colors.",
      learnings: "Deepened understanding of visual hierarchy and emotion-driven design in consumer apps."
    },
    {
      id: 7,
      title: "Draft",
      link: "https://krishnapriyass.framer.website/draft",
      category: "Business Management App",
      tags: ["UI/UX", "Mobile"],
      tech: ["Figma", "Adobe XD"],
      image: "linear-gradient(135deg, #4A90D9 0%, #6C63FF 100%)",
      overview: "Business expense and collaboration platform designed to simplify finance tracking and team coordination.",
      challenge: "Presenting complex financial data in a clean, digestible format for non-technical business users.",
      solution: "Built structured dashboards with clear data visualization, card-based layouts, and intuitive navigation.",
      learnings: "Improved skills in data-heavy UI design and designing for productivity-focused workflows."
    },
    {
      id: 8,
      title: "Money",
      link: "https://krishnapriyass.framer.website/money",
      category: "Finance App UI Design",
      tags: ["UI/UX", "Mobile"],
      tech: "Figma",
      image: "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)",
      overview: "Smart finance app UI for saving, investing, and commission-free trading with a modern, bold visual style.",
      challenge: "Making financial concepts feel approachable and exciting rather than complex and intimidating.",
      solution: "Used vibrant gradients, clear micro-copy, and progressive disclosure to guide users through financial actions.",
      learnings: "Refined fintech UI patterns and learned to balance visual flair with clarity in high-stakes contexts."
    },
    {
      id: 9,
      title: "Cafe Stop",
      link: "https://krishnapriyass.framer.website/cafestop",
      category: "E-Commerce Landing Page",
      tags: ["UI/UX", "Web Design"],
      tech: ["Figma", "Adobe XD"],
      image: "linear-gradient(135deg, #c8a97e 0%, #3d2b1f 100%)",
      overview: "E-commerce landing page for a premium coffee brand with a warm, inviting aesthetic and seamless product discovery.",
      challenge: "Conveying warmth, quality, and artisan craftsmanship through digital design alone.",
      solution: "Used rich warm tones, beautiful product photography layouts, and clean typographic hierarchy.",
      learnings: "Strengthened ability to design emotionally resonant brand experiences for lifestyle products."
    },
    {
      id: 10,
      title: "Foodie",
      link: "https://krishnapriyass.framer.website/foodie",
      category: "Food Delivery App UI",
      tags: ["UI/UX", "Mobile"],
      tech: ["Figma", "Adobe XD"],
      image: "linear-gradient(135deg, #f7971e 0%, #ff4e50 100%)",
      overview: "Food delivery app UI with personalized meal recommendations.",
      challenge: "Reducing decision fatigue in a menu-heavy app while keeping the experience visually engaging.",
      solution: "Designed smart recommendation cards, intuitive filtering, and a step-by-step checkout with clear progress indicators.",
      learnings: "Mastered designing for high-frequency consumer apps with a focus on speed, delight, and ease of use."
    }
  ];

  const workflow = [
    { step: "Discover", desc: "Unearthing core user problems, defining system parameters, and aligning business expectations." },
    { step: "Research", desc: "Analyzing user behavior, creating personas, and synthesizing market data points." },
    { step: "Define", desc: "Synthesizing research into feature roadmaps and system requirements." },
    { step: "Ideate", desc: "Sketching solutions, rapid brainstorming, and laying functional foundations." },
    { step: "Wireframe", desc: "Designing structural, low-fidelity skeletons focused purely on layout flow." },
    { step: "Prototype", desc: "Assembling high-fidelity interactive systems to test usability." },
    { step: "Develop", desc: "Writing clean, semantic components with high-performance code." },
    { step: "Launch", desc: "Deploying secure, validated product architectures live to users." }
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("saikpriya00@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic Validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus("Please fill out all fields.");
      return;
    }

    setFormStatus("Transmitting payload...");

    try {
      // 2. Send the data to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "d93b0f05-99c2-4942-846b-768fdce53e1a", // <-- Paste your key here!
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Portfolio Message from ${formData.name}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormStatus("Message sent successfully! I will get back to you soon.");
        setFormData({ name: '', email: '', message: '' }); // Clear the form
      } else {
        setFormStatus("Transmission failed. Please email me directly at krishnapriyass.ece@gmail.com");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setFormStatus("Network error. Please email me directly at krishnapriyass.ece@gmail.com");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Decorative Top Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-red-500 to-green-500 fixed top-0 left-0 z-50" />

      {/* ================= HEADER ================= */}
      <header className="fixed top-1.5 left-0 w-full z-40 bg-white/75 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center font-black text-white text-base shrink-0">K</span>
            <span className="font-semibold tracking-tight text-sm whitespace-nowrap">Krishnapriya S S</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-500">
            <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
            <a href="#experience" className="hover:text-blue-500 transition-colors">Experience</a>
            <a href="#projects" className="hover:text-blue-500 transition-colors">Projects</a>
            <a href="#process" className="hover:text-blue-500 transition-colors">Process</a>
            <a href="#skills" className="hover:text-blue-500 transition-colors">Skills</a>
            <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
          </nav>

          <a
            href="#contact"
            className="px-4 py-2 text-xs font-semibold rounded-full bg-[#111111] text-white hover:bg-blue-600 transition-all flex items-center gap-1.5 shadow-sm"
          >
            Let's Talk <MousePointer size={12} />
          </a>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 overflow-hidden bg-gradient-to-b from-white to-[#F8F9FA]">
        {/* Anti-Gravity Elements */}
        <AntiGravityWorkspace />

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20 pointer-events-none">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 pointer-events-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-500/20 text-emerald-600 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Available for new opportunities</span>
            </div>

            <div className="space-y-2">
              <span className="text-blue-600 text-lg font-bold tracking-tight">Hello, I'm</span>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none text-slate-900">
                KRISHNAPRIYA S S
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm font-semibold text-slate-500">
                <span>• UI/UX Designer</span>
                <span>• Frontend Developer</span>
                <span>• GenAI Enthusiast</span>
              </div>
            </div>

            <p className="text-slate-600 max-w-xl leading-relaxed text-sm sm:text-base">
              I design intuitive digital experiences and build beautiful, responsive interfaces that bridge creativity and technology.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#projects" className="px-6 py-3 rounded-xl bg-[#111111] text-white hover:bg-blue-600 font-bold transition-all flex items-center text-sm shadow-md">
                View My Work <ArrowUpRight className="ml-2 w-4 h-4" />
              </a>
              <a href="#contact" className="px-6 py-3 rounded-xl border border-slate-300 bg-white hover:border-slate-400 text-slate-700 font-bold transition-all text-sm flex items-center gap-1.5">
                Download Resume <Download size={14} />
              </a>
              <a href="#experience" className="px-6 py-3 text-slate-600 font-bold hover:text-blue-500 transition-all text-sm flex items-center gap-1.5">
                See My Story <Play size={14} className="fill-current text-slate-400 group-hover:text-blue-500" />
              </a>
            </div>
          </div>

          {/* Right Column (Visual) */}
          <div className="lg:col-span-5 flex justify-center relative pointer-events-auto">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Organic Fluid Frame Mock */}
              <div className="absolute inset-0 bg-blue-100/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
              <div className="absolute -inset-4 bg-purple-100/40 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-75" />

              <div className="relative w-full h-full rounded-[40px] bg-slate-100 border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
                {/* SVG Portrait Placeholder with nice aesthetics */}
                <svg className="w-full h-full text-slate-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 40C58.2843 40 65 33.2843 65 25C65 16.7157 58.2843 10 50 10C41.7157 10 35 16.7157 35 25C35 33.2843 41.7157 40 50 40Z" fill="currentColor" />
                  <path d="M50 45C33.4315 45 20 58.4315 20 75C20 83.2843 26.7157 90 35 90H65C73.2843 90 80 83.2843 80 75C80 58.4315 66.5685 45 50 45Z" fill="currentColor" />
                </svg>
                {/* Overlay Subtle Tech Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-12 bg-white border-y border-slate-200/60 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-slate-50/50 transition-colors border border-transparent hover:border-slate-200/50">
                <div className="p-3 rounded-xl bg-slate-100/80">
                  {stat.icon}
                </div>
                <div>
                  <span className="block text-2xl font-black tracking-tight text-slate-900">{stat.value}</span>
                  <span className="text-xs text-slate-500 font-semibold tracking-wide uppercase">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ME ================= */}
      <section id="about" className="py-24 relative z-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center space-x-2">
                <Compass className="text-blue-600 w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">My Story</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Crafting Interfaces, Writing Logic, Designing for People.
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                <p>
                  With more than 2 years of hands-on experience in UI/UX Design and Frontend Development, I specialize in transforming conceptual workflows into pixel-perfect and structurally clean software architectures.
                </p>
                <p>
                  My journey fuses deep aesthetic exploration with core engineering fundamentals. This duality allows me to coordinate closely with production groups, designing frameworks that validate functional constraints and optimize accessibility without compromising user interaction layers.
                </p>
              </div>
            </div>

            {/* Visual Interactive Graphic */}
            <div className="lg:col-span-6">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                <h3 className="font-bold text-lg text-slate-800">My Philosophy</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">1</span>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">User-First Empathy</h4>
                      <p className="text-xs text-slate-500 mt-1">Conducting targeted testing and feedback verification loops prior to layout coding.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">2</span>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">High-Performance Frontend</h4>
                      <p className="text-xs text-slate-500 mt-1">Writing structured, highly maintainable semantic code in Next.js, React, and TypeScript.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">3</span>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">AI-Assisted Acceleration</h4>
                      <p className="text-xs text-slate-500 mt-1">Utilizing generative AI pipelines to build, prototype, and validate production environments efficiently.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HORIZONTAL JOURNEY TIMELINE ================= */}
      <section id="experience" className="py-24 bg-[#F8F9FA] border-y border-slate-200/60 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-4 mb-16">
            <div className="flex items-center space-x-2">
              <Award className="text-blue-600 w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Timeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              My Journey So Far
            </h2>
          </div>

          {/* Horizontal Layout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Background connecting line (Visible on medium+ screens) */}
            <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-slate-200 z-0" />

            {experience.map((exp, idx) => (
              <div key={exp.id} className="relative z-10 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow text-center md:text-left">
                {/* Node Number Badge */}
                <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-blue-600 mb-6 mx-auto md:mx-0">
                  {exp.id}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">{exp.date}</span>
                    <h3 className="font-bold text-slate-900 text-lg mt-1">{exp.role}</h3>
                    <span className="text-sm font-semibold text-blue-600 block">{exp.company}</span>
                  </div>

                  <ul className="space-y-2.5">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="text-xs text-slate-500 flex items-center gap-2 justify-center md:justify-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  {exp.featuredProduct && (
                    <div className="pt-2 flex justify-center md:justify-start">
                      <a
                        href={exp.featuredProduct.link}
                        className="inline-flex items-center text-xs font-bold text-slate-900 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        Featured Product: {exp.featuredProduct.name} <ArrowUpRight size={12} className="ml-1 text-blue-500" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SKILLS ================= */}
      <section id="skills" className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-4 mb-16 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Terminal className="text-blue-600 w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Competencies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Technical Stack & Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, items], idx) => (
              <div key={idx} className="bg-[#F8F9FA] border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 px-4 py-2 text-xs font-medium rounded-xl text-slate-700 transition-colors cursor-pointer shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section id="projects" className="py-24 bg-[#F8F9FA] border-y border-slate-200/60 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Code className="text-blue-600 w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Portfolio</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Crafting Digital Experiences
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 tracking-wider">SELECT RELEASES</span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setActiveProject(activeProject === proj.id ? null : proj.id)}
                className="group bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Visual Mockup Top Bar */}
                  <div
                    className="h-48 w-full p-6 flex flex-col justify-end relative"
                    style={{ background: proj.image }}
                  >
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/90 text-slate-950 px-2.5 py-1 rounded-full">
                        {proj.category}
                      </span>
                      {proj.link && proj.link !== '#' && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ExternalLink size={13} className="text-slate-700" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Core Card Content */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                      {proj.link && proj.link !== '#' ? (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {proj.title}
                        </a>
                      ) : (
                        proj.title
                      )}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{proj.overview}</p>

                    {/* Detailed Accordion Section */}
                    <AnimatePresence>
                      {activeProject === proj.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 border-t border-slate-100 space-y-3 font-sans overflow-hidden"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Challenge</span>
                            <p className="text-xs text-slate-500 mt-1">{proj.challenge}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Solution</span>
                            <p className="text-xs text-slate-500 mt-1">{proj.solution}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Learnings</span>
                            <p className="text-xs text-slate-500 mt-1">{proj.learnings}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Card Tag Footers */}
                <div className="px-6 sm:px-8 pb-6 pt-2 flex flex-wrap gap-1.5 border-t border-slate-50/50">
                  {Array.isArray(proj.tags) ?
                    proj.tags.map((tag: string, tIdx: number) => (
                      <span key={tIdx} className="bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 px-3 py-1 rounded-lg">
                        {tag}
                      </span>
                    )) : (
                      <span className="bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 px-3 py-1 rounded-lg">
                        {proj.tags}
                      </span>
                    )}
                  {proj.tech && (
                    <span className="bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600 px-3 py-1 rounded-lg">
                      {proj.tech}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WORKFLOW PROCESS ================= */}
      <section id="process" className="py-24 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <PenTool className="text-blue-600 w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Workflow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">How I Work</h2>
            <p className="text-slate-500 text-sm">A structured approach from problem discovery to product launch.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {workflow.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`group relative p-5 rounded-2xl border text-left transition-all duration-200 ${activeStep === idx
                  ? 'border-blue-500 bg-blue-600 shadow-lg shadow-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
              >
                <div className={`text-2xl font-black mb-2 ${activeStep === idx ? 'text-white/30' : 'text-slate-100'
                  }`}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className={`font-bold text-sm mb-1 ${activeStep === idx ? 'text-white' : 'text-slate-800'
                  }`}>
                  {item.step}
                </div>
                <div className={`text-[10px] leading-relaxed ${activeStep === idx ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                  {item.desc}
                </div>
                {activeStep === idx && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section id="contact" className="py-24 bg-[#F8F9FA] border-t border-slate-200/60 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center space-x-2">
                <Mail className="text-blue-600 w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Get in Touch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Establish Link</h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                I am open to discuss professional opportunities in UI/UX Design, Product Strategy, or Frontend Engineering.
              </p>

              {/* Action Contact Cards */}
              <div className="space-y-4 text-xs font-semibold">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 block mb-1">EMAIL DIRECT</span>
                    <span className="text-slate-800 select-all font-mono">saikpriya00@gmail.com</span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold"
                  >
                    {copied ? "COPIED" : "COPY"}
                  </button>
                </div>

                <div className="flex gap-4">
                  <a
                    href="www.linkedin.com/in/krishnapriyass1246"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 p-4 bg-white border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-2 text-slate-700 hover:text-blue-600 transition-all text-xs font-bold"
                  >
                    <Linkedin size={14} /> LINKEDIN
                  </a>
                  <a
                    href="https://github.com/krishnapriya-ss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 p-4 bg-white border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center justify-center gap-2 text-slate-700 hover:text-blue-600 transition-all text-xs font-bold"
                  >
                    <Github size={14} /> GITHUB
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleFormSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Register Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 font-sans"
                    placeholder="e.g., Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">E-Mail Address Link</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 font-sans"
                    placeholder="e.g., name@domain.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Message Payload</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 font-sans resize-none"
                    placeholder="System details or communication proposals..."
                  />
                </div>

                {formStatus && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-blue-600">
                    {formStatus}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#111111] hover:bg-blue-600 text-white font-bold transition-all text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Send size={12} /> TRANSMIT DATAPACKET
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-12 bg-white border-t border-slate-200/60 relative z-20 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <div className="flex justify-center space-x-6 text-sm text-slate-400">
            <a href="www.linkedin.com/in/krishnapriyass1246" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Linkedin size={18} /></a>
            <a href="https://github.com/krishnapriya-ss" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Github size={18} /></a>
            <a href="mailto:saikpriya00@gmail.com" className="hover:text-blue-500 transition-colors"><Mail size={18} /></a>
          </div>
          <p>© {new Date().getFullYear()} Krishnapriya S S. All rights reserved.</p>
          <div className="text-[10px] text-slate-400 tracking-wider font-semibold">
            <span>DESIGNED WITH EMPATHY. </span>
            <span>BUILT WITH CODE. </span>
            <span>CRAFTED FOR PEOPLE.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
