async function test() {
  const query = 'Xiaomi Redmi 12 mobile phone unboxing real photo';
  console.log('Query:', query);
  const response = await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    }
  });
  const html = await response.text();
  console.log('HTML Length:', html.length);
  const regex = /murl&quot;:&quot;(.*?)&quot;/g;
  let match;
  const images = [];
  while ((match = regex.exec(html)) !== null) {
    if (match[1].startsWith('http')) {
      images.push(match[1]);
    }
  }
  console.log('Found:', images.length);
  console.log('Sample:', images.slice(0, 3));
}
test();
