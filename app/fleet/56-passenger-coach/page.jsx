"use client";

import React, { useState, useEffect } from 'react';
import { 
  Phone, Mail, MapPin, Menu, X, ArrowRight, ChevronRight, 
  Users, Wind, Mic, MonitorPlay, CheckCircle, Shield, 
  Calendar, Building, Quote, Bus, Star
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

let app, auth, db;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'tours-coach-charters';

try {
  const configString = typeof __firebase_config !== 'undefined' ? __firebase_config : null;
  if (configString) {
    const firebaseConfig = JSON.parse(configString);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase initialization failed.", e);
}

export default function LuxuryCoach56Page() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: 'Select',
    groupSize: '56', // Pre-fill with capacity for this specific vehicle
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!user && db) {
      setSubmitMessage({ type: 'error', text: 'Connecting to server, please try again in a moment.' });
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      if (db) {
        const quotesRef = collection(db, 'artifacts', appId, 'public', 'data', 'quotes');
        await addDoc(quotesRef, {
          ...formData,
          vehicleRequested: '56-Passenger Luxury Motorcoach',
          createdAt: new Date().toISOString(),
          userId: user ? user.uid : 'anonymous'
        });
      }
      setSubmitMessage({ type: 'success', text: 'Quote request submitted successfully! We will contact you shortly.' });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', serviceType: 'Select', groupSize: '56', details: '' });
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to submit. Please call us directly at (416) 269-9555.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Charter Services', href: '/#services' },
    { name: 'Fleet', href: '/#fleet' },
    { name: 'Tours', href: '/#tours' },
    { name: 'Locations', href: '/#locations' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/#contact' },
  ];

  // Adding JSON-LD Structured Data for Local SEO & Product
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "56-Passenger Luxury Motorcoach Rental",
    "description": "Premium 56-passenger charter bus rental service in Canada. Perfect for corporate events, school trips, weddings, and long-distance travel.",
    "brand": {
      "@type": "Brand",
      "name": "Tours Coach Charters"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "CAD",
      "url": "https://www.tourscoachcharter.com/fleet/56-passenger-coach",
      "areaServed": "Canada"
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-white flex flex-col min-h-screen">
      
      {/* Inject SEO Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100 py-3 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
          <a href="/" className="flex items-center space-x-2">
            <div className="bg-[#003366] p-2 rounded flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block text-xl font-bold text-[#003366]">TOURS COACH</span>
              <span className="block text-[10px] font-bold text-[#E31837] tracking-[0.2em] uppercase">CHARTER</span>
            </div>
          </a>

          <nav className="hidden lg:flex space-x-6 items-center text-sm font-medium">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`${link.name === 'Fleet' ? 'text-[#E31837] border-b-2 border-[#E31837] pb-1' : 'text-gray-600 hover:text-[#E31837]'} transition-colors`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <a href="tel:4162699555" className="flex items-center text-gray-800 font-bold hover:text-[#E31837] transition-colors">
              <Phone className="w-4 h-4 mr-2" /> (416) 269-9555
            </a>
            <a href="#quote" className="bg-[#E31837] hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm">
              Get a Free Quote
            </a>
          </div>

          <button className="lg:hidden text-gray-600 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6 text-[#E31837]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t absolute w-full left-0 shadow-lg z-50">
            <div className="px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className={`font-medium ${link.name === 'Fleet' ? 'text-[#E31837]' : 'text-gray-800'}`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a href="tel:4162699555" className="flex items-center text-gray-800 font-bold pt-2 border-t">
                <Phone className="w-4 h-4 mr-2" /> (416) 269-9555
              </a>
              <a href="#quote" className="bg-[#E31837] text-white text-center px-4 py-3 rounded-md font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                Get a Free Quote
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative h-[550px] md:h-[650px] flex flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop" 
               alt="56-Passenger Luxury Coach Bus in Canadian Mountains" 
               className="w-full h-full object-cover" 
             />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 max-w-7xl">
            {/* Breadcrumbs */}
            <div className="flex items-center text-gray-300 text-xs md:text-sm mb-6 font-medium">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 mx-2 text-gray-500" />
              <a href="/#fleet" className="hover:text-white transition-colors">Fleet</a>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 mx-2 text-gray-500" />
              <span className="text-white">Luxury Coach Bus</span>
            </div>

            <div className="max-w-2xl text-white">
              <p className="text-xs md:text-sm font-bold tracking-widest uppercase mb-4 text-gray-300">56-Passenger Luxury Motorcoach</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Travel Together.<br />Arrive in Comfort.
              </h1>
              <p className="text-base md:text-lg text-gray-200 mb-8 max-w-lg leading-relaxed font-light">
                Our 56-passenger luxury coach bus is the perfect choice for large groups. Ideal for corporate events, conferences, school trips, Niagara tours, special events and long-distance travel across Ontario and Canada.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#quote" className="bg-[#E31837] hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold flex items-center transition-colors shadow-lg">
                  Get a Free Quote <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <a href="tel:4162699555" className="bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3.5 rounded-full font-bold flex items-center transition-all">
                  <Phone className="w-4 h-4 mr-2" /> Call (416) 269-9555
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-b border-gray-100 shadow-sm relative z-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-8">
              <div className="flex flex-col items-center justify-center text-center px-2 border-r border-gray-100">
                <Users className="w-8 h-8 mb-3 text-[#003366]" />
                <span className="text-sm font-bold text-gray-900">Up to<br/>56 Passengers</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center px-2 md:border-r border-gray-100">
                <div className="w-8 h-8 mb-3 flex items-center justify-center text-[#003366]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18h14M9 18v3M15 18v3M5 14h14M7 6h10M7 6v8M17 6v8M7 6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2"/></svg>
                </div>
                <span className="text-sm font-bold text-gray-900">High-Back<br/>Reclining Seats</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center px-2 border-r border-gray-100">
                <Wind className="w-8 h-8 mb-3 text-[#003366]" />
                <span className="text-sm font-bold text-gray-900">Air<br/>Conditioning</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center px-2 md:border-r border-gray-100">
                <div className="w-8 h-8 mb-3 flex items-center justify-center text-[#003366]">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6a3 3 0 1 0 6 0 3 3 0 1 0-6 0"/><path d="M14 9V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M15 12h-6"/><path d="M12 12v6"/><path d="M10 22h4"/></svg>
                </div>
                <span className="text-sm font-bold text-gray-900">Onboard<br/>Restroom</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center px-2 col-span-2 md:col-span-1 mt-4 md:mt-0">
                <Mic className="w-8 h-8 mb-3 text-[#003366]" />
                <span className="text-sm font-bold text-gray-900">PA System<br/>& Microphone</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              
              <div className="lg:w-1/2">
                <p className="text-[#E31837] font-bold text-xs tracking-widest uppercase mb-2">PREMIUM GROUP TRANSPORTATION</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-6">Comfort for Every Journey</h2>
                <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                  Our luxury motorcoach is designed with modern amenities to provide a safe, smooth and enjoyable travel experience for large groups. Whether you're traveling across the city or across Canada, we ensure your group arrives relaxed and on time.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="text-[#003366]"><CheckCircle className="w-6 h-6"/></div>
                    <h4 className="font-bold text-gray-900 text-sm">Spotless & Comfortable<br/>Seating</h4>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="text-[#003366]"><Wind className="w-6 h-6"/></div>
                    <h4 className="font-bold text-gray-900 text-sm">Climate Control<br/>for All Seasons</h4>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="text-[#003366]">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6a3 3 0 1 0 6 0 3 3 0 1 0-6 0"/></svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">Onboard Restroom<br/>for Convenience</h4>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="text-[#003366]"><Mic className="w-6 h-6"/></div>
                    <h4 className="font-bold text-gray-900 text-sm">PA System<br/>for Announcements</h4>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="text-[#003366]">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="6" width="16" height="12" rx="2" ry="2"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">Large Luggage<br/>Storage</h4>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="text-[#003366]"><MonitorPlay className="w-6 h-6"/></div>
                    <h4 className="font-bold text-gray-900 text-sm">TV Screens<br/><span className="text-xs font-normal text-gray-500">(Available on Request)</span></h4>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 w-full h-full">
                <img 
                  src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop" 
                  alt="Interior of a luxury 56-passenger coach bus showing reclining seats" 
                  className="rounded-xl shadow-xl w-full object-cover h-[600px]"
                />
              </div>

            </div>
          </div>
        </section>

        <section className="py-20 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center md:text-left mb-12">
              <p className="text-[#E31837] font-bold text-xs tracking-widest uppercase mb-2">IDEAL FOR EVERY GROUP</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Perfect for Any Occasion</h2>
              <p className="text-gray-600 text-lg max-w-3xl">
                Our 56-passenger coach bus is a versatile solution for a wide range of travel needs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-center group hover:shadow-md transition-shadow flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1557223562-6c77ef161f59?q=80&w=400&auto=format&fit=crop" alt="Corporate Events" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-grow">
                  <h3 className="font-bold text-[#003366] mb-3">Corporate Events</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Reliable transportation for meetings, conferences and corporate retreats.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-center group hover:shadow-md transition-shadow flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1523580494112-071d16940353?q=80&w=400&auto=format&fit=crop" alt="School Trips" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-grow">
                  <h3 className="font-bold text-[#003366] mb-3">School & University Trips</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Safe and comfortable transportation for educational trips.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-center group hover:shadow-md transition-shadow flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=400&auto=format&fit=crop" alt="Sports Teams" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-grow">
                  <h3 className="font-bold text-[#003366] mb-3">Sports Teams</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Spacious travel for teams, coaches and equipment.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-center group hover:shadow-md transition-shadow flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop" alt="Weddings" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-grow">
                  <h3 className="font-bold text-[#003366] mb-3">Weddings & Special Events</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Keep your guests together and on schedule.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-center group hover:shadow-md transition-shadow flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=400&auto=format&fit=crop" alt="Tours & Excursions" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-grow">
                  <h3 className="font-bold text-[#003366] mb-3">Tours & Excursions</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Explore Ontario and beyond with comfortable group travel.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-[#E31837] font-bold text-xs tracking-widest uppercase mb-2">OUR LUXURY COACH BUS</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-4">Vehicle Gallery</h2>
                <p className="text-gray-600 max-w-md">Take a closer look at our 56-passenger luxury motorcoach with modern features and spacious interiors.</p>
              </div>
              <div className="hidden md:flex gap-3">
                <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#003366] hover:border-[#003366] transition-colors shadow-sm"><ChevronRight className="w-6 h-6 rotate-180"/></button>
                <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#003366] hover:border-[#003366] transition-colors shadow-sm"><ChevronRight className="w-6 h-6"/></button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 md:row-span-2">
                <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop" alt="Exterior of a White 56 Passenger Coach Bus in nature" className="w-full h-full object-cover rounded-xl shadow-md" />
              </div>
              <div className="h-64 md:h-auto">
                 <img src="https://images.unsplash.com/photo-1582298538104-efa9cb1052ca?q=80&w=600&auto=format&fit=crop" alt="Charter bus rear exterior" className="w-full h-full object-cover rounded-xl shadow-md" />
              </div>
              <div className="grid grid-cols-2 gap-6 h-64 md:h-auto">
                 <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=400&auto=format&fit=crop" alt="Luxury Coach Seating" className="w-full h-full object-cover rounded-xl shadow-md" />
                 <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop" alt="Luggage storage bays" className="w-full h-full object-cover rounded-xl shadow-md grayscale opacity-80" />
              </div>
            </div>
          </div>
        </section>

        <section id="quote" className="py-24 relative bg-[#003366] overflow-hidden">
          <div 
            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 z-0 bg-[#003366]/80"></div>
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10 flex flex-col md:flex-row gap-12 items-center">
            
            <div className="md:w-5/12 text-white text-center md:text-left">
              <p className="text-[#E31837] font-bold text-xs tracking-widest uppercase mb-2">GET A QUOTE</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Plan Your Group Trip Today</h2>
              <p className="text-blue-100 text-lg">
                Fill out the form and we'll get back to you with a competitive quote for your 56-passenger coach bus charter.
              </p>
            </div>

            <div className="md:w-7/12 w-full">
              <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl">
                
                {submitMessage.text && (
                  <div className={`mb-6 p-4 rounded-md text-sm font-medium flex items-center ${submitMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    {submitMessage.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                    {submitMessage.text}
                  </div>
                )}

                <form onSubmit={handleQuoteSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">First Name <span className="text-[#E31837]">*</span></label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Last Name <span className="text-[#E31837]">*</span></label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email <span className="text-[#E31837]">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Phone <span className="text-[#E31837]">*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Service Type <span className="text-[#E31837]">*</span></label>
                      <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none bg-gray-50">
                        <option>Select</option>
                        <option>School Trip</option>
                        <option>Corporate</option>
                        <option>Wedding</option>
                        <option>Tours</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Group Size <span className="text-[#E31837]">*</span></label>
                      <select name="groupSize" value={formData.groupSize} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none bg-gray-50">
                        <option value="56">Up to 56 (Selected Vehicle)</option>
                        <option value="1-14">1-14</option>
                        <option value="15-36">15-36</option>
                        <option value="37-56">37-56</option>
                        <option value="56+">56+</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Trip Details (Dates, Location, Itinerary, etc.)</label>
                      <textarea name="details" rows={4} value={formData.details} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none bg-gray-50 resize-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-[#E31837] hover:bg-red-700 text-white font-bold py-4 rounded transition-colors flex justify-center items-center disabled:opacity-70 shadow-md">
                    {isSubmitting ? "Sending..." : "Request a Quote"} {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#002244] py-10 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-center max-w-7xl">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to Move Your Group?</h2>
              <p className="text-blue-200">Let us help you plan the perfect trip. Get a free quote today!</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#quote" className="bg-[#E31837] hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full transition-all text-center flex items-center justify-center shadow-lg">
                Get a Free Quote <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a href="tel:4162699555" className="text-white font-bold px-8 py-3 rounded-full transition-all text-center flex items-center justify-center hover:bg-white/10">
                <Phone className="w-4 h-4 mr-2" /> (416) 269-9555
              </a>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-30 pointer-events-none mix-blend-luminosity">
             <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#002244] to-transparent"></div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0b1320] text-gray-400 pt-16 pb-8 border-t border-blue-900/30 text-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            <div>
              <a href="/" className="flex items-center mb-6">
                <div className="bg-white px-3 py-2 rounded flex items-center">
                  <Bus className="w-8 h-8 text-[#003366] mr-2" />
                  <span className="text-[#003366] font-extrabold text-xl leading-none">TOURS COACH<br/><span className="text-[#E31837] text-sm tracking-widest uppercase">CHARTER</span></span>
                </div>
              </a>
              <p className="mb-6 leading-relaxed">Safe. Reliable. Together.</p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-base">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/#services" className="hover:text-white transition-colors">Charter Services</a></li>
                <li><a href="/#fleet" className="hover:text-white transition-colors">Fleet</a></li>
                <li><a href="/#tours" className="hover:text-white transition-colors">Tours</a></li>
                <li><a href="/#locations" className="hover:text-white transition-colors">Locations</a></li>
                <li><a href="/#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-base">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-gray-500" />
                  <a href="tel:4162699555" className="hover:text-white transition-colors">(416) 269-9555</a>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-gray-500" />
                  <a href="mailto:info@tourscoachcharter.com" className="hover:text-white transition-colors break-all">info@tourscoachcharter.com</a>
                </li>
                <li className="flex items-start">
                  <MapPin className="mt-1 w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                  <span>Pickering, Ontario, Canada</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-base">Follow Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#E31837] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#E31837] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#E31837] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-[#E31837] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; {new Date().getFullYear()} Tours Coach Charter. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
               <a href="#" className="hover:text-white">Privacy Policy</a>
               <span>|</span>
               <a href="#" className="hover:text-white">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}