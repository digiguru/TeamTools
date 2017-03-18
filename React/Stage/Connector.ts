import { connect } from "react-redux";
import { Stage } from "./Component";

export const StageConnector = connect(
  (state) => {
    return state;
  }
)(Stage);