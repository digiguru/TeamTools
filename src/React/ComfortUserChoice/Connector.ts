import { connect } from "react-redux";
import { ReduxUserHistoryArea} from "./Component";
import { ComfortAppState } from "../Comfort/Model";
import { IUserChoiceState } from "./Model";

const mapStateToProps = (state: ComfortAppState): IUserChoiceState => {
    return {
      Choices    : state.UserChoices,
      CenterPoint: state.CenterPoint,
      MaxDistance: state.Size.shortest()
    };
};

export const ReduxUserHistoryConnector = connect(
  mapStateToProps
)(ReduxUserHistoryArea);

// UserListConnector
