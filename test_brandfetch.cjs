const https = require('https');

const getStatus = (url) => new Promise((resolve) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => resolve(res.statusCode)).on('error', () => resolve(500));
});

const urls = [
  'https://cdn.brandfetch.io/apple.com/w/400/h/400',
  'https://cdn.brandfetch.io/samsung.com/w/400/h/400',
  'https://cdn.brandfetch.io/realme.com/w/400/h/400',
  'https://cdn.brandfetch.io/nothing.tech/w/400/h/400',
  'https://cdn.brandfetch.io/po.co/w/400/h/400',
  'https://cdn.brandfetch.io/iqoo.com/w/400/h/400',
  'https://cdn.brandfetch.io/infinixmobility.com/w/400/h/400'
];
Promise.all(urls.map(u => getStatus(u).then(s => console.log(s + ' ' + u))));
