import { connect } from "react-redux";
import { TuckmanStage } from "./Component";
import { ITuckmanModel } from "./Model";

const mapStateToProps = (state: ITuckmanModel): ITuckmanModel => {
    debugger;
    console.log("HELLO ITcukman", state);
    return state;
};/*
const mapDispatchToProps = (dispatch) => {
  return {};
};*/

export const TuckmanConnector = connect(mapStateToProps)(TuckmanStage);

// UserListConnector
