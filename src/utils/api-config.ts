/**
 * API configuration and endpoints
 */

export const API_KEYS = {
  FMP: process.env.FMP_API_KEY || "demo",
  METAL_PRICE: process.env.METAL_PRICE_API_KEY || "demo",
};

export const API_ENDPOINTS = {
  FMP: "https://financialmodelingprep.com/api/v3",
  METAL_PRICE: "https://api.metalpriceapi.com/v1",
  COINGECKO: "https://api.coingecko.com/api/v3",
};

// Cache configuration
export const STOCK_CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
export const COMMODITY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const CRYPTO_CACHE_DURATION = 5 * 60 * 1000; // 2 minutes in milliseconds
export const PRICE_HISTORY_CACHE_DURATION = 60 * 1000; // 60 seconds in milliseconds

// Feature flags
export const DISABLE_CACHE = process.env.DISABLE_CACHE === "true";
