/**
 * Design tokens for dev tools styling.
 * Use these for consistent visual appearance across all tools.
 */

// Colors
export const COLORS = {
  background: '#13151A',
  backgroundGradient: 'linear-gradient(180deg, #13151A 0%, rgba(19, 21, 26, 0.88) 100%)',
  text: 'white',
} as const;

// Shadows
export const SHADOWS = {
  overlay:
    '0px 0px 0px 0px rgba(19, 21, 26, 0.30), 0px 1px 2px 0px rgba(19, 21, 26, 0.29), 0px 4px 4px 0px rgba(19, 21, 26, 0.26), 0px 10px 6px 0px rgba(19, 21, 26, 0.15), 0px 17px 7px 0px rgba(19, 21, 26, 0.04), 0px 26px 7px 0px rgba(19, 21, 26, 0.01)',
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: 'monospace',
  fontSize: '14px',
  fontWeight: 'medium',
} as const;

// Spacing
export const SPACING = {
  paddingDefault: '8px 16px',
  paddingSmall: '10px 14px',
  borderRadius: '9999px',
} as const;

/**
 * Composed styles for indicator/tooltip overlays.
 * Built from design tokens above.
 */
export const INDICATOR_STYLES = `
  position: fixed;
  z-index: 99999;
  padding: ${SPACING.paddingDefault};
  color: ${COLORS.text};
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: ${TYPOGRAPHY.fontSize};
  font-weight: ${TYPOGRAPHY.fontWeight};
  pointer-events: none;
  outline: none !important;
  background: ${COLORS.backgroundGradient};
  border-radius: ${SPACING.borderRadius};
  box-shadow: ${SHADOWS.overlay};
  white-space: nowrap;
`;
