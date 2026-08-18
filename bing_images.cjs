const fs = require('fs');

async function searchBingImages(query) {
  try {
    const response = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}`);
    const html = await response.text();
    const regex = /murl&quot;:&quot;(.*?)&quot;/g;
    let match;
    const images = [];
    while ((match = regex.exec(html)) !== null) {
      if (match[1].startsWith('http')) {
        images.push(match[1]);
      }
    }
    return [...new Set(images)].slice(0, 6);
  } catch(e) {
    return [];
  }
}

async function main() {
  const data = require('./src/data/seed_data.json');
  const updatedData = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const query = `${item.brand} ${item.model} mobile phone unboxing real photo`;
    console.log(`[${i+1}/${data.length}] Searching for: ${query}`);
    const images = await searchBingImages(query);
    updatedData.push({
      ...item,
      images: images.length > 0 ? images : item.images
    });
    console.log(`Found ${images.length} images for ${item.model}`);
    await new Promise(r => setTimeout(r, 300));
  }
  fs.writeFileSync('./src/data/seed_data.json', JSON.stringify(updatedData, null, 2));
  console.log('Done!');
}
main();
