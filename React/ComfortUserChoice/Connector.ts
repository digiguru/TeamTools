import { connect } from "react-redux";
import { ReduxUserHistoryArea} from "./Component";
import { ComfortAppState } from "../Comfort/Model";
import { IUserChoiceState } from "./Model";

const mapStateToProps = (state: ComfortAppState, ownProps: IUserChoiceState): IUserChoiceState => {
    return {
      Choices    : state.UserChoices,
      CenterPoint: state.CenterPoint,
      MaxDistance: state.Size.shortest()
    };
};


const mapDispatchToProps = (dispatch) => {
  return {};
};

export const ReduxUserHistoryConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserHistoryArea);

// UserListConnector
