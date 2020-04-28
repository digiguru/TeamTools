import { connect } from "react-redux";
import { TuckmanUserHistoryArea} from "./Component";
import { ITuckmanModel } from "../Tuckman/Model";
import { IUserChoiceState } from "./Model";

const mapStateToProps = (state: ITuckmanModel): IUserChoiceState => {
    return {
      Choices  : state.UserChoices,
      MaxWidth : state.Size.width,
      MaxHeight: state.Size.height
    };
};

export const TuckmanUserHistoryConnector = connect(
  mapStateToProps
)(TuckmanUserHistoryArea);

// UserListConnector
