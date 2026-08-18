const { search } = require('duck-duck-scrape');
const fs = require('fs');

async function getImages(query) {
  try {
    const searchResults = await search(query + ' phone', { safeSearch: 'off' });
    const urls = [];
    if (searchResults && searchResults.images) {
      for (const img of searchResults.images) {
        if (urls.length >= 6) break;
        if (img.image && img.image.startsWith('http')) {
          urls.push(img.image);
        }
      }
    }
    return urls;
  } catch (err) {
    console.error('Error fetching ' + query, err.message);
    return [];
  }
}

async function run() {
  const models = [
    "Redmi 13C 5G",
    "Redmi Note 13 5G",
    "Redmi Note 13 Pro 5G",
    "Redmi Note 14 5G",
    "Redmi Note 15 5G",
    "Redmi Note 14 Pro 5G",
    "Redmi Note 15 Pro 5G",
    "Redmi Note 14 Pro+ 5G",
    "Redmi Note 15 Pro+ 5G",
    "Xiaomi 17T",
    "Xiaomi 17",
    "Xiaomi 17 Ultra",
    "Oppo A6X",
    "Oppo K14X",
    "Oppo A6s",
    "Oppo A6",
    "Oppo A6 PRO",
    "Oppo FIND X9",
    "Oppo RENO15",
    "Oppo RENO15 PRO",
    "Oppo F33 PRO",
    "Oppo F33",
    "Oppo FIND X9s",
    "Oppo RENO16",
    "Oppo PAD 5",
    "Oppo K14"
  ];
  const dict = {};
  for (const m of models) {
    console.log('Fetching', m);
    const urls = await getImages(m);
    dict[m] = urls;
    await new Promise(r => setTimeout(r, 1000));
  }
  fs.writeFileSync('images_map.json', JSON.stringify(dict, null, 2));
  console.log('Done!');
}
run();
