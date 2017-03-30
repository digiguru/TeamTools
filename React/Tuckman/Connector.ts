import { connect } from "react-redux";
import { TuckmanStage } from "./Component";
import { ITuckmanModel } from "./Model";

const mapStateToProps = (state: ITuckmanModel): ITuckmanModel => {
    return state;
};

export const TuckmanConnector = connect(mapStateToProps)(TuckmanStage);
