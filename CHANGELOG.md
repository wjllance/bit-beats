# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-01-10

### Added
- Automatic mobile redirection based on screen size
- New DeviceRedirect component for handling responsive navigation
- Mobile-optimized layout and components
- Dedicated mobile routes and pages
- Custom hook for market data management

### Changed
- Updated Top Assets title to "Top 10 Market Assets"
- Improved mobile UI components for better visual hierarchy
- Enhanced responsive design implementation
- Refactored layout structure for better mobile support

### Fixed
- Import path resolution for DeviceRedirect component
- Mobile navigation and routing edge cases
- Screen size detection and redirection logic

## [1.0.0] - 2024-01-09

### Added
- Initial release of Bitcoin Price Tracker
- Real-time price tracking for Bitcoin
- Interactive price chart with multiple timeframes
- Top assets display showing cryptocurrencies, stocks, and commodities
- Market data API with caching mechanism

### Changed
- Improved market cap formatting precision
- Enhanced TypeScript type safety across components
- Optimized API calls with proper error handling

### Removed
- Unused loading states and sort configurations
- Redundant fallback commodity data
- Unnecessary API configuration constants

### Fixed
- TypeScript lint issues in TopAssets and BitcoinChart components
- Type safety improvements for API responses and error handling
- Code organization and cleanup
