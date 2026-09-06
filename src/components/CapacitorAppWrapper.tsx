import React, { useState } from 'react';
import { Smartphone, Battery, Wifi, Signal, ArrowLeft, RotateCw } from 'lucide-react';

interface CapacitorAppWrapperProps {
  children: React.ReactNode;
  onExit: () => void;
}

export const CapacitorAppWrapper: React.FC<CapacitorAppWrapperProps> = ({ children, onExit }) => {
  const [devicePlatform, setDevicePlatform] = useState<'android' | 'ios'>('android');

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 py-8">
      {/* Top Mobile Shell Control Toolbar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl px-6 py-3 mb-6 flex items-center justify-between gap-4 text-white text-xs max-w-xl w-full shadow-xl">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Capacitor Native App Shell Simulation</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDevicePlatform('android')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              devicePlatform === 'android' ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-400'
            }`}
          >
            Android APK
          </button>
          <button
            onClick={() => setDevicePlatform('ios')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              devicePlatform === 'ios' ? 'bg-orange-600 text-white' : 'bg-stone-800 text-stone-400'
            }`}
          >
            iOS App
          </button>
          <button
            onClick={onExit}
            className="ml-2 text-stone-400 hover:text-white underline font-semibold"
          >
            Exit Mobile Frame
          </button>
        </div>
      </div>

      {/* Simulated Device Frame Container */}
      <div className={`relative bg-stone-950 rounded-[48px] border-[12px] border-stone-800 shadow-2xl overflow-hidden transition-all duration-300 ${
        devicePlatform === 'ios' ? 'w-[410px] h-[840px] rounded-[52px]' : 'w-[400px] h-[820px] rounded-[42px]'
      }`}>
        {/* iOS Notch or Android Hole Punch Camera */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          {devicePlatform === 'ios' ? (
            <div className="w-32 h-6 bg-stone-950 rounded-b-2xl flex items-center justify-center">
              <div className="w-12 h-3 bg-stone-900 rounded-full" />
            </div>
          ) : (
            <div className="w-4 h-4 bg-stone-950 rounded-full mt-2" />
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-stone-900 text-white px-6 pt-2 pb-1 flex items-center justify-between text-[11px] font-mono z-40 relative border-b border-stone-800/80">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-stone-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Scrollable Web App Frame Content */}
        <div className="h-[calc(100%-60px)] overflow-y-auto bg-stone-950 text-white no-scrollbar">
          {children}
        </div>

        {/* Bottom Navigation Gesture Bar for iOS / Android */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-600 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
