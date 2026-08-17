const fs = require('fs');

let serviceCode = fs.readFileSync('src/lib/googleDriveService.ts', 'utf8');

serviceCode = serviceCode.replace(
  /let batteryHealthPercent = 92;\n\s*const batteryMatch = lower\.match\(\/battery\.\*\?\\\(\\d\{2\}\\\)\\s\*%\\\/i\) \|\| lower\.match\(\/\\\(\\d\{2\}\\\)\\s\*%\\\/\);\n\s*if \(batteryMatch\) \{\n\s*const batt = parseInt\(batteryMatch\[1\], 10\);\n\s*if \(batt >= 70 && batt <= 100\) batteryHealthPercent = batt;\n\s*\}/g,
  `let batteryHealthPercent: number | undefined = undefined;
  const batteryMatch = lower.match(/battery.*?(\\d{2})\\s*%/i) || lower.match(/(\\d{2})\\s*%/);
  if (batteryMatch) {
    const batt = parseInt(batteryMatch[1], 10);
    if (batt >= 50 && batt <= 100) batteryHealthPercent = batt;
  }`
);

fs.writeFileSync('src/lib/googleDriveService.ts', serviceCode);
console.log('googleDriveService updated for battery');
