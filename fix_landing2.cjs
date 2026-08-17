const fs = require('fs');

let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const openBoxArrStr = `{[
            {
              id: 'ob-op12',
              name: 'OnePlus 12 5G',
              variant: '256GB - Flowy Emerald',
              originalPrice: 64999,
              sellPrice: 48500,
              age: '12 Days Old',
              warranty: '11M OnePlus Warranty',
              img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
              brand: 'OnePlus',
              badge: '5G'
            },
            {
              id: 'ob-s24u',
              name: 'Samsung Galaxy S24 Ultra',
              variant: '512GB - Titanium Gray',
              originalPrice: 139999,
              sellPrice: 108000,
              age: '20 Days Old',
              warranty: '11M Samsung Warranty',
              img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
              brand: 'Samsung',
              badge: 'AI PHONE'
            },
            {
              id: 'ob-n4',
              name: 'OnePlus Nord 4 5G',
              variant: '256GB - Obsidian Midnight',
              originalPrice: 32999,
              sellPrice: 24999,
              age: '7 Days Old',
              warranty: '11M OnePlus Warranty',
              img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
              brand: 'OnePlus',
              badge: 'CHARGER'
            },
            {
              id: 'ob-ip15pm',
              name: 'iPhone 15 Pro Max',
              variant: '256GB - Natural Titanium',
              originalPrice: 159900,
              sellPrice: 104999,
              age: '6 Days Old',
              warranty: '11M Official Apple Warranty',
              img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
              brand: 'Apple',
              badge: 'SMARTPHONE'
            }
          ]`;

const refurbishedArrStr = `{[
            {
              id: 'm-ip15pm',
              name: 'iPhone 15 Pro Max',
              variant: '256GB - Natural Titanium',
              originalPrice: 159900,
              sellPrice: 94500,
              grade: 'Superb',
              battery: '94%',
              img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
              brand: 'Apple'
            },
            {
              id: 'm-ip14',
              name: 'iPhone 14',
              variant: '128GB - Midnight Black',
              originalPrice: 69900,
              sellPrice: 48999,
              grade: 'Superb',
              battery: '91%',
              img: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80',
              brand: 'Apple'
            },
            {
              id: 'm-s23u',
              name: 'Samsung Galaxy S23 Ultra',
              variant: '256GB - Phantom Black',
              originalPrice: 124999,
              sellPrice: 68000,
              grade: 'Superb',
              battery: '95%',
              img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
              brand: 'Samsung'
            },
            {
              id: 'm-op11',
              name: 'OnePlus 11 5G',
              variant: '128GB - Titan Black',
              originalPrice: 56999,
              sellPrice: 34500,
              grade: 'Good',
              battery: '88%',
              img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
              brand: 'OnePlus'
            }
          ]`;

code = code.replace(openBoxArrStr, `(catalog || []).filter(p => p.conditionGrade === 'Open Box (5-10 Days)').slice(0, 4).map(item => ({
  id: item.id, name: item.title, variant: item.storage + ' - ' + item.color, originalPrice: item.originalPrice, sellPrice: item.refurbPrice,
  age: 'Open Box', warranty: item.warrantyMonths + 'M Warranty', img: item.images[0], brand: item.brand, badge: 'DEAL'
}))`);

code = code.replace(refurbishedArrStr, `(catalog || []).filter(p => p.conditionGrade !== 'Open Box (5-10 Days)').slice(0, 4).map(item => ({
  id: item.id, name: item.title, variant: item.storage + ' - ' + item.color, originalPrice: item.originalPrice, sellPrice: item.refurbPrice,
  grade: item.conditionGrade, battery: item.batteryHealthPercent ? item.batteryHealthPercent + '%' : 'Pass', img: item.images[0], brand: item.brand
}))`);

fs.writeFileSync('src/components/LandingPage.tsx', code);
