import { connect } from "react-redux";
import { Stage } from "./Component";
import { IStageState, IStageProps } from "./Model";

export const StageConnector = connect(
  (state: IStageState, props: IStageProps) => {
    return { Size: state.Size, InnerBits: props.children};
  }
)(Stage);
