import { connect } from "react-redux";
import { Stage } from "./Component";
import { IStageState, IStageProps } from "./Model";

export const StageConnector = connect(
  (state: IStageState, props: IStageProps) => {
    debugger;
    console.log("STAGECONN", state, props);
    return { Size: state.Size, InnerBits: props.children};
  }
)(Stage);
