/**
 * IconSearch - Searchable Lucide icon browser for the Iconography documentation
 */
import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  SLATE,
  PRIMITIVES,
  RADIUS,
} from '../../constants/designTokens';

// Curated list of commonly used icons with categories
const ICON_CATALOG = [
  // Navigation & Actions
  { name: 'Home', category: 'Navigation' },
  { name: 'Search', category: 'Navigation' },
  { name: 'Menu', category: 'Navigation' },
  { name: 'Settings', category: 'Navigation' },
  { name: 'User', category: 'Navigation' },
  { name: 'Bell', category: 'Navigation' },
  { name: 'Plus', category: 'Actions' },
  { name: 'Minus', category: 'Actions' },
  { name: 'Edit', category: 'Actions' },
  { name: 'Trash2', category: 'Actions' },
  { name: 'Download', category: 'Actions' },
  { name: 'Upload', category: 'Actions' },
  { name: 'Share2', category: 'Actions' },
  { name: 'Copy', category: 'Actions' },
  { name: 'Clipboard', category: 'Actions' },
  { name: 'Save', category: 'Actions' },
  { name: 'Refresh', category: 'Actions' },
  { name: 'RefreshCw', category: 'Actions' },
  { name: 'RotateCcw', category: 'Actions' },
  { name: 'RotateCw', category: 'Actions' },

  // Directional
  { name: 'ChevronRight', category: 'Directional' },
  { name: 'ChevronLeft', category: 'Directional' },
  { name: 'ChevronUp', category: 'Directional' },
  { name: 'ChevronDown', category: 'Directional' },
  { name: 'ArrowRight', category: 'Directional' },
  { name: 'ArrowLeft', category: 'Directional' },
  { name: 'ArrowUp', category: 'Directional' },
  { name: 'ArrowDown', category: 'Directional' },
  { name: 'ExternalLink', category: 'Directional' },
  { name: 'Link', category: 'Directional' },
  { name: 'CornerDownRight', category: 'Directional' },
  { name: 'MoveRight', category: 'Directional' },

  // Status & Feedback
  { name: 'Check', category: 'Status' },
  { name: 'X', category: 'Status' },
  { name: 'CheckCircle', category: 'Status' },
  { name: 'XCircle', category: 'Status' },
  { name: 'AlertCircle', category: 'Status' },
  { name: 'AlertTriangle', category: 'Status' },
  { name: 'Info', category: 'Status' },
  { name: 'HelpCircle', category: 'Status' },
  { name: 'Loader', category: 'Status' },
  { name: 'Loader2', category: 'Status' },
  { name: 'CircleDot', category: 'Status' },
  { name: 'Circle', category: 'Status' },

  // Data & UI
  { name: 'Filter', category: 'Data' },
  { name: 'SortAsc', category: 'Data' },
  { name: 'SortDesc', category: 'Data' },
  { name: 'Grid', category: 'Layout' },
  { name: 'List', category: 'Layout' },
  { name: 'Columns', category: 'Layout' },
  { name: 'Rows', category: 'Layout' },
  { name: 'Table', category: 'Layout' },
  { name: 'LayoutGrid', category: 'Layout' },
  { name: 'LayoutList', category: 'Layout' },
  { name: 'Layers', category: 'Layout' },
  { name: 'Layout', category: 'Layout' },

  // Files & Folders
  { name: 'File', category: 'Files' },
  { name: 'FileText', category: 'Files' },
  { name: 'Folder', category: 'Files' },
  { name: 'FolderOpen', category: 'Files' },
  { name: 'Image', category: 'Files' },
  { name: 'FileImage', category: 'Files' },
  { name: 'FileCode', category: 'Files' },
  { name: 'FilePlus', category: 'Files' },
  { name: 'FileCheck', category: 'Files' },

  // Charts & Analytics
  { name: 'Activity', category: 'Charts' },
  { name: 'BarChart2', category: 'Charts' },
  { name: 'BarChart3', category: 'Charts' },
  { name: 'PieChart', category: 'Charts' },
  { name: 'LineChart', category: 'Charts' },
  { name: 'TrendingUp', category: 'Charts' },
  { name: 'TrendingDown', category: 'Charts' },
  { name: 'Zap', category: 'Charts' },

  // Commerce
  { name: 'DollarSign', category: 'Commerce' },
  { name: 'CreditCard', category: 'Commerce' },
  { name: 'ShoppingCart', category: 'Commerce' },
  { name: 'ShoppingBag', category: 'Commerce' },
  { name: 'Package', category: 'Commerce' },
  { name: 'Truck', category: 'Commerce' },
  { name: 'Receipt', category: 'Commerce' },
  { name: 'Wallet', category: 'Commerce' },

  // Communication
  { name: 'Mail', category: 'Communication' },
  { name: 'MessageSquare', category: 'Communication' },
  { name: 'MessageCircle', category: 'Communication' },
  { name: 'Send', category: 'Communication' },
  { name: 'Phone', category: 'Communication' },
  { name: 'PhoneCall', category: 'Communication' },
  { name: 'Paperclip', category: 'Communication' },
  { name: 'AtSign', category: 'Communication' },

  // Location
  { name: 'MapPin', category: 'Location' },
  { name: 'Map', category: 'Location' },
  { name: 'Globe', category: 'Location' },
  { name: 'Navigation', category: 'Location' },
  { name: 'Compass', category: 'Location' },

  // Security
  { name: 'Lock', category: 'Security' },
  { name: 'Unlock', category: 'Security' },
  { name: 'Shield', category: 'Security' },
  { name: 'ShieldCheck', category: 'Security' },
  { name: 'Key', category: 'Security' },
  { name: 'Eye', category: 'Security' },
  { name: 'EyeOff', category: 'Security' },
  { name: 'Fingerprint', category: 'Security' },

  // Media
  { name: 'Play', category: 'Media' },
  { name: 'Pause', category: 'Media' },
  { name: 'Stop', category: 'Media' },
  { name: 'SkipForward', category: 'Media' },
  { name: 'SkipBack', category: 'Media' },
  { name: 'Volume2', category: 'Media' },
  { name: 'VolumeX', category: 'Media' },
  { name: 'Maximize', category: 'Media' },
  { name: 'Minimize', category: 'Media' },
  { name: 'Camera', category: 'Media' },
  { name: 'Video', category: 'Media' },

  // Users & Social
  { name: 'Users', category: 'Users' },
  { name: 'UserPlus', category: 'Users' },
  { name: 'UserMinus', category: 'Users' },
  { name: 'UserCheck', category: 'Users' },
  { name: 'UserX', category: 'Users' },
  { name: 'ThumbsUp', category: 'Social' },
  { name: 'ThumbsDown', category: 'Social' },
  { name: 'Heart', category: 'Social' },
  { name: 'Star', category: 'Social' },

  // Time & Calendar
  { name: 'Calendar', category: 'Time' },
  { name: 'CalendarDays', category: 'Time' },
  { name: 'Clock', category: 'Time' },
  { name: 'Timer', category: 'Time' },
  { name: 'Hourglass', category: 'Time' },
  { name: 'History', category: 'Time' },

  // Weather & Nature
  { name: 'Sun', category: 'Weather' },
  { name: 'Moon', category: 'Weather' },
  { name: 'Cloud', category: 'Weather' },
  { name: 'CloudRain', category: 'Weather' },
  { name: 'Wind', category: 'Weather' },
  { name: 'Droplets', category: 'Weather' },
  { name: 'Waves', category: 'Marine' },
  { name: 'Leaf', category: 'Nature' },

  // Marine (brand themed)
  { name: 'Anchor', category: 'Marine' },
  { name: 'Shell', category: 'Marine' },
  { name: 'Ship', category: 'Marine' },
  { name: 'Sailboat', category: 'Marine' },
  { name: 'Fish', category: 'Marine' },

  // Tech & Dev
  { name: 'Terminal', category: 'Tech' },
  { name: 'Code', category: 'Tech' },
  { name: 'Braces', category: 'Tech' },
  { name: 'Database', category: 'Tech' },
  { name: 'Server', category: 'Tech' },
  { name: 'Cpu', category: 'Tech' },
  { name: 'HardDrive', category: 'Tech' },
  { name: 'Wifi', category: 'Tech' },
  { name: 'Bluetooth', category: 'Tech' },
  { name: 'Github', category: 'Tech' },

  // Misc
  { name: 'Bookmark', category: 'Misc' },
  { name: 'Tag', category: 'Misc' },
  { name: 'Tags', category: 'Misc' },
  { name: 'Award', category: 'Misc' },
  { name: 'Gift', category: 'Misc' },
  { name: 'Sparkles', category: 'Misc' },
  { name: 'Lightbulb', category: 'Misc' },
  { name: 'Palette', category: 'Misc' },
  { name: 'Target', category: 'Misc' },
  { name: 'Hash', category: 'Misc' },
  { name: 'Percent', category: 'Misc' },
  { name: 'Calculator', category: 'Misc' },
  { name: 'QrCode', category: 'Misc' },
  { name: 'Smile', category: 'Misc' },
  { name: 'Frown', category: 'Misc' },
  { name: 'Meh', category: 'Misc' },
  { name: 'MoreHorizontal', category: 'Misc' },
  { name: 'MoreVertical', category: 'Misc' },
  { name: 'Grip', category: 'Misc' },
  { name: 'GripVertical', category: 'Misc' },
  { name: 'Move', category: 'Misc' },
  { name: 'Expand', category: 'Misc' },
  { name: 'Shrink', category: 'Misc' },
  { name: 'PanelLeft', category: 'Misc' },
  { name: 'PanelRight', category: 'Misc' },
  { name: 'SidebarOpen', category: 'Misc' },
  { name: 'SidebarClose', category: 'Misc' },
];

// Get all unique categories
const CATEGORIES = [...new Set(ICON_CATALOG.map(i => i.category))];

interface IconSearchProps {
  defaultCategory?: string;
}

export const IconSearch: React.FC<IconSearchProps> = ({ defaultCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(defaultCategory || null);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const filteredIcons = useMemo(() => {
    return ICON_CATALOG.filter(item => {
      const matchesSearch = searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleCopyIcon = (iconName: string) => {
    const importStatement = `import { ${iconName} } from 'lucide-react';`;
    navigator.clipboard.writeText(importStatement);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const SearchIcon = LucideIcons.Search;

  return (
    <div>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
      }}>
        <div style={{
          flex: 1,
          position: 'relative',
        }}>
          <SearchIcon
            size={18}
            color={SLATE[400]}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              fontSize: '14px',
              fontFamily: '"Fixel", sans-serif',
              border: `1px solid ${SLATE[300]}`,
              borderRadius: RADIUS.md,
              outline: 'none',
              background: PRIMITIVES.white,
              color: ABYSS[500],
              transition: 'border-color 200ms ease-out',
            }}
            onFocus={(e) => e.target.style.borderColor = DEEP_CURRENT[500]}
            onBlur={(e) => e.target.style.borderColor = SLATE[300]}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '20px',
      }}>
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: '6px 14px',
            fontSize: '13px',
            fontFamily: '"Fixel", sans-serif',
            fontWeight: 500,
            border: 'none',
            borderRadius: RADIUS.sm,
            cursor: 'pointer',
            transition: 'all 200ms ease-out',
            background: selectedCategory === null ? DEEP_CURRENT[500] : SLATE[100],
            color: selectedCategory === null ? PRIMITIVES.white : ABYSS[500],
          }}
        >
          All ({ICON_CATALOG.length})
        </button>
        {CATEGORIES.map(category => {
          const count = ICON_CATALOG.filter(i => i.category === category).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                fontFamily: '"Fixel", sans-serif',
                fontWeight: 500,
                border: 'none',
                borderRadius: RADIUS.sm,
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                background: selectedCategory === category ? DEEP_CURRENT[500] : SLATE[100],
                color: selectedCategory === category ? PRIMITIVES.white : ABYSS[500],
              }}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div style={{
        fontSize: '13px',
        fontFamily: '"Fixel", sans-serif',
        color: DUSK_REEF[500],
        marginBottom: '16px',
      }}>
        {filteredIcons.length} icons found
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      {/* Icon Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '12px',
      }}>
        {filteredIcons.map(({ name }) => {
          const IconComponent = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name];
          if (!IconComponent) return null;

          const isCopied = copiedIcon === name;

          return (
            <button
              key={name}
              onClick={() => handleCopyIcon(name)}
              title={`Click to copy: import { ${name} } from 'lucide-react'`}
              style={{
                background: isCopied ? DEEP_CURRENT[50] : PRIMITIVES.white,
                borderRadius: RADIUS.sm,
                padding: '16px 8px',
                border: `1px solid ${isCopied ? DEEP_CURRENT[300] : SLATE[200]}`,
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                textAlign: 'center',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                color: isCopied ? DEEP_CURRENT[600] : ABYSS[500],
              }}>
                <IconComponent size={24} />
              </div>
              <div style={{
                fontSize: '11px',
                fontFamily: '"Fixel", sans-serif',
                color: isCopied ? DEEP_CURRENT[600] : SLATE[500],
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: isCopied ? 600 : 400,
              }}>
                {isCopied ? 'Copied!' : name}
              </div>
            </button>
          );
        })}
      </div>

      {/* No Results */}
      {filteredIcons.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: DUSK_REEF[500],
          fontFamily: '"Fixel", sans-serif',
        }}>
          <div style={{ marginBottom: '8px', fontSize: '14px' }}>
            No icons found for "{searchTerm}"
          </div>
          <div style={{ fontSize: '13px' }}>
            Try a different search term or browse all icons at{' '}
            <a
              href="https://lucide.dev/icons"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: DEEP_CURRENT[500] }}
            >
              lucide.dev
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconSearch;
