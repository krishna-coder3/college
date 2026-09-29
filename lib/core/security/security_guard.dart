/**
 * Enterprise Client Security Guard
 * Enforces Zero-Trust principles in the client:
 * 1. NEVER trust client-claimed roles for privileged mutations.
 * 2. All elevated actions must pass through Supabase RLS / Edge Functions.
 * 3. Never store API secrets or Service Role keys on client devices.
 */

class SecurityGuard {
  static const bool enableClientSideAuditLogging = true;

  static void sanitizeInput(String input) {
    if (input.contains('<script>') || input.contains('javascript:')) {
      throw SecurityException('Potential malicious payload detected in input field.');
    }
  }

  static void assertStudentTenantBoundary({
    required String userTenantId,
    required String targetTenantId,
  }) {
    if (userTenantId != targetTenantId) {
      throw SecurityException('CROSS-TENANT ACCESS FORBIDDEN: Tenant violation detected.');
    }
  }
}

class SecurityException implements Exception {
  final String message;
  SecurityException(this.message);

  @override
  String toString() => 'SecurityException: $message';
}
