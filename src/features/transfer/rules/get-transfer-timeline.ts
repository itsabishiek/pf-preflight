import type { TransferEvent, TransferStatus } from "@/types/transfer";

const submitted: TransferEvent = { status: "submitted", title: "Submitted", description: "Your transfer request was submitted in this prototype.", timestamp: "Demo time · 10:15 AM" };
const processing: TransferEvent = { status: "processing", title: "Processing", description: "The request is being processed in this simulated journey.", timestamp: "Demo time · 10:17 AM" };
const completed: TransferEvent = { status: "completed", title: "Completed", description: "The simulated transfer has completed successfully.", timestamp: "Demo time · 10:20 AM" };
const problem: TransferEvent = { status: "problem", title: "Needs attention", description: "A service-history issue was detected in this simulated journey.", timestamp: "Demo time · 10:18 AM", actionRequired: true };

export function getTransferTimeline(status: TransferStatus): TransferEvent[] {
  if (status === "completed") return [submitted, processing, completed];
  if (status === "problem") return [submitted, processing, problem];
  if (status === "processing") return [submitted, processing];
  return [submitted];
}
