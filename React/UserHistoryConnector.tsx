import { connect } from "react-redux";
import {ReduxUserHistory, ReduxUserHistoryArea} from "./ReactUserHistory";
import {ChaosPickerState, ChaosPickerUserChoiceState} from "./ComfortReactModelState";
import { fromJS } from "../3rdParty/immutable.min";
import { Point } from "./Point";

export interface IUserChoiceState {
  Choices: Array<ChaosPickerUserChoiceState>;
  CenterPoint: Point;
}

const mapStateToProps = (state: ChaosPickerState, ownProps: IUserChoiceState): IUserChoiceState => {
    return {
      Choices: state.UserChoices,
      CenterPoint: state.CenterPoint
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
