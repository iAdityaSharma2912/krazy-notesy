import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRightIcon, 
  BoltIcon, 
  ChartBarIcon, 
  ClockIcon, 
  SparklesIcon, 
  CalendarDaysIcon, 
  GlobeAltIcon 
} from '@heroicons/react/24/outline';
import { motion } from "framer-motion";
// --- NEW IMPORTS FOR CONTACT SECTION ---
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// --- NEW COMPONENT: STARRY BACKGROUND (Framer Motion) ---
const StarryBackground = () => {
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);

    const generatedShootingStars = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      startTop: `${Math.random() * 80}%`,
      startLeft: `${Math.random() * 100}%`,
      delay: Math.random() * 10,
    }));
    setShootingStars(generatedShootingStars);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size * 4}px #fff, 0 0 ${star.size * 8}px #9f7aea`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
      {shootingStars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute h-[2px] w-[120px] bg-gradient-to-r from-white to-transparent opacity-80 rounded-full"
          style={{
            top: s.startTop,
            left: s.startLeft,
            transform: "rotate(-20deg)",
          }}
          initial={{ x: "-150%", opacity: 0 }}
          animate={{ x: "150%", opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 6 + Math.random() * 8,
            delay: s.delay,
          }}
        />
      ))}
    </>
  );
};

// --- NEW CONTACT SECTION ---
const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-transparent text-white relative z-10">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Ping Us <span className="text-yellow-500">Anytime</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10 mb-16">
          <motion.div
            className="p-6 bg-neutral-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-yellow-400/40 transition-shadow cursor-pointer border border-white/10 flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaEnvelope className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <a
              href="mailto:krazynotesy@gmail.com"
              aria-label="Send us an email"
              className="text-gray-300 hover:text-yellow-500 transition-colors text-sm md:text-base"
            >
              krazynotesy@gmail.com
            </a>
          </motion.div>

          <motion.div
            className="p-6 bg-neutral-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-yellow-400/40 transition-shadow cursor-pointer border border-white/10 flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaPhoneAlt className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <a
              href="tel:+919310294509"
              aria-label="Call us"
              className="text-gray-300 hover:text-yellow-500 transition-colors text-sm md:text-base"
            >
              +91 9310294509
            </a>
          </motion.div>

          <motion.div
            className="p-6 bg-neutral-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-yellow-400/40 transition-shadow border border-white/10 flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaMapMarkerAlt className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-xl font-bold mb-2">Location</h3>
            <p className="text-gray-300 text-sm md:text-base">Delhi, India</p>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center gap-6 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <a
            href="https://facebook.com/krazynotesy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Facebook"
            className="text-yellow-500 hover:text-yellow-600 text-2xl transition"
          >
            <FaFacebook />
          </a>

          <a
            href="https://x.com/krazynotesy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Twitter/X"
            className="text-yellow-500 hover:text-yellow-600 text-2xl transition"
          >
            <FaXTwitter />
          </a>

          <a
            href="https://www.instagram.com/krazynotesy/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Instagram"
            className="text-yellow-500 hover:text-yellow-600 text-2xl transition"
          >
            <FaInstagram />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// --- NEW FEATURES SECTION WITH AI ---
const FeaturesSection = () => {
  const [topic, setTopic] = useState('');
  const [captions, setCaptions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateCaptions = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic!');
      return;
    }
    setIsLoading(true);
    setError('');
    setCaptions('');

    const systemPrompt = "You are a witty social media expert specializing in viral content. Your tone is funny, engaging, and slightly chaotic.";
    const userQuery = `Generate 3 short, catchy, and potentially viral captions for a social media post about '${topic}'. Each caption must be on a new line. Include relevant and trending hashtags for each.`;

    try {
      const apiKey = ""; // API Key provided by environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      };
      
      let response;
      let delay = 1000;
      for (let i = 0; i < 5; i++) {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) break;
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const result = await response.json();
      const candidate = result.candidates?.[0];
      if (candidate && candidate.content?.parts?.[0]?.text) {
        setCaptions(candidate.content.parts[0].text);
      } else {
        throw new Error("Invalid response structure from the API.");
      }
    } catch (err) {
      console.error(err);
      setError("Oops! The AI is taking a nap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const featuresList = [
    {
      title: "Instant Uploads",
      icon: <BoltIcon className="w-10 h-10 text-yellow-400" />,
      description: "No more wasting time juggling apps. Krazy Notesy lets you upload your memes and funny videos in seconds, directly from your dashboard.",
    },
    {
      title: "AI-Powered Captions",
      icon: <SparklesIcon className="w-10 h-10 text-yellow-400" />,
      description: "Our AI generates trending, catchy captions + hashtags that make your content go viral. Think of it as your personal meme-writer.",
    },
    {
      title: "Smart Scheduling",
      icon: <CalendarDaysIcon className="w-10 h-10 text-yellow-400" />,
      description: "Plan your uploads like a pro. Schedule posts for peak engagement times across Instagram, YouTube Shorts, and more—fully automated.",
    },
    {
      title: "Growth Insights",
      icon: <ChartBarIcon className="w-10 h-10 text-yellow-400" />,
      description: "Track views, likes, shares, and engagement with beautiful analytics. Understand what works and double down on it.",
    },
    {
      title: "Multi-Platform Magic",
      icon: <GlobeAltIcon className="w-10 h-10 text-yellow-400" />,
      description: "One click = everywhere. Share to Instagram, YouTube Shorts, Reddit, X (Twitter), and beyond without lifting a finger.",
    },
  ];

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto px-6 pb-20">
      {featuresList.map((feature, index) => {
        const isAI = feature.title === "AI-Powered Captions";
        
        return (
          <motion.div
            key={index}
            className={`p-6 bg-neutral-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 hover:shadow-yellow-400/40 transition-all duration-300 ${isAI ? 'md:col-span-2 lg:col-span-1 lg:row-span-2' : ''}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-black mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{feature.description}</p>
              
              {isAI && (
                <div className="w-full mt-4 space-y-3 text-left bg-neutral-900/50 p-4 rounded-xl border border-neutral-700">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      setError("");
                    }}
                    placeholder="e.g., a dancing cat"
                    className="w-full p-2 bg-neutral-800 border border-neutral-600 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition text-white outline-none"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleGenerateCaptions}
                    className="w-full px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-400 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? "Generating..." : "✨ Generate Captions"}
                  </button>
                  {error && <p className="text-red-400 text-xs font-semibold text-center">{error}</p>}
                  {captions && !isLoading && (
                    <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-xs whitespace-pre-wrap font-mono text-green-400 border border-green-900/50">
                      {captions}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden selection:bg-yellow-500 selection:text-neutral-900">
      
      {/* =======================
          BACKGROUND ANIMATIONS 
         ======================= */}
      <div className="absolute inset-0 z-0">
        <StarryBackground />
        
        {/* Floating Asteroids */}
        <div className="asteroid a1"></div>
        <div className="asteroid a2"></div>
        <div className="asteroid a3"></div>

        {/* Revolving Planet */}
        <div className="absolute top-20 -right-20 md:top-1/4 md:right-[10%] opacity-80 pointer-events-none animate-float">
           <div className="planet-box">
             <div className="planet">
               <div className="crater c1"></div>
               <div className="crater c2"></div>
               <div className="crater c3"></div>
             </div>
             <div className="ring-container">
               <div className="ring"></div>
             </div>
           </div>
        </div>

        {/* Nebulas */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      {/* =======================
          CONTENT LAYER 
         ======================= */}
      <div className="relative z-10 flex flex-col min-h-screen backdrop-blur-[1px]">
        
        {/* Navbar */}
        <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
          <div className="text-2xl font-black tracking-tighter">
            KRAZY<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">NOTESY</span>.
          </div>
          <div className="space-x-4">
            <Link href="/auth" className="text-gray-300 hover:text-white font-bold transition">Sign In</Link>
            <Link href="/auth" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full font-bold hover:bg-white/20 transition hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center text-center px-4 mt-20">
          
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-yellow-300 uppercase bg-yellow-900/30 rounded-full border border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.4)] animate-pulse">
            v1.0 Galaxy Edition 🪐
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight max-w-5xl leading-tight mb-6 drop-shadow-2xl">
            Automate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 animate-gradient-x">
              Cosmic Supply Chain.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
            Upload once, transmit everywhere. Krazy Notesy orchestrates your content scheduling, 
            AI captioning, and analytics across the social universe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-32">
            <Link href="/auth" className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-bold text-lg text-neutral-900 shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_40px_rgba(234,179,8,0.7)] transition-all transform hover:-translate-y-1">
              <span className="flex items-center gap-2">
                Launch App <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
              </span>
            </Link>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gray-900/50 backdrop-blur-md border border-gray-700 hover:border-gray-500 text-white rounded-xl font-bold text-lg transition hover:bg-gray-800"
            >
              Explore Demo
            </button>
          </div>

          {/* New Features Section */}
          <motion.div 
            id="features"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h2 className="text-4xl font-black mb-12 flex items-center justify-center gap-3">
              <BoltIcon className="w-8 h-8 text-yellow-400" />
              Unlock <span className="text-yellow-400">Chaotic Powers</span>
            </h2>
            <FeaturesSection />
          </motion.div>

          {/* --- CONTACT SECTION ADDED HERE --- */}
          <ContactSection />

        </main>

        <footer className="text-center py-8 text-gray-600 text-sm">
          © 2025 Krazy Notesy. Built for the creators of tomorrow.
        </footer>
      </div>

      {/* =======================
          CUSTOM STYLES
         ======================= */}
      <style jsx>{`
        @keyframes move-twinkle { from { transform: translateY(0); } to { transform: translateY(-2000px); } }
        /* ... (Animations retained for brevity) ... */
        /* --- PLANET ANIMATION --- */
        .planet-box { position: relative; width: 300px; height: 300px; transform-style: preserve-3d; }
        .planet {
          width: 200px; height: 200px;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #78350f 100%);
          border-radius: 50%;
          position: absolute; top: 50px; left: 50px;
          box-shadow: inset -20px -20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(234, 179, 8, 0.4);
          z-index: 2;
        }
        .crater { background: rgba(0,0,0,0.2); border-radius: 50%; position: absolute; }
        .c1 { width: 40px; height: 40px; top: 40px; left: 50px; }
        .c2 { width: 20px; height: 20px; bottom: 60px; left: 80px; }
        .c3 { width: 30px; height: 15px; top: 100px; right: 40px; transform: rotate(-20deg); }

        .ring-container {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotateX(75deg) rotateY(10deg);
          width: 350px; height: 350px; z-index: 1;
        }
        .ring {
          width: 100%; height: 100%;
          border: 20px solid rgba(255, 255, 255, 0.1);
          border-top: 20px solid rgba(250, 204, 21, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(234, 179, 8, 0.2);
          animation: spin-ring 10s linear infinite;
        }
        @keyframes spin-ring { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }

        .asteroid { position: absolute; background-color: #475569; border-radius: 50%; opacity: 0.6; box-shadow: inset -2px -2px 6px rgba(0,0,0,0.5); pointer-events: none; }
        .a1 { width: 24px; height: 24px; top: 15%; left: -5%; animation: drift 45s linear infinite; }
        .a2 { width: 14px; height: 14px; bottom: 30%; right: -5%; animation: drift 38s linear infinite reverse; }
        .a3 { width: 18px; height: 18px; top: 60%; left: -10%; animation: drift 50s linear infinite 5s; }
        @keyframes drift { from { transform: translateX(0) rotate(0deg); } to { transform: translateX(120vw) rotate(360deg); } }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.1); opacity: 0.2; } }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}