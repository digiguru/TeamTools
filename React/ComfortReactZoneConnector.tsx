import { connect } from "react-redux";
import { setOverFocus, setOffFocus, setActiveFocus, chooseZone } from "ComfortActions";
import {ChaosPickerState, ChaosPickerZoneState} from "ComfortReactModelState";
import {ReduxChaosArea} from "ComfortReduxZone";
import {Point} from "Point";
/*import {SVG} from "../Shared/SVG";*/

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
    onZoneMouseDown: (zone) => {
      dispatch(setActiveFocus(zone));
    },
    onZoneMouseUp: (user: string, zone: "Comfort" | "Chaos" | "Stretch", event: any) => {
      dispatch(setOffFocus(zone));
      console.log(user, zone, event, this);
      debugger;
      const coord = [event.clientX, event.clientY];
      const boundingBox = event.currentTarget.getBBox();
      const centerX = (boundingBox.width - boundingBox.x) / 2;
      const centerY = (boundingBox.height - boundingBox.y) / 2;
      const centerPoint = new Point(centerX, centerY);
      const distance = Point.distance(centerPoint, Point.fromCoords(coord));
      dispatch(chooseZone(user, zone, distance)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
    },
    onZoneOverFocus: (zone) => {
      dispatch(setOverFocus(zone));
    },
    onZoneOffFocus: (zone) => {
      dispatch(setOffFocus(zone));
    }
  };
};

export const ReduxZoneConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxChaosArea);

