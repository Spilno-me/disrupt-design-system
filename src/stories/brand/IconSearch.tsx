/**
 * IconSearch - Searchable Lucide icon browser with fuzzy search and download
 *
 * Features:
 * - Fuzzy search with semantic tags (e.g., "stop" finds X, XCircle, Ban)
 * - SVG download functionality
 * - Category filtering
 * - Copy import statement
 */
import React, { useState, useMemo, useCallback, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  SLATE,
  PRIMITIVES,
  RADIUS,

  TYPOGRAPHY,
} from '../../constants/designTokens';

// Semantic tags for fuzzy search - each icon has related meanings
type IconEntry = {
  name: string;
  category: string;
  tags: string[];
};

// Curated list of commonly used icons with categories and semantic tags
const ICON_CATALOG: IconEntry[] = [
  // Navigation & Actions
  { name: 'Home', category: 'Navigation', tags: ['house', 'main', 'start', 'dashboard', 'landing'] },
  { name: 'Search', category: 'Navigation', tags: ['find', 'lookup', 'query', 'magnify', 'explore'] },
  { name: 'Menu', category: 'Navigation', tags: ['hamburger', 'navigation', 'sidebar', 'options', 'drawer'] },
  { name: 'Settings', category: 'Navigation', tags: ['gear', 'cog', 'preferences', 'config', 'options', 'configure'] },
  { name: 'User', category: 'Navigation', tags: ['person', 'profile', 'account', 'avatar', 'member'] },
  { name: 'Bell', category: 'Navigation', tags: ['notification', 'alert', 'alarm', 'reminder', 'notify'] },
  { name: 'Plus', category: 'Actions', tags: ['add', 'new', 'create', 'insert', 'expand', 'positive'] },
  { name: 'Minus', category: 'Actions', tags: ['remove', 'subtract', 'delete', 'reduce', 'negative'] },
  { name: 'Edit', category: 'Actions', tags: ['pencil', 'modify', 'change', 'update', 'write', 'pen'] },
  { name: 'Trash2', category: 'Actions', tags: ['delete', 'remove', 'bin', 'garbage', 'discard', 'destroy'] },
  { name: 'Download', category: 'Actions', tags: ['save', 'export', 'get', 'fetch', 'retrieve', 'arrow down'] },
  { name: 'Upload', category: 'Actions', tags: ['import', 'send', 'push', 'submit', 'arrow up'] },
  { name: 'Share2', category: 'Actions', tags: ['send', 'distribute', 'social', 'forward', 'export'] },
  { name: 'Copy', category: 'Actions', tags: ['duplicate', 'clone', 'replicate', 'clipboard'] },
  { name: 'Clipboard', category: 'Actions', tags: ['paste', 'copy', 'buffer', 'notes'] },
  { name: 'Save', category: 'Actions', tags: ['floppy', 'disk', 'store', 'persist', 'keep'] },
  { name: 'Refresh', category: 'Actions', tags: ['reload', 'sync', 'update', 'retry', 'again'] },
  { name: 'RefreshCw', category: 'Actions', tags: ['reload', 'sync', 'update', 'retry', 'rotate', 'spin'] },
  { name: 'RotateCcw', category: 'Actions', tags: ['undo', 'back', 'revert', 'counterclockwise', 'reset'] },
  { name: 'RotateCw', category: 'Actions', tags: ['redo', 'forward', 'clockwise', 'repeat'] },

  // Directional
  { name: 'ChevronRight', category: 'Directional', tags: ['next', 'forward', 'expand', 'open', 'arrow'] },
  { name: 'ChevronLeft', category: 'Directional', tags: ['back', 'previous', 'collapse', 'close', 'arrow'] },
  { name: 'ChevronUp', category: 'Directional', tags: ['collapse', 'up', 'minimize', 'arrow'] },
  { name: 'ChevronDown', category: 'Directional', tags: ['expand', 'down', 'dropdown', 'arrow', 'open'] },
  { name: 'ArrowRight', category: 'Directional', tags: ['next', 'forward', 'continue', 'proceed', 'go'] },
  { name: 'ArrowLeft', category: 'Directional', tags: ['back', 'previous', 'return', 'go back'] },
  { name: 'ArrowUp', category: 'Directional', tags: ['up', 'increase', 'rise', 'ascend'] },
  { name: 'ArrowDown', category: 'Directional', tags: ['down', 'decrease', 'fall', 'descend'] },
  { name: 'ExternalLink', category: 'Directional', tags: ['open', 'new tab', 'external', 'outside', 'launch'] },
  { name: 'Link', category: 'Directional', tags: ['url', 'chain', 'connect', 'hyperlink', 'anchor'] },
  { name: 'CornerDownRight', category: 'Directional', tags: ['enter', 'return', 'reply', 'indent'] },
  { name: 'MoveRight', category: 'Directional', tags: ['transfer', 'shift', 'relocate', 'slide'] },

  // Status & Feedback
  { name: 'Check', category: 'Status', tags: ['done', 'complete', 'success', 'yes', 'confirm', 'tick', 'ok', 'approve'] },
  { name: 'X', category: 'Status', tags: ['close', 'cancel', 'stop', 'remove', 'delete', 'no', 'reject', 'exit', 'dismiss'] },
  { name: 'CheckCircle', category: 'Status', tags: ['done', 'complete', 'success', 'verified', 'approved', 'valid', 'tick'] },
  { name: 'XCircle', category: 'Status', tags: ['error', 'fail', 'stop', 'cancel', 'close', 'invalid', 'reject', 'block', 'forbidden'] },
  { name: 'AlertCircle', category: 'Status', tags: ['warning', 'error', 'attention', 'exclamation', 'problem', 'issue'] },
  { name: 'AlertTriangle', category: 'Status', tags: ['warning', 'danger', 'caution', 'alert', 'hazard', 'risk'] },
  { name: 'Info', category: 'Status', tags: ['information', 'help', 'details', 'about', 'hint'] },
  { name: 'HelpCircle', category: 'Status', tags: ['question', 'support', 'faq', 'assistance', 'what'] },
  { name: 'Loader', category: 'Status', tags: ['loading', 'spinner', 'wait', 'progress', 'busy'] },
  { name: 'Loader2', category: 'Status', tags: ['loading', 'spinner', 'wait', 'progress', 'busy', 'spin'] },
  { name: 'CircleDot', category: 'Status', tags: ['radio', 'selected', 'active', 'current', 'dot'] },
  { name: 'Circle', category: 'Status', tags: ['empty', 'unselected', 'radio', 'bullet', 'dot'] },
  { name: 'Ban', category: 'Status', tags: ['stop', 'block', 'forbidden', 'prohibited', 'no', 'cancel', 'disable', 'restrict'] },
  { name: 'CircleSlash', category: 'Status', tags: ['stop', 'block', 'forbidden', 'prohibited', 'no', 'disable', 'null'] },
  { name: 'OctagonX', category: 'Status', tags: ['stop', 'halt', 'danger', 'block', 'forbidden'] },

  // Data & UI
  { name: 'Filter', category: 'Data', tags: ['funnel', 'sort', 'refine', 'search', 'narrow'] },
  { name: 'SortAsc', category: 'Data', tags: ['ascending', 'order', 'arrange', 'az', 'smallest'] },
  { name: 'SortDesc', category: 'Data', tags: ['descending', 'order', 'arrange', 'za', 'largest'] },
  { name: 'Grid', category: 'Layout', tags: ['tiles', 'gallery', 'cards', 'matrix', 'view'] },
  { name: 'List', category: 'Layout', tags: ['rows', 'lines', 'items', 'view', 'menu'] },
  { name: 'Columns', category: 'Layout', tags: ['layout', 'split', 'side by side', 'grid'] },
  { name: 'Rows', category: 'Layout', tags: ['layout', 'horizontal', 'stack', 'lines'] },
  { name: 'Table', category: 'Layout', tags: ['data', 'grid', 'spreadsheet', 'cells', 'rows'] },
  { name: 'LayoutGrid', category: 'Layout', tags: ['dashboard', 'tiles', 'modules', 'widgets'] },
  { name: 'LayoutList', category: 'Layout', tags: ['list view', 'rows', 'items', 'details'] },
  { name: 'Layers', category: 'Layout', tags: ['stack', 'levels', 'depth', 'sheets', 'overlap'] },
  { name: 'Layout', category: 'Layout', tags: ['template', 'structure', 'design', 'arrange'] },

  // Files & Folders
  { name: 'File', category: 'Files', tags: ['document', 'page', 'paper', 'blank', 'new'] },
  { name: 'FileText', category: 'Files', tags: ['document', 'text', 'readme', 'content', 'article'] },
  { name: 'Folder', category: 'Files', tags: ['directory', 'container', 'group', 'collection'] },
  { name: 'FolderOpen', category: 'Files', tags: ['directory', 'open', 'browse', 'explore'] },
  { name: 'Image', category: 'Files', tags: ['picture', 'photo', 'gallery', 'media', 'jpg', 'png'] },
  { name: 'FileImage', category: 'Files', tags: ['picture', 'photo', 'media', 'graphic'] },
  { name: 'FileCode', category: 'Files', tags: ['script', 'program', 'source', 'code', 'dev'] },
  { name: 'FilePlus', category: 'Files', tags: ['new file', 'create', 'add document'] },
  { name: 'FileCheck', category: 'Files', tags: ['verified', 'approved', 'valid', 'complete'] },

  // Charts & Analytics
  { name: 'Activity', category: 'Charts', tags: ['pulse', 'health', 'monitoring', 'heartbeat', 'stats'] },
  { name: 'BarChart2', category: 'Charts', tags: ['graph', 'statistics', 'analytics', 'data', 'metrics'] },
  { name: 'BarChart3', category: 'Charts', tags: ['graph', 'statistics', 'analytics', 'histogram'] },
  { name: 'PieChart', category: 'Charts', tags: ['graph', 'donut', 'percentage', 'distribution', 'share'] },
  { name: 'LineChart', category: 'Charts', tags: ['graph', 'trend', 'time series', 'progress'] },
  { name: 'TrendingUp', category: 'Charts', tags: ['growth', 'increase', 'positive', 'rise', 'improve', 'profit'] },
  { name: 'TrendingDown', category: 'Charts', tags: ['decline', 'decrease', 'negative', 'fall', 'loss'] },
  { name: 'Zap', category: 'Charts', tags: ['lightning', 'fast', 'power', 'energy', 'instant', 'flash'] },

  // Commerce
  { name: 'DollarSign', category: 'Commerce', tags: ['money', 'price', 'cost', 'payment', 'currency', 'usd', 'cash'] },
  { name: 'CreditCard', category: 'Commerce', tags: ['payment', 'card', 'visa', 'mastercard', 'checkout', 'buy'] },
  { name: 'ShoppingCart', category: 'Commerce', tags: ['cart', 'basket', 'buy', 'purchase', 'checkout', 'ecommerce'] },
  { name: 'ShoppingBag', category: 'Commerce', tags: ['bag', 'purchase', 'retail', 'store', 'shop'] },
  { name: 'Package', category: 'Commerce', tags: ['box', 'delivery', 'shipping', 'product', 'parcel', 'order'] },
  { name: 'Truck', category: 'Commerce', tags: ['delivery', 'shipping', 'transport', 'logistics', 'freight'] },
  { name: 'Receipt', category: 'Commerce', tags: ['invoice', 'bill', 'ticket', 'transaction', 'purchase'] },
  { name: 'Wallet', category: 'Commerce', tags: ['money', 'payment', 'cards', 'balance', 'funds'] },

  // Communication
  { name: 'Mail', category: 'Communication', tags: ['email', 'envelope', 'message', 'inbox', 'letter', 'contact'] },
  { name: 'MessageSquare', category: 'Communication', tags: ['chat', 'comment', 'message', 'bubble', 'conversation', 'talk'] },
  { name: 'MessageCircle', category: 'Communication', tags: ['chat', 'comment', 'message', 'bubble', 'talk'] },
  { name: 'Send', category: 'Communication', tags: ['submit', 'send', 'paper plane', 'dispatch', 'deliver'] },
  { name: 'Phone', category: 'Communication', tags: ['call', 'telephone', 'contact', 'mobile', 'dial'] },
  { name: 'PhoneCall', category: 'Communication', tags: ['calling', 'ringing', 'incoming', 'outgoing'] },
  { name: 'Paperclip', category: 'Communication', tags: ['attachment', 'attach', 'file', 'clip'] },
  { name: 'AtSign', category: 'Communication', tags: ['email', 'mention', 'at', 'username', 'handle'] },

  // Location
  { name: 'MapPin', category: 'Location', tags: ['marker', 'location', 'place', 'pin', 'gps', 'position', 'address'] },
  { name: 'Map', category: 'Location', tags: ['location', 'directions', 'navigation', 'geography'] },
  { name: 'Globe', category: 'Location', tags: ['world', 'earth', 'international', 'web', 'global', 'planet'] },
  { name: 'Navigation', category: 'Location', tags: ['compass', 'direction', 'gps', 'arrow', 'pointer'] },
  { name: 'Compass', category: 'Location', tags: ['direction', 'navigation', 'north', 'explore'] },

  // Security
  { name: 'Lock', category: 'Security', tags: ['secure', 'private', 'password', 'protected', 'closed', 'encrypt'] },
  { name: 'Unlock', category: 'Security', tags: ['open', 'unsecure', 'access', 'unlocked', 'decrypt'] },
  { name: 'Shield', category: 'Security', tags: ['protection', 'secure', 'safety', 'guard', 'defense'] },
  { name: 'ShieldCheck', category: 'Security', tags: ['verified', 'protected', 'secure', 'safe', 'approved'] },
  { name: 'Key', category: 'Security', tags: ['password', 'access', 'unlock', 'credential', 'authentication'] },
  { name: 'Eye', category: 'Security', tags: ['view', 'visible', 'show', 'watch', 'see', 'preview', 'look'] },
  { name: 'EyeOff', category: 'Security', tags: ['hide', 'invisible', 'hidden', 'private', 'blind', 'password'] },
  { name: 'Fingerprint', category: 'Security', tags: ['biometric', 'identity', 'authentication', 'scan', 'touch id'] },

  // Media
  { name: 'Play', category: 'Media', tags: ['start', 'video', 'music', 'begin', 'resume', 'media'] },
  { name: 'Pause', category: 'Media', tags: ['stop', 'wait', 'hold', 'suspend', 'break'] },
  { name: 'Square', category: 'Media', tags: ['stop', 'end', 'halt', 'media', 'player'] },
  { name: 'SkipForward', category: 'Media', tags: ['next', 'forward', 'skip', 'advance'] },
  { name: 'SkipBack', category: 'Media', tags: ['previous', 'back', 'rewind', 'skip'] },
  { name: 'Volume2', category: 'Media', tags: ['sound', 'audio', 'speaker', 'loud', 'music'] },
  { name: 'VolumeX', category: 'Media', tags: ['mute', 'silent', 'no sound', 'quiet', 'off'] },
  { name: 'Maximize', category: 'Media', tags: ['fullscreen', 'expand', 'enlarge', 'zoom in'] },
  { name: 'Minimize', category: 'Media', tags: ['exit fullscreen', 'shrink', 'reduce', 'zoom out'] },
  { name: 'Camera', category: 'Media', tags: ['photo', 'picture', 'capture', 'snapshot', 'photography'] },
  { name: 'Video', category: 'Media', tags: ['movie', 'recording', 'film', 'camera', 'stream'] },

  // Users & Social
  { name: 'Users', category: 'Users', tags: ['people', 'group', 'team', 'members', 'community'] },
  { name: 'UserPlus', category: 'Users', tags: ['add user', 'invite', 'new member', 'signup', 'register'] },
  { name: 'UserMinus', category: 'Users', tags: ['remove user', 'delete', 'kick', 'ban'] },
  { name: 'UserCheck', category: 'Users', tags: ['verified user', 'approved', 'active', 'confirmed'] },
  { name: 'UserX', category: 'Users', tags: ['blocked user', 'banned', 'removed', 'inactive', 'stop'] },
  { name: 'ThumbsUp', category: 'Social', tags: ['like', 'approve', 'yes', 'good', 'agree', 'positive'] },
  { name: 'ThumbsDown', category: 'Social', tags: ['dislike', 'reject', 'no', 'bad', 'disagree', 'negative'] },
  { name: 'Heart', category: 'Social', tags: ['love', 'favorite', 'like', 'health', 'care'] },
  { name: 'Star', category: 'Social', tags: ['favorite', 'rating', 'bookmark', 'important', 'featured'] },

  // Time & Calendar
  { name: 'Calendar', category: 'Time', tags: ['date', 'schedule', 'event', 'appointment', 'day', 'month'] },
  { name: 'CalendarDays', category: 'Time', tags: ['schedule', 'dates', 'week', 'planner', 'agenda'] },
  { name: 'Clock', category: 'Time', tags: ['time', 'hour', 'watch', 'schedule', 'duration'] },
  { name: 'Timer', category: 'Time', tags: ['countdown', 'stopwatch', 'duration', 'elapsed'] },
  { name: 'Hourglass', category: 'Time', tags: ['waiting', 'loading', 'time', 'pending', 'progress'] },
  { name: 'History', category: 'Time', tags: ['past', 'previous', 'log', 'recent', 'timeline', 'undo'] },

  // Weather & Nature
  { name: 'Sun', category: 'Weather', tags: ['light', 'day', 'bright', 'sunny', 'weather', 'morning'] },
  { name: 'Moon', category: 'Weather', tags: ['night', 'dark', 'sleep', 'evening', 'dark mode'] },
  { name: 'Cloud', category: 'Weather', tags: ['weather', 'sky', 'cloudy', 'storage', 'server'] },
  { name: 'CloudRain', category: 'Weather', tags: ['rain', 'weather', 'wet', 'storm'] },
  { name: 'Wind', category: 'Weather', tags: ['air', 'breeze', 'weather', 'blow'] },
  { name: 'Droplets', category: 'Weather', tags: ['water', 'rain', 'liquid', 'humidity', 'drops'] },
  { name: 'Waves', category: 'Marine', tags: ['water', 'ocean', 'sea', 'wave', 'flow'] },
  { name: 'Leaf', category: 'Nature', tags: ['plant', 'eco', 'green', 'nature', 'organic', 'environment'] },

  // Marine (brand themed)
  { name: 'Anchor', category: 'Marine', tags: ['boat', 'ship', 'port', 'harbor', 'stability', 'dock'] },
  { name: 'Shell', category: 'Marine', tags: ['beach', 'ocean', 'sea', 'shell', 'coastal'] },
  { name: 'Ship', category: 'Marine', tags: ['boat', 'vessel', 'cruise', 'ferry', 'transport', 'cargo'] },
  { name: 'Sailboat', category: 'Marine', tags: ['boat', 'sail', 'yacht', 'sailing', 'wind'] },
  { name: 'Fish', category: 'Marine', tags: ['sea', 'ocean', 'aquatic', 'seafood', 'marine'] },

  // Tech & Dev
  { name: 'Terminal', category: 'Tech', tags: ['command', 'console', 'shell', 'cli', 'prompt', 'code'] },
  { name: 'Code', category: 'Tech', tags: ['programming', 'developer', 'html', 'brackets', 'script'] },
  { name: 'Braces', category: 'Tech', tags: ['code', 'json', 'object', 'curly', 'programming'] },
  { name: 'Database', category: 'Tech', tags: ['storage', 'data', 'sql', 'server', 'backend'] },
  { name: 'Server', category: 'Tech', tags: ['backend', 'hosting', 'infrastructure', 'computer'] },
  { name: 'Cpu', category: 'Tech', tags: ['processor', 'computer', 'chip', 'hardware', 'performance'] },
  { name: 'HardDrive', category: 'Tech', tags: ['storage', 'disk', 'save', 'memory', 'backup'] },
  { name: 'Wifi', category: 'Tech', tags: ['internet', 'wireless', 'network', 'connection', 'signal'] },
  { name: 'Bluetooth', category: 'Tech', tags: ['wireless', 'connect', 'pair', 'device'] },
  { name: 'Github', category: 'Tech', tags: ['git', 'repository', 'code', 'version control', 'source'] },

  // Misc
  { name: 'Bookmark', category: 'Misc', tags: ['save', 'favorite', 'mark', 'flag', 'remember'] },
  { name: 'Tag', category: 'Misc', tags: ['label', 'category', 'price', 'meta', 'keyword'] },
  { name: 'Tags', category: 'Misc', tags: ['labels', 'categories', 'keywords', 'multiple'] },
  { name: 'Award', category: 'Misc', tags: ['prize', 'trophy', 'medal', 'achievement', 'winner', 'badge'] },
  { name: 'Gift', category: 'Misc', tags: ['present', 'reward', 'surprise', 'bonus', 'package'] },
  { name: 'Sparkles', category: 'Misc', tags: ['magic', 'new', 'special', 'ai', 'stars', 'shine', 'clean'] },
  { name: 'Lightbulb', category: 'Misc', tags: ['idea', 'tip', 'suggestion', 'insight', 'innovation', 'creative'] },
  { name: 'Palette', category: 'Misc', tags: ['color', 'design', 'art', 'theme', 'paint', 'style'] },
  { name: 'Target', category: 'Misc', tags: ['goal', 'aim', 'focus', 'objective', 'bullseye'] },
  { name: 'Hash', category: 'Misc', tags: ['hashtag', 'number', 'pound', 'tag', 'channel'] },
  { name: 'Percent', category: 'Misc', tags: ['percentage', 'discount', 'ratio', 'sale', 'off'] },
  { name: 'Calculator', category: 'Misc', tags: ['math', 'calculate', 'numbers', 'compute', 'finance'] },
  { name: 'QrCode', category: 'Misc', tags: ['scan', 'barcode', 'code', 'link', 'quick response'] },
  { name: 'Smile', category: 'Misc', tags: ['happy', 'emoji', 'face', 'positive', 'good', 'smiley'] },
  { name: 'Frown', category: 'Misc', tags: ['sad', 'emoji', 'face', 'negative', 'unhappy'] },
  { name: 'Meh', category: 'Misc', tags: ['neutral', 'emoji', 'face', 'okay', 'indifferent'] },
  { name: 'MoreHorizontal', category: 'Misc', tags: ['menu', 'options', 'dots', 'ellipsis', 'actions', 'overflow'] },
  { name: 'MoreVertical', category: 'Misc', tags: ['menu', 'options', 'dots', 'ellipsis', 'kebab', 'actions'] },
  { name: 'Grip', category: 'Misc', tags: ['drag', 'handle', 'move', 'reorder', 'grab'] },
  { name: 'GripVertical', category: 'Misc', tags: ['drag', 'handle', 'move', 'reorder', 'grab'] },
  { name: 'Move', category: 'Misc', tags: ['drag', 'reposition', 'relocate', 'arrange', 'arrows'] },
  { name: 'Expand', category: 'Misc', tags: ['enlarge', 'grow', 'fullscreen', 'maximize', 'bigger'] },
  { name: 'Shrink', category: 'Misc', tags: ['reduce', 'minimize', 'smaller', 'compress', 'collapse'] },
  { name: 'PanelLeft', category: 'Misc', tags: ['sidebar', 'layout', 'panel', 'dock', 'left'] },
  { name: 'PanelRight', category: 'Misc', tags: ['sidebar', 'layout', 'panel', 'dock', 'right'] },
  { name: 'SidebarOpen', category: 'Misc', tags: ['menu', 'expand', 'navigation', 'show', 'open'] },
  { name: 'SidebarClose', category: 'Misc', tags: ['menu', 'collapse', 'navigation', 'hide', 'close'] },
  { name: 'HandStop', category: 'Misc', tags: ['stop', 'halt', 'wait', 'hand', 'pause', 'block'] },
  { name: 'CircleStop', category: 'Misc', tags: ['stop', 'end', 'halt', 'media', 'player'] },
];

/**
 * Simple fuzzy search implementation
 * Matches if:
 * 1. Query is a substring of the target (case-insensitive)
 * 2. All characters of query appear in target in order (fuzzy)
 * 3. Levenshtein distance is below threshold for short queries
 */
function fuzzyMatch(query: string, target: string): { match: boolean; score: number } {
  const q = query.toLowerCase();
  const t = target.toLowerCase();

  // Exact substring match - highest score
  if (t.includes(q)) {
    // Bonus for starts with
    const startsBonus = t.startsWith(q) ? 100 : 0;
    return { match: true, score: 200 + startsBonus - t.length };
  }

  // Character sequence match (fuzzy)
  let qIndex = 0;
  let consecutiveMatches = 0;
  let maxConsecutive = 0;

  for (let tIndex = 0; tIndex < t.length && qIndex < q.length; tIndex++) {
    if (t[tIndex] === q[qIndex]) {
      qIndex++;
      consecutiveMatches++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
    } else {
      consecutiveMatches = 0;
    }
  }

  if (qIndex === q.length) {
    return { match: true, score: 50 + maxConsecutive * 10 };
  }

  // Levenshtein distance for short queries (typo tolerance)
  if (q.length >= 3 && q.length <= 6) {
    const distance = levenshteinDistance(q, t.substring(0, Math.min(t.length, q.length + 2)));
    if (distance <= 2) {
      return { match: true, score: 30 - distance * 10 };
    }
  }

  return { match: false, score: 0 };
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Get all unique categories
const CATEGORIES = [...new Set(ICON_CATALOG.map(i => i.category))];

interface IconSearchProps {
  defaultCategory?: string;
}

export const IconSearch: React.FC<IconSearchProps> = ({ defaultCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(defaultCategory || null);
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [downloadingIcon, setDownloadingIcon] = useState<string | null>(null);
  const _svgRef = useRef<SVGSVGElement | null>(null);

  // Fuzzy search with semantic tags
  const filteredIcons = useMemo(() => {
    if (searchTerm === '' && !selectedCategory) {
      return ICON_CATALOG.map(item => ({ ...item, score: 0 }));
    }

    const results: Array<IconEntry & { score: number }> = [];

    for (const item of ICON_CATALOG) {
      // Category filter
      if (selectedCategory && item.category !== selectedCategory) {
        continue;
      }

      if (searchTerm === '') {
        results.push({ ...item, score: 0 });
        continue;
      }

      // Check name match
      const nameMatch = fuzzyMatch(searchTerm, item.name);
      if (nameMatch.match) {
        results.push({ ...item, score: nameMatch.score + 100 }); // Name matches get bonus
        continue;
      }

      // Check category match
      const categoryMatch = fuzzyMatch(searchTerm, item.category);
      if (categoryMatch.match) {
        results.push({ ...item, score: categoryMatch.score + 50 });
        continue;
      }

      // Check tags match
      let bestTagScore = 0;
      for (const tag of item.tags) {
        const tagMatch = fuzzyMatch(searchTerm, tag);
        if (tagMatch.match && tagMatch.score > bestTagScore) {
          bestTagScore = tagMatch.score;
        }
      }
      if (bestTagScore > 0) {
        results.push({ ...item, score: bestTagScore });
      }
    }

    // Sort by score (highest first)
    return results.sort((a, b) => b.score - a.score);
  }, [searchTerm, selectedCategory]);

  const handleCopyIcon = useCallback((iconName: string) => {
    const importStatement = `import { ${iconName} } from 'lucide-react';`;
    navigator.clipboard.writeText(importStatement);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  }, []);

  const handleDownloadSvg = useCallback((iconName: string) => {
    setDownloadingIcon(iconName);

    // Get the icon component
    const IconComponent = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName];
    if (!IconComponent) {
      setDownloadingIcon(null);
      return;
    }

    // Create a temporary container to render the SVG
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    // Render icon to get SVG markup
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('width', '24');
    svgElement.setAttribute('height', '24');
    svgElement.setAttribute('viewBox', '0 0 24 24');
    svgElement.setAttribute('fill', 'none');
    svgElement.setAttribute('stroke', 'currentColor');
    svgElement.setAttribute('stroke-width', '2');
    svgElement.setAttribute('stroke-linecap', 'round');
    svgElement.setAttribute('stroke-linejoin', 'round');

    // Use React to render the icon and extract paths
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);

    // Create React root and render
    import('react-dom/client').then(({ createRoot }) => {
      const root = createRoot(tempDiv);
      root.render(
        React.createElement(IconComponent, {
          size: 24,
          color: 'currentColor',
          ref: (el: SVGSVGElement | null) => {
            if (el) {
              // Clone the SVG content
              const svgContent = el.innerHTML;
              const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgContent}</svg>`;

              // Create download
              const blob = new Blob([fullSvg], { type: 'image/svg+xml' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${iconName.toLowerCase()}.svg`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);

              // Cleanup
              root.unmount();
              document.body.removeChild(tempDiv);
              setDownloadingIcon(null);
            }
          }
        })
      );
    });
  }, []);

  const SearchIcon = LucideIcons.Search;
  const DownloadIcon = LucideIcons.Download;
  const CopyIcon = LucideIcons.Copy;
  const CheckIcon = LucideIcons.Check;

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
            color={SLATE[500]}
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
            placeholder="Search icons by name, category, or meaning (e.g., stop, cancel, delete)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              fontSize: TYPOGRAPHY.fontSize.sm[0],
              fontFamily: TYPOGRAPHY.fontFamily.sans,
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
            fontSize: TYPOGRAPHY.fontSize.xs[0],
            fontFamily: TYPOGRAPHY.fontFamily.sans,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            border: 'none',
            borderRadius: RADIUS.sm,
            cursor: 'pointer',
            transition: 'all 200ms ease-out',
            background: selectedCategory === null ? DEEP_CURRENT[700] : SLATE[100],
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
                fontSize: TYPOGRAPHY.fontSize.xs[0],
                fontFamily: TYPOGRAPHY.fontFamily.sans,
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                border: 'none',
                borderRadius: RADIUS.sm,
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
                background: selectedCategory === category ? DEEP_CURRENT[700] : SLATE[100],
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
        fontSize: TYPOGRAPHY.fontSize.xs[0],
        fontFamily: TYPOGRAPHY.fontFamily.sans,
        color: DUSK_REEF[500],
        marginBottom: '16px',
      }}>
        {filteredIcons.length} icons found
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      {/* Icon Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '12px',
      }}>
        {filteredIcons.map(({ name, tags: _tags }) => {
          const IconComponent = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name];
          if (!IconComponent) return null;

          const isCopied = copiedIcon === name;
          const isDownloading = downloadingIcon === name;

          return (
            <div
              key={name}
              style={{
                background: isCopied ? DEEP_CURRENT[50] : PRIMITIVES.white,
                borderRadius: RADIUS.md,
                padding: '16px 8px 8px',
                border: `1px solid ${isCopied ? DEEP_CURRENT[300] : SLATE[200]}`,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                color: isCopied ? DEEP_CURRENT[600] : ABYSS[500],
              }}>
                <IconComponent size={24} />
              </div>

              {/* Name */}
              <div style={{
                fontSize: TYPOGRAPHY.fontSize.xs[0],
                fontFamily: TYPOGRAPHY.fontFamily.sans,
                color: isCopied ? DEEP_CURRENT[600] : ABYSS[500],
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: isCopied ? TYPOGRAPHY.fontWeight.semibold : TYPOGRAPHY.fontWeight.normal,
                marginBottom: '8px',
              }}>
                {isCopied ? 'Copied!' : name}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '4px',
                justifyContent: 'center',
              }}>
                <button
                  onClick={() => handleCopyIcon(name)}
                  title={`Copy import statement for ${name}`}
                  style={{
                    padding: '4px 8px',
                    fontSize: '10px',
                    fontFamily: TYPOGRAPHY.fontFamily.sans,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    border: `1px solid ${SLATE[200]}`,
                    borderRadius: RADIUS.xs,
                    cursor: 'pointer',
                    background: PRIMITIVES.white,
                    color: ABYSS[500],
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 150ms ease-out',
                  }}
                >
                  {isCopied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                  Copy
                </button>
                <button
                  onClick={() => handleDownloadSvg(name)}
                  title={`Download ${name} as SVG`}
                  disabled={isDownloading}
                  style={{
                    padding: '4px 8px',
                    fontSize: '10px',
                    fontFamily: TYPOGRAPHY.fontFamily.sans,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    border: `1px solid ${DEEP_CURRENT[200]}`,
                    borderRadius: RADIUS.xs,
                    cursor: isDownloading ? 'wait' : 'pointer',
                    background: DEEP_CURRENT[50],
                    color: DEEP_CURRENT[700],
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 150ms ease-out',
                    opacity: isDownloading ? 0.7 : 1,
                  }}
                >
                  <DownloadIcon size={12} />
                  SVG
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredIcons.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: DUSK_REEF[500],
          fontFamily: TYPOGRAPHY.fontFamily.sans,
        }}>
          <div style={{ marginBottom: '8px', fontSize: TYPOGRAPHY.fontSize.sm[0] }}>
            No icons found for "{searchTerm}"
          </div>
          <div style={{ fontSize: TYPOGRAPHY.fontSize.xs[0] }}>
            Try a different search term or browse all icons at{' '}
            <a
              href="https://lucide.dev/icons"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: DEEP_CURRENT[600] }}
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
