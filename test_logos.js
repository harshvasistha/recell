const https = require('https');
const checkUrl = (url) => new Promise((resolve) => {
  https.get(url, (res) => resolve({url, status: res.statusCode})).on('error', () => resolve({url, status: 500}));
});
const urls = [
  'https://cdn.simpleicons.org/apple/000000',
  'https://cdn.simpleicons.org/samsung/000000',
  'https://cdn.simpleicons.org/oneplus/000000',
  'https://cdn.simpleicons.org/xiaomi/000000',
  'https://cdn.simpleicons.org/vivo/000000',
  'https://cdn.simpleicons.org/oppo/000000',
  'https://cdn.simpleicons.org/realme/000000',
  'https://cdn.simpleicons.org/google/000000',
  'https://cdn.simpleicons.org/motorola/000000',
  'https://cdn.simpleicons.org/nothing/000000',
  'https://cdn.simpleicons.org/poco/000000',
  'https://cdn.simpleicons.org/iqoo/000000',
  'https://cdn.simpleicons.org/asus/000000',
  'https://cdn.simpleicons.org/honor/000000',
  'https://cdn.simpleicons.org/infinix/000000'
];
Promise.all(urls.map(checkUrl)).then(console.log);
