import type { Member, TransferReadinessCheck, TransferJourney } from "@/types/transfer";
import { serviceHistoryIssue, syntheticTransferState } from "@/data/mock-member";

export function getTransferReadiness(member: Member, sourceEmploymentId: string, issueResolved = false): TransferJourney {
  const hasServiceHistoryIssue = sourceEmploymentId === syntheticTransferState.issueEmploymentId && !issueResolved;
  const checks: TransferReadinessCheck[] = [
    { id: "uan", label: "UAN status", status: "ready", detail: "Your synthetic UAN profile is active for this demo." },
    { id: "aadhaar", label: "Aadhaar / KYC status", status: "ready", detail: "Identity KYC is shown as verified in this synthetic profile." },
    { id: "bank", label: "Bank / KYC status", status: "ready", detail: "Bank details are shown as verified in this synthetic profile." },
    { id: "current-employment", label: "Current employment", status: "ready", detail: "A current employment record is available for the transfer destination." },
    { id: "date-of-exit", label: "Previous Date of Exit", status: "ready", detail: "A previous Date of Exit is available in this synthetic profile." },
    hasServiceHistoryIssue
      ? { id: "service-history", label: "Service / pension history", status: "blocked", detail: "A possible mismatch was found for this selected employment.", issueId: serviceHistoryIssue.id }
      : { id: "service-history", label: "Service / pension history", status: "ready", detail: issueResolved ? "The simulated service-history issue has been marked resolved for this demo." : "Service history appears consistent for this selected employment in the prototype." },
  ];

  return { member, sourceEmploymentId, checks, issues: hasServiceHistoryIssue ? [serviceHistoryIssue] : [], claimStatus: hasServiceHistoryIssue ? "not_started" : "ready_to_submit" };
}
