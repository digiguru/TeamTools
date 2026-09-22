import type { Contribution } from "../LiveSession/Model";
import type { ComfortUserChoiceState } from "../React/Comfort/Model";
import type { ITuckmanUserChoiceState } from "../React/Tuckman/Model";

export type ComfortContributionValue = {
  zone: ComfortUserChoiceState["Zone"];
  distance: number;
};

export type TuckmanContributionValue = {
  zone: ITuckmanUserChoiceState["Zone"];
  distance: number;
};

function participantIdFromUsername(username: string) {
  // TeamTools choices currently retain a username rather than the underlying
  // User.id. Keep this adapter explicit instead of pretending identity matches
  // Wheel's anonymous participant model.
  return username;
}

export function comfortChoiceToContribution(
  choice: ComfortUserChoiceState
): Contribution<ComfortContributionValue> {
  return {
    participantId: participantIdFromUsername(choice.User.Username),
    value: {
      zone: choice.Zone,
      distance: choice.Distance
    }
  };
}

export function tuckmanChoiceToContribution(
  choice: ITuckmanUserChoiceState
): Contribution<TuckmanContributionValue> {
  return {
    participantId: participantIdFromUsername(choice.User.Username),
    value: {
      zone: choice.Zone,
      distance: choice.Distance
    }
  };
}
