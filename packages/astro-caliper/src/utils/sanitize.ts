export const sanitizeBreakpointName = (name: string): string => {
  if (typeof name !== "string") return "";
  return name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
};

export const sanitizeWidth = (width: number): number => {
  if (typeof width !== "number" || !Number.isFinite(width)) return 0;
  return Math.max(0, Math.min(Math.floor(width), 10000));
};
