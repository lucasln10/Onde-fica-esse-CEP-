import { networkInterfaces } from 'node:os';
import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { HttpError } from './lib/http-error.js';
import { lookupCep } from './services/cep-service.js';

const app = express();

app.disable('x-powered-by');
app.use(
  cors({
    origin:
      config.corsOrigin === '*'
        ? '*'
        : config.corsOrigin.split(',').map((origin) => origin.trim()),
  }),
);
app.use(express.json({ limit: '10kb' }));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'viacep-geocode-api',
    uptime: process.uptime(),
  });
});

app.get('/api/cep/:cep', async (req, res, next) => {
  try {
    const result = await lookupCep(req.params.cep);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  console.error('[erro não tratado]', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

function getNetworkUrls(port) {
  const urls = new Map([['Local', `http://localhost:${port}`]]);

  if (config.host === '0.0.0.0' || config.host === '::') {
    for (const [name, entries] of Object.entries(networkInterfaces())) {
      for (const entry of entries ?? []) {
        if (
          entry.family === 'IPv4' &&
          !entry.internal &&
          !entry.address.startsWith('169.254.')
        ) {
          urls.set(name, `http://${entry.address}:${port}`);
        }
      }
    }
  } else {
    urls.set('Host', `http://${config.host}:${port}`);
  }

  return [...urls];
}

const server = app.listen(config.port, config.host, () => {
  console.log('API disponível em:');
  for (const [name, url] of getNetworkUrls(config.port)) {
    console.log(`  ${url} (${name})`);
  }
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
