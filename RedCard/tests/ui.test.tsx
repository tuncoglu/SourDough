// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LiveMatchList } from "@/components/live-match-list";
import { mockMatches } from "@/providers/mock-football";

afterEach(cleanup);
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
