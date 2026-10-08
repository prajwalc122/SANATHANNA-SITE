/**
 * Utility for dynamic header height calculation and smooth section scrolling.
 * Automatically accounts for sticky/fixed navbar height across desktop, tablet, and mobile.
 */

export function getHeaderHeight(): number {
  if (typeof document === 'undefined') return 104;
  const header = document.querySelector('header');
  if (header) {
    const rect = header.getBoundingClientRect();
    return rect.height || header.offsetHeight || 104;
  }
  return 104;
}

/**
 * Update the CSS custom property --header-height on document.documentElement
 * so that CSS scroll-margin-top always matches the real navbar height dynamically.
 */
export function updateHeaderHeightProperty(): number {
  if (typeof document === 'undefined') return 104;
  const height = getHeaderHeight();
  document.documentElement.style.setProperty('--header-height', `${Math.round(height)}px`);
  return height;
}

/**
 * Smoothly scrolls to a target section by element ID or DOM element,
 * dynamically subtracting the sticky header's current height plus a safe top breathing margin.
 *
 * @param targetId ID of the element to scroll to (or 'top' / 'home' to scroll to the top)
 * @param extraOffset Additional breathing space in pixels (default: 16px)
 */
export function scrollToSection(targetId: string, extraOffset: number = 16): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Clean the target id (remove leading '#')
  const cleanId = targetId.replace(/^#/, '');

  if (!cleanId || cleanId === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const targetEl = document.getElementById(cleanId);
  if (!targetEl) {
    // If element not found, fallback to window top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const headerHeight = getHeaderHeight();
  const elementRect = targetEl.getBoundingClientRect();
  const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  // Calculate target Y coordinate:
  // element top relative to document MINUS header height MINUS extra breathing margin
  const targetTop = elementRect.top + currentScrollY - headerHeight - extraOffset;

  window.scrollTo({
    top: Math.max(0, Math.round(targetTop)),
    behavior: 'smooth',
  });
}
