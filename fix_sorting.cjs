const fs = require('fs');

const file = 'src/data/initialData.ts';
let code = fs.readFileSync(file, 'utf8');

// Match everything from export const SEED_DEVICE_MODELS: DeviceModel[] = [ to ];
const startStr = "export const SEED_DEVICE_MODELS: DeviceModel[] = [";
const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf("];", startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  let arrayContent = code.substring(startIndex + startStr.length, endIndex);

  // We have a list of object strings. 
  // Let's use a regex to match each object: { id: ..., releaseYear: 202X, ... }
  // Since they might span multiple lines (mostly single lines), we can match the brackets.
  
  const objRegex = /\{[^}]*?\}/g;
  const objects = arrayContent.match(objRegex) || [];
  
  const newModels = [];
  const oldModels = [];
  
  objects.forEach(objStr => {
    if (objStr.includes('releaseYear: 2024') || objStr.includes('releaseYear: 2025') || objStr.includes('releaseYear: 2026')) {
      newModels.push(objStr);
    } else {
      oldModels.push(objStr);
    }
  });

  // Re-assemble
  // Note: we can just join them with commas and newlines
  const reassembled = '\n  ' + newModels.concat(oldModels).join(',\n  ') + '\n';
  
  code = code.substring(0, startIndex + startStr.length) + reassembled + code.substring(endIndex);
  
  fs.writeFileSync(file, code);
  console.log("Sorted array.");
} else {
  console.log("Could not find array.");
}

