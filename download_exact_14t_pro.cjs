const https = require('https');
const fs = require('fs');

function dl(url, dest) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const f = fs.createWriteStream(dest);
        res.pipe(f);
        f.on('finish', () => f.close(() => resolve({ ok: true, sz: fs.statSync(dest).size })));
      } else {
        resolve({ ok: false, status: res.statusCode });
      }
    }).on('error', err => resolve({ ok: false, err: err.message }));
  });
}

async function run() {
  const urls = [
    'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-14t/pc/img-box/aimg01.png',
    'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-14t/pc/img-box/img01-1.png',
    'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-14t/pc/img-box/img02-7.png',
    'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-14t-pro/PC/advance.png'
  ];

  for (let i = 0; i < urls.length; i++) {
    const res = await dl(urls[i], `public/devices/xiaomi-17t/view-${i+1}.png`);
    console.log(`14T view-${i+1}:`, res);
  }
}

run();
