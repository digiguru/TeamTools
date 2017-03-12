import { connect } from "react-redux";
import {ReduxUserHistory, ReduxUserHistoryArea} from "./ReactUserHistory";
import {ChaosPickerState, ChaosPickerUserChoiceState} from "./ComfortReactModelState";
import { fromJS } from "../3rdParty/immutable.min";

const mapStateToProps = (state: ChaosPickerState, ownProps: Array<ChaosPickerUserChoiceState>): Array<ChaosPickerUserChoiceState> => {
    return state.UserChoices;
};


const mapDispatchToProps = (dispatch) => {
  return {};
};

export const ReduxUserHistoryConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserHistoryArea);

// UserListConnector