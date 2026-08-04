import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Clock, CheckCircle2, ChevronRight, Send } from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order & Trade-in Query');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);

    // Trigger mailto link to deliver contact info directly to Scorpiontraders007@gmail.com
    const emailSubject = encodeURIComponent(`[Recell Inquiry] ${subject} - ${name}`);
    const emailBody = encodeURIComponent(
      `Support Inquiry Details:\n` +
      `-------------------------------------\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || 'N/A'}\n` +
      `Subject: ${subject}\n\n` +
      `Message:\n${message}\n\n` +
      `Sent from Recell Web Contact Form`
    );

    const mailtoUrl = `mailto:Scorpiontraders007@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10 text-slate-900">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-indigo-100 uppercase tracking-wider inline-block">
          Support Desk &amp; Locations
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">We are Here to Help</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Have a question about your doorstep payout, device repair, or tracking an order? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <Mail className="w-4 h-4 text-[#0052FF]" />
              <span>Primary Email Support</span>
            </div>
            <a
              href="mailto:Scorpiontraders007@gmail.com"
              className="text-xs font-mono font-bold text-[#0052FF] hover:underline block break-all"
            >
              Scorpiontraders007@gmail.com
            </a>
            <p className="text-[11px] text-slate-500">Inquiries delivered directly to management</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <Phone className="w-4 h-4 text-[#0052FF]" />
              <span>Customer Care Helpline</span>
            </div>
            <a href="tel:9310552055" className="text-base font-mono font-black text-[#0052FF] hover:underline block">
              +91 9310552055
            </a>
            <p className="text-[11px] text-slate-500 font-medium">Toll-Free Customer Care &bull; Mon - Sat: 9:00 AM - 8:00 PM</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Instant WhatsApp &amp; Support</span>
            </div>
            <p className="text-xs font-bold text-slate-800 font-mono">+91 9310552055 / +91 9557342655</p>
            <a
              href="https://wa.me/919310552055?text=Hello%20Recell%20Store%2C%20I%20have%20an%20inquiry"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-600 font-bold underline block"
            >
              Open WhatsApp Chat &rarr;
            </a>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Physical Store Address</span>
            </div>
            <p className="text-xs text-slate-900 leading-relaxed font-black font-heading">
              Recell store, Pathsala road, Khekra, Baghpat, U.P., 250101
            </p>
          </div>
        </div>

        {/* Query Form */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">Send Us a Direct Message</h2>
            <p className="text-xs text-slate-500">Submitting this form delivers your message directly to <strong>Scorpiontraders007@gmail.com</strong></p>
          </div>

          {sent ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900 font-heading">Message Delivered!</h3>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                Your message has been formatted and dispatched to <strong>Scorpiontraders007@gmail.com</strong>.
              </p>
              <p className="text-[11px] text-emerald-700">
                Our support team will respond to <strong>{email}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-2 text-xs font-bold text-emerald-700 underline cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-[#0052FF] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-[#0052FF] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9557342655"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-[#0052FF] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subject *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-slate-900 focus:ring-2 focus:ring-[#0052FF] outline-none"
                  >
                    <option value="Order & Trade-in Query">Order &amp; Trade-in Query</option>
                    <option value="Doorstep Mobile Repair">Doorstep Mobile Repair</option>
                    <option value="7-Day Return Request">7-Day Return Request</option>
                    <option value="Bulk B2B Device Supply">Bulk B2B Device Supply</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Message Details *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Include your query or order ID details here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-[#0052FF] outline-none"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-900 font-medium flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0052FF] shrink-0" />
                <span>Message will be transmitted directly to <strong>Scorpiontraders007@gmail.com</strong></span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0052FF] hover:bg-blue-700 text-white font-bold py-3.5 rounded-full text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer font-heading"
              >
                Send Message
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
