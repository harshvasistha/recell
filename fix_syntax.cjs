const fs = require('fs');
let code = fs.readFileSync('src/components/UserProfileModal.tsx', 'utf8');

// The error was caused by a missing JSX wrapping tag or similar when we injected the button. 
// Let's check around line 150.
code = code.replace(
  "Close Profile &amp; Return to Dashboard",
  "Close Profile &amp; Return to Dashboard"
);

// Wait, the error is: Expected ";" but found "Profile". 
// Ah, the previous sed/replace replaced the button onClick handler but might have messed up the JSX tag structure.
// Let's restore the original button structure and add the admin button properly.

const fullRestore = `
          {/* Actions */}
          <div className="space-y-2.5 pt-2">
            {user.role === 'admin' && (
              <button
                onClick={() => {
                  onClose();
                  window.location.hash = ''; 
                }}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all font-heading"
              >
                <ShieldCheck className="w-4 h-4" />
                Open Admin Dashboard
              </button>
            )}
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
              Close Profile
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
`;

// we need to slice off the end of the file from {/* Actions */} onwards and replace it with fullRestore
const splitIdx = code.indexOf('{/* Actions */}');
if(splitIdx !== -1) {
    code = code.substring(0, splitIdx) + fullRestore;
}

fs.writeFileSync('src/components/UserProfileModal.tsx', code);
console.log('Fixed syntax');
