export type ReadinessStatus = "ready" | "warning" | "blocked";

export type ClaimStatus = "not_started" | "ready_to_submit" | "submitted";

export type TransferStatus =
  | "preflight"
  | "ready"
  | "review"
  | "submitted"
  | "processing"
  | "completed"
  | "problem";

export interface EmploymentRecord {
  id: string;
  employerName: string;
  memberId: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Member {
  id: string;
  displayName: string;
  maskedUan: string;
  employmentHistory: EmploymentRecord[];
}

export interface TransferIssue {
  id: string;
  title: string;
  summary: string;
  whyItMatters: string;
  actions: string[];
  isSimulated: boolean;
  affectedEmploymentId?: string;
}

export interface TransferReadinessCheck {
  id: string;
  label: string;
  status: ReadinessStatus;
  detail: string;
  issueId?: string;
}

export interface TransferJourney {
  member: Member;
  sourceEmploymentId: string;
  checks: TransferReadinessCheck[];
  issues: TransferIssue[];
  claimStatus: ClaimStatus;
}

export interface TransferSubmission {
  reference: string;
  submittedAt: string;
}

export interface TransferEvent {
  status: Extract<TransferStatus, "submitted" | "processing" | "completed" | "problem">;
  title: string;
  description: string;
  timestamp: string;
  actionRequired?: boolean;
}
