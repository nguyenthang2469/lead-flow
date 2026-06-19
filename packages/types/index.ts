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
  leads?: TLead[] | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TLead = {
  id: string;
  customerName: string;
  message: string;
  platform: EPlatform;
  status: ELeadStatus;
  assignedTo: string | null;
  assignee?: Omit<TUser, "createdAt" | "updatedAt"> | null;
  activities?: TActivity | null;
  createdAt: string;
  updatedAt?: string;
};

export type TActivity = {
  id: string;
  leadId: string;
  lead: TLead;
  action: string;
  createdAt: string;
};

export type TDashboardSummary = {
  totalLeads: number;
  pendingLeads: number;
  convertedLeads: number;
};

export type TQueryFilter<T> = {
  page?: number;
  limit?: number;
  search?: string;
} & T;

export type TPaginationResponse<T> = {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};
