import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'ReCell E-Commerce API', time: new Date().toISOString() });
  });

  // Proxy Google Drive Image to avoid CORS or auth header issues in <img> tags
  app.get('/api/drive/image-proxy', async (req, res) => {
    try {
      const fileId = req.query.fileId as string;
      const accessToken = req.query.token as string;

      if (!fileId) {
        return res.status(400).send('Missing fileId');
      }

      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const driveRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers
      });

      if (!driveRes.ok) {
        // Fallback to Google Drive high-res thumbnail endpoint
        return res.redirect(`https://lh3.googleusercontent.com/d/${fileId}=s1000`);
      }

      const contentType = driveRes.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');

      const arrayBuffer = await driveRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (err: any) {
      console.error('Error proxying Drive image:', err);
      res.status(500).send('Failed to fetch Drive image');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ReCell Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
