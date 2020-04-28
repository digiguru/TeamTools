import { connect } from "react-redux";
import { TuckmanStage } from "./Component";
import { ITuckmanModel } from "./Model";
import { IHidableEvents } from "../Stage/Model";
import { setStageVisibility } from "./Actions";

const mapStateToProps = (state: ITuckmanModel): ITuckmanModel => {
    return state;
};

const mapDispatchToProps = (dispatch): IHidableEvents => {
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
export const TuckmanConnector = connect(
    mapStateToProps,
    mapDispatchToProps
)(TuckmanStage);
