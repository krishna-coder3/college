enum UserRole {
  superAdmin,
  universityOwner,
  admin,
  departmentAdmin,
  helpdeskAgent,
  faculty,
  student,
}

extension UserRoleExtension on UserRole {
  String get displayTitle {
    switch (this) {
      case UserRole.superAdmin:
        return 'Platform Super Admin';
      case UserRole.universityOwner:
        return 'University Owner / Chancellor';
      case UserRole.admin:
        return 'University Administrator';
      case UserRole.departmentAdmin:
        return 'Department Head';
      case UserRole.helpdeskAgent:
        return 'Helpdesk Support Agent';
      case UserRole.faculty:
        return 'Faculty Member';
      case UserRole.student:
        return 'Student';
    }
  }

  bool canManageUniversity() {
    return this == UserRole.superAdmin || this == UserRole.universityOwner || this == UserRole.admin;
  }

  bool canResolveTickets() {
    return this == UserRole.superAdmin ||
        this == UserRole.universityOwner ||
        this == UserRole.admin ||
        this == UserRole.departmentAdmin ||
        this == UserRole.helpdeskAgent;
  }

  bool canViewInternalNotes() {
    return this != UserRole.student && this != UserRole.faculty;
  }
}
