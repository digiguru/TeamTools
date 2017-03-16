import { connect } from "react-redux";
import {ReduxUserHistory, ReduxUserHistoryArea} from "./Component";
import {ChaosPickerState, ChaosPickerUserChoiceState} from "../Comfort/Model";
import { fromJS } from "immutable";
import { Point } from "../Models/Point";

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
