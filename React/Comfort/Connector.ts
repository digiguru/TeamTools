import { connect } from "react-redux";
import { ComfortStage } from "./Component";
import { ComfortUserChoiceState } from "./Model";
import { setStageVisibility } from "./Actions";

const mapStateToProps = (state: ComfortUserChoiceState): ComfortUserChoiceState => {
    return state;
};

const mapDispatchToProps = (dispatch): any => {
    return {
        Events: {
            onHide: (): void => {
                dispatch(setStageVisibility("hiding"));
            },
            onShow: (): void => {
                dispatch(setStageVisibility("appearing"));
            }
        }
    };
};
export const ComfortConnector = connect(
    mapStateToProps,
    mapDispatchToProps
)(ComfortStage);
