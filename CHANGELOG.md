# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.3] - 2024-11-22

### Added
- Created new shared utilities in `src/utils/formatters.ts`
  - Added formatMarketCap with improved precision (3 decimal places)
  - Added formatPrice for consistent price formatting
  - Added formatPercentageChange for standardized percentage displays

### Changed
- Refactored TopAssets and MobileTopAssets to use shared formatters
- Improved market cap formatting precision across all components
- Enhanced code organization by centralizing formatting logic

## [1.1.2] - 2024-11-22

### Added
- Integrated Google Analytics tracking
  - Added GoogleAnalytics component using Next.js Script
  - Implemented tracking code with ID G-GEEM5LH0WW
  - Optimized loading with afterInteractive strategy

## [1.1.1] - 2024-11-21

### Added
- Created new mobile-specific components:
  - MobileBitcoinChart for optimized chart display
  - MobileTopAssets for responsive asset listing
- Added useMarketData custom hook for centralized data management
- New mobile page layout with optimized UI components

### Changed
- Restructured mobile components directory
- Improved mobile navigation flow
- Enhanced mobile-first design approach
- Optimized data fetching for mobile views

### Fixed
- Mobile component import paths
- Mobile layout responsiveness
- Data fetching and state management in mobile views

## [1.1.0] - 2024-11-21

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

## [1.0.0] - 2024-11-21

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
