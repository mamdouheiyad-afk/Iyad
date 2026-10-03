import React, { useState, useMemo, useRef } from 'react';
import { Asset, CandleData } from '../types/market';
import { generateCandles } from '../data/mockMarketData';
import { 
  BarChart2, 
  TrendingUp, 
  Layers, 
  Maximize2, 
  HelpCircle,
  Eye,
  Sliders,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface InteractiveChartProps {
  asset: Asset;
  onOpenOrderTicket?: () => void;
}

type ChartType = 'candles' | 'line';
type Timeframe = '1D' | '1W' | '1M' | '1Y' | 'ALL';

export const InteractiveChart: React.FC<InteractiveChartProps> = ({ asset, onOpenOrderTicket }) => {
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [showSMA20, setShowSMA20] = useState<boolean>(true);
  const [showSMA50, setShowSMA50] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate or memoize candles for current asset and timeframe
  const candles = useMemo(() => {
    return generateCandles(asset.price, timeframe);
  }, [asset.id, asset.price, timeframe]);

  const activeCandle = hoveredIndex !== null && candles[hoveredIndex] ? candles[hoveredIndex] : candles[candles.length - 1];

  // Dimensions
  const chartHeight = 340;
  const rsiHeight = showRSI ? 90 : 0;
  const padding = { top: 20, right: 65, bottom: 25, left: 10 };

  // Calculate scales
  const { minPrice, maxPrice, priceRange, maxVol } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    let volMax = 0;

    candles.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > volMax) volMax = c.volume;
    });

    // Add 4% margin on top and bottom
    const range = (max - min) || 1;
    min -= range * 0.04;
    max += range * 0.04;

    return { minPrice: min, maxPrice: max, priceRange: max - min, maxVol: volMax || 1 };
  }, [candles]);

  const getYForPrice = (price: number) => {
    return chartHeight - padding.bottom - ((price - minPrice) / priceRange) * (chartHeight - padding.top - padding.bottom);
  };

  const getYForRsi = (rsiVal: number) => {
    const rsiMin = 0;
    const rsiMax = 100;
    return chartHeight + 25 + (rsiHeight - 30) - ((rsiVal - rsiMin) / (rsiMax - rsiMin)) * (rsiHeight - 30);
  };

  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - padding.left;
    const width = rect.width - padding.left - padding.right;
    if (x < 0 || x > width) {
      setHoveredIndex(null);
      return;
    }
    const ratio = Math.max(0, Math.min(1, x / width));
    const index = Math.round(ratio * (candles.length - 1));
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Price grid levels
  const priceLevels = useMemo(() => {
    const levels = [];
    const step = priceRange / 5;
    for (let i = 0; i <= 5; i++) {
      levels.push(minPrice + step * i);
    }
    return levels;
  }, [minPrice, priceRange]);

  const isUp = asset.change24h >= 0;

  return (
    <div className="bg-[#0e1422] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      
      {/* Top Chart Toolbar */}
      <div className="p-4 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60">
        
        {/* Asset Header Info */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">{asset.name}</h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {asset.symbol}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{asset.category.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-300">
                Vol 24h: {asset.volume24h}
              </span>
            </div>
          </div>

          <div className="pl-4 border-l border-slate-800">
            <div className="text-base sm:text-xl font-extrabold font-mono text-white tabular-nums">
              {asset.price.toLocaleString('fr-FR', { minimumFractionDigits: asset.price < 10 ? 4 : 2 })} {asset.currency === 'USD' ? '$' : '€'}
            </div>
            <div className={`text-xs font-mono font-medium flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{isUp ? '+' : ''}{asset.change24h.toFixed(2)}% ({asset.changeAmount24h.toFixed(2)} {asset.currency === 'USD' ? '$' : '€'})</span>
            </div>
          </div>
        </div>

        {/* Toolbar Controls: Chart Type, Timeframes, Indicators */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Timeframes */}
          <div className="flex items-center gap-0.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/80">
            {(['1D', '1W', '1M', '1Y', 'ALL'] as Timeframe[]).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Toggle (Candles vs Line) */}
          <div className="flex items-center gap-0.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/80">
            <button
              onClick={() => setChartType('candles')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                chartType === 'candles'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Chandeliers Japonais"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bougies</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
                chartType === 'line'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Graphique en ligne continue"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ligne</span>
            </button>
          </div>

          {/* Indicator toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
                showSMA20 
                  ? 'bg-blue-500/10 border-blue-500/40 text-blue-400 font-semibold' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-400'
              }`}
              title="Moyenne Mobile 20 périodes"
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowSMA50(!showSMA50)}
              className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
                showSMA50 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-semibold' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-400'
              }`}
              title="Moyenne Mobile 50 périodes"
            >
              SMA 50
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
                showRSI 
                  ? 'bg-purple-500/10 border-purple-500/40 text-purple-400 font-semibold' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-400'
              }`}
              title="Indice de Force Relative (RSI 14)"
            >
              RSI (14)
            </button>
          </div>

          {onOpenOrderTicket && (
            <button
              onClick={onOpenOrderTicket}
              className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors ml-auto sm:ml-0"
            >
              Passer Ordre
            </button>
          )}

        </div>
      </div>

      {/* Live Crosshair & Candle Stats Header */}
      <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/60 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-300 font-medium">{activeCandle.time}</span>
          <span>O: <strong className="text-slate-200">{activeCandle.open.toFixed(asset.price < 10 ? 4 : 2)}</strong></span>
          <span>H: <strong className="text-emerald-400">{activeCandle.high.toFixed(asset.price < 10 ? 4 : 2)}</strong></span>
          <span>L: <strong className="text-rose-400">{activeCandle.low.toFixed(asset.price < 10 ? 4 : 2)}</strong></span>
          <span>C: <strong className={activeCandle.close >= activeCandle.open ? 'text-emerald-400' : 'text-rose-400'}>{activeCandle.close.toFixed(asset.price < 10 ? 4 : 2)}</strong></span>
          <span>Vol: <strong className="text-slate-300">{activeCandle.volume.toLocaleString('fr-FR')}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          {showSMA20 && activeCandle.sma20 && (
            <span className="text-blue-400">SMA20: {activeCandle.sma20.toFixed(2)}</span>
          )}
          {showSMA50 && activeCandle.sma50 && (
            <span className="text-amber-400">SMA50: {activeCandle.sma50.toFixed(2)}</span>
          )}
          {showRSI && activeCandle.rsi && (
            <span className="text-purple-400">RSI(14): {activeCandle.rsi.toFixed(1)}</span>
          )}
        </div>
      </div>

      {/* Main SVG Chart Canvas */}
      <div className="relative w-full select-none" style={{ height: `${chartHeight + rsiHeight}px` }}>
        <svg
          ref={svgRef}
          className="w-full h-full cursor-crosshair overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="lineFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="rsiOverboughtGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines and Price Labels */}
          {priceLevels.map((lvl, idx) => {
            const y = getYForPrice(lvl);
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x="98%"
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-500 font-mono text-[10px]"
                >
                  {lvl.toFixed(asset.price < 10 ? 4 : 2)}
                </text>
              </g>
            );
          })}

          {/* Volume Histogram (at bottom of main chart) */}
          {showVolume && candles.map((c, i) => {
            const totalWidth = 100 - (padding.left + padding.right) / 10; // approximate
            // compute dynamic x
            const candleCount = candles.length;
            const xPercent = (i / (candleCount - 1));
            // We use standard SVG viewbox or direct coordinate mapping
            // Using proportional calc based on i
            const barHeight = (c.volume / maxVol) * 45;
            const isGreen = c.close >= c.open;
            return (
              <rect
                key={`vol-${i}`}
                x={`${padding.left + xPercent * 88}%`}
                y={chartHeight - padding.bottom - barHeight}
                width="1.2%"
                height={barHeight}
                fill={isGreen ? '#10b981' : '#f43f5e'}
                opacity={0.25}
              />
            );
          })}

          {/* Line Chart mode */}
          {chartType === 'line' && (
            <>
              {/* Line Area gradient */}
              <path
                d={
                  candles.map((c, i) => {
                    const xPercent = (i / (candles.length - 1)) * 88 + 1;
                    const y = getYForPrice(c.close);
                    return `${i === 0 ? 'M' : 'L'} ${xPercent}% ${y}`;
                  }).join(' ') + ` L 89% ${chartHeight - padding.bottom} L 1% ${chartHeight - padding.bottom} Z`
                }
                fill="url(#lineFillGrad)"
              />
              {/* Main Line */}
              <path
                d={candles.map((c, i) => {
                  const xPercent = (i / (candles.length - 1)) * 88 + 1;
                  const y = getYForPrice(c.close);
                  return `${i === 0 ? 'M' : 'L'} ${xPercent}% ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Candlestick mode */}
          {chartType === 'candles' && candles.map((c, i) => {
            const xPercent = (i / (candles.length - 1)) * 88 + 1;
            const isGreen = c.close >= c.open;
            const yOpen = getYForPrice(c.open);
            const yClose = getYForPrice(c.close);
            const yHigh = getYForPrice(c.high);
            const yLow = getYForPrice(c.low);
            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
            const color = isGreen ? '#10b981' : '#f43f5e';

            return (
              <g key={`candle-${i}`}>
                {/* Wick */}
                <line
                  x1={`${xPercent}%`}
                  y1={yHigh}
                  x2={`${xPercent}%`}
                  y2={yLow}
                  stroke={color}
                  strokeWidth="1.2"
                />
                {/* Body */}
                <rect
                  x={`calc(${xPercent}% - 3px)`}
                  y={bodyTop}
                  width="6px"
                  height={bodyHeight}
                  fill={isGreen ? '#10b981' : '#f43f5e'}
                  rx="1"
                />
              </g>
            );
          })}

          {/* SMA 20 Overlay (Blue) */}
          {showSMA20 && (
            <path
              d={candles.map((c, i) => {
                if (!c.sma20) return '';
                const xPercent = (i / (candles.length - 1)) * 88 + 1;
                const y = getYForPrice(c.sma20);
                return `${i === 5 ? 'M' : 'L'} ${xPercent}% ${y}`;
              }).filter(Boolean).join(' ')}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}

          {/* SMA 50 Overlay (Amber) */}
          {showSMA50 && (
            <path
              d={candles.map((c, i) => {
                if (!c.sma50) return '';
                const xPercent = (i / (candles.length - 1)) * 88 + 1;
                const y = getYForPrice(c.sma50);
                return `${i === 10 ? 'M' : 'L'} ${xPercent}% ${y}`;
              }).filter(Boolean).join(' ')}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}

          {/* RSI Sub-chart Panel */}
          {showRSI && (
            <g transform={`translate(0, 0)`}>
              {/* Divider line */}
              <line
                x1={0}
                y1={chartHeight}
                x2="100%"
                y2={chartHeight}
                stroke="#334155"
                strokeWidth="1.5"
              />
              
              {/* RSI 70 overbought line */}
              <line
                x1={padding.left}
                y1={getYForRsi(70)}
                x2="90%"
                y2={getYForRsi(70)}
                stroke="#f43f5e"
                strokeDasharray="2 2"
                strokeWidth="1"
                opacity={0.6}
              />
              <text x="98%" y={getYForRsi(70) + 3} textAnchor="end" className="fill-rose-400 font-mono text-[9px]">
                70 Surchauffe
              </text>

              {/* RSI 30 oversold line */}
              <line
                x1={padding.left}
                y1={getYForRsi(30)}
                x2="90%"
                y2={getYForRsi(30)}
                stroke="#10b981"
                strokeDasharray="2 2"
                strokeWidth="1"
                opacity={0.6}
              />
              <text x="98%" y={getYForRsi(30) + 3} textAnchor="end" className="fill-emerald-400 font-mono text-[9px]">
                30 Survente
              </text>

              {/* RSI Curve */}
              <path
                d={candles.map((c, i) => {
                  if (c.rsi === undefined) return '';
                  const xPercent = (i / (candles.length - 1)) * 88 + 1;
                  const y = getYForRsi(c.rsi);
                  return `${i === 0 ? 'M' : 'L'} ${xPercent}% ${y}`;
                }).filter(Boolean).join(' ')}
                fill="none"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Crosshair Cursor on Hover */}
          {hoveredIndex !== null && (
            <g>
              <line
                x1={`${(hoveredIndex / (candles.length - 1)) * 88 + 1}%`}
                y1={padding.top}
                x2={`${(hoveredIndex / (candles.length - 1)) * 88 + 1}%`}
                y2={chartHeight + rsiHeight}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity={0.7}
              />
              <circle
                cx={`${(hoveredIndex / (candles.length - 1)) * 88 + 1}%`}
                cy={getYForPrice(activeCandle.close)}
                r="4.5"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Chart Footer Guide */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
            <span>SMA 20 (Court terme)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>SMA 50 (Moyen terme)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
            <span>RSI 14 (Oscillateur de momentum)</span>
          </span>
        </div>

        <div className="text-slate-500 font-mono text-[10px]">
          Survolez le graphique pour explorer les cours historiques exacts
        </div>
      </div>

    </div>
  );
};
