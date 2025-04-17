// This hook is temporarily disabled during JWT and staging improvements.
// Uncomment and refactor when ACL-based permission control is revisited.

// Placeholder export to avoid breakage in files that import this hook
export const usePermissions = () => ({
  insuranceWritePermission: true,
  loading: false,
  error: null,
});