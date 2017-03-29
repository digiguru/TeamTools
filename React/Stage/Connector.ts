import { connect } from "react-redux";
import { Stage } from "./Component";
import { IStage } from "./Model";

export const StageConnector = connect(
  (state: IStage, b) : IStage => {
    console.log(state, b);
      debugger;
    return { Size: state.Size, children: state.children};
  },
  (a,b,c,d) : IStage => {
      console.log(a,b,c,d);
      debugger;
    return { Size: state.Size, children: state.children};
  }
)(Stage);
