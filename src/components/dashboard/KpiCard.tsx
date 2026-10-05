'use client';
import React, { useState } from 'react';

interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: React.ReactNode;
  theme?: 'default' | 'strategy';
}

export function KpiCard({ title, value, change, changeType, subtitle, theme }: KpiCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Exact matching for specific cards based on screenshot
  const strategyTitles = ["Total Strategies", "Running", "Drafts", "Paused"];
  const isStrategyCard = theme === 'strategy' || strategyTitles.includes(title);
  const isPortfolioTheme = title === "Total Portfolio Value" || isStrategyCard;
  const isPortfolio = title === "Total Portfolio Value" && theme !== 'strategy';
  const isPnl = title === "Today's P&L" && theme !== 'strategy';
  const isStrategies = title === "Active Strategies" && theme !== 'strategy';
  const isPositions = title === "Open Positions" && theme !== 'strategy';

  // Match the exact gradients from the screenshot
  let background = 'linear-gradient(135deg, #7c98ab 0%, #5c7b91 100%)';
  if (isPortfolioTheme) {
    if (isStrategyCard) {
      // Tinted look with a glassmorphism flash/reflection effect and distinct color
      background = 'linear-gradient(105deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0) 45.1%), linear-gradient(135deg, rgba(215, 225, 240, 0.8) 0%, rgba(180, 200, 225, 0.9) 100%)';
    } else {
      background = 'linear-gradient(135deg, #b0c6d6 0%, #90aebd 100%)';
    }
  }
  if (isPnl) background = 'linear-gradient(135deg, #5fc998 0%, #4a9e7a 100%)';
  if (isStrategies) background = 'linear-gradient(135deg, #7899af 0%, #5d7d91 100%)';
  if (isPositions) background = 'linear-gradient(135deg, #6b8a9c 0%, #506f82 100%)';

  // Prominent glow color on hover (mostly for the green one in screenshot)
  const glowColor = isPnl ? 'rgba(95, 201, 152, 0.6)' : 'rgba(120, 153, 175, 0.4)';

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        background: background,
        borderRadius: '16px',
        padding: '20px',
        color: isStrategyCard ? 'var(--color-text-primary)' : 'white',
        border: isStrategyCard ? '1px solid rgba(60, 110, 190, 0.4)' : (isPnl ? '1px solid rgba(95, 201, 152, 0.8)' : '1px solid rgba(255, 255, 255, 0.1)'),
        boxShadow: isHovered 
          ? `0 0 25px ${glowColor}, inset 0 0 10px rgba(255,255,255,0.1)` 
          : '0 8px 24px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '130px',
        backdropFilter: isStrategyCard ? 'blur(10px)' : 'none'
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
        <div style={{ fontSize: '13px', color: isStrategyCard ? 'var(--color-text-primary)' : 'white', fontWeight: 600, textShadow: isStrategyCard ? 'none' : '0 1px 2px rgba(0,0,0,0.2)' }}>
          {title}
        </div>
        
        {/* Top Right Icons */}
        {isPortfolioTheme && (
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: isStrategyCard ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: isStrategyCard ? 'var(--color-text-primary)' : 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {title === "Total Portfolio Value" ? "$" : "✦"}
          </div>
        )}
        {isStrategies && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        )}
      </div>
      
      {/* Main Value */}
      <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '12px', zIndex: 2, display: 'flex', alignItems: 'baseline', gap: '4px', textShadow: isStrategyCard ? 'none' : '0 2px 4px rgba(0,0,0,0.1)' }}>
        {value}
        {(isStrategies || isPositions) && <span style={{fontSize: '13px', fontWeight: 600, color: 'white', opacity: 0.9}}>Total</span>}
      </div>
      
      {/* Bottom Row / Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', zIndex: 2, paddingTop: '16px' }}>
        
        {/* Left Side Labels */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700 }}>
          {(isPortfolioTheme || isPnl) && change && (
            <div style={{ 
              backgroundColor: isStrategyCard ? 'rgba(0,0,0,0.06)' : (isPnl ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'), 
              padding: isPnl ? '4px 8px' : '4px 8px', 
              borderRadius: '6px',
              color: isStrategyCard ? 'var(--color-text-primary)' : 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textShadow: isStrategyCard ? 'none' : '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {changeType === 'positive' ? '+' : ''}{change}
              {changeType === 'positive' ? ' ↗' : ' ↘'}
            </div>
          )}
          
          {isStrategies && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><span style={{color: '#a7f3d0'}}>●</span> 4 Running</span>
              <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><span style={{color: 'rgba(255,255,255,0.8)'}}>●</span> 2 Paused</span>
            </div>
          )}
          
          {isPositions && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#a7f3d0'}}>↑ 8 Profitable</span>
              <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#fca5a5'}}>↓ 4 Negative</span>
            </div>
          )}
        </div>

        {/* Right Side Mini Charts */}
        {isPnl && (
          <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '24px' }}>
            {[40, 70, 50, 100, 60, 80].map((h, i) => (
              <div 
                key={i} 
                className="animated-bar"
                style={{
                  width: '6px', 
                  height: `${h}%`, 
                  background: '#4ade80', 
                  borderRadius: '3px',
                  animationDelay: `${i * 0.15}s`
                }}
              ></div>
            ))}
          </div>
        )}

        {isStrategies && (
          <div style={{ width: '40px', height: '28px', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="animated-area" style={{ height: '50%', background: '#86efac' }}></div>
            <div style={{ height: '50%', display: 'flex' }}>
              <div style={{ width: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ width: '50%', background: 'rgba(0,0,0,0.2)' }}></div>
            </div>
          </div>
        )}

        {isPositions && (
          <svg className="animated-pie" width="28" height="28" viewBox="0 0 32 32" style={{borderRadius: '50%'}}>
            <circle r="16" cx="16" cy="16" fill="rgba(0,0,0,0.2)" />
            <circle r="16" cx="16" cy="16" fill="#86efac" strokeDasharray="65 100" />
          </svg>
        )}
      </div>

      {/* Full width Line Chart for Portfolio */}
      {isPortfolio && (
        <svg className="animated-chart" viewBox="0 0 100 30" width="100%" height="40" style={{position: 'absolute', bottom: 0, left: 0, opacity: 0.8}} preserveAspectRatio="none">
          <path d="M0,25 L20,20 L40,25 L60,15 L80,15 L100,5 L100,30 L0,30 Z" fill="rgba(255,255,255,0.15)"/>
          <path d="M0,25 L20,20 L40,25 L60,15 L80,15 L100,5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
        </svg>
      )}
    </div>
  );
}
