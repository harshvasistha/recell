const fs = require('fs');

let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Add import if needed
if (!code.includes('import { CatalogProduct }')) {
  code = code.replace("import React from 'react';", "import React from 'react';\nimport { CatalogProduct } from '../types';");
}

code = code.replace("interface LandingPageProps {", "interface LandingPageProps {\n  catalog: CatalogProduct[];");
code = code.replace("export const LandingPage: React.FC<LandingPageProps> = ({", "export const LandingPage: React.FC<LandingPageProps> = ({\n  catalog,");
code = code.replace("export const LandingPage: React.FC<LandingPageProps> = ({", "export const LandingPage: React.FC<LandingPageProps> = ({");

// Open Box section
const openBoxRegex = /\{\[\s*\{\s*id: 'ob-op12'[\s\S]*?\]\.map\(\(item\) => \(/;
code = code.replace(openBoxRegex, `
          {catalog.filter(p => p.conditionGrade === 'Open Box (5-10 Days)').slice(0, 4).map((item) => (
`);

code = code.replace(/<div\s*key=\{item\.id\}\s*onClick=\{onStartBuy\}/g, `<div \n              key={item.id}\n              onClick={onStartBuy}`);
code = code.replace(/\{item\.img\}/g, `{item.images[0]}`);
code = code.replace(/\{item\.name\}/g, `{item.title}`);
code = code.replace(/\{item\.variant\}/g, `{item.storage} - {item.color}`);
code = code.replace(/\{item\.warranty\}/g, `{item.warrantyMonths}M Warranty`);
code = code.replace(/\{item\.originalPrice\.toLocaleString\('en-IN'\)\}/g, `{item.originalPrice.toLocaleString('en-IN')}`);
code = code.replace(/\{item\.sellPrice\.toLocaleString\('en-IN'\)\}/g, `{item.refurbPrice.toLocaleString('en-IN')}`);

// Wait, the badge might be an issue. Let's do a smart regex replacement for the mapping logic
