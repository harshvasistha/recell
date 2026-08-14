const https = require('https');

const getStatus = (url) => new Promise((resolve) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => resolve(res.statusCode)).on('error', () => resolve(500));
});

const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/f/f8/OnePlus_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_logo_2019.svg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/05/Realme_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/4/43/Motorola_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/7/74/Nothing_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/29/POCO_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/aa/IQOO_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/20/Honor_Logo_%282020%29.svg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e0/Infinix_logo.svg'
];
Promise.all(urls.map(u => getStatus(u).then(s => console.log(s + ' ' + u))));
