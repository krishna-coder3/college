/**
 * Notification Architecture Abstraction
 * Supports Email, Push (FCM), SMS, and WhatsApp providers.
 * All credentials are secure and configured server-side.
 */

import { SimulatedEmail, Ticket, TicketStatus } from '../types';

export interface EmailMessage {
  to: string;
  subject: string;
  templateId: string;
  templateVariables: Record<string, string | number>;
  organizationId: string;
}

export interface PushNotificationMessage {
  recipientToken: string;
  title: string;
  body: string;
  deepLink?: string;
  data?: Record<string, string>;
  isUrgent?: boolean;
}

export interface SmsMessage {
  phone: string;
  message: string;
  organizationId: string;
}

export interface WhatsAppMessage {
  phone: string;
  templateName: string;
  parameters: string[];
}

export interface IEmailProvider {
  name: string;
  sendEmail(message: EmailMessage): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export interface IPushProvider {
  name: string;
  sendPush(message: PushNotificationMessage): Promise<{ success: boolean; messageId?: string }>;
}

export interface ISmsProvider {
  name: string;
  sendSms(message: SmsMessage): Promise<{ success: boolean; messageId?: string }>;
}

export interface IWhatsAppProvider {
  name: string;
  sendWhatsApp(message: WhatsAppMessage): Promise<{ success: boolean; messageId?: string }>;
}

type EmailListener = (email: SimulatedEmail) => void;

class NotificationService {
  private emailProvider?: IEmailProvider;
  private pushProvider?: IPushProvider;
  private smsProvider?: ISmsProvider;
  private whatsAppProvider?: IWhatsAppProvider;

  // In-memory simulated email dispatch history
  private simulatedEmails: SimulatedEmail[] = [
    {
      id: 'em-seed-001',
      ticketId: 't-101',
      ticketNumber: 'CHD-2026-000101',
      studentName: 'Krishna Sharma',
      studentEmail: 'krishna.sharma@kmuniversity.ac.in',
      status: 'IN_PROGRESS',
      subject: 'Update: Ticket CHD-2026-000101 is now In Progress',
      ticketTitle: 'Wi-Fi Network Access Issue in Hostel Block B, Room 204',
      sentAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
      read: true,
      departmentName: 'IT Support & Campus Network',
      agentName: 'Vikram Mehta (Network Engineer)',
      slaTargetHours: 24,
      messageId: '<chd-in-prog-00101@kmuniversity.ac.in>',
    },
  ];

  private listeners: Set<EmailListener> = new Set();

  public subscribeEmails(listener: EmailListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getSimulatedEmails(): SimulatedEmail[] {
    return [...this.simulatedEmails];
  }

  public markAsRead(id: string) {
    this.simulatedEmails = this.simulatedEmails.map((e) =>
      e.id === id ? { ...e, read: true } : e
    );
  }

  public markAllAsRead() {
    this.simulatedEmails = this.simulatedEmails.map((e) => ({ ...e, read: true }));
  }

  public registerEmailProvider(provider: IEmailProvider) {
    this.emailProvider = provider;
  }

  public registerPushProvider(provider: IPushProvider) {
    this.pushProvider = provider;
  }

  public registerSmsProvider(provider: ISmsProvider) {
    this.smsProvider = provider;
  }

  public registerWhatsAppProvider(provider: IWhatsAppProvider) {
    this.whatsAppProvider = provider;
  }

  /**
   * Dispatches a simulated email alert when a student's ticket status changes
   */
  public dispatchStatusChangeAlert(params: {
    ticket: Ticket;
    newStatus: TicketStatus;
    studentEmail?: string;
    studentName?: string;
    resolutionNote?: string;
  }): SimulatedEmail | null {
    const { ticket, newStatus, resolutionNote } = params;

    // Only email alert on significant status shifts like IN_PROGRESS or RESOLVED
    if (newStatus !== 'IN_PROGRESS' && newStatus !== 'RESOLVED' && newStatus !== 'ESCALATED') {
      return null;
    }

    const studentEmail = params.studentEmail || 'krishna.sharma@kmuniversity.ac.in';
    const studentName = params.studentName || 'Krishna Sharma';

    const subjectMap: Record<string, string> = {
      IN_PROGRESS: `[Update] Ticket ${ticket.ticketNumber} is now In Progress - K.M. University Helpdesk`,
      RESOLVED: `[Resolved] Ticket ${ticket.ticketNumber} has been resolved - K.M. University Helpdesk`,
      ESCALATED: `[Escalation Alert] Ticket ${ticket.ticketNumber} escalated to Department Head`,
    };

    const simulatedEmail: SimulatedEmail = {
      id: `em-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      studentName,
      studentEmail,
      status: newStatus,
      subject: subjectMap[newStatus] || `Ticket ${ticket.ticketNumber} status updated to ${newStatus}`,
      ticketTitle: ticket.subject,
      sentAt: new Date().toISOString(),
      read: false,
      departmentName: ticket.departmentName,
      agentName: ticket.assignedAgentName || 'Assigned Helpdesk Specialist',
      resolutionNote:
        resolutionNote ||
        (newStatus === 'RESOLVED'
          ? 'The designated issue has been resolved by our engineering and administrative personnel. All systems have been verified for normal operation.'
          : 'Our support team has taken up this ticket and active investigation/resolution is underway.'),
      slaTargetHours: ticket.sla.targetHours,
      messageId: `<ticket-${ticket.ticketNumber.toLowerCase()}-${Date.now()}@kmuniversity.ac.in>`,
    };

    this.simulatedEmails = [simulatedEmail, ...this.simulatedEmails];

    // Notify all UI listeners (triggers real-time toast and badge increment)
    this.listeners.forEach((listener) => listener(simulatedEmail));

    return simulatedEmail;
  }

  public async dispatchTicketCreated(params: {
    studentEmail: string;
    studentName: string;
    ticketNumber: string;
    subject: string;
    fcmToken?: string;
    organizationId: string;
  }) {
    if (this.emailProvider) {
      await this.emailProvider.sendEmail({
        to: params.studentEmail,
        subject: `Ticket Received [${params.ticketNumber}]: ${params.subject}`,
        templateId: 'TICKET_CREATED',
        templateVariables: {
          studentName: params.studentName,
          ticketNumber: params.ticketNumber,
          subject: params.subject,
        },
        organizationId: params.organizationId,
      });
    }

    if (params.fcmToken && this.pushProvider) {
      await this.pushProvider.sendPush({
        recipientToken: params.fcmToken,
        title: `Ticket Submitted: ${params.ticketNumber}`,
        body: `Your query regarding "${params.subject}" is being reviewed by the department.`,
        deepLink: `/tickets/${params.ticketNumber}`,
      });
    }
  }

  public async dispatchEmergencyAlert(params: {
    title: string;
    message: string;
    organizationId: string;
  }) {
    if (this.pushProvider) {
      await this.pushProvider.sendPush({
        recipientToken: 'TOPIC_ALL_STUDENTS',
        title: `EMERGENCY ALERT: ${params.title}`,
        body: params.message,
        isUrgent: true,
      });
    }
  }
}

export const notificationService = new NotificationService();
