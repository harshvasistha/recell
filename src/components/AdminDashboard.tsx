import React, { useState } from 'react';
import { CatalogProduct, BuyQuoteRequest, Order, RepairJob, PricingRules, ReturnRequest, WarrantyClaim } from '../types';
import { Settings, ShoppingBag, Smartphone, Wrench, IndianRupee, ShieldCheck, Truck, Plus, Trash2, CheckCircle, Sliders, RefreshCw, UserCheck, Upload, Download, FileText, Info, HelpCircle, Cloud } from 'lucide-react';
import { GoogleDriveImportModal } from './GoogleDriveImportModal';
import { PRODUCT_IMAGE_FALLBACK, onProductImageError } from '../utils/productImageFallback';
import { uploadProductImageBlob } from '../lib/storage';

interface AdminDashboardProps {
  catalog: CatalogProduct[];
  setCatalog: React.Dispatch<React.SetStateAction<CatalogProduct[]>>;
  buyRequests: BuyQuoteRequest[];
  orders: Order[];
  repairJobs: RepairJob[];
  setRepairJobs: React.Dispatch<React.SetStateAction<RepairJob[]>>;
  pricingRules: PricingRules;
  setPricingRules: React.Dispatch<React.SetStateAction<PricingRules>>;
  returnRequests: ReturnRequest[];
  warrantyClaims: WarrantyClaim[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  catalog,
  setCatalog,
  buyRequests,
  orders,
  repairJobs,
  setRepairJobs,
  pricingRules,
  setPricingRules,
  returnRequests,
  warrantyClaims
}) => {
  const [activeTab, setActiveTab] = useState<'openbox_catalog' | 'refurb_catalog' | 'buys' | 'pricing' | 'orders' | 'repairs' | 'claims'>('openbox_catalog');
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Single Catalog Item Modal Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('Apple iPhone 13 (128GB) - Starlight');
  const [newBrand, setNewBrand] = useState('Apple');
  const [newModel, setNewModel] = useState('iPhone 13');
  const [newStorage, setNewStorage] = useState('128GB');
  const [newColor, setNewColor] = useState('Starlight');
  const [newOrigPrice, setNewOrigPrice] = useState(59900);
  const [newRefurbPrice, setNewRefurbPrice] = useState(38900);
  const [newGrade, setNewGrade] = useState<'Grade A' | 'Grade A1' | 'Grade B' | 'Grade B1' | 'Open Box' | 'Like New' | 'Superb' | 'Good'>('Open Box');
  const [newBattery, setNewBattery] = useState(90);
  const [newImei, setNewImei] = useState('359018273641029');
  // Starts empty (not a pre-filled stock photo) so it's obvious this field
  // still needs a real photo before saving - a filled-in demo URL here was
  // easy to miss and leave in place, silently saving an unrelated stock
  // photo as if it were the product's real image.
  const [newImage, setNewImage] = useState('');

  // Bulk CSV Upload & Paste Modal
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showDriveImportModal, setShowDriveImportModal] = useState(false);
  const [showJsonPasteModal, setShowJsonPasteModal] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [bulkJsonText, setBulkJsonText] = useState('');
  const [jsonPasteText, setJsonPasteText] = useState('');
  const [bulkUploadMsg, setBulkUploadMsg] = useState('');
  const [showGradingGuide, setShowGradingGuide] = useState(false);

  // Pricing Rule Editor State
  const [demand250101, setDemand250101] = useState(pricingRules.demandFactors.pincode250101Radius);
  const [flawlessScreenMult, setFlawlessScreenMult] = useState(pricingRules.conditionMultipliers.screen.flawless);
  const [minorScreenMult, setMinorScreenMult] = useState(pricingRules.conditionMultipliers.screen.minor_scratches);

  const handleAddCatalogProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (catalog.length >= 500) {
      alert('Maximum 500 products catalog limit reached! Please remove an existing item before adding.');
      return;
    }

    const newItem: CatalogProduct = {
      id: `cat-${Date.now()}`,
      title: newTitle,
      brand: newBrand,
      model: newModel,
      storage: newStorage,
      color: newColor,
      originalPrice: Number(newOrigPrice),
      refurbPrice: Number(newRefurbPrice),
      conditionGrade: newGrade,
      warrantyMonths: 3,
      batteryHealthPercent: Number(newBattery),
      images: [newImage || PRODUCT_IMAGE_FALLBACK],
      inStock: true,
      stockCount: 1,
      serialImei: newImei,
      inspectionPassed: true,
      description: 'Certified 55-point inspected phone with 3-Month warranty card.',
      boxChargerIncluded: true,
      specs: {
        screen: '6.1-inch Super Retina OLED',
        processor: 'A15 Bionic',
        ram: '4GB',
        camera: '12MP Dual System'
      }
    };

    setCatalog([newItem, ...catalog]);
    setShowAddModal(false);
  };

  const handleDownloadSampleCsv = () => {
    const csvHeader = "Title,Brand,Model,Storage,Color,OriginalPrice,RefurbPrice,ConditionGrade,BatteryHealth,SerialIMEI,ImageUrl,Description\n";
    const sampleRows = [
      'Apple iPhone 14 (128GB) - Blue [Grade A],Apple,iPhone 14,128GB,Blue,69900,48900,Grade A,96,359018273641011,https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80,Grade A: Mobile phone under service center warranty with original parts.',
      'Samsung Galaxy S23 5G (256GB) - Black [Grade A1],Samsung,Galaxy S23,256GB,Phantom Black,74900,42900,Grade A1,94,359018273641022,https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80,Grade A1: New Condition mobile phone with 3-Month ReCell warranty.',
      'iPhone 13 (128GB) - Starlight [Grade B],Apple,iPhone 13,128GB,Starlight,59900,34900,Grade B,86,359018273641033,https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80,Grade B: Minor rough cosmetic condition never repaired with ReCell warranty.',
      'OnePlus 11R 5G (128GB) - Silver [Grade B1],OnePlus,11R,128GB,Silver,39900,22900,Grade B1,88,359018273641044,https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80,Grade B1: Repaired phone (Folder/Jack/Mic replaced) no warranty lowest price.'
    ].join('\n');

    const blob = new Blob([csvHeader + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'recell_products_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseAndAddCsvProducts = (rawText: string) => {
    setBulkUploadMsg('');
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      setBulkUploadMsg('Please paste CSV text or upload a valid CSV file.');
      return;
    }

    const newProducts: CatalogProduct[] = [];
    // Check if line 0 is header
    const startIndex = lines[0].toLowerCase().startsWith('title') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 5) continue;

      const title = parts[0] || 'Refurbished Smartphone';
      const brand = parts[1] || 'Brand';
      const model = parts[2] || 'Model';
      const storage = parts[3] || '128GB';
      const color = parts[4] || 'Standard';
      const originalPrice = Number(parts[5]) || 40000;
      const refurbPrice = Number(parts[6]) || 25000;
      
      let rawGrade = parts[7] || 'Grade A1';
      let conditionGrade: CatalogProduct['conditionGrade'] = 'Grade A1';
      const lower = rawGrade.toLowerCase();
      if (lower.includes('grade a1') || lower === 'a1') {
        conditionGrade = 'Grade A1';
      } else if (lower.includes('grade a') || lower === 'a') {
        conditionGrade = 'Grade A';
      } else if (lower.includes('grade b1') || lower === 'b1') {
        conditionGrade = 'Grade B1';
      } else if (lower.includes('grade b') || lower === 'b') {
        conditionGrade = 'Grade B';
      } else if (lower.includes('like new')) {
        conditionGrade = 'Grade A1';
      } else if (lower.includes('good')) {
        conditionGrade = 'Grade B';
      } else if (lower.includes('open box')) {
        conditionGrade = 'Open Box';
      }

      const batteryHealthPercent = Number(parts[8]) || 88;
      const serialImei = parts[9] || `3590${Math.floor(10000000000 + Math.random() * 90000000000)}`;
      // A CSV row with no working image link used to silently fall back to a
      // stock Unsplash photo, which then got saved as if it were the real
      // product photo - showing up later as an "irrelevant" image on the
      // storefront with no obvious cause. Falling back to the shared
      // placeholder instead makes a missing photo look like what it is.
      const imageUrl = parts[10] && parts[10].startsWith('http')
        ? parts[10]
        : PRODUCT_IMAGE_FALLBACK;
      const description = parts[11] || `Certified 55-Point Inspected device. Grade ${conditionGrade}. Includes charger and warranty.`;

      newProducts.push({
        id: `cat-csv-${Date.now()}-${i}`,
        title,
        brand,
        model,
        storage,
        color,
        originalPrice,
        refurbPrice,
        conditionGrade,
        warrantyMonths: 3,
        batteryHealthPercent,
        images: [imageUrl],
        inStock: true,
        stockCount: 1,
        serialImei,
        inspectionPassed: true,
        description,
        boxChargerIncluded: true,
        specs: {
          screen: '6.1-inch High Refresh Rate Display',
          processor: 'High Performance Octa-Core',
          ram: '6GB / 8GB',
          camera: 'Pro Multi-Camera System'
        }
      });
    }

    if (newProducts.length === 0) {
      setBulkUploadMsg('Could not parse any valid product rows. Please check CSV format.');
      return;
    }

    setCatalog(prev => [...newProducts, ...prev]);
    setBulkUploadMsg(`Successfully uploaded ${newProducts.length} product(s) to live store catalog!`);
    setBulkCsvText('');
    setTimeout(() => {
      setShowBulkUploadModal(false);
      setBulkUploadMsg('');
    }, 1800);
  };

  // JSON bulk import - handles the full CatalogProduct shape (multiple
  // images, a real specs object, per-variant pricing) that CSV rows can't
  // express cleanly. Each entry only needs title/brand/model/storage/
  // originalPrice/refurbPrice - everything else gets a sane default.
  // Multiple entries sharing the same brand+model become storage variants
  // of one listing (see the product detail page's variant switcher).
  // Key used to match an incoming JSON row against an existing catalog
  // product, so re-pasting an updated export (fixed specs, swapped
  // images, corrected pricing) refreshes matching products in place
  // instead of creating duplicates. Every previous paste always minted a
  // brand-new id, so re-uploading corrected data doubled up the catalog.
  const productIdentityKey = (brand: string, model: string, storage: string, conditionGrade: string) =>
    [brand, model, storage, conditionGrade].map(s => (s || '').trim().toLowerCase()).join('|');

  const parseAndAddJsonProducts = (rawText: string) => {
    setBulkUploadMsg('');
    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      setBulkUploadMsg('Invalid JSON - please check for a trailing comma or unclosed bracket.');
      return;
    }

    const rows: any[] = Array.isArray(parsed) ? parsed : [parsed];

    const existingByKey = new Map<string, CatalogProduct>();
    for (const p of catalog) {
      existingByKey.set(productIdentityKey(p.brand, p.model, p.storage, p.conditionGrade), p);
    }

    const newProducts: CatalogProduct[] = [];
    const updatedIds = new Set<string>();
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r || !r.title || !r.brand || !r.model || r.refurbPrice == null) continue;

      const conditionGrade: CatalogProduct['conditionGrade'] = r.conditionGrade || 'Open Box';
      const isOpenBox = r.isOpenBox ?? (conditionGrade === 'Open Box');
      const key = productIdentityKey(r.brand, r.model, r.storage || '128GB', conditionGrade);
      const existing = existingByKey.get(key);

      // Both of these are genuinely optional fields (see types.ts) with no
      // hard fallback - a brand-new product with neither the pasted value
      // nor an existing entry to inherit from must end up with the key
      // simply ABSENT, never present with the literal value `undefined`.
      // Firestore's setDoc() rejects any document containing an undefined
      // field outright, and because the whole catalog is one document,
      // that one field on one product used to fail the ENTIRE save - every
      // other product in the same paste, silently, with a banner that
      // pointed at "signed out of admin" instead of the real cause.
      const batteryHealthPercent = r.batteryHealthPercent ?? existing?.batteryHealthPercent;
      const brandWarrantyMonths = r.brandWarrantyMonths ?? existing?.brandWarrantyMonths ?? (isOpenBox ? 12 : undefined);

      const product: CatalogProduct = {
        id: existing?.id || `cat-json-${Date.now()}-${i}`,
        title: r.title,
        brand: r.brand,
        model: r.model,
        storage: r.storage || '128GB',
        color: r.color || existing?.color || 'Assorted Official',
        originalPrice: Number(r.originalPrice) || Number(r.refurbPrice),
        refurbPrice: Number(r.refurbPrice),
        conditionGrade,
        warrantyMonths: r.warrantyMonths ?? (isOpenBox ? 12 : 3),
        ...(batteryHealthPercent !== undefined ? { batteryHealthPercent } : {}),
        images: Array.isArray(r.images) && r.images.length > 0 && r.images.some((u: string) => !!u)
          ? r.images.filter((u: string) => !!u)
          : existing?.images || [PRODUCT_IMAGE_FALLBACK],
        inStock: r.inStock ?? existing?.inStock ?? true,
        stockCount: r.stockCount ?? existing?.stockCount ?? 5,
        serialImei: r.serialImei || existing?.serialImei || `3590${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        inspectionPassed: true,
        description: r.description || existing?.description || `${r.title} - ${isOpenBox ? 'Sealed open box unit with 12-month official manufacturer warranty.' : `Certified 55-point inspected device with ${r.warrantyMonths ?? 3}-month warranty.`}`,
        boxChargerIncluded: r.boxChargerIncluded ?? existing?.boxChargerIncluded ?? true,
        isOpenBox,
        ...(brandWarrantyMonths !== undefined ? { brandWarrantyMonths } : {}),
        specs: r.specs || existing?.specs || {
          screen: '6.7" Full HD+ Display',
          processor: 'Octa-Core Processor',
          ram: r.storage || '',
          camera: 'AI Multi-Camera System'
        }
      };

      if (existing) {
        updatedIds.add(existing.id);
      }
      newProducts.push(product);
    }

    if (newProducts.length === 0) {
      setBulkUploadMsg('No valid rows found - each needs at least title, brand, model, and refurbPrice.');
      return;
    }

    const addedCount = newProducts.length - updatedIds.size;
    if (catalog.length + addedCount > 500) {
      setBulkUploadMsg(`This would exceed the 500-product catalog limit (currently ${catalog.length}).`);
      return;
    }

    setCatalog(prev => {
      const untouched = prev.filter(p => !updatedIds.has(p.id));
      return [...newProducts, ...untouched];
    });
    setBulkUploadMsg(
      updatedIds.size > 0
        ? `Uploaded ${newProducts.length} product(s): ${updatedIds.size} updated in place, ${addedCount} newly added.`
        : `Successfully uploaded ${newProducts.length} product(s) to live store catalog!`
    );
    setBulkJsonText('');
    setTimeout(() => {
      setShowBulkUploadModal(false);
      setBulkUploadMsg('');
    }, 1800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        parseAndAddCsvProducts(text);
      }
    };
    reader.readAsText(file);
  };

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Uploads straight to Cloudinary and stores the permanent CDN URL,
    // rather than embedding the photo as a base64 data: URL inside the
    // catalog document itself. The whole catalog lives in one Firestore
    // document (system/catalog, 1MB max) - a few data: URLs in there is
    // fine, but it doesn't scale to hundreds of products and was never a
    // real "hosted" photo anywhere. This also keeps every catalog photo,
    // however it was added, on the same reliable hosting path.
    setUploadingPhoto(true);
    try {
      const url = await uploadProductImageBlob(file);
      setNewImage(url);
    } catch (err) {
      console.error('Photo upload failed:', err);
      alert('Photo upload failed. Please check your connection and try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemoveProduct = (id: string) => {
    if (confirmDeleteId === id) {
      setCatalog(prev => prev.filter(p => p.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const handleUpdateRepairStatus = (jobId: string, newStatus: RepairJob['status']) => {
    setRepairJobs(repairJobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
  };

  const handleSavePricingRules = (e: React.FormEvent) => {
    e.preventDefault();
    setPricingRules({
      ...pricingRules,
      demandFactors: {
        ...pricingRules.demandFactors,
        pincode250101Radius: Number(demand250101)
      },
      conditionMultipliers: {
        ...pricingRules.conditionMultipliers,
        screen: {
          ...pricingRules.conditionMultipliers.screen,
          flawless: Number(flawlessScreenMult),
          minor_scratches: Number(minorScreenMult)
        }
      }
    });
    alert('Valuation Engine Rules Updated Successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900">
      {/* Admin Suite Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1 w-fit mb-2">
            <Settings className="w-3.5 h-3.5 text-indigo-600" />
            Central ReCommerce Admin Suite
          </span>
          <h1 className="text-2xl font-black text-slate-900">Platform Control Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catalog Limit: <strong className="text-emerald-600">{catalog.length} / 500 Max</strong> • Local Radius: <strong>Pincode 250101</strong>
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200 text-xs font-semibold">
          {[
            { id: 'openbox_catalog', label: `Open Box Catalog (${catalog.filter(c => c.conditionGrade === 'Open Box').length}/500)`, icon: ShoppingBag },
            { id: 'refurb_catalog', label: `Refurbished Catalog (${catalog.filter(c => c.conditionGrade !== 'Open Box').length}/500)`, icon: ShoppingBag },
            { id: 'buys', label: `Buy Requests (${buyRequests.length})`, icon: Smartphone },
            { id: 'pricing', label: 'Pricing Rules', icon: Sliders },
            { id: 'orders', label: `Orders (${orders.length})`, icon: Truck },
            { id: 'repairs', label: `Repairs (${repairJobs.length})`, icon: Wrench },
            { id: 'claims', label: `Claims (${returnRequests.length + warrantyClaims.length})`, icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: CATALOG MANAGEMENT */}
      {(activeTab === 'openbox_catalog' || activeTab === 'refurb_catalog') && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{activeTab === 'openbox_catalog' ? 'Open Box Phones Catalog' : 'Refurbished Phones Catalog'}</h2>
              <p className="text-xs text-slate-500">Manage up to 500 live items on pan-India storefront</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (confirmClear) {
                    // Scoped to the category currently being viewed only.
                    // This used to call setCatalog([]) unconditionally,
                    // which wiped BOTH Open Box and Refurbished catalogs
                    // together no matter which tab the button was clicked
                    // from - the "Clear Catalog (N)" label even showed the
                    // combined total, not the current tab's count, making
                    // it look scoped when it silently wasn't.
                    setCatalog(prev => prev.filter(p =>
                      activeTab === 'openbox_catalog'
                        ? p.conditionGrade !== 'Open Box'
                        : p.conditionGrade === 'Open Box'
                    ));
                    setConfirmClear(false);
                  } else {
                    setConfirmClear(true);
                    setTimeout(() => setConfirmClear(false), 3000);
                  }
                }}
                className={`font-bold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5 transition-all cursor-pointer ${confirmClear ? 'bg-red-500 text-white' : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'}`}
                title={`Wipe and clean only the ${activeTab === 'openbox_catalog' ? 'Open Box' : 'Refurbished'} items currently listed on storefront - the other category is untouched`}
              >
                <Trash2 className={`w-3.5 h-3.5 ${confirmClear ? 'text-white' : 'text-rose-600'}`} />
                <span>
                  {confirmClear
                    ? "Click to Confirm"
                    : `Clear Catalog (${catalog.filter(p => activeTab === 'openbox_catalog' ? p.conditionGrade === 'Open Box' : p.conditionGrade !== 'Open Box').length})`}
                </span>
              </button>

              <button
                onClick={handleDownloadSampleCsv}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                title="Download sample CSV template for bulk product import"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>CSV Template</span>
              </button>

              <button
                onClick={() => setShowDriveImportModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer font-heading"
                title="Directly import mobile phone photos & descriptions from Google Drive"
              >
                <Cloud className="w-3.5 h-3.5 text-white" />
                <span>Import from Google Drive</span>
              </button>

              <button
                onClick={() => setShowBulkUploadModal(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5 border border-indigo-200 transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Bulk CSV Upload</span>
              </button>

              <button
                onClick={() => setShowJsonPasteModal(true)}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5 border border-purple-200 transition-all cursor-pointer"
                title="Paste a full-detail JSON array (multiple images, specs, storage variants per product)"
              >
                <Upload className="w-3.5 h-3.5 text-purple-600" />
                <span>Paste Product JSON</span>
              </button>

              <button
                onClick={() => { setShowAddModal(true); setNewGrade(activeTab === 'openbox_catalog' ? 'Open Box' : 'Grade A'); }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-full text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Physical & Technical Grading System Explainer Card */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-blue-900 text-sm font-heading">
                <ShieldCheck className="w-4 h-4 text-[#0052FF]" />
                <span>Recell Standardised Physical &amp; Technical Grading Matrix</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGradingGuide(!showGradingGuide)}
                className="text-xs text-[#0052FF] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showGradingGuide ? 'Hide Grading Details' : 'View Full Grading Rules'}</span>
              </button>
            </div>

            <p className="text-slate-600">
              All inventory uploaded is categorized according to strict physical condition (body, screen, back glass) and technical inspection (55-point diagnostic check, original OEM parts, battery health %).
            </p>

            {showGradingGuide && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-blue-200/60 font-medium">
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                    Grade A
                  </span>
                  <p className="font-bold text-slate-900 text-[11px]">Official Center Warranty</p>
                  <p className="text-[10px] text-slate-500">Mobile phone under active brand warranty from official service center. 100% original.</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                    Grade A1
                  </span>
                  <p className="font-bold text-slate-900 text-[11px]">New Condition + ReCell Warranty</p>
                  <p className="text-[10px] text-slate-500">Like New phone with ReCell warranty. Pristine condition, zero functional or cosmetic issues.</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                    Grade B
                  </span>
                  <p className="font-bold text-slate-900 text-[11px]">Minor Scuffs + Never Repaired</p>
                  <p className="text-[10px] text-slate-500">Minor rough cosmetic marks, 100% NEVER REPAIRED, includes ReCell warranty.</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                    Grade B1 (Budget)
                  </span>
                  <p className="font-bold text-slate-900 text-[11px]">Repaired Parts + No Warranty</p>
                  <p className="text-[10px] text-slate-500">Repaired phone (Folder screen/jack/mic/speaker replaced). Fully tested, lowest price.</p>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono border-b border-slate-200">
                <tr>
                  <th className="p-3">Device & IMEI</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Battery</th>
                  <th className="p-3">Original Price</th>
                  <th className="p-3">Refurb Price</th>
                  <th className="p-3">Stock Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {catalog.filter(item => activeTab === 'openbox_catalog' ? item.conditionGrade === 'Open Box' : item.conditionGrade !== 'Open Box').map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-medium flex items-center gap-3">
                      <img src={item.images[0] || PRODUCT_IMAGE_FALLBACK} alt="" className="w-10 h-10 object-cover rounded-xl bg-slate-100 border border-slate-200" onError={onProductImageError} />
                      <div>
                        <p className="text-slate-900 font-bold">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono">IMEI: {item.serialImei}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {item.conditionGrade}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-emerald-600 font-bold">N/A</td>
                    <td className="p-3 font-mono text-slate-400">₹{item.originalPrice.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-mono text-emerald-600 font-bold">₹{item.refurbPrice.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                        In Stock ({item.stockCount})
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(item.id)}
                        className={`p-1.5 rounded-xl transition-colors ${confirmDeleteId === item.id ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'}`}
                        title={confirmDeleteId === item.id ? "Click again to confirm delete" : "Delete Product"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BUY REQUESTS & PICKUPS */}
      {activeTab === 'buys' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Local Sell Requests (Pincode 250101 Radius)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buyRequests.map(req => (
              <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-indigo-600 font-bold">{req.id}</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                    {req.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{req.modelName}</h3>
                <p className="text-slate-500">Seller: {req.sellerName} ({req.sellerPhone})</p>
                <p className="text-slate-500">Address: {req.address} ({req.pincode})</p>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold">
                  <span className="text-slate-400">Rough Quote:</span>
                  <span className="text-emerald-600 font-mono">₹{req.roughQuoteMin.toLocaleString('en-IN')} - ₹{req.roughQuoteMax.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRICING ENGINE RULE EDITOR */}
      {activeTab === 'pricing' && (
        <form onSubmit={handleSavePricingRules} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Dynamic Pricing Engine Rules</h2>
            <p className="text-xs text-slate-500">Adjust multipliers & local demand factors. Changes apply live to rough quote calculations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="font-bold text-slate-900 block">1. Local Pincode 250101 Demand Multiplier</label>
              <input
                type="number"
                step="0.01"
                value={demand250101}
                onChange={(e) => setDemand250101(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold"
              />
              <p className="text-[11px] text-slate-500">e.g., 1.05 gives a 5% bonus quote for local high-demand town items.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="font-bold text-slate-900 block">2. Flawless Screen Multiplier</label>
              <input
                type="number"
                step="0.01"
                value={flawlessScreenMult}
                onChange={(e) => setFlawlessScreenMult(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold"
              />
              <p className="text-[11px] text-slate-500">1.0 = 100% of base value for scratchless screens.</p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-full text-xs shadow-sm flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Save & Update Valuation Rules
          </button>
        </form>
      )}

      {/* TAB 4: ORDERS & PAN-INDIA SHIPMENTS */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Pan-India Orders & Delhivery Express Tracking</h2>
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-indigo-600">{order.id}</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">{order.orderStatus}</span>
                </div>
                <p className="font-bold text-slate-900">{order.customerName} ({order.customerPhone})</p>
                <p className="text-slate-500">Tracking: {order.courierPartner} - {order.trackingNumber}</p>
                <p className="text-slate-500">Address: {order.shippingAddress}, {order.city} ({order.pincode})</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REPAIR QUEUE & TECHNICIANS */}
      {activeTab === 'repairs' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">In-House Repair Queue & Technician Workbench</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repairJobs.map(job => (
              <div key={job.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-indigo-600">{job.id}</span>
                  <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold text-[10px]">{job.status}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{job.deviceName}</h3>
                <p className="text-slate-500">Defect: {job.defectSummary}</p>
                <p className="text-slate-500">Assigned Tech: <strong>{job.technician}</strong></p>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Change Status:</span>
                  <select
                    value={job.status}
                    onChange={(e) => handleUpdateRepairStatus(job.id, e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl p-1.5 text-xs text-slate-900 font-bold"
                  >
                    <option value="Booked">Booked</option>
                    <option value="Diagnosing">Diagnosing</option>
                    <option value="Repairing">Repairing</option>
                    <option value="QC Passed">QC Passed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: RETURNS & WARRANTY CLAIMS */}
      {activeTab === 'claims' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">7-Day Return Requests</h2>
            {returnRequests.map(ret => (
              <div key={ret.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>{ret.id} (Order: {ret.orderId})</span>
                  <span>{ret.status}</span>
                </div>
                <p className="text-slate-900 font-medium">{ret.itemTitle} - Reason: {ret.reason}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900">3-Month Warranty Claims</h2>
            {warrantyClaims.map(war => (
              <div key={war.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-indigo-700">
                  <span>{war.id} (IMEI: {war.serialImei})</span>
                  <span>{war.status}</span>
                </div>
                <p className="text-slate-900 font-medium">Customer: {war.customerName} ({war.customerPhone})</p>
                <p className="text-slate-500">Issue: {war.issueType} - {war.issueDetails}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk CSV Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-5 text-xs shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#0052FF]" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">Bulk Upload Products (CSV or Paste)</h3>
                  <p className="text-[11px] text-slate-500">Add multiple devices with physical &amp; technical state grading at once</p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkUploadModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {bulkUploadMsg && (
              <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                bulkUploadMsg.includes('Successfully') 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {bulkUploadMsg.includes('Successfully') ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{bulkUploadMsg}</span>
              </div>
            )}

            {/* Step 1: Download CSV template */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <FileText className="w-4 h-4 text-[#0052FF]" />
                  Need the exact CSV format?
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Download our pre-formatted spreadsheet template containing sample grades, prices, and IMEI fields.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-4 py-2 rounded-xl border border-slate-300 text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0052FF]" />
                <span>Download Sample CSV</span>
              </button>
            </div>

            {/* Step 2: Upload CSV File OR Paste Raw CSV */}
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Method 1: Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#0052FF] hover:file:bg-blue-100 border border-slate-200 rounded-2xl p-1 bg-slate-50/50 cursor-pointer"
                />
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-[10px] uppercase font-mono font-bold text-slate-400">OR PASTE CSV ROWS BELOW</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Method 2: Paste Raw CSV Data</label>
                <textarea
                  rows={5}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  placeholder={`Title,Brand,Model,Storage,Color,OriginalPrice,RefurbPrice,ConditionGrade,BatteryHealth,SerialIMEI\niPhone 14,Apple,iPhone 14,128GB,Blue,69900,42900,Like New,96,359018273641011`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#0052FF] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => parseAndAddCsvProducts(bulkCsvText)}
                  disabled={!bulkCsvText.trim()}
                  className="bg-[#0052FF] hover:bg-[#0043CC] disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer font-heading"
                >
                  <Upload className="w-4 h-4" />
                  <span>Parse &amp; Add CSV Products</span>
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-[10px] uppercase font-mono font-bold text-slate-400">OR: FULL-DETAIL JSON IMPORT</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Method 3: Paste Product JSON (supports multiple images, full specs, storage variants)
                </label>
                <p className="text-[11px] text-slate-500 mb-1.5">
                  Paste an array of products. Entries sharing the same brand + model become storage
                  variants of one listing on the product page. Fields: title, brand, model, storage,
                  color, originalPrice (strike price), refurbPrice (selling price), images (array of
                  3-6 URLs), specs {'{'}screen, processor, camera, battery, os{'}'}, conditionGrade
                  ("Open Box" defaults warranty to 12 months).
                </p>
                <textarea
                  rows={6}
                  value={bulkJsonText}
                  onChange={(e) => setBulkJsonText(e.target.value)}
                  placeholder={`[\n  {\n    "title": "OPPO A6X (4GB+64GB)",\n    "brand": "Oppo",\n    "model": "OPPO A6X",\n    "storage": "4GB+64GB",\n    "originalPrice": 17999,\n    "refurbPrice": 17142,\n    "conditionGrade": "Open Box",\n    "images": ["https://...jpg", "https://...jpg"],\n    "specs": {"screen": "6.7\\" HD+", "processor": "MediaTek", "camera": "50MP AI", "battery": "5800mAh"}\n  }\n]`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#0052FF] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBulkUploadModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => parseAndAddJsonProducts(bulkJsonText)}
                disabled={!bulkJsonText.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer font-heading"
              >
                <Upload className="w-4 h-4" />
                <span>Parse &amp; Add JSON Products</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Paste Product JSON Modal */}
      {showJsonPasteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-4 text-xs shadow-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">Paste Product JSON</h3>
                  <p className="text-[11px] text-slate-500">Bulk-import full-detail products - multiple images, specs, and storage variants per listing</p>
                </div>
              </div>
              <button
                onClick={() => setShowJsonPasteModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {bulkUploadMsg && (
              <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                bulkUploadMsg.includes('Successfully')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {bulkUploadMsg.includes('Successfully') ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{bulkUploadMsg}</span>
              </div>
            )}

            <div>
              <p className="text-[11px] text-slate-500 mb-1.5">
                Paste an array of products. Entries sharing the same brand + model become storage
                variants of one listing on the product page. Fields: title, brand, model, storage,
                color, originalPrice (strike price), refurbPrice (selling price), images (array of
                3-6 URLs), specs {'{'}screen, processor, camera, battery, os{'}'}, conditionGrade
                ("Open Box" defaults warranty to 12 months).
              </p>
              <textarea
                rows={12}
                value={jsonPasteText}
                onChange={(e) => setJsonPasteText(e.target.value)}
                placeholder={`[\n  {\n    "title": "OPPO A6X (4GB+64GB)",\n    "brand": "Oppo",\n    "model": "OPPO A6X",\n    "storage": "4GB+64GB",\n    "originalPrice": 17999,\n    "refurbPrice": 17142,\n    "conditionGrade": "Open Box",\n    "images": ["https://...jpg", "https://...jpg"],\n    "specs": {"screen": "6.7\\" HD+", "processor": "MediaTek", "camera": "50MP AI", "battery": "5800mAh"}\n  }\n]`}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-[#0052FF] outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowJsonPasteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => parseAndAddJsonProducts(jsonPasteText)}
                disabled={!jsonPasteText.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer font-heading"
              >
                <Upload className="w-4 h-4" />
                <span>Parse &amp; Add JSON Products</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl text-slate-900">
            <h3 className="text-base font-bold text-slate-900 font-heading">Add Product to Store Catalog</h3>
            <form onSubmit={handleAddCatalogProduct} className="space-y-3">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Brand</label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Model</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newOrigPrice}
                    onChange={(e) => setNewOrigPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Refurb Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newRefurbPrice}
                    onChange={(e) => setNewRefurbPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Physical &amp; Tech Grade</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  >
                    <option value="Grade A">Grade A: Official Service Center Warranty</option>
                    <option value="Grade A1">Grade A1: New Condition + ReCell Warranty</option>
                    <option value="Grade B">Grade B: Minor Scuffs (Never Repaired) + ReCell Warranty</option>
                    <option value="Grade B1">Grade B1: Repaired Phone (Folder/Jack/Mic) - No Warranty</option>
                    <option value="Open Box">Open Box (Sealed, 12-Month Warranty)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Battery Health (%)</label>
                  <input
                    type="number"
                    required
                    value={newBattery}
                    onChange={(e) => setNewBattery(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Serial IMEI Number</label>
                <input
                  type="text"
                  required
                  value={newImei}
                  onChange={(e) => setNewImei(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Product Photo (URL or Upload Image File)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://... image link or select file"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono text-xs"
                  />
                  <label className={`bg-indigo-50 hover:bg-indigo-100 text-[#0052FF] font-bold px-3.5 py-2.5 rounded-xl border border-indigo-200 shrink-0 text-xs flex items-center gap-1.5 transition-colors ${uploadingPhoto ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
                    <Upload className={`w-3.5 h-3.5 ${uploadingPhoto ? 'animate-pulse' : ''}`} />
                    <span>{uploadingPhoto ? 'Uploading...' : 'Upload File'}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoFileUpload} disabled={uploadingPhoto} className="hidden" />
                  </label>
                </div>
                {newImage && !uploadingPhoto && (
                  <div className="mt-2 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <img src={newImage} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-slate-200" onError={onProductImageError} />
                    <span className="text-[11px] text-slate-600 font-medium truncate">Product photo loaded &amp; ready</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-full font-heading cursor-pointer"
                >
                  Add to Store Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Drive Direct Importer Modal */}
      <GoogleDriveImportModal
        isOpen={showDriveImportModal}
        onClose={() => setShowDriveImportModal(false)}
        onImportProducts={(importedProducts) => {
          // Upsert by id instead of blindly prepending: each Drive-imported
          // product gets a deterministic id (gdrive-<fileId> etc), so
          // re-importing the same file/folder - e.g. to re-host its image
          // after this fix, or just refreshing a listing - now replaces the
          // existing entry in place instead of adding a duplicate row into
          // the single shared catalog document.
          setCatalog(prev => {
            const importedIds = new Set(importedProducts.map(p => p.id));
            return [...importedProducts, ...prev.filter(p => !importedIds.has(p.id))];
          });
          alert(`Successfully imported ${importedProducts.length} mobile phone photos & listings from Google Drive!`);
        }}
      />
    </div>
  );
};
