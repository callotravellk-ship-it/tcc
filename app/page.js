"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Bus, Car, Users, Building, ArrowRight, Menu, X, CheckCircle, Star, Calendar, Shield, ChevronDown, Plus, Minus, Quote } from 'lucide-react';
// import Image from 'next/image'; // Uncomment in Next.js
// import Link from 'next/link'; // Uncomment in Next.js

// --- FIREBASE INITIALIZATION ---
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

export default function ToursHomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: 'Select',
    groupSize: 'Select',
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

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Charter Services', href: '#services' },
    { name: 'Fleet', href: '#fleet' },
    { name: 'Tours', href: '#tours' },
    { name: 'Locations', href: '#locations' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

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
          createdAt: new Date().toISOString(),
          userId: user ? user.uid : 'anonymous'
        });
      }
      setSubmitMessage({ type: 'success', text: 'Quote request submitted successfully!' });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', serviceType: 'Select', groupSize: 'Select', details: '' });
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to submit. Please call us instead.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="font-sans text-gray-800 bg-white flex flex-col min-h-screen">
      
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-7xl">
          
          {/* Logo */}
          <a href="#" className="flex items-center">
             <img 
              src="image_e0d1ba.png" 
              alt="Tours Coach Charters" 
              className="h-10 md:h-12 object-contain"
              onError={(e) => { e.target.src = "https://placehold.co/200x60/ffffff/E31837?text=Logo"; }}
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-6 items-center text-sm font-medium">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`${link.name === 'Home' ? 'text-[#E31837] border-b-2 border-[#E31837] pb-1' : 'text-gray-600 hover:text-[#E31837]'} transition-colors`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Contact & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="tel:4162699555" className="flex items-center text-gray-800 font-bold hover:text-[#E31837]">
              <Phone className="w-4 h-4 mr-2" /> (416) 269-9555
            </a>
            <a href="#quote" className="bg-[#E31837] hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm">
              Get a Free Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-gray-600 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6 text-[#E31837]" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t absolute w-full left-0 shadow-lg z-50">
            <div className="px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-gray-800 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
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
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop" alt="Coach Bus in Mountains" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 max-w-7xl">
            <div className="max-w-2xl text-white">
              <p className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-300">Canada's Premier Charter Bus Service</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Trusted Coach Charters for Group Travel in Canada.
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed">
                Comfortable. Safe. Reliable. Whether it's a school trip, corporate event, wedding or a cross-Canada adventure, we get your group there together.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#quote" className="bg-[#E31837] hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold flex items-center transition-colors">
                  Get a Free Quote <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <a href="tel:4162699555" className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3.5 rounded-full font-bold flex items-center transition-all">
                  <Phone className="w-4 h-4 mr-2" /> Call (416) 269-9555
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-b border-gray-100 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
              <div className="flex flex-col items-center justify-center text-center px-4 border-r border-gray-100 last:border-0 md:last:border-r-0">
                <div className="flex items-center text-gray-800 mb-1">
                  <Calendar className="w-6 h-6 mr-2 text-gray-400" />
                  <span className="text-3xl font-bold">15+</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Years of Experience</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center px-4 border-r border-gray-100 md:border-r">
                <div className="flex items-center text-gray-800 mb-1">
                  <Users className="w-6 h-6 mr-2 text-gray-400" />
                  <span className="text-3xl font-bold">5,000+</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Successful Trips</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center px-4 border-r border-gray-100 last:border-0">
                <div className="flex items-center text-gray-800 mb-1">
                  <Shield className="w-6 h-6 mr-2 text-gray-400" />
                  <span className="text-3xl font-bold">100%</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Fully Insured</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center px-4">
                <div className="flex items-center text-gray-800 mb-1">
                  <Star className="w-6 h-6 mr-2 text-gray-400" />
                  <span className="text-3xl font-bold">4.9/5</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Customer Rating<br/><span className="text-xs">(Nationwide)</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-[#E31837] font-bold text-sm tracking-widest uppercase mb-2">Our Charter Services</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transportation for Every Occasion</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                From school trips to corporate events, we provide reliable and comfortable transportation solutions for groups of all sizes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {/* Service 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="h-32 mb-6 rounded-lg overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1559523161-0fc0d6b38652?q=80&w=400&auto=format&fit=crop" alt="School Bus" className="w-full h-full object-cover" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#003366] text-white p-2 rounded-full border-4 border-white">
                    <Bus className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mt-4 mb-2">School Bus Rental</h3>
                <p className="text-sm text-gray-500">Safe & reliable transport for students and school groups.</p>
              </div>
              
              {/* Service 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="h-32 mb-6 rounded-lg overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop" alt="Wedding" className="w-full h-full object-cover" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#003366] text-white p-2 rounded-full border-4 border-white">
                    <Star className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mt-4 mb-2">Wedding & Engagements</h3>
                <p className="text-sm text-gray-500">Make your special day stress-free and memorable.</p>
              </div>

              {/* Service 3 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="h-32 mb-6 rounded-lg overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1557223562-6c77ef161f59?q=80&w=400&auto=format&fit=crop" alt="Corporate" className="w-full h-full object-cover" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#003366] text-white p-2 rounded-full border-4 border-white">
                    <Building className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mt-4 mb-2">Corporate Travel</h3>
                <p className="text-sm text-gray-500">Professional transport for your business needs.</p>
              </div>

              {/* Service 4 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="h-32 mb-6 rounded-lg overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop" alt="Sports" className="w-full h-full object-cover" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#003366] text-white p-2 rounded-full border-4 border-white">
                    <Star className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mt-4 mb-2">Sports Groups</h3>
                <p className="text-sm text-gray-500">Get your team to the game together and on time.</p>
              </div>

              {/* Service 5 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="h-32 mb-6 rounded-lg overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=400&auto=format&fit=crop" alt="Tours" className="w-full h-full object-cover" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#003366] text-white p-2 rounded-full border-4 border-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mt-4 mb-2">Tours & Excursions</h3>
                <p className="text-sm text-gray-500">Explore Canada's best destinations in comfort.</p>
              </div>

               {/* Service 6 */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="h-32 mb-6 rounded-lg overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=400&auto=format&fit=crop" alt="Private" className="w-full h-full object-cover" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#003366] text-white p-2 rounded-full border-4 border-white">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mt-4 mb-2">Private Travel</h3>
                <p className="text-sm text-gray-500">Custom trips for families, friends and special groups.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fleet Section */}
        <section id="fleet" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl flex flex-col lg:flex-row gap-12 items-center">
            
            <div className="lg:w-1/3">
              <p className="text-[#E31837] font-bold text-sm tracking-widest uppercase mb-2">Our Fleet</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Modern. Comfortable. Reliable.</h2>
              <p className="text-gray-600 mb-8">
                Our diverse fleet is equipped with modern amenities, professional drivers and is maintained to the highest safety standards.
              </p>
              <a href="#quote" className="bg-[#E31837] hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold inline-flex items-center transition-colors">
                View All Vehicles <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>

            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gray-100 h-32 p-4 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop" alt="Coach" className="h-full object-cover mix-blend-multiply rounded" />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold text-gray-900 text-sm">56-Passenger Luxury Coach</h4>
                  <p className="text-xs text-gray-500 mt-1">Up to 56 passengers</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gray-100 h-32 p-4 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=400&auto=format&fit=crop" alt="Mini Coach" className="h-full object-cover mix-blend-multiply rounded" />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold text-gray-900 text-sm">24-36 Passenger Mini Coach</h4>
                  <p className="text-xs text-gray-500 mt-1">Up to 36 passengers</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gray-100 h-32 p-4 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1517520032906-81dbd9ebda3b?q=80&w=400&auto=format&fit=crop" alt="Van" className="h-full object-cover mix-blend-multiply rounded" />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold text-gray-900 text-sm">14-Passenger Van</h4>
                  <p className="text-xs text-gray-500 mt-1">Up to 14 passengers</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gray-100 h-32 p-4 flex items-center justify-center">
                   <img src="https://images.unsplash.com/photo-1559523161-0fc0d6b38652?q=80&w=400&auto=format&fit=crop" alt="School Bus" className="h-full object-cover mix-blend-multiply rounded" />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold text-gray-900 text-sm">School Bus</h4>
                  <p className="text-xs text-gray-500 mt-1">Up to 72 passengers</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Quote Form Section */}
        <section id="quote" className="py-20 relative bg-[#003366]">
           <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
           
           <div className="container mx-auto px-4 max-w-6xl relative z-10 flex flex-col md:flex-row gap-12 items-center">
             
             <div className="md:w-5/12 text-white">
               <p className="text-[#E31837] font-bold text-sm tracking-widest uppercase mb-2">Get a Quote</p>
               <h2 className="text-3xl md:text-5xl font-bold mb-6">Tell Us About Your Trip</h2>
               <p className="text-blue-100 text-lg">
                 Fill out the form below for a customized quote. We'll get back to you quickly with the best options for your group.
               </p>
             </div>

             <div className="md:w-7/12 w-full">
                <div className="bg-white p-8 rounded-xl shadow-2xl">
                  <form onSubmit={handleQuoteSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                      <div>
                        <input type="text" name="firstName" placeholder="First Name *" required value={formData.firstName} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none" />
                      </div>
                      <div>
                        <input type="text" name="lastName" placeholder="Last Name *" required value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none" />
                      </div>
                      <div>
                        <input type="email" name="email" placeholder="Email *" required value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none" />
                      </div>
                      <div>
                        <input type="tel" name="phone" placeholder="Phone *" required value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none" />
                      </div>
                      
                      <div className="relative">
                         <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none appearance-none bg-white text-gray-500">
                           <option>Service Type *</option>
                           <option>School Trip</option>
                           <option>Corporate</option>
                           <option>Wedding</option>
                           <option>Other</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      
                      <div className="relative">
                         <select name="groupSize" value={formData.groupSize} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none appearance-none bg-white text-gray-500">
                           <option>Group Size *</option>
                           <option>1-14</option>
                           <option>15-36</option>
                           <option>37-56</option>
                           <option>56+</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>

                      <div className="md:col-span-2">
                        <textarea name="details" rows={4} placeholder="Additional Details (Date, Location, Itinerary, etc.)" value={formData.details} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:ring-1 focus:ring-[#003366] outline-none resize-none"></textarea>
                      </div>
                    </div>

                    {submitMessage.text && (
                      <div className={`mb-4 p-3 rounded text-sm ${submitMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                        {submitMessage.text}
                      </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#E31837] hover:bg-red-700 text-white font-bold py-4 rounded transition-colors flex justify-center items-center">
                      {isSubmitting ? 'Sending...' : 'Request a Quote'} <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </form>
                </div>
             </div>
           </div>
        </section>

        {/* Organizations Bar */}
        <section className="py-10 border-b border-gray-100">
           <div className="container mx-auto px-4 max-w-7xl text-center">
              <h3 className="text-xl font-bold text-[#003366] mb-8">Trusted by Organizations & Groups Across Canada</h3>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                 <div className="flex flex-col items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <Building className="w-8 h-8 mb-2 text-[#003366]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Schools</span>
                 </div>
                 <div className="flex flex-col items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <Users className="w-8 h-8 mb-2 text-[#003366]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Corporate Teams</span>
                 </div>
                 <div className="flex flex-col items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <Star className="w-8 h-8 mb-2 text-[#003366]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Weddings</span>
                 </div>
                 <div className="flex flex-col items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <Star className="w-8 h-8 mb-2 text-[#003366]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Sports Teams</span>
                 </div>
                 <div className="flex flex-col items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <MapPin className="w-8 h-8 mb-2 text-[#003366]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Tours & Travel</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl flex flex-col lg:flex-row gap-12">
            
            <div className="lg:w-1/4">
              <p className="text-[#E31837] font-bold text-sm tracking-widest uppercase mb-2">What Our Clients Say</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Real People. Real Experiences.</h2>
              <p className="text-gray-600 mb-8">Our clients trust us for safe, comfortable and on-time transportation. Here's what they have to say.</p>
              
              <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-max">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm font-bold text-xl text-blue-500">G</div>
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                    <span className="text-gray-900 font-bold ml-2 text-sm">4.9/5</span>
                  </div>
                  <p className="text-xs text-gray-500">Based on 200+ reviews</p>
                </div>
              </div>
            </div>

            <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                  <Quote className="w-8 h-8 text-[#E31837]/20 absolute top-6 left-6" />
                  <p className="text-gray-600 italic text-sm relative z-10 pt-6">"We used Tours Coach for our corporate retreat and everything was perfect. The bus was spotless, the driver was professional and on time. Highly recommend!"</p>
                  <p className="text-gray-900 font-bold text-sm mt-4">— Sarah M.<br/><span className="text-gray-500 font-normal">Toronto, ON</span></p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                  <Quote className="w-8 h-8 text-[#E31837]/20 absolute top-6 left-6" />
                  <p className="text-gray-600 italic text-sm relative z-10 pt-6">"Our wedding guests had a wonderful experience. The transportation was smooth, comfortable and well organized. Thank you for making our day stress-free!"</p>
                  <p className="text-gray-900 font-bold text-sm mt-4">— James T.<br/><span className="text-gray-500 font-normal">Mississauga, ON</span></p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                  <Quote className="w-8 h-8 text-[#E31837]/20 absolute top-6 left-6" />
                  <p className="text-gray-600 italic text-sm relative z-10 pt-6">"Excellent service from start to finish. The booking process was easy and the driver was friendly and courteous. We'll definitely use them again!"</p>
                  <p className="text-gray-900 font-bold text-sm mt-4">— Priya S.<br/><span className="text-gray-500 font-normal">Brampton, ON</span></p>
               </div>
            </div>

          </div>
        </section>

        {/* Coverage & Tours */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Coverage Map area */}
            <div>
              <p className="text-[#E31837] font-bold text-sm tracking-widest uppercase mb-2">Nationwide Coverage</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Serving Communities Across Canada</h2>
              <p className="text-gray-600 mb-6">From local trips to coast-to-coast adventures, we proudly serve groups in every province and territory.</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 font-medium"><CheckCircle className="w-5 h-5 text-[#E31837] mr-3" /> Reliable service</li>
                <li className="flex items-center text-gray-700 font-medium"><CheckCircle className="w-5 h-5 text-[#E31837] mr-3" /> Experienced drivers</li>
                <li className="flex items-center text-gray-700 font-medium"><CheckCircle className="w-5 h-5 text-[#E31837] mr-3" /> Flexible scheduling</li>
                <li className="flex items-center text-gray-700 font-medium"><CheckCircle className="w-5 h-5 text-[#E31837] mr-3" /> Competitive rates</li>
              </ul>
            </div>

            {/* Featured Tours */}
            <div>
               <p className="text-[#E31837] font-bold text-sm tracking-widest uppercase mb-2">Featured Tours</p>
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Group Tours</h2>
               <p className="text-gray-600 mb-8">Discover Canada's most beautiful destinations with our comfortable and reliable coach charters.</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="group cursor-pointer">
                   <div className="h-32 rounded-lg overflow-hidden mb-3">
                     <img src="https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?q=80&w=400&auto=format&fit=crop" alt="Niagara" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   <h4 className="font-bold text-gray-900 text-sm flex justify-between items-center group-hover:text-[#E31837] transition-colors">
                     Niagara Falls Day Tours <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                   </h4>
                 </div>
                 <div className="group cursor-pointer">
                   <div className="h-32 rounded-lg overflow-hidden mb-3">
                     <img src="https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=400&auto=format&fit=crop" alt="Rockies" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   <h4 className="font-bold text-gray-900 text-sm flex justify-between items-center group-hover:text-[#E31837] transition-colors">
                     Rocky Mountains Adventure <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                   </h4>
                 </div>
                 <div className="group cursor-pointer">
                   <div className="h-32 rounded-lg overflow-hidden mb-3">
                     <img src="https://images.unsplash.com/photo-1519098901909-b1553a1190af?q=80&w=400&auto=format&fit=crop" alt="Eastern Canada" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   <h4 className="font-bold text-gray-900 text-sm flex justify-between items-center group-hover:text-[#E31837] transition-colors">
                     Eastern Canada Getaways <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                   </h4>
                 </div>
               </div>
            </div>

          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12">
             <div>
               <p className="text-[#E31837] font-bold text-sm tracking-widest uppercase mb-2">Frequently Asked Questions</p>
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Answers</h2>
               <p className="text-gray-600 mb-6">Find answers to the most common questions about our charter services, fleet and booking process.</p>
             </div>
             
             <div className="space-y-4">
                {[
                  "How far in advance should I book?",
                  "Do you provide drivers?",
                  "What is your cancellation policy?",
                  "Are your vehicles wheelchair accessible?"
                ].map((q, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => toggleFaq(i)}
                      className="w-full text-left px-6 py-4 font-bold text-gray-800 flex justify-between items-center hover:bg-gray-50"
                    >
                      {q}
                      {openFaq === i ? <Minus className="w-4 h-4 text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-4 text-gray-600 text-sm">
                        Please contact our sales team at (416) 269-9555 for specific details regarding this question.
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#003366] text-white py-12 relative overflow-hidden">
           <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30">
              <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop" alt="Bus" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003366] to-transparent"></div>
           </div>
           
           <div className="container mx-auto px-4 max-w-7xl relative z-10 flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2">Ready to Move Your Group?</h2>
                <p className="text-blue-100 mb-6 md:mb-0">Let us help you plan the perfect trip. Get a free quote today!</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#quote" className="bg-[#E31837] hover:bg-red-700 text-white px-8 py-3 rounded font-bold flex items-center justify-center transition-colors">
                  Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <a href="tel:4162699555" className="bg-transparent text-white px-8 py-3 rounded font-bold flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Phone className="w-4 h-4 mr-2" /> (416) 269-9555
                </a>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b1320] text-gray-400 pt-16 pb-8 border-t border-blue-900/30 text-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand */}
            <div>
              <a href="#" className="flex items-center mb-6">
                <div className="bg-white px-3 py-2 rounded">
                  {/* Note: In a real environment, you'd use the actual logo file here or a white variant */}
                  <span className="text-[#003366] font-extrabold text-xl leading-none">TOURS COACH<br/><span className="text-[#E31837] text-sm tracking-widest uppercase">CHARTER</span></span>
                </div>
              </a>
              <p className="mb-6 leading-relaxed">Safe. Reliable. Together.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-base">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Charter Services</a></li>
                <li><a href="#fleet" className="hover:text-white transition-colors">Fleet</a></li>
                <li><a href="#tours" className="hover:text-white transition-colors">Tours</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Locations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Contact */}
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

            {/* Social */}
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
