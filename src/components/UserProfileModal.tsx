import React from 'react';
import { X, User, Smartphone, Mail, MapPin, BadgeCheck, ShieldCheck, LogOut, PackageCheck, Clock, ExternalLink, ArrowLeft } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    phone: string;
    role: string;
    email?: string;
    pincode?: string;
  } | null;
  onSignOut: () => void;
  onOpenTrackOrders: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSignOut,
  onOpenTrackOrders
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header Profile Banner */}
        <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#0052FF]/20 rounded-full blur-2xl"></div>
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 font-heading"
              title="Logout from Account"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 relative z-10 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-[#0052FF] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 border-2 border-blue-400/40">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{user.name}</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-emerald-400" />
                  Verified Profile
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Role: <strong className="text-blue-400 uppercase">{user.role}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
              Registered Contact Details
            </h4>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Smartphone className="w-4 h-4 text-[#0052FF]" />
                  Mobile Number:
                </span>
                <strong className="font-mono text-slate-900">{user.phone}</strong>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Mail className="w-4 h-4 text-blue-500" />
                  Email Address:
                </span>
                <strong className="font-mono text-slate-900">{user.email || 'Not provided'}</strong>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Service Hub / Pincode:
                </span>
                <strong className="font-mono text-slate-900">{user.pincode || 'Khekra 250101'}</strong>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl text-[#0052FF]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">3-Month Guarantee Active</h5>
                <p className="text-[11px] text-slate-600">All buyback quotes & refurbished phones include warranty.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenTrackOrders();
              }}
              className="w-full bg-[#0052FF] hover:bg-[#0043CC] text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all font-heading"
            >
              <PackageCheck className="w-4 h-4" />
              View Orders &amp; Doorstep Trackers
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-300 cursor-pointer transition-all font-heading"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              Close Profile &amp; Return to Dashboard
            </button>

            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-rose-200 cursor-pointer transition-all font-heading"
            >
              <LogOut className="w-4 h-4" />
              Sign Out from Account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
