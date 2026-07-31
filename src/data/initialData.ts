import { DeviceModel, CatalogProduct, BuyQuoteRequest, Order, RepairJob, PricingRules, ReturnRequest, WarrantyClaim } from '../types';

export const LOCAL_SERVICED_PINCODES = ['250101', '250102', '250103', '250001', '250002', '250003', '250004'];

export const SEED_DEVICE_MODELS: DeviceModel[] = [
  // APPLE (IPHONE 11 TO IPHONE 17 PRO MAX)
  { id: 'm-ap-17pmax', brand: 'Apple', name: 'iPhone 17 Pro Max', variant: '256GB / 512GB', baseMarketPrice: 125000, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', releaseYear: 2026, popular: true },
  { id: 'm-ap-17pro', brand: 'Apple', name: 'iPhone 17 Pro', variant: '128GB / 256GB', baseMarketPrice: 108000, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', releaseYear: 2026, popular: true },
  { id: 'm-ap-17air', brand: 'Apple', name: 'iPhone 17 Air', variant: '128GB / 256GB', baseMarketPrice: 92000, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', releaseYear: 2026 },
  { id: 'm-ap-17', brand: 'Apple', name: 'iPhone 17', variant: '128GB / 256GB', baseMarketPrice: 82000, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', releaseYear: 2026, popular: true },
  
  { id: 'm-ap-16pmax', brand: 'Apple', name: 'iPhone 16 Pro Max', variant: '256GB / 512GB', baseMarketPrice: 105000, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', releaseYear: 2025, popular: true },
  { id: 'm-ap-16pro', brand: 'Apple', name: 'iPhone 16 Pro', variant: '128GB / 256GB', baseMarketPrice: 91000, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', releaseYear: 2025 },
  { id: 'm-ap-16plus', brand: 'Apple', name: 'iPhone 16 Plus', variant: '128GB / 256GB', baseMarketPrice: 72000, imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80', releaseYear: 2025 },
  { id: 'm-ap-16', brand: 'Apple', name: 'iPhone 16', variant: '128GB / 256GB', baseMarketPrice: 65000, imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80', releaseYear: 2025, popular: true },

  { id: 'm1', brand: 'Apple', name: 'iPhone 15 Pro Max', variant: '256GB', baseMarketPrice: 96000, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, popular: true },
  { id: 'm-ap-15pro', brand: 'Apple', name: 'iPhone 15 Pro', variant: '128GB', baseMarketPrice: 84000, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-ap-15plus', brand: 'Apple', name: 'iPhone 15 Plus', variant: '128GB', baseMarketPrice: 62000, imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-ap-15', brand: 'Apple', name: 'iPhone 15', variant: '128GB', baseMarketPrice: 56000, imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, popular: true },

  { id: 'm-ap-14pmax', brand: 'Apple', name: 'iPhone 14 Pro Max', variant: '128GB', baseMarketPrice: 72000, imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },
  { id: 'm-ap-14pro', brand: 'Apple', name: 'iPhone 14 Pro', variant: '128GB', baseMarketPrice: 63000, imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },
  { id: 'm-ap-14plus', brand: 'Apple', name: 'iPhone 14 Plus', variant: '128GB', baseMarketPrice: 51000, imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },
  { id: 'm2', brand: 'Apple', name: 'iPhone 14', variant: '128GB', baseMarketPrice: 47000, imageUrl: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80', releaseYear: 2022, popular: true },

  { id: 'm-ap-13pmax', brand: 'Apple', name: 'iPhone 13 Pro Max', variant: '128GB', baseMarketPrice: 58000, imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80', releaseYear: 2021 },
  { id: 'm-ap-13pro', brand: 'Apple', name: 'iPhone 13 Pro', variant: '128GB', baseMarketPrice: 50000, imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80', releaseYear: 2021 },
  { id: 'm-ap-13mini', brand: 'Apple', name: 'iPhone 13 mini', variant: '128GB', baseMarketPrice: 33000, imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80', releaseYear: 2021 },
  { id: 'm3', brand: 'Apple', name: 'iPhone 13', variant: '128GB', baseMarketPrice: 39000, imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80', releaseYear: 2021, popular: true },

  { id: 'm-ap-12pmax', brand: 'Apple', name: 'iPhone 12 Pro Max', variant: '128GB', baseMarketPrice: 44000, imageUrl: 'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=800&q=80', releaseYear: 2020 },
  { id: 'm-ap-12pro', brand: 'Apple', name: 'iPhone 12 Pro', variant: '128GB', baseMarketPrice: 37000, imageUrl: 'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=800&q=80', releaseYear: 2020 },
  { id: 'm-ap-12mini', brand: 'Apple', name: 'iPhone 12 mini', variant: '64GB', baseMarketPrice: 24000, imageUrl: 'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=800&q=80', releaseYear: 2020 },
  { id: 'm-ap-12', brand: 'Apple', name: 'iPhone 12', variant: '128GB', baseMarketPrice: 29000, imageUrl: 'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=800&q=80', releaseYear: 2020, popular: true },

  { id: 'm-ap-11pmax', brand: 'Apple', name: 'iPhone 11 Pro Max', variant: '256GB', baseMarketPrice: 32000, imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80', releaseYear: 2020 },
  { id: 'm-ap-11pro', brand: 'Apple', name: 'iPhone 11 Pro', variant: '128GB', baseMarketPrice: 27000, imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80', releaseYear: 2020 },
  { id: 'm-ap-11', brand: 'Apple', name: 'iPhone 11', variant: '128GB', baseMarketPrice: 21000, imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80', releaseYear: 2020, popular: true },
  { id: 'm-ap-se3', brand: 'Apple', name: 'iPhone SE (3rd Gen 2022)', variant: '128GB', baseMarketPrice: 19500, imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },

  // SAMSUNG (S SERIES, Z FOLD/FLIP, A SERIES, M SERIES)
  { id: 'm-sam-s26u', brand: 'Samsung', name: 'Galaxy S26 Ultra 5G', variant: '256GB / 512GB', baseMarketPrice: 110000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2026, popular: true },
  { id: 'm-sam-s25u', brand: 'Samsung', name: 'Galaxy S25 Ultra 5G', variant: '256GB / 512GB', baseMarketPrice: 94000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2025 },
  { id: 'm-sam-s25p', brand: 'Samsung', name: 'Galaxy S25+ 5G', variant: '256GB', baseMarketPrice: 72000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2025 },
  { id: 'm-sam-s25', brand: 'Samsung', name: 'Galaxy S25 5G', variant: '128GB', baseMarketPrice: 59000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2025 },

  { id: 'm-sam-s24u', brand: 'Samsung', name: 'Galaxy S24 Ultra 5G', variant: '256GB', baseMarketPrice: 79000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-sam-s24p', brand: 'Samsung', name: 'Galaxy S24+ 5G', variant: '256GB', baseMarketPrice: 58000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-sam-s24', brand: 'Samsung', name: 'Galaxy S24 5G', variant: '128GB', baseMarketPrice: 46000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },

  { id: 'm4', brand: 'Samsung', name: 'Galaxy S23 Ultra 5G', variant: '256GB', baseMarketPrice: 62000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, popular: true },
  { id: 'm-sam-s23p', brand: 'Samsung', name: 'Galaxy S23+ 5G', variant: '256GB', baseMarketPrice: 44000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-sam-s23', brand: 'Samsung', name: 'Galaxy S23 5G', variant: '128GB', baseMarketPrice: 38000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-sam-s23fe', brand: 'Samsung', name: 'Galaxy S23 FE 5G', variant: '128GB', baseMarketPrice: 27000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },

  { id: 'm-sam-s22u', brand: 'Samsung', name: 'Galaxy S22 Ultra 5G', variant: '256GB', baseMarketPrice: 42000, imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },
  { id: 'm5', brand: 'Samsung', name: 'Galaxy S22 5G', variant: '128GB', baseMarketPrice: 28000, imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },
  { id: 'm-sam-s21fe', brand: 'Samsung', name: 'Galaxy S21 FE 5G', variant: '128GB', baseMarketPrice: 19000, imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', releaseYear: 2021 },

  { id: 'm-sam-zfold6', brand: 'Samsung', name: 'Galaxy Z Fold 6 5G', variant: '256GB', baseMarketPrice: 115000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-sam-zfold5', brand: 'Samsung', name: 'Galaxy Z Fold 5 5G', variant: '256GB', baseMarketPrice: 82000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-sam-zflip6', brand: 'Samsung', name: 'Galaxy Z Flip 6 5G', variant: '256GB', baseMarketPrice: 65000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-sam-zflip5', brand: 'Samsung', name: 'Galaxy Z Flip 5 5G', variant: '256GB', baseMarketPrice: 48000, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },

  { id: 'm-sam-a55', brand: 'Samsung', name: 'Galaxy A55 5G', variant: '128GB / 256GB', baseMarketPrice: 26000, imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-sam-a54', brand: 'Samsung', name: 'Galaxy A54 5G', variant: '128GB', baseMarketPrice: 19500, imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-sam-a35', brand: 'Samsung', name: 'Galaxy A35 5G', variant: '128GB', baseMarketPrice: 18000, imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-sam-m55', brand: 'Samsung', name: 'Galaxy M55 5G', variant: '128GB', baseMarketPrice: 17500, imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },

  // ONEPLUS (NUMBERED SERIES, NORD, OPEN)
  { id: 'm-op-13', brand: 'OnePlus', name: 'OnePlus 13 5G', variant: '256GB / 512GB', baseMarketPrice: 58000, imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', releaseYear: 2025, popular: true },
  { id: 'm-op-12', brand: 'OnePlus', name: 'OnePlus 12 5G', variant: '256GB / 512GB', baseMarketPrice: 48000, imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-op-12r', brand: 'OnePlus', name: 'OnePlus 12R 5G', variant: '128GB / 256GB', baseMarketPrice: 31000, imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm6', brand: 'OnePlus', name: 'OnePlus 11 5G', variant: '256GB', baseMarketPrice: 34000, imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-op-11r', brand: 'OnePlus', name: 'OnePlus 11R 5G', variant: '128GB / 256GB', baseMarketPrice: 24500, imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, popular: true },
  { id: 'm-op-10pro', brand: 'OnePlus', name: 'OnePlus 10 Pro 5G', variant: '128GB', baseMarketPrice: 26000, imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },
  { id: 'm-op-10t', brand: 'OnePlus', name: 'OnePlus 10T 5G', variant: '128GB', baseMarketPrice: 22000, imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },
  { id: 'm-op-open', brand: 'OnePlus', name: 'OnePlus Open 5G', variant: '512GB', baseMarketPrice: 92000, imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm7', brand: 'OnePlus', name: 'OnePlus Nord 4 5G', variant: '256GB', baseMarketPrice: 24000, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-op-nord3', brand: 'OnePlus', name: 'OnePlus Nord 3 5G', variant: '128GB', baseMarketPrice: 17500, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-op-nordce4', brand: 'OnePlus', name: 'OnePlus Nord CE 4 5G', variant: '128GB', baseMarketPrice: 16800, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },

  // GOOGLE PIXEL (PIXEL 6 TO PIXEL 9 PRO XL)
  { id: 'm-px-9pmax', brand: 'Google', name: 'Pixel 9 Pro XL 5G', variant: '256GB / 512GB', baseMarketPrice: 78000, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-px-9pro', brand: 'Google', name: 'Pixel 9 Pro 5G', variant: '128GB / 256GB', baseMarketPrice: 69000, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-px-9', brand: 'Google', name: 'Pixel 9 5G', variant: '128GB', baseMarketPrice: 54000, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-px-8pro', brand: 'Google', name: 'Pixel 8 Pro 5G', variant: '128GB / 256GB', baseMarketPrice: 48000, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-px-8', brand: 'Google', name: 'Pixel 8 5G', variant: '128GB', baseMarketPrice: 38000, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-px-8a', brand: 'Google', name: 'Pixel 8a 5G', variant: '128GB', baseMarketPrice: 34000, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-px-7pro', brand: 'Google', name: 'Pixel 7 Pro 5G', variant: '128GB', baseMarketPrice: 32000, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },
  { id: 'm8', brand: 'Google', name: 'Pixel 7a 5G', variant: '128GB', baseMarketPrice: 23000, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-px-6a', brand: 'Google', name: 'Pixel 6a 5G', variant: '128GB', baseMarketPrice: 16500, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },
  { id: 'm-px-fold', brand: 'Google', name: 'Pixel Fold 5G', variant: '256GB', baseMarketPrice: 75000, imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },

  // XIAOMI / REDMI / POCO
  { id: 'm-xi-15pro', brand: 'Xiaomi', name: 'Xiaomi 15 Pro 5G', variant: '256GB / 512GB', baseMarketPrice: 62000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2025 },
  { id: 'm-xi-14u', brand: 'Xiaomi', name: 'Xiaomi 14 Ultra 5G', variant: '512GB', baseMarketPrice: 72000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-xi-14', brand: 'Xiaomi', name: 'Xiaomi 14 5G', variant: '256GB', baseMarketPrice: 46000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm9', brand: 'Xiaomi', name: 'Redmi Note 14 Pro+ 5G', variant: '256GB', baseMarketPrice: 22000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-xi-rn13pro', brand: 'Xiaomi', name: 'Redmi Note 13 Pro+ 5G', variant: '256GB', baseMarketPrice: 19500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-xi-rn13', brand: 'Xiaomi', name: 'Redmi Note 13 5G', variant: '128GB', baseMarketPrice: 12500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-xi-rn12pro', brand: 'Xiaomi', name: 'Redmi Note 12 Pro+ 5G', variant: '256GB', baseMarketPrice: 15000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-xi-13c', brand: 'Xiaomi', name: 'Redmi 13C 5G', variant: '128GB', baseMarketPrice: 8500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },

  // VIVO (X SERIES, V SERIES, T SERIES, Y SERIES)
  { id: 'm-vv-x100pro', brand: 'Vivo', name: 'Vivo X100 Pro 5G', variant: '512GB', baseMarketPrice: 64000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-vv-x100', brand: 'Vivo', name: 'Vivo X100 5G', variant: '256GB', baseMarketPrice: 48000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-vv-v30pro', brand: 'Vivo', name: 'Vivo V30 Pro 5G', variant: '256GB', baseMarketPrice: 32000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-vv-v30', brand: 'Vivo', name: 'Vivo V30 5G', variant: '128GB', baseMarketPrice: 24000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-vv-t3pro', brand: 'Vivo', name: 'Vivo T3 Pro 5G', variant: '128GB / 256GB', baseMarketPrice: 19500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-vv-t3', brand: 'Vivo', name: 'Vivo T3 5G', variant: '128GB', baseMarketPrice: 14500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-vv-t2pro', brand: 'Vivo', name: 'Vivo T2 Pro 5G', variant: '128GB', baseMarketPrice: 15500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-vv-y200', brand: 'Vivo', name: 'Vivo Y200 5G', variant: '128GB', baseMarketPrice: 13500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },

  // OPPO (FIND SERIES, RENO SERIES, F SERIES)
  { id: 'm-op-findn3', brand: 'Oppo', name: 'Oppo Find N3 Flip 5G', variant: '256GB', baseMarketPrice: 68000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, popular: true },
  { id: 'm-op-reno12pro', brand: 'Oppo', name: 'Oppo Reno 12 Pro 5G', variant: '256GB / 512GB', baseMarketPrice: 31000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-op-reno12', brand: 'Oppo', name: 'Oppo Reno 12 5G', variant: '256GB', baseMarketPrice: 24500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-op-reno11pro', brand: 'Oppo', name: 'Oppo Reno 11 Pro 5G', variant: '256GB', baseMarketPrice: 23000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-op-f27pro', brand: 'Oppo', name: 'Oppo F27 Pro+ 5G', variant: '128GB / 256GB', baseMarketPrice: 21500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-op-f25pro', brand: 'Oppo', name: 'Oppo F25 Pro 5G', variant: '128GB', baseMarketPrice: 17500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-op-a79', brand: 'Oppo', name: 'Oppo A79 5G', variant: '128GB', baseMarketPrice: 12800, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },

  // REALME (GT SERIES, NUMBERED PRO+ SERIES, NARZO, P SERIES)
  { id: 'm-rm-gt6', brand: 'Realme', name: 'Realme GT 6 5G', variant: '256GB / 512GB', baseMarketPrice: 34000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-rm-gt6t', brand: 'Realme', name: 'Realme GT 6T 5G', variant: '128GB / 256GB', baseMarketPrice: 25500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm10', brand: 'Realme', name: 'Realme 13 Pro+ 5G', variant: '256GB', baseMarketPrice: 24000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-rm-12prop', brand: 'Realme', name: 'Realme 12 Pro+ 5G', variant: '256GB', baseMarketPrice: 21000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-rm-11pro', brand: 'Realme', name: 'Realme 11 Pro+ 5G', variant: '256GB', baseMarketPrice: 17500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-rm-narzo70', brand: 'Realme', name: 'Realme Narzo 70 Pro 5G', variant: '128GB', baseMarketPrice: 14500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-rm-p1pro', brand: 'Realme', name: 'Realme P1 Pro 5G', variant: '128GB', baseMarketPrice: 15000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },

  // MOTOROLA (EDGE SERIES, RAZR FOLDABLES, G SERIES)
  { id: 'm-moto-edge50u', brand: 'Motorola', name: 'Moto Edge 50 Ultra 5G', variant: '512GB', baseMarketPrice: 46000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-moto-edge50', brand: 'Motorola', name: 'Moto Edge 50 Pro 5G', variant: '256GB', baseMarketPrice: 28000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-moto-edge50f', brand: 'Motorola', name: 'Moto Edge 50 Fusion 5G', variant: '128GB / 256GB', baseMarketPrice: 20500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-moto-[#0052FF]edge40', brand: 'Motorola', name: 'Moto Edge 40 5G', variant: '256GB', baseMarketPrice: 19000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-moto-razr50', brand: 'Motorola', name: 'Razr 50 Ultra 5G', variant: '512GB', baseMarketPrice: 72000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-moto-g84', brand: 'Motorola', name: 'Moto G84 5G', variant: '256GB', baseMarketPrice: 13800, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, popular: true },

  // NOTHING & CMF
  { id: 'm-nthg-2aplus', brand: 'Nothing', name: 'Nothing Phone (2a) Plus 5G', variant: '256GB', baseMarketPrice: 22500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-nthg-2a', brand: 'Nothing', name: 'Nothing Phone (2a) 5G', variant: '128GB / 256GB', baseMarketPrice: 19000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-nthg-2', brand: 'Nothing', name: 'Nothing Phone (2)', variant: '256GB / 512GB', baseMarketPrice: 32000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, popular: true },
  { id: 'm-nthg-1', brand: 'Nothing', name: 'Nothing Phone (1)', variant: '128GB / 256GB', baseMarketPrice: 18500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2022 },
  { id: 'm-cmf-1', brand: 'Nothing', name: 'CMF Phone 1 5G', variant: '128GB', baseMarketPrice: 12500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },

  // POCO (F SERIES, X SERIES, M SERIES)
  { id: 'm-poco-f6pro', brand: 'Poco', name: 'POCO F6 Pro 5G', variant: '256GB / 512GB', baseMarketPrice: 32000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-poco-f6', brand: 'Poco', name: 'POCO F6 5G', variant: '256GB', baseMarketPrice: 24500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-poco-x6pro', brand: 'Poco', name: 'POCO X6 Pro 5G', variant: '256GB / 512GB', baseMarketPrice: 21000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-poco-x6', brand: 'Poco', name: 'POCO X6 5G', variant: '128GB / 256GB', baseMarketPrice: 15500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-poco-m6pro', brand: 'Poco', name: 'POCO M6 Pro 5G', variant: '128GB', baseMarketPrice: 10500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },

  // IQOO (NUMBERED GAMING SERIES, NEO SERIES, Z SERIES)
  { id: 'm-iqoo-12', brand: 'iQOO', name: 'iQOO 12 5G', variant: '256GB / 512GB', baseMarketPrice: 46000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-iqoo-neo9pro', brand: 'iQOO', name: 'iQOO Neo 9 Pro 5G', variant: '128GB / 256GB', baseMarketPrice: 31000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-iqoo-neo7pro', brand: 'iQOO', name: 'iQOO Neo 7 Pro 5G', variant: '128GB', baseMarketPrice: 22000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-iqoo-z9pro', brand: 'iQOO', name: 'iQOO Z9 Turbo / Pro 5G', variant: '128GB / 256GB', baseMarketPrice: 18500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-iqoo-z9', brand: 'iQOO', name: 'iQOO Z9 5G', variant: '128GB', baseMarketPrice: 14500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },

  // ASUS / ROG
  { id: 'm-asus-rog8p', brand: 'Asus', name: 'ROG Phone 8 Pro', variant: '512GB / 1TB', baseMarketPrice: 75000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-asus-rog8', brand: 'Asus', name: 'ROG Phone 8 5G', variant: '256GB', baseMarketPrice: 61000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-asus-rog7', brand: 'Asus', name: 'ROG Phone 7 Ultimate', variant: '512GB', baseMarketPrice: 55000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-asus-zen10', brand: 'Asus', name: 'Zenfone 10 5G', variant: '256GB', baseMarketPrice: 38000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },

  // HONOR
  { id: 'm-honor-200p', brand: 'Honor', name: 'Honor 200 Pro 5G', variant: '512GB', baseMarketPrice: 38000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-honor-200', brand: 'Honor', name: 'Honor 200 5G', variant: '256GB', baseMarketPrice: 28000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-honor-m6pro', brand: 'Honor', name: 'Honor Magic 6 Pro 5G', variant: '512GB', baseMarketPrice: 68000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 },
  { id: 'm-honor-x9b', brand: 'Honor', name: 'Honor X9b 5G', variant: '256GB', baseMarketPrice: 19500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },

  // INFINIX / TECNO
  { id: 'm-inf-gt20', brand: 'Infinix', name: 'Infinix GT 20 Pro 5G', variant: '256GB', baseMarketPrice: 18500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024, popular: true },
  { id: 'm-inf-zero30', brand: 'Infinix', name: 'Infinix Zero 30 5G', variant: '256GB', baseMarketPrice: 16000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023 },
  { id: 'm-tec-phantom', brand: 'Infinix', name: 'Tecno Phantom V Fold 5G', variant: '512GB', baseMarketPrice: 58000, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2023, popular: true },
  { id: 'm-tec-camon30', brand: 'Infinix', name: 'Tecno Camon 30 Pro 5G', variant: '256GB', baseMarketPrice: 17500, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', releaseYear: 2024 }
];

export const DEFAULT_PRICING_RULES: PricingRules = {
  conditionMultipliers: {
    screen: {
      flawless: 1.0,
      minor_scratches: 0.92,
      cracked: 0.72,
      display_fault: 0.55
    },
    body: {
      flawless: 1.0,
      minor_scratches: 0.95,
      dents: 0.82,
      broken_back: 0.65
    },
    battery: {
      above_85: 1.0,
      '75_to_85': 0.92,
      below_75: 0.82
    }
  },
  deductions: {
    touchFault: 3500,
    cameraFault: 3000,
    speakerFault: 1200,
    chargingPortFault: 1500,
    missingBox: 600,
    missingCharger: 900
  },
  demandFactors: {
    pincode250101Radius: 1.05, // 5% bonus quote for local high-demand town
    defaultPanIndia: 1.00
  },
  minMarginPercent: 18
};

export const SEED_CATALOG: CatalogProduct[] = [
  {
    id: 'cat-1',
    title: 'Apple iPhone 14 (128GB) - Midnight',
    brand: 'Apple',
    model: 'iPhone 14',
    storage: '128GB',
    color: 'Midnight Black',
    originalPrice: 69900,
    refurbPrice: 48999,
    conditionGrade: 'Superb',
    warrantyMonths: 3,
    batteryHealthPercent: 91,
    images: [
      'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 1,
    serialImei: '358921104829102',
    inspectionPassed: true,
    description: 'Certified 55-point inspected. Zero visible scratches on screen, minor hair-line mark on camera ring. Original battery health at 91%. Comes with Recell 3-Month warranty card and high-speed braided USB-C cable.',
    boxChargerIncluded: true,
    specs: {
      screen: '6.1-inch Super Retina XDR OLED',
      processor: 'A15 Bionic chip',
      ram: '6GB RAM',
      camera: 'Dual 12MP System with Photonic Engine'
    }
  },
  {
    id: 'cat-2',
    title: 'Samsung Galaxy S23 Ultra 5G (256GB) - Green',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    storage: '256GB',
    color: 'Botanic Green',
    originalPrice: 124999,
    refurbPrice: 68500,
    conditionGrade: 'Like New',
    warrantyMonths: 3,
    batteryHealthPercent: 95,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 1,
    serialImei: '357102948201948',
    inspectionPassed: true,
    description: 'Mint condition S23 Ultra with S-Pen intact. Pristine AMOLED 120Hz display with zero burn-in. Includes original Samsung 25W fast charger & box.',
    boxChargerIncluded: true,
    specs: {
      screen: '6.8-inch Dynamic AMOLED 2X 120Hz',
      processor: 'Snapdragon 8 Gen 2 for Galaxy',
      ram: '12GB RAM',
      camera: '200MP Quad Camera with 100x Space Zoom'
    }
  },
  {
    id: 'cat-3',
    title: 'Apple iPhone 13 (128GB) - Starlight',
    brand: 'Apple',
    model: 'iPhone 13',
    storage: '128GB',
    color: 'Starlight White',
    originalPrice: 59900,
    refurbPrice: 38499,
    conditionGrade: 'Good',
    warrantyMonths: 3,
    batteryHealthPercent: 86,
    images: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 1,
    serialImei: '351029384756102',
    inspectionPassed: true,
    description: 'Fully functional, tested and certified. Tiny paint chip on bottom edge, screen is 100% scratch-free under tempered glass. Battery checked & optimized.',
    boxChargerIncluded: false,
    specs: {
      screen: '6.1-inch Super Retina XDR',
      processor: 'A15 Bionic chip',
      ram: '4GB RAM',
      camera: '12MP Dual Camera with Cinematic mode'
    }
  },
  {
    id: 'cat-4',
    title: 'OnePlus 11 5G (256GB) - Titan Black',
    brand: 'OnePlus',
    model: 'OnePlus 11 5G',
    storage: '256GB',
    color: 'Titan Black',
    originalPrice: 61999,
    refurbPrice: 34999,
    conditionGrade: 'Superb',
    warrantyMonths: 3,
    batteryHealthPercent: 93,
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 1,
    serialImei: '864920194830192',
    inspectionPassed: true,
    description: 'Blazing fast Snapdragon 8 Gen 2 performer. Includes original 100W SuperVOOC charger for 0-100% in 25 mins. Hasselblad camera tuned.',
    boxChargerIncluded: true,
    specs: {
      screen: '6.7-inch 2K 120Hz Fluid AMOLED',
      processor: 'Snapdragon 8 Gen 2',
      ram: '16GB RAM',
      camera: '50MP Hasselblad Triple Camera'
    }
  },
  {
    id: 'cat-5',
    title: 'Google Pixel 7a 5G (128GB) - Sea Blue',
    brand: 'Google',
    model: 'Pixel 7a 5G',
    storage: '128GB',
    color: 'Sea Light Blue',
    originalPrice: 43999,
    refurbPrice: 23999,
    conditionGrade: 'Superb',
    warrantyMonths: 3,
    batteryHealthPercent: 90,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 1,
    serialImei: '354091827364102',
    inspectionPassed: true,
    description: 'Clean Android experience with computational photography brilliance. Tested & verified battery and wireless charging module.',
    boxChargerIncluded: true,
    specs: {
      screen: '6.1-inch 90Hz OLED',
      processor: 'Google Tensor G2',
      ram: '8GB RAM',
      camera: '64MP Main + 13MP Ultrawide with Magic Eraser'
    }
  },
  {
    id: 'cat-6',
    title: 'Redmi Note 13 Pro 5G (256GB) - Coral Purple',
    brand: 'Xiaomi',
    model: 'Redmi Note 13 Pro 5G',
    storage: '256GB',
    color: 'Coral Purple',
    originalPrice: 28999,
    refurbPrice: 16800,
    conditionGrade: 'Like New',
    warrantyMonths: 3,
    batteryHealthPercent: 97,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 1,
    serialImei: '862049182730192',
    inspectionPassed: true,
    description: '200MP OIS Camera with 1.5K 120Hz curved AMOLED. Barely used device bought in 2024, traded in for iPhone upgrade.',
    boxChargerIncluded: true,
    specs: {
      screen: '6.67-inch 1.5K AMOLED 120Hz',
      processor: 'Snapdragon 7s Gen 2',
      ram: '8GB RAM',
      camera: '200MP OIS Ultra-Clear Camera'
    }
  }
];

export const SEED_BUY_REQUESTS: BuyQuoteRequest[] = [
  {
    id: 'REQ-250101-089',
    date: '2026-07-30T10:30:00Z',
    modelId: 'm3',
    modelName: 'iPhone 13 (128GB)',
    brand: 'Apple',
    sellerName: 'Amit Sharma',
    sellerPhone: '+91 98765 43210',
    address: 'H.No 42, Civil Lines, Near Railway Station',
    pincode: '250101',
    isLocalRadius: true,
    conditionAnswers: {
      screenCondition: 'flawless',
      bodyCondition: 'minor_scratches',
      batteryHealth: 'above_85',
      touchWorking: true,
      cameraWorking: true,
      speakerWorking: true,
      chargingPortWorking: true,
      boxIncluded: true,
      chargerIncluded: true,
      pincode: '250101',
      photos: {
        front: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=400&q=80'
      }
    },
    roughQuoteMin: 32500,
    roughQuoteMax: 34000,
    scheduledDate: '2026-07-31',
    scheduledSlot: '02:00 PM - 04:00 PM',
    upiId: 'amitsharma@okicici',
    status: 'agent_inspecting',
    assignedAgent: 'Agent Rajesh (Meerut Central Hub)',
    photos: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'REQ-250101-090',
    date: '2026-07-31T08:15:00Z',
    modelId: 'm6',
    modelName: 'OnePlus 11 5G (256GB)',
    brand: 'OnePlus',
    sellerName: 'Pooja Verma',
    sellerPhone: '+91 91234 56789',
    address: 'Shop 12, Shastri Nagar Main Market',
    pincode: '250102',
    isLocalRadius: true,
    conditionAnswers: {
      screenCondition: 'minor_scratches',
      bodyCondition: 'dents',
      batteryHealth: '75_to_85',
      touchWorking: true,
      cameraWorking: true,
      speakerWorking: true,
      chargingPortWorking: true,
      boxIncluded: false,
      chargerIncluded: true,
      pincode: '250102',
      photos: {}
    },
    roughQuoteMin: 24000,
    roughQuoteMax: 26500,
    scheduledDate: '2026-08-01',
    scheduledSlot: '11:00 AM - 01:00 PM',
    upiId: 'pooja.verma@paytm',
    status: 'pickup_scheduled',
    assignedAgent: 'Agent Sunil (South Pincode Sector)',
    photos: []
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-IN-80249',
    date: '2026-07-29T14:20:00Z',
    customerName: 'Karan Malhotra',
    customerPhone: '+91 99887 76655',
    customerEmail: 'karan.m@gmail.com',
    shippingAddress: 'Flat 402, Sunshine Heights, Koramangala',
    pincode: '560034',
    city: 'Bengaluru',
    state: 'Karnataka',
    items: [
      {
        productId: 'cat-2',
        title: 'Samsung Galaxy S23 Ultra 5G (256GB)',
        refurbPrice: 68500,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80',
        serialImei: '357102948201948',
        warrantyMonths: 3
      }
    ],
    totalAmount: 68500,
    paymentMethod: 'Razorpay UPI',
    paymentStatus: 'Paid',
    orderStatus: 'In Transit',
    courierPartner: 'Delhivery Express',
    trackingNumber: 'DEL9201948102',
    trackingHistory: [
      { time: '2026-07-29 15:00', status: 'Order Confirmed & Payment Verified', location: 'Recell Hub Meerut 250101' },
      { time: '2026-07-30 09:30', status: '55-Point Inspection Passed & Sealed Box Packed', location: 'Meerut Dispatch Hub' },
      { time: '2026-07-30 18:00', status: 'In Transit - Departure Scan', location: 'Delhi Air Cargo Hub' },
      { time: '2026-07-31 06:10', status: 'Arrived at Destination Sorting Center', location: 'Bengaluru Hub' }
    ],
    returnWindowExpiry: '2026-08-07',
    warrantyExpiry: '2026-10-29'
  }
];

export const SEED_REPAIR_JOBS: RepairJob[] = [
  {
    id: 'REP-2026-041',
    source: 'Buy Request',
    referenceId: 'REQ-250101-085',
    deviceName: 'iPhone 12 (128GB) - Blue',
    serialImei: '359018273641029',
    defectSummary: 'Battery degradation (72% health) + Charging port loose contact',
    technician: 'Ramesh Tech (L2 Specialist)',
    status: 'Repairing',
    estimatedCost: 2200,
    sparePartsUsed: ['Original Grade iPhone 12 Battery Module', 'Lightning Port Flex Cable'],
    createdDate: '2026-07-29',
    qcChecklist: {
      displayOk: true,
      touchOk: true,
      batteryOk: false,
      cameraOk: true,
      chargingOk: false,
      speakersOk: true
    }
  },
  {
    id: 'REP-2026-042',
    source: 'Warranty Claim',
    referenceId: 'ORD-IN-79912',
    deviceName: 'OnePlus Nord 2 (128GB)',
    serialImei: '861029384756102',
    defectSummary: 'Earpiece speaker low volume',
    technician: 'Vikram Tech (Audio & Board Lead)',
    status: 'Diagnosing',
    estimatedCost: 650,
    sparePartsUsed: ['Earpiece Mesh & Speaker Assembly'],
    createdDate: '2026-07-30',
    qcChecklist: {
      displayOk: true,
      touchOk: true,
      batteryOk: true,
      cameraOk: true,
      chargingOk: true,
      speakersOk: false
    }
  }
];

export const SEED_RETURN_REQUESTS: ReturnRequest[] = [
  {
    id: 'RET-1092',
    orderId: 'ORD-IN-79880',
    customerName: 'Rahul Verma',
    itemTitle: 'Redmi Note 12 Pro (256GB)',
    reason: 'Color slightly different than expected',
    details: 'Received within 7 days. Device is untouched, requesting refund.',
    status: 'Reverse Pickup Scheduled',
    reverseTrackingId: 'SHIP-REV-90182',
    date: '2026-07-28'
  }
];

export const SEED_WARRANTY_CLAIMS: WarrantyClaim[] = [
  {
    id: 'WAR-3021',
    orderId: 'ORD-IN-79912',
    serialImei: '861029384756102',
    customerName: 'Deepak Joshi',
    customerPhone: '+91 97654 32109',
    issueType: 'Speaker/Mic',
    issueDetails: 'Earpiece volume dropped significantly after 2 weeks of use.',
    status: 'In Repair Queue',
    repairJobId: 'REP-2026-042',
    reverseTrackingId: 'SHIP-WAR-88210',
    date: '2026-07-30'
  }
];
