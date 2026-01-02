/**
 * Animation Demo Components
 * 
 * Interactive demos for the Animations.mdx documentation page.
 * Moved to separate file to avoid MDX parsing issues with inline arrow functions.
 */
import React from 'react';
import { Play, Square, X, Bell, Check, ChevronRight, Info, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  ABYSS,
  DEEP_CURRENT,
  DUSK_REEF,
  PRIMITIVES,
  RADIUS,
  SLATE,
  HARBOR,
  CORAL,
  SUNRISE,
} from '../../constants/designTokens';

// =============================================================================
// DURATION DEMOS
// =============================================================================

export const ProductiveShortDemo: React.FC = () => {
  const [isHovered, setIsHovered] = React.useState(false);

  const play = () => {
    setIsHovered(true);
    setTimeout(() => setIsHovered(false), 400);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: DEEP_CURRENT[600], fontWeight: 700 }}>
              productive-short
            </code>
            <span style={{
              background: DEEP_CURRENT[100],
              color: DEEP_CURRENT[700],
              padding: '2px 8px',
              borderRadius: RADIUS.sm,
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
            }}>70ms</span>
          </div>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: 0 }}>Micro-interactions, hover states</p>
        </div>
        <Button variant="outline" size="sm" onClick={play}>
          <Play size={14} style={{ marginRight: '4px' }} />Play
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{ textAlign: 'center' }}>
          <button style={{
            padding: '10px 20px',
            background: isHovered ? DEEP_CURRENT[600] : DEEP_CURRENT[500],
            color: PRIMITIVES.white,
            border: 'none',
            borderRadius: RADIUS.md,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 70ms cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          }}>Button</button>
          <div style={{ marginTop: '8px', fontSize: '11px', color: DUSK_REEF[400] }}>Hover</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            border: '2px solid ' + (isHovered ? DEEP_CURRENT[500] : SLATE[300]),
            background: isHovered ? DEEP_CURRENT[500] : PRIMITIVES.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            transition: 'all 70ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {isHovered && <Check size={16} color={PRIMITIVES.white} />}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: DUSK_REEF[400] }}>Checkbox</div>
        </div>
      </div>
    </div>
  );
};

export const ProductiveMediumDemo: React.FC = () => {
  const [isOn, setIsOn] = React.useState(false);

  const play = () => {
    setIsOn(true);
    setTimeout(() => setIsOn(false), 600);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: DEEP_CURRENT[600], fontWeight: 700 }}>
              productive-medium
            </code>
            <span style={{
              background: DEEP_CURRENT[100],
              color: DEEP_CURRENT[700],
              padding: '2px 8px',
              borderRadius: RADIUS.sm,
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
            }}>100ms</span>
          </div>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: 0 }}>Toggles, tabs, small buttons</p>
        </div>
        <Button variant="outline" size="sm" onClick={play}>
          <Play size={14} style={{ marginRight: '4px' }} />Play
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', padding: '20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '28px',
            borderRadius: '14px',
            background: isOn ? DEEP_CURRENT[500] : SLATE[300],
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 100ms cubic-bezier(0.4, 0, 0.2, 1)',
            margin: '0 auto',
          }}>
            <div style={{
              position: 'absolute',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: PRIMITIVES.white,
              top: '3px',
              left: isOn ? '23px' : '3px',
              transition: 'left 100ms cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: DUSK_REEF[400] }}>Toggle</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', background: SLATE[200], borderRadius: RADIUS.md, padding: '4px' }}>
            <div style={{
              padding: '6px 16px',
              borderRadius: RADIUS.sm,
              background: !isOn ? PRIMITIVES.white : 'transparent',
              fontWeight: 500,
              fontSize: '13px',
              color: !isOn ? ABYSS[700] : DUSK_REEF[500],
              transition: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}>Tab 1</div>
            <div style={{
              padding: '6px 16px',
              borderRadius: RADIUS.sm,
              background: isOn ? PRIMITIVES.white : 'transparent',
              fontWeight: 500,
              fontSize: '13px',
              color: isOn ? ABYSS[700] : DUSK_REEF[500],
              transition: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}>Tab 2</div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: DUSK_REEF[400] }}>Tab Switch</div>
        </div>
      </div>
    </div>
  );
};

export const ProductiveLongDemo: React.FC = () => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const play = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1000);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: DEEP_CURRENT[600], fontWeight: 700 }}>
              productive-long
            </code>
            <span style={{
              background: DEEP_CURRENT[100],
              color: DEEP_CURRENT[700],
              padding: '2px 8px',
              borderRadius: RADIUS.sm,
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
            }}>150ms</span>
          </div>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: 0 }}>Tooltips appearing, dropdowns</p>
        </div>
        <Button variant="outline" size="sm" onClick={play}>
          <Play size={14} style={{ marginRight: '4px' }} />Play
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', padding: '40px 20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              padding: '8px',
              background: PRIMITIVES.white,
              border: '1px solid ' + SLATE[300],
              borderRadius: RADIUS.md,
              cursor: 'pointer',
            }}>
              <Info size={20} color={DUSK_REEF[500]} />
            </button>
            <div style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: ABYSS[800],
              color: PRIMITIVES.white,
              padding: '6px 12px',
              borderRadius: RADIUS.md,
              fontSize: '12px',
              whiteSpace: 'nowrap',
              opacity: showTooltip ? 1 : 0,
              transition: 'opacity 150ms cubic-bezier(0, 0, 0.35, 1)',
              pointerEvents: 'none',
            }}>
              Helpful tooltip
            </div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: DUSK_REEF[400] }}>Tooltip</div>
        </div>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button style={{
              padding: '8px 16px',
              background: PRIMITIVES.white,
              border: '1px solid ' + SLATE[300],
              borderRadius: RADIUS.md,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              Options <ChevronRight size={14} />
            </button>
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              background: PRIMITIVES.white,
              border: '1px solid ' + SLATE[200],
              borderRadius: RADIUS.md,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              opacity: showTooltip ? 1 : 0,
              transform: showTooltip ? 'translateY(0)' : 'translateY(-4px)',
              transition: 'all 150ms cubic-bezier(0, 0, 0.35, 1)',
              pointerEvents: 'none',
              minWidth: '120px',
            }}>
              <div style={{ padding: '8px 12px', fontSize: '13px', borderBottom: '1px solid ' + SLATE[100] }}>Edit</div>
              <div style={{ padding: '8px 12px', fontSize: '13px', borderBottom: '1px solid ' + SLATE[100] }}>Duplicate</div>
              <div style={{ padding: '8px 12px', fontSize: '13px', color: CORAL[500] }}>Delete</div>
            </div>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: DUSK_REEF[400] }}>Dropdown</div>
        </div>
      </div>
    </div>
  );
};

export const ExpressiveShortDemo: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);

  const play = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 1500);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: HARBOR[600], fontWeight: 700 }}>
              expressive-short
            </code>
            <span style={{
              background: HARBOR[100],
              color: HARBOR[700],
              padding: '2px 8px',
              borderRadius: RADIUS.sm,
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
            }}>250ms</span>
          </div>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: 0 }}>Cards, modals, medium elements</p>
        </div>
        <Button variant="outline" size="sm" onClick={play}>
          <Play size={14} style={{ marginRight: '4px' }} />Play
        </Button>
      </div>
      <div style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{ position: 'relative', width: '220px', height: '150px' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: RADIUS.md,
            opacity: showModal ? 1 : 0,
            transition: 'opacity 250ms cubic-bezier(0, 0, 0.35, 1)',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: showModal ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.9)',
            opacity: showModal ? 1 : 0,
            background: PRIMITIVES.white,
            borderRadius: RADIUS.lg,
            padding: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            width: '180px',
            transition: 'all 250ms cubic-bezier(0, 0, 0.35, 1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Modal Title</span>
              <X size={14} color={DUSK_REEF[400]} />
            </div>
            <div style={{ fontSize: '11px', color: DUSK_REEF[500] }}>Modal content goes here...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExpressiveLongDemo: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const play = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentPage(1);
    setTimeout(() => setCurrentPage(2), 600);
    setTimeout(() => {
      setCurrentPage(0);
      setIsAnimating(false);
    }, 2000);
  };

  const pages = ['home', 'about', 'contact'];

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: HARBOR[600], fontWeight: 700 }}>
              expressive-long
            </code>
            <span style={{
              background: HARBOR[100],
              color: HARBOR[700],
              padding: '2px 8px',
              borderRadius: RADIUS.sm,
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
            }}>400ms</span>
          </div>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: 0 }}>Page transitions, hero animations</p>
        </div>
        <Button variant="outline" size="sm" onClick={play} disabled={isAnimating}>
          <Play size={14} style={{ marginRight: '4px' }} />Play
        </Button>
      </div>
      <div style={{ padding: '20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{
          background: PRIMITIVES.white,
          borderRadius: RADIUS.lg,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '8px 12px', background: SLATE[100], display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CORAL[400] }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: SUNRISE[400] }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: HARBOR[400] }} />
            </div>
            <div style={{
              flex: 1,
              background: PRIMITIVES.white,
              borderRadius: RADIUS.sm,
              padding: '4px 12px',
              fontSize: '11px',
              color: DUSK_REEF[400],
            }}>
              app.disrupt.com/{pages[currentPage]}
            </div>
          </div>
          <div style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
            {pages.map((page, idx) => (
              <div key={page} style={{
                position: 'absolute',
                inset: 0,
                padding: '20px',
                opacity: currentPage === idx ? 1 : 0,
                transform: currentPage === idx ? 'translateX(0)' : (currentPage > idx ? 'translateX(-30px)' : 'translateX(30px)'),
                transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}>
                <div style={{
                  width: '80px',
                  height: '10px',
                  background: idx === 0 ? ABYSS[800] : idx === 1 ? HARBOR[600] : CORAL[500],
                  borderRadius: '2px',
                  marginBottom: '12px',
                }} />
                <div style={{
                  height: '50px',
                  background: SLATE[100],
                  borderRadius: RADIUS.md,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: DUSK_REEF[400],
                  fontSize: '12px',
                }}>
                  {page.charAt(0).toUpperCase() + page.slice(1)} Content
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: DUSK_REEF[400] }}>
          Page Transition Demo
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// EASING DEMOS
// =============================================================================

export const EnterEasingDemo: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const play = () => {
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 1500);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: DEEP_CURRENT[600], fontWeight: 700 }}>
              easing-enter
            </code>
            <span style={{
              background: DEEP_CURRENT[100],
              color: DEEP_CURRENT[700],
              padding: '2px 8px',
              borderRadius: RADIUS.sm,
              fontSize: '11px',
              fontFamily: '"JetBrains Mono", monospace',
            }}>cubic-bezier(0, 0, 0.35, 1)</span>
          </div>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: 0 }}>Fast start, slow end - decelerating into place</p>
        </div>
        <Button variant="outline" size="sm" onClick={play}>
          <Play size={14} style={{ marginRight: '4px' }} />Play
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '32px', minHeight: '120px', padding: '20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
          <div style={{
            background: ABYSS[800],
            color: PRIMITIVES.white,
            padding: '12px 16px',
            borderRadius: RADIUS.lg,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 250ms cubic-bezier(0, 0, 0.35, 1)',
          }}>
            <Bell size={16} />
            <span style={{ fontSize: '13px' }}>New notification</span>
          </div>
          <div style={{ position: 'absolute', bottom: '-24px' }}>
            <span style={{ fontSize: '11px', color: DUSK_REEF[400] }}>Toast</span>
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '100px',
            background: PRIMITIVES.white,
            borderRadius: RADIUS.lg,
            boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
            padding: '12px',
            transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 250ms cubic-bezier(0, 0, 0.35, 1)',
          }}>
            <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: '8px' }}>Panel</div>
            <div style={{ fontSize: '10px', color: DUSK_REEF[500] }}>Slides in</div>
          </div>
          <div style={{ position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)' }}>
            <span style={{ fontSize: '11px', color: DUSK_REEF[400] }}>Slide-in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExitEasingDemo: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  const play = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 800);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: CORAL[600], fontWeight: 700 }}>
              easing-exit
            </code>
            <span style={{
              background: CORAL[100],
              color: CORAL[700],
              padding: '2px 8px',
              borderRadius: RADIUS.sm,
              fontSize: '11px',
              fontFamily: '"JetBrains Mono", monospace',
            }}>cubic-bezier(0.4, 0, 1, 1)</span>
          </div>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: 0 }}>Slow start, fast end - accelerating away</p>
        </div>
        <Button variant="outline" size="sm" onClick={play}>
          <Play size={14} style={{ marginRight: '4px' }} />Play
        </Button>
      </div>
      <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{
          background: PRIMITIVES.white,
          border: '1px solid ' + SLATE[200],
          borderRadius: RADIUS.lg,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-20px) scale(0.95)',
          transition: 'all 150ms cubic-bezier(0.4, 0, 1, 1)',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: HARBOR[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MessageSquare size={16} color={HARBOR[600]} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px' }}>New message</div>
            <div style={{ fontSize: '11px', color: DUSK_REEF[500] }}>Click Play to dismiss</div>
          </div>
          <button style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}>
            <X size={16} color={DUSK_REEF[400]} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const TransitionEasingDemo: React.FC = () => {
  const [isActive, setIsActive] = React.useState(false);

  const play = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 1200);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: DUSK_REEF[600], fontWeight: 700 }}>
              easing-transition
            </code>
            <span style={{
              background: DUSK_REEF[100],
              color: DUSK_REEF[700],
              padding: '2px 8px',
              borderRadius: RADIUS.sm,
              fontSize: '11px',
              fontFamily: '"JetBrains Mono", monospace',
            }}>cubic-bezier(0.4, 0, 0.2, 1)</span>
          </div>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: 0 }}>Smooth both ways - state changes</p>
        </div>
        <Button variant="outline" size="sm" onClick={play}>
          <Play size={14} style={{ marginRight: '4px' }} />Play
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', padding: '20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: RADIUS.lg,
            background: isActive ? DEEP_CURRENT[500] : SLATE[300],
            transition: 'background 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
          <div style={{ marginTop: '8px', fontSize: '11px', color: DUSK_REEF[400] }}>Color</div>
        </div>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: isActive ? '70px' : '50px',
            height: isActive ? '70px' : '50px',
            borderRadius: RADIUS.lg,
            background: HARBOR[400],
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
          <div style={{ marginTop: '8px', fontSize: '11px', color: DUSK_REEF[400] }}>Size</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: RADIUS.md,
            background: CORAL[400],
            transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ChevronRight size={24} color={PRIMITIVES.white} />
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: DUSK_REEF[400] }}>Rotation</div>
        </div>
      </div>
    </div>
  );
};

export const EmphasizeEasingDemo: React.FC = () => {
  const [trigger, setTrigger] = React.useState(0);

  const play = () => setTrigger(t => t + 1);

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <style dangerouslySetInnerHTML={{ __html: '\
        @keyframes badgePop { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }\
        @keyframes buttonBounce { 0% { transform: translateY(0); } 40% { transform: translateY(-8px); } 100% { transform: translateY(0); } }\
        @keyframes successPulse { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }\
      ' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: SUNRISE[600], fontWeight: 700 }}>
              easing-emphasize
            </code>
            <span style={{
              background: SUNRISE[100],
              color: SUNRISE[700],
              padding: '2px 8px',
              borderRadius: RADIUS.sm,
              fontSize: '11px',
              fontFamily: '"JetBrains Mono", monospace',
            }}>cubic-bezier(0, 0, 0.2, 1.4)</span>
          </div>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: 0 }}>Attention with subtle overshoot</p>
        </div>
        <Button variant="outline" size="sm" onClick={play}>
          <Play size={14} style={{ marginRight: '4px' }} />Play
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '48px', justifyContent: 'center', padding: '20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: SLATE[200] }} />
            <div
              key={'badge-' + trigger}
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: CORAL[500],
                color: PRIMITIVES.white,
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: trigger > 0 ? 'badgePop 300ms cubic-bezier(0, 0, 0.2, 1.4)' : 'none',
              }}
            >3</div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: DUSK_REEF[400] }}>Badge Pop</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            key={'button-' + trigger}
            style={{
              padding: '10px 20px',
              background: DEEP_CURRENT[500],
              color: PRIMITIVES.white,
              border: 'none',
              borderRadius: RADIUS.md,
              fontWeight: 600,
              cursor: 'pointer',
              animation: trigger > 0 ? 'buttonBounce 400ms cubic-bezier(0, 0, 0.2, 1.4)' : 'none',
            }}
          >Click me!</button>
          <div style={{ marginTop: '12px', fontSize: '11px', color: DUSK_REEF[400] }}>Button Bounce</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            key={'success-' + trigger}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: HARBOR[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: trigger > 0 ? 'successPulse 400ms cubic-bezier(0, 0, 0.2, 1.4)' : 'none',
            }}
          >
            <Check size={24} color={PRIMITIVES.white} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: DUSK_REEF[400] }}>Success Pop</div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// DELAY DEMO
// =============================================================================

export const DelayDemo: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [selectedDelay, setSelectedDelay] = React.useState(50);

  const play = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setIsVisible(false), 2000);
  };

  const items = ['Dashboard', 'Analytics', 'Settings', 'Profile', 'Help'];

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: DEEP_CURRENT[600], fontWeight: 700 }}>
              delay tokens
            </code>
          </div>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: 0 }}>Create cascading effects that guide the eye</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedDelay}
            onChange={(e) => setSelectedDelay(Number(e.target.value))}
            style={{
              padding: '6px 12px',
              borderRadius: RADIUS.md,
              border: '1px solid ' + SLATE[300],
              fontSize: '12px',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            <option value={50}>short (50ms)</option>
            <option value={100}>normal (100ms)</option>
            <option value={200}>long (200ms)</option>
          </select>
          <Button variant="outline" size="sm" onClick={play}>
            <Play size={14} style={{ marginRight: '4px' }} />Play
          </Button>
        </div>
      </div>
      <div style={{ padding: '20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{
          background: PRIMITIVES.white,
          borderRadius: RADIUS.lg,
          padding: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          maxWidth: '200px',
          margin: '0 auto',
        }}>
          {items.map((item, index) => (
            <div
              key={item}
              style={{
                padding: '10px 14px',
                borderRadius: RADIUS.md,
                background: isVisible ? (index === 0 ? DEEP_CURRENT[50] : 'transparent') : 'transparent',
                fontWeight: index === 0 ? 600 : 400,
                fontSize: '13px',
                color: index === 0 ? DEEP_CURRENT[700] : ABYSS[600],
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                transition: 'all 200ms cubic-bezier(0, 0, 0.35, 1)',
                transitionDelay: (index * selectedDelay) + 'ms',
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: DUSK_REEF[400] }}>
          Staggered Menu ({selectedDelay}ms between items)
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// KEYFRAME ANIMATION DEMOS (Absorbed from Vibe Design System)
// These demos reference keyframes from motion.css
// =============================================================================

export const KeyframePopDemo: React.FC = () => {
  const [trigger, setTrigger] = React.useState(0);
  const [selectedAnim, setSelectedAnim] = React.useState('dds-pop-in');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const animations = [
    { name: 'dds-pop-in', label: 'Pop In', duration: 250 },
    { name: 'dds-pop-out', label: 'Pop Out', duration: 150 },
    { name: 'dds-pop-elastic', label: 'Pop Elastic', duration: 400 },
    { name: 'dds-pop-elastic-bold', label: 'Elastic Bold', duration: 500 },
  ];

  const selectedDuration = animations.find(a => a.name === selectedAnim)?.duration || 250;

  const play = () => {
    if (isPlaying) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setTrigger(t => t + 1);
    timeoutRef.current = setTimeout(() => setIsPlaying(false), selectedDuration + 100);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: HARBOR[600], fontWeight: 700 }}>
            Pop Animations
          </code>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: '4px 0 0 0' }}>Scale-based entry animations for modals, tooltips, cards</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedAnim}
            onChange={(e) => setSelectedAnim(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: RADIUS.md,
              border: '1px solid ' + SLATE[300],
              fontSize: '12px',
            }}
          >
            {animations.map(a => (
              <option key={a.name} value={a.name}>{a.label}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={play}>
            {isPlaying ? <><Square size={14} style={{ marginRight: '4px' }} />Stop</> : <><Play size={14} style={{ marginRight: '4px' }} />Play</>}
          </Button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', padding: '40px 20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div
          key={'pop-' + trigger + selectedAnim}
          style={{
            width: '120px',
            height: '80px',
            background: PRIMITIVES.white,
            borderRadius: RADIUS.lg,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: trigger > 0 ? selectedAnim + ' ' + selectedDuration + 'ms var(--motion-easing-enter)' : 'none',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', color: ABYSS[700] }}>Card</div>
            <div style={{ fontSize: '11px', color: DUSK_REEF[400] }}>{selectedAnim.replace('dds-', '')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KeyframeSlideDemo: React.FC = () => {
  const [trigger, setTrigger] = React.useState(0);
  const [selectedAnim, setSelectedAnim] = React.useState('dds-slide-in-up');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const animations = [
    { name: 'dds-slide-in-up', label: 'Slide Up', duration: 250 },
    { name: 'dds-slide-in-down', label: 'Slide Down', duration: 250 },
    { name: 'dds-slide-in-left', label: 'Slide Left', duration: 250 },
    { name: 'dds-slide-in-right', label: 'Slide Right', duration: 250 },
    { name: 'dds-slide-in-up-elastic', label: 'Slide Up Elastic', duration: 400 },
  ];

  const selectedDuration = animations.find(a => a.name === selectedAnim)?.duration || 250;

  const play = () => {
    if (isPlaying) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setTrigger(t => t + 1);
    timeoutRef.current = setTimeout(() => setIsPlaying(false), selectedDuration + 100);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: DEEP_CURRENT[600], fontWeight: 700 }}>
            Slide Animations
          </code>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: '4px 0 0 0' }}>Position-based entry animations for toasts, drawers, panels</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedAnim}
            onChange={(e) => setSelectedAnim(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: RADIUS.md,
              border: '1px solid ' + SLATE[300],
              fontSize: '12px',
            }}
          >
            {animations.map(a => (
              <option key={a.name} value={a.name}>{a.label}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={play}>
            {isPlaying ? <><Square size={14} style={{ marginRight: '4px' }} />Stop</> : <><Play size={14} style={{ marginRight: '4px' }} />Play</>}
          </Button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', padding: '40px 20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div
          key={'slide-' + trigger + selectedAnim}
          style={{
            padding: '12px 20px',
            background: ABYSS[800],
            color: PRIMITIVES.white,
            borderRadius: RADIUS.lg,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: trigger > 0 ? selectedAnim + ' ' + selectedDuration + 'ms var(--motion-easing-enter)' : 'none',
          }}
        >
          <Bell size={16} />
          <span style={{ fontSize: '13px' }}>Toast notification</span>
        </div>
      </div>
    </div>
  );
};

export const KeyframeAttentionDemo: React.FC = () => {
  const [trigger, setTrigger] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const play = () => {
    if (isPlaying) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setTrigger(t => t + 1);
    timeoutRef.current = setTimeout(() => setIsPlaying(false), 1800);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: CORAL[600], fontWeight: 700 }}>
            Attention Animations
          </code>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: '4px 0 0 0' }}>Emphasis animations for drawing user attention</p>
        </div>
        <Button variant="outline" size="sm" onClick={play}>
          {isPlaying ? <><Square size={14} style={{ marginRight: '4px' }} />Stop</> : <><Play size={14} style={{ marginRight: '4px' }} />Play All</>}
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', padding: '32px 20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{ textAlign: 'center' }}>
          <div
            key={'pulse-' + trigger}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: HARBOR[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              animation: trigger > 0 ? 'dds-pulse 600ms ease-in-out 3' : 'none',
            }}
          >
            <Bell size={20} color={PRIMITIVES.white} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: DUSK_REEF[400] }}>Pulse</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            key={'shake-' + trigger}
            style={{
              padding: '10px 20px',
              background: CORAL[500],
              color: PRIMITIVES.white,
              borderRadius: RADIUS.md,
              fontWeight: 600,
              fontSize: '13px',
              animation: trigger > 0 ? 'dds-shake 400ms ease-in-out' : 'none',
            }}
          >
            Error!
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: DUSK_REEF[400] }}>Shake</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            key={'bounce-' + trigger}
            style={{
              padding: '10px 20px',
              background: DEEP_CURRENT[500],
              color: PRIMITIVES.white,
              border: 'none',
              borderRadius: RADIUS.md,
              fontWeight: 600,
              cursor: 'pointer',
              animation: trigger > 0 ? 'dds-bounce 400ms var(--motion-easing-emphasize)' : 'none',
            }}
          >
            Click me!
          </button>
          <div style={{ marginTop: '12px', fontSize: '11px', color: DUSK_REEF[400] }}>Bounce</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            key={'wiggle-' + trigger}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: RADIUS.md,
              background: SUNRISE[400],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: '24px',
              animation: trigger > 0 ? 'dds-wiggle 300ms ease-in-out 3' : 'none',
            }}
          >
            👋
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: DUSK_REEF[400] }}>Wiggle</div>
        </div>
      </div>
    </div>
  );
};

export const ReducedMotionDemo: React.FC = () => {
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [trigger, setTrigger] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const play = () => {
    if (isPlaying) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setTrigger(t => t + 1);
    timeoutRef.current = setTimeout(() => setIsPlaying(false), reducedMotion ? 100 : 500);
  };

  return (
    <div style={{
      background: PRIMITIVES.white,
      borderRadius: RADIUS.lg,
      padding: '24px',
      border: '1px solid ' + SLATE[200],
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <code style={{ fontSize: '14px', fontFamily: '"JetBrains Mono", monospace', color: ABYSS[700], fontWeight: 700 }}>
            prefers-reduced-motion
          </code>
          <p style={{ fontSize: '13px', color: DUSK_REEF[500], margin: '4px 0 0 0' }}>Respect user accessibility preferences</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: ABYSS[600] }}>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
            />
            Simulate reduced motion
          </label>
          <Button variant="outline" size="sm" onClick={play}>
            {isPlaying ? <><Square size={14} style={{ marginRight: '4px' }} />Stop</> : <><Play size={14} style={{ marginRight: '4px' }} />Play</>}
          </Button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', padding: '40px 20px', background: SLATE[50], borderRadius: RADIUS.md }}>
        <div style={{ textAlign: 'center' }}>
          <div
            key={'a11y-' + trigger}
            style={{
              width: '100px',
              height: '70px',
              background: PRIMITIVES.white,
              borderRadius: RADIUS.lg,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: trigger > 0 && !reducedMotion ? 'dds-pop-elastic 400ms var(--motion-easing-enter)' : 'none',
              opacity: trigger > 0 || reducedMotion ? 1 : 0.5,
              transition: reducedMotion ? 'opacity 0ms' : 'none',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: ABYSS[700] }}>Modal</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: DUSK_REEF[400] }}>
            {reducedMotion ? 'Instant (no motion)' : 'Animated'}
          </div>
        </div>
      </div>
      <div style={{
        marginTop: '16px',
        padding: '12px',
        borderRadius: RADIUS.md,
        background: reducedMotion ? SUNRISE[50] : HARBOR[100],
        color: reducedMotion ? SUNRISE[700] : HARBOR[700],
        fontSize: '12px',
      }}>
        {reducedMotion ? (
          <><strong>Reduced motion:</strong> Animations are disabled. Essential for users with vestibular disorders.</>
        ) : (
          <><strong>Full motion:</strong> Animations enhance UX. Always provide fallbacks for accessibility.</>
        )}
      </div>
    </div>
  );
};
