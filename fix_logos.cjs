const fs = require('fs');

const svgMap = {
  'apple': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='%23000' d='M50.4 46.5c.2-7.2 5.9-10.6 6.1-10.8-3.4-4.9-8.6-5.6-10.5-5.7-4.5-.4-8.8 2.6-11.1 2.6-2.3 0-5.8-2.6-9.5-2.5-4.8.1-9.3 2.8-11.8 7.1-5.1 8.8-1.3 21.8 3.6 28.9 2.4 3.5 5.2 7.4 9 7.3 3.6-.1 5-2.3 9.4-2.3 4.4 0 5.6 2.3 9.4 2.3 4 0 6.4-3.5 8.7-6.9 2.8-4 3.9-7.9 4-8.1-.1-.1-7.5-2.9-7.3-11.9zM48 23.9c2-2.4 3.3-5.7 2.9-9.1-3 .1-6.5 2-8.5 4.4-1.8 1.9-3.3 5.3-2.9 8.6 3.4.3 6.6-1.6 8.5-3.9z'/></svg>",
  'samsung': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><ellipse cx='50' cy='50' rx='45' ry='25' fill='%231428a0'/><text x='50' y='57' font-family='Arial, sans-serif' font-weight='bold' font-size='18' fill='%23fff' text-anchor='middle'>SAMSUNG</text></svg>",
  'oneplus': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='80' height='80' x='10' y='10' rx='10' fill='%23EB0029'/><text x='50' y='65' font-family='Arial, sans-serif' font-weight='bold' font-size='45' fill='%23fff' text-anchor='middle'>1+</text></svg>",
  'xiaomi': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='80' height='80' x='10' y='10' rx='20' fill='%23FF6900'/><text x='50' y='65' font-family='Arial, sans-serif' font-weight='bold' font-size='45' fill='%23fff' text-anchor='middle'>mi</text></svg>",
  'vivo': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='30' fill='%23415FFF' text-anchor='middle'>vivo</text></svg>",
  'oppo': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='30' fill='%2300665E' text-anchor='middle'>oppo</text></svg>",
  'realme': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='80' height='80' x='10' y='10' fill='%23FFC200'/><text x='50' y='57' font-family='Arial, sans-serif' font-weight='bold' font-size='20' fill='%23000' text-anchor='middle'>realme</text></svg>",
  'google': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='65' font-family='Arial, sans-serif' font-weight='bold' font-size='45' fill='%234285F4' text-anchor='middle'>G</text></svg>",
  'motorola': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%230014C7'/><text x='50' y='65' font-family='Arial, sans-serif' font-weight='bold' font-size='40' fill='%23fff' text-anchor='middle'>M</text></svg>",
  'nothing': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='80' height='80' x='10' y='10' fill='%23000'/><text x='50' y='55' font-family='Courier New, monospace' font-weight='bold' font-size='14' fill='%23fff' text-anchor='middle' letter-spacing='2'>NOTHING</text></svg>",
  'poco': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='30' fill='%23FFCC00' text-anchor='middle' stroke='%23000' stroke-width='2'>POCO</text></svg>",
  'iqoo': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-style='italic' font-size='30' fill='%23000' text-anchor='middle'>iQOO</text></svg>",
  'asus': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='30' fill='%2300539B' text-anchor='middle'>ASUS</text></svg>",
  'honor': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='28' fill='%23000' text-anchor='middle' letter-spacing='1'>HONOR</text></svg>",
  'infinix': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='60' font-family='Arial, sans-serif' font-weight='bold' font-size='26' fill='%2300874E' text-anchor='middle'>Infinix</text></svg>"
};

let file = 'src/data/brandsData.ts';
let code = fs.readFileSync(file, 'utf8');

// The code currently has logoUrl: 'https://logo.clearbit.com/apple.com'
// We map over svgMap and replace the logoUrl line for that brand.
for (const [id, svgStr] of Object.entries(svgMap)) {
  // Regex to match the logoUrl line for the specific brand by its text or domain
  // Clearbit domain mapping: apple.com, samsung.com, oneplus.com, mi.com, vivo.com, oppo.com, realme.com, google.com, motorola.com, nothing.tech, po.co, iqoo.com, asus.com, hihonor.com, infinixmobility.com
  let domain = id + '.com';
  if (id === 'xiaomi') domain = 'mi.com';
  if (id === 'nothing') domain = 'nothing.tech';
  if (id === 'poco') domain = 'po.co';
  if (id === 'honor') domain = 'hihonor.com';
  if (id === 'infinix') domain = 'infinixmobility.com';

  const regex = new RegExp(`logoUrl:\\s*'https://logo\\.clearbit\\.com/${domain}'`, 'g');
  code = code.replace(regex, `logoUrl: "${svgStr}"`);
}

fs.writeFileSync(file, code);
console.log("Logos updated.");
