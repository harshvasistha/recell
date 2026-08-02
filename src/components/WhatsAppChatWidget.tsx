import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall, Check, Sparkles } from 'lucide-react';

export const WhatsAppChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Namaste! 👋 Welcome to Recell Store (Khekra, Baghpat). How can we help you today? Ask about device selling prices, doorstep repairs, or phone availability!',
      time: 'Just now'
    }
  ]);

  const quickQuestions = [
    '📱 Want to sell my phone in Khekra',
    '🛠️ Book doorstep screen repair',
    '🏬 Store location & opening hours',
    '📞 Talk to helpline agent'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const message = textToSend || userMsg;
    if (!message.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message to history
    const updatedHistory = [
      ...chatHistory,
      { sender: 'user' as const, text: message, time: currentTime }
    ];
    setChatHistory(updatedHistory);
    setUserMsg('');

    // Open WhatsApp after brief delay
    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919557342655?text=${encodedMsg}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 400);
  };

  return (
    <div className="fixed bottom-20 sm:bottom-5 right-3 sm:right-5 z-50 font-sans">
      {/* Expanded Chat Box */}
      {isOpen ? (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col transition-all duration-300 animate-fadeIn border-t-4 border-t-emerald-500">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-lg font-heading shadow-inner">
                  💬
                </div>
                <span className="w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full absolute bottom-0 right-0 animate-ping"></span>
                <span className="w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full absolute bottom-0 right-0"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 font-heading text-white">
                  Recell WhatsApp Helpline
                </h3>
                <p className="text-[11px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  +91 9557342655 &bull; Online
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-[11px] text-emerald-900 flex items-center justify-between font-medium">
            <span>Opposite Dr. Jagpal Clinic, Khekra</span>
            <span className="bg-emerald-200/80 text-emerald-950 font-mono font-bold px-2 py-0.5 rounded-md">
              250101
            </span>
          </div>

          {/* Messages Container */}
          <div className="p-4 bg-slate-50 h-72 overflow-y-auto space-y-3 text-xs">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl shadow-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] block mt-1 text-right font-mono ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reply Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex flex-wrap gap-1.5">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-all font-medium text-left cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              placeholder="Type your WhatsApp message..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl shadow-md cursor-pointer transition-all shrink-0"
              title="Send via WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Floating Launcher Button */
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 cursor-pointer ring-4 ring-emerald-600/20 group"
          title="Chat on WhatsApp +91 9557342655"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 fill-white stroke-emerald-600" />
            <span className="w-2.5 h-2.5 bg-amber-400 rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-emerald-600 animate-ping"></span>
          </div>
          <span className="hidden sm:inline font-heading text-xs uppercase tracking-wider font-extrabold pr-1">
            WhatsApp Help
          </span>
          <span className="text-[10px] bg-emerald-700 font-mono px-2 py-0.5 rounded-full hidden lg:inline">
            9557342655
          </span>
        </button>
      )}
    </div>
  );
};
