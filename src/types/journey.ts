export const journeyIntentIds = [
  "TRANSFER_PF",
  "WITHDRAW_PF",
  "TRACK_REQUEST",
  "FIX_ISSUE",
  "UNKNOWN",
] as const;

export type JourneyIntent = (typeof journeyIntentIds)[number];

export interface JourneyDefinition {
  id: JourneyIntent;
  title: string;
  shortDescription: string;
  implemented: boolean;
}

export interface JourneyIntentResult {
  intent: JourneyIntent;
  reason: string;
}
