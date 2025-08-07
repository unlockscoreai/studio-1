import React from 'react';

const Logo: React.FC = () => {
  const primaryColor = "#1A237E"; // Primary color from blueprint
  const accentColor = "#9C27B0"; // Accent color from blueprint

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill={primaryColor} />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="20"
          fill={accentColor}
          fontFamily="Arial, sans-serif" // You can adjust the font family
        >
          C
        </text>
      </svg>
      <span style={{ marginLeft: '8px', fontSize: '18px', fontWeight: 'bold', color: primaryColor }}>
        CreditAI
      </span>
    </div>
  );
};

export default Logo;