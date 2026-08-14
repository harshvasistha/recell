export interface BrandCategory {
  id: string;
  name: string;
  logoText: string;
  logoUrl?: string;
  tagline: string;
  modelsCount: number;
  sellStartingFrom: number;
  buyStartingFrom: number;
  popularModels: string[];
  gradient: string;
  accentColor: string;
}

export interface PlatformFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  badge?: string;
  stat?: string;
  statLabel?: string;
}

export const MAJOR_MOBILE_BRANDS: BrandCategory[] = [
  {
    id: 'apple',
    name: 'Apple',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='%23000' d='M50.4 46.5c.2-7.2 5.9-10.6 6.1-10.8-3.4-4.9-8.6-5.6-10.5-5.7-4.5-.4-8.8 2.6-11.1 2.6-2.3 0-5.8-2.6-9.5-2.5-4.8.1-9.3 2.8-11.8 7.1-5.1 8.8-1.3 21.8 3.6 28.9 2.4 3.5 5.2 7.4 9 7.3 3.6-.1 5-2.3 9.4-2.3 4.4 0 5.6 2.3 9.4 2.3 4 0 6.4-3.5 8.7-6.9 2.8-4 3.9-7.9 4-8.1-.1-.1-7.5-2.9-7.3-11.9zM48 23.9c2-2.4 3.3-5.7 2.9-9.1-3 .1-6.5 2-8.5 4.4-1.8 1.9-3.3 5.3-2.9 8.6 3.4.3 6.6-1.6 8.5-3.9z'/></svg>", logoText: 'Apple',
    tagline: 'iPhone 16, 15 Pro, 14, 13, 12, SE',
    modelsCount: 42,
    sellStartingFrom: 18000,
    buyStartingFrom: 28999,
    popularModels: ['iPhone 15 Pro', 'iPhone 14', 'iPhone 13', 'iPhone 12'],
    gradient: 'from-slate-900 to-slate-800',
    accentColor: 'text-slate-900'
  },
  {
    id: 'samsung',
    name: 'Samsung',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><ellipse cx='50' cy='50' rx='45' ry='25' fill='%231428a0'/><text x='50' y='57' font-family='Arial, sans-serif' font-weight='bold' font-size='18' fill='%23fff' text-anchor='middle'>SAMSUNG</text></svg>", logoText: 'SAMSUNG',
    tagline: 'Galaxy S24 Ultra, S23, Z Fold, A Series',
    modelsCount: 58,
    sellStartingFrom: 6500,
    buyStartingFrom: 12999,
    popularModels: ['S23 Ultra', 'S22 5G', 'Z Fold 5', 'A54 5G'],
    gradient: 'from-blue-600 to-indigo-700',
    accentColor: 'text-blue-600'
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='80' height='80' x='10' y='10' rx='10' fill='%23EB0029'/><text x='50' y='65' font-family='Arial, sans-serif' font-weight='bold' font-size='45' fill='%23fff' text-anchor='middle'>1+</text></svg>", logoText: 'ONEPLUS',
    tagline: 'OnePlus 12, 11R, Nord 4, Open',
    modelsCount: 34,
    sellStartingFrom: 8500,
    buyStartingFrom: 15999,
    popularModels: ['OnePlus 12', 'OnePlus 11 5G', 'Nord 3', 'Nord CE 3'],
    gradient: 'from-red-600 to-rose-700',
    accentColor: 'text-red-600'
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi / Redmi',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='80' height='80' x='10' y='10' rx='20' fill='%23FF6900'/><text x='50' y='65' font-family='Arial, sans-serif' font-weight='bold' font-size='45' fill='%23fff' text-anchor='middle'>mi</text></svg>", logoText: 'Xiaomi',
    tagline: 'Xiaomi 14, Redmi Note 13 Pro+, K Series',
    modelsCount: 65,
    sellStartingFrom: 4500,
    buyStartingFrom: 8999,
    popularModels: ['Redmi Note 13 Pro+', 'Xiaomi 14', 'Redmi Note 12', 'Poco X6 Pro'],
    gradient: 'from-orange-500 to-amber-600',
    accentColor: 'text-orange-500'
  },
  {
    id: 'vivo',
    name: 'Vivo',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='30' fill='%23415FFF' text-anchor='middle'>vivo</text></svg>", logoText: 'vivo',
    tagline: 'Vivo X100 Pro, V30 Pro, T3 5G, Y Series',
    modelsCount: 48,
    sellStartingFrom: 5000,
    buyStartingFrom: 9499,
    popularModels: ['Vivo X100 Pro', 'V30 Pro 5G', 'T2 Pro 5G', 'V29'],
    gradient: 'from-sky-500 to-blue-600',
    accentColor: 'text-sky-600'
  },
  {
    id: 'oppo',
    name: 'Oppo',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='30' fill='%2300665E' text-anchor='middle'>oppo</text></svg>", logoText: 'oppo',
    tagline: 'Oppo Find N3 Flip, Reno 12 Pro, F Series',
    modelsCount: 45,
    sellStartingFrom: 4800,
    buyStartingFrom: 8999,
    popularModels: ['Reno 11 Pro', 'Find N3 Flip', 'F25 Pro 5G', 'A79'],
    gradient: 'from-emerald-600 to-teal-700',
    accentColor: 'text-emerald-600'
  },
  {
    id: 'realme',
    name: 'Realme',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='80' height='80' x='10' y='10' fill='%23FFC200'/><text x='50' y='57' font-family='Arial, sans-serif' font-weight='bold' font-size='20' fill='%23000' text-anchor='middle'>realme</text></svg>", logoText: 'realme',
    tagline: 'Realme GT 6, 12 Pro+, Narzo 70 Pro',
    modelsCount: 52,
    sellStartingFrom: 4000,
    buyStartingFrom: 7999,
    popularModels: ['Realme GT 6', '12 Pro+ 5G', 'Narzo 70', '11 Pro'],
    gradient: 'from-amber-400 to-yellow-500',
    accentColor: 'text-amber-500'
  },
  {
    id: 'google',
    name: 'Google Pixel',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='65' font-family='Arial, sans-serif' font-weight='bold' font-size='45' fill='%234285F4' text-anchor='middle'>G</text></svg>", logoText: 'Google Pixel',
    tagline: 'Pixel 9 Pro, Pixel 8a, 7 Pro, 6a',
    modelsCount: 18,
    sellStartingFrom: 11000,
    buyStartingFrom: 19999,
    popularModels: ['Pixel 8 Pro', 'Pixel 8a', 'Pixel 7a', 'Pixel 6a'],
    gradient: 'from-emerald-500 via-blue-500 to-red-500',
    accentColor: 'text-indigo-600'
  },
  {
    id: 'motorola',
    name: 'Motorola',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%230014C7'/><text x='50' y='65' font-family='Arial, sans-serif' font-weight='bold' font-size='40' fill='%23fff' text-anchor='middle'>M</text></svg>", logoText: 'motorola',
    tagline: 'Moto Edge 50 Ultra, Razr 50, G Series',
    modelsCount: 38,
    sellStartingFrom: 4200,
    buyStartingFrom: 8499,
    popularModels: ['Edge 50 Pro', 'Razr 40 Ultra', 'G84 5G', 'Edge 40'],
    gradient: 'from-indigo-600 to-purple-700',
    accentColor: 'text-purple-600'
  },
  {
    id: 'nothing',
    name: 'Nothing',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='80' height='80' x='10' y='10' fill='%23000'/><text x='50' y='55' font-family='Courier New, monospace' font-weight='bold' font-size='14' fill='%23fff' text-anchor='middle' letter-spacing='2'>NOTHING</text></svg>", logoText: 'NOTHING',
    tagline: 'Nothing Phone 2a, Phone 2, Phone 1',
    modelsCount: 6,
    sellStartingFrom: 12000,
    buyStartingFrom: 17999,
    popularModels: ['Phone (2a)', 'Phone (2)', 'Phone (1)'],
    gradient: 'from-slate-800 to-black',
    accentColor: 'text-slate-900'
  },
  {
    id: 'poco',
    name: 'Poco',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='30' fill='%23FFCC00' text-anchor='middle' stroke='%23000' stroke-width='2'>POCO</text></svg>", logoText: 'POCO',
    tagline: 'Poco F6 5G, X6 Pro, M6 Pro 5G',
    modelsCount: 29,
    sellStartingFrom: 3800,
    buyStartingFrom: 7499,
    popularModels: ['Poco F6 5G', 'Poco X6 Pro', 'Poco M6 Pro', 'Poco X5'],
    gradient: 'from-yellow-500 to-amber-600',
    accentColor: 'text-yellow-600'
  },
  {
    id: 'iqoo',
    name: 'iQOO',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-style='italic' font-size='30' fill='%23000' text-anchor='middle'>iQOO</text></svg>", logoText: 'iQOO',
    tagline: 'iQOO 12 5G, Neo 9 Pro, Z9 5G',
    modelsCount: 22,
    sellStartingFrom: 7000,
    buyStartingFrom: 13999,
    popularModels: ['iQOO 12 5G', 'Neo 9 Pro', 'Z9 5G', 'Z7 Pro'],
    gradient: 'from-orange-600 to-red-600',
    accentColor: 'text-orange-600'
  },
  {
    id: 'asus',
    name: 'Asus / ROG',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='30' fill='%2300539B' text-anchor='middle'>ASUS</text></svg>", logoText: 'ASUS ROG',
    tagline: 'ROG Phone 8 Pro, Zenfone 10, ROG 7',
    modelsCount: 12,
    sellStartingFrom: 14000,
    buyStartingFrom: 24999,
    popularModels: ['ROG Phone 8 Pro', 'ROG Phone 7', 'Zenfone 10'],
    gradient: 'from-cyan-600 to-blue-700',
    accentColor: 'text-cyan-600'
  },
  {
    id: 'honor',
    name: 'Honor',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='28' fill='%23000' text-anchor='middle' letter-spacing='1'>HONOR</text></svg>", logoText: 'HONOR',
    tagline: 'Honor 200 Pro, Magic 6 Pro, X9b',
    modelsCount: 16,
    sellStartingFrom: 6000,
    buyStartingFrom: 11999,
    popularModels: ['Honor 200 Pro', 'Magic 6 Pro', 'Honor X9b'],
    gradient: 'from-purple-600 to-indigo-800',
    accentColor: 'text-purple-600'
  },
  {
    id: 'infinix',
    name: 'Infinix / Tecno',
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='26' fill='%2300874E' text-anchor='middle'>Infinix</text></svg>", logoText: 'Infinix',
    tagline: 'Infinix GT 20 Pro, Phantom V Fold, Zero 30',
    modelsCount: 30,
    sellStartingFrom: 3200,
    buyStartingFrom: 6499,
    popularModels: ['GT 20 Pro', 'Phantom V Fold', 'Zero 30 5G'],
    gradient: 'from-teal-600 to-emerald-700',
    accentColor: 'text-teal-600'
  }
];

export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    id: 'f1',
    title: '60-Second AI Quote Engine',
    subtitle: 'Algorithmic Valuation',
    description: 'Calculates the highest fair market price instantly based on real-time demand, condition, battery health, and original accessories.',
    iconName: 'Zap',
    badge: '60s Instant',
    stat: '98.4%',
    statLabel: 'Quote Accuracy'
  },
  {
    id: 'f2',
    title: 'Doorstep Instant UPI Payout',
    subtitle: 'Zero Waiting Cash',
    description: 'Our certified agent inspects your device at your doorstep and transfers money straight to your UPI or Bank Account before taking the phone.',
    iconName: 'Banknote',
    badge: 'Spot Payment',
    stat: '₹12.4Cr+',
    statLabel: 'Payouts Processed'
  },
  {
    id: 'f3',
    title: '3-Month Recell Warranty',
    subtitle: 'Certified Coverage',
    description: 'Every pre-owned phone sold passes a 32-point hardware check and is protected by our 3-Month warranty with free doorstep repair pickup.',
    iconName: 'ShieldCheck',
    badge: '100% Guaranteed',
    stat: '90 Days',
    statLabel: 'Hardware Warranty'
  },
  {
    id: 'f4',
    title: '7-Day Easy Returns & Refund',
    subtitle: 'Risk-Free Trial',
    description: 'Not satisfied with your refurbished phone? Return it within 7 days for a 100% full refund with reverse pickup at zero extra cost.',
    iconName: 'RotateCcw',
    badge: 'Zero Risk',
    stat: '7 Days',
    statLabel: 'Full Refund Window'
  },
  {
    id: 'f5',
    title: '32-Point Diagnostic Check',
    subtitle: 'Military Grade QC',
    description: 'Screen responsiveness, battery health percentage, camera sensors, mic, speaker, IMEI clean check, and board diagnostics verified by technicians.',
    iconName: 'SmartphoneCheck',
    badge: '55-Point QC',
    stat: '32+',
    statLabel: 'Hardware Checks'
  },
  {
    id: 'f6',
    title: 'Military-Grade Data Wipe',
    subtitle: 'Zero Data Leak Policy',
    description: 'Department of Defense level sanitization wipes all photos, accounts, and private files forever. You receive an official Data Wipe Certificate.',
    iconName: 'Lock',
    badge: '100% Secure',
    stat: '0%',
    statLabel: 'Data Leak Risk'
  },
  {
    id: 'f7',
    title: 'Express Doorstep Mobile Repair',
    subtitle: '30-Minute Screen & Battery',
    description: 'Cracked screen or quick battery drain? Certified technicians replace original parts right in front of you at home with 6 months warranty.',
    iconName: 'Wrench',
    badge: '30 Min Repair',
    stat: '15,000+',
    statLabel: 'Repairs Completed'
  },
  {
    id: 'f8',
    title: 'Zero-Landfill E-Waste Disposal',
    subtitle: 'Green Eco Commitment',
    description: 'We refurbish and recycle dead phones responsibly. Prevent toxic lithium e-waste from polluting soil and rivers with certified recycling.',
    iconName: 'Leaf',
    badge: 'Green Partner',
    stat: '45 Tons',
    statLabel: 'E-Waste Saved'
  }
];
