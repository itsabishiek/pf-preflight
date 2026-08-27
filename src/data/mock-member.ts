import type { Member, TransferIssue } from "@/types/transfer";

export const mockMember: Member = {
  id: "member-priya-001",
  displayName: "Priya Sharma",
  maskedUan: "1000 2345 67••",
  employmentHistory: [
    { id: "emp-1", employerName: "Northstar Textiles Pvt. Ltd.", memberId: "MH/BAN/0001842/000/0419", startDate: "Apr 2019", endDate: "Jun 2022", isCurrent: false },
    { id: "emp-2", employerName: "Mosaic Retail Services Ltd.", memberId: "MH/BAN/0009127/000/1183", startDate: "Jul 2022", endDate: "Feb 2025", isCurrent: false },
    { id: "emp-3", employerName: "Cedar Works India Pvt. Ltd.", memberId: "MH/BAN/0017364/000/0062", startDate: "Mar 2025", isCurrent: true },
  ],
};

export const serviceHistoryIssue: TransferIssue = {
  id: "service-history-mismatch",
  title: "Potential service-history mismatch detected",
  summary: "One previous employment record may not align with the service information needed for this transfer.",
  whyItMatters: "This may prevent the transfer from being processed successfully until the underlying record is confirmed or corrected.",
  actions: [
    "Review the previous employment record.",
    "Confirm the information with the appropriate employer or EPFO channel.",
    "Correct the underlying record if required.",
    "Run the readiness check again.",
  ],
  isSimulated: true,
  affectedEmploymentId: "emp-2",
};

export const syntheticTransferState = {
  issueEmploymentId: "emp-2",
} as const;
