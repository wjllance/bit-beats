# Bitcoin Price Tracker

## Overview
A Next.js application that displays real-time Bitcoin price charts using the CoinGecko API.

## Features
- Real-time Bitcoin price tracking
- 30-day price history chart
- Responsive design with Tailwind CSS
- Automatic price updates every 5 minutes
- TypeScript support for better development experience

## Prerequisites
- Node.js (v16 or later)
- Yarn package manager

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/bitcoin-price-tracker.git
cd bitcoin-price-tracker
```

2. Install dependencies
```bash
yarn
```

3. Run the development server
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint for code linting

## Technologies Used
- Next.js 14
- TypeScript
- Tailwind CSS
- Chart.js with react-chartjs-2
- Axios for API calls
- CoinGecko API

## Project Structure
```
bitcoin-price-tracker/
├── src/
│   ├── app/         # Next.js app directory
│   ├── components/  # React components
│   └── types/       # TypeScript type definitions
├── public/          # Static files
└── package.json     # Project dependencies and scripts
```

## Customization
- Modify the chart appearance in `src/app/page.tsx`
- Adjust the refresh interval in the `useEffect` hook
- Change the number of historical days in the API call

## Deployment
This app can be easily deployed on Vercel, Netlify, or any platform supporting Next.js.

## License
MIT License
