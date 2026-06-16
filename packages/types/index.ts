export enum EUserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum EPlatform {
  MESSENGER = "MESSENGER",
  ZALO = "ZALO",
  TIKTOK = "TIKTOK",
}

export enum ELeadStatus {
  NEW = "NEW",
  REPLIED = "REPLIED",
  WAITING = "WAITING",
  CONVERTED = "CONVERTED",
  IGNORED = "IGNORED",
}

export type TUser = {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  createdAt?: string;
  updatedAt?: string;
};

export type TLead = {
  id: string;
  customerName: string;
  message: string;
  platform: string;
  status: ELeadStatus;
  assignedToId: string | null;
  assignedTo: Omit<TUser, "createdAt" | "updatedAt"> | null;
  createdAt: string;
  updatedAt?: string;
};

export type TActivity = {
  id: string;
  leadId: string;
  userId: string | null;
  action: string;
  createdAt: string;
};

export type TDashboardSummary = {
  totalLeads: number;
  pendingLeads: number;
  convertedLeads: number;
};
