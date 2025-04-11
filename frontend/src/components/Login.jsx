import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChefHat, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentScene, setCurrentScene] = useState(0); // 0: intro, 1: login form
  const particlesRef = useRef(null);
  const loginContainerRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    
    // Create success particles animation
    createSuccessParticles();
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      
      // Dramatic exit animation
      if (loginContainerRef.current) {
        loginContainerRef.current.classList.add("success-animation");
      }
      
      setTimeout(() => {
        navigate("/recipe");
      }, 2000);
    } catch (err) {
      // Error shake animation
      if (loginContainerRef.current) {
        loginContainerRef.current.classList.add("error-shake");
        setTimeout(() => {
          loginContainerRef.current.classList.remove("error-shake");
        }, 500);
      }
      
      createErrorParticles();
      alert("Login failed");
      setIsAnimating(false);
    }
  };

  const createSuccessParticles = () => {
    if (!particlesRef.current) return;
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.classList.add("success-particle");
      
      // Random position from center
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      
      particle.style.left = `calc(50% + ${Math.cos(angle) * distance}px)`;
      particle.style.top = `calc(50% + ${Math.sin(angle) * distance}px)`;
      
      // Random size
      const size = 5 + Math.random() * 20;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Dark color palette for success particles
      const hues = [220, 240, 260]; // Dark blue spectrum
      const hue = hues[Math.floor(Math.random() * hues.length)];
      particle.style.backgroundColor = `hsla(${hue}, 70%, 40%, 0.8)`;
      
      // Random animation duration
      particle.style.animationDuration = `${1 + Math.random() * 2}s`;
      
      particlesRef.current.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, 3000);
    }
  };

  const createErrorParticles = () => {
    if (!particlesRef.current) return;
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.classList.add("error-particle");
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = 5 + Math.random() * 10;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      particlesRef.current.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, 1500);
    }
  };

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      };
      
      // Apply parallax to background layers
      const layers = document.querySelectorAll('.parallax-layer');
      layers.forEach((layer, index) => {
        const depth = (index + 1) * 10;
        const moveX = (mousePosRef.current.x * depth - depth/2);
        const moveY = (mousePosRef.current.y * depth - depth/2);
        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Create ambient floating particles initially, not during typing
    const createAmbientParticles = () => {
      const container = document.querySelector(".particles-container");
      if (!container) return;
      
      // Create floating particles
      Array.from({ length: 30 }).forEach(() => {
        const particle = document.createElement("div");
        particle.classList.add("ambient-particle");
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = 3 + Math.random() * 8;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Darker color palette for ambient particles
        const hues = [220, 230, 240, 250]; // Dark blue spectrum
        const hue = hues[Math.floor(Math.random() * hues.length)];
        const brightness = 20 + Math.floor(Math.random() * 20); // Lower brightness for darker feel
        particle.style.backgroundColor = `hsla(${hue}, 70%, ${brightness}%, ${0.3 + Math.random() * 0.4})`;
        
        // Random animation duration and delay
        particle.style.animationDuration = `${15 + Math.random() * 20}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
        
        // Remove after animation cycle
        setTimeout(() => {
          particle.remove();
        }, 35000);
      });
    };
    
    // Create ambient particles only once at start, not repeatedly
    createAmbientParticles();
    
    // Initial animations
    setTimeout(() => {
      setCurrentScene(1);
    }, 2000);
    
    // No interval for particles to avoid movement during typing
    
    return () => {
      // No cleanup needed for interval
    };
  }, []);

  // Create hover effect for inputs
  useEffect(() => {
    const inputs = document.querySelectorAll("input");
    
    const handleMouseMove = (e, input) => {
      const rect = input.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      input.style.setProperty('--mouse-x', `${x}px`);
      input.style.setProperty('--mouse-y', `${y}px`);
    };
    
    inputs.forEach(input => {
      input.addEventListener('mousemove', (e) => handleMouseMove(e, input));
    });
    
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('mousemove', (e) => handleMouseMove(e, input));
      });
    };
  }, [currentScene]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes float {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(var(--rand-x, 10px), var(--rand-y, 15px));
          }
          100% {
            transform: translate(0, 0);
          }
        }
        
        @keyframes ambientFloat {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translate3d(var(--final-x, 100px), var(--final-y, -100px), 0) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(10, 15, 60, 0.5), 0 0 10px rgba(10, 15, 60, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(10, 15, 60, 0.8), 0 0 30px rgba(10, 15, 60, 0.5);
          }
          100% {
            box-shadow: 0 0 5px rgba(10, 15, 60, 0.5), 0 0 10px rgba(10, 15, 60, 0.2);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(1.2);
          }
        }
        
        @keyframes successParticle {
          0% {
            transform: scale(0) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: scale(1.5) translate(var(--tx), var(--ty));
            opacity: 0;
          }
        }
        
        @keyframes errorParticle {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          20%, 60% {
            transform: translateX(-10px);
          }
          40%, 80% {
            transform: translateX(10px);
          }
        }
        
        @keyframes spin3D {
          0% {
            transform: rotate3d(1, 1, 1, 0deg);
          }
          100% {
            transform: rotate3d(1, 1, 1, 360deg);
          }
        }
        
        @keyframes successSubmit {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(0) translateY(-100vh);
          }
        }
        
        @keyframes shiningBorder {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes waveEffect {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .intro-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          transition: all 1.5s ease-out;
        }
        
        .intro-screen.hide {
          opacity: 0;
          transform: scale(1.5);
          pointer-events: none;
        }
        
        .login-scene {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s ease-out;
          pointer-events: none;
        }
        
        .login-scene.active {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }
        
        .login-container {
          position: relative;
          transition: all 0.5s ease;
          box-shadow: 0 0 30px rgba(10, 15, 60, 0.3);
          animation: glow 3s ease-in-out infinite;
          will-change: transform, box-shadow;
        }
        
        .login-container:hover {
          transform: translateY(-5px);
        }
        
        .shining-border {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          z-index: -1;
          border-radius: 1rem;
          background: linear-gradient(90deg, #0f172a, #1e293b, #111827, #0f172a);
          background-size: 400% 400%;
          animation: shiningBorder 6s linear infinite;
          overflow: hidden;
        }
        
        .shining-border::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: waveEffect 3s linear infinite;
        }
        
        .ambient-particle {
          position: absolute;
          border-radius: 50%;
          --final-x: ${() => (Math.random() * 200) - 100}px;
          --final-y: ${() => (Math.random() * 200) - 100}px;
          animation: ambientFloat 20s ease-in-out forwards;
          z-index: 1;
          pointer-events: none;
          filter: blur(1px);
          will-change: transform, opacity;
        }
        
        .floating-element {
          --rand-x: ${() => (Math.random() * 20) - 10}px;
          --rand-y: ${() => (Math.random() * 20) - 10}px;
          animation: float 6s ease-in-out infinite;
          will-change: transform;
        }
        
        .success-particle {
          position: absolute;
          border-radius: 50%;
          --tx: ${() => (Math.random() * 200) - 100}px;
          --ty: ${() => (Math.random() * 200) - 100}px;
          animation: successParticle 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          z-index: 30;
        }
        
        .error-particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #ef4444;
          border-radius: 50%;
          animation: errorParticle 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          z-index: 30;
        }
        
        .input-highlight {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          background: radial-gradient(
            circle at var(--mouse-x) var(--mouse-y),
            rgba(10, 15, 60, 0.2) 0%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 0;
        }
        
        input:focus + .input-highlight, 
        input:hover + .input-highlight {
          opacity: 1;
        }
        
        .btn-submit {
          position: relative;
          overflow: hidden;
        }
        
        .btn-submit:before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: rotate(45deg);
          animation: shimmer 3s infinite;
          background-size: 200% 100%;
          pointer-events: none;
        }
        
        .error-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        .success-animation {
          animation: successSubmit 1.5s forwards;
        }
        
        .parallax-background {
          position: fixed;
          inset: -50%;
          width: 200%;
          height: 200%;
          z-index: -10;
        }
        
        .parallax-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: transform 0.1s ease-out;
          will-change: transform;
        }
        
        .spotlight {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at var(--x, 50%) var(--y, 50%), 
            rgba(10, 15, 60, 0.15) 0%, 
            transparent 50%
          );
          z-index: -1;
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        
        .gradient-text {
          background: linear-gradient(90deg, #1e40af, #1e3a8a, #172554, #0f172a);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 300% 100%;
          animation: gradient 4s ease infinite;
        }
        
        .sparkle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: #1e3a8a;
          opacity: 0.8;
          animation: twinkle 1s ease-in-out infinite alternate;
          z-index: 1;
        }
        
        @keyframes twinkle {
          0% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .sphere-decoration {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(30, 58, 138, 0.3), transparent);
          filter: blur(1px);
          z-index: -1;
        }
        
        .chef-icon-container {
          position: relative;
          animation: pulse 2s infinite ease-in-out;
        }
        
        .chef-icon-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          background: radial-gradient(circle, rgba(30, 58, 138, 0.8) 0%, transparent 70%);
          filter: blur(15px);
          z-index: -1;
          animation: pulse 2s infinite ease-in-out alternate-reverse;
        }
      `}</style>

      {/* Parallax Background */}
      <div className="parallax-background">
        <div className="parallax-layer" style={{ background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #000 60%)' }}></div>
        <div className="parallax-layer" style={{ opacity: 0.3, background: 'radial-gradient(ellipse at 30% 40%, #1e3a8a 0%, transparent 70%)' }}></div>
        <div className="parallax-layer" style={{ opacity: 0.2, background: 'radial-gradient(ellipse at 70% 60%, #1e3a8a 0%, transparent 70%)' }}></div>
        <div className="parallax-layer" style={{ opacity: 0.1, background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'1\' fill=\'%23fff\' /%3E%3C/svg%3E")' }}></div>
      </div>

      {/* Dynamic spotlight effect */}
      <div className="spotlight" id="spotlight"></div>

      {/* Particles container */}
      <div ref={particlesRef} className="particles-container fixed inset-0 pointer-events-none z-0"></div>

      {/* Decorative elements */}
      {Array.from({ length: 30 }).map((_, index) => (
        <div 
          key={index}
          className="sparkle" 
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }}
        ></div>
      ))}

      {/* Decorative glass-like spheres */}
      <div className="sphere-decoration" style={{ width: '200px', height: '200px', top: '10%', left: '10%', opacity: 0.3 }}></div>
      <div className="sphere-decoration" style={{ width: '150px', height: '150px', top: '70%', right: '15%', opacity: 0.2 }}></div>
      <div className="sphere-decoration" style={{ width: '100px', height: '100px', top: '40%', right: '30%', opacity: 0.15 }}></div>

      {/* Intro animation screen */}
      <div className={`intro-screen ${currentScene > 0 ? 'hide' : ''}`}>
        <div className="chef-icon-container p-8 bg-gradient-to-br from-gray-900 to-blue-900 rounded-full shadow-2xl">
          <div className="chef-icon-glow"></div>
          <ChefHat size={64} className="text-white" />
        </div>
      </div>

      {/* Login form scene */}
      <div className={`login-scene ${currentScene === 1 ? 'active' : ''}`}>
        <div 
          ref={loginContainerRef}
          className="login-container relative w-full backdrop-blur-xl bg-black/50 rounded-xl overflow-hidden p-15 border border-gray-800"
        >
          <div className="shining-border"></div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-900/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-blue-900/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-8 mt-2">
              <div className="p-4 bg-gradient-to-br from-gray-900 to-blue-900 rounded-full shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <ChefHat size={32} className="text-white relative z-10" />
                
                {/* Orbit effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full absolute animate-spin" style={{ animationDuration: '8s' }}>
                    <div className="w-2 h-2 bg-blue-200 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 opacity-60"></div>
                  </div>
                  <div className="w-full h-full absolute animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
                    <div className="w-1 h-1 bg-blue-300 rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2 opacity-60"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center mb-1 relative text-white">
              Welcome Back
            </h2>
            
            <p className="text-gray-300 text-center mb-8 opacity-80">Sign in to access your favorite recipes</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-gray-400 transition-colors group-hover:text-blue-400 z-10" size={18} />
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  onChange={handleChange}
                  className="w-100 bg-gray-900/70 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-800 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 focus:outline-none transition-all placeholder:text-gray-500 relative z-10 backdrop-blur-sm"
                  required
                />
                <div className="input-highlight rounded-lg"></div>
                
                {/* Input animation effect */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-900 to-indigo-800 transition-all duration-300 group-hover:w-full"></div>
              </div>
              
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-gray-400 transition-colors group-hover:text-blue-400 z-10" size={18} />
                <input 
                  name="password" 
                  type="password" 
                  placeholder="Password" 
                  onChange={handleChange}
                  className="w-full bg-gray-900/70 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-800 focus:border-blue-700 focus:ring-1 focus:ring-blue-700 focus:outline-none transition-all placeholder:text-gray-500 relative z-10 backdrop-blur-sm"
                  required
                />
                <div className="input-highlight rounded-lg"></div>
                
                {/* Input animation effect */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-900 to-indigo-800 transition-all duration-300 group-hover:w-full"></div>
              </div>
              
              <button 
                type="submit" 
                className={`btn-submit w-full py-3 px-4 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white font-medium rounded-lg flex items-center justify-center group hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 relative overflow-hidden ${isAnimating ? 'animate-pulse' : ''}`}
              >
                <span className="relative z-10 flex items-center">
                  <span>Sign In</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </span>
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <button 
                  onClick={() => navigate("/register")} 
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors relative group flex items-center justify-center mx-auto"
                >
                  <Sparkles size={14} className="mr-1 text-blue-300" />
                  <span>Register</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300"></span>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

       {/* Script for dynamic mouse tracking spotlight effect */}
       <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('mousemove', (e) => {
            const spotlight = document.getElementById('spotlight');
            if (spotlight) {
              const x = (e.clientX / window.innerWidth) * 100;
              const y = (e.clientY / window.innerHeight) * 100;
              spotlight.style.setProperty('--x', x + '%');
              spotlight.style.setProperty('--y', y + '%');
            }
          });
        `
      }} />
    </div>
  );
};

export default Login;