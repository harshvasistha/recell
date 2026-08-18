const fs = require('fs');
const { image_search } = require('duckduckgo-images-api');

const data = require('./src/data/seed_data.json');

async function main() {
  const updatedData = [];
  for (const item of data) {
    const query = `${item.brand} ${item.model} mobile phone open box real photo`;
    console.log(`Searching for: ${query}`);
    try {
      const results = await image_search({ query, iterations: 1 });
      const images = results.slice(0, 6).map(r => r.image);
      updatedData.push({
        ...item,
        images: images.length > 0 ? images : item.images
      });
      console.log(`Found ${images.length} images for ${item.model}`);
    } catch (e) {
      console.log(`Error searching for ${item.model}: ${e.message}`);
      updatedData.push(item);
    }
  }
  
  fs.writeFileSync('./src/data/seed_data.json', JSON.stringify(updatedData, null, 2));
  console.log('Done!');
}

main();
