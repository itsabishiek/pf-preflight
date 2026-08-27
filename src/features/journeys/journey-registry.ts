import type { JourneyDefinition, JourneyIntent } from "@/types/journey";

export const journeyRegistry: readonly JourneyDefinition[] = [
  { id: "TRANSFER_PF", title: "Transfer my PF", shortDescription: "Check your records before you submit.", implemented: true },
  { id: "WITHDRAW_PF", title: "Withdraw my PF", shortDescription: "Coming later in this prototype.", implemented: false },
  { id: "TRACK_REQUEST", title: "Track a request", shortDescription: "Coming later in this prototype.", implemented: false },
  { id: "FIX_ISSUE", title: "Fix an EPFO issue", shortDescription: "Coming later in this prototype.", implemented: false },
  { id: "UNKNOWN", title: "Unknown journey", shortDescription: "Choose a journey manually when the situation is unclear.", implemented: false },
];

export function getJourneyDefinition(intent: JourneyIntent) {
  return journeyRegistry.find((journey) => journey.id === intent);
}
