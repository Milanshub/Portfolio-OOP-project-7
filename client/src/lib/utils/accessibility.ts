import { useEffect, useRef, useCallback, KeyboardEvent, useState } from 'react';

// Hook to manage focus trap within a modal or dialog
export function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTab = useCallback((e: KeyboardEvent) => {
    if (!containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const focusableElement = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      if (focusableElement) {
        focusableElement.focus();
      }
    }
  }, [isOpen]);

  return { containerRef, handleTab };
}

// Hook to manage keyboard navigation for interactive lists
export function useKeyboardNavigation(itemCount: number) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev: number) => (prev + 1) % itemCount);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev: number) => (prev - 1 + itemCount) % itemCount);
          break;
        case 'Home':
          e.preventDefault();
          setSelectedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setSelectedIndex(itemCount - 1);
          break;
      }
    },
    [itemCount]
  );

  return { selectedIndex, handleKeyDown };
}

// Function to announce messages to screen readers
export function announceMessage(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  document.body.appendChild(announcement);

  // Delay the announcement slightly to ensure it's read
  setTimeout(() => {
    announcement.textContent = message;
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, 100);
}

// Hook to manage skip links
export function useSkipLink() {
  const handleSkip = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      target.addEventListener(
        'blur',
        () => {
          target.tabIndex = 0;
        },
        { once: true }
      );
    }
  }, []);

  return { handleSkip };
}

// Function to check color contrast ratio
export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  };

  const [fR, fG, fB] = hexToRgb(foreground);
  const [bR, bG, bB] = hexToRgb(background);

  const L1 = getLuminance(fR, fG, fB);
  const L2 = getLuminance(bR, bG, bB);

  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

// Function to check if a color combination meets WCAG standards
export function meetsWCAGStandards(
  contrastRatio: number,
  level: 'AA' | 'AAA' = 'AA',
  fontSize: 'large' | 'small' = 'small'
): boolean {
  const standards = {
    AA: {
      large: 3,
      small: 4.5,
    },
    AAA: {
      large: 4.5,
      small: 7,
    },
  };

  return contrastRatio >= standards[level][fontSize];
}

// Hook to manage ARIA live regions
export function useAriaLive() {
  const announcePolite = useCallback((message: string) => {
    announceMessage(message, 'polite');
  }, []);

  const announceAssertive = useCallback((message: string) => {
    announceMessage(message, 'assertive');
  }, []);

  return { announcePolite, announceAssertive };
}

// Function to generate ARIA labels for icons
export function getIconAriaLabel(icon: string, action?: string): string {
  return action ? `${action} (${icon} icon)` : icon;
}

// Hook to manage reduced motion preferences
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
} 