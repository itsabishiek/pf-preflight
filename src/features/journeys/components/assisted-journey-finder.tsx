"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { getJourneyDefinition } from "@/features/journeys/journey-registry";
import type { JourneyIntentResult } from "@/types/journey";

type FinderState = "idle" | "loading" | "suggestion" | "unknown" | "fallback" | "unsupported";

interface ApiSuccessResponse {
  success: true;
  result: JourneyIntentResult;
}

function isApiSuccessResponse(value: unknown): value is ApiSuccessResponse {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ApiSuccessResponse>;
  return candidate.success === true && typeof candidate.result?.intent === "string" && typeof candidate.result.reason === "string";
}

export function AssistedJourneyFinder({ onConfirmTransfer }: { onConfirmTransfer: () => void }) {
  const [description, setDescription] = useState("");
  const [state, setState] = useState<FinderState>("idle");
  const [result, setResult] = useState<JourneyIntentResult>();

  const reset = () => {
    setState("idle");
    setResult(undefined);
  };

  const findJourney = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!description.trim()) return;

    setState("loading");
    setResult(undefined);
    try {
      const response = await fetch("/api/journey-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok || !isApiSuccessResponse(data)) {
        setState("fallback");
        return;
      }

      setResult(data.result);
      setState(data.result.intent === "UNKNOWN" ? "unknown" : "suggestion");
    } catch {
      setState("fallback");
    }
  };

  const confirmSuggestion = () => {
    if (!result) return;
    if (result.intent === "TRANSFER_PF") {
      onConfirmTransfer();
      return;
    }
    setState("unsupported");
  };

  const suggestion = result ? getJourneyDefinition(result.intent) : undefined;

  return (
    <section className="mt-9 border-t border-dashed border-slate-300 pt-7" aria-labelledby="assisted-finder-title">
      <p className="text-sm font-bold uppercase tracking-[.14em] text-slate-500">Need help choosing?</p>
      <h2 id="assisted-finder-title" className="mt-2 text-xl font-bold">Not sure where to start?</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
        Tell us what happened in your own words. We will help you find the right starting point.
      </p>

      {(state === "idle" || state === "loading") && (
        <form onSubmit={findJourney} className="mt-4">
          <label htmlFor="journey-description" className="sr-only">Describe what happened</label>
          <textarea
            id="journey-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={600}
            rows={3}
            placeholder="I changed jobs and my PF has not transferred..."
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
            disabled={state === "loading"}
            required
          />
          <button
            type="submit"
            disabled={state === "loading" || !description.trim()}
            className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-teal-700 px-5 py-3 text-sm font-semibold text-teal-800 hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === "loading" ? <><LoaderCircle className="animate-spin motion-reduce:animate-none" size={17} aria-hidden /> Understanding what happened...</> : <><span>Help me find the right journey</span><ArrowRight size={17} aria-hidden /></>}
          </button>
          {state === "loading" && <p className="mt-3 text-sm text-slate-600" role="status">Finding the closest starting point...</p>}
        </form>
      )}

      {state === "suggestion" && suggestion && (
        <section className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-5" aria-live="polite">
          <p className="text-sm font-semibold text-teal-800">We think you need:</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">{suggestion.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">{result?.reason}</p>
          <p className="mt-3 text-xs text-slate-600">
            Suggested starting point based on what you described.
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-800">Is this what you need?</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button onClick={confirmSuggestion} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">Yes, continue<ArrowRight size={18} aria-hidden /></button>
            <button onClick={reset} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100">Choose another journey</button>
          </div>
        </section>
      )}

      {state === "unsupported" && suggestion && (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5" aria-live="polite">
          <h3 className="font-bold">{suggestion.title} looks like the right starting point.</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">This prototype does not support this journey yet.</p>
          <button onClick={reset} className="mt-4 text-sm font-semibold text-teal-800 underline focus:outline-none focus:ring-4 focus:ring-teal-100">Choose another journey</button>
        </section>
      )}

      {state === "unknown" && (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5" aria-live="polite">
          <h3 className="font-bold">We are not sure yet.</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Try describing what happened in a little more detail, or choose a journey above.</p>
          <p className="mt-3 text-sm text-slate-600">For example: &quot;I changed jobs and my PF has not transferred.&quot;</p>
          <button onClick={reset} className="mt-4 text-sm font-semibold text-teal-800 underline focus:outline-none focus:ring-4 focus:ring-teal-100">Try again</button>
        </section>
      )}

      {state === "fallback" && (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5" aria-live="polite">
          <h3 className="font-bold">We could not identify the journey automatically.</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Choose the option above that best matches what you need.</p>
          <button onClick={reset} className="mt-4 text-sm font-semibold text-teal-800 underline focus:outline-none focus:ring-4 focus:ring-teal-100">Try again</button>
        </section>
      )}

      <p className="mt-4 text-xs text-slate-500">Your description is used only to suggest a starting point and is not saved.</p>
    </section>
  );
}
