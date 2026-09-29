/**
 * College Helpdesk System - Core Domain Types & Data Models
 * Multi-tenant university student support ecosystem.
 */

export type UserRole =
  | 'SUPER_ADMIN'
  | 'UNIVERSITY_OWNER'
  | 'ADMIN'
  | 'DEPARTMENT_ADMIN'
  | 'HELPDESK_AGENT'
  | 'FACULTY'
  | 'STUDENT';

export interface OrganizationBranding {
  universityName: string;
  shortCode: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string; // e.g., #1E3A8A (Royal Navy)
  secondaryColor: string; // e.g., #0284C7 (Cyan/Sky)
  accentColor: string; // e.g., #D97706 (Gold Laurel)
  address: string;
  city: string;
  state: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  darkModeEnabled: boolean;
  footerText: string;
}

export interface Organization {
  id: string;
  code: string;
  name: string;
  slug: string;
  branding: OrganizationBranding;
  status: 'ACTIVE' | 'SUSPENDED' | 'MAINTENANCE' | 'PROVISIONING';
  subscriptionPlan: 'COMMUNITY' | 'CAMPUS_STANDARD' | 'ENTERPRISE_UNLIMITED';
  studentCount: number;
  staffCount: number;
  ticketCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  organizationId: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;

  // Student specific metadata
  studentId?: string;
  enrollmentNumber?: string;
  departmentId?: string;
  departmentName?: string;
  courseId?: string;
  courseName?: string;
  semester?: number;
  academicYear?: string;

  // Staff specific metadata
  staffEmployeeId?: string;
  designation?: string;
  assignedDepartmentIds?: string[];
}

export type TicketStatus =
  | 'SUBMITTED'
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_STUDENT'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TicketSLA {
  targetHours: number;
  dueAt: string;
  breached: boolean;
  breachedAt?: string;
  remainingMinutes: number;
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  isInternalNote: boolean; // True = only visible to staff/admins
  attachments?: TicketAttachment[];
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g. CHD-2026-000104
  organizationId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentEnrollmentNo?: string;
  departmentId: string;
  departmentName: string;
  categoryId: string;
  categoryName: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  incidentId?: string;
  sla: TicketSLA;
  reopenCount: number;
  reopenReason?: string;
  satisfactionRating?: number; // 1 to 5
  satisfactionComment?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  source: 'WEB' | 'MOBILE_APP' | 'AI_CHATBOT' | 'OFFLINE_SYNC';
  attachments: TicketAttachment[];
}

export interface Department {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  headName: string;
  email: string;
  phone: string;
  agentCount: number;
  openTicketsCount: number;
  autoAssignmentEnabled: boolean;
}

export interface Incident {
  id: string;
  incidentNumber: string; // e.g. INC-2026-002
  organizationId: string;
  title: string;
  description: string;
  departmentId: string;
  departmentName: string;
  priority: TicketPriority;
  status: 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED';
  affectedUsersCount: number;
  linkedTicketIds: string[];
  rootCause?: string;
  resolution?: string;
  startedAt: string;
  resolvedAt?: string;
}

export interface FAQArticle {
  id: string;
  organizationId: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  helpfulCount: number;
  unhelpfulCount: number;
  isPublished: boolean;
}

export interface Announcement {
  id: string;
  organizationId: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'ACADEMIC' | 'EXAMINATION' | 'HOSTEL' | 'EMERGENCY';
  isEmergency: boolean;
  targetAudience: 'ALL' | 'STUDENTS' | 'FACULTY' | 'STAFF' | 'DEPARTMENT';
  targetDepartmentId?: string;
  publishDate: string;
  expiryDate?: string;
  pinned: boolean;
  authorName: string;
}

export interface FeeItem {
  id: string;
  studentId: string;
  title: string;
  category: 'TUITION' | 'HOSTEL' | 'EXAMINATION' | 'LIBRARY' | 'TRANSPORT' | 'OTHER';
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  transactionId?: string;
  paidAt?: string;
  receiptNumber?: string;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  studentName: string;
  docType: 'ID_CARD' | 'ADMISSION_LETTER' | 'FEE_RECEIPT' | 'SCHOLARSHIP' | 'MARKSHEET' | 'BONAFIDE' | 'OTHER';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewerName?: string;
  reviewComment?: string;
  uploadedAt: string;
  reviewedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

export interface SimulatedEmail {
  id: string;
  ticketId: string;
  ticketNumber: string;
  studentName: string;
  studentEmail: string;
  status: TicketStatus;
  subject: string;
  ticketTitle: string;
  sentAt: string;
  read: boolean;
  departmentName: string;
  agentName?: string;
  resolutionNote?: string;
  slaTargetHours?: number;
  messageId: string;
}

