const fs = require('fs');
let content = fs.readFileSync('src/components/Storefront.tsx', 'utf8');

// Change the matchesCondition logic to exclude Open Box
content = content.replace(
  "const matchesOpenBox = !isOpenBoxOnly || p.isOpenBox || p.category === 'Open Box Chargers' || p.title.toLowerCase().includes('open box') || p.title.toLowerCase().includes('charger');",
  "const isItemOpenBox = p.isOpenBox || p.conditionGrade === 'Open Box' || p.title.toLowerCase().includes('open box');\n    const matchesOpenBox = !isItemOpenBox; // Exclude open box items from refurbished store"
);

// We can also remove `isOpenBoxOnly` filter button if it exists, or just keep it simple
content = content.replace(
  "const [isOpenBoxOnly, setIsOpenBoxOnly] = useState<boolean>(false);",
  ""
);

// We might have an isOpenBoxOnly toggle in the UI, let's remove it if present.
content = content.replace(
  /{isOpenBoxOnly \? 'bg-amber-100 .*?<\/button>/s,
  ''
);

fs.writeFileSync('src/components/Storefront.tsx', content);
console.log('Storefront patched!');
