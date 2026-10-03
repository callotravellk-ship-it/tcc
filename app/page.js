"use client";

import React, { useState } from 'react';
import { Mail, Phone, Shield, Clock, Award, MapPin, Bus, Car, Users, Building, ArrowRight, Menu, X, CheckCircle, Navigation } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Initialize Firebase using the environment variables you just saved in Vercel
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', tripType: 'One Way', passengers: '', date: '', pickupCity: '', details: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'quotes'), {
        ...formData,
        submittedAt: new Date().toISOString()
      });
      
      alert("Quote request submitted successfully! We will contact you shortly.");
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', tripType: 'One Way', passengers: '', date: '', pickupCity: '', details: ''
      });
    } catch (error) {
      console.error("Error submitting quote: ", error);
      alert("There was an error submitting your request. Make sure your environment variables are set correctly in Vercel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Charter Services', href: '#services' },
    { name: 'Fleet', href: '#fleet' },
    { name: 'Tours', href: '#tours' },
    { name: 'Locations', href: '#locations' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="font-sans text-gray-800 bg-white flex flex-col min-h-screen">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-7xl">
          
          <a href="#" className="flex items-center space-x-2 group">
            <div className="bg-blue-900 text-white p-2 rounded group-hover:bg-blue-800 transition-colors">
              <Bus className="w-6 h-6" />
            </div>
            <div className="leading-tight">
              <span className="block text-xl font-bold text-blue-950">TOURS COACH</span>
              <span className="block text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">CHARTER</span>
            </div>
          </a>

          <nav className="hidden lg:flex space-x-6 items-center text-sm font-medium">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`${link.name === 'Home' ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-gray-600 hover:text-red-600'} transition-colors`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <a href="tel:4162699555" className="flex items-center text-gray-800 font-bold hover:text-red-600 transition-colors">
              <Phone className="w-4 h-4 mr-2" /> (416) 269-9555
            </a>
            <a href="#quote" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-sm">
              Get a Free Quote
            </a>
          </div>

          <button 
            className="lg:hidden text-gray-600 focus:outline-none p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t absolute w-full left-0 shadow-lg">
            <div className="px-4 py-3 space-y-3 flex flex-col font-medium max-w-7xl mx-auto">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className={`block py-2 ${link.name === 'Home' ? 'text-red-600' : 'text-gray-600'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a href="tel:4162699555" className="block py-2 text-gray-800 font-bold">
                <Phone className="w-4 h-4 inline mr-2" /> (416) 269-9555
              </a>
              <a href="#quote" className="block text-center bg-red-600 text-white px-4 py-3 rounded-md w-full mt-2 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                Get a Free Quote
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col">
        <section className="relative text-white py-24 md:py-32 lg:py-40 overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40"></div>

          <div className="container mx-auto px-4 relative z-10 flex flex-col max-w-7xl">
            <div className="lg:w-2/3 lg:pr-12">
              <p className="text-sm font-bold tracking-widest uppercase mb-4 text-gray-300">CANADA'S PREMIER CHARTER BUS SERVICE</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Trusted Coach Charters for Group Travel in Canada.
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl font-light">
                Comfortable. Safe. Reliable. Whether it's a school trip, corporate event, wedding or a cross-Canada adventure, we get your group there together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#quote" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-full transition-all text-center flex items-center justify-center">
                  Get a Free Quote <ArrowRight className="w-4 h-4 ml-2" />
                </a>
                <a href="tel:4162699555" className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold px-8 py-3.5 rounded-full transition-all text-center flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" /> Call (416) 269-9555
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-10 border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
              <div className="px-4">
                <div className="flex justify-center items-center text-gray-800 mb-2">
                  <Clock className="w-6 h-6 mr-2 text-gray-400" />
                  <span className="text-3xl font-bold text-gray-900">15+</span>
                </div>
                <p className="text-sm font-medium text-gray-500">Years of Experience</p>
              </div>
              <div className="px-4">
                <div className="flex justify-center items-center text-gray-800 mb-2">
                  <Users className="w-6 h-6 mr-2 text-gray-400" />
                  <span className="text-3xl font-bold text-gray-900">5,000+</span>
                </div>
                <p className="text-sm font-medium text-gray-500">Successful Trips</p>
              </div>
              <div className="px-4">
                <div className="flex justify-center items-center text-gray-800 mb-2">
                  <Shield className="w-6 h-6 mr-2 text-gray-400" />
                  <span className="text-3xl font-bold text-gray-900">100%</span>
                </div>
                <p className="text-sm font-medium text-gray-500">Fully Insured</p>
              </div>
              <div className="px-4">
                <div className="flex justify-center items-center text-gray-800 mb-2">
                  <Award className="w-6 h-6 mr-2 text-gray-400" />
                  <span className="text-3xl font-bold text-gray-900">4.9/5</span>
                </div>
                <p className="text-sm font-medium text-gray-500">Customer Rating<br/><span className="text-xs font-normal">(Nationwide)</span></p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-red-600 font-bold text-xs tracking-widest uppercase mb-2">OUR CHARTER SERVICES</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Transportation for Every Occasion</h2>
              <p className="text-gray-600 text-lg">From school trips to corporate events, we provide reliable and comfortable transportation solutions for groups of all sizes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 text-center">
              {[
                { title: 'School Bus\nRental', img: 'https://images.unsplash.com/photo-1559523161-0fc0d6b38652?q=80&w=400&auto=format&fit=crop', icon: <Bus className="w-5 h-5"/>, desc: 'Safe & reliable transport for students and school groups.' },
                { title: 'Wedding &\nEngagements', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop', icon: <Award className="w-5 h-5"/>, desc: 'Make your special day stress-free and memorable.' },
                { title: 'Corporate\nTravel', img: 'https://images.unsplash.com/photo-1557223562-6c77ef161f59?q=80&w=400&auto=format&fit=crop', icon: <Building className="w-5 h-5"/>, desc: 'Professional transport for your business needs.' },
                { title: 'Sports\nGroups', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=400&auto=format&fit=crop', icon: <Award className="w-5 h-5"/>, desc: 'Get your team to the game together and on time.' },
                { title: 'Tours &\nExcursions', img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=400&auto=format&fit=crop', icon: <MapPin className="w-5 h-5"/>, desc: 'Explore Canada\'s best destinations in comfort.' },
                { title: 'Private\nTravel', img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=400&auto=format&fit=crop', icon: <Users className="w-5 h-5"/>, desc: 'Custom trips for families, friends and special groups.' }
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center">
                  <div className="h-32 w-full relative mb-6">
                    <img src={s.img} alt={s.title.replace('\n',' ')} className="w-full h-full object-cover" />
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-blue-900 text-white p-2.5 rounded-full border-4 border-white">
                      {s.icon}
                    </div>
                  </div>
                  <div className="px-4 pb-6 flex-grow flex flex-col justify-between">
                    <h3 className="font-bold text-gray-900 mb-2 whitespace-pre-line">{s.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="fleet" className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-7xl flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3 text-center lg:text-left">
              <p className="text-red-600 font-bold text-xs tracking-widest uppercase mb-2">OUR FLEET</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Modern. Comfortable. Reliable.</h2>
              <p className="text-gray-600 mb-8">
                Our diverse fleet is equipped with modern amenities, professional drivers and is maintained to the highest safety standards.
              </p>
              <a href="#quote" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold inline-flex items-center transition-colors">
                View All Vehicles <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>

            <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: '56-Passenger\nLuxury Coach', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop', cap: 'Up to 56 passengers' },
                { title: '24-36 Passenger\nMini Coach', img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=400&auto=format&fit=crop', cap: 'Up to 36 passengers' },
                { title: '14-Passenger\nVan', img: 'https://images.unsplash.com/photo-1517520032906-81dbd9ebda3b?q=80&w=400&auto=format&fit=crop', cap: 'Up to 14 passengers' },
                { title: 'School Bus\n', img: 'https://images.unsplash.com/photo-1559523161-0fc0d6b38652?q=80&w=400&auto=format&fit=crop', cap: 'Up to 72 passengers' }
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm text-center flex flex-col">
                  <div className="h-28 bg-gray-100 overflow-hidden">
                    <img src={f.img} alt={f.title.replace('\n', ' ')} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-center">
                    <h4 className="font-bold text-gray-900 text-sm mb-1 whitespace-pre-line">{f.title}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{f.cap}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="quote" className="py-20 relative bg-blue-950 overflow-hidden">
          <div 
            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 z-0 bg-blue-950/80"></div>
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10 flex flex-col md:flex-row gap-12 items-center">
            
            <div className="md:w-5/12 text-white text-center md:text-left">
              <p className="text-red-500 font-bold text-xs tracking-widest uppercase mb-2">GET A QUOTE</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Tell Us About Your Trip</h2>
              <p className="text-blue-200 text-lg">
                Fill out the form below for a customized quote. We'll get back to you quickly with the best options for your group.
              </p>
            </div>

            <div className="md:w-7/12 w-full">
              <div className="bg-white p-8 rounded-xl shadow-2xl">
                <form onSubmit={handleQuoteSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Service Type <span className="text-red-500">*</span></label>
                      <select name="tripType" value={formData.tripType} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                        <option>Select</option>
                        <option>School Trip</option>
                        <option>Corporate</option>
                        <option>Wedding</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Group Size <span className="text-red-500">*</span></label>
                      <select name="passengers" value={formData.passengers} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                        <option>Select</option>
                        <option>1-14</option>
                        <option>15-36</option>
                        <option>37-56</option>
                        <option>56+</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <input type="text" name="details" value={formData.details} onChange={handleInputChange} placeholder="Additional Details (Date, Location, Itinerary, etc.)" className="w-full border border-gray-300 rounded px-4 py-3 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded transition-colors flex justify-center items-center disabled:opacity-70">
                    {isSubmitting ? "Sending..." : "Request a Quote"} {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-b border-gray-100 bg-white">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <h3 className="text-xl font-bold text-blue-950 mb-8">Trusted by Organizations & Groups Across Canada</h3>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
              {[
                { icon: <Building className="w-8 h-8"/>, text: 'SCHOOLS' },
                { icon: <Users className="w-8 h-8"/>, text: 'CORPORATE TEAMS' },
                { icon: <Award className="w-8 h-8"/>, text: 'WEDDINGS' },
                { icon: <Award className="w-8 h-8"/>, text: 'SPORTS TEAMS' },
                { icon: <MapPin className="w-8 h-8"/>, text: 'TOURS & TRAVEL' },
                { icon: <Users className="w-8 h-8"/>, text: 'COMMUNITY GROUPS' }
              ].map((org, i) => (
                <div key={i} className="flex flex-col items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all text-blue-900 cursor-default">
                  <div className="mb-2">{org.icon}</div>
                  <span className="text-[10px] font-bold tracking-widest">{org.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 border-t border-gray-800 text-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <a href="#" className="flex items-center space-x-2 mb-6 text-white">
                <div className="bg-white p-2 rounded">
                  <Bus className="w-6 h-6 text-gray-900" />
                </div>
                <div className="leading-tight">
                  <span className="block text-lg font-bold">TOURS COACH</span>
                  <span className="block text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">CHARTER</span>
                </div>
              </a>
              <p className="text-xs mb-6">Safe. Reliable. Together.</p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Charter Services</a></li>
                <li><a href="#fleet" className="hover:text-white transition-colors">Fleet</a></li>
                <li><a href="#tours" className="hover:text-white transition-colors">Tours</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Locations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-3" />
                  <a href="tel:4162699555" className="hover:text-white transition-colors">(416) 269-9555</a>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-3" />
                  <a href="mailto:info@tourscoachcharter.com" className="hover:text-white transition-colors break-all">info@tourscoachcharter.com</a>
                </li>
                <li className="flex items-start">
                  <MapPin className="mt-1 w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Pickering, Ontario, Canada</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-sm">Follow Us</h4>
              <div className="flex space-x-3">
                {/* SVG Replacements for Social Icons to prevent lucide-react build errors */}
                <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
                </a>
                <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
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