// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { LiveMatchList } from "@/components/live-match-list";
import { LiveMonitor } from "@/components/live-monitor";
import { mockMatches } from "@/providers/mock-football";
import type { FixtureListing, LiveSnapshot } from "@/domain/match";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe("match UI", () => {
  it("renders score, player, minute and straight red", () => {
    render(<LiveMatchList matches={[mockMatches()[0]]} redOnly />);
    expect(screen.getByRole("article", { name: "Arsenal versus Chelsea" })).toBeInTheDocument();
    expect(screen.getByText("William Saliba")).toBeInTheDocument();
    expect(screen.getByText("68′")).toBeInTheDocument();
    expect(screen.getByLabelText("Straight red")).toBeInTheDocument();
    expect(screen.getByLabelText("1 goals")).toBeInTheDocument();
  });
  it("shows second yellow and an obvious multiple-dismissal count", () => {
    render(<LiveMatchList matches={[mockMatches()[2]]} redOnly />);
    expect(screen.getByLabelText("Second yellow")).toBeInTheDocument();
    expect(screen.getByLabelText("2 dismissals")).toHaveTextContent("×2");
  });
  it("renders the calm empty state", () => {
    render(<LiveMatchList matches={[]} redOnly />);
    expect(screen.getByText("No red cards in live matches right now.")).toBeInTheDocument();
  });
  it("shows the actual half-time status even when a minute is supplied", () => {
    const match = { ...mockMatches()[0], status: "Half-time", minute: 45 };
    render(<LiveMatchList matches={[match]} redOnly />);
    expect(screen.getAllByText("Half-time")[0]).not.toHaveClass("sr-only");
  });
  it("handles unavailable score and player name", () => {
    const match = mockMatches()[0];
    render(<LiveMatchList matches={[{ ...match, home: { ...match.home, score: null }, dismissals: [{ ...match.dismissals[0], playerName: undefined }] }]} redOnly />);
    expect(screen.getByLabelText("Score unavailable")).toBeInTheDocument();
    expect(screen.getByText("Unknown player")).toBeInTheDocument();
  });
});

describe("fixture list filter", () => {
  const listing = (): FixtureListing => ({ source: "iddaa", country: "Turkey", available: true, updatedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 600_000).toISOString(), error: null, listedMatchIds: ["demo-5", "demo-6"], fixtureCount: 200 });
  function monitor(iddaa: FixtureListing = listing()) {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    const snapshot: LiveSnapshot = { matches: mockMatches(), provider: "test", lastSuccessfulPoll: new Date().toISOString(), lastAttemptAt: new Date().toISOString(), error: null, staleAfterMs: 1_290_000, pollIntervalMs: 1_200_000, nextPollAt: new Date(Date.now() + 1_200_000).toISOString(), iddaa };
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(snapshot)));
    render(<LiveMonitor />);
  }
  it("composes listings with the red-card view and includes listed women's matches", async () => {
    monitor();
    await screen.findByRole("article", { name: "Arsenal versus Chelsea" });
    fireEvent.change(screen.getByLabelText("Fixture list"), { target: { value: "iddaa" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("article", { name: "Arsenal Women versus Chelsea Women" })).toBeInTheDocument();
    expect(screen.getByLabelText("1 matches with 1 dismissals")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "All live" }));
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("article", { name: "Lyon versus Marseille" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Fixture list"), { target: { value: "all" } });
    expect(screen.getAllByRole("article")).toHaveLength(7);
  });
  it("distinguishes an expired catalogue from zero listed red cards, while keeping all matches", async () => {
    monitor({ ...listing(), expiresAt: new Date(Date.now() - 1000).toISOString() });
    await screen.findByRole("article", { name: "Arsenal versus Chelsea" });
    fireEvent.change(screen.getByLabelText("Fixture list"), { target: { value: "iddaa" } });
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText("Waiting for İddaa fixture listings.")).toBeInTheDocument();
    expect(screen.getByLabelText("Match counts unavailable")).toBeInTheDocument();
    expect(screen.queryByText("No red cards in matched İddaa fixtures right now.")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Fixture list"), { target: { value: "all" } });
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });
  it("describes a genuinely empty filtered view accurately", async () => {
    monitor({ ...listing(), listedMatchIds: [] });
    await screen.findByRole("article", { name: "Arsenal versus Chelsea" });
    fireEvent.change(screen.getByLabelText("Fixture list"), { target: { value: "iddaa" } });
    expect(screen.getByText("No red cards in matched İddaa fixtures right now.")).toBeInTheDocument();
    expect(screen.getByText(/Team-name differences/)).toBeInTheDocument();
  });
});
