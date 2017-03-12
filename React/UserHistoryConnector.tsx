import { connect } from "react-redux";
import {ReduxUserHistory, ReduxUserHistoryArea} from "./ReactUserHistory";
import {ChaosPickerState, ChaosPickerUserChoiceState} from "./ComfortReactModelState";
import { fromJS } from "../3rdParty/immutable.min";

export interface IUserChoiceState {
  Choices: Array<ChaosPickerUserChoiceState>;
}

const mapStateToProps = (state: ChaosPickerState, ownProps: IUserChoiceState): IUserChoiceState => {
    return {Choices: state.UserChoices};
};


const mapDispatchToProps = (dispatch) => {
  return {};
};

export const ReduxUserHistoryConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserHistoryArea);

// UserListConnector
