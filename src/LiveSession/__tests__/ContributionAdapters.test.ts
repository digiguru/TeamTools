import { describe, expect, it } from "vitest";
import { comfortChoiceToContribution, tuckmanChoiceToContribution } from "../../Domain/ContributionAdapters";

describe("live-session contribution adapters", () => {
  it("maps a Comfort choice without leaking rendering state", () => {
    expect(comfortChoiceToContribution({
      User: { Username: "Ada" },
      Zone: "Stretch",
      Distance: 62
    })).toEqual({
      participantId: "Ada",
      value: { zone: "Stretch", distance: 62 }
    });
  });

  it("maps a Tuckman choice to the same generic contribution shape", () => {
    expect(tuckmanChoiceToContribution({
      User: { Username: "Grace" },
      Zone: "performing",
      Distance: 81
    })).toEqual({
      participantId: "Grace",
      value: { zone: "performing", distance: 81 }
    });
  });
});
