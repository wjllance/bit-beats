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
export const STOCK_CACHE_DURATION = 20 * 60 * 1000; // 20 mins in milliseconds
export const COMMODITY_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const CRYPTO_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds
export const PRICE_HISTORY_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes in milliseconds

// Feature flags
export const DISABLE_CACHE = process.env.DISABLE_CACHE === "true";
