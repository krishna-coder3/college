/**
 * Storage Service Abstraction
 * Manages secure file uploads across isolated buckets:
 * - avatars
 * - ticket-attachments
 * - documents
 * - announcements
 * - receipts
 * Enforces size limits and strict MIME-type validation.
 */

export type StorageBucket =
  | 'avatars'
  | 'ticket-attachments'
  | 'documents'
  | 'announcements'
  | 'receipts';

export interface StoragePolicyRule {
  allowedMimeTypes: string[];
  maxSizeBytes: number; // e.g. 5MB, 10MB
  requiresAuthentication: boolean;
  tenantIsolation: boolean;
}

export const STORAGE_POLICIES: Record<StorageBucket, StoragePolicyRule> = {
  avatars: {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeBytes: 2 * 1024 * 1024, // 2MB
    requiresAuthentication: true,
    tenantIsolation: true,
  },
  'ticket-attachments': {
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/zip',
    ],
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    requiresAuthentication: true,
    tenantIsolation: true,
  },
  documents: {
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeBytes: 15 * 1024 * 1024, // 15MB
    requiresAuthentication: true,
    tenantIsolation: true,
  },
  announcements: {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxSizeBytes: 10 * 1024 * 1024,
    requiresAuthentication: true,
    tenantIsolation: true,
  },
  receipts: {
    allowedMimeTypes: ['application/pdf'],
    maxSizeBytes: 5 * 1024 * 1024,
    requiresAuthentication: true,
    tenantIsolation: true,
  },
};

export class StorageService {
  public static validateFile(
    file: { name: string; size: number; type: string },
    bucket: StorageBucket
  ): { valid: boolean; error?: string } {
    const policy = STORAGE_POLICIES[bucket];

    if (!policy.allowedMimeTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type "${file.type}" is not permitted for ${bucket}. Allowed types: ${policy.allowedMimeTypes.join(', ')}`,
      };
    }

    if (file.size > policy.maxSizeBytes) {
      const maxMb = (policy.maxSizeBytes / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of ${maxMb} MB.`,
      };
    }

    return { valid: true };
  }

  public static getSecurePath(params: {
    organizationId: string;
    bucket: StorageBucket;
    userId: string;
    fileName: string;
  }): string {
    const sanitizedFileName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `${params.organizationId}/${params.bucket}/${params.userId}/${Date.now()}_${sanitizedFileName}`;
  }
}
