"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Landmark,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  mockMember,
  serviceHistoryIssue,
  syntheticTransferState,
} from "@/data/mock-member";
import { getTransferReadiness } from "@/features/transfer/rules/get-transfer-readiness";
import { getTransferTimeline } from "@/features/transfer/rules/get-transfer-timeline";
import { AssistedJourneyFinder } from "@/features/journeys/components/assisted-journey-finder";
import { journeyRegistry } from "@/features/journeys/journey-registry";
import type {
  EmploymentRecord,
  ReadinessStatus,
  TransferReadinessCheck,
  TransferStatus,
} from "@/types/transfer";

type Screen = "home" | "intent" | "source" | "checking" | TransferStatus;

const previousJobs = mockMember.employmentHistory.filter((record) => !record.isCurrent);
const destination = mockMember.employmentHistory.find((record) => record.isCurrent)!;
const reference = "PFP-DEMO-48291";
const preflightStages = [
  "Checking UAN",
  "Checking identity KYC",
  "Checking bank KYC",
  "Checking current employment",
  "Checking Date of Exit",
  "Checking service history",
];
const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200";
const quietButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 text-white">
        <Landmark size={18} aria-hidden />
      </span>
      <b className="text-lg tracking-tight">PF Preflight</b>
    </div>
  );
}

function Header({ back, reset }: { back: () => void; reset: () => void }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4">
        <button
          onClick={back}
          className="inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-slate-600 focus:outline-none focus:ring-4 focus:ring-teal-100"
        >
          <ArrowLeft size={17} aria-hidden />
          Back
        </button>
        <Logo />
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100"
        >
          <RotateCcw size={14} aria-hidden />
          Reset demo
        </button>
      </div>
    </header>
  );
}

function TransferContext({ source }: { source: EmploymentRecord }) {
  return (
    <section className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[.14em] text-teal-800">
        Your transfer
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">From</p>
          <p className="font-bold text-slate-950">{source.employerName}</p>
          <p className="text-sm text-slate-600">
            {source.startDate} to {source.endDate}
          </p>
        </div>
        <ArrowRight className="hidden text-teal-700 sm:block" aria-hidden />
        <ArrowDown className="text-teal-700 sm:hidden" aria-hidden />
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">To</p>
          <p className="font-bold text-slate-950">{destination.employerName}</p>
          <p className="text-sm text-slate-600">
            {destination.startDate} to Present
          </p>
        </div>
      </div>
    </section>
  );
}

function StatusIcon({ status }: { status: ReadinessStatus }) {
  const ready = status === "ready";
  const Icon = ready ? Check : CircleAlert;

  return (
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
        ready ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
      }`}
      aria-hidden
    >
      <Icon size={15} />
    </span>
  );
}

function DemoControls({ children }: { children: ReactNode }) {
  return (
    <section className="mt-7 border-t border-dashed border-slate-300 pt-4">
      <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">
        Prototype state control
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Demo simulation only. This is not live EPFO activity.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">{children}</div>
    </section>
  );
}

function IssuePanel({
  source,
  close,
  resolve,
}: {
  source: EmploymentRecord;
  close: () => void;
  resolve: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="issue-title"
      aria-describedby="issue-summary"
      className="fixed inset-0 z-20 grid place-items-end bg-slate-950/35 p-3 sm:place-items-center"
    >
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <CircleAlert className="mt-1 text-rose-800" aria-hidden />
          <button
            ref={closeButtonRef}
            onClick={close}
            aria-label="Close issue details"
            className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-teal-100"
          >
            <X aria-hidden />
          </button>
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-[.14em] text-rose-800">
          Potential issue
        </p>
        <h2 id="issue-title" className="mt-2 text-2xl font-bold tracking-tight">
          Potential service-history issue
        </h2>

        <section className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <h3 className="font-bold">Affected employment</h3>
          <p className="mt-2 font-semibold">{source.employerName}</p>
          <p className="text-sm text-slate-600">
            {source.startDate} to {source.endDate}
          </p>
        </section>

        <h3 className="mt-5 font-bold">What we found</h3>
        <p id="issue-summary" className="mt-1 text-sm leading-6 text-slate-600">
          A potential service-history mismatch was detected in this simulated
          record.
        </p>

        <h3 className="mt-4 font-bold">Why does it matter?</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          {serviceHistoryIssue.whyItMatters}
        </p>

        <section className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-4">
          <h3 className="font-bold">Start here</h3>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Review the previous employment record.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            After confirming the information, return here and run the readiness
            check again.
          </p>
        </section>

        <details className="mt-4 text-sm text-slate-600">
          <summary className="cursor-pointer font-semibold text-teal-800">
            What should I do after that?
          </summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5 leading-6">
            {serviceHistoryIssue.actions.slice(1).map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ol>
        </details>

        <details className="mt-4 text-sm text-slate-600">
          <summary className="cursor-pointer font-semibold text-teal-800">
            What if I submit anyway?
          </summary>
          <p className="mt-2 leading-6">
            An unresolved issue may lead to delay, additional action, or
            rejection. This prototype cannot predict a real outcome.
          </p>
        </details>

        <button onClick={resolve} className={`mt-6 w-full ${primaryButton}`}>
          Resolve and recheck
          <ArrowRight size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function EmploymentJourneyMap({
  source,
  resolved,
  selectSource,
}: {
  source: EmploymentRecord;
  resolved: boolean;
  selectSource: (id: string) => void;
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-bold">Employment journey</h2>
      <p className="mt-1 text-sm text-slate-600">
        Your PF transfer follows your employment history.
      </p>
      <div className="mt-5 space-y-3">
        {mockMember.employmentHistory.map((job, index) => {
          const selected = job.id === source.id;
          const affected = job.id === syntheticTransferState.issueEmploymentId && !resolved;
          const label = job.isCurrent
            ? "Current destination"
            : selected
              ? "Selected source"
              : index === 0
                ? "Past employment"
                : "Previous employment";

          return (
            <div key={job.id}>
              {index > 0 && (
                <div className="mb-3 ml-4 h-5 border-l border-slate-300" aria-hidden />
              )}
              <button
                onClick={() => !job.isCurrent && selectSource(job.id)}
                disabled={job.isCurrent}
                className={`w-full rounded-xl border p-4 text-left focus:outline-none focus:ring-4 focus:ring-teal-100 ${
                  selected
                    ? "border-teal-600 bg-teal-50"
                    : job.isCurrent
                      ? "border-slate-200 bg-slate-50"
                      : "border-slate-200 bg-white hover:border-teal-300"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">
                  {label}
                </span>
                <b className="mt-1 block text-sm text-slate-950">{job.employerName}</b>
                <span className="text-xs text-slate-600">
                  {job.startDate} to {job.endDate ?? "Present"}
                </span>
                {affected && (
                  <span className="mt-2 block text-xs font-semibold text-rose-800">
                    Needs attention: service history
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export function TransferFlow() {
  const [screen, setScreen] = useState<Screen>("home");
  const [sourceId, setSourceId] = useState<string>();
  const [resolved, setResolved] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const issueTriggerRef = useRef<HTMLElement | null>(null);

  const source = previousJobs.find((job) => job.id === sourceId);
  const journey = source ? getTransferReadiness(mockMember, source.id, resolved) : undefined;
  const completedChecks =
    journey?.checks.filter((check) => check.status === "ready").length ?? 0;
  const totalChecks = journey?.checks.length ?? 0;

  const openIssue = () => {
    issueTriggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIssueOpen(true);
  };

  const closeIssue = () => {
    setIssueOpen(false);
    window.setTimeout(() => issueTriggerRef.current?.focus(), 0);
  };

  const reset = () => {
    setScreen("home");
    setSourceId(undefined);
    setResolved(false);
    setIssueOpen(false);
    setStage(0);
  };

  useEffect(() => {
    if (screen !== "checking") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 0 : 260;

    if (stage < preflightStages.length) {
      const timer = window.setTimeout(() => setStage((value) => value + 1), delay);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(
      () => setScreen(resolved || !journey?.issues.length ? "ready" : "preflight"),
      delay,
    );
    return () => window.clearTimeout(timer);
  }, [screen, stage, resolved, journey?.issues.length]);

  const startCheck = () => {
    setStage(0);
    setScreen("checking");
  };

  const resolveIssue = () => {
    setIssueOpen(false);
    setResolved(true);
    setStage(0);
    setScreen("checking");
  };

  if (screen === "home") {
    return (
      <main className="min-h-screen bg-[#f7f8f5]">
        <header className="mx-auto flex max-w-6xl justify-between px-5 py-5">
          <Logo />
          <span className="text-sm text-slate-600">Independent prototype</span>
        </header>
        <section className="mx-auto max-w-5xl px-5 py-20">
          <p className="inline-flex gap-2 rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-900">
            <ShieldCheck size={16} aria-hidden />
            PF transfer preflight
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Transferring your PF?
            <br />
            <span className="text-teal-800">Check it before</span> you submit.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Understand your transfer, catch common issues early, and know what
            to do next.
          </p>
          <button onClick={() => setScreen("intent")} className={`mt-8 ${primaryButton}`}>
            Check my transfer
            <ArrowRight size={18} aria-hidden />
          </button>
          <p className="mt-5 flex gap-2 text-sm text-slate-500">
            <LockKeyhole size={15} aria-hidden />
            Fictional data only. Not an official EPFO service.
          </p>
        </section>
      </main>
    );
  }

  if (screen === "intent") {
    return (
      <main className="min-h-screen bg-[#f7f8f5]">
        <Header back={() => setScreen("home")} reset={reset} />
        <section className="mx-auto max-w-2xl px-5 py-12">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-teal-800">
            Start here
          </p>
          <h1 className="mt-2 text-3xl font-bold">What would you like to do?</h1>
          <div className="mt-7 space-y-3">
            <button
              onClick={() => setScreen("source")}
              className="flex w-full items-center justify-between rounded-2xl border-2 border-teal-700 bg-white p-5 text-left focus:outline-none focus:ring-4 focus:ring-teal-100"
            >
              <span>
                <b className="block">Transfer my PF</b>
                <span className="mt-1 block text-sm text-slate-600">
                  Check your records before you submit.
                </span>
              </span>
              <ArrowRight className="text-teal-700" aria-hidden />
            </button>
            {journeyRegistry
              .filter((journey) => !journey.implemented && journey.id !== "UNKNOWN")
              .map((journey) => (
              <div
                key={journey.id}
                className="rounded-2xl border border-slate-200 bg-white/60 p-5 text-slate-500"
              >
                <b className="block text-slate-700">{journey.title}</b>
                <span className="text-sm">Coming later</span>
              </div>
            ))}
          </div>
          <AssistedJourneyFinder onConfirmTransfer={() => setScreen("source")} />
        </section>
      </main>
    );
  }

  if (screen === "source") {
    return (
      <main className="min-h-screen bg-[#f7f8f5]">
        <Header back={() => setScreen("intent")} reset={reset} />
        <section className="mx-auto max-w-4xl px-5 py-10">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-teal-800">
            PF transfer
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Which old PF record are you moving from?
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Choose the previous employment record you want to transfer into your
            current employment.
          </p>

          <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_.9fr]">
            <section className="space-y-3">
              <h2 className="text-base font-bold">Previous employment</h2>
              {previousJobs.map((job) => {
                const affected = job.id === syntheticTransferState.issueEmploymentId;
                const selected = job.id === sourceId;

                return (
                  <button
                    key={job.id}
                    onClick={() => setSourceId(job.id)}
                    className={`w-full rounded-2xl border-2 p-5 text-left transition-colors focus:outline-none focus:ring-4 focus:ring-teal-100 ${
                      selected
                        ? "border-teal-700 bg-teal-50"
                        : "border-slate-200 bg-white hover:border-teal-300"
                    }`}
                    aria-pressed={selected}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-bold text-slate-950">{job.employerName}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {job.startDate} to {job.endDate}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          affected ? "text-rose-800" : "text-emerald-800"
                        }`}
                      >
                        {affected ? "Needs attention" : "Common checks ready"}
                      </span>
                    </div>
                    {affected && (
                      <p className="mt-3 text-sm text-rose-800">
                        Potential issue: service history needs review.
                      </p>
                    )}
                  </button>
                );
              })}
            </section>

            <section>
              <h2 className="text-base font-bold">Current destination</h2>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="font-bold text-slate-950">{destination.employerName}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {destination.startDate} to Present
                </p>
                <p className="mt-3 text-sm text-teal-800">Current employment</p>
              </div>

              {source && (
                <div className="mt-5">
                  <TransferContext source={source} />
                  <p className="mt-4 font-semibold text-slate-800">
                    We will check this transfer path before the demo submission.
                  </p>
                  <button onClick={startCheck} className={`mt-5 w-full ${primaryButton}`}>
                    Check this transfer
                    <ArrowRight size={18} aria-hidden />
                  </button>
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    );
  }

  if (!source || !journey) return null;

  if (screen === "checking") {
    return (
      <main className="min-h-screen bg-[#f7f8f5]">
        <Header back={() => setScreen("source")} reset={reset} />
        <section className="mx-auto max-w-2xl px-5 py-12">
          <TransferContext source={source} />
          <h1 className="mt-8 text-3xl font-bold">
            {resolved ? "Updating your preflight" : "We are checking this transfer for you"}
          </h1>
          <p className="mt-2 text-slate-600">
            {resolved
              ? "Rechecking your transfer with the simulated update."
              : "Reviewing common readiness checks for this transfer path."}
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            {preflightStages.map((label, index) => (
              <div
                key={label}
                className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0"
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full ${
                    index < stage
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                  aria-hidden
                >
                  {index < stage ? <Check size={15} /> : <Clock3 size={14} />}
                </span>
                <span className="font-medium">
                  {label}
                  {index === preflightStages.length - 1 && !resolved && index < stage
                    ? " - needs attention"
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (screen === "preflight" || screen === "ready") {
    const hasIssue = journey.issues.length > 0;

    return (
      <main className="min-h-screen bg-[#f7f8f5]">
        <Header back={() => setScreen("source")} reset={reset} />
        <section className="mx-auto max-w-5xl px-5 py-10">
          <TransferContext source={source} />
          <div className="mt-7 grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
            <EmploymentJourneyMap
              source={source}
              resolved={resolved}
              selectSource={(id) => {
                setSourceId(id);
                setResolved(false);
                setStage(0);
              }}
            />

            <div>
              <div
                className={`rounded-2xl border p-5 ${
                  hasIssue
                    ? "border-rose-200 bg-rose-50"
                    : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <h1 className="text-2xl font-bold">
                  {hasIssue
                    ? "We found 1 thing to check before you submit."
                    : "You're ready to continue"}
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {hasIssue
                    ? "A potential issue in this transfer path may need attention before you continue."
                    : "All common readiness checks in this prototype are complete."}
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white">
                {journey.checks.map((check) => (
                  <CheckRow key={check.id} check={check} onIssue={openIssue} />
                ))}
              </div>

              {hasIssue ? (
                <button onClick={openIssue} className={`mt-5 w-full sm:w-auto ${primaryButton}`}>
                  Review issue
                  <ArrowRight size={18} aria-hidden />
                </button>
              ) : (
                <section className="mt-5">
                  <p className="text-sm font-semibold text-emerald-800">
                    {completedChecks} / {totalChecks} common checks complete
                  </p>
                  <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    {journey.checks.map((check) => (
                      <li key={check.id} className="flex items-center gap-2">
                        <Check size={16} className="text-emerald-700" aria-hidden />
                        {check.label}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setScreen("review")}
                    className={`mt-5 w-full sm:w-auto ${primaryButton}`}
                  >
                    Ready to continue
                    <ArrowRight size={18} aria-hidden />
                  </button>
                </section>
              )}
            </div>
          </div>
        </section>
        {issueOpen && (
          <IssuePanel source={source} close={closeIssue} resolve={resolveIssue} />
        )}
      </main>
    );
  }

  if (screen === "review") {
    return (
      <main className="min-h-screen bg-[#f7f8f5]">
        <Header back={() => setScreen("ready")} reset={reset} />
        <section className="mx-auto max-w-3xl px-5 py-10">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-teal-800">
            Review transfer
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Ready to submit in this prototype
          </h1>
          <div className="mt-6 space-y-4">
            <TransferContext source={source} />
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h2 className="font-bold">Readiness</h2>
              <p className="mt-2 text-sm text-slate-700">
                Common checks complete for UAN, identity KYC, bank KYC,
                employment, Date of Exit, and service history.
              </p>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-bold">Important</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This prototype checks common readiness conditions. Government-side
                validations may involve additional information.
              </p>
            </section>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button onClick={() => setScreen("ready")} className={quietButton}>
              Go back
            </button>
            <button onClick={() => setScreen("submitted")} className={primaryButton}>
              Submit transfer
              <ArrowRight size={18} aria-hidden />
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "problem") {
    return (
      <main className="min-h-screen bg-[#f7f8f5]">
        <Header back={() => setScreen("processing")} reset={reset} />
        <section className="mx-auto max-w-3xl px-5 py-10">
          <TransferContext source={source} />
          <p className="mt-7 text-sm font-bold uppercase tracking-[.14em] text-rose-800">
            Needs attention
          </p>
          <h1 className="mt-2 text-3xl font-bold">Your transfer needs attention</h1>
          <section className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <h2 className="font-bold">What happened?</h2>
            <p className="mt-1 text-sm text-slate-700">
              A transfer issue was detected in this simulated journey.
            </p>
            <h2 className="mt-4 font-bold">Why does it matter?</h2>
            <p className="mt-1 text-sm leading-6 text-slate-700">
              {serviceHistoryIssue.whyItMatters}
            </p>
            <h2 className="mt-4 font-bold">What should you do first?</h2>
            <p className="mt-1 text-sm text-slate-700">
              Start by reviewing the previous employment record. Then resolve the
              simulated issue and run preflight again.
            </p>
          </section>
          <button
            onClick={() => {
              setResolved(false);
              setScreen("preflight");
              openIssue();
            }}
            className={`mt-6 w-full sm:w-auto ${primaryButton}`}
          >
            Fix issue
            <ArrowRight size={18} aria-hidden />
          </button>
        </section>
      </main>
    );
  }

  return (
    <TrackingScreen
      screen={screen}
      source={source}
      setScreen={setScreen}
      reset={reset}
    />
  );
}

function TrackingScreen({
  screen,
  source,
  setScreen,
  reset,
}: {
  screen: Extract<TransferStatus, "submitted" | "processing" | "completed">;
  source: EmploymentRecord;
  setScreen: (screen: Screen) => void;
  reset: () => void;
}) {
  const events = getTransferTimeline(screen);
  const activeTitle = useMemo(() => {
    if (screen === "submitted") return "Your transfer has been submitted";
    if (screen === "processing") return "Your transfer is being processed";
    return "Transfer journey complete";
  }, [screen]);
  const nextText =
    screen === "submitted"
      ? "The next step in this simulated journey is processing."
      : screen === "processing"
        ? "The next step in this simulated journey is completion."
        : "There are no more steps in this demo journey.";

  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <Header back={() => setScreen("review")} reset={reset} />
      <section className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-sm font-bold uppercase tracking-[.14em] text-teal-800">
          Simulated transfer tracking
        </p>
        <h1 className="mt-2 text-3xl font-bold">{activeTitle}</h1>
        <div className="mt-5">
          <TransferContext source={source} />
        </div>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <InfoBlock title="What is happening?">
            {screen === "completed"
              ? "The simulated transfer has completed successfully."
              : "Your simulated transfer is progressing in the demo."}
          </InfoBlock>
          <InfoBlock title="Do I need to do anything?">
            {screen === "completed"
              ? "No action is needed in this demo."
              : "No action is needed right now."}
          </InfoBlock>
          <InfoBlock title="Next">{nextText}</InfoBlock>
        </section>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">
            Demo transfer reference
          </p>
          <p className="mt-2 font-mono font-bold">{reference}</p>
          <p className="mt-2 text-sm text-slate-600">
            This is a demonstration reference, not an EPFO claim number.
          </p>
        </div>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold">Your transfer journey</h2>
          <ol className="mt-4 space-y-4">
            <TimelineItem title="Preflight" detail="Ready" state="done" />
            {(["submitted", "processing", "completed"] as const).map((status) => {
              const event = events.find((item) => item.status === status);
              const isCurrent = screen === status;
              const reached = Boolean(event);

              return (
                <TimelineItem
                  key={status}
                  title={status[0].toUpperCase() + status.slice(1)}
                  detail={
                    isCurrent
                      ? status === "completed"
                        ? "Journey complete"
                        : status === "submitted"
                          ? "Request submitted"
                          : "Current step"
                      : reached
                        ? event?.description ?? ""
                        : "Not reached yet"
                  }
                  state={isCurrent ? "current" : reached ? "done" : "future"}
                />
              );
            })}
          </ol>
        </section>

        {screen !== "completed" && (
          <DemoControls>
            {screen === "submitted" ? (
              <button
                onClick={() => setScreen("processing")}
                className="rounded-xl border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100"
              >
                Simulate processing
              </button>
            ) : (
              <>
                <button
                  onClick={() => setScreen("completed")}
                  className="rounded-xl border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100"
                >
                  Simulate completion
                </button>
                {source.id === syntheticTransferState.issueEmploymentId && (
                  <button
                    onClick={() => setScreen("problem")}
                    className="rounded-xl border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-100"
                  >
                    Simulate issue
                  </button>
                )}
              </>
            )}
          </DemoControls>
        )}
      </section>
    </main>
  );
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{children}</p>
    </div>
  );
}

function TimelineItem({
  title,
  detail,
  state,
}: {
  title: string;
  detail: string;
  state: "done" | "current" | "future";
}) {
  const icon =
    state === "done" ? (
      <Check size={13} aria-hidden />
    ) : state === "current" ? (
      <span className="h-2 w-2 rounded-full bg-white" aria-hidden />
    ) : null;

  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs ${
          state === "current"
            ? "bg-teal-700 text-white"
            : state === "done"
              ? "bg-emerald-100 text-emerald-800"
              : "border border-slate-300 bg-white text-slate-400"
        }`}
        aria-hidden
      >
        {icon}
      </span>
      <span>
        <b>{title}</b>
        <span className="block text-sm text-slate-600">{detail}</span>
      </span>
    </li>
  );
}

function CheckRow({
  check,
  onIssue,
}: {
  check: TransferReadinessCheck;
  onIssue: () => void;
}) {
  const [open, setOpen] = useState(false);
  const blocked = check.status === "blocked";
  const detailsId = `check-details-${check.id}`;

  return (
    <div className="border-b border-slate-100 p-4 last:border-0">
      <div className="flex gap-3">
        <StatusIcon status={check.status} />
        <div className="flex-1">
          <b>{check.label}</b>
          <p className="mt-1 text-sm text-slate-600">{check.detail}</p>
          {blocked && (
            <button
              onClick={onIssue}
              className="mt-2 rounded text-sm font-semibold text-teal-800 underline focus:outline-none focus:ring-4 focus:ring-teal-100"
            >
              Why?
            </button>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={`${open ? "Hide" : "Show"} details for ${check.label}`}
          className="h-8 rounded-lg px-1 text-slate-600 focus:outline-none focus:ring-4 focus:ring-teal-100"
        >
          <ChevronDown className={open ? "rotate-180" : ""} size={18} aria-hidden />
        </button>
      </div>
      {open && (
        <div
          id={detailsId}
          className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600"
        >
          <b>What does this check mean?</b>
          <p>
            This checks whether the relevant information appears consistent for
            the selected simulated transfer.
          </p>
          {blocked && (
            <p className="mt-2">
              <b>Do I need to act?</b> Yes, review the affected employment record
              before continuing.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
