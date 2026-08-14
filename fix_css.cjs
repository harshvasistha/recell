const fs = require('fs');

const css = `@import "tailwindcss";

:root {
  --brand-primary: #0052FF;
  --brand-hover: #0043CC;
  --brand-light: #EFF6FF;
  --brand-border: #BFDBFE;
}

@layer base {
  body {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  h1, h2, h3, h4, h5, h6, .font-heading {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  }
}

@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
@keyframes marquee-reverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0%); }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 95s linear infinite;
}
.animate-marquee-ltr {
  display: flex;
  width: max-content;
  animation: marquee-reverse 95s linear infinite;
}
.animate-marquee-fast {
  display: flex;
  width: max-content;
  animation: marquee 15s linear infinite;
}
.animate-marquee-ltr-fast {
  display: flex;
  width: max-content;
  animation: marquee-reverse 15s linear infinite;
}

.animate-marquee:hover,
.animate-marquee-ltr:hover,
.animate-marquee-fast:hover,
.animate-marquee-ltr-fast:hover {
  animation-play-state: paused;
}

.bg-brand {
  background-color: #0052FF;
}
.hover\\:bg-brand:hover {
  background-color: #0043CC;
}
.text-brand {
  color: #0052FF;
}
.border-brand {
  border-color: #0052FF;
}
.bg-brand-light {
  background-color: #EFF6FF;
}
.border-brand-light {
  border-color: #BFDBFE;
}
`;
fs.writeFileSync('src/index.css', css);
console.log('CSS updated');
