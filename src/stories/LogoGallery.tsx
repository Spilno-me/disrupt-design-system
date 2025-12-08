import React, { useState } from 'react';
import { Download, Check, ChevronDown } from 'lucide-react';
import { ALIAS } from '../constants/designTokens';

type ExportFormat = 'PNG' | 'SVG';
type ExportScale = '1x' | '2x' | '3x';

interface Logo {
  name: string;
  darkSrc: string;
  lightSrc: string;
}

const logos: Logo[] = [
  {
    name: 'Disrupt',
    darkSrc: '/logos/D-pixels-dark-full.svg',
    lightSrc: '/logos/D-pixels-light-full.svg',
  },
  {
    name: 'Flow',
    darkSrc: '/logos/flow-logo-full-dark.svg',
    lightSrc: '/logos/flow-logo-full-light.svg',
  },
  {
    name: 'Market',
    darkSrc: '/logos/market-logo-full-dark.svg',
    lightSrc: '/logos/market-logo-full-ligh.svg',
  },
  {
    name: 'Partner',
    darkSrc: '/logos/partner-logo-full-dark.svg',
    lightSrc: '/logos/partner-logo-full-light.svg',
  },
];

interface DropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '8px 12px',
          background: ALIAS.text.primary,
          border: 'none',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '13px',
          fontFamily: 'Fixel, sans-serif',
          cursor: 'pointer',
          minWidth: '80px',
        }}
      >
        {value}
        <ChevronDown size={14} />
      </button>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            marginBottom: '4px',
            background: ALIAS.text.primary,
            borderRadius: '6px',
            overflow: 'hidden',
            zIndex: 100,
            minWidth: '100%',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.2)',
          }}
        >
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                background: option === value ? ALIAS.brand.secondary : 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'Fixel, sans-serif',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {option === value && <Check size={14} />}
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface LogoCardProps {
  logo: Logo;
  variant: 'dark' | 'light';
}

const LogoCard: React.FC<LogoCardProps> = ({ logo, variant }) => {
  const [format, setFormat] = useState<ExportFormat>('PNG');
  const [scale, setScale] = useState<ExportScale>('2x');
  const [isExporting, setIsExporting] = useState(false);

  const src = variant === 'dark' ? logo.darkSrc : logo.lightSrc;
  const bgColor = variant === 'dark' ? '#f5f5f5' : ALIAS.text.primary;
  const fileName = `${logo.name.toLowerCase()}-logo-${variant}`;

  const handleExport = async () => {
    setIsExporting(true);

    try {
      if (format === 'SVG') {
        // Direct SVG download
        const response = await fetch(src);
        const svgText = await response.text();
        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // PNG export with canvas
        const scaleValue = parseInt(scale);
        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = src;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Could not get canvas context');

        canvas.width = img.width * scaleValue;
        canvas.height = img.height * scaleValue;

        ctx.scale(scaleValue, scaleValue);
        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}@${scale}.png`;
        link.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    }

    setIsExporting(false);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        overflow: 'visible',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
      }}
    >
      {/* Logo Preview */}
      <div
        style={{
          background: bgColor,
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '120px',
        }}
      >
        <img
          src={src}
          alt={`${logo.name} ${variant}`}
          style={{ maxHeight: '60px', maxWidth: '180px' }}
        />
      </div>

      {/* Export Controls */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          overflow: 'visible',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: ALIAS.text.primary,
              fontFamily: 'Fixel, sans-serif',
            }}
          >
            {logo.name}
            <span
              style={{
                marginLeft: '8px',
                fontSize: '12px',
                fontWeight: 400,
                color: '#6b7280',
                textTransform: 'capitalize',
              }}
            >
              {variant}
            </span>
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {format === 'PNG' && (
            <Dropdown
              value={scale}
              options={['1x', '2x', '3x']}
              onChange={(v) => setScale(v as ExportScale)}
            />
          )}
          <Dropdown
            value={format}
            options={['PNG', 'SVG']}
            onChange={(v) => setFormat(v as ExportFormat)}
          />
          <button
            onClick={handleExport}
            disabled={isExporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: ALIAS.brand.secondary,
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'Fixel, sans-serif',
              cursor: isExporting ? 'wait' : 'pointer',
              opacity: isExporting ? 0.7 : 1,
              marginLeft: 'auto',
            }}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export const LogoGallery: React.FC = () => {
  return (
    <div style={{ marginTop: '32px' }}>
      {logos.map((logo) => (
        <div key={logo.name} style={{ marginBottom: '48px' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: ALIAS.text.primary,
              marginBottom: '16px',
              fontFamily: 'Fixel, sans-serif',
            }}
          >
            {logo.name}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
            }}
          >
            <LogoCard logo={logo} variant="dark" />
            <LogoCard logo={logo} variant="light" />
          </div>
        </div>
      ))}
    </div>
  );
};
