import type { JourneyIntent } from "@/types/journey";

export const journeyIntentExamples: ReadonlyArray<{ description: string; expectedIntent: JourneyIntent }> = [
  { description: "I changed jobs and my old PF has not transferred.", expectedIntent: "TRANSFER_PF" },
  { description: "I want to withdraw money from my PF.", expectedIntent: "WITHDRAW_PF" },
  { description: "I submitted my request last week. What is the status?", expectedIntent: "TRACK_REQUEST" },
  { description: "My PF claim got rejected and I do not know what to do.", expectedIntent: "FIX_ISSUE" },
  { description: "EPFO is confusing.", expectedIntent: "UNKNOWN" },
  { description: "What is UAN?", expectedIntent: "UNKNOWN" },
];
