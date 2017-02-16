import { connect } from "react-redux";
import { setFocus, setUnfocus } from "ComfortActions";
import {ChaosPickerState, ChaosPickerZoneState} from "ComfortReactModelState";
import {ReduxChaosArea} from "ComfortReduxZone";

const mapStateToProps = (state: ChaosPickerState, ownProps: ChaosPickerZoneState) => {
    if (ownProps.Name === "Comfort") {
      return state.Zones.Comfort;
    } else if (ownProps.Name === "Chaos") {
      return state.Zones.Chaos;
    } else {
      return state.Zones.Stretch;
    }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onZoneFocus: (zone) => {
      dispatch(setFocus(zone));
    },
    onZoneUnfocus: (zone) => {
      dispatch(setUnfocus(zone));
    }
  };
};

export const ReduxZoneConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxChaosArea);

