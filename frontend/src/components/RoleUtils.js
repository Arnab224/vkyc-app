export const determineUserRole = (userRole, identity) => {
  if (userRole) return userRole.toLowerCase();
  if (identity && (identity.toLowerCase().includes('admin') || identity.toLowerCase().includes('agent'))) return 'admin';
  if (window.location.pathname.includes('/admin')) return 'admin';
  return 'user';
};