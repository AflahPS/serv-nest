export function returner(any?: any) {
  if (!any) {
    return { status: 'success' };
  }
  return { status: 'success', ...any };
}
