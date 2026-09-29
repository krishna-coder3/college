import React from 'react';
import { TicketPriority, TicketStatus, UserRole } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200/80 font-medium',
    secondary: 'bg-sky-50 text-sky-700 border-sky-200/80 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80 font-medium',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80 font-semibold',
    purple: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 font-medium',
    outline: 'bg-transparent text-slate-600 border-slate-300 font-normal',
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-blue-600',
    secondary: 'bg-sky-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500 animate-pulse',
    purple: 'bg-indigo-600',
    outline: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TicketStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'SUBMITTED':
      return <Badge variant="secondary" size={size} dot>Submitted</Badge>;
    case 'OPEN':
      return <Badge variant="primary" size={size} dot>Open</Badge>;
    case 'ASSIGNED':
      return <Badge variant="purple" size={size} dot>Assigned</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="primary" size={size} dot>In Progress</Badge>;
    case 'WAITING_FOR_STUDENT':
      return <Badge variant="warning" size={size} dot>Awaiting Student</Badge>;
    case 'ESCALATED':
      return <Badge variant="danger" size={size} dot>Escalated</Badge>;
    case 'RESOLVED':
      return <Badge variant="success" size={size} dot>Resolved</Badge>;
    case 'CLOSED':
      return <Badge variant="default" size={size}>Closed</Badge>;
    case 'REOPENED':
      return <Badge variant="danger" size={size} dot>Reopened</Badge>;
    default:
      return <Badge size={size}>{status}</Badge>;
  }
};

export const PriorityBadge: React.FC<{ priority: TicketPriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  switch (priority) {
    case 'LOW':
      return <Badge variant="default" size={size}>Low Priority</Badge>;
    case 'MEDIUM':
      return <Badge variant="secondary" size={size}>Medium</Badge>;
    case 'HIGH':
      return <Badge variant="warning" size={size} dot>High Priority</Badge>;
    case 'URGENT':
      return <Badge variant="danger" size={size} dot>CRITICAL / URGENT</Badge>;
  }
};

export const RoleBadge: React.FC<{ role: UserRole; size?: 'sm' | 'md' }> = ({
  role,
  size = 'md',
}) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return <Badge variant="danger" size={size}>Platform Super Admin</Badge>;
    case 'UNIVERSITY_OWNER':
      return <Badge variant="purple" size={size}>University Owner</Badge>;
    case 'ADMIN':
      return <Badge variant="primary" size={size}>University Admin</Badge>;
    case 'DEPARTMENT_ADMIN':
      return <Badge variant="secondary" size={size}>Dept Head / Admin</Badge>;
    case 'HELPDESK_AGENT':
      return <Badge variant="warning" size={size}>Helpdesk Agent</Badge>;
    case 'FACULTY':
      return <Badge variant="default" size={size}>Faculty Member</Badge>;
    case 'STUDENT':
      return <Badge variant="success" size={size}>Student</Badge>;
  }
};
