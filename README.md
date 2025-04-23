# BTC Hits

# BTC Hits 产品介绍

## 产品概述

BTC Hits 是一个专业的比特币价格追踪应用，提供实时价格监控、历史数据分析和市场概览功能。该应用采用现代化的技术栈构建，为用户提供流畅、直观的价格追踪体验。

## 核心功能

### 1. 实时价格追踪

- 实时显示比特币当前价格
- 自动每 5 分钟更新数据
- 支持多个时间周期的价格查看

### 2. 交互式价格图表

- 支持多个时间周期切换
- 平滑的图表缩放效果
- 优化的移动端显示
- 响应式设计，适配各种设备

### 3. 市场概览

- Top 10 市场资产展示
- 包含加密货币、股票和大宗商品
- 实时市场数据更新
- 智能数据缓存机制

## 技术特点

### 1. 高性能架构

- 基于 Next.js 14 构建
- TypeScript 类型安全
- 智能数据缓存系统
  - 股票数据：20 分钟缓存
  - 加密货币：2 分钟缓存
  - 价格历史：2 分钟缓存

### 2. 优化的用户体验

- 响应式设计，完美适配移动端
- 流畅的图表交互
- 优化的加载性能
- 智能的数据刷新机制

### 3. 专业的数据处理

- 使用 CoinGecko API 获取权威数据
- 智能的数据缓存策略
- 自动化的数据更新机制
- 完善的错误处理机制

## 技术栈

- 前端框架：Next.js 14
- 开发语言：TypeScript
- UI 框架：Tailwind CSS
- 图表库：Chart.js + react-chartjs-2
- 数据获取：Axios
- 数据源：CoinGecko API

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
