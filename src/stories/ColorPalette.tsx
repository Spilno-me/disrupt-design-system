import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export interface ColorItem {
  name: string;
  hex: string;
  usage: string;
}

export interface ColorPaletteProps {
  colors: ColorItem[];
  variant?: 'primary' | 'scale' | 'neutral' | 'semantic';
}

const ColorSwatch: React.FC<{
  color: ColorItem;
  size?: 'large' | 'small';
}> = ({ color, size = 'large' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isLight = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
  };

  const textColor = isLight(color.hex) ? '#2D3142' : '#FFFFFF';
  const swatchHeight = size === 'large' ? '100px' : '60px';

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        border: '1px solid #e5e7eb',
        minWidth: 0,
      }}
    >
      <div
        onClick={handleCopy}
        style={{
          background: color.hex,
          height: swatchHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 0.15s ease',
        }}
        title={`Click to copy ${color.hex}`}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: copied ? 'rgba(0,0,0,0.1)' : 'transparent',
            transition: 'background 0.15s ease',
          }}
        >
          {copied ? (
            <Check size={20} color={textColor} />
          ) : (
            <Copy
              size={16}
              color={textColor}
              style={{ opacity: 0.5 }}
            />
          )}
        </div>
      </div>
      <div style={{ padding: '12px' }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#2D3142',
            fontFamily: 'Fixel, sans-serif',
            marginBottom: '2px',
          }}
        >
          {color.name}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#6b7280',
            marginBottom: '4px',
          }}
        >
          {color.hex.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#9ca3af',
            fontFamily: 'Fixel, sans-serif',
          }}
        >
          {color.usage}
        </div>
      </div>
    </div>
  );
};

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  variant = 'primary',
}: ColorPaletteProps) => {
  const getGridColumns = () => {
    switch (variant) {
      case 'primary':
        return 'repeat(3, 1fr)';
      case 'scale':
        return 'repeat(auto-fit, minmax(120px, 1fr))';
      case 'neutral':
        return 'repeat(auto-fit, minmax(140px, 1fr))';
      case 'semantic':
        return 'repeat(4, 1fr)';
      default:
        return 'repeat(4, 1fr)';
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: getGridColumns(),
        gap: '12px',
        marginTop: '16px',
        marginBottom: '32px',
        width: '100%',
        maxWidth: '100%',
        overflow: 'visible',
      }}
    >
      {colors.map((color) => (
        <ColorSwatch
          key={color.hex + color.name}
          color={color}
          size={variant === 'scale' ? 'small' : 'large'}
        />
      ))}
    </div>
  );
};
