import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order & Trade-in Query');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10 text-slate-900">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-indigo-100 uppercase tracking-wider inline-block">
          Support Desk &amp; Locations
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">We are Here to Help</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Have a question about your doorstep payout, tracking an order, or claiming your 3-Month Warranty? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <Phone className="w-4 h-4" />
              <span>Customer Helpline</span>
            </div>
            <p className="text-sm font-mono font-bold text-slate-900">+91 (121) 250-1010</p>
            <p className="text-xs text-slate-500">Mon - Sat: 9:00 AM - 8:00 PM IST</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>Instant WhatsApp Support</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Chat with Recell Agent</p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-600 font-bold underline block"
            >
              Open WhatsApp Chat &rarr;
            </a>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <MapPin className="w-4 h-4" />
              <span>Registered Central Hub</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              RE-PHONE ReCommerce Hub, Shop 14-16, Civil Lines, Railway Station Road, Meerut, UP - 250101
            </p>
          </div>
        </div>

        {/* Query Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Send Us a Direct Message</h2>

          {sent ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
              <p className="text-xs text-emerald-700">
                Our customer support executive will respond to <strong>{email}</strong> within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Karan Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="karan@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900"
                >
                  <option value="Order & Trade-in Query">Order &amp; Trade-in Query</option>
                  <option value="Warranty Claim Assistance">3-Month Warranty Claim</option>
                  <option value="7-Day Return Request">7-Day Return Request</option>
                  <option value="Bulk B2B Device Supply">Bulk B2B Device Supply</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Message Details</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Include order ID or trade-in reference if applicable..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                Submit Support Request
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
