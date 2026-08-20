import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { parseRouteFromLocation, syncUrlWithRoute } from './utils/routing';
import {
  SEED_DEVICE_MODELS,
  DEFAULT_PRICING_RULES,
  SEED_CATALOG,
  SEED_BUY_REQUESTS,
  SEED_ORDERS,
  SEED_REPAIR_JOBS,
  SEED_RETURN_REQUESTS,
  SEED_WARRANTY_CLAIMS
} from './data/initialData';
import {
  CatalogProduct,
  BuyQuoteRequest,
  Order,
  RepairJob,
  PricingRules,
  ReturnRequest,
  WarrantyClaim
} from './types';
import { Header, TabType } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SellPhoneWizard } from './components/SellPhoneWizard';
import { Storefront } from './components/Storefront';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AgentFieldView } from './components/AgentFieldView';
import { AdminDashboard } from './components/AdminDashboard';
import { TrackOrderAndWarranty } from './components/TrackOrderAndWarranty';
import { CapacitorAppWrapper } from './components/CapacitorAppWrapper';
import { AboutUs } from './components/Pages/AboutUs';
import { HowItWorks } from './components/Pages/HowItWorks';
import { DoorstepRepair } from './components/Pages/DoorstepRepair';
import { EWasteRecycle } from './components/Pages/EWasteRecycle';
import { ContactUs } from './components/Pages/ContactUs';
import { OpenBoxMobiles } from './components/Pages/OpenBoxMobiles';
import { ProductDetailsPage } from './components/Pages/ProductDetailsPage';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { saveOrderToDB, saveSellRequestToDB, fetchCatalogFromDB, saveCatalogToDB, resolveUserProfile } from './lib/dbService';
import { isEmailSignInLink, completeEmailSignIn, getPendingEmailAuth, clearPendingEmailAuth } from './lib/emailLinkAuth';
import { MegaMenu } from './components/MegaMenu';
import { LegalModal } from './components/Legal/LegalModal';
import { WhatsAppChatWidget } from './components/WhatsAppChatWidget';
import { MobileBottomNav } from './components/MobileBottomNav';
import { RecellLogo } from './components/RecellLogo';
import { MAJOR_MOBILE_BRANDS } from './data/brandsData';
import { ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, MapPin, Smartphone, Wrench, Leaf, PhoneCall } from 'lucide-react';

export default function App() {
  const initialRoute = parseRouteFromLocation();
  const [currentTab, setCurrentTab] = useState<TabType>(initialRoute.tab);
  const [isAppFrame, setIsAppFrame] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialRoute.searchQuery || '');
  const [currentProductId, setCurrentProductId] = useState<string | undefined>(initialRoute.productId);

  // User & Auth State
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [user, setUser] = useState<{ name: string; phone: string; role: string; email?: string; pincode?: string } | null>(() => {
    const stored = localStorage.getItem('recellUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('recellUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('recellUser');
    }
  }, [user]);

  // Completes the email-link (passwordless) sign-in flow: clicking the link
  // Firebase emailed reloads the app at the home URL with Firebase's own
  // sign-in params attached. This runs once on mount, finishes the login the
  // same way AuthModal's phone-OTP flow does, then strips those params back
  // to a clean home URL - which is also the "redirect to home after
  // verifying" behavior for this path.
  const [emailAuthError, setEmailAuthError] = useState('');
  useEffect(() => {
    if (!isEmailSignInLink(window.location.href)) return;

    (async () => {
      let pending = getPendingEmailAuth();
      let emailToUse = pending?.email;

      if (!emailToUse) {
        // Link was opened on a different browser/device than it was
        // requested from, so there's no local record of which email this
        // is for - Firebase's own recommended fallback is to just ask.
        emailToUse = window.prompt('Please confirm the email address you signed up with to finish signing in:') || undefined;
      }
      if (!emailToUse) {
        setEmailAuthError('Sign-in link could not be completed - no email address was provided.');
        return;
      }

      try {
        await completeEmailSignIn(emailToUse, window.location.href);
        const displayName = pending?.fullName?.trim() || emailToUse.split('@')[0];
        const profile = await resolveUserProfile(emailToUse, pending?.isNewSignup ?? false, {
          uid: emailToUse,
          name: displayName,
          phone: '',
          email: emailToUse,
          pincode: pending?.pincode?.trim() || '250101'
        });
        setUser({
          name: profile.name,
          phone: profile.phone,
          role: profile.role,
          email: profile.email,
          pincode: profile.pincode
        });
        clearPendingEmailAuth();
      } catch (err: any) {
        setEmailAuthError(
          err?.code === 'auth/invalid-action-code' || err?.code === 'auth/expired-action-code'
            ? 'This sign-in link has expired or was already used. Please request a new one.'
            : (err?.message || 'Could not complete email sign-in. Please try again.')
        );
      } finally {
        // Strip Firebase's oobCode/apiKey/mode query params regardless of
        // outcome, so a reload doesn't try to replay the same (now spent)
        // link again.
        window.history.replaceState(null, '', '/');
      }
    })();
    // Deliberately runs once on mount only - this is a one-time landing
    // action for whatever URL the page happened to load with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modals
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(!!initialRoute.legalTab);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'warranty' | 'returns'>(initialRoute.legalTab || 'privacy');

  // Sync window URL when tab, searchQuery, or legalTab changes
  
  useEffect(() => {
    const handleAdminNav = () => setCurrentTab('admin');
    const handleHomeNav = () => setCurrentTab('landing');
    document.addEventListener('NAVIGATE_ADMIN', handleAdminNav);
    document.addEventListener('NAVIGATE_HOME', handleHomeNav);
    return () => {
      document.removeEventListener('NAVIGATE_ADMIN', handleAdminNav);
      document.removeEventListener('NAVIGATE_HOME', handleHomeNav);
    };
  }, []);

  useEffect(() => {
    syncUrlWithRoute(currentTab, searchQuery, isLegalOpen ? legalTab : undefined, currentProductId);
    window.scrollTo(0, 0);
  }, [currentTab, searchQuery, isLegalOpen, legalTab, currentProductId]);

  // Listen to hash and popstate changes (e.g. browser Back/Forward or new tab navigation)
  useEffect(() => {
    const handleRouteChanged = () => {
      const route = parseRouteFromLocation();
      setCurrentTab(route.tab);
      if (route.searchQuery !== undefined) {
        setSearchQuery(route.searchQuery);
      }
      if (route.productId !== undefined) {
        setCurrentProductId(route.productId);
      } else {
        setCurrentProductId(undefined);
      }
      if (route.legalTab) {
        setLegalTab(route.legalTab);
        setIsLegalOpen(true);
      }
    };

    window.addEventListener('hashchange', handleRouteChanged);
    window.addEventListener('popstate', handleRouteChanged);
    return () => {
      window.removeEventListener('hashchange', handleRouteChanged);
      window.removeEventListener('popstate', handleRouteChanged);
    };
  }, []);

  // App Master Data State
  const [catalog, setCatalog] = useState<CatalogProduct[]>(SEED_CATALOG);
  // Guards against the persistence effect below firing (and stomping real
  // Firestore data) before the initial load below has actually resolved.
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  useEffect(() => {
    // Firestore is the source of truth. Admin catalog edits must survive a
    // page reload, so seed/localStorage data is ONLY ever used - and ONLY
    // ever persisted back to Firestore - when the catalog doc genuinely
    // doesn't exist yet (a brand-new deployment). A fetch ERROR (network
    // blip, transient auth/rules hiccup) must NEVER flip catalogLoaded to
    // true, because that would arm the persistence effect below and it
    // would immediately overwrite the real Firestore catalog with stale
    // local data - this previously caused real admin-imported products to
    // be silently wiped. On error we show cached localStorage data
    // read-only (persistence stays disarmed) and keep retrying the fetch
    // until it actually succeeds.
    let cancelled = false;
    const attemptLoad = () => {
      fetchCatalogFromDB().then(result => {
        if (cancelled) return;
        if (result.status === 'ok') {
          setCatalog(result.products);
          setCatalogLoaded(true);
        } else if (result.status === 'not-found') {
          setCatalog(SEED_CATALOG);
          setCatalogLoaded(true);
        } else {
          // 'error': show cached data if we have it, but do NOT arm
          // persistence, and retry shortly instead of giving up.
          const stored = localStorage.getItem('recellCatalog');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setCatalog(Array.isArray(parsed) ? parsed : SEED_CATALOG);
            } catch {
              // keep whatever is currently rendered
            }
          }
          setTimeout(attemptLoad, 8000);
        }
      });
    };
    attemptLoad();
    return () => { cancelled = true; };
  }, []);

  // Surfaces a visible warning when a catalog save is rejected (e.g. the
  // admin's Firestore write permission failing) instead of failing
  // completely silently - this used to mean products the admin "published"
  // only ever existed in local browser state and vanished on next reload,
  // with zero indication anything had gone wrong.
  const [catalogSaveError, setCatalogSaveError] = useState(false);

  useEffect(() => {
    if (!catalogLoaded) return;
    localStorage.setItem('recellCatalog', JSON.stringify(catalog));
    saveCatalogToDB(catalog).then(success => setCatalogSaveError(!success));
  }, [catalog, catalogLoaded]);

  const [buyRequests, setBuyRequests] = useState<BuyQuoteRequest[]>(SEED_BUY_REQUESTS);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [repairJobs, setRepairJobs] = useState<RepairJob[]>(SEED_REPAIR_JOBS);
  const [pricingRules, setPricingRules] = useState<PricingRules>(DEFAULT_PRICING_RULES);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(SEED_RETURN_REQUESTS);
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>(SEED_WARRANTY_CLAIMS);

  // Cart State
  const [cart, setCart] = useState<CatalogProduct[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [checkoutItems, setCheckoutItems] = useState<CatalogProduct[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Open Legal Policy Helper
  const openLegalModal = (tab: 'privacy' | 'terms' | 'warranty' | 'returns' = 'privacy') => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  // Select Brand from MegaMenu or Landing Page
  const handleSelectProduct = (product: CatalogProduct) => {
    setCurrentTab('product');
    setCurrentProductId(product.id);
  };

  const handleSelectBrand = (brandName: string) => {
    setSearchQuery(brandName);
    setCurrentTab('buy');
  };

  // Cart operations
  const handleAddToCart = (product: CatalogProduct) => {
    if (!cart.some(item => item.id === product.id)) {
      setCart([...cart, product]);
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleQuickBuy = (product: CatalogProduct) => {
    // Checkout writes an order document, which Firestore rules only allow
    // for a signed-in user (see firestore.rules: orders/create requires
    // isSignedIn()). Prompt login first instead of letting the customer
    // hit a silent "could not create your order" failure at payment time.
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setCheckoutItems([product]);
    setIsCheckoutOpen(true);
  };

  const handleCartCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      return;
    }
    setCheckoutItems(cart);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Handlers for data updates
  const handleNewBuyRequest = (req: BuyQuoteRequest) => {
    setBuyRequests([req, ...buyRequests]);
    saveSellRequestToDB(req);
  };

  const handleUpdateBuyRequest = (updatedReq: BuyQuoteRequest, sendToRepair: boolean) => {
    setBuyRequests(buyRequests.map(r => r.id === updatedReq.id ? updatedReq : r));

    if (sendToRepair) {
      const newJob: RepairJob = {
        id: `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        source: 'Buy Request',
        referenceId: updatedReq.id,
        deviceName: updatedReq.modelName,
        serialImei: `35${Math.floor(1000000000000 + Math.random() * 900000000000)}`,
        defectSummary: updatedReq.agentNotes || 'Physical inspection refurbishment required',
        technician: 'Ramesh Tech (L2 Specialist)',
        status: 'Booked',
        estimatedCost: 1500,
        sparePartsUsed: ['General Cleaning & Refurbishment Module'],
        createdDate: new Date().toISOString().split('T')[0],
        qcChecklist: {
          displayOk: true,
          touchOk: true,
          batteryOk: true,
          cameraOk: true,
          chargingOk: true,
          speakersOk: true
        }
      };
      setRepairJobs([newJob, ...repairJobs]);
    } else if (updatedReq.finalAgreedPrice) {
      if (catalog.length < 500) {
        const newCatProduct: CatalogProduct = {
          id: `cat-${Date.now()}`,
          title: `${updatedReq.modelName} - Refurbished`,
          brand: updatedReq.brand,
          model: updatedReq.modelName,
          storage: '128GB',
          color: 'Black / Assorted',
          originalPrice: Math.round(updatedReq.finalAgreedPrice * 1.5),
          refurbPrice: Math.round(updatedReq.finalAgreedPrice * 1.25),
          conditionGrade: 'Superb',
          warrantyMonths: 3,
          batteryHealthPercent: 88,
          images: updatedReq.photos.length > 0 ? updatedReq.photos : ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80'],
          inStock: true,
          stockCount: 1,
          serialImei: `35${Math.floor(1000000000000 + Math.random() * 900000000000)}`,
          inspectionPassed: true,
          description: 'Doorstep certified trade-in phone. Sanitized, original battery verified, backed by RePhone 3-Month warranty.',
          boxChargerIncluded: true,
          specs: {
            screen: 'OLED Display',
            processor: 'High Performance Chip',
            ram: '6GB RAM',
            camera: 'Multi Camera System'
          }
        };
        setCatalog([newCatProduct, ...catalog]);
      }
    }
  };

  const handleOrderCreated = (order: Order) => {
    setOrders([order, ...orders]);
    setCart([]);
    saveOrderToDB(order);
  };

  const handleNewReturn = (req: ReturnRequest) => {
    setReturnRequests([req, ...returnRequests]);
  };

  const handleNewWarranty = (claim: WarrantyClaim) => {
    setWarrantyClaims([claim, ...warrantyClaims]);

    const newJob: RepairJob = {
      id: `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      source: 'Warranty Claim',
      referenceId: claim.orderId,
      deviceName: claim.itemTitle || 'Customer Warranty Device',
      serialImei: claim.serialImei,
      defectSummary: `${claim.issueType}: ${claim.issueDetails}`,
      technician: 'Vikram Tech (Audio & Board Lead)',
      status: 'Diagnosing',
      estimatedCost: 1200,
      sparePartsUsed: ['Replacement Component'],
      createdDate: new Date().toISOString().split('T')[0],
      qcChecklist: {
        displayOk: true,
        touchOk: true,
        batteryOk: true,
        cameraOk: true,
        chargingOk: true,
        speakersOk: false
      }
    };
    setRepairJobs([newJob, ...repairJobs]);
  };

  // Render Inner Content View
  const renderMainContent = () => (
    <main className="pb-16">
      {currentTab === 'landing' && (
        <LandingPage catalog={catalog}
          onSelectProduct={handleSelectProduct}
          onStartSell={() => setCurrentTab('sell')}
          onStartBuy={() => setCurrentTab('buy')}
          onStartTrack={() => setCurrentTab('track')}
          onOpenRepair={() => setCurrentTab('repair')}
          onOpenBrand={handleSelectBrand}
          onOpenLegal={openLegalModal}
        />
      )}

      {currentTab === 'sell' && (
        <SellPhoneWizard
          deviceModels={SEED_DEVICE_MODELS}
          pricingRules={pricingRules}
          onSubmitBuyRequest={handleNewBuyRequest}
          onNavigateToAgent={() => setCurrentTab('agent')}
        />
      )}

      {currentTab === 'buy' && (
        <Storefront
          catalog={catalog}
          searchQuery={searchQuery}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
          onQuickBuy={handleQuickBuy}
        />
      )}

      {currentTab === 'open-box' && (
        <OpenBoxMobiles
          catalog={catalog}
          onSelectProduct={handleSelectProduct}
             

          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {currentTab === 'track' && (
        <TrackOrderAndWarranty
          orders={orders}
          onSubmitReturn={handleNewReturn}
          onSubmitWarranty={handleNewWarranty}
          user={user}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      {currentTab === 'repair' && <DoorstepRepair />}

      {currentTab === 'about' && (
        <AboutUs onStartSelling={() => setCurrentTab('sell')} />
      )}

      {currentTab === 'how-it-works' && (
        <HowItWorks onNavigate={(t) => setCurrentTab(t as any)} />
      )}

      {currentTab === 'recycle' && <EWasteRecycle />}

      {currentTab === 'contact' && <ContactUs />}

      {currentTab === 'agent' && (
        <AgentFieldView
          buyRequests={buyRequests}
          onUpdateBuyRequest={handleUpdateBuyRequest}
        />
      )}

      {currentTab === 'product' && currentProductId && !catalogLoaded && (
        // Reloading or navigating Back straight onto a product URL used to
        // crash here: catalog starts as an EMPTY seed array before the
        // Firestore fetch resolves, so `catalog.find(...) || catalog[0]`
        // evaluated to undefined, and the page immediately read
        // `product.originalPrice` etc. on an undefined product. Show a
        // simple loading state instead of rendering the page at all until
        // the real catalog has actually loaded.
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-slate-400 text-sm font-medium animate-pulse">Loading product...</div>
        </div>
      )}

      {currentTab === 'product' && currentProductId && catalogLoaded && (() => {
        const viewedProduct = catalog.find(p => p.id === currentProductId);
        if (!viewedProduct) {
          // Genuinely missing (bad/stale link) - never silently fall back
          // to catalog[0], which showed a random, wrong product.
          return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-24 text-center px-6">
              <p className="text-slate-600 font-semibold">This product could not be found.</p>
              <button
                onClick={() => { setCurrentTab('landing'); setCurrentProductId(undefined); }}
                className="text-blue-600 font-bold text-sm hover:underline"
              >
                Back to Home
              </button>
            </div>
          );
        }
        return (
          <ProductDetailsPage
            product={viewedProduct}
            catalog={catalog}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleQuickBuy}
            onBack={() => {
              setCurrentTab(viewedProduct.conditionGrade === 'Open Box' ? 'open-box' : 'buy');
              setCurrentProductId(undefined);
            }}
            onNavigateHome={() => {
              setCurrentTab('landing');
              setCurrentProductId(undefined);
            }}
            onNavigateCategory={() => {
              setCurrentTab(viewedProduct.conditionGrade === 'Open Box' ? 'open-box' : 'buy');
              setCurrentProductId(undefined);
            }}
          />
        );
      })()}

      {currentTab === 'admin' && (
        <AdminDashboard
          catalog={catalog}
          setCatalog={setCatalog}
          buyRequests={buyRequests}
          orders={orders}
          repairJobs={repairJobs}
          setRepairJobs={setRepairJobs}
          pricingRules={pricingRules}
          setPricingRules={setPricingRules}
          returnRequests={returnRequests}
          warrantyClaims={warrantyClaims}
        />
      )}
    </main>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0052FF] selection:text-white flex flex-col justify-between pb-20 lg:pb-0">
      {catalogSaveError && currentTab === 'admin' && (
        <div className="fixed top-0 inset-x-0 z-[200] bg-rose-600 text-white text-xs sm:text-sm font-bold text-center py-2 px-4">
          Your last catalog change failed to save to the database - it will be lost on reload. Check that you're still signed in as admin (reconnecting Google Drive can sign you out of admin) and try the edit again.
        </div>
      )}
      {emailAuthError && (
        <div className="fixed top-0 inset-x-0 z-[200] bg-rose-600 text-white text-xs sm:text-sm font-bold text-center py-2 px-4 flex items-center justify-center gap-3">
          <span>{emailAuthError}</span>
          <button onClick={() => setEmailAuthError('')} className="underline font-black shrink-0">Dismiss</button>
        </div>
      )}
      <div>
        {isAppFrame ? (
          <CapacitorAppWrapper onExit={() => setIsAppFrame(false)}>
            <Header
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              cartCount={cart.length}
              openCart={() => setIsCartOpen(true)}
              isAppFrame={isAppFrame}
              setIsAppFrame={setIsAppFrame}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
              onOpenLegal={openLegalModal}
              onOpenBrand={handleSelectBrand}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              user={user}
            />
            {renderMainContent()}
          </CapacitorAppWrapper>
        ) : (
          <>
            <Header
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              cartCount={cart.length}
              openCart={() => setIsCartOpen(true)}
              isAppFrame={isAppFrame}
              setIsAppFrame={setIsAppFrame}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
              onOpenLegal={openLegalModal}
              onOpenBrand={handleSelectBrand}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              user={user}
            />
            {renderMainContent()}
          </>
        )}
      </div>

      {/* Comprehensive Cashify-Style Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="bg-slate-950 text-white border-t border-slate-800 text-xs sm:text-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <RecellLogo variant="badge" />
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm font-sans font-medium">
                India's transparent mobile ReCommerce platform. Get 60-second AI trade-in quotes, instant doorstep spot UPI cash, 32-point diagnostic checks, and 3-Month warranted certified pre-owned devices.
              </p>
              <div className="flex flex-col gap-1 text-blue-400 font-mono text-xs font-black drop-shadow-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 animate-pulse shrink-0" />
                  <span>Recell store, Pathsala road, Khekra, Baghpat, U.P., 250101</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Customer Helpline: +91 9310552055</span>
                </div>
              </div>
            </div>

            {/* Col 2: Services & Pages */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider font-mono drop-shadow-sm">Platform Services</h4>
              <ul className="space-y-2 text-slate-300 text-xs sm:text-sm font-medium">
                <li><a href="/sell" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); setCurrentTab('sell'); } }} className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5"><span className="text-[#0052FF]">&bull;</span> Sell Phone (60s Quote)</a></li>
                <li><a href="/buy" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); setCurrentTab('buy'); } }} className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5"><span className="text-[#0052FF]">&bull;</span> Buy Certified Pre-Owned</a></li>
                <li><a href="/repair" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); setCurrentTab('repair'); } }} className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"><span className="text-amber-400">&bull;</span> 30-Min Doorstep Repair</a></li>
                <li><a href="/track" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); setCurrentTab('track'); } }} className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5"><span className="text-[#0052FF]">&bull;</span> Track Order &amp; Warranty</a></li>
                <li><a href="/how-it-works" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); setCurrentTab('how-it-works'); } }} className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5"><span className="text-[#0052FF]">&bull;</span> How Recell Works</a></li>
                <li><a href="/about" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); setCurrentTab('about'); } }} className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5"><span className="text-[#0052FF]">&bull;</span> About Us</a></li>
                <li><a href="/recycle" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); setCurrentTab('recycle'); } }} className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"><span className="text-emerald-400">&bull;</span> E-Waste Recycle</a></li>
                <li><a href="/contact" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); setCurrentTab('contact'); } }} className="hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5"><span className="text-[#0052FF]">&bull;</span> Contact Support</a></li>
              </ul>
            </div>

            {/* Col 3: 15 Mobile Brands */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider font-mono drop-shadow-sm">15 Mobile Brands</h4>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300 font-medium">
                {MAJOR_MOBILE_BRANDS.slice(0, 10).map((b) => (
                  <a 
                    key={b.id} 
                    href={`/buy?brand=${encodeURIComponent(b.name)}`}
                    onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); handleSelectBrand(b.name); } }}
                    className="hover:text-blue-400 text-left transition-colors truncate cursor-pointer py-0.5 block"
                  >
                    {b.name}
                  </a>
                ))}
                <button 
                  onClick={() => setIsMegaMenuOpen(true)}
                  className="text-blue-400 font-black col-span-2 text-left hover:underline mt-1 cursor-pointer text-xs"
                >
                  View All 15 Brands &rarr;
                </button>
              </div>
            </div>

            {/* Col 4: Legal & Policies */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider font-mono drop-shadow-sm">Legal &amp; Trust Policies</h4>
              <ul className="space-y-2 text-slate-300 text-xs sm:text-sm font-medium">
                <li><a href="/privacy" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); openLegalModal('privacy'); } }} className="hover:text-amber-400 transition-colors cursor-pointer block">Privacy &amp; Data Wipe Policy</a></li>
                <li><a href="/terms" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); openLegalModal('terms'); } }} className="hover:text-amber-400 transition-colors cursor-pointer block">Terms &amp; Trade-In Guidelines</a></li>
                <li><a href="/warranty" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); openLegalModal('warranty'); } }} className="hover:text-amber-400 transition-colors cursor-pointer block">3-Month Recell Warranty</a></li>
                <li><a href="/returns" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); openLegalModal('returns'); } }} className="hover:text-amber-400 transition-colors cursor-pointer block">7-Day Easy Return Policy</a></li>
                <li><a href="/recycle" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && e.button !== 1) { e.preventDefault(); setCurrentTab('recycle'); } }} className="hover:text-emerald-400 transition-colors cursor-pointer block">Green E-Waste Disposal</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-300 font-semibold">
            <div className="flex flex-wrap items-center gap-4">
              <span>Razorpay Payments</span>
              <span className="text-slate-600">&bull;</span>
              <span>Delhivery Express</span>
              <span className="text-slate-600">&bull;</span>
              <span>Shiprocket Partner</span>
            </div>
            <div className="text-slate-300 font-mono">
              &copy; 2026 Recell Mobile Solutions &bull; Recell store, Pathsala road, Khekra, Baghpat, U.P., 250101 &bull; Helpline: 9310552055
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Directory Mega Menu */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        onSelectBrand={handleSelectBrand}
        onNavigateTab={(tab) => setCurrentTab(tab as any)}
      />

      {/* Legal & Compliance Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />

      {/* Product Detail Modal */}

      {/* Checkout Razorpay Modal */}
      <CheckoutModal
        items={checkoutItems}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      {/* User Authentication & Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(userData) => {
          setUser(userData);
          setIsAuthOpen(false);
        }}
        user={user}
        onSignOut={() => setUser(null)}
        onNavigateToTrack={() => setCurrentTab('track')}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSignOut={() => setUser(null)}
        onOpenTrackOrders={() => setCurrentTab('track')}
      />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white border-l border-slate-200 w-full max-w-md h-full p-6 text-slate-900 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-bold text-lg text-slate-900">Your Shopping Cart ({cart.length})</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-500">Your cart is currently empty.</p>
                  <p className="text-xs text-slate-400">Browse live listings to add certified refurbished devices.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                      <img src={item.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-indigo-600 font-mono font-bold mt-0.5">₹{item.refurbPrice.toLocaleString('en-IN')}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-indigo-600 font-mono text-base">
                    ₹{cart.reduce((acc, item) => acc + item.refurbPrice, 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  onClick={handleCartCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 text-sm transition-all"
                >
                  Checkout with Razorpay
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile App-Style Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={cart.length}
        openCart={() => setIsCartOpen(true)}
        onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        user={user}
      />

      {/* Custom WhatsApp Floating Chatbox */}
      <WhatsAppChatWidget />
    </div>
  );
}
