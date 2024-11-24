# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2024-11-24

### Changed

- Enhanced price history data management
  - Extended cache expiration and auto-refresh interval to 5 minutes
  - Improved error handling in PriceHistoryContext
  - Added timestamp-based cache invalidation
- Refined price display formatting
  - Integrated centralized date formatting utilities
  - Enhanced price number formatting with consistent decimal places
  - Improved mobile display layout and responsiveness

## [1.3.0] - 2024-11-23

### Added

- Added GitHub Actions workflow for automated deployment
  - Created tag-based deployment workflow
  - Automatically merges main branch into deploy branch for tags with -prod suffix
  - Automatically merges main branch into preview branch for other tags
  - Automatically updates package.json version from git tag
  - Triggers Vercel deployment automatically for preview branch
  - Uses custom PAT token for authentication
- Added version display in application footer
  - Shows current version from package.json
  - Updates automatically with git tags
  - update

### Changed

- Refactored date formatting utilities
  - Created centralized dateFormat.ts utility
  - Improved date string parsing for both "Nov 2" and "Nov 23, 9:22 AM" formats
  - Updated both desktop and mobile PriceDisplay components to use shared formatting

## [1.2.0] - 2024-11-23

### Changed

- Adjusted cache durations and refresh intervals for better performance
  - Extended PriceHistory cache expiration from 30s to 5 mins
  - Extended auto-refresh interval from 30s to 5 mins
  - Updated crypto cache duration from 2 mins to 5 mins
  - Extended price history cache duration from 30s to 60s
- Optimized mobile Bitcoin chart for better visual appeal and performance
  - Reduced chart height to 130px for a more compact display
  - Improved grid line styling with subtle colors
  - Removed x-axis labels while maintaining interactive tooltips
  - Adjusted y-axis grid display for better readability
- Refined mobile layout and chart positioning
  - Maintained scrollable content while keeping chart visible
  - Enhanced overall mobile user experience

## [1.1.5] - 2024-11-22

### Added

- Created new `src/utils/api-config.ts` for centralized API configuration
  - Moved API endpoints and keys
  - Added cache duration constants
  - Added feature flags

### Changed

- Refactored market data route to use shared API configuration
- Updated TopAssets component to use shared endpoints
- Improved code organization and maintainability

## [1.1.4] - 2024-11-22

### Added

- Implemented separate cache durations for different data types
  - Stock data: 1 hour cache
  - Commodity data: 24 hours cache
- Added NEXT_PUBLIC_DISABLE_CACHE environment variable for development

### Changed

- Refactored market data caching mechanism
- Optimized API calls by fetching only expired data
- Updated environment variables configuration

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
