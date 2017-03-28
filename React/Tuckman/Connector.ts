import { connect } from "react-redux";
import { TuckmanStage } from "./Component";
import { ITuckmanModel } from "./Model";
import { fromJS } from "../3rdParty/immutable.min";


const mapStateToProps = (state: ITuckmanModel): ITuckmanModel => {
    debugger;
    return state;
};


export const TuckmanConnector = connect(
  mapStateToProps
)(TuckmanStage);

// UserListConnector
