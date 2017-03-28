import { connect } from "react-redux";
import { Stage } from "./Component";
import { IStage } from "./Model";

export const StageConnector = connect(
  (state: IStage) : IStage => {
    debugger;
    console.log("MYSATE", state);
    return state;
  }
)(Stage);
