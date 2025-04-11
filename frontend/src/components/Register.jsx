import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChefHat, Mail, Lock, User, ArrowRight, CheckCircle, Sparkles, Globe, AlertCircle } from "lucide-react";
// Import videos from assets
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video3.mp4";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: ""
  });
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [currentVideoBackground, setCurrentVideoBackground] = useState(0);
  const videoRef = useRef(null);
  
  const videoOverlayColors = useMemo(() => [
    "from-purple-900/40 to-amber-600/30",
    "from-blue-900/40 to-red-600/30"
  ], []);

  // Switch between video backgrounds less frequently
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoBackground(prev => (prev === 0 ? 1 : 0));
    }, 30000); // Switch every 30 seconds instead of 15
    
    return () => clearInterval(interval);
  }, []);

  // Video playback management - simplified to one video at a time
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video playback error:", e));
    }
    
    // Set video playback quality to low for better performance
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Slow down playback slightly
      videoRef.current.volume = 0;
    }
  }, [currentVideoBackground]);

  const validateForm = () => {
    const errors = {};
    
    if (form.name.length < 2) {
      errors.name = "Name is too short";
    }
    
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Please enter a valid email";
    }
    
    if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user types
    if (validationErrors[e.target.name]) {
      setValidationErrors(prev => ({
        ...prev,
        [e.target.name]: null
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsAnimating(true);
    try {
      // Simulate API call for demo - remove in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      // await axios.post("http://localhost:5000/api/auth/register", form);
      setShowSuccessState(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setValidationErrors({
        general: "Registration failed. Please try again."
      });
      setIsAnimating(false);
    }
  };

  // Simplified background particles - static instead of dynamic
  const backgroundParticles = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      width: 200 + Math.floor(Math.random() * 300),
      height: 200 + Math.floor(Math.random() * 300),
      left: `${Math.floor(Math.random() * 100)}%`,
      top: `${Math.floor(Math.random() * 100)}%`,
      opacity: 0.3
    }));
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Simplified CSS for essential animations only */}
      <style jsx>{`
        .register-container {
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }
        
        .success-ring {
          animation: success-pulse 2s infinite;
        }
        
        @keyframes success-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(52, 211, 153, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0);
          }
        }
        
        .input-focus-ring {
          transition: all 0.3s ease;
        }
        
        .input-focus-ring:focus {
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
        }
        
        .glassmorphism {
          backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        video {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      `}</style>
      
      {/* Video backgrounds - simplified to load only one at a time */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Current video */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${videoOverlayColors[currentVideoBackground]} z-10`}></div>
          <video 
            ref={videoRef}
            src={currentVideoBackground === 0 ? video1 : video2}
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
            // Lower quality for better performance
            style={{ filter: 'brightness(0.8)' }}
          />
        </div>
      </div>
      
      {/* Static background particles instead of animated ones */}
      <div className="fixed inset-0 pointer-events-none">
        {backgroundParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-amber-300/10 to-purple-500/10 blur-xl"
            style={{
              width: particle.width,
              height: particle.height,
              left: particle.left,
              top: particle.top,
              opacity: particle.opacity
            }}
          />
        ))}
      </div>
      
      {/* Main Card */}
      <div 
        className="register-container relative w-full max-w-md glassmorphism rounded-2xl shadow-2xl overflow-hidden p-1"
      >
        {/* Inner border glow - simplified */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-red-500/10"></div>
        </div>
        
        <div className="relative z-10 px-8 py-10 rounded-2xl overflow-hidden">
          {showSuccessState ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="success-ring p-6 rounded-full bg-green-500/20 mb-6">
                <CheckCircle size={50} className="text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Success!</h2>
              <p className="text-gray-300 text-center mb-6">Your account has been created</p>
              <div className="text-white text-xl">
                Redirecting to login...
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-gradient-to-br from-amber-500 to-red-500 rounded-full shadow-lg">
                  <ChefHat size={32} className="text-white" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
              <div className="flex justify-center mb-8">
                <div className="flex items-center text-amber-500">
                  <Sparkles size={16} className="mr-2" />
                  <p className="text-gray-400">Join <span className="bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent font-medium">RecipeAI</span> today</p>
                  <Sparkles size={16} className="ml-2" />
                </div>
              </div>
              
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input 
                    name="name" 
                    type="text" 
                    placeholder="Full Name" 
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:outline-none transition-all placeholder:text-gray-500 input-focus-ring"
                  />
                  {validationErrors.name && (
                    <p className="text-red-400 text-sm mt-1 ml-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" /> {validationErrors.name}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-black/40 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:outline-none transition-all placeholder:text-gray-500 input-focus-ring"
                  />
                  {validationErrors.email && (
                    <p className="text-red-400 text-sm mt-1 ml-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" /> {validationErrors.email}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-black/40 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:outline-none transition-all placeholder:text-gray-500 input-focus-ring"
                  />
                  {validationErrors.password && (
                    <p className="text-red-400 text-sm mt-1 ml-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" /> {validationErrors.password}
                    </p>
                  )}
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input 
                    name="confirmPassword" 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-black/40 text-white pl-10 pr-4 py-3 rounded-xl border border-gray-700 focus:border-amber-500 focus:outline-none transition-all placeholder:text-gray-500 input-focus-ring"
                  />
                  {validationErrors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1 ml-1 flex items-center">
                      <AlertCircle size={12} className="mr-1" /> {validationErrors.confirmPassword}
                    </p>
                  )}
                </div>
                
                {validationErrors.general && (
                  <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center">
                    <AlertCircle size={16} className="mr-2" /> {validationErrors.general}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={isAnimating}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-medium rounded-xl flex items-center justify-center group hover:shadow-lg transition-all duration-300 ${isAnimating ? 'opacity-75' : ''}`}
                >
                  {isAnimating ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <button 
                    onClick={() => navigate("/login")} 
                    className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Globe size={16} className="text-gray-500" />
                  <p className="text-gray-500 text-sm">Supported in 5+ languages</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Simplified background elements */}
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-purple-500/5 rounded-full blur-xl"></div>
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br from-red-500/5 to-blue-500/5 rounded-full blur-xl"></div>
        </div>
      </div>
      
      {/* Simplified floating element */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex items-center bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
          <Globe size={16} className="mr-2 text-amber-500" />
          <span>Supported in 5+ languages</span>
        </div>
      </div>
    </div>
  );
};

export default Register;