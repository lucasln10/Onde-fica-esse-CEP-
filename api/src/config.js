function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const config = {
  port: positiveNumber(process.env.PORT, 3001),
  host: process.env.HOST?.trim() || '0.0.0.0',
  corsOrigin: process.env.CORS_ORIGIN?.trim() || '*',
  nominatimUrl:
    process.env.NOMINATIM_URL?.trim() ||
    'https://nominatim.openstreetmap.org/search',
  nominatimUserAgent:
    process.env.NOMINATIM_USER_AGENT?.trim() ||
    'viacep-map/1.0 (local development)',
  nominatimMinIntervalMs: positiveNumber(
    process.env.NOMINATIM_MIN_INTERVAL_MS,
    1100,
  ),
  cacheTtlMs: positiveNumber(process.env.CACHE_TTL_MS, 24 * 60 * 60 * 1000),
  upstreamTimeoutMs: positiveNumber(process.env.UPSTREAM_TIMEOUT_MS, 10000),
};
